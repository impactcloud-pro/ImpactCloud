import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle,
  Clock,
  Shield
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'sent' | 'success'>('email');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('يرجى إدخال البريد الإلكتروني');
      return;
    }

    if (!email.includes('@')) {
      toast.error('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if email exists in demo accounts
      const demoEmails = [
        'superadmin@exology.com',
        'admin@atharonaa.com', 
        'manager@org.com',
        'beneficiary@example.com'
      ];

      if (demoEmails.includes(email)) {
        setStep('sent');
        toast.success('تم إرسال رابط إعادة تعيين كلمة المرور');
      } else {
        toast.error('البريد الإلكتروني غير مسجل في النظام');
      }
    } catch (error) {
      toast.error('حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setStep('email');
    onClose();
  };

  const renderEmailStep = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="mx-auto mb-4 p-3 rounded-full w-16 h-16 flex items-center justify-center bg-blue-50">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium mb-2">استعادة كلمة المرور</h3>
        <p className="text-gray-600 text-sm">
          أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="reset-email">البريد الإلكتروني</Label>
          <Input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="أدخل بريدك الإلكتروني"
            className="mt-1"
            required
          />
        </div>

        <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 mt-0.5 text-gray-500" />
            <div>
              <p className="font-medium mb-1">للحسابات التجريبية:</p>
              <ul className="text-xs space-y-1">
                <li>• superadmin@exology.com</li>
                <li>• admin@atharonaa.com</li>
                <li>• manager@org.com</li>
                <li>• beneficiary@example.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={handleClose}
          variant="outline"
          className="flex-1"
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-[#183259] hover:bg-[#2a4a7a] text-white"
        >
          {isLoading ? 'جاري الإرسال...' : 'إرسال الرابط'}
        </Button>
      </div>
    </form>
  );

  const renderSentStep = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto mb-4 p-3 rounded-full w-16 h-16 flex items-center justify-center bg-green-50">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">تم إرسال الرابط! ✉️</h3>
        <p className="text-gray-600 text-sm mb-4">
          تم إرسال رابط إعادة تعيين كلمة المرور إلى:
        </p>
        <div className="bg-gray-50 p-3 rounded-lg">
          <span className="font-medium">{email}</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">تعليمات مهمة:</p>
              <ul className="text-gray-600 space-y-1 text-right">
                <li>• تحقق من صندوق الوارد وملف الرسائل غير المرغوبة</li>
                <li>• الرابط صالح لمدة 15 دقيقة فقط</li>
                <li>• إذا لم تتلق الرسالة، يمكنك طلب رابط جديد</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={() => setStep('email')}
          variant="outline"
          className="flex-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          إرسال مرة أخرى
        </Button>
        <Button
          onClick={handleClose}
          className="flex-1 bg-[#183259] hover:bg-[#2a4a7a] text-white"
        >
          حسناً
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center">
            نسيت كلمة المرور؟
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            أدخل بريدك الإلكتروني لاستعادة كلمة المرور
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 'email' && renderEmailStep()}
          {step === 'sent' && renderSentStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}