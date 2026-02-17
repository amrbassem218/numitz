import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "./supabase/client";
import { defaultFormattedDate, UserProfile } from "@/types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cleanStr = (str: string) => {
  str = str.trim().toLowerCase();
  return str;
};

export const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZoneName: "shortOffset",
});

export const getFormattedDate = (date?: string | Date) => {
  if (!date) return defaultFormattedDate;

  const parsedDate = typeof date === "string" ? new Date(date) : date;

  const parts = dateFormatter.formatToParts(parsedDate);
  const fullDate = dateFormatter.format(parsedDate);
  console.log("parts: ", parts);
  const get = (type: string) => {
    return parts.find((p) => p.type === type)?.value ?? "";
  };
  return {
    time: `${get("hour")}:${get("minute")}`,
    date: `${get("month")}/${get("day")}/${get("year")}`,
    timezone: `${get("timeZoneName")}`,
    fullDate: fullDate,
  };
};

export const generateId = (length = 8) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((b) => chars[b % chars.length])
    .join("");
};
