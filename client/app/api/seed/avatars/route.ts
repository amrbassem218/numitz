import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { put } from "@vercel/blob";
import { json, apiError } from "@/lib/api/response";

function generateUUID() {
  return crypto.randomUUID();
}

export async function GET() {
  const supabase = createSupabaseServiceClient();

  const { data: profiles, error: fetchError } = await supabase
    .from("profiles")
    .select("id, username")
    .is("image_url", null);

  if (fetchError) {
    return apiError(fetchError.message, 500);
  }

  if (!profiles || profiles.length === 0) {
    return json({ message: "No users found without avatars", generated: 0 });
  }

  const results: { username: string; image_url: string }[] = [];
  const errors: { username: string; error: string }[] = [];

  for (const profile of profiles) {
    try {
      const seed = generateUUID();
      const url = `https://api.dicebear.com/10.x/adventurer-neutral/svg?seed=${seed}`;

      const response = await fetch(url);
      if (!response.ok) {
        errors.push({ username: profile.username!, error: `DiceBear API returned ${response.status}` });
        continue;
      }

      const svg = await response.text();
      const filename = `avatars/${profile.id}.svg`;

      const blob = await put(filename, svg, {
        access: "public",
        contentType: "image/svg+xml",
        addRandomSuffix: false,
      });

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ image_url: blob.url })
        .eq("id", profile.id);

      if (updateError) {
        errors.push({ username: profile.username!, error: updateError.message });
        continue;
      }

      results.push({ username: profile.username!, image_url: blob.url });
    } catch (err) {
      errors.push({
        username: profile.username!,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return json({
    message: `Generated ${results.length} avatars`,
    generated: results.length,
    failed: errors.length,
    results,
    errors: errors.length > 0 ? errors : undefined,
  });
}
