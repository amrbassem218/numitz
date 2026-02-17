"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Contest,
  contestProblem,
  FullProblem,
  ProblemCore,
  ProblemStatus,
} from "@/types/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { Separator } from "@radix-ui/react-separator";
import { TabsContent } from "@radix-ui/react-tabs";
import { ChevronsUpDown } from "lucide-react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaRegFilePdf } from "react-icons/fa6";
import { LuFileText } from "react-icons/lu";
import Problem_Card from "./Problem_Card";
import { useState, useEffect, use, Dispatch, SetStateAction } from "react";
import axios from "axios";
import { MathJaxContent } from "@/components/ui/MathJaxContent";
import parse from "html-react-parser";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { toast } from "sonner";
import { useUser } from "@/app/hooks/useUser";
import { useProblems, useProfile, useShownProblemId } from "@/app/store";
import { ScrollArea } from "../ui/scroll-area";
import { generateId } from "@/lib/utils";
interface Props {
  problemsStatus: Record<string, string>;
  setProblemsStatus: Dispatch<SetStateAction<Record<string, string>>>;
}

const Problem_Statement_card = ({
  problemsStatus,
  setProblemsStatus,
}: Props) => {
  const schema = z.object({
    // TODO: Add checkers for submission guioelines
    answer: z
      .string()
      .min(
        1,
        "You can't submit an empty field, enter at least 1 character to submit",
      )
      .max(
        200,
        "Answer is too long, pls review submission guidelines before submitting",
      ),
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      answer: "",
    },
  });
  const userProfile = useProfile((state) => state.userProfile);
  const shownProblemId = useShownProblemId((state) => state.shownProblemId);
  const problemCore = useProblems(
    (state) => state.problems[shownProblemId]?.core,
  );
  const updateSubmission = useProblems(
    (state) => state.updateProblemSubmissions,
  );
  const saveInputToLocalStorage = (value: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`input-problem-${problemCore?.id}`, value);
    }
  };

  const onSubmit = ({ answer: user_answer }: z.infer<typeof schema>) => {
    if (user_answer) {
      saveInputToLocalStorage(user_answer);
      // validation
      if (problemCore?.answer && problemCore.id && userProfile?.id) {
        let status: ProblemStatus = "idle";
        if (user_answer === problemCore.answer) {
          status = "success";
        } else {
          status = "failure";
        }
        const submission_data = {
          display_id: generateId(),
          problem_id: shownProblemId,
          user_answer,
          status,
          profiles: {
            username: userProfile.username,
          },
          problems: {
            name: problemCore.name,
          },
          created_at: new Date(),
        };
        updateSubmission(submission_data);
        axios
          .post(
            `/api/problems/${problemCore.id}/submissions/${userProfile.id}`,
            submission_data,
          )
          .then((res) => {
            if (res) {
              if (
                status === "success" ||
                problemsStatus[problemCore.id] === "success"
              ) {
                status = "success";
              }
              setProblemsStatus((prev) => {
                return { ...prev, [problemCore.id]: status };
              });
              console.log("submission was sucessful, your status is: ", status);
            }
          })
          .catch((err) => {
            console.error(err);
            toast.error(
              "An Error has occured while submitting pls submit again, or try reconnecting",
            );
          });
      } else {
        toast.error(
          "Couldn't get the problem answer. Try refreshing or reconnecting",
        );
      }
    }
  };

  useEffect(() => {
    if (shownProblemId) {
      if (!problemCore || shownProblemId !== problemCore?.id) {
        const getCore = () => {
          useProblems.getState().fetchCore(shownProblemId);
        };
        getCore();
      }
    }
  }, [shownProblemId]);

  useEffect(() => {
    if (problemCore) {
      const getInputFromLocalStorage = () => {
        if (typeof window !== "undefined") {
          const storedValue = localStorage.getItem(
            `input-problem-${problemCore?.id}`,
          );
          if (storedValue) {
            form.setValue("answer", storedValue);
          } else {
            form.setValue("answer", "");
          }
        }
      };
      getInputFromLocalStorage();
    }
  }, [problemCore]);

  if (!shownProblemId) return null;

  return (
    <ScrollArea className="h-full">
      <TabsContent
        value="problemStatement"
        className="w-150 h-full mx-auto p-4 my-2 flex-col gap-4 flex items-center"
        key={problemCore?.id}
      >
        {/* Problem Header */}
        <div className="flex flex-col gap-2 mb-2 w-full">
          <h1 className="text-2xl font-bold text-center">
            Problem {problemCore?.name ?? "UNKNOWN"}
          </h1>

          {/* Methods to access problem */}
          <div className="flex items-center gap-40 mx-auto text-primary">
            {/* PDF access */}
            <button className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <FaRegFilePdf />
                <span>PDF</span>
              </div>
              <FaExternalLinkAlt className="w-3 h-3" />
            </button>

            {/* Latex access */}
            <button className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <LuFileText />
                <span>Latex</span>
              </div>
              <FaExternalLinkAlt className="w-3 h-3" />
            </button>
          </div>
        </div>
        <Separator className="bg-bg-light h-0.5! w-full" />

        {/* Problem Description & Submission */}
        <MathJaxContent className="flex flex-col gap-5 w-full">
          {/* Problem Description */}
          <div className="">
            <p className="text-text text-sm">
              {parse(problemCore?.description_html || "")}
            </p>
          </div>
        </MathJaxContent>
        {/* Problem Submission */}
        <form
          action=""
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-2xl flex gap-4"
        >
          <Controller
            name="answer"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  id="answer"
                  aria-invalid={fieldState.invalid}
                  placeholder="Answer here..."
                  className="flex-1 border-none bg-bg-light! text-text-muted"
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  onBlur={(e) => {
                    saveInputToLocalStorage(e.target.value);
                    field.onBlur();
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button type="submit" className="w-25 text-text" variant="primary">
            Submit
          </Button>
        </form>
        <Separator className="bg-bg-light h-0.5! w-full" />

        {/* Help */}
        <div className="w-full flex flex-col items-start gap-4 ">
          {/* Show calculator */}
          <button className="text-primary underline">Show calculator</button>
          {/* How to submit */}
          <Collapsible className="flex flex-col gap-1">
            <CollapsibleTrigger className="" asChild>
              <button className="flex items-center gap-1">
                <span className="font-normal">How do I submit an answer?</span>
                <span className="underline text-primary">show here</span>
                <ChevronsUpDown className="w-5 h-5 text-primary" />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul role="list" className="list-disc text-text-muted pl-4">
                <li>Click on the problem you want to solve.</li>
                <li>Read the problem statement carefully.</li>
                <li>Submit your solution using the input box provided.</li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <Separator className="bg-bg-light h-0.5! w-full" />

        {/* Report a problem */}
        <div className="w-full flex justify-end">
          <button className="text-text-muted underline text-sm">
            Report a problem
          </button>
        </div>
      </TabsContent>
    </ScrollArea>
  );
};

export default Problem_Statement_card;
