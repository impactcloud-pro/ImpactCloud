import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Settings, 
  Target, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  AlertCircle,
  CheckCircle,
  Filter,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Hash
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { EnhancedPageLayout } from './EnhancedPageLayout';

interface DomainQuestion {
  id: string;
  text: string;
  type: 'text' | 'radio' | 'checkbox' | 'scale' | 'dropdown';
  timing: 'pre' | 'post' | 'both';
  options?: string[];
  optionRanks?: number[]; // Rankings for each option (1-10 scale)
  isRequired: boolean;
  isActive: boolean;
  createdAt: Date;
}

interface Domain {
  id: string;
  name: string;
  description: string;
  relatedQuestion: string;
  questionType: 'pre' | 'post' | 'both';
  isActive: boolean;
  createdAt: Date;
  questions: DomainQuestion[];
}

interface FilterItem {
  id: string;
  name: string;
  type: 'radio' | 'select' | 'checkbox';
  options: string[];
  optionRanks?: number[]; // Rankings for each option (1-10 scale)
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

// Initial data
const INITIAL_DOMAINS: Domain[] = [
  {
    id: '1',
    name: 'الصحة والبيئة',
    description: 'البرامج والمشاريع المتعلقة بالصحة العامة والبيئة',
    relatedQuestion: 'ما مدى تحسن حالتك الصحية؟',
    questionType: 'both',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    questions: [
      {
        id: 'q1_health',
        text: 'ما هو مستوى رضاك عن الخدمات الصحية المقدمة؟',
        type: 'scale',
        timing: 'both',
        isRequired: true,
        isActive: true,
        createdAt: new Date('2024-01-16')
      },
      {
        id: 'q2_health',
        text: 'هل تشعر بتحسن في نظافة البيئة المحيطة؟',
        type: 'radio',
        timing: 'post',
        options: ['نعم بشكل كبير', 'نعم قليلاً', 'لا تغيير', 'تراجع'],
        optionRanks: [10, 7, 3, 1],
        isRequired: false,
        isActive: true,
        createdAt: new Date('2024-01-17')
      }
    ]
  },
  {
    id: '2',
    name: 'التعليم والثقافة',
    description: 'المبادرات التعليمية والثقافية والتدريبية',
    relatedQuestion: 'ما هو مستواك التعليمي الحالي؟',
    questionType: 'pre',
    isActive: true,
    createdAt: new Date('2024-01-20'),
    questions: [
      {
        id: 'q1_education',
        text: 'ما هي المهارات التي تود تطويرها؟',
        type: 'checkbox',
        timing: 'pre',
        options: ['القراءة', 'الكتابة', 'الحاسوب', 'اللغة الإنجليزية', 'مهارات أخرى'],
        optionRanks: [8, 9, 10, 7, 5],
        isRequired: true,
        isActive: true,
        createdAt: new Date('2024-01-21')
      }
    ]
  },
  {
    id: '3',
    name: 'التمكين الاقتصادي',
    description: 'برامج التدريب المهني والدعم الاقتصادي',
    relatedQuestion: 'كم عدد المهارات المهنية التي تمتلكها؟',
    questionType: 'both',
    isActive: true,
    createdAt: new Date('2024-02-05'),
    questions: []
  },
  {
    id: '4',
    name: 'السكن والبنية التحتية',
    description: 'مشاريع الإسكان وتطوير البنية التحتية',
    relatedQuestion: 'ما هي حالة السكن الحالية؟',
    questionType: 'pre',
    isActive: true,
    createdAt: new Date('2024-02-10'),
    questions: []
  }
];

const INITIAL_FILTERS: FilterItem[] = [
  {
    id: '1',
    name: 'الجنس',
    type: 'radio',
    options: ['ذكر', 'أنثى'],
    optionRanks: [1, 2],
    description: 'تصنيف المستفيدين حسب الجنس',
    isActive: true,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '2',
    name: 'العمر',
    type: 'select',
    options: ['أقل من 25', '25-35', '35-45', 'أكثر من 45'],
    optionRanks: [1, 2, 3, 4],
    description: 'تصنيف المستفيدين حسب الفئة العمرية',
    isActive: true,
    createdAt: new Date('2024-01-12')
  },
  {
    id: '3',
    name: 'المستوى التعليمي',
    type: 'select',
    options: ['ابتدائي', 'متوسط', 'ثانوي', 'جامعي', 'دراسات عليا'],
    optionRanks: [1, 3, 5, 8, 10],
    description: 'تصنيف المستفيدين حسب التحصيل العلمي',
    isActive: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '4',
    name: 'الحالة الاجتماعية',
    type: 'radio',
    options: ['أعزب', 'متزوج', 'مطلق', 'أرمل'],
    optionRanks: [2, 1, 3, 4],
    description: 'تصنيف المستفيدين حسب الحالة الاجتماعية',
    isActive: true,
    createdAt: new Date('2024-01-18')
  },
  {
    id: '5',
    name: 'الحالة المهنية',
    type: 'checkbox',
    options: ['طالب', 'موظف', 'متقاعد', 'ربة منزل', 'عاطل', 'أعمال حرة'],
    optionRanks: [5, 10, 8, 6, 3, 9],
    description: 'تصنيف المستفيدين حسب وضعهم المهني',
    isActive: true,
    createdAt: new Date('2024-01-25')
  }
];

interface GlobalSurveySettingsPageProps {
  userRole: 'admin';
}

export function GlobalSurveySettingsPage({ userRole }: GlobalSurveySettingsPageProps) {
  const [domains, setDomains] = useState<Domain[]>(INITIAL_DOMAINS);
  const [filters, setFilters] = useState<FilterItem[]>(INITIAL_FILTERS);
  const [activeTab, setActiveTab] = useState('domains');
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());

