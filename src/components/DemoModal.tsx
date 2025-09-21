import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Play,
  X,
  BarChart3,
  Users,
  Target,
  PieChart,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDemo: () => void;
}

export function DemoModal({ isOpen, onClose, onStartDemo }: DemoModalProps) {
  const demoFeatures = [
    {
      icon: BarChart3,
      title: 'لوحة التحكم التفاعلية',
      description: 'تصفح لوحة التحكم الرئيسية مع المؤشرات والإحصائيات المباشرة'
    },
    {
      icon: FileText,
      title: 'إنشاء استبيان ذكي',
      description: 'جرب معالج إنشاء الاستبيانات مع الذكاء الاصطناعي'
    },
    {
      icon: PieChart,
      title: 'تحليلات متقدمة',
      description: 'استكشف التحليلات والرؤى الذكية لقياس الأثر'
    },
    {
      icon: Users,
      title: 'إدارة المستفيدين',
      description: 'تعرف على كيفية إدارة وتتبع بيانات المستفيدين'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl" dir="rtl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-[#183259] rounded-lg flex items-center justify-center">
                <Play className="h-5 w-5 text-white" />
              </div>
              العرض التوضيحي التفاعلي
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="sr-only">
            عرض توضيحي تفاعلي لاستكشاف جميع مميزات منصة أثرنا لقياس الأثر الاجتماعي
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hero Section */}
          <div className="text-center bg-gradient-to-r from-[#183259]/10 to-[#2a4a7a]/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#183259] mb-3">
              اكتشف قوة منصة أثرنا
            </h2>
            <p className="text-gray-600 mb-4">
              جولة تفاعلية تستغرق 5 دقائق لاستكشاف جميع مميزات المنصة
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>5 دقائق</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>تجربة كاملة</span>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-2 gap-4">
            {demoFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#183259]/30 transition-colors"
              >
                <div className="w-10 h-10 bg-[#183259]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-[#183259]" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Demo Video Placeholder */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#183259] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8 text-white mr-1" />
                </div>
                <h3 className="font-medium text-gray-700 mb-2">عرض توضيحي تفاعلي</h3>
                <p className="text-sm text-gray-500">
                  انقر على "بدء العرض" لتجربة المنصة بالكامل
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <Button 
              onClick={onStartDemo}
              className="flex-1 bg-[#183259] hover:bg-[#2a4a7a] text-lg py-3"
            >
              <Play className="w-5 h-5 ml-2" />
              بدء العرض التفاعلي
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 border-gray-300 text-lg py-3"
            >
              إغلاق
            </Button>
          </div>

          {/* Benefits */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-[#183259] mb-2">
              ماذا ستتعلم في هذا العرض؟
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>كيفية إنشاء استبيان احترافي في دقائق</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>استخدام الذكاء الاصطناعي لتحليل النتائج</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>إنشاء تقارير تأثير احترافية</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>إدارة المستفيدين وتتبع البيانات</span>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}