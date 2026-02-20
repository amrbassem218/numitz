"use client";
import { Button } from "@/components/ui/button";
import { useProfile } from "../store";
import { FaRegUserCircle } from "react-icons/fa";

type Props = {};

export default function ProblemSetsLeftBarBottomSection({}: Props) {
  const user = useProfile((state) => state.user);
  return (
    <div>
      {/* If user is not signed in prompt them to */}
      {!user && (
        <section className="w-3/4 mx-auto flex flex-col gap-2 items-center">
          <p className="text-md text-text font-extralight leading-relaxed text-center">
            Log in to view lists and track study progress
          </p>

          <Button className="bg-text text-bg rounded-lg" link="/sign_in">
            <FaRegUserCircle />
            Log In
          </Button>
        </section>
      )}
    </div>
  );
}