  // Domain form states
  const [showDomainDialog, setShowDomainDialog] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [domainForm, setDomainForm] = useState({
    name: '',
    description: '',
    relatedQuestion: '',
    questionType: 'both' as 'pre' | 'post' | 'both',
    isActive: true
  });

  // Question form states
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<DomainQuestion | null>(null);
  const [currentDomainId, setCurrentDomainId] = useState<string>('');
  const [questionForm, setQuestionForm] = useState({
    text: '',
    type: 'text' as 'text' | 'radio' | 'checkbox' | 'scale' | 'dropdown',
    timing: 'both' as 'pre' | 'post' | 'both',
    options: [''],
    optionRanks: [1] as number[],
    isRequired: true,
    isActive: true
  });

  // Filter form states
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [editingFilter, setEditingFilter] = useState<FilterItem | null>(null);
  const [filterForm, setFilterForm] = useState({
    name: '',
    type: 'select' as 'radio' | 'select' | 'checkbox',
    options: [''],
    optionRanks: [1] as number[],
    description: '',
    isActive: true
  });

  // Domain management functions
  const handleAddDomain = () => {
    setEditingDomain(null);
    setDomainForm({
      name: '',
      description: '',
      relatedQuestion: '',
      questionType: 'both',
      isActive: true
    });
    setShowDomainDialog(true);
  };

  const handleEditDomain = (domain: Domain) => {
    setEditingDomain(domain);
    setDomainForm({
      name: domain.name,
      description: domain.description,
      relatedQuestion: domain.relatedQuestion,
      questionType: domain.questionType,
      isActive: domain.isActive
    });
    setShowDomainDialog(true);
  };

  const handleSaveDomain = () => {
    if (!domainForm.name.trim()) {
      toast.error('يرجى إدخال اسم المجال');
      return;
    }

    if (!domainForm.relatedQuestion.trim()) {
      toast.error('يرجى إدخال السؤال المرتبط');
      return;
    }

    if (editingDomain) {
      // Update existing domain
      setDomains(prev => prev.map(d => 
        d.id === editingDomain.id 
          ? {
              ...d,
              name: domainForm.name,
              description: domainForm.description,
              relatedQuestion: domainForm.relatedQuestion,
              questionType: domainForm.questionType,
              isActive: domainForm.isActive
            }
          : d
      ));
      toast.success('تم تحديث المجال بنجاح');
    } else {
      // Add new domain
      const newDomain: Domain = {
        id: `domain_${Date.now()}`,
        name: domainForm.name,
        description: domainForm.description,
        relatedQuestion: domainForm.relatedQuestion,
        questionType: domainForm.questionType,
        isActive: domainForm.isActive,
        createdAt: new Date(),
        questions: []
      };
      setDomains(prev => [...prev, newDomain]);
      toast.success('تم إضافة المجال بنجاح');
    }

    setShowDomainDialog(false);
  };

