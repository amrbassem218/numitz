import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { protectApiEndpoint, rateLimitPublic, isDeveloper } from "@/lib/api/auth";
import { json, apiError, handleSupabaseError } from "@/lib/api/response";
import { getContestPhase, getContestMode } from "@/lib/contest";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contest_id: string }> }
) {
  const rateLimitError = rateLimitPublic(request);
  if (rateLimitError) return rateLimitError;

  const supabase = await createSupabaseServerClient();
  const contestId = (await params).contest_id;

  const { data, error } = await supabase
    .from("contests")
    .select("*")
    .eq("id", contestId)
    .single();

  const err = handleSupabaseError(error, "contest");
  if (err) return err;

  if (data?.status === "private") {
    const developer = await isDeveloper(supabase);
    if (!developer) {
      return apiError("Contest not found", 404);
    }
  }

  const serverNow = new Date();

  return json({
    ...data,
    mode: getContestMode(data),
    contest_phase: getContestPhase(data, serverNow),
    server_time: serverNow.toISOString(),
  });
}

export async function POST(request: Request) {
  const authError = protectApiEndpoint(request);
  if (authError) return authError;

  const supabase = createSupabaseServiceClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("contests")
    .insert([
      {
        ...body,
        mode: body.mode === "live" ? "live" : "practice",
        status: body.status === "private" ? "private" : "public",
      },
    ])
    .select()
    .single();

  if (error) return apiError(error.message, 500);

  return json(data, 201);
}
