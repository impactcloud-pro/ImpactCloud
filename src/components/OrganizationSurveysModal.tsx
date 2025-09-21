import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { FileText, Calendar, Activity } from 'lucide-react';

interface Survey {
  id: string;
  title: string;
  createdDate: string;
  status: 'active' | 'completed' | 'draft' | 'paused';
  responses: number;
  type: string;
}

interface OrganizationSurveysModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationName: string;
  surveys: Survey[];
}

// Mock data for surveys
const mockSurveys: Record<string, Survey[]> = {
  '1': [
    {
      id: '1',
      title: 'استبيان رضا المستفيدين من البرامج الاجتماعية',
      createdDate: '2024-03-15',
      status: 'active',
      responses: 245,
      type: 'رضا'
    },
    {
      id: '2',
      title: 'تقييم أثر برنامج التأهيل المهني',
      createdDate: '2024-03-10',
      status: 'completed',
      responses: 189,
      type: 'تقييم أثر'
    },
    {
      id: '3',
      title: 'استطلاع احتياجات المجتمع المحلي',
      createdDate: '2024-03-05',
      status: 'active',
      responses: 78,
      type: 'احتياجات'
    },
    {
      id: '4',
      title: 'تقييم فعالية الورش التدريبية',
      createdDate: '2024-02-28',
      status: 'completed',
      responses: 156,
      type: 'تقييم'
    },
    {
      id: '5',
      title: 'استبيان التطوع والمشاركة المجتمعية',
      createdDate: '2024-02-20',
      status: 'active',
      responses: 94,
      type: 'مشاركة'
    }
  ],
  '2': [
    {
      id: '6',
      title: 'استبيان رضا الموظفين عن بيئة العمل',
      createdDate: '2024-03-18',
      status: 'active',
      responses: 156,
      type: 'رضا الموظفين'
    },
    {
      id: '7',
      title: 'تقييم فعالية برامج التدريب التقني',
      createdDate: '2024-03-12',
      status: 'completed',
      responses: 234,
      type: 'تدريب'
    },
    {
      id: '8',
      title: 'استطلاع الابتكار والتطوير في الشركة',
      createdDate: '2024-03-08',
      status: 'active',
      responses: 89,
      type: 'ابتكار'
    }
  ],
  '3': [
    {
      id: '9',
      title: 'استبيان رضا المواطنين عن الخدمات الحكومية',
      createdDate: '2024-03-20',
      status: 'active',
      responses: 567,
      type: 'خدمات حكومية'
    },
    {
      id: '10',
      title: 'تقييم برامج الدعم الاجتماعي',
      createdDate: '2024-03-15',
      status: 'active',
      responses: 423,
      type: 'دعم اجتماعي'
    },
    {
      id: '11',
      title: 'استطلاع احتياجات التنمية المجتمعية',
      createdDate: '2024-03-10',
      status: 'completed',
      responses: 789,
      type: 'تنمية'
    }
  ],
  '4': [
    {
      id: '12',
      title: 'استبيان تقييم الطلاب للمناهج الدراسية',
      createdDate: '2024-03-22',
      status: 'active',
      responses: 345,
      type: 'تعليم'
    },
    {
      id: '13',
      title: 'تقييم رضا أعضاء هيئة التدريس',
      createdDate: '2024-03-18',
      status: 'completed',
      responses: 67,
      type: 'رضا أكاديمي'
    }
  ],
  '5': [
    {
      id: '14',
      title: 'استبيان تقييم خدمات الأطفال ذوي الإعاقة',
      createdDate: '2024-03-16',
      status: 'active',
      responses: 112,
      type: 'خدمات خاصة'
    },
    {
      id: '15',
      title: 'تقييم برامج التأهيل والدمج',
      createdDate: '2024-03-12',
      status: 'completed',
      responses: 89,
      type: 'تأهيل'
    }
  ],
  '6': [
    {
      id: '16',
      title: 'استبيان السلامة والصحة المهنية',
      createdDate: '2024-03-25',
      status: 'active',
      responses: 890,
      type: 'سلامة'
    },
    {
      id: '17',
      title: 'تقييم برامج التطوير المهني',
      createdDate: '2024-03-20',
      status: 'active',
      responses: 456,
      type: 'تطوير مهني'
    },
    {
      id: '18',
      title: 'استطلاع الرضا الوظيفي والإنتاجية',
      createdDate: '2024-03-15',
      status: 'completed',
      responses: 678,
      type: 'رضا وظيفي'
    }
  ]
};

export function OrganizationSurveysModal({ 
  isOpen, 
  onClose, 
  organizationName,
  surveys 
}: OrganizationSurveysModalProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">نشط</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">مكتمل</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">مسودة</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">متوقف</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // است��دام البيانات التجريبية بناءً على اسم المنظمة
  const getSurveysForOrganization = (orgId: string): Survey[] => {
    return mockSurveys[orgId] || [];
  };

  // العثور على الاستبيانات بناءً على معرف المنظمة (مستخرج من الاسم)
  const orgId = organizationName === 'مؤسسة التنمية الاجتماعية' ? '1' :
               organizationName === 'شركة الابتكار التقني' ? '2' :
               organizationName === 'وزارة التنمية الاجتماعية' ? '3' :
               organizationName === 'جامعة الأمير سلطان' ? '4' :
               organizationName === 'جمعية الأطفال المعوقين' ? '5' :
               organizationName === 'شركة أرامكو السعودية' ? '6' : '1';

  const organizationSurveys = getSurveysForOrganization(orgId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#183259]" />
            استبيانات منظمة: {organizationName}
          </DialogTitle>
          <DialogDescription>
            عرض جميع الاستبيانات الخاصة بالمنظمة مع تفاصيل الحالة وعدد الردود
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[60vh]">
          {organizationSurveys.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right min-w-[300px]">اسم الاستبيان</TableHead>
                  <TableHead className="text-right min-w-[120px]">تاريخ الإنشاء</TableHead>
                  <TableHead className="text-right min-w-[100px]">الحالة</TableHead>
                  <TableHead className="text-right min-w-[100px]">الردود</TableHead>
                  <TableHead className="text-right min-w-[120px]">النوع</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizationSurveys.map((survey) => (
                  <TableRow key={survey.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <FileText className="h-4 w-4 text-[#183259] mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900 leading-5">
                            {survey.title}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {new Date(survey.createdDate).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {getStatusBadge(survey.status)}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{survey.responses}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {survey.type}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد استبيانات</h3>
              <p className="text-gray-600">
                لم يتم إنشاء أي استبيانات لهذه المنظمة بعد.
              </p>
            </div>
          )}
        </div>
        
        {organizationSurveys.length > 0 && (
          <div className="border-t pt-4 bg-gray-50 -mx-6 -mb-6 px-6 pb-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                إجمالي الاستبيانات: <span className="font-medium">{organizationSurveys.length}</span>
              </div>
              <div>
                النشطة: <span className="font-medium text-green-600">
                  {organizationSurveys.filter(s => s.status === 'active').length}
                </span>
                {' | '}
                المكتملة: <span className="font-medium text-blue-600">
                  {organizationSurveys.filter(s => s.status === 'completed').length}
                </span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}