"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProblemStatus } from "@/types/types";
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
import { useEffect, Dispatch, SetStateAction } from "react";
import axios from "axios";
import { MathJaxContent } from "@/components/ui/MathJaxContent";
import { LatexStatement } from "@/components/ui/LatexStatement";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldError } from "../ui/field";
import { toast } from "sonner";
import { useProblems, useProfile, useShownProblemId } from "@/app/store";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";
import ComingSoon from "../comingSoon";
import { generateId } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ContestPhase } from "@/lib/contest";
interface Props {
  problemsStatus: Record<string, string>;
  setProblemsStatus: Dispatch<SetStateAction<Record<string, string>>>;
  contestPhase?: ContestPhase;
  mediaPermissionsGranted?: boolean;
  requiresMediaPermissions?: boolean;
}

const Problem_Statement_card = ({
  problemsStatus,
  setProblemsStatus,
  contestPhase = "practice",
  mediaPermissionsGranted = true,
  requiresMediaPermissions = false,
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
  const coreLoading = useProblems(
    (state) => state.problems[shownProblemId]?.coreLoading ?? false,
  );
  const router = useRouter();
  const updateSubmission = useProblems(
    (state) => state.updateProblemSubmissions,
  );
  const submissionsClosed = contestPhase === "upcoming";
  const saveInputToLocalStorage = (value: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`input-problem-${problemCore?.id}`, value);
    }
  };

  const onSubmit = async ({ answer: user_answer }: z.infer<typeof schema>) => {
    if (user_answer) {
      saveInputToLocalStorage(user_answer);
      // validation
      // TODO: Make this a pop up
      if (!userProfile?.id) {
        toast("You need to sign up first before completing this action", {
          action: {
            label: "Signup",
            onClick: () => router.push("/sign_up"),
          },
          cancel: {
            label: "Login",
            onClick: () => router.push("/sign_in"),
          },
        });
      } else if (submissionsClosed) {
        toast.error("Submissions are closed for this contest.");
      } else if (problemCore?.id) {
        const submission_data = {
          display_id: generateId(),
          problem_id: shownProblemId,
          user_answer,
          status: "idle" as ProblemStatus,
          profiles: {
            username: userProfile.username,
          },
          problems: {
            name: problemCore.name,
          },
          created_at: new Date(),
        };
        try {
          const res = await axios.post(
            `/api/problems/${problemCore.id}/submissions/${userProfile.id}`,
            {
              display_id: submission_data.display_id,
              user_answer: submission_data.user_answer,
            },
          );

          let status = res.data?.data?.status as ProblemStatus;

          updateSubmission({
            ...submission_data,
            ...res.data?.data,
            profiles: submission_data.profiles,
            problems: submission_data.problems,
          });

          setProblemsStatus((prev) => {
            const updated = {
              ...prev,
              [problemCore.id]: status,
            };
            return updated;
          });
          console.log("submission was successful, your status is: ", status);
        } catch (err) {
          console.error(err);
          if (axios.isAxiosError<{ error?: string }>(err)) {
            const message = err.response?.data?.error;
            if (message) {
              toast.error(message);
            } else {
              toast.error(
                "An error occurred while submitting. Please submit again, or try reconnecting.",
              );
            }
          } else {
            toast.error(
              "An error occurred while submitting. Please submit again, or try reconnecting.",
            );
          }
        }
      } else {
        toast.error(
          "Couldn't get the problem statement. Try refreshing or reconnecting",
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
  }, [problemCore, shownProblemId]);

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
  }, [form, problemCore]);

  // Block content when media permissions are required but not all granted
  const isBlocked = requiresMediaPermissions && !mediaPermissionsGranted;

  if (!shownProblemId) return null;

  return (
    <ScrollArea className="h-full">
      <TabsContent
        value="problemStatement"
        className="w-full max-w-3xl h-full mx-auto p-3 sm:p-4 my-0 sm:my-2 flex-col gap-4 flex items-center"
        key={problemCore?.id}
      >
        {isBlocked ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="text-4xl">📺</div>
            <h2 className="text-xl font-semibold text-muted-foreground">
              Media Access Required
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              You must grant screen sharing, camera, and microphone access to
              view problem statements and submit answers during this live
              contest.
            </p>
          </div>
        ) : (
          <>
            {/* Problem Header */}
            <div className="flex flex-col gap-2 mb-2 w-full">
              {coreLoading && !problemCore ? (
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="h-8 w-48" />
                  <div className="flex items-center justify-between gap-6 w-full max-w-sm mx-auto">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-center">
                    Problem {problemCore?.name ?? "UNKNOWN"}
                  </h1>

                  {/* Methods to access problem */}
                  <div className="flex items-center justify-between gap-6 w-full max-w-sm mx-auto text-primary">
                    {/* PDF access */}
                    <ComingSoon>
                      <button className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <FaRegFilePdf />
                          <span>PDF</span>
                        </div>
                        <FaExternalLinkAlt className="w-3 h-3" />
                      </button>
                    </ComingSoon>

                    {/* Latex access */}
                    <ComingSoon>
                      <button className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <LuFileText />
                          <span>Latex</span>
                        </div>
                        <FaExternalLinkAlt className="w-3 h-3" />
                      </button>
                    </ComingSoon>
                  </div>
                </>
              )}
            </div>

            <Separator className="bg-bg-light h-0.5! w-full" />

            {/* Problem Description & Submission */}
            <MathJaxContent className="flex flex-col gap-5 w-full">
              {/* Problem Description */}
              {coreLoading && !problemCore ? (
                <div className="flex flex-col gap-3 w-full">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-11/12" />
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              ) : (
                <LatexStatement
                  className="problem-statement-latex text-text text-base md:text-lg leading-relaxed whitespace-pre-wrap break-words"
                  value={problemCore?.description_latex || ""}
                />
              )}
            </MathJaxContent>
            {/* Problem Submission */}
            <form
              action=""
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full max-w-2xl flex flex-col sm:flex-row gap-3 sm:gap-4"
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
                      disabled={submissionsClosed || form.formState.isSubmitting}
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
              <Button
                type="submit"
                className="w-full sm:w-25 text-text"
                variant="primary"
                disabled={submissionsClosed || form.formState.isSubmitting}
              >
                Submit
              </Button>
            </form>
          </>
        )}
        <Separator className="bg-bg-light h-0.5! w-full" />

        {/* Help */}
        <div className="w-full flex flex-col items-start gap-4 ">
          {/* Show calculator */}
          <ComingSoon>
            <button className="text-primary underline">Show calculator</button>
          </ComingSoon>
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
