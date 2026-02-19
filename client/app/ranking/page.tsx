import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HEADER_MARGIN } from "@/lib/utils";
import { RankingDataTable } from "./data_table";
import { rankingColumns, UserRank } from "./columns";
import { Ranking, rankingsList } from "@/types/types";
import { rateLimit } from "@/lib/api/auth";

export default function Page() {
  // what I'll get from supabase
  const rankingsDb: { userId: string; username: string; userRating: number }[] =
    [
      {
        userId: "akl-asdflk-2323",
        username: "amrbassem218;",
        userRating: 2750,
      },
      {
        userId: "akl-asdflk-2323",
        username: "amrbassem218;",
        userRating: 750,
      },
      {
        userId: "akl-asdflk-2323",
        username: "amrbassem218;",
        userRating: 1750,
      },
    ];
  const rankings: UserRank[] = rankingsDb.map((e) => {
    // TODO: Just change the array into an object with keys being minimum rating and perform lower bound
    let maxRate = 0;
    let userRanking: Ranking = rankingsList[0];
    for (let i of rankingsList) {
      if (
        typeof i?.rating == "number" &&
        i?.rating >= maxRate &&
        i?.rating <= e.userRating
      ) {
        maxRate = i.rating;
        userRanking = i;
      }
    }
    return { ...e, ranking: userRanking };
  });
  return (
    <main
      style={{ height: `calc(100vh - ${HEADER_MARGIN}px)` }}
      className="w-full max-w-300 h-full pt-10 grid grid-cols-12 gap-10   h-full"
    >
      <Card className="col-span-8">
        <CardHeader>
          <CardTitle>Ranking</CardTitle>
          {/* TODO: Add actual description */}
          <CardDescription>
            This is ranking baed on rated contests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO: Get actual user rankings */}
          <RankingDataTable columns={rankingColumns} data={rankings} />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-5 col-span-4 ">
        <Card className="w-full h-60">
          <CardHeader>
            <CardTitle>Options</CardTitle>
            {/* TODO: Add actual description */}
            <CardDescription>
              Change options to change what you see here :)
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="col-span-4 w-full flex-1">
          <CardHeader>
            <CardTitle>Options</CardTitle>
            {/* TODO: Add actual description */}
            <CardDescription>
              Change options to change what you see here :)
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}
