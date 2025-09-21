import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  Search,
  Users,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Building,
  Phone,
  Mail,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Filter,
  Plus,
  Shield,
  Activity,
  BarChart3,
  User,
  Clock,
  MapPin,
  Building2,
  TrendingUp
} from 'lucide-react';
import { EnhancedPageLayout } from './EnhancedPageLayout';
import { toast } from 'sonner@2.0.3';

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
  status: 'active' | 'inactive' | 'pending';
}

// Mock organizations data
const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'مؤسسة التنمية الاجتماعية',
    type: 'nonprofit',
    manager: ['أحمد محمد الشريف', 'سارة علي الزهراني'],
    username: 'social_dev_org',
    password: 'SecurePass123',
    region: 'الرياض',
    userCount: 15,
    packageType: 'professional',
    quota: 1000,
    consumed: 780,
    remaining: 220,
    surveys: 25,
    activeSurveys: 8,
    completedSurveys: 17,
    joinDate: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'شركة الابتكار التقني',
    type: 'company',
    manager: ['فاطمة سالم القحطاني'],
    username: 'tech_innovation',
    password: 'TechPass@2024',
    region: 'جدة',
    userCount: 32,
    packageType: 'custom',
    quota: 2500,
    consumed: 1850,
    remaining: 650,
    surveys: 45,
    activeSurveys: 12,
    completedSurveys: 33,
    joinDate: '2024-02-20',
    status: 'active'
  },
  {
    id: '3',
    name: 'وزارة التنمية الاجتماعية',
    type: 'government',
    manager: ['خالد إبراهيم العتيبي', 'منى عبدالعزيز الدوسري', 'عبدالرحمن طالب الحربي'],
    username: 'social_ministry',
    password: 'Gov2024!',
    region: 'الرياض',
    userCount: 85,
    packageType: 'custom',
    quota: 5000,
    consumed: 3200,
    remaining: 1800,
    surveys: 120,
    activeSurveys: 35,
    completedSurveys: 85,
    joinDate: '2023-11-10',
    status: 'active'
  },
  {
    id: '4',
    name: 'جامعة الأمير سلطان',
    type: 'educational',
    manager: ['د. سارة أحمد الزهراني'],
    username: 'psu_university',
    password: 'Education@123',
    region: 'الرياض',
    userCount: 24,
    packageType: 'professional',
    quota: 1500,
    consumed: 920,
    remaining: 580,
    surveys: 35,
    activeSurveys: 8,
    completedSurveys: 27,
    joinDate: '2024-03-05',
    status: 'active'
  },
  {
    id: '5',
    name: 'جمعية الأطفال المعوقين',
    type: 'nonprofit',
    manager: ['عبدالرحمان طالب الحربي'],
    username: 'disabled_children',
    password: 'Children@456',
    region: 'الدمام',
    userCount: 6,
    packageType: 'basic',
    quota: 500,
    consumed: 480,
    remaining: 20,
    surveys: 15,
    activeSurveys: 2,
    completedSurveys: 13,
    joinDate: '2023-12-18',
    status: 'pending'
  },
  {
    id: '6',
    name: 'شركة أرامكو السعودية',
    type: 'company',
    manager: ['منى عبدالعزيز الدوسري', 'أحمد سعد المطيري'],
    username: 'aramco_company',
    password: 'Aramco@789',
    region: 'الخبر',
    userCount: 120,
    packageType: 'custom',
    quota: 8000,
    consumed: 5400,
    remaining: 2600,
    surveys: 180,
    activeSurveys: 45,
    completedSurveys: 135,
    joinDate: '2024-01-08',
    status: 'inactive'
  }
];

type UserRole = 'super_admin' | 'admin' | 'org_manager' | 'beneficiary';

interface SuperAdminBeneficiariesPageProps {
  userRole: UserRole;
}