  const handleDeleteDomain = (domainId: string) => {
    setDomains(prev => prev.filter(d => d.id !== domainId));
    toast.success('تم حذف المجال');
  };

  const handleToggleDomainStatus = (domainId: string) => {
    setDomains(prev => prev.map(d => 
      d.id === domainId ? { ...d, isActive: !d.isActive } : d
    ));
    const domain = domains.find(d => d.id === domainId);
    toast.success(`تم ${domain?.isActive ? 'إلغاء تفعيل' : 'تفعيل'} المجال`);
  };

  // Filter management functions
  const handleAddFilter = () => {
    setEditingFilter(null);
    setFilterForm({
      name: '',
      type: 'select',
      options: [''],
      optionRanks: [1],
      description: '',
      isActive: true
    });
    setShowFilterDialog(true);
  };

  const handleEditFilter = (filter: FilterItem) => {
    setEditingFilter(filter);
    setFilterForm({
      name: filter.name,
      type: filter.type,
      options: [...filter.options],
      optionRanks: [...(filter.optionRanks || Array(filter.options.length).fill(1))],
      description: filter.description || '',
      isActive: filter.isActive
    });
    setShowFilterDialog(true);
  };

  const handleSaveFilter = () => {
    if (!filterForm.name.trim()) {
      toast.error('يرجى إدخال اسم الفلتر');
      return;
    }

    const validOptions = filterForm.options.filter(opt => opt.trim());
    if (validOptions.length === 0) {
      toast.error('يرجى إضافة خيار واحد على الأقل');
      return;
    }

    if (editingFilter) {
      // Update existing filter
      setFilters(prev => prev.map(f => 
        f.id === editingFilter.id 
          ? {
              ...f,
              name: filterForm.name,
              type: filterForm.type,
              options: validOptions,
              optionRanks: filterForm.optionRanks.slice(0, validOptions.length),
              description: filterForm.description,
              isActive: filterForm.isActive
            }
          : f
      ));
      toast.success('تم تحديث الفلتر بنجاح');
    } else {
      // Add new filter
      const newFilter: FilterItem = {
        id: `filter_${Date.now()}`,
        name: filterForm.name,
        type: filterForm.type,
        options: validOptions,
        optionRanks: filterForm.optionRanks.slice(0, validOptions.length),
        description: filterForm.description,
        isActive: filterForm.isActive,
        createdAt: new Date()
      };
      setFilters(prev => [...prev, newFilter]);
      toast.success('تم إضافة الفلتر بنجاح');
    }

    setShowFilterDialog(false);
  };

  const handleDeleteFilter = (filterId: string) => {
    setFilters(prev => prev.filter(f => f.id !== filterId));
    toast.success('تم حذف الفلتر');
  };

  const handleToggleFilterStatus = (filterId: string) => {
    setFilters(prev => prev.map(f => 
      f.id === filterId ? { ...f, isActive: !f.isActive } : f
    ));
    const filter = filters.find(f => f.id === filterId);
    toast.success(`تم ${filter?.isActive ? 'إلغاء تفعيل' : 'تفعيل'} الفلتر`);
  };

  // Question management functions
  const handleAddDomainQuestion = (domainId: string) => {
    setCurrentDomainId(domainId);
    setEditingQuestion(null);
    setQuestionForm({
      text: '',
      type: 'text',
      timing: 'both',
      options: [''],
      optionRanks: [1],
      isRequired: true,
      isActive: true
    });
    setShowQuestionDialog(true);
  };

  const handleEditDomainQuestion = (domainId: string, question: DomainQuestion) => {
    setCurrentDomainId(domainId);
    setEditingQuestion(question);
    const optionCount = question.options?.length || 1;
    setQuestionForm({
      text: question.text,
      type: question.type,
      timing: question.timing,
      options: question.options || [''],
      optionRanks: question.optionRanks || Array(optionCount).fill(1),
      isRequired: question.isRequired,
      isActive: question.isActive
    });
    setShowQuestionDialog(true);
  };

