export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ItemStatus = "pending" | "approved" | "rejected";
export type PlaceKind = "maqam" | "dargah" | "zawiya" | "gathering";
export type ConsentStatus = "pending" | "granted" | "revoked" | "not_applicable";
export type UserRole = "contributor" | "moderator" | "admin";
export type BadgeId = "musafir" | "misbah" | "hadiyya" | "rafeeq" | "nazir";

export interface SourceCitation {
  title: string;
  author?: string;
  record_ref?: string;
  is_verified?: boolean;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          role: UserRole;
          area_of_responsibility: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          role?: UserRole;
          area_of_responsibility?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          role?: UserRole;
          area_of_responsibility?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      places: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          status: ItemStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
          review_notes: string | null;
          name_en: string;
          name_ml: string;
          name_ar: string;
          kind: PlaceKind;
          area: string;
          latitude: number;
          longitude: number;
          geom?: unknown;
          short_history_en: string | null;
          short_history_ml: string | null;
          short_history_ar: string | null;
          visiting_etiquette_en: string | null;
          visiting_etiquette_ml: string | null;
          visiting_etiquette_ar: string | null;
          recurring_events_en: string | null;
          recurring_events_ml: string | null;
          recurring_events_ar: string | null;
          photos: string[];
          sources: SourceCitation[];
          metadata: Record<string, unknown>;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          status?: ItemStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          review_notes?: string | null;
          name_en: string;
          name_ml: string;
          name_ar: string;
          kind: PlaceKind;
          area: string;
          latitude: number;
          longitude: number;
          short_history_en?: string | null;
          short_history_ml?: string | null;
          short_history_ar?: string | null;
          visiting_etiquette_en?: string | null;
          visiting_etiquette_ml?: string | null;
          visiting_etiquette_ar?: string | null;
          recurring_events_en?: string | null;
          recurring_events_ml?: string | null;
          recurring_events_ar?: string | null;
          photos?: string[];
          sources?: SourceCitation[];
          metadata?: Record<string, unknown>;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          status?: ItemStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          review_notes?: string | null;
          name_en?: string;
          name_ml?: string;
          name_ar?: string;
          kind?: PlaceKind;
          area?: string;
          latitude?: number;
          longitude?: number;
          short_history_en?: string | null;
          short_history_ml?: string | null;
          short_history_ar?: string | null;
          visiting_etiquette_en?: string | null;
          visiting_etiquette_ml?: string | null;
          visiting_etiquette_ar?: string | null;
          recurring_events_en?: string | null;
          recurring_events_ml?: string | null;
          recurring_events_ar?: string | null;
          photos?: string[];
          sources?: SourceCitation[];
          metadata?: Record<string, unknown>;
        };
      };
      persons: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          status: ItemStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
          review_notes: string | null;
          name_en: string;
          name_ml: string;
          name_ar: string;
          is_living: boolean;
          consent_status: ConsentStatus;
          short_history_en: string | null;
          short_history_ml: string | null;
          short_history_ar: string | null;
          photos: string[];
          sources: SourceCitation[];
          metadata: Record<string, unknown>;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          status?: ItemStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          review_notes?: string | null;
          name_en: string;
          name_ml: string;
          name_ar: string;
          is_living?: boolean;
          consent_status?: ConsentStatus;
          short_history_en?: string | null;
          short_history_ml?: string | null;
          short_history_ar?: string | null;
          photos?: string[];
          sources?: SourceCitation[];
          metadata?: Record<string, unknown>;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          status?: ItemStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          review_notes?: string | null;
          name_en?: string;
          name_ml?: string;
          name_ar?: string;
          is_living?: boolean;
          consent_status?: ConsentStatus;
          short_history_en?: string | null;
          short_history_ml?: string | null;
          short_history_ar?: string | null;
          photos?: string[];
          sources?: SourceCitation[];
          metadata?: Record<string, unknown>;
        };
      };
      gatherings: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          status: ItemStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
          review_notes: string | null;
          person_id: string | null;
          place_id: string | null;
          title_en: string;
          title_ml: string;
          title_ar: string;
          venue_name_en: string;
          venue_name_ml: string;
          venue_name_ar: string;
          schedule_en: string;
          schedule_ml: string;
          schedule_ar: string;
          latitude: number | null;
          longitude: number | null;
          geom?: unknown;
          sources: SourceCitation[];
          metadata: Record<string, unknown>;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          status?: ItemStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          review_notes?: string | null;
          person_id?: string | null;
          place_id?: string | null;
          title_en: string;
          title_ml: string;
          title_ar: string;
          venue_name_en: string;
          venue_name_ml: string;
          venue_name_ar: string;
          schedule_en: string;
          schedule_ml: string;
          schedule_ar: string;
          latitude?: number | null;
          longitude?: number | null;
          sources?: SourceCitation[];
          metadata?: Record<string, unknown>;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          status?: ItemStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          review_notes?: string | null;
          person_id?: string | null;
          place_id?: string | null;
          title_en?: string;
          title_ml?: string;
          title_ar?: string;
          venue_name_en?: string;
          venue_name_ml?: string;
          venue_name_ar?: string;
          schedule_en?: string;
          schedule_ml?: string;
          schedule_ar?: string;
          latitude?: number | null;
          longitude?: number | null;
          sources?: SourceCitation[];
          metadata?: Record<string, unknown>;
        };
      };
      quotes: {
        Row: {
          id: string;
          created_at: string;
          arabic: string;
          english: string;
          source: string;
          active: boolean;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          arabic: string;
          english: string;
          source: string;
          active?: boolean;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          arabic?: string;
          english?: string;
          source?: string;
          active?: boolean;
          created_by?: string | null;
        };
      };
      badges: {
        Row: {
          id: BadgeId;
          name: string;
          description: string;
          criteria_description: string;
          icon_name: string;
        };
        Insert: {
          id: BadgeId;
          name: string;
          description: string;
          criteria_description: string;
          icon_name: string;
        };
        Update: {
          id?: BadgeId;
          name?: string;
          description?: string;
          criteria_description?: string;
          icon_name?: string;
        };
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: BadgeId;
          awarded_at: string;
          awarded_by: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: BadgeId;
          awarded_at?: string;
          awarded_by?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_id?: BadgeId;
          awarded_at?: string;
          awarded_by?: string | null;
        };
      };
      corrections: {
        Row: {
          id: string;
          created_at: string;
          created_by: string | null;
          status: ItemStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
          review_notes: string | null;
          target_type: "place" | "person" | "gathering";
          target_id: string;
          suggested_changes: Json;
          sources: SourceCitation[];
        };
        Insert: {
          id?: string;
          created_at?: string;
          created_by?: string | null;
          status?: ItemStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          review_notes?: string | null;
          target_type: "place" | "person" | "gathering";
          target_id: string;
          suggested_changes: Json;
          sources?: SourceCitation[];
        };
        Update: {
          id?: string;
          created_at?: string;
          created_by?: string | null;
          status?: ItemStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          review_notes?: string | null;
          target_type?: "place" | "person" | "gathering";
          target_id?: string;
          suggested_changes?: Json;
          sources?: SourceCitation[];
        };
      };
    };
  };
}
