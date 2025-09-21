import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://opzxyqfxsqtgfzcnkkoj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wenh5cWZ4c3F0Z2Z6Y25ra29qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NTc0OTMsImV4cCI6MjA3NDAzMzQ5M30.4pFvpIshRQqg5pYtKsPlL6TVw3j3-jpXqovilX0T_nk';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'social-impact-platform'
    }
  }
});

// Initialize database schema if needed
export async function initializeDatabase() {
  try {
    // Check if roles table exists
    const { data, error } = await supabase
      .from('roles')
      .select('count', { count: 'exact', head: true });
    
    if (error && error.code === 'PGRST116') {
      console.log('Database tables not found, creating schema...');
      await createDatabaseSchema();
      return true;
    }
    
    if (error) {
      console.error('Database connection error:', error);
      return false;
    }
    
    console.log('Database schema exists and is accessible');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
}

// Create database schema using SQL
async function createDatabaseSchema() {
  const schemaSQL = `
    -- Create roles table
    CREATE TABLE IF NOT EXISTS roles (
      role_id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Create subscription_plans table
    CREATE TABLE IF NOT EXISTS subscription_plans (
      plan_id TEXT PRIMARY KEY,
      package_name TEXT NOT NULL,
      description TEXT,
      total_price_monthly DECIMAL(10,2),
      total_price_annual DECIMAL(10,2),
      quota_limit INTEGER,
      features JSONB DEFAULT '[]'::jsonb,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Create organizations table
    CREATE TABLE IF NOT EXISTS organizations (
      organization_id TEXT PRIMARY KEY,
      plan_id TEXT REFERENCES subscription_plans(plan_id),
      name TEXT NOT NULL,
      type TEXT,
      status TEXT DEFAULT 'active',
      organization_manager TEXT,
      username TEXT UNIQUE,
      password_hash TEXT,
      number_of_beneficiaries INTEGER DEFAULT 0,
      number_of_surveys INTEGER DEFAULT 0,
      quota INTEGER DEFAULT 0,
      consumed INTEGER DEFAULT 0,
      remaining INTEGER DEFAULT 0,
      region TEXT,
      contact_email TEXT,
      contact_phone TEXT,
      website TEXT,
      created_by TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Create users table
    CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      role_id TEXT REFERENCES roles(role_id),
      organization_id TEXT REFERENCES organizations(organization_id),
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      phone_number TEXT,
      status TEXT DEFAULT 'active',
      last_login TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Insert default roles
    INSERT INTO roles (role_id, name, description) VALUES
      ('super_admin', 'super_admin', 'مدير النظام الرئيسي'),
      ('admin', 'admin', 'مدير أثرنا'),
      ('org_manager', 'org_manager', 'مدير المنظمة'),
      ('beneficiary', 'beneficiary', 'مستفيد')
    ON CONFLICT (role_id) DO NOTHING;

    -- Insert default subscription plans
    INSERT INTO subscription_plans (plan_id, package_name, description, total_price_monthly, total_price_annual, quota_limit, features) VALUES
      ('basic', 'الباقة الأساسية', 'باقة مناسبة للمنظمات الصغيرة', 299.00, 2988.00, 100, '["إنشاء الاستبيانات", "تحليل البيانات الأساسي", "دعم فني"]'::jsonb),
      ('professional', 'الباقة الاحترافية', 'باقة مناسبة للمنظمات المتوسطة', 599.00, 5988.00, 500, '["إنشاء الاستبيانات", "تحليل البيانات المتقدم", "تقارير مخصصة", "دعم فني متقدم"]'::jsonb),
      ('enterprise', 'باقة المؤسسات', 'باقة مناسبة للمؤسسات الكبيرة', 1199.00, 11988.00, 2000, '["إنشاء الاستبيانات", "تحليل البيانات المتقدم", "تقارير مخصصة", "دعم فني متقدم", "تكامل API"]'::jsonb)
    ON CONFLICT (plan_id) DO NOTHING;

    -- Enable RLS on all tables
    ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
    ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;

    -- Create basic policies
    CREATE POLICY "Allow read access to roles" ON roles FOR SELECT USING (true);
    CREATE POLICY "Allow read access to subscription_plans" ON subscription_plans FOR SELECT USING (true);
  `;

  try {
    const { error } = await supabase.rpc('exec_sql', { sql: schemaSQL });
    if (error) {
      console.error('Schema creation error:', error);
      throw error;
    }
    console.log('Database schema created successfully');
  } catch (error) {
    console.error('Failed to create schema:', error);
    throw error;
  }
}

// Test connection function
export async function testSupabaseConnection() {
  try {
    // First try to initialize database if needed
    const initialized = await initializeDatabase();
    if (!initialized) {
      return false;
    }

    const { data, error } = await supabase
      .from('roles')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
}

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