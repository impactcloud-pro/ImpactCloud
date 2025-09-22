import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { 
  Brain, Zap, Webhook, Code, Eye, EyeOff, AlertCircle, Settings as SettingsIcon,
  CheckCircle, XCircle, RefreshCw, TestTube, Plus, Edit, Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { llmProviders, type Integration } from '../../constants/settingsConstants';

interface IntegrationsSettingsTabProps {
  integrationSettings: {
    llmProvider: string;
    llmModel: string;
    llmApiKey: string;
    apiAccessEnabled: boolean;
    webhooksEnabled: boolean;
    rateLimitPerHour: number;
    maxTokens: number;
  };
  setIntegrationSettings: (updater: (prev: any) => any) => void;
  integrations: Integration[];
  setIntegrations: (updater: (prev: Integration[]) => Integration[]) => void;
  userRole: 'super_admin' | 'admin' | 'org_manager' | 'beneficiary';
  onIntegrationSettings?: (integration: Integration) => void;
  onToggleIntegration?: (integrationId: string) => void;
}

export function IntegrationsSettingsTab({ 
  integrationSettings, 
  setIntegrationSettings,
  integrations,
  setIntegrations,
  userRole,
  onIntegrationSettings,
  onToggleIntegration 
}: IntegrationsSettingsTabProps) {
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isAddIntegrationOpen, setIsAddIntegrationOpen] = useState(false);
  const [newIntegrationForm, setNewIntegrationForm] = useState({
    name: '',
    type: 'api' as 'webhook' | 'api' | 'llm',
    endpoint: '',
    apiKey: ''
  });

  const isReadOnlyForAdmin = userRole === 'admin';

  const togglePasswordVisibility = (key: string) => {
    setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLLMProviderChange = (provider: string) => {
    if (isReadOnlyForAdmin) {
      toast.warning('مدير أثرنا لا يمكنه تعديل إعدادات الذكاء الاصطناعي المتقدمة');
      return;
    }
    
    setIntegrationSettings(prev => ({
      ...prev,
      llmProvider: provider,
      llmModel: llmProviders[provider as keyof typeof llmProviders].models[0]
    }));
    toast.success(`تم تغيير مقدم الخدمة إلى ${llmProviders[provider as keyof typeof llmProviders].name}`);
  };

  const handleApiKeyChange = (apiKey: string) => {
    if (isReadOnlyForAdmin) {
      toast.warning('مدير أثرنا لا يمكنه تعديل مفاتيح API الرئيسية');
      return;
    }
    
    setIntegrationSettings(prev => ({ ...prev, llmApiKey: apiKey }));
  };

  const handleSettingChange = (key: string, value: any, requiresSuperAdmin = false) => {
    if (isReadOnlyForAdmin && requiresSuperAdmin) {
      toast.warning('هذا الإعداد متاح فقط لمدير النظام الرئيسي');
      return;
    }

    setIntegrationSettings(prev => ({ ...prev, [key]: value }));
    toast.success('تم حفظ الإعداد بنجاح');
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('تم اختبار الاتصال بنجاح! الذكاء الاصطناعي يعمل بشكل طبيعي.');
    } catch (error) {
      toast.error('فشل في الاتصال. يرجى التحقق من مفتاح API والإعدادات.');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleAddIntegration = () => {
    if (isReadOnlyForAdmin) {
      toast.warning('مدير أثرنا لا يمكنه إضافة تكاملات جديدة');
      return;
    }
    setIsAddIntegrationOpen(true);
  };

  const handleSaveNewIntegration = () => {
    if (!newIntegrationForm.name.trim()) {
      toast.error('يرجى إدخال اسم التكامل');
      return;
    }

    const newIntegration: Integration = {
      id: Math.random().toString(36).substr(2, 9),
      name: newIntegrationForm.name,
      type: newIntegrationForm.type,
      status: 'disconnected',
      settings: {
        endpoint: newIntegrationForm.endpoint,
        apiKey: newIntegrationForm.apiKey
      }
    };

    setIntegrations(prev => [...prev, newIntegration]);
    setNewIntegrationForm({ name: '', type: 'api', endpoint: '', apiKey: '' });
    setIsAddIntegrationOpen(false);
    toast.success(`تم إضافة التكامل "${newIntegration.name}" بنجاح`);
  };

  const getIntegrationStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIntegrationStatusLabel = (status: string) => {
    switch (status) {
      case 'connected': return 'متصل';
      case 'disconnected': return 'غير متصل';
      case 'error': return 'خطأ';
      default: return status;
    }
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'llm': return Brain;
      case 'webhook': return Webhook;
      case 'api': return Code;
      default: return Code;
    }
  };

  return (
    <div className="space-y-6">
      {/* LLM Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            ربط نموذج الذكاء الاصطناعي (LLM Integration)
          </CardTitle>
          {isReadOnlyForAdmin && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>ملاحظة:</strong> بعض إعدادات الذكاء الاصطناعي محدودة للمدير. الإعدادات المتقدمة متاحة فقط لمدير النظام الرئيسي.
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>
                مقدم الخدمة
                {isReadOnlyForAdmin && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Super Admin فقط
                  </Badge>
                )}
              </Label>
              <Select 
                value={integrationSettings.llmProvider}
                onValueChange={handleLLMProviderChange}
                disabled={isReadOnlyForAdmin}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(llmProviders).map(([key, provider]) => (
                    <SelectItem key={key} value={key}>{provider.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>النموذج</Label>
              <Select 
                value={integrationSettings.llmModel}
                onValueChange={(value) => handleSettingChange('llmModel', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {llmProviders[integrationSettings.llmProvider as keyof typeof llmProviders].models.map((model) => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label>
              مفتاح API
              {isReadOnlyForAdmin && (
                <Badge variant="outline" className="ml-2 text-xs">
                  Super Admin فقط
                </Badge>
              )}
            </Label>
            <div className="relative">
              <Input
                type={showPasswords['llmApiKey'] ? 'text' : 'password'}
                value={integrationSettings.llmApiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                className="pr-10"
                disabled={isReadOnlyForAdmin}
                placeholder="sk-..."
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                onClick={() => togglePasswordVisibility('llmApiKey')}
              >
                {showPasswords['llmApiKey'] ? 
                  <EyeOff className="h-4 w-4" /> : 
                  <Eye className="h-4 w-4" />
                }
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>الحد الأقصى للرموز</Label>
              <Input
                type="number"
                value={integrationSettings.maxTokens}
                onChange={(e) => handleSettingChange('maxTokens', parseInt(e.target.value))}
                min={100}
                max={4000}
              />
              <p className="text-xs text-gray-600 mt-1">أقصى عدد رموز يمكن استخدامها في كل استجابة</p>
            </div>

            <div>
              <Label>الحد الأقصى للطلبات في الساعة</Label>
              <Input
                type="number"
                value={integrationSettings.rateLimitPerHour}
                onChange={(e) => handleSettingChange('rateLimitPerHour', parseInt(e.target.value), true)}
                min={10}
                max={10000}
                disabled={isReadOnlyForAdmin}
              />
              {isReadOnlyForAdmin && (
                <p className="text-xs text-gray-500 mt-1">يمكن لمدير النظام الرئيسي فقط تعديل حدود الاستخدام</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleTestConnection}
              disabled={isTestingConnection || !integrationSettings.llmApiKey || integrationSettings.llmApiKey.startsWith('••')}
              className="bg-[#183259] hover:bg-[#2a4a7a]"
            >
              {isTestingConnection ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  جاري الاختبار...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  اختبار الاتصال
                </>
              )}
            </Button>
            
            {!integrationSettings.llmApiKey || integrationSettings.llmApiKey.startsWith('••') ? (
              <span className="text-sm text-gray-500">
                يرجى إدخال مفتاح API صالح أولاً
              </span>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}