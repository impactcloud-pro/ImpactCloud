# Authentication & User Management Module

This module implements secure authentication and user management for the Sahabat Al-Athar Impact Cloud Platform using Supabase and JWT tokens.

## Architecture Overview

```
/api/auth/
├── login.ts          # User login endpoint
├── logout.ts         # User logout endpoint
├── reset.ts          # Password reset endpoints
├── verify.ts         # Token verification endpoint
└── refresh.ts        # Token refresh endpoint

/lib/
├── db/
│   └── auth.ts       # Database operations for auth
├── middleware/
│   ├── rbac.ts       # Role-based access control
│   ├── audit.ts      # Activity logging
│   ├── rateLimiter.ts # Brute-force protection
│   └── auth.ts       # Combined auth middleware
├── utils/
│   ├── jwt.ts        # JWT token utilities
│   ├── password.ts   # Password hashing/verification
│   └── validation.ts # Input validation utilities
├── types/
│   └── auth.ts       # TypeScript type definitions
└── config/
    └── auth.ts       # Authentication configuration
```

## Features Implemented

### 🔐 Authentication
- **JWT-based authentication** with 30-minute session timeout
- **Secure password hashing** using bcrypt with 12 salt rounds
- **Password strength validation** with comprehensive rules
- **Account locking** after 5 failed login attempts
- **Rate limiting** to prevent brute-force attacks

### 👥 User Management
- **Role-based access control (RBAC)** with 4 roles:
  - `super_admin`: Full system access
  - `admin`: Organization and user management
  - `org_manager`: Organization-specific management
  - `beneficiary`: Survey participation only
- **User CRUD operations** with proper validation
- **Organization-scoped access** control

### 🛡️ Security Features
- **HTTPS enforcement** in production
- **Security headers** (XSS, CSRF, etc.)
- **Input validation and sanitization**
- **Comprehensive audit logging**
- **Rate limiting** for all endpoints
- **Token refresh** mechanism

### 📊 Audit & Monitoring
- **Complete activity logging** for all user actions
- **Failed login attempt tracking**
- **Rate limit violation logging**
- **IP address and user agent tracking**

## API Endpoints

### POST /api/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "user_id": "user_123",
    "name": "أحمد محمد",
    "email": "user@example.com",
    "role": "org_manager",
    "organization": "org_456"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "تم تسجيل الدخول بنجاح"
}
```

### POST /api/auth/logout
Logout current user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

### POST /api/auth/reset
Request password reset.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
}
```

### PUT /api/auth/reset
Confirm password reset with token.

**Request:**
```json
{
  "token": "reset_token_here",
  "newPassword": "newSecurePassword123"
}
```

### GET /api/auth/verify
Verify JWT token validity.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### POST /api/auth/refresh
Refresh JWT token when near expiry.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

## Database Functions

### Core Functions
- `getUserByEmail(email)` - Fetch user by email
- `getUserById(userId)` - Fetch user by ID
- `createUser(userData)` - Create new user
- `updateUserPassword(userId, hash)` - Update password
- `updateUserStatus(userId, status)` - Update user status

### Security Functions
- `getFailedLoginAttempts(email)` - Count failed attempts
- `isAccountLocked(email)` - Check if account is locked
- `lockUserAccount(email)` - Lock account after failed attempts
- `logUserAction(actionData)` - Log user activities

### Token Management
- `storePasswordResetToken(email, token, expires)` - Store reset token
- `verifyPasswordResetToken(token)` - Verify reset token

## Middleware

### RBAC Middleware
```typescript
import { requireRole } from './lib/middleware/rbac';

// Protect endpoint for admins only
const middleware = requireRole(['super_admin', 'admin']);
```

### Audit Middleware
```typescript
import { auditUserAction } from './lib/middleware/audit';

// Log user actions
await auditUserAction(request, 'إنشاء استبيان', 'تم إنشاء استبيان جديد');
```

### Rate Limiting
```typescript
import { rateLimitLogin } from './lib/middleware/rateLimiter';

// Protect login endpoint
const rateLimitResponse = await rateLimitLogin(request, email);
if (rateLimitResponse) return rateLimitResponse;
```

## Security Considerations

### Password Security
- Minimum 8 characters with complexity requirements
- bcrypt hashing with 12 salt rounds
- Password strength validation
- Secure password generation utility

### Session Security
- 30-minute session timeout
- Automatic token refresh when near expiry
- HttpOnly, Secure cookies in production
- Token blacklisting capability (TODO)

### Brute-Force Protection
- Account locking after 5 failed attempts
- Rate limiting on all auth endpoints
- IP-based and email-based rate limiting
- Comprehensive logging of violations

### Data Protection
- Input validation and sanitization
- SQL injection prevention through parameterized queries
- XSS protection through output encoding
- CSRF protection through SameSite cookies

## TODOs for Production

### High Priority
1. **Email Service Integration**
   - Implement password reset email sending
   - Add email templates for notifications
   - Configure SMTP/email service provider

2. **Token Storage**
   - Create `password_reset_tokens` table
   - Implement proper token storage and cleanup
   - Add token blacklisting for immediate logout

3. **Enhanced Security**
   - Implement 2FA (Two-Factor Authentication)
   - Add device fingerprinting
   - Implement session management across devices

### Medium Priority
4. **Monitoring & Alerts**
   - Set up alerts for suspicious activities
   - Implement real-time security monitoring
   - Add metrics for authentication performance

5. **User Experience**
   - Add "Remember Me" functionality
   - Implement progressive authentication
   - Add social login options (if needed)

### Low Priority
6. **Advanced Features**
   - Implement SSO (Single Sign-On)
   - Add API key authentication for integrations
   - Implement role delegation

## Environment Variables

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Supabase Configuration
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Email Configuration (TODO)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@atharonaa.com
SMTP_PASS=your-smtp-password

# Frontend URL for reset links
FRONTEND_URL=https://your-domain.com

# Environment
NODE_ENV=production
```

## Usage Examples

### Protecting an API Route
```typescript
import { createAuthMiddleware } from './lib/middleware/auth';

export async function GET(request: Request) {
  // Apply authentication middleware
  const authResponse = await createAuthMiddleware(['admin', 'org_manager'])(request);
  if (authResponse) return authResponse;
  
  // Your protected route logic here
  return new Response(JSON.stringify({ data: 'protected data' }));
}
```

### Creating a New User
```typescript
import { createUser } from './lib/db/auth';
import { hashPassword } from './lib/utils/password';

const passwordHash = await hashPassword('userPassword123');
const newUser = await createUser({
  name: 'أحمد محمد',
  email: 'ahmed@example.com',
  password_hash: passwordHash,
  role_id: 'org_manager',
  organization_id: 'org_123',
  phone_number: '+966501234567',
  status: 'Active'
});
```

### Validating User Input
```typescript
import { validateUserData } from './lib/utils/validation';

const validation = validateUserData({
  name: 'أحمد محمد',
  email: 'ahmed@example.com',
  role_id: 'org_manager',
  organization_id: 'org_123'
});

if (!validation.isValid) {
  console.log('Validation errors:', validation.errors);
}
```

This module provides a solid foundation for secure authentication and user management with comprehensive security features and audit capabilities.