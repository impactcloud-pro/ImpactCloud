import type { PagePermissions } from './types';

export const pagePermissions: PagePermissions = {
  dashboard: ['super_admin', 'admin', 'org_manager'],
  surveys: ['admin', 'org_manager'],
  'survey-creation': ['admin', 'org_manager'],
  'user-management': ['super_admin', 'admin'],
  'beneficiaries': ['super_admin', 'admin', 'org_manager'],
  'analysis': ['org_manager'],
  'organizations': ['super_admin'],
  'system-settings': ['super_admin'],
  'admin-settings': ['admin'],
  'admin-billing': ['super_admin', 'admin'],
  'activity-logs': ['super_admin'],
  'content-management': ['super_admin', 'admin'],
  'organization-requests': ['admin'],
  'global-survey-settings': ['admin'],
  'profile': ['org_manager'],
  'payment-method': ['org_manager'],
  'payment-details': ['org_manager'],
  'subscription-confirmation': ['org_manager'],
  subscription: ['super_admin'],
  'survey-interface': ['beneficiary', 'super_admin', 'admin', 'org_manager'],
  'enhanced-survey': ['beneficiary', 'super_admin', 'admin', 'org_manager'],
  'thank-you': ['beneficiary', 'super_admin', 'admin', 'org_manager']
};