import jwt from 'jsonwebtoken';
import type { JWTPayload } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '30m'; // 30 minutes session timeout

/**
 * Sign a JWT token with user data
 * @param payload - User data to encode in token
 * @returns Signed JWT token
 */
export function signJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  try {
    const tokenPayload: JWTPayload = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (30 * 60) // 30 minutes
    };

    return jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      algorithm: 'HS256'
    });
  } catch (error) {
    console.error('Error signing JWT:', error);
    throw new Error('Failed to create authentication token');
  }
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export function verifyJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256']
    }) as JWTPayload;

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      return null;
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.log('Invalid JWT token:', error.message);
    } else if (error instanceof jwt.TokenExpiredError) {
      console.log('JWT token expired:', error.message);
    } else {
      console.error('JWT verification error:', error);
    }
    return null;
  }
}

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
}

/**
 * Generate a secure random token for password reset
 * @param length - Token length (default: 32)
 * @returns Random token string
 */
export function generateResetToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Check if JWT token is about to expire (within 5 minutes)
 * @param token - JWT token to check
 * @returns Boolean indicating if token needs refresh
 */
export function isTokenNearExpiry(token: string): boolean {
  try {
    const decoded = verifyJWT(token);
    if (!decoded) return true;

    const now = Math.floor(Date.now() / 1000);
    const fiveMinutes = 5 * 60;
    
    return (decoded.exp - now) < fiveMinutes;
  } catch (error) {
    return true;
  }
}

/**
 * Refresh JWT token with new expiration
 * @param oldToken - Current JWT token
 * @returns New JWT token or null if invalid
 */
export function refreshJWT(oldToken: string): string | null {
  try {
    const decoded = verifyJWT(oldToken);
    if (!decoded) return null;

    // Create new token with same payload but new expiration
    const newPayload = {
      user_id: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
      organization_id: decoded.organization_id
    };

    return signJWT(newPayload);
  } catch (error) {
    console.error('Error refreshing JWT:', error);
    return null;
  }
}