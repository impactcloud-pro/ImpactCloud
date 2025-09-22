import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  ChevronRight, 
import { toast } from 'sonner';
  Clock,
  Users,
  CheckCircle,
  Star,
  Calendar
} from 'lucide-react';

interface Survey {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedTime: number;
  questions: Array<{
    id: string;
    type: 'text' | 'multiple_choice' | 'rating' | 'yes_no' | 'date';
    title: string;
    description?: string;
    required: boolean;
    options?: string[];
  }>;
}

const mockSurveys: Survey[] = [
  {
    id: '1',
    title: 'تقييم برنامج التدريب المهني',
    description: 'نود معرفة رأيك في البرنامج التدريبي الذي شاركت فيه لتحسين خدماتنا',
    category: 'التعليم',
    estimatedTime: 5,
    questions: [
      {
        id: '1',
        type: 'rating',
        title: 'كيف تقيم جودة البرنامج التدريبي بشكل عام؟',
        required: true
      },
      {
        id: '2',
        type: 'multiple_choice',
        title: 'ما هي أكثر المهارات التي استفدت منها؟',
        required: true,
        options: ['المهارات التقنية', 'مهارات التواصل', 'مهارات القيادة', 'المهارات التحليلية']
      },
      {
        id: '3',
        type: 'yes_no',
        title: 'هل تنصح الآخرين بالانضمام لهذا البرنامج؟',
        required: true
      },
      {
        id: '4',
        type: 'text',
        title: 'ما هي اقتراحاتك لتحسين البرنامج؟',
        required: false
      }
    ]
  },
  {
    id: '2',
    title: 'استبيان الخدمات الصحية',
    description: 'تقييم جودة الخدمات الصحية المقدمة في المركز',
    category: 'الصحة',
    estimatedTime: 8,
    questions: [
      {
        id: '1',
        type: 'rating',
        title: 'كيف تقيم جودة الرعاية الطبية المقدمة؟',
        required: true
      },
      {
        id: '2',
        type: 'multiple_choice',
        title: 'ما هي الخدمة التي تحتاج إلى تحسين؟',
        required: true,
        options: ['الاستقبال', 'المواعيد', 'جودة العلاج', 'التواصل مع الطاقم']
      }
    ]
  }
];

export function SurveyInterface() {
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (selectedSurvey && currentQuestion < selectedSurvey.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitSurvey = () => {
    console.log('Survey submitted:', answers);
    // Here you would typically send the data to your backend
    alert('تم إرسال الاستبيان بنجاح! شكراً لمشاركتك.');
    setSelectedSurvey(null);
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
  };

  const renderRatingInput = (questionId: string) => (
    <div className="flex gap-2 justify-center">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          onClick={() => handleAnswer(questionId, rating)}
          className={`p-2 transition-all ${
            answers[questionId] === rating
              ? 'text-yellow-500'
              : 'text-gray-300 hover:text-yellow-400'
          }`}
        >
          <Star className="h-8 w-8 fill-current" />
        </button>
      ))}
    </div>
  );

  const renderMultipleChoice = (questionId: string, options: string[]) => (
    <RadioGroup
      value={answers[questionId] || ''}
      onValueChange={(value) => handleAnswer(questionId, value)}
      className="space-y-3"
    >
      {options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2 space-x-reverse">
          <RadioGroupItem value={option} id={`${questionId}-${index}`} />
          <Label htmlFor={`${questionId}-${index}`} className="flex-1 cursor-pointer">
            {option}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );

  const renderYesNo = (questionId: string) => (
    <RadioGroup
      value={answers[questionId] || ''}
      onValueChange={(value) => handleAnswer(questionId, value)}
      className="flex gap-8 justify-center"
    >
      <div className="flex items-center space-x-2 space-x-reverse">
        <RadioGroupItem value="yes" id={`${questionId}-yes`} />
        <Label htmlFor={`${questionId}-yes`} className="cursor-pointer">نعم</Label>
      </div>
      <div className="flex items-center space-x-2 space-x-reverse">
        <RadioGroupItem value="no" id={`${questionId}-no`} />
        <Label htmlFor={`${questionId}-no`} className="cursor-pointer">لا</Label>
      </div>
    </RadioGroup>
  );

  const renderTextInput = (questionId: string) => (
    <Textarea
      value={answers[questionId] || ''}
      onChange={(e) => handleAnswer(questionId, e.target.value)}
      placeholder="اكتب إجابتك هنا..."
      className="text-right min-h-32"
    />
  );

  if (isCompleted && selectedSurvey) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardContent className="p-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[#183259] mb-4">
              شكراً لك!
            </h2>
            <p className="text-gray-600 mb-6">
              تم إرسال إجاباتك بنجاح. مشاركتك تساعدنا في تحسين خدماتنا.
            </p>
            <div className="space-y-4">
              <Button 
                onClick={submitSurvey}
                className="bg-[#183259] hover:bg-[#2a4a7a] w-full"
              >
                إرسال الاستبيان
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedSurvey(null);
                  setCurrentQuestion(0);
                  setAnswers({});
                  setIsCompleted(false);
                }}
                className="w-full"
              >
                العودة للاستبيانات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedSurvey) {
    const question = selectedSurvey.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedSurvey.questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                السؤال {currentQuestion + 1} من {selectedSurvey.questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} />
          </CardContent>
        </Card>

        {/* Question */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right">{question.title}</CardTitle>
            {question.description && (
              <p className="text-gray-600 text-right">{question.description}</p>
            )}
            {question.required && (
              <Badge variant="destructive" className="w-fit">مطلوب</Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {question.type === 'rating' && renderRatingInput(question.id)}
            {question.type === 'multiple_choice' && question.options && 
              renderMultipleChoice(question.id, question.options)}
            {question.type === 'yes_no' && renderYesNo(question.id)}
            {question.type === 'text' && renderTextInput(question.id)}
            {question.type === 'date' && (
              <Input
                type="date"
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                className="text-right"
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
          >
            <ChevronRight className="h-4 w-4 ml-2" />
            السابق
          </Button>
          
          <Button
            onClick={nextQuestion}
            disabled={question.required && !answers[question.id]}
            className="bg-[#183259] hover:bg-[#2a4a7a]"
          >
            {currentQuestion === selectedSurvey.questions.length - 1 ? 'إنهاء' : 'التالي'}
            <ChevronLeft className="h-4 w-4 mr-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#183259] mb-2">الاستبيانات المتاحة</h1>
        <p className="text-gray-600">شارك برأيك لمساعدتنا في تحسين خدماتنا</p>
      </div>

      {/* Surveys List */}
      <div className="grid gap-6 md:grid-cols-2">
        {mockSurveys.map((survey) => (
          <Card key={survey.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-right flex-1">{survey.title}</CardTitle>
                <Badge variant="outline">{survey.category}</Badge>
              </div>
              <p className="text-gray-600 text-right">{survey.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{survey.estimatedTime} دقائق</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{survey.questions.length} أسئلة</span>
                </div>
              </div>
              
              <Button 
                onClick={() => setSelectedSurvey(survey)}
                className="w-full bg-[#183259] hover:bg-[#2a4a7a]"
              >
                بدء الاستبيان
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockSurveys.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">
              لا توجد استبيانات متاحة حالياً
            </h3>
            <p className="text-gray-400">
              تحقق مرة أخرى لاحقاً للاستبيانات الجديدة
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}