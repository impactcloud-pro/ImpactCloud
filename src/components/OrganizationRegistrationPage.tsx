import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Logo } from './Logo';
import { toast } from 'sonner';
import {
  Building,
  User,
  Mail,
  Phone,
  Globe,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText
} from 'lucide-react';

interface OrganizationRegistrationData {
  organizationName: string;
  managerName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  expectedBeneficiaries: string;
  workFields: string[];
  description: string;
  website: string;
}

interface OrganizationRegistrationPageProps {
  onBackToLanding: () => void;
  onLoginClick: () => void;
}

const workFieldOptions = [
  { id: 'health', label: 'صحي', icon: '🏥' },
  { id: 'education', label: 'تعليمي', icon: '📚' },
  { id: 'social', label: 'اجتماعي', icon: '👥' },
  { id: 'environmental', label: 'بيئي', icon: '🌱' },
  { id: 'economic', label: 'اقتصادي', icon: '💼' },
  { id: 'cultural', label: 'ثقافي', icon: '🎭' },
  { id: 'sports', label: 'رياضي', icon: '⚽' },
  { id: 'technology', label: 'تقني', icon: '💻' }
];

const countries = [
  'المملكة العربية السعودية',
  'الإمارات العربية المتحدة',
  'قطر',
  'الكويت',
  'البحرين',
  'عمان',
  'مصر',
  'الأردن',
  'لبنان',
  'المغرب',
  'تونس',
  'الجزائر',
  'العراق',
  'سوريا',
  'فلسطين',
  'اليمن',
  'السودان',
  'ليبيا',
  'أخرى'
];

