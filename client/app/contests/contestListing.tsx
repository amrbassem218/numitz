import { getFormattedDate } from "@/lib/utils";
import { Contest } from "@/types/types";
import { formatDistance } from "date-fns";
import No_solved_and_call_to_action from "@/components/contests/no_solved_and_call_to_action";
import Link from "next/link";
import { getContestPhase } from "@/lib/contest";

type Props = {
  contest: Contest;
};

const ACCENT: Record<string, string> = {
  live: "from-red-500 to-orange-500",
  upcoming: "from-blue-500 to-blue-600",
  ended: "from-gray-400 to-gray-500",
  practice: "from-emerald-500 to-emerald-600",
};

const LABEL: Record<string, string> = {
  live: "Live",
  upcoming: "Upcoming",
  ended: "Ended",
  practice: "Practice",
};

function ContestListing({ contest }: Props) {
  const phase = contest.contest_phase ?? getContestPhase(contest);
  const startDate = contest.start_date ? new Date(contest.start_date) : null;
  const isUpcoming =
    !!startDate && !isNaN(startDate.getTime()) && startDate > new Date();

  const content = (
    <div className="flex items-stretch gap-4 rounded-md bg-card border border-foreground/10 hover:border-primary/50 transition-colors overflow-hidden">
      <div
        className={`w-24 sm:w-32 shrink-0 bg-linear-to-br ${ACCENT[phase] ?? ACCENT.practice} text-white flex flex-col items-center justify-center gap-1 p-3`}
      >
        <span className="text-xs uppercase tracking-wider opacity-80">
          {LABEL[phase] ?? "Practice"}
        </span>
        <span className="text-2xl font-bold">{contest.problem_count}</span>
        <span className="text-xs opacity-80">problems</span>
      </div>

      <div className="flex flex-1 items-center justify-between gap-3 py-4 pr-4">
        <div className="text-left min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-lg font-semibold truncate">{contest.name}</h4>
            {phase === "live" && (
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {getFormattedDate(contest.start_date).fullDate} (
            {formatDistance(contest.start_date, new Date(), {
              addSuffix: true,
            })}
            )
          </p>
          {contest.length_in_minutes ? (
            <p className="text-muted-foreground text-xs mt-1">
              Duration: {contest.length_in_minutes} min
            </p>
          ) : null}
        </div>

        <div className="hidden md:flex shrink-0">
          <No_solved_and_call_to_action contest={contest} />
        </div>
      </div>
    </div>
  );

  return isUpcoming ? (
    <div className="cursor-default">{content}</div>
  ) : (
    <Link href={`/contests/${contest.id}`}>{content}</Link>
  );
}

export default ContestListing;
