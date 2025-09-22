import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import {
  Share2,
  Link,
  QrCode,
  Mail,
  MessageSquare,
  Users,
  Copy,
  Download,
  Settings,
  Globe,
  Calendar,
  TrendingUp,
  Share,
  BarChart3,
  Facebook,
  Twitter,
  Linkedin,
  FileDown,
  ArrowRight,
  ChevronRight,
  Send
} from 'lucide-react';
import { Survey } from '../App';
import { toast } from 'sonner';
import { EnhancedPageLayout } from './EnhancedPageLayout';

// Simple QR Code component
const SimpleQRCode = ({ value, size = 200, className = '' }: { value: string; size?: number; className?: string }) => {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;
  return (
    <img 
      src={qrCodeUrl} 
      alt="QR Code"
      width={size}
      height={size}
      className={className}
    />
  );
};

interface SurveySharePageProps {
  survey: Survey;
  onBackToSurveys: () => void;
}

interface Beneficiary {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  group?: string;
  status: 'active' | 'invited' | 'completed';
}

// Mock beneficiaries data
const mockBeneficiaries: Beneficiary[] = [
  { id: '1', name: 'أحمد محمد السالم', email: 'ahmed@example.com', phone: '+966501234567', group: 'الشباب', status: 'active' },
  { id: '2', name: 'فاطمة عبد الله', email: 'fatima@example.com', phone: '+966507654321', group: 'النساء', status: 'invited' },
  { id: '3', name: 'محمد عبد الرحمن', email: 'mohammed@example.com', phone: '+966509876543', group: 'كبار السن', status: 'completed' },
  { id: '4', name: 'خديجة أحمد', email: 'khadija@example.com', phone: '+966502468135', group: 'النساء', status: 'active' },
  { id: '5', name: 'عبد الله محمد', email: 'abdullah@example.com', phone: '+966508642097', group: 'الشباب', status: 'invited' },
  { id: '6', name: 'مريم سالم', email: 'mariam@example.com', phone: '+966501357924', group: 'النساء', status: 'active' },
  { id: '7', name: 'سالم أحمد الحربي', email: 'salem@example.com', phone: '+966503456789', group: 'الشباب', status: 'active' },
  { id: '8', name: 'نورا محمد العتيبي', email: 'nora@example.com', phone: '+966504567890', group: 'النساء', status: 'invited' },
  { id: '9', name: 'عبد الرحمن سعد', email: 'abdulrahman@example.com', phone: '+966505678901', group: 'كبار السن', status: 'completed' },
  { id: '10', name: 'هند عبد الله', email: 'hind@example.com', phone: '+966506789012', group: 'النساء', status: 'active' }
];

