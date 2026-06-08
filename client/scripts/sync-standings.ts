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

type RawSubmission = {
  user_id: string;
  problem_id: string;
  score: number;
  status: string | null;
  created_at: string;
};

type RawProblem = {
  id: string;
  points: number | null;
  contest_id: string | null;
};

type UserStanding = {
  score: number;
  penalty: number;
};

async function recalculateContest(contestId: string) {
  const { data: contest } = await supabase
    .from("contests")
    .select("id, start_date, end_date, name")
    .eq("id", contestId)
    .single();

  if (!contest?.start_date) {
    console.log(`  Skipping contest ${contestId}: no start_date`);
    return;
  }

  const contestStart = new Date(contest.start_date);
  console.log(`\nContest: ${contest.name ?? contest.id} (start: ${contest.start_date})`);

  const { data: problems } = await supabase
    .from("problems")
    .select("id, points")
    .eq("contest_id", contestId);

  const problemPoints = new Map<string, number>();
  for (const p of problems ?? []) {
    problemPoints.set(p.id, p.points ?? 100);
  }

  const { data: submissions } = await supabase
    .from("submissions")
    .select("user_id, problem_id, score, status, created_at")
    .eq("is_official", true)
    .not("user_id", "is", null);

  if (!submissions || submissions.length === 0) {
    console.log("  No official submissions for this contest.");
    return;
  }

  const contestSubs = (submissions as RawSubmission[]).filter((s) =>
    problemPoints.has(s.problem_id),
  );

  const userProblems = new Map<string, Map<string, RawSubmission>>();

  for (const sub of contestSubs) {
    if (!userProblems.has(sub.user_id)) {
      userProblems.set(sub.user_id, new Map());
    }
    const userMap = userProblems.get(sub.user_id)!;
    const existing = userMap.get(sub.problem_id);
    if (!existing || sub.score > existing.score) {
      userMap.set(sub.problem_id, sub);
    }
  }

  const standings = new Map<string, UserStanding>();

  for (const [userId, problemMap] of userProblems) {
    let totalScore = 0;
    let totalPenalty = 0;

    for (const sub of problemMap.values()) {
      totalScore += sub.score;

      if (sub.status === "success") {
        const minutesFromStart =
          (new Date(sub.created_at).getTime() - contestStart.getTime()) / 60000;
        totalPenalty += Math.round(minutesFromStart);
      }
    }

    standings.set(userId, { score: totalScore, penalty: totalPenalty });
  }

  let created = 0;
  let updated = 0;

  for (const [userId, standing] of standings) {
    const { data: existing } = await supabase
      .from("standings")
      .select("id, score, penalty")
      .eq("contest_id", contestId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      if (existing.score !== standing.score || existing.penalty !== standing.penalty) {
        await supabase
          .from("standings")
          .update({ score: standing.score, penalty: standing.penalty })
          .eq("id", existing.id);
        updated++;
      }
    } else {
      await supabase.from("standings").insert({
        contest_id: contestId,
        user_id: userId,
        score: standing.score,
        penalty: standing.penalty,
      });
      created++;
    }
  }

  console.log(
    `  Users: ${standings.size}, Created: ${created}, Updated: ${updated}`,
  );

  const { data: existingStandings } = await supabase
    .from("standings")
    .select("id, user_id")
    .eq("contest_id", contestId);

  const standingUserIds = new Set(standings.keys());
  let removed = 0;

  for (const row of existingStandings ?? []) {
    if (row.user_id && !standingUserIds.has(row.user_id)) {
      await supabase.from("standings").delete().eq("id", row.id);
      removed++;
    }
  }

  if (removed > 0) {
    console.log(`  Removed ${removed} users who no longer have official submissions.`);
  }
}

async function main() {
  const contestId = process.argv[2];

  if (contestId) {
    console.log(`Recalculating standings for contest: ${contestId}`);
    await recalculateContest(contestId);
  } else {
    console.log("Fetching all contests...");

    const { data: contests } = await supabase
      .from("contests")
      .select("id, name")
      .order("start_date", { ascending: false });

    if (!contests || contests.length === 0) {
      console.log("No contests found.");
      return;
    }

    console.log(`Found ${contests.length} contests.`);

    for (const contest of contests) {
      await recalculateContest(contest.id);
    }
  }

  console.log("\nDone!");
}

main();
