"use client";
import { MainLinks } from "@/data/Links";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Logs, Plus, Send, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useProfile } from "@/app/store";
import { Input } from "./ui/input";
import { HeaderType } from "@/types/types";
interface Props {
  type: HeaderType;
}
const Navbar = ({ type }: Props) => {
  const pathName = usePathname();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const userProfile = useProfile((state) => state.userProfile);
  useEffect(() => {
    console.log("userprofile: ", userProfile);
  }, [userProfile]);
  return (
    <nav
      className={`fixed top-0 left-0 w-full px-4 py-2 flex  ${type === "short" ? "justify-around" : type === "long" ? "justify-between" : ""} items-center gap-5 z-50 bg-bg-dark`}
    >
      <div className="flex items-center gap-3">
        <Link href="/">
          <h5 className="font-bold! flex items-end justify-end z-50">
            <div className="flex justify-end items-end">
              <h4 className="font-bold!">N</h4>UM
            </div>

            <div className="flex items-start gap-px">
              <div className="flex flex-col justify-center items-center gap-0.5">
                <Plus strokeWidth={6} size={10} className="text-primary" />
                <div className="w-1  h-2.5 bg-foreground" />
              </div>
              TZ
            </div>
          </h5>
        </Link>

        <div className="hidden md:flex">
          {MainLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`mx-3 text-base hover:text-primary duration-100 ${
                pathName === link.href
                  ? "text-primary "
                  : "text-neutral-700 dark:text-neutral-300 "
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-4 w-1/4">
        <Input placeholder="Search for something..." />
        <Settings />
        {userProfile ? (
          <div className="w-10 h-10 rounded-full bg-primary flex justify-center items-center uppercase text-white text-sm font-bold cursor-pointer">
            {userProfile.username
              ? userProfile.username.charAt(0).toUpperCase()
              : ""}
          </div>
        ) : (
          <Button variant={"primary"} link="/sign_up">
            Sign Up
          </Button>
        )}
        <Button
          variant={"outline"}
          onClick={() => setOpenMenu(!openMenu)}
          className="text-primary hover:text-primary/80 md:hidden"
        >
          <Logs size={35} strokeWidth={3} />
        </Button>
      </div>

      {/* for mobile */}
      <div
        className={`absolute top-20 left-0 w-full bg-white/10 backdrop-blur-xs flex flex-col items-center md:hidden py-5
    transition-all duration-300 ease-out 
    ${
      openMenu
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-5 pointer-events-none"
    }
  `}
      >
        {MainLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => setOpenMenu(false)}
            className={`my-2 w-full text-center text-lg hover:text-primary duration-100 ${
              pathName === link.href
                ? "text-primary"
                : "text-gray-700 dark:text-neutral-300"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
