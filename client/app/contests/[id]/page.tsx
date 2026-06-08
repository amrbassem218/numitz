"use client";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hook/useIsMobile";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ContestHeader from "@/components/Contest/Header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MainTaps, ProblemsTap } from "@/data/Contest_Content";
import GraphCalculator from "@/components/Tools/Graph_Calc";
import Problem_Statement_card from "@/components/Contest/Problem_Statement_card";
import { GrUploadOption } from "react-icons/gr";
import axios from "axios";
import { Contest, ContestProblem } from "@/types/types";
import Loading from "@/components/ui/Loading";
import ContestSubmissions from "./submissions";
import ContestProblems from "./problems";
import ContestNotFound from "./contest_404";
import ContestError from "./contest_error";
import { useShownProblemId, useProfile } from "@/app/store";
import ContestStandings from "./standings";
import ScientificCalc from "@/components/Contest/scientificCalc";
import ComingSoon from "@/components/comingSoon";
import { getContestMode, getContestPhase } from "@/lib/contest";
import MediaPermissionsOverlay from "@/components/Contest/ScreenRecordingOverlay";
import { useMediaPermissions, type MediaPermissionType } from "@/app/hooks/useScreenRecording";

const bottomBarTabs = [
  {
    value: "submissions",
    label: "Submissions",
    icon: GrUploadOption,
    color: "text-secondary",
  },
];

