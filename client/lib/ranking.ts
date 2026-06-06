import { Ranking, rankingsList } from "@/types/types";

export function getRanking(eloRating: number): Ranking {
  let userRanking: Ranking = rankingsList[rankingsList.length - 1];
  for (const r of rankingsList) {
    if (r.rating !== undefined && r.rating <= eloRating) {
      userRanking = r;
    }
  }
  return userRanking;
}

export function getRankingColor(eloRating: number): string {
  return getRanking(eloRating).color;
}

export function getRankingTitle(eloRating: number): string {
  return getRanking(eloRating).title ?? "UnRated";
}
