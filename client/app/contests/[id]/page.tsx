"use client";
import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gauge, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hook/useIsMobile";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ContestHeader from "@/components/Contest/Header";
import { BsTag } from "react-icons/bs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MainTaps, ProblemsTap } from "@/data/Contest_Content";
import GraphCalculator from "@/components/Tools/Graph_Calc";
import Problem_Statement_card from "@/components/Contest/Problem_Statement_card";
import { GrUploadOption } from "react-icons/gr";
import axios from "axios";
import { Contest, contestProblem, FullProblem } from "@/types/types";
import Loading from "@/components/ui/Loading";
import ProblemCard from "@/components/Contest/Problem_Card";
import ContestSubmissions from "./submissions";
import ContestProblems from "./problems";
import ContestNotFound from "./contest_404";
import ContestError from "./contest_error";
import { useShownProblemId } from "@/app/store";
import ContestStandings from "./standings";
import ScientificCalc from "@/components/Contest/scientificCalc";

export default function Page() {
  const isMobile = useIsMobile();
  const { id: contest_id } = useParams();
  const router = useRouter();
  const contestParams = useSearchParams();
  const [showLevels, setShowLevels] = useState(false);

  const [contest, setContest] = useState<Contest | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [problems, setProblems] = useState<contestProblem[]>([]);
  const { shownProblemId, setShownProblemId } = useShownProblemId();
  const problemId = contestParams.get("problemId") || null;
  const [problemsStatus, setProblemsStatus] = useState<Record<string, string>>(
    {},
  );

  const bottomBarTabs = [
    {
      value: "submissions",
      label: "Submissions",
      icon: GrUploadOption,
      color: "text-secondary",
    },
  ];

  const [leftBarActiveTab, setLeftBarActiveTab] = useState("problems");
  const [bottomBarActiveTab, setBottomBarActiveTab] = useState("submissions");
  const [rightBarActiveTab, setRightBarActiveTab] =
    useState("problemStatement");
  const [expressions, setExpressions] = useState<any>(null);
  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`/api/contests/${contest_id}`);
        setContest(response.data);
      } catch (err: any) {
        console.error("Error fetching contest:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load contest. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContest();

    const fetchProblems = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `/api/contests/${contest_id}/problems`,
        );
        if (response && response.data) {
          if (!shownProblemId) {
            setShownProblemId(response.data[0].id);
          }
          const problemsTemp = response.data as contestProblem[];
          problemsTemp.sort((a: contestProblem, b: contestProblem) => {
            return a.index_in_contest - b.index_in_contest;
          });
          setProblems(problemsTemp);
        }
      } catch (err: any) {
        console.error("Error fetching problems:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load problems. Please try again.",
        );
      }
    };
    fetchProblems();
  }, [contest_id]);

  useEffect(() => {
    if (showLevels) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showLevels]);

  useEffect(() => {
    if (shownProblemId) {
      if (shownProblemId != contestParams.get("problemId")) {
        router.push(`?problemId=${shownProblemId}`);
      }
    }
  }, [shownProblemId]);

  // logging and importing problemsStatement to and from Local Storage
  let prevLocalStorage: Record<string, string> | null = null;
  useEffect(() => {
    if (Object.keys(problemsStatus).length > 0) {
      if (problemsStatus === prevLocalStorage) return;
      if (contest && typeof window !== "undefined") {
        localStorage.setItem(
          `problemsStatus-${contest.id}`,
          JSON.stringify(problemsStatus),
        );
      }
    } else {
      if (contest) {
        const data = localStorage.getItem(`problemsStatus-${contest.id}`);
        if (data) {
          prevLocalStorage = JSON.parse(data);
          setProblemsStatus(JSON.parse(data));
        }
      }
    }
  }, [problemsStatus, contest]);

  if (loading) return <Loading title="Contest Problem" />;

  if (error) {
    return <ContestError error={error} />;
  }

  if (!contest) {
    return <ContestNotFound />;
  }

  return (
    <main className="h-screen! max-h-screen! max-w-full! px-1 flex flex-col py-1">
      {/* Contest Header */}
      <ContestHeader />

      {/* Problems Navigator for phones */}
      {isMobile && (
        <div className="fixed top-32 left-4 w-fit flex justify-center mb-3 z-50">
          <Button
            variant="primary"
            onClick={() => setShowLevels((prev) => !prev)}
          >
            Problems
            <Gauge size={35} strokeWidth={3} />
          </Button>
        </div>
      )}

      {/* Problems List Screen for phones */}
      <div
        className={`fixed top-0 left-0 bg-background px-4  rounded-2xl w-full mb-4 flex flex-col justify-center items-center gap-3 h-screen duration-150 ${
          isMobile && showLevels ? "opacity-100 z-10" : "opacity-0 -z-10"
        }`}
      >
        <h2 className="font-semibold text-center mb-2 flex justify-center items-center gap-2">
          <Gauge size={25} strokeWidth={3} className="text-primary" /> Levels
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {problems.map((problem) => (
            <Button
              key={problem.id}
              onClick={() => {
                setShowLevels(false);
              }}
              className="justify-start text-2xl"
            >
              {problem.name}
            </Button>
          ))}
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex flex-1">
        {/* Left Sidebar for Desktop  */}
        {!isMobile && (
          <>
            <ResizablePanel defaultSize={30}>
              <section className="w-full h-full rounded-sm bg-card">
                <ScrollArea className="h-full" type="always">
                  <div className="h-full rounded-2xl w-full space-y-3">
                    <Tabs
                      defaultValue="problems"
                      className="w-full"
                      value={leftBarActiveTab}
                      onValueChange={setLeftBarActiveTab}
                    >
                      <TabsList className="flex w-full h-10 justify-start bg-bg-light rounded-b-none">
                        {ProblemsTap.map((tab, i) => (
                          <Fragment key={tab.value}>
                            <TabsTrigger
                              value={tab.value}
                              className="h-full rounded-none bg-transparent! max-w-fit"
                            >
                              <tab.icon className={`${tab.color} w-4 h-4`} />
                              <span className="hidden md:inline text-xs xl:text-sm">
                                {tab.label}
                              </span>
                            </TabsTrigger>

                            {i < ProblemsTap.length - 1 && (
                              <Separator
                                orientation="vertical"
                                className="h-4! bg-foreground/20"
                              />
                            )}
                          </Fragment>
                        ))}
                      </TabsList>

                      {/* Problems */}
                      {leftBarActiveTab == "problems" && (
                        <ContestProblems
                          contest={contest}
                          problems={problems}
                          problemsStatus={problemsStatus}
                        />
                      )}

                      {leftBarActiveTab == "standings" && (
                        <ContestStandings contestId={contest.id} />
                      )}
                    </Tabs>
                  </div>
                  <ScrollBar />
                </ScrollArea>
              </section>
            </ResizablePanel>
            <ResizableHandle className="w-2 bg-transparent hover:bg-sidebar-border/60" />
          </>
        )}

        {/* Right Sidebar */}
        <ResizablePanel defaultSize={isMobile ? 100 : 70}>
          <ResizablePanelGroup direction="vertical" className="flex flex-col">
            {/* Top-right section (problem statements) */}
            <ResizablePanel defaultSize={70}>
              <section className="w-full h-full rounded-sm bg-card">
                <Tabs
                  defaultValue="problemStatement"
                  className="w-full h-full"
                  value={rightBarActiveTab}
                  onValueChange={setRightBarActiveTab}
                >
                  <TabsList className="flex w-full h-10 justify-start bg-bg-light rounded-b-none">
                    {MainTaps.map((tab, i) => (
                      <Fragment key={tab.value}>
                        <TabsTrigger
                          value={tab.value}
                          className="h-full rounded-none bg-transparent! max-w-fit"
                        >
                          <tab.icon className={`${tab.color} w-4 h-4`} />
                          <span className="hidden md:inline text-xs xl:text-sm">
                            {tab.label}
                          </span>
                        </TabsTrigger>
                        {i < MainTaps.length - 1 && (
                          <Separator
                            orientation="vertical"
                            className="h-4! bg-foreground/20"
                          />
                        )}
                      </Fragment>
                    ))}
                  </TabsList>

                  <Problem_Statement_card
                    setProblemsStatus={setProblemsStatus}
                    problemsStatus={problemsStatus}
                  />

                  <TabsContent value="graphingCalculator">
                    <GraphCalculator
                      expressions={expressions}
                      setExpressions={setExpressions}
                    />
                  </TabsContent>

                  <TabsContent value="scientificCalculator">
                    <ScientificCalc />
                  </TabsContent>
                </Tabs>
              </section>
            </ResizablePanel>

            <ResizableHandle className="bg-transparent h-2! hover:bg-sidebar-border/60" />
            {/* Bottom-right section (Submissions) */}
            <ResizablePanel defaultSize={30}>
              <section className="w-full h-full rounded-sm bg-card">
                <Tabs
                  defaultValue="submissions"
                  className="w-full h-full"
                  value={bottomBarActiveTab}
                  onValueChange={setBottomBarActiveTab}
                >
                  <TabsList className="flex w-full h-10 justify-start bg-bg-light rounded-b-none">
                    {bottomBarTabs.map((tab, i) => (
                      <Fragment key={tab.value}>
                        <TabsTrigger
                          value={tab.value}
                          className="h-full rounded-none bg-transparent! max-w-fit"
                        >
                          <tab.icon className={`${tab.color} w-4 h-4`} />
                          <span className="hidden md:inline text-xs xl:text-sm">
                            {tab.label}
                          </span>
                        </TabsTrigger>
                        {i < bottomBarTabs.length - 1 && (
                          <Separator
                            orientation="vertical"
                            className="h-4! bg-foreground/20"
                          />
                        )}
                      </Fragment>
                    ))}
                  </TabsList>
                  <ContestSubmissions />
                </Tabs>
              </section>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
