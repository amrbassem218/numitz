import { Trophy, TrendingUp, FileText } from "lucide-react";

interface Props {
  eloRating: number;
  contributionRating: number;
  blogsCount: number;
}

const stats = [
  { icon: Trophy, label: "ELO Rating", key: "elo" as const },
  { icon: TrendingUp, label: "Contribution", key: "contribution" as const },
  { icon: FileText, label: "Blogs", key: "blogs" as const },
];

export function StatsList({ eloRating, contributionRating, blogsCount }: Props) {
  const values: Record<string, number> = {
    elo: eloRating,
    contribution: contributionRating,
    blogs: blogsCount,
  };

  return (
    <div className="space-y-3">
      {stats.map(({ icon: Icon, label, key }) => (
        <div key={key} className="flex items-center gap-3 text-sm">
          <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">{label}</span>
          <span className="ml-auto font-semibold">{values[key]}</span>
        </div>
      ))}
    </div>
  );
}