export function SuperAdminBeneficiariesPage({ userRole }: SuperAdminBeneficiariesPageProps) {
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [packageFilter, setPackageFilter] = useState<string>('all');

  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  // Form state for add/edit
  const [formData, setFormData] = useState<Partial<Organization>>({
    name: '',
    type: 'company',
    manager: [],
    username: '',
    password: '',
    region: '',
    userCount: 0,
    packageType: 'free',
    quota: 100,
    consumed: 0,
    status: 'active'
  });

  // Filter organizations
  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.manager.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || org.status === statusFilter;
    const matchesPackage = packageFilter === 'all' || org.packageType === packageFilter;
    return matchesSearch && matchesStatus && matchesPackage;
  });

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

  const getPackageBadgeColor = (packageType: string) => {
    switch (packageType) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'professional': return 'bg-purple-100 text-purple-800';
      case 'custom': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">نشط</Badge>;
      case 'inactive': return <Badge className="bg-red-100 text-red-800">معطل</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">معلق</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getUsagePercentage = (consumed: number, quota: number) => {
    return Math.round((consumed / quota) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-orange-600';
    return 'text-green-600';
  };

  // CRUD Operations
  const handleAddOrganization = () => {
    if (!formData.name || !formData.manager?.length || !formData.username || !formData.password || !formData.region) {
      toast.error('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    const newOrganization: Organization = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name!,
      type: formData.type || 'company',
      manager: formData.manager || [],
      username: formData.username!,
      password: formData.password!,
      region: formData.region!,
      userCount: formData.userCount || 0,
      packageType: formData.packageType || 'free',
      quota: formData.quota || 100,
      consumed: 0,
      remaining: formData.quota || 100,
      surveys: 0,
      activeSurveys: 0,
      completedSurveys: 0,
      joinDate: new Date().toISOString().split('T')[0],
      status: formData.status || 'active'
    };

    setOrganizations(prev => [newOrganization, ...prev]);
    setShowAddDialog(false);
    resetForm();
    toast.success('تم إضافة المنظمة بنجاح');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'company',
      manager: [],
      username: '',
      password: '',
      region: '',
      userCount: 0,
      packageType: 'free',
      quota: 100,
      consumed: 0,
      status: 'active'
    });
  };

  const openAddDialog = () => {
    resetForm();
    setShowAddDialog(true);
  };

  const openViewDialog = (org: Organization) => {
    setSelectedOrganization(org);
    setShowViewDialog(true);
  };

  const openEditDialog = (org: Organization) => {
    setSelectedOrganization(org);
    setFormData(org);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (org: Organization) => {
    setSelectedOrganization(org);
    setShowDeleteDialog(true);
  };

  const handleDeleteOrganization = () => {
    if (!selectedOrganization) return;

    setOrganizations(prev => prev.filter(org => org.id !== selectedOrganization.id));
    setShowDeleteDialog(false);
    setSelectedOrganization(null);
    toast.success('تم حذف المنظمة بنجاح');
  };

  // Calculate statistics for header
  const stats = [
    {
      title: 'إجمالي المنظمات',
      value: organizations.length,
      icon: Building2,
      color: 'text-blue-600'
    },
    {
      title: 'المنظمات النشطة',
      value: organizations.filter(org => org.status === 'active').length,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'إجمالي المستخدمين',
      value: organizations.reduce((sum, org) => sum + org.userCount, 0),
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'إجمالي الاستبيانات',
      value: organizations.reduce((sum, org) => sum + org.surveys, 0),
      icon: FileText,
      color: 'text-orange-600'
    }
  ];

  // Header stats content for EnhancedPageLayout
  const headerStats = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <stat.icon className="h-6 w-6 text-white" />
            <div>
              <div className="text-2xl font-bold text-white arabic-numbers">{stat.value}</div>
              <div className="text-blue-200">{stat.title}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <EnhancedPageLayout
      pageId="super-admin-beneficiaries"
      userRole={userRole}
      description="إدارة شاملة لجميع المنظمات عبر النظام مع إحصائيات تفصيلية"
      icon={<Shield className="h-8 w-8" />}
      headerContent={headerStats}
    >
      {/* شريط الأدوات العلوي */}
      <div className="mb-6 space-y-4">
        {/* الإجراءات والبحث */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              onClick={openAddDialog} 
              className="bg-[#183259] hover:bg-[#2a4a7a] text-white"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة منظمة جديدة
            </Button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* مربع البحث */}
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث عن منظمة أو مدير..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* فلتر الحالة */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">معطل</SelectItem>
                <SelectItem value="pending">معلق</SelectItem>
              </SelectContent>
            </Select>

            {/* فلتر نوع الاشتراك */}
            <Select value={packageFilter} onValueChange={setPackageFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="الاشتراك" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الخطط</SelectItem>
                <SelectItem value="free">مجاني</SelectItem>
                <SelectItem value="basic">أساسي</SelectItem>
                <SelectItem value="professional">احترافي</SelectItem>
                <SelectItem value="custom">مخصص</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* جدول البيانات */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right min-w-[200px]">اسم المنظمة</TableHead>
                  <TableHead className="text-right min-w-[150px]">النوع</TableHead>
                  <TableHead className="text-right min-w-[100px]">الحالة</TableHead>
                  <TableHead className="text-right min-w-[120px]">خطة الاشتراك</TableHead>
                  <TableHead className="text-right min-w-[200px]">مدير المنظمة</TableHead>
                  <TableHead className="text-right min-w-[100px]">عدد المستخدمين</TableHead>
                  <TableHead className="text-right min-w-[100px]">عدد الاستبيانات</TableHead>
                  <TableHead className="text-right min-w-[100px]">مستهلك</TableHead>
                  <TableHead className="text-right min-w-[100px]">باقي</TableHead>
                  <TableHead className="text-right min-w-[120px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrganizations.map((org) => {
                  const usagePercentage = getUsagePercentage(org.consumed, org.quota);
                  
                  return (
                    <TableRow key={org.id} className="hover:bg-gray-50">
                      {/* اسم المنظمة */}
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{org.name}</div>
                          <div className="text-sm text-gray-500">
                            انضم في {new Date(org.joinDate).toLocaleDateString('ar-SA')}
                          </div>
                        </div>
                      </TableCell>

                      {/* النوع */}
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {getTypeDisplayName(org.type)}
                        </Badge>
                      </TableCell>

                      {/* الحالة */}
                      <TableCell>
                        {getStatusBadge(org.status)}
                      </TableCell>

                      {/* خطة الاشتراك */}
                      <TableCell>
                        <Badge className={getPackageBadgeColor(org.packageType)}>
                          {getPackageDisplayName(org.packageType)}
                        </Badge>
                      </TableCell>

                      {/* مدير المنظمة */}
                      <TableCell>
                        <div className="space-y-1">
                          {org.manager.slice(0, 2).map((manager, index) => (
                            <Badge key={index} variant="secondary" className="text-xs mr-1 mb-1">
                              {manager}
                            </Badge>
                          ))}
                          {org.manager.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{org.manager.length - 2} آخرين
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* عدد المستخدمين */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{org.userCount}</span>
                        </div>
                      </TableCell>

                      {/* عدد الاستبيانات */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#183259]" />
                          <div>
                            <div className="font-medium text-[#183259]">{org.surveys}</div>
                            <div className="text-xs text-gray-500">
                              {org.activeSurveys} نشط
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* مستهلك */}
                      <TableCell>
                        <div>
                          <span className={`font-medium ${getUsageColor(usagePercentage)}`}>
                            {org.consumed.toLocaleString()}
                          </span>
                          <div className="text-xs text-gray-500">
                            {usagePercentage}%
                          </div>
                        </div>
                      </TableCell>

                      {/* باقي */}
                      <TableCell>
                        <span className="font-medium text-green-600">
                          {org.remaining.toLocaleString()}
                        </span>
                      </TableCell>

                      {/* الإجراءات */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => openViewDialog(org)}
                                  className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>عرض تفاصيل المنظمة</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => openEditDialog(org)}
                                  className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>تعديل بيانات المنظمة</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => openDeleteDialog(org)}
                                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>حذف المنظمة</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* رسالة عدم وجود نتائج */}
      {filteredOrganizations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منظمات</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' || packageFilter !== 'all'
                ? 'لم يتم العثور على منظمات تطابق معايير البحث'
                : 'لا توجد منظمات مسجلة في النظام حالياً'
              }
            </p>
            <Button onClick={openAddDialog} className="bg-[#183259] hover:bg-[#2a4a7a] text-white">
              <Plus className="h-4 w-4 ml-2" />
              إضافة منظمة جديدة
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog إضافة منظمة جديدة */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>إضافة منظمة جديدة</DialogTitle>
            <DialogDescription>
              أدخل بيانات المنظمة الجديدة التي ترغب في إضافتها للنظام
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم المنظمة *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="مثال: مؤسسة التنمية الاجتماعية"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">نوع المنظمة *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Organization['type'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع المنظمة" />
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
              <Label htmlFor="username">اسم المستخدم *</Label>
              <Input
                id="username"
                value={formData.username || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="مثال: social_dev_org"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="كلمة مرور قوية"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">المنطقة *</Label>
              <Input
                id="region"
                value={formData.region || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                placeholder="مثال: الرياض"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="packageType">خطة الاشتراك</Label>
              <Select 
                value={formData.packageType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, packageType: value as Organization['packageType'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر خطة الاشتراك" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">مجاني</SelectItem>
                  <SelectItem value="basic">أساسي</SelectItem>
                  <SelectItem value="professional">احترافي</SelectItem>
                  <SelectItem value="custom">مخصص</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddOrganization} className="bg-[#183259] hover:bg-[#2a4a7a] text-white">
              إضافة المنظمة
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog حذف المنظمة */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف منظمة "{selectedOrganization?.name}"؟
              هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              إلغاء
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteOrganization}
            >
              حذف المنظمة
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog عرض تفاصيل المنظمة */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>تفاصيل المنظمة</DialogTitle>
          </DialogHeader>
          {selectedOrganization && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">اسم المنظمة</Label>
                  <p className="text-lg font-medium">{selectedOrganization.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">النوع</Label>
                  <p>{getTypeDisplayName(selectedOrganization.type)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">الحالة</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedOrganization.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">خطة الاشتراك</Label>
                  <div className="mt-1">
                    <Badge className={getPackageBadgeColor(selectedOrganization.packageType)}>
                      {getPackageDisplayName(selectedOrganization.packageType)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">عدد المستخدمين</Label>
                  <p className="text-lg font-medium">{selectedOrganization.userCount}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">عدد الاستبيانات</Label>
                  <p className="text-lg font-medium">{selectedOrganization.surveys}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">مديرو المنظمة</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedOrganization.manager.map((manager, index) => (
                    <Badge key={index} variant="secondary">
                      {manager}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedOrganization.quota.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">الحصة الكاملة</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{selectedOrganization.consumed.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">المستهلك</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedOrganization.remaining.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">المتبقي</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </EnhancedPageLayout>
  );
}