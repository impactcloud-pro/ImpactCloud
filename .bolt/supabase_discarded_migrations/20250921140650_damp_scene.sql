/*
  # Complete Social Impact Platform Database Schema

  1. New Tables
    - `roles` - User roles and permissions system
    - `subscription_plans` - Available subscription packages with pricing
    - `organizations` - Organizations using the platform
    - `users` - All platform users with role-based access
    - `beneficiaries` - Beneficiaries within organizations
    - `surveys` - Survey definitions and metadata
    - `questions` - Individual survey questions with types and options
    - `responses` - Survey responses from beneficiaries
    - `activity_log` - System activity tracking and audit trail
    - `transactions` - Payment and billing transactions
    - `requests` - Organization registration requests

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies based on user roles
    - Organization-based data isolation
    - Secure access patterns for different user types

  3. Features
    - Automatic triggers for updating counts and statistics
    - Demo data for testing and development
    - Comprehensive indexing for performance
    - Foreign key constraints for data integrity
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  role_id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
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
);

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
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
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  last_login TIMESTAMPTZ,
  profile_data JSONB DEFAULT '{}'::jsonb,
  preferences JSONB DEFAULT '{}'::jsonb,
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
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  age INTEGER CHECK (age >= 0 AND age <= 120),
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
  demographic_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create surveys table
CREATE TABLE IF NOT EXISTS surveys (
  survey_id TEXT PRIMARY KEY,
  organization_id TEXT REFERENCES organizations(organization_id),
  title TEXT NOT NULL,
  description TEXT,
  impact_domains TEXT[] DEFAULT '{}',
  selected_sectors TEXT[] DEFAULT '{}',
  selected_filters TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'paused')),
  start_date DATE,
  end_date DATE,
  settings JSONB DEFAULT '{}'::jsonb,
  total_responses INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0,
  average_completion_time INTERVAL,
  created_by TEXT REFERENCES users(user_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  question_id TEXT PRIMARY KEY,
  survey_id TEXT REFERENCES surveys(survey_id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('text', 'multiple_choice', 'single_choice', 'rating', 'yes_no', 'date', 'number')),
  domain TEXT,
  sector TEXT,
  phase TEXT CHECK (phase IN ('pre', 'post')),
  order_num INTEGER,
  required BOOLEAN DEFAULT false,
  options JSONB DEFAULT '[]'::jsonb,
  validation_rules JSONB DEFAULT '{}'::jsonb,
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
  channel TEXT DEFAULT 'web',
  completion_time INTERVAL,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activity_log table
CREATE TABLE IF NOT EXISTS activity_log (
  log_id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(user_id),
  organization_id TEXT REFERENCES organizations(organization_id),
  action TEXT NOT NULL,
  details TEXT,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  transaction_id TEXT PRIMARY KEY,
  organization_id TEXT REFERENCES organizations(organization_id),
  payment_method TEXT,
  payment_details JSONB DEFAULT '{}'::jsonb,
  date DATE DEFAULT CURRENT_DATE,
  time TIME DEFAULT CURRENT_TIME,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'SAR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  type TEXT DEFAULT 'subscription' CHECK (type IN ('subscription', 'upgrade', 'manual', 'refund')),
  description TEXT,
  invoice_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create requests table
CREATE TABLE IF NOT EXISTS requests (
  request_id TEXT PRIMARY KEY,
  approved_by TEXT REFERENCES users(user_id),
  name TEXT,
  email TEXT,
  phone TEXT,
  organization_name TEXT NOT NULL,
  organization_type TEXT,
  country TEXT,
  city TEXT,
  expected_beneficiaries INTEGER,
  work_fields TEXT[] DEFAULT '{}',
  description TEXT,
  website TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT
);

-- Insert default roles
INSERT INTO roles (role_id, name, description, permissions) VALUES
  ('super_admin', 'super_admin', 'مدير النظام الرئيسي', '["all"]'::jsonb),
  ('admin', 'admin', 'مدير أثرنا', '["manage_surveys", "manage_users", "view_analytics", "manage_billing", "manage_organizations"]'::jsonb),
  ('org_manager', 'org_manager', 'مدير المنظمة', '["create_surveys", "view_own_analytics", "manage_org_users", "manage_beneficiaries"]'::jsonb),
  ('beneficiary', 'beneficiary', 'مستفيد', '["take_surveys", "view_own_responses"]'::jsonb)
ON CONFLICT (role_id) DO NOTHING;

-- Insert default subscription plans
INSERT INTO subscription_plans (plan_id, package_name, package_name_en, description, total_price_monthly, total_price_annual, quota_limit, features, limits, color, is_popular, is_premium) VALUES
  ('starter', 'الباقة المبتدئة', 'Starter', 'مثالية للمنظمات الصغيرة والناشئة', 299.00, 2990.00, 100, 
   '["إنشاء 10 استبيانات", "500 مستفيد", "2000 استجابة شهرياً", "تقارير أساسية", "دعم فني عبر البريد الإلكتروني"]'::jsonb,
   '{"surveys": 10, "beneficiaries": 500, "responses": 2000, "storage": "2 GB", "support": "البريد الإلكتروني"}'::jsonb,
   '#10b981', false, false),
  
  ('professional', 'الباقة الاحترافية', 'Professional', 'للمنظمات المتوسطة التي تحتاج ميزات متقدمة', 599.00, 5990.00, 500,
   '["إنشاء 25 استبيان", "1500 مستفيد", "7500 استجابة شهرياً", "تقارير متقدمة مع الذكاء الاصطناعي", "تحليل البيانات المتقدم", "دعم فني على مدار الساعة"]'::jsonb,
   '{"surveys": 25, "beneficiaries": 1500, "responses": 7500, "storage": "5 GB", "support": "24/7"}'::jsonb,
   '#3b82f6', true, false),
  
  ('premium', 'الباقة المتميزة', 'Premium', 'للمنظمات الكبيرة مع احتياجات شاملة', 999.00, 9990.00, 1000,
   '["إنشاء 50 استبيان", "2500 مستفيد", "15000 استجابة شهرياً", "تحليل الأثر الاجتماعي المتقدم", "لوحة تحكم تفاعلية", "تقارير مخصصة", "API متكامل", "مدير حساب مخصص"]'::jsonb,
   '{"surveys": 50, "beneficiaries": 2500, "responses": 15000, "storage": "10 GB", "support": "مدير حساب مخصص"}'::jsonb,
   '#8b5cf6', false, true),
  
  ('enterprise', 'باقة المؤسسات', 'Enterprise', 'للمؤسسات الكبيرة مع احتياجات مخصصة', 1999.00, 19990.00, -1,
   '["استبيانات غير محدودة", "مستفيدين غير محدودين", "استجابات غير محدودة", "حلول مخصصة للمؤسسات", "تكامل مع الأنظمة الموجودة", "تدريب وورش عمل", "استشارات متخصصة", "فريق دعم مخصص"]'::jsonb,
   '{"surveys": -1, "beneficiaries": -1, "responses": -1, "storage": "غير محدود", "support": "فريق مخصص"}'::jsonb,
   '#f59e0b', false, true)
ON CONFLICT (plan_id) DO NOTHING;

-- Insert demo organizations
INSERT INTO organizations (organization_id, plan_id, name, type, status, organization_manager, username, password_hash, region, contact_email, contact_phone, quota, consumed, remaining, number_of_surveys, number_of_beneficiaries) VALUES
  ('org_001', 'professional', 'مؤسسة التنمية الاجتماعية', 'nonprofit', 'active', 
   '{"أحمد محمد الشريف", "سارة علي الزهراني"}', 'social_dev_org', 
   crypt('SecurePass123', gen_salt('bf')), 'الرياض', 'info@social-dev.org', '+966501234567',
   1000, 780, 220, 25, 15),
  
  ('org_002', 'enterprise', 'شركة الابتكار التقني', 'company', 'active',
   '{"فاطمة سالم القحطاني"}', 'tech_innovation',
   crypt('TechPass@2024', gen_salt('bf')), 'جدة', 'info@tech-innovation.com', '+966507654321',
   2500, 1850, 650, 45, 32),
  
  ('org_003', 'enterprise', 'وزارة التنمية الاجتماعية', 'government', 'active',
   '{"خالد إبراهيم العتيبي", "منى عبدالعزيز الدوسري", "عبدالرحمن طالب الحربي"}', 'social_ministry',
   crypt('Gov2024!', gen_salt('bf')), 'الرياض', 'contact@social.gov.sa', '+966112345678',
   5000, 3200, 1800, 120, 85)
ON CONFLICT (organization_id) DO NOTHING;

-- Insert demo users
INSERT INTO users (user_id, role_id, organization_id, name, email, password_hash, phone_number, status) VALUES
  ('user_001', 'super_admin', NULL, 'مدير النظام', 'superadmin@exology.com', 
   crypt('admin123', gen_salt('bf')), '+966501111111', 'active'),
  
  ('user_002', 'admin', NULL, 'مدير أثرنا', 'admin@atharonaa.com',
   crypt('admin123', gen_salt('bf')), '+966502222222', 'active'),
  
  ('user_003', 'org_manager', 'org_001', 'مدير المنظمة', 'manager@org.com',
   crypt('manager123', gen_salt('bf')), '+966503333333', 'active'),
  
  ('user_004', 'beneficiary', 'org_001', 'المستفيد', 'beneficiary@example.com',
   crypt('user123', gen_salt('bf')), '+966504444444', 'active')
ON CONFLICT (user_id) DO NOTHING;

-- Insert demo beneficiaries
INSERT INTO beneficiaries (beneficiary_id, organization_id, name, email, phone_number, gender, age, education_level, job_title, region) VALUES
  ('ben_001', 'org_001', 'سارة أحمد الشريف', 'sara.ahmed@example.com', '+966501234567', 'female', 28, 'جامعي', 'محاسبة', 'الرياض'),
  ('ben_002', 'org_001', 'محمد عبدالله القحطاني', 'mohammed.abdullah@example.com', '+966502345678', 'male', 35, 'جامعي', 'مطور برمجيات', 'الرياض'),
  ('ben_003', 'org_001', 'فاطمة سالم النجار', 'fatima.salem@example.com', '+966503456789', 'female', 31, 'دراسات عليا', 'مديرة مشاريع', 'جدة'),
  ('ben_004', 'org_002', 'عبدالرحمن محمد الدوسري', 'abdulrahman.mohammed@example.com', '+966504567890', 'male', 26, 'جامعي', 'مصمم جرافيكي', 'الدمام'),
  ('ben_005', 'org_002', 'نورا خالد العتيبي', 'nora.khaled@example.com', '+966505678901', 'female', 29, 'جامعي', 'أخصائية موارد بشرية', 'الرياض')
ON CONFLICT (beneficiary_id) DO NOTHING;

-- Insert demo surveys
INSERT INTO surveys (survey_id, organization_id, title, description, selected_sectors, selected_filters, status, total_responses, created_by) VALUES
  ('survey_001', 'org_001', 'استبيان قياس الأثر الاجتماعي للبرامج التعليمية', 
   'قياس أثر البرامج التعليمية على المستفيدين في مختلف المناطق والفئات العمرية',
   '{"education_culture", "income_work"}', '{"age", "gender", "education", "region"}', 'active', 156, 'user_003'),
  
  ('survey_002', 'org_001', 'استبيان تقييم برنامج الدعم الصحي',
   'تقييم فعالية برامج الدعم الصحي والتوعية الصحية',
   '{"health_environment"}', '{"age", "gender", "region"}', 'active', 89, 'user_003'),
  
  ('survey_003', 'org_002', 'دراسة أثر مشاريع الإسكان التنموي',
   'قياس أثر مشاريع الإسكان على تحسين جودة الحياة',
   '{"housing_infrastructure"}', '{"region", "marital_status", "income"}', 'completed', 234, 'user_003')
ON CONFLICT (survey_id) DO NOTHING;

-- Insert demo questions
INSERT INTO questions (question_id, survey_id, question_text, question_type, sector, phase, order_num, required, options) VALUES
  ('q_001', 'survey_001', 'ما هو مستواك التعليمي الحالي؟', 'single_choice', 'education_culture', 'pre', 1, true,
   '["ابتدائي", "متوسط", "ثانوي", "جامعي", "دراسات عليا"]'::jsonb),
  
  ('q_002', 'survey_001', 'هل تعمل حالياً؟', 'single_choice', 'income_work', 'pre', 2, true,
   '["نعم", "لا", "أبحث عن عمل"]'::jsonb),
  
  ('q_003', 'survey_001', 'كيف تقيم مهاراتك الحالية؟', 'rating', 'education_culture', 'pre', 3, true, '[]'::jsonb),
  
  ('q_004', 'survey_001', 'هل تحسن مستواك التعليمي بعد البرنامج؟', 'single_choice', 'education_culture', 'post', 4, true,
   '["تحسن كثيراً", "تحسن قليلاً", "لم يتحسن", "تراجع"]'::jsonb),
  
  ('q_005', 'survey_001', 'هل حصلت على عمل بعد البرنامج؟', 'single_choice', 'income_work', 'post', 5, true,
   '["نعم", "لا، لكن حصلت على عروض", "لا، ما زلت أبحث"]'::jsonb)
ON CONFLICT (question_id) DO NOTHING;

-- Insert demo responses
INSERT INTO responses (response_id, beneficiary_id, survey_id, question_id, response_value, channel) VALUES
  ('resp_001', 'ben_001', 'survey_001', 'q_001', 'جامعي', 'web'),
  ('resp_002', 'ben_001', 'survey_001', 'q_002', 'نعم', 'web'),
  ('resp_003', 'ben_001', 'survey_001', 'q_003', '4', 'web'),
  ('resp_004', 'ben_002', 'survey_001', 'q_001', 'ثانوي', 'web'),
  ('resp_005', 'ben_002', 'survey_001', 'q_002', 'أبحث عن عمل', 'web')
ON CONFLICT (response_id) DO NOTHING;

-- Insert demo activity logs
INSERT INTO activity_log (log_id, user_id, organization_id, action, details, user_agent) VALUES
  ('log_001', 'user_003', 'org_001', 'إنشاء استبيان', 'تم إنشاء استبيان "قياس الأثر الاجتماعي للبرامج التعليمية"', 'Mozilla/5.0'),
  ('log_002', 'user_003', 'org_001', 'إضافة مستفيد', 'تم إضافة مستفيد جديد: سارة أحمد الشريف', 'Mozilla/5.0'),
  ('log_003', 'user_002', NULL, 'تسجيل دخول', 'تم تسجيل الدخول بنجاح', 'Mozilla/5.0')
ON CONFLICT (log_id) DO NOTHING;

-- Insert demo transactions
INSERT INTO transactions (transaction_id, organization_id, payment_method, amount, currency, status, type, description) VALUES
  ('txn_001', 'org_001', 'بطاقة ائتمان', 599.00, 'SAR', 'completed', 'subscription', 'اشتراك شهري - الباقة الاحترافية'),
  ('txn_002', 'org_002', 'تحويل بنكي', 1999.00, 'SAR', 'completed', 'subscription', 'اشتراك شهري - باقة المؤسسات'),
  ('txn_003', 'org_003', 'PayTabs', 1999.00, 'SAR', 'pending', 'subscription', 'اشتراك شهري - باقة المؤسسات')
ON CONFLICT (transaction_id) DO NOTHING;

-- Insert demo organization requests
INSERT INTO requests (request_id, name, email, phone, organization_name, organization_type, country, city, expected_beneficiaries, work_fields, description, status) VALUES
  ('req_001', 'أحمد محمد الأحمد', 'ahmed@alkhayr.org', '+966501234567', 'جمعية الخير للتنمية الاجتماعية', 'nonprofit',
   'المملكة العربية السعودية', 'الرياض', 2500, '{"social", "education", "health"}',
   'جمعية خيرية تهدف إلى تقديم الخدمات الاجتماعية والتعليمية والصحية للمحتاجين', 'pending'),
  
  ('req_002', 'فاطمة علي السالم', 'fatima@sustainable-env.org', '+966505678901', 'مؤسسة البيئة المستدامة', 'nonprofit',
   'المملكة العربية السعودية', 'جدة', 1800, '{"environmental", "education"}',
   'مؤسسة تعمل على نشر الوعي البيئي وحماية البيئة', 'approved')
ON CONFLICT (request_id) DO NOTHING;

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

-- Create comprehensive RLS policies

-- Roles policies (readable by all authenticated users)
CREATE POLICY "Allow read access to roles" ON roles FOR SELECT USING (true);

-- Subscription plans policies (readable by all)
CREATE POLICY "Allow read access to subscription_plans" ON subscription_plans FOR SELECT USING (true);

-- Organizations policies
CREATE POLICY "Super admin full access to organizations" ON organizations FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.user_id = auth.uid() AND users.role_id = 'super_admin')
);

CREATE POLICY "Admin read access to organizations" ON organizations FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE users.user_id = auth.uid() AND users.role_id IN ('admin', 'super_admin'))
);

CREATE POLICY "Org managers can view own organization" ON organizations FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE users.user_id = auth.uid()
  )
);

-- Users policies
CREATE POLICY "Super admin full access to users" ON users FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.user_id = auth.uid() AND u.role_id = 'super_admin')
);

CREATE POLICY "Admin can manage non-super-admin users" ON users FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.user_id = auth.uid() AND u.role_id IN ('admin', 'super_admin'))
  AND role_id != 'super_admin'
);

CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (user_id = auth.uid());

-- Beneficiaries policies
CREATE POLICY "Organization members can manage beneficiaries" ON beneficiaries FOR ALL USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE users.user_id = auth.uid()
  )
);

-- Surveys policies
CREATE POLICY "Organization members can manage surveys" ON surveys FOR ALL USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE users.user_id = auth.uid()
  )
);

CREATE POLICY "Admin can view all surveys" ON surveys FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE users.user_id = auth.uid() AND users.role_id IN ('admin', 'super_admin'))
);

-- Questions policies
CREATE POLICY "Questions inherit survey permissions" ON questions FOR ALL USING (
  survey_id IN (
    SELECT survey_id FROM surveys WHERE organization_id IN (
      SELECT organization_id FROM users WHERE users.user_id = auth.uid()
    )
  )
);

-- Responses policies
CREATE POLICY "Beneficiaries can submit responses" ON responses FOR INSERT WITH CHECK (
  beneficiary_id IN (
    SELECT beneficiary_id FROM beneficiaries WHERE organization_id IN (
      SELECT organization_id FROM users WHERE users.user_id = auth.uid()
    )
  )
);

CREATE POLICY "Organization members can view responses" ON responses FOR SELECT USING (
  survey_id IN (
    SELECT survey_id FROM surveys WHERE organization_id IN (
      SELECT organization_id FROM users WHERE users.user_id = auth.uid()
    )
  )
);

-- Activity log policies
CREATE POLICY "Users can view activity logs for their organization" ON activity_log FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE users.user_id = auth.uid()
  )
  OR EXISTS (SELECT 1 FROM users WHERE users.user_id = auth.uid() AND users.role_id IN ('admin', 'super_admin'))
);

CREATE POLICY "System can insert activity logs" ON activity_log FOR INSERT WITH CHECK (true);

-- Transactions policies
CREATE POLICY "Organization members can view transactions" ON transactions FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE users.user_id = auth.uid()
  )
  OR EXISTS (SELECT 1 FROM users WHERE users.user_id = auth.uid() AND users.role_id IN ('admin', 'super_admin'))
);

CREATE POLICY "Admin can manage transactions" ON transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.user_id = auth.uid() AND users.role_id IN ('admin', 'super_admin'))
);

-- Requests policies
CREATE POLICY "Admin can manage requests" ON requests FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.user_id = auth.uid() AND users.role_id IN ('admin', 'super_admin'))
);

CREATE POLICY "Anyone can submit requests" ON requests FOR INSERT WITH CHECK (true);

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
CREATE INDEX IF NOT EXISTS idx_activity_log_organization ON activity_log(organization_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_timestamp ON activity_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_transactions_organization ON transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);

-- Create triggers for automatic updates

-- Update organization stats when surveys change
CREATE OR REPLACE FUNCTION update_organization_survey_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE organizations 
    SET number_of_surveys = number_of_surveys + 1,
        updated_at = NOW()
    WHERE organization_id = NEW.organization_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE organizations 
    SET number_of_surveys = GREATEST(number_of_surveys - 1, 0),
        updated_at = NOW()
    WHERE organization_id = OLD.organization_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_organization_survey_count
  AFTER INSERT OR DELETE ON surveys
  FOR EACH ROW EXECUTE FUNCTION update_organization_survey_count();

-- Update organization stats when beneficiaries change
CREATE OR REPLACE FUNCTION update_organization_beneficiary_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE organizations 
    SET number_of_beneficiaries = number_of_beneficiaries + 1,
        updated_at = NOW()
    WHERE organization_id = NEW.organization_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE organizations 
    SET number_of_beneficiaries = GREATEST(number_of_beneficiaries - 1, 0),
        updated_at = NOW()
    WHERE organization_id = OLD.organization_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_organization_beneficiary_count
  AFTER INSERT OR DELETE ON beneficiaries
  FOR EACH ROW EXECUTE FUNCTION update_organization_beneficiary_count();

-- Update survey response count
CREATE OR REPLACE FUNCTION update_survey_response_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE surveys 
    SET total_responses = total_responses + 1,
        updated_at = NOW()
    WHERE survey_id = NEW.survey_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE surveys 
    SET total_responses = GREATEST(total_responses - 1, 0),
        updated_at = NOW()
    WHERE survey_id = OLD.survey_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_survey_response_count
  AFTER INSERT OR DELETE ON responses
  FOR EACH ROW EXECUTE FUNCTION update_survey_response_count();

-- Update beneficiary survey counts
CREATE OR REPLACE FUNCTION update_beneficiary_survey_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE beneficiaries 
    SET completed_surveys = completed_surveys + 1,
        last_activity = NOW(),
        updated_at = NOW()
    WHERE beneficiary_id = NEW.beneficiary_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_beneficiary_survey_count
  AFTER INSERT ON responses
  FOR EACH ROW EXECUTE FUNCTION update_beneficiary_survey_count();

-- Update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_beneficiaries_updated_at BEFORE UPDATE ON beneficiaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_surveys_updated_at BEFORE UPDATE ON surveys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();