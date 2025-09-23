/*
  # Complete Database Schema for Social Impact Platform

  1. New Tables
    - `roles` - User roles and permissions
    - `subscription_plans` - Available subscription packages
    - `organizations` - Organizations using the platform
    - `users` - All platform users
    - `beneficiaries` - Beneficiaries within organizations
    - `surveys` - Survey definitions and metadata
    - `questions` - Individual survey questions
    - `responses` - Survey responses from beneficiaries
    - `activity_log` - System activity tracking
    - `transactions` - Payment and billing transactions
    - `requests` - Organization registration requests

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each user role
    - Implement row-level security based on organization membership

  3. Features
    - UUID primary keys for all tables
    - Proper foreign key relationships
    - Timestamps for audit trails
    - JSON fields for flexible data storage
    - Comprehensive indexing for performance
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  role_id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscription plans table
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
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  phone_number TEXT,
  status TEXT DEFAULT 'active',
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create beneficiaries table
CREATE TABLE IF NOT EXISTS beneficiaries (
  beneficiary_id TEXT PRIMARY KEY,
  organization_id TEXT REFERENCES organizations(organization_id),
  name TEXT NOT NULL,
  email TEXT,
  phone_number TEXT,
  gender TEXT,
  age_group TEXT,
  education_level TEXT,
  job_title TEXT,
  income_level TEXT,
  marital_status TEXT,
  region TEXT,
  number_of_surveys INTEGER DEFAULT 0,
  completed_surveys INTEGER DEFAULT 0,
  uncompleted_surveys INTEGER DEFAULT 0,
  last_activity TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create surveys table
CREATE TABLE IF NOT EXISTS surveys (
  survey_id TEXT PRIMARY KEY,
  organization_id TEXT REFERENCES organizations(organization_id),
  title TEXT NOT NULL,
  description TEXT,
  impact_domains JSONB DEFAULT '[]'::jsonb,
  selected_sectors JSONB DEFAULT '[]'::jsonb,
  selected_filters JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'draft',
  start_date DATE,
  end_date DATE,
  settings JSONB DEFAULT '{}'::jsonb,
  total_responses INTEGER DEFAULT 0,
  created_by TEXT REFERENCES users(user_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  question_id TEXT PRIMARY KEY,
  survey_id TEXT REFERENCES surveys(survey_id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT,
  domain TEXT,
  sector TEXT,
  phase TEXT, -- 'pre' or 'post'
  order_num INTEGER,
  required BOOLEAN DEFAULT false,
  options JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create responses table
CREATE TABLE IF NOT EXISTS responses (
  response_id TEXT PRIMARY KEY,
  beneficiary_id TEXT REFERENCES beneficiaries(beneficiary_id),
  survey_id TEXT REFERENCES surveys(survey_id),
  question_id TEXT REFERENCES questions(question_id),
  response_value TEXT,
  response_data JSONB DEFAULT '{}'::jsonb,
  channel TEXT, -- 'web', 'mobile', 'sms', etc.
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activity log table
CREATE TABLE IF NOT EXISTS activity_log (
  log_id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(user_id),
  organization_id TEXT REFERENCES organizations(organization_id),
  action TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  transaction_id TEXT PRIMARY KEY,
  organization_id TEXT REFERENCES organizations(organization_id),
  payment_method TEXT,
  payment_details JSONB DEFAULT '{}'::jsonb,
  date DATE,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'SAR',
  status TEXT DEFAULT 'pending',
  description TEXT,
  invoice_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create requests table (for organization registration requests)
CREATE TABLE IF NOT EXISTS requests (
  request_id TEXT PRIMARY KEY,
  approved_by TEXT REFERENCES users(user_id),
  name TEXT,
  email TEXT,
  phone TEXT,
  organization_name TEXT,
  organization_type TEXT,
  country TEXT,
  city TEXT,
  expected_beneficiaries INTEGER,
  work_fields JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  website TEXT,
  status TEXT DEFAULT 'pending',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT
);

-- Enable Row Level Security on all tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Create policies for roles table
CREATE POLICY "Anyone can read roles" ON roles FOR SELECT USING (true);
CREATE POLICY "Only super admins can modify roles" ON roles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id = auth.uid() 
    AND users.role_id = 'super_admin'
  )
);

-- Create policies for subscription_plans table
CREATE POLICY "Anyone can read subscription plans" ON subscription_plans FOR SELECT USING (true);
CREATE POLICY "Only super admins can modify subscription plans" ON subscription_plans FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id = auth.uid() 
    AND users.role_id = 'super_admin'
  )
);

-- Create policies for organizations table
CREATE POLICY "Super admins can see all organizations" ON organizations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id = auth.uid() 
    AND users.role_id = 'super_admin'
  )
);

CREATE POLICY "Admins can see all organizations" ON organizations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id = auth.uid() 
    AND users.role_id = 'admin'
  )
);

CREATE POLICY "Organization managers can see their organization" ON organizations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id = auth.uid() 
    AND users.organization_id = organizations.organization_id
  )
);

CREATE POLICY "Super admins can modify organizations" ON organizations FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id = auth.uid() 
    AND users.role_id = 'super_admin'
  )
);

-- Create policies for users table
CREATE POLICY "Users can read their own data" ON users FOR SELECT USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM users admin_user
    WHERE admin_user.user_id = auth.uid() 
    AND admin_user.role_id IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Admins can manage users" ON users FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users admin_user
    WHERE admin_user.user_id = auth.uid() 
    AND admin_user.role_id IN ('super_admin', 'admin')
  )
);

-- Create policies for beneficiaries table
CREATE POLICY "Organization members can see their beneficiaries" ON beneficiaries FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id = auth.uid() 
    AND (
      users.organization_id = beneficiaries.organization_id OR
      users.role_id IN ('super_admin', 'admin')
    )
  )
);

CREATE POLICY "Organization managers can manage their beneficiaries" ON beneficiaries FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id = auth.uid() 
    AND (
      (users.organization_id = beneficiaries.organization_id AND users.role_id = 'org_manager') OR
      users.role_id IN ('super_admin', 'admin')
    )
  )
);

-- Create policies for surveys table
CREATE POLICY "Organization members can see their surveys" ON surveys FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id = auth.uid() 
    AND (
      users.organization_id = surveys.organization_id OR
      users.role_id IN ('super_admin', 'admin')
    )
  )
);

CREATE POLICY "Organization managers can manage their surveys" ON surveys FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id = auth.uid() 
    AND (
      (users.organization_id = surveys.organization_id AND users.role_id = 'org_manager') OR
      users.role_id IN ('super_admin', 'admin')
    )
  )
);

-- Create policies for questions table
CREATE POLICY "Users can read questions for accessible surveys" ON questions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM surveys 
    JOIN users ON (
      users.user_id = auth.uid() AND (
        users.organization_id = surveys.organization_id OR
        users.role_id IN ('super_admin', 'admin', 'beneficiary')
      )
    )
    WHERE surveys.survey_id = questions.survey_id
  )
);

CREATE POLICY "Survey creators can manage questions" ON questions FOR ALL USING (
  EXISTS (
    SELECT 1 FROM surveys 
    JOIN users ON (
      users.user_id = auth.uid() AND (
        (users.organization_id = surveys.organization_id AND users.role_id = 'org_manager') OR
        users.role_id IN ('super_admin', 'admin')
      )
    )
    WHERE surveys.survey_id = questions.survey_id
  )
);

-- Create policies for responses table
CREATE POLICY "Users can read responses for their surveys" ON responses FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM surveys 
    JOIN users ON (
      users.user_id = auth.uid() AND (
        users.organization_id = surveys.organization_id OR
        users.role_id IN ('super_admin', 'admin')
      )
    )
    WHERE surveys.survey_id = responses.survey_id
  )
);

CREATE POLICY "Beneficiaries can submit responses" ON responses FOR INSERT USING (
  EXISTS (
    SELECT 1 FROM beneficiaries 
    WHERE beneficiaries.beneficiary_id = responses.beneficiary_id
  ) OR
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id = auth.uid()
  )
);

-- Create policies for activity_log table
CREATE POLICY "Admins can read all activity logs" ON activity_log FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id = auth.uid() 
    AND users.role_id IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Organization managers can read their organization logs" ON activity_log FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id = auth.uid() 
    AND users.organization_id = activity_log.organization_id
    AND users.role_id = 'org_manager'
  )
);

CREATE POLICY "System can insert activity logs" ON activity_log FOR INSERT USING (true);

-- Create policies for transactions table
CREATE POLICY "Admins can see all transactions" ON transactions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id = auth.uid() 
    AND users.role_id IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Organization managers can see their transactions" ON transactions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id = auth.uid() 
    AND users.organization_id = transactions.organization_id
    AND users.role_id = 'org_manager'
  )
);

CREATE POLICY "Admins can manage transactions" ON transactions FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id = auth.uid() 
    AND users.role_id IN ('super_admin', 'admin')
  )
);

-- Create policies for requests table
CREATE POLICY "Admins can see all requests" ON requests FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id = auth.uid() 
    AND users.role_id IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Anyone can submit requests" ON requests FOR INSERT USING (true);

CREATE POLICY "Admins can manage requests" ON requests FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id = auth.uid() 
    AND users.role_id IN ('super_admin', 'admin')
  )
);

-- Insert default roles
INSERT INTO roles (role_id, name, description) VALUES
  ('super_admin', 'super_admin', 'مدير النظام الرئيسي - صلاحيات كاملة'),
  ('admin', 'admin', 'مدير أثرنا - إدارة الاستبيانات والمنظمات'),
  ('org_manager', 'org_manager', 'مدير المنظمة - إدارة المستفيدين والاستبيانات'),
  ('beneficiary', 'beneficiary', 'مستفيد - المشاركة في الاستبيانات')
ON CONFLICT (role_id) DO NOTHING;

-- Insert default subscription plans
INSERT INTO subscription_plans (plan_id, package_name, description, total_price_monthly, total_price_annual, quota_limit, features) VALUES
  ('free', 'الباقة المجانية', 'باقة تجريبية محدودة', 0, 0, 100, '["5 استبيانات", "100 مستفيد", "دعم أساسي"]'::jsonb),
  ('basic', 'الباقة الأساسية', 'للمنظمات الصغيرة', 299, 2990, 1000, '["25 استبيان", "1000 مستفيد", "تقارير أساسية", "دعم فني"]'::jsonb),
  ('professional', 'الباقة الاحترافية', 'للمنظمات المتوسطة', 599, 5990, 5000, '["استبيانات غير محدودة", "5000 مستفيد", "تحليلات متقدمة", "دعم 24/7"]'::jsonb),
  ('enterprise', 'باقة المؤسسات', 'للمؤسسات الكبيرة', 1999, 19990, -1, '["استبيانات غير محدودة", "مستفيدين غير محدودين", "حلول مخصصة", "فريق دعم مخصص"]'::jsonb)
ON CONFLICT (plan_id) DO NOTHING;

-- Insert demo organizations
INSERT INTO organizations (organization_id, plan_id, name, type, organization_manager, username, password_hash, region, contact_email, contact_phone, quota, consumed, remaining, number_of_surveys, number_of_beneficiaries) VALUES
  ('org_exology', 'enterprise', 'Exology', 'company', 'مدير النظام', 'exology_admin', '$2a$10$dummy_hash_for_demo', 'الرياض', 'admin@exology.com', '+966501234567', -1, 0, -1, 0, 0),
  ('org_atharonaa', 'enterprise', 'Atharonaa', 'company', 'مدير أثرنا', 'atharonaa_admin', '$2a$10$dummy_hash_for_demo', 'الرياض', 'admin@atharonaa.com', '+966507654321', -1, 0, -1, 0, 0),
  ('org_charity', 'professional', 'مؤسسة خيرية', 'nonprofit', 'مدير المنظمة', 'charity_manager', '$2a$10$dummy_hash_for_demo', 'جدة', 'manager@charity.org', '+966509876543', 5000, 1200, 3800, 15, 250)
ON CONFLICT (organization_id) DO NOTHING;

-- Insert demo users
INSERT INTO users (user_id, role_id, organization_id, name, email, password_hash, phone_number, status, last_login) VALUES
  ('user_super_admin', 'super_admin', 'org_exology', 'مدير النظام', 'superadmin@exology.com', '$2a$10$dummy_hash_for_demo', '+966501234567', 'active', NOW()),
  ('user_admin', 'admin', 'org_atharonaa', 'مدير أثرنا', 'admin@atharonaa.com', '$2a$10$dummy_hash_for_demo', '+966507654321', 'active', NOW()),
  ('user_org_manager', 'org_manager', 'org_charity', 'مدير المنظمة', 'manager@org.com', '$2a$10$dummy_hash_for_demo', '+966509876543', 'active', NOW()),
  ('user_beneficiary', 'beneficiary', 'org_charity', 'المستفيد', 'beneficiary@example.com', '$2a$10$dummy_hash_for_demo', '+966512345678', 'active', NOW())
ON CONFLICT (user_id) DO NOTHING;

-- Insert demo beneficiaries
INSERT INTO beneficiaries (beneficiary_id, organization_id, name, email, phone_number, gender, age_group, education_level, job_title, region) VALUES
  ('ben_001', 'org_charity', 'أحمد محمد السالم', 'ahmed@example.com', '+966501234567', 'ذكر', '25-35', 'جامعي', 'مطور برمجيات', 'الرياض'),
  ('ben_002', 'org_charity', 'فاطمة عبدالله', 'fatima@example.com', '+966507654321', 'أنثى', '30-40', 'ثانوي', 'معلمة', 'جدة'),
  ('ben_003', 'org_charity', 'محمد عبدالرحمن', 'mohammed@example.com', '+966509876543', 'ذكر', '40-50', 'جامعي', 'مهندس', 'الدمام')
ON CONFLICT (beneficiary_id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_organization ON beneficiaries(organization_id);
CREATE INDEX IF NOT EXISTS idx_surveys_organization ON surveys(organization_id);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);
CREATE INDEX IF NOT EXISTS idx_questions_survey ON questions(survey_id);
CREATE INDEX IF NOT EXISTS idx_responses_survey ON responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_responses_beneficiary ON responses(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_organization ON activity_log(organization_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_timestamp ON activity_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_transactions_organization ON transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION update_organization_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update survey count when surveys are added/removed
  IF TG_TABLE_NAME = 'surveys' THEN
    UPDATE organizations 
    SET number_of_surveys = (
      SELECT COUNT(*) FROM surveys WHERE organization_id = COALESCE(NEW.organization_id, OLD.organization_id)
    )
    WHERE organization_id = COALESCE(NEW.organization_id, OLD.organization_id);
  END IF;
  
  -- Update beneficiary count when beneficiaries are added/removed
  IF TG_TABLE_NAME = 'beneficiaries' THEN
    UPDATE organizations 
    SET number_of_beneficiaries = (
      SELECT COUNT(*) FROM beneficiaries WHERE organization_id = COALESCE(NEW.organization_id, OLD.organization_id)
    )
    WHERE organization_id = COALESCE(NEW.organization_id, OLD.organization_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update organization stats
CREATE TRIGGER update_org_stats_on_survey_change
  AFTER INSERT OR UPDATE OR DELETE ON surveys
  FOR EACH ROW EXECUTE FUNCTION update_organization_stats();

CREATE TRIGGER update_org_stats_on_beneficiary_change
  AFTER INSERT OR UPDATE OR DELETE ON beneficiaries
  FOR EACH ROW EXECUTE FUNCTION update_organization_stats();

-- Create function to update survey response count
CREATE OR REPLACE FUNCTION update_survey_response_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE surveys 
  SET total_responses = (
    SELECT COUNT(*) FROM responses WHERE survey_id = COALESCE(NEW.survey_id, OLD.survey_id)
  )
  WHERE survey_id = COALESCE(NEW.survey_id, OLD.survey_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update survey response count
CREATE TRIGGER update_survey_response_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON responses
  FOR EACH ROW EXECUTE FUNCTION update_survey_response_count();

-- Create function to update beneficiary survey counts
CREATE OR REPLACE FUNCTION update_beneficiary_survey_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE beneficiaries 
  SET 
    number_of_surveys = (
      SELECT COUNT(DISTINCT survey_id) 
      FROM responses 
      WHERE beneficiary_id = COALESCE(NEW.beneficiary_id, OLD.beneficiary_id)
    ),
    completed_surveys = (
      SELECT COUNT(DISTINCT survey_id) 
      FROM responses 
      WHERE beneficiary_id = COALESCE(NEW.beneficiary_id, OLD.beneficiary_id)
      AND response_value IS NOT NULL
    ),
    last_activity = NOW()
  WHERE beneficiary_id = COALESCE(NEW.beneficiary_id, OLD.beneficiary_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update beneficiary stats
CREATE TRIGGER update_beneficiary_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON responses
  FOR EACH ROW EXECUTE FUNCTION update_beneficiary_survey_count();

-- Create function to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beneficiaries_updated_at
  BEFORE UPDATE ON beneficiaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_surveys_updated_at
  BEFORE UPDATE ON surveys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();