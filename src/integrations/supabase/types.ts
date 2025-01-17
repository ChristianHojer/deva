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
      chat_history: {
        Row: {
          id: string
          message: string | null
          project_id: string | null
          sender: string | null
          timestamp: string | null
        }
        Insert: {
          id?: string
          message?: string | null
          project_id?: string | null
          sender?: string | null
          timestamp?: string | null
        }
        Update: {
          id?: string
          message?: string | null
          project_id?: string | null
          sender?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      code_snippets: {
        Row: {
          content: string
          created_at: string | null
          id: string
          language: string | null
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          language?: string | null
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          language?: string | null
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "code_snippets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      error_codes: {
        Row: {
          code: string
          created_at: string | null
          error_type: string | null
          id: string
          message: string
          solution: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          error_type?: string | null
          id?: string
          message: string
          solution?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          error_type?: string | null
          id?: string
          message?: string
          solution?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      file_uploads: {
        Row: {
          activity_type: string | null
          file_name: string
          file_type: string | null
          file_url: string
          id: string
          project_id: string | null
          uploaded_at: string | null
        }
        Insert: {
          activity_type?: string | null
          file_name: string
          file_type?: string | null
          file_url: string
          id?: string
          project_id?: string | null
          uploaded_at?: string | null
        }
        Update: {
          activity_type?: string | null
          file_name?: string
          file_type?: string | null
          file_url?: string
          id?: string
          project_id?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "file_uploads_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          content: string
          created_at: string | null
          id: string
          reference_links: string[] | null
          topic: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          reference_links?: string[] | null
          topic: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          reference_links?: string[] | null
          topic?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          activity_type: string | null
          content: string | null
          file_name: string | null
          file_type: string | null
          file_url: string | null
          id: string
          project_id: string | null
          sender: string | null
          tab_id: string | null
          timestamp: string | null
        }
        Insert: {
          activity_type?: string | null
          content?: string | null
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          project_id?: string | null
          sender?: string | null
          tab_id?: string | null
          timestamp?: string | null
        }
        Update: {
          activity_type?: string | null
          content?: string | null
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          project_id?: string | null
          sender?: string | null
          tab_id?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          language_preference: string | null
          notification_preferences: Json | null
          profile_picture_url: string | null
          theme: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          language_preference?: string | null
          notification_preferences?: Json | null
          profile_picture_url?: string | null
          theme?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          language_preference?: string | null
          notification_preferences?: Json | null
          profile_picture_url?: string | null
          theme?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      token_usage: {
        Row: {
          activity_details: Json | null
          activity_type: string | null
          created_at: string | null
          id: string
          project_id: string | null
          tokens_used: number
          user_id: string | null
        }
        Insert: {
          activity_details?: Json | null
          activity_type?: string | null
          created_at?: string | null
          id?: string
          project_id?: string | null
          tokens_used?: number
          user_id?: string | null
        }
        Update: {
          activity_details?: Json | null
          activity_type?: string | null
          created_at?: string | null
          id?: string
          project_id?: string | null
          tokens_used?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "token_usage_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      visualizations: {
        Row: {
          created_at: string | null
          data: Json
          id: string
          project_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data: Json
          id?: string
          project_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: string
          project_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visualizations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_type: "message" | "file" | "error" | "code_change"
      error_type:
        | "syntax"
        | "runtime"
        | "logic"
        | "network"
        | "database"
        | "authentication"
        | "authorization"
        | "validation"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
