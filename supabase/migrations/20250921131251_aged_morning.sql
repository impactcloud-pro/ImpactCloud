/*
  # Complete Database Schema for Social Impact Platform

  1. New Tables
    - `roles` - User roles and permissions
    - `subscription_plans` - Available subscription packages
    - `organizations` - Organizations using the platform
    - `users` - All platform users
    - `requests` - Organization registration requests
    - `activity_log` - System activity tracking
    - `transactions` - Payment and billing records
    - `beneficiaries` - Organization beneficiaries
    - `surveys` - Survey definitions
    - `questions` - Survey questions
    - `responses` - Survey responses

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure sensitive data access

  3. Features
    - Complete user management system
    - Organization and subscription management
    - Survey creation and response tracking
    - Activity logging and audit trail
*/

-- Create Roles table
CREATE TABLE IF NOT EXISTS roles (
    role_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Subscription Plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
    plan_id VARCHAR(50) PRIMARY KEY,
    package_name VARCHAR(100) NOT NULL,
    description TEXT,
    total_price_monthly DECIMAL(10,2),
    total_price_annual DECIMAL(10,2),
    quota_limit INT,
    features JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Organizations table
CREATE TABLE IF NOT EXISTS organizations (
    organization_id VARCHAR(50) PRIMARY KEY,
    plan_id VARCHAR(50),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    organization_manager VARCHAR(100),
    username VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    number_of_beneficiaries INT DEFAULT 0,
    number_of_surveys INT DEFAULT 0,
    quota INT DEFAULT 0,
    consumed INT DEFAULT 0,
    remaining INT DEFAULT 0,
    region VARCHAR(100),
    contact_email VARCHAR(150),
    contact_phone VARCHAR(20),
    website VARCHAR(255),
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(plan_id)
);

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(50) PRIMARY KEY,
    role_id VARCHAR(50),
    organization_id VARCHAR(50),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    phone_number VARCHAR(20),
    status VARCHAR(50) DEFAULT 'active',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (organization_id) REFERENCES organizations(organization_id)
);

-- Create Requests table
CREATE TABLE IF NOT EXISTS requests (
    request_id VARCHAR(50) PRIMARY KEY,
    approved_by VARCHAR(50),
    name VARCHAR(100),
    email VARCHAR(150),
    phone VARCHAR(20),
    organization_name VARCHAR(200),
    organization_type VARCHAR(100),
    country VARCHAR(100),
    city VARCHAR(100),
    expected_beneficiaries INT,
    work_fields JSONB DEFAULT '[]',
    description TEXT,
    website VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    rejection_reason TEXT,
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);

-- Create Activity Log table
CREATE TABLE IF NOT EXISTS activity_log (
    log_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    organization_id VARCHAR(50),
    action VARCHAR(200) NOT NULL,
    details TEXT,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (organization_id) REFERENCES organizations(organization_id)
);

-- Create Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id VARCHAR(50) PRIMARY KEY,
    organization_id VARCHAR(50),
    payment_method VARCHAR(100),
    payment_details JSONB DEFAULT '{}',
    date DATE DEFAULT CURRENT_DATE,
    amount DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'SAR',
    status VARCHAR(50) DEFAULT 'pending',
    description TEXT,
    invoice_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(organization_id)
);

-- Create Beneficiaries table
CREATE TABLE IF NOT EXISTS beneficiaries (
    beneficiary_id VARCHAR(50) PRIMARY KEY,
    organization_id VARCHAR(50),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    phone_number VARCHAR(20),
    gender VARCHAR(10),
    age_group VARCHAR(20),
    education_level VARCHAR(50),
    job_title VARCHAR(100),
    income_level VARCHAR(50),
    marital_status VARCHAR(20),
    region VARCHAR(100),
    number_of_surveys INT DEFAULT 0,
    completed_surveys INT DEFAULT 0,
    uncompleted_surveys INT DEFAULT 0,
    last_activity TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(organization_id)
);

