import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  ArrowRight, 
  CheckCircle,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Question {
  id: string;
  type: 'multiple_choice' | 'scale' | 'text' | 'yes_no';
  title: string;
  description?: string;
  required: boolean;
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: string[];
}

interface SurveyData {
  id: string;
  title: string;
  description: string;
  organizationName: string;
  organizationLogo?: string;
  estimatedTime: string;
  questions: Question[];
}

interface EnhancedSurveyInterfaceProps {
  surveyData?: SurveyData;
  onComplete?: (responses: Record<string, any>) => void;
  onBack?: () => void;
  onReturnToLanding?: () => void;
}

const mockSurveyData: SurveyData = {
  id: 'survey-001',
  title: 'استبيان قياس الأثر في التعليم',
  description: 'هذا الاستبيان يهدف إلى قياس أثر البرامج التعليمية على المستفيدين',
  organizationName: 'مؤسسة التعليم للجميع',
  estimatedTime: '5 دقائق',
  questions: [
    {
      id: 'q1',
      type: 'multiple_choice',
      title: 'ما هو مستواك التعليمي الحالي؟',
      description: 'اختر المستوى الذي يناسبك',
      required: true,
      options: ['ابتدائي', 'متوسط', 'ثانوي', 'جامعي', 'دراسات عليا']
    },
    {
      id: 'q2',
      type: 'scale',
      title: 'كيف تقيم جودة البرامج التعليمية المقدمة؟',
      description: 'من 1 (ضعيف جداً) إلى 5 (ممتاز)',
      required: true,
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: ['ضعيف جداً', 'ضعيف', 'متوسط', 'جيد', 'ممتاز']
    },
    {
      id: 'q3',
      type: 'yes_no',
      title: 'هل ساعدتك البرامج في تطوير مهاراتك؟',
      required: true
    },
    {
      id: 'q4',
      type: 'text',
      title: 'ما هي أهم المهارات التي اكتسبتها؟',
      description: 'اذكر المهارات التي تعلمتها من البرامج',
      required: false
    },
    {
      id: 'q5',
      type: 'multiple_choice',
      title: 'كيف علمت بالبرنامج؟',
      required: true,
      options: ['وسائل التواصل الاجتماعي', 'الأصدقاء والعائلة', 'الموقع الإلكتروني', 'الإعلانات', 'أخرى']
    },
    {
      id: 'q6',
      type: 'scale',
      title: 'ما مدى احتمالية توصيتك للبرنامج للآخرين؟',
      description: 'من 1 (لن أوصي بالمرة) إلى 10 (سأوصي بقوة)',
      required: true,
      scaleMin: 1,
      scaleMax: 10
    },
    {
      id: 'q7',
      type: 'text',
      title: 'اقتراحات لتحسين البرنامج',
      description: 'شاركنا أفكارك لتطوير البرنامج',
      required: false
    }
  ]
};

