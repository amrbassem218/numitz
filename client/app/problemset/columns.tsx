"use client";

import { contestProblem } from "@/types/types";
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
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
  },
];