  const handleSaveDomainQuestion = () => {
    if (!questionForm.text.trim()) {
      toast.error('يرجى إدخال نص السؤال');
      return;
    }

    const needsOptions = ['radio', 'checkbox', 'dropdown'].includes(questionForm.type);
    if (needsOptions) {
      const validOptions = questionForm.options.filter(opt => opt.trim());
      if (validOptions.length === 0) {
        toast.error('يرجى إضافة خيار واحد على الأقل للسؤال');
        return;
      }
    }

    if (editingQuestion) {
      // Update existing question
      setDomains(prev => prev.map(domain => 
        domain.id === currentDomainId
          ? {
              ...domain,
              questions: domain.questions.map(q =>
                q.id === editingQuestion.id
                  ? {
                      ...q,
                      text: questionForm.text,
                      type: questionForm.type,
                      timing: questionForm.timing,
                      options: needsOptions ? questionForm.options.filter(opt => opt.trim()) : undefined,
                      optionRanks: needsOptions ? questionForm.optionRanks.slice(0, questionForm.options.filter(opt => opt.trim()).length) : undefined,
                      isRequired: questionForm.isRequired,
                      isActive: questionForm.isActive
                    }
                  : q
              )
            }
          : domain
      ));
      toast.success('تم تحديث السؤال بنجاح');
    } else {
      // Add new question
      const newQuestion: DomainQuestion = {
        id: `q_${Date.now()}`,
        text: questionForm.text,
        type: questionForm.type,
        timing: questionForm.timing,
        options: needsOptions ? questionForm.options.filter(opt => opt.trim()) : undefined,
        optionRanks: needsOptions ? questionForm.optionRanks.slice(0, questionForm.options.filter(opt => opt.trim()).length) : undefined,
        isRequired: questionForm.isRequired,
        isActive: questionForm.isActive,
        createdAt: new Date()
      };

      setDomains(prev => prev.map(domain =>
        domain.id === currentDomainId
          ? { ...domain, questions: [...domain.questions, newQuestion] }
          : domain
      ));
      toast.success('تم إضافة السؤال بنجاح');
    }

    setShowQuestionDialog(false);
  };

  const handleDeleteDomainQuestion = (domainId: string, questionId: string) => {
    setDomains(prev => prev.map(domain =>
      domain.id === domainId
        ? { ...domain, questions: domain.questions.filter(q => q.id !== questionId) }
        : domain
    ));
    toast.success('تم حذف السؤال');
  };

  const handleToggleQuestionStatus = (domainId: string, questionId: string) => {
    setDomains(prev => prev.map(domain =>
      domain.id === domainId
        ? {
            ...domain,
            questions: domain.questions.map(q =>
              q.id === questionId ? { ...q, isActive: !q.isActive } : q
            )
          }
        : domain
    ));
    
    const domain = domains.find(d => d.id === domainId);
    const question = domain?.questions.find(q => q.id === questionId);
    toast.success(`تم ${question?.isActive ? 'إلغاء تفعيل' : 'تفعيل'} السؤال`);
  };

  const toggleDomainExpansion = (domainId: string) => {
    setExpandedDomains(prev => {
      const newSet = new Set(prev);
      if (newSet.has(domainId)) {
        newSet.delete(domainId);
      } else {
        newSet.add(domainId);
      }
      return newSet;
    });
  };

  // Helper functions for filter form
  const handleAddOption = () => {
    setFilterForm(prev => ({ 
      ...prev, 
      options: [...prev.options, ''],
      optionRanks: [...prev.optionRanks, 1]
    }));
  };

  const handleUpdateOption = (index: number, value: string) => {
    setFilterForm(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const handleRemoveOption = (index: number) => {
    if (filterForm.options.length > 1) {
      setFilterForm(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
        optionRanks: prev.optionRanks.filter((_, i) => i !== index)
      }));
    }
  };

  const handleUpdateOptionRank = (index: number, rank: number) => {
    setFilterForm(prev => ({
      ...prev,
      optionRanks: prev.optionRanks.map((r, i) => i === index ? rank : r)
    }));
  };

