import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  }
];

interface LanguageToggleProps {
  variant?: 'button' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  onLanguageChange?: (language: string) => void;
}

export function LanguageToggle({ 
  variant = 'dropdown',
  size = 'md',
  showText = true,
  onLanguageChange
}: LanguageToggleProps) {
  const [currentLanguage, setCurrentLanguage] = useState<string>('ar');

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') || 'ar';
    setCurrentLanguage(savedLanguage);
    applyLanguage(savedLanguage);
  }, []);

  const applyLanguage = (languageCode: string) => {
    const html = document.documentElement;
    
    if (languageCode === 'ar') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
      document.body.style.fontFamily = "'Cairo', 'IBM Plex Arabic', 'Noto Sans Arabic', 'Inter', sans-serif";
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'en');
      document.body.style.fontFamily = "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    }

    // Update CSS classes for RTL/LTR
    document.body.className = document.body.className.replace(/\b(rtl|ltr)\b/g, '');
    document.body.classList.add(languageCode === 'ar' ? 'rtl' : 'ltr');
  };

  const handleLanguageChange = (languageCode: string) => {
    if (languageCode === currentLanguage) return;

    setCurrentLanguage(languageCode);
    localStorage.setItem('preferred-language', languageCode);
    applyLanguage(languageCode);

    const language = languages.find(lang => lang.code === languageCode);
    
    if (onLanguageChange) {
      onLanguageChange(languageCode);
    }

    toast.success(
      languageCode === 'ar' 
        ? `تم تغيير اللغة إلى ${language?.nativeName}` 
        : `Language changed to ${language?.name}`
    );

    // Simulate page reload for full language change (in a real app, you'd use i18n)
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  if (variant === 'button') {
    // Simple toggle button between Arabic and English
    return (
      <Button
        onClick={() => handleLanguageChange(currentLanguage === 'ar' ? 'en' : 'ar')}
        variant="outline"
        size={size}
        className="gap-2"
      >
        <Globe className="h-4 w-4" />
        {showText && (
          <span>{currentLanguage === 'ar' ? 'English' : 'عربي'}</span>
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={size} className="gap-2">
          <Globe className="h-4 w-4" />
          {showText && (
            <span className="hidden sm:inline">
              {currentLang?.flag} {currentLang?.nativeName}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span>{language.nativeName}</span>
            </div>
            {currentLanguage === language.code && (
              <Check className="h-4 w-4 text-green-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Hook for using language context in components
export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState('ar');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') || 'ar';
    setCurrentLanguage(savedLanguage);
  }, []);

  const isRTL = currentLanguage === 'ar';
  const isArabic = currentLanguage === 'ar';

  return {
    currentLanguage,
    isRTL,
    isArabic,
    changeLanguage: (lang: string) => {
      localStorage.setItem('preferred-language', lang);
      setCurrentLanguage(lang);
    }
  };
}

// Translation helper (basic implementation)
export const translations = {
  ar: {
    // Common terms
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    signup: 'إنشاء حساب',
    save: 'حفظ',
    cancel: 'إلغاء',
    submit: 'إرسال',
    edit: 'تعديل',
    delete: 'حذف',
    create: 'إنشاء',
    update: 'تحديث',
    search: 'بحث',
    filter: 'تصفية',
    export: 'تصدير',
    import: 'استيراد',
    yes: 'نعم',
    no: 'لا',
    
    // Navigation
    dashboard: 'لوحة التحكم',
    surveys: 'الاستبيانات',
    beneficiaries: 'المستفيدين',
    analytics: 'التحليلات',
    settings: 'الإعدادات',
    
    // Messages
    welcome: 'مرحباً',
    success: 'تم بنجاح',
    error: 'حدث خطأ',
    loading: 'جاري التحميل...'
  },
  en: {
    // Common terms
    login: 'Login',
    logout: 'Logout',
    signup: 'Sign Up',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    edit: 'Edit',
    delete: 'Delete',
    create: 'Create',
    update: 'Update',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    yes: 'Yes',
    no: 'No',
    
    // Navigation
    dashboard: 'Dashboard',
    surveys: 'Surveys',
    beneficiaries: 'Beneficiaries',
    analytics: 'Analytics',
    settings: 'Settings',
    
    // Messages
    welcome: 'Welcome',
    success: 'Success',
    error: 'Error',
    loading: 'Loading...'
  }
};

export function useTranslation() {
  const { currentLanguage } = useLanguage();
  
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage as keyof typeof translations];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return { t };
}