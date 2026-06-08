import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = resolve(__dirname, "..", ".env.local");
  try {
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let value = trimmed.slice(eqIdx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env.local is optional – the user may set vars externally
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const numericAnswerPattern = /^[+-]?(?:\d+\.?\d*|\.\d+)$/;
const DECIMAL_ANSWER_TOLERANCE = 0.01;

function isNumericAnswer(answer: string) {
  return numericAnswerPattern.test(answer.trim());
}

function isAcceptedAnswer(userAnswer: string, correctAnswer: string) {
  const normalizedUserAnswer = userAnswer.trim();
  const normalizedCorrectAnswer = correctAnswer.trim();

  if (
    isNumericAnswer(normalizedUserAnswer) &&
    isNumericAnswer(normalizedCorrectAnswer)
  ) {
    const userNumber = Number(normalizedUserAnswer);
    const correctNumber = Number(normalizedCorrectAnswer);

    if (userNumber === correctNumber) return true;
    if (Number.isInteger(correctNumber)) return false;

    return (
      Math.abs(userNumber - correctNumber) <=
      DECIMAL_ANSWER_TOLERANCE + Number.EPSILON
    );
  }

  return normalizedUserAnswer === normalizedCorrectAnswer;
}

function calculateScore(
  baseScore: number,
  contestStartDate: string,
  submissionTime: string,
): number {
  const start = new Date(contestStartDate);
  const subTime = new Date(submissionTime);
  const minutesSinceStart =
    (subTime.getTime() - start.getTime()) / 60000;
  const deduction = minutesSinceStart * 1;
  return Math.max(0, Math.round(baseScore - deduction));
}

async function main() {
  console.log("Fetching pending submissions...");

  const { data: submissions, error } = await supabase
    .from("submissions")
    .select(
      `
      id,
      problem_id,
      user_id,
      user_answer,
      created_at,
      score,
      status,
      problems (
        id,
        answer,
        points,
        contest_id,
        contests ( id, start_date )
      )
    `,
    )
    .eq("status", "pending");

  if (error) {
    console.error("Error fetching pending submissions:", error.message);
    return;
  }

  if (!submissions || submissions.length === 0) {
    console.log("No pending submissions found.");
    return;
  }

  console.log(`Found ${submissions.length} pending submissions.\n`);

  let evaluated = 0;
  let skipped = 0;
  const affectedProblems = new Set<string>();

  for (const sub of submissions) {
    const problem = Array.isArray(sub.problems)
      ? sub.problems[0]
      : sub.problems;

    if (!problem || typeof problem.answer !== "string") {
      skipped++;
      continue;
    }

    const contest = problem.contests
      ? Array.isArray(problem.contests)
        ? problem.contests[0]
        : problem.contests
      : null;

    const newStatus = isAcceptedAnswer(
      sub.user_answer ?? "",
      problem.answer,
    )
      ? "success"
      : "failure";

    let newScore = 0;
    if (contest?.start_date) {
      const baseScore = problem.points ?? 100;
      newScore = calculateScore(baseScore, contest.start_date, sub.created_at);
    }

    const { error: updateError } = await supabase
      .from("submissions")
      .update({ status: newStatus, score: newScore })
      .eq("id", sub.id);

    if (updateError) {
      console.error(
        `  Error updating submission ${sub.id}:`,
        updateError.message,
      );
    } else {
      evaluated++;
      affectedProblems.add(problem.id);
      console.log(
        `  [${evaluated}] Submission ${sub.id}: status=${sub.status}->${newStatus}, score=${sub.score}->${newScore}`,
      );
    }
  }

  if (affectedProblems.size > 0) {
    console.log(`\nUpdating counts for ${affectedProblems.size} problems...`);

    for (const problemId of affectedProblems) {
      const [
        { count: totalCount },
        { count: correctCount },
      ] = await Promise.all([
        supabase
          .from("submissions")
          .select("*", { count: "exact", head: true })
          .eq("problem_id", problemId),
        supabase
          .from("submissions")
          .select("*", { count: "exact", head: true })
          .eq("problem_id", problemId)
          .eq("status", "success"),
      ]);

      const { error: updateCountError } = await supabase
        .from("problems")
        .update({
          submission_count: totalCount ?? 0,
          correct_submission_count: correctCount ?? 0,
        })
        .eq("id", problemId);

      if (updateCountError) {
        console.error(
          `  Error updating problem ${problemId} counts:`,
          updateCountError.message,
        );
      } else {
        console.log(
          `  Problem ${problemId}: ${totalCount} total, ${correctCount} correct`,
        );
      }
    }
  }

  console.log(
    `\nDone! Evaluated: ${evaluated}, Skipped (problem has no answer yet): ${skipped}`,
  );
}

main();
