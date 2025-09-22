import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { EnhancedPageLayout } from './EnhancedPageLayout';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  Check, 
  X, 
  Star, 
  CreditCard, 
  Calendar,
  Users,
  FileText,
  BarChart3,
  Zap,
  Crown,
  Building,
  Shield,
  Tag,
  AlertCircle,
  CheckCircle,
  Edit,
  Plus,
  Save,
  Trash2,
  Package,
  Gift,
  Target,
  TrendingUp,
  Activity,
  Search,
  XCircle,
  Filter,
  Clock,
  Mail,
  Phone,
  DollarSign,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';

interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: PlanFeature[];
  icon: React.ComponentType<any>;
  color: string;
}

interface PromoCode {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  description: string;
  createdAt: string;
  validUntil?: string;
  minAmount?: number;
  usageCount: number;
  maxUsage?: number;
  isActive: boolean;
}

interface Organization {
  id: string;
  name: string;
  users: number;
  planType: string;
  surveyQuota: number;
  surveyConsumed: number;
  surveyRemaining: number;
  joinDate: string;
  status: 'active' | 'suspended' | 'pending';
}

interface Transaction {
  id: string;
  organizationName: string;
  paymentMethod: string;
  date: string;
  time: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  type: 'subscription' | 'upgrade' | 'manual';
  description?: string;
  paymentDetails?: {
    cardLastFour?: string;
    bankName?: string;
    accountNumber?: string;
    transactionId?: string;
  };
}

// Demo organizations data
const demoOrganizations: Organization[] = [
  {
    id: '1',
    name: 'مؤسسة الخير الإنساني',
    users: 12,
    planType: 'احترافي',
    surveyQuota: 100,
    surveyConsumed: 45,
    surveyRemaining: 55,
    joinDate: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'شركة المسؤولية الاجتماعية',
    users: 25,
    planType: 'مؤسسي',
    surveyQuota: 500,
    surveyConsumed: 320,
    surveyRemaining: 180,
    joinDate: '2023-11-20',
    status: 'active'
  },
  {
    id: '3',
    name: 'وزارة التنمية الاجتماعية',
    users: 50,
    planType: 'مؤسسي',
    surveyQuota: 1000,
    surveyConsumed: 650,
    surveyRemaining: 350,
    joinDate: '2023-08-10',
    status: 'active'
  },
  {
    id: '4',
    name: 'جمعية الرعاية الصحية',
    users: 8,
    planType: 'أساسي',
    surveyQuota: 20,
    surveyConsumed: 15,
    surveyRemaining: 5,
    joinDate: '2024-02-28',
    status: 'suspended'
  },
  {
    id: '5',
    name: 'مؤسسة التعليم للجميع',
    users: 6,
    planType: 'أساسي',
    surveyQuota: 20,
    surveyConsumed: 3,
    surveyRemaining: 17,
    joinDate: '2024-03-05',
    status: 'pending'
  }
];

// Demo transactions data
const demoTransactions: Transaction[] = [
  {
    id: '1',
    organizationName: 'مؤسسة الخير الإنساني',
    paymentMethod: 'بطاقة ائتمان',
    date: '2024-03-15',
    time: '14:30',
    amount: 299,
    status: 'completed',
    type: 'subscription',
    description: 'اشتراك شهري - الخطة الاحترافية',
    paymentDetails: {
      cardLastFour: '4532',
      transactionId: 'TXN_001234'
    }
  },
  {
    id: '2',
    organizationName: 'شركة المسؤولية الاجتماعية',
    paymentMethod: 'PayTabs',
    date: '2024-03-14',
    time: '09:15',
    amount: 7990,
    status: 'completed',
    type: 'subscription',
    description: 'اشتراك سنوي - خطة المؤسسات',
    paymentDetails: {
      transactionId: 'PT_789456'
    }
  },
  {
    id: '3',
    organizationName: 'وزارة التنمية الاجتماعية',
    paymentMethod: 'تحويل بنكي',
    date: '2024-03-13',
    time: '11:45',
    amount: 799,
    status: 'pending',
    type: 'manual',
    description: 'معاملة يدوية - دفعة إضافية',
    paymentDetails: {
      bankName: 'الراجحي',
      accountNumber: '****1234'
    }
  },
  {
    id: '4',
    organizationName: 'جمعية الرعاية الصحية',
    paymentMethod: 'بطاقة مدى',
    date: '2024-03-12',
    time: '16:20',
    amount: 99,
    status: 'completed',
    type: 'subscription',
    description: 'اشتراك شهري - الخطة الأساسية',
    paymentDetails: {
      cardLastFour: '9876'
    }
  },
  {
    id: '5',
    organizationName: 'مؤسسة التعليم للجميع',
    paymentMethod: 'Apple Pay',
    date: '2024-03-11',
    time: '13:10',
    amount: 299,
    status: 'failed',
    type: 'upgrade',
    description: 'ترقية إلى الخطة الاحترافية'
  },
  {
    id: '6',
    organizationName: 'مركز التطوير المجتمعي',
    paymentMethod: 'PayTabs',
    date: '2024-03-10',
    time: '10:30',
    amount: 2990,
    status: 'completed',
    type: 'subscription',
    description: 'اشتراك سنوي - الخطة الاحترافية',
    paymentDetails: {
      transactionId: 'PT_654321'
    }
  }
];

