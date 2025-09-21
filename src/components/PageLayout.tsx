import React from 'react';

interface PageLayoutProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({ title, description, icon, headerContent, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50" dir="rtl">
      {/* Top Section - Enhanced Blue Header */}
      <div className="bg-gradient-to-r from-[#183259] via-[#1e3863] to-[#2a4a7a] text-white relative overflow-hidden">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="container mx-auto px-8 py-16 max-w-7xl relative z-10">
          <div className="flex items-center gap-4 mb-6">
            {icon && (
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg">
                <div className="text-white">{icon}</div>
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {title}
              </h1>
              {description && (
                <p className="text-blue-100/90 mt-2 text-lg font-medium">
                  {description}
                </p>
              )}
            </div>
          </div>
          
          {headerContent && (
            <div className="mt-8 p-6 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10 shadow-xl">
              {headerContent}
            </div>
          )}
        </div>
        
        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-8 text-white fill-current">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Bottom Section - Enhanced White Content */}
      <div className="bg-white/95 backdrop-blur-sm min-h-[calc(100vh-300px)] relative -mt-8 rounded-t-3xl shadow-2xl border-t border-gray-100">
        <div className="container mx-auto px-8 py-10 max-w-7xl">
          {children}
        </div>
      </div>
    </div>
  );
}