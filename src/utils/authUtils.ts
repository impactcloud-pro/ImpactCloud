import { demoAccounts } from '../constants/demoData';
import type { User, DemoAccount } from '../constants/types';

export const authenticateUser = (loginInput: string, password: string): User | null => {
  const account = demoAccounts.find(acc => 
    (acc.email === loginInput || acc.username === loginInput) && acc.password === password
  );
  
  if (account) {
    return {
      email: account.email,
      name: account.name,
      role: account.role,
      organization: account.organization
    };
  }
  
  return null;
};

export const getDefaultPageForRole = (role: string): string => {
  return role === 'beneficiary' ? 'enhanced-survey' : 'dashboard';
};