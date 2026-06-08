import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { json, handleSupabaseError } from "@/lib/api/response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contest_id: string, user_id: string }> }
) {
  const authSupabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await authSupabase.auth.getUser();

  if (!user) {
    return json({ exists: false });
  }

  const supabase = createSupabaseServiceClient();
  const { contest_id, user_id } = await params;

  const { data, error } = await supabase
    .from("registered_in_contest")
    .select("id")
    .eq("contest_id", contest_id)
    .eq("user_id", user_id)
    .maybeSingle();

  const err = handleSupabaseError(error, "check registration");
  if (err) return err;

  return json({ exists: !!data });
}

