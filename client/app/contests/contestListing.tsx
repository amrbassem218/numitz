import { getFormattedDate } from "@/lib/utils";
import { Contest } from "@/types/types";
import Image from "next/image";
import { formatDistance } from "date-fns";
import No_solved_and_call_to_action from "@/components/contests/no_solved_and_call_to_action";
import Link from "next/link";
import { getContestPhase } from "@/lib/contest";

type Props = {
  contest: Contest;
};

function ContestListing({ contest }: Props) {
  const phase = contest.contest_phase ?? getContestPhase(contest);
  const startDate = contest.start_date ? new Date(contest.start_date) : null;
  const isUpcoming = !!startDate && !isNaN(startDate.getTime()) && startDate > new Date();
  const thumbnailColor = contest.id.charCodeAt(0) % 2 === 0 ? "yellow" : "blue";
  const phaseLabel =
    phase === "live"
      ? "Live"
      : phase === "upcoming"
        ? "Upcoming"
        : phase === "ended"
          ? "Ended"
          : "Practice";

  const content = (
    <div className="flex items-center gap-3">
        {/* Contest thumbnail */}
        <div className="w-fit">
          {/* TODO: Add actual thumbnails or more options */}
          <Image
            src={`/contest_thumbnail_${thumbnailColor}.png`}
            alt="contest thumbnail"
            width={100}
            height={100}
          />
        </div>

        {/* Contest description */}
        <div className="flex items-center justify-between flex-1">
          {/* Title & Date */}
          <div className="text-left">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-lg !font-normal ">{contest.name}</h4>
              <span className="rounded-sm bg-bg-light px-1.5 py-0.5 text-xs text-muted-foreground">
                {phaseLabel}
              </span>
            </div>
            <span className="text-muted-foreground text-sm">
              {getFormattedDate(contest.start_date).fullDate} (
              {formatDistance(contest.start_date, new Date(), {
                addSuffix: true,
              })}
              )
            </span>
          </div>

          {/* No. problems solved & Call to action */}
          <div className="hidden md:flex">
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
