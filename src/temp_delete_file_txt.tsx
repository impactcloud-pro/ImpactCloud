// OrganizationSurveysPage.tsx content
import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { PageLayout } from './components/PageLayout';
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
import { Survey } from './App';

interface OrganizationSurveysPageProps {
  organizationId: string;
  onBack: () => void;
}

const mockOrganizations = {
  '1': { name: 'مؤسسة التنمية الاجتماعية', manager: 'أحمد محمد الشريف', region: 'الرياض' },
  '2': { name: 'جمعية البر الخيرية', manager: 'فاطمة سالم القحطاني', region: 'جدة' },
  '3': { name: 'مؤسسة الملك عبدالله للإسكان التنموي', manager: 'خالد إبراهيم العتيبي', region: 'الرياض' }
};

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
    }
  ]
};

export function OrganizationSurveysPage({ organizationId, onBack }: OrganizationSurveysPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const organization = mockOrganizations[organizationId as keyof typeof mockOrganizations];
  const surveys = mockOrganizationSurveys[organizationId] || [];

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || survey.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!organization) {
    return (
      <PageLayout title="استبيانات المنظمة" description="عرض استبيانات المنظمة المحددة" icon={<Building2 className="h-8 w-8" />}>
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">المنظمة غير موجودة</h3>
          <Button onClick={onBack}><ArrowLeft className="h-4 w-4 ml-2" />العودة إلى المنظمات</Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`استبيانات ${organization.name}`} description="عرض وإدارة استبيانات المنظمة" icon={<FileText className="h-8 w-8" />}>
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 ml-2" />العودة إلى المنظمات
          </Button>
          <div>
            <h2 className="text-xl font-semibold">{organization.name}</h2>
            <p className="text-sm text-gray-600">المدير: {organization.manager} • المنطقة: {organization.region}</p>
          </div>
        </div>
      </div>

      <Card>
        <div className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">عنوان الاستبيان</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
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
                      <div className="text-sm text-gray-500">{survey.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{survey.createdAt.toLocaleDateString('ar-SA')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{survey.responses}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 ml-1" />نشط
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm"><BarChart3 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </PageLayout>
  );
}