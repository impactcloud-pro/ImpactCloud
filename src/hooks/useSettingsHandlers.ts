import { useRef } from 'react';
import { toast } from 'sonner';
import { exportSettingsToExcel } from '../utils/settingsUtils';
import type { User, Role, PaymentMethod, BankDetails, EditUserFormData, Integration } from '../constants/settingsConstants';

interface UseSettingsHandlersProps {
  setIsSaving: (value: boolean) => void;
  setLastSaved: (value: Date | null) => void;
  setGeneralSettings: (updater: (prev: any) => any) => void;
  setUsers: (updater: (prev: User[]) => User[]) => void;
  setPaymentMethods: (methods: PaymentMethod[]) => void;
  setBankDetailsState: (details: BankDetails) => void;
  setIntegrations: (updater: (prev: Integration[]) => Integration[]) => void;
  setRolePermissions: (updater: (prev: Record<string, string[]>) => Record<string, string[]>) => void;
  setIsAddUserDialogOpen: (value: boolean) => void;
  setIsPermissionsDialogOpen: (value: boolean) => void;
  setIsPaymentMethodsDialogOpen: (value: boolean) => void;
  setIsBankDetailsDialogOpen: (value: boolean) => void;
  generalSettings: any;
  securitySettings: any;
  notificationSettings: any;
  billingSettings: any;
  integrationSettings: any;
  advancedSettings: any;
  users: User[];
  rolePermissions: Record<string, string[]>;
  isAdminWithReadOnlyPermissions: boolean;
  selectedRole: Role | null;
}

export function useSettingsHandlers({
  setIsSaving,
  setLastSaved,
  setGeneralSettings,
  setUsers,
  setPaymentMethods,
  setBankDetailsState,
  setIntegrations,
  setRolePermissions,
  setIsAddUserDialogOpen,
  setIsPermissionsDialogOpen,
  setIsPaymentMethodsDialogOpen,
  setIsBankDetailsDialogOpen,
  generalSettings,
  securitySettings,
  notificationSettings,
  billingSettings,
  integrationSettings,
  advancedSettings,
  users,
  rolePermissions,
  isAdminWithReadOnlyPermissions,
  selectedRole
}: UseSettingsHandlersProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLastSaved(new Date());
      toast.success('تم حفظ إعدادات النظام بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ في حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setGeneralSettings(prev => ({ ...prev, logo: e.target?.result as string }));
          toast.success('تم رفع الشعار بنجاح');
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('يرجى اختيار ملف صورة صالح');
      }
    }
  };

  const handleExportSettings = () => {
    const settingsData = {
      'إعدادات عامة': generalSettings,
      'إعدادات الأمان': securitySettings,
      'إعدادات الإشعارات': notificationSettings,
      'إعدادات الفواتير': billingSettings,
      'إعدادات التكامل': integrationSettings,
      'إعدادات متقدمة': advancedSettings,
      'المستخدمون': users,
      'الصلاحيات': rolePermissions
    };
    exportSettingsToExcel(settingsData);
  };

  // User Management Functions
  const handleAddUser = () => {
    setIsAddUserDialogOpen(true);
  };

  const handleUserAdded = (newUser: User) => {
    setUsers(prev => [newUser, ...prev]);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast.success('تم حذف المستخدم بنجاح');
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
        : user
    ));
    toast.success('تم تحديث حالة المستخدم');
  };

  // Permissions Management
  const handlePermissionChange = (permissionId: string, enabled: boolean) => {
    if (!selectedRole || isAdminWithReadOnlyPermissions) return;
    setRolePermissions(prev => {
      const currentPermissions = prev[selectedRole.name] || [];
      const newPermissions = enabled 
        ? [...currentPermissions, permissionId]
        : currentPermissions.filter(p => p !== permissionId);
      return { ...prev, [selectedRole.name]: newPermissions };
    });
  };

  const handleSavePermissions = () => {
    if (isAdminWithReadOnlyPermissions) {
      toast.warning('مدير أثرنا لا يمكنه تعديل الصلاحيات');
      return;
    }
    setIsPermissionsDialogOpen(false);
    toast.success('تم حفظ الصلاحيات بنجاح');
  };

  // Payment Methods Management
  const handleManagePaymentMethods = () => {
    setIsPaymentMethodsDialogOpen(true);
  };

  const handlePaymentMethodsUpdated = (methods: PaymentMethod[]) => {
    setPaymentMethods(methods);
  };

  // Bank Details Management
  const handleManageBankDetails = () => {
    setIsBankDetailsDialogOpen(true);
  };

  const handleBankDetailsUpdated = (details: BankDetails) => {
    setBankDetailsState(details);
  };

  // Integration Management
  const handleIntegrationSettings = (integration: Integration) => {
    // Handle integration settings dialog
    toast.info(`إعدادات التكامل: ${integration.name}`);
  };

  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? {
            ...integration,
            status: integration.status === 'connected' ? 'disconnected' : 'connected'
          }
        : integration
    ));
    toast.success('تم تحديث حالة التكامل');
  };

  return {
    fileInputRef,
    handleSaveSettings,
    handleFileUpload,
    handleFileChange,
    handleExportSettings,
    handleAddUser,
    handleUserAdded,
    handleDeleteUser,
    handleToggleUserStatus,
    handlePermissionChange,
    handleSavePermissions,
    handleManagePaymentMethods,
    handlePaymentMethodsUpdated,
    handleManageBankDetails,
    handleBankDetailsUpdated,
    handleIntegrationSettings,
    handleToggleIntegration
  };
}