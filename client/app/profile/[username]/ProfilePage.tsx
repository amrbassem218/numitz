"use client";

import { ProfileData, BlogPost, RatingPoint, ActivityDay } from "@/types/types";
import { InfoCard } from "@/components/profile/info-card";
import { StatsList } from "@/components/profile/stats-list";
import { AdditionalInfo } from "@/components/profile/additional-info";
import { BlogsSection } from "@/components/profile/blogs-section";
import { RatingGraph } from "@/components/profile/rating-graph";
import { ActivityOverview } from "@/components/profile/activity-overview";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { getRanking } from "@/lib/ranking";
import { useProfile } from "@/app/store";

interface Props {
  profile: ProfileData;
  blogs: BlogPost[];
  ratingHistory: (RatingPoint & { contest_name?: string })[];
  activity: ActivityDay[];
}

export function ProfilePage({ profile, blogs, ratingHistory, activity }: Props) {
  const ranking = getRanking(profile.elo_rating);
  const signOut = useProfile((state) => state.signOut);
  const currentUser = useProfile((state) => state.userProfile);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
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
          {currentUser?.id === profile.id && (
            <>
              <Separator />
              <Button
                variant="outline"
                className="w-full py-6 text-base"
                onClick={() => signOut()}
              >
                Log out
              </Button>
            </>
          )}
        </aside>

        <div className="flex-1 min-w-0 space-y-8">
          {blogs.length > 0 && <BlogsSection blogs={blogs} />}
          <RatingGraph data={ratingHistory} />
          <ActivityOverview data={activity} />
        </div>
      </div>
    </main>
  );
}
