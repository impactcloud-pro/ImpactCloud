import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Mail, Bell, Smartphone, MessageSquare, AlertCircle, TestTube } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationsSettingsTabProps {
  notificationSettings: {
    emailNotifications: boolean;
    inAppNotifications: boolean;
    systemAlerts: boolean;
    billingAlerts: boolean;
    activityAlerts: boolean;
    adminEmail: string;
    notificationFrequency: string;
  };
  setNotificationSettings: (updater: (prev: any) => any) => void;
  userRole: 'super_admin' | 'admin' | 'org_manager' | 'beneficiary';
}

export function NotificationsSettingsTab({ 
  notificationSettings, 
  setNotificationSettings,
  userRole 
}: NotificationsSettingsTabProps) {
  const isReadOnlyForAdmin = userRole === 'admin';

  const notificationTypes = [
    { 
      key: 'emailNotifications', 
      label: 'إشعارات البريد الإلكتروني', 
      desc: 'استقبال الإشعارات عبر البريد الإلكتروني',
      icon: Mail,
      adminCanEdit: true
    },
    { 
      key: 'inAppNotifications', 
      label: 'الإشعارات داخل التطبيق', 
      desc: 'إظهار الإشعارات داخل واجهة المنصة',
      icon: Bell,
      adminCanEdit: true
    },
    { 
      key: 'systemAlerts', 
      label: 'تنبيهات النظام', 
      desc: 'الحصول على تنبيهات بشأن حالة النظام والصيانة',
      icon: AlertCircle,
      adminCanEdit: false // Super Admin only
    },
    { 
      key: 'billingAlerts', 
      label: 'تنبيهات الفواتير', 
      desc: 'إشعارات حول المدفوعات وتجديد الاشتراكات',
      icon: MessageSquare,
      adminCanEdit: true
    },
    { 
      key: 'activityAlerts', 
      label: 'تنبيهات الأنشطة', 
      desc: 'إشعارات عن أنشطة المستخدمين والاستبيانات الجديدة',
      icon: Smartphone,
      adminCanEdit: true
    }
  ];

  const handleSwitchChange = (key: string, checked: boolean, adminCanEdit: boolean) => {
    if (isReadOnlyForAdmin && !adminCanEdit) {
      toast.warning('مدير أثرنا لا يمكنه تعديل إعدادات النظام المتقدمة');
      return;
    }

    setNotificationSettings(prev => ({ ...prev, [key]: checked }));
    toast.success(`تم ${checked ? 'تفعيل' : 'إلغاء'} ${notificationTypes.find(n => n.key === key)?.label}`);
  };

  const handleEmailChange = (email: string) => {
    if (isReadOnlyForAdmin) {
      toast.warning('مدير أثرنا لا يمكنه تعديل بريد إشعارات النظام');
      return;
    }
    setNotificationSettings(prev => ({ ...prev, adminEmail: email }));
  };

  const handleFrequencyChange = (frequency: string) => {
    setNotificationSettings(prev => ({ ...prev, notificationFrequency: frequency }));
    toast.success('تم تحديث تكرار الإشعارات');
  };

  const handleTestNotification = () => {
    toast.info('تم إرسال إشعار اختبار إلى البريد المحدد');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            إعدادات الإشعارات
          </CardTitle>
          {isReadOnlyForAdmin && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>ملاحظة:</strong> بعض الإعدادات محدودة للمدير. الإعدادات المتقدمة للنظام متاحة فقط لمدير النظام الرئيسي.
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {notificationTypes.map(({ key, label, desc, icon: Icon, adminCanEdit }) => {
              const isDisabled = isReadOnlyForAdmin && !adminCanEdit;
              return (
                <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label className="font-medium">{label}</Label>
                        {isReadOnlyForAdmin && !adminCanEdit && (
                          <Badge variant="outline" className="text-xs">
                            Super Admin فقط
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings[key as keyof typeof notificationSettings] as boolean}
                    onCheckedChange={(checked) => handleSwitchChange(key, checked, adminCanEdit)}
                    disabled={isDisabled}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Email Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            إعدادات البريد الإلكتروني
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="adminEmail">
                بريد إشعارات المدير
                {isReadOnlyForAdmin && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Super Admin فقط
                  </Badge>
                )}
              </Label>
              <Input
                id="adminEmail"
                type="email"
                value={notificationSettings.adminEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                className="text-right"
                disabled={isReadOnlyForAdmin}
                placeholder="admin@atharonaa.com"
              />
              {isReadOnlyForAdmin && (
                <p className="text-xs text-gray-500 mt-1">
                  يمكن لمدير النظام الرئيسي فقط تعديل بريد إشعارات النظام
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="notificationFrequency">تكرار الإشعارات</Label>
              <Select 
                value={notificationSettings.notificationFrequency}
                onValueChange={handleFrequencyChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="real-time">فوري</SelectItem>
                  <SelectItem value="hourly">كل ساعة</SelectItem>
                  <SelectItem value="daily">يومي</SelectItem>
                  <SelectItem value="weekly">أسبوعي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={handleTestNotification}
              variant="outline"
              size="sm"
              disabled={!notificationSettings.emailNotifications}
            >
              <TestTube className="h-4 w-4 mr-2" />
              إرسال إشعار اختبار
            </Button>
            {!notificationSettings.emailNotifications && (
              <span className="text-sm text-gray-500">
                يجب تفعيل إشعارات البريد أولاً
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            حالة الإشعارات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-800">
                {Object.values(notificationSettings).filter((val, index) => 
                  typeof val === 'boolean' && val && index < 5
                ).length}
              </div>
              <div className="text-sm text-green-600">إشعارات مفعلة</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">
                {notificationSettings.notificationFrequency === 'real-time' ? 'فوري' : 
                 notificationSettings.notificationFrequency === 'hourly' ? 'كل ساعة' :
                 notificationSettings.notificationFrequency === 'daily' ? 'يومي' : 'أسبوعي'}
              </div>
              <div className="text-sm text-blue-600">تكرار الإشعارات</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">
                {notificationSettings.emailNotifications ? 'متصل' : 'غير متصل'}
              </div>
              <div className="text-sm text-gray-600">حالة البريد الإلكتروني</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}