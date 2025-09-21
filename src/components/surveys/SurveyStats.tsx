import React from 'react';
import { Card, CardContent } from '../ui/card';
import { 
  FileText,
  PlayCircle,
  Users,
  CheckCircle
} from 'lucide-react';
import { Survey } from '../../App';

interface SurveyStatsProps {
  surveys: Survey[];
}

export function SurveyStats({ surveys }: SurveyStatsProps) {
  const totalSurveys = surveys.length;
  const activeSurveys = surveys.filter(s => s.status === 'active').length;
  const totalResponses = surveys.reduce((total, survey) => total + survey.responses, 0);
  const completedSurveys = surveys.filter(s => s.status === 'completed').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي الاستبيانات</p>
              <p className="text-2xl font-semibold">{totalSurveys}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <PlayCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">الاستبيانات النشطة</p>
              <p className="text-2xl font-semibold">{activeSurveys}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي الردود</p>
              <p className="text-2xl font-semibold">{totalResponses}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">الاستبيانات المكتملة</p>
              <p className="text-2xl font-semibold">{completedSurveys}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}