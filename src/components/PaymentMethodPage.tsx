import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { EnhancedPageLayout } from './EnhancedPageLayout';
import { 
  CreditCard,
  Building2,
  Smartphone,
  Wallet,
  ArrowLeft,
  ArrowRight,
  Check,
  Crown,
  Package,
  Star,
  Shield
} from 'lucide-react';

interface PaymentMethodPageProps {
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
  onBack: () => void;
  onMethodSelected: (method: PaymentMethod) => void;
}

export interface PaymentMethod {
  id: string;
  name: string;
  nameEn: string;
  icon: React.ElementType;
  description: string;
  processingTime: string;
  fees: string;
  isRecommended?: boolean;
  isAvailable: boolean;
  supportedCards?: string[];
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'credit-card',
    name: 'بطاقة ائتمانية',
    nameEn: 'Credit Card',
    icon: CreditCard,
    description: 'ادفع باستخدام بطاقة ائتمانية أو خصم',
    processingTime: 'فوري',
    fees: 'بدون رسوم إضافية',
    isRecommended: true,
    isAvailable: true,
    supportedCards: ['Visa', 'Mastercard', 'American Express', 'مدى']
  },
  {
    id: 'bank-transfer',
    name: 'تحويل بنكي',
    nameEn: 'Bank Transfer',
    icon: Building2,
    description: 'تحويل مباشر من حسابك البنكي',
    processingTime: '1-3 أيام عمل',
    fees: 'قد تطبق رسوم بنكية',
    isAvailable: true
  },
  {
    id: 'paytabs',
    name: 'PayTabs',
    nameEn: 'PayTabs',
    icon: Wallet,
    description: 'بوابة دفع محلية آمنة ومتقدمة',
    processingTime: 'فوري',
    fees: 'بدون رسوم إضافية',
    isAvailable: true,
    supportedCards: ['Visa', 'Mastercard', 'مدى', 'STCPay']
  },
  {
    id: 'stc-pay',
    name: 'STC Pay',
    nameEn: 'STC Pay',
    icon: Smartphone,
    description: 'محفظة رقمية سريعة وآمنة',
    processingTime: 'فوري',
    fees: 'بدون رسوم إضافية',
    isAvailable: true
  }
];

export function PaymentMethodPage({ 
  userRole, 
  selectedPackage, 
  onBack, 
  onMethodSelected 
}: PaymentMethodPageProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const getPackageIcon = (packageId: string) => {
    switch (packageId) {
      case 'starter': return <Package className="h-5 w-5" />;
      case 'professional': return <Star className="h-5 w-5" />;
      case 'premium': return <Crown className="h-5 w-5" />;
      case 'enterprise': return <Shield className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const handleContinue = () => {
    const method = paymentMethods.find(m => m.id === selectedMethod);
    if (method) {
      onMethodSelected(method);
    }
  };

  const headerStats = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          {getPackageIcon(selectedPackage.id)}
          <div>
            <div className="text-2xl font-bold text-white">{selectedPackage.name}</div>
            <div className="text-blue-200">الباقة المختارة</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{selectedPackage.price} {selectedPackage.currency}</div>
            <div className="text-blue-200">السعر الشهري</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Wallet className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{paymentMethods.filter(m => m.isAvailable).length}</div>
            <div className="text-blue-200">طرق الدفع المتاحة</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <EnhancedPageLayout
      pageId="payment-method"
      userRole={userRole}
      description="اختر طريقة الدفع المناسبة لك لإتمام عملية الاشتراك"
      icon={<CreditCard className="h-8 w-8" />}
      headerContent={headerStats}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 ml-2" />
          الرجوع للملف الشخصي
        </Button>

        {/* Selected Package Summary */}
        <Card className="border-2" style={{ borderColor: selectedPackage.color }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {getPackageIcon(selectedPackage.id)}
              <span>ملخص الباقة المختارة</span>
              {selectedPackage.isPopular && (
                <Badge className="bg-green-500 text-white">الأكثر شعبية</Badge>
              )}
              {selectedPackage.isPremium && (
                <Badge className="bg-purple-500 text-white">متميز</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">{selectedPackage.name}</h3>
                <div className="text-3xl font-bold mb-4" style={{ color: selectedPackage.color }}>
                  {selectedPackage.price} {selectedPackage.currency}
                  <span className="text-sm font-normal text-gray-600 mr-2">/ {selectedPackage.duration}</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">المميزات الرئيسية:</h4>
                <ul className="space-y-2">
                  {selectedPackage.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {selectedPackage.features.length > 4 && (
                    <li className="text-sm text-gray-500">
                      و {selectedPackage.features.length - 4} مميزات أخرى...
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>اختر طريقة الدفع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <div
                    key={method.id}
                    className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? 'border-[#183259] bg-blue-50'
                        : method.isAvailable
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                    }`}
                    onClick={() => method.isAvailable && setSelectedMethod(method.id)}
                  >
                    {method.isRecommended && (
                      <div className="absolute -top-2 left-4">
                        <Badge className="bg-green-500 text-white">موصى به</Badge>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        selectedMethod === method.id ? 'bg-[#183259] text-white' : 'bg-gray-100'
                      }`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{method.name}</h3>
                          {selectedMethod === method.id && (
                            <Check className="h-5 w-5 text-[#183259]" />
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">وقت المعالجة:</span>
                            <span className="font-medium">{method.processingTime}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">الرسوم:</span>
                            <span className="font-medium">{method.fees}</span>
                          </div>
                        </div>
                        
                        {method.supportedCards && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-2">البطاقات المدعومة:</p>
                            <div className="flex flex-wrap gap-1">
                              {method.supportedCards.map((card) => (
                                <Badge key={card} variant="secondary" className="text-xs">
                                  {card}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {!method.isAvailable && (
                          <div className="mt-3">
                            <Badge variant="secondary" className="text-xs">
                              غير متاح حالياً
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleContinue}
            disabled={!selectedMethod}
            className="bg-[#183259] hover:bg-[#2a4a7a]"
            size="lg"
          >
            متابعة إلى تفاصيل الدفع
            <ArrowRight className="h-4 w-4 mr-2" />
          </Button>
        </div>

        {/* Security Notice */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-green-600" />
              <div className="text-sm">
                <p className="font-medium text-green-800">أمان مضمون</p>
                <p className="text-green-700">
                  جميع المعاملات محمية بتشفير SSL وتلتزم بأعلى معايير الأمان المصرفي
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </EnhancedPageLayout>
  );
}