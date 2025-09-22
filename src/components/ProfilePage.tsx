import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { EnhancedPageLayout } from './EnhancedPageLayout';
import { 
  User,
  Building,
  Mail,
  Phone,
  Package,
  CreditCard,
  Edit,
  ArrowLeft,
  Crown,
  TrendingUp,
  Users,
  BarChart3,
  FileText,
  Clock,
  Check,
  Gift,
  Star,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { toast } from 'sonner@2.0.3';

interface ProfilePageProps {
  userRole: 'org_manager';
  userName: string;
  userEmail: string;
  organization: string;
  onBack: () => void;
  onStartSubscription: (packageId: string) => void;
}

interface PackageData {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  currency: string;
  duration: string;
  isPopular?: boolean;
  isPremium?: boolean;
  features: string[];
  limits: {
    surveys: number;
    beneficiaries: number;
    responses: number;
    storage: string;
    support: string;
  };
  color: string;
}

interface OrganizationData {
  name: string;
  manager: string;
  email: string;
  phone: string;
  currentPackage: string;
  joinDate: string;
  address: string;
  website: string;
  description: string;
  logo?: string;
}

interface UsageData {
  surveys: { used: number; total: number };
  beneficiaries: { used: number; total: number };
  responses: { used: number; total: number };
  storage: { used: number; total: number; unit: string };
}

// Demo data
const demoOrganization: OrganizationData = {
  name: 'مؤسسة خيرية للتنمية الاجتماعية',
  manager: 'محمد خالد الأحمد',
  email: 'manager@charity-org.com',
  phone: '+966501234567',
  currentPackage: 'premium',
  joinDate: '2023-06-15',
  address: 'الرياض، المملكة العربية السعودية',
  website: 'https://charity-org.com',
  description: 'مؤسسة خيرية تهدف إلى تحقيق التنمية المستدامة وقياس الأثر الاجتماعي للبرامج والمبادرات الخيرية',
  logo: ''
};

const demoUsageData: UsageData = {
  surveys: { used: 23, total: 50 },
  beneficiaries: { used: 1247, total: 2500 },
  responses: { used: 8934, total: 15000 },
  storage: { used: 2.3, total: 10, unit: 'GB' }
};

const availablePackages: PackageData[] = [
  {
    id: 'starter',
    name: 'الباقة المبتدئة',
    nameEn: 'Starter',
    price: 299,
    currency: 'SAR',
    duration: 'شهرياً',
    features: [
      'إنشاء 10 استبيانات',
      '500 مستفيد',
      '2000 استجابة شهرياً',
      'تقارير أساسية',
      'دعم فني عبر البريد الإلكتروني'
    ],
    limits: {
      surveys: 10,
      beneficiaries: 500,
      responses: 2000,
      storage: '2 GB',
      support: 'البريد الإلكتروني'
    },
    color: '#10b981'
  },
  {
    id: 'professional',
    name: 'الباقة الاحترافية',
    nameEn: 'Professional',
    price: 599,
    currency: 'SAR',
    duration: 'شهرياً',
    isPopular: true,
    features: [
      'إنشاء 25 استبيان',
      '1500 مستفيد',
      '7500 استجابة شهرياً',
      'تقارير متقدمة مع الذكاء الاصطناعي',
      'تحليل البيانات المتقدم',
      'دعم فني على مدار الساعة'
    ],
    limits: {
      surveys: 25,
      beneficiaries: 1500,
      responses: 7500,
      storage: '5 GB',
      support: '24/7'
    },
    color: '#3b82f6'
  },
  {
    id: 'premium',
    name: 'الباقة المتميزة',
    nameEn: 'Premium',
    price: 999,
    currency: 'SAR',
    duration: 'شهرياً',
    isPremium: true,
    features: [
      'إنشاء 50 استبيان',
      '2500 مستفيد',
      '15000 استجابة شهرياً',
      'تحليل الأثر الاجتماعي المتقدم',
      'لوحة تحكم تفاعلية',
      'تقارير مخصصة',
      'API متكامل',
      'مدير حساب مخصص'
    ],
    limits: {
      surveys: 50,
      beneficiaries: 2500,
      responses: 15000,
      storage: '10 GB',
      support: 'مدير حساب مخصص'
    },
    color: '#8b5cf6'
  },
  {
    id: 'enterprise',
    name: 'باقة المؤسسات',
    nameEn: 'Enterprise',
    price: 1999,
    currency: 'SAR',
    duration: 'شهرياً',
    isPremium: true,
    features: [
      'استبيانات غير محدودة',
      'مستفيدين غير محدودين',
      'استجابات غير محدودة',
      'حلول مخصصة للمؤسسات',
      'تكامل مع الأنظمة الموجودة',
      'تدريب وورش عمل',
      'استشارات متخصصة',
      'فريق دعم مخصص'
    ],
    limits: {
      surveys: -1,
      beneficiaries: -1,
      responses: -1,
      storage: 'غير محدود',
      support: 'فريق مخصص'
    },
    color: '#f59e0b'
  }
];

// Chart data
const usageChartData = [
  { name: 'الاستبيانات', used: demoUsageData.surveys.used, total: demoUsageData.surveys.total, percentage: Math.round((demoUsageData.surveys.used / demoUsageData.surveys.total) * 100) },
  { name: 'المستفيدين', used: demoUsageData.beneficiaries.used, total: demoUsageData.beneficiaries.total, percentage: Math.round((demoUsageData.beneficiaries.used / demoUsageData.beneficiaries.total) * 100) },
  { name: 'الاستجابات', used: demoUsageData.responses.used, total: demoUsageData.responses.total, percentage: Math.round((demoUsageData.responses.used / demoUsageData.responses.total) * 100) }
];

const pieChartData = [
  { name: 'مستخدم', value: 65, fill: '#183259' },
  { name: 'متاح', value: 35, fill: '#e2e8f0' }
];

export function ProfilePage({ userRole, userName, userEmail, organization, onBack, onStartSubscription }: ProfilePageProps) {
  const [orgData, setOrgData] = useState<OrganizationData>(demoOrganization);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const currentPackage = availablePackages.find(pkg => pkg.id === orgData.currentPackage);

  const handleUpdateProfile = () => {
    setIsEditingProfile(false);
    toast.success('تم تحديث البيانات الشخصية بنجاح');
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('ar-SA');
  };

  const getPackageIcon = (packageId: string) => {
    switch (packageId) {
      case 'starter': return <Package className="h-5 w-5" />;
      case 'professional': return <Star className="h-5 w-5" />;
      case 'premium': return <Crown className="h-5 w-5" />;
      case 'enterprise': return <Shield className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const headerStats = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{demoUsageData.surveys.used}/{demoUsageData.surveys.total}</div>
            <div className="text-blue-200">الاستبيانات</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{formatNumber(demoUsageData.beneficiaries.used)}</div>
            <div className="text-blue-200">المستفيدين</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{formatNumber(demoUsageData.responses.used)}</div>
            <div className="text-blue-200">الاستجابات</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          {currentPackage && getPackageIcon(currentPackage.id)}
          <div className="text-white">
            <div className="text-2xl font-bold text-white">{currentPackage?.name}</div>
            <div className="text-blue-200">الباقة الحالية</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <EnhancedPageLayout
      pageId="profile"
      userRole={userRole}
      description="إدارة البيانات الشخصية والاشتراكات وتتبع الاستخدام"
      icon={<User className="h-8 w-8" />}
      headerContent={headerStats}
    >
      <div className="space-y-6">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 ml-2" />
          العودة
        </Button>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="xl:col-span-1 space-y-6">
            {/* Organization Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    بيانات المنظمة
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    <Edit className="h-4 w-4 ml-1" />
                    {isEditingProfile ? 'إلغاء' : 'تعديل'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <Label>اسم المنظمة</Label>
                      <Input 
                        value={orgData.name}
                        onChange={(e) => setOrgData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>اسم المدير</Label>
                      <Input 
                        value={orgData.manager}
                        onChange={(e) => setOrgData(prev => ({ ...prev, manager: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>البريد الإلكتروني</Label>
                      <Input 
                        type="email"
                        value={orgData.email}
                        onChange={(e) => setOrgData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>رقم الهاتف</Label>
                      <Input 
                        value={orgData.phone}
                        onChange={(e) => setOrgData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>العنوان</Label>
                      <Input 
                        value={orgData.address}
                        onChange={(e) => setOrgData(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>الموقع الإلكتروني</Label>
                      <Input 
                        value={orgData.website}
                        onChange={(e) => setOrgData(prev => ({ ...prev, website: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>وصف المنظمة</Label>
                      <Textarea 
                        value={orgData.description}
                        onChange={(e) => setOrgData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>شعار المنظمة</Label>
                      <ImageUploader
                        onImageUpload={(imageUrl) => setOrgData(prev => ({ ...prev, logo: imageUrl }))}
                        currentImage={orgData.logo}
                        placeholder="اختر شعار المنظمة"
                        variant="inline"
                        acceptedFormats={['image/png', 'image/jpeg', 'image/gif']}
                        maxSizeInMB={2}
                        showPreview={true}
                      />
                    </div>
                    <Button onClick={handleUpdateProfile} className="w-full">
                      <Check className="h-4 w-4 ml-1" />
                      حفظ التغييرات
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span>{orgData.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{orgData.manager}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{orgData.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{orgData.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <span>{orgData.website}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>عضو منذ {new Date(orgData.joinDate).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Current Package */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentPackage && getPackageIcon(currentPackage.id)}
                  الباقة الحالية
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentPackage && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{currentPackage.name}</span>
                      <Badge 
                        style={{ backgroundColor: currentPackage.color }}
                        className="text-white"
                      >
                        {currentPackage.price} {currentPackage.currency} / {currentPackage.duration}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>الحدود الحالية:</p>
                      <ul className="mt-2 space-y-1">
                        <li>• الاستبيانات: {currentPackage.limits.surveys === -1 ? 'غير محدود' : currentPackage.limits.surveys}</li>
                        <li>• المستفيدين: {currentPackage.limits.beneficiaries === -1 ? 'غير محدود' : formatNumber(currentPackage.limits.beneficiaries)}</li>
                        <li>• الاستجابات: {currentPackage.limits.responses === -1 ? 'غير محدود' : formatNumber(currentPackage.limits.responses)}</li>
                        <li>• التخزين: {currentPackage.limits.storage}</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Usage Overview */}
          <div className="xl:col-span-1 space-y-6">
            {/* Usage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  إحصائيات الاستخدام
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Surveys Usage */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>الاستبيانات</span>
                      <span>{demoUsageData.surveys.used} / {demoUsageData.surveys.total}</span>
                    </div>
                    <Progress 
                      value={(demoUsageData.surveys.used / demoUsageData.surveys.total) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Beneficiaries Usage */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>المستفيدين</span>
                      <span>{formatNumber(demoUsageData.beneficiaries.used)} / {formatNumber(demoUsageData.beneficiaries.total)}</span>
                    </div>
                    <Progress 
                      value={(demoUsageData.beneficiaries.used / demoUsageData.beneficiaries.total) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Responses Usage */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>الاستجابات</span>
                      <span>{formatNumber(demoUsageData.responses.used)} / {formatNumber(demoUsageData.responses.total)}</span>
                    </div>
                    <Progress 
                      value={(demoUsageData.responses.used / demoUsageData.responses.total) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Storage Usage */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>التخزين</span>
                      <span>{demoUsageData.storage.used} / {demoUsageData.storage.total} {demoUsageData.storage.unit}</span>
                    </div>
                    <Progress 
                      value={(demoUsageData.storage.used / demoUsageData.storage.total) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Chart */}
            <Card>
              <CardHeader>
                <CardTitle>مخطط الاستخدام</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usageChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="percentage" fill="#183259" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Overall Usage Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>الاستخدام الإجمالي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#183259]"></div>
                    <span className="text-sm">مستخدم (65%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <span className="text-sm">متاح (35%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Package Management */}
          <div className="xl:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  إدارة الباقات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availablePackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        pkg.id === orgData.currentPackage
                          ? 'border-[#183259] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getPackageIcon(pkg.id)}
                          <span className="font-medium">{pkg.name}</span>
                          {pkg.isPopular && (
                            <Badge className="bg-green-500 text-white text-xs">الأكثر شعبية</Badge>
                          )}
                          {pkg.isPremium && (
                            <Badge className="bg-purple-500 text-white text-xs">متميز</Badge>
                          )}
                        </div>
                        {pkg.id === orgData.currentPackage && (
                          <Badge className="bg-[#183259] text-white">الحالية</Badge>
                        )}
                      </div>
                      
                      <div className="text-2xl font-bold mb-2" style={{ color: pkg.color }}>
                        {pkg.price} {pkg.currency}
                        <span className="text-sm font-normal text-gray-600 mr-1">/ {pkg.duration}</span>
                      </div>

                      <ul className="text-sm space-y-1 mb-4">
                        {pkg.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                        {pkg.features.length > 3 && (
                          <li className="text-gray-500">و {pkg.features.length - 3} مميزات أخرى...</li>
                        )}
                      </ul>

                      {pkg.id !== orgData.currentPackage && (
                        <Button 
                          className="w-full"
                          style={{ backgroundColor: pkg.color }}
                          onClick={() => onStartSubscription(pkg.id)}
                        >
                          <Zap className="h-4 w-4 ml-1" />
                          اشترك الآن
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </EnhancedPageLayout>
  );
}