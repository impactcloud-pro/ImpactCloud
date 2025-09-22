import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ExportModal } from './ExportModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
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
  Users, 
  Building2, 
  CreditCard, 
  Activity,
  Filter,
  Download,
  RefreshCw,
  Server,
  Database,
  TrendingUp,
  Calendar,
  Globe,
  Settings,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Search,
  X
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data for system metrics
const systemStats = [
  {
    title: 'إجمالي المستخدمين',
    value: '2,847',
    change: '+18%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'المستخدمين المسجلين في النظام'
  },
  {
    title: 'المستخدمين النشطين',
    value: '1,923',
    change: '+12%',
    trend: 'up',
    icon: Activity,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'نشطين خلال آخر 30 يوم'
  },
  {
    title: 'إجمالي الاشتراكات',
    value: '156',
    change: '+25%',
    trend: 'up',
    icon: CreditCard,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'اشتراكات نشطة ومدفوعة'
  },
  {
    title: 'إجمالي المنظمات',
    value: '89',
    change: '+15%',
    trend: 'up',
    icon: Building2,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'منظمات مسجلة في النظام'
  }
];

const subscriptionData = [
  { month: 'يناير', basic: 35, professional: 42, enterprise: 8, revenue: 125000 },
  { month: 'فبراير', basic: 38, professional: 48, enterprise: 12, revenue: 142000 },
  { month: 'مارس', basic: 42, professional: 52, enterprise: 15, revenue: 165000 },
  { month: 'أبريل', basic: 39, professional: 58, enterprise: 18, revenue: 178000 },
  { month: 'مايو', basic: 45, professional: 61, enterprise: 22, revenue: 195000 },
  { month: 'يونيو', basic: 48, professional: 67, enterprise: 25, revenue: 218000 }
];

const userActivityData = [
  { time: '00:00', users: 45 },
  { time: '04:00', users: 23 },
  { time: '08:00', users: 189 },
  { time: '12:00', users: 267 },
  { time: '16:00', users: 312 },
  { time: '20:00', users: 198 },
  { time: '23:59', users: 89 }
];

const subscriptionDistribution = [
  { name: 'الخطة الأساسية', value: 48, color: '#183259', price: 99 },
  { name: 'الخطة الاحترافية', value: 67, color: '#2a4a7a', price: 299 },
  { name: 'خطة المؤسسات', value: 25, color: '#4a6ba3', price: 799 },
  { name: 'تجريبي مجاني', value: 16, color: '#8da4c7', price: 0 }
];

const systemHealth = [
  { metric: 'وقت التشغيل', value: '99.9%', status: 'excellent', color: 'text-green-600' },
  { metric: 'زمن الاستجابة', value: '145ms', status: 'good', color: 'text-blue-600' },
  { metric: 'استهلاك الذاكرة', value: '68%', status: 'warning', color: 'text-yellow-600' },
  { metric: 'مساحة التخزين', value: '45%', status: 'good', color: 'text-green-600' }
];

const recentActivity = [
  { type: 'subscription', user: 'مؤسسة التنمية الاجتماعية', action: 'اشتراك جديد - الخطة الاحترافية', time: 'منذ دقيقتين', status: 'success' },
  { type: 'user', user: 'أحمد محمد السعيد', action: 'تسجيل مستخدم جديد', time: 'منذ 15 دقيقة', status: 'info' },
  { type: 'payment', user: 'جمعية البر الخيرية', action: 'دفع فاتورة شهرية - 299 ريال', time: 'منذ ساعة', status: 'success' },
  { type: 'system', user: 'النظام', action: 'تحديث أمني تلقائي', time: 'منذ ساعتين', status: 'warning' },
  { type: 'subscription', user: 'مركز التطوير المجتمعي', action: 'ترقية للخطة المؤسسية', time: 'منذ 3 ساعات', status: 'success' }
];

const organizationTypes = [
  { name: 'جمعيات خيرية', count: 45, percentage: 51 },
  { name: 'مؤسسات حكومية', count: 23, percentage: 26 },
  { name: 'شركات مسؤولية اجتماعية', count: 12, percentage: 13 },
  { name: 'منظمات دولية', count: 9, percentage: 10 }
];

