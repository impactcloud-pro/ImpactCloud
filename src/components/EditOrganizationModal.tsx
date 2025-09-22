import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  Building2, 
  User, 
  Settings, 
  Package, 
  MapPin, 
  Users,
  Key,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface Organization {
  id: string;
  name: string;
  type: 'company' | 'nonprofit' | 'government' | 'educational';
  manager: string[];
  username: string;
  password: string;
  region: string;
  userCount: number;
  packageType: 'free' | 'basic' | 'professional' | 'custom';
  quota: number;
  consumed: number;
  remaining: number;
  surveys: number;
  activeSurveys: number;
  completedSurveys: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

interface EditOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: Organization | null;
  onSave: (updatedOrg: Organization) => void;
}

export function EditOrganizationModal({ 
  isOpen, 
  onClose, 
  organization, 
  onSave 
}: EditOrganizationModalProps) {
  const [formData, setFormData] = useState<Organization | null>(null);
  const [newManager, setNewManager] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (organization) {
      setFormData({ ...organization });
      setActiveTab('basic');
    }
  }, [organization]);

  const handleSave = () => {
    if (!formData) return;

    if (!formData.name || !formData.username || !formData.region || formData.manager.length === 0) {
      toast.error('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    // حساب المتبقي من الكوتا
    const updatedFormData = {
      ...formData,
      remaining: formData.quota - formData.consumed
    };

    onSave(updatedFormData);
    onClose();
    toast.success('تم تحديث بيانات المنظمة بنجاح');
  };

  const handleAddManager = () => {
    if (!newManager.trim()) return;
    
    if (formData && !formData.manager.includes(newManager.trim())) {
      setFormData({
        ...formData,
        manager: [...formData.manager, newManager.trim()]
      });
      setNewManager('');
    } else {
      toast.error('هذا المدير موجود مسبقاً');
    }
  };

  const handleRemoveManager = (index: number) => {
    if (formData && formData.manager.length > 1) {
      setFormData({
        ...formData,
        manager: formData.manager.filter((_, i) => i !== index)
      });
    } else {
      toast.error('يجب أن يكون هناك مدير واحد على الأقل');
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'company': return 'شركة';
      case 'nonprofit': return 'مؤسسة غير ربحية';
      case 'government': return 'جهة حكومية';
      case 'educational': return 'مؤسسة تعليمية';
      default: return type;
    }
  };

  const getPackageDisplayName = (packageType: string) => {
    switch (packageType) {
      case 'free': return 'مجاني';
      case 'basic': return 'أساسي';
      case 'professional': return 'احترافي';
      case 'custom': return 'مخصص';
      default: return packageType;
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#183259]" />
            تعديل بيانات المنظمة
          </DialogTitle>
          <DialogDescription>
            قم بتحديث بيانات المنظمة والإعدادات الخاصة بها
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[75vh]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                المعلومات الأساسية
              </TabsTrigger>
              <TabsTrigger value="managers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                المديرين
              </TabsTrigger>
              <TabsTrigger value="subscription" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                الاشتراك
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                الإعدادات
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">المعلومات الأساسية</CardTitle>
                  <CardDescription>تحديث المعلومات الأساسية للمنظمة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">اسم المنظمة *</Label>
                      <Input
                        id="edit-name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="مثال: مؤسسة التنمية الاجتماعية"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-type">نوع المنظمة *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value as Organization['type'] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="company">شركة</SelectItem>
                          <SelectItem value="nonprofit">مؤسسة غير ربحية</SelectItem>
                          <SelectItem value="government">جهة حكومية</SelectItem>
                          <SelectItem value="educational">مؤسسة تعليمية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-region">المنطقة *</Label>
                      <Input
                        id="edit-region"
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        placeholder="مثال: الرياض"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-userCount">عدد المستخدمين</Label>
                      <Input
                        id="edit-userCount"
                        type="number"
                        value={formData.userCount}
                        onChange={(e) => setFormData({ ...formData, userCount: parseInt(e.target.value) || 0 })}
                        min="0"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="managers" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">إدارة المديرين</CardTitle>
                  <CardDescription>إضافة وإزالة مديري المنظمة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="اسم المدير الجديد"
                      value={newManager}
                      onChange={(e) => setNewManager(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddManager()}
                    />
                    <Button onClick={handleAddManager} className="bg-[#183259] hover:bg-[#2a4a7a]">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>المديرين الحاليين ({formData.manager.length})</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {formData.manager.map((manager, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-[#183259]" />
                            <span>{manager}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveManager(index)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            disabled={formData.manager.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">إعدادات الاشتراك</CardTitle>
                  <CardDescription>إدارة خطة الاشتراك والكوتا المتاحة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-packageType">خطة الاشتراك</Label>
                      <Select
                        value={formData.packageType}
                        onValueChange={(value) => setFormData({ ...formData, packageType: value as Organization['packageType'] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">مجاني</SelectItem>
                          <SelectItem value="basic">أساسي</SelectItem>
                          <SelectItem value="professional">احترافي</SelectItem>
                          <SelectItem value="custom">مخصص</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-quota">الكوتا المتاحة</Label>
                      <Input
                        id="edit-quota"
                        type="number"
                        value={formData.quota}
                        onChange={(e) => setFormData({ ...formData, quota: parseInt(e.target.value) || 0 })}
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-consumed">المستهلك</Label>
                      <Input
                        id="edit-consumed"
                        type="number"
                        value={formData.consumed}
                        onChange={(e) => setFormData({ ...formData, consumed: parseInt(e.target.value) || 0 })}
                        min="0"
                        max={formData.quota}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>المتبقي</Label>
                      <div className="p-2 bg-gray-50 rounded-md">
                        <span className="font-medium text-green-600">
                          {(formData.quota - formData.consumed).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">استخدام الكوتا</span>
                      <span className="text-sm text-gray-600">
                        {Math.round((formData.consumed / formData.quota) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#183259] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((formData.consumed / formData.quota) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">إعدادات الحساب</CardTitle>
                  <CardDescription>إدارة بيانات تسجيل الدخول والحالة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-username">اسم المستخدم *</Label>
                      <Input
                        id="edit-username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="مثال: social_dev_org"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-password">كلمة المرور</Label>
                      <Input
                        id="edit-password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="اتركها فارغة للاحتفاظ بالكلمة الحالية"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-status">حالة الحساب</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value as Organization['status'] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">مفعل</SelectItem>
                          <SelectItem value="inactive">معطل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>تاريخ الانضمام</Label>
                      <div className="p-2 bg-gray-50 rounded-md">
                        <span className="text-sm">
                          {new Date(formData.joinDate).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 ml-2" />
            إلغاء
          </Button>
          <Button onClick={handleSave} className="bg-[#183259] hover:bg-[#2a4a7a] text-white">
            <Save className="h-4 w-4 ml-2" />
            حفظ التغييرات
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}