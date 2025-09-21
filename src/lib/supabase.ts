import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types based on the schema
export interface Database {
  public: {
    Tables: {
      roles: {
        Row: {
          role_id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          role_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          role_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      subscription_plans: {
        Row: {
          plan_id: string;
          package_name: string;
          description: string | null;
          total_price_monthly: number | null;
          total_price_annual: number | null;
          quota_limit: number | null;
          features: any[] | null;
          is_active: boolean | null;
          created_at: string;
        };
        Insert: {
          plan_id: string;
          package_name: string;
          description?: string | null;
          total_price_monthly?: number | null;
          total_price_annual?: number | null;
          quota_limit?: number | null;
          features?: any[] | null;
          is_active?: boolean | null;
          created_at?: string;
        };
        Update: {
          plan_id?: string;
          package_name?: string;
          description?: string | null;
          total_price_monthly?: number | null;
          total_price_annual?: number | null;
          quota_limit?: number | null;
          features?: any[] | null;
          is_active?: boolean | null;
          created_at?: string;
        };
      };
      organizations: {
        Row: {
          organization_id: string;
          plan_id: string | null;
          name: string;
          type: string | null;
          status: string | null;
          organization_manager: string | null;
          username: string | null;
          password_hash: string | null;
          number_of_beneficiaries: number | null;
          number_of_surveys: number | null;
          quota: number | null;
          consumed: number | null;
          remaining: number | null;
          region: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          website: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          organization_id: string;
          plan_id?: string | null;
          name: string;
          type?: string | null;
          status?: string | null;
          organization_manager?: string | null;
          username?: string | null;
          password_hash?: string | null;
          number_of_beneficiaries?: number | null;
          number_of_surveys?: number | null;
          quota?: number | null;
          consumed?: number | null;
          remaining?: number | null;
          region?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          website?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          organization_id?: string;
          plan_id?: string | null;
          name?: string;
          type?: string | null;
          status?: string | null;
          organization_manager?: string | null;
          username?: string | null;
          password_hash?: string | null;
          number_of_beneficiaries?: number | null;
          number_of_surveys?: number | null;
          quota?: number | null;
          consumed?: number | null;
          remaining?: number | null;
          region?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          website?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          user_id: string;
          role_id: string | null;
          organization_id: string | null;
          name: string;
          email: string;
          password_hash: string | null;
          phone_number: string | null;
          status: string | null;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          role_id?: string | null;
          organization_id?: string | null;
          name: string;
          email: string;
          password_hash?: string | null;
          phone_number?: string | null;
          status?: string | null;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          role_id?: string | null;
          organization_id?: string | null;
          name?: string;
          email?: string;
          password_hash?: string | null;
          phone_number?: string | null;
          status?: string | null;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      beneficiaries: {
        Row: {
          beneficiary_id: string;
          organization_id: string | null;
          name: string;
          email: string | null;
          phone_number: string | null;
          gender: string | null;
          age_group: string | null;
          education_level: string | null;
          job_title: string | null;
          income_level: string | null;
          marital_status: string | null;
          region: string | null;
          number_of_surveys: number | null;
          completed_surveys: number | null;
          uncompleted_surveys: number | null;
          last_activity: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          beneficiary_id: string;
          organization_id?: string | null;
          name: string;
          email?: string | null;
          phone_number?: string | null;
          gender?: string | null;
          age_group?: string | null;
          education_level?: string | null;
          job_title?: string | null;
          income_level?: string | null;
          marital_status?: string | null;
          region?: string | null;
          number_of_surveys?: number | null;
          completed_surveys?: number | null;
          uncompleted_surveys?: number | null;
          last_activity?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          beneficiary_id?: string;
          organization_id?: string | null;
          name?: string;
          email?: string | null;
          phone_number?: string | null;
          gender?: string | null;
          age_group?: string | null;
          education_level?: string | null;
          job_title?: string | null;
          income_level?: string | null;
          marital_status?: string | null;
          region?: string | null;
          number_of_surveys?: number | null;
          completed_surveys?: number | null;
          uncompleted_surveys?: number | null;
          last_activity?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      surveys: {
        Row: {
          survey_id: string;
          organization_id: string | null;
          title: string;
          description: string | null;
          impact_domains: any[] | null;
          selected_sectors: any[] | null;
          selected_filters: any[] | null;
          status: string | null;
          start_date: string | null;
          end_date: string | null;
          settings: any | null;
          total_responses: number | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          survey_id: string;
          organization_id?: string | null;
          title: string;
          description?: string | null;
          impact_domains?: any[] | null;
          selected_sectors?: any[] | null;
          selected_filters?: any[] | null;
          status?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          settings?: any | null;
          total_responses?: number | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          survey_id?: string;
          organization_id?: string | null;
          title?: string;
          description?: string | null;
          impact_domains?: any[] | null;
          selected_sectors?: any[] | null;
          selected_filters?: any[] | null;
          status?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          settings?: any | null;
          total_responses?: number | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          question_id: string;
          survey_id: string | null;
          question_text: string;
          question_type: string | null;
          domain: string | null;
          sector: string | null;
          phase: string | null;
          order_num: number | null;
          required: boolean | null;
          options: any[] | null;
          created_at: string;
        };
        Insert: {
          question_id: string;
          survey_id?: string | null;
          question_text: string;
          question_type?: string | null;
          domain?: string | null;
          sector?: string | null;
          phase?: string | null;
          order_num?: number | null;
          required?: boolean | null;
          options?: any[] | null;
          created_at?: string;
        };
        Update: {
          question_id?: string;
          survey_id?: string | null;
          question_text?: string;
          question_type?: string | null;
          domain?: string | null;
          sector?: string | null;
          phase?: string | null;
          order_num?: number | null;
          required?: boolean | null;
          options?: any[] | null;
          created_at?: string;
        };
      };
      responses: {
        Row: {
          response_id: string;
          beneficiary_id: string | null;
          survey_id: string | null;
          question_id: string | null;
          response_value: string | null;
          response_data: any | null;
          channel: string | null;
          submitted_at: string;
        };
        Insert: {
          response_id: string;
          beneficiary_id?: string | null;
          survey_id?: string | null;
          question_id?: string | null;
          response_value?: string | null;
          response_data?: any | null;
          channel?: string | null;
          submitted_at?: string;
        };
        Update: {
          response_id?: string;
          beneficiary_id?: string | null;
          survey_id?: string | null;
          question_id?: string | null;
          response_value?: string | null;
          response_data?: any | null;
          channel?: string | null;
          submitted_at?: string;
        };
      };
      activity_log: {
        Row: {
          log_id: string;
          user_id: string | null;
          organization_id: string | null;
          action: string;
          details: string | null;
          ip_address: string | null;
          user_agent: string | null;
          timestamp: string;
        };
        Insert: {
          log_id: string;
          user_id?: string | null;
          organization_id?: string | null;
          action: string;
          details?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          timestamp?: string;
        };
        Update: {
          log_id?: string;
          user_id?: string | null;
          organization_id?: string | null;
          action?: string;
          details?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          timestamp?: string;
        };
      };
      transactions: {
        Row: {
          transaction_id: string;
          organization_id: string | null;
          payment_method: string | null;
          payment_details: any | null;
          date: string | null;
          amount: number | null;
          currency: string | null;
          status: string | null;
          description: string | null;
          invoice_number: string | null;
          created_at: string;
        };
        Insert: {
          transaction_id: string;
          organization_id?: string | null;
          payment_method?: string | null;
          payment_details?: any | null;
          date?: string | null;
          amount?: number | null;
          currency?: string | null;
          status?: string | null;
          description?: string | null;
          invoice_number?: string | null;
          created_at?: string;
        };
        Update: {
          transaction_id?: string;
          organization_id?: string | null;
          payment_method?: string | null;
          payment_details?: any | null;
          date?: string | null;
          amount?: number | null;
          currency?: string | null;
          status?: string | null;
          description?: string | null;
          invoice_number?: string | null;
          created_at?: string;
        };
      };
      requests: {
        Row: {
          request_id: string;
          approved_by: string | null;
          name: string | null;
          email: string | null;
          phone: string | null;
          organization_name: string | null;
          organization_type: string | null;
          country: string | null;
          city: string | null;
          expected_beneficiaries: number | null;
          work_fields: any[] | null;
          description: string | null;
          website: string | null;
          status: string | null;
          submitted_at: string;
          reviewed_at: string | null;
          rejection_reason: string | null;
        };
        Insert: {
          request_id: string;
          approved_by?: string | null;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          organization_name?: string | null;
          organization_type?: string | null;
          country?: string | null;
          city?: string | null;
          expected_beneficiaries?: number | null;
          work_fields?: any[] | null;
          description?: string | null;
          website?: string | null;
          status?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
        };
        Update: {
          request_id?: string;
          approved_by?: string | null;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          organization_name?: string | null;
          organization_type?: string | null;
          country?: string | null;
          city?: string | null;
          expected_beneficiaries?: number | null;
          work_fields?: any[] | null;
          description?: string | null;
          website?: string | null;
          status?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
        };
      };
    };
  };
}

// Export typed client
export type SupabaseClient = typeof supabase;