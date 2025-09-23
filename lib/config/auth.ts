/**
 * Authentication configuration constants
 */

export const AUTH_CONFIG = {
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_EXPIRES_IN: '30m', // 30 minutes session timeout
  JWT_ALGORITHM: 'HS256' as const,
  
  // Password Configuration
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_SALT_ROUNDS: 12,
  
  // Account Locking
  MAX_LOGIN_ATTEMPTS: 5,
  ACCOUNT_LOCK_DURATION: 30 * 60 * 1000, // 30 minutes
  
  // Password Reset
  RESET_TOKEN_LENGTH: 32,
  RESET_TOKEN_EXPIRES: 30 * 60 * 1000, // 30 minutes
  
  // Session Management
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  REFRESH_THRESHOLD: 5 * 60 * 1000, // Refresh when 5 minutes left
  
  // Rate Limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_ATTEMPTS: 5,
  
  // Security Headers
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  },
  
  // CORS Configuration
  CORS_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  CORS_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  CORS_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With'],
  
  // Cookie Configuration
  COOKIE_CONFIG: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 30 * 60, // 30 minutes in seconds
    path: '/'
  }
} as const;

/**
 * Role hierarchy and permissions
 */
export const ROLE_PERMISSIONS = {
  super_admin: [
    'manage_system',
    'manage_organizations',
    'manage_all_users',
    'manage_all_surveys',
    'view_all_analytics',
    'manage_billing',
    'view_activity_logs',
    'manage_content',
    'system_settings'
  ],
  admin: [
    'manage_organizations',
    'manage_users',
    'manage_surveys',
    'view_analytics',
    'manage_billing',
    'view_activity_logs',
    'content_management'
  ],
  org_manager: [
    'manage_org_users',
    'create_surveys',
    'manage_org_surveys',
    'view_org_analytics',
    'manage_beneficiaries',
    'view_org_activity_logs'
  ],
  beneficiary: [
    'take_surveys',
    'view_own_responses',
    'update_own_profile'
  ]
} as const;

/**
 * Protected routes configuration
 */
export const PROTECTED_ROUTES = {
  // Super Admin only
  '/api/system': ['super_admin'],
  '/api/organizations': ['super_admin'],
  '/api/admin/system-settings': ['super_admin'],
  
  // Admin and above
  '/api/admin': ['super_admin', 'admin'],
  '/api/users': ['super_admin', 'admin'],
  '/api/billing': ['super_admin', 'admin'],
  
  // Organization Manager and above
  '/api/surveys': ['super_admin', 'admin', 'org_manager'],
  '/api/beneficiaries': ['super_admin', 'admin', 'org_manager'],
  '/api/analytics': ['super_admin', 'admin', 'org_manager'],
  
  // Authenticated users
  '/api/profile': ['super_admin', 'admin', 'org_manager', 'beneficiary'],
  '/api/responses': ['super_admin', 'admin', 'org_manager', 'beneficiary']
} as const;

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/reset',
  '/api/health',
  '/api/public'
] as const;

/**
 * Environment validation
 */
export function validateAuthEnvironment(): { isValid: boolean; missing: string[] } {
  const required = [
    'JWT_SECRET',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  return {
    isValid: missing.length === 0,
    missing
  };
}