import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { EnhancedPageLayout } from './EnhancedPageLayout';
import { PermissionsDialog } from './shared/PermissionsDialog';
import { AddUserDialog } from './shared/AddUserDialog';
import { PaymentMethodsDialog } from './shared/PaymentMethodsDialog';
import { BankDetailsDialog } from './shared/BankDetailsDialog';
import { GeneralSettingsTab } from './settings/GeneralSettingsTab';
import { BillingSettingsTab } from './settings/BillingSettingsTab';
import { SecuritySettingsTab } from './settings/SecuritySettingsTab';
import { NotificationsSettingsTab } from './settings/NotificationsSettingsTab';
import { IntegrationsSettingsTab } from './settings/IntegrationsSettingsTab';
import { AdvancedSettingsTab } from './settings/AdvancedSettingsTab';
import { useSettingsState } from '../hooks/useSettingsState';
import { useSettingsHandlers } from '../hooks/useSettingsHandlers';
import { 
  Settings, Shield, Mail, Bell, Key, Users, CreditCard, CheckCircle,
  Download, Save, Edit, Trash2, UserCheck, AlertCircle, Link, Cog,
  UserCog, UserPlus, RefreshCw, Info
} from 'lucide-react';
import { toast } from 'sonner';

// Import utilities
import { systemRoles, organizationOptions, type User, type Role, type EditUserFormData } from '../constants/settingsConstants';
import { getUserStatusColor, getUserStatusLabel, getRoleDisplayName } from '../utils/settingsUtils';

type UserRole = 'super_admin' | 'admin' | 'org_manager' | 'beneficiary';

interface AdminSettingsPageProps {
  userRole: UserRole;
}

