import React from 'react';
import { Dialog, DialogContent, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, Download, Mail, Calendar, CreditCard } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionDetails: {
    subscriptionId: string;
    planName: string;
    amount: number;
    isYearly: boolean;
    savings?: number;
    promoCode?: string;
    startDate: string;
    nextBillingDate: string;
  };
  onGoToDashboard: () => void;
}

export function SuccessModal({
  isOpen,
  onClose,
  subscriptionDetails,
  onGoToDashboard
}: SuccessModalProps) {
  const formatPrice = (price: number) => Math.round(price);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogDescription className="sr-only">
          تأكيد نجح تفعيل الاشتراك في منصة قياس الأثر الاجتماعي مع تفاصيل الخطة والدفع
        </DialogDescription>
        <div className="text-center py-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          
          <h2 className="text-3xl font-bold text-green-700 mb-2">
            🎉 تهانينا! تم تفعيل اشتراكك بنجاح
          </h2>
          
          <p className="text-gray-600 mb-8">
            مرحباً بك في منصة قياس الأثر الاجتماعي. يمكنك الآن الاستفادة من جميع ميزات خطتك المختارة
          </p>

          {/* Subscription Details Card */}
          <Card className="text-right mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <CreditCard className="h-5 w-5" />
                تفاصيل الاشتراك
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">رقم الاشتراك:</span>
                    <span className="font-mono text-blue-600">{subscriptionDetails.subscriptionId}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">الخطة:</span>
                    <span>{subscriptionDetails.planName}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">المبلغ المدفوع:</span>
                    <span className="text-green-600 font-semibold">
                      {formatPrice(subscriptionDetails.amount)} ريال
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">نوع الاشتراك:</span>
                    <span>{subscriptionDetails.isYearly ? 'سنوي' : 'شهري'}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">تاريخ البداية:</span>
                    <span>{formatDate(subscriptionDetails.startDate)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">الفاتورة القادمة:</span>
                    <span>{formatDate(subscriptionDetails.nextBillingDate)}</span>
                  </div>
                  
                  {subscriptionDetails.savings && subscriptionDetails.savings > 0 && (
                    <div className="flex justify-between">
                      <span className="font-medium">المبلغ المُوفر:</span>
                      <span className="text-green-600 font-semibold">
                        {formatPrice(subscriptionDetails.savings)} ريال
                      </span>
                    </div>
                  )}
                  
                  {subscriptionDetails.promoCode && (
                    <div className="flex justify-between">
                      <span className="font-medium">الرمز الترويجي:</span>
                      <Badge variant="outline">{subscriptionDetails.promoCode}</Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="text-right mb-6">
            <CardHeader>
              <CardTitle>الخطوات التالية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span>تم إرسال تأكيد الاشتراك وتفاصيل الفاتورة إلى بريدك الإلكتروني</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>يمكنك بدء استخدام جميع ميزات خطتك فوراً</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Download className="h-4 w-4 text-purple-500 flex-shrink-0" />
                  <span>ستصلك الفواتير شهرياً/سنوياً حسب خطتك</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onGoToDashboard}
              className="bg-[#183259] hover:bg-[#2a4a7a] text-white"
              size="lg"
            >
              الانتقال إلى لوحة التحكم
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                // Simulate downloading invoice
                const element = document.createElement('a');
                element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(
                  `فاتورة الاشتراك\nرقم الاشتراك: ${subscriptionDetails.subscriptionId}\nالخطة: ${subscriptionDetails.planName}\nالمبلغ: ${formatPrice(subscriptionDetails.amount)} ريال`
                );
                element.download = `invoice-${subscriptionDetails.subscriptionId}.txt`;
                element.click();
              }}
              size="lg"
            >
              <Download className="h-4 w-4 ml-2" />
              تحميل الفاتورة
            </Button>
          </div>

          {/* Support Note */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">
              هل تحتاج مساعدة؟ فريق الدعم الفني جاهز لمساعدتك 24/7
              <br />
              البريد الإلكتروني: support@socialimpact.sa | الهاتف: 920000000
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}