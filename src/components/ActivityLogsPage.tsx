import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { PageLayout } from './PageLayout';
import { 
  Search,
  Activity,
  Filter,
  Download,
  RefreshCw,
  Calendar as CalendarIcon,
  User,
  Eye,
  Edit,
  Trash2,
  Plus,
  Settings,
  LogIn,
  LogOut,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  organization: string;
  action: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'error' | 'warning';
}

const demoActivityLogs: ActivityLog[] = [
  {
    id: '1',
    timestamp: '2024-03-15T14:30:00Z',
    user: 'مدير أثرنا',
    userRole: 'admin',
    organization: 'Atharonaa',
    action: 'إنشاء استبيان',
    details: 'تم إنشاء استبيان "تقييم برنامج التمكين الاقتصادي"',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    status: 'success'
  },
  {
    id: '2',
    timestamp: '2024-03-15T14:25:00Z',
    user: 'مدير المنظمة',
    userRole: 'org_manager',
    organization: 'مؤسسة خيرية',
    action: 'إضافة مستفيد',
    details: 'تم إضافة 25 مستفيد جديد عبر استيراد CSV',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    status: 'success'
  },
  {
    id: '3',
    timestamp: '2024-03-15T14:20:00Z',
    user: 'مدير النظام',
    userRole: 'super_admin',
    organization: 'Exology',
    action: 'تحديث إعدادات النظام',
    details: 'تم تحديث إعدادات بوابة الدفع Paymob',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    status: 'success'
  },
  {
    id: '4',
    timestamp: '2024-03-15T14:15:00Z',
    user: 'مدير أثرنا',
    userRole: 'admin',
    organization: 'Atharonaa',
    action: 'محاولة حذف مستخدم',
    details: 'فشل في حذف مستخدم "مدير منظمة" - لا توجد صلاحية',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    status: 'error'
  },
  {
    id: '5',
    timestamp: '2024-03-15T14:10:00Z',
    user: 'مستفيد',
    userRole: 'beneficiary',
    organization: 'مؤسسة خيرية',
    action: 'إكمال استبيان',
    details: 'تم إكمال استبيان "قياس الأثر الاجتماعي" بنجاح',
    ipAddress: '192.168.1.120',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)',
    status: 'success'
  },
  {
    id: '6',
    timestamp: '2024-03-15T14:05:00Z',
    user: 'مدير النظام',
    userRole: 'super_admin',
    organization: 'Exology',
    action: 'إضافة منظمة جديدة',
    details: 'تم إضافة منظمة "جمعية الرعاية الصحية" بحالة "في الانتظار"',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    status: 'success'
  },
  {
    id: '7',
    timestamp: '2024-03-15T14:00:00Z',
    user: 'مدير المنظمة',
    userRole: 'org_manager',
    organization: 'مؤسسة خيرية',
    action: 'تسجيل دخول',
    details: 'تم تسجيل الدخول بنجاح',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    status: 'success'
  },
  {
    id: '8',
    timestamp: '2024-03-15T13:55:00Z',
    user: 'مدير أثرنا',
    userRole: 'admin',
    organization: 'Atharonaa',
    action: 'تصدير تقرير',
    details: 'تم تصدير تقرير تحليل الاستبيانات (PDF)',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    status: 'success'
  }
];

