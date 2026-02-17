"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { HEADER_MARGIN } from "@/lib/utils";
import { useEffect, useState } from "react";
import { HeaderType } from "@/types/types";

type Props = {
  children: React.ReactNode;
};

export default function ContentLayout({ children }: Props) {
  // const shortNavUrls = ["/"];
  // const contestLikeNavUrls = ["/contests/"];
  // const urls: Record<string, string[]> = {
  //   contest: ["/contests/"],
  //   short: ["/"],
  // };
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
  return (
    <div>
      {type !== "contest" && <Navbar type={type} />}
      <div
        style={{ marginTop: `${HEADER_MARGIN * Number(type !== "contest")}px` }}
      >
        {children}
      </div>
    </div>
  );
}
