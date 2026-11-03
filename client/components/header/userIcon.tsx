"use client";
import { useProfile } from "@/app/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  ListChecks,
  LogOut,
  PlusCircle,
  Trophy,
  User,
} from "lucide-react";

interface Props {
  size?: "sm" | "md" | "lg";
}

const UserIcon = ({ size = "md" }: Props) => {
  const signOut = useProfile((state) => state.signOut);
  const userProfile = useProfile((state) => state.userProfile);
  const router = useRouter();
  const fullName = [userProfile?.first_name, userProfile?.last_name]
    .filter(Boolean)
    .join(" ");

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  return (
    <div>
      {userProfile?.id ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/60 transition-shadow hover:ring-2 hover:ring-primary/40">
            <div className={`${sizeClasses[size]} rounded-full bg-primary flex justify-center items-center uppercase text-white font-bold cursor-pointer overflow-hidden`}>
              <img
                src={userProfile.image_url ?? "/guest_user.svg"}
                className="w-full h-full object-cover rounded-full"
                alt={userProfile.username ?? ""}
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-1.5 bg-card border-foreground/10 shadow-xl shadow-black/40">
            <DropdownMenuLabel className="flex items-center gap-3 p-2 font-normal rounded-md bg-bg-light/50">
              <img
                src={userProfile.image_url ?? "/guest_user.svg"}
                className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-primary/50"
                alt=""
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  {userProfile.username}
                </p>
                {fullName && (
                  <p className="text-xs text-muted-foreground truncate">
                    {fullName}
                  </p>
                )}
                {userProfile.email && (
                  <p className="text-xs text-muted-foreground truncate">
                    {userProfile.email}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-foreground/10" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="focus:bg-primary/15 focus:text-foreground [&_svg:not([class*='text-'])]:focus:text-primary" onClick={() => router.push(`/profile/${userProfile.username}`)}>
                <User /> Your profile
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-primary/15 focus:text-foreground [&_svg:not([class*='text-'])]:focus:text-primary" onClick={() => router.push("/create_contest")}>
                <PlusCircle /> Create contest
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-foreground/10" />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-[11px] uppercase tracking-wider font-medium px-2">
                Explore
              </DropdownMenuLabel>
              <DropdownMenuItem className="focus:bg-primary/15 focus:text-foreground [&_svg:not([class*='text-'])]:focus:text-primary" onClick={() => router.push("/contests")}>
                <Trophy /> Contests
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-primary/15 focus:text-foreground [&_svg:not([class*='text-'])]:focus:text-primary" onClick={() => router.push("/problemset")}>
                <ListChecks /> Problemset
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-primary/15 focus:text-foreground [&_svg:not([class*='text-'])]:focus:text-primary" onClick={() => router.push("/ranking")}>
                <BarChart3 /> Ranking
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-foreground/10" />
            <DropdownMenuItem variant="destructive" className="focus:bg-destructive/15" onClick={() => signOut()}>
              <LogOut /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2">
          <Button variant={"primary"} link="/sign_up" className={`${size === "sm" ? "text-[10px] px-2 py-0 h-6" : size === "md" ? "text-xs py-1 h-7" : "text-sm py-2 h-8"}`}>
            Sign Up
          </Button>
          <Button variant={"outline"} link="/sign_in" className={`${size === "sm" ? "text-[10px] px-2 py-0 h-6" : size === "md" ? "text-xs py-1 h-7" : "text-sm py-2 h-8"}`}>
            Sign in
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserIcon;
