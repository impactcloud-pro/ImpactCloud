import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Plus, Edit, Trash2, Save, RefreshCw, CreditCard, DollarSign, 
  Smartphone, Building, X
} from 'lucide-react';
import { toast } from 'sonner';
import { availablePaymentMethods, type PaymentMethod } from '../../constants/settingsConstants';

interface PaymentMethodFormData {
  name: string;
  type: 'bank_transfer' | 'credit_card' | 'mada' | 'stc_pay' | 'apple_pay';
  processingTime: string;
  fees: string;
  isAvailable: boolean;
}

interface PaymentMethodsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethods: PaymentMethod[];
  onPaymentMethodsUpdated: (methods: PaymentMethod[]) => void;
}

const paymentTypeOptions = [
  { value: 'bank_transfer', label: 'حساب بنكي', icon: DollarSign },
  { value: 'credit_card', label: 'PayTabs', icon: CreditCard }
];

export function PaymentMethodsDialog({ 
  isOpen, 
  onClose, 
  paymentMethods, 
  onPaymentMethodsUpdated 
}: PaymentMethodsDialogProps) {
  const [localMethods, setLocalMethods] = useState<PaymentMethod[]>(paymentMethods);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PaymentMethodFormData>({
    name: '',
    type: 'bank_transfer',
    processingTime: '',
    fees: '',
    isAvailable: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'bank_transfer',
      processingTime: '',
      fees: '',
      isAvailable: true
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
    resetForm();
  };

  const handleEdit = (method: PaymentMethod) => {
    setIsEditing(method.id);
    setFormData({
      name: method.name,
      type: method.type,
      processingTime: method.processingTime,
      fees: method.fees,
      isAvailable: method.isAvailable
    });
  };

  const handleDelete = async (methodId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updatedMethods = localMethods.filter(m => m.id !== methodId);
      setLocalMethods(updatedMethods);
      toast.success('تم حذف طريقة الدفع بنجاح');
    } catch (error) {
      toast.error('حدث خطأ في حذف طريقة الدفع');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.processingTime.trim() || !formData.fees.trim()) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (isAdding) {
        // إضافة طريقة دفع جديدة
        const newMethod: PaymentMethod = {
          id: Math.random().toString(36).substr(2, 9),
          name: formData.name,
          type: formData.type,
          processingTime: formData.processingTime,
          fees: formData.fees,
          isAvailable: formData.isAvailable
        };
        setLocalMethods(prev => [...prev, newMethod]);
        toast.success('تم إضافة طريقة الدفع بنجاح');
      } else if (isEditing) {
        // تحديث طريقة دفع موجودة
        setLocalMethods(prev => prev.map(method => 
          method.id === isEditing 
            ? { 
                ...method, 
                name: formData.name,
                type: formData.type,
                processingTime: formData.processingTime,
                fees: formData.fees,
                isAvailable: formData.isAvailable
              }
            : method
        ));
        toast.success('تم تحديث طريقة الدفع بنجاح');
      }

      setIsAdding(false);
      setIsEditing(null);
      resetForm();
    } catch (error) {
      toast.error('حدث خطأ في حفظ طريقة الدفع');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(null);
    resetForm();
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onPaymentMethodsUpdated(localMethods);
      onClose();
      toast.success('تم حفظ إعدادات طرق الدفع بنجاح');
    } catch (error) {
      toast.error('حدث خطأ في حفظ الإعدادات');
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentTypeIcon = (type: string) => {
    const option = paymentTypeOptions.find(opt => opt.value === type);
    return option ? option.icon : CreditCard;
  };

  const getPaymentTypeLabel = (type: string) => {
    const option = paymentTypeOptions.find(opt => opt.value === type);
    return option ? option.label : type;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            إدارة طرق الدفع
          </DialogTitle>
          <DialogDescription>
            إضافة وتعديل وحذف طرق الدفع المتاحة للعملاء
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add/Edit Form */}
          {(isAdding || isEditing) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {isAdding ? 'إضافة طريقة دفع جديدة' : 'تعديل طريقة الدفع'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="method-name">اسم طريقة الدفع *</Label>
                    <Input
                      id="method-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={isLoading}
                      placeholder="مثال: فيزا / ماستركارد"
                    />
                  </div>

                  <div>
                    <Label htmlFor="method-type">نوع طريقة الدفع *</Label>
                    <Select 
                      value={formData.type}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="processing-time">وقت المعالجة *</Label>
                    <Input
                      id="processing-time"
                      value={formData.processingTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, processingTime: e.target.value }))}
                      disabled={isLoading}
                      placeholder="مثال: فوري، 1-3 أيام عمل"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fees">الرسوم *</Label>
                    <Input
                      id="fees"
                      value={formData.fees}
                      onChange={(e) => setFormData(prev => ({ ...prev, fees: e.target.value }))}
                      disabled={isLoading}
                      placeholder="مثال: مجاني، 2.5% + 1 ريال"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>حالة التفعيل</Label>
                        <p className="text-sm text-gray-600">
                          هل طريقة الدفع متاحة حالياً؟
                        </p>
                      </div>
                      <Switch
                        checked={formData.isAvailable}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAvailable: checked }))}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <Button 
                    onClick={handleSubmit}
                    className="bg-[#183259] hover:bg-[#2a4a7a]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isAdding ? 'إضافة' : 'تحديث'}
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add Button */}
          {!isAdding && !isEditing && (
            <Button 
              onClick={handleAdd}
              className="bg-[#183259] hover:bg-[#2a4a7a]"
            >
              <Plus className="h-4 w-4 mr-2" />
              إضافة طريقة دفع جديدة
            </Button>
          )}

          {/* Payment Methods Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">طرق الدفع الحالية</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">طريقة الدفع</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">وقت المعالجة</TableHead>
                    <TableHead className="text-right">الرسوم</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localMethods.map((method) => {
                    const Icon = getPaymentTypeIcon(method.type);
                    return (
                      <TableRow key={method.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Icon className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium">{method.name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getPaymentTypeLabel(method.type)}</TableCell>
                        <TableCell>{method.processingTime}</TableCell>
                        <TableCell>{method.fees}</TableCell>
                        <TableCell>
                          <Badge className={method.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {method.isAvailable ? 'متاح' : 'غير متاح'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(method)}
                              disabled={isLoading || isAdding || isEditing}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(method.id)}
                              disabled={isLoading || isAdding || isEditing}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {localMethods.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        لا توجد طرق دفع مضافة بعد
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            إلغاء
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-[#183259] hover:bg-[#2a4a7a]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                جاري الحفظ...
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