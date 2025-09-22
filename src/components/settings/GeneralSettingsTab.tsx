import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Building, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUploader } from '../ImageUploader';

interface GeneralSettingsTabProps {
  generalSettings: {
    organizationName: string;
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    defaultLanguage: string;
    timeZone: string;
    dateFormat: string;
    timeFormat: string;
  };
  setGeneralSettings: (updater: (prev: any) => any) => void;
  onFileUpload?: () => void; // Made optional since we'll handle it internally
}

export function GeneralSettingsTab({ 
  generalSettings, 
  setGeneralSettings, 
  onFileUpload 
}: GeneralSettingsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          إعدادات الحساب العام
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="orgName">اسم المنظمة / الشركة</Label>
            <Input
              id="orgName"
              value={generalSettings.organizationName}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, organizationName: e.target.value }))}
              className="text-right"
            />
          </div>
          
          <div>
            <Label htmlFor="logo">الشعار</Label>
            <ImageUploader
              onImageUpload={(imageUrl) => setGeneralSettings(prev => ({ ...prev, logo: imageUrl }))}
              currentImage={generalSettings.logo}
              placeholder="اختر ملف الشعار"
              variant="inline"
              buttonText={generalSettings.logo ? 'تغيير الشعار' : 'اختر ملف الشعار'}
              acceptedFormats={['image/png', 'image/jpeg', 'image/gif']}
              maxSizeInMB={5}
              showPreview={true}
            />
          </div>
          
          <div>
            <Label htmlFor="primaryColor">اللون الأساسي</Label>
            <div className="flex items-center gap-3">
              <Input
                type="color"
                value={generalSettings.primaryColor}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="w-16 h-10 p-1 rounded"
              />
              <Input
                value={generalSettings.primaryColor}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="secondaryColor">اللون الثانوي</Label>
            <div className="flex items-center gap-3">
              <Input
                type="color"
                value={generalSettings.secondaryColor}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                className="w-16 h-10 p-1 rounded"
              />
              <Input
                value={generalSettings.secondaryColor}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="defaultLanguage">اللغة الافتراضية</Label>
            <Select 
              value={generalSettings.defaultLanguage}
              onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, defaultLanguage: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="timeZone">المنطقة الزمنية</Label>
            <Select 
              value={generalSettings.timeZone}
              onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timeZone: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Riyadh">الرياض (GMT+3)</SelectItem>
                <SelectItem value="Asia/Dubai">دبي (GMT+4)</SelectItem>
                <SelectItem value="Europe/London">لندن (GMT+0)</SelectItem>
                <SelectItem value="America/New_York">نيويورك (GMT-5)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="dateFormat">تنسيق التاريخ</Label>
            <Select 
              value={generalSettings.dateFormat}
              onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, dateFormat: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="timeFormat">تنسيق الوقت</Label>
            <Select 
              value={generalSettings.timeFormat}
              onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timeFormat: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 ساعة</SelectItem>
                <SelectItem value="12h">12 ساعة (AM/PM)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}