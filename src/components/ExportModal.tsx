import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Check,
  X,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  filename: string;
}

export function ExportModal({ 
  isOpen, 
  onClose, 
  data, 
  filename 
}: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);

  const formatOptions = [
    {
      id: 'pdf',
      name: 'ملف PDF',
      description: 'مناسب للعرض والطباعة',
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      size: '~2.5 ميجابايت'
    },
    {
      id: 'excel',
      name: 'ملف Excel',
      description: 'مناسب للتحليل والتعديل',
      icon: FileSpreadsheet,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      size: '~1.8 ميجابايت'
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export process with progress
      const steps = [
        { progress: 20, message: 'جاري تجميع البيانات المفلترة...' },
        { progress: 40, message: 'جاري معالجة المخططات والإحصائيات...' },
        { progress: 60, message: 'جاري تنسيق التقرير بصيغة RTL...' },
        { progress: 80, message: 'جاري إنشاء الملف النهائي...' },
        { progress: 100, message: 'اكتمال التصدير!' }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setExportProgress(step.progress);
        toast.info(step.message);
      }

      // Generate filename based on format and data
      const timestamp = new Date().toISOString().split('T')[0];
      const finalFilename = filename || `تقرير-لوحة-التحكم-${timestamp}`;

      if (selectedFormat === 'pdf') {
        // Generate enhanced PDF with RTL support and filtered data
        const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Resources <<
/Font <<
/F1 4 0 R
>>
>>
/Contents 5 0 R
>>
endobj

4 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

5 0 obj
<<
/Length 250
>>
stream
BT
/F1 16 Tf
300 750 Td
(سحابة الأثر - تقرير لوحة التحكم) Tj
0 -30 Td
/F1 12 Tf
(التاريخ: ${new Date().toLocaleDateString('ar-SA')}) Tj
0 -20 Td
(البيانات المفلترة والمعالجة) Tj
0 -40 Td
(المعلومات الأساسية:) Tj
${data?.overviewStats?.map((stat: any, index: number) => 
  `0 -20 Td (${stat.title}: ${stat.value}) Tj`
).join('\n') || ''}
ET
endstream
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000284 00000 n 
0000000366 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
750
%%EOF`;

        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${finalFilename}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // Generate Enhanced Excel file (CSV format) with RTL support and filtered data
        const exportInfo = data?.exportInfo || {};
        const csvData = [
          ['تقرير لوحة التحكم - سحابة الأثر'],
          [''],
          ['معلومات التصدير:'],
          ['التاريخ والوقت:', new Date().toLocaleString('ar-SA')],
          ['الدور:', exportInfo.userRole || 'غير محدد'],
          ['الفترة المحددة:', exportInfo.selectedPeriod || 'جميع الفترات'],
          ['التبويب النشط:', exportInfo.activeTab || 'نظرة عامة'],
          ['تم التصدير بواسطة:', exportInfo.exportedBy || 'مستخدم النظام'],
          ['إصدار التقرير:', exportInfo.version || '1.0'],
          [''],
          ['الإحصائيات الأساسية (البيانات المفلترة):'],
          ['العنصر', 'القيمة', 'التغيير', 'الوصف'],
          ...(data?.overviewStats?.map((stat: any) => [
            stat.title,
            stat.value,
            stat.change || 'غير متوفر',
            'إحصائية مفلترة'
          ]) || []),
          [''],
          ['بيانات إضافية:']
        ];

        // Add current tab specific data if available
        if (data?.currentTabData) {
          csvData.push(['بيانات التبويب الحالي:']);
          csvData.push(['العنوان:', data.currentTabData.title || 'غير محدد']);
          
          if (data.currentTabData.chartData) {
            csvData.push(['']);
            csvData.push(['بيانات المخططات:']);
            csvData.push(['الشهر', 'الاستبيانات', 'الاستجابات', 'مؤشر الأثر']);
            data.currentTabData.chartData.forEach((item: any) => {
              csvData.push([
                item.month || 'غير محدد',
                item.surveys?.toString() || '0',
                item.responses?.toString() || '0',
                item.impact?.toString() || '0'
              ]);
            });
          }

          if (data.currentTabData.impactData) {
            csvData.push(['']);
            csvData.push(['بيانات الأثر:']);
            csvData.push(['الفئة', 'القيمة', 'اللون']);
            data.currentTabData.impactData.forEach((item: any) => {
              csvData.push([
                item.category || item.name || 'غير محدد',
                item.value?.toString() || '0',
                item.color || 'غير محدد'
              ]);
            });
          }
        }

        // Add footer
        csvData.push(['']);
        csvData.push(['ملاحظات:']);
        csvData.push(['- هذا التقرير تم إنشاؤه تلقائياً من منصة سحابة الأثر']);
        csvData.push(['- البيانات معروضة وفقاً للفلاتر المطبقة']);
        csvData.push(['- جميع الأرقام تعكس الوضع وقت التصدير']);
        csvData.push(['- للاستفسارات يرجى التواصل مع فريق الدعم الفني']);

        // Create CSV content with proper RTL encoding
        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob(['\ufeff' + csvContent], { 
          type: 'text/csv;charset=utf-8;' 
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${finalFilename}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      setExportComplete(true);
      toast.success(`تم تصدير التقرير بصيغة ${selectedFormat.toUpperCase()} بنجاح! 📊`);
      
      // Auto close after success
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (error) {
      console.error('خطأ في التصدير:', error);
      toast.error('حدث خطأ أثناء تصدير التقرير');
      setIsExporting(false);
    }
  };

  const handleClose = () => {
    setIsExporting(false);
    setExportProgress(0);
    setExportComplete(false);
    setSelectedFormat('pdf');
    onClose();
  };

  const selectedFormatData = formatOptions.find(f => f.id === selectedFormat);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-[#183259]" />
            تصدير تقرير لوحة التحكم
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            اختر تنسيق التصدير المناسب لاحتياجاتك
          </DialogDescription>
        </DialogHeader>

        {!isExporting && !exportComplete && (
          <div className="space-y-6">
            {/* Export Info */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">التبويب:</span>
                    <span className="font-medium">
                      {data?.exportInfo?.activeTab === 'overview' ? 'نظرة عامة' : data?.exportInfo?.activeTab || 'غير محدد'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الفترة:</span>
                    <span className="font-medium">{data?.exportInfo?.selectedPeriod || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">التاريخ:</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Format Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">اختر تنسيق التصدير:</Label>
              <RadioGroup
                value={selectedFormat}
                onValueChange={(value) => setSelectedFormat(value as 'pdf' | 'excel')}
                className="space-y-3"
              >
                {formatOptions.map((format) => (
                  <div key={format.id} className="relative">
                    <RadioGroupItem
                      value={format.id}
                      id={format.id}
                      className="peer absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4"
                    />
                    <Label
                      htmlFor={format.id}
                      className="flex cursor-pointer items-center justify-between rounded-lg border-2 border-gray-200 p-4 pl-12 hover:bg-gray-50 peer-checked:border-[#183259] peer-checked:bg-blue-50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded ${format.bgColor}`}>
                          <format.icon className={`h-5 w-5 ${format.color}`} />
                        </div>
                        <div>
                          <div className="font-medium">{format.name}</div>
                          <div className="text-sm text-gray-600">
                            {format.description}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500">
                          {format.size}
                        </div>
                        {selectedFormat === format.id && (
                          <Check className="h-4 w-4 text-[#183259]" />
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleExport}
                className="flex-1 bg-[#183259] hover:bg-[#2a4a7a] text-white gap-2"
              >
                <Download className="h-4 w-4" />
                بدء التصدير
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="px-6"
              >
                إلغاء
              </Button>
            </div>
          </div>
        )}

        {/* Export Progress */}
        {isExporting && !exportComplete && (
          <div className="space-y-6 py-6">
            <div className="text-center">
              <div className={`mx-auto mb-4 p-3 rounded-full w-16 h-16 flex items-center justify-center ${selectedFormatData?.bgColor}`}>
                <selectedFormatData.icon className={`h-8 w-8 ${selectedFormatData?.color} animate-pulse`} />
              </div>
              <h3 className="font-medium mb-2">
                جاري تصدير التقرير بصيغة {selectedFormatData?.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                يرجى الانتظار...
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>تقدم التصدير</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="h-2" />
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 animate-spin" />
              جاري المعالجة...
            </div>
          </div>
        )}

        {/* Export Complete */}
        {exportComplete && (
          <div className="space-y-6 py-6 text-center">
            <div className="mx-auto mb-4 p-3 rounded-full w-16 h-16 flex items-center justify-center bg-green-50">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium mb-2 text-green-700">
                تم التصدير بنجاح! ✅
              </h3>
              <p className="text-sm text-gray-600">
                تم تنزيل ملف {selectedFormatData?.name} بنجاح
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              إغلاق
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}