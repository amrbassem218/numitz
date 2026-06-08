"use client";

import { ActivityDay } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

interface Props {
  data: ActivityDay[];
}

function getIntensity(count: number, max: number): string {
  if (count === 0) return "bg-accent/20";
  const ratio = count / max;
  if (ratio > 0.75) return "bg-primary";
  if (ratio > 0.5) return "bg-primary/70";
  if (ratio > 0.25) return "bg-primary/40";
  return "bg-primary/20";
}

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function ActivityOverview({ data }: Props) {
  const { weeks, maxCount, monthMarkers } = useMemo(() => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    oneYearAgo.setDate(oneYearAgo.getDate() - oneYearAgo.getDay());

    const dayMap = new Map(data.map((d) => [d.date, d.count]));
    const max = Math.max(1, ...data.map((d) => d.count));

    const weekDays: { date: string; count: number }[][] = [];
    const months: { weekIndex: number; label: string }[] = [];
    const cursor = new Date(oneYearAgo);
    let currentWeek: { date: string; count: number }[] = [];
    let lastMonth = -1;
    let weekIndex = 0;

    while (cursor <= today) {
      const dateStr = cursor.toISOString().split("T")[0];
      const month = cursor.getMonth();

      if (month !== lastMonth) {
        months.push({ weekIndex, label: MONTH_LABELS[month] });
        lastMonth = month;
      }

      currentWeek.push({
        date: dateStr,
        count: dayMap.get(dateStr) ?? 0,
      });

      if (cursor.getDay() === 6) {
        weekDays.push(currentWeek);
        currentWeek = [];
        weekIndex++;
      }

      cursor.setDate(cursor.getDate() + 1);
    }
    if (currentWeek.length > 0) {
      weekDays.push(currentWeek);
    }

    return { weeks: weekDays, maxCount: max, monthMarkers: months };
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="border-separate" style={{ borderSpacing: "2px" }}>
            <thead>
              <tr>
                <td className="w-10" />
                {monthMarkers.map((m, i) => {
                  const colSpan =
                    i < monthMarkers.length - 1
                      ? monthMarkers[i + 1].weekIndex - m.weekIndex
                      : weeks.length - m.weekIndex;
                  return (
                    <td
                      key={m.label}
                      colSpan={colSpan}
                      className="text-[10px] text-muted-foreground pb-1"
                    >
                      {m.label}
                    </td>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => (
                <tr key={dayIdx}>
                  <td className="text-[10px] text-muted-foreground pr-1 leading-none align-middle">
                    {DAY_LABELS[dayIdx]}
                  </td>
                  {weeks.map((week, wi) => {
                    const day = week[dayIdx];
                    return (
                      <td key={wi}>
                        {day ? (
                          <div
                            className={`w-3 h-3 rounded-sm ${getIntensity(day.count, maxCount)}`}
                            title={`${day.date}: ${day.count} submissions`}
                          />
                        ) : (
                          <div className="w-3 h-3" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end gap-2 mt-3 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-accent/20" />
          <div className="w-3 h-3 rounded-sm bg-primary/20" />
          <div className="w-3 h-3 rounded-sm bg-primary/40" />
          <div className="w-3 h-3 rounded-sm bg-primary/70" />
          <div className="w-3 h-3 rounded-sm bg-primary" />
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
