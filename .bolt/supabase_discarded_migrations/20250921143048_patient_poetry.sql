/*
  # Complete Social Impact Platform Database Schema

  1. New Tables
    - `roles` - User roles and permissions
    - `subscription_plans` - Available subscription packages
    - `organizations` - Organizations using the platform
    - `users` - All platform users
    - `requests` - Organization registration requests
    - `activity_log` - System activity tracking
    - `transactions` - Payment and billing transactions
    - `beneficiaries` - Beneficiaries within organizations
    - `surveys` - Survey definitions and metadata
    - `questions` - Individual survey questions
    - `responses` - Survey responses from beneficiaries

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Proper foreign key constraints

  3. Performance
    - Add indexes on frequently queried columns
    - Optimize for Arabic text and RTL support
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create Roles table
CREATE TABLE IF NOT EXISTS roles (
    role_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
    plan_id VARCHAR(50) PRIMARY KEY,
    package_name VARCHAR(100) NOT NULL,
    description TEXT,
    total_price_monthly DECIMAL(10,2),
    total_price_annual DECIMAL(10,2),
    quota_limit INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Organizations table
CREATE TABLE IF NOT EXISTS organizations (
    organization_id VARCHAR(50) PRIMARY KEY,
    plan_id VARCHAR(50),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    organization_manager VARCHAR(100),
    username VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    number_of_beneficiaries INT DEFAULT 0,
    number_of_surveys INT DEFAULT 0,
    quota INT DEFAULT 0,
    consumed INT DEFAULT 0,
    remaining INT DEFAULT 0,
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    status VARCHAR(50) DEFAULT 'Active',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    country VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    rejection_reason TEXT,
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);

-- Create Activity_log table
CREATE TABLE IF NOT EXISTS activity_log (
    log_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    organization_id VARCHAR(50),
    action VARCHAR(200) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
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
    date DATE DEFAULT CURRENT_DATE,
    total DECIMAL(10,2),
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
    FOREIGN KEY (organization_id) REFERENCES organizations(organization_id)
);

-- Create Surveys table
CREATE TABLE IF NOT EXISTS surveys (
    survey_id VARCHAR(50) PRIMARY KEY,
    organization_id VARCHAR(50),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    impact_domains TEXT,
    selected_sectors TEXT,
    selected_filters TEXT,
    status VARCHAR(50) DEFAULT 'Draft',
    start_date DATE,
    end_date DATE,
    settings TEXT,
    total_responses INT DEFAULT 0,
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(organization_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Create Questions table
CREATE TABLE IF NOT EXISTS questions (
    question_id VARCHAR(50) PRIMARY KEY,
    survey_id VARCHAR(50),
    question TEXT NOT NULL,
    type VARCHAR(50),
    domain VARCHAR(100),
    sector VARCHAR(100),
    order_num INT,
    phase VARCHAR(50),
    required BOOLEAN DEFAULT false,
    options TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (survey_id) REFERENCES surveys(survey_id)
);

-- Create Responses table
CREATE TABLE IF NOT EXISTS responses (
    response_id VARCHAR(50) PRIMARY KEY,
    beneficiary_id VARCHAR(50),
    survey_id VARCHAR(50),
    question_id VARCHAR(50),
    response TEXT,
    response_data TEXT,
    channel VARCHAR(50),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(beneficiary_id),
    FOREIGN KEY (survey_id) REFERENCES surveys(survey_id),
    FOREIGN KEY (question_id) REFERENCES questions(question_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_organization ON beneficiaries(organization_id);
CREATE INDEX IF NOT EXISTS idx_surveys_organization ON surveys(organization_id);
CREATE INDEX IF NOT EXISTS idx_questions_survey ON questions(survey_id);
CREATE INDEX IF NOT EXISTS idx_responses_survey ON responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_responses_beneficiary ON responses(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_organization ON activity_log(organization_id);
CREATE INDEX IF NOT EXISTS idx_transactions_organization ON transactions(organization_id);

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

-- Create RLS policies for roles table
CREATE POLICY "Allow read access to roles" ON roles FOR SELECT TO public USING (true);
CREATE POLICY "Allow admin to manage roles" ON roles FOR ALL TO public USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id::text = auth.uid()::text 
    AND users.role_id IN ('super_admin', 'admin')
  )
);

-- Create RLS policies for subscription_plans table
CREATE POLICY "Allow read access to subscription plans" ON subscription_plans FOR SELECT TO public USING (true);
CREATE POLICY "Allow admin to manage subscription plans" ON subscription_plans FOR ALL TO public USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id::text = auth.uid()::text 
    AND users.role_id IN ('super_admin', 'admin')
  )
);

-- Create RLS policies for organizations table
CREATE POLICY "Allow users to read their organization" ON organizations FOR SELECT TO public USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE users.user_id::text = auth.uid()::text
  ) OR
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id::text = auth.uid()::text 
    AND users.role_id IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Allow admin to manage organizations" ON organizations FOR ALL TO public USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id::text = auth.uid()::text 
    AND users.role_id IN ('super_admin', 'admin')
  )
);

-- Create RLS policies for users table
CREATE POLICY "Allow users to read their own data" ON users FOR SELECT TO public USING (
  user_id::text = auth.uid()::text OR
  organization_id IN (
    SELECT organization_id FROM users WHERE users.user_id::text = auth.uid()::text
  ) OR
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id::text = auth.uid()::text 
    AND users.role_id IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Allow users to update their own data" ON users FOR UPDATE TO public USING (
  user_id::text = auth.uid()::text
);

CREATE POLICY "Allow admin to manage users" ON users FOR ALL TO public USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id::text = auth.uid()::text 
    AND users.role_id IN ('super_admin', 'admin')
  )
);

-- Create RLS policies for requests table
CREATE POLICY "Allow organization access to requests" ON requests FOR SELECT TO public USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id::text = auth.uid()::text 
    AND users.role_id IN ('super_admin', 'admin')
  )
);

-- Create RLS policies for activity_log table
CREATE POLICY "Allow organization access to activity logs" ON activity_log FOR SELECT TO public USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE users.user_id::text = auth.uid()::text
  ) OR
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id::text = auth.uid()::text 
    AND users.role_id IN ('super_admin', 'admin')
  )
);

-- Create RLS policies for transactions table
CREATE POLICY "Allow organization access to transactions" ON transactions FOR SELECT TO public USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE users.user_id::text = auth.uid()::text
  ) OR
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id::text = auth.uid()::text 
    AND users.role_id IN ('super_admin', 'admin')
  )
);

-- Create RLS policies for beneficiaries table
CREATE POLICY "Allow organization access to beneficiaries" ON beneficiaries FOR ALL TO public USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE users.user_id::text = auth.uid()::text
  ) OR
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id::text = auth.uid()::text 
    AND users.role_id IN ('super_admin', 'admin')
  )
);

-- Create RLS policies for surveys table
CREATE POLICY "Allow organization access to surveys" ON surveys FOR ALL TO public USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE users.user_id::text = auth.uid()::text
  ) OR
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id::text = auth.uid()::text 
    AND users.role_id IN ('super_admin', 'admin')
  )
);

-- Create RLS policies for questions table
CREATE POLICY "Allow survey access to questions" ON questions FOR ALL TO public USING (
  survey_id IN (
    SELECT survey_id FROM surveys 
    WHERE organization_id IN (
      SELECT organization_id FROM users WHERE users.user_id::text = auth.uid()::text
    )
  ) OR
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id::text = auth.uid()::text 
    AND users.role_id IN ('super_admin', 'admin')
  )
);

-- Create RLS policies for responses table
CREATE POLICY "Allow survey access to responses" ON responses FOR ALL TO public USING (
  survey_id IN (
    SELECT survey_id FROM surveys 
    WHERE organization_id IN (
      SELECT organization_id FROM users WHERE users.user_id::text = auth.uid()::text
    )
  ) OR
  beneficiary_id IN (
    SELECT beneficiary_id FROM beneficiaries 
    WHERE organization_id IN (
      SELECT organization_id FROM users WHERE users.user_id::text = auth.uid()::text
    )
  ) OR
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.user_id::text = auth.uid()::text 
    AND users.role_id IN ('super_admin', 'admin')
  )
);

-- Create functions for automatic statistics updates
CREATE OR REPLACE FUNCTION update_organization_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update beneficiaries count
  UPDATE organizations 
  SET number_of_beneficiaries = (
    SELECT COUNT(*) FROM beneficiaries 
    WHERE organization_id = COALESCE(NEW.organization_id, OLD.organization_id)
  )
  WHERE organization_id = COALESCE(NEW.organization_id, OLD.organization_id);
  
  -- Update surveys count
  UPDATE organizations 
  SET number_of_surveys = (
    SELECT COUNT(*) FROM surveys 
    WHERE organization_id = COALESCE(NEW.organization_id, OLD.organization_id)
  )
  WHERE organization_id = COALESCE(NEW.organization_id, OLD.organization_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_survey_response_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update survey response count
  UPDATE surveys 
  SET total_responses = (
    SELECT COUNT(*) FROM responses 
    WHERE survey_id = COALESCE(NEW.survey_id, OLD.survey_id)
  )
  WHERE survey_id = COALESCE(NEW.survey_id, OLD.survey_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_org_stats_beneficiaries
  AFTER INSERT OR UPDATE OR DELETE ON beneficiaries
  FOR EACH ROW EXECUTE FUNCTION update_organization_stats();

CREATE TRIGGER trigger_update_org_stats_surveys
  AFTER INSERT OR UPDATE OR DELETE ON surveys
  FOR EACH ROW EXECUTE FUNCTION update_organization_stats();

CREATE TRIGGER trigger_update_survey_responses
  AFTER INSERT OR UPDATE OR DELETE ON responses
  FOR EACH ROW EXECUTE FUNCTION update_survey_response_count();