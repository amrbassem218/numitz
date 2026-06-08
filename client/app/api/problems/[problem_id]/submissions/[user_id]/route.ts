import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import {
  json,
  apiError,
  handleSupabaseError,
  requireFields,
} from "@/lib/api/response";
import { requireContestAccess } from "@/lib/api/contestAccess";
import { getContestPhase } from "@/lib/contest";
import { isAcceptedAnswer } from "@/lib/answers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ problem_id: string; user_id: string }> },
) {
  const supabase = await createSupabaseServerClient();
  const { problem_id, user_id } = await params;

  const { data, error } = await supabase
    .from("submissions")
    .select("*, profiles(username), problems(name)")
    .eq("problem_id", problem_id)
    .eq("user_id", user_id);

  const err = handleSupabaseError(error, "user submissions");
  if (err) return err;

  return json(data);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ problem_id: string; user_id: string }> },
) {
  const body = await request.json();
  const { problem_id, user_id } = await params;

  const missingFields = requireFields(body, ["user_answer", "display_id"]);
  if (missingFields) return missingFields;

  const authSupabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await authSupabase.auth.getUser();

  if (userError || !user) {
    return apiError("You must be signed in to submit", 401);
  }
  if (user.id !== user_id) {
    return apiError("You can only submit as the signed-in user", 403);
  }

  const supabase = createSupabaseServiceClient();

  const { data: problem, error: problemError } = await supabase
    .from("problems")
    .select("id, answer, contest_id, contests(id, mode, start_date, end_date)")
    .eq("id", problem_id)
    .single();

  const problemErr = handleSupabaseError(problemError, "submission problem");
  if (problemErr) return problemErr;
  if (!problem) return apiError("Problem not found", 404);

  const contest = Array.isArray(problem.contests)
    ? problem.contests[0]
    : problem.contests;

  let isOfficial = true;

  if (contest) {
    const accessError = await requireContestAccess({
      supabase,
      contest,
      userId: user.id,
    });
    if (accessError) return accessError;

    const phase = getContestPhase(contest);
    if (phase === "upcoming") {
      return apiError("This live contest has not started yet", 403);
    }
    if (phase === "ended") {
      isOfficial = false;
    }
  }

  const status =
    typeof problem.answer === "string"
      ? isAcceptedAnswer(body.user_answer, problem.answer)
        ? "success"
        : "failure"
      : "pending";

  const { data, error } = await supabase
    .from("submissions")
    .insert({
      user_id,
      problem_id,
      user_answer: body.user_answer,
      status,
      display_id: body.display_id,
      is_official: isOfficial,
    })
    .select("*, profiles(username), problems(name)")
    .single();

  if (error) return apiError(error.message, 500);

  const [
    { count: submissionCount, error: submissionCountError },
    { count: correctSubmissionCount, error: correctSubmissionCountError },
  ] = await Promise.all([
    supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("problem_id", problem_id),
    supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("problem_id", problem_id)
      .eq("status", "success"),
  ]);

  if (submissionCountError) return apiError(submissionCountError.message, 500);
  if (correctSubmissionCountError) {
    return apiError(correctSubmissionCountError.message, 500);
  }

  const { error: updateProblemError } = await supabase
    .from("problems")
    .update({
      submission_count: submissionCount ?? 0,
      correct_submission_count: correctSubmissionCount ?? 0,
    })
    .eq("id", problem_id);

  if (updateProblemError) return apiError(updateProblemError.message, 500);

  return json({ success: true, data }, 201);
}
