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
  public: {
    Tables: {
      ad_clicks: {
        Row: {
          ad_name: string
          clicked_at: string
          id: string
          page_path: string | null
        }
        Insert: {
          ad_name: string
          clicked_at?: string
          id?: string
          page_path?: string | null
        }
        Update: {
          ad_name?: string
          clicked_at?: string
          id?: string
          page_path?: string | null
        }
        Relationships: []
      }
      advertiser_inquiries: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          metadata: Json
          monthly_budget: string | null
          name: string
          page_path: string | null
          sponsor_type: string | null
          website: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          metadata?: Json
          monthly_budget?: string | null
          name: string
          page_path?: string | null
          sponsor_type?: string | null
          website?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          metadata?: Json
          monthly_budget?: string | null
          name?: string
          page_path?: string | null
          sponsor_type?: string | null
          website?: string | null
        }
        Relationships: []
      }
      article_views: {
        Row: {
          article_slug: string
          id: string
          viewed_at: string
        }
        Insert: {
          article_slug: string
          id?: string
          viewed_at?: string
        }
        Update: {
          article_slug?: string
          id?: string
          viewed_at?: string
        }
        Relationships: []
      }
      articles_metadata: {
        Row: {
          description: string
          image_url: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          description: string
          image_url: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          description?: string
          image_url?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      assessment_followup_templates: {
        Row: {
          assessment_result: string
          body_markdown: string
          created_at: string
          day_offset: number
          id: string
          preview_text: string
          primary_cta_href: string
          primary_cta_label: string
          subject: string
        }
        Insert: {
          assessment_result: string
          body_markdown: string
          created_at?: string
          day_offset: number
          id?: string
          preview_text: string
          primary_cta_href: string
          primary_cta_label: string
          subject: string
        }
        Update: {
          assessment_result?: string
          body_markdown?: string
          created_at?: string
          day_offset?: number
          id?: string
          preview_text?: string
          primary_cta_href?: string
          primary_cta_label?: string
          subject?: string
        }
        Relationships: []
      }
      assessment_leads: {
        Row: {
          answers: Json
          assessment_result: string
          email: string
          first_name: string | null
          id: string
          last_result_at: string
          recommended_offer: string | null
          source: string
          subscribed_at: string
          updated_at: string
        }
        Insert: {
          answers?: Json
          assessment_result: string
          email: string
          first_name?: string | null
          id?: string
          last_result_at?: string
          recommended_offer?: string | null
          source?: string
          subscribed_at?: string
          updated_at?: string
        }
        Update: {
          answers?: Json
          assessment_result?: string
          email?: string
          first_name?: string | null
          id?: string
          last_result_at?: string
          recommended_offer?: string | null
          source?: string
          subscribed_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      consultation_leads: {
        Row: {
          concern: string | null
          created_at: string
          email: string
          id: string
          lead_intent: string | null
          lead_reasons: string[]
          lead_score: number
          lead_tier: string
          message: string
          metadata: Json
          name: string
          page_path: string | null
          phone: string | null
          relationship: string | null
          source: string
          treatment_history: string | null
          urgency: string | null
        }
        Insert: {
          concern?: string | null
          created_at?: string
          email: string
          id?: string
          lead_intent?: string | null
          lead_reasons?: string[]
          lead_score?: number
          lead_tier?: string
          message: string
          metadata?: Json
          name: string
          page_path?: string | null
          phone?: string | null
          relationship?: string | null
          source?: string
          treatment_history?: string | null
          urgency?: string | null
        }
        Update: {
          concern?: string | null
          created_at?: string
          email?: string
          id?: string
          lead_intent?: string | null
          lead_reasons?: string[]
          lead_score?: number
          lead_tier?: string
          message?: string
          metadata?: Json
          name?: string
          page_path?: string | null
          phone?: string | null
          relationship?: string | null
          source?: string
          treatment_history?: string | null
          urgency?: string | null
        }
        Relationships: []
      }
      course_enrollments: {
        Row: {
          completed_at: string | null
          course_name: string
          current_lesson: number
          email: string
          enrolled_at: string
          first_name: string | null
          id: string
          is_active: boolean
          last_email_sent_at: string | null
          next_email_at: string | null
        }
        Insert: {
          completed_at?: string | null
          course_name?: string
          current_lesson?: number
          email: string
          enrolled_at?: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          last_email_sent_at?: string | null
          next_email_at?: string | null
        }
        Update: {
          completed_at?: string | null
          course_name?: string
          current_lesson?: number
          email?: string
          enrolled_at?: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          last_email_sent_at?: string | null
          next_email_at?: string | null
        }
        Relationships: []
      }
      funnel_events: {
        Row: {
          article_slug: string | null
          assessment_result: string | null
          created_at: string
          event_name: string
          id: string
          metadata: Json
          offer_slug: string | null
          page_path: string | null
          page_title: string | null
          referrer: string | null
          source: string | null
          target_href: string | null
        }
        Insert: {
          article_slug?: string | null
          assessment_result?: string | null
          created_at?: string
          event_name: string
          id?: string
          metadata?: Json
          offer_slug?: string | null
          page_path?: string | null
          page_title?: string | null
          referrer?: string | null
          source?: string | null
          target_href?: string | null
        }
        Update: {
          article_slug?: string | null
          assessment_result?: string | null
          created_at?: string
          event_name?: string
          id?: string
          metadata?: Json
          offer_slug?: string | null
          page_path?: string | null
          page_title?: string | null
          referrer?: string | null
          source?: string | null
          target_href?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          email: string
          first_name: string | null
          id: string
          is_active: boolean
          subscribed_at: string
        }
        Insert: {
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Update: {
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
