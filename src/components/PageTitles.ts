import type { UserRole } from '../App';

// Centralized page titles configuration
// This ensures navigation menu labels match page headers exactly
export const PAGE_TITLES: Record<string, string> = {
  // Common pages - matching exactly with Layout.tsx navigation
  'dashboard': 'لوحة التحكم',
  'surveys': 'إدارة الاستبيانات',
  'analysis': 'تحليل برق',
  'system-settings': 'إعدادات النظام',
  'admin-settings': 'إعدادات النظام',
  'organizations': 'إدارة المنظمات',
  'organization-requests': 'إدارة طلبات التسجيل',
  'activity-logs': 'سجل الأنشطة',
  'content-management': 'نظام إدارة المحتوى',
  'global-survey-settings': 'إعدادات الاستبيانات العامة',
  'profile': 'الملف الشخصي',
  
  // Subscription and billing pages
  'payment-method': 'اختيار طريقة الدفع',
  'payment-details': 'تفاصيل الدفع',
  'subscription-confirmation': 'تأكيد الاشتراك',
  'subscription': 'الاشتراكات والفواتير',
  'admin-billing': 'الاشتراكات والفواتير',
  
  // Survey pages
  'survey-interface': 'الاستبيانات',
  'enhanced-survey': 'الاستبيانات',
  'survey-creation': 'إنشاء استبيان',
  'survey-view': 'عرض الاستبيان',
  'survey-results': 'نتائج الاستبيان',
  'thank-you': 'شكراً لمشاركتك',
  'organization-surveys': 'استبيانات المنظمة',
  
  // Role-specific user management titles (matching Layout.tsx exactly)
  'user-management-super_admin': 'إدارة المستخدمين',
  'user-management-admin': 'إدارة المستفيدين',
  'user-management-org_manager': 'إدارة المستخدمين',
  
  // Role-specific beneficiaries titles (matching Layout.tsx exactly)
  'beneficiaries-super_admin': 'إدارة المنظمات', // Super admin sees organizations in beneficiaries page
  'beneficiaries-admin': 'إدارة المنظمات',
  'beneficiaries-org_manager': 'إدارة المستفيدين',
  
  // Role-specific subscription titles (matching Layout.tsx exactly)
  'subscription-super_admin': 'الاشتراكات والفواتير',
  'admin-billing-admin': 'الاشتراكات والفواتير',
  'admin-billing-super_admin': 'الاشتراكات والفواتير',
  
  // Additional role-specific variations for profiles and payments
  'profile-org_manager': 'الملف الشخصي',
  'payment-method-org_manager': 'اختيار طريقة الدفع',
  'payment-details-org_manager': 'تفاصيل الدفع',
  'subscription-confirmation-org_manager': 'تأكيد الاشتراك',
};

/**
 * Get the appropriate page title based on page ID and user role
 * This ensures navigation menu labels match page headers exactly
 */
export function getPageTitle(pageId: string, userRole: UserRole): string {
  // Try role-specific title first
  const roleSpecificKey = `${pageId}-${userRole}`;
  if (PAGE_TITLES[roleSpecificKey]) {
    return PAGE_TITLES[roleSpecificKey];
  }
  
  // Fall back to general title
  return PAGE_TITLES[pageId] || pageId;
}

/**
 * Update a page title (useful for dynamic title updates)
 */
export function updatePageTitle(pageId: string, newTitle: string, userRole?: UserRole): void {
  if (userRole) {
    const roleSpecificKey = `${pageId}-${userRole}`;
    PAGE_TITLES[roleSpecificKey] = newTitle;
  } else {
    PAGE_TITLES[pageId] = newTitle;
  }
}

/**
 * Get all available page titles for a specific user role
 */
export function getAvailablePageTitles(userRole: UserRole): Record<string, string> {
  const result: Record<string, string> = {};
  
  Object.keys(PAGE_TITLES).forEach(key => {
    if (key.includes('-')) {
      const [pageId, role] = key.split('-');
      if (role === userRole) {
        result[pageId] = PAGE_TITLES[key];
      }
    } else {
      // Only add general titles if no role-specific version exists
      const roleSpecificKey = `${key}-${userRole}`;
      if (!PAGE_TITLES[roleSpecificKey]) {
        result[key] = PAGE_TITLES[key];
      }
    }
  });
  
  return result;
}