export function SurveySharePage({ survey, onBackToSurveys }: SurveySharePageProps) {
  const [selectedShareType, setSelectedShareType] = useState<string>('bulk-share');
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [beneficiaries] = useState<Beneficiary[]>(mockBeneficiaries);

  const surveyUrl = `https://atharonaa.com/survey/${survey.id}`;

  const filteredBeneficiaries = beneficiaries.filter(beneficiary => {
    return true; // For now, show all beneficiaries
  });

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedBeneficiaries(filteredBeneficiaries.map(b => b.id));
    } else {
      setSelectedBeneficiaries([]);
    }
  };

  const handleBeneficiarySelect = (beneficiaryId: string, checked: boolean) => {
    if (checked) {
      setSelectedBeneficiaries(prev => [...prev, beneficiaryId]);
    } else {
      setSelectedBeneficiaries(prev => prev.filter(id => id !== beneficiaryId));
      setSelectAll(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const selectedCount = selectedBeneficiaries.length;
      toast.success(`تم إرسال الاستبيان إلى ${selectedCount} مستفيد بنجاح!`);
    } catch (error) {
      toast.error('حدث خطأ في إرسال الاستبيان');
    } finally {
      setIsSharing(false);
    }
  };

  const handleSocialShare = (platform: string) => {
    const shareText = `شارك في استبيان: ${survey.title}`;
    const shareUrl = surveyUrl;
    
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
      toast.success(`تم فتح نافذة المشاركة في ${platform}`);
    }
  };

  // Function to download QR code
  const handleDownloadQR = async (url: string, filename: string) => {
    try {
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
      
      // Create a temporary link to download the image
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `${filename}.png`;
      link.target = '_blank';
      
      // Create a canvas to convert the image to downloadable format
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success(`تم تحميل رمز QR لـ ${filename} بنجاح!`);
          }
        }, 'image/png');
      };
      
      img.onerror = () => {
        // Fallback: open the QR code in a new tab
        window.open(qrCodeUrl, '_blank');
        toast.success(`تم فتح رمز QR لـ ${filename} في نافذة جديدة!`);
      };
      
      img.src = qrCodeUrl;
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('حدث خطأ في تحميل رمز QR');
    }
  };

  // Function to show QR code in a modal-like overlay
  const handleShowQR = (url: string, type: string) => {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}`;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(4px);
    `;
    
    // Create content container
    const container = document.createElement('div');
    container.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      text-align: center;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      max-width: 90vw;
      max-height: 90vh;
    `;
    
    // Create title
    const title = document.createElement('h3');
    title.textContent = `رمز QR للاستبيان ${type}`;
    title.style.cssText = `
      margin-bottom: 1rem;
      color: #183259;
      direction: rtl;
      text-align: center;
    `;
    
    // Create QR image
    const img = document.createElement('img');
    img.src = qrCodeUrl;
    img.alt = 'QR Code';
    img.style.cssText = `
      width: 300px;
      height: 300px;
      margin: 1rem auto;
      display: block;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
    `;
    
    // Create buttons container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      margin-top: 1.5rem;
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    `;
    
    // Create download button
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'تحميل';
    downloadBtn.style.cssText = `
      background: #183259;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    `;
    downloadBtn.onmouseover = () => downloadBtn.style.background = '#2a4a7a';
    downloadBtn.onmouseout = () => downloadBtn.style.background = '#183259';
    downloadBtn.onclick = () => {
      handleDownloadQR(url, `استبيان-${type}`);
      document.body.removeChild(overlay);
    };
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'إغلاق';
    closeBtn.style.cssText = `
      background: #6b7280;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    `;
    closeBtn.onmouseover = () => closeBtn.style.background = '#4b5563';
    closeBtn.onmouseout = () => closeBtn.style.background = '#6b7280';
    closeBtn.onclick = () => document.body.removeChild(overlay);
    
    // Assemble the modal
    buttonContainer.appendChild(downloadBtn);
    buttonContainer.appendChild(closeBtn);
    container.appendChild(title);
    container.appendChild(img);
    container.appendChild(buttonContainer);
    overlay.appendChild(container);
    
    // Close on overlay click
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    };
    
    // Add to DOM
    document.body.appendChild(overlay);
    
    toast.success(`تم عرض رمز QR للاستبيان ${type}`);
  };

  // Header content for EnhancedPageLayout
  const headerContent = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <FileDown className="h-6 w-6 text-white" />
          <div>
            <div className="text-white">استبيان: {survey.title}</div>
            <div className="text-blue-200">المنظمة: {survey.organization}</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-white" />
          <div>
            <div className="text-white">{mockBeneficiaries.length} مستفيد</div>
            <div className="text-blue-200">مسجل في النظام</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Globe className="h-6 w-6 text-white" />
          <div>
            <div className="text-white">رابط المشاركة</div>
            <div className="text-blue-200">جاهز للاستخدام</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <EnhancedPageLayout
      title="مشاركة الاستبيان"
      description="مشاركة الاستبيان مع المستفيدين وتوزيع الروابط"
      icon={<Share2 className="h-8 w-8" />}
      headerContent={headerContent}
    >
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={onBackToSurveys}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            العودة إلى الاستبيانات
          </Button>
        </div>

        {/* Survey Type Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Pre-Survey Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3>الاستبيان القبلي</h3>
                  <p className="text-muted-foreground mt-1">قياس ما قبل التدخل</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Survey URL */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  رابط الاستبيان القبلي
                </Label>
                <div className="flex gap-2">
                  <Input 
                    value={`${surveyUrl}/pre`} 
                    readOnly 
                    className="flex-1 font-mono"
                  />
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${surveyUrl}/pre`);
                      toast.success('تم نسخ رابط الاستبيان القبلي!');
                    }}
                    size="sm"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Sharing Options */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Share className="h-4 w-4" />
                  خيارات المشاركة
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    onClick={() => {
                      const message = `شارك في الاستبيان القبلي: ${survey.title}\n${surveyUrl}/pre`;
                      window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
                      toast.success('تم فتح تطبيق الرسائل!');
                    }}
                    variant="outline" 
                    className="flex flex-col items-center gap-2 h-20"
                  >
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    <span>رسائل SMS</span>
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      const subject = encodeURIComponent(`دعوة للمشاركة في الاستبيان القبلي: ${survey.title}`);
                      const body = encodeURIComponent(`السلام عليكم ورحمة الله وبركاته،\n\nندعوكم للمشاركة في الاستبيان القبلي "${survey.title}".\n\nالرابط: ${surveyUrl}/pre\n\nشكراً لكم`);
                      window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
                      toast.success('تم فتح تطبيق البريد الإلكتروني!');
                    }}
                    variant="outline" 
                    className="flex flex-col items-center gap-2 h-20"
                  >
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span>البريد الإلكتروني</span>
                  </Button>
                  
                  <Button 
                    onClick={() => handleShowQR(`${surveyUrl}/pre`, 'القبلي')}
                    variant="outline" 
                    className="flex flex-col items-center gap-2 h-20"
                  >
                    <QrCode className="h-5 w-5 text-purple-600" />
                    <span>رمز QR</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Post-Survey Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3>الاستبيان البعدي</h3>
                  <p className="text-muted-foreground mt-1">قياس ما بعد التدخل</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Survey URL */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  رابط الاستبيان البعدي
                </Label>
                <div className="flex gap-2">
                  <Input 
                    value={`${surveyUrl}/post`} 
                    readOnly 
                    className="flex-1 font-mono"
                  />
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${surveyUrl}/post`);
                      toast.success('تم نسخ رابط الاستبيان البعدي!');
                    }}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Sharing Options */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Share className="h-4 w-4" />
                  خيارات المشاركة
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    onClick={() => {
                      const message = `شارك في الاستبيان البعدي: ${survey.title}\n${surveyUrl}/post`;
                      window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
                      toast.success('تم فتح تطبيق الرسائل!');
                    }}
                    variant="outline" 
                    className="flex flex-col items-center gap-2 h-20"
                  >
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    <span>رسائل SMS</span>
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      const subject = encodeURIComponent(`دعوة للمشاركة في الاستبيان البعدي: ${survey.title}`);
                      const body = encodeURIComponent(`السلام عليكم ورحمة الله وبركاته,\n\nندعوكم للمشاركة في الاستبيان البعدي "${survey.title}".\n\nالرابط: ${surveyUrl}/post\n\nشكراً لكم`);
                      window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
                      toast.success('تم فتح تطبيق البريد الإلكتروني!');
                    }}
                    variant="outline" 
                    className="flex flex-col items-center gap-2 h-20"
                  >
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span>البريد الإلكتروني</span>
                  </Button>
                  
                  <Button 
                    onClick={() => handleShowQR(`${surveyUrl}/post`, 'البعدي')}
                    variant="outline" 
                    className="flex flex-col items-center gap-2 h-20"
                  >
                    <QrCode className="h-5 w-5 text-purple-600" />
                    <span>رمز QR</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Sharing Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              خيارات مشاركة متقدمة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedShareType} onValueChange={setSelectedShareType} className="w-full">
              {/* Share Type Tabs */}
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="bulk-share" className="flex flex-col items-center gap-2 py-4">
                  <Users className="h-5 w-5" />
                  <span>إرسال جماعي</span>
                </TabsTrigger>
                <TabsTrigger value="qr-advanced" className="flex flex-col items-center gap-2 py-4">
                  <QrCode className="h-5 w-5" />
                  <span>رموز QR متقدمة</span>
                </TabsTrigger>
                <TabsTrigger value="social" className="flex flex-col items-center gap-2 py-4">
                  <Share className="h-5 w-5" />
                  <span>وسائل التواصل</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex flex-col items-center gap-2 py-4">
                  <BarChart3 className="h-5 w-5" />
                  <span>التحليلات</span>
                </TabsTrigger>
              </TabsList>

              {/* Bulk Share Tab */}
              <TabsContent value="bulk-share" className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    إرسال جماعي للمستفيدين
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    اختر المستفيدين الذين تريد إرسال الاستبيان إليهم
                  </p>

                  {/* Select All Checkbox */}
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg border mb-4">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label>تحديد الكل ({filteredBeneficiaries.length} مستفيد)</Label>
                  </div>

                  {/* Beneficiaries List */}
                  <div className="max-h-64 overflow-y-auto space-y-2 mb-6">
                    {filteredBeneficiaries.map((beneficiary) => (
                      <div key={beneficiary.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:bg-gray-50">
                        <Checkbox
                          checked={selectedBeneficiaries.includes(beneficiary.id)}
                          onCheckedChange={(checked) => handleBeneficiarySelect(beneficiary.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span>{beneficiary.name}</span>
                            <Badge variant={beneficiary.status === 'active' ? 'default' : beneficiary.status === 'invited' ? 'secondary' : 'outline'}>
                              {beneficiary.status === 'active' ? 'نشط' : beneficiary.status === 'invited' ? 'مدعو' : 'مكتمل'}
                            </Badge>
                          </div>
                          <div className="text-muted-foreground">
                            {beneficiary.email} | {beneficiary.phone} | {beneficiary.group}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Custom Message */}
                  <div className="space-y-2 mb-6">
                    <Label>رسالة مخصصة (اختيارية)</Label>
                    <Textarea
                      placeholder="أضف رسالة مخصصة للمستفيدين..."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      rows={4}
                    />
                  </div>

                  {/* Send Button */}
                  <Button 
                    onClick={handleShare}
                    disabled={selectedBeneficiaries.length === 0 || isSharing}
                    className="w-full"
                  >
                    {isSharing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        جاري الإرسال...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        إرسال إلى {selectedBeneficiaries.length} مستفيد
                      </div>
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* QR Advanced Tab */}
              <TabsContent value="qr-advanced" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>رمز QR للاستبيان القبلي</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                      <SimpleQRCode value={`${surveyUrl}/pre`} size={150} className="border rounded-lg" />
                      <div className="flex gap-2">
                        <Button onClick={() => handleDownloadQR(`${surveyUrl}/pre`, 'استبيان-قبلي')} size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          تحميل
                        </Button>
                        <Button onClick={() => handleShowQR(`${surveyUrl}/pre`, 'القبلي')} variant="outline" size="sm">
                          <QrCode className="h-4 w-4 mr-2" />
                          عرض
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>رمز QR للاستبيان البعدي</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                      <SimpleQRCode value={`${surveyUrl}/post`} size={150} className="border rounded-lg" />
                      <div className="flex gap-2">
                        <Button onClick={() => handleDownloadQR(`${surveyUrl}/post`, 'استبيان-بعدي')} size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          تحميل
                        </Button>
                        <Button onClick={() => handleShowQR(`${surveyUrl}/post`, 'البعدي')} variant="outline" size="sm">
                          <QrCode className="h-4 w-4 mr-2" />
                          عرض
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Social Media Tab */}
              <TabsContent value="social" className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="mb-4 flex items-center gap-2">
                    <Share className="h-5 w-5 text-primary" />
                    مشاركة عبر وسائل التواصل الاجتماعي
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button 
                      onClick={() => handleSocialShare('facebook')}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-20"
                    >
                      <Facebook className="h-6 w-6 text-blue-600" />
                      <span>Facebook</span>
                    </Button>
                    <Button 
                      onClick={() => handleSocialShare('twitter')}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-20"
                    >
                      <Twitter className="h-6 w-6 text-blue-400" />
                      <span>Twitter</span>
                    </Button>
                    <Button 
                      onClick={() => handleSocialShare('linkedin')}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-20"
                    >
                      <Linkedin className="h-6 w-6 text-blue-700" />
                      <span>LinkedIn</span>
                    </Button>
                    <Button 
                      onClick={() => handleSocialShare('whatsapp')}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-20"
                    >
                      <MessageSquare className="h-6 w-6 text-green-600" />
                      <span>WhatsApp</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                  <h3 className="mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    إحصائيات المشاركة
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-primary">0</div>
                      <div className="text-sm text-muted-foreground">مشاركات اليوم</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-primary">0</div>
                      <div className="text-sm text-muted-foreground">مشاهدات الرابط</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-primary">0%</div>
                      <div className="text-sm text-muted-foreground">معدل الاستجابة</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-4">
                    ستظهر الإحصائيات هنا بعد بدء مشاركة الاستبيان
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </EnhancedPageLayout>
  );
}