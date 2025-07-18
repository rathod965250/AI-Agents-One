export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string | null
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      affiliate_link_changes: {
        Row: {
          affiliate_url: string | null
          agent_id: string
          changed_at: string
          changed_by: string
          id: string
          notes: string | null
          original_url: string
        }
        Insert: {
          affiliate_url?: string | null
          agent_id: string
          changed_at?: string
          changed_by: string
          id?: string
          notes?: string | null
          original_url: string
        }
        Update: {
          affiliate_url?: string | null
          agent_id?: string
          changed_at?: string
          changed_by?: string
          id?: string
          notes?: string | null
          original_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_link_changes_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_comments: {
        Row: {
          agent_id: string
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agent_id: string
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agent_id?: string
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_comments_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "agent_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_reviews: {
        Row: {
          agent_id: string
          cons: string[] | null
          content: string
          created_at: string | null
          helpful_count: number | null
          id: string
          is_verified_purchase: boolean | null
          moderation_reason: string | null
          pros: string[] | null
          rating: number
          status: Database["public"]["Enums"]["review_status"]
          title: string
          updated_at: string | null
          use_case: string | null
          user_id: string
        }
        Insert: {
          agent_id: string
          cons?: string[] | null
          content: string
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          moderation_reason?: string | null
          pros?: string[] | null
          rating: number
          status?: Database["public"]["Enums"]["review_status"]
          title: string
          updated_at?: string | null
          use_case?: string | null
          user_id: string
        }
        Update: {
          agent_id?: string
          cons?: string[] | null
          content?: string
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          moderation_reason?: string | null
          pros?: string[] | null
          rating?: number
          status?: Database["public"]["Enums"]["review_status"]
          title?: string
          updated_at?: string | null
          use_case?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_reviews_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_submissions: {
        Row: {
          additional_resources_url: string | null
          category: string | null
          contact_email: string | null
          created_at: string | null
          description: string | null
          features: string[] | null
          has_free_trial: boolean | null
          id: string
          is_draft: boolean | null
          linkedin_url: string | null
          logo_url: string | null
          name: string | null
          pricing_type: string | null
          repository_url: string | null
          requires_account: boolean | null
          slug: string | null
          status: Database["public"]["Enums"]["agent_status"]
          submitted_at: string | null
          tagline: string | null
          twitter_url: string | null
          updated_at: string | null
          user_id: string
          website_url: string | null
        }
        Insert: {
          additional_resources_url?: string | null
          category?: string | null
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          has_free_trial?: boolean | null
          id?: string
          is_draft?: boolean | null
          linkedin_url?: string | null
          logo_url?: string | null
          name?: string | null
          pricing_type?: string | null
          repository_url?: string | null
          requires_account?: boolean | null
          slug?: string | null
          status?: Database["public"]["Enums"]["agent_status"]
          submitted_at?: string | null
          tagline?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id: string
          website_url?: string | null
        }
        Update: {
          additional_resources_url?: string | null
          category?: string | null
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          has_free_trial?: boolean | null
          id?: string
          is_draft?: boolean | null
          linkedin_url?: string | null
          logo_url?: string | null
          name?: string | null
          pricing_type?: string | null
          repository_url?: string | null
          requires_account?: boolean | null
          slug?: string | null
          status?: Database["public"]["Enums"]["agent_status"]
          submitted_at?: string | null
          tagline?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_upvotes: {
        Row: {
          agent_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_upvotes_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_upvotes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agents: {
        Row: {
          additional_resources_url: string | null
          affiliate_url: string | null
          approved_at: string | null
          approved_by: string | null
          average_rating: number | null
          category: Database["public"]["Enums"]["agent_category"]
          click_count: number | null
          contact_email: string | null
          created_at: string | null
          featured_at: string | null
          homepage_image_url: string | null
          id: string
          launch_date: string | null
          linkedin_url: string | null
          name: string
          pricing_type: Database["public"]["Enums"]["pricing_type"]
          rejection_reason: string | null
          repository_url: string | null
          slug: string
          status: Database["public"]["Enums"]["agent_status"] | null
          submitted_by: string | null
          total_reviews: number | null
          total_upvotes: number | null
          twitter_url: string | null
          updated_at: string | null
          view_count: number | null
          website_url: string
        }
        Insert: {
          additional_resources_url?: string | null
          affiliate_url?: string | null
          approved_at?: string | null
          approved_by?: string | null
          average_rating?: number | null
          category: Database["public"]["Enums"]["agent_category"]
          click_count?: number | null
          contact_email?: string | null
          created_at?: string | null
          featured_at?: string | null
          homepage_image_url?: string | null
          id?: string
          launch_date?: string | null
          linkedin_url?: string | null
          name: string
          pricing_type: Database["public"]["Enums"]["pricing_type"]
          rejection_reason?: string | null
          repository_url?: string | null
          slug: string
          status?: Database["public"]["Enums"]["agent_status"] | null
          submitted_by?: string | null
          total_reviews?: number | null
          total_upvotes?: number | null
          twitter_url?: string | null
          updated_at?: string | null
          view_count?: number | null
          website_url: string
        }
        Update: {
          additional_resources_url?: string | null
          affiliate_url?: string | null
          approved_at?: string | null
          approved_by?: string | null
          average_rating?: number | null
          category?: Database["public"]["Enums"]["agent_category"]
          click_count?: number | null
          contact_email?: string | null
          created_at?: string | null
          featured_at?: string | null
          homepage_image_url?: string | null
          id?: string
          launch_date?: string | null
          linkedin_url?: string | null
          name?: string
          pricing_type?: Database["public"]["Enums"]["pricing_type"]
          rejection_reason?: string | null
          repository_url?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["agent_status"] | null
          submitted_by?: string | null
          total_reviews?: number | null
          total_upvotes?: number | null
          twitter_url?: string | null
          updated_at?: string | null
          view_count?: number | null
          website_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_agents_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          agent_count: number | null
          color: string | null
          created_at: string | null
          description: string | null
          display_name: string
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          agent_count?: number | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_name: string
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          agent_count?: number | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      content_flags: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          description: string | null
          flagged_by: string | null
          id: string
          reason: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          description?: string | null
          flagged_by?: string | null
          id?: string
          reason: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          description?: string | null
          flagged_by?: string | null
          id?: string
          reason?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          body: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          body?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string | null
          status: string
          subscribed_at: string
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string | null
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string | null
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          github_handle: string | null
          id: string
          is_verified: boolean | null
          status: Database["public"]["Enums"]["user_status"]
          twitter_handle: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          github_handle?: string | null
          id: string
          is_verified?: boolean | null
          status?: Database["public"]["Enums"]["user_status"]
          twitter_handle?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          github_handle?: string | null
          id?: string
          is_verified?: boolean | null
          status?: Database["public"]["Enums"]["user_status"]
          twitter_handle?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      review_flags: {
        Row: {
          created_at: string | null
          id: string
          reason: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reason: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reason?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_flags_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "agent_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_flags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      review_votes: {
        Row: {
          created_at: string | null
          id: string
          is_helpful: boolean
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_helpful: boolean
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_helpful?: boolean
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_votes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "agent_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string
          id: string
          priority: string
          resolved_at: string | null
          status: string
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description: string
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          agent_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
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
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      increment_agent_clicks: {
        Args: { agent_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      agent_category:
        | "conversational_ai"
        | "image_generation"
        | "content_creation"
        | "data_analysis"
        | "code_assistant"
        | "voice_ai"
        | "automation"
        | "research"
        | "translation"
        | "customer_support"
        | "marketing"
        | "productivity"
        | "education"
        | "healthcare"
        | "finance"
        | "gaming"
        | "ai_agent_builders"
        | "coding"
        | "personal_assistant"
        | "general_purpose"
        | "digital_workers"
        | "design"
        | "sales"
        | "business_intelligence"
        | "hr"
        | "science"
        | "other"
      agent_status: "pending" | "approved" | "rejected" | "featured"
      pricing_type: "free" | "freemium" | "paid"
      review_status: "pending" | "approved" | "rejected"
      user_role: "user" | "admin" | "moderator"
      user_status: "active" | "suspended" | "banned"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_category: [
        "conversational_ai",
        "image_generation",
        "content_creation",
        "data_analysis",
        "code_assistant",
        "voice_ai",
        "automation",
        "research",
        "translation",
        "customer_support",
        "marketing",
        "productivity",
        "education",
        "healthcare",
        "finance",
        "gaming",
        "ai_agent_builders",
        "coding",
        "personal_assistant",
        "general_purpose",
        "digital_workers",
        "design",
        "sales",
        "business_intelligence",
        "hr",
        "science",
        "other",
      ],
      agent_status: ["pending", "approved", "rejected", "featured"],
      pricing_type: ["free", "freemium", "paid"],
      review_status: ["pending", "approved", "rejected"],
      user_role: ["user", "admin", "moderator"],
      user_status: ["active", "suspended", "banned"],
    },
  },
} as const
