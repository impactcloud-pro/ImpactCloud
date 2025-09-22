import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  FileText,
  Users,
  Target,
  Eye,
  Save,
  CheckCircle,
  AlertCircle,
  Edit,
  Lock,
  X,
  Filter,
  Settings,
  Upload,
  Download,
  User,
  Mail,
  Phone,
  UserPlus,
  FileSpreadsheet,
  Calendar,
  Clock
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { Survey } from '../App';

interface SurveyCreationWizardProps {
  onBack: () => void;
  onSurveyCreated: (survey: Survey) => void;
  userRole?: 'admin' | 'org_manager';
}

// Mock organizations data for super admin dropdown
const ORGANIZATIONS = [
  {
    id: 'org_1',
    name: 'جمعية الخير للتنمية الاجتماعية',
    email: 'info@alkhayr.org',
    website: 'https://www.alkhayr.org',
    logo: 'https://via.placeholder.com/100x100/183259/white?text=جمعية+الخير'
  },
  {
    id: 'org_2', 
    name: 'مؤسسة الأمل للرعاية الصحية',
    email: 'contact@alamal-health.org',
    website: 'https://www.alamal-health.org',
    logo: 'https://via.placeholder.com/100x100/22c55e/white?text=مؤسسة+الأمل'
  },
  {
    id: 'org_3',
    name: 'جمعية المستقبل للتعليم والثقافة', 
    email: 'info@future-education.org',
    website: 'https://www.future-education.org',
    logo: 'https://via.placeholder.com/100x100/3b82f6/white?text=جمعية+المستقبل'
  },
  {
    id: 'org_4',
    name: 'مؤسسة البناء للإسكان والتطوير',
    email: 'support@albinaa.org', 
    website: 'https://www.albinaa.org',
    logo: 'https://via.placeholder.com/100x100/f59e0b/white?text=مؤسسة+البناء'
  },
  {
    id: 'org_5',
    name: 'جمعية الرحمة للعمل الخيري',
    email: 'admin@alrahma-charity.org',
    website: 'https://www.alrahma-charity.org', 
    logo: 'https://via.placeholder.com/100x100/ef4444/white?text=جمعية+الرحمة'
  }
];

// Pre-defined filters - org managers cannot add new ones, admins can modify
const INITIAL_FILTERS = [
  { id: '1', name: 'الجنس', type: 'radio', options: ['ذكر', 'أنثى'], isActive: true },
  { id: '2', name: 'العمر', type: 'select', options: ['أقل من 25', '25-35', '35-45', 'أكثر من 45'], isActive: true },
  { id: '3', name: 'المستوى التعليمي', type: 'select', options: ['ابتدائي', 'متوسط', 'ثانوي', 'جامعي', 'دراسات عليا'], isActive: true },
  { id: '4', name: 'الحالة الاجتماعية', type: 'radio', options: ['أعزب', 'متزوج', 'مطلق', 'أرمل'], isActive: true },
  { id: '5', name: 'الحالة المهنية', type: 'select', options: ['طالب', 'موظف', 'متقاعد', 'ربة منزل', 'عاطل', 'أعمال حرة'], isActive: true },
];

// Pre-defined sectors - org managers cannot add new ones, admins can modify
const INITIAL_SECTORS = [
  { id: '1', name: 'الصحة والبيئة', description: 'البرامج والمشاريع المتعلقة بالصحة العامة والبيئة', isActive: true },
  { id: '2', name: 'التعليم والثقافة', description: 'المبادرات التعليمية والثقافية والتدريبية', isActive: true },
  { id: '3', name: 'التمكين الاقتصادي', description: 'برامج التدريب المهني والدعم الاقتصادي', isActive: true },
  { id: '4', name: 'السكن والبنية التحتية', description: 'مشاريع الإسكان وتطوير البنية التحتية', isActive: true },
];

// Fixed questions that cannot be modified
const FIXED_QUESTIONS = {
  pre: [
    {
      id: 'housing_before',
      text: 'ما هي حالة السكن الحالية؟',
      type: 'radio',
      options: ['أملك مسكناً', 'منزل مستأجر', 'منزل العائلة', 'أخرى'],
      required: true,
      fixed: true,
      domainId: '4'
    },
    {
      id: 'education_before', 
      text: 'ما هو مستواك التعليمي الحالي؟',
      type: 'select',
      options: ['ابتدائي', 'متوسط', 'ثانوي', 'جامعي', 'دراسات عليا'],
      required: true,
      fixed: true,
      domainId: '2'
    },
    {
      id: 'skills_before',
      text: 'كم عدد المهارات المهنية التي تمتلكها حالياً؟',
      type: 'number',
      required: true,
      fixed: true,
      domainId: '3'
    }
  ],
  post: [
    {
      id: 'housing_after',
      text: 'ما هي حالة السكن بعد البرنامج؟',
      type: 'radio', 
      options: ['أملك مسكناً', 'منزل مستأجر', 'منزل العائلة', 'أخرى'],
      required: true,
      fixed: true,
      domainId: '4'
    },
    {
      id: 'education_after',
      text: 'ما هو مستواك التعليمي بعد البرنامج؟',
      type: 'select',
      options: ['ابتدائي', 'متوسط', 'ثانوي', 'جامعي', 'دراسات عليا'],
      required: true,
      fixed: true,
      domainId: '2'
    },
    {
      id: 'skills_after',
      text: 'كم عدد المهارات المهنية التي تمتلكها الآن؟',
      type: 'number',
      required: true,
      fixed: true,
      domainId: '3'
    },
    {
      id: 'satisfaction',
      text: 'ما مدى رضاك عن البرنامج بشكل عام؟',
      type: 'rating',
      scale: 5,
      required: true,
      fixed: true,
      domainId: '1'
    },
    {
      id: 'recommendation',
      text: 'هل تنصح الآخرين بالاشتراك في هذا البرنامج؟',
      type: 'radio',
      options: ['نعم', 'لا', 'ربما'],
      required: true,
      fixed: true,
      domainId: '1'
    }
  ]
};

