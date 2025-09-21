import React, { useEffect } from 'react';
import faviconImage from 'figma:asset/bcfb3ac223cb5c10fbb046ae0116bc26c75e7dee.png';

export function FaviconUpdater() {
  useEffect(() => {
    // إنشاء أو تحديث عنصر الفافيكون
    const updateFavicon = () => {
      // البحث عن فافيكون موجود
      let existingFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      
      if (!existingFavicon) {
        // إنشاء عنصر فافيكون جديد إذا لم يكن موجوداً
        existingFavicon = document.createElement('link');
        existingFavicon.rel = 'icon';
        document.head.appendChild(existingFavicon);
      }
      
      // تحديث الفافيكون
      existingFavicon.href = faviconImage;
      existingFavicon.type = 'image/png';
      
      // إضافة فافيكون للأيقونات المختلفة الأحجام
      const sizes = ['16x16', '32x32', '96x96'];
      
      sizes.forEach(size => {
        let sizedFavicon = document.querySelector(`link[rel="icon"][sizes="${size}"]`) as HTMLLinkElement;
        
        if (!sizedFavicon) {
          sizedFavicon = document.createElement('link');
          sizedFavicon.rel = 'icon';
          sizedFavicon.sizes = size;
          document.head.appendChild(sizedFavicon);
        }
        
        sizedFavicon.href = faviconImage;
        sizedFavicon.type = 'image/png';
      });
      
      // إضافة فافيكون Apple Touch Icon للأجهزة المحمولة
      let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
      
      if (!appleTouchIcon) {
        appleTouchIcon = document.createElement('link');
        appleTouchIcon.rel = 'apple-touch-icon';
        document.head.appendChild(appleTouchIcon);
      }
      
      appleTouchIcon.href = faviconImage;
      appleTouchIcon.sizes = '180x180';
      
      // تحديث عنوان الصفحة
      document.title = 'سحابة الأثر - منصة قياس الأثر الاجتماعي';
      
      // إضافة meta description
      let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      
      metaDescription.content = 'منصة سحابة الأثر - منصة شاملة لقياس وتحليل الأثر الاجتماعي للمنظمات والمؤسسات';
      
      // إضافة meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
      
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
      }
      
      metaKeywords.content = 'قياس الأثر الاجتماعي, استطلاعات, تحليلات, أثرنا, منظمات غير ربحية';
      
      // إضافة Open Graph meta tags للشبكات الاجتماعية
      const ogTags = [
        { property: 'og:title', content: 'سحابة الأثر - منصة قياس الأثر الاجتماعي' },
        { property: 'og:description', content: 'منصة شاملة لقياس وتحليل الأثر الاجتماعي للمنظمات والمؤسسات' },
        { property: 'og:image', content: faviconImage },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'ar_SA' }
      ];
      
      ogTags.forEach(tag => {
        let existingTag = document.querySelector(`meta[property="${tag.property}"]`) as HTMLMetaElement;
        
        if (!existingTag) {
          existingTag = document.createElement('meta');
          existingTag.setAttribute('property', tag.property);
          document.head.appendChild(existingTag);
        }
        
        existingTag.content = tag.content;
      });
      
      // إضافة Twitter Card meta tags
      const twitterTags = [
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'سحابة الأثر - منصة قياس الأثر الاجتماعي' },
        { name: 'twitter:description', content: 'منصة شاملة لقياس وتحليل الأثر الاجتماعي للمنظمات والمؤسسات' },
        { name: 'twitter:image', content: faviconImage }
      ];
      
      twitterTags.forEach(tag => {
        let existingTag = document.querySelector(`meta[name="${tag.name}"]`) as HTMLMetaElement;
        
        if (!existingTag) {
          existingTag = document.createElement('meta');
          existingTag.name = tag.name;
          document.head.appendChild(existingTag);
        }
        
        existingTag.content = tag.content;
      });
    };
    
    // تطبيق التحديثات عند تحميل المكون
    updateFavicon();
    
    // تنظيف العملية عند إلغاء تحميل المكون
    return () => {
      // لا نحتاج لتنظيف خاص هنا
    };
  }, []);
  
  // هذا المكون لا يرجع أي عنصر مرئي
  return null;
}