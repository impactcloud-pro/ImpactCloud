/*
  # Create Initial Data for Social Impact Platform

  1. Roles
    - Create system roles (super_admin, admin, org_manager, beneficiary)
  
  2. Test Organization
    - Create a test organization for development
  
  3. Subscription Plans
    - Create basic subscription plans
*/

-- Create roles
INSERT INTO roles (role_id, name, description) VALUES
  ('super_admin', 'super_admin', 'مدير النظام الرئيسي - صلاحيات كاملة'),
  ('admin', 'admin', 'مدير أثرنا - إدارة المنصة والمنظمات'),
  ('org_manager', 'org_manager', 'مدير المنظمة - إدارة الاستبيانات والمستفيدين'),
  ('beneficiary', 'beneficiary', 'مستفيد - المشاركة في الاستبيانات')
ON CONFLICT (role_id) DO NOTHING;

-- Create subscription plans
INSERT INTO subscription_plans (plan_id, package_name, description, total_price_monthly, total_price_annual, quota_limit) VALUES
  ('basic', 'الباقة الأساسية', 'باقة أساسية للمنظمات الصغيرة', 99.00, 990.00, 500),
  ('professional', 'الباقة الاحترافية', 'باقة متقدمة للمنظمات المتوسطة', 299.00, 2990.00, 2000),
  ('enterprise', 'باقة المؤسسات', 'باقة شاملة للمؤسسات الكبيرة', 799.00, 7990.00, 10000)
ON CONFLICT (plan_id) DO NOTHING;

-- Create test organization
INSERT INTO organizations (organization_id, plan_id, name, type, status, organization_manager, username, password, number_of_beneficiaries, number_of_surveys, quota, consumed, remaining, created_by) VALUES
  ('test_org_001', 'professional', 'منظمة تجريبية للاختبار', 'nonprofit', 'active', 'مدير المنظمة التجريبية', 'test_org', 'TestOrg123!', 0, 0, 2000, 0, 2000, 'system')
ON CONFLICT (organization_id) DO NOTHING;