import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  CreditCard, Building, Settings as SettingsIcon, Edit, Copy, AlertCircle, DollarSign 
} from 'lucide-react';
import { copyBankDetails } from '../../utils/settingsUtils';
import type { PaymentMethod, BankDetails } from '../../constants/settingsConstants';

interface BillingSettingsTabProps {
  paymentMethods: PaymentMethod[];
  bankDetailsState: BankDetails;
  billingSettings: {
    billingEmail: string;
    currency: string;
    taxRate: number;
    invoicePrefix: string;
  };
  setBillingSettings: (updater: (prev: any) => any) => void;
  onManagePaymentMethods: () => void;
  onManageBankDetails: () => void;
}

export function BillingSettingsTab({
  paymentMethods,
  bankDetailsState,
  billingSettings,
  setBillingSettings,
  onManagePaymentMethods,
  onManageBankDetails
}: BillingSettingsTabProps) {
  return (
    <div className="space-y-6">
      {/* Payment Methods Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            طرق الدفع المتاحة
          </CardTitle>
          <Button onClick={onManagePaymentMethods} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            إدارة طرق الدفع
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Show only Bank Transfer and PayTabs */}
            {paymentMethods.filter(method => 
              method.name === 'حساب بنكي' || method.name === 'PayTabs'
            ).slice(0, 2).map((method) => (
              <div key={method.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {method.type === 'bank_transfer' && <DollarSign className="h-5 w-5 text-gray-600" />}
                      {method.type !== 'bank_transfer' && <CreditCard className="h-5 w-5 text-gray-600" />}
                    </div>
                    <div>
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-gray-600">معالجة: {method.processingTime}</div>
                    </div>
                  </div>
                  <Badge className={method.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {method.isAvailable ? 'متاح' : 'غير متاح'}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">الرسوم: {method.fees}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Bank Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            تفاصيل البنك لاستقبال التحويلات
          </CardTitle>
          <Button onClick={onManageBankDetails} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            تعديل تفاصيل البنك
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>اسم البنك</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={bankDetailsState.bankName} readOnly />
                <Button variant="outline" size="sm" onClick={() => copyBankDetails(bankDetailsState.bankName)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label>اسم الحساب</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={bankDetailsState.accountName} readOnly />
                <Button variant="outline" size="sm" onClick={() => copyBankDetails(bankDetailsState.accountName)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label>رقم الحساب</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={bankDetailsState.accountNumber} readOnly className="font-mono" />
                <Button variant="outline" size="sm" onClick={() => copyBankDetails(bankDetailsState.accountNumber)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label>رقم الآيبان (IBAN)</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={bankDetailsState.iban} readOnly className="font-mono" />
                <Button variant="outline" size="sm" onClick={() => copyBankDetails(bankDetailsState.iban)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label>رمز SWIFT</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={bankDetailsState.swiftCode} readOnly className="font-mono" />
                <Button variant="outline" size="sm" onClick={() => copyBankDetails(bankDetailsState.swiftCode)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              يرجى إرسال إيصال التحويل البنكي على البريد الإلكتروني: billing@sahabatalather.com لتفعيل الاشتراك
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}