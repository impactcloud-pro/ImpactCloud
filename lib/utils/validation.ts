/**
 * Validation utilities for authentication and user management
 */

/**
 * Validate email format
 * @param email - Email to validate
 * @returns Validation result
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: false, error: 'البريد الإلكتروني مطلوب' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'تنسيق البريد الإلكتروني غير صحيح' };
  }

  if (email.length > 150) {
    return { isValid: false, error: 'البريد الإلكتروني طويل جداً' };
  }

  return { isValid: true };
}

/**
 * Validate phone number (Saudi format)
 * @param phone - Phone number to validate
 * @returns Validation result
 */
export function validatePhoneNumber(phone: string): { isValid: boolean; error?: string } {
  if (!phone) {
    return { isValid: true }; // Phone is optional
  }

  // Remove spaces and special characters
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Saudi phone number patterns
  const saudiPatterns = [
    /^(\+966|966)?[5-9]\d{8}$/, // Mobile numbers
    /^(\+966|966)?1[1-9]\d{7}$/ // Landline numbers
  ];

  const isValid = saudiPatterns.some(pattern => pattern.test(cleanPhone));
  
  if (!isValid) {
    return { 
      isValid: false, 
      error: 'رقم الهاتف يجب أن يكون رقماً سعودياً صحيحاً (مثال: +966501234567)' 
    };
  }

  return { isValid: true };
}

/**
 * Validate user name
 * @param name - Name to validate
 * @returns Validation result
 */
export function validateName(name: string): { isValid: boolean; error?: string } {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'الاسم مطلوب' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'الاسم يجب أن يكون حرفين على الأقل' };
  }

  if (name.length > 100) {
    return { isValid: false, error: 'الاسم طويل جداً' };
  }

  // Check for valid characters (Arabic, English, spaces, common punctuation)
  const nameRegex = /^[\u0600-\u06FFa-zA-Z\s\.\-\']+$/;
  if (!nameRegex.test(name)) {
    return { 
      isValid: false, 
      error: 'الاسم يحتوي على أحرف غير مسموحة' 
    };
  }

  return { isValid: true };
}

/**
 * Validate role ID
 * @param roleId - Role ID to validate
 * @returns Validation result
 */
export function validateRole(roleId: string): { isValid: boolean; error?: string } {
  const validRoles = ['super_admin', 'admin', 'org_manager', 'beneficiary'];
  
  if (!roleId) {
    return { isValid: false, error: 'الدور مطلوب' };
  }

  if (!validRoles.includes(roleId)) {
    return { isValid: false, error: 'الدور المحدد غير صحيح' };
  }

  return { isValid: true };
}

/**
 * Validate organization ID format
 * @param orgId - Organization ID to validate
 * @returns Validation result
 */
export function validateOrganizationId(orgId: string): { isValid: boolean; error?: string } {
  if (!orgId) {
    return { isValid: true }; // Organization ID is optional for some roles
  }

  if (orgId.length < 3 || orgId.length > 50) {
    return { isValid: false, error: 'معرف المنظمة غير صحيح' };
  }

  // Basic format validation
  const orgIdRegex = /^[a-zA-Z0-9_\-]+$/;
  if (!orgIdRegex.test(orgId)) {
    return { 
      isValid: false, 
      error: 'معرف المنظمة يجب أن يحتوي على أحرف وأرقام فقط' 
    };
  }

  return { isValid: true };
}

/**
 * Validate complete user data for creation/update
 * @param userData - User data to validate
 * @returns Validation result with all errors
 */
export function validateUserData(userData: {
  name: string;
  email: string;
  phone_number?: string;
  role_id: string;
  organization_id?: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate name
  const nameValidation = validateName(userData.name);
  if (!nameValidation.isValid && nameValidation.error) {
    errors.push(nameValidation.error);
  }

  // Validate email
  const emailValidation = validateEmail(userData.email);
  if (!emailValidation.isValid && emailValidation.error) {
    errors.push(emailValidation.error);
  }

  // Validate phone (optional)
  if (userData.phone_number) {
    const phoneValidation = validatePhoneNumber(userData.phone_number);
    if (!phoneValidation.isValid && phoneValidation.error) {
      errors.push(phoneValidation.error);
    }
  }

  // Validate role
  const roleValidation = validateRole(userData.role_id);
  if (!roleValidation.isValid && roleValidation.error) {
    errors.push(roleValidation.error);
  }

  // Validate organization ID (required for org_manager)
  if (userData.role_id === 'org_manager' && !userData.organization_id) {
    errors.push('معرف المنظمة مطلوب لمديري المنظمات');
  }

  if (userData.organization_id) {
    const orgValidation = validateOrganizationId(userData.organization_id);
    if (!orgValidation.isValid && orgValidation.error) {
      errors.push(orgValidation.error);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize user input to prevent XSS and injection attacks
 * @param input - Input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes that could break SQL
    .substring(0, 1000); // Limit length
}

/**
 * Validate and sanitize login request
 * @param body - Request body
 * @returns Validated and sanitized data
 */
export function validateLoginRequest(body: any): {
  isValid: boolean;
  data?: { email: string; password: string };
  errors?: string[];
} {
  const errors: string[] = [];

  if (!body.email) {
    errors.push('البريد الإلكتروني مطلوب');
  }

  if (!body.password) {
    errors.push('كلمة المرور مطلوبة');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  const emailValidation = validateEmail(body.email);
  if (!emailValidation.isValid && emailValidation.error) {
    errors.push(emailValidation.error);
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    data: {
      email: sanitizeInput(body.email).toLowerCase(),
      password: body.password // Don't sanitize password as it might contain special chars
    }
  };
}