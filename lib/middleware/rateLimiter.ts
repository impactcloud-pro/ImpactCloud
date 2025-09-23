import { supabase } from '../supabase';

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxAttempts: number;  // Maximum attempts per window
  blockDurationMs: number;  // How long to block after limit exceeded
}

interface RateLimitEntry {
  ip: string;
  email?: string;
  attempts: number;
  firstAttempt: Date;
  lastAttempt: Date;
  blockedUntil?: Date;
}

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Default rate limit configurations
 */
export const RATE_LIMIT_CONFIGS = {
  LOGIN: {
    windowMs: 15 * 60 * 1000,  // 15 minutes
    maxAttempts: 5,            // 5 attempts per window
    blockDurationMs: 30 * 60 * 1000  // Block for 30 minutes
  },
  PASSWORD_RESET: {
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxAttempts: 3,            // 3 attempts per hour
    blockDurationMs: 60 * 60 * 1000  // Block for 1 hour
  },
  API_GENERAL: {
    windowMs: 60 * 1000,       // 1 minute
    maxAttempts: 60,           // 60 requests per minute
    blockDurationMs: 5 * 60 * 1000   // Block for 5 minutes
  }
} as const;

/**
 * Extract client IP from request
 * @param request - HTTP request object
 * @returns IP address string
 */
function getClientIP(request: Request): string {
  const headers = [
    'x-forwarded-for',
    'x-real-ip',
    'x-client-ip',
    'cf-connecting-ip'
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      return value.split(',')[0].trim();
    }
  }

  return 'unknown';
}

/**
 * Generate rate limit key
 * @param ip - Client IP address
 * @param identifier - Additional identifier (email, user ID, etc.)
 * @returns Rate limit key
 */
function generateRateLimitKey(ip: string, identifier?: string): string {
  return identifier ? `${ip}:${identifier}` : ip;
}

/**
 * Check if request should be rate limited
 * @param key - Rate limit key
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
function checkRateLimit(key: string, config: RateLimitConfig): {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  blockedUntil?: Date;
} {
  const now = new Date();
  const entry = rateLimitStore.get(key);

  // If no entry exists, create one
  if (!entry) {
    rateLimitStore.set(key, {
      ip: key.split(':')[0],
      email: key.includes(':') ? key.split(':')[1] : undefined,
      attempts: 1,
      firstAttempt: now,
      lastAttempt: now
    });

    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetTime: new Date(now.getTime() + config.windowMs)
    };
  }

  // Check if currently blocked
  if (entry.blockedUntil && now < entry.blockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockedUntil,
      blockedUntil: entry.blockedUntil
    };
  }

  // Check if window has expired
  const windowExpired = now.getTime() - entry.firstAttempt.getTime() > config.windowMs;
  
  if (windowExpired) {
    // Reset the window
    entry.attempts = 1;
    entry.firstAttempt = now;
    entry.lastAttempt = now;
    entry.blockedUntil = undefined;

    rateLimitStore.set(key, entry);

    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetTime: new Date(now.getTime() + config.windowMs)
    };
  }

  // Increment attempts
  entry.attempts += 1;
  entry.lastAttempt = now;

  // Check if limit exceeded
  if (entry.attempts > config.maxAttempts) {
    entry.blockedUntil = new Date(now.getTime() + config.blockDurationMs);
    rateLimitStore.set(key, entry);

    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockedUntil,
      blockedUntil: entry.blockedUntil
    };
  }

  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: config.maxAttempts - entry.attempts,
    resetTime: new Date(entry.firstAttempt.getTime() + config.windowMs)
  };
}

/**
 * Rate limiter middleware for login attempts
 * @param request - HTTP request object
 * @param email - Email being used for login
 * @returns Rate limit response or null if allowed
 */
export async function rateLimitLogin(request: Request, email: string): Promise<Response | null> {
  try {
    const ip = getClientIP(request);
    const key = generateRateLimitKey(ip, email);
    const result = checkRateLimit(key, RATE_LIMIT_CONFIGS.LOGIN);

    if (!result.allowed) {
      // Log the rate limit violation
      await logRateLimitViolation(request, 'login', email, result.blockedUntil);

      const message = result.blockedUntil 
        ? `تم حظر المحاولات حتى ${result.blockedUntil.toLocaleString('ar-SA')}`
        : 'تم تجاوز الحد المسموح من المحاولات';

      return new Response(
        JSON.stringify({
          success: false,
          message,
          rateLimited: true,
          resetTime: result.resetTime.toISOString(),
          blockedUntil: result.blockedUntil?.toISOString()
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': RATE_LIMIT_CONFIGS.LOGIN.maxAttempts.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime.toISOString(),
            'Retry-After': Math.ceil((result.resetTime.getTime() - Date.now()) / 1000).toString()
          }
        }
      );
    }

    return null; // Allow request to continue
  } catch (error) {
    console.error('Rate limiter error:', error);
    return null; // Allow request to continue on error
  }
}

