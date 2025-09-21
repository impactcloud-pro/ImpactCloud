import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import {
  Share2,
  Link,
  QrCode,
  Mail,
  MessageSquare,
  Users,
  Copy,
  Download,
  Send,
  Settings,
  Clock,
  User,
  Phone,
  X,
  CheckCircle,
  Globe,
  Calendar,
  Check,
  AlertCircle,
  Plus,
  UserPlus,
  Eye,
  BarChart3,
  Facebook,
  Twitter,
  Linkedin,
  Zap,
  ExternalLink,
  Filter,
  Search,
  FileDown,
  History,
  TrendingUp,
  Share
} from 'lucide-react';
import { Survey } from '../../App';
import { toast } from 'sonner@2.0.3';

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

interface SurveyShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  survey: Survey;
}

interface Beneficiary {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  group?: string;
  status: 'active' | 'invited' | 'completed';
}

interface NewBeneficiaryData {
  name: string;
  email: string;
  phone: string;
  group: string;
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

export function SurveyShareDialog({ isOpen, onClose, survey }: SurveyShareDialogProps) {
  const [selectedShareType, setSelectedShareType] = useState<string>('bulk-share');
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [customMessage, setCustomMessage] = useState('');
  const [shareSettings, setShareSettings] = useState({
    allowAnonymous: true,
    requireLogin: false,
    setExpiry: false,
    expiryDate: '',
    limitResponses: false,
    maxResponses: 100,
    sendReminder: true,
    reminderDays: 3
  });
  const [isSharing, setIsSharing] = useState(false);
  
  // State for adding new beneficiaries
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(mockBeneficiaries);
  const [showAddBeneficiary, setShowAddBeneficiary] = useState(false);
  const [newBeneficiary, setNewBeneficiary] = useState<NewBeneficiaryData>({
    name: '',
    email: '',
    phone: '',
    group: 'الشباب'
  });
  const [isAddingBeneficiary, setIsAddingBeneficiary] = useState(false);

  const surveyUrl = `https://atharonaa.com/survey/${survey.id}`;

  const filteredBeneficiaries = beneficiaries.filter(beneficiary => {
    const matchesSearch = beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (beneficiary.email && beneficiary.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesGroup = groupFilter === 'all' || beneficiary.group === groupFilter;
    return matchesSearch && matchesGroup;
  });

  const groups = [...new Set(beneficiaries.map(b => b.group))];

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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl);
      toast.success('تم نسخ الرابط بنجاح!');
    } catch (error) {
      toast.error('فشل في نسخ الرابط');
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const selectedCount = selectedBeneficiaries.length;
      toast.success(`تم إرسال الاستبيان إلى ${selectedCount} مستفيد بنجاح!`);
      onClose();
    } catch (error) {
      toast.error('حدث خطأ في إرسال الاستبيان');
    } finally {
      setIsSharing(false);
    }
  };

  const validateNewBeneficiary = (): boolean => {
    if (!newBeneficiary.name.trim()) {
      toast.error('يرجى إدخال اسم المستفيد');
      return false;
    }
    
    if (!newBeneficiary.email.trim()) {
      toast.error('يرجى إدخال البريد الإلكتروني');
      return false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newBeneficiary.email)) {
      toast.error('يرجى إدخال بريد إلكتروني صحيح');
      return false;
    }
    
    // Check if email already exists
    if (beneficiaries.some(b => b.email === newBeneficiary.email)) {
      toast.error('البريد الإلكتروني موجود مسبقاً');
      return false;
    }
    
    if (!newBeneficiary.phone.trim()) {
      toast.error('يرجى إدخال رقم الهاتف');
      return false;
    }
    
    return true;
  };

  const handleAddBeneficiary = async () => {
    if (!validateNewBeneficiary()) return;
    
    setIsAddingBeneficiary(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newBeneficiaryObj: Beneficiary = {
        id: `new_${Date.now()}`,
        name: newBeneficiary.name.trim(),
        email: newBeneficiary.email.trim(),
        phone: newBeneficiary.phone.trim(),
        group: newBeneficiary.group,
        status: 'active'
      };
      
      // Add to beneficiaries list
      setBeneficiaries(prev => [newBeneficiaryObj, ...prev]);
      
      // Auto-select the new beneficiary
      setSelectedBeneficiaries(prev => [newBeneficiaryObj.id, ...prev]);
      
      // Reset form and close
      setNewBeneficiary({
        name: '',
        email: '',
        phone: '',
        group: 'الشباب'
      });
      setShowAddBeneficiary(false);
      
      toast.success(`تم إضافة المستفيد "${newBeneficiaryObj.name}" بنجاح!`);
    } catch (error) {
      toast.error('حدث خطأ في إضافة المستفيد');
    } finally {
      setIsAddingBeneficiary(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] overflow-hidden p-0 shadow-2xl border-0 bg-gradient-to-b from-white to-gray-50/50" dir="rtl">
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Enhanced Header */}
          <div className="relative border-b bg-gradient-to-br from-[#183259] via-[#2a4a7a] to-[#4a6ba3] px-8 py-8 shrink-0 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-8 w-24 h-24 bg-white/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-4 left-8 w-20 h-20 bg-white/15 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute top-8 left-1/2 w-18 h-18 bg-white/15 rounded-full blur-2xl"></div>
              <div className="absolute bottom-8 right-1/3 w-22 h-22 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            
            <DialogHeader>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30">
                    <Share2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-3xl font-bold text-white mb-2 tracking-wide">
                      مشاركة الاستبيان
                    </DialogTitle>
                    <DialogDescription className="text-blue-100 text-lg font-semibold">
                      {survey.title}
                    </DialogDescription>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="px-5 py-2 text-sm bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/25 transition-all duration-200">
                    <Globe className="h-4 w-4 ml-2" />
                    {survey.organization}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onClose}
                    className="text-white hover:bg-white/20 hover:text-white transition-all duration-200 rounded-3xl p-3"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <div className="mt-6 relative z-10">
                <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-full px-5 py-2 border border-white/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-100 text-sm font-medium">
                    اختر نوع الاستبيان وطريقة المشاركة المناسبة
                  </span>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto bg-gradient-to-b from-gray-50/30 to-white">
            <div className="px-8 py-10">
              {/* Survey Type Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
                {/* Pre-Survey Card */}
                <Card className="shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm overflow-hidden group hover:scale-[1.02]">
                  <CardHeader className="bg-gradient-to-br from-[#183259] via-[#2a4a7a] to-[#4a6ba3] relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-3 right-6 w-16 h-16 bg-white/30 rounded-full blur-2xl"></div>
                      <div className="absolute bottom-3 left-6 w-12 h-12 bg-white/20 rounded-full blur-xl"></div>
                      <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-white/15 rounded-full blur-lg"></div>
                    </div>
                    <CardTitle className="flex items-center gap-5 text-xl text-white relative z-10">
                      <div className="p-3 bg-white/25 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 group-hover:scale-110 transition-transform duration-300">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">الاستبيان القبلي</div>
                        <div className="text-blue-100 text-sm font-normal mt-1">
                          قياس ما قبل التدخل
                        </div>
                      </div>
                    </CardTitle>
                    <p className="text-blue-100 text-sm mt-4 relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      يقيس الوضع الحالي قبل تنفيذ البرنامج أو التدخل
                    </p>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6 bg-gradient-to-b from-white to-gray-50/50">
                    {/* Survey URL */}
                    <div className="space-y-4">
                      <Label className="text-base font-bold text-[#183259] flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        رابط الاستبيان القبلي
                      </Label>
                      <div className="flex gap-3">
                        <Input 
                          value={`${surveyUrl}/pre`} 
                          readOnly 
                          className="flex-1 bg-white border-[#183259]/20 focus:border-[#183259] font-mono text-sm rounded-2xl shadow-sm h-11 px-4"
                        />
                        <Button 
                          onClick={() => {
                            navigator.clipboard.writeText(`${surveyUrl}/pre`);
                            toast.success('تم نسخ رابط الاستبيان القبلي!');
                          }}
                          size="sm"
                          className="bg-[#183259] hover:bg-[#2a4a7a] px-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 h-11"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Sharing Options */}
                    <div className="space-y-4">
                      <Label className="text-base font-bold text-[#183259] flex items-center gap-2">
                        <Share className="h-4 w-4" />
                        خيارات المشاركة
                      </Label>
                      <div className="grid grid-cols-3 gap-4">
                        <Button 
                          onClick={() => {
                            const message = `شارك في الاستبيان القبلي: ${survey.title}\n${surveyUrl}/pre`;
                            window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
                            toast.success('تم فتح تطبيق الرسائل!');
                          }}
                          variant="outline" 
                          className="flex flex-col items-center gap-2 h-20 border-2 border-[#183259]/20 hover:border-[#183259] hover:bg-[#183259]/5 rounded-2xl transition-all duration-200 group"
                        >
                          <div className="p-2 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                            <MessageSquare className="h-5 w-5 text-green-600" />
                          </div>
                          <span className="text-xs font-semibold">رسائل SMS</span>
                        </Button>
                        
                        <Button 
                          onClick={() => {
                            const subject = encodeURIComponent(`دعوة للمشاركة في الاستبيان القبلي: ${survey.title}`);
                            const body = encodeURIComponent(`السلام عليكم ورحمة الله وبركاته،\n\nندعوكم للمشاركة في الاستبيان القبلي "${survey.title}".\n\nالرابط: ${surveyUrl}/pre\n\nشكراً لكم`);
                            window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
                            toast.success('تم فتح تطبيق البريد الإلكتروني!');
                          }}
                          variant="outline" 
                          className="flex flex-col items-center gap-2 h-20 border-2 border-[#183259]/20 hover:border-[#183259] hover:bg-[#183259]/5 rounded-2xl transition-all duration-200 group"
                        >
                          <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                            <Mail className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="text-xs font-semibold">البريد الإلكتروني</span>
                        </Button>
                        
                        <Button 
                          onClick={() => {
                            toast.success('تم إنشاء رمز QR للاستبيان القبلي!');
                          }}
                          variant="outline" 
                          className="flex flex-col items-center gap-2 h-20 border-2 border-[#183259]/20 hover:border-[#183259] hover:bg-[#183259]/5 rounded-2xl transition-all duration-200 group"
                        >
                          <div className="p-2 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                            <QrCode className="h-5 w-5 text-purple-600" />
                          </div>
                          <span className="text-xs font-semibold">رمز QR</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Post-Survey Card */}
                <Card className="shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm overflow-hidden group hover:scale-[1.02]">
                  <CardHeader className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-3 right-6 w-16 h-16 bg-white/30 rounded-full blur-2xl"></div>
                      <div className="absolute bottom-3 left-6 w-12 h-12 bg-white/20 rounded-full blur-xl"></div>
                      <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-white/15 rounded-full blur-lg"></div>
                    </div>
                    <CardTitle className="flex items-center gap-5 text-xl text-white relative z-10">
                      <div className="p-3 bg-white/25 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">الاستبيان البعدي</div>
                        <div className="text-green-100 text-sm font-normal mt-1">
                          قياس ما بعد التدخل
                        </div>
                      </div>
                    </CardTitle>
                    <p className="text-green-100 text-sm mt-4 relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      يقيس التغييرات والتحسينات بعد تنفيذ البرنامج أو التدخل
                    </p>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6 bg-gradient-to-b from-white to-gray-50/50">
                    {/* Survey URL */}
                    <div className="space-y-4">
                      <Label className="text-base font-bold text-[#183259] flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        رابط الاستبيان البعدي
                      </Label>
                      <div className="flex gap-3">
                        <Input 
                          value={`${surveyUrl}/post`} 
                          readOnly 
                          className="flex-1 bg-white border-[#183259]/20 focus:border-[#183259] font-mono text-sm rounded-2xl shadow-sm h-11 px-4"
                        />
                        <Button 
                          onClick={() => {
                            navigator.clipboard.writeText(`${surveyUrl}/post`);
                            toast.success('تم نسخ رابط الاستبيان البعدي!');
                          }}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 px-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 h-11"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Sharing Options */}
                    <div className="space-y-4">
                      <Label className="text-base font-bold text-[#183259] flex items-center gap-2">
                        <Share className="h-4 w-4" />
                        خيارات المشاركة
                      </Label>
                      <div className="grid grid-cols-3 gap-4">
                        <Button 
                          onClick={() => {
                            const message = `شارك في الاستبيان البعدي: ${survey.title}\n${surveyUrl}/post`;
                            window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
                            toast.success('تم فتح تطبيق الرسائل!');
                          }}
                          variant="outline" 
                          className="flex flex-col items-center gap-2 h-20 border-2 border-[#183259]/20 hover:border-[#183259] hover:bg-[#183259]/5 rounded-2xl transition-all duration-200 group"
                        >
                          <div className="p-2 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                            <MessageSquare className="h-5 w-5 text-green-600" />
                          </div>
                          <span className="text-xs font-semibold">رسائل SMS</span>
                        </Button>
                        
                        <Button 
                          onClick={() => {
                            const subject = encodeURIComponent(`دعوة للمشاركة في الاستبيان البعدي: ${survey.title}`);
                            const body = encodeURIComponent(`السلام عليكم ورحمة الله وبركاته،\n\nندعوكم للمشاركة في الاستبيان البعدي "${survey.title}".\n\nالرابط: ${surveyUrl}/post\n\nشكراً لكم`);
                            window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
                            toast.success('تم فتح تطبيق البريد الإلكتروني!');
                          }}
                          variant="outline" 
                          className="flex flex-col items-center gap-2 h-20 border-2 border-[#183259]/20 hover:border-[#183259] hover:bg-[#183259]/5 rounded-2xl transition-all duration-200 group"
                        >
                          <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                            <Mail className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="text-xs font-semibold">البريد الإلكتروني</span>
                        </Button>
                        
                        <Button 
                          onClick={() => {
                            toast.success('تم إنشاء رمز QR للاستبيان البعدي!');
                          }}
                          variant="outline" 
                          className="flex flex-col items-center gap-2 h-20 border-2 border-[#183259]/20 hover:border-[#183259] hover:bg-[#183259]/5 rounded-2xl transition-all duration-200 group"
                        >
                          <div className="p-2 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                            <QrCode className="h-5 w-5 text-purple-600" />
                          </div>
                          <span className="text-xs font-semibold">رمز QR</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Advanced Sharing Options */}
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-[#183259]/5 to-[#183259]/10 border-b border-[#183259]/10">
                  <CardTitle className="flex items-center gap-4 text-xl text-[#183259]">
                    <div className="p-3 bg-[#183259] rounded-3xl">
                      <Settings className="h-6 w-6 text-white" />
                    </div>
                    خيارات مشاركة متقدمة
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <Tabs value={selectedShareType} onValueChange={setSelectedShareType} className="w-full">
                    {/* Share Type Tabs */}
                    <TabsList className="grid w-full grid-cols-4 h-20 mb-8 bg-[#183259]/5 p-3 rounded-3xl border border-[#183259]/10">
                      <TabsTrigger 
                        value="bulk-share"
                        className="flex flex-col items-center gap-2 px-6 py-4 rounded-3xl data-[state=active]:bg-[#183259] data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-200"
                      >
                        <Users className="h-5 w-5" />
                        <span className="text-sm font-semibold">إرسال جماعي</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="qr-advanced"
                        className="flex flex-col items-center gap-2 px-6 py-4 rounded-3xl data-[state=active]:bg-[#183259] data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-200"
                      >
                        <QrCode className="h-5 w-5" />
                        <span className="text-sm font-semibold">رموز QR متقدمة</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="social"
                        className="flex flex-col items-center gap-2 px-6 py-4 rounded-3xl data-[state=active]:bg-[#183259] data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-200"
                      >
                        <Share className="h-5 w-5" />
                        <span className="text-sm font-semibold">وسائل التواصل</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="analytics"
                        className="flex flex-col items-center gap-2 px-6 py-4 rounded-3xl data-[state=active]:bg-[#183259] data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-200"
                      >
                        <BarChart3 className="h-5 w-5" />
                        <span className="text-sm font-semibold">الإحصائيات</span>
                      </TabsTrigger>
                    </TabsList>

                    {/* Bulk Share Tab */}
                    <TabsContent value="bulk-share" className="mt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-bold text-[#183259]">إرسال للمستفيدين</h4>
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id="select-all"
                                checked={selectAll}
                                onCheckedChange={handleSelectAll}
                              />
                              <Label htmlFor="select-all" className="text-sm font-semibold">
                                اختيار الكل ({filteredBeneficiaries.length})
                              </Label>
                            </div>
                          </div>
                          <div className="max-h-64 overflow-y-auto border border-[#183259]/20 rounded-3xl p-4 space-y-3 bg-gray-50/50">
                            {filteredBeneficiaries.slice(0, 8).map((beneficiary) => (
                              <div key={beneficiary.id} className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-200 hover:border-[#183259]/30 transition-colors">
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    id={beneficiary.id}
                                    checked={selectedBeneficiaries.includes(beneficiary.id)}
                                    onCheckedChange={(checked) => 
                                      handleBeneficiarySelect(beneficiary.id, checked as boolean)
                                    }
                                  />
                                  <div>
                                    <div className="font-semibold text-[#183259] text-sm">{beneficiary.name}</div>
                                    <div className="text-xs text-gray-500">{beneficiary.email}</div>
                                  </div>
                                </div>
                                <Badge 
                                  variant={beneficiary.status === 'active' ? 'default' : 'secondary'} 
                                  className={`text-xs px-2 py-1 ${
                                    beneficiary.status === 'active' 
                                      ? 'bg-green-100 text-green-800' 
                                      : beneficiary.status === 'invited' 
                                        ? 'bg-yellow-100 text-yellow-800' 
                                        : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {beneficiary.status === 'active' ? 'نشط' : beneficiary.status === 'invited' ? 'مدعو' : 'مكتمل'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                          <Button 
                            onClick={handleShare}
                            disabled={selectedBeneficiaries.length === 0 || isSharing}
                            className="w-full bg-[#183259] hover:bg-[#2a4a7a] h-12 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-200 text-sm font-semibold"
                          >
                            {isSharing ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                جاري الإرسال...
                              </div>
                            ) : (
                              `إرسال إلى ${selectedBeneficiaries.length} مستفيد`
                            )}
                          </Button>
                        </div>
                        
                        <div className="space-y-6">
                          <h4 className="text-lg font-bold text-[#183259]">رسالة مخصصة</h4>
                          <Textarea
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            placeholder="اكتب رسالة مخصصة (اختياري)..."
                            className="min-h-32 border-[#183259]/20 focus:border-[#183259] rounded-3xl text-sm p-4"
                          />
                          <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-3xl border border-blue-200">
                            💡 سيتم إرفاق رابط الاستبيان تلقائياً مع الرسالة
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* QR Advanced Tab */}
                    <TabsContent value="qr-advanced" className="mt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <h4 className="text-lg font-bold text-[#183259]">إنشاء رموز QR مخصصة</h4>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 border border-[#183259]/20 rounded-3xl text-center bg-white hover:shadow-xl transition-shadow">
                              <SimpleQRCode value={`${surveyUrl}/pre`} size={120} className="mx-auto mb-3" />
                              <p className="text-sm font-semibold text-[#183259] mb-3">الاستبيان القبلي</p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-[#183259]/20 hover:border-[#183259] h-10 px-4 rounded-2xl text-xs"
                                onClick={() => toast.success('تم تحميل رمز QR للاستبيان القبلي!')}
                              >
                                <Download className="h-3 w-3 ml-1" />
                                تحميل
                              </Button>
                            </div>
                            <div className="p-6 border border-[#183259]/20 rounded-3xl text-center bg-white hover:shadow-xl transition-shadow">
                              <SimpleQRCode value={`${surveyUrl}/post`} size={120} className="mx-auto mb-3" />
                              <p className="text-sm font-semibold text-[#183259] mb-3">الاستبيان البعدي</p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-[#183259]/20 hover:border-[#183259] h-10 px-4 rounded-2xl text-xs"
                                onClick={() => toast.success('تم تحميل رمز QR للاستبيان البعدي!')}
                              >
                                <Download className="h-3 w-3 ml-1" />
                                تحميل
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <h4 className="text-lg font-bold text-[#183259]">خيارات الطباعة</h4>
                          <div className="space-y-4">
                            <Button 
                              variant="outline" 
                              className="w-full justify-start border-[#183259]/20 hover:border-[#183259] h-12 text-sm rounded-3xl"
                              onClick={() => toast.success('تم إنشاء ملصقات QR للطباعة!')}
                            >
                              <FileDown className="h-5 w-5 ml-2" />
                              تحميل ملصقات للطباعة
                            </Button>
                            <Button 
                              variant="outline" 
                              className="w-full justify-start border-[#183259]/20 hover:border-[#183259] h-12 text-sm rounded-3xl"
                              onClick={() => toast.success('تم إنشاء بطاقات عمل مع QR!')}
                            >
                              <FileDown className="h-5 w-5 ml-2" />
                              بطاقات عمل مع رموز QR
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Social Tab */}
                    <TabsContent value="social" className="mt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <h4 className="text-lg font-bold text-[#183259]">مشاركة على وسائل التواصل</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <Button 
                              onClick={() => handleSocialShare('whatsapp')}
                              className="h-16 bg-green-500 hover:bg-green-600 flex flex-col items-center gap-2 rounded-3xl text-sm"
                            >
                              <MessageSquare className="h-6 w-6" />
                              <span className="font-semibold">واتساب</span>
                            </Button>
                            <Button 
                              onClick={() => handleSocialShare('facebook')}
                              className="h-16 bg-blue-600 hover:bg-blue-700 flex flex-col items-center gap-2 rounded-3xl text-sm"
                            >
                              <Facebook className="h-6 w-6" />
                              <span className="font-semibold">فيسبوك</span>
                            </Button>
                            <Button 
                              onClick={() => handleSocialShare('twitter')}
                              className="h-16 bg-black hover:bg-gray-800 flex flex-col items-center gap-2 rounded-3xl text-sm"
                            >
                              <Twitter className="h-6 w-6" />
                              <span className="font-semibold">تويتر</span>
                            </Button>
                            <Button 
                              onClick={() => handleSocialShare('linkedin')}
                              className="h-16 bg-blue-700 hover:bg-blue-800 flex flex-col items-center gap-2 rounded-3xl text-sm"
                            >
                              <Linkedin className="h-6 w-6" />
                              <span className="font-semibold">لينكدإن</span>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <h4 className="text-lg font-bold text-[#183259]">معاينة الرسالة</h4>
                          <div className="p-6 bg-gray-50 rounded-3xl border border-[#183259]/20">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              🔍 شارك في استبيان: {survey.title}
                              <br /><br />
                              مشاركتك تساعدنا في قياس الأثر الاجتماعي وتحسين خدماتنا
                              <br /><br />
                              🔗 {surveyUrl}
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-[#183259]/20 rounded-3xl">
                          <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-[#183259] mb-2">156</div>
                            <div className="text-sm text-gray-600">إجمالي المشاركات</div>
                          </CardContent>
                        </Card>
                        <Card className="border-[#183259]/20 rounded-3xl">
                          <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">89%</div>
                            <div className="text-sm text-gray-600">معدل الاستجابة</div>
                          </CardContent>
                        </Card>
                        <Card className="border-[#183259]/20 rounded-3xl">
                          <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">42</div>
                            <div className="text-sm text-gray-600">مشاركات اليوم</div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}