"use client";

import { ProfileData, BlogPost, RatingPoint, ActivityDay } from "@/types/types";
import { InfoCard } from "@/components/profile/info-card";
import { StatsList } from "@/components/profile/stats-list";
import { AdditionalInfo } from "@/components/profile/additional-info";
import { BlogsSection } from "@/components/profile/blogs-section";
import { RatingGraph } from "@/components/profile/rating-graph";
import { ActivityOverview } from "@/components/profile/activity-overview";
import { Separator } from "@/components/ui/separator";
import { getRanking } from "@/lib/ranking";

interface Props {
  profile: ProfileData;
  blogs: BlogPost[];
  ratingHistory: (RatingPoint & { contest_name?: string })[];
  activity: ActivityDay[];
}

export function ProfilePage({ profile, blogs, ratingHistory, activity }: Props) {
  const ranking = getRanking(profile.elo_rating);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-80 shrink-0">
          <div className="lg:sticky lg:top-24 space-y-6">
            <InfoCard profile={profile} ranking={ranking} />
            <Separator />
            <StatsList
              eloRating={profile.elo_rating}
              contributionRating={profile.contribution_rating}
              blogsCount={blogs.length}
            />
            <Separator />
            <AdditionalInfo
              country={profile.country}
              mathClub={profile.math_club}
              email={profile.email}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0 space-y-8">
          {blogs.length > 0 && <BlogsSection blogs={blogs} />}
          {ratingHistory.length > 0 && <RatingGraph data={ratingHistory} />}
          {activity.length > 0 && <ActivityOverview data={activity} />}
        </div>
      </div>
    </main>
  );
}
