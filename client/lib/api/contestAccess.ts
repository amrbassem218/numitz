import { apiError } from "@/lib/api/response";
import { getContestPhase } from "@/lib/contest";
import { SupabaseClient } from "@supabase/supabase-js";

type ContestAccessInput = {
  supabase: SupabaseClient;
  contest: {
    id: string;
    mode?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    status?: string | null;
  };
  userId?: string | null;
  requireLiveWindow?: boolean;
  allowEndedRead?: boolean;
};

export async function requireContestAccess({
  supabase,
  contest,
  userId,
  requireLiveWindow = false,
  allowEndedRead = true,
}: ContestAccessInput) {
  if (contest?.status === "private") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("type")
      .eq("id", userId)
      .single();
    if (profile?.type !== "developer") {
      return apiError("Contest not found", 404);
    }
    return null;
  }

  const phase = getContestPhase(contest);

  if (phase === "practice") return null;

  if (phase === "upcoming") {
    return apiError("This live contest has not started yet", 403);
  }

  if (phase === "ended") {
    if (requireLiveWindow || !allowEndedRead) {
      return apiError("This live contest has ended", 410);
    }
    return null;
  }

  if (!userId) {
    return apiError("You must be signed in for this live contest", 401);
  }

  const { data, error } = await supabase
    .from("registered_in_contest")
    .select("contest_id")
    .eq("contest_id", contest.id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return apiError(error.message, 500);
  if (!data) return apiError("You must register for this live contest", 403);

  return null;
}
