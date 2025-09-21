import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Lock, HardDrive } from 'lucide-react';

interface SecuritySettingsTabProps {
  securitySettings: {
    passwordMinLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    twoFactorAuth: boolean;
    ipWhitelist: string;
    dataEncryption: boolean;
    autoBackup: boolean;
    backupFrequency: string;
    auditLogs: boolean;
  };
  setSecuritySettings: (updater: (prev: any) => any) => void;
}

export function SecuritySettingsTab({ securitySettings, setSecuritySettings }: SecuritySettingsTabProps) {
  const securitySwitchOptions = [
    { key: 'requireUppercase', label: 'مطالبة بأحرف كبيرة', desc: 'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل' },
    { key: 'requireNumbers', label: 'مطالبة بأرقام', desc: 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل' },
    { key: 'twoFactorAuth', label: 'المصادقة الثنائية (2FA)', desc: 'إجبار المستخدمين على استخدام المصادقة الثنائية' }
  ];

  const backupOptions = [
    { key: 'autoBackup', label: 'تفعيل النسخ الاحتياطي التلقائي', desc: 'إنشاء نسخ احتياطية تلقائية للبيانات' },
    { key: 'auditLogs', label: 'سجلات المراجعة', desc: 'تتبع جميع الأنشطة والتغييرات في النظام' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            سياسات كلمة المرور
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="passwordMinLength">الحد الأدنى لطول كلمة المرور</Label>
              <Input
                type="number"
                value={securitySettings.passwordMinLength}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
                min={6}
                max={32}
              />
            </div>
            <div>
              <Label htmlFor="maxLoginAttempts">الحد الأقصى لمحاولات الدخول</Label>
              <Input
                type="number"
                value={securitySettings.maxLoginAttempts}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                min={3}
                max={10}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            {securitySwitchOptions.map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <Label>{label}</Label>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
                <Switch
                  checked={securitySettings[key as keyof typeof securitySettings] as boolean}
                  onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, [key]: checked }))}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            النسخ الاحتياطي والأمان
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {backupOptions.map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <Label>{label}</Label>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
                <Switch
                  checked={securitySettings[key as keyof typeof securitySettings] as boolean}
                  onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, [key]: checked }))}
                />
              </div>
            ))}
          </div>
          
          <div>
            <Label>تكرار النسخ الاحتياطي</Label>
            <Select 
              value={securitySettings.backupFrequency}
              onValueChange={(value) => setSecuritySettings(prev => ({ ...prev, backupFrequency: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">يومياً</SelectItem>
                <SelectItem value="weekly">أسبوعياً</SelectItem>
                <SelectItem value="monthly">شهرياً</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}