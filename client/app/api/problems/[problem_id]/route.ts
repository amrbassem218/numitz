import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { protectApiEndpoint, rateLimitPublic } from "@/lib/api/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ problem_id: string }> },
) {
  try {
    // Rate limit public GET requests
    const rateLimitError = rateLimitPublic(request);
    if (rateLimitError) {
      return rateLimitError;
    }

    const supabase = await createSupabaseServerClient();
    const problemId = (await params).problem_id;
    const { data: submissions, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("id", problemId);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(submissions), {
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

// export async function POST(request: Request) {
//   try {
//     // Require API key for POST requests
//     const authError = protectApiEndpoint(request);
//     if (authError) {
//       return authError;
//     }
//
//     // Use service role client for authenticated operations
//     const supabase = createSupabaseServiceClient();
//
//     // Parse request body
//     const body = await request.json();
//
//     const { data, error } = await supabase
//       .from("submissions")
//       .insert([body])
//       .select()
//       .single();
//
//     if (error) {
//       return new Response(JSON.stringify({ error: error.message }), {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//
//     return new Response(JSON.stringify(data), {
//       status: 201,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("POST error:", error);
//     return new Response(
//       JSON.stringify({
//         error: "Internal server error",
//         message: error instanceof Error ? error.message : "Unknown error",
//       }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       },
//     );
//   }
// }
