import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { rateLimitPublic, isDeveloper } from "@/lib/api/auth";
import {
  json,
  apiError,
  handleSupabaseError,
  paginate,
  parsePaginationParams,
} from "@/lib/api/response";
import { getContestPhase, getContestMode } from "@/lib/contest";

export const runtime = "nodejs";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function descriptionToMathJaxHtml(description: string) {
  const normalized = description.replace(/\r\n?/g, "\n").trim();

  if (!normalized) return "";

  return normalized
    .split(/\n{2,}/)
    .map(
      (paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`,
    )
    .join("");
}

export async function GET(request: Request) {
  const rateLimitError = rateLimitPublic(request);
  if (rateLimitError) return rateLimitError;

  const { limit, pointer } = parsePaginationParams(request.url, 2);

  const supabase = await createSupabaseServerClient();
  const developer = await isDeveloper(supabase);

  let query = supabase
    .from("contests")
    .select("*")
    .order("start_date", { ascending: false })
    .lte("start_date", (pointer ? new Date(pointer) : new Date()).toISOString())
    .limit(limit + 1);

  if (!developer) {
    query = query.eq("status", "public");
  }

  const { data, error } = await query;

  const err = handleSupabaseError(error, "contests");
  if (err) return err;

  const serverNow = new Date();
  const enrichedData = (data ?? []).map((contest) => ({
    ...contest,
    mode: getContestMode(contest),
    contest_phase: getContestPhase(contest, serverNow),
    server_time: serverNow.toISOString(),
  }));

  return json(paginate(enrichedData, limit, "start_date"));
}

export async function POST(request: Request) {
  // const authError = protectApiEndpoint(request);
  // if (authError) return authError;

  const supabase = createSupabaseServiceClient();
  const body = await request.json();
  const problems = Array.isArray(body.problems) ? body.problems : [];
  const contestPayload = {
    name: body.name,
    description: body.description ?? "",
    difficulty: Number(body.difficulty),
    start_date: body.start_date,
    end_date: body.end_date,
    length_in_minutes: Number(body.length_in_minutes),
    problem_count: problems.length,
    mode: body.mode === "live" ? "live" : "practice",
    status: body.status === "private" ? "private" : "public",
  };

  if (!contestPayload.name) return apiError("Contest name is required", 400);
  if (!Number.isFinite(contestPayload.difficulty)) {
    return apiError("Contest difficulty must be a number", 400);
  }
  if (!contestPayload.start_date || !contestPayload.end_date) {
    return apiError("Contest start and end dates are required", 400);
  }

  const { data: contest, error: contestError } = await supabase
    .from("contests")
    .insert([contestPayload])
    .select()
    .single();

  if (contestError) return apiError(contestError.message, 500);

  if (problems.length === 0) {
    await supabase.from("contests").delete().eq("id", contest.id);
    return apiError("Contest must include at least one problem", 400);
  }

  const problemPayloads = problems.map(
    (problem: Record<string, unknown>, index: number) => {
      const name = typeof problem.name === "string" ? problem.name : null;
      const descriptionLatex =
        typeof problem.description_latex === "string"
          ? problem.description_latex
          : "";
      const descriptionHtml = descriptionToMathJaxHtml(descriptionLatex);

      return {
        id: crypto.randomUUID(),
        contest_id: contest.id,
        name,
        full_name: name,
        points: problem?.points ?? null,
        difficulty: problem?.difficulty ?? null,
        description_latex: descriptionLatex,
        description_html: descriptionHtml,
        answer: typeof problem.answer === "string" ? problem.answer : null,
        official_editorial:
          typeof problem.editorial === "string" ? problem.editorial : "",
        index_in_contest: index,
      };
    },
  );

  const { data: insertedProblems, error: problemsError } = await supabase
    .from("problems")
    .insert(problemPayloads)
    .select();

  if (problemsError) {
    await supabase.from("contests").delete().eq("id", contest.id);
    return apiError(problemsError.message, 500);
  }

  return json({ contest, problems: insertedProblems ?? [] }, 201);
}
