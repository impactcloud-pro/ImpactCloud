import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { PageLayout } from './PageLayout';
import { 
  Search,
  Plus,
  Building,
  Users,
  Eye,
  Edit,
  Ban,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  Mail,
  Phone,
  MapPin,
  FileText,
  TrendingUp,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Organization {
  id: string;
  name: string;
  type: 'NGO' | 'CSR' | 'Gov';
  email: string;
  phone?: string;
  address?: string;
  description?: string;
  status: 'Active' | 'Suspended' | 'Pending';
  subscriptionPlan: 'Basic' | 'Professional' | 'Enterprise';
  startDate: string;
  totalSurveys: number;
  activeSurveys: number; // إضافة عدد الاستبيانات النشطة
  totalBeneficiaries: number;
  contactPerson?: string;
  website?: string;
}

const demoOrganizations: Organization[] = [
  {
    id: '1',
    name: 'مؤسسة الخير الإنساني',
    type: 'NGO',
    email: 'contact@khair.org',
    phone: '+966501234567',
    address: 'الرياض، المملكة العربية السعودية',
    description: 'مؤسسة خيرية تهدف إلى تقديم المساعدة الإنسانية للمحتاجين',
    status: 'Active',
    subscriptionPlan: 'Professional',
    startDate: '2024-01-15',
    totalSurveys: 25,
    activeSurveys: 20,
    totalBeneficiaries: 1200,
    contactPerson: 'أحمد محمد الخير',
    website: 'https://khair.org'
  },
  {
    id: '2',
    name: 'شركة المسؤولية الاجتماعية',
    type: 'CSR',
    email: 'csr@company.com',
    phone: '+966507654321',
    address: 'جدة، المملكة العربية السعودية',
    description: 'شركة تركز على برامج المسؤولية الاجتماعية وخدمة المجتمع',
    status: 'Active',
    subscriptionPlan: 'Enterprise',
    startDate: '2023-11-20',
    totalSurveys: 40,
    activeSurveys: 35,
    totalBeneficiaries: 2500,
    contactPerson: 'فاطمة أحمد العلي',
    website: 'https://company.com'
  },
  {
    id: '3',
    name: 'وزارة التنمية الاجتماعية',
    type: 'Gov',
    email: 'social@gov.sa',
    phone: '+966112345678',
    address: 'الرياض، المملكة العربية السعودية',
    description: 'جهة حكومية تعنى بالتنمية الاجتماعية ورعاية المحتاجين',
    status: 'Active',
    subscriptionPlan: 'Enterprise',
    startDate: '2023-08-10',
    totalSurveys: 65,
    activeSurveys: 60,
    totalBeneficiaries: 5000,
    contactPerson: 'محمد عبدالله الأحمد',
    website: 'https://gov.sa'
  },
  {
    id: '4',
    name: 'جمعية الرعاية الصحية',
    type: 'NGO',
    email: 'health@care.org',
    phone: '+966509876543',
    address: 'الدمام، المملكة العربية السعودية',
    description: 'جمعية تركز على تقديم الرعاية الصحية للمحتاجين',
    status: 'Suspended',
    subscriptionPlan: 'Basic',
    startDate: '2024-02-28',
    totalSurveys: 8,
    activeSurveys: 5,
    totalBeneficiaries: 300,
    contactPerson: 'سارة خالد الحسن',
    website: 'https://healthcare.org'
  },
  {
    id: '5',
    name: 'مؤسسة التعليم للجميع',
    type: 'NGO',
    email: 'education@forall.org',
    phone: '+966505555555',
    address: 'المدينة المنورة، المملكة العربية السعودية',
    description: 'مؤسسة تهتم بتوفير التعليم المجاني للجميع',
    status: 'Pending',
    subscriptionPlan: 'Professional',
    startDate: '2024-03-05',
    totalSurveys: 0,
    activeSurveys: 0,
    totalBeneficiaries: 0,
    contactPerson: 'عبدالرحمن علي السالم',
    website: 'https://educationforall.org'
  }
];

export function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>(demoOrganizations);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  
  const [newOrg, setNewOrg] = useState({
    name: '',
    type: 'NGO' as Organization['type'],
    email: '',
    phone: '',
    address: '',
    description: '',
    subscriptionPlan: 'Basic' as Organization['subscriptionPlan'],
    contactPerson: '',
    website: ''
  });

  const [editOrgData, setEditOrgData] = useState({
    name: '',
    type: 'NGO' as Organization['type'],
    email: '',
    phone: '',
    address: '',
    description: '',
    subscriptionPlan: 'Basic' as Organization['subscriptionPlan'],
    contactPerson: '',
    website: '',
    status: 'Active' as Organization['status']
  });

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || org.type === filterType;
    const matchesStatus = filterStatus === 'all' || org.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddOrganization = () => {
    if (!newOrg.name || !newOrg.email) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const organization: Organization = {
      id: (organizations.length + 1).toString(),
      name: newOrg.name,
      type: newOrg.type,
      email: newOrg.email,
      phone: newOrg.phone,
      address: newOrg.address,
      description: newOrg.description,
      status: 'Pending',
      subscriptionPlan: newOrg.subscriptionPlan,
      startDate: new Date().toISOString().split('T')[0],
      totalSurveys: 0,
      activeSurveys: 0,
      totalBeneficiaries: 0,
      contactPerson: newOrg.contactPerson,
      website: newOrg.website
    };

    setOrganizations([...organizations, organization]);
    setNewOrg({
      name: '',
      type: 'NGO',
      email: '',
      phone: '',
      address: '',
      description: '',
      subscriptionPlan: 'Basic',
      contactPerson: '',
      website: ''
    });
    setIsAddDialogOpen(false);
    toast.success('تم إضافة المنظمة بنجاح');
  };

  const handleViewOrganization = (org: Organization) => {
    setSelectedOrg(org);
    setIsViewDialogOpen(true);
  };

  const handleEditOrganization = (org: Organization) => {
    setEditingOrg(org);
    setEditOrgData({
      name: org.name,
      type: org.type,
      email: org.email,
      phone: org.phone || '',
      address: org.address || '',
      description: org.description || '',
      subscriptionPlan: org.subscriptionPlan,
      contactPerson: org.contactPerson || '',
      website: org.website || '',
      status: org.status
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteOrganization = (orgId: string) => {
    const orgToDelete = organizations.find(org => org.id === orgId);
    if (!orgToDelete) return;

    setOrganizations(organizations.filter(org => org.id !== orgId));
    toast.success(`تم حذف المنظمة "${orgToDelete.name}" بنجاح من النظام`);
  };

  const handleSaveEditOrganization = () => {
    if (!editingOrg) return;

    if (!editOrgData.name || !editOrgData.email) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setOrganizations(organizations.map(org =>
      org.id === editingOrg.id ? {
        ...org,
        name: editOrgData.name,
        type: editOrgData.type,
        email: editOrgData.email,
        phone: editOrgData.phone,
        address: editOrgData.address,
        description: editOrgData.description,
        subscriptionPlan: editOrgData.subscriptionPlan,
        contactPerson: editOrgData.contactPerson,
        website: editOrgData.website,
        status: editOrgData.status
      } : org
    ));

    setIsEditDialogOpen(false);
    setEditingOrg(null);
    toast.success('تم تحديث بيانات المنظمة بنجاح');
  };

  const handleStatusChange = (orgId: string, newStatus: Organization['status']) => {
    setOrganizations(organizations.map(org => 
      org.id === orgId ? { ...org, status: newStatus } : org
    ));
    toast.success(`تم تحديث حالة المنظمة إلى ${newStatus === 'Active' ? 'نشطة' : newStatus === 'Suspended' ? 'معلقة' : 'في الانتظار'}`);
  };

  const getStatusIcon = (status: Organization['status']) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Suspended':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: Organization['status']) => {
    const statusConfig = {
      Active: { label: 'نشطة', variant: 'default' as const },
      Suspended: { label: 'معلقة', variant: 'destructive' as const },
      Pending: { label: 'في الانتظار', variant: 'secondary' as const }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeLabel = (type: Organization['type']) => {
    const typeLabels = {
      NGO: 'منظمة غير ربحية',
      CSR: 'مسؤولية اجتماعية',
      Gov: 'جهة حكومية'
    };
    return typeLabels[type];
  };

  const getPlanLabel = (plan: Organization['subscriptionPlan']) => {
    const planLabels = {
      Basic: 'أساسي',
      Professional: 'احترافي',
      Enterprise: 'مؤسسي'
    };
    return planLabels[plan];
  };

  const headerStats = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Building className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{organizations.length}</div>
            <div className="text-blue-200">إجمالي المنظمات</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{organizations.filter(o => o.status === 'Active').length}</div>
            <div className="text-blue-200">منظمات نشطة</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{organizations.reduce((sum, o) => sum + o.totalSurveys, 0)}</div>
            <div className="text-blue-200">إجمالي الاستبيانات</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{organizations.reduce((sum, o) => sum + o.totalBeneficiaries, 0).toLocaleString()}</div>
            <div className="text-blue-200">إجمالي المستفيدين</div>
          </div>
        </div>
      </div>
    </div>
  );

  const filtersAndActions = (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="البحث في المنظمات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="نوع المنظمة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            <SelectItem value="NGO">منظمة غير ربحية</SelectItem>
            <SelectItem value="CSR">مسؤولية اجتماعية</SelectItem>
            <SelectItem value="Gov">جهة حكومية</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="Active">نشطة</SelectItem>
            <SelectItem value="Suspended">معلقة</SelectItem>
            <SelectItem value="Pending">في الانتظار</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#183259] hover:bg-[#2a4a7a]">
            <Plus className="h-4 w-4 ml-2" />
            إضافة منظمة
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة منظمة جديدة</DialogTitle>
            <DialogDescription>
              يرجى ملء جميع الحقول المطلوبة لإضافة المنظمة.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">اسم المنظمة</Label>
              <Input
                id="name"
                value={newOrg.name}
                onChange={(e) => setNewOrg({...newOrg, name: e.target.value})}
                placeholder="أدخل اسم المنظمة"
              />
            </div>
            <div>
              <Label htmlFor="type">نوع المنظمة</Label>
              <Select value={newOrg.type} onValueChange={(value) => setNewOrg({...newOrg, type: value as Organization['type']})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGO">منظمة غير ربحية</SelectItem>
                  <SelectItem value="CSR">مسؤولية اجتماعية</SelectItem>
                  <SelectItem value="Gov">جهة حكومية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={newOrg.email}
                onChange={(e) => setNewOrg({...newOrg, email: e.target.value})}
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>
            <div>
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                type="tel"
                value={newOrg.phone}
                onChange={(e) => setNewOrg({...newOrg, phone: e.target.value})}
                placeholder="أدخل رقم الهاتف"
              />
            </div>
            <div>
              <Label htmlFor="address">العنوان</Label>
              <Input
                id="address"
                value={newOrg.address}
                onChange={(e) => setNewOrg({...newOrg, address: e.target.value})}
                placeholder="أدخل العنوان"
              />
            </div>
            <div>
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={newOrg.description}
                onChange={(e) => setNewOrg({...newOrg, description: e.target.value})}
                placeholder="أدخل الوصف"
              />
            </div>
            <div>
              <Label htmlFor="contactPerson">اسم جهة الاتصال</Label>
              <Input
                id="contactPerson"
                value={newOrg.contactPerson}
                onChange={(e) => setNewOrg({...newOrg, contactPerson: e.target.value})}
                placeholder="أدخل اسم جهة الاتصال"
              />
            </div>
            <div>
              <Label htmlFor="website">الموقع الإلكتروني</Label>
              <Input
                id="website"
                type="url"
                value={newOrg.website}
                onChange={(e) => setNewOrg({...newOrg, website: e.target.value})}
                placeholder="أدخل الموقع الإلكتروني"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddOrganization} className="flex-1 bg-[#183259] hover:bg-[#2a4a7a]">
                إضافة المنظمة
              </Button>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <PageLayout
      title="إدارة المنظمات"
      description="إدارة شاملة لجميع المنظمات المسجلة في النظام"
      icon={<Building className="h-8 w-8" />}
      headerContent={headerStats}
    >
      {filtersAndActions}

      {/* Organizations Table */}
      <Card>
        <CardHeader>
          <CardTitle>المنظمات المسجلة ({filteredOrganizations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم المنظمة</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>خطة الاشتراك</TableHead>
                <TableHead>تاريخ التسجيل</TableHead>
                <TableHead>الاستبيانات</TableHead>
                <TableHead>المستفيدون</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrganizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{org.name}</div>
                      <div className="text-sm text-gray-500">{org.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeLabel(org.type)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(org.status)}
                      {getStatusBadge(org.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getPlanLabel(org.subscriptionPlan)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(org.startDate).toLocaleDateString('ar-SA')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium">{org.activeSurveys}/{org.totalSurveys}</div>
                      <div className="text-xs text-gray-500">نشطة/إجمالي</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium">{org.totalBeneficiaries.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">مستفيد</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewOrganization(org)}
                        title="عرض التفاصيل"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditOrganization(org)}
                        title="تعديل"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {org.status === 'Active' ? (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleStatusChange(org.id, 'Suspended')}
                          title="إيقاف"
                        >
                          <Ban className="h-4 w-4 text-red-600" />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleStatusChange(org.id, 'Active')}
                          title="تفعيل"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      {/* Delete Organization Button */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            title="حذف المنظمة"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                              تأكيد حذف المنظمة
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              هل أنت متأكد من رغبتك في حذف المنظمة "{org.name}" من النظام؟
                              <br /><br />
                              <span className="text-red-600 font-medium">تحذير:</span> سيتم حذف جميع البيانات المرتبطة بهذه المنظمة بما في ذلك:
                              <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>{org.totalSurveys} استبيان</li>
                                <li>{org.totalBeneficiaries.toLocaleString()} مستفيد</li>
                                <li>جميع النتائج والتحليلات المرتبطة</li>
                              </ul>
                              <br />
                              هذا الإجراء لا يمكن التراجع عنه.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteOrganization(org.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Trash2 className="h-4 w-4 ml-2" />
                              حذف المنظمة
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Organization Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              تفاصيل المنظمة
            </DialogTitle>
            <DialogDescription>
              عرض تفاصيل شاملة للمنظمة المحددة
            </DialogDescription>
          </DialogHeader>
          {selectedOrg && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">اسم المنظمة</Label>
                  <p className="mt-1 text-sm">{selectedOrg.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">نوع المنظمة</Label>
                  <p className="mt-1 text-sm">{getTypeLabel(selectedOrg.type)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">البريد الإلكتروني</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{selectedOrg.email}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">رقم الهاتف</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{selectedOrg.phone || 'غير محدد'}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">الحالة</Label>
                  <div className="mt-1 flex items-center gap-2">
                    {getStatusIcon(selectedOrg.status)}
                    {getStatusBadge(selectedOrg.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">خطة الاشتراك</Label>
                  <div className="mt-1">
                    <Badge variant="outline">{getPlanLabel(selectedOrg.subscriptionPlan)}</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">تاريخ التسجيل</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{new Date(selectedOrg.startDate).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">جهة الاتصال</Label>
                  <p className="mt-1 text-sm">{selectedOrg.contactPerson || 'غير محدد'}</p>
                </div>
              </div>
              
              {selectedOrg.address && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">العنوان</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{selectedOrg.address}</p>
                  </div>
                </div>
              )}
              
              {selectedOrg.description && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">الوصف</Label>
                  <p className="mt-1 text-sm text-gray-600">{selectedOrg.description}</p>
                </div>
              )}
              
              {selectedOrg.website && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">الموقع الإلكتروني</Label>
                  <p className="mt-1 text-sm">
                    <a href={selectedOrg.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {selectedOrg.website}
                    </a>
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#183259]">{selectedOrg.totalSurveys}</div>
                  <div className="text-sm text-gray-600">إجمالي الاستبيانات</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#183259]">{selectedOrg.totalBeneficiaries.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">إجمالي المستفيدين</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Organization Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              تعديل بيانات المنظمة
            </DialogTitle>
            <DialogDescription>
              قم بتعديل بيانات المنظمة وحفظ التغييرات
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">اسم المنظمة *</Label>
                <Input
                  id="edit-name"
                  value={editOrgData.name}
                  onChange={(e) => setEditOrgData({...editOrgData, name: e.target.value})}
                  placeholder="أدخل اسم المنظمة"
                />
              </div>
              <div>
                <Label htmlFor="edit-type">نوع المنظمة</Label>
                <Select value={editOrgData.type} onValueChange={(value) => setEditOrgData({...editOrgData, type: value as Organization['type']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NGO">منظمة غير ربحية</SelectItem>
                    <SelectItem value="CSR">مسؤولية اجتماعية</SelectItem>
                    <SelectItem value="Gov">جهة حكومية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-email">البريد الإلكتروني *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editOrgData.email}
                  onChange={(e) => setEditOrgData({...editOrgData, email: e.target.value})}
                  placeholder="أدخل البريد الإلكتروني"
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">رقم الهاتف</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={editOrgData.phone}
                  onChange={(e) => setEditOrgData({...editOrgData, phone: e.target.value})}
                  placeholder="أدخل رقم الهاتف"
                />
              </div>
              <div>
                <Label htmlFor="edit-status">الحالة</Label>
                <Select value={editOrgData.status} onValueChange={(value) => setEditOrgData({...editOrgData, status: value as Organization['status']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">نشطة</SelectItem>
                    <SelectItem value="Suspended">معلقة</SelectItem>
                    <SelectItem value="Pending">في الانتظار</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-plan">خطة الاشتراك</Label>
                <Select value={editOrgData.subscriptionPlan} onValueChange={(value) => setEditOrgData({...editOrgData, subscriptionPlan: value as Organization['subscriptionPlan']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">أساسي</SelectItem>
                    <SelectItem value="Professional">احترافي</SelectItem>
                    <SelectItem value="Enterprise">مؤسسي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-address">العنوان</Label>
              <Input
                id="edit-address"
                value={editOrgData.address}
                onChange={(e) => setEditOrgData({...editOrgData, address: e.target.value})}
                placeholder="أدخل العنوان"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">الوصف</Label>
              <Textarea
                id="edit-description"
                value={editOrgData.description}
                onChange={(e) => setEditOrgData({...editOrgData, description: e.target.value})}
                placeholder="أدخل الوصف"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-contactPerson">اسم جهة الاتصال</Label>
              <Input
                id="edit-contactPerson"
                value={editOrgData.contactPerson}
                onChange={(e) => setEditOrgData({...editOrgData, contactPerson: e.target.value})}
                placeholder="أدخل اسم جهة الاتصال"
              />
            </div>
            <div>
              <Label htmlFor="edit-website">الموقع الإلكتروني</Label>
              <Input
                id="edit-website"
                type="url"
                value={editOrgData.website}
                onChange={(e) => setEditOrgData({...editOrgData, website: e.target.value})}
                placeholder="أدخل الموقع الإلكتروني"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSaveEditOrganization} className="flex-1 bg-[#183259] hover:bg-[#2a4a7a]">
              <Save className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </Button>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
              إلغاء
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}