export function OrganizationRegistrationPage({ 
  onBackToLanding, 
  onLoginClick 
}: OrganizationRegistrationPageProps) {
  const [formData, setFormData] = useState<OrganizationRegistrationData>({
    organizationName: '',
    managerName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    expectedBeneficiaries: '',
    workFields: [],
    description: '',
    website: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof OrganizationRegistrationData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkFieldChange = (fieldId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      workFields: checked 
        ? [...prev.workFields, fieldId]
        : prev.workFields.filter(f => f !== fieldId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.organizationName.trim()) {
      toast.error('يرجى إدخال اسم المنظمة');
      return;
    }
    
    if (!formData.managerName.trim()) {
      toast.error('يرجى إدخال اسم مدير المنظمة');
      return;
    }
    
    if (!formData.email.trim()) {
      toast.error('يرجى إدخال البريد الإلكتروني');
      return;
    }
    
    if (!formData.phone.trim()) {
      toast.error('يرجى إدخال رقم الهاتف');
      return;
    }
    
    if (!formData.country) {
      toast.error('يرجى اختيار الدولة');
      return;
    }
    
    if (!formData.city.trim()) {
      toast.error('يرجى إدخال المدينة');
      return;
    }
    
    if (!formData.expectedBeneficiaries.trim()) {
      toast.error('يرجى إدخال عدد المستفيدين المتوقع');
      return;
    }
    
    if (formData.workFields.length === 0) {
      toast.error('يرجى اختيار مجال عمل واحد على الأقل');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('يرجى إدخال وصف المنظمة');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the data to your backend
      console.log('Organization registration data:', formData);
      
      setIsSubmitted(true);
      toast.success('تم إرسال طلبك بنجاح! سيقوم فريقنا بمراجعته والتواصل معكم قريباً');
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#18325A]" dir="rtl">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-300/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <header className="border-b border-white/20 bg-white/10 backdrop-blur-sm relative z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Logo 
                onClick={onBackToLanding}
                size="lg"
                showText={true}
                variant="light"
                className="cursor-pointer"
              />
              <Button 
                variant="ghost" 
                onClick={onLoginClick}
                className="text-white hover:bg-white/10"
              >
                تسجيل الدخول
              </Button>
            </div>
          </div>
        </header>

        {/* Success Content */}
        <div className="container mx-auto px-6 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="w-24 h-24 mx-auto mb-8 bg-green-500 rounded-full flex items-center justify-center"
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl font-bold mb-6 text-white"
            >
              تم إرسال طلبك بنجاح!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-blue-100 mb-8 leading-relaxed"
            >
              شكراً لكم على تقديم طلب التسجيل في منصة سحابة الأثر. سيقوم فريقنا بمراجعة طلبكم والتواصل معكم عبر البريد الإلكتروني خلال 3-5 أيام عمل.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8"
            >
              <h3 className="text-lg font-semibold mb-4 text-white">الخطوات التالية:</h3>
              <div className="space-y-3 text-right">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">1</span>
                  <span className="text-blue-100">مراجعة البيانات المقدمة من قبل فريقنا</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">2</span>
                  <span className="text-blue-100">التواصل معكم لتأكيد التفاصيل إذا لزم الأمر</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">3</span>
                  <span className="text-blue-100">إرسال بيانات الدخول عند الموافقة على الطلب</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex gap-4 justify-center"
            >
              <Button
                onClick={onBackToLanding}
                className="bg-white text-[#18325A] hover:bg-gray-100"
              >
                <ArrowRight className="w-5 h-5 ml-2" />
                العودة للصفحة الرئيسية
              </Button>
              <Button
                variant="outline"
                onClick={onLoginClick}
                className="border-white text-white hover:bg-white hover:text-[#18325A]"
              >
                تسجيل الدخول
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#18325A]" dir="rtl">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-300/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="border-b border-white/20 bg-white/10 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo 
              onClick={onBackToLanding}
              size="lg"
              showText={true}
              variant="light"
              className="cursor-pointer"
            />
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={onBackToLanding}
                className="text-white hover:bg-white/10"
              >
                <ArrowRight className="w-4 h-4 ml-2" />
                العودة
              </Button>
              <Button 
                variant="ghost" 
                onClick={onLoginClick}
                className="text-white hover:bg-white/10"
              >
                تسجيل الدخول
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              تسجيل منظمة جديدة في سحابة الأثر
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              املأ النموذج أدناه لإرسال طلب التسجيل، وسيقوم فريقنا بمراجعته والرد عليك.
            </p>
          </div>

          {/* Registration Form */}
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-center justify-center text-white">
                <Building className="w-6 h-6 text-white" />
                بيانات المنظمة
              </CardTitle>
              <CardDescription className="text-center text-blue-200">
                يرجى تعبئة جميع الحقول المطلوبة بدقة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Organization Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName" className="flex items-center gap-2 text-white">
                      <Building className="w-4 h-4" />
                      اسم المنظمة <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="organizationName"
                        value={formData.organizationName}
                        onChange={(e) => handleInputChange('organizationName', e.target.value)}
                        placeholder="أدخل اسم المنظمة"
                        className="bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-white/50 pr-10"
                        required
                      />
                      <Building className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="managerName" className="flex items-center gap-2 text-white">
                      <User className="w-4 h-4" />
                      اسم مدير المنظمة <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="managerName"
                        value={formData.managerName}
                        onChange={(e) => handleInputChange('managerName', e.target.value)}
                        placeholder="أدخل اسم الشخص المسؤول"
                        className="bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-white/50 pr-10"
                        required
                      />
                      <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-white">
                      <Mail className="w-4 h-4" />
                      البريد الإلكتروني <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="example@domain.com"
                        className="bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-white/50 pl-10 text-left"
                        dir="ltr"
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2 text-white">
                      <Phone className="w-4 h-4" />
                      رقم الهاتف <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+966 5X XXX XXXX"
                        className="bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-white/50 pl-10 text-left"
                        dir="ltr"
                        required
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="country" className="flex items-center gap-2 text-white">
                      <Globe className="w-4 h-4" />
                      الدولة <span className="text-red-400">*</span>
                    </Label>
                    <Select 
                      value={formData.country} 
                      onValueChange={(value) => handleInputChange('country', value)}
                      required
                    >
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="اختر الدولة" className="text-white placeholder-white/60" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#18325A] border-white/20">
                        {countries.map((country) => (
                          <SelectItem 
                            key={country} 
                            value={country}
                            className="text-white hover:bg-white/10"
                          >
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="flex items-center gap-2 text-white">
                      <Globe className="w-4 h-4" />
                      المدينة <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="أدخل اسم المدينة"
                        className="bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-white/50 pr-10"
                        required
                      />
                      <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    </div>
                  </div>
                </div>

                {/* Beneficiaries and Website */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="expectedBeneficiaries" className="flex items-center gap-2 text-white">
                      <Users className="w-4 h-4" />
                      عدد المستفيدين المتوقع <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="expectedBeneficiaries"
                        type="number"
                        value={formData.expectedBeneficiaries}
                        onChange={(e) => handleInputChange('expectedBeneficiaries', e.target.value)}
                        placeholder="مثال: 1000"
                        className="bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-white/50 pr-10"
                        min="1"
                        required
                      />
                      <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2 text-white">
                      <Globe className="w-4 h-4" />
                      الموقع الإلكتروني أو رابط التواصل (اختياري)
                    </Label>
                    <div className="relative">
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://example.com"
                        className="bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-white/50 pl-10 text-left"
                        dir="ltr"
                      />
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    </div>
                  </div>
                </div>

                {/* Work Fields */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2 text-base text-white">
                    <FileText className="w-4 h-4" />
                    مجالات العمل الأساسية <span className="text-red-400">*</span>
                  </Label>
                  <p className="text-sm text-blue-200">اختر مجال عمل واحد أو أكثر</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {workFieldOptions.map((field) => (
                      <div key={field.id} className="flex items-center space-x-reverse space-x-2">
                        <Checkbox
                          id={field.id}
                          checked={formData.workFields.includes(field.id)}
                          onCheckedChange={(checked) => handleWorkFieldChange(field.id, checked as boolean)}
                          className="ml-2 border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-[#18325A]"
                        />
                        <Label 
                          htmlFor={field.id} 
                          className="text-sm font-normal cursor-pointer flex items-center gap-2 text-white"
                        >
                          <span>{field.icon}</span>
                          {field.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formData.workFields.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.workFields.map((fieldId) => {
                        const field = workFieldOptions.find(f => f.id === fieldId);
                        return (
                          <Badge 
                            key={fieldId} 
                            variant="secondary" 
                            className="gap-1 bg-white/20 text-white border-white/30"
                          >
                            <span>{field?.icon}</span>
                            {field?.label}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-2 text-white">
                    <FileText className="w-4 h-4" />
                    وصف مختصر عن المنظمة وأهدافها <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="اكتب وصفاً مختصراً عن المنظمة، أهدافها، والخدمات التي تقدمها..."
                    className="min-h-32 bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-white/50"
                    required
                  />
                  <p className="text-sm text-blue-200">
                    الحد الأدنى: 50 حرف | الحالي: {formData.description.length} حرف
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="bg-white text-[#18325A] hover:bg-gray-100 px-12 py-3 text-lg font-semibold"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-[#18325A] border-t-transparent rounded-full ml-2"
                      />
                    ) : (
                      <ArrowLeft className="w-5 h-5 ml-2" />
                    )}
                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 text-center"
          >
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">ملاحظة مهمة</h3>
                </div>
                <p className="text-blue-100 leading-relaxed">
                  بعد إرسال طلبكم، سيقوم فريقنا بمراجعة البيانات المقدمة والتواصل معكم خلال 3-5 أيام عمل. 
                  في حالة الموافقة على الطلب، ستتلقون بيانات الدخول عبر البريد الإلكتروني المسجل.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}