export function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>(demoActivityLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterOrganization, setFilterOrganization] = useState<string>('all');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = filterUser === 'all' || log.user === filterUser;
    const matchesOrganization = filterOrganization === 'all' || log.organization === filterOrganization;
    const matchesAction = filterAction === 'all' || log.action.includes(filterAction);
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    
    return matchesSearch && matchesUser && matchesOrganization && matchesAction && matchesStatus;
  });

  const uniqueUsers = Array.from(new Set(logs.map(log => log.user)));
  const uniqueOrganizations = Array.from(new Set(logs.map(log => log.organization)));
  const uniqueActions = ['تسجيل دخول', 'إنشاء استبيان', 'إضافة مستفيد', 'تحديث إعدادات', 'تصدير تقرير'];

  const getActionIcon = (action: string) => {
    if (action.includes('تسجيل دخول')) return <LogIn className="h-4 w-4" />;
    if (action.includes('تسجيل خروج')) return <LogOut className="h-4 w-4" />;
    if (action.includes('إنشاء') || action.includes('إضافة')) return <Plus className="h-4 w-4" />;
    if (action.includes('تحديث') || action.includes('تعديل')) return <Edit className="h-4 w-4" />;
    if (action.includes('حذف')) return <Trash2 className="h-4 w-4" />;
    if (action.includes('عرض') || action.includes('تصدير')) return <Eye className="h-4 w-4" />;
    if (action.includes('إعدادات')) return <Settings className="h-4 w-4" />;
    if (action.includes('استبيان')) return <FileText className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const getStatusBadge = (status: ActivityLog['status']) => {
    const statusConfig = {
      success: { label: 'نجح', variant: 'default' as const },
      error: { label: 'فشل', variant: 'destructive' as const },
      warning: { label: 'تحذير', variant: 'secondary' as const }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: { [key: string]: string } = {
      super_admin: 'مدير النظام',
      admin: 'مدير',
      org_manager: 'مدير منظمة',
      beneficiary: 'مستفيد'
    };
    return roleLabels[role] || role;
  };

  const handleExport = () => {
    try {
      // تحضير البيانات للتصدير
      const exportData = filteredLogs.map(log => ({
        'التاريخ': new Date(log.timestamp).toLocaleDateString('ar-SA'),
        'الوقت': new Date(log.timestamp).toLocaleTimeString('ar-SA'),
        'المستخدم': log.user,
        'الدور': getRoleLabel(log.userRole),
        'المنظمة': log.organization,
        'النشاط': log.action,
        'التفاصيل': log.details,
        'النتيجة': log.status === 'success' ? 'نجح' : log.status === 'error' ? 'فشل' : 'تحذير',
        'عنوان IP': log.ipAddress
      }));

      // تحويل البيانات إلى CSV
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        // إضافة BOM للدعم العربي في Excel
        '\ufeff',
        // رؤوس الأعمدة
        headers.join(','),
        // البيانات
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row] || '';
            // إضافة علامات اقتباس للنصوص التي تحتوي على فواصل أو علامات اقتباس
            return `"${String(value).replace(/"/g, '""')}"`;
          }).join(',')
        )
      ].join('\n');

      // إنشاء وتحميل الملف
      const blob = new Blob([csvContent], { 
        type: 'text/csv;charset=utf-8' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // تسمية الملف مع التاريخ الحالي
      const currentDate = new Date().toLocaleDateString('ar-SA').replace(/\//g, '-');
      const currentTime = new Date().toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }).replace(/:/g, '-');
      
      link.download = `سجل-الأنشطة-${currentDate}-${currentTime}.csv`;
      
      // تفعيل التحميل
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`تم تصدير ${filteredLogs.length} نشاط بنجاح`);
    } catch (error) {
      console.error('خطأ في تصدير البيانات:', error);
      toast.error('حدث خطأ أثناء تصدير البيانات');
    }
  };

  const handleRefresh = () => {
    // In real app, this would fetch fresh data
    setLogs([...demoActivityLogs]);
    toast.success('تم تحديث سجل الأنشطة');
  };

  const stats = [
    {
      title: 'إجمالي الأنشطة',
      value: logs.length,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'عمليات ناجحة',
      value: logs.filter(l => l.status === 'success').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'عمليات فاشلة',
      value: logs.filter(l => l.status === 'error').length,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'مستخدمين نشطين',
      value: uniqueUsers.length,
      icon: User,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const headerStats = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <stat.icon className="h-6 w-6 text-white" />
            <div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-blue-200">{stat.title}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const filtersAndActions = (
    <div className="space-y-4 mb-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="البحث في الأنشطة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="المستخدم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المستخدمين</SelectItem>
                  {uniqueUsers.map(user => (
                    <SelectItem key={user} value={user}>{user}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterOrganization} onValueChange={setFilterOrganization}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="المنظمة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المنظمات</SelectItem>
                  {uniqueOrganizations.map(org => (
                    <SelectItem key={org} value={org}>{org}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="نوع النشاط" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنشطة</SelectItem>
                  {uniqueActions.map(action => (
                    <SelectItem key={action} value={action}>{action}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="success">نجح</SelectItem>
                  <SelectItem value="error">فشل</SelectItem>
                  <SelectItem value="warning">تحذير</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 ml-2" />
                تحديث
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExport}
                className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
              >
                <Download className="h-4 w-4 ml-2" />
                تصدير CSV
              </Button>
              <div className="text-sm text-gray-600">
                عرض {filteredLogs.length} من {logs.length} نشاط
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <PageLayout
      title="سجل الأنشطة"
      description="تتبع شامل لجميع الأنشطة والعمليات في النظام"
      icon={<Activity className="h-8 w-8" />}
      headerContent={headerStats}
    >
      {filtersAndActions}

      {/* Activity Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>سجل الأنشطة التفصيلي</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">التوقيت</TableHead>
                <TableHead className="text-right">المستخدم</TableHead>
                <TableHead className="text-right">النشاط</TableHead>
                <TableHead className="text-right">التفاصيل</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">عنوان IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(log.timestamp).toLocaleDateString('ar-SA')}</div>
                      <div className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString('ar-SA')}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{log.user}</div>
                        <div className="text-sm text-gray-500">{getRoleLabel(log.userRole)} - {log.organization}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span>{log.action}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="text-sm">{log.details}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(log.status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {log.ipAddress}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageLayout>
  );
}