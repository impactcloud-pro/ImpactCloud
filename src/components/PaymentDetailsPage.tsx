import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { EnhancedPageLayout } from './EnhancedPageLayout';
import type { PaymentMethod } from './PaymentMethodPage';
import { 
  CreditCard,
  Building2,
  Smartphone,
  Wallet,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Gift,
  Shield,
  Lock,
  Calendar,
  User,
  Crown,
  Package,
  Star,
  AlertTriangle,
  Info
} from 'lucide-react';

interface PaymentDetailsPageProps {
  userRole: 'org_manager';
  selectedPackage: {
    id: string;
    name: string;
    nameEn: string;
    price: number;
    currency: string;
    duration: string;
    isPremium?: boolean;
    isPopular?: boolean;
    color: string;
    features: string[];
  };
  selectedMethod: PaymentMethod;
  onBack: () => void;
  onPaymentSubmit: (paymentData: PaymentFormData) => void;
}

export interface PaymentFormData {
  // Credit Card Fields
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardHolderName?: string;
  
  // Bank Transfer Fields
  bankName?: string;
  accountNumber?: string;
  iban?: string;
  
  // STC Pay Fields
  stcPhoneNumber?: string;
  
  // Common Fields
  promoCode?: string;
  promoDiscount?: number;
  finalAmount: number;
  
  // Billing Info
  billingName: string;
  billingEmail: string;
  billingPhone: string;
  billingAddress: string;
  city: string;
  postalCode: string;
  
  // Agreement
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
}

const validPromoCodes = {
  'WELCOME20': { discount: 20, description: 'خصم ترحيبي 20%' },
  'SAVE30': { discount: 30, description: 'وفر 30% على اشتراكك' },
  'SPECIAL50': { discount: 50, description: 'عرض خاص 50% خصم' },
  'RAMADAN25': { discount: 25, description: 'عرض رمضان 25% خصم' },
  'STUDENT15': { discount: 15, description: 'خصم الطلاب 15%' }
};

