import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Shield, Info, Lock, Eye } from 'lucide-react';
import { Role } from '../../constants/settingsConstants';
import { getPermissionsByCategory } from '../../utils/settingsUtils';
import { toast } from 'sonner@2.0.3';

interface PermissionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole: Role | null;
  rolePermissions: Record<string, string[]>;
  onPermissionChange: (permissionId: string, enabled: boolean) => void;
  onSavePermissions: () => void;
  isReadOnly?: boolean;
  userRole?: 'super_admin' | 'admin' | 'org_manager' | 'beneficiary';
}

export function PermissionsDialog({
  isOpen,
  onClose,
  selectedRole,
  rolePermissions,
  onPermissionChange,
  onSavePermissions,
  isReadOnly = false,
  userRole = 'super_admin'
}: PermissionsDialogProps) {
  const isAdminUser = userRole === 'admin';
  const isSuperAdmin = userRole === 'super_admin';

  const isPermissionEnabled = (permissionId: string) => {
    if (!selectedRole) return false;
    const permissions = rolePermissions[selectedRole.name] || [];
    return permissions.includes('all') || permissions.includes(permissionId);
  };

  // Define what Admin can edit based on the role they're managing
  const canAdminEditRole = (roleName: string) => {
    if (isSuperAdmin) return true;
    if (!isAdminUser) return false;
    
    // Admin can only edit org_manager and beneficiary roles
    return roleName === 'org_manager' || roleName === 'beneficiary';
  };

  const canAdminEditPermission = (permissionId: string, roleName: string) => {
    if (isSuperAdmin) return true;
    if (!isAdminUser || !canAdminEditRole(roleName)) return false;

    // Admin can edit most permissions for org_manager and beneficiary
    // but cannot edit system-level permissions
    const restrictedPermissions = [
      'system_settings',
      'manage_organizations', 
      'view_activity_logs',
      'manage_billing',
      'content_management'
    ];
    
    return !restrictedPermissions.includes(permissionId);
  };

  const handlePermissionChange = (permissionId: string, enabled: boolean) => {
    if (!selectedRole) return;

    if (isReadOnly) {
      toast.warning('هذا الدور في وضع العرض فقط');
      return;
    }

    if (!canAdminEditPermission(permissionId, selectedRole.name)) {
      toast.warning('ليس لديك صلاحية لتعديل هذه الوظيفة');
      return;
    }

    onPermissionChange(permissionId, enabled);
    
    // Immediate save for better UX
    setTimeout(() => {
      toast.success(`تم ${enabled ? 'إضافة' : 'إزالة'} الصلاحية بنجاح`);
    }, 100);
  };

  const handleSave = () => {
    if (!canAdminEditRole(selectedRole?.name || '')) {
      toast.warning('ليس لديك صلاحية لتعديل هذا الدور');
      return;
    }
    onSavePermissions();
  };

  const getPermissionBadge = (permissionId: string, roleName: string) => {
    if (isSuperAdmin) return null;
    
    if (!canAdminEditRole(roleName)) {
      return <Badge variant="outline" className="text-xs bg-red-50 text-red-600">عرض فقط</Badge>;
    }
    
    if (!canAdminEditPermission(permissionId, roleName)) {
      return <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600">محدود</Badge>;
    }
    
    return null;
  };

  const getRoleDescription = (roleName: string) => {
    switch (roleName) {
      case 'super_admin':
        return 'يملك جميع الصلاحيات في النظام ولا يمكن تعديل صلاحياته';
      case 'admin':
        return 'مدير أثرنا - صلاحيات محددة مسبقاً';
      case 'org_manager':
        return 'مدير المنظمة - يمكن تخصيص صلاحياته حسب احتياجات المنظمة';
      case 'beneficiary':
        return 'المستفيد - صلاحيات أساسية للمشاركة في الاستبيانات';
      default:
        return '';
    }
  };

  const shouldShowCategory = (category: string, roleName: string) => {
    if (isSuperAdmin) return true;
    if (!isAdminUser) return true;

    // Admin can see all categories but with limited editing
    return true;
  };

  if (!selectedRole) return null;

  const isRoleReadOnly = !canAdminEditRole(selectedRole.name);
  const effectiveReadOnly = isReadOnly || isRoleReadOnly;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {effectiveReadOnly ? (
              <Eye className="h-5 w-5" />
            ) : (
              <Shield className="h-5 w-5" />
            )}
            {effectiveReadOnly ? 'عرض صلاحيات' : 'إدارة صلاحيات'}: {selectedRole.displayName}
          </DialogTitle>
          <DialogDescription>
            {getRoleDescription(selectedRole.name)}
          </DialogDescription>
        </DialogHeader>
        
        {isAdminUser && (
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>ملاحظة للمدير:</strong> يمكنك تعديل صلاحيات مديري المنظمات والمستفيدين فقط. 
              بعض الصلاحيات الحساسة محدودة لمدير النظام الرئيسي.
            </AlertDescription>
          </Alert>
        )}

        {selectedRole.name === 'super_admin' && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              مدير النظام الرئيسي لديه صلاحية الوصول إلى جميع وظائف النظام تلقائياً ولا يمكن تعديل صلاحياته.
            </AlertDescription>
          </Alert>
        )}

        {selectedRole.name === 'admin' && isAdminUser && (
          <Alert className="border-amber-200 bg-amber-50">
            <Lock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              لا يمكن للمدير تعديل صلاحيات المديرين الآخرين. هذه الصلاحيات محددة من قبل مدير النظام الرئيسي.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-6">
          {/* Dashboard Permissions */}
          {shouldShowCategory('dashboard', selectedRole.name) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">لوحة التحكم</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getPermissionsByCategory('dashboard').map((permission) => {
                    const badge = getPermissionBadge(permission.id, selectedRole.name);
                    const canEdit = canAdminEditPermission(permission.id, selectedRole.name);
                    const isDisabled = selectedRole.name === 'super_admin' || effectiveReadOnly || !canEdit;
                    
                    return (
                      <div key={permission.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={permission.id}>{permission.displayName}</Label>
                          {badge}
                        </div>
                        <Checkbox
                          id={permission.id}
                          checked={isPermissionEnabled(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                          disabled={isDisabled}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Survey Permissions */}
          {shouldShowCategory('surveys', selectedRole.name) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">الاستبيانات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getPermissionsByCategory('surveys').map((permission) => {
                    const badge = getPermissionBadge(permission.id, selectedRole.name);
                    const canEdit = canAdminEditPermission(permission.id, selectedRole.name);
                    const isDisabled = selectedRole.name === 'super_admin' || effectiveReadOnly || !canEdit;
                    
                    return (
                      <div key={permission.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={permission.id}>{permission.displayName}</Label>
                          {badge}
                        </div>
                        <Checkbox
                          id={permission.id}
                          checked={isPermissionEnabled(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                          disabled={isDisabled}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* User Management Permissions */}
          {shouldShowCategory('users', selectedRole.name) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">إدارة المستخدمين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getPermissionsByCategory('users').map((permission) => {
                    const badge = getPermissionBadge(permission.id, selectedRole.name);
                    const canEdit = canAdminEditPermission(permission.id, selectedRole.name);
                    const isDisabled = selectedRole.name === 'super_admin' || effectiveReadOnly || !canEdit;
                    
                    return (
                      <div key={permission.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={permission.id}>{permission.displayName}</Label>
                          {badge}
                        </div>
                        <Checkbox
                          id={permission.id}
                          checked={isPermissionEnabled(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                          disabled={isDisabled}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analytics Permissions */}
          {shouldShowCategory('analytics', selectedRole.name) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">التحليلات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getPermissionsByCategory('analytics').map((permission) => {
                    const badge = getPermissionBadge(permission.id, selectedRole.name);
                    const canEdit = canAdminEditPermission(permission.id, selectedRole.name);
                    const isDisabled = selectedRole.name === 'super_admin' || effectiveReadOnly || !canEdit;
                    
                    return (
                      <div key={permission.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={permission.id}>{permission.displayName}</Label>
                          {badge}
                        </div>
                        <Checkbox
                          id={permission.id}
                          checked={isPermissionEnabled(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                          disabled={isDisabled}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Billing Permissions */}
          {shouldShowCategory('billing', selectedRole.name) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">الفواتير</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getPermissionsByCategory('billing').map((permission) => {
                    const badge = getPermissionBadge(permission.id, selectedRole.name);
                    const canEdit = canAdminEditPermission(permission.id, selectedRole.name);
                    const isDisabled = selectedRole.name === 'super_admin' || effectiveReadOnly || !canEdit;
                    
                    return (
                      <div key={permission.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={permission.id}>{permission.displayName}</Label>
                          {badge}
                        </div>
                        <Checkbox
                          id={permission.id}
                          checked={isPermissionEnabled(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                          disabled={isDisabled}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* System Permissions */}
          {shouldShowCategory('system', selectedRole.name) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">النظام</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getPermissionsByCategory('system').map((permission) => {
                    const badge = getPermissionBadge(permission.id, selectedRole.name);
                    const canEdit = canAdminEditPermission(permission.id, selectedRole.name);
                    const isDisabled = selectedRole.name === 'super_admin' || effectiveReadOnly || !canEdit;
                    
                    return (
                      <div key={permission.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={permission.id}>{permission.displayName}</Label>
                          {badge}
                        </div>
                        <Checkbox
                          id={permission.id}
                          checked={isPermissionEnabled(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                          disabled={isDisabled}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {effectiveReadOnly ? 'إغلاق' : 'إلغاء'}
          </Button>
          {!effectiveReadOnly && (
            <Button onClick={handleSave} className="bg-[#183259] hover:bg-[#2a4a7a]">
              حفظ الصلاحيات
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}