  // Helper functions for question form
  const handleAddQuestionOption = () => {
    setQuestionForm(prev => ({ 
      ...prev, 
      options: [...prev.options, ''],
      optionRanks: [...prev.optionRanks, 1]
    }));
  };

  const handleUpdateQuestionOption = (index: number, value: string) => {
    setQuestionForm(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const handleRemoveQuestionOption = (index: number) => {
    if (questionForm.options.length > 1) {
      setQuestionForm(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
        optionRanks: prev.optionRanks.filter((_, i) => i !== index)
      }));
    }
  };

  const handleUpdateQuestionOptionRank = (index: number, rank: number) => {
    setQuestionForm(prev => ({
      ...prev,
      optionRanks: prev.optionRanks.map((r, i) => i === index ? rank : r)
    }));
  };

  const getQuestionTypeLabel = (type: 'pre' | 'post' | 'both') => {
    switch (type) {
      case 'pre': return 'قبلي';
      case 'post': return 'بعدي';
      case 'both': return 'قبلي وبعدي';
      default: return type;
    }
  };

  const getFilterTypeLabel = (type: 'radio' | 'select' | 'checkbox') => {
    switch (type) {
      case 'radio': return 'اختيار واحد';
      case 'select': return 'قائمة منسدلة';
      case 'checkbox': return 'اختيار متعدد';
      default: return type;
    }
  };

  const getQuestionTypeDisplayLabel = (type: string) => {
    switch (type) {
      case 'text': return 'نص حر';
      case 'radio': return 'اختيار واحد';
      case 'checkbox': return 'اختيار متعدد';
      case 'scale': return 'مقياس تقييم';
      case 'dropdown': return 'قائمة منسدلة';
      default: return type;
    }
  };

  // Header stats for EnhancedPageLayout
  const headerStats = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Target className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white arabic-numbers">{domains.length}</div>
            <div className="text-blue-200">إجمالي المجالات</div>
            <div className="text-xs text-blue-300 arabic-numbers">{domains.filter(d => d.isActive).length} مفعّل</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Filter className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white arabic-numbers">{filters.length}</div>
            <div className="text-blue-200">إجمالي الفلاتر</div>
            <div className="text-xs text-blue-300 arabic-numbers">{filters.filter(f => f.isActive).length} مفعّل</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white arabic-numbers">
              {domains.reduce((sum, d) => sum + d.questions.length, 0)}
            </div>
            <div className="text-blue-200">الأسئلة المرتبطة</div>
            <div className="text-xs text-blue-300">أسئلة في النظام</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white arabic-numbers">
              {Math.round(((domains.filter(d => d.isActive).length + filters.filter(f => f.isActive).length) / (domains.length + filters.length)) * 100)}%
            </div>
            <div className="text-blue-200">معدل التفعيل</div>
            <div className="text-xs text-blue-300">العناصر المفعّلة</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <EnhancedPageLayout
      pageId="global-survey-settings"
      userRole={userRole}
      description="إدارة وتخصيص المجالات والفلاتر المستخدمة في جميع الاستبيانات"
      icon={<Settings className="h-8 w-8" />}
      headerContent={headerStats}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="domains"
            className="data-[state=active]:bg-white data-[state=active]:text-[#183259] data-[state=active]:shadow-sm"
          >
            <Target className="h-4 w-4 mr-2" />
            إدارة المجالات
          </TabsTrigger>
          <TabsTrigger 
            value="filters"
            className="data-[state=active]:bg-white data-[state=active]:text-[#183259] data-[state=active]:shadow-sm"
          >
            <Filter className="h-4 w-4 mr-2" />
            إدارة الفلاتر
          </TabsTrigger>
        </TabsList>