export function PaymentDetailsPage({ 
  userRole, 
  selectedPackage, 
  selectedMethod,
  onBack, 
  onPaymentSubmit 
}: PaymentDetailsPageProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    finalAmount: selectedPackage.price,
    billingName: '',
    billingEmail: '',
    billingPhone: '',
    billingAddress: '',
    city: '',
    postalCode: '',
    agreeToTerms: false,
    subscribeNewsletter: true
  });

  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState<'valid' | 'invalid' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getPackageIcon = (packageId: string) => {
    switch (packageId) {
      case 'starter': return <Package className="h-5 w-5" />;
      case 'professional': return <Star className="h-5 w-5" />;
      case 'premium': return <Crown className="h-5 w-5" />;
      case 'enterprise': return <Shield className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const handlePromoCodeCheck = () => {
    const upperPromo = promoCode.toUpperCase();
    if (validPromoCodes[upperPromo as keyof typeof validPromoCodes]) {
      const promoInfo = validPromoCodes[upperPromo as keyof typeof validPromoCodes];
      const discount = (selectedPackage.price * promoInfo.discount) / 100;
      const finalAmount = selectedPackage.price - discount;
      
      setPromoStatus('valid');
      setFormData(prev => ({
        ...prev,
        promoCode: upperPromo,
        promoDiscount: promoInfo.discount,
        finalAmount: finalAmount
      }));
    } else {
      setPromoStatus('invalid');
      setFormData(prev => ({
        ...prev,
        promoCode: undefined,
        promoDiscount: undefined,
        finalAmount: selectedPackage.price
      }));
    }
  };

  const handleInputChange = (field: keyof PaymentFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate common fields
    if (!formData.billingName.trim()) newErrors.billingName = 'الاسم مطلوب';
    if (!formData.billingEmail.trim()) newErrors.billingEmail = 'البريد الإلكتروني مطلوب';
    if (!formData.billingPhone.trim()) newErrors.billingPhone = 'رقم الهاتف مطلوب';
    if (!formData.billingAddress.trim()) newErrors.billingAddress = 'العنوان مطلوب';
    if (!formData.city.trim()) newErrors.city = 'المدينة مطلوبة';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'يجب الموافقة على الشروط والأحكام';

    // Validate payment method specific fields
    if (selectedMethod.id === 'credit-card') {
      if (!formData.cardNumber?.trim()) newErrors.cardNumber = 'رقم البطاقة مطلوب';
      if (!formData.expiryDate?.trim()) newErrors.expiryDate = 'تاريخ الانتهاء مطلوب';
      if (!formData.cvv?.trim()) newErrors.cvv = 'رمز CVV مطلوب';
      if (!formData.cardHolderName?.trim()) newErrors.cardHolderName = 'اسم حامل البطاقة مطلوب';
    } else if (selectedMethod.id === 'bank-transfer') {
      if (!formData.bankName?.trim()) newErrors.bankName = 'اسم البنك مطلوب';
      if (!formData.accountNumber?.trim()) newErrors.accountNumber = 'رقم الحساب مطلوب';
      if (!formData.iban?.trim()) newErrors.iban = 'رقم IBAN مطلوب';
    } else if (selectedMethod.id === 'stc-pay') {
      if (!formData.stcPhoneNumber?.trim()) newErrors.stcPhoneNumber = 'رقم هاتف STC Pay مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onPaymentSubmit(formData);
  };

  const renderPaymentFields = () => {
    const IconComponent = selectedMethod.icon;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <IconComponent className="h-5 w-5" />
            تفاصيل الدفع - {selectedMethod.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedMethod.id === 'credit-card' && (
            <>
              <div>
                <Label>رقم البطاقة *</Label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber || ''}
                  onChange={(e) => {
                    // Format card number with spaces
                    const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                    handleInputChange('cardNumber', value);
                  }}
                  maxLength={19}
                />
                {errors.cardNumber && (
                  <p className="text-sm text-red-600 mt-1">{errors.cardNumber}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>تاريخ الانتهاء *</Label>
                  <Input
                    placeholder="MM/YY"
                    value={formData.expiryDate || ''}
                    onChange={(e) => {
                      // Format MM/YY
                      const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
                      handleInputChange('expiryDate', value);
                    }}
                    maxLength={5}
                  />
                  {errors.expiryDate && (
                    <p className="text-sm text-red-600 mt-1">{errors.expiryDate}</p>
                  )}
                </div>
                
                <div>
                  <Label>رمز CVV *</Label>
                  <Input
                    placeholder="123"
                    value={formData.cvv || ''}
                    onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                    type="password"
                  />
                  {errors.cvv && (
                    <p className="text-sm text-red-600 mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label>اسم حامل البطاقة *</Label>
                <Input
                  placeholder="الاسم كما هو مكتوب على البطاقة"
                  value={formData.cardHolderName || ''}
                  onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                />
                {errors.cardHolderName && (
                  <p className="text-sm text-red-600 mt-1">{errors.cardHolderName}</p>
                )}
              </div>
            </>
          )}
          
          {selectedMethod.id === 'bank-transfer' && (
            <>
              <div>
                <Label>اسم البنك *</Label>
                <Input
                  placeholder="مثال: البنك الأهلي السعودي"
                  value={formData.bankName || ''}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                />
                {errors.bankName && (
                  <p className="text-sm text-red-600 mt-1">{errors.bankName}</p>
                )}
              </div>
              
              <div>
                <Label>رقم الحساب *</Label>
                <Input
                  placeholder="1234567890"
                  value={formData.accountNumber || ''}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value.replace(/\D/g, ''))}
                />
                {errors.accountNumber && (
                  <p className="text-sm text-red-600 mt-1">{errors.accountNumber}</p>
                )}
              </div>
              
              <div>
                <Label>رقم IBAN *</Label>
                <Input
                  placeholder="SA1234567890123456789012"
                  value={formData.iban || ''}
                  onChange={(e) => handleInputChange('iban', e.target.value.toUpperCase())}
                />
                {errors.iban && (
                  <p className="text-sm text-red-600 mt-1">{errors.iban}</p>
                )}
              </div>
            </>
          )}
          
          {selectedMethod.id === 'stc-pay' && (
            <div>
              <Label>رقم هاتف STC Pay *</Label>
              <Input
                placeholder="05xxxxxxxx"
                value={formData.stcPhoneNumber || ''}
                onChange={(e) => handleInputChange('stcPhoneNumber', e.target.value.replace(/\D/g, ''))}
              />
              {errors.stcPhoneNumber && (
                <p className="text-sm text-red-600 mt-1">{errors.stcPhoneNumber}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const headerStats = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <selectedMethod.icon className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{selectedMethod.name}</div>
            <div className="text-blue-200">طريقة الدفع</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{formData.finalAmount.toFixed(2)} {selectedPackage.currency}</div>
            <div className="text-blue-200">المبلغ النهائي</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Gift className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">
              {formData.promoDiscount ? `${formData.promoDiscount}%` : 'لا يوجد'}
            </div>
            <div className="text-blue-200">خصم الكود الترويجي</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <EnhancedPageLayout
      pageId="payment-details"
      userRole={userRole}
      description="أدخل تفاصيل الدفع وأكمل عملية الاشتراك"
      icon={<CreditCard className="h-8 w-8" />}
      headerContent={headerStats}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 ml-2" />
          الرجوع لاختيار طريقة الدفع
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Promo Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  كود ترويجي (اختياري)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="أدخل الكود الترويجي"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      setPromoStatus(null);
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={handlePromoCodeCheck}
                    disabled={!promoCode.trim()}
                  >
                    تطبيق
                  </Button>
                </div>
                
                {promoStatus === 'valid' && (
                  <div className="text-green-600 text-sm flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    تم تطبيق خصم {formData.promoDiscount}% بنجاح!
                  </div>
                )}
                
                {promoStatus === 'invalid' && (
                  <div className="text-red-600 text-sm flex items-center gap-2">
                    <X className="h-4 w-4" />
                    الكود الترويجي غير صحيح
                  </div>
                )}

                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">أكواد ترويجية متاحة للتجربة:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(validPromoCodes).map(([code, info]) => (
                      <Badge 
                        key={code} 
                        variant="secondary" 
                        className="text-xs cursor-pointer"
                        onClick={() => setPromoCode(code)}
                      >
                        {code} ({info.discount}%)
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Fields */}
            {renderPaymentFields()}

            {/* Billing Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  معلومات الفوترة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>الاسم الكامل *</Label>
                    <Input
                      value={formData.billingName}
                      onChange={(e) => handleInputChange('billingName', e.target.value)}
                      placeholder="أدخل الاسم الكامل"
                    />
                    {errors.billingName && (
                      <p className="text-sm text-red-600 mt-1">{errors.billingName}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>البريد الإلكتروني *</Label>
                    <Input
                      type="email"
                      value={formData.billingEmail}
                      onChange={(e) => handleInputChange('billingEmail', e.target.value)}
                      placeholder="example@domain.com"
                    />
                    {errors.billingEmail && (
                      <p className="text-sm text-red-600 mt-1">{errors.billingEmail}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label>رقم الهاتف *</Label>
                  <Input
                    value={formData.billingPhone}
                    onChange={(e) => handleInputChange('billingPhone', e.target.value)}
                    placeholder="+966 5X XXX XXXX"
                  />
                  {errors.billingPhone && (
                    <p className="text-sm text-red-600 mt-1">{errors.billingPhone}</p>
                  )}
                </div>
                
                <div>
                  <Label>العنوان *</Label>
                  <Input
                    value={formData.billingAddress}
                    onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                    placeholder="أدخل العنوان بالتفصيل"
                  />
                  {errors.billingAddress && (
                    <p className="text-sm text-red-600 mt-1">{errors.billingAddress}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>المدينة *</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="الرياض"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600 mt-1">{errors.city}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>الرمز البريدي</Label>
                    <Input
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value.replace(/\D/g, ''))}
                      placeholder="12345"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                      className="mt-1"
                    />
                    <div className="text-sm">
                      <span>أوافق على </span>
                      <a href="#" className="text-[#183259] underline">الشروط والأحكام</a>
                      <span> و </span>
                      <a href="#" className="text-[#183259] underline">سياسة الخصوصية</a>
                      <span> *</span>
                      {errors.agreeToTerms && (
                        <p className="text-red-600 mt-1">{errors.agreeToTerms}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.subscribeNewsletter}
                      onChange={(e) => handleInputChange('subscribeNewsletter', e.target.checked)}
                      className="mt-1"
                    />
                    <span className="text-sm">
                      أريد الاشتراك في النشرة الإخبارية لتلقي آخر التحديثات والعروض
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Package Details */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {getPackageIcon(selectedPackage.id)}
                  <div>
                    <p className="font-medium">{selectedPackage.name}</p>
                    <p className="text-sm text-gray-600">{selectedPackage.duration}</p>
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>سعر الباقة</span>
                    <span>{selectedPackage.price} {selectedPackage.currency}</span>
                  </div>
                  
                  {formData.promoDiscount && (
                    <div className="flex justify-between text-green-600">
                      <span>خصم ({formData.promoCode})</span>
                      <span>-{((selectedPackage.price * formData.promoDiscount) / 100).toFixed(2)} {selectedPackage.currency}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>ضريبة القيمة المضافة</span>
                    <span>مشمولة</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>المجموع</span>
                    <span style={{ color: selectedPackage.color }}>
                      {formData.finalAmount.toFixed(2)} {selectedPackage.currency}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Payment Method */}
                <div className="flex items-center gap-2">
                  <selectedMethod.icon className="h-4 w-4" />
                  <span className="text-sm">{selectedMethod.name}</span>
                </div>

                {/* Submit Button */}
                <Button 
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="w-full bg-[#183259] hover:bg-[#2a4a7a]"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ml-2" />
                      جارٍ المعالجة...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 ml-2" />
                      تأكيد الدفع
                    </>
                  )}
                </Button>

                {/* Security Info */}
                <div className="text-xs text-gray-600 text-center space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span>محمي بتشفير SSL 256-bit</span>
                  </div>
                  <p>معلومات الدفع محمية بأعلى معايير الأمان</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </EnhancedPageLayout>
  );
}