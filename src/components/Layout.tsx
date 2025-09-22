import React from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Logo } from './Logo';
import { useAuth } from '../hooks/useAuth';
import { BarChart3, Users, FileText, CreditCard, LogOut, DivideIcon as LucideIcon, Bot, Building, Activity, Settings, Edit, User, ClipboardList, ChevronDown, ChevronLeft } from 'lucide-react';
import type { UserRole } from '../App';
import { getPageTitle } from './PageTitles';
import { AIChatWidget } from './AIChatWidget';
import { toast } from 'sonner@2.0.3';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  userRole: UserRole;
  userName: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onGoToLanding?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  submenu?: MenuItem[];
}

export function Layout({ 
  children, 
  currentPage, 
  userRole, 
  userName, 
  onNavigate, 
  onLogout,
  onGoToLanding
}: LayoutProps) {
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>([]);
  const { signOut } = useAuth();

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };
  const handleLogoClick = () => {
    // Navigate to landing page if handler is available, otherwise navigate to dashboard
    if (onGoToLanding) {
      onGoToLanding();
    } else {
      // Fallback to appropriate home page based on user role
      if (userRole === 'beneficiary') {
        onNavigate('enhanced-survey');
      } else {
        onNavigate('dashboard');
      }
    }
  };

  const handleAvatarClick = () => {
    // Only org_manager can access profile page
    if (userRole === 'org_manager') {
      onNavigate('profile');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      onLogout();
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };
  const getMenuItems = () => {
    const baseItems: MenuItem[] = [];
    
    // Super Admin (Exology): Full system management
    if (userRole === 'super_admin') {
      baseItems.push(
        { id: 'dashboard', label: getPageTitle('dashboard', userRole), icon: BarChart3 },
        { id: 'organizations', label: getPageTitle('organizations', userRole), icon: Building },
        { id: 'user-management', label: getPageTitle('user-management', userRole), icon: Users },
        { id: 'subscription', label: getPageTitle('subscription', userRole), icon: CreditCard },
        { id: 'system-settings', label: getPageTitle('system-settings', userRole), icon: Settings },
        { id: 'activity-logs', label: getPageTitle('activity-logs', userRole), icon: Activity },
        { id: 'content-management', label: getPageTitle('content-management', userRole), icon: Edit }
      );
    }
    
    // Admin (Atharonaa): Survey and analytics management + billing + content management
    else if (userRole === 'admin') {
      baseItems.push(
        { id: 'dashboard', label: getPageTitle('dashboard', userRole), icon: BarChart3 },
        { 
          id: 'surveys', 
          label: getPageTitle('surveys', userRole), 
          icon: FileText,
          submenu: [
            { id: 'global-survey-settings', label: getPageTitle('global-survey-settings', userRole), icon: Settings }
          ]
        },
        { id: 'beneficiaries', label: getPageTitle('beneficiaries', userRole), icon: Building },

        { id: 'organization-requests', label: getPageTitle('organization-requests', userRole), icon: ClipboardList },
        { id: 'user-management', label: getPageTitle('user-management', userRole), icon: Users },
        { id: 'admin-billing', label: getPageTitle('admin-billing', userRole), icon: CreditCard }, // New billing page for admin
        { id: 'admin-settings', label: getPageTitle('admin-settings', userRole), icon: Settings },
        { id: 'content-management', label: getPageTitle('content-management', userRole), icon: Edit }
      );
    }
    
    // Organization Manager: Survey creation and beneficiaries
    else if (userRole === 'org_manager') {
      baseItems.push(
        { id: 'dashboard', label: getPageTitle('dashboard', userRole), icon: BarChart3 },
        { id: 'surveys', label: getPageTitle('surveys', userRole), icon: FileText },
        { id: 'beneficiaries', label: getPageTitle('beneficiaries', userRole), icon: Users },
        { id: 'analysis', label: getPageTitle('analysis', userRole), icon: Bot }
      );
    }
    
    return baseItems;
  };

  // Auto-expand menu if current page is a submenu item
  React.useEffect(() => {
    const menuItems = getMenuItems();
    menuItems.forEach(item => {
      if (item.submenu) {
        const hasActiveSubmenu = item.submenu.some(subItem => subItem.id === currentPage);
        if (hasActiveSubmenu && !expandedMenus.includes(item.id)) {
          setExpandedMenus(prev => [...prev, item.id]);
        }
      }
    });
  }, [currentPage, expandedMenus]);

  if (currentPage === 'login' || currentPage === 'signup') {
    return <>{children}</>;
  }

  // Simple layout for beneficiaries - no sidebar, minimal header
  if (userRole === 'beneficiary') {
    return (
      <div className="min-h-screen bg-[#18325A]" dir="rtl">
        {/* Minimal Header for Beneficiaries */}
        <header className="bg-[#18325A]/95 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-sm">
          <div className="px-6 h-20 flex items-center justify-center">
            <Logo 
              onClick={handleLogoClick}
              size="md"
              showText={true}
              variant="light"
            />
          </div>
        </header>

        {/* Main Content without sidebar */}
        <main className="w-full">
          {children}
        </main>


      </div>
    );
  }

  // Full layout for other user roles
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50" dir="rtl">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/70 sticky top-0 z-50 shadow-sm">
        <div className="px-6 h-20 flex items-center justify-between">
          <Logo 
            onClick={handleLogoClick}
            size="md"
            showText={true}
            variant="dark"
          />
          
          <div className="flex items-center gap-4">
            <div 
              className={`flex items-center gap-4 ${
                userRole === 'org_manager' ? 'cursor-pointer hover:bg-gray-50 px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-sm' : ''
              }`}
              onClick={handleAvatarClick}
              title={userRole === 'org_manager' ? 'انقر لعرض الملف الشخصي' : ''}
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{userName}</p>
                <p className="text-xs text-gray-500">
                  {userRole === 'super_admin' && 'مدير النظام'}
                  {userRole === 'admin' && 'مدير سحابة الأثر'}
                  {userRole === 'org_manager' && 'مدير منظمة'}
                </p>
              </div>
              <Avatar className={`ring-2 ring-gray-100 shadow-md ${userRole === 'org_manager' ? 'hover:ring-[#183259]/30' : ''}`}>
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-[#183259] to-[#2a4a7a] text-white text-sm font-semibold">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {userRole === 'org_manager' && (
                <User className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 bg-gradient-to-b from-[#183259] via-[#1e3863] to-[#2a4a7a] text-white min-h-[calc(100vh-5rem)] shadow-xl">
          <div className="p-6">
            <div className="mb-8 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <p className="text-sm text-blue-200">مرحباً بعودتك</p>
              <p className="font-semibold text-lg">{userName}</p>
              <p className="text-xs text-blue-300/80 mt-1">
                {userRole === 'super_admin' && 'مدير النظام'}
                {userRole === 'admin' && 'مدير سحابة الأثر'}
                {userRole === 'org_manager' && 'مدير منظمة'}
              </p>
            </div>
            
            <nav className="space-y-2">
              {getMenuItems().map((item) => (
                <div key={item.id} className="space-y-1">
                  {/* Main Menu Item */}
                  <Button
                    variant={currentPage === item.id || (item.submenu && item.submenu.some(sub => sub.id === currentPage)) ? "secondary" : "ghost"}
                    className={`w-full justify-between text-right gap-4 h-12 rounded-xl transition-all duration-200 ${
                      currentPage === item.id || (item.submenu && item.submenu.some(sub => sub.id === currentPage))
                        ? 'bg-white/15 text-white shadow-lg border border-white/20 backdrop-blur-sm' 
                        : 'text-blue-100 hover:text-white hover:bg-white/10 hover:shadow-md'
                    }`}
                    onClick={() => {
                      onNavigate(item.id);
                      if (item.submenu) {
                        toggleMenu(item.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </div>
                    {item.submenu && (
                      <ChevronDown 
                        className={`h-4 w-4 transition-transform duration-200 ${
                          expandedMenus.includes(item.id) ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </Button>

                  {/* Submenu Items */}
                  {item.submenu && expandedMenus.includes(item.id) && (
                    <div className="pr-4 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Button
                          key={subItem.id}
                          variant={currentPage === subItem.id ? "secondary" : "ghost"}
                          className={`w-full justify-start text-right gap-4 h-10 rounded-lg transition-all duration-200 text-sm ${
                            currentPage === subItem.id 
                              ? 'bg-white/10 text-white shadow-md border border-white/10 backdrop-blur-sm' 
                              : 'text-blue-200/80 hover:text-white hover:bg-white/5 hover:shadow-sm'
                          }`}
                          onClick={() => onNavigate(subItem.id)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <subItem.icon className="h-4 w-4" />
                          {subItem.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            
            <div className="mt-8 pt-6 border-t border-white/20">
              <Button
                variant="ghost"
                className="w-full justify-start text-right gap-4 h-12 text-blue-100 hover:text-white hover:bg-red-500/20 hover:shadow-md rounded-xl transition-all duration-200"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gradient-to-br from-white/50 to-gray-50/50 min-h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>

      {/* AI Chat Widget - Only for admin */}
      <AIChatWidget userRole={userRole} userName={userName} />
    </div>
  );
}