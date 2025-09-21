import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Eye,
  BarChart3,
  Edit,
  Share2,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { Survey } from '../../App';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';

interface SurveyCardProps {
  survey: Survey;
  onViewSurvey: (surveyId: string) => void;
  onViewResults: (surveyId: string) => void;
  onEditSurvey: (surveyId: string) => void;
  onShareSurvey: (surveyId: string) => void;
  onDeleteSurvey?: (surveyId: string) => void;
}

export function SurveyCard({ 
  survey, 
  onViewSurvey, 
  onViewResults, 
  onEditSurvey, 
  onShareSurvey,
  onDeleteSurvey 
}: SurveyCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 ml-1" />
            نشط
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 ml-1" />
            مسودة
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <CheckCircle className="h-3 w-3 ml-1" />
            مكتمل
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="h-3 w-3 ml-1" />
            {status}
          </Badge>
        );
    }
  };

  const completionRate = survey.responses > 0 
    ? Math.round((survey.responses / 100) * 100) 
    : 0;

  const handleDelete = () => {
    if (onDeleteSurvey) {
      onDeleteSurvey(survey.id);
    }
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-2 line-clamp-2">{survey.title}</CardTitle>
              <p className="text-sm text-gray-600 mb-3">{survey.organization}</p>
              {getStatusBadge(survey.status)}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Survey Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>{survey.responses} رد</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{survey.createdAt.toLocaleDateString('ar-SA')}</span>
              </div>
            </div>

            {/* Progress Bar */}
            {survey.responses > 0 && (
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>معدل الاستجابة</span>
                  <span>{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#183259] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(completionRate, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Description */}
            {survey.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {survey.description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewSurvey(survey.id)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 ml-1" />
                عرض
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewResults(survey.id)}
                className="flex-1"
              >
                <BarChart3 className="h-4 w-4 ml-1" />
                النتائج
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditSurvey(survey.id)}
                className="px-3"
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShareSurvey(survey.id)}
                className="px-3"
              >
                <Share2 className="h-4 w-4" />
              </Button>

              {onDeleteSurvey && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="px-3 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="arabic-text">
          <DialogHeader>
            <DialogTitle className="text-red-600">تأكيد حذف الاستبيان</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف الاستبيان "{survey.title}"؟
              <br />
              هذا الإجراء لا يمكن التراجع عنه وسيتم فقدان جميع البيانات والردود المرتبطة بالاستبيان.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="flex-1"
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 ml-2" />
              حذف الاستبيان
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}