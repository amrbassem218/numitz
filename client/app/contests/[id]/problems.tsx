import Problem_Card from "@/components/Contest/Problem_Card";
import { TabsContent } from "@/components/ui/tabs";
import { Contest, ContestProblem } from "@/types/types";
import { safeNumber } from "@/lib/utils";
import Image from "next/image";
import * as React from "react";
import { BsTag } from "react-icons/bs";

interface ContestProblemsProps {
  contest: Contest;
  problems: ContestProblem[];
  problemsStatus: Record<string, string>;
  onProblemSelect?: () => void;
  mediaPermissionsGranted?: boolean;
  requiresMediaPermissions?: boolean;
}

const ContestProblems: React.FunctionComponent<ContestProblemsProps> = ({
  contest,
  problems,
  problemsStatus,
  onProblemSelect,
  mediaPermissionsGranted = true,
  requiresMediaPermissions = false,
}) => {
  const isBlocked = requiresMediaPermissions && !mediaPermissionsGranted;

  return (
    <div>
      <TabsContent value="problems" className="p-4 flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-2xl">{contest.name}</h2>
          <div className="flex gap-1">
            <div className="bg-muted px-3 py-1 rounded-lg flex items-center justify-center">
              {/* TODO: Customize this to have multiple colors according to the difficulty */}
              <span className="text-destructive">
                {safeNumber(contest.difficulty)}
              </span>
            </div>
            <div className="bg-muted px-2 py-1 rounded-lg flex items-center gap-1 justify-center">
              <BsTag />
              <span>Topics</span>
            </div>
          </div>
        </div>

        {isBlocked ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="text-4xl">📺</div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Screen sharing, camera, and microphone access are required to view
              problems during this live contest.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 w-full py-2 pr-2">
            {problems.map((problem) => (
              <div key={problem.id} className="w-full">
                <Problem_Card
                  problem={problem}
                  problemsStatus={problemsStatus}
                  onProblemSelect={onProblemSelect}
                />
              </div>
            ))}
          </div>
        )}

        {/* Copyrights */}
        <section className="flex flex-col justify-center items-center gap-2">
          <div className="flex items-center text-xs">
            <Image
              src="/logo_mini_light_transparent.svg"
              alt="Logo"
              width={200}
              height={200}
              className="h-3 w-10 object-contain"
            />
            2026
          </div>
          <div className="flex flex-wrap justify-center items-center gap-3 text-xs">
            <button
              title="Im not a Link :>"
              className="text-primary border-b border-primary"
            >
              Terms of use
            </button>
            <button
              title="Im not a Link :>"
              className="text-primary border-b border-primary"
            >
              Cookie notice
            </button>
            <button
              title="Im not a Link :>"
              className="text-primary border-b border-primary"
            >
              Privacy policy
            </button>
          </div>
        </section>
      </TabsContent>
    </div>
  );
};

export default ContestProblems;
