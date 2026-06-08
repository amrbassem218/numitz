"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, BookOpen, User } from "lucide-react";
import { useProfile } from "@/app/store";

const navItems = [
  { name: "Contests", href: "/contests", icon: Trophy },
  { name: "Problem set", href: "/problemset", icon: BookOpen },
];

export default function MobileBottomBar() {
  const pathname = usePathname();
  const userProfile = useProfile((state) => state.userProfile);

  if (pathname.includes("/contests/")) return null;

  const profileHref = userProfile?.username
    ? `/profile/${userProfile.username}`
    : "/sign_in";

  return (
    <nav className="fixed bottom-0 left-0 w-full md:hidden z-50 bg-bg-dark/90 backdrop-blur-lg border-t border-border/50">
      <div className="flex items-center justify-around py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors duration-150 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] leading-none">{item.name}</span>
            </Link>
          );
        })}
        <Link
          href={profileHref}
          className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors duration-150 ${
            pathname.startsWith("/profile/")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User size={20} strokeWidth={pathname.startsWith("/profile/") ? 2.5 : 1.5} />
          <span className="text-[10px] leading-none">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
