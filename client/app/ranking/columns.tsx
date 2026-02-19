"use client";

import { Difficulties, difficultyStyle } from "@/data/Contest_Content";
import { cleanStr, styleUsername } from "@/lib/utils";
import {
  contestProblem,
  Difficulty,
  Ranking,
  Ranking_title,
  Ranking_title_short,
} from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import parse from "html-react-parser";
export interface UserRank {
  userId?: string;
  username?: string;
  userRating: number;
  ranking: Ranking;
}
export const rankingColumns: ColumnDef<UserRank>[] = [
  {
    accessorKey: "rank",
    header: "Rank",
    cell: ({ row }) => {
      return (
        <span className="underline text-primary">{row.original.userId}</span>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4 w-full">
          <p>
            {parse(
              styleUsername(
                row.original.username ?? "Guest",
                row.original.ranking.color,
              ),
            )}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      return (
        <span className="text-text/60">{row.original.ranking.rating}</span>
      );
    },
  },
];
