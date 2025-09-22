import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { PageLayout } from './PageLayout';
import { 
  Building2, 
  Search, 
  Users,
  FileText,
  TrendingUp,
  Filter,
  Eye,
  BarChart3,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Survey } from '../App';

interface OrganizationSurveysPageProps {
  organizationId: string;
  onBack: () => void;
}

// Mock organization data - in real app this would come from a database
const mockOrganizations = {
  '1': {
    name: 'مؤسسة التنمية الاجتماعية',
    manager: 'أحمد محمد الشريف',
    region: 'الرياض'
  },
  '2': {
    name: 'جمعية البر الخيرية',
    manager: 'فاطمة سالم القحطاني',
    region: 'جدة'
  },
  '3': {
    name: 'مؤسسة الملك عبدالله للإسكان التنموي',
    manager: 'خالد إبراهيم العتيبي',
    region: 'الرياض'
  }
};

// Mock surveys data for organizations
const mockOrganizationSurveys: Record<string, Survey[]> = {
  '1': [
    {
      id: 'org1-survey-1',
      title: 'استبيان قياس الأثر الاجتماعي للبرامج التعليمية',
      organization: 'مؤسسة التنمية الاجتماعية',
      description: 'قياس أثر البرامج التعليمية على المستفيدين',
      selectedSectors: ['education_culture'],
      selectedFilters: ['age', 'gender'],
      preQuestions: [],
      postQuestions: [],
      beneficiaries: [],
      createdAt: new Date('2024-01-15'),
      status: 'active',
      responses: 45
    },
    {
      id: 'org1-survey-2',
      title: 'دراسة التمكين الاقتصادي للشباب',
      organization: 'مؤسسة التنمية الاجتماعية',
      description: 'تقييم برامج تدريب الشباب ودورها في تحسين فرص العمل',
      selectedSectors: ['income_work'],
      selectedFilters: ['age', 'education'],
      preQuestions: [],
      postQuestions: [],
      beneficiaries: [],
      createdAt: new Date('2024-02-01'),
      status: 'active',
      responses: 32
    },
    {
      id: 'org1-survey-3',
      title: 'استبيان تقييم البرامج الصحية',
      organization: 'مؤسسة التنمية الاجتماعية',
      description: 'قياس أثر البرامج الصحية والتوعوية',
      selectedSectors: ['health_environment'],
      selectedFilters: ['age', 'gender', 'region'],
      preQuestions: [],
      postQuestions: [],
      beneficiaries: [],
      createdAt: new Date('2024-01-28'),
      status: 'completed',
      responses: 78
    }
  ],
  '2': [
    {
      id: 'org2-survey-1',
      title: 'استبيان تقييم برامج الدعم الأسري',
      organization: 'جمعية البر الخيرية',
      description: 'تقييم فعالية برامج الدعم الأسري والاجتماعي',
      selectedSectors: ['income_work', 'health_environment'],
      selectedFilters: ['marital_status', 'income'],
      preQuestions: [],
      postQuestions: [],
      beneficiaries: [],
      createdAt: new Date('2024-02-10'),
      status: 'active',
      responses: 23
    }
  ],
  '3': [
    {
      id: 'org3-survey-1',
      title: 'دراسة أثر مشاريع الإسكان التنموي',
      organization: 'مؤسسة الملك عبدالله للإسكان التنموي',
      description: 'تقييم شامل لمشاريع الإسكان وأثرها على جودة الحياة',
      selectedSectors: ['housing_infrastructure'],
      selectedFilters: ['region', 'income', 'marital_status'],
      preQuestions: [],
      postQuestions: [],
      beneficiaries: [],
      createdAt: new Date('2023-12-15'),
      status: 'completed',
      responses: 156
    },
    {
      id: 'org3-survey-2',
      title: 'استبيان رضا المستفيدين من خدمات الإسكان',
      organization: 'مؤسسة الملك عبدالله للإسكان التنموي',
      description: 'قياس مستوى رضا المستفيدين من الخدمات المقدمة',
      selectedSectors: ['housing_infrastructure'],
      selectedFilters: ['region', 'marital_status'],
      preQuestions: [],
      postQuestions: [],
      beneficiaries: [],
      createdAt: new Date('2024-01-05'),
      status: 'active',
      responses: 87
    }
  ]
};

export function OrganizationSurveysPage({ organizationId, onBack }: OrganizationSurveysPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const organization = mockOrganizations[organizationId as keyof typeof mockOrganizations];
  const surveys = mockOrganizationSurveys[organizationId] || [];

  // Filter surveys
  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || survey.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 ml-1" />
            نشط
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 ml-1" />
            مسودة
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <CheckCircle className="h-3 w-3 ml-1" />
            مكتمل
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="h-3 w-3 ml-1" />
            {status}
          </Badge>
        );
    }
  };

  const stats = [
    {
      title: 'إجمالي الاستبيانات',
      value: surveys.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'الاستبيانات النشطة',
      value: surveys.filter(s => s.status === 'active').length,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'الاستبيانات المكتملة',
      value: surveys.filter(s => s.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'إجمالي الردود',
      value: surveys.reduce((sum, s) => sum + s.responses, 0),
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const headerStats = (
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
  );

  if (!organization) {
    return (
      <PageLayout
        title="استبيانات المنظمة"
        description="عرض استبيانات المنظمة المحددة"
        icon={<Building2 className="h-8 w-8" />}
      >
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">المنظمة غير موجودة</h3>
          <p className="text-gray-600 mb-6">لم يتم العثور على المنظمة المطلوبة</p>
          <Button onClick={onBack}>
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة إلى المنظمات
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={`استبيانات ${organization.name}`}
      description="عرض وإدارة استبيانات المنظمة"
      icon={<FileText className="h-8 w-8" />}
      headerContent={headerStats}
    >
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة إلى المنظمات
          </Button>
          <div>
            <h2 className="text-xl font-semibold">{organization.name}</h2>
            <p className="text-sm text-gray-600">
              المدير: {organization.manager} • المنطقة: {organization.region}
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="البحث في الاستبيانات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">المرشحات:</span>
              </div>
              
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="draft">مسودة</option>
                <option value="completed">مكتمل</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">عنوان الاستبيان</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                <TableHead className="text-right">المجالات</TableHead>
                <TableHead className="text-right">عدد الردود</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSurveys.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{survey.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {survey.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{survey.createdAt.toLocaleDateString('ar-SA')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {survey.selectedSectors.slice(0, 2).map((sector, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {sector === 'education_culture' ? 'التعليم' :
                           sector === 'income_work' ? 'الدخل' :
                           sector === 'health_environment' ? 'الصحة' :
                           sector === 'housing_infrastructure' ? 'الإسكان' : sector}
                        </Badge>
                      ))}
                      {survey.selectedSectors.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{survey.selectedSectors.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{survey.responses}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(survey.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast.info('سيتم فتح تفاصيل الاستبيان')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast.info('سيتم فتح نتائج الاستبيان')}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredSurveys.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'لا توجد نتائج' : 'لا توجد استبيانات'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'لم يتم العثور على استبيانات تطابق معايير البحث'
                : 'لم تقم هذه المنظمة بإنشاء أي استبيانات بعد'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
}