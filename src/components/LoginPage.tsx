import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Logo } from './Logo';
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowLeft, User, Users, Building } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../hooks/useAuth';
import { setupDatabase, testLogin } from '../lib/supabase';

interface LoginPageProps {
  onLogin: (loginInput: string, password: string) => void;
  onLogoClick: () => void;
  onForgotPassword?: () => void;
}

export function LoginPage({ onLogin, onLogoClick, onForgotPassword }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading, error } = useAuth();
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [isTestingLogin, setIsTestingLogin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('يرجى إدخال بيانات تسجيل الدخول وكلمة المرور');
      return;
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    try {
      const result = await signIn(email, password);
      
      if (result.user) {
        toast.success('تم تسجيل الدخول بنجاح!');
        // The auth state change will handle navigation
      }
    } catch (error) {
      // Error is already handled in useAuth hook
      console.error('Login failed:', error);
    }
  };

  const handleSetupDatabase = async () => {
    setIsSettingUp(true);
    try {
      await setupDatabase();
      toast.success('تم إنشاء المستخدمين التجريبيين بنجاح! يمكنك الآن تسجيل الدخول');
    } catch (error) {
      console.error('Setup failed:', error);
      toast.error('فشل في إنشاء المستخدمين التجريبيين');
    } finally {
      setIsSettingUp(false);
    }
  };

  const handleTestLogin = async () => {
    setIsTestingLogin(true);
    try {
      await testLogin();
      toast.success('تم اختبار تسجيل الدخول بنجاح!');
    } catch (error) {
      console.error('Test login failed:', error);
      toast.error('فشل في اختبار تسجيل الدخول');
    } finally {
      setIsTestingLogin(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#18325A] flex items-center justify-center p-4" dir="rtl">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-300/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-md mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8 space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo 
              onClick={onLogoClick}
              size="xl"
              showText={true}
              variant="light"
              className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
            />
          </div>
        </div>

        {/* Login Form */}
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-bold text-center text-white">
              تسجيل الدخول
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Development Setup Buttons */}
            <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/20">
              <p className="text-white text-sm text-center">أدوات التطوير:</p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleSetupDatabase}
                  disabled={isSettingUp}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  size="sm"
                >
                  {isSettingUp ? 'جاري الإنشاء...' : 'إنشاء المستخدمين التجريبيين'}
                </Button>
                <Button
                  type="button"
                  onClick={handleTestLogin}
                  disabled={isTestingLogin}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  size="sm"
                >
                  {isTestingLogin ? 'جاري الاختبار...' : 'اختبار تسجيل الدخول'}
                </Button>
              </div>
              <p className="text-white/70 text-xs text-center">
                بعد إنشاء المستخدمين، استخدم: admin@test.com / TestPass123!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">البريد الإلكتروني</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="أدخل البريد الإلكتروني"
                    className="bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-white/50 pl-10"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-white/50 pl-10 pr-10"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm text-blue-200 hover:text-white transition-colors"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 text-red-200 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-[#18325A] hover:bg-gray-100 h-11 font-semibold"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#18325A] border-t-transparent rounded-full animate-spin"></div>
                    جاري تسجيل الدخول...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    تسجيل الدخول
                  </div>
                )}
              </Button>
            </form>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}