// Enhanced promo codes with more variety
const initialPromoCodes: PromoCode[] = [
  {
    id: '1',
    code: 'WELCOME20',
    discount: 20,
    type: 'percentage',
    description: 'خصم 20% للعملاء الجدد',
    createdAt: '2024-01-15',
    validUntil: '2024-12-31',
    usageCount: 45,
    maxUsage: 100,
    isActive: true
  },
  {
    id: '2',
    code: 'SAVE100',
    discount: 100,
    type: 'fixed',
    description: 'خصم 100 ريال على أي خطة',
    createdAt: '2024-02-01',
    validUntil: '2024-11-30',
    minAmount: 200,
    usageCount: 23,
    maxUsage: 50,
    isActive: true
  },
  {
    id: '3',
    code: 'NONPROFIT30',
    discount: 30,
    type: 'percentage',
    description: 'خصم 30% للمنظمات غير الربحية',
    createdAt: '2024-01-10',
    validUntil: '2024-12-31',
    usageCount: 78,
    isActive: true
  },
  {
    id: '4',
    code: 'STUDENT15',
    discount: 15,
    type: 'percentage',
    description: 'خصم 15% للطلاب والباحثين',
    createdAt: '2024-03-20',
    validUntil: '2024-06-30',
    usageCount: 12,
    maxUsage: 200,
    isActive: false
  },
  {
    id: '5',
    code: 'RAMADAN25',
    discount: 25,
    type: 'percentage',
    description: 'خصم رمضان الكريم - 25%',
    createdAt: '2024-03-01',
    validUntil: '2024-04-10',
    usageCount: 134,
    maxUsage: 500,
    isActive: false
  },
  {
    id: '6',
    code: 'FIRSTTIME50',
    discount: 50,
    type: 'fixed',
    description: 'خصم 50 ريال للاشتراك الأول',
    createdAt: '2024-01-20',
    usageCount: 67,
    isActive: true
  }
];

type UserRole = 'super_admin' | 'admin' | 'org_manager' | 'beneficiary';

interface SuperAdminBillingPageProps {
  userRole: UserRole;
}

