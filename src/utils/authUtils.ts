import type { User, DemoAccount } from '../constants/types';
import { getCurrentUserProfile } from '../services/authService';

export const authenticateUser = async (loginInput: string, password: string): Promise<User | null> => {
  try {
    const profileData = await getCurrentUserProfile();
    
    if (profileData?.user && profileData?.profile) {
      return {
        email: profileData.user.email!,
        name: profileData.profile.name,
        role: profileData.profile.role_id,
        organization: profileData.profile.organizations?.name
      };
    }
    
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

export const getDefaultPageForRole = (role: string): string => {
  return role === 'beneficiary' ? 'enhanced-survey' : 'dashboard';
};