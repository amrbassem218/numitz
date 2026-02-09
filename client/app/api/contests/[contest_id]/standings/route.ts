import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Standing } from "@/types/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contest_id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const contestId = (await params).contest_id;
    const { data: standings, error } = await supabase
      .from("standings")
      .select("*, profiles(username)")
    // .eq("contest_id", contestId);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    standings.sort((a: Standing, b: Standing) => {
      const a_score = a?.score ?? 0;
      const b_score = b?.score ?? 0
      return b_score - a_score;
    })
    return new Response(JSON.stringify(standings), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
