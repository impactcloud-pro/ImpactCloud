import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { EnhancedPageLayout } from './EnhancedPageLayout';
import { UserRole } from '../App';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  MessageCircle, 
  Send,
  Bot,
  User,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Users,
  Target,
  Award,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Minus,
  ScrollText,
  Sparkles,
  Brain,
  ChevronRight,
  Download,
  RefreshCw,
  Filter,
  HelpCircle,
  Zap,
  Clock
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AnalysisPageProps {
  userRole: 'admin' | 'org_manager';
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  surveyId?: string;
}

interface InsightCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  trend: 'up' | 'down' | 'neutral';
  description: string;
}

interface SuggestedQuestion {
  id: string;
  text: string;
  category: string;
  icon: React.ElementType;
}

// Demo surveys data
const demoSurveys = [
  { id: '1', title: 'برنامج التدريب المهني 2024', organization: 'مؤسسة التنمية' },
  { id: '2', title: 'مشروع الإسكان الخيري', organization: 'جمعية الخير' },
  { id: '3', title: 'برنامج محو الأمية', organization: 'مؤسسة التعليم' },
  { id: '4', title: 'مبادرة الصحة المجتمعية', organization: 'مؤسسة الصحة' }
];

// Function to generate suggested questions based on selected survey
const getSuggestedQuestions = (surveyId: string): SuggestedQuestion[] => {
  const commonQuestions: SuggestedQuestion[] = [
    {
      id: 'q1',
      text: 'ما هو معدل الرضا العام للمستفيدين؟',
      category: 'رضا',
      icon: Award
    },
    {
      id: 'q2', 
      text: 'كم عدد المستفيدين الذين أكملوا البرنامج بنجاح؟',
      category: 'إحصائيات',
      icon: Users
    },
    {
      id: 'q3',
      text: 'ما هي أبرز التحديات التي و��جهت المستفيدين؟',
      category: 'تحديات',
      icon: Target
    }
  ];

  const surveySpecificQuestions: Record<string, SuggestedQuestion[]> = {
    '1': [ // برنامج التدريب المهني
      {
        id: 'q4',
        text: 'ما هو متوسط المهارات المكتسبة لكل مستفيد؟',
        category: 'مهارات',
        icon: TrendingUp
      },
      {
        id: 'q5',
        text: 'كم من المتدربين حصلوا على وظائف بعد التدريب؟',
        category: 'توظيف',
        icon: Zap
      }
    ],
    '2': [ // مشروع الإسكان
      {
        id: 'q4',
        text: 'ما هو التحسن في ظروف السكن للمستفيدين؟',
        category: 'سكن',
        icon: TrendingUp
      },
      {
        id: 'q5',
        text: 'هل تحسنت الخدمات الأساسية في المناطق المستهدفة؟',
        category: 'خدمات',
        icon: Activity
      }
    ],
    '3': [ // برنامج محو الأمية
      {
        id: 'q4',
        text: 'ما نسبة تحسن مستوى القراءة والكتابة؟',
        category: 'تعليم',
        icon: Brain
      },
      {
        id: 'q5',
        text: 'كم من المستفيدين استمروا في التعليم بعد البرنامج؟',
        category: 'استمرارية',
        icon: Clock
      }
    ],
    '4': [ // مبادرة الصحة
      {
        id: 'q4',
        text: 'ما هو التحسن في المؤشرات الصحية للمجتمع؟',
        category: 'صحة',
        icon: Activity
      },
      {
        id: 'q5',
        text: 'هل زاد الوعي الصحي بين المستفيدين؟',
        category: 'وعي',
        icon: Lightbulb
      }
    ],
    'all': [
      {
        id: 'q4',
        text: 'ما هي أفضل البرامج أداءً من حيث النتائج؟',
        category: 'مقارنة',
        icon: BarChart3
      },
      {
        id: 'q5',
        text: 'ما التوصيات لتحسين فعالية البرامج المستقبلية؟',
        category: 'توصيات',
        icon: Lightbulb
      }
    ]
  };

  const specificQuestions = surveySpecificQuestions[surveyId] || surveySpecificQuestions['all'];
  return [...commonQuestions, ...specificQuestions];
};

