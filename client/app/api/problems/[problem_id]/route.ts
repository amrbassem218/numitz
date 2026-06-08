import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { protectApiEndpoint, rateLimitPublic, isDeveloper } from "@/lib/api/auth";
import { json, apiError, handleSupabaseError } from "@/lib/api/response";
import { requireContestAccess } from "@/lib/api/contestAccess";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ problem_id: string }> },
) {
  const rateLimitError = rateLimitPublic(request);
  if (rateLimitError) return rateLimitError;

  const authSupabase = await createSupabaseServerClient();
  const supabase = createSupabaseServiceClient();
  const problemId = (await params).problem_id;
  const {
    data: { user },
  } = await authSupabase.auth.getUser();

  const { data, error } = await supabase
    .from("problems")
    .select(
      "id, name, contest_id, full_name, tags, submission_count, correct_submission_count, points, difficulty, likes_count, created_at, description_latex, description_html, index_in_contest, contests(id, mode, start_date, end_date)",
    )
    .eq("id", problemId)
    .single();

  const err = handleSupabaseError(error, "problem");
  if (err) return err;
  if (!data) return apiError("Problem not found", 404);

  const contest = Array.isArray(data.contests) ? data.contests[0] : data.contests;
  if (contest) {
    const accessError = await requireContestAccess({
      supabase,
      contest,
      userId: user?.id,
    });
    if (accessError) return accessError;
  }

  return json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ problem_id: string }> },
) {
  const authError = protectApiEndpoint(request);
  if (authError) return authError;

  const supabase = createSupabaseServiceClient();
  const authSupabase = await createSupabaseServerClient();
  const problemId = (await params).problem_id;

  const {
    data: { user },
  } = await authSupabase.auth.getUser();
  if (!user) return apiError("Unauthorized", 401);

  const { data: problem, error: problemError } = await supabase
    .from("problems")
    .select("id, contest_id")
    .eq("id", problemId)
    .single();

  if (problemError) return apiError(problemError.message, 500);
  if (!problem) return apiError("Problem not found", 404);

  const isDev = await isDeveloper(supabase);
  if (!isDev) {
    if (!problem.contest_id) {
      return apiError(
        "You do not have permission to update this problem",
        403,
      );
    }

    const { data: contest } = await supabase
      .from("contests")
      .select("authors_ids")
      .eq("id", problem.contest_id)
      .single();

    if (!contest?.authors_ids?.includes(user.id)) {
      return apiError(
        "You do not have permission to update this problem",
        403,
      );
    }
  }

  const body = await request.json();
  const allowedFields = ["answer"];
  const updates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return apiError("No valid fields to update", 400);
  }

  const { data, error } = await supabase
    .from("problems")
    .update(updates)
    .eq("id", problemId)
    .select()
    .single();

  if (error) return apiError(error.message, 500);

  return json(data);
}

export async function POST(request: Request) {
  const authError = protectApiEndpoint(request);
  if (authError) return authError;

  const supabase = createSupabaseServiceClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("problems")
    .insert([body])
    .select()
    .single();

  if (error) return apiError(error.message, 500);

  return json(data, 201);
}
