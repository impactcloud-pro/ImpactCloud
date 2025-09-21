import React from 'react';
import darkLogoImage from 'figma:asset/3034c00e736f237a3d7e9bab7703d114083b9f8f.png';
import lightLogoImage from 'figma:asset/a777bdbaed926f2595e70e6278f158819e8ea147.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'light' | 'dark';
  onClick?: () => void;
  className?: string;
  showText?: boolean;
}

export function Logo({ 
  size = 'md', 
  variant = 'default', 
  onClick,
  className = '',
  showText = true 
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-12',
    md: 'h-16',
    lg: 'h-20',
    xl: 'h-24'
  };

  const getLogoImage = () => {
    switch (variant) {
      case 'light':
        return lightLogoImage; // استخدام اللوجو الفاتح للخلفيات الداكنة
      case 'dark':
        return darkLogoImage; // استخدام اللوجو الداكن الجديد للخلفيات الفاتحة
      default:
        return darkLogoImage; // الافتراضي هو اللوجو الداكن الجديد
    }
  };

  return (
    <div 
      className={`flex items-center ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity duration-200' : ''} ${className}`}
      onClick={onClick}
    >
      <img 
        src={getLogoImage()} 
        alt="سحابة الأثر" 
        style={{ display: "block", margin: "0 auto" }}
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
    </div>
  );
}