import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Plus,
  Search,
  FileText,
  Filter,
  X,
  RefreshCw,
  CheckCircle,
  Users,
  BarChart3
} from 'lucide-react';
import { Survey, UserRole } from '../App';
import { mockSurveys } from './surveys/constants';
import { SurveyCard } from './surveys/SurveyCard';
import { SurveyStats } from './surveys/SurveyStats';
import { EnhancedPageLayout } from './EnhancedPageLayout';
import { toast } from 'sonner';
interface SurveysPageProps {
  userRole: UserRole;
  onCreateSurvey: () => void;
  onEditSurvey: (surveyId: string) => void;
  onViewResults: (surveyId: string) => void;
  onViewSurvey: (surveyId: string) => void;
  onDuplicateSurvey: (surveyId: string) => void;
  onDeleteSurvey?: (surveyId: string) => void;
  onShareSurvey: (surveyId: string) => void;
  createdSurveys?: Survey[];
}

export function SurveysPage({ 
  userRole,
  onCreateSurvey, 
  onEditSurvey, 
  onViewResults, 
  onViewSurvey, 
  onDuplicateSurvey,
  onDeleteSurvey,
  onShareSurvey,
  createdSurveys = []
}: SurveysPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  
  // Enhanced filter states
  const [minResponses, setMinResponses] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Use the surveys passed from parent (includes both created and existing surveys)
  const allSurveys = createdSurveys;

  // Enhanced filter and sort surveys
  const filteredSurveys = allSurveys
    .filter(survey => {
      const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           survey.organization.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || survey.status === statusFilter;
      
      const matchesMinResponses = minResponses === '' || 
                                 survey.responses >= parseInt(minResponses);
      
      const matchesTitle = titleFilter === '' || 
                          survey.title.toLowerCase().includes(titleFilter.toLowerCase());
      
      const matchesDate = dateFilter === '' || 
                         new Date(survey.createdAt).toISOString().substr(0, 10) >= dateFilter;
      
      return matchesSearch && matchesStatus && matchesMinResponses && matchesTitle && matchesDate;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'responses':
          return b.responses - a.responses;
        default:
          return 0;
      }
    });

  const handleShareSurvey = (surveyId: string) => {
    onShareSurvey(surveyId);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortBy('date');
    setMinResponses('');
    setTitleFilter('');
    setDateFilter('');
  };

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || 
                          minResponses !== '' || titleFilter !== '' || dateFilter !== '';

  // Calculate statistics for header
  const stats = [
    {
      title: 'إجمالي الاستبيانات',
      value: allSurveys.length,
      icon: FileText,
      color: 'text-[#183259]'
    },
    {
      title: 'الاستبيانات النشطة',
      value: allSurveys.filter(s => s.status === 'active').length,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'إجمالي الاستجابات',
      value: allSurveys.reduce((sum, s) => sum + s.responses, 0),
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'متوسط الاستجابة',
      value: `${Math.round(allSurveys.reduce((sum, s) => sum + s.responses, 0) / Math.max(allSurveys.length, 1))}`,
      icon: BarChart3,
      color: 'text-orange-600'
    }
  ];

  // Header stats content for EnhancedPageLayout
  const headerStats = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <stat.icon className="h-6 w-6 text-white" />
            <div>
              <div className="text-2xl font-bold text-white arabic-numbers">{stat.value}</div>
              <div className="text-blue-200">{stat.title}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <EnhancedPageLayout
      pageId="surveys"
      userRole={userRole}
      description="إدارة ومتابعة استبيانات قياس الأثر الاجتماعي"
      icon={<FileText className="h-8 w-8" />}
      headerContent={headerStats}
    >
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div></div>
          <Button onClick={onCreateSurvey} className="bg-[#183259] hover:bg-[#2a4a7a]">
            <Plus className="h-4 w-4 ml-2" />
            إنشاء استبيان جديد
          </Button>
        </div>

        {/* Enhanced Filters - Single Row Layout */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="font-medium">الفلاتر والبحث</span>
                {hasActiveFilters && (
                  <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {filteredSurveys.length} نتيجة
                  </span>
                )}
              </div>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4 ml-1" />
                  مسح الفلاتر
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Main Search Field */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="البحث الشامل..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              
              {/* Response Count Filter */}
              <div>
                <Input
                  type="number"
                  placeholder="أدنى عدد ردود"
                  value={minResponses}
                  onChange={(e) => setMinResponses(e.target.value)}
                  className="text-center"
                />
              </div>

              {/* Title Filter */}
              <div>
                <Input
                  placeholder="فلترة بالعنوان"
                  value={titleFilter}
                  onChange={(e) => setTitleFilter(e.target.value)}
                />
              </div>

              {/* Date Filter */}
              <div>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="text-center"
                />
              </div>

              {/* Status and Sort Filters Row */}
              <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t">
                {/* Status Filter */}
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="حالة الاستبيان" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Filter */}
                <div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="ترتيب النتائج" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">الأحدث أولاً</SelectItem>
                      <SelectItem value="title">الترتيب الأبجدي</SelectItem>
                      <SelectItem value="responses">الأكثر رداً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 ml-1" />
                    إعادة تعيين
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {hasActiveFilters && (
          <div className="flex items-center gap-4 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <span>عرض {filteredSurveys.length} من أصل {allSurveys.length} استبيان</span>
            <div className="flex gap-2 text-xs">
              {searchTerm && <span className="bg-white px-2 py-1 rounded">البحث: {searchTerm}</span>}
              {statusFilter !== 'all' && <span className="bg-white px-2 py-1 rounded">الحالة: {statusFilter}</span>}
              {minResponses && <span className="bg-white px-2 py-1 rounded">الردود: {minResponses}+</span>}
              {titleFilter && <span className="bg-white px-2 py-1 rounded">العنوان: {titleFilter}</span>}
              {dateFilter && <span className="bg-white px-2 py-1 rounded">التاريخ: {dateFilter}</span>}
            </div>
          </div>
        )}

        {/* Surveys Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSurveys.map((survey) => (
            <SurveyCard 
              key={survey.id} 
              survey={survey}
              onViewSurvey={onViewSurvey}
              onViewResults={onViewResults}
              onEditSurvey={onEditSurvey}
              onShareSurvey={handleShareSurvey}
              onDeleteSurvey={onDeleteSurvey}
            />
          ))}
        </div>

        {filteredSurveys.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {hasActiveFilters ? 'لا توجد نتائج' : 'لا توجد استبيانات'}
              </h3>
              <p className="text-gray-600 mb-6">
                {hasActiveFilters
                  ? 'لم يتم العثور على استبيانات تطابق معايير البحث والفلترة المحددة'
                  : 'ابدأ بإنشاء أول استبيان لقياس الأثر الاجتماعي'
                }
              </p>
              <div className="flex gap-3 justify-center">
                {hasActiveFilters && (
                  <Button onClick={clearAllFilters} variant="outline">
                    <X className="h-4 w-4 ml-2" />
                    مسح الفلاتر
                  </Button>
                )}
                {!hasActiveFilters && (
                  <Button onClick={onCreateSurvey} className="bg-[#183259] hover:bg-[#1a365d]">
                    <Plus className="h-4 w-4 ml-2" />
                    إنشاء استبيان جديد
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </EnhancedPageLayout>
  );
}