import { FaRegNoteSticky } from "react-icons/fa6";
import { FiHelpCircle } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import ContestHeaderTimer from "./Contest/contestHeaderTimer";
import { TooltipTrigger, TooltipContent, Tooltip } from "./ui/tooltip";

type Props = {
  children: React.ReactNode;
};

export default function ComingSoon({ children }: Props) {
  return (
    <div className="flex items-center justify-center">
      <Tooltip>
        <TooltipTrigger asChild className="w-full h-full">
          {children}
        </TooltipTrigger>
        <TooltipContent className="bg-bg">
          <p className="text-text text-sm">Coming soon!!...</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
