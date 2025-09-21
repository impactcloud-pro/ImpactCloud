import { useState } from 'react';
import { 
  demoUsers, 
  availablePaymentMethods, 
  bankDetails, 
  demoIntegrations,
  type User, 
  type PaymentMethod, 
  type BankDetails, 
  type Integration 
} from '../constants/settingsConstants';

export function useSettingsState() {
  // Core state
  const [activeTab, setActiveTab] = useState('general');
  const [users, setUsers] = useState<User[]>(demoUsers);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(availablePaymentMethods);
  const [bankDetailsState, setBankDetailsState] = useState<BankDetails>(bankDetails);
  const [integrations, setIntegrations] = useState<Integration[]>(demoIntegrations);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Dialog states
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isPaymentMethodsDialogOpen, setIsPaymentMethodsDialogOpen] = useState(false);
  const [isBankDetailsDialogOpen, setIsBankDetailsDialogOpen] = useState(false);

  // Settings state
  const [generalSettings, setGeneralSettings] = useState({
    organizationName: 'أثرنا - منصة قياس الأثر الاجتماعي',
    logo: '', primaryColor: '#183259', secondaryColor: '#2a4a7a',
    fontFamily: 'Cairo', defaultLanguage: 'ar', timeZone: 'Asia/Riyadh',
    dateFormat: 'DD/MM/YYYY', timeFormat: '24h'
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8, requireUppercase: true, requireNumbers: true,
    requireSpecialChars: false, sessionTimeout: 30, maxLoginAttempts: 5,
    twoFactorAuth: false, ipWhitelist: '', dataEncryption: true,
    autoBackup: true, backupFrequency: 'daily', auditLogs: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true, inAppNotifications: true, systemAlerts: true,
    billingAlerts: true, activityAlerts: false, adminEmail: 'admin@atharonaa.com',
    notificationFrequency: 'real-time'
  });

  const [billingSettings, setBillingSettings] = useState({
    billingEmail: 'billing@atharonaa.com', currency: 'SAR',
    taxRate: 15, invoicePrefix: 'INV-'
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    llmProvider: 'openai', llmModel: 'gpt-4', llmApiKey: '••••••••••••••••••••••••••••••••',
    apiAccessEnabled: true, webhooksEnabled: true, rateLimitPerHour: 1000, maxTokens: 2000
  });

  const [advancedSettings, setAdvancedSettings] = useState({
    maintenanceMode: false, debugMode: false, logLevel: 'info',
    cacheEnabled: true, performanceMonitoring: true, errorReporting: true,
    backupRetention: 30, environment: 'production'
  });

  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({
    'super_admin': ['all'],
    'admin': ['manage_surveys', 'manage_users', 'view_analytics', 'manage_billing'],
    'org_manager': ['create_surveys', 'view_own_analytics', 'manage_org_users'],
    'beneficiary': ['take_surveys']
  });

  return {
    // Core state
    activeTab, setActiveTab,
    users, setUsers,
    paymentMethods, setPaymentMethods,
    bankDetailsState, setBankDetailsState,
    integrations, setIntegrations,
    isSaving, setIsSaving,
    lastSaved, setLastSaved,

    // Dialog states
    isPermissionsDialogOpen, setIsPermissionsDialogOpen,
    isEditUserDialogOpen, setIsEditUserDialogOpen,
    isAddUserDialogOpen, setIsAddUserDialogOpen,
    isPaymentMethodsDialogOpen, setIsPaymentMethodsDialogOpen,
    isBankDetailsDialogOpen, setIsBankDetailsDialogOpen,

    // Settings state
    generalSettings, setGeneralSettings,
    securitySettings, setSecuritySettings,
    notificationSettings, setNotificationSettings,
    billingSettings, setBillingSettings,
    integrationSettings, setIntegrationSettings,
    advancedSettings, setAdvancedSettings,
    rolePermissions, setRolePermissions
  };
}