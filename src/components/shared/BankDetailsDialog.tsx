import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Building, Save, RefreshCw, Copy, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from '../ui/alert';
import { bankDetails, type BankDetails } from '../../constants/settingsConstants';

interface BankDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bankDetails: BankDetails;
  onBankDetailsUpdated: (details: BankDetails) => void;
}

export function BankDetailsDialog({ 
  isOpen, 
  onClose, 
  bankDetails: initialBankDetails, 
  onBankDetailsUpdated 
}: BankDetailsDialogProps) {
  const [formData, setFormData] = useState<BankDetails>(initialBankDetails);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<BankDetails>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<BankDetails> = {};

    // التحقق من اسم البنك
    if (!formData.bankName.trim()) {
      newErrors.bankName = 'اسم البنك مطلوب';
    }

    // التحقق من اسم الحساب
    if (!formData.accountName.trim()) {
      newErrors.accountName = 'اسم الحساب مطلوب';
    }

    // التحقق من رقم الحساب
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'رقم الحساب مطلوب';
    } else if (!/^\d{10,20}$/.test(formData.accountNumber.replace(/\s/g, ''))) {
      newErrors.accountNumber = 'رقم الحساب يجب أن يكون من 10 إلى 20 رقماً';
    }

    // التحقق من رقم الآيبان
    if (!formData.iban.trim()) {
      newErrors.iban = 'رقم الآيبان مطلوب';
    } else if (!/^SA\d{22}$/.test(formData.iban.replace(/\s/g, ''))) {
      newErrors.iban = 'رقم الآيبان يجب أن يبدأ بـ SA ويتكون من 24 رقماً (SA + 22 رقماً)';
    }

    // التحقق من رمز SWIFT
    if (!formData.swiftCode.trim()) {
      newErrors.swiftCode = 'رمز SWIFT مطلوب';
    } else if (!/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(formData.swiftCode.toUpperCase())) {
      newErrors.swiftCode = 'رمز SWIFT غير صالح (مثال: RIBLSARI)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('يرجى تصحيح الأخطاء في النموذج');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // تحديث البيانات
      const updatedBankDetails: BankDetails = {
        bankName: formData.bankName.trim(),
        accountName: formData.accountName.trim(),
        accountNumber: formData.accountNumber.replace(/\s/g, ''),
        iban: formData.iban.replace(/\s/g, '').toUpperCase(),
        swiftCode: formData.swiftCode.trim().toUpperCase()
      };

      onBankDetailsUpdated(updatedBankDetails);
      onClose();
      toast.success('تم تحديث تفاصيل البنك بنجاح');
    } catch (error) {
      toast.error('حدث خطأ في تحديث تفاصيل البنك');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      setFormData(initialBankDetails);
      setErrors({});
      onClose();
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`تم نسخ ${label}`);
  };

  const formatIban = (iban: string) => {
    // إضافة مسافات كل 4 أرقام لسهولة القراءة
    return iban.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatAccountNumber = (accountNumber: string) => {
    // إضافة مسافات كل 3 أرقام لسهولة القراءة
    return accountNumber.replace(/(\d{3})/g, '$1 ').trim();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            تعديل تفاصيل البنك
          </DialogTitle>
          <DialogDescription>
            تحديث تفاصيل الحساب البنكي المستخدم لاستقبال التحويلات
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>تنبيه مهم:</strong> تأكد من صحة جميع البيانات البنكية قبل الحفظ. 
              البيانات الخاطئة قد تؤدي إلى فشل في التحويلات البنكية.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="bank-name">اسم البنك *</Label>
              <Input
                id="bank-name"
                value={formData.bankName}
                onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                disabled={isLoading}
                placeholder="البنك الأهلي السعودي"
                className={errors.bankName ? 'border-red-500' : ''}
              />
              {errors.bankName && <p className="text-xs text-red-500 mt-1">{errors.bankName}</p>}
            </div>

            <div>
              <Label htmlFor="account-name">اسم الحساب *</Label>
              <Input
                id="account-name"
                value={formData.accountName}
                onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                disabled={isLoading}
                placeholder="شركة أثرنا للتقنية"
                className={errors.accountName ? 'border-red-500' : ''}
              />
              {errors.accountName && <p className="text-xs text-red-500 mt-1">{errors.accountName}</p>}
            </div>

            <div>
              <Label htmlFor="account-number">رقم الحساب *</Label>
              <Input
                id="account-number"
                value={formData.accountNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                disabled={isLoading}
                placeholder="12345678901"
                className={`font-mono ${errors.accountNumber ? 'border-red-500' : ''}`}
              />
              {errors.accountNumber && <p className="text-xs text-red-500 mt-1">{errors.accountNumber}</p>}
              <p className="text-xs text-gray-600 mt-1">
                المعاينة: {formatAccountNumber(formData.accountNumber)}
              </p>
            </div>

            <div>
              <Label htmlFor="swift-code">رمز SWIFT *</Label>
              <Input
                id="swift-code"
                value={formData.swiftCode}
                onChange={(e) => setFormData(prev => ({ ...prev, swiftCode: e.target.value.toUpperCase() }))}
                disabled={isLoading}
                placeholder="RIBLSARI"
                className={`font-mono ${errors.swiftCode ? 'border-red-500' : ''}`}
                maxLength={11}
              />
              {errors.swiftCode && <p className="text-xs text-red-500 mt-1">{errors.swiftCode}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="iban">رقم الآيبان (IBAN) *</Label>
              <Input
                id="iban"
                value={formData.iban}
                onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value.replace(/\s/g, '').toUpperCase() }))}
                disabled={isLoading}
                placeholder="SA1234567890123456789012"
                className={`font-mono ${errors.iban ? 'border-red-500' : ''}`}
                maxLength={26}
              />
              {errors.iban && <p className="text-xs text-red-500 mt-1">{errors.iban}</p>}
              <p className="text-xs text-gray-600 mt-1">
                المعاينة: {formatIban(formData.iban)}
              </p>
            </div>
          </div>

          {/* Preview Card */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-base">معاينة تفاصيل البنك</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">اسم البنك:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formData.bankName || '-'}</span>
                      {formData.bankName && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(formData.bankName, 'اسم البنك')}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">اسم الحساب:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formData.accountName || '-'}</span>
                      {formData.accountName && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(formData.accountName, 'اسم الحساب')}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">رقم الحساب:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{formatAccountNumber(formData.accountNumber) || '-'}</span>
                      {formData.accountNumber && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(formData.accountNumber, 'رقم الحساب')}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">رمز SWIFT:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{formData.swiftCode || '-'}</span>
                      {formData.swiftCode && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(formData.swiftCode, 'رمز SWIFT')}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">رقم الآيبان:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{formatIban(formData.iban) || '-'}</span>
                      {formData.iban && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(formData.iban, 'رقم الآيبان')}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            إلغاء
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-[#183259] hover:bg-[#2a4a7a]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                جاري التحديث...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                حفظ التغييرات
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}