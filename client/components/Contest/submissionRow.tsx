import { useProblems, useProfile } from "@/app/store";
import { cn } from "@/lib/utils";
import {
  defaultFormattedDate,
  Submission,
  SubmissionsTypes,
} from "@/types/types";
import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
  type: SubmissionsTypes;
  problemId: string;
}

function SubmissionsTable({ type, problemId }: Props) {
  const userProfile = useProfile((state) => state.userProfile);
  const submissionsFetch = useProblems(
    (state) => state.fetchProblemSubmissions,
  );
  const EMPTY_ARRAY: Submission[] = [];
  const submissions = useProblems((state) => {
    const submissions = state.problems[problemId]?.submissions;
    return (submissions && submissions[type]) ?? EMPTY_ARRAY;
  });
  const loading = useProblems(
    (state) => state.problems[problemId]?.submissions?.loading ?? true,
  );
  useEffect(() => {
    if (type && problemId && userProfile.id) {
      submissionsFetch(userProfile.id, problemId, type);
    }
  }, [type, problemId, userProfile]);
  useEffect(() => {
    if (submissions) {
      console.log("submissions changed!!!");
      console.log("new submissions be: ", submissions);
    }
  }, [submissions]);
  return (
    <>
      {submissions.length > 0 ? (
        submissions?.map((submission, i) => {
          const { date, time, timezone } =
            submission?.formattedDate ?? defaultFormattedDate;
          return (
            <div
              className={cn(
                i % 2 === 0 && "bg-bg-light",
                "rounded-md flex gap-10 h-12 items-center px-3",
              )}
            >
              {/* Submission Id  */}
              <div className="border border-muted-foreground/20 px-2 text-center rounded-md w-22">
                <span className="underline text-primary text-sm">
                  {submission.display_id}
                </span>
              </div>

              {/* Submission Date */}
              <div className="flex items-center flex-col text-xs text-text/60 w-20 truncate">
                {/* Date */}
                <span>{date}</span>

                {/* Time */}
                <span className="flex gap-[2px]">
                  {time}
                  {/* Local time zone */}
                  <span className="text-[8px]">{timezone}</span>
                </span>
              </div>

              {/* username */}
              {/* TODO: Add user based styling */}
              <span className="text-text/60 w-30 truncate">
                {submission?.profiles?.username?.charAt(0)}
                <span className="text-orange-500">
                  {submission?.profiles?.username?.slice(1)}
                </span>
              </span>

              {/* problem title */}
              <span className="text-text/60 w-20 truncate">
                {submission.problems?.name}
              </span>

              {/* Ans */}
              <span
                className={cn(
                  submission.status === "success" && "text-success",
                  submission.status === "failure" && "text-destructive",
                  "font-medium",
                )}
              >
                Ans: {submission.user_answer}
              </span>

              {/* score */}
              <span
                className={cn(
                  submission.status === "success" && "text-success",
                  submission.status === "failure" && "text-destructive",
                  "font-semibold",
                )}
              >
                {submission.score &&
                  (submission?.score > 0
                    ? "+"
                    : submission.score < 0
                      ? "-"
                      : "") + submission.score}
              </span>
            </div>
          );
        })
      ) : (
        <div className="flex items-center justify-center w-full h-full my-5">
          {loading ? (
            <p>loading...</p>
          ) : (
            <p>There are no submissins for this problem yet!</p>
          )}
        </div>
      )}
    </>
  );
}

export default SubmissionsTable;
