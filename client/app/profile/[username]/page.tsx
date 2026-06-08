import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { notFound } from "next/navigation";
import { ProfilePage } from "./ProfilePage";
import { ProfileData, BlogPost, RatingPoint, ActivityDay } from "@/types/types";

async function getProfile(username: string) {
  const supabase = createSupabaseServiceClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();
  return profile as ProfileData | null;
}

async function getBlogs(userId: string) {
  const supabase = createSupabaseServiceClient();
  const { data: blogs } = await supabase
    .from("blogs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);
  return (blogs ?? []) as BlogPost[];
}

async function getRatingHistory(userId: string) {
  const supabase = createSupabaseServiceClient();
  const { data: history } = await supabase
    .from("rating_history")
    .select("*, contests(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  return (history ?? []) as (RatingPoint & { contests?: { name: string } })[];
}

async function getActivityData(userId: string) {
  const supabase = createSupabaseServiceClient();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const { data: submissions } = await supabase
    .from("submissions")
    .select("created_at, status")
    .eq("user_id", userId)
    .gte("created_at", oneYearAgo.toISOString());
  if (!submissions) return [];
  const counts: Record<string, number> = {};
  for (const sub of submissions) {
    const day = sub.created_at.split("T")[0];
    counts[day] = (counts[day] ?? 0) + 1;
  }
  return Object.entries(counts).map(([date, count]) => ({ date, count })) as ActivityDay[];
}

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfile(username);
  if (!profile) notFound();

  const [blogs, ratingHistory, activity] = await Promise.all([
    getBlogs(profile.id),
    getRatingHistory(profile.id),
    getActivityData(profile.id),
  ]);

  const resolvedRatingHistory = ratingHistory.map((p) => ({
    ...p,
    contest_name: (p as unknown as { contests?: { name: string } }).contests?.name,
  }));

  return (
    <ProfilePage
      profile={profile}
      blogs={blogs}
      ratingHistory={resolvedRatingHistory}
      activity={activity}
    />
  );
}
