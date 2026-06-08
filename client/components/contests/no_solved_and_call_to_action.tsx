"use client";

import { Contest } from "@/types/types";
import { Button } from "../ui/button";
import { useProfile } from "@/app/store";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getContestMode, getContestPhase } from "@/lib/contest";

type Props = { contest: Contest };

function No_solved_and_call_to_action({ contest }: Props) {
  const userId = useProfile((state) => state.user?.id);
  const router = useRouter();
  const [solvedCount, setSolvedCount] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const phase = contest.contest_phase ?? getContestPhase(contest);
  const startDate = contest.start_date ? new Date(contest.start_date) : null;
  const isUpcoming = !!startDate && !isNaN(startDate.getTime()) && startDate > new Date();
  const contestMode = getContestMode(contest);

  useEffect(() => {
    let ignore = false;

    if (!userId) return;

    const fetchSolvedCount = async () => {
      try {
        const res = await axios.get<{ solvedCount: number }>(
          `/api/contests/${contest.id}/solved-count`,
        );

        if (!ignore) {
          setSolvedCount(res.data.solvedCount);
        }
      } catch (error) {
        console.error("Error while fetching solved count: ", error);
        if (!ignore) {
          setSolvedCount(0);
        }
      }
    };

    fetchSolvedCount();

    return () => {
      ignore = true;
    };
  }, [contest.id, userId]);

  useEffect(() => {
    if (!userId || !isUpcoming) return;

    let ignore = false;

    const checkRegistration = async () => {
      try {
        const res = await axios.get<{ exists: boolean }>(
          `/api/contests/${contest.id}/registered/${userId}`,
        );
        if (!ignore && res.data?.exists) {
          setIsRegistered(true);
        }
      } catch {
        // not registered
      }
    };

    checkRegistration();

    return () => {
      ignore = true;
    };
  }, [contest.id, userId, isUpcoming]);

  const displayedSolvedCount = userId ? solvedCount : 0;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isUpcoming) {
      if (!userId) {
        router.push("/sign_in");
        return;
      }

      axios
        .post(`/api/contests/${contest.id}/registered`, { user_id: userId })
        .then((res) => {
          if (res) {
            setIsRegistered(true);
            toast.success("Registered Successfully!");
          }
        })
        .catch((error) => {
          console.error(error);
          if (
            error.response?.data?.error?.includes(
              "duplicate key value violates unique constraint",
            )
          ) {
            setIsRegistered(true);
          } else {
            console.error("Error Occured while registering to contest");
          }
        });

      return;
    }

    router.push(
      phase === "ended"
        ? `/contests/${contest.id}?tab=standings`
        : `/contests/${contest.id}`,
    );
  };

  const getButtonLabel = () => {
    if (isUpcoming) return isRegistered ? "Registered" : "Register";
    if (phase === "live") return "Enter";
    return "Practice";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="bg-bg-light rounded-md px-2 flex items-center">
        <span className="text-sm text-muted-foreground tracking-wider">
          {displayedSolvedCount}/{contest.problem_count}
        </span>
      </div>
      <Button
        className="bg-primary/25 border border-primary/75"
        onClick={(e) => handleClick(e)}
        disabled={isUpcoming && isRegistered}
      >
        {getButtonLabel()}
      </Button>
    </div>
  );
}

export default No_solved_and_call_to_action;
