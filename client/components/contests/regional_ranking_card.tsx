"use client";
import { useEffect, useState } from "react";
import { getRanking } from "@/lib/ranking";
import { UserRanking } from "@/types/types";
import RankingCards from "./RankingCards";

type EmlStanding = {
  user_id: string;
  username: string;
  score: number;
  elo_rating: number;
  rank: number;
};

function RegionalRankingCards() {
  const [usersRankings, setUsersRankings] = useState<UserRanking[]>([]);
  useEffect(() => {
    fetch("/api/contests/eml-top")
      .then((res) => res.json())
      .then((data: EmlStanding[]) => {
        const rankings: UserRanking[] = data.map((s) => ({
          id: s.user_id,
          username: s.username,
          ranking_num: s.rank,
          title_short: getRanking(s.elo_rating).title_short ?? "UnR",
          rating: s.elo_rating,
          contests_entered_count: 0,
          contest_score: s.score,
        }));
        setUsersRankings(rankings);
      })
      .catch(() => setUsersRankings([]));
  }, []);
  return (
    <div className="space-y-2">
      {usersRankings.map((userRanking) => (
        <div key={userRanking.id}>
          <RankingCards userRankingData={userRanking} />
        </div>
      ))}
    </div>
  );
}

export default RegionalRankingCards;
