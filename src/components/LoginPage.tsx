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
import { handleSupabaseError } from '../utils/supabaseHelpers';

interface LoginPageProps {
  onLogin: (loginInput: string, password: string) => void;
  onLogoClick: () => void;
  onForgotPassword?: () => void;
}

export function LoginPage({ onLogin, onLogoClick, onForgotPassword }: LoginPageProps) {
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginInput || !password) {
      toast.error('يرجى إدخال بيانات تسجيل الدخول وكلمة المرور');
      return;
    }

    setIsLoading(true);

    try {
      // Try Supabase authentication
      const result = await signIn(loginInput, password);
      
      if (result.user && result.profile) {
        // Convert Supabase user to app user format
        const appUser = {
          email: result.user.email!,
          name: result.profile.name,
          role: result.profile.role_id,
          organization: result.profile.organizations?.name
        };
        onLogin(loginInput, password); // This will be handled by the auth state
        toast.success(`مرحباً ${appUser.name}! تم تسجيل الدخول بنجاح`);
      } else {
        toast.error('لم يتم العثور على ملف تعريف المستخدم');
      }
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loginInput" className="text-white">اسم المستخدم</Label>
                <div className="relative">
                  <Input
                    id="loginInput"
                    type="text"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="أدخل اسم المستخدم"
                    className="bg-white/10 border-white/30 text-white placeholder-white/60 focus:border-white/50 pl-10"
                    required
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-[#18325A] hover:bg-gray-100 h-11 font-semibold"
              >
                {isLoading ? (
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