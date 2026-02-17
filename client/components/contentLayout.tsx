"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { HEADER_MARGIN } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
};

export default function ContentLayout({ children }: Props) {
  const bannedURLs = ["/contests/"];
  let isBanned = false;
  const pathName = usePathname();
  bannedURLs.forEach((e) => {
    if (pathName.includes(e)) {
      isBanned = true;
    }
  });
  return (
    <div>
      {!isBanned && <Navbar />}
      <div style={{ marginTop: `${HEADER_MARGIN}px` }}>{children}</div>
    </div>
  );
}
