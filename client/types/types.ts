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

export interface Submission {
  id?: string;
  created_at?: Date;
  problem_id?: string;
  user_id?: string;
  user_answer?: string;
  status?: "success" | "failure" | "idle";
  problems?: {
    name?: string;
  };
  score?: number;
  formattedDate?: FormattedDate;
}

export type ProblemStatus = "success" | "failure" | "idle";

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
