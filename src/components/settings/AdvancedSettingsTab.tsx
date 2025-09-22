import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { 
  Server, Monitor, AlertTriangle, CheckCircle, XCircle, HardDrive,
  Activity, Database, Wifi, Settings as SettingsIcon, AlertCircle,
  RefreshCw, Download, Trash2, Eye, Shield, Zap, Wrench
} from 'lucide-react';
import { toast } from 'sonner';

interface AdvancedSettingsTabProps {
  advancedSettings: {
    maintenanceMode: boolean;
    debugMode: boolean;
    logLevel: string;
    cacheEnabled: boolean;
    performanceMonitoring: boolean;
    errorReporting: boolean;
    backupRetention: number;
    environment: string;
  };
  setAdvancedSettings: (updater: (prev: any) => any) => void;
  userRole: 'super_admin' | 'admin' | 'org_manager' | 'beneficiary';
}

export function AdvancedSettingsTab({ 
  advancedSettings, 
  setAdvancedSettings, 
  userRole 
}: AdvancedSettingsTabProps) {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [systemStats] = useState({
    cpuUsage: 35,
    memoryUsage: 68,
    diskUsage: 45,
    networkUsage: 12,
    uptime: '15 يوم، 7 ساعات',
    lastBackup: '2024-12-19T10:30:00Z'
  });

  const isReadOnlyForAdmin = userRole === 'admin';

  const systemSettings = [
    {
      key: 'maintenanceMode',
      label: 'وضع الصيانة',
      desc: 'تفعيل وضع الصيانة يمنع المستخدمين من الوصول للمنصة',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      adminCanEdit: false, // Super Admin only
      critical: true
    },
    {
      key: 'debugMode',
      label: 'وضع التطوير',
      desc: 'عرض تفاصيل الأخطاء ومعلومات إضافية للمطورين',
      icon: Wrench,
      color: 'text-blue-600',
      adminCanEdit: false, // Super Admin only
      critical: false
    },
    {
      key: 'performanceMonitoring',
      label: 'مراقبة الأداء',
      desc: 'تتبع أداء النظام وسرعة الاستجابة',
      icon: Activity,
      color: 'text-green-600',
      adminCanEdit: true,
      critical: false
    },
    {
      key: 'errorReporting',
      label: 'تقارير الأخطاء',
      desc: 'إرسال تقارير الأخطاء تلقائياً للمطورين',
      icon: AlertCircle,
      color: 'text-red-600',
      adminCanEdit: true,
      critical: false
    },
    {
      key: 'cacheEnabled',
      label: 'تفعيل التخزين المؤقت',
      desc: 'استخدام التخزين المؤقت لتحسين سرعة النظام',
      icon: Zap,
      color: 'text-purple-600',
      adminCanEdit: false, // Super Admin only
      critical: false
    }
  ];

  const handleSettingChange = (key: string, value: any, adminCanEdit: boolean, critical = false) => {
    if (isReadOnlyForAdmin && !adminCanEdit) {
      toast.warning('هذا الإعداد متاح فقط لمدير النظام الرئيسي');
      return;
    }

    if (critical) {
      toast.warning('تحذير: هذا الإعداد قد يؤثر على عمل النظام');
    }

    setAdvancedSettings(prev => ({ ...prev, [key]: value }));
    
    const settingName = systemSettings.find(s => s.key === key)?.label;
    toast.success(`تم ${value ? 'تفعيل' : 'إلغاء'} ${settingName}`);
  };

  const handleSelectChange = (key: string, value: string, requiresSuperAdmin = false) => {
    if (isReadOnlyForAdmin && requiresSuperAdmin) {
      toast.warning('هذا الإعداد متاح فقط لمدير النظام الرئيسي');
      return;
    }

    setAdvancedSettings(prev => ({ ...prev, [key]: value }));
    toast.success('تم حفظ الإعداد بنجاح');
  };

  const handleCreateBackup = async () => {
    if (isReadOnlyForAdmin) {
      toast.warning('مدير أثرنا لا يمكنه إنشاء نسخ احتياطية يدوية');
      return;
    }

    setIsBackingUp(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('تم إنشاء النسخة الاحتياطية بنجاح');
    } catch (error) {
      toast.error('فشل في إنشاء النسخة الاحتياطية');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleClearCache = async () => {
    if (isReadOnlyForAdmin) {
      toast.warning('مدير أثرنا لا يمكنه مسح الذاكرة المؤقتة');
      return;
    }

    setIsClearingCache(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('تم مسح الذاكرة المؤقتة بنجاح');
    } catch (error) {
      toast.error('فشل في مسح الذاكرة المؤقتة');
    } finally {
      setIsClearingCache(false);
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      case 'debug': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production': return 'text-green-600';
      case 'staging': return 'text-yellow-600';
      case 'development': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage < 50) return 'bg-green-500';
    if (usage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            حالة النظام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">المعالج (CPU)</Label>
                <span className="text-sm font-medium">{systemStats.cpuUsage}%</span>
              </div>
              <Progress value={systemStats.cpuUsage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">الذاكرة (RAM)</Label>
                <span className="text-sm font-medium">{systemStats.memoryUsage}%</span>
              </div>
              <Progress value={systemStats.memoryUsage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">التخزين</Label>
                <span className="text-sm font-medium">{systemStats.diskUsage}%</span>
              </div>
              <Progress value={systemStats.diskUsage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">الشبكة</Label>
                <span className="text-sm font-medium">{systemStats.networkUsage}%</span>
              </div>
              <Progress value={systemStats.networkUsage} className="h-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <div className="font-medium text-green-800">النظام يعمل</div>
                <div className="text-sm text-green-600">وقت التشغيل: {systemStats.uptime}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <HardDrive className="h-6 w-6 text-blue-600" />
              <div>
                <div className="font-medium text-blue-800">آخر نسخ احتياطي</div>
                <div className="text-sm text-blue-600">
                  {new Date(systemStats.lastBackup).toLocaleDateString('ar-SA')}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            إعدادات النظام المتقدمة
          </CardTitle>
          {isReadOnlyForAdmin && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>ملاحظة:</strong> الإعدادات الحساسة محدودة للمدير. الإعدادات الأساسية متاحة لمدير أثرنا.
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {systemSettings.map(({ key, label, desc, icon: Icon, color, adminCanEdit, critical }) => {
              const isDisabled = isReadOnlyForAdmin && !adminCanEdit;
              return (
                <div key={key} className={`p-4 border rounded-lg ${critical ? 'border-red-200' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Icon className={`h-5 w-5 ${color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Label className="font-medium">{label}</Label>
                          {isReadOnlyForAdmin && !adminCanEdit && (
                            <Badge variant="outline" className="text-xs">
                              Super Admin فقط
                            </Badge>
                          )}
                          {critical && (
                            <Badge variant="destructive" className="text-xs">
                              حساس
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{desc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={advancedSettings[key as keyof typeof advancedSettings] as boolean}
                      onCheckedChange={(checked) => handleSettingChange(key, checked, adminCanEdit, critical)}
                      disabled={isDisabled}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>
                مستوى تسجيل الأخطاء
                {isReadOnlyForAdmin && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Super Admin فقط
                  </Badge>
                )}
              </Label>
              <Select 
                value={advancedSettings.logLevel}
                onValueChange={(value) => handleSelectChange('logLevel', value, true)}
                disabled={isReadOnlyForAdmin}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="error">
                    <span className="text-red-600">أخطاء فقط</span>
                  </SelectItem>
                  <SelectItem value="warning">
                    <span className="text-yellow-600">تحذيرات وأخطاء</span>
                  </SelectItem>
                  <SelectItem value="info">
                    <span className="text-blue-600">معلومات شاملة</span>
                  </SelectItem>
                  <SelectItem value="debug">
                    <span className="text-purple-600">تفصيلي (Debug)</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>
                بيئة التشغيل
                {isReadOnlyForAdmin && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Super Admin فقط
                  </Badge>
                )}
              </Label>
              <Select 
                value={advancedSettings.environment}
                onValueChange={(value) => handleSelectChange('environment', value, true)}
                disabled={isReadOnlyForAdmin}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">
                    <span className="text-blue-600">تطوير</span>
                  </SelectItem>
                  <SelectItem value="staging">
                    <span className="text-yellow-600">اختبار</span>
                  </SelectItem>
                  <SelectItem value="production">
                    <span className="text-green-600">إنتاج</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>فترة الاحتفاظ بالنسخ الاحتياطية (يوم)</Label>
            <Input
              type="number"
              value={advancedSettings.backupRetention}
              onChange={(e) => handleSelectChange('backupRetention', parseInt(e.target.value) || 30)}
              min={7}
              max={365}
            />
            <p className="text-xs text-gray-600 mt-1">
              عدد الأيام للاحتفاظ بالنسخ الاحتياطية (7-365 يوم)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            صيانة النظام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">نسخ احتياطي</Label>
                <p className="text-sm text-gray-600 mb-3">
                  إنشاء نسخة احتياطية يدوية من البيانات
                </p>
                <Button 
                  onClick={handleCreateBackup}
                  disabled={isBackingUp || isReadOnlyForAdmin}
                  variant="outline"
                  className="w-full"
                >
                  {isBackingUp ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      جاري إنشاء النسخة...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      إنشاء نسخة احتياطية
                    </>
                  )}
                </Button>
                {isReadOnlyForAdmin && (
                  <p className="text-xs text-gray-500 mt-1">
                    متاح فقط لمدير النظام الرئيسي
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">مسح الذاكرة المؤقتة</Label>
                <p className="text-sm text-gray-600 mb-3">
                  مسح جميع البيانات المؤقتة المحفوظة
                </p>
                <Button 
                  onClick={handleClearCache}
                  disabled={isClearingCache || isReadOnlyForAdmin}
                  variant="outline"
                  className="w-full"
                >
                  {isClearingCache ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      جاري مسح الذاكرة...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      مسح الذاكرة المؤقتة
                    </>
                  )}
                </Button>
                {isReadOnlyForAdmin && (
                  <p className="text-xs text-gray-500 mt-1">
                    متاح فقط لمدير النظام الرئيسي
                  </p>
                )}
              </div>
            </div>
          </div>

          {advancedSettings.maintenanceMode && (
            <Alert className="mt-4 border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>تحذير:</strong> وضع الصيانة مفعل حالياً. المستخدمون لا يمكنهم الوصول للمنصة.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            معلومات النظام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <SettingsIcon className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">الإصدار</span>
              </div>
              <div className="text-lg font-bold">v2.1.3</div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">البيئة</span>
              </div>
              <div className={`text-lg font-bold ${getEnvironmentColor(advancedSettings.environment)}`}>
                {advancedSettings.environment === 'production' ? 'إنتاج' :
                 advancedSettings.environment === 'staging' ? 'اختبار' : 'تطوير'}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">مستوى السجلات</span>
              </div>
              <div className={`text-lg font-bold ${getLogLevelColor(advancedSettings.logLevel)}`}>
                {advancedSettings.logLevel === 'error' ? 'أخطاء فقط' :
                 advancedSettings.logLevel === 'warning' ? 'تحذيرات' :
                 advancedSettings.logLevel === 'info' ? 'شامل' : 'تفصيلي'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}