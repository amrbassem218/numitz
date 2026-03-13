import { MdOutlineRemoveShoppingCart } from "react-icons/md";

export const contestProblemDefaultValues = {
  id: "",
  name: "",
  num_submissions: 0,
  num_correct_submissions: 0,
  points: 0,
  likes: 0,
  comments_num: 0,
  index_in_contest: 0,
} as const;
export type contestProblem = {
  [k in keyof typeof contestProblemDefaultValues]: (typeof contestProblemDefaultValues)[k];
};
export interface FullProblem {
  id: string;
  name: string | null;
  num_submissions: number | null;
  num_correct_submissions: number | null;
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
  like: number;
  difficulty: number;
  authors_ids: null | string;
  number_of_registered: string;
  topics: null | string;
  end_date: Date;
  start_date: Date;
  created_at: Date;
  length_in_minutes: number;
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
export interface FormattedDate {
  time: string;
  date: string;
  timezone: string;
  fullDate: string;
}

export const defaultFormattedDate = {
  time: "",
  date: "",
  timezone: "",
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
  description_html: string;
  answer: string;
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
// export interface Ranking {
//   ranking_title: Ranking_title;
//   ranking_title_short: Ranking_title_short;
//   minRating:
// }
