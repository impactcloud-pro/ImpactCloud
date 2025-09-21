import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://opzxyqfxsqtgfzcnkkoj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wenh5cWZ4c3F0Z2Z6Y25ra29qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NTc0OTMsImV4cCI6MjA3NDAzMzQ5M30.4pFvpIshRQqg5pYtKsPlL6TVw3j3-jpXqovilX0T_nk';

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
    console.log('Checking database connection...');
    
    // Test basic connection first
    const { data, error } = await supabase
      .rpc('now');
    
    if (error) {
      console.error('Basic connection test failed:', error);
      return false;
    }
    
    console.log('Basic connection successful, checking schema...');
    
    // Check if roles table exists
    const { data: rolesData, error: rolesError } = await supabase
      .from('roles')
      .select('count', { count: 'exact', head: true });
    
    if (rolesError && rolesError.code === 'PGRST116') {
      console.log('Schema not found, creating database schema...');
      const schemaCreated = await createDatabaseSchema();
      if (!schemaCreated) {
        console.error('Failed to create database schema');
        return false;
      }
      console.log('Database schema created successfully');
      return true;
    }
    
    if (rolesError) {
      console.error('Error checking roles table:', rolesError);
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
  try {
    console.log('Creating database schema...');
    
    // Read the migration file content and execute it step by step
    const migrationSteps = [
      // Step 1: Create extensions
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
      `CREATE EXTENSION IF NOT EXISTS "pgcrypto";`,
      
      // Step 2: Create roles table
      `CREATE TABLE IF NOT EXISTS roles (
        role_id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        permissions JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );`,
      
      // Step 3: Create subscription_plans table
      `CREATE TABLE IF NOT EXISTS subscription_plans (
        plan_id TEXT PRIMARY KEY,
        package_name TEXT NOT NULL,
        package_name_en TEXT,
        description TEXT,
        total_price_monthly DECIMAL(10,2) DEFAULT 0,
        total_price_annual DECIMAL(10,2) DEFAULT 0,
        quota_limit INTEGER DEFAULT 0,
        features JSONB DEFAULT '[]'::jsonb,
        limits JSONB DEFAULT '{}'::jsonb,
        color TEXT DEFAULT '#183259',
        is_popular BOOLEAN DEFAULT false,
        is_premium BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );`,
      
      // Step 4: Create organizations table
      `CREATE TABLE IF NOT EXISTS organizations (
        organization_id TEXT PRIMARY KEY,
        plan_id TEXT REFERENCES subscription_plans(plan_id),
        name TEXT NOT NULL,
        type TEXT CHECK (type IN ('company', 'nonprofit', 'government', 'educational')),
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
        organization_manager TEXT[] DEFAULT '{}',
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
        description TEXT,
        logo_url TEXT,
        join_date DATE DEFAULT CURRENT_DATE,
        created_by TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );`,
      
      // Step 5: Create users table
      `CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        role_id TEXT REFERENCES roles(role_id),
        organization_id TEXT REFERENCES organizations(organization_id),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT,
        phone_number TEXT,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
        last_login TIMESTAMPTZ,
        profile_data JSONB DEFAULT '{}'::jsonb,
        preferences JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );`
    ];
    
    // Execute each step
    for (const sql of migrationSteps) {
      const { error } = await supabase.rpc('exec_sql', { sql });
      if (error) {
        console.error('Error executing SQL step:', error);
        // Continue with next step instead of failing completely
      }
    }
    
    // Insert default data
    await insertDefaultData();
    
    console.log('Database schema created successfully');
    return true;
  } catch (error) {
    console.error('Failed to create schema:', error);
    return false;
  }
}

// Insert default data
async function insertDefaultData() {
  try {
    // Insert roles
    const { error: rolesError } = await supabase
      .from('roles')
      .upsert([
        { role_id: 'super_admin', name: 'super_admin', description: 'مدير النظام الرئيسي', permissions: ['all'] },
        { role_id: 'admin', name: 'admin', description: 'مدير أثرنا', permissions: ['manage_surveys', 'manage_users', 'view_analytics'] },
        { role_id: 'org_manager', name: 'org_manager', description: 'مدير المنظمة', permissions: ['create_surveys', 'view_own_analytics'] },
        { role_id: 'beneficiary', name: 'beneficiary', description: 'مستفيد', permissions: ['take_surveys'] }
      ], { onConflict: 'role_id' });
    
    if (rolesError) console.error('Error inserting roles:', rolesError);
    
    // Insert subscription plans
    const { error: plansError } = await supabase
      .from('subscription_plans')
      .upsert([
        {
          plan_id: 'starter',
          package_name: 'الباقة المبتدئة',
          package_name_en: 'Starter',
          description: 'مثالية للمنظمات الصغيرة والناشئة',
          total_price_monthly: 299.00,
          total_price_annual: 2990.00,
          quota_limit: 100,
          features: ['إنشاء 10 استبيانات', '500 مستفيد', '2000 استجابة شهرياً'],
          limits: { surveys: 10, beneficiaries: 500, responses: 2000 },
          color: '#10b981'
        },
        {
          plan_id: 'professional',
          package_name: 'الباقة الاحترافية',
          package_name_en: 'Professional',
          description: 'للمنظمات المتوسطة التي تحتاج ميزات متقدمة',
          total_price_monthly: 599.00,
          total_price_annual: 5990.00,
          quota_limit: 500,
          features: ['إنشاء 25 استبيان', '1500 مستفيد', '7500 استجابة شهرياً'],
          limits: { surveys: 25, beneficiaries: 1500, responses: 7500 },
          color: '#3b82f6',
          is_popular: true
        }
      ], { onConflict: 'plan_id' });
    
    if (plansError) console.error('Error inserting subscription plans:', plansError);
    
    console.log('Default data inserted successfully');
  } catch (error) {
    console.error('Error inserting default data:', error);
  }
}

// Alternative schema creation using direct table creation
async function createDatabaseSchemaAlternative() {
  try {
    console.log('Creating schema using alternative method...');
    
    // Create roles table directly
    const { error: rolesError } = await supabase
      .from('roles')
      .select('count', { count: 'exact', head: true });
    
    if (rolesError && rolesError.code === 'PGRST116') {
      // Table doesn't exist, we need to create it via SQL
      console.log('Tables do not exist. Please run the migration manually in Supabase SQL Editor.');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Alternative schema creation failed:', error);
    return false;
  }
}

// Test connection function
export async function testSupabaseConnection() {
  try {
    // Test basic connection using auth endpoint
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase basic connection failed:', error);
      return false;
    }
    
    console.log('Supabase basic connection successful');
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