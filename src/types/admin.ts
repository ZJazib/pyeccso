export type AppRole =
  | "super_admin"
  | "admin"
  | "content_manager"
  | "editor"
  | "media_manager"
  | "learn_manager"
  | "teacher"
  | "student"
  | "hr_manager"
  | "finance_manager"
  | "project_manager"
  | "communications"
  | "viewer";

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  mfa_enabled: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at?: string;
  roles?: AppRole[];
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export type SupportedLocale = "en" | "fa" | "ps" | "ar" | "fr";

export interface I18nText {
  en?: string;
  fa?: string;
  dr?: string;
  ps?: string;
  ar?: string;
  fr?: string;
}

export interface ContentItem<TData = Record<string, any>> {
  id: string;
  type: string;
  slug: string | null;
  status: "draft" | "published" | "archived";
  position: number;
  cover_url: string | null;
  data: TData;
  published_at: string | null;
  publish_at: string | null;
  unpublish_at: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
  deleted_at?: string | null;
}

export interface MediaAsset {
  id: string;
  storage_bucket: string;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  folder: string | null;
  public_url: string | null;
  alt_text?: string | null;
  tags?: string[] | null;
  uploaded_by?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Application {
  id: string;
  kind: "training" | "job" | "volunteer" | "internship";
  reference_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  province: string | null;
  data: {
    cv_url?: string;
    cv_name?: string;
    cover_letter?: string;
    experience_years?: string;
    education_level?: string;
    applied_for_title?: string;
    [key: string]: any;
  };
  status: "new" | "pending" | "reviewing" | "shortlisted" | "accepted" | "rejected" | "waitlist";
  notes: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  province?: string | null;
  status: "new" | "read" | "replied" | "archived" | "spam";
  reply_text?: string | null;
  handled_at?: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: "INSERT" | "UPDATE" | "DELETE" | string;
  target_table: string;
  entity_type?: string | null;
  entity_id?: string | null;
  old_data: Record<string, any> | null;
  new_data: Record<string, any> | null;
  diff: Record<string, any> | null;
  ip_address: string | null;
  user_agent?: string | null;
  created_at: string;
}

export interface SiteSettings {
  branding?: {
    org_name_en?: string;
    org_name_fa?: string;
    org_name_ps?: string;
    tagline_en?: string;
    logo_url?: string;
    favicon_url?: string;
  };
  seo?: {
    meta_title?: string;
    meta_description?: string;
    og_image_url?: string;
  };
  contact?: {
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    emergency_hotline?: string;
  };
  social_links?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  hesabpay?: {
    merchant_id?: string;
    environment?: "sandbox" | "production";
    active?: boolean;
    preset_amounts_afn?: number[];
    preset_amounts_usd?: number[];
    default_campaign_id?: string;
  };
  donations?: {
    bank_name?: string;
    account_title?: string;
    account_number?: string;
    iban?: string;
    swift?: string;
    cash_office_address?: string;
  };
  locations?: {
    items: Array<{
      name: string;
      address?: string;
      phone?: string;
      email?: string;
      query?: string;
      lat?: number;
      lng?: number;
      zoom?: number;
    }>;
  };
}
