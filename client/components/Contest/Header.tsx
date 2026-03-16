"use client";
import { FaRegNoteSticky } from "react-icons/fa6";
import { FiHelpCircle } from "react-icons/fi";
import { RiLayout2Fill } from "react-icons/ri";
import { TfiMenu } from "react-icons/tfi";
import UserIcon from "../header/userIcon";
import { Separator } from "../ui/separator";
import ContestHeaderTimer from "./contestHeaderTimer";
import { IoIosSettings } from "react-icons/io";
import ComingSoon from "../comingSoon";
import Image from "next/image";
import Link from "next/link";
interface Props {
  length_in_minutes: number;
}
const ContestHeader = ({ length_in_minutes }: Props) => {
  return (
    <nav className="h-10 bg-transparent mb-2 w-full flex justify-between items-center gap-5 px-4 my-1">
      {/* Left section */}
      <section className="">
        <div className="flex items-end gap-2 ">
          <div className="flex items-end gap-3">
            {/* Logo */}
            <Link href={"/"} className="flex items-center gap-2 ">
              <Image
                src="/logo_mini_light_transparent.svg"
                alt="Logo"
                width={100}
                height={100}
                className="w-6 h-6"
              />
            </Link>
            <Separator
              orientation="vertical"
              className="h-4! bg-foreground/20 "
            />
          </div>
          <div className="flex items-end gap-2">
            <TfiMenu className="w-4.5 h-4.5 text-muted-foreground" />
            <span className="hidden md:inline text-base font-medium self-end leading-none">
              Contest List
            </span>
          </div>
        </div>
      </section>

      {/* Middle section */}
      <section className="flex gap-1">
        {/* Take notes */}
        <ComingSoon>
          <button
            disabled
            className="hidden w-8 h-8 bg-card rounded-md md:flex items-center justify-center p-2"
          >
            <FaRegNoteSticky className="text-muted-foreground" />
          </button>
        </ComingSoon>

        {/* Timer */}
        <ContestHeaderTimer length_in_minutes={length_in_minutes} />

        {/* Help */}
        <ComingSoon>
          <div className="hidden w-8 h-8 bg-card rounded-md md:flex items-center justify-center p-2">
            <FiHelpCircle className="text-muted-foreground" />
          </div>
        </ComingSoon>
      </section>

      {/* Right section */}
      <section className="flex items-center gap-3">
        <ComingSoon>
          <button className="w-5 h-5 hidden md:inline hover:*:text-text cursor-pointer">
            <RiLayout2Fill className="text-muted-foreground h-full w-full" />
          </button>
        </ComingSoon>

        <button className="w-5 h-5 hidden md:inline hover:*:text-text cursor-pointer">
          <IoIosSettings className="text-muted-foreground h-full w-full" />
        </button>

        <div className="hidden md:flex items-center gap-1">
          <img src={"/flame.svg"} className="w-5 h-5" />
          <span className="text-sm text-muted-foreground">1</span>
          {/* TODO: Replace with actual streak */}
          {/* <RiFireFill className="text-muted-foreground h-full w-full" /> */}
        </div>
        <div className="">
          <UserIcon />
        </div>
      </section>
    </nav>
  );
};

export default ContestHeader;
