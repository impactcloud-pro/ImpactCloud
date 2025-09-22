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

  // Show test user credentials for development
  const testUsers = [
    { email: 'superadmin@system.com', password: 'SuperAdmin123!', role: 'مدير النظام' },
    { email: 'admin@atharonaa.com', password: 'Admin123!', role: 'مدير أثرنا' },
    { email: 'manager@organization.com', password: 'Manager123!', role: 'مدير منظمة' }
  ];

  const handleTestLogin = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
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
            {/* Test Users Info */}
            <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-3 text-blue-200 text-sm">
              <p className="font-semibold mb-2">حسابات تجريبية:</p>
              <div className="space-y-1 text-xs">
                <p>• superadmin@system.com / SuperAdmin123!</p>
                <p>• admin@atharonaa.com / Admin123!</p>
                <p>• manager@organization.com / Manager123!</p>
              </div>
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

            {/* Test Users Section for Development */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <p className="text-white/70 text-sm mb-3 text-center">حسابات تجريبية للاختبار:</p>
              <div className="space-y-2">
                {testUsers.map((testUser, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestLogin(testUser.email, testUser.password)}
                    className="w-full text-xs bg-white/5 border-white/20 text-white hover:bg-white/10 justify-start"
                    disabled={loading}
                  >
                    <User className="h-3 w-3 ml-2" />
                    {testUser.role} - {testUser.email}
                  </Button>
                ))}
              </div>
              <p className="text-white/50 text-xs mt-2 text-center">
                انقر على أي حساب لملء البيانات تلقائياً
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}