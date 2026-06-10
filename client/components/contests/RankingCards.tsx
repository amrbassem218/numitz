import { Ranking, rankingsList, UserRanking } from "@/types/types";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";

type Props = {
  userRankingData: UserRanking;
};

function RankingCards({ userRankingData }: Props) {
  const ranking: Ranking = rankingsList.filter(
    (e) => e.title_short === userRankingData.title_short,
  )[0];
  return (
    <div>
      <Card className="px-5 py-4 w-90 max-w-full flex items-center relative flex-row justify-between border-border/10">
        <div className="space-x-4">
          <span className="text-lg font-bold">
            {userRankingData.ranking_num}
          </span>
          <span className={ranking.color}>{userRankingData.username}</span>
        </div>
        <div className="h-full text-sm px-2 w-30 absolute right-0 top-0  border-l-1 border-l-border/10 flex flex-col gap-2 justify-center">
          {userRankingData.contest_score !== undefined ? (
            <span className="text-muted-foreground">
              Score: <span className="text-text">{userRankingData.contest_score}</span>
            </span>
          ) : (
            <>
              <span className="text-muted-foreground">
                Rating: <span className="text-text"> {userRankingData.rating}</span>
              </span>
              <span className="text-muted-foreground">
                Entered:{" "}
                <span className="text-text">
                  {" "}
                  {userRankingData.contests_entered_count}
                </span>
              </span>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

export default RankingCards;
