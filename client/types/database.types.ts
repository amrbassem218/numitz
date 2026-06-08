export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      blogs: {
        Row: {
          comments_count: number
          content: string
          created_at: string
          id: string
          likes_count: number
          published: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          published?: boolean
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          published?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blogs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contests: {
        Row: {
          authors_ids: string[] | null
          created_at: string
          description: string | null
          difficulty: string | null
          end_date: string | null
          id: string
          legacy_id: number
          length_in_minutes: number | null
          mode: string | null
          name: string | null
          number_of_registered: number | null
          problem_count: number | null
          start_date: string | null
          topics: string[] | null
        }
        Insert: {
          authors_ids?: string[] | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          end_date?: string | null
          id?: string
          legacy_id?: number
          length_in_minutes?: number | null
          mode?: string | null
          name?: string | null
          number_of_registered?: number | null
          problem_count?: number | null
          start_date?: string | null
          topics?: string[] | null
        }
        Update: {
          authors_ids?: string[] | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          end_date?: string | null
          id?: string
          legacy_id?: number
          length_in_minutes?: number | null
          mode?: string | null
          name?: string | null
          number_of_registered?: number | null
          problem_count?: number | null
          start_date?: string | null
          topics?: string[] | null
        }
        Relationships: []
      }
      discussions: {
        Row: {
          contest_id: string | null
          created_at: string
          description: string | null
          id: string
          parent_thread_id: string | null
          problem_id: string | null
          user_id: string | null
        }
        Insert: {
          contest_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          parent_thread_id?: string | null
          problem_id?: string | null
          user_id?: string | null
        }
        Update: {
          contest_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          parent_thread_id?: string | null
          problem_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discussions_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
        ]
      }
      editorials: {
        Row: {
          created_at: string
          description: string | null
          id: number
          likes: number | null
          number_of_replies: number | null
          problem_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          likes?: number | null
          number_of_replies?: number | null
          problem_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          likes?: number | null
          number_of_replies?: number | null
          problem_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "editorials_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
        ]
      }
      followers: {
        Row: {
          created_at: string
          follower_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      problems: {
        Row: {
          answer: string | null
          authors_ids: string[] | null
          client_problem_id: number
          comments_count: number | null
          contest_id: string | null
          correct_submission_count: number | null
          created_at: string
          description_html: string | null
          description_latex: string | null
          difficulty: number | null
          full_name: string | null
          id: string
          index_in_contest: number | null
          latex_doc_url: string | null
          likes_count: number | null
          name: string | null
          official_editorial: string | null
          pdf_doc_url: string | null
          points: number | null
          submission_count: number | null
          tags: string[] | null
          type: string | null
        }
        Insert: {
          answer?: string | null
          authors_ids?: string[] | null
          client_problem_id?: number
          comments_count?: number | null
          contest_id?: string | null
          correct_submission_count?: number | null
          created_at?: string
          description_html?: string | null
          description_latex?: string | null
          difficulty?: number | null
          full_name?: string | null
          id?: string
          index_in_contest?: number | null
          latex_doc_url?: string | null
          likes_count?: number | null
          name?: string | null
          official_editorial?: string | null
          pdf_doc_url?: string | null
          points?: number | null
          submission_count?: number | null
          tags?: string[] | null
          type?: string | null
        }
        Update: {
          answer?: string | null
          authors_ids?: string[] | null
          client_problem_id?: number
          comments_count?: number | null
          contest_id?: string | null
          correct_submission_count?: number | null
          created_at?: string
          description_html?: string | null
          description_latex?: string | null
          difficulty?: number | null
          full_name?: string | null
          id?: string
          index_in_contest?: number | null
          latex_doc_url?: string | null
          likes_count?: number | null
          name?: string | null
          official_editorial?: string | null
          pdf_doc_url?: string | null
          points?: number | null
          submission_count?: number | null
          tags?: string[] | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "problems_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          bio: string | null
          city: string | null
          contribution_rating: number
          country: string | null
          created_at: string
          elo_rating: number
          email: string | null
          first_name: string | null
          followers_count: number
          following_count: number
          id: string
          image_url: string | null
          last_name: string | null
          math_club: string | null
          middle_name: string | null
          phone_number: string | null
          ranking: string | null
          username: string | null
        }
        Insert: {
          address?: string | null
          bio?: string | null
          city?: string | null
          contribution_rating?: number
          country?: string | null
          created_at?: string
          elo_rating?: number
          email?: string | null
          first_name?: string | null
          followers_count?: number
          following_count?: number
          id?: string
          image_url?: string | null
          last_name?: string | null
          math_club?: string | null
          middle_name?: string | null
          phone_number?: string | null
          ranking?: string | null
          username?: string | null
        }
        Update: {
          address?: string | null
          bio?: string | null
          city?: string | null
          contribution_rating?: number
          country?: string | null
          created_at?: string
          elo_rating?: number
          email?: string | null
          first_name?: string | null
          followers_count?: number
          following_count?: number
          id?: string
          image_url?: string | null
          last_name?: string | null
          math_club?: string | null
          middle_name?: string | null
          phone_number?: string | null
          ranking?: string | null
          username?: string | null
        }
        Relationships: []
      }
      rating_history: {
        Row: {
          contest_id: string | null
          created_at: string
          id: string
          rank_in_contest: number | null
          rating: number
          user_id: string
        }
        Insert: {
          contest_id?: string | null
          created_at?: string
          id?: string
          rank_in_contest?: number | null
          rating: number
          user_id: string
        }
        Update: {
          contest_id?: string | null
          created_at?: string
          id?: string
          rank_in_contest?: number | null
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rating_history_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rating_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      registered_in_contest: {
        Row: {
          contest_id: string | null
          created_at: string
          id: number
          user_id: string | null
        }
        Insert: {
          contest_id?: string | null
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Update: {
          contest_id?: string | null
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registered_in_contest_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registered_in_contest_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      standings: {
        Row: {
          contest_id: string | null
          created_at: string
          id: number
          penalty: number | null
          score: number | null
          user_id: string | null
        }
        Insert: {
          contest_id?: string | null
          created_at?: string
          id?: number
          penalty?: number | null
          score?: number | null
          user_id?: string | null
        }
        Update: {
          contest_id?: string | null
          created_at?: string
          id?: number
          penalty?: number | null
          score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "standings_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "standings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          created_at: string
          display_id: string | null
          id: number
          is_official: boolean
          problem_id: string | null
          score: number
          status: string | null
          user_answer: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          display_id?: string | null
          id?: number
          is_official?: boolean
          problem_id?: string | null
          score?: number
          status?: string | null
          user_answer?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          display_id?: string | null
          id?: number
          is_official?: boolean
          problem_id?: string | null
          score?: number
          status?: string | null
          user_answer?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      testing: {
        Row: {
          created_at: string
          html: string | null
          id: number
          latex: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          html?: string | null
          id?: number
          latex?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          html?: string | null
          id?: number
          latex?: string | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
