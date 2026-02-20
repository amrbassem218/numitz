import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IoFolderOpen, IoSearch } from "react-icons/io5";
import { IoExtensionPuzzle } from "react-icons/io5";
import { FaGraduationCap } from "react-icons/fa";
import { useProfile } from "../store";
import { FaRegUserCircle } from "react-icons/fa";
import { DataTable } from "./data_table";
import { columns } from "./columns";
import { HEADER_MARGIN } from "@/lib/utils";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import ProblemSetsLeftBarBottomSection from "./leftBarBottomSection";
import ProblemSetLeftBarTopSection from "./leftBarTopSection";
import RsvpButton from "@/components/rsvpButton";
import { Suspense } from "react";
export default function LearningDashboard() {
  const problems = [
    {
      id: "ce985cb6-555a-4db0-b60b-67a230d76ed1",
      shownId: "2412D",
      name: "Euclidean Theory",
      precentage_solved: 84.2,
      difficulty: "Hard",
      contestId: "93ad77b8-2b6e-49f7-a0b9-796efa0f08fb",
      topics: [
        "calc ||",
        "Algebra",
        "Geomtry",
        "calc ||",
        "Algebra",
        "Geomtry",
      ],
    },
    {
      id: "ce985cb6-555a-4db0-b60b-67a230d76ed1",
      shownId: "412C",
      name: "Pythagoras Game",
      precentage_solved: 94.2,
      difficulty: "medium",
      contestId: "93ad77b8-2b6e-49f7-a0b9-796efa0f08fb",
      topics: [
        "calc ||",
        "Algebra",
        "Geomtry",
        "calc ||",
        "Algebra",
        "Geomtry",
      ],
    },
    {
      shownId: "712A",
      id: "ce985cb6-555a-4db0-b60b-67a230d76ed1",
      name: "Newton and rough planes",
      precentage_solved: 24.2,
      difficulty: "Easy",
      contestId: "93ad77b8-2b6e-49f7-a0b9-796efa0f08fb",
      topics: [
        "calc ||",
        "Algebra",
        "Geomtry",
        "calc ||",
        "Algebra",
        "Geomtry",
      ],
    },
    {
      shownId: "412C",
      id: "ce985cb6-555a-4db0-b60b-67a230d76ed1",
      name: "Einstein fights Newton",
      precentage_solved: 54.2,
      difficulty: "Hard",

      contestId: "93ad77b8-2b6e-49f7-a0b9-796efa0f08fb",
      topics: [
        "calc ||",
        "Algebra",
        "Geomtry",
        "calc ||",
        "Algebra",
        "Geomtry",
      ],
    },
    // { title: "Euclidean Theory", solved: "80.67%", diff: "Easy" },
    // { title: "Pythagoras Game", solved: "80.23%", diff: "Med." },
    // { title: "Newton and rough planes", solved: "97.45%", diff: "Hard" },
    // { title: "Einstein fights Newton", solved: "56%", diff: "Med." },
    // { title: "Einstein the flash", solved: "12.63%", diff: "Easy" },
    // { title: "Plank and his constant", solved: "74.05%", diff: "Med." },
    // { title: "Gojo's infinity limit", solved: "21.32%", diff: "Hard" },
  ];

  const trendingCompetitions = [
    { name: "Sat", participants: "123" },
    { name: "Kangaroo", participants: "345" },
    { name: "Shabola", participants: "341" },
  ];
  return (
    <main
      style={{ height: `calc(100vh - ${HEADER_MARGIN}px)` }}
      className="max-w-full flex px-0 grid grid-cols-24 bg-background"
    >
      {/* Left side bar */}
      <aside className="bg-background hidden xl:block col-span-4 max-w-60 border-r border-foreground/20 px-2 py-2">
        <ProblemSetLeftBarTopSection />
        <div className=" flex overflow-hidden my-4 mx-4">
          <Separator className="bg-foreground/20" />
        </div>

        <ProblemSetsLeftBarBottomSection />
      </aside>

      {/* Main section */}
      <section className="px-6 py-6 col-span-16 w-full max-w-270 mx-auto">
        {/* Suggested problemsets (ads) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="bg-linear-to-br from-gray-100 to-gray-200 text-black rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-[22px] font-bold">Challenge™</h3>
              <p className="text-[14px] mt-2 text-black/60">
                Turn calculus into gamified progress
              </p>
            </div>
            {/* TODO: Change back to start  */}
            <RsvpButton name="Calculus Challenge" />
          </div>

          <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-[22px] font-bold">Linear Algebra</h3>
              <p className="text-[14px] mt-2">30 Days Challenge</p>
            </div>
            <RsvpButton name="30 Days Challenge " />
          </div>
          <div className="bg-linear-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-[22px] font-bold">Top SAT Questions</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="px-2 py-1 bg-white/20 rounded text-xs font-medium">
                  DAY 30
                </div>
              </div>
            </div>
            <RsvpButton name="SAT Challenge" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Suspense fallback={<div>Loading...</div>}>
            <DataTable columns={columns} data={problems} />
          </Suspense>
        </div>

        <div className=" flex overflow-hidden">
          <Separator orientation="vertical" className="bg-foreground/20" />
        </div>
      </section>

      {/* Right side bar */}
      <aside className="bg-background  py-5 hidden xl:block col-span-4 mr-2 space-y-5">
        <Card className="gap-0 border-none rounded-md">
          {/* TODO: Change to actual streak */}
          <CardHeader className="font-medium flex line-clamp-2">
            Day 13{" "}
            <span className="font-normal text-xs text-muted-foreground">
              (since Sat Feb 7th 2026)
            </span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="">
              <Calendar className="w-full bg-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="gap-2 border-none rounded-md">
          <CardHeader>Trending Competitions</CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />

              <Input
                type="text"
                placeholder="Search for competitions..."
                className="w-full bg-bg-light text-sm py-2 pl-10 pr-4 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              {trendingCompetitions.map((comp) => (
                <div className="bg-bg-light px-2 gap-2 py-1 flex items-center justify-between w-fit rounded-md text-text/80">
                  <span className="text-sm">{comp.name}</span>
                  <div className="px-2 bg-primary rounded-md text-xs">
                    <span>{comp.participants}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </aside>
    </main>
  );
}
