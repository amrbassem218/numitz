"use client";
import { Contest } from "@/types/types";
import { useEffect, useMemo } from "react";
import useInfiniteScroll from "@/hook/useInfiniteScroll";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { getFormattedDate } from "@/lib/utils";
import { getContestPhase } from "@/lib/contest";
import No_solved_and_call_to_action from "@/components/contests/no_solved_and_call_to_action";

const dedupeContests = (contests: Contest[] | null) => {
  if (!contests) return null;
  const seen = new Set<string>();
  return contests.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
};

const formatLength = (mins?: number) => {
  if (!mins) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const splitList = (v: string | null | undefined) =>
  v ? String(v).split(",").map((s) => s.trim()).filter(Boolean) : [];

const PHASE_STYLE: Record<string, string> = {
  live: "text-destructive font-semibold",
  upcoming: "text-blue-500",
  ended: "text-muted-foreground",
  practice: "text-emerald-500",
};
const PHASE_LABEL: Record<string, string> = {
  live: "Running",
  upcoming: "Before start",
  ended: "Finished",
  practice: "Practice",
};

const formatStart = (d: string | Date) => {
  const f = getFormattedDate(d);
  const [month, day, year] = f.date.split("/");
  return `${month}/${day}/${year} ${f.time}${f.timezone.replace("GMT", "UTC")}`;
};

const STICKY = "sticky right-0 bg-card border-l border-foreground/10 shadow-[-6px_0_8px_-6px_rgba(0,0,0,0.25)]";

const TH = "px-3 py-2 text-left font-semibold whitespace-nowrap";
const TD = "px-3 py-3 align-top";

function ContestTable({
  title,
  contests,
  loading,
  empty,
  observer,
}: {
  title: string;
  contests: Contest[] | null;
  loading: boolean;
  empty: string;
  observer?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <section className="rounded-md border border-foreground/20 overflow-hidden bg-card">
      <h2 className="px-4 py-2.5 font-semibold text-base bg-bg-light border-b border-foreground/20">
        {title}
        {contests && (
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            ({contests.length} shown)
          </span>
        )}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-foreground/20 text-muted-foreground">
            <tr>
              <th className={`${TH} w-10`}>#</th>
              <th className={TH}>Name</th>
              <th className={TH}>Authors</th>
              <th className={TH}>Start</th>
              <th className={TH}>Length</th>
              <th className={TH}>Problems</th>
              <th className={TH}>Difficulty</th>
              <th className={TH}>Registered</th>
              <th className={TH}>Status</th>
              <th className={`${TH} ${STICKY} text-right`}>Solved / Action</th>
            </tr>
          </thead>
          <tbody>
            {contests && contests.length > 0
              ? contests.map((c, i) => {
                  const phase = c.contest_phase ?? getContestPhase(c);
                  const authors = splitList(c.authors_ids);
                  const topics = splitList(c.topics);
                  return (
                    <tr
                      key={c.id}
                      className={`border-b border-foreground/10 last:border-0 hover:bg-bg-light/60 ${
                        i % 2 ? "bg-bg-light/30" : ""
                      }`}
                    >
                      <td className={`${TD} text-muted-foreground`}>{i + 1}</td>
                      <td className={`${TD} min-w-56 max-w-md`}>
                        <Link
                          href={`/contests/${c.id}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {c.name}
                        </Link>
                        {c.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                            {c.description}
                          </p>
                        )}
                        {topics.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {topics.map((t) => (
                              <span
                                key={t}
                                className="rounded-sm bg-bg-light px-1.5 py-0.5 text-[11px] text-muted-foreground"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className={`${TD} text-muted-foreground`}>
                        {authors.length ? authors.join(", ") : "—"}
                      </td>
                      <td className={`${TD} whitespace-nowrap`}>
                        <div className="text-xs">{formatStart(c.start_date)}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {formatDistance(c.start_date, new Date(), {
                            addSuffix: true,
                          })}
                        </div>
                      </td>
                      <td className={`${TD} whitespace-nowrap`}>
                        {formatLength(c.length_in_minutes)}
                      </td>
                      <td className={TD}>{c.problem_count}</td>
                      <td className={TD}>{c.difficulty ?? "—"}</td>
                      <td className={`${TD} whitespace-nowrap`}>
                        x{c.number_of_registered ?? 0}
                      </td>
                      <td className={`${TD} whitespace-nowrap`}>
                        <span className={PHASE_STYLE[phase]}>
                          {PHASE_LABEL[phase]}
                        </span>
                      </td>
                      <td className={`${TD} ${STICKY} text-right`}>
                        <div className="flex justify-end">
                          <No_solved_and_call_to_action contest={c} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              : !loading && (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      {empty}
                    </td>
                  </tr>
                )}
            {loading &&
              [1, 2, 3].map((i) => (
                <tr key={`sk-${i}`}>
                  <td colSpan={10} className="px-3 py-2">
                    <Skeleton className="h-10 w-full" />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div ref={observer as any} className="h-2" />
    </section>
  );
}

const SuggestedContest = () => {
  const router = useRouter();
  const opts = { limit: 10, autoFetch: false };

  const live = useInfiniteScroll({ apiUrl: "/api/contests/live", options: opts });
  const upcoming = useInfiniteScroll({
    apiUrl: "/api/contests/upcoming",
    options: opts,
  });
  const past = useInfiniteScroll({ apiUrl: "/api/contests/past", options: opts });

  useEffect(() => {
    if (!live.isInitialized) live.loadMore();
    if (!upcoming.isInitialized) upcoming.loadMore();
    if (!past.isInitialized) past.loadMore();
  }, [live, upcoming, past]);

  const liveList = useMemo(() => dedupeContests(live.items), [live.items]);
  const upList = useMemo(() => dedupeContests(upcoming.items), [upcoming.items]);
  const pastList = useMemo(() => dedupeContests(past.items), [past.items]);

  const current = useMemo(
    () => [...(liveList ?? []), ...(upList ?? [])],
    [liveList, upList],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contests</h1>
        <Button onClick={() => router.push("/create_contest")}>
          Create contest
        </Button>
      </div>

      <ContestTable
        title="Current or upcoming contests"
        contests={current}
        loading={live.loading || upcoming.loading}
        empty="No running or upcoming contests right now."
        observer={upcoming.observerTarget}
      />

      <ContestTable
        title="Past contests"
        contests={pastList}
        loading={past.loading}
        empty="There are no past contests to show."
        observer={past.observerTarget}
      />
    </div>
  );
};

export default SuggestedContest;
