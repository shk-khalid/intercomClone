export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chats: {
        Row: {
          id: string
          name: string
          avatar: string | null
          last_message: string | null
          unread: number
          timestamp: string
          online: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          avatar?: string | null
          last_message?: string | null
          unread?: number
          timestamp?: string
          online?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          avatar?: string | null
          last_message?: string | null
          unread?: number
          timestamp?: string
          online?: boolean
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          text: string
          sender: string
          timestamp: string
        }
        Insert: {
          id?: string
          chat_id: string
          text: string
          sender: string
          timestamp?: string
        }
        Update: {
          id?: string
          chat_id?: string
          text?: string
          sender?: string
          timestamp?: string
        }
      }
      chat_analysis: {
        Row: {
          id: string
          chat_id: string
          sentiment: string | null
          topics: Json | null
          action_items: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          sentiment?: string | null
          topics?: Json | null
          action_items?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          sentiment?: string | null
          topics?: Json | null
          action_items?: Json | null
          created_at?: string
        }
      }
      suggestions: {
        Row: {
          id: string
          chat_id: string
          text: string
          context: string | null
          used_count: number
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          text: string
          context?: string | null
          used_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          text?: string
          context?: string | null
          used_count?: number
          created_at?: string
        }
      }
    }
  }
}