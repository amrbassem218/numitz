"use client";

import { ProfileData, Ranking } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/profile/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

interface Props {
  profile: ProfileData;
  ranking: Ranking;
}

export function InfoCard({ profile, ranking }: Props) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="flex flex-col items-center lg:items-start gap-3">
      <Avatar className="w-24 h-24 lg:w-32 lg:h-32">
        <AvatarImage src={profile.image_url ?? undefined} alt={profile.username} />
        <AvatarFallback className="text-2xl bg-primary">
          {profile.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="text-center lg:text-left">
        <h1 className={`text-xl font-bold ${ranking.color}`}>
          {profile.username}
        </h1>
        <p className={`text-sm font-medium ${ranking.color}`}>
          {ranking.title ?? "UnRated"}
        </p>
      </div>

      <Button
        variant={isFollowing ? "outline" : "default"}
        className="w-full"
        onClick={() => setIsFollowing(!isFollowing)}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>

      {profile.bio && (
        <p className="text-sm text-muted-foreground text-center lg:text-left">
          {profile.bio}
        </p>
      )}

      <div className="flex gap-4 text-sm">
        <Link href={`/profile/${profile.username}/followers`} className="hover:text-primary">
          <span className="font-semibold text-foreground">{profile.followers_count}</span>{" "}
          <span className="text-muted-foreground">followers</span>
        </Link>
        <Link href={`/profile/${profile.username}/following`} className="hover:text-primary">
          <span className="font-semibold text-foreground">{profile.following_count}</span>{" "}
          <span className="text-muted-foreground">following</span>
        </Link>
      </div>
    </div>
  );
}
