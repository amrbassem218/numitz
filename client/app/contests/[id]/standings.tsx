"use client";
import { safeNumber } from "@/lib/utils";
import { getRankingColor } from "@/lib/ranking";
import { ContestProblem, Standing } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const ROW_HEIGHT = 44;
const NARROW_THRESHOLD = 300;

type Props = {
  contestId: string;
  problems: ContestProblem[];
  contestStartDate: string;
};

const ContestStandings = ({ contestId, problems, contestStartDate }: Props) => {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [standingsLoading, setStandingsLoading] = useState(true);
  const [isNarrow, setIsNarrow] = useState(false);
  const outerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scoresScrollRef = useRef<HTMLDivElement>(null);
  const rowScrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollLeftRef = useRef(0);

  const syncScroll = useCallback((source: HTMLDivElement) => {
    const newLeft = source.scrollLeft;
    if (newLeft === scrollLeftRef.current) return;
    scrollLeftRef.current = newLeft;
    [scoresScrollRef.current, ...rowScrollRefs.current].forEach((el) => {
      if (el && el !== source) el.scrollLeft = newLeft;
    });
  }, []);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const update = () => setIsNarrow(el.clientWidth < NARROW_THRESHOLD);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getStandings = async () => {
    setStandingsLoading(true);
    axios
      .get(`/api/contests/${contestId}/standings`)
      .then((res) => {
        if (res) {
          setStandings(res.data);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setStandingsLoading(false);
      });
  };

  useEffect(() => {
    getStandings();
  }, []);

  if (standingsLoading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3" style={{ height: ROW_HEIGHT }}>
            <Skeleton className="h-5 w-6 shrink-0" />
            <Skeleton className="h-5 w-24 shrink-0" />
            <div className="flex gap-2 flex-1">
              {problems.map((_, j) => (
                <Skeleton key={j} className="h-5 w-8 shrink-0" />
              ))}
            </div>
            <Skeleton className="h-5 w-12 shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  if (standings.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        No standings yet.
      </div>
    );
  }

  return (
    <div ref={outerRef} className="flex flex-col h-full min-h-0">
      <div className="flex items-center gap-2 px-2 py-2 text-xs font-medium text-muted-foreground bg-card border-b border-border/50 shrink-0">
        <span className="w-5 shrink-0 text-center">#</span>
        <span className="w-28 shrink-0">Username</span>
        {!isNarrow && (
          <div
            ref={scoresScrollRef}
            onScroll={(e) => syncScroll(e.currentTarget)}
            className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink min-w-0"
          >
            <div className="flex gap-2">
              {problems.map((p) => {
                const letter = p.index_in_contest != null
                  ? String.fromCharCode(65 + p.index_in_contest)
                  : "?";
                const label = p.name.length > 0 && p.name.length <= 4 ? p.name : letter;
                return (
                  <span
                    key={p.id}
                    className="w-8 shrink-0 text-center truncate"
                    title={p.name || letter}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        )}
        <span className="w-12 shrink-0 text-right">Score</span>
      </div>

      <div
        ref={containerRef}
        className="overflow-auto flex-1 min-h-0"
      >
        {standings.map((standing, i) => {
          const rank = i + 1;
          const username = standing?.profiles?.username ?? "UNKNOWN";
          const elo = standing.elo_rating ?? 0;
          const color = getRankingColor(elo);

          return (
            <div
              key={standing.id ?? i}
              className="flex items-center gap-2 px-2 hover:bg-muted/40 transition-colors"
              style={{ height: ROW_HEIGHT }}
            >
              <span className="w-5 shrink-0 text-xs text-muted-foreground text-center">
                {rank}
              </span>

              <Link
                href={`/profile/${username}`}
                className={`w-28 shrink-0 text-sm font-bold truncate ${color} hover:underline`}
              >
                {username}
              </Link>

              {!isNarrow && (
                <div
                  ref={(el) => { rowScrollRefs.current[i] = el; }}
                  onScroll={(e) => syncScroll(e.currentTarget)}
                  className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink min-w-0"
                >
                  <div className="flex gap-2">
                    {problems.map((problem) => {
                      const info = standing.problem_scores?.[problem.id];
                      const myScore = info?.score ?? 0;
                      let timeStr = "";
                      if (info?.created_at && myScore > 0) {
                        const elapsed =
                          new Date(info.created_at).getTime() -
                          new Date(contestStartDate).getTime();
                        const totalMinutes = Math.floor(
                          elapsed / 60000
                        );
                        const h = Math.floor(totalMinutes / 60);
                        const m = totalMinutes % 60;
                        timeStr = `(${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")})`;
                      }
                      return (
                        <div
                          key={problem.id}
                          className="w-8 shrink-0 flex flex-col items-center leading-tight"
                        >
                          <span className="text-xs font-semibold tabular-nums leading-tight data-[solved=true]:text-green-600 data-[solved=false]:text-muted-foreground/40" data-solved={myScore > 0}>
                            {myScore > 0 ? myScore : "–"}
                          </span>
                          {timeStr && (
                            <span className="text-[9px] text-muted-foreground/60 tabular-nums leading-none">
                              {timeStr}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <span className="w-12 shrink-0 text-sm font-semibold text-right tabular-nums">
                {safeNumber(standing.score)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContestStandings;
