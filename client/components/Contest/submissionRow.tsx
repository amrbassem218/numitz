import { useProblems, useProfile, useShownProblemId } from "@/app/store";
import { cn } from "@/lib/utils";
import {
  defaultFormattedDate,
  Submission,
  SubmissionsTypes,
} from "@/types/types";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";

interface Props {
  type: SubmissionsTypes;
  setSubmissionType: Dispatch<SetStateAction<string>>;
}

function SubmissionsTable({ type, setSubmissionType }: Props) {
  const userProfile = useProfile((state) => state.userProfile);
  const userProfileLoading = useProfile((state) => state.loading);
  const submissionsFetch = useProblems(
    (state) => state.fetchProblemSubmissions,
  );
  const EMPTY_ARRAY: Submission[] = [];
  const problemId = useShownProblemId((state) => state.shownProblemId);
  const submissions = useProblems((state) => {
    const submissions = state.problems[problemId]?.submissions;
    return (submissions && submissions[type]) ?? EMPTY_ARRAY;
  });
  const SubmissionsLoading = useProblems(
    (state) => state.problems[problemId]?.submissions?.loading ?? true,
  );

  useEffect(() => {
    if (type && problemId) {
      submissionsFetch(problemId, type, userProfile?.id);
    }
  }, [type, problemId, userProfile]);
  useEffect(() => {
    console.log("userProfileLoading: ", userProfileLoading);
    console.log("userProfile_w: ", userProfile);
  }, [userProfileLoading]);
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
          {!userProfileLoading &&
          !userProfile &&
          (type === "your_submissions" || type === "friends_submissions") ? (
            <div className="flex items-center text-center flex-col gap-3">
              <div className="space-y-2">
                <h4>You're not Signed in</h4>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">
                    pls login or sign up to view your own submissions{" "}
                  </span>
                  <button
                    className="underline text-primary cursor-pointer"
                    onClick={() => setSubmissionType("general_submissions")}
                  >
                    or go to general submissions
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={"primary"}
                  link="/sign_up"
                  className="text-xs py-0"
                >
                  Sign Up
                </Button>
                <Button
                  variant={"outline"}
                  link="/sign_in"
                  className="text-xs py-2"
                >
                  Sign in
                </Button>
              </div>
              {/* <Separator className="my-3" /> */}
              {/* <span>See General Submission</span> */}
            </div>
          ) : SubmissionsLoading ? (
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
