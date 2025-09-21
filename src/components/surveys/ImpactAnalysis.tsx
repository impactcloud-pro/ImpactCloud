import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CHART_COLORS } from './surveyResultsData';

interface ImpactSector {
  title: string;
  before: number;
  after: number;
  improvement: number;
  responses: Array<{
    question: string;
    before: number;
    after: number;
  }>;
}

interface ImpactAnalysisProps {
  impactData: Record<string, ImpactSector>;
}

export function ImpactAnalysis({ impactData }: ImpactAnalysisProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md" dir="rtl">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: pld.color }}>
              {`${pld.name}: ${pld.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (improvement < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return null;
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 50) return 'text-green-600';
    if (improvement > 20) return 'text-yellow-600';
    if (improvement > 0) return 'text-blue-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Overall Impact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(impactData).map(([key, sector]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{sector.title}</span>
                <div className="flex items-center gap-2">
                  {getImprovementIcon(sector.improvement)}
                  <Badge className={getImprovementColor(sector.improvement)}>
                    {sector.improvement > 0 ? '+' : ''}{sector.improvement}%
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">قبل البرنامج</span>
                  <span className="text-lg font-semibold text-red-600">{sector.before}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">بعد البرنامج</span>
                  <span className="text-lg font-semibold text-green-600">{sector.after}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(sector.after / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Impact Charts */}
      {Object.entries(impactData).map(([key, sector]) => (
        <Card key={`chart-${key}`}>
          <CardHeader>
            <CardTitle>تفاصيل التحسن - {sector.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={sector.responses.map(item => ({
                    question: item.question,
                    'قبل البرنامج': item.before,
                    'بعد البرنامج': item.after
                  }))}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="question" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                    domain={[0, 5]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="قبل البرنامج" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="بعد البرنامج" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}