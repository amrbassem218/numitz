"use client";
import { useUser } from "@/app/hooks/useUser";
import { useProfile } from "@/app/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { safeNumber } from "@/lib/utils";
import { contestProblemDefaultValues, Standing } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useEffect, useState } from "react";
type Props = {
  contestId: string;
};

const ContestStandings = ({ contestId }: Props) => {
  const userProfile = useProfile((state) => state.user);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [standingsLoading, setStandingsLoading] = useState(true);
  const getStandings = async () => {
    setStandingsLoading(true);
    axios
      .get(`/api/contests/${contestId}/standings`)
      .then((res) => {
        if (res) {
          const standingsTemp = res.data;
          console.log("contest_standings: ", standingsTemp);
          setStandings(standingsTemp);
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

  return (
    <div>
      <TabsContent value="standings" className="p-4 flex flex-col gap-3 w-full">
        {standingsLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
          ))
        ) : standings.map((standing, index) => (
          <div
            key={standing.id ?? index}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <img
                src={standing?.profiles?.image_url ?? "/guest_user.svg"}
                alt={standing?.profiles?.username ?? "?"}
                className="w-6 h-6 rounded-full object-cover bg-muted"
              />
              <span>{standing?.profiles?.username ?? "UNKOWN USER"}</span>
            </div>
            <div>
              <span>{safeNumber(standing.score)}</span>
            </div>

            <div>
              <span>{safeNumber(standing.penalty)}</span>
            </div>
          </div>
        )        )}
      </TabsContent>
    </div>
  );
};

export default ContestStandings;
