import React from 'react';
import { PageLayout } from './PageLayout';
import { usePageTitle } from './withPageTitle';
import type { UserRole } from '../App';

interface EnhancedPageLayoutPropsWithPageId {
  pageId: string;
  userRole: UserRole;
  customTitle?: string;
  description: string;
  icon: React.ReactNode;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
}

interface EnhancedPageLayoutPropsWithTitle {
  title: string;
  subtitle?: string;
  description?: string;
  stats?: Array<{
    title: string;
    value: number | string;
    icon: React.ComponentType<any>;
    color?: string;
  }>;
  headerStats?: React.ReactNode;
  userRole?: UserRole;
  icon?: React.ReactNode;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
}

type EnhancedPageLayoutProps = EnhancedPageLayoutPropsWithPageId | EnhancedPageLayoutPropsWithTitle;

function hasPageId(props: EnhancedPageLayoutProps): props is EnhancedPageLayoutPropsWithPageId {
  return 'pageId' in props;
}

/**
 * Enhanced PageLayout that automatically synchronizes with navigation menu titles
 * or uses provided title directly
 */
export function EnhancedPageLayout(props: EnhancedPageLayoutProps) {
  if (hasPageId(props)) {
    // Use the new page title system
    const { pageId, userRole, customTitle, description, icon, headerContent, children } = props;
    const { title } = usePageTitle(pageId, userRole, customTitle);

    return (
      <PageLayout
        title={title}
        description={description}
        icon={icon}
        headerContent={headerContent}
      >
        {children}
      </PageLayout>
    );
  } else {
    // Use the legacy direct title system
    const { title, subtitle, description, stats, headerStats, userRole, icon, headerContent, children } = props;
    
    // Create header content from stats if provided
    let finalHeaderContent = headerContent || headerStats;
    
    if (stats && !finalHeaderContent) {
      finalHeaderContent = (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <stat.icon className="h-6 w-6 text-white" />
                <div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-blue-200">{stat.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <PageLayout
        title={title}
        description={subtitle || description}
        icon={icon}
        headerContent={finalHeaderContent}
      >
        {children}
      </PageLayout>
    );
  }
}