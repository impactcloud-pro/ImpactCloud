import { demoAccounts } from '../constants/demoData';
import type { User, DemoAccount } from '../constants/types';

export const authenticateUser = (loginInput: string, password: string): User | null => {
  // Authentication will be handled by Supabase
  // This is a placeholder for demo authentication
  return null;
};

export const getDefaultPageForRole = (role: string): string => {
  return role === 'beneficiary' ? 'enhanced-survey' : 'dashboard';
};