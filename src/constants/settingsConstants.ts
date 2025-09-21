import type { UserRole } from './types';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  organization?: string;
  status: 'active' | 'suspended' | 'pending';
  lastLogin?: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  displayName: string;
  permissions: string[];
}

export interface Permission {
  id: string;
  name: string;
  displayName: string;
  category: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank_transfer' | 'credit_card' | 'mada' | 'stc_pay' | 'apple_pay';
  isAvailable: boolean;
  processingTime: string;
  fees: string;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
}

export interface Integration {
  id: string;
  name: string;
  type: 'webhook' | 'api' | 'llm';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  settings?: Record<string, any>;
}

export interface EditUserFormData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  organization: string;
}

export const demoUsers: User[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    role: 'admin',
    organization: 'أثرنا',
    status: 'active',
    lastLogin: '2024-12-19T10:30:00Z',
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    name: 'فاطمة السالم',
    email: 'fatima@example.com',
    phone: '+966507654321',
    role: 'org_manager',
    organization: 'مؤسسة خيرية',
    status: 'active',
    lastLogin: '2024-12-18T15:45:00Z',
    createdAt: '2024-02-20T09:30:00Z'
  },
  {
    id: '3',
    name: 'عبدالله الأحمد',
    email: 'abdullah@example.com',
    phone: '+966512345678',
    role: 'admin',
    organization: 'أثرنا',
    status: 'suspended',
    lastLogin: '2024-12-10T11:20:00Z',
    createdAt: '2024-03-05T14:15:00Z'
  }
];

export const systemRoles: Role[] = [
  {
    id: 'super_admin',
    name: 'super_admin',
    displayName: 'مدير النظام الرئيسي',
    permissions: ['all']
  },
  {
    id: 'admin',
    name: 'admin', 
    displayName: 'مدير أثرنا',
    permissions: ['manage_surveys', 'manage_users', 'view_analytics', 'manage_billing']
  },
  {
    id: 'org_manager',
    name: 'org_manager',
    displayName: 'مدير المنظمة',
    permissions: ['create_surveys', 'view_own_analytics', 'manage_org_users']
  },
  {
    id: 'beneficiary',
    name: 'beneficiary',
    displayName: 'مستفيد',
    permissions: ['take_surveys']
  }
];

export const allPermissions: Permission[] = [
  // Dashboard permissions
  { id: 'view_dashboard', name: 'view_dashboard', displayName: 'عرض لوحة التحكم', category: 'dashboard' },
  { id: 'view_analytics', name: 'view_analytics', displayName: 'عرض التحليلات', category: 'dashboard' },
  { id: 'view_reports', name: 'view_reports', displayName: 'عرض التقارير', category: 'dashboard' },
  
  // Survey permissions
  { id: 'create_surveys', name: 'create_surveys', displayName: 'إنشاء الاستبيانات', category: 'surveys' },
  { id: 'edit_surveys', name: 'edit_surveys', displayName: 'تعديل الاستبيانات', category: 'surveys' },
  { id: 'delete_surveys', name: 'delete_surveys', displayName: 'حذف الاستبيانات', category: 'surveys' },
  { id: 'manage_surveys', name: 'manage_surveys', displayName: 'إدارة الاستبيانات', category: 'surveys' },
  { id: 'take_surveys', name: 'take_surveys', displayName: 'المشاركة في الاستبيانات', category: 'surveys' },
  { id: 'share_surveys', name: 'share_surveys', displayName: 'مشاركة الاستبيانات', category: 'surveys' },
  
  // User management permissions
  { id: 'manage_users', name: 'manage_users', displayName: 'إدارة المستخدمين', category: 'users' },
  { id: 'add_users', name: 'add_users', displayName: 'إضافة مستخدمين', category: 'users' },
  { id: 'edit_users', name: 'edit_users', displayName: 'تعديل المستخدمين', category: 'users' },
  { id: 'delete_users', name: 'delete_users', displayName: 'حذف المستخدمين', category: 'users' },
  { id: 'manage_org_users', name: 'manage_org_users', displayName: 'إدارة مستخدمي المنظمة', category: 'users' },
  
  // Billing permissions
  { id: 'manage_billing', name: 'manage_billing', displayName: 'إدارة الفواتير', category: 'billing' },
  { id: 'view_invoices', name: 'view_invoices', displayName: 'عرض الفواتير', category: 'billing' },
  { id: 'manage_subscriptions', name: 'manage_subscriptions', displayName: 'إدارة الاشتراكات', category: 'billing' },
  
  // System permissions
  { id: 'system_settings', name: 'system_settings', displayName: 'إعدادات النظام', category: 'system' },
  { id: 'manage_organizations', name: 'manage_organizations', displayName: 'إدارة المنظمات', category: 'system' },
  { id: 'view_activity_logs', name: 'view_activity_logs', displayName: 'عرض سجلات الأنشطة', category: 'system' },
  { id: 'content_management', name: 'content_management', displayName: 'إدارة المحتوى', category: 'system' },
  
  // Analytics permissions
  { id: 'advanced_analytics', name: 'advanced_analytics', displayName: 'التحليلات المتقدمة', category: 'analytics' },
  { id: 'export_data', name: 'export_data', displayName: 'تصدير البيانات', category: 'analytics' },
  { id: 'view_own_analytics', name: 'view_own_analytics', displayName: 'عرض تحليلات المنظمة', category: 'analytics' }
];

