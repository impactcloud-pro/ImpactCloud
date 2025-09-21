import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,  AlertDialogTitle } from './ui/alert-dialog';
import { Textarea } from './ui/textarea';
import { 
  Search,
  Plus,
  Users,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  User,
  Download,
  FileSpreadsheet,
  UserPlus,
  Filter,
  MoreHorizontal,
  Calendar,
  Briefcase,
  Activity,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { EnhancedPageLayout } from './EnhancedPageLayout';
import { toast } from 'sonner@2.0.3';

interface Beneficiary {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  status: 'active' | 'inactive' | 'pending';
  jobTitle: string;
  surveyCount: number;
  completedSurveys: number;
  incompleteSurveys: number;
  joinDate: string;
  lastActivity: string;
}

const mockBeneficiaries: Beneficiary[] = [
  {
    id: '1',
    name: 'سارة أحمد الشريف',
    email: 'sara.ahmed@example.com',
    phone: '+966501234567',
    age: 28,
    status: 'active',
    jobTitle: 'محاسبة',
    surveyCount: 5,
    completedSurveys: 3,
    incompleteSurveys: 2,
    joinDate: '2024-01-15',
    lastActivity: '2025-01-13'
  },
  {
    id: '2',
    name: 'محمد عبدالله القحطاني',
    email: 'mohammed.abdullah@example.com',
    phone: '+966502345678',
    age: 35,
    status: 'active',
    jobTitle: 'مطور برمجيات',
    surveyCount: 8,
    completedSurveys: 6,
    incompleteSurveys: 2,
    joinDate: '2024-02-20',
    lastActivity: '2025-01-12'
  },
  {
    id: '3',
    name: 'فاطمة سالم النجار',
    email: 'fatima.salem@example.com',
    phone: '+966503456789',
    age: 31,
    status: 'active',
    jobTitle: 'مديرة مشاريع',
    surveyCount: 7,
    completedSurveys: 5,
    incompleteSurveys: 2,
    joinDate: '2024-01-10',
    lastActivity: '2025-01-11'
  },
  {
    id: '4',
    name: 'عبدالرحمن محمد الدوسري',
    email: 'abdulrahman.mohammed@example.com',
    phone: '+966504567890',
    age: 26,
    status: 'pending',
    jobTitle: 'مصمم جرافيكي',
    surveyCount: 4,
    completedSurveys: 4,
    incompleteSurveys: 0,
    joinDate: '2024-03-05',
    lastActivity: '2025-01-10'
  },
  {
    id: '5',
    name: 'نورا خالد العتيبي',
    email: 'nora.khaled@example.com',
    phone: '+966505678901',
    age: 29,
    status: 'inactive',
    jobTitle: 'أخصائية موارد بشرية',
    surveyCount: 6,
    completedSurveys: 3,
    incompleteSurveys: 3,
    joinDate: '2023-12-18',
    lastActivity: '2024-12-25'
  },
  {
    id: '6',
    name: 'أحمد يوسف الحربي',
    email: 'ahmed.youssef@example.com',
    phone: '+966506789012',
    age: 33,
    status: 'active',
    jobTitle: 'مهندس مدني',
    surveyCount: 9,
    completedSurveys: 7,
    incompleteSurveys: 2,
    joinDate: '2024-01-08',
    lastActivity: '2025-01-13'
  },
  {
    id: '7',
    name: 'ريم محمد الزهراني',
    email: 'reem.mohammed@example.com',
    phone: '+966507890123',
    age: 27,
    status: 'active',
    jobTitle: 'طبيبة',
    surveyCount: 3,
    completedSurveys: 2,
    incompleteSurveys: 1,
    joinDate: '2024-04-12',
    lastActivity: '2025-01-12'
  },
  {
    id: '8',
    name: 'خالد عبدالعزيز المطيري',
    email: 'khaled.abdulaziz@example.com',
    phone: '+966508901234',
    age: 38,
    status: 'active',
    jobTitle: 'مدير تسويق',
    surveyCount: 12,
    completedSurveys: 10,
    incompleteSurveys: 2,
    joinDate: '2023-11-20',
    lastActivity: '2025-01-13'
  }
];

interface OrganizationBeneficiariesPageProps {
  onViewSurveys?: (beneficiaryId: string) => void;
}

export function OrganizationBeneficiariesPage({ onViewSurveys }: OrganizationBeneficiariesPageProps) {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(mockBeneficiaries);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ageFilter, setAgeFilter] = useState<string>('all');
  
  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);

  // Form state for add/edit
  const [formData, setFormData] = useState<Partial<Beneficiary>>({
    name: '',
    email: '',
    phone: '',
    age: 0,
    status: 'active',
    jobTitle: ''
  });

  // Filter beneficiaries
  const filteredBeneficiaries = beneficiaries.filter(beneficiary => {
    const matchesSearch = 
      beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.phone.includes(searchTerm) ||
      beneficiary.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || beneficiary.status === statusFilter;
    
    let matchesAge = true;
    if (ageFilter === '18-25') {
      matchesAge = beneficiary.age >= 18 && beneficiary.age <= 25;
    } else if (ageFilter === '26-35') {
      matchesAge = beneficiary.age >= 26 && beneficiary.age <= 35;
    } else if (ageFilter === '36-45') {
      matchesAge = beneficiary.age >= 36 && beneficiary.age <= 45;
    } else if (ageFilter === '46+') {
      matchesAge = beneficiary.age >= 46;
    }
    
    return matchesSearch && matchesStatus && matchesAge;
  });

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'pending': return 'في الانتظار';
      default: return status;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="h-4 w-4" />;
      case 'inactive': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  // CRUD Operations
  const handleAddBeneficiary = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.age || !formData.jobTitle) {
      toast.error('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    // Check for duplicate email
    const emailExists = beneficiaries.some(beneficiary => beneficiary.email === formData.email);
    if (emailExists) {
      toast.error('البريد الإلكتروني مستخدم بالفعل');
      return;
    }

    const newBeneficiary: Beneficiary = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name!,
      email: formData.email!,
      phone: formData.phone!,
      age: formData.age!,
      status: formData.status as Beneficiary['status'] || 'active',
      jobTitle: formData.jobTitle!,
      surveyCount: 0,
      completedSurveys: 0,
      incompleteSurveys: 0,
      joinDate: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0]
    };

    setBeneficiaries(prev => [newBeneficiary, ...prev]);
    setShowAddDialog(false);
    resetForm();
    toast.success('تم إضافة المستفيد بنجاح');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: 0,
      status: 'active',
      jobTitle: ''
    });
  };

  const openViewDialog = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setShowViewDialog(true);
  };

  const openEditDialog = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setFormData(beneficiary);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setShowDeleteDialog(true);
  };

  const handleEditBeneficiary = () => {
    if (!selectedBeneficiary || !formData.name || !formData.email || !formData.phone || !formData.age || !formData.jobTitle) {
      toast.error('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    // Check for duplicate email with other beneficiaries
    const emailExists = beneficiaries.some(beneficiary => 
      beneficiary.id !== selectedBeneficiary.id && beneficiary.email === formData.email
    );
    if (emailExists) {
      toast.error('البريد الإلكتروني مستخدم بالفعل');
      return;
    }

    setBeneficiaries(prev => 
      prev.map(beneficiary => 
        beneficiary.id === selectedBeneficiary.id 
          ? { ...beneficiary, ...formData } as Beneficiary
          : beneficiary
      )
    );

    setShowEditDialog(false);
    setSelectedBeneficiary(null);
    resetForm();
    toast.success('تم تحديث بيانات المستفيد بنجاح');
  };

  const handleDeleteBeneficiary = () => {
    if (!selectedBeneficiary) return;

    setBeneficiaries(prev => prev.filter(beneficiary => beneficiary.id !== selectedBeneficiary.id));
    setShowDeleteDialog(false);
    setSelectedBeneficiary(null);
    toast.success('تم حذف المستفيد بنجاح');
  };

  // Export to Excel function
  const handleExportToExcel = () => {
    try {
      const headers = [
        'الاسم',
        'البريد الإلكتروني', 
        'رقم الهاتف',
        'العمر',
        'الحالة',
        'المسمى الوظيفي',
        'عدد الاستبيانات',
        'الاستبيانات المكتملة',
        'الاستبيانات غير المكتملة',
        'تاريخ الانضمام',
        'آخر نشاط'
      ];

      const csvContent = [
        headers.join(','),
        ...filteredBeneficiaries.map(beneficiary => [
          `"${beneficiary.name}"`,
          `"${beneficiary.email}"`,
          `"${beneficiary.phone}"`,
          beneficiary.age,
          `"${getStatusDisplayName(beneficiary.status)}"`,
          `"${beneficiary.jobTitle}"`,
          beneficiary.surveyCount,
          beneficiary.completedSurveys,
          beneficiary.incompleteSurveys,
          new Date(beneficiary.joinDate).toLocaleDateString('ar-SA'),
          new Date(beneficiary.lastActivity).toLocaleDateString('ar-SA')
        ].join(','))
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `beneficiaries_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('تم تصدير بيانات المستفيدين بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ في تصدير البيانات');
    }
  };

  const stats = [
    {
      title: 'إجمالي المستفيدين',
      value: beneficiaries.length,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'المستفيدين النشطين',
      value: beneficiaries.filter(b => b.status === 'active').length,
      icon: CheckCircle2,
      color: 'text-green-600'
    },
    {
      title: 'إجمالي الاستبيانات',
      value: beneficiaries.reduce((sum, b) => sum + b.surveyCount, 0),
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      title: 'الاستبيانات المكتملة',
      value: beneficiaries.reduce((sum, b) => sum + b.completedSurveys, 0),
      icon: CheckCircle2,
      color: 'text-green-600'
    }
  ];

  return (
    <EnhancedPageLayout
      pageId="beneficiaries"
      userRole="org_manager"
      description="إدارة المستفيدين ومتابعة مشاركتهم في الاستبيانات"
      icon={<Users className="h-8 w-8" />}
      headerContent={
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <stat.icon className="h-6 w-6 text-white" />
                <div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-blue-200">{stat.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    >
      {/* شريط الأدوات العلوي */}
      <div className="mb-6 space-y-4">
        {/* الإجراءات والبحث */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setShowAddDialog(true)} 
              className="bg-[#183259] hover:bg-[#2a4a7a] text-white"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة مستفيد جديد
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleExportToExcel}
              className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-500"
            >
              <FileSpreadsheet className="h-4 w-4 ml-2" />
              تصدير إلى Excel
            </Button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* مربع البحث */}
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث بالاسم أو البريد أو الهاتف أو المسمى الوظيفي..."
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
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
              </SelectContent>
            </Select>

            {/* فلتر العمر */}
            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="العمر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأعمار</SelectItem>
                <SelectItem value="18-25">18-25</SelectItem>
                <SelectItem value="26-35">26-35</SelectItem>
                <SelectItem value="36-45">36-45</SelectItem>
                <SelectItem value="46+">46+</SelectItem>
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
                  <TableHead className="text-right min-w-[200px]">الاسم</TableHead>
                  <TableHead className="text-right min-w-[250px]">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right min-w-[150px]">رقم الهاتف</TableHead>
                  <TableHead className="text-right min-w-[80px]">العمر</TableHead>
                  <TableHead className="text-right min-w-[100px]">الحالة</TableHead>
                  <TableHead className="text-right min-w-[200px]">المسمى الوظيفي</TableHead>
                  <TableHead className="text-right min-w-[120px]">عدد الاستبيانات</TableHead>
                  <TableHead className="text-right min-w-[120px]">المكتملة</TableHead>
                  <TableHead className="text-right min-w-[120px]">غير المكتملة</TableHead>
                  <TableHead className="text-right min-w-[120px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBeneficiaries.map((beneficiary) => (
                  <TableRow key={beneficiary.id} className="hover:bg-gray-50">
                    {/* الاسم */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#183259] text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {beneficiary.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{beneficiary.name}</div>
                          <div className="text-sm text-gray-500">
                            انضم في {new Date(beneficiary.joinDate).toLocaleDateString('ar-SA')}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* البريد الإلكتروني */}
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{beneficiary.email}</span>
                      </div>
                    </TableCell>

                    {/* رقم الهاتف */}
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{beneficiary.phone}</span>
                      </div>
                    </TableCell>

                    {/* العمر */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{beneficiary.age}</span>
                      </div>
                    </TableCell>

                    {/* الحالة */}
                    <TableCell>
                      <Badge className={getStatusBadgeColor(beneficiary.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(beneficiary.status)}
                          {getStatusDisplayName(beneficiary.status)}
                        </div>
                      </Badge>
                    </TableCell>

                    {/* المسمى الوظيفي */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span>{beneficiary.jobTitle}</span>
                      </div>
                    </TableCell>

                    {/* عدد الاستبيانات */}
                    <TableCell>
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#183259]">{beneficiary.surveyCount}</div>
                        <div className="text-xs text-gray-500">استبيان</div>
                      </div>
                    </TableCell>

                    {/* المكتملة */}
                    <TableCell>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{beneficiary.completedSurveys}</div>
                        <div className="text-xs text-gray-500">مكتمل</div>
                      </div>
                    </TableCell>

                    {/* غير المكتملة */}
                    <TableCell>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">{beneficiary.incompleteSurveys}</div>
                        <div className="text-xs text-gray-500">غير مكتمل</div>
                      </div>
                    </TableCell>

                    {/* الإجراءات */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openViewDialog(beneficiary)}
                          title="عرض التفاصيل"
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditDialog(beneficiary)}
                          title="تعديل"
                          className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openDeleteDialog(beneficiary)}
                          title="حذف"
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* رسالة عدم وجود نتائج */}
      {filteredBeneficiaries.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مستفيدين</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' || ageFilter !== 'all'
                ? 'لم يتم العثور على مستفيدين يطابقون معايير البحث'
                : 'لا توجد مستفيدين مسجلين في المنظمة حالياً'
              }
            </p>
            <Button onClick={() => setShowAddDialog(true)} className="bg-[#183259] hover:bg-[#2a4a7a] text-white">
              <Plus className="h-4 w-4 ml-2" />
              إضافة مستفيد جديد
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog إضافة مستفيد جديد */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>إضافة مستفيد جديد</DialogTitle>
            <DialogDescription>
              أدخل بيانات المستفيد الجديد لإضافته إلى المنظمة
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="مثال: أحمد محمد الشريف"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="مثال: ahmed@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف *</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="مثال: +966501234567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">العمر *</Label>
              <Input
                id="age"
                type="number"
                min="18"
                max="100"
                value={formData.age || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                placeholder="مثال: 30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">المسمى الوظيفي *</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                placeholder="مثال: مطور برمجيات"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">الحالة</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Beneficiary['status'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                  <SelectItem value="pending">في الانتظار</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddBeneficiary} className="bg-[#183259] hover:bg-[#2a4a7a] text-white">
              إضافة المستفيد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog عرض تفاصيل المستفيد */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>تفاصيل المستفيد</DialogTitle>
          </DialogHeader>
          {selectedBeneficiary && (
            <div className="space-y-6">
              {/* معلومات أساسية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">الاسم الكامل</Label>
                    <p className="text-lg font-medium">{selectedBeneficiary.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">البريد الإلكتروني</Label>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {selectedBeneficiary.email}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">رقم الهاتف</Label>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {selectedBeneficiary.phone}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">العمر</Label>
                    <p className="text-lg font-medium">{selectedBeneficiary.age} سنة</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">المسمى الوظيفي</Label>
                    <p className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      {selectedBeneficiary.jobTitle}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">الحالة</Label>
                    <div className="mt-1">
                      <Badge className={getStatusBadgeColor(selectedBeneficiary.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(selectedBeneficiary.status)}
                          {getStatusDisplayName(selectedBeneficiary.status)}
                        </div>
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* إحصائيات الاستبيانات */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#183259]">{selectedBeneficiary.surveyCount}</p>
                  <p className="text-sm text-gray-500">إجمالي الاستبيانات</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedBeneficiary.completedSurveys}</p>
                  <p className="text-sm text-gray-500">المكتملة</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{selectedBeneficiary.incompleteSurveys}</p>
                  <p className="text-sm text-gray-500">غير المكتملة</p>
                </div>
              </div>

              {/* تواريخ */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm font-medium text-gray-500">تاريخ الانضمام</Label>
                  <p>{new Date(selectedBeneficiary.joinDate).toLocaleDateString('ar-SA')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">آخر نشاط</Label>
                  <p>{new Date(selectedBeneficiary.lastActivity).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog تعديل المستفيد */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تعديل بيانات المستفيد</DialogTitle>
            <DialogDescription>
              قم بتعديل بيانات المستفيد حسب الحاجة
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">الاسم الكامل *</Label>
              <Input
                id="edit-name"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="مثال: أحمد محمد الشريف"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">البريد الإلكتروني *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="مثال: ahmed@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">رقم الهاتف *</Label>
              <Input
                id="edit-phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="مثال: +966501234567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-age">العمر *</Label>
              <Input
                id="edit-age"
                type="number"
                min="18"
                max="100"
                value={formData.age || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                placeholder="مثال: 30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-jobTitle">المسمى الوظيفي *</Label>
              <Input
                id="edit-jobTitle"
                value={formData.jobTitle || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                placeholder="مثال: مطور برمجيات"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">الحالة</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Beneficiary['status'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                  <SelectItem value="pending">في الانتظار</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleEditBeneficiary} className="bg-[#183259] hover:bg-[#2a4a7a] text-white">
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog حذف المستفيد */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رغبتك في حذف المستفيد "{selectedBeneficiary?.name}"؟
              هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteBeneficiary}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف المستفيد
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </EnhancedPageLayout>
  );
}