"use client";
import { useProfile } from "@/app/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

interface Props {
  size?: "sm" | "md" | "lg";
}

const UserIcon = ({ size = "md" }: Props) => {
  const signOut = useProfile((state) => state.signOut);
  const userProfile = useProfile((state) => state.userProfile);
  
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm", 
    lg: "w-10 h-10 text-base",
  };
  
  return (
    <div>
      {userProfile?.id ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className={`${sizeClasses[size]} rounded-full bg-primary flex justify-center items-center uppercase text-white font-bold cursor-pointer`}>
              <img src={"/guest_user.svg"} className="w-full h-full object-cover rounded-full" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem
                className="text-danger"
                onClick={() => signOut()}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
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
