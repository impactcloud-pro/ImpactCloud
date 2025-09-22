import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  CreditCard, 
  Shield, 
  Zap, 
  User, 
  Building2, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PaymentData {
  // Plan information
  planId: string;
  planName: string;
  originalPrice: number;
  discountedPrice: number;
  isYearly: boolean;
  promoCode?: string;

  // Personal information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organizationName: string;
  vatNumber?: string;

  // Address
  country: string;
  city: string;
  address: string;
  postalCode: string;

  // Payment method
  paymentMethod: 'card' | 'bank' | 'stc_pay';

  // Card details (if applicable)
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  cardholderName?: string;

  // Bank transfer details (if applicable)
  bankName?: string;
  accountNumber?: string;
  iban?: string;

  // STC Pay details (if applicable)
  stcPhoneNumber?: string;
}

interface PaymentProcessorProps {
  planId: string;
  planName: string;
  originalPrice: number;
  discountedPrice: number;
  isYearly: boolean;
  promoCode?: string;
  paymentMethod: 'card' | 'bank' | 'stc_pay';
  onSuccess: (subscriptionId: string) => void;
  onCancel: () => void;
}

const countries = [
  'المملكة العربية السعودية',
  'دولة الإمارات العربية المتحدة',
  'الكويت',
  'قطر',
  'البحرين',
  'عمان',
  'الأردن',
  'لبنان',
  'مصر',
  'أخرى'
];

