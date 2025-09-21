import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  ArrowRight,
  FileText,
  Users,
  Calendar,
  Target,
  BarChart3,
  Edit,
  Share2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Building,
  Heart,
  GraduationCap,
  Settings
} from 'lucide-react';
import { EnhancedPageLayout } from './EnhancedPageLayout';

interface SurveyViewPageProps {
  surveyId: string;
  onBack: () => void;
  onEdit: (surveyId: string) => void;
  onViewResults: (surveyId: string) => void;
}

// Mock survey data
const mockSurvey = {
  id: 'survey-123',
  title: 'استبيان قياس الأثر الاجتماعي للبرامج التعليمية',
  organization: 'مؤسسة التنمية الاجتماعية',
  organizationEmail: 'info@social-dev.org',
  description: 'استبيان شامل لقياس أثر البرامج التعليمية على المستفيدين في مختلف المناطق والفئات العمرية.',
  status: 'active' as const,
  createdAt: new Date('2024-01-15'),
  responses: 156,
  totalBeneficiaries: 250,
  selectedSectors: ['education_culture', 'income_work'],
  selectedFilters: ['age', 'region', 'education', 'gender'],
  preQuestions: [
    {
      id: '1',
      text: 'ما هو مستواك التعليمي الحالي؟',
      type: 'single_choice',
      required: true,
      options: ['ابتدائي', 'متوسط', 'ثانوي', 'جامعي', 'دراسات عليا'],
      sector: 'education_culture'
    },
    {
      id: '2', 
      text: 'هل تعمل حالياً؟',
      type: 'single_choice',
      required: true,
      options: ['نعم', 'لا', 'أبحث عن عمل'],
      sector: 'income_work'
    },
    {
      id: '3',
      text: 'كيف تقيم مهاراتك الحالية؟',
      type: 'rating',
      required: true,
      sector: 'education_culture'
    }
  ],
  postQuestions: [
    {
      id: '4',
      text: 'هل تحسن مستواك التعليمي بعد البرنامج؟',
      type: 'single_choice',
      required: true,
      options: ['تحسن كثيراً', 'تحسن قليلاً', 'لم يتحسن', 'تراجع'],
      sector: 'education_culture'
    },
    {
      id: '5',
      text: 'هل حصلت على عمل بعد البرنامج؟',
      type: 'single_choice',
      required: true,
      options: ['نعم', 'لا، لكن حصلت على عروض', 'لا، ما زلت أبحث'],
      sector: 'income_work'
    },
    {
      id: '6',
      text: 'كيف تقيم مهاراتك بعد البرنامج؟',
      type: 'rating',
      required: true,
      sector: 'education_culture'
    },
    {
      id: '7',
      text: 'ما التحسينات التي لاحظتها؟',
      type: 'text',
      required: false,
      sector: 'education_culture'
    }
  ],
  beneficiaries: 250,
  settings: {
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    allowPartialResponses: true,
    requireBeneficiaryInfo: true,
    autoReminders: true,
    reminderFrequency: '7'
  }
};

const impactSectors = [
  {
    id: 'income_work',
    title: 'الدخل والعمل',
    icon: Briefcase,
    color: '#183259'
  },
  {
    id: 'housing_infrastructure', 
    title: 'الإسكان والبنية التحتية',
    icon: Building,
    color: '#2a4a7a'
  },
  {
    id: 'health_environment',
    title: 'الصحة والبيئة', 
    icon: Heart,
    color: '#4a6ba3'
  },
  {
    id: 'education_culture',
    title: 'التعليم والثقافة',
    icon: GraduationCap,
    color: '#6b85cc'
  }
];

const filters = [
  { id: 'gender', title: 'النوع' },
  { id: 'age', title: 'العمر' },
  { id: 'region', title: 'المنطقة' },
  { id: 'marital_status', title: 'الحالة الاجتماعية' },
  { id: 'education', title: 'التعليم' },
  { id: 'income', title: 'الدخل' },
  { id: 'program', title: 'البرنامج' },
  { id: 'participation', title: 'العلاقات والمشاركة' }
];

