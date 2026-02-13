"use client";

import { Difficulties, difficultyStyle } from "@/data/Contest_Content";
import { cleanStr } from "@/lib/utils";
import { contestProblem, Difficulty } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
export interface ProblemSetProblem {
  id: string;
  name: string;
  precentage_solved: number;
  difficulty: string;
  topics: string[];
}
export const columns: ColumnDef<ProblemSetProblem>[] = [
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => {
      return <span className="underline text-primary">{row.original.id}</span>;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const topics = row.original.topics ?? [];
      return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4 w-full">
          <span className="font-medium truncate">{row.original.name}</span>
          <div className="flex flex-wrap gap-1">
            {topics.map((topic, i) => (
              <span key={i} className="text-xs text-muted-foreground">
                {topic}
                {i != topics.length - 1 && ", "}
              </span>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "precentage_solved",
    header: "% people solved",
    cell: ({ row }) => {
      return (
        <span className="text-text/60">{row.original.precentage_solved}%</span>
      );
    },
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as string;
      const b = rowB.getValue(columnId) as string;
      const minA = Difficulties.filter(
        ({ value }) => cleanStr(value) === cleanStr(a),
      )[0].min;
      const minB = Difficulties.filter(
        ({ value }) => cleanStr(value) === cleanStr(b),
      )[0].min;
      return minA - minB;
    },
    cell: ({ row }) => {
      let difficulty = row.original.difficulty;
      difficulty = `${difficulty.charAt(0).toUpperCase()}${difficulty.slice(1)}`;
      const DifficultyAccess = Difficulties.filter(
        ({ value }) => cleanStr(value) == cleanStr(difficulty),
      )[0];
      const color = DifficultyAccess?.color;
      const styles = difficultyStyle;
      if (difficulty.length > 4) difficulty = difficulty.slice(0, 3) + ".";
      return (
        <span className={`${styles} ${color} text-base`}>{difficulty}</span>
      );
    },
  },
];