export default function Page() {
  const isMobile = useIsMobile();
  const { id: contest_id } = useParams();
  const router = useRouter();
  const contestParams = useSearchParams();

  const user = useProfile((state) => state.user);

  const [contest, setContest] = useState<Contest | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const recordingConfig = useMemo(
    () => (user?.id ? { contestId: contest_id as string, userId: user.id } : null),
    [user?.id, contest_id],
  );

  const {
    permissions: mediaPermissions,
    allGranted: mediaAllGranted,
    error: mediaError,
    errorPermission: mediaErrorPermission,
    requestAll: requestAllMedia,
    stopAll: stopAllMedia,
    dismissError: dismissMediaError,
    screenSharingSupported,
  } = useMediaPermissions(recordingConfig);

  const requiredPermissions: MediaPermissionType[] = useMemo(() => {
    return screenSharingSupported
      ? ["screen", "camera", "microphone"]
      : ["camera", "microphone"];
  }, [screenSharingSupported]);

  const isLive = useMemo(() => {
    if (!contest) return false;
    const now = new Date();
    const start = new Date(contest.start_date);
    const end = new Date(contest.end_date);
    return start <= now && now < end;
  }, [contest]);

  const requiresMediaPermissions = isLive;

  const [hasAttemptedPermissions, setHasAttemptedPermissions] = useState(false);

  const [now, setNow] = useState(() => new Date());
  const contestPhase = contest
    ? getContestPhase(contest, now)
    : "practice";
  const contestMode = getContestMode(contest);
  const needsAuth = contestMode === "live" && contestPhase === "live";

  const handleRequestMedia = useCallback(async () => {
    setHasAttemptedPermissions(true);
    const success = await requestAllMedia();
    return success;
  }, [requestAllMedia]);

  useEffect(() => {
    if (!requiresMediaPermissions || hasAttemptedPermissions) return;
    if (needsAuth && !user) return;
    handleRequestMedia();
  }, [requiresMediaPermissions, hasAttemptedPermissions, handleRequestMedia, needsAuth, user]);

  // No additional re-prompt logic needed — when allGranted flips to false
  // while requiresMediaPermissions is true, the overlay shows automatically
  const [problems, setProblems] = useState<ContestProblem[]>([]);
  const { shownProblemId, setShownProblemId } = useShownProblemId();
  const problemId = contestParams.get("problemId") ?? null;
  const previousProblemIdParam = useRef<string | null>(null);
  const [problemsStatus, setProblemsStatus] = useState<Record<string, string>>(
    {},
  );

  const [leftBarActiveTab, setLeftBarActiveTab] = useState("problems");
  const [bottomBarActiveTab, setBottomBarActiveTab] = useState("submissions");
  const [rightBarActiveTab, setRightBarActiveTab] =
    useState("problemStatement");
  const [mobileActiveTab, setMobileActiveTab] = useState("problemStatement");
  const [expressions, setExpressions] = useState<unknown>(null);
  const activeTabParam = contestParams.get("tab");
  const leftBarTabValues = useMemo(
    () =>
      ProblemsTap.filter((tab) => tab.status !== "coming soon").map(
        (tab) => tab.value,
      ),
    [],
  );
  const rightBarTabValues = useMemo(
    () =>
      MainTaps.filter((tab) => tab.status !== "coming soon").map(
        (tab) => tab.value,
      ),
    [],
  );
  const bottomBarTabValues = useMemo(
    () => bottomBarTabs.map((tab) => tab.value),
    [],
  );
  const mobileTabValues = useMemo(
    () => [
      "problemStatement",
      ...leftBarTabValues,
      ...rightBarTabValues,
      ...bottomBarTabValues,
    ],
    [bottomBarTabValues, leftBarTabValues, rightBarTabValues],
  );
  const prevLocalStorage = useRef<Record<string, string> | null>(null);
  const canLoadContestProblems =
    contestMode === "practice" || (contestPhase === "live" && !!user) || contestPhase === "ended";

  const pushTabParam = (tab: string) => {
    const params = new URLSearchParams(contestParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const changeLeftBarTab = (tab: string) => {
    setLeftBarActiveTab(tab);
    pushTabParam(tab);
  };

  const changeRightBarTab = (tab: string) => {
    setRightBarActiveTab(tab);
    pushTabParam(tab);
  };

  const changeBottomBarTab = (tab: string) => {
    setBottomBarActiveTab(tab);
    pushTabParam(tab);
  };

  const changeMobileTab = (tab: string) => {
    setMobileActiveTab(tab);
    pushTabParam(tab);
  };
  const getErrorMessage = (err: unknown, fallback: string) => {
    if (axios.isAxiosError<{ message?: string; error?: string }>(err)) {
      return err.response?.data?.message || err.response?.data?.error || fallback;
    }

    return fallback;
  };
  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`/api/contests/${contest_id}`);
        setContest(response.data);
      } catch (err: unknown) {
        console.error("Error fetching contest:", err);
        setError(
          getErrorMessage(err, "Failed to load contest. Please try again."),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [contest_id]);

  useEffect(() => {
    if (!contest || contestMode !== "live") return;

    if (needsAuth && !user) {
      router.push("/sign_in");
    }

    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [contest, contestMode, needsAuth, user, router]);

  useEffect(() => {
    if (!contest || !canLoadContestProblems) return;

    let ignore = false;

    const fetchProblems = async () => {
      try {
        setError(null);

        const response = await axios.get(
          `/api/contests/${contest_id}/problems`,
        );
        if (!ignore && response?.data) {
          setProblems(response.data as ContestProblem[]);
        }
      } catch (err: unknown) {
        if (!ignore) {
          console.error("Error fetching problems:", err);
          setError(
            getErrorMessage(err, "Failed to load problems. Please try again."),
          );
        }
      }
    };
    fetchProblems();

    return () => {
      ignore = true;
    };
  }, [canLoadContestProblems, contest, contest_id]);



  useEffect(() => {
    if (!canLoadContestProblems || problems.length === 0) return;

    const hasProblem = (id: string | null) =>
      Boolean(id && problems.some((problem) => problem.id === id));
    const problemIdParamChanged = previousProblemIdParam.current !== problemId;
    previousProblemIdParam.current = problemId;

    const urlProblemId = hasProblem(problemId) ? problemId : null;
    const selectedProblemId = hasProblem(shownProblemId)
      ? shownProblemId
      : null;
    const nextProblemId =
      problemIdParamChanged && urlProblemId
        ? urlProblemId
        : selectedProblemId ?? urlProblemId ?? problems[0].id;

    if (!nextProblemId) return;

    if (shownProblemId !== nextProblemId) {
      setShownProblemId(nextProblemId);
    }

    if (problemId !== nextProblemId) {
      const params = new URLSearchParams(contestParams.toString());
      params.set("problemId", nextProblemId);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [
    canLoadContestProblems,
    contestParams,
    problemId,
    problems,
    router,
    setShownProblemId,
    shownProblemId,
  ]);

  useEffect(() => {
    if (!activeTabParam) return;

    if (mobileTabValues.includes(activeTabParam)) {
      setMobileActiveTab(activeTabParam);
    }

    if (leftBarTabValues.includes(activeTabParam)) {
      setLeftBarActiveTab(activeTabParam);
    }

    if (rightBarTabValues.includes(activeTabParam)) {
      setRightBarActiveTab(activeTabParam);
    }

    if (bottomBarTabValues.includes(activeTabParam)) {
      setBottomBarActiveTab(activeTabParam);
    }
  }, [
    activeTabParam,
    bottomBarTabValues,
    leftBarTabValues,
    mobileTabValues,
    rightBarTabValues,
  ]);

  // logging and importing problemsStatement to and from Local Storage
  useEffect(() => {
    if (Object.keys(problemsStatus).length > 0) {
      if (problemsStatus === prevLocalStorage.current) return;
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
          prevLocalStorage.current = JSON.parse(data);
          setProblemsStatus(JSON.parse(data));
        }
      }
    }
  }, [problemsStatus, contest]);

  if (loading) return <Loading title="Contest Problem" />;

  // In live mode, show permissions overlay when any permission is not granted
  // (but only after auth state is resolved — auth handlers redirect to /sign_in)
  if (requiresMediaPermissions && !mediaAllGranted && (!needsAuth || user)) {
    return (
      <>
        <MediaPermissionsOverlay
          permissions={mediaPermissions}
          error={mediaError}
          errorPermission={mediaErrorPermission}
          onRequestAll={handleRequestMedia}
          onDismissError={dismissMediaError}
          requiredPermissions={requiredPermissions}
        />
        {/* Show a minimal background while waiting */}
        <main className="h-screen! max-h-screen! max-w-full! px-1 flex flex-col py-1">
          <ContestHeader contest={contest!} />
        </main>
      </>
    );
  }

  if (error) {
    return <ContestError error={error} />;
  }

  if (!contest) {
    return <ContestNotFound />;
  }

  // For live upcoming contests, show a waiting state
  if (contestMode === "live" && contestPhase === "upcoming") {
    return (
      <main className="h-[100svh] max-w-full px-2 py-1 flex flex-col overflow-hidden">
        <ContestHeader contest={contest} />
        <section className="flex flex-1 items-center justify-center rounded-sm bg-card">
          <div className="max-w-md text-center space-y-2">
            <h1 className="text-2xl font-bold">{contest.name}</h1>
            <p className="text-muted-foreground">
              This live contest has not started yet.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (isMobile) {
    return (
      <main className="h-[100svh] max-w-full px-2 py-1 flex flex-col overflow-hidden">
        <ContestHeader contest={contest} />

        <Tabs
          value={mobileActiveTab}
          onValueChange={changeMobileTab}
          className="min-h-0 flex-1 flex flex-col rounded-sm bg-card"
        >
          <ScrollArea className="w-full shrink-0 border-b border-border/50">
            <TabsList className="flex h-11 w-max min-w-full justify-start rounded-none bg-bg-light px-1">
              <TabsTrigger value="problemStatement" className="h-9 shrink-0">
                Statement
              </TabsTrigger>
              <TabsTrigger value="problems" className="h-9 shrink-0">
                Problems
              </TabsTrigger>
              <TabsTrigger value="standings" className="h-9 shrink-0">
                Standings
              </TabsTrigger>
              <TabsTrigger value="submissions" className="h-9 shrink-0">
                Submissions
              </TabsTrigger>
              <ComingSoon disabled={false}>
                <TabsTrigger
                  value="graphingCalculator"
                  className="h-9 shrink-0"
                  disabled
                >
                  Graph
                </TabsTrigger>
              </ComingSoon>
              <ComingSoon disabled={false}>
                <TabsTrigger
                  value="scientificCalculator"
                  className="h-9 shrink-0"
                  disabled
                >
                  Calc
                </TabsTrigger>
              </ComingSoon>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <div className="min-h-0 flex-1 overflow-hidden">
            <Problem_Statement_card
              setProblemsStatus={setProblemsStatus}
              problemsStatus={problemsStatus}
              contestPhase={contestPhase}
              mediaPermissionsGranted={mediaAllGranted}
              requiresMediaPermissions={requiresMediaPermissions}
            />

            {mobileActiveTab == "problems" && (
              <ScrollArea className="h-full">
                <ContestProblems
                  contest={contest}
                  problems={problems}
                  problemsStatus={problemsStatus}
                  onProblemSelect={() => changeMobileTab("problemStatement")}
                  mediaPermissionsGranted={mediaAllGranted}
                  requiresMediaPermissions={requiresMediaPermissions}
                />
              </ScrollArea>
            )}

            {mobileActiveTab == "standings" && (
                    <ContestStandings contestId={contest.id} problems={problems} contestStartDate={contest.start_date as unknown as string} />
            )}

            <ContestSubmissions contestPhase={contestPhase} />

            <TabsContent value="graphingCalculator" className="h-full m-0">
              <GraphCalculator
                expressions={expressions}
                setExpressions={setExpressions}
              />
            </TabsContent>

            <TabsContent value="scientificCalculator" className="h-full m-0">
              <ScientificCalc />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    );
  }

  return (
    <main className="h-screen! max-h-screen! max-w-full! px-1 flex flex-col py-1">
      {/* Contest Header */}
      <ContestHeader contest={contest} />

      <ResizablePanelGroup direction="horizontal" className="flex flex-1">
        {/* Left Sidebar for Desktop  */}
        {!isMobile && (
          <>
            <ResizablePanel defaultSize={30}>
              <section className="w-full h-full rounded-sm bg-card flex flex-col min-h-0">
                <Tabs
                  defaultValue="problems"
                  className="w-full flex flex-col min-h-0"
                  value={leftBarActiveTab}
                  onValueChange={changeLeftBarTab}
                >
                  <TabsList className="flex w-full h-10 shrink-0 justify-start bg-bg-light rounded-b-none">
                    {ProblemsTap.map((tab, i) => (
                      <Fragment key={tab.value}>
                        <ComingSoon disabled={tab.status != "coming soon"}>
                          <TabsTrigger
                            value={tab.value}
                            className="h-full rounded-none bg-transparent! max-w-fit"
                            disabled={tab.status == "coming soon"}
                          >
                            <tab.icon className={`${tab.color} w-4 h-4`} />
                            <span className="hidden md:inline text-xs xl:text-sm">
                              {tab.label}
                            </span>
                          </TabsTrigger>
                        </ComingSoon>
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
                    <div className="flex-1 min-h-0 overflow-auto">
                      <ContestProblems
                        contest={contest}
                        problems={problems}
                        problemsStatus={problemsStatus}
                        mediaPermissionsGranted={mediaAllGranted}
                        requiresMediaPermissions={requiresMediaPermissions}
                      />
                    </div>
                  )}

                  {leftBarActiveTab == "standings" && (
              <ContestStandings contestId={contest.id} problems={problems} contestStartDate={contest.start_date as unknown as string} />
                  )}
                </Tabs>
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
                  onValueChange={changeRightBarTab}
                >
                  <TabsList className="flex w-full h-10 justify-start bg-bg-light rounded-b-none">
                    {MainTaps.map((tab, i) => (
                      <Fragment key={tab.value}>
                        <ComingSoon disabled={tab.status != "coming soon"}>
                          <TabsTrigger
                            value={tab.value}
                            className="h-full rounded-none bg-transparent! max-w-fit"
                            disabled={tab.status == "coming soon"}
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
                        </ComingSoon>
                      </Fragment>
                    ))}
                  </TabsList>

                  <Problem_Statement_card
                    setProblemsStatus={setProblemsStatus}
                    problemsStatus={problemsStatus}
                    contestPhase={contestPhase}
                    mediaPermissionsGranted={mediaAllGranted}
                    requiresMediaPermissions={requiresMediaPermissions}
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
                  onValueChange={changeBottomBarTab}
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
                  <ContestSubmissions contestPhase={contestPhase} />
                </Tabs>
              </section>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