export function SurveyViewPage({ surveyId, onBack, onEdit, onViewResults }: SurveyViewPageProps) {
  const [currentView, setCurrentView] = useState<'overview' | 'questions' | 'settings'>('overview');

  const survey = mockSurvey; // In real app, fetch by surveyId

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 text-base px-4 py-2">نشط</Badge>;
      case 'draft':
        return <Badge variant="secondary" className="text-base px-4 py-2">مسودة</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-700 text-base px-4 py-2">مكتمل</Badge>;
      default:
        return <Badge variant="outline" className="text-base px-4 py-2">{status}</Badge>;
    }
  };

  const completionRate = Math.round((survey.responses / survey.totalBeneficiaries) * 100);

  // Header stats for the page layout
  const headerStats = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white arabic-numbers">{survey.responses}</div>
            <div className="text-blue-200">إجمالي الردود</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white arabic-numbers">{completionRate}%</div>
            <div className="text-blue-200">معدل الإكمال</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white arabic-numbers">{survey.preQuestions.length + survey.postQuestions.length}</div>
            <div className="text-blue-200">إجمالي الأسئلة</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Target className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white arabic-numbers">{survey.selectedSectors.length}</div>
            <div className="text-blue-200">مجالات الأثر</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <EnhancedPageLayout
      title="عرض الاستبيان"
      breadcrumbs={[
        { label: 'الاستبيانات', href: '#', onClick: onBack },
        { label: 'عرض الاستبيان', href: '#' }
      ]}
      headerContent={headerStats}
      icon={<Eye className="h-8 w-8" />}
      description="تفاصيل ومعلومات الاستبيان"
    >
      <div className="space-y-8">
        {/* Back Button and Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            رجوع
          </Button>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onViewResults(survey.id)}
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              عرض النتائج
            </Button>
            <Button
              onClick={() => onEdit(survey.id)}
              className="gap-2 bg-[#183259] hover:bg-[#2a4a7a]"
            >
              <Edit className="h-4 w-4" />
              تعديل
            </Button>
          </div>
        </div>

        {/* Survey Basic Info */}
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="border-b border-[#183259]/10 pb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl text-[#183259] mb-4">{survey.title}</CardTitle>
                <div className="flex items-center gap-6 text-base text-gray-600 mb-6">
                  <span className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {survey.organization}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {survey.createdAt.toLocaleDateString('ar-SA')}
                  </span>
                  {getStatusBadge(survey.status)}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">{survey.description}</p>
              </div>
            </div>
          </CardHeader>
        </Card>



        {/* Navigation Tabs */}
        <div className="flex gap-2 bg-[#183259]/5 p-2 rounded-2xl border border-[#183259]/10">
          <button
            onClick={() => setCurrentView('overview')}
            className={`flex-1 px-6 py-4 rounded-xl text-base font-semibold transition-all duration-200 ${
              currentView === 'overview'
                ? 'bg-[#183259] text-white shadow-lg'
                : 'text-[#183259] hover:bg-[#183259]/10'
            }`}
          >
            نظرة عامة
          </button>
          <button
            onClick={() => setCurrentView('questions')}
            className={`flex-1 px-6 py-4 rounded-xl text-base font-semibold transition-all duration-200 ${
              currentView === 'questions'
                ? 'bg-[#183259] text-white shadow-lg'
                : 'text-[#183259] hover:bg-[#183259]/10'
            }`}
          >
            الأسئلة
          </button>

        </div>

        {/* Content based on current view */}
        {currentView === 'overview' && (
          <div className="space-y-8">
            {/* Sectors */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="border-b border-[#183259]/10 pb-6">
                <CardTitle className="text-2xl text-[#183259]">مجالات الأثر المختارة</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {survey.selectedSectors.map(sectorId => {
                    const sector = impactSectors.find(s => s.id === sectorId);
                    if (!sector) return null;
                    
                    return (
                      <div key={sector.id} className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-2xl hover:border-[#183259]/30 transition-colors">
                        <div className="p-4 rounded-2xl" style={{ backgroundColor: `${sector.color}15` }}>
                          <sector.icon className="h-8 w-8" style={{ color: sector.color }} />
                        </div>
                        <span className="font-semibold text-lg">{sector.title}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="border-b border-[#183259]/10 pb-6">
                <CardTitle className="text-2xl text-[#183259]">الفلاتر المستخدمة</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-wrap gap-4">
                  {survey.selectedFilters.map(filterId => {
                    const filter = filters.find(f => f.id === filterId);
                    return filter ? (
                      <Badge key={filterId} variant="outline" className="text-base px-4 py-2 border-[#183259]/30 text-[#183259]">
                        {filter.title}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="border-b border-[#183259]/10 pb-6">
                <CardTitle className="text-2xl text-[#183259]">جدولة الاستبيان</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-lg">تاريخ البداية</p>
                      <p className="text-base text-gray-600 arabic-numbers">{new Date(survey.settings.startDate).toLocaleDateString('ar-SA')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-lg">تاريخ الانتهاء</p>
                      <p className="text-base text-gray-600 arabic-numbers">{new Date(survey.settings.endDate).toLocaleDateString('ar-SA')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === 'questions' && (
          <div className="space-y-8">
            {/* Pre Questions */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="border-b border-[#183259]/10 pb-6">
                <CardTitle className="text-2xl text-blue-600">الأسئلة القبلية ({survey.preQuestions.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {survey.preQuestions.map((question, index) => (
                    <div key={question.id} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-lg">{index + 1}. {question.text}</h4>
                        <div className="flex gap-3">
                          <Badge variant={question.required ? "default" : "outline"} className="text-sm px-3 py-1">
                            {question.required ? 'مطلوب' : 'اختياري'}
                          </Badge>
                          <Badge variant="secondary" className="text-sm px-3 py-1">
                            {question.type === 'text' ? 'نص' : 
                             question.type === 'rating' ? 'تقييم' :
                             question.type === 'single_choice' ? 'اختيار واحد' : 'اختيار متعدد'}
                          </Badge>
                        </div>
                      </div>
                      
                      {question.options && (
                        <div className="mt-4">
                          <p className="text-base text-gray-600 mb-3">الخيارات:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="text-base bg-gray-50 p-3 rounded-xl border">
                                {option}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Post Questions */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="border-b border-[#183259]/10 pb-6">
                <CardTitle className="text-2xl text-green-600">الأسئلة البعدية ({survey.postQuestions.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {survey.postQuestions.map((question, index) => (
                    <div key={question.id} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-green-300 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-lg">{index + 1}. {question.text}</h4>
                        <div className="flex gap-3">
                          <Badge variant={question.required ? "default" : "outline"} className="text-sm px-3 py-1">
                            {question.required ? 'مطلوب' : 'اختياري'}
                          </Badge>
                          <Badge variant="secondary" className="text-sm px-3 py-1">
                            {question.type === 'text' ? 'نص' : 
                             question.type === 'rating' ? 'تقييم' :
                             question.type === 'single_choice' ? 'اختيار واحد' : 'اختيار متعدد'}
                          </Badge>
                        </div>
                      </div>
                      
                      {question.options && (
                        <div className="mt-4">
                          <p className="text-base text-gray-600 mb-3">الخيارات:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="text-base bg-gray-50 p-3 rounded-xl border">
                                {option}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === 'settings' && (
          <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="border-b border-[#183259]/10 pb-6">
              <CardTitle className="flex items-center gap-4 text-2xl text-[#183259]">
                <div className="p-3 bg-[#183259] rounded-2xl">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                إعدادات الاستبيان
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h4 className="font-bold text-xl text-[#183259] mb-4">التواريخ</h4>
                  <div className="space-y-4 text-base">
                    <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">تاريخ البداية:</span>
                      <span className="font-semibold arabic-numbers">{new Date(survey.settings.startDate).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">تاريخ الانتهاء:</span>
                      <span className="font-semibold arabic-numbers">{new Date(survey.settings.endDate).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xl text-[#183259] mb-4">إعدادات الاستجابة</h4>
                  <div className="space-y-4 text-base">
                    <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">الردود الجزئية:</span>
                      <span className="font-semibold">{survey.settings.allowPartialResponses ? 'مسموحة' : 'غير مسموحة'}</span>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">معلومات المستفيد:</span>
                      <span className="font-semibold">{survey.settings.requireBeneficiaryInfo ? 'مطلوبة' : 'غير مطلوبة'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xl text-[#183259] mb-4">التذكيرات</h4>
                  <div className="space-y-4 text-base">
                    <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">التذكيرات التلقائية:</span>
                      <span className="font-semibold">{survey.settings.autoReminders ? 'مفعلة' : 'معطلة'}</span>
                    </div>
                    {survey.settings.autoReminders && (
                      <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
                        <span className="text-gray-600">تكرار التذكيرات:</span>
                        <span className="font-semibold arabic-numbers">كل {survey.settings.reminderFrequency} أيام</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xl text-[#183259] mb-4">معلومات إضافية</h4>
                  <div className="space-y-4 text-base">
                    <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">البريد الإلكتروني:</span>
                      <span className="font-semibold">{survey.organizationEmail || 'غير محدد'}</span>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">إجمالي المستفيدين:</span>
                      <span className="font-semibold arabic-numbers">{survey.beneficiaries}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </EnhancedPageLayout>
  );
}

export default SurveyViewPage;