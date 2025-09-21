import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Logo } from './Logo';
import { User, Mail, Lock, Building, Eye, EyeOff } from 'lucide-react';

interface SignUpData {
  name: string;
  email: string;
  password: string;
  organization?: string;
  role?: 'super_admin' | 'admin' | 'org_manager' | 'beneficiary';
}

interface SignUpPageProps {
  onSignUp: (userData: SignUpData) => void;
  onBackToLogin: () => void;
  onLogoClick: () => void;
}

export function SignUpPage({ onSignUp, onBackToLogin, onLogoClick }: SignUpPageProps): JSX.Element {
  const [formData, setFormData] = useState<SignUpData>({
    name: '',
    email: '',
    password: '',
    organization: '',
    role: 'org_manager'
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<SignUpData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpData> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'الاسم الكامل مطلوب';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'الاسم يجب أن يكون حرفين على الأقل';
    }
    
    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 8) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'كلمة المرور يجب أن تحتوي على حروف كبيرة وصغيرة ورقم';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSignUp(formData);
    setIsLoading(false);
  };

  const handleInputChange = (field: keyof SignUpData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo Section - Clickable */}
        <div className="text-center mb-8">
          <Logo 
            onClick={onLogoClick}
            size="xl"
            showText={true}
            variant="default"
          />
        </div>

        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-gray-900 font-bold">إنشاء حساب جديد</CardTitle>
            <CardDescription className="text-gray-600">
              انضم إلى منصة أثرنا لقياس الأثر الاجتماعي
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="space-y-2">
                <Label 
                  htmlFor="name" 
                  className="flex items-center justify-end space-x-reverse space-x-2 text-sm font-medium text-gray-700"
                >
                  <span>الاسم الكامل</span>
                  <User className="h-4 w-4" />
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`text-right pr-4 pl-4 h-12 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
                    placeholder="أدخل اسمك الكامل"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <div id="name-error" className="mt-1 text-sm text-red-600 text-right" role="alert">
                      {errors.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label 
                  htmlFor="email" 
                  className="flex items-center justify-end space-x-reverse space-x-2 text-sm font-medium text-gray-700"
                >
                  <span>البريد الإلكتروني</span>
                  <Mail className="h-4 w-4" />
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`text-right pr-4 pl-4 h-12 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
                    placeholder="example@domain.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <div id="email-error" className="mt-1 text-sm text-red-600 text-right" role="alert">
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label 
                  htmlFor="password" 
                  className="flex items-center justify-end space-x-reverse space-x-2 text-sm font-medium text-gray-700"
                >
                  <span>كلمة المرور</span>
                  <Lock className="h-4 w-4" />
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`text-right pr-12 pl-4 h-12 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
                    placeholder="كلمة مرور قوية"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : "password-help"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  {errors.password ? (
                    <div id="password-error" className="mt-1 text-sm text-red-600 text-right" role="alert">
                      {errors.password}
                    </div>
                  ) : (
                    <div id="password-help" className="mt-1 text-xs text-gray-500 text-right">
                      يجب أن تحتوي على 8 أحرف على الأقل مع حروف كبيرة وصغيرة ورقم
                    </div>
                  )}
                </div>
              </div>

              {/* Organization Field */}
              <div className="space-y-2">
                <Label 
                  htmlFor="organization" 
                  className="flex items-center justify-end space-x-reverse space-x-2 text-sm font-medium text-gray-700"
                >
                  <span>اسم المنظمة (اختياري)</span>
                  <Building className="h-4 w-4" />
                </Label>
                <Input
                  id="organization"
                  type="text"
                  value={formData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  className="text-right pr-4 pl-4 h-12 border-gray-300 focus:ring-primary"
                  placeholder="اسم منظمتك أو مؤسستك"
                />
              </div>

              {/* Role Field */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700 text-right block">
                  نوع الحساب
                </Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => handleInputChange('role', value)}
                  dir="rtl"
                >
                  <SelectTrigger className="text-right h-12 border-gray-300 focus:ring-primary" id="role">
                    <SelectValue placeholder="اختر نوع الحساب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="org_manager">مدير منظمة</SelectItem>
                    <SelectItem value="beneficiary">مستفيد</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                disabled={isLoading}
                aria-label="إنشاء الحساب"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-reverse space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>جارٍ إنشاء الحساب...</span>
                  </div>
                ) : 'إنشاء الحساب'}
              </Button>
            </form>

            {/* Back to Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                لديك حساب بالفعل؟{' '}
                <button 
                  onClick={onBackToLogin}
                  className="text-primary hover:text-primary/80 font-medium hover:underline focus:outline-none focus:underline transition-colors"
                  aria-label="تسجيل الدخول"
                >
                  تسجيل الدخول
                </button>
              </p>
            </div>

            {/* Information Note */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-gray-700 text-center leading-relaxed">
                سيتم مراجعة طلبك من قبل الإدارة وستتلقى رسالة تأكيد عبر البريد الإلكتروني خلال 24-48 ساعة
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}