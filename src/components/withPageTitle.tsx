import React from 'react';
import { getPageTitle, updatePageTitle } from './PageTitles';
import type { UserRole } from '../App';

interface WithPageTitleProps {
  pageId: string;
  userRole: UserRole;
  title?: string; // Optional override title
}

/**
 * Higher Order Component that ensures page titles are synchronized
 * between navigation menu and page headers automatically
 */
export function withPageTitle<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  config: WithPageTitleProps
) {
  return function PageTitleWrapper(props: P) {
    // If a custom title is provided, update the global title mapping
    React.useEffect(() => {
      if (config.title) {
        updatePageTitle(config.pageId, config.title, config.userRole);
      }
    }, [config.title]);

    // Get the current title for this page and user role
    const pageTitle = config.title || getPageTitle(config.pageId, config.userRole);

    // Add page title to props if the component accepts it
    const enhancedProps = {
      ...props,
      pageTitle,
      pageId: config.pageId,
      userRole: config.userRole
    } as P;

    return <WrappedComponent {...enhancedProps} />;
  };
}

/**
 * Hook for components that need to dynamically update their page title
 */
export function usePageTitle(pageId: string, userRole: UserRole, customTitle?: string) {
  const [title, setTitle] = React.useState(() => {
    return customTitle || getPageTitle(pageId, userRole);
  });

  const updateTitle = React.useCallback((newTitle: string) => {
    setTitle(newTitle);
    updatePageTitle(pageId, newTitle, userRole);
  }, [pageId, userRole]);

  React.useEffect(() => {
    if (customTitle) {
      updateTitle(customTitle);
    }
  }, [customTitle, updateTitle]);

  return { title, updateTitle };
}

/**
 * Context for sharing page title information across components
 */
export const PageTitleContext = React.createContext<{
  currentPageTitle: string;
  updateCurrentPageTitle: (title: string) => void;
  pageId: string;
  userRole: UserRole;
} | null>(null);

/**
 * Hook to access page title context
 */
export function usePageTitleContext() {
  const context = React.useContext(PageTitleContext);
  if (!context) {
    throw new Error('usePageTitleContext must be used within a PageTitleProvider');
  }
  return context;
}