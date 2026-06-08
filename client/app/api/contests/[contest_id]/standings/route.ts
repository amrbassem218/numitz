import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Standing } from "@/types/types";
import { json, handleSupabaseError } from "@/lib/api/response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contest_id: string }> }
) {
  const supabase = await createSupabaseServerClient();
  // const contestId = (await params).contest_id; // TODO: filter by contest_id

  const { data, error } = await supabase
    .from("standings")
    .select("*, profiles(username, image_url)");

  const err = handleSupabaseError(error, "standings");
  if (err) return err;

  const standings = data ?? [];
  standings.sort((a: Standing, b: Standing) => (b?.score ?? 0) - (a?.score ?? 0));

  return json(standings);
}
