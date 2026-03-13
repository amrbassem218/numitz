"use client";
import { useUser } from "@/app/hooks/useUser";
import { useProblems, useProfile, useShownProblemId } from "@/app/store";
import SubmissionsTable from "@/components/Contest/submissionRow";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const [submissionType, setSubmissionType] = useState("your_submissions");
  return (
    <TabsContent
      value="submissions"
      className="w-full h-full p-2 flex flex-col gap-4"
    >
      <ScrollArea className="h-full">
        <Tabs
          className="h-full"
          defaultValue="your_submissions"
          value={submissionType}
          onValueChange={setSubmissionType}
        >
          <TabsList>
            <TabsTrigger value="your_submissions">Your submissions</TabsTrigger>
            {/* TODO: Implement Friends submissions */}

            {/* <TabsTrigger value="friends_submissions"> */}
            {/*   Friends submissions */}
            {/* </TabsTrigger> */}
            <TabsTrigger value="general_submissions">
              General submissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="your_submissions">
            <SubmissionsTable
              type="your_submissions"
              setSubmissionType={setSubmissionType}
            />
          </TabsContent>

          <TabsContent value="general_submissions">
            <SubmissionsTable
              type="general_submissions"
              setSubmissionType={setSubmissionType}
            />
          </TabsContent>
        </Tabs>
      </ScrollArea>
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
