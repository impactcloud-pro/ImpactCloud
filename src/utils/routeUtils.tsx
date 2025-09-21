import React from 'react';
import type { User, SubscriptionFlow } from '../constants/types';
import type { PaymentMethod } from '../components/PaymentMethodPage';
import type { PaymentFormData } from '../components/PaymentDetailsPage';

// Import all page components
import { Dashboard } from '../components/Dashboard';
import { SurveysPage } from '../components/SurveysPage';
import SurveyCreationWizard from '../components/SurveyCreationWizard';
import { SurveyViewPage } from '../components/SurveyViewPage';
import { SurveyResultsPage } from '../components/SurveyResultsPage';
import { SurveyInterface } from '../components/SurveyInterface';
import { EnhancedSurveyInterface } from '../components/EnhancedSurveyInterface';
import { SurveySharePage } from '../components/SurveySharePage';
import { ThankYouPage } from '../components/ThankYouPage';
import { SubscriptionPage } from '../components/SubscriptionPage';
import { AdminBillingPage } from '../components/AdminBillingPage';
import { SuperAdminBillingPage } from '../components/SuperAdminBillingPage';
import { SuperAdminBeneficiariesPage } from '../components/SuperAdminBeneficiariesPage';
import { UserManagement } from '../components/UserManagement';
import { BeneficiariesPage } from '../components/BeneficiariesPage';
import { OrganizationBeneficiariesPage } from '../components/OrganizationBeneficiariesPage';
import { OrganizationsManagementPage } from '../components/OrganizationsManagementPage';

import { OrganizationsPage } from '../components/OrganizationsPage';
import { SystemSettingsPage } from '../components/SystemSettingsPage';
import { AdminSettingsPage } from '../components/AdminSettingsPage';
import { ActivityLogsPage } from '../components/ActivityLogsPage';
import { ContentManagementPage } from '../components/ContentManagementPage';
import { GlobalSurveySettingsPage } from '../components/GlobalSurveySettingsPage';
import { ProfilePage } from '../components/ProfilePage';
import { PaymentMethodPage } from '../components/PaymentMethodPage';
import { PaymentDetailsPage } from '../components/PaymentDetailsPage';
import { SubscriptionConfirmationPage } from '../components/SubscriptionConfirmationPage';
import { OrganizationSurveysPage } from '../components/PostSurveyInterface';
import { AnalysisPage } from '../components/AnalysisPage';
import { OrganizationRequestsManagement } from '../components/OrganizationRequestsManagement';

interface RouteHandlers {
  handleCreateSurvey: () => void;
  handleEditSurvey: (surveyId: string) => void;
  handleViewResults: (surveyId: string) => void;
  handleViewSurvey: (surveyId: string) => void;
  handleDuplicateSurvey: (surveyId: string) => void;
  handleDeleteSurvey: (surveyId: string) => void;
  handleShareSurvey: (surveyId: string) => void;
  handleBackToSurveys: () => void;
  handleBackToSurvey: (surveyId: string) => void;
  handleSurveyComplete: (responses: Record<string, any>) => void;
  handleSurveyCreated: (survey: any) => void;
  handleViewOrganizationSurveys: (organizationId: string) => void;
  handleBackToOrganizations: () => void;
  handleBackToDashboard: () => void;
  handleStartSubscription: (packageId: string) => void;
  handlePaymentMethodSelected: (method: PaymentMethod) => void;
  handleBackToPaymentMethod: () => void;
  handlePaymentSubmit: (paymentData: PaymentFormData) => void;
  handleBackToProfile: () => void;
  handleStartUsingPlatform: () => void;
  handleReturnToLanding: () => void;
  getAllSurveysFromDatabase: () => any[];
}

interface RouteRenderProps {
  currentPage: string;
  currentUser: User;
  selectedSurveyId: string;
  selectedOrganizationId: string;
  subscriptionFlow: SubscriptionFlow;
  handlers: RouteHandlers;
}