export function EnhancedSurveyInterface({
  surveyData = mockSurveyData,
  onComplete,
  onBack,
  onReturnToLanding
}: EnhancedSurveyInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [startTime] = useState(Date.now());
  const [showThankYou, setShowThankYou] = useState(false);
  const [completionTime, setCompletionTime] = useState('');
  const [showValidationError, setShowValidationError] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const currentQuestion = surveyData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / surveyData.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === surveyData.questions.length - 1;

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} دقيقة و ${remainingSeconds} ثانية`;
  };

  const handleResponseChange = (value: any) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
    setShowValidationError(false);
  };

  const validateCurrentQuestion = (): boolean => {
    if (currentQuestion.required) {
      const response = responses[currentQuestion.id];
      return response !== undefined && response !== '' && response !== null;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentQuestion()) {
      setShowValidationError(true);
      toast.error('هذا السؤال مطلوب، يرجى الإجابة عليه');
      return;
    }

    if (isLastQuestion) {
      handleComplete();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowValidationError(false);
    }
  };

  const handleComplete = () => {
    const endTime = Date.now();
    const duration = formatTime(endTime - startTime);
    setCompletionTime(duration);

    // Submit responses
    if (onComplete) {
      onComplete({
        ...responses,
        completionTime: duration,
        submittedAt: new Date().toISOString()
      });
    }

    // Reset countdown and show thank you popup
    setCountdown(3);
    setShowThankYou(true);
    toast.success('تم إرسال الاستبيان بنجاح! 🎉');
    
    // Auto-start countdown after showing the modal
    setTimeout(() => {
      handleCloseThankYou();
    }, 500); // Start countdown after half second to let user see the message
  };

  const handleCloseThankYou = () => {
    // Start countdown
    let currentCount = 3;
    setCountdown(currentCount);
    
    const countdownInterval = setInterval(() => {
      currentCount -= 1;
      setCountdown(currentCount);
      
      if (currentCount <= 0) {
        clearInterval(countdownInterval);
        setShowThankYou(false);
        
        // Return to landing page for beneficiaries
        if (onReturnToLanding) {
          onReturnToLanding();
        } else if (onBack) {
          onBack();
        } else {
          window.location.reload();
        }
      }
    }, 1000);
  };

  const renderQuestion = () => {
    const response = responses[currentQuestion.id];

    switch (currentQuestion.type) {
      case 'multiple_choice':
        return (
          <RadioGroup value={response || ''} onValueChange={handleResponseChange}>
            <div className="space-y-4">
              {currentQuestion.options?.map((option, index) => (
                <div 
                  key={index} 
                  className={`flex items-center space-x-2 space-x-reverse p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                    response === option 
                      ? 'border-white/60 bg-white/25 shadow-2xl backdrop-blur-sm ring-2 ring-white/40 ring-offset-2 ring-offset-[#18325A]' 
                      : 'border-white/20 bg-white/10 hover:bg-white/15 hover:border-white/30 hover:shadow-lg'
                  }`}
                >
                  <div className="relative">
                    <RadioGroupItem 
                      value={option} 
                      id={`option-${index}`} 
                      className={`w-6 h-6 border-2 transition-all duration-300 ${
                        response === option 
                          ? 'border-white text-[#18325A] bg-white shadow-lg' 
                          : 'border-white/60 text-white'
                      }`} 
                    />
                    {response === option && (
                      <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
                    )}
                  </div>
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-white font-medium">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );

      case 'scale':
        return (
          <div className="space-y-6">
            <div className="flex justify-between text-sm text-white/70">
              <span>{currentQuestion.scaleLabels?.[0] || currentQuestion.scaleMin}</span>
              <span>{currentQuestion.scaleLabels?.[currentQuestion.scaleLabels.length - 1] || currentQuestion.scaleMax}</span>
            </div>
            <RadioGroup value={response?.toString() || ''} onValueChange={(value) => handleResponseChange(parseInt(value))}>
              <div className="flex justify-between">
                {Array.from(
                  { length: (currentQuestion.scaleMax || 5) - (currentQuestion.scaleMin || 1) + 1 },
                  (_, i) => {
                    const value = (currentQuestion.scaleMin || 1) + i;
                    const isSelected = response === value;
                    return (
                      <div key={value} className="flex flex-col items-center space-y-3">
                        <div className={`p-3 rounded-full transition-all duration-300 relative ${
                          isSelected 
                            ? 'bg-white/25 border-2 border-white/60 shadow-2xl ring-2 ring-white/40 ring-offset-2 ring-offset-[#18325A]' 
                            : 'bg-white/10 border-2 border-white/20 hover:bg-white/15 hover:border-white/30 hover:shadow-lg'
                        }`}>
                          <RadioGroupItem 
                            value={value.toString()} 
                            id={`scale-${value}`} 
                            className={`w-7 h-7 transition-all duration-300 ${
                              isSelected 
                                ? 'border-white text-[#18325A] bg-white shadow-lg' 
                                : 'border-white/60 text-white'
                            }`} 
                          />
                          {isSelected && (
                            <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
                          )}
                        </div>
                        <Label htmlFor={`scale-${value}`} className="text-sm cursor-pointer font-medium text-white">
                          {value}
                        </Label>
                        {currentQuestion.scaleLabels?.[i] && (
                          <span className="text-xs text-white/70 text-center max-w-20 leading-tight">
                            {currentQuestion.scaleLabels[i]}
                          </span>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </RadioGroup>
          </div>
        );

      case 'yes_no':
        return (
          <RadioGroup value={response || ''} onValueChange={handleResponseChange}>
            <div className="flex gap-8 justify-center">
              <div className={`flex items-center space-x-2 space-x-reverse p-6 rounded-lg border-2 transition-all duration-300 cursor-pointer relative ${
                response === 'yes' 
                  ? 'border-white/60 bg-white/25 shadow-2xl backdrop-blur-sm ring-2 ring-white/40 ring-offset-2 ring-offset-[#18325A]' 
                  : 'border-white/20 bg-white/10 hover:bg-white/15 hover:border-white/30 hover:shadow-lg'
              }`}>
                <div className="relative">
                  <RadioGroupItem 
                    value="yes" 
                    id="yes" 
                    className={`w-6 h-6 border-2 transition-all duration-300 ${
                      response === 'yes' 
                        ? 'border-white text-[#18325A] bg-white shadow-lg' 
                        : 'border-white/60 text-white'
                    }`} 
                  />
                  {response === 'yes' && (
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
                  )}
                </div>
                <Label htmlFor="yes" className="cursor-pointer text-lg text-white font-medium">نعم</Label>
              </div>
              <div className={`flex items-center space-x-2 space-x-reverse p-6 rounded-lg border-2 transition-all duration-300 cursor-pointer relative ${
                response === 'no' 
                  ? 'border-white/60 bg-white/25 shadow-2xl backdrop-blur-sm ring-2 ring-white/40 ring-offset-2 ring-offset-[#18325A]' 
                  : 'border-white/20 bg-white/10 hover:bg-white/15 hover:border-white/30 hover:shadow-lg'
              }`}>
                <div className="relative">
                  <RadioGroupItem 
                    value="no" 
                    id="no" 
                    className={`w-6 h-6 border-2 transition-all duration-300 ${
                      response === 'no' 
                        ? 'border-white text-[#18325A] bg-white shadow-lg' 
                        : 'border-white/60 text-white'
                    }`} 
                  />
                  {response === 'no' && (
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
                  )}
                </div>
                <Label htmlFor="no" className="cursor-pointer text-lg text-white font-medium">لا</Label>
              </div>
            </div>
          </RadioGroup>
        );

      case 'text':
        return (
          <Textarea
            value={response || ''}
            onChange={(e) => handleResponseChange(e.target.value)}
            placeholder="اكتب إجابتك هنا..."
            className="min-h-32 resize-none text-lg bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-white/50 focus:bg-white/15"
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#18325A] arabic-text" dir="rtl">
        <div className="container mx-auto px-6 py-8 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              {surveyData.title}
            </h1>
            <p className="text-white/90 mb-6 text-lg text-center">
              هذا الاستبيان يهدف إلى قياس أثر البرامج التعليمية على المستفيدين
            </p>
            <div className="flex items-center justify-center">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20">{surveyData.organizationName}</Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-medium text-white">
                السؤال {currentQuestionIndex + 1} من {surveyData.questions.length}
              </span>
              <span className="text-sm text-white/70 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                {Math.round(progress)}%
              </span>
            </div>
            {/* شريط التقدم RTL */}
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden" dir="rtl">
              <div 
                className="h-full bg-gradient-to-l from-white to-white/80 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <Card className="mb-8 shadow-lg border-0 bg-white/10 backdrop-blur-md border border-white/20">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-3 flex items-center gap-2 text-white text-center">
                    {currentQuestion.title}
                    {currentQuestion.required && (
                      <span className="text-red-400 text-lg">*</span>
                    )}
                  </CardTitle>
                  {currentQuestion.description && (
                    <p className="text-white/80 text-center">
                      {currentQuestion.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  <HelpCircle className="h-4 w-4" />
                  <span>{currentQuestion.required ? 'مطلوب' : 'اختياري'}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {renderQuestion()}
              
              {/* Validation Error */}
              {showValidationError && currentQuestion.required && (
                <div className="mt-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg flex items-center gap-3 backdrop-blur-sm">
                  <AlertCircle className="h-5 w-5 text-red-300 flex-shrink-0" />
                  <span className="text-red-200">
                    هذا السؤال مطلوب، يرجى الإجابة عليه للمتابعة
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              size="lg"
              className="flex items-center gap-3 bg-white text-[#18325A] hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-lg"
            >
              {isLastQuestion ? 'إنهاء الاستبيان' : 'السؤال التالي'}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Answered Questions Indicator */}
          {Object.keys(responses).length > 0 && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 text-green-200 bg-green-500/20 px-4 py-2 rounded-full border border-green-400/30 backdrop-blur-sm">
                <CheckCircle className="h-4 w-4" />
                <span>تم الإجابة على {Object.keys(responses).length} من {surveyData.questions.length} أسئلة</span>
              </div>
            </div>
          )}

          {/* Survey Info Footer */}
          <div className="mt-12 pt-6 border-t border-white/20 text-center text-sm text-white/70">
            <p>جميع إجاباتك محمية ومشفرة - {surveyData.organizationName}</p>
          </div>
        </div>
      </div>

      {/* Thank You Modal */}
      <Dialog open={showThankYou} onOpenChange={() => {}}>
        <DialogContent className="max-w-md text-center bg-white" dir="rtl">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
              شكراً لمشاركتك! 🎉
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-lg text-gray-700">
              تم تسجيل إجاباتك بنجاح
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">وقت الإكمال:</span>
                <span className="font-medium">{completionTime}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">عدد الأسئلة المُجابة:</span>
                <span className="font-medium">{Object.keys(responses).length} من {surveyData.questions.length}</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-blue-800 font-medium mb-2">
                سيتم توجيهك إلى الصفحة الرئيسية خلال
              </p>
              <div className="text-3xl font-bold text-blue-600">
                {countdown}
              </div>
              <p className="text-sm text-blue-600 mt-1">ثانية</p>
            </div>

            <p className="text-sm text-gray-600">
              شكراً لك على وقتك ومساهمتك في تحسين خدماتنا
            </p>
          </div>

          <div className="pt-4 border-t">
            <Button 
              onClick={handleCloseThankYou}
              variant="outline"
              className="w-full"
              size="lg"
            >
              العودة الآن
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}