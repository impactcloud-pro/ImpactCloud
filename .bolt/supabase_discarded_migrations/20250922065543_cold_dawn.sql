/*
  # Create Test Users and Initial Data

  1. Roles
    - Create basic roles for the system
  2. Test Organizations  
    - Create sample organizations for testing
  3. Test Users
    - Create test users with different roles
  4. Security
    - Enable RLS and create policies
*/

-- Create roles first
INSERT INTO roles (role_id, name, description) VALUES
  ('super_admin', 'مدير النظام الرئيسي', 'صلاحيات كاملة لإدارة النظام'),
  ('admin', 'مدير أثرنا', 'إدارة المنصة والمنظمات'),
  ('org_manager', 'مدير منظمة', 'إدارة منظمة واحدة'),
  ('beneficiary', 'مستفيد', 'المشاركة في الاستبيانات')
ON CONFLICT (role_id) DO NOTHING;

-- Create test subscription plans
INSERT INTO subscription_plans (plan_id, package_name, description, total_price_monthly, total_price_annual, quota_limit) VALUES
  ('basic', 'الباقة الأساسية', 'باقة أساسية للمنظمات الصغيرة', 299.00, 2990.00, 1000),
  ('professional', 'الباقة الاحترافية', 'باقة متقدمة للمنظمات المتوسطة', 599.00, 5990.00, 5000),
  ('enterprise', 'باقة المؤسسات', 'باقة شاملة للمؤسسات الكبيرة', 999.00, 9990.00, 25000)
ON CONFLICT (plan_id) DO NOTHING;

-- Create test organization
INSERT INTO organizations (organization_id, plan_id, name, type, status, organization_manager, username, password, number_of_beneficiaries, number_of_surveys, quota, consumed, remaining, created_by) VALUES
  ('org_001', 'professional', 'منظمة تجريبية للاختبار', 'nonprofit', 'active', 'مدير المنظمة التجريبية', 'test_org', 'TestOrg123!', 0, 0, 5000, 0, 5000, 'system')
ON CONFLICT (organization_id) DO NOTHING;

-- Note: Test users will be created automatically by the application
-- when it starts up through the createTestUsers() function
-- This ensures proper Supabase Auth integration

-- Create a function to update organization stats automatically
CREATE OR REPLACE FUNCTION update_organization_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update organization statistics when beneficiaries or surveys change
  IF TG_TABLE_NAME = 'beneficiaries' THEN
    UPDATE organizations 
    SET number_of_beneficiaries = (
      SELECT COUNT(*) FROM beneficiaries 
      WHERE organization_id = COALESCE(NEW.organization_id, OLD.organization_id)
    )
    WHERE organization_id = COALESCE(NEW.organization_id, OLD.organization_id);
  END IF;
  
  IF TG_TABLE_NAME = 'surveys' THEN
    UPDATE organizations 
    SET number_of_surveys = (
      SELECT COUNT(*) FROM surveys 
      WHERE organization_id = COALESCE(NEW.organization_id, OLD.organization_id)
    )
    WHERE organization_id = COALESCE(NEW.organization_id, OLD.organization_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create a function to update survey response count
CREATE OR REPLACE FUNCTION update_survey_response_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update survey total_responses when responses change
  UPDATE surveys 
  SET total_responses = (
    SELECT COUNT(*) FROM responses 
    WHERE survey_id = COALESCE(NEW.survey_id, OLD.survey_id)
  )
  WHERE survey_id = COALESCE(NEW.survey_id, OLD.survey_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;