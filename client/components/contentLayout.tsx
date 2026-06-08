"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import MobileBottomBar from "./MobileBottomBar";
import { HEADER_MARGIN } from "@/lib/utils";
import { useEffect, useState } from "react";
import { HeaderType } from "@/types/types";

type Props = {
  children: React.ReactNode;
};

export default function ContentLayout({ children }: Props) {
  const [type, setType] = useState<HeaderType>("long");
  const pathName = usePathname();
  useEffect(() => {
    if (pathName === "/") {
      setType("short");
    } else if (pathName.includes("/contests/")) {
      setType("contest");
    } else {
      setType("long");
    }
  }, [pathName]);
  const isContest = pathName.includes("/contests/");
  return (
    <div>
      {type !== "contest" && <Navbar />}
      <div
        style={{ marginTop: `${HEADER_MARGIN * Number(type !== "contest")}px` }}
        className={!isContest ? "pb-20 md:pb-0" : ""}
      >
        {children}
      </div>
      {!isContest && <MobileBottomBar />}
    </div>
  );
}