export function SystemAdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [activeTab, setActiveTab] = useState('overview');
  const [showExportModal, setShowExportModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState<any[]>([]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'subscription': return CreditCard;
      case 'user': return Users;
      case 'payment': return DollarSign;
      case 'system': return Settings;
      default: return Activity;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  // Export data preparation
  const prepareExportData = () => {
    return {
      exportInfo: {
        exportDate: new Date().toISOString(),
        exportTime: new Date().toLocaleString('ar-SA'),
        userRole: 'super_admin',
        selectedPeriod: selectedPeriod,
        activeTab: activeTab,
        exportedBy: 'System Admin Dashboard',
        version: '2.1.4'
      },
      systemStats: systemStats,
      subscriptionData: subscriptionData,
      userActivityData: userActivityData,
      subscriptionDistribution: subscriptionDistribution,
      systemHealth: systemHealth,
      recentActivity: recentActivity,
      organizationTypes: organizationTypes,
      summary: {
        totalUsers: '2,847',
        activeUsers: '1,923',
        totalSubscriptions: '156',
        totalOrganizations: '89',
        systemUptime: '99.9%',
        responseTime: '145ms'
      }
    };
  };

  // Handle refresh functionality
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, this would fetch fresh data from API
      console.log('Refreshing system data...');
      
      // Reset search when refreshing
      setSearchQuery('');
      setFilteredResults([]);
      
      toast.success('تم تحديث البيانات بنجاح! 🔄');
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث البيانات');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle period filter change
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    
    const periodNames: Record<string, string> = {
      '1month': 'الشهر الماضي',
      '3months': '3 أشهر',
      '6months': '6 أشهر',
      '1year': 'سنة كاملة'
    };
    
    toast.info(`تم تطبيق فلتر الفترة: ${periodNames[period]} 📊`);
    
    // In real app, this would trigger data refresh with new period
    console.log('Applying period filter:', period);
  };

  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredResults([]);
      return;
    }

    // Simulate search across different data types
    const searchResults = [];
    
    // Search in recent activity
    const activityMatches = recentActivity.filter(activity => 
      activity.user.toLowerCase().includes(query.toLowerCase()) ||
      activity.action.toLowerCase().includes(query.toLowerCase())
    );
    
    if (activityMatches.length > 0) {
      searchResults.push({
        category: 'الأنشطة الأخيرة',
        results: activityMatches,
        count: activityMatches.length
      });
    }

    // Search in organization types
    const orgMatches = organizationTypes.filter(org => 
      org.name.toLowerCase().includes(query.toLowerCase())
    );
    
    if (orgMatches.length > 0) {
      searchResults.push({
        category: 'أنواع المنظمات',
        results: orgMatches,
        count: orgMatches.length
      });
    }

    // Search in subscription data
    const subMatches = subscriptionDistribution.filter(sub => 
      sub.name.toLowerCase().includes(query.toLowerCase())
    );
    
    if (subMatches.length > 0) {
      searchResults.push({
        category: 'خطط الاشتراك',
        results: subMatches,
        count: subMatches.length
      });
    }

    // Search in system health
    const healthMatches = systemHealth.filter(health => 
      health.metric.toLowerCase().includes(query.toLowerCase())
    );
    
    if (healthMatches.length > 0) {
      searchResults.push({
        category: 'صحة النظام',
        results: healthMatches,
        count: healthMatches.length
      });
    }

    setFilteredResults(searchResults);
    
    const totalResults = searchResults.reduce((sum, category) => sum + category.count, 0);
    if (totalResults > 0) {
      toast.success(`تم العثور على ${totalResults} نتيجة للبحث: "${query}" 🔍`);
    } else {
      toast.info(`لم يتم العثور على نتائج للبحث: "${query}" 🔍`);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredResults([]);
    toast.info('تم مسح البحث 🧹');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#183259]">لوحة تحكم مدير النظام</h1>
          <p className="text-gray-600 mt-1">نظرة شاملة على النظام والاشتراكات والمستخدمين</p>
        </div>
        
        <div className="flex items-center gap-3">
          {searchQuery && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              البحث نشط: {filteredResults.reduce((sum, cat) => sum + cat.count, 0)} نتيجة
            </Badge>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowExportModal(true)}
            className="hover:bg-[#183259] hover:text-white transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            تصدير التقرير
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="hover:bg-[#183259] hover:text-white transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'جاري التحديث...' : 'تحديث'}
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">المرشحات:</span>
            </div>
            
            <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">الشهر الماضي</SelectItem>
                <SelectItem value="3months">3 أشهر</SelectItem>
                <SelectItem value="6months">6 أشهر</SelectItem>
                <SelectItem value="1year">سنة كاملة</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative w-60">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="البحث في النظام..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {(searchQuery || selectedPeriod !== '6months') && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>الفلاتر النشطة:</span>
                {selectedPeriod !== '6months' && (
                  <Badge variant="secondary" className="text-xs">
                    الفترة: {selectedPeriod === '1month' ? 'شهر' : selectedPeriod === '3months' ? '3 أشهر' : selectedPeriod === '1year' ? 'سنة' : '6 أشهر'}
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="text-xs">
                    البحث: {searchQuery}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchQuery && filteredResults.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-[#183259]" />
              نتائج البحث: "{searchQuery}"
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResults.map((category, index) => (
                <Card key={index} className="border border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-[#183259]">{category.category}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {category.count} نتيجة
                      </Badge>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {category.results.slice(0, 3).map((result: any, idx: number) => (
                        <div key={idx} className="text-sm text-gray-700 bg-white p-2 rounded border">
                          {result.name || result.user || result.metric || result.title}
                        </div>
                      ))}
                      {category.results.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{category.results.length - 3} نتائج أخرى
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <Badge variant="default" className="text-xs">
                      {stat.change}
                    </Badge>
                    <span className="text-xs text-gray-500 mr-2">عن الشهر الماضي</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg rtl-tabs-list">
          <TabsTrigger 
            value="system"
            className="data-[state=active]:bg-white data-[state=active]:text-[#183259] data-[state=active]:shadow-sm font-medium"
          >
            صحة النظام
          </TabsTrigger>
          <TabsTrigger 
            value="users"
            className="data-[state=active]:bg-white data-[state=active]:text-[#183259] data-[state=active]:shadow-sm font-medium"
          >
            المستخدمين
          </TabsTrigger>
          <TabsTrigger 
            value="subscriptions"
            className="data-[state=active]:bg-white data-[state=active]:text-[#183259] data-[state=active]:shadow-sm font-medium"
          >
            الاشتراكات
          </TabsTrigger>
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:bg-white data-[state=active]:text-[#183259] data-[state=active]:shadow-sm font-medium"
          >
            نظرة عامة
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>الإيرادات الشهرية</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={subscriptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} ريال`, 'الإيرادات']} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#183259" 
                      fill="#183259"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Subscription Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع الاشتراكات</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={subscriptionDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {subscriptionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Activity */}
            <Card>
              <CardHeader>
                <CardTitle>نشاط المستخدمين (24 ساعة)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#183259" 
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Organization Types */}
            <Card>
              <CardHeader>
                <CardTitle>أنواع المنظمات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {organizationTypes.map((org, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-[#183259]" />
                        <span className="text-sm font-medium">{org.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{org.count}</span>
                        <Progress value={org.percentage} className="w-20" />
                        <span className="text-xs text-gray-500 w-10">{org.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>نمو الاشتراكات</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subscriptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="basic" stackId="a" fill="#183259" name="أساسية" />
                    <Bar dataKey="professional" stackId="a" fill="#2a4a7a" name="احترافية" />
                    <Bar dataKey="enterprise" stackId="a" fill="#4a6ba3" name="مؤسسية" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>معدل التحويل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">67%</p>
                      <p className="text-sm text-gray-600">تجريبي → مدفوع</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">23%</p>
                      <p className="text-sm text-gray-600">أساسي → احترافي</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">12%</p>
                      <p className="text-sm text-gray-600">احترافي → مؤسسي</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">إحصائيات الاشتراكات</h4>
                    {subscriptionDistribution.map((sub, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{sub.name}</span>
                        <div className="text-left">
                          <span className="font-bold">{sub.value}</span>
                          <span className="text-sm text-gray-500 mr-2">
                            ({sub.price > 0 ? `${sub.price} ريال/شهر` : 'مجاني'})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>النشاط الأخير</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-full bg-white`}>
                          <Icon className={`h-4 w-4 ${getActivityColor(activity.status)}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.user}</p>
                          <p className="text-sm text-gray-600">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        <Badge 
                          variant={activity.status === 'success' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {activity.status === 'success' ? 'نجح' : 
                           activity.status === 'warning' ? 'تحذير' : 'معلومات'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Health Tab */}
        <TabsContent value="system" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>صحة النظام</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemHealth.map((health, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{health.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${health.color}`}>{health.value}</span>
                        {health.status === 'excellent' && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {health.status === 'good' && <CheckCircle className="h-4 w-4 text-blue-600" />}
                        {health.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>معلومات النظام</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-gray-600" />
                      <span>نسخة النظام</span>
                    </div>
                    <span className="font-mono text-sm">v2.1.4</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-gray-600" />
                      <span>قاعدة البيانات</span>
                    </div>
                    <span className="font-mono text-sm">PostgreSQL 14.2</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-600" />
                      <span>المنطقة</span>
                    </div>
                    <span className="text-sm">الشرق الأوسط (الرياض)</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-gray-600" />
                      <span>آخر نسخة احتياطية</span>
                    </div>
                    <span className="text-sm">منذ ساعة واحدة</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span>وقت التشغيل</span>
                    </div>
                    <span className="text-sm">45 يوم، 12 ساعة</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        activeTab={activeTab}
        selectedPeriod={selectedPeriod}
        userRole="super_admin"
        exportData={prepareExportData()}
      />
    </div>
  );
}