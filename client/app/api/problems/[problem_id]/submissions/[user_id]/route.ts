import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ problem_id: string; user_id: string }> },
) {
  try {
    const supabase = await createSupabaseServerClient();
    const problemId = (await params).problem_id;
    const userId = (await params).user_id;
    const { data: submissions, error } = await supabase
      .from("submissions")
      .select("*, problems(name)")
      .eq("problem_id", problemId)
      .eq("user_id", userId);
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ problem_id: string; user_id: string }> },
) {
  try {
    const body = await request.json();
    const { problem_id, user_id } = await params;
    const { user_answer, status } = body;
    if (!body || !user_id || !problem_id || !user_answer || !status) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const supabase = createSupabaseServiceClient();

    const { data: submission_data, error: submissionError } = await supabase
      .from("submissions")
      .insert({
        user_id,
        problem_id,
        user_answer,
        status,
      });
    if (submissionError) {
      return new Response(JSON.stringify({ error: submissionError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ success: true, submission_data }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