export const availablePaymentMethods: PaymentMethod[] = [
  {
    id: 'bank_transfer',
    name: 'حساب بنكي',
    type: 'bank_transfer',
    isAvailable: true,
    processingTime: '1-3 أيام عمل',
    fees: 'مجاني'
  },
  {
    id: 'paytabs',
    name: 'PayTabs',
    type: 'credit_card',
    isAvailable: true,
    processingTime: 'فوري',
    fees: '3.5% + 1.5 ريال'
  }
];

export const bankDetails: BankDetails = {
  bankName: 'البنك الأهلي السعودي',
  accountName: 'شركة سحابة الأثر للتقنية',
  accountNumber: '12345678901',
  iban: 'SA1234567890123456789012',
  swiftCode: 'NCBKSARI'
};

export const demoIntegrations: Integration[] = [
  {
    id: '1',
    name: 'OpenAI GPT-4',
    type: 'llm',
    status: 'connected',
    lastSync: '2024-12-19T10:30:00Z',
    settings: {
      apiKey: '••••••••••••••••••••••••••••••••',
      model: 'gpt-4',
      maxTokens: 2000,
      rateLimitPerDay: 1000
    }
  },
  {
    id: '2',
    name: 'Slack Notifications',
    type: 'webhook',
    status: 'disconnected',
    settings: {
      webhookUrl: '',
      channel: '#general',
      username: 'أثرنا'
    }
  },
  {
    id: '3',
    name: 'Analytics API',
    type: 'api',
    status: 'error',
    lastSync: '2024-12-18T08:15:00Z',
    settings: {
      endpoint: 'https://api.analytics.com',
      authToken: '••••••••••••',
      syncInterval: 'daily'
    }
  }
];

export const llmProviders = {
  openai: {
    name: 'OpenAI',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'gpt-4o']
  },
  anthropic: {
    name: 'Anthropic (Claude)',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku']
  },
  google: {
    name: 'Google (Gemini)',
    models: ['gemini-pro', 'gemini-pro-vision', 'gemini-ultra']
  },
  azure: {
    name: 'Azure OpenAI',
    models: ['gpt-4', 'gpt-4-32k', 'gpt-35-turbo', 'gpt-35-turbo-16k']
  }
};

export const organizationOptions = [
  'أثرنا',
  'مؤسسة خيرية',
  'جمعية تطوعية',
  'مؤسسة اجتماعية',
  'منظمة غير ربحية'
];