export const renderCurrentPage = ({
  currentPage,
  currentUser,
  selectedSurveyId,
  selectedOrganizationId,
  subscriptionFlow,
  handlers
}: RouteRenderProps): React.ReactNode => {
  switch (currentPage) {
    case 'dashboard':
      return <Dashboard userRole={currentUser.role} />;
    
    case 'surveys':
      return (
        <SurveysPage 
          userRole={currentUser.role}
          onCreateSurvey={handlers.handleCreateSurvey}
          onEditSurvey={handlers.handleEditSurvey}
          onViewResults={handlers.handleViewResults}
          onViewSurvey={handlers.handleViewSurvey}
          onDuplicateSurvey={handlers.handleDuplicateSurvey}
          onDeleteSurvey={handlers.handleDeleteSurvey}
          onShareSurvey={handlers.handleShareSurvey}
          createdSurveys={handlers.getAllSurveysFromDatabase()}
        />
      );
    
    case 'survey-creation':
      return (
        <SurveyCreationWizard 
          onBack={handlers.handleBackToSurveys} 
          onSurveyCreated={handlers.handleSurveyCreated}
          userRole={currentUser.role as 'admin' | 'org_manager'}
        />
      );
    
    case 'survey-view':
      return (
        <SurveyViewPage 
          surveyId={selectedSurveyId}
          onBack={handlers.handleBackToSurveys}
          onEdit={handlers.handleEditSurvey}
          onViewResults={handlers.handleViewResults}
        />
      );
    
    case 'survey-results':
      return (
        <SurveyResultsPage 
          surveyId={selectedSurveyId}
          onBack={handlers.handleBackToSurveys}
          onBackToSurvey={handlers.handleBackToSurvey}
        />
      );
    
    case 'survey-share':
      const selectedSurvey = handlers.getAllSurveysFromDatabase().find(s => s.id === selectedSurveyId);
      if (selectedSurvey) {
        return (
          <SurveySharePage 
            survey={selectedSurvey}
            onBackToSurveys={handlers.handleBackToSurveys}
          />
        );
      }
      return <Dashboard userRole={currentUser.role} />;
    
    case 'survey-interface':
      return <SurveyInterface />;
    
    case 'enhanced-survey':
      return (
        <EnhancedSurveyInterface 
          onComplete={handlers.handleSurveyComplete}
          onBack={() => {}}
          onReturnToLanding={handlers.handleReturnToLanding}
        />
      );
    
    case 'thank-you':
      return (
        <ThankYouPage 
          onBackToSurveys={() => {}}
          onNewSurvey={() => {}}
        />
      );
    
    case 'subscription':
      return <SubscriptionPage userRole={currentUser.role} />;
    
    case 'admin-billing':
      if (currentUser.role === 'super_admin') {
        return <SuperAdminBillingPage userRole={currentUser.role} />;
      } else {
        return <AdminBillingPage userRole={currentUser.role} />;
      }
    
    case 'user-management':
      return <UserManagement userRole={currentUser.role as 'super_admin' | 'admin' | 'org_manager'} />;
    
    case 'beneficiaries':
      if (currentUser.role === 'super_admin') {
        return <SuperAdminBeneficiariesPage userRole={currentUser.role} />;
      } else if (currentUser.role === 'admin') {
        return <OrganizationsManagementPage onViewSurveys={handlers.handleViewOrganizationSurveys} />;
      } else {
        return <OrganizationBeneficiariesPage onViewSurveys={handlers.handleViewOrganizationSurveys} />;
      }
    
    case 'organization-surveys':
      return (
        <OrganizationSurveysPage 
          organizationId={selectedOrganizationId}
          onBack={handlers.handleBackToOrganizations}
        />
      );
    

    
    case 'organizations':
      return <OrganizationsPage />;
    
    case 'system-settings':
      return <SystemSettingsPage />;
    
    case 'admin-settings':
      return <AdminSettingsPage userRole={currentUser.role as 'admin'} />;
    
    case 'activity-logs':
      return <ActivityLogsPage />;
    
    case 'content-management':
      return <ContentManagementPage userRole={currentUser.role as 'super_admin' | 'admin'} />;
    
    case 'analysis':
      return <AnalysisPage userRole={currentUser.role as 'admin' | 'org_manager'} />;
    
    case 'organization-requests':
      return <OrganizationRequestsManagement />;
    
    case 'global-survey-settings':
      return <GlobalSurveySettingsPage userRole={currentUser.role as 'admin'} />;
    
    case 'profile':
      return (
        <ProfilePage 
          userRole={currentUser.role as 'org_manager'}
          userName={currentUser.name}
          userEmail={currentUser.email}
          organization={currentUser.organization || ''}
          onBack={handlers.handleBackToDashboard}
          onStartSubscription={handlers.handleStartSubscription}
        />
      );
    
    case 'payment-method':
      if (subscriptionFlow.selectedPackage) {
        return (
          <PaymentMethodPage 
            userRole={currentUser.role as 'org_manager'}
            selectedPackage={subscriptionFlow.selectedPackage}
            onBack={handlers.handleBackToProfile}
            onMethodSelected={handlers.handlePaymentMethodSelected}
          />
        );
      }
      break;
    
    case 'payment-details':
      if (subscriptionFlow.selectedPackage && subscriptionFlow.selectedMethod) {
        return (
          <PaymentDetailsPage 
            userRole={currentUser.role as 'org_manager'}
            selectedPackage={subscriptionFlow.selectedPackage}
            selectedMethod={subscriptionFlow.selectedMethod}
            onBack={handlers.handleBackToPaymentMethod}
            onPaymentSubmit={handlers.handlePaymentSubmit}
          />
        );
      }
      break;
    
    case 'subscription-confirmation':
      if (subscriptionFlow.selectedPackage && subscriptionFlow.selectedMethod && subscriptionFlow.paymentData) {
        return (
          <SubscriptionConfirmationPage 
            userRole={currentUser.role as 'org_manager'}
            selectedPackage={subscriptionFlow.selectedPackage}
            selectedMethod={subscriptionFlow.selectedMethod}
            paymentData={subscriptionFlow.paymentData}
            onBackToProfile={handlers.handleBackToProfile}
            onStartUsingPlatform={handlers.handleStartUsingPlatform}
          />
        );
      }
      break;
    
    default:
      if (currentUser.role === 'beneficiary') {
        return (
          <EnhancedSurveyInterface 
            onComplete={handlers.handleSurveyComplete}
            onBack={() => {}}
            onReturnToLanding={handlers.handleReturnToLanding}
          />
        );
      } else {
        return <Dashboard userRole={currentUser.role} />;
      }
  }
  
  return null;
};