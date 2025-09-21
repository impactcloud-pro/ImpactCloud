// URL routing utilities for the application

// Mapping between internal page names and URL paths
export const PAGE_ROUTES = {
  'landing': '/',
  'login': '/login',
  'org-registration': '/register',
  'dashboard': '/dashboard',
  'surveys': '/surveys',
  'survey-creation': '/surveys/create',
  'survey-view': '/surveys/view',
  'survey-share': '/surveys/share',
  'survey-results': '/surveys/results',
  'analysis': '/analysis',
  'beneficiaries': '/beneficiaries',
  'organization-surveys': '/beneficiaries/surveys',
  'profile': '/profile',
  'subscription': '/subscription',
  'payment-method': '/subscription/payment-method',
  'payment-details': '/subscription/payment-details',
  'subscription-confirmation': '/subscription/confirmation',
  'user-management': '/admin/users',
  'organizations': '/admin/organizations',
  'admin-billing': '/admin/billing',
  'admin-settings': '/admin/settings',
  'system-settings': '/system/settings',
  'activity-logs': '/system/activity',
  'content-management': '/system/content',
  'organization-requests': '/system/organizations',
  'global-survey-settings': '/system/survey-settings',
  'super-admin-beneficiaries': '/system/beneficiaries',
  'super-admin-billing': '/system/billing',
  'thank-you': '/thank-you'
} as const;

// Reverse mapping for URL to page name
export const ROUTE_PAGES = Object.fromEntries(
  Object.entries(PAGE_ROUTES).map(([page, route]) => [route, page])
) as Record<string, keyof typeof PAGE_ROUTES>;

/**
 * Get the URL path for a given page name
 */
export function getUrlForPage(page: string): string {
  return PAGE_ROUTES[page as keyof typeof PAGE_ROUTES] || '/';
}

/**
 * Get the page name for a given URL path
 */
export function getPageForUrl(url: string): string {
  const path = url.split('?')[0]; // Remove query parameters
  return ROUTE_PAGES[path] || 'landing';
}

/**
 * Update the browser URL without triggering a page reload
 */
export function updateUrl(page: string, state?: any): void {
  const url = getUrlForPage(page);
  const title = getPageTitle(page);
  
  if (window.location.pathname !== url) {
    window.history.pushState(state, title, url);
  }
}

/**
 * Replace the current URL without adding to history
 */
export function replaceUrl(page: string, state?: any): void {
  const url = getUrlForPage(page);
  const title = getPageTitle(page);
  
  window.history.replaceState(state, title, url);
}

/**
 * Get the current page from the URL
 */
export function getCurrentPageFromUrl(): string {
  return getPageForUrl(window.location.pathname);
}

/**
 * Get page title for SEO and browser tab
 */
function getPageTitle(page: string): string {
  const titles: Record<string, string> = {
    'landing': 'سحابة الأثر - منصة قياس الأثر الاجتماعي',
    'login': 'تسجيل الدخول - سحابة الأثر',
    'org-registration': 'تسجيل منظمة - سحابة الأثر',
    'dashboard': 'لوحة التحكم - سحابة الأثر',
    'surveys': 'الاستطلاعات - سحابة الأثر',
    'survey-creation': 'إنشاء استطلاع - سحابة الأثر',
    'survey-view': 'عرض الاستطلاع - سحابة الأثر',
    'survey-share': 'مشاركة الاستطلاع - سحابة الأثر',
    'survey-results': 'نتائج الاستطلاع - سحابة الأثر',
    'analysis': 'التحليلات - سحابة الأثر',
    'beneficiaries': 'المستفيدين - سحابة الأثر',
    'organization-surveys': 'استطلاعات المنظمة - سحابة الأثر',
    'profile': 'الملف الشخصي - سحابة الأثر',
    'subscription': 'الاشتراكات - سحابة الأثر',
    'payment-method': 'طريقة الدفع - سحابة الأثر',
    'payment-details': 'تفاصيل الدفع - سحابة الأثر',
    'subscription-confirmation': 'تأكيد الاشتراك - سحابة الأثر',
    'user-management': 'إدارة المستخدمين - سحابة الأثر',
    'organizations': 'إدارة المنظمات - سحابة الأثر',
    'admin-billing': 'إدارة الفواتير - سحابة الأثر',
    'admin-settings': 'إعدادات النظام - سحابة الأثر',
    'system-settings': 'إعدادات النظام - سحابة الأثر',
    'activity-logs': 'سجل الأنشطة - سحابة الأثر',
    'content-management': 'إدارة المحتوى - سحابة الأثر',
    'organization-requests': 'طلبات المنظمات - سحابة الأثر',
    'global-survey-settings': 'إعدادات الاستطلاعات - سحابة الأثر',
    'super-admin-beneficiaries': 'إدارة المستفيدين - سحابة الأثر',
    'super-admin-billing': 'إدارة الفواتير العامة - سحابة الأثر',
    'thank-you': 'شكراً لك - سحابة الأثر'
  };

  return titles[page] || 'سحابة الأثر';
}

/**
 * Initialize URL routing - call this when the app starts
 */
export function initializeUrlRouting(onPageChange: (page: string) => void): () => void {
  // Handle browser back/forward buttons
  const handlePopState = (event: PopStateEvent) => {
    const page = getCurrentPageFromUrl();
    onPageChange(page);
  };

  window.addEventListener('popstate', handlePopState);

  // Set initial page from URL
  const initialPage = getCurrentPageFromUrl();
  if (initialPage !== 'landing') {
    onPageChange(initialPage);
  }

  // Return cleanup function
  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}