import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { json, handleSupabaseError } from "@/lib/api/response";

export async function GET() {
  const supabase = createSupabaseServiceClient();

  const { data: contest, error: contestError } = await supabase
    .from("contests")
    .select("id")
    .eq("name", "Egyptian Math League")
    .single();

  if (contestError || !contest) {
    return json([]);
  }

  const { data: standings, error: standingsError } = await supabase
    .from("standings")
    .select("user_id, score, profiles!inner(username, elo_rating)")
    .eq("contest_id", contest.id)
    .order("score", { ascending: false })
    .limit(3);

  const err = handleSupabaseError(standingsError, "standings");
  if (err) return err;

  const result = (standings ?? []).map((s: Record<string, unknown>, i: number) => {
    const profiles = s.profiles as { username: string; elo_rating: number } | null;
    return {
      user_id: s.user_id as string,
      username: profiles?.username ?? "UNKNOWN",
      score: s.score as number,
      elo_rating: profiles?.elo_rating ?? 0,
      rank: i + 1,
    };
  });

  return json(result);
}
