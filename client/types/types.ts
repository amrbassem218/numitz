import { ContestMode, ContestPhase } from "@/lib/contest";

export const contestProblemDefaultValues = {
  id: "",
  name: "",
  submission_count: 0,
  correct_submission_count: 0,
  points: 0,
  difficulty: 1400,
  likes_count: 0,
  comments_count: 0,
  index_in_contest: 0,
} as const;
export type ContestProblem = {
  [k in keyof typeof contestProblemDefaultValues]: (typeof contestProblemDefaultValues)[k];
};
export interface FullProblem {
  id: string;
  name: string | null;
  submission_count: number | null;
  correct_submission_count: number | null;
  points: number | null;
  likes: number | null;
  comments_num: number | null;
  tags: string[] | null;
  description_latex: string | null;
  description_html: string | null;
  answer: string | null;
  editorial: string;
  index_in_contest: number;
}
export interface Contest {
  id: string;
  name: string;
  description: string;
  mode?: ContestMode;
  contest_phase?: ContestPhase;
  server_time?: string;
  like: number;
  difficulty: number;
  authors_ids: null | string;
  number_of_registered: string;
  topics: null | string;
  end_date: Date;
  start_date: Date;
  created_at: Date;
  length_in_minutes: number;
  problem_count: number;
}

export interface UserProfile {
  id?: string;
  created_at?: Date;
  email?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  image?: string;
  bio?: string;
}

export interface ProfileData {
  id: string;
  username: string;
  image_url: string | null;
  bio: string | null;
  elo_rating: number;
  contribution_rating: number;
  ranking: string | null;
  country: string | null;
  math_club: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  followers_count: number;
  following_count: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
}

export interface RatingPoint {
  rating: number;
  contest_id: string | null;
  contest_name?: string;
  created_at: string;
  rank_in_contest: number | null;
}

export interface ActivityDay {
  date: string;
  count: number;
}

export interface FormattedDate {
  time: string;
  timeFull: string;
  date: string;
  timezone: string;
  fullDate: string;
}

export const defaultFormattedDate = {
  time: "10:30",
  timeFull: "10:20:30",
  date: "03/13/2026",
  timezone: "UTC-2",
  fullDate: "",
};

export type ProblemStatus = "success" | "failure" | "idle";

export interface Submission {
  id?: string;
  created_at: Date;
  problem_id?: string;
  user_id?: string;
  display_id?: string;
  user_answer?: string;
  status?: ProblemStatus;
  problems?: {
    name?: string;
  };
  profiles?: {
    username?: string;
  };
  score?: number;
  formattedDate?: FormattedDate;
}

export interface ProblemCore {
  id: string;
  name: string;
  answer: string | null;
  description_latex: string | null;
}

export interface Standing {
  id?: string;
  user_id?: string;
  contest_id?: string;
  score?: number;
  penalty?: number;
  profiles: {
    username: string;
    // avatar: string;
  };
}

export interface Difficulty {
  value: string;
  color: string;
  min: number;
}

export const SUBMISSION_TYPES = [
  "your_submissions",
  "general_submissions",
  "friends_submissions",
] as const;

// Derive the type from the array
export type SubmissionsTypes = (typeof SUBMISSION_TYPES)[number];

export type HeaderType = "short" | "long" | "contest";

export type Ranking_title =
  | "Legendary Grand Master"
  | "Grand Master"
  | "International Master"
  | "Master"
  | "Candidate Master"
  | "Expert"
  | "Specialist"
  | "Pupil"
  | "Newbie"
  | "UnRated";

export type Ranking_title_short =
  | "LGM"
  | "GM"
  | "IM"
  | "M"
  | "CM"
  | "Exp"
  | "Spc"
  | "Ppl"
  | "Nbe"
  | "UnR";

export interface Ranking {
  title?: Ranking_title;
  title_short?: Ranking_title_short;
  rating?: number;
  color: string;
}

export type UserRanking = {
  id: string;
  username: string;
  ranking_num: number;
  title_short: Ranking_title_short;
  rating: number;
  contests_entered_count: number;
};

export const rankingsList: Ranking[] = [
  {
    title: "Legendary Grand Master",
    title_short: "LGM",
    rating: 3000,
    color: "text-red-700",
  },
  {
    title: "Grand Master",
    title_short: "GM",
    rating: 2700,
    color: "text-red-500",
  },
  {
    title: "International Master",
    title_short: "IM",
    rating: 2500,
    color: "text-orange-500",
  },
  {
    title: "Master",
    title_short: "M",
    rating: 2200,
    color: "text-yellow-500",
  },
  {
    title: "Candidate Master",
    title_short: "CM",
    rating: 2000,
    color: "text-purple-500",
  },
  {
    title: "Expert",
    title_short: "Exp",
    rating: 1700,
    color: "text-blue-500",
  },
  {
    title: "Specialist",
    title_short: "Spc",
    rating: 1500,
    color: "text-cyan-500",
  },
  {
    title: "Pupil",
    title_short: "Ppl",
    rating: 1200,
    color: "text-green-500",
  },
  {
    title: "Newbie",
    title_short: "Nbe",
    rating: 0,
    color: "text-gray-500",
  },
  {
    title: "UnRated",
    title_short: "UnR",
    rating: 0,
    color: "text-gray-700",
  },
];
