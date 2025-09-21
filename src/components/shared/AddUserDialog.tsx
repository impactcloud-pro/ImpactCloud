import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RefreshCw, Save, UserPlus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { systemRoles, organizationOptions, type User } from '../../constants/settingsConstants';

type UserRole = 'super_admin' | 'admin' | 'org_manager' | 'beneficiary';

interface AddUserFormData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  organization: string;
}

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (user: User) => void;
}

export function AddUserDialog({ isOpen, onClose, onUserAdded }: AddUserDialogProps) {
  const [formData, setFormData] = useState<AddUserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'beneficiary',
    organization: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<AddUserFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<AddUserFormData> = {};

    // التحقق من الاسم
    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'الاسم يجب أن يكون على الأقل حرفين';
    }

    // التحقق من البريد الإلكتروني
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'يرجى إدخال بريد إلكتروني صالح';
    }

    // التحقق من رقم الهاتف (اختياري ولكن إذا تم إدخاله يجب أن يكون صالحاً)
    if (formData.phone && !/^(\+966|966|0)?[5-9][0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'يرجى إدخال رقم هاتف سعودي صالح';
    }

    // التحقق من المنظمة (مطلوب لمدراء المنظمات)
    if ((formData.role === 'org_manager' || formData.role === 'admin') && !formData.organization.trim()) {
      newErrors.organization = 'المنظمة مطلوبة لهذا الدور';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('يرجى تصحيح الأخطاء في النموذج');
      return;
    }

    setIsLoading(true);
    try {
      // محاكاة API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // إنشاء مستخدم جديد
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        role: formData.role,
        organization: formData.organization.trim() || undefined,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLogin: undefined
      };

      // إضافة المستخدم
      onUserAdded(newUser);
      
      // إعادة تعيين النموذج
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'beneficiary',
        organization: ''
      });
      setErrors({});
      onClose();

      toast.success(`تم إضافة المستخدم "${newUser.name}" بنجاح!`);
    } catch (error) {
      toast.error('حدث خطأ في إضافة المستخدم');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'beneficiary',
        organization: ''
      });
      setErrors({});
      onClose();
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleObj = systemRoles.find(r => r.name === role);
    return roleObj ? roleObj.displayName : role;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            إضافة مستخدم جديد
          </DialogTitle>
          <DialogDescription>
            أدخل بيانات المستخدم الجديد. جميع الحقول المطلوبة محددة بعلامة *
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="add-name">الاسم الكامل *</Label>
            <Input
              id="add-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isLoading}
              placeholder="أدخل الاسم الكامل"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="add-email">البريد الإلكتروني *</Label>
            <Input
              id="add-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={isLoading}
              placeholder="أدخل البريد الإلكتروني"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="add-phone">رقم الهاتف</Label>
            <Input
              id="add-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              disabled={isLoading}
              placeholder="+966xxxxxxxxx"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="add-role">الدور *</Label>
            <Select 
              value={formData.role}
              onValueChange={(value: UserRole) => setFormData(prev => ({ ...prev, role: value }))}
              disabled={isLoading}
            >
              <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                <SelectValue placeholder="اختر الدور" />
              </SelectTrigger>
              <SelectContent>
                {systemRoles.map((role) => (
                  <SelectItem key={role.name} value={role.name}>
                    {getRoleDisplayName(role.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
          </div>

          {(formData.role === 'org_manager' || formData.role === 'admin') && (
            <div>
              <Label htmlFor="add-organization">المنظمة *</Label>
              <Select 
                value={formData.organization}
                onValueChange={(value) => setFormData(prev => ({ ...prev, organization: value }))}
                disabled={isLoading}
              >
                <SelectTrigger className={errors.organization ? 'border-red-500' : ''}>
                  <SelectValue placeholder="اختر المنظمة" />
                </SelectTrigger>
                <SelectContent>
                  {organizationOptions.map((org) => (
                    <SelectItem key={org} value={org}>
                      {org}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.organization && <p className="text-xs text-red-500 mt-1">{errors.organization}</p>}
            </div>
          )}

          {formData.role === 'beneficiary' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>ملاحظة:</strong> المستفيدون سيحصلون على دعوة للانضمام للمنصة عبر البريد الإلكتروني
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isLoading}
          >
            إلغاء
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-[#183259] hover:bg-[#2a4a7a]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                جاري الإضافة...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                إضافة المستخدم
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}