interface Question {
  id: string;
  text: string;
  type: 'text' | 'radio' | 'checkbox' | 'select' | 'textarea' | 'number' | 'rating';
  options?: string[];
  optionScores?: number[]; // Add this new field for option scores
  scale?: number;
  required?: boolean;
  fixed?: boolean;
  domainId?: string;
}

interface Domain {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface FilterItem {
  id: string;
  name: string;
  type: 'radio' | 'select' | 'checkbox';
  options: string[];
  isActive: boolean;
}

interface Beneficiary {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  addedAt: Date;
  method: 'manual' | 'excel';
}

const steps = [
  { id: 1, title: 'المعلومات الأساسية', description: 'تفاصيل الاستبيان' },
  { id: 2, title: 'المجالات والفلاتر', description: 'اختيار المجالات وفلاتر المستفيدين' },
  { id: 3, title: 'الأسئلة القبلية', description: 'أسئلة القياس القبلي' },
  { id: 4, title: 'الأسئلة البعدية', description: 'أسئلة القياس البعدي' },
  { id: 5, title: 'إدارة المستفيدين', description: 'إضافة وإدارة قائمة المستفيدين' },
  { id: 6, title: 'إعدادات التوقيت', description: 'تحديد فترة نشاط الاستبيان' },
  { id: 7, title: 'معاينة ونشر', description: 'مراجعة نهائية والنشر' }
];

export default function SurveyCreationWizard({ onBack, onSurveyCreated, userRole = 'org_manager' }: SurveyCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [sectors, setSectors] = useState<Domain[]>(INITIAL_SECTORS);
  const [filters, setFilters] = useState<FilterItem[]>(INITIAL_FILTERS);
  
  // Add state for selected organization in admin mode
  const [selectedOrganization, setSelectedOrganization] = useState<typeof ORGANIZATIONS[0] | null>(null);

  const [surveyData, setSurveyData] = useState({
    title: '',
    description: '',
    organization: userRole === 'org_manager' ? 'مؤسسة خيرية' : '',
    organizationEmail: userRole === 'org_manager' ? 'manager@org.com' : '',
    organizationWebsite: userRole === 'org_manager' ? 'https://www.org.com' : '',
    organizationLogo: userRole === 'org_manager' ? 'https://via.placeholder.com/100x100/183259/white?text=منظمة' : '',
    selectedSectors: [] as string[],
    selectedFilters: [] as string[],
    preQuestions: [...FIXED_QUESTIONS.pre] as Question[],
    postQuestions: [...FIXED_QUESTIONS.post] as Question[],
    beneficiaries: [] as Beneficiary[],
    startDate: '',
    endDate: ''
  });

  // Handle organization selection for super admin
  const handleOrganizationSelect = (orgId: string) => {
    const org = ORGANIZATIONS.find(o => o.id === orgId);
    if (org) {
      setSelectedOrganization(org);
      setSurveyData(prev => ({
        ...prev,
        organization: org.name,
        organizationEmail: org.email,
        organizationWebsite: org.website,
        organizationLogo: org.logo
      }));
    }
  };

  // Dialog states
  const [showAddDomainDialog, setShowAddDomainDialog] = useState(false);
  const [showAddFilterDialog, setShowAddFilterDialog] = useState(false);
  const [showAddQuestionDialog, setShowAddQuestionDialog] = useState(false);
  const [showAddBeneficiaryDialog, setShowAddBeneficiaryDialog] = useState(false);
  
  // Form states
  const [domainForm, setDomainForm] = useState({ name: '', description: '', isActive: true });
  const [filterForm, setFilterForm] = useState({ name: '', type: 'select' as FilterItem['type'], options: [''], isActive: true });
  
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'text' as Question['type'],
    options: [] as string[],
    optionScores: [] as number[], // Add scores array
    scale: 5,
    required: true,
    fixed: false,
    domainId: ''
  });

  const [addToBothSurveys, setAddToBothSurveys] = useState(false);

  const [beneficiaryForm, setBeneficiaryForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [currentQuestionType, setCurrentQuestionType] = useState<'pre' | 'post'>('pre');
  const [selectedDomainForQuestion, setSelectedDomainForQuestion] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [beneficiaryMethod, setBeneficiaryMethod] = useState<'manual' | 'excel'>('manual');

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1 && (!surveyData.title.trim() || !surveyData.description.trim())) {
      toast.error('يرجى إكمال جميع الحقول المطلوبة');
      return;
    }
    
    if (currentStep === 2 && surveyData.selectedSectors.length === 0) {
      toast.error('يرجى اختيار مجال واحد على الأقل');
      return;
    }

    if (currentStep === 5 && surveyData.beneficiaries.length === 0) {
      toast.error('يرجى إضافة مستفيد واحد على الأقل');
      return;
    }

    if (currentStep === 6) {
      if (!surveyData.startDate) {
        toast.error('يرجى تحديد تاريخ بداية الاستبيان');
        return;
      }
      if (!surveyData.endDate) {
        toast.error('يرجى تحديد تاريخ نهاية الاستبيان');
        return;
      }
      if (new Date(surveyData.startDate) >= new Date(surveyData.endDate)) {
        toast.error('يجب أن يكون تاريخ النهاية بعد تاريخ البداية');
        return;
      }
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSectorToggle = (sectorId: string) => {
    setSurveyData(prev => ({
      ...prev,
      selectedSectors: prev.selectedSectors.includes(sectorId)
        ? prev.selectedSectors.filter(id => id !== sectorId)
        : [...prev.selectedSectors, sectorId]
    }));
  };

  const handleFilterToggle = (filterId: string) => {
    setSurveyData(prev => ({
      ...prev,
      selectedFilters: prev.selectedFilters.includes(filterId)
        ? prev.selectedFilters.filter(id => id !== filterId)
        : [...prev.selectedFilters, filterId]
    }));
  };

  // Domain management functions (Admin only)
  const handleAddDomain = () => {
    if (!domainForm.name.trim()) {
      toast.error('يرجى إدخال اسم المجال');
      return;
    }

    const newDomain: Domain = {
      id: `domain_${Date.now()}`,
      name: domainForm.name,
      description: domainForm.description,
      isActive: domainForm.isActive
    };

    setSectors(prev => [...prev, newDomain]);
    setDomainForm({ name: '', description: '', isActive: true });
    setShowAddDomainDialog(false);
    toast.success('تم إضافة المجال بنجاح');
  };

  const handleDeleteDomain = (domainId: string) => {
    setSectors(prev => prev.filter(d => d.id !== domainId));
    setSurveyData(prev => ({
      ...prev,
      selectedSectors: prev.selectedSectors.filter(id => id !== domainId)
    }));
    toast.success('تم حذف المجال');
  };

  // Filter management functions (Admin only)
  const handleAddFilter = () => {
    if (!filterForm.name.trim()) {
      toast.error('يرجى إدخال اسم الفلتر');
      return;
    }

    if (filterForm.options.filter(opt => opt.trim()).length === 0) {
      toast.error('يرجى إضافة خيار واحد على الأقل');
      return;
    }

    const newFilter: FilterItem = {
      id: `filter_${Date.now()}`,
      name: filterForm.name,
      type: filterForm.type,
      options: filterForm.options.filter(opt => opt.trim()),
      isActive: filterForm.isActive
    };

    setFilters(prev => [...prev, newFilter]);
    setFilterForm({ name: '', type: 'select', options: [''], isActive: true });
    setShowAddFilterDialog(false);
    toast.success('تم إضافة الفلتر بنجاح');
  };

  const handleDeleteFilter = (filterId: string) => {
    setFilters(prev => prev.filter(f => f.id !== filterId));
    setSurveyData(prev => ({
      ...prev,
      selectedFilters: prev.selectedFilters.filter(id => id !== filterId)
    }));
    toast.success('تم حذف الفلتر');
  };

  // Question management functions
  const handleAddQuestionToDomain = (domainId: string, questionType: 'pre' | 'post') => {
    setSelectedDomainForQuestion(domainId);
    setCurrentQuestionType(questionType);
    setNewQuestion(prev => ({ ...prev, domainId }));
    setShowAddQuestionDialog(true);
  };

  const handleAddQuestion = () => {
    if (!newQuestion.text.trim()) {
      toast.error('يرجى إدخال نص السؤال');
      return;
    }

    if (['radio', 'checkbox', 'select'].includes(newQuestion.type) && newQuestion.options.length === 0) {
      toast.error('يرجى إضافة خيارات للسؤال');
      return;
    }

    if (!newQuestion.domainId) {
      toast.error('يرجى تحديد المجال');
      return;
    }

    const question: Question = {
      id: `custom_${Date.now()}`,
      text: newQuestion.text,
      type: newQuestion.type,
      options: newQuestion.type === 'rating' ? undefined : newQuestion.options,
      optionScores: ['radio', 'checkbox', 'select'].includes(newQuestion.type) && newQuestion.optionScores ? newQuestion.optionScores : undefined,
      scale: newQuestion.type === 'rating' ? newQuestion.scale : undefined,
      required: newQuestion.required,
      fixed: newQuestion.fixed,
      domainId: newQuestion.domainId
    };

    if (addToBothSurveys) {
      // إضافة السؤال في كلا الاستبيانين
      setSurveyData(prev => ({
        ...prev,
        preQuestions: [...prev.preQuestions, question],
        postQuestions: [...prev.postQuestions, { ...question, id: `custom_${Date.now()}_post` }]
      }));
      toast.success('تم إضافة السؤال في كلا من الاستبيان القبلي والبعدي بنجاح');
    } else {
      // إضافة السؤال في الاستبيان المحدد فقط
      setSurveyData(prev => ({
        ...prev,
        [currentQuestionType === 'pre' ? 'preQuestions' : 'postQuestions']: [
          ...prev[currentQuestionType === 'pre' ? 'preQuestions' : 'postQuestions'],
          question
        ]
      }));
      toast.success(`تم إضافة السؤال ${newQuestion.fixed ? 'الثابت' : ''} بنجاح`);
    }

    // Reset form
    setNewQuestion({
      text: '',
      type: 'text',
      options: [],
      optionScores: [],
      scale: 5,
      required: true,
      fixed: false,
      domainId: ''
    });
    setAddToBothSurveys(false);
    
    setShowAddQuestionDialog(false);
  };

  const handleDeleteQuestion = (questionId: string, questionType: 'pre' | 'post') => {
    const questionList = surveyData[questionType === 'pre' ? 'preQuestions' : 'postQuestions'];
    const question = questionList.find(q => q.id === questionId);
    
    // Prevent deletion of fixed questions for org managers
    if (question?.fixed && userRole === 'org_manager') {
      toast.error('لا يمكن حذف هذا السؤال - إنه سؤال ثابت مطلوب');
      return;
    }

    setSurveyData(prev => ({
      ...prev,
      [questionType === 'pre' ? 'preQuestions' : 'postQuestions']: prev[questionType === 'pre' ? 'preQuestions' : 'postQuestions'].filter(q => q.id !== questionId)
    }));
    
    toast.success('تم حذف السؤال');
  };

  // Beneficiary management functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[0-9\-\s]{8,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleAddBeneficiary = () => {
    if (!beneficiaryForm.name.trim()) {
      toast.error('يرجى إدخال اسم المستفيد');
      return;
    }

    if (!beneficiaryForm.email?.trim() && !beneficiaryForm.phone?.trim()) {
      toast.error('يرجى إدخال البريد الإلكتروني أو رقم الهاتف');
      return;
    }

    if (beneficiaryForm.email && !validateEmail(beneficiaryForm.email)) {
      toast.error('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    if (beneficiaryForm.phone && !validatePhone(beneficiaryForm.phone)) {
      toast.error('يرجى إدخال رقم هاتف صحيح');
      return;
    }

    // Check for duplicates
    const isDuplicate = surveyData.beneficiaries.some(b => 
      b.email === beneficiaryForm.email || b.phone === beneficiaryForm.phone
    );

    if (isDuplicate) {
      toast.error('هذا المستفيد موجود مسبقاً');
      return;
    }

    const newBeneficiary: Beneficiary = {
      id: `beneficiary_${Date.now()}`,
      name: beneficiaryForm.name,
      email: beneficiaryForm.email || undefined,
      phone: beneficiaryForm.phone || undefined,
      addedAt: new Date(),
      method: 'manual'
    };

    setSurveyData(prev => ({
      ...prev,
      beneficiaries: [...prev.beneficiaries, newBeneficiary]
    }));

    setBeneficiaryForm({ name: '', email: '', phone: '' });
    setShowAddBeneficiaryDialog(false);
    toast.success('تم إضافة المستفيد بنجاح');
  };

  const handleDeleteBeneficiary = (beneficiaryId: string) => {
    setSurveyData(prev => ({
      ...prev,
      beneficiaries: prev.beneficiaries.filter(b => b.id !== beneficiaryId)
    }));
    toast.success('تم حذف المستفيد');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      toast.error('يرجى اختيار ملف Excel (.xlsx, .xls) أو CSV (.csv)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت');
      return;
    }

    setUploadedFile(file);
    // Simulate processing Excel file
    setTimeout(() => {
      const mockBeneficiaries: Beneficiary[] = [
        {
          id: `excel_1_${Date.now()}`,
          name: 'أحمد محمد',
          email: 'ahmed@example.com',
          phone: '+966501234567',
          addedAt: new Date(),
          method: 'excel'
        },
        {
          id: `excel_2_${Date.now()}`,
          name: 'فاطمة أحمد',
          email: 'fatima@example.com',
          phone: '+966507654321',
          addedAt: new Date(),
          method: 'excel'
        },
        {
          id: `excel_3_${Date.now()}`,
          name: 'محمد علي',
          email: 'mohammed@example.com',
          phone: '+966509876543',
          addedAt: new Date(),
          method: 'excel'
        }
      ];

      setSurveyData(prev => ({
        ...prev,
        beneficiaries: [...prev.beneficiaries, ...mockBeneficiaries]
      }));

      toast.success(`تم استيراد ${mockBeneficiaries.length} مستفيدين من ملف Excel بنجاح`);
    }, 1000);
  };

  const downloadExcelTemplate = () => {
    // Simulate downloading Excel template
    toast.success('تم تحميل قالب Excel بنجاح');
  };

  const handleAddOption = (formSetter: any, form: any) => {
    if (form === newQuestion) {
      // For newQuestion, also add score
      formSetter({ 
        ...form, 
        options: [...form.options, ''],
        optionScores: [...(form.optionScores || []), '']
      });
    } else {
      formSetter({ ...form, options: [...form.options, ''] });
    }
  };

  const handleUpdateOption = (formSetter: any, form: any, index: number, value: string) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    formSetter({ ...form, options: newOptions });
  };

  const handleUpdateOptionScore = (formSetter: any, form: any, index: number, score: string) => {
    const newScores = [...(form.optionScores || [])];
    newScores[index] = score === '' ? '' : Number(score);
    formSetter({ ...form, optionScores: newScores });
  };

  const handleRemoveOption = (formSetter: any, form: any, index: number) => {
    if (form.options.length > 1) {
      if (form === newQuestion) {
        // For newQuestion, also remove score
        formSetter({ 
          ...form, 
          options: form.options.filter((_: any, i: number) => i !== index),
          optionScores: (form.optionScores || []).filter((_: any, i: number) => i !== index)
        });
      } else {
        formSetter({ ...form, options: form.options.filter((_: any, i: number) => i !== index) });
      }
    }
  };

  const handlePublish = () => {
    // Create the survey
    const survey: Survey = {
      id: `survey_${Date.now()}`,
      title: surveyData.title,
      description: surveyData.description,
      organization: surveyData.organization,
      organizationEmail: surveyData.organizationEmail,
      organizationWebsite: surveyData.organizationWebsite,
      organizationLogo: surveyData.organizationLogo,
      selectedSectors: surveyData.selectedSectors,
      selectedFilters: surveyData.selectedFilters,
      preQuestions: surveyData.preQuestions,
      postQuestions: surveyData.postQuestions,
      beneficiaries: surveyData.beneficiaries,
      startDate: surveyData.startDate,
      endDate: surveyData.endDate,
      createdAt: new Date(),
      status: 'active',
      responses: 0
    };

    onSurveyCreated(survey);
    toast.success('تم حفظ الاستبيان بنجاح!');
    onBack();
  };

  const getDomainName = (domainId: string) => {
    const domain = sectors.find(d => d.id === domainId);
    return domain?.name || 'غير محدد';
  };

  const renderTimingSettings = () => {
    const today = new Date().toISOString().split('T')[0];
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-[#183259]" />
              إعدادات التوقيت
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                حدد الفترة الزمنية التي سيكون فيها الاستبيان نشطاً ومتاحاً لاستقبال الردود من المستفيدين.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="startDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  تاريخ بداية الاستبيان *
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={surveyData.startDate}
                  onChange={(e) => setSurveyData(prev => ({ ...prev, startDate: e.target.value }))}
                  min={today}
                  className="text-left"
                  dir="ltr"
                />
                <p className="text-sm text-gray-500">
                  سيصبح الاستبيان متاحاً للمستفيدين ابتداءً من هذا التاريخ
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="endDate" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  تاريخ نهاية الاستبيان *
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={surveyData.endDate}
                  onChange={(e) => setSurveyData(prev => ({ ...prev, endDate: e.target.value }))}
                  min={surveyData.startDate || today}
                  className="text-left"
                  dir="ltr"
                />
                <p className="text-sm text-gray-500">
                  سيتم إيقاف استقبال الردود في نهاية هذا التاريخ
                </p>
              </div>
            </div>

            {surveyData.startDate && surveyData.endDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">ملخص فترة النشاط</h4>
                </div>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>
                    <strong>تاريخ البداية:</strong> {new Date(surveyData.startDate).toLocaleDateString('ar-SA', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p>
                    <strong>تاريخ النهاية:</strong> {new Date(surveyData.endDate).toLocaleDateString('ar-SA', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p>
                    <strong>مدة النشاط:</strong> {
                      Math.ceil((new Date(surveyData.endDate).getTime() - new Date(surveyData.startDate).getTime()) / (1000 * 60 * 60 * 24))
                    } يوم
                  </p>
                </div>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="space-y-2 text-sm text-amber-800">
                  <h4 className="font-semibold">ملاحظات مهمة:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>لا يمكن تعديل التواريخ بعد نشر الاستبيان</li>
                    <li>سيتم إرسال دعوات للمستفيدين تلقائياً في تاريخ البداية</li>
                    <li>يمكن إيقاف الاستبيان يدوياً قبل تاريخ النهاية إذا لزم الأمر</li>
                    <li>سيتم إرسال تذكيرات للمستفيدين قبل انتهاء فترة الاستبيان بيومين</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الأساسية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">عنوان الاستبيان *</Label>
            <Input
              id="title"
              placeholder="مثال: تقييم برنامج التدريب المهني"
              value={surveyData.title}
              onChange={(e) => setSurveyData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="description">وصف الاستبيان *</Label>
            <Textarea
              id="description"
              placeholder="اكتب وصفاً موجزاً عن الهدف من هذا الاستبيان..."
              rows={3}
              value={surveyData.description}
              onChange={(e) => setSurveyData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Organization selection - different for admins and org managers */}
          <div>
            <Label htmlFor="organization">اسم المنظمة *</Label>
            {userRole === 'admin' ? (
              <Select 
                value={selectedOrganization?.id || ''} 
                onValueChange={handleOrganizationSelect}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر المنظمة..." />
                </SelectTrigger>
                <SelectContent>
                  {ORGANIZATIONS.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      <div className="flex items-center gap-3">
                        <img 
                          src={org.logo} 
                          alt={org.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>{org.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="organization"
                value={surveyData.organization}
                onChange={(e) => setSurveyData(prev => ({ ...prev, organization: e.target.value }))}
                readOnly={true}
                className="bg-gray-50"
              />
            )}
            {userRole === 'org_manager' && (
              <p className="text-xs text-gray-500 mt-1">هذا الحقل محدد مسبقاً لمنظمتك</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="organizationEmail">البريد الإلكتروني للمنظمة</Label>
            <Input
              id="organizationEmail"
              type="email"
              placeholder="contact@organization.com"
              value={surveyData.organizationEmail}
              onChange={(e) => setSurveyData(prev => ({ ...prev, organizationEmail: e.target.value }))}
              readOnly={userRole === 'admin' ? !!selectedOrganization : true}
              className={userRole === 'admin' ? (selectedOrganization ? 'bg-gray-50' : '') : 'bg-gray-50'}
            />
            {((userRole === 'org_manager') || (userRole === 'admin' && selectedOrganization)) && (
              <p className="text-xs text-gray-500 mt-1">
                {userRole === 'org_manager' ? 'هذا الحقل محدد مسبقاً لمنظمتك' : 'يتم تعبئة هذا الحقل تلقائياً عند اختيار المنظمة'}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="organizationWebsite">موقع المنظمة الإلكتروني</Label>
            <Input
              id="organizationWebsite"
              type="url"
              placeholder="https://www.organization.com"
              value={surveyData.organizationWebsite}
              onChange={(e) => setSurveyData(prev => ({ ...prev, organizationWebsite: e.target.value }))}
              readOnly={userRole === 'admin' ? !!selectedOrganization : true}
              className={userRole === 'admin' ? (selectedOrganization ? 'bg-gray-50' : '') : 'bg-gray-50'}
            />
            {((userRole === 'org_manager') || (userRole === 'admin' && selectedOrganization)) && (
              <p className="text-xs text-gray-500 mt-1">
                {userRole === 'org_manager' ? 'هذا الحقل محدد مسبقاً لمنظمتك' : 'يتم تعبئة هذا الحقل تلقائياً عند اختيار المنظمة'}
              </p>
            )}
          </div>

          {/* Organization Logo Display */}
          {((userRole === 'org_manager') || (userRole === 'admin' && selectedOrganization)) && (
            <div>
              <Label>شعار المنظمة</Label>
              <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="flex items-center gap-4">
                  <img 
                    src={surveyData.organizationLogo} 
                    alt="شعار المنظمة"
                    className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {surveyData.organization}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userRole === 'org_manager' ? 'شعار منظمتك' : 'شعار المنظمة المختارة'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSectorsAndFilters = () => (
    <div className="space-y-6">
      {/* Sectors */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              المجالات المستهدفة
            </CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            اختر المجالات التي يستهدفها البرنامج من القائمة المتاحة
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {sectors.filter(s => s.isActive).map((sector) => (
              <div
                key={sector.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  surveyData.selectedSectors.includes(sector.id)
                    ? 'border-[#183259] bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => handleSectorToggle(sector.id)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={surveyData.selectedSectors.includes(sector.id)}
                    onChange={() => handleSectorToggle(sector.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{sector.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{sector.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {surveyData.selectedSectors.length === 0 && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                يرجى اختيار مجال واحد على الأقل للمتابعة
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              فلاتر المستفيدين
            </CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            اختر الفلاتر التي تريد تطبيقها لتصنيف المستفيدين (اختياري)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {filters.filter(f => f.isActive).map((filter) => (
              <div
                key={filter.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  surveyData.selectedFilters.includes(filter.id)
                    ? 'border-[#183259] bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => handleFilterToggle(filter.id)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={surveyData.selectedFilters.includes(filter.id)}
                    onChange={() => handleFilterToggle(filter.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{filter.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {filter.type === 'radio' ? 'اختيار واحد' : 
                         filter.type === 'select' ? 'قائمة منسدلة' : 'اختيار متعدد'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {filter.options.slice(0, 4).map((option, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {option}
                        </Badge>
                      ))}
                      {filter.options.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{filter.options.length - 4} أكثر
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {surveyData.selectedFilters.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                تم اختيار {surveyData.selectedFilters.length} فلتر للاستبيان
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderQuestions = (questionType: 'pre' | 'post') => {
    const questions = surveyData[questionType === 'pre' ? 'preQuestions' : 'postQuestions'];
    const title = questionType === 'pre' ? 'الأسئلة القبلية' : 'الأسئلة البعدية';

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {title}
              </CardTitle>
              <Button
                onClick={() => {
                  setCurrentQuestionType(questionType);
                  setNewQuestion(prev => ({ ...prev, domainId: '' }));
                  setShowAddQuestionDialog(true);
                }}
                className="bg-[#183259] hover:bg-[#2a4a7a]"
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة سؤال
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <Card key={question.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-500">
                            السؤال {index + 1}
                          </span>
                          {question.required && (
                            <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
                              مطلوب
                            </Badge>
                          )}
                          {question.fixed && (
                            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 flex items-center gap-1">
                              <Lock className="h-3 w-3" />
                              ثابت
                            </Badge>
                          )}
                          {question.domainId && (
                            <Badge variant="outline" className="text-xs">
                              {getDomainName(question.domainId)}
                            </Badge>
                          )}
                        </div>
                        <p className="font-medium mb-2">{question.text}</p>
                        <div className="text-sm text-gray-600">
                          نوع السؤال: {
                            question.type === 'text' ? 'نص قصير' :
                            question.type === 'textarea' ? 'نص طويل' :
                            question.type === 'radio' ? 'اختيار واحد' :
                            question.type === 'checkbox' ? 'اختيار متعدد' :
                            question.type === 'select' ? 'قائمة منسدلة' :
                            question.type === 'number' ? 'رقم' :
                            question.type === 'rating' ? 'تقييم' : question.type
                          }
                        </div>
                        {question.options && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {question.options.map((option, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {option}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {question.type === 'rating' && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              مقياس من 1 إلى {question.scale}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {question.fixed && userRole === 'org_manager' ? (
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            غير قابل للتعديل
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id, questionType)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {questions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  لا توجد أسئلة حتى الآن. اضغط "إضافة سؤال" لبدء إنشاء الأسئلة.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBeneficiariesManagement = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            إدارة المستفيدين
          </CardTitle>
          <p className="text-sm text-gray-600">
            أضف المستفيدين الذين ستوجه لهم الاستبيان. يمكنك إضافتهم يدوياً أو استيرادهم من ملف Excel.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={beneficiaryMethod} onValueChange={(value: 'manual' | 'excel') => setBeneficiaryMethod(value)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                إدخال يدوي
              </TabsTrigger>
              <TabsTrigger value="excel" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                استيراد Excel
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">إضافة مستفيد جديد يدوياً</p>
                <Button onClick={() => setShowAddBeneficiaryDialog(true)} size="sm">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة مستفيد
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="excel" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">استيراد مستفيدين من ملف Excel</p>
                  <p className="text-xs text-gray-500">
                    يدعم ملفات .xlsx, .xls, .csv بحد أقصى 5 ميجابايت
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadExcelTemplate}
                    >
                      <Download className="h-4 w-4 ml-2" />
                      تحميل القالب
                    </Button>
                    <Label htmlFor="excelUpload" className="cursor-pointer">
                      <Button variant="default" size="sm" asChild>
                        <span>
                          <Upload className="h-4 w-4 ml-2" />
                          رفع ملف
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="excelUpload"
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                  {uploadedFile && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        ✅ تم رفع الملف: {uploadedFile.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Beneficiaries List */}
          {surveyData.beneficiaries.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">قائمة المستفيدين ({surveyData.beneficiaries.length})</h4>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>رقم الهاتف</TableHead>
                      <TableHead>طريقة الإدخال</TableHead>
                      <TableHead>تاريخ الإضافة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {surveyData.beneficiaries.map((beneficiary) => (
                      <TableRow key={beneficiary.id}>
                        <TableCell className="font-medium">{beneficiary.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {beneficiary.email && <Mail className="h-4 w-4 text-gray-400" />}
                            {beneficiary.email || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {beneficiary.phone && <Phone className="h-4 w-4 text-gray-400" />}
                            {beneficiary.phone || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={beneficiary.method === 'manual' ? 'default' : 'secondary'}>
                            {beneficiary.method === 'manual' ? 'يدوي' : 'Excel'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {beneficiary.addedAt.toLocaleDateString('ar-SA')}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBeneficiary(beneficiary.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {surveyData.beneficiaries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>لا توجد مستفيدون حتى الآن</p>
              <p className="text-sm">استخدم الخيارات أعلاه لإضافة المستفيدين</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            معاينة نهائية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{surveyData.title}</h3>
            <p className="text-gray-600 mb-4">{surveyData.description}</p>
            <div className="text-sm text-gray-500">
              <p>المنظمة: {surveyData.organization}</p>
              <p>البريد الإلكتروني: {surveyData.organizationEmail}</p>
              <p>الموقع الإلكتروني: {surveyData.organizationWebsite}</p>
            </div>
          </div>

          {/* Selected Sectors */}
          <div>
            <h4 className="font-medium mb-2">المجالات المستهدفة:</h4>
            <div className="flex flex-wrap gap-2">
              {surveyData.selectedSectors.map(sectorId => {
                const sector = sectors.find(s => s.id === sectorId);
                return sector ? (
                  <Badge key={sectorId} variant="secondary">{sector.name}</Badge>
                ) : null;
              })}
            </div>
          </div>

          {/* Selected Filters */}
          {surveyData.selectedFilters.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">فلاتر المستفيدين:</h4>
              <div className="flex flex-wrap gap-2">
                {surveyData.selectedFilters.map(filterId => {
                  const filter = filters.find(f => f.id === filterId);
                  return filter ? (
                    <Badge key={filterId} variant="outline">{filter.name}</Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Questions Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">الأسئلة القبلية ({surveyData.preQuestions.length})</h4>
              <div className="space-y-1">
                {surveyData.preQuestions.slice(0, 3).map((q, idx) => (
                  <p key={idx} className="text-sm text-gray-600 truncate">
                    {idx + 1}. {q.text}
                  </p>
                ))}
                {surveyData.preQuestions.length > 3 && (
                  <p className="text-sm text-gray-400">... و {surveyData.preQuestions.length - 3} أسئلة أخرى</p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">الأسئلة البعدي ({surveyData.postQuestions.length})</h4>
              <div className="space-y-1">
                {surveyData.postQuestions.slice(0, 3).map((q, idx) => (
                  <p key={idx} className="text-sm text-gray-600 truncate">
                    {idx + 1}. {q.text}
                  </p>
                ))}
                {surveyData.postQuestions.length > 3 && (
                  <p className="text-sm text-gray-400">... و {surveyData.postQuestions.length - 3} أسئلة أخرى</p>
                )}
              </div>
            </div>
          </div>

          {/* Beneficiaries Summary */}
          <div>
            <h4 className="font-medium mb-2">المستفيدون ({surveyData.beneficiaries.length})</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">إجمالي المستفيدين</p>
                  <p className="font-medium text-lg">{surveyData.beneficiaries.length}</p>
                </div>
                <div>
                  <p className="text-gray-500">إدخال يدوي</p>
                  <p className="font-medium text-lg">
                    {surveyData.beneficiaries.filter(b => b.method === 'manual').length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">استيراد Excel</p>
                  <p className="font-medium text-lg">
                    {surveyData.beneficiaries.filter(b => b.method === 'excel').length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">لديهم بريد إلكتروني</p>
                  <p className="font-medium text-lg">
                    {surveyData.beneficiaries.filter(b => b.email).length}
                  </p>
                </div>
              </div>
              {surveyData.beneficiaries.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium mb-2">عينة من المستفيدين:</p>
                  <div className="space-y-1">
                    {surveyData.beneficiaries.slice(0, 3).map((b, idx) => (
                      <p key={idx} className="text-sm text-gray-600">
                        • {b.name} {b.email ? `(${b.email})` : b.phone ? `(${b.phone})` : ''}
                      </p>
                    ))}
                    {surveyData.beneficiaries.length > 3 && (
                      <p className="text-sm text-gray-400">... و {surveyData.beneficiaries.length - 3} مستفيدين آخرين</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4"
          >
            <ChevronRight className="h-4 w-4 ml-2" />
            العودة إلى قائمة الاستبيانات
          </Button>
          
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">إنشاء استبيان جديد</h1>
            {userRole === 'admin' && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 flex items-center gap-1">
                <Settings className="h-3 w-3" />
                مسؤول النظام
              </Badge>
            )}
          </div>
          <p className="text-gray-600">قم بإنشاء استبيان لقياس الأثر الاجتماعي لبرامجك ومبادراتك</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">الخطوة {currentStep} من {steps.length}</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Steps */}
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id
                      ? 'bg-[#183259] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-xs font-medium">{step.title}</p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          {currentStep === 1 && renderBasicInfo()}
          {currentStep === 2 && renderSectorsAndFilters()}
          {currentStep === 3 && renderQuestions('pre')}
          {currentStep === 4 && renderQuestions('post')}
          {currentStep === 5 && renderBeneficiariesManagement()}
          {currentStep === 6 && renderTimingSettings()}
          {currentStep === 7 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Eye className="h-6 w-6 text-[#183259]" />
                    معاينة الاستبيان
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{surveyData.title}</h3>
                    <p className="text-gray-600">{surveyData.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <strong>المنظمة:</strong> {surveyData.organization}
                      </div>
                      <div>
                        <strong>البريد الإلكتروني:</strong> {surveyData.organizationEmail}
                      </div>
                      {surveyData.startDate && (
                        <div>
                          <strong>تاريخ البداية:</strong> {new Date(surveyData.startDate).toLocaleDateString('ar-SA')}
                        </div>
                      )}
                      {surveyData.endDate && (
                        <div>
                          <strong>تاريخ النهاية:</strong> {new Date(surveyData.endDate).toLocaleDateString('ar-SA')}
                        </div>
                      )}
                    </div>

                    <div>
                      <strong>المجالات المختارة:</strong>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {surveyData.selectedSectors.map(sectorId => {
                          const sector = sectors.find(s => s.id === sectorId);
                          return (
                            <Badge key={sectorId} variant="secondary">
                              {sector?.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <strong>الفلاتر المختارة:</strong>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {surveyData.selectedFilters.map(filterId => {
                          const filter = filters.find(f => f.id === filterId);
                          return (
                            <Badge key={filterId} variant="outline">
                              {filter?.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <strong>عدد الأسئلة القبلية:</strong> {surveyData.preQuestions.length}
                    </div>
                    <div>
                      <strong>عدد الأسئلة البعدية:</strong> {surveyData.postQuestions.length}
                    </div>
                    <div>
                      <strong>عدد المستفيدين:</strong> {surveyData.beneficiaries.length}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronRight className="h-4 w-4 ml-2" />
            السابق
          </Button>

          {currentStep === steps.length ? (
            <Button
              className="bg-[#183259] hover:bg-[#2a4a7a] text-white transition-colors"
              onClick={handlePublish}
            >
              <Save className="h-4 w-4 mr-2" />
              حفظ الاستبيان
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-[#183259] hover:bg-[#2a4a7a]"
            >
              التالي
              <ChevronLeft className="h-4 w-4 mr-2" />
            </Button>
          )}
        </div>

        {/* Add Domain Dialog */}
        <Dialog open={showAddDomainDialog} onOpenChange={setShowAddDomainDialog}>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة مجال جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="domainName">اسم المجال *</Label>
                <Input
                  id="domainName"
                  value={domainForm.name}
                  onChange={(e) => setDomainForm({ ...domainForm, name: e.target.value })}
                  placeholder="مثال: الرعاية الصحية"
                />
              </div>
              <div>
                <Label htmlFor="domainDescription">وصف المجال</Label>
                <Textarea
                  id="domainDescription"
                  value={domainForm.description}
                  onChange={(e) => setDomainForm({ ...domainForm, description: e.target.value })}
                  placeholder="وصف مختصر عن المجال وأهدافه..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDomainDialog(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleAddDomain}>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة المجال
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Filter Dialog */}
        <Dialog open={showAddFilterDialog} onOpenChange={setShowAddFilterDialog}>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة فلتر جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="filterName">اسم الفلتر *</Label>
                <Input
                  id="filterName"
                  value={filterForm.name}
                  onChange={(e) => setFilterForm({ ...filterForm, name: e.target.value })}
                  placeholder="مثال: المنطقة الجغرافية"
                />
              </div>
              <div>
                <Label htmlFor="filterType">نوع الفلتر</Label>
                <Select value={filterForm.type} onValueChange={(value: FilterItem['type']) => setFilterForm({ ...filterForm, type: value })}>
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
              <div>
                <Label>خيارات الفلتر</Label>
                <div className="space-y-2">
                  {filterForm.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => handleUpdateOption(setFilterForm, filterForm, index, e.target.value)}
                        placeholder={`الخيار ${index + 1}`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveOption(setFilterForm, filterForm, index)}
                        disabled={filterForm.options.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddOption(setFilterForm, filterForm)}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة خيار
                  </Button>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddFilterDialog(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleAddFilter}>
                  <Filter className="h-4 w-4 ml-2" />
                  إضافة الفلتر
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Question Dialog */}
        <Dialog open={showAddQuestionDialog} onOpenChange={setShowAddQuestionDialog}>
          <DialogContent className="max-w-lg" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة سؤال جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="questionDomain">المجال *</Label>
                <Select value={newQuestion.domainId} onValueChange={(value) => setNewQuestion({ ...newQuestion, domainId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المجال" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.filter(s => s.isActive).map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="questionText">نص السؤال *</Label>
                <Textarea
                  id="questionText"
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  placeholder="اكتب نص السؤال هنا..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="questionType">نوع السؤال</Label>
                <Select value={newQuestion.type} onValueChange={(value: Question['type']) => setNewQuestion({ ...newQuestion, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">نص قصير</SelectItem>
                    <SelectItem value="textarea">نص طويل</SelectItem>
                    <SelectItem value="radio">اختيار واحد</SelectItem>
                    <SelectItem value="checkbox">اختيار متعدد</SelectItem>
                    <SelectItem value="select">قائمة منسدلة</SelectItem>
                    <SelectItem value="number">رقم</SelectItem>
                    <SelectItem value="rating">تقييم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {['radio', 'checkbox', 'select'].includes(newQuestion.type) && (
                <div>
                  <Label>الخيارات</Label>
                  <div className="space-y-2">
                    {newQuestion.options.map((option, index) => (
                      <div key={index} className="flex gap-2" dir="rtl">
                        <Input
                          value={option}
                          onChange={(e) => handleUpdateOption(setNewQuestion, newQuestion, index, e.target.value)}
                          placeholder={`الخيار ${index + 1}`}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={(newQuestion.optionScores && newQuestion.optionScores[index]) || ''}
                          onChange={(e) => handleUpdateOptionScore(setNewQuestion, newQuestion, index, e.target.value)}
                          placeholder="درجة"
                          className="w-20"
                          min="0"
                          step="0.1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveOption(setNewQuestion, newQuestion, index)}
                          disabled={newQuestion.options.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddOption(setNewQuestion, newQuestion)}
                    >
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة خيار
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    يمكنك إدخال درجة/تقييم لكل خيار (اختياري) لحساب النقاط
                  </p>
                </div>
              )}

              {newQuestion.type === 'rating' && (
                <div>
                  <Label htmlFor="questionScale">مقياس التقييم</Label>
                  <Select value={newQuestion.scale.toString()} onValueChange={(value) => setNewQuestion({ ...newQuestion, scale: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 نجوم</SelectItem>
                      <SelectItem value="5">5 نجوم</SelectItem>
                      <SelectItem value="10">10 نجوم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {userRole === 'admin' && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="fixedQuestion"
                    checked={newQuestion.fixed}
                    onCheckedChange={(checked) => setNewQuestion({ ...newQuestion, fixed: checked })}
                  />
                  <Label htmlFor="fixedQuestion" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    سؤال ثابت (لا يمكن للمنظمات تعديله أو حذفه)
                  </Label>
                </div>
              )}

              {/* زر إضافة في الاستبيانين - يظهر فقط في الأسئلة القبلية */}
              {currentQuestionType === 'pre' && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Switch
                        id="addToBothSurveys"
                        checked={addToBothSurveys}
                        onCheckedChange={setAddToBothSurveys}
                        className={`${addToBothSurveys ? 'data-[state=checked]:bg-[#183259]' : ''}`}
                      />
                      <div>
                        <Label htmlFor="addToBothSurveys" className="text-sm font-medium cursor-pointer">
                          إضافة في الاستبيانين
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">
                          إضافة هذا السؤال تلقائياً في كلا من الاستبيان القبلي والبعدي
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={addToBothSurveys ? "default" : "secondary"} 
                      className={`text-xs ${addToBothSurveys ? 'bg-[#183259] text-white' : 'bg-gray-200 text-gray-600'}`}
                    >
                      {addToBothSurveys ? 'مُفعّل' : 'غير مُفعّل'}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddQuestionDialog(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleAddQuestion}>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة السؤال
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Beneficiary Dialog */}
        <Dialog open={showAddBeneficiaryDialog} onOpenChange={setShowAddBeneficiaryDialog}>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة مستفيد جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="beneficiaryName">الاسم *</Label>
                <Input
                  id="beneficiaryName"
                  value={beneficiaryForm.name}
                  onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, name: e.target.value })}
                  placeholder="اسم المستفيد"
                />
              </div>
              <div>
                <Label htmlFor="beneficiaryEmail">البريد الإلكتروني</Label>
                <Input
                  id="beneficiaryEmail"
                  type="email"
                  value={beneficiaryForm.email}
                  onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, email: e.target.value })}
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <Label htmlFor="beneficiaryPhone">رقم الهاتف</Label>
                <Input
                  id="beneficiaryPhone"
                  type="tel"
                  value={beneficiaryForm.phone}
                  onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, phone: e.target.value })}
                  placeholder="+966501234567"
                />
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  يجب إدخال البريد الإلكتروني أو رقم الهاتف على الأقل لكل مستفيد
                </AlertDescription>
              </Alert>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddBeneficiaryDialog(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleAddBeneficiary}>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة المستفيد
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}