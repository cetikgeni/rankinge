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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ad_requests: {
        Row: {
          admin_notes: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          plan: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          plan?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          plan?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      advertisements: {
        Row: {
          advertiser_email: string | null
          advertiser_name: string | null
          clicks: number | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          impressions: number | null
          is_active: boolean | null
          link_url: string | null
          placement: string
          priority: number | null
          start_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          advertiser_email?: string | null
          advertiser_name?: string | null
          clicks?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          impressions?: number | null
          is_active?: boolean | null
          link_url?: string | null
          placement?: string
          priority?: number | null
          start_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          advertiser_email?: string | null
          advertiser_name?: string | null
          clicks?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          impressions?: number | null
          is_active?: boolean | null
          link_url?: string | null
          placement?: string
          priority?: number | null
          start_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          content_id: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          excerpt_id: string | null
          id: string
          image_source: string | null
          is_published: boolean | null
          is_seed_content: boolean
          meta_description: string | null
          meta_title: string | null
          og_description: string | null
          og_title: string | null
          published_at: string | null
          slug: string
          title: string
          title_id: string | null
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          content_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          excerpt_id?: string | null
          id?: string
          image_source?: string | null
          is_published?: boolean | null
          is_seed_content?: boolean
          meta_description?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_title?: string | null
          published_at?: string | null
          slug: string
          title: string
          title_id?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          content_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          excerpt_id?: string | null
          id?: string
          image_source?: string | null
          is_published?: boolean | null
          is_seed_content?: boolean
          meta_description?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_title?: string | null
          published_at?: string | null
          slug?: string
          title?: string
          title_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bulk_generation_logs: {
        Row: {
          admin_user_id: string | null
          created_at: string
          id: string
          message: string | null
          run_id: string
          status: string
          step: string
        }
        Insert: {
          admin_user_id?: string | null
          created_at?: string
          id?: string
          message?: string | null
          run_id?: string
          status: string
          step: string
        }
        Update: {
          admin_user_id?: string | null
          created_at?: string
          id?: string
          message?: string | null
          run_id?: string
          status?: string
          step?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          category_group: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_source: string | null
          image_url: string | null
          is_approved: boolean | null
          is_seed_content: boolean
          name: string
          parent_id: string | null
          updated_at: string
          vote_display_mode: string | null
        }
        Insert: {
          category_group?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_source?: string | null
          image_url?: string | null
          is_approved?: boolean | null
          is_seed_content?: boolean
          name: string
          parent_id?: string | null
          updated_at?: string
          vote_display_mode?: string | null
        }
        Update: {
          category_group?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_source?: string | null
          image_url?: string | null
          is_approved?: boolean | null
          is_seed_content?: boolean
          name?: string
          parent_id?: string | null
          updated_at?: string
          vote_display_mode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_groups: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
        }
        Relationships: []
      }
      items: {
        Row: {
          affiliate_url: string | null
          category_id: string
          created_at: string
          description: string | null
          id: string
          image_source: string | null
          image_url: string | null
          is_seed_content: boolean
          name: string
          product_url: string | null
          seed_weight: number | null
          updated_at: string
          vote_count: number | null
        }
        Insert: {
          affiliate_url?: string | null
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_source?: string | null
          image_url?: string | null
          is_seed_content?: boolean
          name: string
          product_url?: string | null
          seed_weight?: number | null
          updated_at?: string
          vote_count?: number | null
        }
        Update: {
          affiliate_url?: string | null
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_source?: string | null
          image_url?: string | null
          is_seed_content?: boolean
          name?: string
          product_url?: string | null
          seed_weight?: number | null
          updated_at?: string
          vote_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          is_active: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ranking_snapshots: {
        Row: {
          category_id: string
          created_at: string
          id: string
          item_id: string
          rank_position: number
          snapshot_at: string
          vote_count: number
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          item_id: string
          rank_position: number
          snapshot_at?: string
          vote_count?: number
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          item_id?: string
          rank_position?: number
          snapshot_at?: string
          vote_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "ranking_snapshots_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ranking_snapshots_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      static_pages: {
        Row: {
          content: string
          content_id: string | null
          created_at: string
          id: string
          is_published: boolean | null
          meta_description: string | null
          meta_title: string | null
          slug: string
          title: string
          title_id: string | null
          updated_at: string
        }
        Insert: {
          content: string
          content_id?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          slug: string
          title: string
          title_id?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          content_id?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          slug?: string
          title?: string
          title_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          category_id: string
          created_at: string
          id: string
          item_id: string
          user_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          item_id: string
          user_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_ranking_snapshot: {
        Args: { p_category_id: string }
        Returns: undefined
      }
      generate_slug: { Args: { title: string }; Returns: string }
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
