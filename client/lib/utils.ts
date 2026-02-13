import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "./supabase/client";
import { UserProfile } from "@/types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cleanStr = (str: string) => {
  str = str.trim().toLowerCase();
  return str;
};
