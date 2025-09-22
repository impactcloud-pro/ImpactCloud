import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { EnhancedPageLayout } from './EnhancedPageLayout';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Check, 
  X, 
  Star, 
  CreditCard, 
  Users,
  BarChart3,
  Crown,
  Building,
  AlertCircle,
  Edit,
  Plus,
  Save,
  Trash2,
  Package,
  TrendingUp,
  Eye,
  MoreHorizontal,
  DollarSign,
  Calendar,
  Filter
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Textarea } from './ui/textarea';

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
    description: 'اشتراك شهري - الخطة الاحترافية'
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
    description: 'اشتراك سنوي - خطة المؤسسات'
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
    description: 'معاملة يدوية - دفعة إضافية'
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
    description: 'اشتراك شهري - الخطة الأساسية'
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
    description: 'اشتراك سنوي - الخطة الاحترافية'
  }
];

type UserRole = 'super_admin' | 'admin' | 'org_manager' | 'beneficiary';

interface AdminBillingPageProps {
  userRole: UserRole;
}

export function AdminBillingPage({ userRole }: AdminBillingPageProps) {
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

  const [organizations] = useState<Organization[]>(demoOrganizations);
  const [transactions] = useState<Transaction[]>(demoTransactions);
  const [isYearly, setIsYearly] = useState(false);
  const [activeTab, setActiveTab] = useState('plans');
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
  const [isDeleteTransactionOpen, setIsDeleteTransactionOpen] = useState(false);
  const [isViewTransactionOpen, setIsViewTransactionOpen] = useState(false);
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Plan editing states
  const [editPlanData, setEditPlanData] = useState({
    name: '',
    description: '',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [] as PlanFeature[]
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
      <div className="bg-white/10 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-white" />
          <div>
            <div className="text-3xl font-bold text-white">{plans.length}</div>
            <div className="text-blue-200">باقات متاحة</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-white" />
          <div>
            <div className="text-3xl font-bold text-white">{getTotalRevenue().toLocaleString()}</div>
            <div className="text-blue-200">إجمالي الإيرادات (ريال)</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-white" />
          <div>
            <div className="text-3xl font-bold text-white">{getCompletedTransactionsCount()}</div>
            <div className="text-blue-200">معاملات مكتملة</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Transaction action handlers
  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsViewTransactionOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditTransactionOpen(true);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteTransactionOpen(true);
  };

  const confirmDeleteTransaction = () => {
    if (selectedTransaction) {
      // Here you would normally delete from backend
      toast.success(`تم حذف المعاملة ${selectedTransaction.id} بنجاح`);
      setIsDeleteTransactionOpen(false);
      setSelectedTransaction(null);
    }
  };

  return (
    <EnhancedPageLayout
      pageId="admin-billing"
      userRole={userRole}
      description="إدارة الباقات والمعاملات ومراقبة اشتراكات المنظمات"
      icon={<CreditCard className="h-8 w-8" />}
      headerContent={headerStats}
    >
      <div className="space-y-6">
        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              إدارة الباقات
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              المعاملات
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
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              onClick={() => handleViewTransaction(transaction)}
                              title="عرض التفاصيل"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-800 hover:bg-green-50"
                              onClick={() => handleEditTransaction(transaction)}
                              title="تعديل المعاملة"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                              onClick={() => handleDeleteTransaction(transaction)}
                              title="حذف المعاملة"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organizations Tab */}
          <TabsContent value="organizations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">المنظمات المشتركة</h3>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">اسم المنظمة</TableHead>
                      <TableHead className="text-right">عدد المستخدمين</TableHead>
                      <TableHead className="text-right">نوع الباقة</TableHead>
                      <TableHead className="text-right">الحصة الشهرية</TableHead>
                      <TableHead className="text-right">المستهلك</TableHead>
                      <TableHead className="text-right">المتبقي</TableHead>
                      <TableHead className="text-right">تاريخ الانضمام</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell className="font-medium">{org.name}</TableCell>
                        <TableCell>{org.users}</TableCell>
                        <TableCell>{org.planType}</TableCell>
                        <TableCell>{org.surveyQuota}</TableCell>
                        <TableCell>{org.surveyConsumed}</TableCell>
                        <TableCell>{org.surveyRemaining}</TableCell>
                        <TableCell>{org.joinDate}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(org.status)}>
                            {getStatusLabel(org.status)}
                          </Badge>
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
                                تعديل الباقة
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <AlertCircle className="mr-2 h-4 w-4" />
                                تعليق الحساب
                              </DropdownMenuItem>
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
        </Tabs>

        {/* Edit Plan Dialog */}
        <Dialog open={isEditPlanOpen} onOpenChange={setIsEditPlanOpen}>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>تعديل الباقة</DialogTitle>
              <DialogDescription>
                قم بتعديل تفاصيل الباقة والميزات المتاحة
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div className="flex justify-between items-center mb-3">
                  <Label>الميزات</Label>
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
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {editPlanData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                      <Input
                        value={feature.name}
                        onChange={(e) => handleUpdateFeature(index, 'name', e.target.value)}
                        placeholder="اسم الميزة"
                        className="flex-1 text-right"
                      />
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`feature-${index}`} className="text-sm">
                          متاحة
                        </Label>
                        <Switch
                          id={`feature-${index}`}
                          checked={feature.included}
                          onCheckedChange={(checked) => handleUpdateFeature(index, 'included', checked)}
                        />
                      </div>
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

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSavePlanEdit} className="flex-1 bg-[#183259] hover:bg-[#2a4a7a]">
                  <Save className="h-4 w-4 mr-2" />
                  حفظ التغييرات
                </Button>
                <Button variant="outline" onClick={() => setIsEditPlanOpen(false)} className="flex-1">
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

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

        {/* View Transaction Dialog */}
        <Dialog open={isViewTransactionOpen} onOpenChange={setIsViewTransactionOpen}>
          <DialogContent className="max-w-lg" dir="rtl">
            <DialogHeader>
              <DialogTitle>تفاصيل المعاملة</DialogTitle>
              <DialogDescription>
                عرض تفاصيل المعاملة المالية
              </DialogDescription>
            </DialogHeader>
            {selectedTransaction && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">اسم المنظمة</Label>
                    <p className="text-sm">{selectedTransaction.organizationName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">رقم المعاملة</Label>
                    <p className="text-sm">{selectedTransaction.id}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">طريقة الدفع</Label>
                    <p className="text-sm">{selectedTransaction.paymentMethod}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">نوع المعاملة</Label>
                    <p className="text-sm capitalize">{selectedTransaction.type}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">التاريخ</Label>
                    <p className="text-sm">{selectedTransaction.date}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">الوقت</Label>
                    <p className="text-sm">{selectedTransaction.time}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">المبلغ</Label>
                    <p className="text-lg font-semibold text-[#183259]">
                      {selectedTransaction.amount.toLocaleString()} ريال
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">الحالة</Label>
                    <Badge className={getTransactionStatusColor(selectedTransaction.status)}>
                      {getTransactionStatusLabel(selectedTransaction.status)}
                    </Badge>
                  </div>
                </div>
                
                {selectedTransaction.description && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">الوصف</Label>
                    <p className="text-sm">{selectedTransaction.description}</p>
                  </div>
                )}
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => {
                      setIsViewTransactionOpen(false);
                      setSelectedTransaction(null);
                    }}
                    className="flex-1"
                    variant="outline"
                  >
                    إغلاق
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Transaction Dialog */}
        <Dialog open={isEditTransactionOpen} onOpenChange={setIsEditTransactionOpen}>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>تعديل المعاملة</DialogTitle>
              <DialogDescription>
                قم بتحديث بيانات المعاملة المالية
              </DialogDescription>
            </DialogHeader>
            {selectedTransaction && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-organization">اسم المنظمة</Label>
                    <Input
                      id="edit-organization"
                      value={selectedTransaction.organizationName}
                      disabled
                      className="text-right bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-amount">المبلغ (ريال)</Label>
                    <Input
                      id="edit-amount"
                      type="number"
                      defaultValue={selectedTransaction.amount}
                      className="text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-payment-method">طريقة الدفع</Label>
                    <Select defaultValue={selectedTransaction.paymentMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="بطاقة ائتمان">بطاقة ائتمان</SelectItem>
                        <SelectItem value="بطاقة مدى">بطاقة مدى</SelectItem>
                        <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
                        <SelectItem value="PayTabs">PayTabs</SelectItem>
                        <SelectItem value="Apple Pay">Apple Pay</SelectItem>
                        <SelectItem value="STC Pay">STC Pay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-status">الحالة</Label>
                    <Select defaultValue={selectedTransaction.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">مكتملة</SelectItem>
                        <SelectItem value="pending">قيد المعالجة</SelectItem>
                        <SelectItem value="failed">فاشلة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-description">الوصف</Label>
                  <Textarea
                    id="edit-description"
                    defaultValue={selectedTransaction.description}
                    className="text-right"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => {
                      toast.success('تم تحديث المعاملة بنجاح');
                      setIsEditTransactionOpen(false);
                      setSelectedTransaction(null);
                    }}
                    className="flex-1 bg-[#183259] hover:bg-[#2a4a7a]"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    حفظ التغييرات
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditTransactionOpen(false);
                      setSelectedTransaction(null);
                    }}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteTransactionOpen} onOpenChange={setIsDeleteTransactionOpen}>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                تأكيد حذف المعاملة
              </DialogTitle>
              <DialogDescription>
                هل أنت متأكد من رغبتك في حذف هذه المعاملة؟ لا يمكن التراجع عن هذا الإجراء.
              </DialogDescription>
            </DialogHeader>
            {selectedTransaction && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">المنظمة:</span>
                      <span className="text-sm">{selectedTransaction.organizationName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">المبلغ:</span>
                      <span className="text-sm font-semibold">{selectedTransaction.amount.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">التاريخ:</span>
                      <span className="text-sm">{selectedTransaction.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={confirmDeleteTransaction}
                    variant="destructive"
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    نعم، احذف المعاملة
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsDeleteTransactionOpen(false);
                      setSelectedTransaction(null);
                    }}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </EnhancedPageLayout>
  );
}