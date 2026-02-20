"use client";
import { toast } from "sonner";

type Props = {
  name: string;
};

export default function RsvpButton({ name }: Props) {
  return (
    <button
      className="mt-6 bg-black text-white px-5 py-3 rounded-xl text-sm w-fit hover:bg-gray-800 transition"
      onClick={() => toast(`RSVP'd to ${name} Successfully`)}
    >
      RSVP
    </button>
  );
}
