import React, { useState, useEffect } from 'react';
import { SupabaseProvider } from './components/SupabaseProvider';
import { DatabaseStatus } from './components/DatabaseStatus';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { OrganizationRegistrationPage } from './components/OrganizationRegistrationPage';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { LanguageToggle } from './components/LanguageToggle';
import { FaviconUpdater } from './components/FaviconUpdater';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

// Import Supabase services
import { useAuth, useSupabase } from './hooks/useSupabase';
import { testSupabaseConnection } from './lib/supabase';

// Import database functions
import { 
  getAllSurveys, 
  addSurveyToDatabase, 
  deleteSurveyFromDatabase 
} from './components/surveys/constants';

// Import types and constants
import type { User, Survey, SubscriptionFlow } from './constants/types';
import { availablePackages } from './constants/demoData';
import { pagePermissions } from './constants/permissions';
import { authenticateUser, getDefaultPageForRole } from './utils/authUtils';
import { renderCurrentPage } from './utils/routeUtils';
import { initializeUrlRouting, updateUrl, getCurrentPageFromUrl } from './utils/urlUtils';
import type { PaymentMethod } from './components/PaymentMethodPage';
import type { PaymentFormData } from './components/PaymentDetailsPage';

export type { UserRole, User, Survey } from './constants/types';