export function PaymentProcessor({
  planId,
  planName,
  originalPrice,
  discountedPrice,
  isYearly,
  promoCode,
  paymentMethod,
  onSuccess,
  onCancel
}: PaymentProcessorProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');
  const [paymentData, setPaymentData] = useState<Partial<PaymentData>>({
    planId,
    planName,
    originalPrice,
    discountedPrice,
    isYearly,
    promoCode,
    paymentMethod,
    country: 'المملكة العربية السعودية'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState('');

  const formatPrice = (price: number) => Math.round(price);
  const savings = formatPrice(originalPrice - discountedPrice);

  const validatePersonalDetails = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentData.firstName?.trim()) {
      newErrors.firstName = 'الاسم الأول مطلوب';
    }
    if (!paymentData.lastName?.trim()) {
      newErrors.lastName = 'اسم العائلة مطلوب';
    }
    if (!paymentData.email?.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(paymentData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    if (!paymentData.phone?.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    }
    if (!paymentData.organizationName?.trim()) {
      newErrors.organizationName = 'اسم المنظمة مطلوب';
    }
    if (!paymentData.city?.trim()) {
      newErrors.city = 'المدينة مطلوبة';
    }
    if (!paymentData.address?.trim()) {
      newErrors.address = 'العنوان مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentDetails = () => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === 'card') {
      if (!paymentData.cardNumber?.replace(/\s/g, '')) {
        newErrors.cardNumber = 'رقم البطاقة مطلوب';
      } else if (paymentData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'رقم البطاقة غير صحيح';
      }
      
      if (!paymentData.expiryMonth) {
        newErrors.expiryMonth = 'شهر انتهاء الصلاحية مطلوب';
      }
      if (!paymentData.expiryYear) {
        newErrors.expiryYear = 'سنة انتهاء الصلاحية مطلوبة';
      }
      if (!paymentData.cvv?.trim()) {
        newErrors.cvv = 'رمز الأمان مطلوب';
      } else if (paymentData.cvv.length < 3) {
        newErrors.cvv = 'رمز الأمان غير صحيح';
      }
      if (!paymentData.cardholderName?.trim()) {
        newErrors.cardholderName = 'اسم حامل البطاقة مطلوب';
      }
    } else if (paymentMethod === 'bank') {
      if (!paymentData.bankName?.trim()) {
        newErrors.bankName = 'اسم البنك مطلوب';
      }
      if (!paymentData.iban?.trim()) {
        newErrors.iban = 'رقم الآيبان مطلوب';
      }
    } else if (paymentMethod === 'stc_pay') {
      if (!paymentData.stcPhoneNumber?.trim()) {
        newErrors.stcPhoneNumber = 'رقم هاتف STC Pay مطلوب';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePersonalDetailsSubmit = () => {
    if (validatePersonalDetails()) {
      setStep('payment');
    }
  };

  const processPayment = async () => {
    if (!validatePaymentDetails()) return;

    setStep('processing');
    setIsProcessing(true);

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate subscription ID
      const subId = `SUB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSubscriptionId(subId);
      
      setStep('success');
      toast.success('تم الدفع بنجاح! مرحباً بك في منصة قياس الأثر الاجتماعي');
    } catch (error) {
      toast.error('حدث خطأ في عملية الدفع. يرجى المحاولة مرة أخرى');
      setStep('payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const renderPersonalDetailsForm = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            المعلومات الشخصية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>الاسم الأول *</Label>
              <Input
                value={paymentData.firstName || ''}
                onChange={(e) => setPaymentData(prev => ({ ...prev, firstName: e.target.value }))}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <Label>اسم العائلة *</Label>
              <Input
                value={paymentData.lastName || ''}
                onChange={(e) => setPaymentData(prev => ({ ...prev, lastName: e.target.value }))}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>البريد الإلكتروني *</Label>
              <Input
                type="email"
                value={paymentData.email || ''}
                onChange={(e) => setPaymentData(prev => ({ ...prev, email: e.target.value }))}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label>رقم الهاتف *</Label>
              <Input
                type="tel"
                value={paymentData.phone || ''}
                onChange={(e) => setPaymentData(prev => ({ ...prev, phone: e.target.value }))}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            معلومات المنظمة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>اسم المنظمة *</Label>
            <Input
              value={paymentData.organizationName || ''}
              onChange={(e) => setPaymentData(prev => ({ ...prev, organizationName: e.target.value }))}
              className={errors.organizationName ? 'border-red-500' : ''}
            />
            {errors.organizationName && <p className="text-red-500 text-sm mt-1">{errors.organizationName}</p>}
          </div>
          
          <div>
            <Label>الرقم الضريبي (اختياري)</Label>
            <Input
              value={paymentData.vatNumber || ''}
              onChange={(e) => setPaymentData(prev => ({ ...prev, vatNumber: e.target.value }))}
              placeholder="مثل: 123456789012345"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            عنوان الفوترة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>البلد *</Label>
              <Select value={paymentData.country} onValueChange={(value) => setPaymentData(prev => ({ ...prev, country: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>المدينة *</Label>
              <Input
                value={paymentData.city || ''}
                onChange={(e) => setPaymentData(prev => ({ ...prev, city: e.target.value }))}
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
          </div>

          <div>
            <Label>العنوان التفصيلي *</Label>
            <Textarea
              value={paymentData.address || ''}
              onChange={(e) => setPaymentData(prev => ({ ...prev, address: e.target.value }))}
              className={errors.address ? 'border-red-500' : ''}
              rows={2}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div>
            <Label>الرمز البريدي</Label>
            <Input
              value={paymentData.postalCode || ''}
              onChange={(e) => setPaymentData(prev => ({ ...prev, postalCode: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPaymentForm = () => {
    if (paymentMethod === 'card') {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              بيانات البطاقة الائتمانية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>رقم البطاقة *</Label>
              <Input
                value={paymentData.cardNumber || ''}
                onChange={(e) => setPaymentData(prev => ({ 
                  ...prev, 
                  cardNumber: formatCardNumber(e.target.value) 
                }))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={errors.cardNumber ? 'border-red-500' : ''}
              />
              {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>الشهر *</Label>
                <Select 
                  value={paymentData.expiryMonth} 
                  onValueChange={(value) => setPaymentData(prev => ({ ...prev, expiryMonth: value }))}
                >
                  <SelectTrigger className={errors.expiryMonth ? 'border-red-500' : ''}>
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = (i + 1).toString().padStart(2, '0');
                      return (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.expiryMonth && <p className="text-red-500 text-sm mt-1">{errors.expiryMonth}</p>}
              </div>
              
              <div>
                <Label>السنة *</Label>
                <Select 
                  value={paymentData.expiryYear} 
                  onValueChange={(value) => setPaymentData(prev => ({ ...prev, expiryYear: value }))}
                >
                  <SelectTrigger className={errors.expiryYear ? 'border-red-500' : ''}>
                    <SelectValue placeholder="YY" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = (new Date().getFullYear() + i).toString().slice(-2);
                      return (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.expiryYear && <p className="text-red-500 text-sm mt-1">{errors.expiryYear}</p>}
              </div>
              
              <div>
                <Label>CVV *</Label>
                <Input
                  value={paymentData.cvv || ''}
                  onChange={(e) => setPaymentData(prev => ({ 
                    ...prev, 
                    cvv: e.target.value.replace(/[^0-9]/g, '').slice(0, 4) 
                  }))}
                  placeholder="123"
                  maxLength={4}
                  className={errors.cvv ? 'border-red-500' : ''}
                />
                {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
              </div>
            </div>

            <div>
              <Label>اسم حامل البطاقة *</Label>
              <Input
                value={paymentData.cardholderName || ''}
                onChange={(e) => setPaymentData(prev => ({ ...prev, cardholderName: e.target.value }))}
                placeholder="كما هو مكتوب على البطاقة"
                className={errors.cardholderName ? 'border-red-500' : ''}
              />
              {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
            </div>
          </CardContent>
        </Card>
      );
    } else if (paymentMethod === 'bank') {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              معلومات التحويل البنكي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                سيتم إرسال تعليمات التحويل البنكي إلى بريدك الإلكتروني بعد تأكيد الطلب
              </AlertDescription>
            </Alert>

            <div>
              <Label>اسم البنك المحول منه *</Label>
              <Input
                value={paymentData.bankName || ''}
                onChange={(e) => setPaymentData(prev => ({ ...prev, bankName: e.target.value }))}
                placeholder="مثل: البنك الأهلي السعودي"
                className={errors.bankName ? 'border-red-500' : ''}
              />
              {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
            </div>

            <div>
              <Label>رقم الآيبان (IBAN) *</Label>
              <Input
                value={paymentData.iban || ''}
                onChange={(e) => setPaymentData(prev => ({ 
                  ...prev, 
                  iban: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') 
                }))}
                placeholder="SA1234567890123456789012"
                maxLength={24}
                className={errors.iban ? 'border-red-500' : ''}
              />
              {errors.iban && <p className="text-red-500 text-sm mt-1">{errors.iban}</p>}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">تعليمات التحويل:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• سيتم تفعيل اشتراكك خلال 24 ساعة من استلام التحويل</li>
                <li>• يرجى الاحتفاظ بإيصال التحويل</li>
                <li>• في حالة عدم التفعيل، تواصل معنا عبر البريد الإلكتروني</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      );
    } else if (paymentMethod === 'stc_pay') {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              بيانات STC Pay
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                ستتم إعادة توجيهك إلى تطبيق STC Pay لإتمام عملية الدفع
              </AlertDescription>
            </Alert>

            <div>
              <Label>رقم هاتف STC Pay *</Label>
              <Input
                value={paymentData.stcPhoneNumber || ''}
                onChange={(e) => setPaymentData(prev => ({ 
                  ...prev, 
                  stcPhoneNumber: e.target.value.replace(/[^0-9+]/g, '') 
                }))}
                placeholder="+966501234567"
                className={errors.stcPhoneNumber ? 'border-red-500' : ''}
              />
              {errors.stcPhoneNumber && <p className="text-red-500 text-sm mt-1">{errors.stcPhoneNumber}</p>}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-800">خطوات الدفع:</h4>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>انقر على "إتمام الدفع" أدناه</li>
                <li>ستتم إعادة توجيهك إلى تطبيق STC Pay</li>
                <li>أدخل رمز PIN الخاص بك</li>
                <li>أكد عملية الدفع</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  const renderProcessing = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-[#183259]" />
      <h3 className="text-xl font-semibold">جاري معالجة الدفع...</h3>
      <p className="text-gray-600 text-center">
        {paymentMethod === 'card' && 'يتم الآن التحقق من بيانات البطاقة ومعالجة الدفع'}
        {paymentMethod === 'bank' && 'يتم الآن تجهيز تعليمات التحويل البنكي'}
        {paymentMethod === 'stc_pay' && 'يتم الآن التواصل مع STC Pay'}
      </p>
      <Alert className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          يرجى عدم إغلاق هذه النافذة أو الخروج من الصفحة
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <CheckCircle className="h-16 w-16 text-green-500" />
      <h3 className="text-2xl font-semibold text-green-700">تم الدفع بنجاح!</h3>
      
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>تفاصيل الاشتراك</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>رقم الاشتراك:</span>
            <span className="font-mono text-sm">{subscriptionId}</span>
          </div>
          <div className="flex justify-between">
            <span>الخطة:</span>
            <span>{planName}</span>
          </div>
          <div className="flex justify-between">
            <span>المبلغ المدفوع:</span>
            <span>{formatPrice(discountedPrice)} ريال</span>
          </div>
          <div className="flex justify-between">
            <span>فترة الاشتراك:</span>
            <span>{isYearly ? 'سنوي' : 'شهري'}</span>
          </div>
          {savings > 0 && (
            <div className="flex justify-between text-green-600">
              <span>المبلغ المُوفر:</span>
              <span>{savings} ريال</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center space-y-2">
        <p className="text-gray-600">
          تم إرسال تأكيد الاشتراك إلى بريدك الإلكتروني
        </p>
        <p className="text-sm text-gray-500">
          يمكنك الآن الاستفادة من جميع ميزات الخطة المختارة
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => onSuccess(subscriptionId)}
          className="bg-[#183259] hover:bg-[#2a4a7a]"
          size="lg"
        >
          الانتقال إلى لوحة التحكم
        </Button>
        
        <Button
          variant="outline"
          onClick={() => {
            // Generate a simple receipt
            const receiptData = {
              subscriptionId,
              planName,
              amount: formatPrice(discountedPrice),
              date: new Date().toLocaleDateString('ar-SA'),
              paymentMethod: paymentMethod === 'card' ? 'بطاقة ائتمانية' : paymentMethod === 'bank' ? 'تحويل بنكي' : 'STC Pay'
            };
            
            const element = document.createElement('a');
            element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(
              `إيصال الدفع\n` +
              `=================\n` +
              `رقم الاشتراك: ${receiptData.subscriptionId}\n` +
              `الخطة: ${receiptData.planName}\n` +
              `المبلغ المدفوع: ${receiptData.amount} ريال سعودي\n` +
              `طريقة الدفع: ${receiptData.paymentMethod}\n` +
              `تاريخ الدفع: ${receiptData.date}\n` +
              `نوع الاشتراك: ${isYearly ? 'سنوي' : 'شهري'}\n` +
              `${promoCode ? `الرمز الترويجي: ${promoCode}\n` : ''}` +
              `${savings > 0 ? `المبلغ الموفر: ${savings} ريال\n` : ''}` +
              `\nشكراً لاختيارك منصة قياس الأثر الاجتماعي`
            );
            element.download = `receipt-${subscriptionId}.txt`;
            element.click();
            
            toast.success('تم تحميل الإيصال بنجاح');
          }}
          size="lg"
        >
          <FileText className="h-4 w-4 ml-2" />
          تحميل الإيصال
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Plan Summary */}
      <Card className="border-[#183259] border-2">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-semibold">{planName}</h2>
              <p className="text-gray-600">
                {isYearly ? 'اشتراك سنوي' : 'اشتراك شهري'}
              </p>
            </div>
            
            <div className="text-left">
              {savings > 0 && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(originalPrice)} ريال
                  </span>
                  <Badge className="bg-green-100 text-green-700">
                    وفر {savings} ريال
                  </Badge>
                </div>
              )}
              <div className="text-2xl font-bold text-[#183259]">
                {formatPrice(discountedPrice)} ريال
              </div>
              <p className="text-sm text-gray-500">
                /{isYearly ? 'سنة' : 'شهر'}
              </p>
            </div>
          </div>

          {promoCode && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Badge variant="outline">كود الخصم: {promoCode}</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-reverse space-x-8 mb-8">
        {['details', 'payment', 'processing', 'success'].map((stepName, index) => {
          const stepTitles = {
            details: 'المعلومات الشخصية',
            payment: 'تفاصيل الدفع',
            processing: 'معالجة الدفع',
            success: 'تم بنجاح'
          };
          
          const currentStepIndex = ['details', 'payment', 'processing', 'success'].indexOf(step);
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          
          return (
            <div key={stepName} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                isCompleted ? 'bg-green-500 border-green-500 text-white' :
                isActive ? 'bg-[#183259] border-[#183259] text-white' :
                'bg-white border-gray-300 text-gray-400'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className={`mr-2 text-sm ${
                isActive ? 'text-[#183259] font-semibold' :
                isCompleted ? 'text-green-600' :
                'text-gray-400'
              }`}>
                {stepTitles[stepName as keyof typeof stepTitles]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form Content */}
      {step === 'details' && (
        <>
          {renderPersonalDetailsForm()}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 ml-2" />
              إلغاء
            </Button>
            <Button 
              onClick={handlePersonalDetailsSubmit}
              className="bg-[#183259] hover:bg-[#2a4a7a]"
            >
              المتابعة إلى الدفع
            </Button>
          </div>
        </>
      )}

      {step === 'payment' && (
        <>
          {renderPaymentForm()}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep('details')}>
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة
            </Button>
            <Button 
              onClick={processPayment}
              className="bg-[#183259] hover:bg-[#2a4a7a]"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 ml-2" />
                  إتمام الدفع ({formatPrice(discountedPrice)} ريال)
                </>
              )}
            </Button>
          </div>
        </>
      )}

      {step === 'processing' && renderProcessing()}
      {step === 'success' && renderSuccess()}
    </div>
  );
}