import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';

import { ExportModal } from './ExportModal';
import { EnhancedPageLayout } from './EnhancedPageLayout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
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
  TrendingUp, 
  Users, 
  FileText, 
  Target,
  Filter,
  Download,
  RefreshCw,
  DollarSign,
  Home,
  Heart,
  GraduationCap,
  Briefcase,
  Building,
  Stethoscope,
  BookOpen,
  BarChart3,
  Calendar,
  Settings,
  Activity,
  Clock,
  UserPlus,
  Building2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Data for different impact sectors
const sectorData = {
  income_work: {
    title: 'الدخل والعمل',
    icon: Briefcase,
    color: '#183259',
    chartData: [
      { month: 'يناير', surveys: 35, responses: 650, impact: 72 },
      { month: 'فبراير', surveys: 42, responses: 890, impact: 78 },
      { month: 'مارس', surveys: 38, responses: 720, impact: 75 },
      { month: 'أبريل', surveys: 48, responses: 1100, impact: 82 },
      { month: 'مايو', surveys: 44, responses: 980, impact: 80 },
      { month: 'يونيو', surveys: 52, responses: 1250, impact: 85 }
    ],
    stats: [
      { title: 'عدد الاستبيانات', value: '259', change: '+15%', icon: FileText, color: 'text-[#183259]', bgColor: 'bg-blue-50' },
      { title: 'المستجيبين', value: '5,590', change: '+22%', icon: Users, color: 'text-green-600', bgColor: 'bg-green-50' },
      { title: 'معدل التوظيف', value: '78%', change: '+8%', icon: Target, color: 'text-orange-600', bgColor: 'bg-orange-50' },
      { title: 'متوسط الدخل', value: '₪3,200', change: '+12%', icon: DollarSign, color: 'text-purple-600', bgColor: 'bg-purple-50' }
    ],
    impactData: [
      { category: 'التوظيف المباشر', value: 45, color: '#183259' },
      { category: 'المشاريع الصغيرة', value: 30, color: '#2a4a7a' },
      { category: 'التدريب المهني', value: 15, color: '#4a6ba3' },
      { category: 'الاستشارات', value: 10, color: '#8da4c7' }
    ]
  },
  housing_infrastructure: {
    title: 'الإسكان والبنية التحتية',
    icon: Building,
    color: '#2a4a7a',
    chartData: [
      { month: 'يناير', surveys: 28, responses: 520, impact: 68 },
      { month: 'فبراير', surveys: 32, responses: 680, impact: 73 },
      { month: 'مارس', surveys: 29, responses: 590, impact: 70 },
      { month: 'أبريل', surveys: 36, responses: 820, impact: 76 },
      { month: 'مايو', surveys: 33, responses: 750, impact: 74 },
      { month: 'يونيو', surveys: 38, responses: 910, impact: 79 }
    ],
    stats: [
      { title: 'مشاريع البناء', value: '196', change: '+18%', icon: Building, color: 'text-[#183259]', bgColor: 'bg-blue-50' },
      { title: 'المستفيدين', value: '4,270', change: '+25%', icon: Users, color: 'text-green-600', bgColor: 'bg-green-50' },
      { title: 'تحسن الإسكان', value: '82%', change: '+10%', icon: Home, color: 'text-orange-600', bgColor: 'bg-orange-50' },
      { title: 'رضا السكان', value: '88%', change: '+6%', icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-50' }
    ],
    impactData: [
      { category: 'تطوير المساكن', value: 40, color: '#2a4a7a' },
      { category: 'البنية التحتية', value: 35, color: '#4a6ba3' },
      { category: 'المرافق العامة', value: 15, color: '#6b85cc' },
      { category: 'النقل', value: 10, color: '#8da4c7' }
    ]
  },
  health_environment: {
    title: 'الصحة والبيئة',
    icon: Heart,
    color: '#4a6ba3',
    chartData: [
      { month: 'يناير', surveys: 32, responses: 580, impact: 75 },
      { month: 'فبراير', surveys: 38, responses: 720, impact: 80 },
      { month: 'مارس', surveys: 35, responses: 650, impact: 77 },
      { month: 'أبريل', surveys: 42, responses: 850, impact: 83 },
      { month: 'مايو', surveys: 39, responses: 780, impact: 81 },
      { month: 'يونيو', surveys: 45, responses: 920, impact: 86 }
    ],
    stats: [
      { title: 'برامج صحية', value: '231', change: '+20%', icon: Stethoscope, color: 'text-[#183259]', bgColor: 'bg-blue-50' },
      { title: 'المستفيدين', value: '4,500', change: '+28%', icon: Users, color: 'text-green-600', bgColor: 'bg-green-50' },
      { title: 'تحسن الصحة', value: '85%', change: '+12%', icon: Heart, color: 'text-orange-600', bgColor: 'bg-orange-50' },
      { title: 'الوعي البيئي', value: '79%', change: '+9%', icon: Target, color: 'text-purple-600', bgColor: 'bg-purple-50' }
    ],
    impactData: [
      { category: 'الرعاية الصحية', value: 50, color: '#4a6ba3' },
      { category: 'التوعية الصحية', value: 25, color: '#6b85cc' },
      { category: 'حماية البيئة', value: 15, color: '#8da4c7' },
      { category: 'الصحة النفسية', value: 10, color: '#a8c0e8' }
    ]
  },
  education_culture: {
    title: 'التعليم والثقافة',
    icon: GraduationCap,
    color: '#6b85cc',
    chartData: [
      { month: 'يناير', surveys: 40, responses: 750, impact: 82 },
      { month: 'فبراير', surveys: 46, responses: 920, impact: 87 },
      { month: 'مارس', surveys: 43, responses: 840, impact: 84 },
      { month: 'أبريل', surveys: 52, responses: 1080, impact: 90 },
      { month: 'مايو', surveys: 48, responses: 980, impact: 88 },
      { month: 'يونيو', surveys: 55, responses: 1150, impact: 92 }
    ],
    stats: [
      { title: 'برامج تعليمية', value: '284', change: '+16%', icon: BookOpen, color: 'text-[#183259]', bgColor: 'bg-blue-50' },
      { title: 'الطلاب', value: '5,720', change: '+24%', icon: Users, color: 'text-green-600', bgColor: 'bg-green-50' },
      { title: 'معدل النجاح', value: '91%', change: '+7%', icon: Target, color: 'text-orange-600', bgColor: 'bg-orange-50' },
      { title: 'الأنشطة الثقافية', value: '156', change: '+13%', icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-50' }
    ],
    impactData: [
      { category: 'التعليم الأساسي', value: 45, color: '#6b85cc' },
      { category: 'التعليم المهني', value: 25, color: '#8da4c7' },
      { category: 'الأنشطة الثقافية', value: 20, color: '#a8c0e8' },
      { category: 'محو الأمية', value: 10, color: '#c2d1ed' }
    ]
  }
};

const chartData = [
  { month: 'يناير', surveys: 45, responses: 890, impact: 78 },
  { month: 'فبراير', surveys: 52, responses: 1200, impact: 82 },
  { month: 'مارس', surveys: 48, responses: 950, impact: 75 },
  { month: 'أبريل', surveys: 61, responses: 1450, impact: 88 },
  { month: 'مايو', surveys: 55, responses: 1300, impact: 85 },
  { month: 'يونيو', surveys: 67, responses: 1680, impact: 92 }
];

const impactData = [
  { category: 'التعليم', value: 35, color: '#183259' },
  { category: 'الصحة', value: 28, color: '#2a4a7a' },
  { category: 'البيئة', value: 22, color: '#4a6ba3' },
  { category: 'الاقتصاد', value: 15, color: '#8da4c7' }
];

interface DashboardProps {
  userRole: 'super_admin' | 'admin' | 'org_manager' | 'beneficiary';
}

export function Dashboard({ userRole }: DashboardProps) {
  // Global filters only
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [customDateRange, setCustomDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({from: undefined, to: undefined});
  const [activeTab, setActiveTab] = useState('overview');
  const [showExportModal, setShowExportModal] = useState(false);

  // Define overview stats based on user role and active tab
  const getOverviewStats = () => {
    if (userRole === 'super_admin') {
      return [
        {
          title: 'إجمالي عدد المستخدمين',
          value: '7,420',
          change: '+18%',
          trend: 'up',
          icon: Users,
          color: 'text-[#183259]',
          bgColor: 'bg-blue-50'
        },
        {
          title: 'المستخدمين النشطين',
          value: '5,823',
          change: '+22%',
          trend: 'up',
          icon: Activity,
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        },
        {
          title: 'المستخدمين الجدد هذا الشهر',
          value: '932',
          change: '+32%',
          trend: 'up',
          icon: UserPlus,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50'
        },
        {
          title: 'المنظمات المرتبطة',
          value: '89',
          change: '+15%',
          trend: 'up',
          icon: Building2,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50'
        }
      ];
    } else if (userRole === 'admin') {
      return [
        {
          title: 'إجمالي عدد المستخدمين',
          value: '5,841',
          change: '+15%',
          trend: 'up',
          icon: Users,
          color: 'text-[#183259]',
          bgColor: 'bg-blue-50'
        },
        {
          title: 'المستخدمين النشطين',
          value: '4,903',
          change: '+18%',
          trend: 'up',
          icon: Activity,
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        },
        {
          title: 'المستخدمين الجدد هذا الشهر',
          value: '687',
          change: '+25%',
          trend: 'up',
          icon: UserPlus,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50'
        },
        {
          title: 'المنظمات المرتبطة',
          value: '72',
          change: '+12%',
          trend: 'up',
          icon: Building2,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50'
        }
      ];
    } else {
      // For org_manager, show sector-specific stats based on activeTab
      if (activeTab !== 'overview' && sectorData[activeTab as keyof typeof sectorData]) {
        return sectorData[activeTab as keyof typeof sectorData].stats;
      }
      
      // Default overview stats for org_manager
      return [
        {
          title: 'استبيانات المنظمة',
          value: '156',
          change: '+12%',
          trend: 'up',
          icon: FileText,
          color: 'text-[#183259]',
          bgColor: 'bg-blue-50'
        },
        {
          title: 'مستفيدي المنظمة',
          value: '3,240',
          change: '+18%',
          trend: 'up',
          icon: Users,
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        },
        {
          title: 'مؤشر أثر المنظمة',
          value: '91%',
          change: '+5%',
          trend: 'up',
          icon: Target,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50'
        },
        {
          title: 'معدل الإكمال',
          value: '94%',
          change: '+3%',
          trend: 'up',
          icon: TrendingUp,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50'
        }
      ];
    }
  };

  const overviewStats = getOverviewStats();

  // Prepare export data
  const prepareExportData = () => {
    const currentSector = activeTab === 'overview' ? 'overview' : sectorData[activeTab as keyof typeof sectorData];
    
    // Adjust data based on user role
    const distributionData = userRole === 'super_admin' ? [
      { name: 'الدخل والعمل', value: 7850, color: '#183259' },
      { name: 'الإسكان والبنية', value: 5470, color: '#2a4a7a' },
      { name: 'الصحة والبيئة', value: 6900, color: '#4a6ba3' },
      { name: 'التعليم والثقافة', value: 8200, color: '#6b85cc' }
    ] : userRole === 'admin' ? [
      { name: 'الدخل والعمل', value: 5590, color: '#183259' },
      { name: 'الإسكان والبنية', value: 4270, color: '#2a4a7a' },
      { name: 'الصحة والبيئة', value: 4500, color: '#4a6ba3' },
      { name: 'التعليم والثقافة', value: 5720, color: '#6b85cc' }
    ] : [
      { name: 'الدخل والعمل', value: 820, color: '#183259' },
      { name: 'الإسكان والبنية', value: 730, color: '#2a4a7a' },
      { name: 'الصحة والبيئة', value: 740, color: '#4a6ba3' },
      { name: 'التعليم والثقافة', value: 950, color: '#6b85cc' }
    ];
    
    return {
      exportInfo: {
        exportDate: new Date().toISOString(),
        exportTime: new Date().toLocaleString('ar-SA'),
        userRole: userRole,
        selectedPeriod: selectedPeriod,
        activeTab: activeTab,
        exportedBy: `${userRole === 'super_admin' ? 'System Admin' : userRole === 'admin' ? 'Admin' : 'Organization Manager'} Dashboard`,
        version: '1.0'
      },
      overviewStats: overviewStats,
      currentTabData: activeTab === 'overview' ? {
        title: 'نظرة عامة',
        comparisonData: [
          { sector: 'الدخل والعمل', impact: 82 },
          { sector: 'الإسكان والبنية', impact: 76 },
          { sector: 'الصحة والبيئة', impact: 83 },
          { sector: 'التعليم والثقافة', impact: 88 }
        ],
        distributionData: distributionData
      } : {
        title: currentSector.title,
        stats: currentSector.stats,
        chartData: currentSector.chartData,
        impactData: currentSector.impactData
      },
      allSectorsData: sectorData
    };
  };

  // Custom tooltip component for RTL support
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

  // Apply global filters to data
  const applyGlobalFilters = (data: any[]) => {
    let filteredData = [...data];
    
    // Apply period filter
    if (selectedPeriod !== '6months') {
      const periodMap = {
        'today': 0.1,
        'week': 0.25,
        '1month': 1,
        '3months': 3,
        '6months': 6,
        '1year': 12
      };
      const months = periodMap[selectedPeriod as keyof typeof periodMap];
      if (months < 1) {
        // For today/week, show subset of data
        filteredData = filteredData.slice(-2);
      } else {
        filteredData = filteredData.slice(-Math.floor(months));
      }
    }
    
    // Apply status filter
    if (selectedStatus !== 'all') {
      // Filter based on status (could filter by impact level, completion status, etc.)
      filteredData = filteredData.filter(item => {
        if (selectedStatus === 'active') return item.impact >= 80;
        if (selectedStatus === 'inactive') return item.impact < 60;
        if (selectedStatus === 'completed') return item.impact >= 90;
        return true;
      });
    }
    
    return filteredData;
  };

  // Apply filters to overview stats
  const applyFiltersToStats = (stats: any[]) => {
    // Apply multipliers based on filters
    return stats.map(stat => {
      let multiplier = 1;
      
      // Apply period multiplier
      if (selectedPeriod === 'today') multiplier *= 0.03;
      else if (selectedPeriod === 'week') multiplier *= 0.23;
      else if (selectedPeriod === '1month') multiplier *= 0.5;
      else if (selectedPeriod === '3months') multiplier *= 0.75;
      else if (selectedPeriod === '1year') multiplier *= 1.5;
      
      // Apply status multiplier
      if (selectedStatus === 'active') multiplier *= 1.2;
      else if (selectedStatus === 'inactive') multiplier *= 0.4;
      else if (selectedStatus === 'completed') multiplier *= 1.1;
      
      // Apply multiplier to value
      let newValue = stat.value;
      if (typeof stat.value === 'string') {
        const numMatch = stat.value.match(/[\d,]+/);
        if (numMatch) {
          const number = parseInt(numMatch[0].replace(/,/g, ''));
          const adjustedNumber = Math.round(number * multiplier);
          newValue = stat.value.replace(/[\d,]+/, adjustedNumber.toLocaleString('ar-SA'));
        }
      }
      
      return {
        ...stat,
        value: newValue
      };
    });
  };

  // Helper function to render sector content with clean charts
  const renderSectorContent = (sectorKey: keyof typeof sectorData) => {
    const sector = sectorData[sectorKey];
    
    // Apply global filters
    const filteredChartData = applyGlobalFilters(sector.chartData);
    
    // Reverse data for RTL layout
    const reversedChartData = [...filteredChartData].reverse();
    
    return (
      <div className="space-y-6">
        {/* Sector Charts - Clean Design without Individual Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payments Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">المدفوعات حسب الوسيلة - {sector.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full" dir="rtl">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reversedChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ 
                        fontSize: 12, 
                        fill: '#666666',
                        textAnchor: 'middle'
                      }}
                    />
                    <YAxis 
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      tick={{ 
                        fontSize: 12, 
                        fill: '#666666' 
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="surveys" 
                      stroke={sector.color} 
                      fill={sector.color}
                      fillOpacity={0.6}
                      strokeWidth={2}
                      name="المدفوعات"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Beneficiaries Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">المستفيدين حسب الفئة - {sector.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full" dir="rtl">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <Pie
                      data={sector.impactData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ category, value, percent }) => `${category} ${value}%`}
                      labelStyle={{ 
                        fontSize: 11, 
                        fill: '#333333',
                        fontWeight: '500',
                        textAnchor: 'middle'
                      }}
                    >
                      {sector.impactData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Activities Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">الأنشطة حسب النوع - {sector.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full" dir="rtl">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reversedChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ 
                        fontSize: 12, 
                        fill: '#666666',
                        textAnchor: 'middle'
                      }}
                    />
                    <YAxis 
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      tick={{ 
                        fontSize: 12, 
                        fill: '#666666' 
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="responses" 
                      stroke={sector.color} 
                      strokeWidth={3}
                      dot={{ fill: sector.color, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: sector.color, strokeWidth: 2 }}
                      name="الأنشطة"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Impact Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">مؤشر الأثر - {sector.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full" dir="rtl">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reversedChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ 
                        fontSize: 12, 
                        fill: '#666666',
                        textAnchor: 'middle'
                      }}
                    />
                    <YAxis 
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      tick={{ 
                        fontSize: 12, 
                        fill: '#666666' 
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="impact" 
                      fill={sector.color}
                      radius={[4, 4, 0, 0]}
                      name="مؤشر الأثر"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Header stats content for EnhancedPageLayout
  const headerStats = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
      {applyFiltersToStats(overviewStats).map((stat, index) => (
        <div key={index} className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <stat.icon className="h-6 w-6 text-white" />
            <div>
              <div className="text-2xl font-bold text-white arabic-numbers">{stat.value}</div>
              <div className="text-blue-200">{stat.title}</div>
              <div className="text-xs text-blue-300 arabic-numbers">{stat.change} عن الشهر الماضي</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <EnhancedPageLayout
      pageId="dashboard"
      userRole={userRole}
      description={userRole === 'super_admin' ? 'نظرة شاملة على المستخدمين وإحصائيات النظام' : 
                   userRole === 'admin' ? 'نظرة شاملة على المستخدمين ومجالات قياس الأثر' :
                   'متابعة أنشطة المنظمة ومؤشرات الأثر'}
      icon={<BarChart3 className="h-8 w-8" />}
      headerContent={headerStats}
    >
      {/* Organization Manager Layout: Filters, then Charts */}
      {userRole === 'org_manager' ? (
        <>
          {/* Global Filters */}
          <div className="bg-gradient-to-r from-white to-gray-50/50 p-6 rounded-2xl border border-gray-100 mb-8 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#183259]/10 rounded-xl">
                <Filter className="h-5 w-5 text-[#183259]" />
              </div>
              <h3 className="text-xl font-bold text-[#183259]">الفلاتر العامة</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">تطبق على جميع الرسوم البيانية</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Time Period Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                  <Calendar className="h-4 w-4 text-[#183259]" />
                  النطاق الزمني
                </Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="border-gray-200 focus:ring-[#183259]/20 focus:border-[#183259] rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">اليوم</SelectItem>
                    <SelectItem value="week">الأسبوع</SelectItem>
                    <SelectItem value="1month">الشهر</SelectItem>
                    <SelectItem value="3months">3 أشهر</SelectItem>
                    <SelectItem value="6months">6 أشهر</SelectItem>
                    <SelectItem value="1year">سنة كاملة</SelectItem>
                    <SelectItem value="custom">نطاق مخصص</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                  <Activity className="h-4 w-4 text-[#183259]" />
                  الحالة
                </Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="border-gray-200 focus:ring-[#183259]/20 focus:border-[#183259] rounded-xl">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Export Button */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                  <Download className="h-4 w-4 text-[#183259]" />
                  تصدير البيانات
                </Label>
                <Button 
                  onClick={() => setShowExportModal(true)}
                  className="w-full bg-[#183259] hover:bg-[#2a4a7a] text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  size="lg"
                >
                  <Download className="h-4 w-4 ml-2" />
                  تصدير التقرير
                </Button>
              </div>
            </div>
          </div>

          {/* Dashboard Tabs for Different Sectors */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="dashboard-tabs-list grid w-full grid-cols-5 mb-8 bg-gray-50 p-1 rounded-2xl border border-gray-200 shadow-sm">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-gray-200 rounded-xl transition-all duration-300"
              >
                <BarChart3 className="h-4 w-4 ml-2" />
                نظرة عامة
              </TabsTrigger>
              <TabsTrigger 
                value="income_work" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-gray-200 rounded-xl transition-all duration-300"
              >
                <Briefcase className="h-4 w-4 ml-2" />
                الدخل والعمل
              </TabsTrigger>
              <TabsTrigger 
                value="housing_infrastructure" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-gray-200 rounded-xl transition-all duration-300"
              >
                <Building className="h-4 w-4 ml-2" />
                الإسكان والبنية
              </TabsTrigger>
              <TabsTrigger 
                value="health_environment" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-gray-200 rounded-xl transition-all duration-300"
              >
                <Heart className="h-4 w-4 ml-2" />
                الصحة والبيئة
              </TabsTrigger>
              <TabsTrigger 
                value="education_culture" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-gray-200 rounded-xl transition-all duration-300"
              >
                <GraduationCap className="h-4 w-4 ml-2" />
                التعليم والثقافة
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Main Chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-right flex items-center gap-3">
                      <BarChart3 className="h-6 w-6 text-[#183259]" />
                      تطور الأداء الشهري
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] w-full" dir="rtl">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart 
                          data={[...applyGlobalFilters(chartData)].reverse()} 
                          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorSurveys" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#183259" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#183259" stopOpacity={0.2}/>
                            </linearGradient>
                            <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2a4a7a" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#2a4a7a" stopOpacity={0.2}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ 
                              fontSize: 12, 
                              fill: '#666666',
                              textAnchor: 'middle'
                            }}
                          />
                          <YAxis 
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{ 
                              fontSize: 12, 
                              fill: '#666666' 
                            }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Area 
                            type="monotone" 
                            dataKey="surveys" 
                            stackId="1"
                            stroke="#183259" 
                            fill="url(#colorSurveys)"
                            strokeWidth={2}
                            name="الاستبيانات"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="responses" 
                            stackId="1"
                            stroke="#2a4a7a" 
                            fill="url(#colorResponses)"
                            strokeWidth={2}
                            name="الاستجابات"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Impact Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right flex items-center gap-3">
                      <Target className="h-6 w-6 text-[#183259]" />
                      توزيع مجالات الأثر
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full" dir="rtl">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={impactData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ category, value }) => `${category} (${value}%)`}
                            labelStyle={{ 
                              fontSize: 11, 
                              fill: '#333333',
                              fontWeight: '500'
                            }}
                          >
                            {impactData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right flex items-center gap-3">
                      <TrendingUp className="h-6 w-6 text-[#183259]" />
                      مقارنة الأداء
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full" dir="rtl">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={[
                            { sector: 'الدخل والعمل', impact: 82 },
                            { sector: 'الإسكان والبنية', impact: 76 },
                            { sector: 'الصحة والبيئة', impact: 83 },
                            { sector: 'التعليم والثقافة', impact: 88 }
                          ]}
                          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="sector" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ 
                              fontSize: 10, 
                              fill: '#666666',
                              textAnchor: 'middle'
                            }}
                          />
                          <YAxis 
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{ 
                              fontSize: 12, 
                              fill: '#666666' 
                            }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="impact" 
                            fill="#183259"
                            radius={[4, 4, 0, 0]}
                            name="مؤشر الأثر"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Individual Sector Tabs */}
            <TabsContent value="income_work" className="space-y-6">
              {renderSectorContent('income_work')}
            </TabsContent>

            <TabsContent value="housing_infrastructure" className="space-y-6">
              {renderSectorContent('housing_infrastructure')}
            </TabsContent>

            <TabsContent value="health_environment" className="space-y-6">
              {renderSectorContent('health_environment')}
            </TabsContent>

            <TabsContent value="education_culture" className="space-y-6">
              {renderSectorContent('education_culture')}
            </TabsContent>
          </Tabs>
        </>
      ) : (
        /* Super Admin and Admin Layout: Filters and Comprehensive Charts */
        <>
          {/* Global Filters */}
          <div className="bg-gradient-to-r from-white to-gray-50/50 p-6 rounded-2xl border border-gray-100 mb-8 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#183259]/10 rounded-xl">
                <Filter className="h-5 w-5 text-[#183259]" />
              </div>
              <h3 className="text-xl font-bold text-[#183259]">الفلاتر العامة</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">تطبق على جميع الرسوم البيانية</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Time Period Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                  <Calendar className="h-4 w-4 text-[#183259]" />
                  النطاق الزمني
                </Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="border-gray-200 focus:ring-[#183259]/20 focus:border-[#183259] rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">اليوم</SelectItem>
                    <SelectItem value="week">الأسبوع</SelectItem>
                    <SelectItem value="1month">الشهر</SelectItem>
                    <SelectItem value="3months">3 أشهر</SelectItem>
                    <SelectItem value="6months">6 أشهر</SelectItem>
                    <SelectItem value="1year">سنة كاملة</SelectItem>
                    <SelectItem value="custom">نطاق مخصص</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                  <Activity className="h-4 w-4 text-[#183259]" />
                  الحالة
                </Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="border-gray-200 focus:ring-[#183259]/20 focus:border-[#183259] rounded-xl">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Refresh Button */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                  <RefreshCw className="h-4 w-4 text-[#183259]" />
                  تحديث البيانات
                </Label>
                <Button 
                  variant="outline"
                  onClick={() => toast.success('تم تحديث البيانات بنجاح')}
                  className="w-full border-gray-200 hover:bg-gray-50 rounded-xl transition-all duration-300"
                  size="lg"
                >
                  <RefreshCw className="h-4 w-4 ml-2" />
                  تحديث
                </Button>
              </div>

              {/* Export Button */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                  <Download className="h-4 w-4 text-[#183259]" />
                  تصدير البيانات
                </Label>
                <Button 
                  onClick={() => setShowExportModal(true)}
                  className="w-full bg-[#183259] hover:bg-[#2a4a7a] text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  size="lg"
                >
                  <Download className="h-4 w-4 ml-2" />
                  تصدير التقرير
                </Button>
              </div>
            </div>
          </div>

          {/* Main Dashboard Content - Super Admin and Admin */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* System Overview Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-[#183259]" />
                  {userRole === 'super_admin' ? 'نظرة عامة على النظام' : 'نظرة عامة على المستخدمين'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full" dir="rtl">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={[...applyGlobalFilters(chartData)].reverse()} 
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorSurveys" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#183259" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#183259" stopOpacity={0.2}/>
                        </linearGradient>
                        <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2a4a7a" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#2a4a7a" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ 
                          fontSize: 12, 
                          fill: '#666666',
                          textAnchor: 'middle'
                        }}
                      />
                      <YAxis 
                        orientation="right"
                        axisLine={false}
                        tickLine={false}
                        tick={{ 
                          fontSize: 12, 
                          fill: '#666666' 
                        }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="surveys" 
                        stackId="1"
                        stroke="#183259" 
                        fill="url(#colorSurveys)"
                        strokeWidth={2}
                        name="الاستبيانات"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="responses" 
                        stackId="1"
                        stroke="#2a4a7a" 
                        fill="url(#colorResponses)"
                        strokeWidth={2}
                        name="الاستجابات"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Sector Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-3">
                  <Target className="h-6 w-6 text-[#183259]" />
                  توزيع المجالات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full" dir="rtl">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={impactData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ category, value }) => `${category} (${value}%)`}
                        labelStyle={{ 
                          fontSize: 11, 
                          fill: '#333333',
                          fontWeight: '500'
                        }}
                      >
                        {impactData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-[#183259]" />
                  اتجاهات الأداء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full" dir="rtl">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={[...applyGlobalFilters(chartData)].reverse()} 
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ 
                          fontSize: 12, 
                          fill: '#666666',
                          textAnchor: 'middle'
                        }}
                      />
                      <YAxis 
                        orientation="right"
                        axisLine={false}
                        tickLine={false}
                        tick={{ 
                          fontSize: 12, 
                          fill: '#666666' 
                        }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="impact" 
                        stroke="#183259" 
                        strokeWidth={3}
                        dot={{ fill: '#183259', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#183259', strokeWidth: 2 }}
                        name="مؤشر الأثر"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        exportData={prepareExportData()}
        title={`تقرير لوحة التحكم - ${userRole === 'super_admin' ? 'مدير النظام' : userRole === 'admin' ? 'المدير' : 'مدير المنظمة'}`}
      />
    </EnhancedPageLayout>
  );
}