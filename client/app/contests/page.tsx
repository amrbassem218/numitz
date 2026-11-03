import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { HEADER_MARGIN } from "@/lib/utils";
import SuggestedContest from "@/components/Contest/suggestedContest";
import RegionalRanking from "./regionalRanking";
import Link from "next/link";
import { IoTrophy, IoFlash, IoAddCircle } from "react-icons/io5";

const navItems = [
  { label: "All Contests", icon: IoTrophy, href: "/contests", active: true },
  { label: "Live Now", icon: IoFlash, href: "/contests" },
  { label: "Create Contest", icon: IoAddCircle, href: "/create_contest" },
];

export default function Page() {
  return (
    <main
      style={{ height: `calc(100vh - ${HEADER_MARGIN}px)` }}
      className="max-w-full overflow-y-auto grid grid-cols-1 xl:grid-cols-24 bg-background"
    >
      {/* Left side bar */}
      <aside className="bg-background hidden xl:block col-span-4 max-w-60 border-r border-foreground/20 px-2 py-2">
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`h-12 flex items-center gap-2 px-4 rounded-sm font-semibold ${
                item.active ? "bg-bg-light" : "opacity-90 hover:bg-bg-light/60"
              }`}
            >
              <item.icon className="text-text w-4 h-4" />
              <span className="text-base">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="flex overflow-hidden my-4 mx-4">
          <Separator className="bg-foreground/20" />
        </div>
        <p className="px-4 text-sm text-muted-foreground leading-relaxed">
          Register for upcoming rounds, jump into live contests, or practice
          past ones any time.
        </p>
      </aside>

      {/* Main section */}
      <section className="px-3 sm:px-6 py-4 sm:py-6 col-span-1 xl:col-span-16 w-full max-w-270 mx-auto">
        <SuggestedContest />
      </section>

      {/* Right side bar */}
      <aside className="bg-background py-5 hidden xl:block col-span-4 mr-2 space-y-5">
        <Card className="gap-0 border-none rounded-md">
          <CardHeader className="font-medium">Calendar</CardHeader>
          <CardContent className="p-0">
            <Calendar className="w-full" />
          </CardContent>
        </Card>
        <Card className="gap-2 border-none rounded-md">
          <CardHeader className="font-medium">Top Rankings</CardHeader>
          <CardContent>
            <RegionalRanking />
          </CardContent>
        </Card>
      </aside>
    </main>
  );
}