/**
 * Rate limiter middleware for password reset attempts
 * @param request - HTTP request object
 * @param email - Email being used for password reset
 * @returns Rate limit response or null if allowed
 */
export async function rateLimitPasswordReset(request: Request, email: string): Promise<Response | null> {
  try {
    const ip = getClientIP(request);
    const key = generateRateLimitKey(ip, `reset:${email}`);
    const result = checkRateLimit(key, RATE_LIMIT_CONFIGS.PASSWORD_RESET);

    if (!result.allowed) {
      await logRateLimitViolation(request, 'password_reset', email, result.blockedUntil);

      return new Response(
        JSON.stringify({
          success: false,
          message: 'تم تجاوز الحد المسموح لطلبات إعادة تعيين كلمة المرور',
          rateLimited: true,
          resetTime: result.resetTime.toISOString()
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': RATE_LIMIT_CONFIGS.PASSWORD_RESET.maxAttempts.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime.toISOString()
          }
        }
      );
    }

    return null;
  } catch (error) {
    console.error('Password reset rate limiter error:', error);
    return null;
  }
}

/**
 * General API rate limiter
 * @param request - HTTP request object
 * @returns Rate limit response or null if allowed
 */
export async function rateLimitAPI(request: Request): Promise<Response | null> {
  try {
    const ip = getClientIP(request);
    const key = generateRateLimitKey(ip, 'api');
    const result = checkRateLimit(key, RATE_LIMIT_CONFIGS.API_GENERAL);

    if (!result.allowed) {
      await logRateLimitViolation(request, 'api_general', ip, result.blockedUntil);

      return new Response(
        JSON.stringify({
          success: false,
          message: 'تم تجاوز الحد المسموح للطلبات',
          rateLimited: true,
          resetTime: result.resetTime.toISOString()
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': RATE_LIMIT_CONFIGS.API_GENERAL.maxAttempts.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime.toISOString()
          }
        }
      );
    }

    return null;
  } catch (error) {
    console.error('API rate limiter error:', error);
    return null;
  }
}

/**
 * Log rate limit violations
 * @param request - HTTP request object
 * @param type - Type of rate limit violation
 * @param identifier - Identifier (email, IP, etc.)
 * @param blockedUntil - When the block expires
 */
async function logRateLimitViolation(
  request: Request,
  type: string,
  identifier: string,
  blockedUntil?: Date
): Promise<void> {
  try {
    const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const ipAddress = getClientIP(request);
    const userAgent = getUserAgent(request);

    const details = blockedUntil
      ? `تم حظر ${identifier} بسبب تجاوز الحد المسموح. الحظر حتى: ${blockedUntil.toISOString()}`
      : `تم تجاوز الحد المسموح للطلبات من ${identifier}`;

    // Log to activity table
    await supabase
      .from('Activity_log')
      .insert({
        Log_id: logId,
        Action: `انتهاك حد المعدل - ${type}`,
        Details: details,
        IP_address: ipAddress,
        User_agent: userAgent,
        Timestamp: new Date().toISOString()
      });
  } catch (error) {
    console.error('Error logging rate limit violation:', error);
  }
}

/**
 * Clean up expired rate limit entries (call periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = new Date();
  
  for (const [key, entry] of rateLimitStore.entries()) {
    // Remove entries that are no longer blocked and outside their window
    const windowExpired = now.getTime() - entry.firstAttempt.getTime() > 60 * 60 * 1000; // 1 hour
    const blockExpired = !entry.blockedUntil || now > entry.blockedUntil;
    
    if (windowExpired && blockExpired) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Get current rate limit status for debugging
 * @param ip - Client IP
 * @param identifier - Additional identifier
 * @returns Current rate limit status
 */
export function getRateLimitStatus(ip: string, identifier?: string): RateLimitEntry | null {
  const key = generateRateLimitKey(ip, identifier);
  return rateLimitStore.get(key) || null;
}