export function AdminSettingsPage({ userRole }: AdminSettingsPageProps) {
  const state = useSettingsState();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [isIntegrationSettingsOpen, setIsIntegrationSettingsOpen] = useState(false);
  const [editUserForm, setEditUserForm] = useState<EditUserFormData>({
    name: '', email: '', phone: '', role: 'beneficiary', organization: ''
  });
  const [isEditUserLoading, setIsEditUserLoading] = useState(false);

  const isAdminWithReadOnlyPermissions = userRole === 'admin';

  const handlers = useSettingsHandlers({
    ...state,
    isAdminWithReadOnlyPermissions,
    selectedRole
  });

  const handleEditUser = (userId: string) => {
    const user = state.users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setEditUserForm({
        name: user.name, email: user.email, phone: user.phone || '',
        role: user.role, organization: user.organization || ''
      });
      state.setIsEditUserDialogOpen(true);
    }
  };

  const handleSaveUserEdit = async () => {
    if (!selectedUser) return;
    if (!editUserForm.name.trim()) { toast.error('يرجى إدخال الاسم'); return; }
    if (!editUserForm.email.trim()) { toast.error('يرجى إدخال البريد الإلكتروني'); return; }
    if (!/\S+@\S+\.\S+/.test(editUserForm.email)) { toast.error('يرجى إدخال بريد إلكتروني صالح'); return; }

    setIsEditUserLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      state.setUsers(prev => prev.map(user => 
        user.id === selectedUser.id ? { 
          ...user, name: editUserForm.name, email: editUserForm.email,
          phone: editUserForm.phone, role: editUserForm.role, organization: editUserForm.organization
        } : user
      ));
      state.setIsEditUserDialogOpen(false);
      toast.success('تم تحديث بيانات المستخدم بنجاح');
    } catch (error) {
      toast.error('حدث خطأ في تحديث بيانات المستخدم');
    } finally {
      setIsEditUserLoading(false);
    }
  };

  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role);
    state.setIsPermissionsDialogOpen(true);
  };

  const handleIntegrationSettings = (integration: any) => {
    setSelectedIntegration(integration);
    setIsIntegrationSettingsOpen(true);
  };

  const handleToggleIntegration = (integrationId: string) => {
    state.setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? {
            ...integration,
            status: integration.status === 'connected' ? 'disconnected' : 'connected'
          }
        : integration
    ));
    toast.success('تم تحديث حالة التكامل');
  };

  const sections = [
    { id: 'general', label: 'إعدادات عامة', icon: Settings },
    { id: 'security', label: 'الأمان', icon: Shield },
    { id: 'billing', label: 'الاشتراكات والفواتير', icon: CreditCard },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'integrations', label: 'التكامل', icon: Link },
    { id: 'advanced', label: 'إعدادات متقدمة', icon: Cog }
  ];

  const headerStats = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{state.users.length}</div>
            <div className="text-blue-200">مستخدم مسجل</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-white" />
          <div>
            <div className="text-lg font-bold text-white">آمن</div>
            <div className="text-blue-200">حالة الأمان</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Link className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{state.integrations.filter(i => i.status === 'connected').length}</div>
            <div className="text-blue-200">تكامل نشط</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-white" />
          <div>
            <div className="text-lg font-bold text-white">
              {state.lastSaved ? state.lastSaved.toLocaleTimeString('ar-SA') : 'غير محفوظ'}
            </div>
            <div className="text-blue-200">آخر حفظ</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <EnhancedPageLayout
      pageId="admin-settings"
      userRole={userRole}
      description="إدارة شاملة لإعدادات النظام والمستخدمين والأمان والتكامل"
      icon={<Settings className="h-8 w-8" />}
      headerContent={headerStats}
    >
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button onClick={handlers.handleSaveSettings} disabled={state.isSaving} className="bg-[#183259] hover:bg-[#2a4a7a]" size="lg">
              <Save className={`h-4 w-4 mr-2 ${state.isSaving ? 'animate-spin' : ''}`} />
              {state.isSaving ? 'جاري الحفظ...' : 'حفظ جميع الإعدادات'}
            </Button>
            <Button variant="outline" size="lg" onClick={handlers.handleExportSettings}>
              <Download className="h-4 w-4 mr-2" />تصدير الإعدادات (Excel)
            </Button>
          </div>
          {state.lastSaved && (
            <Badge variant="secondary" className="text-xs">
              آخر حفظ: {state.lastSaved.toLocaleString('ar-SA')}
            </Badge>
          )}
        </div>

        {/* Hidden file input */}
        <input ref={handlers.fileInputRef} type="file" accept="image/*" onChange={handlers.handleFileChange} style={{ display: 'none' }} />

        {/* Settings Tabs */}
        <Tabs value={state.activeTab} onValueChange={state.setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            {sections.map((section) => (
              <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2 text-xs">
                <section.icon className="h-4 w-4" />
                <span className="hidden lg:inline">{section.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <GeneralSettingsTab
              generalSettings={state.generalSettings}
              setGeneralSettings={state.setGeneralSettings}
              onFileUpload={handlers.handleFileUpload}
            />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecuritySettingsTab
              securitySettings={state.securitySettings}
              setSecuritySettings={state.setSecuritySettings}
            />
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <BillingSettingsTab
              paymentMethods={state.paymentMethods}
              bankDetailsState={state.bankDetailsState}
              billingSettings={state.billingSettings}
              setBillingSettings={state.setBillingSettings}
              onManagePaymentMethods={handlers.handleManagePaymentMethods}
              onManageBankDetails={handlers.handleManageBankDetails}
            />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationsSettingsTab
              notificationSettings={state.notificationSettings}
              setNotificationSettings={state.setNotificationSettings}
              userRole={userRole}
            />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <IntegrationsSettingsTab
              integrationSettings={state.integrationSettings}
              setIntegrationSettings={state.setIntegrationSettings}
              integrations={state.integrations}
              setIntegrations={state.setIntegrations}
              userRole={userRole}
              onIntegrationSettings={handleIntegrationSettings}
              onToggleIntegration={handleToggleIntegration}
            />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <AdvancedSettingsTab
              advancedSettings={state.advancedSettings}
              setAdvancedSettings={state.setAdvancedSettings}
              userRole={userRole}
            />
          </TabsContent>
        </Tabs>

        {/* All Dialogs */}
        <AddUserDialog
          isOpen={state.isAddUserDialogOpen}
          onClose={() => state.setIsAddUserDialogOpen(false)}
          onUserAdded={handlers.handleUserAdded}
        />

        <PaymentMethodsDialog
          isOpen={state.isPaymentMethodsDialogOpen}
          onClose={() => state.setIsPaymentMethodsDialogOpen(false)}
          paymentMethods={state.paymentMethods}
          onPaymentMethodsUpdated={handlers.handlePaymentMethodsUpdated}
        />

        <BankDetailsDialog
          isOpen={state.isBankDetailsDialogOpen}
          onClose={() => state.setIsBankDetailsDialogOpen(false)}
          bankDetails={state.bankDetailsState}
          onBankDetailsUpdated={handlers.handleBankDetailsUpdated}
        />

        <PermissionsDialog
          isOpen={state.isPermissionsDialogOpen}
          onClose={() => state.setIsPermissionsDialogOpen(false)}
          selectedRole={selectedRole}
          rolePermissions={state.rolePermissions}
          onPermissionChange={handlers.handlePermissionChange}
          onSavePermissions={handlers.handleSavePermissions}
          userRole={userRole}
        />

        {/* Edit User Dialog */}
        <Dialog open={state.isEditUserDialogOpen} onOpenChange={state.setIsEditUserDialogOpen}>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle>تعديل المستخدم</DialogTitle>
              <DialogDescription>تعديل بيانات المستخدم: {selectedUser?.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">الاسم الكامل *</Label>
                <Input id="edit-name" value={editUserForm.name}
                  onChange={(e) => setEditUserForm(prev => ({ ...prev, name: e.target.value }))}
                  disabled={isEditUserLoading} />
              </div>
              <div>
                <Label htmlFor="edit-email">البريد الإلكتروني *</Label>
                <Input id="edit-email" type="email" value={editUserForm.email}
                  onChange={(e) => setEditUserForm(prev => ({ ...prev, email: e.target.value }))}
                  disabled={isEditUserLoading} />
              </div>
              <div>
                <Label htmlFor="edit-phone">رقم الهاتف</Label>
                <Input id="edit-phone" type="tel" value={editUserForm.phone}
                  onChange={(e) => setEditUserForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+966xxxxxxxxx" disabled={isEditUserLoading} />
              </div>
              <div>
                <Label htmlFor="edit-role">الدور</Label>
                <Select value={editUserForm.role} onValueChange={(value: UserRole) => setEditUserForm(prev => ({ ...prev, role: value }))}
                  disabled={isEditUserLoading}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {systemRoles.map((role) => (
                      <SelectItem key={role.name} value={role.name}>
                        {role.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-organization">المنظمة</Label>
                <Select value={editUserForm.organization} onValueChange={(value) => setEditUserForm(prev => ({ ...prev, organization: value }))}
                  disabled={isEditUserLoading}>
                  <SelectTrigger><SelectValue placeholder="اختر المنظمة" /></SelectTrigger>
                  <SelectContent>
                    {organizationOptions.map((org) => (
                      <SelectItem key={org} value={org}>{org}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => state.setIsEditUserDialogOpen(false)} disabled={isEditUserLoading}>
                إلغاء
              </Button>
              <Button onClick={handleSaveUserEdit} className="bg-[#183259] hover:bg-[#2a4a7a]" disabled={isEditUserLoading}>
                {isEditUserLoading ? (<><RefreshCw className="h-4 w-4 mr-2 animate-spin" />جاري الحفظ...</>) : 
                (<><Save className="h-4 w-4 mr-2" />حفظ التعديلات</>)}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Security Alert */}
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>تنبيه أمني:</strong> يُنصح بحفظ نسخة احتياطية من الإعدادات قبل إجراء أي تغييرات مهمة. 
            تأكد من أن كلمات المرور ومفاتيح API قوية ومحدثة بانتظام.
          </AlertDescription>
        </Alert>
      </div>
    </EnhancedPageLayout>
  );
}