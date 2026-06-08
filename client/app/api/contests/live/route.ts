import { createSupabaseServerClient } from "@/lib/supabase/server";
import { rateLimitPublic, isDeveloper } from "@/lib/api/auth";
import {
  json,
  handleSupabaseError,
  parsePaginationParams,
} from "@/lib/api/response";

export async function GET(request: Request) {
  const rateLimitError = rateLimitPublic(request);
  if (rateLimitError) return rateLimitError;

  const { limit, pointer } = parsePaginationParams(request.url, 5);
  const offset = Math.max(0, Number(pointer ?? 0) || 0);
  const now = new Date().toISOString();

  const supabase = await createSupabaseServerClient();
  const developer = await isDeveloper(supabase);

  let query = supabase
    .from("contests")
    .select("*")
    .eq("mode", "live")
    .lte("start_date", now)
    .gte("end_date", now)
    .order("start_date", { ascending: true })
    .order("id", { ascending: true })
    .range(offset, offset + limit);

  if (!developer) {
    query = query.eq("status", "public");
  }

  const { data, error } = await query;

  const err = handleSupabaseError(error, "live contests");
  if (err) return err;

  const safeData = data ?? [];
  const hasMore = safeData.length > limit;
  return json({
    data: safeData.slice(0, limit),
    hasMore,
    nextPointer: hasMore ? String(offset + limit) : null,
  });
}
