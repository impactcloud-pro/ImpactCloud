import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { 
  CreditCard, 
  Shield, 
  Zap, 
  Check,
  ArrowRight,
  Banknote,
  Smartphone,
  Globe
} from 'lucide-react';

interface PaymentMethod {
  id: 'card' | 'bank' | 'stc_pay';
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
  processingTime: string;
  badge?: string;
}

interface PaymentMethodSelectorProps {
  onMethodSelected: (method: 'card' | 'bank' | 'stc_pay') => void;
  onBack: () => void;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'بطاقة ائتمان',
    description: 'فيزا، ماستركارد، أمريكان إكسبريس',
    icon: CreditCard,
    features: [
      'تفعيل فوري للاشتراك',
      'دفع آمن ومشفر',
      'إمكانية الدفع الدولي',
      'حفظ البطاقة للمدفوعات المستقبلية'
    ],
    processingTime: 'فوري',
    badge: 'الأسرع'
  },
  {
    id: 'stc_pay',
    name: 'STC Pay',
    description: 'محفظة رقمية سعودية',
    icon: Zap,
    features: [
      'دفع سريع وآمن',
      'بدون رسوم إضافية',
      'مخصص للسوق السعودي',
      'تأكيد فوري للدفعة'
    ],
    processingTime: 'فوري',
    badge: 'موصى به'
  },
  {
    id: 'bank',
    name: 'تحويل بنكي',
    description: 'تحويل مباشر من البنك',
    icon: Shield,
    features: [
      'أقصى درجات الأمان',
      'مناسب للمبالغ الكبيرة',
      'بدون رسوم معالجة',
      'تعليمات واضحة للتحويل'
    ],
    processingTime: '1-2 يوم عمل'
  }
];

export function PaymentMethodSelector({ onMethodSelected, onBack }: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'bank' | 'stc_pay'>('card');

  const handleContinue = () => {
    onMethodSelected(selectedMethod);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-[#183259]">اختر طريقة الدفع</h2>
        <p className="text-gray-600">
          اختر الطريقة الأنسب لك لإتمام عملية الاشتراك
        </p>
      </div>

      <RadioGroup value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as any)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {paymentMethods.map((method) => (
            <div key={method.id} className="relative">
              <Label htmlFor={method.id} className="cursor-pointer">
                <Card className={`transition-all duration-200 hover:shadow-lg ${
                  selectedMethod === method.id 
                    ? 'border-[#183259] border-2 shadow-md bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  {method.badge && (
                    <div className="absolute -top-3 right-4">
                      <Badge className={`${
                        method.badge === 'الأسرع' ? 'bg-green-500' : 'bg-[#183259]'
                      } text-white px-3 py-1`}>
                        {method.badge}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center mb-4">
                      <div className={`p-4 rounded-full ${
                        selectedMethod === method.id ? 'bg-[#183259]' : 'bg-gray-100'
                      }`}>
                        <method.icon className={`h-8 w-8 ${
                          selectedMethod === method.id ? 'text-white' : 'text-[#183259]'
                        }`} />
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl mb-2">{method.name}</CardTitle>
                    <p className="text-sm text-gray-600">{method.description}</p>
                    
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <span className="text-sm font-medium text-[#183259]">
                        وقت المعالجة: {method.processingTime}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <ul className="space-y-2 mb-4">
                      {method.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-center">
                      <RadioGroupItem
                        value={method.id}
                        id={method.id}
                        className="data-[state=checked]:bg-[#183259] data-[state=checked]:border-[#183259]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>

      {/* Payment Method Details */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-6 w-6 text-[#183259]" />
              <div>
                <div className="font-semibold text-sm">دفع آمن 100%</div>
                <div className="text-xs text-gray-600">تشفير SSL 256-bit</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <Globe className="h-6 w-6 text-[#183259]" />
              <div>
                <div className="font-semibold text-sm">دعم 24/7</div>
                <div className="text-xs text-gray-600">مساعدة فورية</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <Check className="h-6 w-6 text-[#183259]" />
              <div>
                <div className="font-semibold text-sm">ضمان الاسترداد</div>
                <div className="text-xs text-gray-600">خلال 30 يوم</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          العودة
        </Button>

        <Button
          onClick={handleContinue}
          className="bg-[#183259] hover:bg-[#2a4a7a] flex items-center gap-2 px-8"
          size="lg"
        >
          متابعة
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Security Notice */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          جميع المدفوعات محمية بأحدث تقنيات الأمان والتشفير. 
          لن يتم حفظ معلوماتك المالية على خوادمنا
        </p>
      </div>
    </div>
  );
}