export default function App(): JSX.Element {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>('');
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [subscriptionFlow, setSubscriptionFlow] = useState<SubscriptionFlow>({
    selectedPackage: null,
    selectedMethod: null,
    paymentData: null
  });
  const [createdSurveys, setCreatedSurveys] = useState<Survey[]>([]);
  const [databaseVersion, setDatabaseVersion] = useState(0);
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [showDatabaseStatus, setShowDatabaseStatus] = useState(false);

  // Test database connection on app start
  useEffect(() => {
    const testConnection = async () => {
      try {
        const isConnected = await testSupabaseConnection();
        if (isConnected) {
          setIsDatabaseReady(true);
          toast.success('تم الاتصال بقاعدة البيانات بنجاح');
        } else {
          setShowDatabaseStatus(true);
          toast.warning('يرجى التحقق من اتصال قاعدة البيانات');
        }
      } catch (error) {
        console.error('Database connection test failed:', error);
        setShowDatabaseStatus(true);
        toast.error('فشل في الاتصال بقاعدة البيانات');
      }
    };

    testConnection();
  }, []);

  // Initialize URL routing
  useEffect(() => {
    const cleanup = initializeUrlRouting((page: string) => {
      setCurrentPage(page);
    });

    return cleanup;
  }, []);

  // Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Update URL when page changes (but not on initial load from URL)
  useEffect(() => {
    if (currentPage !== getCurrentPageFromUrl()) {
      updateUrl(currentPage);
    }
  }, [currentPage]);

  const handleGoToLanding = (): void => {
    setCurrentPage('landing');
    setCurrentUser(null);
    updateUrl('landing');
  };

  const handleGoToLogin = (): void => {
    setCurrentPage('login');
    updateUrl('login');
  };

  const handleGoToOrgRegistration = (): void => {
    setCurrentPage('org-registration');
    updateUrl('org-registration');
  };

  const handleLogin = (loginInput: string, password: string): void => {
    // First try demo authentication for development
    const user = authenticateUser(loginInput, password);
    
    if (user) {
      setCurrentUser(user);
      const defaultPage = getDefaultPageForRole(user.role);
      setCurrentPage(defaultPage);
      updateUrl(defaultPage);
      toast.success(`مرحباً ${user.name}! تم تسجيل الدخول بنجاح`);
    } else {
      // If demo auth fails, could try Supabase auth here
      toast.error('بيانات تسجيل الدخول غير صحيحة. جرب الحسابات التجريبية المعروضة.');
    }
  };

  const handleLogout = (): void => {
    setCurrentUser(null);
    setCurrentPage('landing');
    setSubscriptionFlow({ selectedPackage: null, selectedMethod: null, paymentData: null });
    updateUrl('landing');
    toast.info('تم تسجيل الخروج بنجاح');
  };

  const handleNavigate = (page: string): void => {
    if (!currentUser) return;

    const allowedRoles = pagePermissions[page as keyof typeof pagePermissions];
    if (allowedRoles && allowedRoles.includes(currentUser.role)) {
      setCurrentPage(page);
      updateUrl(page);
    } else {
      toast.error('ليس لديك صلاحية للوصول لهذه الصفحة');
    }
  };

  // Subscription flow handlers
  const handleStartSubscription = (packageId: string): void => {
    const selectedPackage = availablePackages.find(pkg => pkg.id === packageId);
    if (selectedPackage) {
      setSubscriptionFlow(prev => ({ ...prev, selectedPackage }));
      setCurrentPage('payment-method');
      updateUrl('payment-method');
    }
  };

  const handlePaymentMethodSelected = (method: PaymentMethod): void => {
    setSubscriptionFlow(prev => ({ ...prev, selectedMethod: method }));
    setCurrentPage('payment-details');
    updateUrl('payment-details');
  };

  const handleBackToPaymentMethod = (): void => {
    // العودة لصفحة اختيار طريقة الدفع مع الحفاظ على الباقة المختارة
    // لا نحذف selectedPackage، فقط نحذف paymentData إذا كانت موجودة
    setSubscriptionFlow(prev => ({ 
      ...prev, 
      paymentData: null // نحذف بيانات الدفع فقط
      // نحتفظ بـ selectedPackage و selectedMethod
    }));
    setCurrentPage('payment-method');
    updateUrl('payment-method');
  };

  const handlePaymentSubmit = (paymentData: PaymentFormData): void => {
    setSubscriptionFlow(prev => ({ ...prev, paymentData }));
    setCurrentPage('subscription-confirmation');
    updateUrl('subscription-confirmation');
  };

  const handleBackToProfile = (): void => {
    setCurrentPage('profile');
    setSubscriptionFlow({ selectedPackage: null, selectedMethod: null, paymentData: null });
    updateUrl('profile');
  };

  // Survey handlers
  const handleCreateSurvey = (): void => {
    setCurrentPage('survey-creation');
    updateUrl('survey-creation');
  };
  const handleEditSurvey = (surveyId: string): void => {
    setSelectedSurveyId(surveyId);
    setCurrentPage('survey-creation');
    updateUrl('survey-creation');
  };
  const handleViewSurvey = (surveyId: string): void => {
    setSelectedSurveyId(surveyId);
    setCurrentPage('survey-view');
    updateUrl('survey-view');
  };
  const handleViewResults = (surveyId: string): void => {
    setSelectedSurveyId(surveyId);
    setCurrentPage('survey-results');
    updateUrl('survey-results');
  };
  const handleDuplicateSurvey = (surveyId: string): void => {
    toast.success('تم نسخ الاستبيان بنجاح');
  };

  const handleDeleteSurvey = (surveyId: string): void => {
    try {
      setCreatedSurveys(prev => prev.filter(survey => survey.id !== surveyId));
      const deleted = deleteSurveyFromDatabase(surveyId);
      
      if (deleted) {
        setDatabaseVersion(prev => prev + 1);
        toast.success('تم حذف الاستبيان بنجاح من قاعدة البيانات');
      } else {
        toast.success('تم حذف الاستبيان بنجاح');
      }
    } catch (error) {
      console.error('Error deleting survey:', error);
      toast.error('حدث خطأ أثناء حذف الاستبيان');
    }
  };

  // Survey sharing handler
  const handleShareSurvey = (surveyId: string): void => {
    setSelectedSurveyId(surveyId);
    setCurrentPage('survey-share');
    updateUrl('survey-share');
  };

  const handleBackToSurveys = (): void => {
    setCurrentPage('surveys');
    setSelectedSurveyId('');
    updateUrl('surveys');
  };

  const handleBackToSurvey = (surveyId: string): void => {
    setSelectedSurveyId(surveyId);
    setCurrentPage('survey-view');
    updateUrl('survey-view');
  };

  const handleSurveyComplete = (responses: Record<string, any>): void => {
    console.log('Survey completed with responses:', responses);
    // For beneficiaries, the thank you message is handled within EnhancedSurveyInterface
    // For other users, redirect to thank you page
    if (currentUser?.role !== 'beneficiary') {
      setCurrentPage('thank-you');
      updateUrl('thank-you');
    }
    // For beneficiaries, do nothing as the thank you modal is already shown
  };

  const handleSurveyCreated = (survey: Survey): void => {
    setCreatedSurveys(prev => [survey, ...prev]);
    addSurveyToDatabase(survey);
    setDatabaseVersion(prev => prev + 1);
    toast.success(`تم إنشاء الاستبيان "${survey.title}" بنجاح!`);
  };

  const getAllSurveysFromDatabase = (): Survey[] => getAllSurveys();

  const handleViewOrganizationSurveys = (organizationId: string): void => {
    setSelectedOrganizationId(organizationId);
    setCurrentPage('organization-surveys');
    updateUrl('organization-surveys');
  };

  const handleBackToOrganizations = (): void => {
    setCurrentPage('beneficiaries');
    setSelectedOrganizationId('');
    updateUrl('beneficiaries');
  };

  const handleBackToDashboard = (): void => {
    setCurrentPage('dashboard');
    updateUrl('dashboard');
  };

  const handleStartUsingPlatform = (): void => {
    setCurrentPage('dashboard');
    updateUrl('dashboard');
    toast.success('مرحباً بك! ابدأ في استكشاف منصة أثرنا');
  };

  const handleReturnToLanding = (): void => {
    setCurrentUser(null);
    setCurrentPage('landing');
    updateUrl('landing');
  };

  const handleLanguageChange = (language: string): void => {
    console.log('Language changed to:', language);
  };

  const renderPage = (): React.ReactNode => {
    if (!currentUser && currentPage === 'landing') {
      return <LandingPage onLogin={handleGoToLogin} onRegisterOrganization={handleGoToOrgRegistration} />;
    }

    if (!currentUser && currentPage === 'org-registration') {
      return (
        <OrganizationRegistrationPage
          onBackToLanding={handleGoToLanding}
          onLoginClick={handleGoToLogin}
        />
      );
    }

    if (!currentUser) {
      return (
        <LoginPage 
          onLogin={handleLogin}
          onLogoClick={handleGoToLanding}
          onForgotPassword={() => setShowForgotPassword(true)}
        />
      );
    }

    return renderCurrentPage({
      currentPage,
      currentUser,
      selectedSurveyId,
      selectedOrganizationId,
      subscriptionFlow,
      handlers: {
        handleCreateSurvey,
        handleEditSurvey,
        handleViewResults,
        handleViewSurvey,
        handleDuplicateSurvey,
        handleDeleteSurvey,
        handleShareSurvey,
        handleBackToSurveys,
        handleBackToSurvey,
        handleSurveyComplete,
        handleSurveyCreated,
        handleViewOrganizationSurveys,
        handleBackToOrganizations,
        handleBackToDashboard,
        handleStartSubscription,
        handlePaymentMethodSelected,
        handleBackToPaymentMethod,
        handlePaymentSubmit,
        handleBackToProfile,
        handleStartUsingPlatform,
        handleReturnToLanding,
        getAllSurveysFromDatabase
      }
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <FaviconUpdater />
      <SupabaseProvider>
        {/* Database Status Check */}
        {(showDatabaseStatus || !isDatabaseReady) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <DatabaseStatus onConnectionReady={() => {
              setIsDatabaseReady(true);
              setShowDatabaseStatus(false);
              toast.success('قاعدة البيانات جاهزة للاستخدام!');
            }} />
          </div>
        )}

        {!currentUser && (currentPage === 'landing' || currentPage === 'org-registration') ? (
          <>
            {renderPage()}
            <Toaster 
              position="top-center"
              dir="rtl"
              toastOptions={{
                style: {
                  fontFamily: 'Cairo, IBM Plex Arabic, Noto Sans Arabic, Inter, sans-serif',
                  textAlign: 'right',
                  direction: 'rtl'
                }
              }}
            />
          </>
        ) : (
          <Layout
            currentPage={currentPage}
            userRole={currentUser?.role || 'beneficiary'}
            userName={currentUser?.name || ''}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onGoToLanding={handleGoToLanding}
          >
            {renderPage()}
          </Layout>
        )}
        
        {currentUser && (
          <Toaster 
            position="top-center"
            dir="rtl"
            toastOptions={{
              style: {
                fontFamily: 'Cairo, IBM Plex Arabic, Noto Sans Arabic, Inter, sans-serif',
                textAlign: 'right',
                direction: 'rtl'
              }
            }}
          />
        )}
      </SupabaseProvider>

      <ForgotPasswordModal 
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />

      {/* Database Connection Status Indicator */}
      {isDatabaseReady && (
        <div className="fixed bottom-4 left-4 z-40">
          <div className="bg-green-100 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-800 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>قاعدة البيانات متصلة</span>
          </div>
        </div>
      )}
    </div>
  );
}