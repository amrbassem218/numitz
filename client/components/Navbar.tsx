"use client";
import { MainLinks } from "@/data/Links";
import Link from "next/link";
import { Plus, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import UserIcon from "./header/userIcon";
import ComingSoon from "./comingSoon";
const Navbar = () => {
  const pathName = usePathname();
  return (
    <nav
      className={`fixed top-0 left-0 w-full px-4 py-4 flex justify-between items-center gap-5 z-50 bg-bg-dark`}
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

      <div className="flex items-center gap-4">
        <ComingSoon>
          <button disabled>
            <Settings className="w-4 h-4" />
          </button>
        </ComingSoon>

        <UserIcon />
      </div>
    </nav>
  );
};

export default Navbar;
