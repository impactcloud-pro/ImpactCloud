/*
  # Complete Social Impact Platform Database Schema

  This migration creates the complete database structure for the social impact measurement platform.

  ## Tables Created:
  1. **Roles** - User roles and permissions
  2. **Subscription_plans** - Available subscription packages
  3. **Organizations** - Organizations using the platform
  4. **Users** - All platform users
  5. **Requests** - Organization registration requests
  6. **Activity_log** - System activity tracking
  7. **Transactions** - Payment and billing transactions
  8. **Beneficiaries** - Beneficiaries within organizations
  9. **Surveys** - Survey definitions and metadata
  10. **Questions** - Individual survey questions
  11. **Responses** - Survey responses from beneficiaries

  ## Security:
  - Row Level Security (RLS) enabled on all tables
  - Policies for role-based access control
  - Organization-based data isolation

  ## Demo Data:
  - Default roles (super_admin, admin, org_manager, beneficiary)
  - Sample subscription plans
  - Demo organizations and users for testing
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create Roles table
CREATE TABLE IF NOT EXISTS Roles (
    Role_id VARCHAR(50) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL UNIQUE,
    Description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Subscription_plans table
CREATE TABLE IF NOT EXISTS Subscription_plans (
    Plan_id VARCHAR(50) PRIMARY KEY,
    Package_name VARCHAR(100) NOT NULL,
    Description TEXT,
    Total_price_monthly DECIMAL(10,2),
    Total_price_annual DECIMAL(10,2),
    Quota_limit INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Organizations table
CREATE TABLE IF NOT EXISTS Organizations (
    Organization_id VARCHAR(50) PRIMARY KEY,
    Plan_id VARCHAR(50),
    Name VARCHAR(200) NOT NULL,
    Type VARCHAR(100),
    Status VARCHAR(50) DEFAULT 'active',
    Organization_manager VARCHAR(100),
    Username VARCHAR(100) UNIQUE,
    Password VARCHAR(255),
    Number_of_beneficiaries INT DEFAULT 0,
    Number_of_surveys INT DEFAULT 0,
    Quota INT DEFAULT 0,
    Consumed INT DEFAULT 0,
    Remaining INT DEFAULT 0,
    Created_by VARCHAR(50),
    Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Plan_id) REFERENCES Subscription_plans(Plan_id)
);

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
    User_id VARCHAR(50) PRIMARY KEY,
    Role_id VARCHAR(50),
    Organization_id VARCHAR(50),
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) UNIQUE NOT NULL,
    Password_hash VARCHAR(255),
    Phone_number VARCHAR(20),
    Status VARCHAR(50) DEFAULT 'Active',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Role_id) REFERENCES Roles(Role_id),
    FOREIGN KEY (Organization_id) REFERENCES Organizations(Organization_id)
);

-- Create Requests table
CREATE TABLE IF NOT EXISTS Requests (
    Request_id VARCHAR(50) PRIMARY KEY,
    Approved_by VARCHAR(50),
    Name VARCHAR(100),
    Email VARCHAR(150),
    Phone VARCHAR(20),
    Organization_name VARCHAR(200),
    Country VARCHAR(100),
    Status VARCHAR(50) DEFAULT 'Pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    rejection_reason TEXT,
    FOREIGN KEY (Approved_by) REFERENCES Users(User_id)
);

-- Create Activity_log table
CREATE TABLE IF NOT EXISTS Activity_log (
    Log_id VARCHAR(50) PRIMARY KEY,
    User_id VARCHAR(50),
    Organization_id VARCHAR(50),
    Action VARCHAR(200) NOT NULL,
    Details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_id) REFERENCES Users(User_id),
    FOREIGN KEY (Organization_id) REFERENCES Organizations(Organization_id)
);

-- Create Transactions table
CREATE TABLE IF NOT EXISTS Transactions (
    Transaction_id VARCHAR(50) PRIMARY KEY,
    Organization_id VARCHAR(50),
    Payment_method VARCHAR(100),
    Date DATE DEFAULT CURRENT_DATE,
    Total DECIMAL(10,2),
    Status VARCHAR(50) DEFAULT 'pending',
    Description TEXT,
    invoice_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Organization_id) REFERENCES Organizations(Organization_id)
);

-- Create Beneficiaries table
CREATE TABLE IF NOT EXISTS Beneficiaries (
    Beneficiary_id VARCHAR(50) PRIMARY KEY,
    Organization_id VARCHAR(50),
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150),
    Phone_number VARCHAR(20),
    Gender VARCHAR(10),
    Age_group VARCHAR(20),
    Education_level VARCHAR(50),
    Job_title VARCHAR(100),
    Income_level VARCHAR(50),
    Marital_status VARCHAR(20),
    Region VARCHAR(100),
    Number_of_surveys INT DEFAULT 0,
    Completed_surveys INT DEFAULT 0,
    Uncompleted_surveys INT DEFAULT 0,
    last_activity TIMESTAMP,
    Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Organization_id) REFERENCES Organizations(Organization_id)
);

-- Create Surveys table
CREATE TABLE IF NOT EXISTS Surveys (
    Survey_id VARCHAR(50) PRIMARY KEY,
    Organization_id VARCHAR(50),
    Title VARCHAR(200) NOT NULL,
    Description TEXT,
    Impact_domains TEXT,
    selected_sectors TEXT,
    selected_filters TEXT,
    Status VARCHAR(50) DEFAULT 'Draft',
    start_date DATE,
    end_date DATE,
    settings TEXT,
    total_responses INT DEFAULT 0,
    Created_by VARCHAR(50),
    Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Organization_id) REFERENCES Organizations(Organization_id),
    FOREIGN KEY (Created_by) REFERENCES Users(User_id)
);

-- Create Questions table
CREATE TABLE IF NOT EXISTS Questions (
    Question_id VARCHAR(50) PRIMARY KEY,
    Survey_id VARCHAR(50),
    Question TEXT NOT NULL,
    Type VARCHAR(50),
    Domain VARCHAR(100),
    Sector VARCHAR(100),
    Order_num INT,
    Phase VARCHAR(50),
    required BOOLEAN DEFAULT false,
    options TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Survey_id) REFERENCES Surveys(Survey_id)
);

-- Create Responses table
CREATE TABLE IF NOT EXISTS Responses (
    Response_id VARCHAR(50) PRIMARY KEY,
    Beneficiary_id VARCHAR(50),
    Survey_id VARCHAR(50),
    Question_id VARCHAR(50),
    Response TEXT,
    response_data TEXT,
    Channel VARCHAR(50),
    Submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Beneficiary_id) REFERENCES Beneficiaries(Beneficiary_id),
    FOREIGN KEY (Survey_id) REFERENCES Surveys(Survey_id),
    FOREIGN KEY (Question_id) REFERENCES Questions(Question_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE Roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE Subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE Organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE Users ENABLE ROW LEVEL SECURITY;
ALTER TABLE Requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE Activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE Transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE Beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE Surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE Questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE Responses ENABLE ROW LEVEL SECURITY;

-- Create policies for Roles table
CREATE POLICY "Allow read access to roles" ON Roles FOR SELECT USING (true);
CREATE POLICY "Allow admin to manage roles" ON Roles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM Users 
    WHERE Users.User_id = auth.uid()::text 
    AND Users.Role_id IN ('super_admin', 'admin')
  )
);

-- Create policies for Subscription_plans table
CREATE POLICY "Allow read access to subscription plans" ON Subscription_plans FOR SELECT USING (true);
CREATE POLICY "Allow admin to manage subscription plans" ON Subscription_plans FOR ALL USING (
  EXISTS (
    SELECT 1 FROM Users 
    WHERE Users.User_id = auth.uid()::text 
    AND Users.Role_id IN ('super_admin', 'admin')
  )
);

-- Create policies for Organizations table
CREATE POLICY "Allow users to read their organization" ON Organizations FOR SELECT USING (
  Organization_id IN (
    SELECT Organization_id FROM Users WHERE User_id = auth.uid()::text
  ) OR
  EXISTS (
    SELECT 1 FROM Users 
    WHERE Users.User_id = auth.uid()::text 
    AND Users.Role_id IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Allow admin to manage organizations" ON Organizations FOR ALL USING (
  EXISTS (
    SELECT 1 FROM Users 
    WHERE Users.User_id = auth.uid()::text 
    AND Users.Role_id IN ('super_admin', 'admin')
  )
);

-- Create policies for Users table
CREATE POLICY "Allow users to read their own data" ON Users FOR SELECT USING (
  User_id = auth.uid()::text OR
  Organization_id IN (
    SELECT Organization_id FROM Users WHERE User_id = auth.uid()::text
  ) OR
  EXISTS (
    SELECT 1 FROM Users 
    WHERE Users.User_id = auth.uid()::text 
    AND Users.Role_id IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Allow users to update their own data" ON Users FOR UPDATE USING (
  User_id = auth.uid()::text
);

CREATE POLICY "Allow admin to manage users" ON Users FOR ALL USING (
  EXISTS (
    SELECT 1 FROM Users 
    WHERE Users.User_id = auth.uid()::text 
    AND Users.Role_id IN ('super_admin', 'admin')
  )
);

-- Create policies for other tables (similar pattern)
CREATE POLICY "Allow organization access to requests" ON Requests FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM Users 
    WHERE Users.User_id = auth.uid()::text 
    AND Users.Role_id IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Allow organization access to activity logs" ON Activity_log FOR SELECT USING (
  Organization_id IN (
    SELECT Organization_id FROM Users WHERE User_id = auth.uid()::text
  ) OR
  EXISTS (
    SELECT 1 FROM Users 
    WHERE Users.User_id = auth.uid()::text 
    AND Users.Role_id IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Allow organization access to transactions" ON Transactions FOR SELECT USING (
  Organization_id IN (
    SELECT Organization_id FROM Users WHERE User_id = auth.uid()::text
  ) OR
  EXISTS (
    SELECT 1 FROM Users 
    WHERE Users.User_id = auth.uid()::text 
    AND Users.Role_id IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Allow organization access to beneficiaries" ON Beneficiaries FOR ALL USING (
  Organization_id IN (
    SELECT Organization_id FROM Users WHERE User_id = auth.uid()::text
  ) OR
  EXISTS (
    SELECT 1 FROM Users 
    WHERE Users.User_id = auth.uid()::text 
    AND Users.Role_id IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Allow organization access to surveys" ON Surveys FOR ALL USING (
  Organization_id IN (
    SELECT Organization_id FROM Users WHERE User_id = auth.uid()::text
  ) OR
  EXISTS (
    SELECT 1 FROM Users 
    WHERE Users.User_id = auth.uid()::text 
    AND Users.Role_id IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Allow survey access to questions" ON Questions FOR ALL USING (
  Survey_id IN (
    SELECT Survey_id FROM Surveys 
    WHERE Organization_id IN (
      SELECT Organization_id FROM Users WHERE User_id = auth.uid()::text
    )
  ) OR
  EXISTS (
    SELECT 1 FROM Users 
    WHERE Users.User_id = auth.uid()::text 
    AND Users.Role_id IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Allow survey access to responses" ON Responses FOR ALL USING (
  Survey_id IN (
    SELECT Survey_id FROM Surveys 
    WHERE Organization_id IN (
      SELECT Organization_id FROM Users WHERE User_id = auth.uid()::text
    )
  ) OR
  Beneficiary_id IN (
    SELECT Beneficiary_id FROM Beneficiaries 
    WHERE Organization_id IN (
      SELECT Organization_id FROM Users WHERE User_id = auth.uid()::text
    )
  ) OR
  EXISTS (
    SELECT 1 FROM Users 
    WHERE Users.User_id = auth.uid()::text 
    AND Users.Role_id IN ('super_admin', 'admin')
  )
);

-- Insert default roles
INSERT INTO Roles (Role_id, Name, Description) VALUES
('super_admin', 'super_admin', 'مدير النظام الرئيسي'),
('admin', 'admin', 'مدير أثرنا'),
('org_manager', 'org_manager', 'مدير المنظمة'),
('beneficiary', 'beneficiary', 'مستفيد')
ON CONFLICT (Role_id) DO NOTHING;

-- Insert default subscription plans
INSERT INTO Subscription_plans (Plan_id, Package_name, Description, Total_price_monthly, Total_price_annual, Quota_limit) VALUES
('starter', 'الباقة المبتدئة', 'مثالية للمنظمات الصغيرة والناشئة', 299.00, 2990.00, 100),
('professional', 'الباقة الاحترافية', 'للمنظمات المتوسطة التي تحتاج ميزات متقدمة', 599.00, 5990.00, 500),
('premium', 'الباقة المتميزة', 'للمنظمات الكبيرة مع احتياجات متقدمة', 999.00, 9990.00, 1000),
('enterprise', 'باقة المؤسسات', 'للمؤسسات الكبيرة مع احتياجات مخصصة', 1999.00, 19990.00, 5000)
ON CONFLICT (Plan_id) DO NOTHING;

-- Insert demo organizations
INSERT INTO Organizations (Organization_id, Plan_id, Name, Type, Status, Organization_manager, Username, Password, Quota, Consumed, Remaining) VALUES
('org_001', 'professional', 'مؤسسة التنمية الاجتماعية', 'nonprofit', 'active', 'أحمد محمد الشريف', 'social_dev_org', 'SecurePass123', 1000, 780, 220),
('org_002', 'enterprise', 'شركة الابتكار التقني', 'company', 'active', 'فاطمة سالم القحطاني', 'tech_innovation', 'TechPass@2024', 2500, 1850, 650),
('org_003', 'enterprise', 'وزارة التنمية الاجتماعية', 'government', 'active', 'خالد إبراهيم العتيبي', 'social_ministry', 'Gov2024!', 5000, 3200, 1800)
ON CONFLICT (Organization_id) DO NOTHING;

-- Insert demo users
INSERT INTO Users (User_id, Role_id, Organization_id, Name, Email, Password_hash, Phone_number, Status) VALUES
('user_superadmin', 'super_admin', NULL, 'مدير النظام', 'superadmin@exology.com', '$2b$10$encrypted_password_hash', '+966501111111', 'Active'),
('user_admin', 'admin', NULL, 'مدير أثرنا', 'admin@atharonaa.com', '$2b$10$encrypted_password_hash', '+966502222222', 'Active'),
('user_manager1', 'org_manager', 'org_001', 'مدير المنظمة', 'manager@org.com', '$2b$10$encrypted_password_hash', '+966503333333', 'Active'),
('user_beneficiary', 'beneficiary', 'org_001', 'المستفيد', 'beneficiary@example.com', '$2b$10$encrypted_password_hash', '+966504444444', 'Active')
ON CONFLICT (User_id) DO NOTHING;

-- Insert demo beneficiaries
INSERT INTO Beneficiaries (Beneficiary_id, Organization_id, Name, Email, Phone_number, Gender, Age_group, Education_level, Job_title, Income_level, Marital_status, Region) VALUES
('ben_001', 'org_001', 'سارة أحمد الشريف', 'sara.ahmed@example.com', '+966501234567', 'أنثى', '26-35', 'جامعي', 'محاسبة', 'متوسط', 'متزوجة', 'الرياض'),
('ben_002', 'org_001', 'محمد عبدالله القحطاني', 'mohammed.abdullah@example.com', '+966502345678', 'ذكر', '36-45', 'ثانوي', 'مطور برمجيات', 'جيد', 'متزوج', 'جدة'),
('ben_003', 'org_002', 'فاطمة سالم النجار', 'fatima.salem@example.com', '+966503456789', 'أنثى', '26-35', 'جامعي', 'مديرة مشاريع', 'جيد', 'عزباء', 'الدمام'),
('ben_004', 'org_003', 'عبدالرحمن محمد الدوسري', 'abdulrahman.mohammed@example.com', '+966504567890', 'ذكر', '18-25', 'ثانوي', 'مصمم جرافيكي', 'متوسط', 'أعزب', 'الرياض')
ON CONFLICT (Beneficiary_id) DO NOTHING;

-- Insert demo surveys
INSERT INTO Surveys (Survey_id, Organization_id, Title, Description, Impact_domains, Status, Created_by) VALUES
('survey_001', 'org_001', 'استبيان قياس الأثر الاجتماعي للبرامج التعليمية', 'قياس أثر البرامج التعليمية على المستفيدين', 'التعليم والثقافة', 'active', 'user_manager1'),
('survey_002', 'org_002', 'استبيان تقييم برنامج الدعم الصحي', 'تقييم فعالية برامج الدعم الصحي والتوعية الصحية', 'الصحة والبيئة', 'active', 'user_manager1'),
('survey_003', 'org_003', 'دراسة أثر مشاريع الإسكان التنموي', 'قياس أثر مشاريع الإسكان على تحسين جودة الحياة', 'الإسكان والبنية التحتية', 'completed', 'user_manager1')
ON CONFLICT (Survey_id) DO NOTHING;

-- Insert demo questions
INSERT INTO Questions (Question_id, Survey_id, Question, Type, Domain, Sector, Order_num, Phase, required) VALUES
('q_001', 'survey_001', 'ما هو مستواك التعليمي الحالي؟', 'single_choice', 'التعليم', 'education_culture', 1, 'pre', true),
('q_002', 'survey_001', 'هل تعمل حالياً؟', 'single_choice', 'العمل', 'income_work', 2, 'pre', true),
('q_003', 'survey_001', 'كيف تقيم مهاراتك الحالية؟', 'rating', 'المهارات', 'education_culture', 3, 'pre', true),
('q_004', 'survey_001', 'هل تحسن مستواك التعليمي بعد البرنامج؟', 'single_choice', 'التعليم', 'education_culture', 4, 'post', true),
('q_005', 'survey_001', 'هل حصلت على عمل بعد البرنامج؟', 'single_choice', 'العمل', 'income_work', 5, 'post', true)
ON CONFLICT (Question_id) DO NOTHING;

-- Insert demo responses
INSERT INTO Responses (Response_id, Beneficiary_id, Survey_id, Question_id, Response, Channel) VALUES
('resp_001', 'ben_001', 'survey_001', 'q_001', 'جامعي', 'web'),
('resp_002', 'ben_001', 'survey_001', 'q_002', 'نعم', 'web'),
('resp_003', 'ben_002', 'survey_001', 'q_001', 'ثانوي', 'mobile'),
('resp_004', 'ben_002', 'survey_001', 'q_002', 'لا', 'mobile')
ON CONFLICT (Response_id) DO NOTHING;

-- Insert demo activity logs
INSERT INTO Activity_log (Log_id, User_id, Organization_id, Action, Details) VALUES
('log_001', 'user_admin', NULL, 'تسجيل دخول', 'تم تسجيل الدخول بنجاح'),
('log_002', 'user_manager1', 'org_001', 'إنشاء استبيان', 'تم إنشاء استبيان "قياس الأثر الاجتماعي"'),
('log_003', 'user_beneficiary', 'org_001', 'إكمال استبيان', 'تم إكمال استبيان بنجاح')
ON CONFLICT (Log_id) DO NOTHING;

-- Insert demo transactions
INSERT INTO Transactions (Transaction_id, Organization_id, Payment_method, Total, Status, Description) VALUES
('txn_001', 'org_001', 'بطاقة ائتمان', 599.00, 'completed', 'اشتراك شهري - الباقة الاحترافية'),
('txn_002', 'org_002', 'تحويل بنكي', 1999.00, 'completed', 'اشتراك شهري - باقة المؤسسات'),
('txn_003', 'org_003', 'PayTabs', 1999.00, 'pending', 'تجديد الاشتراك الشهري')
ON CONFLICT (Transaction_id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON Users(Email);
CREATE INDEX IF NOT EXISTS idx_users_organization ON Users(Organization_id);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_organization ON Beneficiaries(Organization_id);
CREATE INDEX IF NOT EXISTS idx_surveys_organization ON Surveys(Organization_id);
CREATE INDEX IF NOT EXISTS idx_questions_survey ON Questions(Survey_id);
CREATE INDEX IF NOT EXISTS idx_responses_survey ON Responses(Survey_id);
CREATE INDEX IF NOT EXISTS idx_responses_beneficiary ON Responses(Beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON Activity_log(User_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_organization ON Activity_log(Organization_id);
CREATE INDEX IF NOT EXISTS idx_transactions_organization ON Transactions(Organization_id);

-- Update organization statistics (trigger function)
CREATE OR REPLACE FUNCTION update_organization_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update beneficiaries count
  UPDATE Organizations 
  SET Number_of_beneficiaries = (
    SELECT COUNT(*) FROM Beneficiaries 
    WHERE Organization_id = COALESCE(NEW.Organization_id, OLD.Organization_id)
  )
  WHERE Organization_id = COALESCE(NEW.Organization_id, OLD.Organization_id);
  
  -- Update surveys count
  UPDATE Organizations 
  SET Number_of_surveys = (
    SELECT COUNT(*) FROM Surveys 
    WHERE Organization_id = COALESCE(NEW.Organization_id, OLD.Organization_id)
  )
  WHERE Organization_id = COALESCE(NEW.Organization_id, OLD.Organization_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic statistics updates
DROP TRIGGER IF EXISTS trigger_update_org_stats_beneficiaries ON Beneficiaries;
CREATE TRIGGER trigger_update_org_stats_beneficiaries
  AFTER INSERT OR UPDATE OR DELETE ON Beneficiaries
  FOR EACH ROW EXECUTE FUNCTION update_organization_stats();

DROP TRIGGER IF EXISTS trigger_update_org_stats_surveys ON Surveys;
CREATE TRIGGER trigger_update_org_stats_surveys
  AFTER INSERT OR UPDATE OR DELETE ON Surveys
  FOR EACH ROW EXECUTE FUNCTION update_organization_stats();

-- Update survey response counts
CREATE OR REPLACE FUNCTION update_survey_response_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE Surveys 
  SET total_responses = (
    SELECT COUNT(DISTINCT Beneficiary_id) FROM Responses 
    WHERE Survey_id = COALESCE(NEW.Survey_id, OLD.Survey_id)
  )
  WHERE Survey_id = COALESCE(NEW.Survey_id, OLD.Survey_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_survey_responses ON Responses;
CREATE TRIGGER trigger_update_survey_responses
  AFTER INSERT OR UPDATE OR DELETE ON Responses
  FOR EACH ROW EXECUTE FUNCTION update_survey_response_count();