// Demo AI responses
const getDemoAIResponse = (question: string, surveyId?: string): string => {
  const responses = [
    "بناءً على تحليل البيانات، يظهر أن معدل الرضا العام للمستفيدين قد ارتفع بنسبة 25% مقارنة بالقياس القبلي. هذا يشير إلى فعالية البرنامج في تحقيق أهدافه.",
    "تُظهر النتائج تحسناً ملحوظاً في مستوى المهارات، حيث ازداد متوسط المهارات المكتسبة من 2.3 إلى 4.1 مهارة لكل مستفيد، مما يعكس نجاح البرنامج التدريبي.",
    "يشير التحليل إلى أن المستفيدين في المرحلة العمرية 25-35 سنة أظهروا أعلى معدلات التحسن، بينما المجموعة الأكبر سناً احتاجت لدعم إضافي.",
    "بناءً على البيانات المتاحة، نوصي بتركيز الجهود على تحسين آليات المتابعة، حيث أظهرت النتائج أن المستفيدين الذين تلقوا متابعة منتظمة حققوا نتائج أفضل بنسبة 40%.",
    "تحليل البيانات يكشف عن وجود فجوة في الخدمات المقدمة للإناث، حيث بلغت نسبة مشاركتهن 35% فقط. نقترح تطوير برامج موجهة خصيصاً للنساء لزيادة مشاركتهن."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

// Demo insights data
const demoInsights: InsightCard[] = [
  {
    id: '1',
    title: 'إجمالي المستفيدين',
    value: '2,847',
    change: 12.5,
    icon: Users,
    trend: 'up',
    description: 'العدد الإجمالي للمستفيدين من جميع البرامج'
  },
  {
    id: '2',
    title: 'معدل الرضا العام',
    value: '87%',
    change: 8.2,
    icon: Award,
    trend: 'up',
    description: 'متوسط رضا المستفيدين عن الخدمات المقدمة'
  },
  {
    id: '3',
    title: 'معدل إتمام البرامج',
    value: '74%',
    change: -3.1,
    icon: Target,
    trend: 'down',
    description: 'نسبة المستفيدين الذين أتموا البرامج بنجاح'
  },
  {
    id: '4',
    title: 'متوسط التحسن',
    value: '+45%',
    change: 15.3,
    icon: TrendingUp,
    trend: 'up',
    description: 'متوسط التحسن في المؤشرات الرئيسية'
  }
];

// Demo overall statistics
const overallStatsData = [
  { name: 'يناير', beforeProgram: 2.1, afterProgram: 3.8, satisfaction: 65 },
  { name: 'فبراير', beforeProgram: 2.3, afterProgram: 4.1, satisfaction: 72 },
  { name: 'مارس', beforeProgram: 2.0, afterProgram: 4.3, satisfaction: 78 },
  { name: 'أبريل', beforeProgram: 2.4, afterProgram: 4.5, satisfaction: 85 },
  { name: 'مايو', beforeProgram: 2.2, afterProgram: 4.7, satisfaction: 87 },
  { name: 'يونيو', beforeProgram: 2.5, afterProgram: 4.9, satisfaction: 89 }
];

// Demo sector comparison data
const sectorComparisonData = [
  { 
    sector: 'التعليم والثقافة',
    aspects: [
      { name: 'التعليم المدرسي', before: 2.1, after: 4.2, improvement: 100 },
      { name: 'القراءة والكتابة', before: 1.8, after: 3.9, improvement: 117 },
      { name: 'التدريب المهني', before: 2.3, after: 4.5, improvement: 96 },
      { name: 'التعليم الرقمي', before: 1.5, after: 3.7, improvement: 147 }
    ]
  },
  {
    sector: 'الصحة والبيئة', 
    aspects: [
      { name: 'الرعاية الصحية', before: 2.4, after: 4.1, improvement: 71 },
      { name: 'التوعية الصحية', before: 2.0, after: 4.3, improvement: 115 },
      { name: 'الصحة النفسية', before: 1.9, after: 3.8, improvement: 100 },
      { name: 'البيئة والنظافة', before: 2.2, after: 4.0, improvement: 82 }
    ]
  },
  {
    sector: 'التمكين الاقتصادي',
    aspects: [
      { name: 'التوظيف', before: 1.8, after: 3.9, improvement: 117 },
      { name: 'ريادة الأعمال', before: 1.6, after: 3.5, improvement: 119 },
      { name: 'التدريب المالي', before: 2.1, after: 4.0, improvement: 90 },
      { name: 'الدعم المالي', before: 2.3, after: 4.2, improvement: 83 }
    ]
  },
  {
    sector: 'السكن والبنية التحتية',
    aspects: [
      { name: 'جودة المسكن', before: 2.0, after: 4.4, improvement: 120 },
      { name: 'الخدمات الأساسية', before: 2.2, after: 4.1, improvement: 86 },
      { name: 'النقل والمواصلات', before: 1.9, after: 3.7, improvement: 95 },
      { name: 'الاتصالات', before: 2.5, after: 4.3, improvement: 72 }
    ]
  }
];

// Colors for charts
const COLORS = ['#183259', '#2a4a7a', '#4a6ba3', '#6b85cc', '#8da4c7'];

export function AnalysisPage({ userRole }: AnalysisPageProps) {
  const [activeTab, setActiveTab] = useState('ask-question');
  const [selectedSurvey, setSelectedSurvey] = useState<string>('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'مرحباً! أنا مساعدك الذكي لتحليل الاستبيانات. يمكنني مساعدتك في فهم البيانات والحصول على رؤى قيمة. ما الذي تود معرفته؟',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedSector, setSelectedSector] = useState('التعليم والثقافة');
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Header stats content for EnhancedPageLayout
  const headerStats = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
      {demoInsights.map((insight) => (
        <div key={insight.id} className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <insight.icon className="h-6 w-6 text-white" />
            <div>
              <div className="text-2xl font-bold text-white arabic-numbers">{insight.value}</div>
              <div className="text-blue-200">{insight.title}</div>
              <div className="text-xs text-blue-300 arabic-numbers">
                {insight.change > 0 ? '+' : ''}{insight.change}% من الشهر الماضي
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update suggested questions when survey selection changes
  useEffect(() => {
    if (selectedSurvey) {
      const questions = getSuggestedQuestions(selectedSurvey);
      setSuggestedQuestions(questions);
    } else {
      setSuggestedQuestions([]);
    }
  }, [selectedSurvey]);

  const handleSendMessage = async () => {
    if (!question.trim()) {
      toast.error('يرجى كتابة سؤالك');
      return;
    }

    if (!selectedSurvey) {
      toast.error('يرجى اختيار استبيان أولاً');
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date(),
      surveyId: selectedSurvey
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getDemoAIResponse(question, selectedSurvey),
        timestamp: new Date(),
        surveyId: selectedSurvey
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedQuestionClick = (questionText: string) => {
    setQuestion(questionText);
    // Automatically send the question
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleExportAnalysis = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create export data
      const exportData = {
        timestamp: new Date().toISOString(),
        selectedSurvey,
        insights: demoInsights,
        overallStats: overallStatsData,
        sectorComparison: sectorComparisonData.find(s => s.sector === selectedSector),
        chatHistory: messages
      };
      
      // Create and download file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `تحليل-البيانات-${new Date().toLocaleDateString('ar-SA')}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('تم تصدير التحليل بنجاح!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('حدث خطأ أثناء تصدير التحليل');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    
    try {
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset chat messages to initial state
      setMessages([{
        id: '1',
        type: 'assistant',
        content: 'مرحباً! تم تحديث البيانات بنجاح. أنا مساعدك الذكي لتحليل الاستبيانات المحدثة. يمكنني مساعدتك في فهم البيانات والحصول على رؤى قيمة. ما الذي تود معرفته؟',
        timestamp: new Date()
      }]);
      
      // Clear question input
      setQuestion('');
      
      // Update suggested questions if survey is selected
      if (selectedSurvey) {
        const questions = getSuggestedQuestions(selectedSurvey);
        setSuggestedQuestions(questions);
      }
      
      toast.success('تم تحديث البيانات بنجاح!');
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error('حدث خطأ أثناء تحديث البيانات');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const renderAskQuestionTab = () => (
    <div className="space-y-6">
      {/* Survey Selection */}
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5" />
            اختيار الاستبيان
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
            <SelectTrigger className="h-12 rounded-xl border-[#183259]/20 focus:border-[#183259]">
              <SelectValue placeholder="اختر الاستبيان الذي تريد السؤال عنه" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الاستبيانات</SelectItem>
              {demoSurveys.map((survey) => (
                <SelectItem key={survey.id} value={survey.id}>
                  {survey.title} - {survey.organization}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Suggested Questions */}
      {selectedSurvey && suggestedQuestions.length > 0 && (
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              اقتراحات أسئلة
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {suggestedQuestions.length} أسئلة
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {suggestedQuestions.map((suggestedQuestion) => (
                <Button
                  key={suggestedQuestion.id}
                  variant="outline"
                  onClick={() => handleSuggestedQuestionClick(suggestedQuestion.text)}
                  className="h-auto p-4 text-right justify-start hover:bg-blue-50 hover:border-blue-200 transition-colors"
                  disabled={isTyping}
                >
                  <div className="flex items-center gap-3 w-full">
                    <suggestedQuestion.icon className="h-4 w-4 text-[#183259] flex-shrink-0" />
                    <div className="flex-1 text-right">
                      <div className="font-medium text-gray-900">{suggestedQuestion.text}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {suggestedQuestion.category}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  </div>
                </Button>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Sparkles className="h-4 w-4" />
                <span>اضغط على أي سؤال لإرساله تلقائياً والحصول على الإجابة</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            محادثة مع الذكاء الاصطناعي
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-[#183259] text-white' 
                    : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div className={`max-w-[70%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-[#183259] text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString('ar-SA', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب سؤالك هنا أو اختر من الاقتراحات أعلاه..."
                  disabled={isTyping || !selectedSurvey}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={isTyping || !question.trim() || !selectedSurvey}
                className="bg-[#183259] hover:bg-[#2a4a7a]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {!selectedSurvey && (
              <p className="text-xs text-orange-600 mt-2">
                يرجى اختيار استبيان أولاً لبدء المحادثة وعرض الأسئلة المقترحة
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderGeneralAnalysisTab = () => (
    <div className="space-y-6">
      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Trends Chart */}
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              اتجاهات الأداء الشهرية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={overallStatsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => `شهر ${label}`}
                  formatter={(value: any, name: string) => [
                    value,
                    name === 'beforeProgram' ? 'قبل البرنامج' :
                    name === 'afterProgram' ? 'بعد البرنامج' : 'معدل الرضا'
                  ]}
                />
                <Legend 
                  formatter={(value) => 
                    value === 'beforeProgram' ? 'قبل البرنامج' :
                    value === 'afterProgram' ? 'بعد البرنامج' : 'معدل الرضا'
                  }
                />
                <Line type="monotone" dataKey="beforeProgram" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="afterProgram" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="satisfaction" stroke="#183259" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Impact Distribution */}
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              توزيع الأثر حسب المجالات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'التعليم والثقافة', value: 35, fill: COLORS[0] },
                    { name: 'الصحة والبيئة', value: 25, fill: COLORS[1] },
                    { name: 'التمكين الاقتصادي', value: 25, fill: COLORS[2] },
                    { name: 'السكن والبنية التحتية', value: 15, fill: COLORS[3] }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({name, value}) => `${name}: ${value}%`}
                >
                  {demoInsights.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'النسبة']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>


    </div>
  );

  const renderBeforeAfterTab = () => (
    <div className="space-y-6">
      {/* Sector Selection */}
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            اختيار المجال للمقارنة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {sectorComparisonData.map((sector) => (
              <Button
                key={sector.sector}
                variant={selectedSector === sector.sector ? "default" : "outline"}
                onClick={() => setSelectedSector(sector.sector)}
                className={`h-auto p-4 text-center ${
                  selectedSector === sector.sector 
                    ? 'bg-[#183259] hover:bg-[#2a4a7a]' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="font-medium">{sector.sector}</div>
                  <div className="text-xs opacity-70">{sector.aspects.length} جوانب</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Sector Analysis */}
      {selectedSector && (() => {
        const sectorData = sectorComparisonData.find(s => s.sector === selectedSector);
        if (!sectorData) return null;

        return (
          <div className="space-y-6">
            {/* Sector Overview */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  مقارنة شاملة - {selectedSector}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={sectorData.aspects} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        value,
                        name === 'before' ? 'قبل البرنامج' : 'بعد البرنامج'
                      ]}
                    />
                    <Legend 
                      formatter={(value) => value === 'before' ? 'قبل البرنامج' : 'بعد البرنامج'}
                    />
                    <Bar dataKey="before" name="before" fill="#ef4444" />
                    <Bar dataKey="after" name="after" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Detailed Aspects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sectorData.aspects.map((aspect) => (
                <Card key={aspect.name} className="hover:shadow-lg transition-shadow shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">{aspect.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress Bars */}
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>قبل البرنامج</span>
                            <span>{aspect.before}/5</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full" 
                              style={{ width: `${(aspect.before / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>بعد البرنامج</span>
                            <span>{aspect.after}/5</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${(aspect.after / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Improvement Indicator */}
                      <div className="flex items-center justify-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            +{aspect.improvement}%
                          </div>
                          <div className="text-sm text-blue-700">نسبة التحسن</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );

  return (
    <EnhancedPageLayout
      pageId="analysis"
      userRole={userRole}
      description="اكتشف الرؤى القيمة من بيانات الاستبيانات باستخدام الذكاء الاصطناعي"
      icon={<Brain className="h-8 w-8" />}
      headerContent={headerStats}
    >
      <div className="space-y-8">
        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleExportAnalysis}
            disabled={isExporting}
          >
            <Download className={`h-4 w-4 ${isExporting ? 'animate-bounce' : ''}`} />
            {isExporting ? 'جاري التصدير...' : 'تصدير التحليل'}
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleRefreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'جاري التحديث...' : 'تحديث البيانات'}
          </Button>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-16 mb-8 bg-[#183259]/5 p-2 rounded-2xl border border-[#183259]/10">
            <TabsTrigger 
              value="ask-question" 
              className="flex items-center gap-3 text-base font-semibold rounded-xl data-[state=active]:bg-[#183259] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <MessageCircle className="h-5 w-5" />
              اسأل سؤالاً
            </TabsTrigger>
            <TabsTrigger 
              value="general-analysis" 
              className="flex items-center gap-3 text-base font-semibold rounded-xl data-[state=active]:bg-[#183259] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <BarChart3 className="h-5 w-5" />
              التحليل العام
            </TabsTrigger>
            <TabsTrigger 
              value="before-after" 
              className="flex items-center gap-3 text-base font-semibold rounded-xl data-[state=active]:bg-[#183259] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <Activity className="h-5 w-5" />
              مقارنة قبل/بعد
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ask-question">
            {renderAskQuestionTab()}
          </TabsContent>

          <TabsContent value="general-analysis">
            {renderGeneralAnalysisTab()}
          </TabsContent>

          <TabsContent value="before-after">
            {renderBeforeAfterTab()}
          </TabsContent>
        </Tabs>
      </div>
    </EnhancedPageLayout>
  );
}

export default AnalysisPage;