export function SuperAdminBillingPage({ userRole }: SuperAdminBillingPageProps) {
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 'basic',
      name: 'الخطة الأساسية',
      description: 'مثالية للمنظمات الصغيرة والناشئة',
      monthlyPrice: 99,
      yearlyPrice: 990,
      icon: Users,
      color: 'text-blue-600',
      features: [
        { name: 'حتى 5 استبيانات شهرياً', included: true },
        { name: 'حتى 500 استجابة شهرياً', included: true },
        { name: 'التقارير الأساسية', included: true },
        { name: 'دعم فني عبر البريد الإلكتروني', included: true },
        { name: 'المساعد الذكي', included: false },
        { name: 'التحليلات المتقدمة', included: false },
        { name: 'التخصيص المتقدم', included: false },
        { name: 'API متقدم', included: false }
      ]
    },
    {
      id: 'professional',
      name: 'الخطة الاحترافية',
      description: 'للمنظمات المتوسطة التي تحتاج ميزات متقدمة',
      monthlyPrice: 299,
      yearlyPrice: 2990,
      popular: true,
      icon: BarChart3,
      color: 'text-[#183259]',
      features: [
        { name: 'استبيانات غير محدودة', included: true },
        { name: 'حتى 5,000 استجابة شهرياً', included: true },
        { name: 'التقارير المتقدمة', included: true },
        { name: 'المساعد الذكي', included: true },
        { name: 'التحليلات المتقدمة', included: true },
        { name: 'دعم فني عبر الهاتف والبريد', included: true },
        { name: 'التخصيص المتقدم', included: false },
        { name: 'API متقدم', included: false }
      ]
    },
    {
      id: 'enterprise',
      name: 'خطة المؤسسات',
      description: 'للمؤسسات الكبيرة مع احتياجات مخصصة',
      monthlyPrice: 799,
      yearlyPrice: 7990,
      icon: Crown,
      color: 'text-purple-600',
      features: [
        { name: 'استبيانات غير محدودة', included: true },
        { name: 'استجابات غير محدودة', included: true },
        { name: 'جميع أنواع التقارير', included: true },
        { name: 'المساعد الذكي المتقدم', included: true },
        { name: 'التحليلات المتقدمة والتنبؤية', included: true },
        { name: 'التخصيص الكامل', included: true },
        { name: 'API متقدم', included: true },
        { name: 'دعم فني مخصص 24/7', included: true }
      ]
    }
  ]);

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(initialPromoCodes);
  const [organizations] = useState<Organization[]>(demoOrganizations);
  const [transactions] = useState<Transaction[]>(demoTransactions);
  const [isYearly, setIsYearly] = useState(false);
  const [activeTab, setActiveTab] = useState('plans');
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isCreatePromoOpen, setIsCreatePromoOpen] = useState(false);
  const [isEditPromoOpen, setIsEditPromoOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [deletePromoId, setDeletePromoId] = useState<string | null>(null);
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);

  // Search and filter states for promo codes
  const [promoSearchTerm, setPromoSearchTerm] = useState('');
  const [promoStatusFilter, setPromoStatusFilter] = useState('all');

  // Plan editing states
  const [editPlanData, setEditPlanData] = useState({
    name: '',
    description: '',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [] as PlanFeature[]
  });

  // Promo code creation/editing states
  const [promoData, setPromoData] = useState({
    code: '',
    discount: 0,
    type: 'percentage' as 'percentage' | 'fixed',
    description: '',
    validUntil: '',
    minAmount: 0,
    maxUsage: 0
  });

  // New transaction states with payment details
  const [newTransactionData, setNewTransactionData] = useState({
    organizationId: '',
    paymentMethod: '',
    amount: 0,
    description: '',
    // Payment details fields
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    paypalEmail: '',
    transactionId: ''
  });

  // Filter promo codes based on search and status
  const filteredPromoCodes = promoCodes.filter(promo => {
    const matchesSearch = promoSearchTerm === '' || 
      promo.code.toLowerCase().includes(promoSearchTerm.toLowerCase()) ||
      promo.description.toLowerCase().includes(promoSearchTerm.toLowerCase());

    let matchesStatus = true;
    if (promoStatusFilter === 'active') {
      const today = new Date();
      const validUntil = promo.validUntil ? new Date(promo.validUntil) : null;
      matchesStatus = promo.isActive && (!validUntil || validUntil >= today);
    } else if (promoStatusFilter === 'expired') {
      const today = new Date();
      const validUntil = promo.validUntil ? new Date(promo.validUntil) : null;
      matchesStatus = !promo.isActive || (validUntil && validUntil < today);
    } else if (promoStatusFilter === 'inactive') {
      matchesStatus = !promo.isActive;
    }

    return matchesSearch && matchesStatus;
  });

  const isPromoExpired = (promo: PromoCode) => {
    if (!promo.validUntil) return false;
    return new Date(promo.validUntil) < new Date();
  };

  const getPromoStatus = (promo: PromoCode) => {
    if (!promo.isActive) return 'inactive';
    if (isPromoExpired(promo)) return 'expired';
    return 'active';
  };

  const getPromoStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'ساري';
      case 'expired': return 'منتهي';
      case 'inactive': return 'غير نشط';
      default: return status;
    }
  };

  const getPromoStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتملة';
      case 'pending': return 'قيد المعالجة';
      case 'failed': return 'فاشلة';
      default: return status;
    }
  };

  const getTotalRevenue = () => {
    return transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getCompletedTransactionsCount = () => {
    return transactions.filter(t => t.status === 'completed').length;
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setEditPlanData({
      name: plan.name,
      description: plan.description,
      monthlyPrice: plan.monthlyPrice,
      yearlyPrice: plan.yearlyPrice,
      features: [...plan.features]
    });
    setIsEditPlanOpen(true);
  };

  const handleSavePlanEdit = () => {
    if (!editingPlan) return;

    setPlans(prev => prev.map(plan => 
      plan.id === editingPlan.id ? {
        ...plan,
        name: editPlanData.name,
        description: editPlanData.description,
        monthlyPrice: editPlanData.monthlyPrice,
        yearlyPrice: editPlanData.yearlyPrice,
        features: editPlanData.features
      } : plan
    ));

    setIsEditPlanOpen(false);
    setEditingPlan(null);
    toast.success('تم تحديث الباقة بنجاح');
  };

  const handleAddFeature = () => {
    setEditPlanData(prev => ({
      ...prev,
      features: [...prev.features, { name: '', included: true }]
    }));
  };

  const handleUpdateFeature = (index: number, field: keyof PlanFeature, value: any) => {
    setEditPlanData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setEditPlanData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleCreatePromoCode = () => {
    if (!promoData.code || !promoData.description || promoData.discount <= 0) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // Check for duplicate code
    const codeExists = promoCodes.some(promo => promo.code.toUpperCase() === promoData.code.toUpperCase());
    if (codeExists) {
      toast.error('رمز الخصم موجود بالفعل');
      return;
    }

    const newPromo: PromoCode = {
      id: (promoCodes.length + 1).toString(),
      code: promoData.code.toUpperCase(),
      discount: promoData.discount,
      type: promoData.type,
      description: promoData.description,
      createdAt: new Date().toISOString().split('T')[0],
      validUntil: promoData.validUntil || undefined,
      minAmount: promoData.minAmount || undefined,
      maxUsage: promoData.maxUsage || undefined,
      usageCount: 0,
      isActive: true
    };

    setPromoCodes(prev => [newPromo, ...prev]);
    resetPromoData();
    setIsCreatePromoOpen(false);
    toast.success('تم إنشاء الرمز الترويجي بنجاح');
  };

  const handleEditPromoCode = (promo: PromoCode) => {
    setEditingPromo(promo);
    setPromoData({
      code: promo.code,
      discount: promo.discount,
      type: promo.type,
      description: promo.description,
      validUntil: promo.validUntil || '',
      minAmount: promo.minAmount || 0,
      maxUsage: promo.maxUsage || 0
    });
    setIsEditPromoOpen(true);
  };

  const handleUpdatePromoCode = () => {
    if (!editingPromo) return;

    if (!promoData.code || !promoData.description || promoData.discount <= 0) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // Check for duplicate code (excluding current)
    const codeExists = promoCodes.some(promo => 
      promo.id !== editingPromo.id && promo.code.toUpperCase() === promoData.code.toUpperCase()
    );
    if (codeExists) {
      toast.error('رمز الخصم موجود بالفعل');
      return;
    }

    setPromoCodes(prev => prev.map(promo => 
      promo.id === editingPromo.id ? {
        ...promo,
        code: promoData.code.toUpperCase(),
        discount: promoData.discount,
        type: promoData.type,
        description: promoData.description,
        validUntil: promoData.validUntil || undefined,
        minAmount: promoData.minAmount || undefined,
        maxUsage: promoData.maxUsage || undefined
      } : promo
    ));

    resetPromoData();
    setIsEditPromoOpen(false);
    setEditingPromo(null);
    toast.success('تم تحديث الرمز الترويجي بنجاح');
  };

  const resetPromoData = () => {
    setPromoData({
      code: '',
      discount: 0,
      type: 'percentage',
      description: '',
      validUntil: '',
      minAmount: 0,
      maxUsage: 0
    });
  };

  const resetTransactionData = () => {
    setNewTransactionData({
      organizationId: '',
      paymentMethod: '',
      amount: 0,
      description: '',
      // Payment details fields
      cardNumber: '',
      cardHolderName: '',
      expiryDate: '',
      cvv: '',
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      paypalEmail: '',
      transactionId: ''
    });
  };

  const handleCreateTransaction = () => {
    if (!newTransactionData.organizationId || !newTransactionData.paymentMethod || newTransactionData.amount <= 0) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const selectedOrg = organizations.find(org => org.id === newTransactionData.organizationId);
    if (!selectedOrg) {
      toast.error('المنظمة المحددة غير صحيحة');
      return;
    }

    // Validate payment details based on method
    if (newTransactionData.paymentMethod === 'بطاقة ائتمان' || newTransactionData.paymentMethod === 'بطاقة مدى') {
      if (!newTransactionData.cardNumber || !newTransactionData.cardHolderName || !newTransactionData.expiryDate || !newTransactionData.cvv) {
        toast.error('يرجى ملء جميع بيانات البطاقة');
        return;
      }
    } else if (newTransactionData.paymentMethod === 'تحويل بنكي') {
      if (!newTransactionData.bankName || !newTransactionData.accountNumber) {
        toast.error('يرجى ملء بيانات البنك');
        return;
      }
    }

    // Here you would normally send the data to your backend
    resetTransactionData();
    setIsNewTransactionOpen(false);
    toast.success('تم إنشاء المعاملة بنجاح');
  };

  const togglePromoStatus = (id: string) => {
    setPromoCodes(prev => prev.map(promo => 
      promo.id === id ? { ...promo, isActive: !promo.isActive } : promo
    ));
    toast.success('تم تحديث حالة الرمز الترويجي');
  };

  const handleDeletePromoCode = (id: string) => {
    const promo = promoCodes.find(p => p.id === id);
    setPromoCodes(prev => prev.filter(promo => promo.id !== id));
    setDeletePromoId(null);
    toast.success(`تم حذف الرمز الترويجي "${promo?.code}" بنجاح`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'suspended': return 'معلق';
      case 'pending': return 'في الانتظار';
      default: return status;
    }
  };

  // Function to render payment details fields based on selected method
  const renderPaymentDetailsFields = () => {
    switch (newTransactionData.paymentMethod) {
      case 'بطاقة ائتمان':
      case 'بطاقة مدى':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="card-number">رقم البطاقة *</Label>
                <Input
                  id="card-number"
                  value={newTransactionData.cardNumber}
                  onChange={(e) => setNewTransactionData(prev => ({ ...prev, cardNumber: e.target.value }))}
                  placeholder="1234 5678 9012 3456"
                  className="text-right"
                />
              </div>
              <div>
                <Label htmlFor="card-holder">اسم حامل البطاقة *</Label>
                <Input
                  id="card-holder"
                  value={newTransactionData.cardHolderName}
                  onChange={(e) => setNewTransactionData(prev => ({ ...prev, cardHolderName: e.target.value }))}
                  placeholder="اسم حامل البطاقة"
                  className="text-right"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">تاريخ الانتهاء *</Label>
                <Input
                  id="expiry"
                  value={newTransactionData.expiryDate}
                  onChange={(e) => setNewTransactionData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  placeholder="MM/YY"
                  className="text-right"
                />
              </div>
              <div>
                <Label htmlFor="cvv">رمز الأمان *</Label>
                <Input
                  id="cvv"
                  value={newTransactionData.cvv}
                  onChange={(e) => setNewTransactionData(prev => ({ ...prev, cvv: e.target.value }))}
                  placeholder="123"
                  className="text-right"
                />
              </div>
            </div>
          </>
        );
      case 'تحويل بنكي':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bank-name">اسم البنك *</Label>
                <Select 
                  value={newTransactionData.bankName} 
                  onValueChange={(value) => setNewTransactionData(prev => ({ ...prev, bankName: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر البنك" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="الراجحي">الراجحي</SelectItem>
                    <SelectItem value="الأهلي">الأهلي</SelectItem>
                    <SelectItem value="الرياض">الرياض</SelectItem>
                    <SelectItem value="سامبا">سامبا</SelectItem>
                    <SelectItem value="البلاد">البلاد</SelectItem>
                    <SelectItem value="الإنماء">الإنماء</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="account-number">رقم الحساب *</Label>
                <Input
                  id="account-number"
                  value={newTransactionData.accountNumber}
                  onChange={(e) => setNewTransactionData(prev => ({ ...prev, accountNumber: e.target.value }))}
                  placeholder="SA0000000000000000000000"
                  className="text-right"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="routing-number">IBAN</Label>
              <Input
                id="routing-number"
                value={newTransactionData.routingNumber}
                onChange={(e) => setNewTransactionData(prev => ({ ...prev, routingNumber: e.target.value }))}
                placeholder="SA0000000000000000000000"
                className="text-right"
              />
            </div>
          </>
        );
      case 'PayTabs':
      case 'STC Pay':
      case 'Apple Pay':
        return (
          <div>
            <Label htmlFor="transaction-id">معرف المعاملة</Label>
            <Input
              id="transaction-id"
              value={newTransactionData.transactionId}
              onChange={(e) => setNewTransactionData(prev => ({ ...prev, transactionId: e.target.value }))}
              placeholder="TXN_123456789"
              className="text-right"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const headerStats = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{plans.length}</div>
            <div className="text-blue-200">باقات متاحة</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Gift className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{filteredPromoCodes.filter(p => getPromoStatus(p) === 'active').length}</div>
            <div className="text-blue-200">أكواد خصم نشطة</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <DollarSign className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{getTotalRevenue().toLocaleString()}</div>
            <div className="text-blue-200">إجمالي الإيرادات (ريال)</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{getCompletedTransactionsCount()}</div>
            <div className="text-blue-200">معاملات مكتملة</div>
          </div>
        </div>
      </div>
    </div>
  );

  const PromoCodeDialog = ({ isOpen, onClose, onSubmit, title, isEditing = false }: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title: string;
    isEditing?: boolean;
  }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'قم بتعديل بيانات الرمز الترويجي' : 'قم بإعداد رمز ترويجي جديد مع تحديد الخصم والشروط'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="promo-code">الرمز الترويجي *</Label>
            <Input
              id="promo-code"
              value={promoData.code}
              onChange={(e) => setPromoData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
              placeholder="مثال: SUMMER2024"
              className="text-right"
            />
          </div>

          <div>
            <Label htmlFor="discount-type">نوع الخصم</Label>
            <Select 
              value={promoData.type} 
              onValueChange={(value: 'percentage' | 'fixed') => setPromoData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                <SelectItem value="fixed">مبلغ ثابت (ريال)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="discount-value">قيمة الخصم *</Label>
            <Input
              id="discount-value"
              type="number"
              value={promoData.discount}
              onChange={(e) => setPromoData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
              placeholder={promoData.type === 'percentage' ? '20' : '100'}
              className="text-right"
            />
          </div>

          <div>
            <Label htmlFor="description">الوصف *</Label>
            <Input
              id="description"
              value={promoData.description}
              onChange={(e) => setPromoData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="وصف الرمز الترويجي"
              className="text-right"
            />
          </div>

          <div>
            <Label htmlFor="valid-until">تاريخ انتهاء الصلاحية</Label>
            <Input
              id="valid-until"
              type="date"
              value={promoData.validUntil}
              onChange={(e) => setPromoData(prev => ({ ...prev, validUntil: e.target.value }))}
              className="text-right"
            />
          </div>

          <div>
            <Label htmlFor="min-amount">الحد الأدنى للمبلغ (ريال)</Label>
            <Input
              id="min-amount"
              type="number"
              value={promoData.minAmount}
              onChange={(e) => setPromoData(prev => ({ ...prev, minAmount: parseFloat(e.target.value) || 0 }))}
              placeholder="0"
              className="text-right"
            />
          </div>

          <div>
            <Label htmlFor="max-usage">الحد الأقصى للاستخدام</Label>
            <Input
              id="max-usage"
              type="number"
              value={promoData.maxUsage}
              onChange={(e) => setPromoData(prev => ({ ...prev, maxUsage: parseInt(e.target.value) || 0 }))}
              placeholder="0 = غير محدود"
              className="text-right"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={onSubmit} className="flex-1 bg-[#183259] hover:bg-[#2a4a7a]">
              {isEditing ? 'حفظ التغييرات' : 'إنشاء الرمز'}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <EnhancedPageLayout
      pageId="super-admin-billing"
      userRole={userRole}
      description="إدارة الباقات والأكواد الترويجية والمعاملات ومراقبة اشتراكات المنظمات"
      icon={<CreditCard className="h-8 w-8" />}
      headerContent={headerStats}
    >
      <div className="space-y-6">
        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              إدارة الباقات
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              المعاملات
            </TabsTrigger>
            <TabsTrigger value="promos" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              الأكواد الترويجية
            </TabsTrigger>
          </TabsList>

          {/* Plans Management Tab */}
          <TabsContent value="plans" className="space-y-6">
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <Label htmlFor="billing-toggle" className={!isYearly ? 'font-semibold' : ''}>
                شهري
              </Label>
              <Switch
                id="billing-toggle"
                checked={isYearly}
                onCheckedChange={setIsYearly}
              />
              <Label htmlFor="billing-toggle" className={isYearly ? 'font-semibold' : ''}>
                سنوي
              </Label>
              {isYearly && (
                <Badge variant="destructive" className="mr-2">
                  وفر 17%
                </Badge>
              )}
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative ${plan.popular ? 'border-[#183259] border-2 shadow-xl' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-[#183259] text-white px-4 py-1">
                        <Star className="h-3 w-3 ml-1" />
                        الأكثر شعبية
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-6 pt-8">
                    <div className={`inline-flex p-3 rounded-full bg-gray-50 w-fit mx-auto mb-4`}>
                      <plan.icon className={`h-8 w-8 ${plan.color}`} />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
                    
                    <div className="mt-6">
                      <div className="flex items-baseline justify-center">
                        <span className={`text-4xl font-bold text-[#183259]`}>
                          {Math.round(isYearly ? plan.yearlyPrice : plan.monthlyPrice)}
                        </span>
                        <span className="text-gray-500 mr-1">ريال</span>
                        <span className="text-gray-500 text-sm">
                          /{isYearly ? 'سنة' : 'شهر'}
                        </span>
                      </div>
                      
                      {isYearly && (
                        <p className="text-sm text-gray-500 mt-1">
                          ({Math.round(plan.yearlyPrice / 12)} ريال/شهر)
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mt-0.5 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? '' : 'text-gray-400'}`}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleEditPlan(plan)}
                      variant="outline"
                      className="w-full mt-6"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      تعديل الباقة
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">إدارة المعاملات</h3>
              <Button 
                onClick={() => setIsNewTransactionOpen(true)}
                className="bg-[#183259] hover:bg-[#2a4a7a]"
              >
                <Plus className="h-4 w-4 mr-2" />
                إجراء معاملة جديدة
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">اسم المنظمة</TableHead>
                      <TableHead className="text-right">طريقة الدفع</TableHead>
                      <TableHead className="text-right">التاريخ والوقت</TableHead>
                      <TableHead className="text-right">المبلغ الإجمالي</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الوصف</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.organizationName}</TableCell>
                        <TableCell>{transaction.paymentMethod}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{transaction.date}</span>
                            <span className="text-sm text-gray-500">{transaction.time}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">{transaction.amount.toLocaleString()} ريال</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTransactionStatusColor(transaction.status)}>
                            {getTransactionStatusLabel(transaction.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {transaction.description}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                عرض التفاصيل
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                تعديل المعاملة
                              </DropdownMenuItem>
                              {transaction.status === 'pending' && (
                                <DropdownMenuItem>
                                  <Check className="mr-2 h-4 w-4" />
                                  تأكيد المعاملة
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New Transaction Dialog */}
          <Dialog open={isNewTransactionOpen} onOpenChange={setIsNewTransactionOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
              <DialogHeader>
                <DialogTitle>إنشاء معاملة جديدة</DialogTitle>
                <DialogDescription>
                  قم بإنشاء معاملة مالية جديدة لصالح إحدى المنظمات مع تسجيل بيانات الدفع
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="organization-select">المنظمة *</Label>
                    <Select 
                      value={newTransactionData.organizationId} 
                      onValueChange={(value) => setNewTransactionData(prev => ({ ...prev, organizationId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المنظمة" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount">المبلغ (ريال) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newTransactionData.amount}
                      onChange={(e) => setNewTransactionData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                      className="text-right"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="payment-method-select">طريقة الدفع *</Label>
                  <Select 
                    value={newTransactionData.paymentMethod} 
                    onValueChange={(value) => setNewTransactionData(prev => ({ ...prev, paymentMethod: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر طريقة الدفع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="بطاقة ائتمان">بطاقة ائتمان</SelectItem>
                      <SelectItem value="بطاقة مدى">بطاقة مدى</SelectItem>
                      <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
                      <SelectItem value="PayTabs">PayTabs</SelectItem>
                      <SelectItem value="Apple Pay">Apple Pay</SelectItem>
                      <SelectItem value="STC Pay">STC Pay</SelectItem>
                      <SelectItem value="نقدي">نقدي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Details Section */}
                {newTransactionData.paymentMethod && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      بيانات الدفع - {newTransactionData.paymentMethod}
                    </h4>
                    {renderPaymentDetailsFields()}
                  </div>
                )}

                <div>
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={newTransactionData.description}
                    onChange={(e) => setNewTransactionData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="وصف المعاملة (اختياري)"
                    className="text-right"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateTransaction} className="flex-1 bg-[#183259] hover:bg-[#2a4a7a]">
                    <Plus className="h-4 w-4 mr-2" />
                    إنشاء المعاملة
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setIsNewTransactionOpen(false);
                    resetTransactionData();
                  }} className="flex-1">
                    إلغاء
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Promo Codes Tab */}
          <TabsContent value="promos" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">إدارة الأكواد الترويجية</h3>
                <p className="text-gray-600 text-sm">
                  أنشئ وأدر الأكواد الترويجية لمنح المنظمات خصومات خاصة
                </p>
              </div>
              
              <Button onClick={() => setIsCreatePromoOpen(true)} className="w-full sm:w-auto bg-[#183259] hover:bg-[#2a4a7a]">
                <Plus className="h-4 w-4 mr-2" />
                إنشاء رمز ترويجي
              </Button>
            </div>

            {/* Search and Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="البحث في الأكواد الترويجية..."
                        value={promoSearchTerm}
                        onChange={(e) => setPromoSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={promoStatusFilter} onValueChange={setPromoStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأكواد</SelectItem>
                      <SelectItem value="active">نشطة</SelectItem>
                      <SelectItem value="expired">منتهية الصلاحية</SelectItem>
                      <SelectItem value="inactive">غير نشطة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Promo Codes Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الرمز</TableHead>
                      <TableHead className="text-right">الخصم</TableHead>
                      <TableHead className="text-right">الوصف</TableHead>
                      <TableHead className="text-right">الاستخدام</TableHead>
                      <TableHead className="text-right">تاريخ الانتهاء</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPromoCodes.map((promo) => {
                      const status = getPromoStatus(promo);
                      return (
                        <TableRow key={promo.id}>
                          <TableCell className="font-mono font-semibold">
                            {promo.code}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-gray-500" />
                              <span className="font-semibold">
                                {promo.discount}
                                {promo.type === 'percentage' ? '%' : ' ريال'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="truncate">{promo.description}</p>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{promo.usageCount} استخدام</div>
                              {promo.maxUsage && (
                                <div className="text-gray-500">
                                  من أصل {promo.maxUsage}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {promo.validUntil ? (
                              <div className="text-sm">
                                {new Date(promo.validUntil).toLocaleDateString('ar-SA')}
                              </div>
                            ) : (
                              <div className="text-gray-500 text-sm">غير محدد</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={getPromoStatusColor(status)}>
                              {getPromoStatusLabel(status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditPromoCode(promo)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>تعديل الرمز</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => togglePromoStatus(promo.id)}
                                    >
                                      {promo.isActive ? (
                                        <XCircle className="h-4 w-4 text-red-500" />
                                      ) : (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{promo.isActive ? 'إلغاء تفعيل' : 'تفعيل'}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <AlertDialog open={deletePromoId === promo.id} onOpenChange={(open) => setDeletePromoId(open ? promo.id : null)}>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent dir="rtl">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      هل أنت متأكد من حذف الرمز الترويجي "{promo.code}"؟ لا يمكن التراجع عن هذا الإجراء.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeletePromoCode(promo.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      حذف
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {filteredPromoCodes.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Gift className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-semibold mb-2">لا توجد أكواد ترويجية</p>
                    <p className="text-sm">
                      {promoSearchTerm || promoStatusFilter !== 'all' 
                        ? 'لا توجد نتائج تطابق البحث' 
                        : 'ابدأ بإنشاء أول رمز ترويجي'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organizations Tab */}
          <TabsContent value="organizations" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">المنظمات المشتركة</h3>
                <p className="text-gray-600 text-sm">
                  مراقبة حالة اشتراكات المنظمات واستخدامها للخدمة
                </p>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">اسم المنظمة</TableHead>
                      <TableHead className="text-right">المستخدمين</TableHead>
                      <TableHead className="text-right">نوع الباقة</TableHead>
                      <TableHead className="text-right">كوتة الاستبيانات</TableHead>
                      <TableHead className="text-right">الاستخدام</TableHead>
                      <TableHead className="text-right">تاريخ الانضمام</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.map((org) => {
                      const usagePercentage = (org.surveyConsumed / org.surveyQuota) * 100;
                      return (
                        <TableRow key={org.id}>
                          <TableCell className="font-semibold">
                            <div className="flex items-center gap-3">
                              <Building className="h-5 w-5 text-gray-500" />
                              {org.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-500" />
                              {org.users}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{org.planType}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{org.surveyQuota} استبيان</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>{org.surveyConsumed} مستخدم</span>
                                <span className="text-gray-500">{Math.round(usagePercentage)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    usagePercentage > 80 ? 'bg-red-500' : 
                                    usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                />
                              </div>
                              <div className="text-xs text-gray-500">
                                {org.surveyRemaining} متبقي
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(org.joinDate).toLocaleDateString('ar-SA')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(org.status)}>
                              {getStatusLabel(org.status)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Plan Edit Dialog */}
        <Dialog open={isEditPlanOpen} onOpenChange={setIsEditPlanOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>تعديل {editingPlan?.name}</DialogTitle>
              <DialogDescription>
                قم بتعديل تفاصيل الباقة والميزات المتاحة
              </DialogDescription>
            </DialogHeader>
            
            {editingPlan && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plan-name">اسم الباقة</Label>
                    <Input
                      id="plan-name"
                      value={editPlanData.name}
                      onChange={(e) => setEditPlanData(prev => ({ ...prev, name: e.target.value }))}
                      className="text-right"
                    />
                  </div>

                  <div>
                    <Label htmlFor="plan-description">الوصف</Label>
                    <Input
                      id="plan-description"
                      value={editPlanData.description}
                      onChange={(e) => setEditPlanData(prev => ({ ...prev, description: e.target.value }))}
                      className="text-right"
                    />
                  </div>

                  <div>
                    <Label htmlFor="monthly-price">السعر الشهري (ريال)</Label>
                    <Input
                      id="monthly-price"
                      type="number"
                      value={editPlanData.monthlyPrice}
                      onChange={(e) => setEditPlanData(prev => ({ ...prev, monthlyPrice: parseFloat(e.target.value) || 0 }))}
                      className="text-right"
                    />
                  </div>

                  <div>
                    <Label htmlFor="yearly-price">السعر السنوي (ريال)</Label>
                    <Input
                      id="yearly-price"
                      type="number"
                      value={editPlanData.yearlyPrice}
                      onChange={(e) => setEditPlanData(prev => ({ ...prev, yearlyPrice: parseFloat(e.target.value) || 0 }))}
                      className="text-right"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Label>المميزات</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddFeature}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      إضافة ميزة
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {editPlanData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Switch
                          checked={feature.included}
                          onCheckedChange={(checked) => handleUpdateFeature(index, 'included', checked)}
                        />
                        <Input
                          value={feature.name}
                          onChange={(e) => handleUpdateFeature(index, 'name', e.target.value)}
                          placeholder="اسم الميزة"
                          className="flex-1 text-right"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFeature(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditPlanOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleSavePlanEdit} className="bg-[#183259] hover:bg-[#2a4a7a]">
                    <Save className="h-4 w-4 mr-2" />
                    حفظ التغييرات
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Promo Code Dialogs */}
        <PromoCodeDialog
          isOpen={isCreatePromoOpen}
          onClose={() => {
            setIsCreatePromoOpen(false);
            resetPromoData();
          }}
          onSubmit={handleCreatePromoCode}
          title="إنشاء رمز ترويجي جديد"
        />

        <PromoCodeDialog
          isOpen={isEditPromoOpen}
          onClose={() => {
            setIsEditPromoOpen(false);
            setEditingPromo(null);
            resetPromoData();
          }}
          onSubmit={handleUpdatePromoCode}
          title="تعديل الرمز الترويجي"
          isEditing={true}
        />
      </div>
    </EnhancedPageLayout>
  );
}