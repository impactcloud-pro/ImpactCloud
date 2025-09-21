import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  ArrowRight,
  Download,
  Filter,
  RefreshCw,
  LineChart,
  BarChart3,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  Users,
  Calendar,
  Target,
  TrendingUp
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Import components and data
import { mockSurveyResults } from './surveys/surveyResultsData';
import { ResultsOverviewStats } from './surveys/ResultsOverviewStats';
import { DemographicsCharts } from './surveys/DemographicsCharts';
import { ImpactAnalysis } from './surveys/ImpactAnalysis';
import { InsightsPanel } from './surveys/InsightsPanel';
import { EnhancedPageLayout } from './EnhancedPageLayout';

interface SurveyResultsPageProps {
  surveyId: string;
  onBack: () => void;
  onBackToSurvey?: (surveyId: string) => void;
}

export function SurveyResultsPage({ surveyId, onBack, onBackToSurvey }: SurveyResultsPageProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const results = mockSurveyResults; // In real app, fetch by surveyId

  // Apply filters to data
  const applyFilters = (data: any[]) => {
    let filteredData = [...data];
    
    // Apply period filter
    if (selectedPeriod !== 'all') {
      const now = new Date();
      let filterDate = new Date();
      
      switch (selectedPeriod) {
        case 'last-week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'last-month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'last-quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        default:
          break;
      }
      
      // For trends data, we'll simulate filtering by showing only recent data
      if (selectedPeriod === 'last-week') {
        filteredData = filteredData.slice(-2);
      } else if (selectedPeriod === 'last-month') {
        filteredData = filteredData.slice(-4);
      } else if (selectedPeriod === 'last-quarter') {
        filteredData = filteredData.slice(-6);
      }
    }
    
    return filteredData;
  };

  // Apply filter to results data
  const getFilteredResults = () => {
    let filteredResults = { ...results };
    
    // Apply participant filter
    if (selectedFilter !== 'all') {
      const multiplier = selectedFilter === 'completed' ? 0.8 : 0.2;
      filteredResults = {
        ...filteredResults,
        totalResponses: Math.round(results.totalResponses * multiplier),
        completionRate: selectedFilter === 'completed' ? 100 : 
                       selectedFilter === 'partial' ? Math.round(results.completionRate * 0.4) : 
                       results.completionRate,
        trendsData: applyFilters(results.trendsData).map(item => ({
          ...item,
          responses: Math.round(item.responses * multiplier),
          satisfaction: selectedFilter === 'completed' ? 
                       Math.min(100, item.satisfaction * 1.1) : 
                       item.satisfaction * 0.8
        }))
      };
    } else {
      filteredResults = {
        ...filteredResults,
        trendsData: applyFilters(results.trendsData)
      };
    }
    
    return filteredResults;
  };

  const filteredResults = getFilteredResults();

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

  const handleExport = (format: 'excel' | 'pdf') => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      // Create a dummy file download
      const fileName = format === 'excel' 
        ? `survey-results-${surveyId}.xlsx`
        : `survey-results-${surveyId}.pdf`;
      
      // In a real application, you would generate and download the actual file
      const link = document.createElement('a');
      link.href = '#'; // This would be the actual file URL
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      setShowExportDialog(false);
      
      // Show success message
      console.log(`تم تصدير النتائج بصيغة ${format === 'excel' ? 'Excel' : 'PDF'} بنجاح!`);
    }, 2000);
  };

  const handleBackClick = () => {
    if (onBackToSurvey) {
      onBackToSurvey(surveyId);
    } else {
      onBack();
    }
  };

  // Header stats for the page layout
  const headerStats = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white arabic-numbers">{filteredResults.totalResponses}</div>
            <div className="text-blue-200">إجمالي الاستجابات</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white arabic-numbers">{filteredResults.completionRate}%</div>
            <div className="text-blue-200">معدل الإكمال</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white arabic-numbers">{results.averageCompletionTime}</div>
            <div className="text-blue-200">متوسط وقت الإكمال</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <EnhancedPageLayout
      title="نتائج الاستبيان"
      breadcrumbs={[
        { label: 'الاستبيانات', href: '#', onClick: onBack },
        { label: 'نتائج الاستبيان', href: '#' }
      ]}
      headerContent={headerStats}
      icon={<BarChart3 className="h-8 w-8" />}
      description="تحليل شامل لاستجابات المستفيدين"
    >
      <div className="space-y-8">
        {/* Back Button and Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBackClick}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            العودة إلى الاستبيان
          </Button>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowExportDialog(true)}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              تصدير النتائج
            </Button>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              تحديث
            </Button>
          </div>
        </div>

        {/* Survey Info */}
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#183259] mb-3">{results.title}</h2>
                <p className="text-gray-600 mb-4 text-lg">{results.organization}</p>
                <div className="flex items-center gap-6 text-base text-gray-500">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    آخر تحديث: {results.lastUpdated.toLocaleDateString('ar-SA')}
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    الحالة: نشط
                  </span>
                </div>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600">معرف الاستبيان</p>
                <p className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-lg">{results.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Filter className="h-5 w-5 text-[#183259]" />
                  <span className="text-lg font-semibold text-[#183259]">الفلاتر:</span>
                </div>
                
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-48 h-12 rounded-xl border-[#183259]/20 focus:border-[#183259]">
                    <SelectValue placeholder="الفترة الزمنية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفترات</SelectItem>
                    <SelectItem value="last-week">الأسبوع الماضي</SelectItem>
                    <SelectItem value="last-month">الشهر الماضي</SelectItem>
                    <SelectItem value="last-quarter">الربع الماضي</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-48 h-12 rounded-xl border-[#183259]/20 focus:border-[#183259]">
                    <SelectValue placeholder="فلترة المشاركين" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المشاركين</SelectItem>
                    <SelectItem value="completed">مكتملة فقط</SelectItem>
                    <SelectItem value="partial">جزئية فقط</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter Status Indicator */}
              {(selectedPeriod !== 'all' || selectedFilter !== 'all') && (
                <div className="flex items-center gap-3 text-base text-blue-600 bg-blue-50 px-6 py-3 rounded-xl border border-blue-200">
                  <CheckCircle className="h-5 w-5" />
                  <span>تم تطبيق الفلاتر</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setSelectedPeriod('all');
                      setSelectedFilter('all');
                    }}
                    className="h-8 w-8 p-0 ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <ResultsOverviewStats
          totalResponses={filteredResults.totalResponses}
          totalBeneficiaries={results.totalBeneficiaries}
          completionRate={filteredResults.completionRate}
          averageCompletionTime={results.averageCompletionTime}
          lastUpdated={results.lastUpdated}
        />

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-16 mb-8 bg-[#183259]/5 p-2 rounded-2xl border border-[#183259]/10">
            <TabsTrigger 
              value="overview"
              className="flex items-center gap-3 text-base font-semibold rounded-xl data-[state=active]:bg-[#183259] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <BarChart3 className="h-5 w-5" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger 
              value="demographics"
              className="flex items-center gap-3 text-base font-semibold rounded-xl data-[state=active]:bg-[#183259] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <Users className="h-5 w-5" />
              التركيبة السكانية
            </TabsTrigger>
            <TabsTrigger 
              value="impact"
              className="flex items-center gap-3 text-base font-semibold rounded-xl data-[state=active]:bg-[#183259] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <Target className="h-5 w-5" />
              تحليل الأثر
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-8">
              {/* Trends Chart */}
              <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="border-b border-[#183259]/10 pb-6">
                  <CardTitle className="flex items-center gap-4 text-2xl text-[#183259]">
                    <div className="p-3 bg-[#183259] rounded-2xl">
                      <LineChart className="h-6 w-6 text-white" />
                    </div>
                    اتجاهات الاستجابة
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart 
                        data={filteredResults.trendsData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 14, fill: '#666' }}
                        />
                        <YAxis 
                          orientation="right"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 14, fill: '#666' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="responses" 
                          stroke="#183259" 
                          strokeWidth={4}
                          dot={{ fill: '#183259', strokeWidth: 2, r: 6 }}
                          name="عدد الاستجابات"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="satisfaction" 
                          stroke="#22c55e" 
                          strokeWidth={4}
                          dot={{ fill: '#22c55e', strokeWidth: 2, r: 6 }}
                          name="معدل الرضا"
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Analysis Summary */}

            </div>
          </TabsContent>

          <TabsContent value="demographics">
            <DemographicsCharts demographics={results.demographics} />
          </TabsContent>

          <TabsContent value="impact">
            <ImpactAnalysis impactData={results.impactData} />
          </TabsContent>
        </Tabs>

        {/* Export Dialog */}
        <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
          <DialogContent className="max-w-lg arabic-text" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-[#183259]">تصدير نتائج الاستبيان</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <p className="text-gray-600 text-base">اختر صيغة التصدير المطلوبة:</p>
              
              <div className="grid grid-cols-1 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-6 justify-start border-2 border-gray-200 hover:border-[#183259] hover:bg-[#183259]/5 rounded-2xl transition-all duration-200"
                  onClick={() => handleExport('excel')}
                  disabled={isExporting}
                >
                  <div className="flex items-center gap-4">
                    <FileSpreadsheet className="h-10 w-10 text-green-600" />
                    <div className="text-right">
                      <div className="font-semibold text-lg">ملف Excel (.xlsx)</div>
                      <div className="text-base text-gray-500">مناسب للتحليل والمعالجة الإضافية</div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-6 justify-start border-2 border-gray-200 hover:border-[#183259] hover:bg-[#183259]/5 rounded-2xl transition-all duration-200"
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                >
                  <div className="flex items-center gap-4">
                    <FileText className="h-10 w-10 text-red-600" />
                    <div className="text-right">
                      <div className="font-semibold text-lg">ملف PDF</div>
                      <div className="text-base text-gray-500">مناسب للعرض والطباعة</div>
                    </div>
                  </div>
                </Button>
              </div>

              {isExporting && (
                <div className="flex items-center justify-center py-6">
                  <div className="flex items-center gap-4 text-[#183259]">
                    <div className="w-6 h-6 border-2 border-[#183259] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-lg">جاري تصدير الملف...</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowExportDialog(false)}
                  disabled={isExporting}
                  className="flex-1 h-12 rounded-xl"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </EnhancedPageLayout>
  );
}

export default SurveyResultsPage;