import type { DemoAccount, SelectedPackage } from './types';

export const demoAccounts: DemoAccount[] = [
  {
    email: 'superadmin@exology.com',
    username: 'admin_ahmed',
    password: 'admin123',
    role: 'super_admin',
    name: 'مدير النظام',
    organization: 'Exology'
  },
  {
    email: 'admin@atharonaa.com',
    username: 'fatima_ali',
    password: 'admin123',
    role: 'admin',
    name: 'مدير أثرنا',
    organization: 'Atharonaa'
  },
  {
    email: 'manager@org.com',
    username: 'mohammed_khaled',
    password: 'manager123',
    role: 'org_manager',
    name: 'مدير المنظمة',
    organization: 'مؤسسة خيرية'
  },
  {
    email: 'beneficiary@example.com',
    username: 'sara_ahmed',
    password: 'user123',
    role: 'beneficiary',
    name: 'المستفيد'
  }
];

export const availablePackages: SelectedPackage[] = [
  {
    id: 'starter',
    name: 'الباقة المبتدئة',
    nameEn: 'Starter',
    price: 299,
    currency: 'SAR',
    duration: 'شهرياً',
    features: [
      'إنشاء 10 استبيانات',
      '500 مستفيد',
      '2000 استجابة شهرياً',
      'تقارير أساسية',
      'دعم فني عبر البريد الإلكتروني'
    ],
    limits: {
      surveys: 10,
      beneficiaries: 500,
      responses: 2000,
      storage: '2 GB',
      support: 'البريد الإلكتروني'
    },
    color: '#10b981'
  },
  {
    id: 'professional',
    name: 'الباقة الاحترافية',
    nameEn: 'Professional',
    price: 599,
    currency: 'SAR',
    duration: 'شهرياً',
    isPopular: true,
    features: [
      'إنشاء 25 استبيان',
      '1500 مستفيد',
      '7500 استجابة شهرياً',
      'تقارير متقدمة مع الذكاء الاصطناعي',
      'تحليل البيانات المتقدم',
      'دعم فني على مدار الساعة'
    ],
    limits: {
      surveys: 25,
      beneficiaries: 1500,
      responses: 7500,
      storage: '5 GB',
      support: '24/7'
    },
    color: '#3b82f6'
  },
  {
    id: 'premium',
    name: 'الباقة المتميزة',
    nameEn: 'Premium',
    price: 999,
    currency: 'SAR',
    duration: 'شهرياً',
    isPremium: true,
    features: [
      'إنشاء 50 استبيان',
      '2500 مستفيد',
      '15000 استجابة شهرياً',
      'تحليل الأثر الاجتماعي المتقدم',
      'لوحة تحكم تفاعلية',
      'تقارير مخصصة',
      'API متكامل',
      'مدير حساب مخصص'
    ],
    limits: {
      surveys: 50,
      beneficiaries: 2500,
      responses: 15000,
      storage: '10 GB',
      support: 'مدير حساب مخصص'
    },
    color: '#8b5cf6'
  },
  {
    id: 'enterprise',
    name: 'باقة المؤسسات',
    nameEn: 'Enterprise',
    price: 1999,
    currency: 'SAR',
    duration: 'شهرياً',
    isPremium: true,
    features: [
      'استبيانات غير محدودة',
      'مستفيدين غير محدودين',
      'استجابات غير محدودة',
      'حلول مخصصة للمؤسسات',
      'تكامل مع الأنظمة الموجودة',
      'تدريب وورش عمل',
      'استشارات متخصصة',
      'فريق دعم مخصص'
    ],
    limits: {
      surveys: -1,
      beneficiaries: -1,
      responses: -1,
      storage: 'غير محدود',
      support: 'فريق مخصص'
    },
    color: '#f59e0b'
  }
];