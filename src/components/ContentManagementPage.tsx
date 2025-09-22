import React, { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { EnhancedPageLayout } from './EnhancedPageLayout';
import { 
  Edit,
  Save,
  History,  
  Upload,
  Image as ImageIcon,
  Palette,
  Type,
  FolderOpen,
  FileText,
  Users,
  BarChart3,
  Settings,
  CreditCard,
  Activity,
  Building,
  Bot,
  Home,
  Eye,
  Monitor,
  Smartphone,
  Tablet,
  ChevronRight,
  ChevronDown,
  X,
  Plus,
  Trash2,
  Copy,
  RotateCcw,
  Check,
  Undo,
  Redo,
  EyeOff,
  AlertTriangle,
  MousePointer2,
  Move,
  Archive,
  Clock,
  GitBranch,
  Layers,
  Download,
  Search,
  Grid3X3,
  Navigation,
  Paintbrush,
  Layout,
  Globe,
  HelpCircle
} from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { toast } from 'sonner';

interface ContentManagementPageProps {
  userRole: 'super_admin' | 'admin';
}

interface PageNode {
  id: string;
  name: string;
  type: 'page' | 'section' | 'component';
  icon: React.ElementType;
  children?: PageNode[];
  editable: boolean;
  content?: {
    title?: string;
    description?: string;
    backgroundImage?: string;
    primaryColor?: string;
    secondaryColor?: string;
    textColor?: string;
  };
}

interface ContentVersion {
  id: string;
  timestamp: Date;
  user: string;
  changes: string;
  content: any;
  label: string;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

// Demo page structure
const demoPageStructure: PageNode[] = [
  {
    id: 'landing',
    name: 'الصفحة الرئيسية',
    type: 'page',
    icon: Home,
    editable: true,
    content: {
      title: 'سحابة الأثر - منصة قياس الأثر الاجتماعي',
      description: 'اكتشف قوة البيانات في قياس وتحليل الأثر الاجتماعي لبرامجك ومبادراتك مع أدوات متطورة وتقارير شاملة',
      backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&w=1200',
      primaryColor: '#183259',
      secondaryColor: '#2a4a7a',
      textColor: '#ffffff'
    },
    children: [
      {
        id: 'hero-section',
        name: 'قسم البطل الرئيسي',
        type: 'section',
        icon: Monitor,
        editable: true,
        content: {
          title: 'اكتشف قوة البيانات',
          description: 'قس واحلل الأثر الاجتماعي لمبادراتك باستخدام تقنيات الذكاء الاصطناعي المتطورة',
          backgroundImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&w=1000'
        }
      },
      {
        id: 'features-section',
        name: 'قسم المميزات',
        type: 'section',
        icon: BarChart3,
        editable: true,
        content: {
          title: 'مميزات المنصة',
          description: 'استفد من مجموعة شاملة من الأدوات المتطورة لقياس وتحليل الأثر الاجتماعي'
        }
      },
      {
        id: 'cta-section',
        name: 'قسم الدعوة للعمل',
        type: 'section',
        icon: Plus,
        editable: true,
        content: {
          title: 'ابدأ رحلتك اليوم',
          description: 'انضم إلى المئات من المنظمات التي تستخدم سحابة الأثر لقياس تأثيرها الاجتماعي'
        }
      }
    ]
  },
  {
    id: 'dashboard',
    name: 'لوحة التحكم',
    type: 'page',
    icon: BarChart3,
    editable: true,
    content: {
      title: 'لوحة التحكم',
      description: 'مرحباً في لوحة التحكم الخاصة بك - تتبع أداءك وإنجازاتك',
      primaryColor: '#183259',
      backgroundImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&w=800'
    }
  },
  {
    id: 'surveys',
    name: 'إدارة الاستبيانات',
    type: 'page',
    icon: FileText,
    editable: true,
    content: {
      title: 'إدارة الاستبيانات',
      description: 'أنشئ وأدر استبياناتك بسهولة مع أدوات متطورة للتحليل والتقييم'
    }
  },
  {
    id: 'analysis',
    name: 'تحليل برق',
    type: 'page',
    icon: Bot,
    editable: true,
    content: {
      title: 'تحليل برق - الذكاء الاصطناعي',
      description: 'احصل على تحليلات عميقة ورؤى قيمة باستخدام تقنيات الذكاء الاصطناعي المتطورة'
    }
  },
  {
    id: 'profile',
    name: 'الملف الشخصي',
    type: 'page',
    icon: Users,
    editable: true,
    content: {
      title: 'الملف الشخصي',
      description: 'إدارة معلوماتك الشخصية وإعدادات الحساب'
    }
  },
  {
    id: 'subscription',
    name: 'الاشتراكات',
    type: 'page',
    icon: CreditCard,
    editable: true,
    content: {
      title: 'إدارة الاشتراكات',
      description: 'تصفح الباقات المتاحة وأدر اشتراكك الحالي'
    }
  },
  {
    id: 'settings',
    name: 'الإعدادات',
    type: 'page',
    icon: Settings,
    editable: true,
    content: {
      title: 'إعدادات النظام',
      description: 'إدارة الإعدادات العامة وتخصيص تجربة الاستخدام'
    }
  }
];

// Demo versions
const demoVersions: ContentVersion[] = [
  {
    id: '1',
    timestamp: new Date('2024-01-15T10:30:00'),
    user: 'أحمد محمد',
    changes: 'تحديث النص الرئيسي والألوان',
    content: {},
    label: 'الإصدار الأولي'
  },
  {
    id: '2',
    timestamp: new Date('2024-01-20T14:15:00'),
    user: 'فاطمة علي',
    changes: 'إضافة الصور الجديدة وتحسين التخطيط',
    content: {},
    label: 'تحديث المحتوى'
  },
  {
    id: '3',
    timestamp: new Date('2024-02-01T09:45:00'),
    user: 'محمد خالد',
    changes: 'تحسين ألوان العلامة التجارية',
    content: {},
    label: 'تحديث الهوية البصرية'
  },
  {
    id: '4',
    timestamp: new Date('2024-02-15T16:20:00'),
    user: 'سارة أحمد',
    changes: 'إض��فة أقسام جديدة وتحسين المحتوى',
    content: {},
    label: 'إصدار محسن'
  }
];

export function ContentManagementPage({ userRole }: ContentManagementPageProps) {
  const [selectedPage, setSelectedPage] = useState<PageNode | null>(demoPageStructure[0]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['landing']));
  const [draftContent, setDraftContent] = useState<any>(demoPageStructure[0]?.content || {});
  const [savedContent, setSavedContent] = useState<any>(demoPageStructure[0]?.content || {});
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [versions, setVersions] = useState<ContentVersion[]>(demoVersions);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');

  const toggleNodeExpansion = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleNodeSelect = (node: PageNode) => {
    if (hasUnsavedChanges) {
      if (!confirm('لديك تغييرات غير محفوظة. هل تريد المتابعة؟')) {
        return;
      }
    }
    
    setSelectedPage(node);
    setDraftContent(node.content || {});
    setSavedContent(node.content || {});
    setEditingElement(null);
    setHasUnsavedChanges(false);
  };

  const handleContentChange = (field: string, value: any) => {
    const newContent = { ...draftContent, [field]: value };
    setDraftContent(newContent);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    setSavedContent(draftContent);
    setHasUnsavedChanges(false);
    
    if (selectedPage) {
      const updatedPage = { ...selectedPage, content: draftContent };
      setSelectedPage(updatedPage);
    }
    
    toast.success('تم حفظ التغييرات بنجاح');
  };

  const handleSaveVersion = () => {
    const versionLabel = prompt('أدخل تسمية للنسخة:');
    if (versionLabel && versionLabel.trim()) {
      const newVersion: ContentVersion = {
        id: Date.now().toString(),
        timestamp: new Date(),
        user: userRole === 'super_admin' ? 'مدير النظام' : 'مدير المحتوى',
        changes: `حفظ نسخة: ${versionLabel}`,
        content: { ...draftContent },
        label: versionLabel.trim()
      };
      
      setVersions([newVersion, ...versions]);
      handleSave();
      toast.success(`تم حفظ النسخة "${versionLabel}" بنجاح`);
    }
  };

  const handleRestoreVersion = (version: ContentVersion) => {
    if (confirm(`هل تريد استرجاع النسخة "${version.label}"؟ سيتم فقدان التغييرات الحالية.`)) {
      setDraftContent(version.content);
      setSavedContent(version.content);
      setHasUnsavedChanges(false);
      setShowVersionHistory(false);
      toast.success(`تم استرجاع النسخة "${version.label}" بنجاح`);
    }
  };

  const getViewportClasses = () => {
    switch (viewportSize) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  // Render functions
  const renderPageTree = (nodes: PageNode[], level: number = 0) => {
    return nodes.map((node) => (
      <div key={node.id} className="mb-1">
        <div
          className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
            selectedPage?.id === node.id 
              ? 'bg-[#183259] text-white shadow-md' 
              : 'hover:bg-gray-100'
          }`}
          style={{ paddingRight: `${level * 20 + 12}px` }}
          onClick={() => handleNodeSelect(node)}
        >
          {node.children && (
            <Button
              variant="ghost"
              size="sm"
              className={`p-0 h-auto w-auto mr-2 ${selectedPage?.id === node.id ? 'text-white hover:text-gray-200' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleNodeExpansion(node.id);
              }}
            >
              {expandedNodes.has(node.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          <node.icon className={`h-5 w-5 ml-3 ${selectedPage?.id === node.id ? 'text-white' : 'text-[#183259]'}`} />
          <span className="font-medium">{node.name}</span>
          {node.editable && (
            <Badge 
              variant="secondary" 
              className={`mr-auto text-xs ${
                selectedPage?.id === node.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-green-100 text-green-800'
              }`}
            >
              قابل للتحرير
            </Badge>
          )}
        </div>
        {node.children && expandedNodes.has(node.id) && (
          <div className="mt-1">
            {renderPageTree(node.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const renderEditableText = (content: string, field: string, placeholder: string, isTitle: boolean = false) => {
    const isEditing = editingElement === field;
    
    return (
      <div 
        className={`relative group ${isTitle ? 'mb-8' : 'mb-6'}`}
        onClick={() => setEditingElement(field)}
      >
        {isEditing ? (
          <div className="relative">
            {isTitle ? (
              <Input
                value={content}
                onChange={(e) => handleContentChange(field, e.target.value)}
                onBlur={() => setEditingElement(null)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setEditingElement(null);
                  }
                }}
                className="text-3xl font-bold bg-white border-2 border-[#183259] rounded-xl p-4 shadow-lg"
                style={{ color: draftContent.textColor || '#000' }}
                autoFocus
                placeholder={placeholder}
              />
            ) : (
              <Textarea
                value={content}
                onChange={(e) => handleContentChange(field, e.target.value)}
                onBlur={() => setEditingElement(null)}
                className="bg-white border-2 border-[#183259] rounded-xl p-4 min-h-[120px] shadow-lg resize-none"
                autoFocus
                placeholder={placeholder}
              />
            )}
            <div className="absolute -top-10 left-0 bg-[#183259] text-white px-3 py-1 rounded-lg text-sm shadow-lg">
              اضغط Enter أو انقر خارج المربع لحفظ التغييرات
            </div>
          </div>
        ) : (
          <div className="cursor-pointer hover:bg-blue-50/80 rounded-xl p-4 -m-4 border-2 border-transparent hover:border-blue-200 hover:shadow-md transition-all duration-300">
            {isTitle ? (
              <h1 
                className="text-4xl font-bold mb-3 leading-tight"
                style={{ color: draftContent.textColor || '#000' }}
              >
                {content || placeholder}
              </h1>
            ) : (
              <p className="text-lg leading-relaxed text-gray-700">
                {content || placeholder}
              </p>
            )}
            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-[#183259] text-white p-2 rounded-lg text-xs flex items-center gap-2 shadow-lg">
                <Edit className="h-4 w-4" />
                <span>انقر للتحرير</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEditableImage = (imageUrl: string, field: string, label: string = '') => {
    return (
      <div className="mb-8">
        <ImageUploader
          onImageUpload={(newImageUrl) => handleContentChange(field, newImageUrl)}
          currentImage={imageUrl}
          placeholder={label || "يمكن إضافة صورة هنا"}
          variant="card"
          className="w-full"
        />
      </div>
    );
  };

  const renderColorPicker = (color: string, field: string, label: string) => (
    <div className="mb-6">
      <label className="text-sm font-bold text-gray-700 mb-3 block">{label}</label>
      <div className="flex items-center gap-4">
        <div className="relative group">
          <input
            type="color"
            value={color || '#183259'}
            onChange={(e) => handleContentChange(field, e.target.value)}
            className="w-14 h-14 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-[#183259] transition-all duration-200 shadow-md hover:shadow-lg"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded-lg font-bold">
            {color || '#183259'}
          </span>
          <span className="text-xs text-gray-400 mt-1">اللون الحالي</span>
        </div>
      </div>
    </div>
  );

  const renderLivePreview = () => {
    if (!selectedPage) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <FileText className="h-20 w-20 mx-auto mb-6 text-gray-300" />
            <h3 className="text-xl font-bold mb-3">اختر صفحة للبدء</h3>
            <p>اختر صفحة من القائمة لبدء التحرير والمعاينة</p>
          </div>
        </div>
      );
    }

    const backgroundStyle = draftContent.backgroundImage ? {
      backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${draftContent.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } : {
      backgroundColor: draftContent.primaryColor || '#183259'
    };

    return (
      <div className={`space-y-8 transition-all duration-300 ${getViewportClasses()}`}>
        {/* Page Background Section */}
        <div 
          className="relative rounded-2xl overflow-hidden p-10 min-h-[350px] shadow-xl"
          style={backgroundStyle}
        >
          <div className="relative z-10">
            {renderEditableText(
              draftContent.title || '', 
              'title', 
              'انقر لإضافة عنوان الصفحة', 
              true
            )}
            
            {renderEditableText(
              draftContent.description || '', 
              'description', 
              'انقر لإضافة وصف الصفحة'
            )}
          </div>
        </div>

        {/* Background Image Control */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <ImageIcon className="h-6 w-6 text-[#183259]" />
              صورة الخلفية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {renderEditableImage(
              draftContent.backgroundImage || '', 
              'backgroundImage',
              'صورة خلفية الصفحة الرئيسية'
            )}
          </CardContent>
        </Card>

        {/* Content Sections */}
        {selectedPage.children?.map((child) => (
          <Card key={child.id} className="overflow-hidden shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center gap-3 text-xl">
                <child.icon className="h-6 w-6 text-[#183259]" />
                {child.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {renderEditableText(
                child.content?.title || '', 
                `${child.id}_title`, 
                `عنوان ${child.name}`, 
                true
              )}
              
              {renderEditableText(
                child.content?.description || '', 
                `${child.id}_description`, 
                `وصف ${child.name}`
              )}
              
              {renderEditableImage(
                child.content?.backgroundImage || '', 
                `${child.id}_backgroundImage`,
                `صورة ${child.name}`
              )}
            </CardContent>
          </Card>
        ))}

        {/* Color Controls */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Palette className="h-6 w-6 text-[#183259]" />
              ألوان الصفحة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {renderColorPicker(draftContent.primaryColor, 'primaryColor', 'اللون الأساسي')}
            {renderColorPicker(draftContent.secondaryColor, 'secondaryColor', 'اللون الثانوي')}
            {renderColorPicker(draftContent.textColor, 'textColor', 'لون النص')}
          </CardContent>
        </Card>
      </div>
    );
  };

  const headerStats = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{demoPageStructure.length}</div>
            <div className="text-blue-200">صفحات المنصة</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <GitBranch className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{versions.length}</div>
            <div className="text-blue-200">إصدارات محفوظة</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Edit className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{hasUnsavedChanges ? '✓' : '—'}</div>
            <div className="text-blue-200">تغييرات غير محفوظة</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <EnhancedPageLayout
      pageId="content-management"
      userRole={userRole}
      description="إدارة وتخصيص محتوى صفحات المنصة"
      icon={<Layout className="h-8 w-8" />}
      headerContent={headerStats}
    >
      <div className="h-full flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Page Structure */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <Card className="h-full shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#183259] to-blue-700 text-white border-b border-blue-600">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Layout className="h-6 w-6" />
                هيكل المنصة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <ScrollArea className="h-full p-6">
                {renderPageTree(demoPageStructure)}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-h-0">
          <div className="h-full flex flex-col">
            {/* Controls Bar */}
            <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
              {/* Viewport Size Controls */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                <Button
                  variant={viewportSize === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewportSize('desktop')}
                  className={viewportSize === 'desktop' ? 'bg-[#183259] text-white' : ''}
                >
                  <Monitor className="h-4 w-4 ml-2" />
                  سطح المكتب
                </Button>
                <Button
                  variant={viewportSize === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewportSize('tablet')}
                  className={viewportSize === 'tablet' ? 'bg-[#183259] text-white' : ''}
                >
                  <Tablet className="h-4 w-4 ml-2" />
                  جهاز لوحي
                </Button>
                <Button
                  variant={viewportSize === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewportSize('mobile')}
                  className={viewportSize === 'mobile' ? 'bg-[#183259] text-white' : ''}
                >
                  <Smartphone className="h-4 w-4 ml-2" />
                  جوال
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mr-auto">
                {hasUnsavedChanges && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 animate-pulse">
                    تغييرات غير محفوظة
                  </Badge>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVersionHistory(true)}
                  className="border-gray-300 hover:border-[#183259]"
                >
                  <History className="h-4 w-4 ml-2" />
                  تاريخ النسخ
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges}
                  className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-500"
                >
                  <Save className="h-4 w-4 ml-2" />
                  حفظ التغييرات
                </Button>
                
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveVersion}
                  disabled={!selectedPage}
                  className="bg-[#183259] hover:bg-blue-700"
                >
                  <GitBranch className="h-4 w-4 ml-2" />
                  حفظ نسخة جديدة
                </Button>
              </div>
            </div>

            {/* Content Area - Full Width Live Preview */}
            <div className="flex-1 min-h-0">
              <Card className="h-full shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b flex-shrink-0">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Eye className="h-6 w-6 text-[#183259]" />
                    معاينة مباشرة
                    {selectedPage && (
                      <Badge variant="outline" className="mr-auto border-[#183259] text-[#183259]">
                        {selectedPage.name}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex-1 min-h-0">
                  <ScrollArea className="h-full">
                    {renderLivePreview()}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Version History Modal */}
      <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <History className="h-6 w-6 text-[#183259]" />
              تاريخ النسخ
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {versions.map((version) => (
                <div key={version.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#183259] transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="border-[#183259] text-[#183259]">
                          {version.label}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {version.timestamp.toLocaleDateString('ar-SA')} - {version.timestamp.toLocaleTimeString('ar-SA')}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{version.changes}</p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        <span>{version.user}</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestoreVersion(version)}
                      className="border-[#183259] text-[#183259] hover:bg-[#183259] hover:text-white"
                    >
                      <RotateCcw className="h-4 w-4 ml-2" />
                      استرجاع
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </EnhancedPageLayout>
  );
}