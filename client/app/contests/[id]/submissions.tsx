"use client";
import { useUser } from "@/app/hooks/useUser";
import { useProblems, useProfile, useShownProblemId } from "@/app/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, dateFormatter } from "@/lib/utils";
import { defaultFormattedDate } from "@/types/types";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import * as React from "react";

interface ContestSubmissionsProps {}

const ContestSubmissions: React.FunctionComponent<ContestSubmissionsProps> = (
  props,
) => {
  const shownProblemId = useShownProblemId((state) => state.shownProblemId);
  const yourSubmissions = useProblems(
    (state) => state.problems[shownProblemId]?.submissions,
  );
  const userProfile = useProfile((state) => state.userProfile);
  useEffect(() => {
    if (userProfile && userProfile?.id && shownProblemId) {
      useProblems
        .getState()
        .fetchProblemSubmissions(userProfile.id, shownProblemId);
    }
  }, [userProfile, shownProblemId]);

  return (
    <TabsContent
      value="submissions"
      className="w-full h-full p-2 flex flex-col gap-4"
    >
      <Tabs>
        <TabsList>
          <TabsTrigger value="your_submissions">Your submissions</TabsTrigger>
          <TabsTrigger value="friends_submissions">
            Friends submissions
          </TabsTrigger>
          <TabsTrigger value="General_submissions">
            General submissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="your_submissions">
          {yourSubmissions?.map((submission, i) => {
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
                <div className="border border-muted-foreground/20 px-2 text-sm  rounded-md">
                  <span className="underline text-primary text-base">
                    {submission.id}0000
                  </span>
                </div>

                {/* Submission Date */}
                <div className="flex items-center flex-col text-xs text-text/60">
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
                <span className="text-text/60">
                  {userProfile.username?.charAt(0)}
                  <span className="text-orange-500">
                    {userProfile.username?.slice(1)}
                  </span>
                </span>

                {/* problem title */}
                <span className="text-text/60">
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
          })}
        </TabsContent>
      </Tabs>
      {/* {yourSubmissions?.map((submission) => ( */}
      {/*   <div key={submission.id}> */}
      {/*     <p>{submission.user_answer}</p> */}
      {/*     <p>{submission.status}</p> */}
      {/*   </div> */}
      {/* ))} */}
    </TabsContent>
  );
};

export default ContestSubmissions;