-- Create Surveys table
CREATE TABLE IF NOT EXISTS surveys (
    survey_id VARCHAR(50) PRIMARY KEY,
    organization_id VARCHAR(50),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    impact_domains JSONB DEFAULT '[]',
    selected_sectors JSONB DEFAULT '[]',
    selected_filters JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'draft',
    start_date DATE,
    end_date DATE,
    settings JSONB DEFAULT '{}',
    total_responses INT DEFAULT 0,
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(organization_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Create Questions table
CREATE TABLE IF NOT EXISTS questions (
    question_id VARCHAR(50) PRIMARY KEY,
    survey_id VARCHAR(50),
    question_text TEXT NOT NULL,
    question_type VARCHAR(50),
    domain VARCHAR(100),
    sector VARCHAR(100),
    phase VARCHAR(50), -- 'pre' or 'post'
    order_num INT,
    required BOOLEAN DEFAULT false,
    options JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (survey_id) REFERENCES surveys(survey_id)
);

-- Create Responses table
CREATE TABLE IF NOT EXISTS responses (
    response_id VARCHAR(50) PRIMARY KEY,
    beneficiary_id VARCHAR(50),
    survey_id VARCHAR(50),
    question_id VARCHAR(50),
    response_value TEXT,
    response_data JSONB DEFAULT '{}',
    channel VARCHAR(50) DEFAULT 'web',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(beneficiary_id),
    FOREIGN KEY (survey_id) REFERENCES surveys(survey_id),
    FOREIGN KEY (question_id) REFERENCES questions(question_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Roles policies
CREATE POLICY "Super admins can manage roles"
  ON roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.user_id = auth.uid()::text 
      AND users.role_id = 'super_admin'
    )
  );

-- Subscription plans policies
CREATE POLICY "Authenticated users can view subscription plans"
  ON subscription_plans
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage subscription plans"
  ON subscription_plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.user_id = auth.uid()::text 
      AND users.role_id IN ('super_admin', 'admin')
    )
  );

-- Organizations policies
CREATE POLICY "Users can view their own organization"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE user_id = auth.uid()::text
    )
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.user_id = auth.uid()::text 
      AND users.role_id IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Admins can manage organizations"
  ON organizations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.user_id = auth.uid()::text 
      AND users.role_id IN ('super_admin', 'admin')
    )
  );

-- Users policies
CREATE POLICY "Users can view users in their organization"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()::text
    OR organization_id IN (
      SELECT organization_id FROM users 
      WHERE user_id = auth.uid()::text
    )
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.user_id = auth.uid()::text 
      AND users.role_id IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "Admins can manage users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.user_id = auth.uid()::text 
      AND users.role_id IN ('super_admin', 'admin')
    )
  );

-- Requests policies
CREATE POLICY "Anyone can create requests"
  ON requests
  FOR INSERT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can view and manage requests"
  ON requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.user_id = auth.uid()::text 
      AND users.role_id IN ('super_admin', 'admin')
    )
  );

-- Activity log policies
CREATE POLICY "Users can view activity in their organization"
  ON activity_log
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()::text
    OR organization_id IN (
      SELECT organization_id FROM users 
      WHERE user_id = auth.uid()::text
    )
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.user_id = auth.uid()::text 
      AND users.role_id IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "System can insert activity logs"
  ON activity_log
  FOR INSERT
  TO authenticated
  USING (true);

-- Transactions policies
CREATE POLICY "Organizations can view their transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE user_id = auth.uid()::text
    )
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.user_id = auth.uid()::text 
      AND users.role_id IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Admins can manage transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.user_id = auth.uid()::text 
      AND users.role_id IN ('super_admin', 'admin')
    )
  );

