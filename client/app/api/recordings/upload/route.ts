import { put } from "@vercel/blob";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { json, apiError } from "@/lib/api/response";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return apiError("Unauthorized", 401);

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const metaRaw = formData.get("meta") as string | null;

    if (!file || !metaRaw) return apiError("Missing file or metadata", 400);

    const { contestId, fileType, timestamp } = JSON.parse(metaRaw) as Record<string, string>;
    if (!contestId || !fileType || !timestamp) {
      return apiError("Missing required fields in metadata", 400);
    }

    const filename = `recordings/${contestId}/${user.id}/${timestamp}_${fileType}.webm`;

    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
    });

    return json({ url: blob.url, pathname: blob.pathname });
  } catch (err) {
    console.error("Error uploading recording:", err);
    return apiError("Failed to upload recording", 500);
  }
}
