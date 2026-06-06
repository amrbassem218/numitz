"use client";

import { RatingPoint } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import Link from "next/link";

interface Props {
  data: (RatingPoint & { contest_name?: string })[];
}

interface TooltipPayloadItem {
  payload: RatingPoint & { contest_name?: string; _prevRating?: number | null };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const prev = payload[0].payload._prevRating;
  const diff = prev != null ? d.rating - prev : 0;
  const diffColor = diff >= 0 ? "text-green-500" : "text-red-500";
  const diffSign = diff >= 0 ? "+" : "";

  return (
    <div className="bg-card border rounded-lg p-3 shadow-lg text-sm space-y-1">
      <p className="text-muted-foreground text-xs">
        {format(new Date(d.created_at), "MMM d, yyyy")}
      </p>
      <p className="font-semibold">Rating: {d.rating}</p>
      {prev != null && (
        <p className={diffColor}>
          {diffSign}{diff}
        </p>
      )}
      {d.contest_name && (
        <Link
          href={`/contests/${d.contest_id}`}
          className="text-primary hover:underline text-xs block"
        >
          {d.contest_name}
        </Link>
      )}
    </div>
  );
}

export function RatingGraph({ data }: Props) {
  if (data.length === 0) return null;

  const enriched = data.map((p, i) => ({
    ...p,
    _prevRating: i > 0 ? data[i - 1].rating : null,
  }));

  const minRating = Math.min(...data.map((p) => p.rating)) - 100;
  const maxRating = Math.max(...data.map((p) => p.rating)) + 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rating</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={enriched}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis
                dataKey="created_at"
                tickFormatter={(v) => format(new Date(v), "MMM yy")}
                className="text-xs text-muted-foreground"
                tick={{ fontSize: 11 }}
              />
              <YAxis
                domain={[minRating, maxRating]}
                className="text-xs text-muted-foreground"
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
