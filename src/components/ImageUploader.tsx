import React, { useRef } from 'react';
import { Button } from './ui/button';
import { Upload, ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  placeholder?: string;
  className?: string;
  acceptedFormats?: string[];
  maxSizeInMB?: number;
  showPreview?: boolean;
  variant?: 'button' | 'card' | 'inline';
  buttonText?: string;
}

export function ImageUploader({
  onImageUpload,
  currentImage,
  placeholder = 'اختر صورة',
  className = '',
  acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSizeInMB = 5,
  showPreview = true,
  variant = 'button',
  buttonText
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptedFormats.join(',');
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Check file size
        if (file.size > maxSizeInMB * 1024 * 1024) {
          toast.error(`حجم الملف كبير جداً. يرجى اختيار صورة أصغر من ${maxSizeInMB} ميجابايت`);
          return;
        }
        
        // Check file type
        if (!acceptedFormats.includes(file.type)) {
          const formats = acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ');
          toast.error(`يرجى اختيار ملف صورة صالح (${formats})`);
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          onImageUpload(imageUrl);
          toast.success('تم تحميل الصورة بنجاح!');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleRemoveImage = () => {
    onImageUpload('');
    toast.success('تم حذف الصورة');
  };

  if (variant === 'card') {
    return (
      <div className={`relative group mb-8 ${className}`}>
        <div className="relative h-72 rounded-xl overflow-hidden bg-gray-100 border-2 transition-all duration-300 shadow-lg border-gray-200 hover:border-gray-300">
          {currentImage ? (
            <>
              <img
                src={currentImage}
                alt="صورة مختارة"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute top-2 right-2">
                <Button
                  onClick={handleRemoveImage}
                  size="sm"
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">{placeholder}</p>
              </div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
            <Button
              onClick={handleImageUpload}
              className="bg-white/95 text-[#183259] hover:bg-white hover:text-[#183259] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl transform group-hover:scale-110 flex items-center gap-3"
            >
              <Upload className="h-5 w-5" />
              <span className="font-bold">
                {currentImage ? 'تغيير الصورة' : 'اختيار صورة'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Button 
          variant="outline" 
          onClick={handleImageUpload} 
          className="flex-1"
        >
          <Upload className="h-4 w-4 mr-2" />
          {buttonText || (currentImage ? 'تغيير الصورة' : placeholder)}
        </Button>
        {showPreview && currentImage && (
          <div className="w-12 h-12 border rounded-lg overflow-hidden relative">
            <img 
              src={currentImage} 
              alt="صورة مختارة" 
              className="w-full h-full object-cover"
            />
            <Button
              onClick={handleRemoveImage}
              size="sm"
              variant="destructive"
              className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Default button variant
  return (
    <div className={`space-y-3 ${className}`}>
      <Button 
        variant="outline" 
        onClick={handleImageUpload}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        {buttonText || (currentImage ? 'تغيير الصورة' : placeholder)}
      </Button>
      
      {showPreview && currentImage && (
        <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
          <img 
            src={currentImage} 
            alt="صورة مختارة" 
            className="w-full h-full object-cover"
          />
          <Button
            onClick={handleRemoveImage}
            size="sm"
            variant="destructive"
            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <p className="text-sm text-gray-600">
        الصيغ المدعومة: {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} | 
        الحد الأقصى: {maxSizeInMB} ميجابايت
      </p>
    </div>
  );
}