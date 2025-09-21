import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { 
  FileText,
  Users,
  Calendar,
  Send,
  X
} from 'lucide-react';
import { Survey } from '../../App';
import { getStatusColor, getStatusIcon, getStatusText, formatDate, getSectorTitle } from './utils';

interface SurveySelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  surveys: Survey[];
  onSendSurveys: (selectedSurveyIds: string[]) => void;
}

export function SurveySelectionDialog({ 
  isOpen, 
  onClose, 
  surveys,
  onSendSurveys 
}: SurveySelectionDialogProps) {
  const [selectedSurveys, setSelectedSurveys] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('mixed');

  // Group surveys by different categories
  const activeSurveys = surveys.filter(s => s.status === 'active');
  const completedSurveys = surveys.filter(s => s.status === 'completed');
  const recentSurveys = surveys.filter(s => {
    const daysDiff = (Date.now() - s.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30;
  });

  const getSurveysForTab = (tab: string): Survey[] => {
    switch (tab) {
      case 'mixed':
        return surveys; // All surveys mixed
      case 'active':
        return activeSurveys;
      case 'completed':
        return completedSurveys;
      case 'recent':
        return recentSurveys;
      default:
        return surveys;
    }
  };

  const handleSurveySelection = (surveyId: string, checked: boolean) => {
    if (checked) {
      setSelectedSurveys(prev => [...prev, surveyId]);
    } else {
      setSelectedSurveys(prev => prev.filter(id => id !== surveyId));
    }
  };

  const handleSelectAll = () => {
    const currentTabSurveys = getSurveysForTab(activeTab);
    const currentTabIds = currentTabSurveys.map(s => s.id);
    setSelectedSurveys(prev => {
      const otherTabSelections = prev.filter(id => !currentTabIds.includes(id));
      return [...otherTabSelections, ...currentTabIds];
    });
  };

  const handleDeselectAll = () => {
    const currentTabSurveys = getSurveysForTab(activeTab);
    const currentTabIds = currentTabSurveys.map(s => s.id);
    setSelectedSurveys(prev => prev.filter(id => !currentTabIds.includes(id)));
  };

  const handleSend = () => {
    if (selectedSurveys.length > 0) {
      onSendSurveys(selectedSurveys);
      setSelectedSurveys([]);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedSurveys([]);
    onClose();
  };

  const SurveyItem = ({ survey }: { survey: Survey }) => {
    const StatusIcon = getStatusIcon(survey.status);
    const isSelected = selectedSurveys.includes(survey.id);

    return (
      <Card className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary bg-blue-50' : 'hover:bg-gray-50'}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => handleSurveySelection(survey.id, !!checked)}
              className="mt-1"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-medium text-sm line-clamp-2 leading-5">
                  {survey.title}
                </h4>
                <Badge className={`${getStatusColor(survey.status)} flex items-center gap-1 text-xs shrink-0`}>
                  <StatusIcon className="h-3 w-3" />
                  {getStatusText(survey.status)}
                </Badge>
              </div>
              
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {survey.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{survey.organization}</span>
                <span>{formatDate(survey.createdAt)}</span>
              </div>
              
              <div className="flex items-center gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{survey.responses} ردود</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>{survey.preQuestions.length + survey.postQuestions.length} أسئلة</span>
                </div>
              </div>
              
              {survey.selectedSectors.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {survey.selectedSectors.slice(0, 2).map(sectorId => (
                    <Badge key={sectorId} variant="outline" className="text-xs">
                      {getSectorTitle(sectorId)}
                    </Badge>
                  ))}
                  {survey.selectedSectors.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{survey.selectedSectors.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            اختيار الاستبيانات للإرسال
          </DialogTitle>
          <DialogDescription>
            اختر الاستبيانات التي تريد إرسالها للمستفيدين من القوائم التالية
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="mixed">مجموعة مختلطة</TabsTrigger>
              <TabsTrigger value="active">الاستبيانات النشطة</TabsTrigger>
              <TabsTrigger value="completed">المكتملة</TabsTrigger>
              <TabsTrigger value="recent">الحديثة</TabsTrigger>
            </TabsList>

            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSelectAll}
                >
                  تحديد الكل
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDeselectAll}
                >
                  إلغاء التحديد
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                تم اختيار {selectedSurveys.length} من {getSurveysForTab(activeTab).length} استبيان
              </div>
            </div>

            {['mixed', 'active', 'completed', 'recent'].map(tab => (
              <TabsContent key={tab} value={tab} className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto max-h-96">
                  <div className="space-y-3 pr-2">
                    {getSurveysForTab(tab).length > 0 ? (
                      getSurveysForTab(tab).map(survey => (
                        <SurveyItem key={survey.id} survey={survey} />
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>لا توجد استبيانات في هذه المجموعة</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            إجمالي المحدد: {selectedSurveys.length} استبيان
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              إلغاء
            </Button>
            <Button 
              onClick={handleSend}
              disabled={selectedSurveys.length === 0}
              className="bg-[#183259] hover:bg-[#1a365d]"
            >
              إرسال ({selectedSurveys.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}