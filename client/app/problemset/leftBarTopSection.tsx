import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { IoFolderOpen } from "react-icons/io5";
import { IoExtensionPuzzle } from "react-icons/io5";
import { FaGraduationCap } from "react-icons/fa";
type Props = {};

export default function ProblemSetLeftBarTopSection({}: Props) {
  const activeTabs = [
    {
      value: "library",
      label: "Library",
      icon: IoFolderOpen,
      availabe: true,
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
      availabe: false,
    },
    {
      value: "courses",
      label: "Courses",
      icon: FaGraduationCap,
      availabe: false,
    },
  ];
  return (
    <div className="flex w-full ">
      <Tabs defaultValue="library" className="w-full">
        <TabsList className="flex flex-col h-auto gap-2 w-full justify-start rounded-b-none bg-transparent">
          {activeTabs.map((tab) => (
            <div className="h-12 w-full">
              <TabsTrigger
                value={tab.value}
                className={`w-full rounded-sm px-4 flex justify-start flex justify-between  bg-transparent opacity-90 font-thin!} data-[state=active]:bg-bg-light font-semibold `}
                disabled
              >
                <div className="flex items-center gap-2">
                  <tab.icon className="text-text w-4 h-4" />
                  <h2 className="hidden md:inline text-base xl:text-md">
                    {tab.label}
                  </h2>
                </div>
                {tab?.availabe == false && (
                  <div
                    className={`px-2 py-1 rounded-lg flex items justify-between bg-primary`}
                  >
                    <span>Soon</span>
                  </div>
                )}
              </TabsTrigger>
            </div>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
