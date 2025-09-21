import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react';

interface Insight {
  type: 'positive' | 'negative' | 'neutral' | 'attention';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

interface InsightsPanelProps {
  insights: Insight[];
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'negative':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      case 'attention':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-green-50 border-green-200';
      case 'negative':
        return 'bg-red-50 border-red-200';
      case 'attention':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Badge className="bg-red-100 text-red-700">تأثير عالي</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700">تأثير متوسط</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-700">تأثير منخفض</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>الرؤى والملاحظات الرئيسية</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getInsightIcon(insight.type)}
                  <h4 className="font-medium">{insight.title}</h4>
                </div>
                {getImpactBadge(insight.impact)}
              </div>
              <p className="text-sm text-gray-600">{insight.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}