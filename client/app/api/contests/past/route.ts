import { createSupabaseServerClient } from "@/lib/supabase/server";
import { rateLimitPublic, isDeveloper } from "@/lib/api/auth";
import {
  json,
  handleSupabaseError,
  parsePaginationParams,
} from "@/lib/api/response";
import { getContestPhase, getContestMode } from "@/lib/contest";

export async function GET(request: Request) {
  const rateLimitError = rateLimitPublic(request);
  if (rateLimitError) return rateLimitError;

  const { limit, pointer } = parsePaginationParams(request.url, 2);
  const offset = Math.max(0, Number(pointer ?? 0) || 0);
  const serverNow = new Date();
  const now = serverNow.toISOString();

  const supabase = await createSupabaseServerClient();
  const developer = await isDeveloper(supabase);

  let query = supabase
    .from("contests")
    .select("*")
    .order("start_date", { ascending: false })
    .order("id", { ascending: true })
    .lte("end_date", now)
    .range(offset, offset + limit);

  if (!developer) {
    query = query.eq("status", "public");
  }

  const { data, error } = await query;

  const err = handleSupabaseError(error, "past contests");
  if (err) return err;

  const safeData = data ?? [];
  const enrichedData = safeData.map((contest) => ({
    ...contest,
    mode: getContestMode(contest),
    contest_phase: getContestPhase(contest, serverNow),
    server_time: serverNow.toISOString(),
  }));
  const hasMore = safeData.length > limit;
  return json({
    data: enrichedData.slice(0, limit),
    hasMore,
    nextPointer: hasMore ? String(offset + limit) : null,
  });
}
