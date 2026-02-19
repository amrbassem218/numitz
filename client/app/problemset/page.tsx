"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Fragment, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IoFolderOpen } from "react-icons/io5";
import { IoExtensionPuzzle } from "react-icons/io5";
import { FaGraduationCap } from "react-icons/fa";
import { useProfile } from "../store";
import { FaRegUserCircle } from "react-icons/fa";
import { DataTable } from "./data_table";
import { columns } from "./columns";
import { HEADER_MARGIN } from "@/lib/utils";
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
  const activeTabs = [
    {
      value: "library",
      label: "Library",
      icon: IoFolderOpen,
    },
    {
      value: "challenges",
      label: "Challenges",
      icon: IoExtensionPuzzle,
      announcementExists: true,
      announcement: {
        name: "New",
        colorStyling: "bg-primary text-text",
      },
    },
    {
      value: "courses",
      label: "Courses",
      icon: FaGraduationCap,
    },
  ];
  const [activeMainTab, setActiveMainTab] = useState<string>(
    activeTabs[0].value,
  );
  const user = useProfile((state) => state.user);
  return (
    <main
      style={{ height: `calc(100vh - ${HEADER_MARGIN}px)` }}
      className="max-w-full flex px-0 grid grid-cols-24 bg-background"
    >
      {/* Left side bar */}
      <aside className="bg-background hidden xl:block col-span-4 max-w-60 border-r border-foreground/20 px-2 py-2">
        <div className="flex w-full ">
          <Tabs
            defaultValue="problems"
            className="w-full"
            value={activeMainTab}
            onValueChange={setActiveMainTab}
          >
            <TabsList className="flex flex-col h-auto gap-2 w-full justify-start rounded-b-none bg-transparent">
              {activeTabs.map((tab) => (
                <div className="h-12 w-full">
                  <TabsTrigger
                    value={tab.value}
                    className={`w-full rounded-sm px-4 flex justify-start flex justify-between  ${activeMainTab == tab.value ? "bg-bg-light font-semibold" : "bg-transparent opacity-90 font-thin!"}`}
                  >
                    <div className="flex items-center gap-2">
                      <tab.icon className="text-text w-4 h-4" />
                      <h2 className="hidden md:inline text-base xl:text-md">
                        {tab.label}
                      </h2>
                    </div>
                    {tab?.announcementExists && (
                      <div
                        className={`px-4 py-1 rounded-lg flex items justify-between ${tab.announcement.colorStyling}`}
                      >
                        <span> {tab.announcement.name}</span>
                      </div>
                    )}
                  </TabsTrigger>
                </div>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className=" flex overflow-hidden my-4 mx-4">
          <Separator className="bg-foreground/20" />
        </div>

        {/* If user is not signed in prompt them to */}
        {!user && (
          <section className="w-3/4 mx-auto flex flex-col gap-2 items-center">
            <p className="text-md text-text font-extralight leading-relaxed text-center">
              Log in to view lists and track study progress
            </p>

            <Button className="bg-text text-bg rounded-lg" link="/sign_in">
              <FaRegUserCircle />
              Log In
            </Button>
          </section>
        )}
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
            <button className="mt-6 bg-black text-white px-5 py-3 rounded-xl text-sm w-fit hover:bg-gray-800 transition">
              Start Now
            </button>
          </div>

          <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-[22px] font-bold">Linear Algebra</h3>
              <p className="text-[14px] mt-2">30 Days Challenge</p>
            </div>
            <button className="mt-6 bg-white text-blue-600 px-5 py-3 rounded-xl text-sm w-fit hover:bg-gray-100 transition">
              Learn Now
            </button>
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
            <button className="mt-6 bg-white text-orange-600 px-5 py-3 rounded-xl text-sm w-fit hover:bg-gray-100 transition">
              Get Started
            </button>
          </div>
        </div>
        <div className="space-y-1.5">
          <DataTable columns={columns} data={problems} />
        </div>

        <div className=" flex overflow-hidden">
          <Separator orientation="vertical" className="bg-foreground/20" />
        </div>
      </section>

      {/* Right side bar */}
      <aside className="bg-background p-6 hidden xl:block col-span-4 max-w-70 justify-self-end mx-2">
        <h3 className="font-semibold mb-4 text-[15px]">Weekly Premium</h3>
        <div className="grid grid-cols-5 gap-2 mb-10">
          {["W1", "W2", "W3", "W4", "W5"].map((w, i) => (
            <div
              key={w}
              className={`p-3 rounded-xl text-center text-sm font-medium
                  ${i === 1 ? "bg-blue-600 text-white" : "bg-card "}`}
            >
              {w}
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-500 mb-4">
          <span>0</span>
          <span className="mx-2">•</span>
          <span>Incident</span>
          <span className="mx-2">•</span>
          <span>Rules</span>
        </div>

        <h3 className="font-semibold mb-4 text-[15px]">
          Trending Competitions
        </h3>

        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for competitions..."
              className="w-full bg-background text-sm py-2 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          {trendingCompetitions.map((comp, index) => (
            <div
              key={index}
              className="bg-background p-4 rounded-xl flex justify-between items-center hover:bg-card transition-colors"
            >
              <span className="text-[14px]">{comp.name}</span>
              <span className="font-bold text-[15px]">{comp.participants}</span>
            </div>
          ))}
        </div>
      </aside>
    </main>
  );
}
