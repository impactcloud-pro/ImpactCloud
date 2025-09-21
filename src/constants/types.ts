export type UserRole = 'super_admin' | 'admin' | 'org_manager' | 'beneficiary';

export interface User {
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
}

export interface Survey {
  id: string;
  title: string;
  organization: string;
  organizationEmail?: string;
  organizationWebsite?: string;
  organizationLogo?: string;
  description: string;
  selectedSectors: string[];
  selectedFilters: string[];
  preQuestions: any[];
  postQuestions: any[];
  beneficiaries: any[];
  startDate?: string;
  endDate?: string;
  createdAt: Date;
  status: 'draft' | 'active' | 'completed';
  responses: number;
}

export interface DemoAccount {
  email: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  organization?: string;
}

export interface SelectedPackage {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  currency: string;
  duration: string;
  isPremium?: boolean;
  isPopular?: boolean;
  color: string;
  features: string[];
  limits: {
    surveys: number;
    beneficiaries: number;
    responses: number;
    storage: string;
    support: string;
  };
}

export type PagePermissions = {
  dashboard: UserRole[];
  surveys: UserRole[];
  'survey-creation': UserRole[];
  'user-management': UserRole[];
  'beneficiaries': UserRole[];
  'analysis': UserRole[];
  'organizations': UserRole[];
  'system-settings': UserRole[];
  'admin-settings': UserRole[];
  'admin-billing': UserRole[];
  'activity-logs': UserRole[];
  'content-management': UserRole[];
  'organization-requests': UserRole[];
  'global-survey-settings': UserRole[];
  'profile': UserRole[];
  'payment-method': UserRole[];
  'payment-details': UserRole[];
  'subscription-confirmation': UserRole[];
  subscription: UserRole[];
  'survey-interface': UserRole[];
  'enhanced-survey': UserRole[];
  'thank-you': UserRole[];
};

export interface SubscriptionFlow {
  selectedPackage: SelectedPackage | null;
  selectedMethod: any | null;
  paymentData: any | null;
}