        {/* Domains Tab */}
        <TabsContent value="domains" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  إدارة المجالات العامة
                </CardTitle>
                <Button onClick={handleAddDomain} className="bg-[#183259] hover:bg-[#2a4a7a]">
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة مجال جديد
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                إدارة المجالات المتاحة في جميع الاستبيانات والأسئلة المرتبطة بها
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {domains.map((domain) => (
                  <div key={domain.id} className="border rounded-lg overflow-hidden">
                    {/* Domain Header */}
                    <div className="bg-gray-50 p-4 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleDomainExpansion(domain.id)}
                            className="p-1"
                          >
                            {expandedDomains.has(domain.id) 
                              ? <ChevronDown className="h-4 w-4" />
                              : <ChevronRight className="h-4 w-4" />
                            }
                          </Button>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-lg">{domain.name}</h3>
                              <Badge 
                                variant="outline" 
                                className={`${
                                  domain.questionType === 'both' ? 'bg-purple-50 text-purple-700' :
                                  domain.questionType === 'pre' ? 'bg-blue-50 text-blue-700' :
                                  'bg-green-50 text-green-700'
                                }`}
                              >
                                {getQuestionTypeLabel(domain.questionType)}
                              </Badge>
                              <Badge className={domain.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {domain.isActive ? 'مفعّل' : 'معطّل'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{domain.description}</p>
                            <p className="text-sm text-gray-700 mt-1"><strong>السؤال المرتبط:</strong> {domain.relatedQuestion}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddDomainQuestion(domain.id)}
                            className="text-[#183259] hover:bg-[#183259] hover:text-white"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            إضافة سؤال مرتبط
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDomain(domain)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDomain(domain.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Domain Questions */}
                    {expandedDomains.has(domain.id) && (
                      <div className="p-4">
                        {domain.questions.length > 0 ? (
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                              <HelpCircle className="h-4 w-4" />
                              الأسئلة المرتبطة بالمجال ({domain.questions.length})
                            </h4>
                            {domain.questions.map((question) => (
                              <div key={question.id} className="bg-gray-50 rounded-lg p-3 border">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800 mb-2">{question.text}</p>
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="secondary" className="text-xs">
                                        {getQuestionTypeDisplayLabel(question.type)}
                                      </Badge>
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs ${
                                          question.timing === 'both' ? 'bg-purple-50 text-purple-700' :
                                          question.timing === 'pre' ? 'bg-blue-50 text-blue-700' :
                                          'bg-green-50 text-green-700'
                                        }`}
                                      >
                                        {getQuestionTypeLabel(question.timing)}
                                      </Badge>
                                      <Badge className={question.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                        {question.isActive ? 'مفعّل' : 'معطّل'}
                                      </Badge>
                                      {question.isRequired && (
                                        <Badge className="bg-red-100 text-red-800 text-xs">مطلوب</Badge>
                                      )}
                                    </div>
                                    {question.options && question.options.length > 0 && (
                                      <div className="mt-2">
                                        <p className="text-xs text-gray-500 mb-1">الخيارات المتاحة:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {question.options.map((option, idx) => (
                                            <Badge key={idx} variant="outline" className="text-xs">
                                              {option}
                                              {question.optionRanks?.[idx] && (
                                                <span className="mr-1 text-[#183259]">({question.optionRanks[idx]})</span>
                                              )}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditDomainQuestion(domain.id, question)}
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteDomainQuestion(domain.id, question.id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 py-8">
                            <HelpCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>لا توجد أسئلة مرتبطة بهذا المجال</p>
                            <p className="text-sm">انقر على "إضافة سؤال مرتبط" لإضافة أول سؤال</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Filters Tab */}
        <TabsContent value="filters" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  إدارة الفلاتر العامة
                </CardTitle>
                <Button onClick={handleAddFilter} className="bg-[#183259] hover:bg-[#2a4a7a]">
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة فلتر جديد
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                إدارة الفلاتر المتاحة لتصنيف المستفيدين في جميع الاستبيانات
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {filters.map((filter) => (
                  <Card key={filter.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-lg">{filter.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {getFilterTypeLabel(filter.type)}
                          </Badge>
                          <Badge className={filter.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {filter.isActive ? 'مفعّل' : 'معطّل'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditFilter(filter)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteFilter(filter.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {filter.description && (
                        <p className="text-sm text-gray-500 mb-3">{filter.description}</p>
                      )}
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 mb-1">الخيارات المتاحة:</p>
                        <div className="flex flex-wrap gap-1">
                          {filter.options.map((option, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {option}
                              {filter.optionRanks?.[idx] && (
                                <span className="mr-1 text-[#183259]">({filter.optionRanks[idx]})</span>
                              )}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Domain Dialog */}
      <Dialog open={showDomainDialog} onOpenChange={setShowDomainDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {editingDomain ? 'تعديل المجال' : 'إضافة مجال جديد'}
            </DialogTitle>
            <DialogDescription>
              {editingDomain 
                ? 'تعديل بيانات المجال الحالي وإعداداته'
                : 'إنشاء مجال جديد لتصنيف الأسئلة والاستبيانات'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="domainName">اسم المجال *</Label>
              <Input
                id="domainName"
                value={domainForm.name}
                onChange={(e) => setDomainForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="مثال: الصحة والبيئة"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="domainDescription">وصف المجال</Label>
              <Textarea
                id="domainDescription"
                value={domainForm.description}
                onChange={(e) => setDomainForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="وصف مختصر عن المجال والأهداف المرتبطة به"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relatedQuestion">السؤال المرتبط *</Label>
              <Input
                id="relatedQuestion"
                value={domainForm.relatedQuestion}
                onChange={(e) => setDomainForm(prev => ({ ...prev, relatedQuestion: e.target.value }))}
                placeholder="مثال: ما مدى تحسن حالتك الصحية؟"
              />
            </div>

            <div className="space-y-2">
              <Label>نوع السؤال</Label>
              <Select 
                value={domainForm.questionType}
                onValueChange={(value: 'pre' | 'post' | 'both') => 
                  setDomainForm(prev => ({ ...prev, questionType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre">قبلي</SelectItem>
                  <SelectItem value="post">بعدي</SelectItem>
                  <SelectItem value="both">قبلي وبعدي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="domainActive"
                checked={domainForm.isActive}
                onCheckedChange={(checked) => setDomainForm(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="domainActive">تفعيل المجال</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowDomainDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveDomain} className="bg-[#183259] hover:bg-[#2a4a7a]">
                <Save className="h-4 w-4 mr-2" />
                {editingDomain ? 'تحديث المجال' : 'إضافة المجال'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Question Dialog */}
      <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              {editingQuestion ? 'تعديل السؤال' : 'إضافة سؤال جديد'}
            </DialogTitle>
            <DialogDescription>
              {editingQuestion 
                ? 'تعديل بيانات السؤال وخياراته وإعدادات الترتيب'
                : 'إنشاء سؤال جديد مع تحديد نوعه والخيارات المتاحة وترتيبها'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="questionText">نص السؤال *</Label>
              <Textarea
                id="questionText"
                value={questionForm.text}
                onChange={(e) => setQuestionForm(prev => ({ ...prev, text: e.target.value }))}
                placeholder="اكتب نص السؤال هنا..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>نوع السؤال</Label>
                <Select 
                  value={questionForm.type}
                  onValueChange={(value: any) => 
                    setQuestionForm(prev => ({ ...prev, type: value, options: value !== 'text' && value !== 'scale' ? prev.options : [''] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">نص حر</SelectItem>
                    <SelectItem value="radio">اختيار واحد</SelectItem>
                    <SelectItem value="checkbox">اختيار متعدد</SelectItem>
                    <SelectItem value="dropdown">قائمة منسدلة</SelectItem>
                    <SelectItem value="scale">مقياس تقييم</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>توقيت السؤال</Label>
                <Select 
                  value={questionForm.timing}
                  onValueChange={(value: 'pre' | 'post' | 'both') => 
                    setQuestionForm(prev => ({ ...prev, timing: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pre">قبلي</SelectItem>
                    <SelectItem value="post">بعدي</SelectItem>
                    <SelectItem value="both">قبلي وبعدي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Options Section - Only for radio, checkbox, dropdown */}
            {['radio', 'checkbox', 'dropdown'].includes(questionForm.type) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>خيارات السؤال</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddQuestionOption}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة خيار
                  </Button>
                </div>

                <Alert>
                  <Hash className="h-4 w-4" />
                  <AlertDescription>
                    يمكنك تحديد ترتيب أو وزن لكل خيار من 1 إلى 10 لاستخدامه في حساب النتائج والتحليلات. 
                    الرقم الأعلى يعني تأثير أكبر في النتيجة.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  {questionForm.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                      <div className="flex-1">
                        <Input
                          value={option}
                          onChange={(e) => handleUpdateQuestionOption(index, e.target.value)}
                          placeholder={`الخيار ${index + 1}`}
                        />
                      </div>
                      
                      <div className="flex items-center gap-2 min-w-fit">
                        <Label className="text-sm font-medium text-gray-600 whitespace-nowrap">ترتيب:</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={questionForm.optionRanks[index] || 1}
                          onChange={(e) => handleUpdateQuestionOptionRank(index, parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                          placeholder="1"
                        />
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveQuestionOption(index)}
                        disabled={questionForm.options.length === 1}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="questionRequired"
                  checked={questionForm.isRequired}
                  onCheckedChange={(checked) => setQuestionForm(prev => ({ ...prev, isRequired: checked }))}
                />
                <Label htmlFor="questionRequired">سؤال مطلوب</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="questionActive"
                  checked={questionForm.isActive}
                  onCheckedChange={(checked) => setQuestionForm(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="questionActive">تفعيل السؤال</Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowQuestionDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveDomainQuestion} className="bg-[#183259] hover:bg-[#2a4a7a]">
                <Save className="h-4 w-4 mr-2" />
                {editingQuestion ? 'تحديث السؤال' : 'إضافة السؤال'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {editingFilter ? 'تعديل الفلتر' : 'إضافة فلتر جديد'}
            </DialogTitle>
            <DialogDescription>
              {editingFilter 
                ? 'تعديل بيانات الفلتر وخياراته وأوزان الترتيب'
                : 'إنشاء فلتر جديد لتصنيف المستفيدين مع تحديد الخيارات وأوزانها'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="filterName">اسم الفلتر *</Label>
              <Input
                id="filterName"
                value={filterForm.name}
                onChange={(e) => setFilterForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="مثال: الجنس، العمر، الحالة الاجتماعية"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterDescription">وصف الفلتر</Label>
              <Textarea
                id="filterDescription"
                value={filterForm.description}
                onChange={(e) => setFilterForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="وصف مختصر عن الغرض من هذا الفلتر"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>نوع الفلتر</Label>
              <Select 
                value={filterForm.type}
                onValueChange={(value: 'radio' | 'select' | 'checkbox') => 
                  setFilterForm(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="radio">اختيار واحد</SelectItem>
                  <SelectItem value="select">قائمة منسدلة</SelectItem>
                  <SelectItem value="checkbox">اختيار متعدد</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>خيارات الفلتر</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة خيار
                </Button>
              </div>

              {['radio', 'checkbox'].includes(filterForm.type) && (
                <Alert>
                  <Hash className="h-4 w-4" />
                  <AlertDescription>
                    يمكنك تحديد ترتيب أو وزن لكل خيار من 1 إلى 10 لاستخدامه في التحليلات والتقارير. 
                    الرقم الأعلى يعني أهمية أكبر في التصنيف.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                {filterForm.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                    <div className="flex-1">
                      <Input
                        value={option}
                        onChange={(e) => handleUpdateOption(index, e.target.value)}
                        placeholder={`الخيار ${index + 1}`}
                      />
                    </div>
                    
                    {['radio', 'checkbox'].includes(filterForm.type) && (
                      <div className="flex items-center gap-2 min-w-fit">
                        <Label className="text-sm font-medium text-gray-600 whitespace-nowrap">ترتيب:</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={filterForm.optionRanks[index] || 1}
                          onChange={(e) => handleUpdateOptionRank(index, parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                          placeholder="1"
                        />
                      </div>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOption(index)}
                      disabled={filterForm.options.length === 1}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="filterActive"
                checked={filterForm.isActive}
                onCheckedChange={(checked) => setFilterForm(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="filterActive">تفعيل الفلتر</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowFilterDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveFilter} className="bg-[#183259] hover:bg-[#2a4a7a]">
                <Save className="h-4 w-4 mr-2" />
                {editingFilter ? 'تحديث الفلتر' : 'إضافة الفلتر'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </EnhancedPageLayout>
  );
}