-- Beneficiaries policies
CREATE POLICY "Organizations can manage their beneficiaries"
  ON beneficiaries
  FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE user_id = auth.uid()::text
    )
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.user_id = auth.uid()::text 
      AND users.role_id IN ('super_admin', 'admin')
    )
  );

-- Surveys policies
CREATE POLICY "Organizations can manage their surveys"
  ON surveys
  FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users 
      WHERE user_id = auth.uid()::text
    )
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.user_id = auth.uid()::text 
      AND users.role_id IN ('super_admin', 'admin')
    )
  );

-- Questions policies
CREATE POLICY "Users can view questions for accessible surveys"
  ON questions
  FOR SELECT
  TO authenticated
  USING (
    survey_id IN (
      SELECT survey_id FROM surveys
      WHERE organization_id IN (
        SELECT organization_id FROM users 
        WHERE user_id = auth.uid()::text
      )
    )
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.user_id = auth.uid()::text 
      AND users.role_id IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Organizations can manage questions for their surveys"
  ON questions
  FOR ALL
  TO authenticated
  USING (
    survey_id IN (
      SELECT survey_id FROM surveys
      WHERE organization_id IN (
        SELECT organization_id FROM users 
        WHERE user_id = auth.uid()::text
      )
    )
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.user_id = auth.uid()::text 
      AND users.role_id IN ('super_admin', 'admin')
    )
  );

-- Responses policies
CREATE POLICY "Beneficiaries can submit responses"
  ON responses
  FOR INSERT
  TO authenticated
  USING (
    beneficiary_id IN (
      SELECT beneficiary_id FROM beneficiaries
      WHERE organization_id IN (
        SELECT organization_id FROM users 
        WHERE user_id = auth.uid()::text
      )
    )
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.user_id = auth.uid()::text 
      AND users.role_id = 'beneficiary'
    )
  );

CREATE POLICY "Organizations can view responses to their surveys"
  ON responses
  FOR SELECT
  TO authenticated
  USING (
    survey_id IN (
      SELECT survey_id FROM surveys
      WHERE organization_id IN (
        SELECT organization_id FROM users 
        WHERE user_id = auth.uid()::text
      )
    )
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.user_id = auth.uid()::text 
      AND users.role_id IN ('super_admin', 'admin')
    )
  );

-- Insert default roles
INSERT INTO roles (role_id, name, description) VALUES
  ('super_admin', 'Super Admin', 'System administrator with full access'),
  ('admin', 'Admin', 'Platform administrator'),
  ('org_manager', 'Organization Manager', 'Organization manager'),
  ('beneficiary', 'Beneficiary', 'Survey participant')
ON CONFLICT (role_id) DO NOTHING;

-- Insert default subscription plans
INSERT INTO subscription_plans (plan_id, package_name, description, total_price_monthly, total_price_annual, quota_limit, features) VALUES
  ('free', 'Free Plan', 'Basic plan for small organizations', 0.00, 0.00, 100, '["Basic surveys", "Limited responses", "Email support"]'),
  ('basic', 'Basic Plan', 'Starter plan for growing organizations', 99.00, 990.00, 500, '["Unlimited surveys", "5000 responses", "Basic analytics", "Email support"]'),
  ('professional', 'Professional Plan', 'Advanced plan for established organizations', 299.00, 2990.00, 2500, '["Unlimited surveys", "25000 responses", "Advanced analytics", "AI insights", "Priority support"]'),
  ('enterprise', 'Enterprise Plan', 'Custom plan for large organizations', 799.00, 7990.00, 10000, '["Unlimited everything", "Custom integrations", "Dedicated support", "Custom features"]')
ON CONFLICT (plan_id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status);
CREATE INDEX IF NOT EXISTS idx_surveys_organization ON surveys(organization_id);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_organization ON beneficiaries(organization_id);
CREATE INDEX IF NOT EXISTS idx_responses_survey ON responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_responses_beneficiary ON responses(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_timestamp ON activity_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_transactions_organization ON transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
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