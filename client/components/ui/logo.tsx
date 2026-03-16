import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/"} className="flex items-center gap-2 text-xs">
      {" "}
      <h5 className="font-bold! flex items-end justify-end z-50">
        <div className="flex justify-end items-end">
          <h4 className="font-bold!">N</h4>UM
        </div>

        <div className="flex items-start gap-px">
          <div className="flex flex-col justify-center items-center gap-0.5">
            <Plus strokeWidth={6} size={10} className="text-primary" />
            <div className="w-1 h-4 bg-foreground" />
          </div>
          TZ
        </div>
      </h5>
    </Link>
  );
}

export function Mini_Logo() {
  return (
  );
}
