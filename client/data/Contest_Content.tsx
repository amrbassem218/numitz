import { FaLightbulb, FaBookOpen } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { MdContactSupport } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import { LuFileText } from "react-icons/lu";
import { GrGraphQl } from "react-icons/gr";
import { Calculator } from "lucide-react";

export const ProblemsTap = [
  { value: "problems", label: "Problems", icon: FaBook, color: "text-primary" },
  {
    value: "standings",
    label: "Standings",
    icon: MdLeaderboard,
    color: "text-secondary",
  },
  {
    value: "editorials",
    label: "Editorial",
    icon: FaLightbulb,
    color: "text-primary",
  },
  {
    value: "support",
    label: "Support",
    icon: MdContactSupport,
    color: "text-primary",
  },
];

export const MainTaps = [
  {
    value: "problemStatement",
    label: "Problem Statement",
    icon: FaBookOpen,
    color: "text-primary",
  },
  {
    value: "latexEditor",
    label: "Latex Editor",
    icon: LuFileText,
    color: "text-secondary",
  },
  {
    value: "graphingCalculator",
    label: "Graphing Calculator",
    icon: GrGraphQl,
    color: "text-primary",
  },
  {
    value: "scientificCalculator",
    label: "Scientific Calculator",
    icon: Calculator,
    color: "text-primary",
  },
];

export const difficultyStyle = "font-medium";
export const Difficulties = [
  // TODO: Add actual colors
  {
    value: "Hard",
    color: "text-red-500",
  },
  {
    value: "Easy",
    color: "text-blue-500",
  },
  {
    value: "Medium",
    color: "text-orange-500",
  },
];
