import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 本番環境でのエラーハンドリングを改善
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Missing Supabase environment variables. Some features may not work properly."
  );
  // エラーを投げずに、ダミーのクライアントを作成
  supabase = createClient("https://dummy.supabase.co", "dummy-key");
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          address: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          phone?: string | null;
          address?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string | null;
          address?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          original_price: number | null;
          image_url: string;
          category: "buddhist" | "preserved";
          description: string;
          tags: string[];
          rating: number;
          reviews: number;
          color: string | null;
          size: string;
          flower: string | null;
          is_new: boolean;
          is_sale: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          original_price?: number | null;
          image_url: string;
          category: "buddhist" | "preserved";
          description: string;
          tags?: string[];
          rating?: number;
          reviews?: number;
          color?: string | null;
          size?: string;
          flower?: string | null;
          is_new?: boolean;
          is_sale?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          original_price?: number | null;
          image_url?: string;
          category?: "buddhist" | "preserved";
          description?: string;
          tags?: string[];
          rating?: number;
          reviews?: number;
          color?: string | null;
          size?: string;
          flower?: string | null;
          is_new?: boolean;
          is_sale?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      available_slots: {
        Row: {
          id: string;
          date: string;
          time: string;
          max_participants: number;
          current_reservations: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          time: string;
          max_participants?: number;
          current_reservations?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          time?: string;
          max_participants?: number;
          current_reservations?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      reservations: {
        Row: {
          id: string;
          user_id: string | null;
          slot_id: string;
          name: string;
          email: string;
          phone: string;
          participants: number;
          flower_type: string | null;
          color_preference: string | null;
          message: string | null;
          status: "pending" | "confirmed" | "completed" | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          slot_id: string;
          name: string;
          email: string;
          phone: string;
          participants?: number;
          flower_type?: string | null;
          color_preference?: string | null;
          message?: string | null;
          status?: "pending" | "confirmed" | "completed" | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          slot_id?: string;
          name?: string;
          email?: string;
          phone?: string;
          participants?: number;
          flower_type?: string | null;
          color_preference?: string | null;
          message?: string | null;
          status?: "pending" | "confirmed" | "completed" | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          quantity?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          quantity?: number;
          created_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
    };
  };
}
