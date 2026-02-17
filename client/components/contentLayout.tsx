"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

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
      <div className={`${!isBanned && "mt-14"}`}>{children}</div>
    </div>
  );
}
