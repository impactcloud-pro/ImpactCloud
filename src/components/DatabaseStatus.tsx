import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  AlertTriangle,
  Activity,
  Users,
  Building,
  FileText
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner@2.0.3';

interface DatabaseStatusProps {
  onConnectionReady?: () => void;
}

interface TableStatus {
  name: string;
  exists: boolean;
  rowCount: number;
  error?: string;
}

export function DatabaseStatus({ onConnectionReady }: DatabaseStatusProps) {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [tableStatuses, setTableStatuses] = useState<TableStatus[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkDatabaseConnection = async () => {
    setIsRefreshing(true);
    
    try {
      console.log('Testing Supabase connection...');

      // Test basic connection using RPC
      const { error: basicError } = await supabase
        .rpc('now');

      if (basicError) {
        setConnectionStatus('error');
        console.error('Basic connection failed:', basicError);
        toast.error('فشل في الاتصال بقاعدة البيانات. يرجى التحقق من إعدادات Supabase.');
        return;
      }

      console.log('Basic connection successful');
      
      // Check all tables
      const tables = [
        'roles',
        'subscription_plans', 
        'organizations',
        'users',
        'beneficiaries',
        'surveys',
        'questions',
        'responses',
        'activity_log',
        'transactions',
        'requests'
      ];

      const tableChecks = await Promise.all(
        tables.map(async (tableName) => {
          try {
            const { count, error } = await supabase
              .from(tableName)
              .select('*', { count: 'exact', head: true });

            if (error && error.code === 'PGRST116') {
              // Table doesn't exist
              return {
                name: tableName,
                exists: false,
                rowCount: 0,
                error: 'الجدول غير موجود'
              };
            }

            if (error) {
              return {
                name: tableName,
                exists: false,
                rowCount: 0,
                error: error.message
              };
            }

            return {
              name: tableName,
              exists: true,
              rowCount: count || 0,
              error: undefined
            };
          } catch (err: any) {
            return {
              name: tableName,
              exists: false,
              rowCount: 0,
              error: err.message
            };
          }
        })
      );

      setConnectionStatus('connected');
      setTableStatuses(tableChecks);
      
      // Check if all essential tables exist
      const essentialTables = ['roles', 'users', 'organizations', 'surveys'];
      const missingTables = tableChecks.filter(
        table => essentialTables.includes(table.name) && !table.exists
      );

      if (missingTables.length > 0) {
        toast.warning(`الجداول الأساسية مفقودة: ${missingTables.map(t => getTableDisplayName(t.name)).join(', ')}`);
        toast.info('يرجى تشغيل Migration في Supabase SQL Editor');
      } else {
        console.log('All essential tables found');
        toast.success('قاعدة البيانات متصلة وجاهزة! جميع الجداول موجودة');
        onConnectionReady?.();
      }

    } catch (error: any) {
      console.error('Database connection error:', error);
      setConnectionStatus('error');
      toast.error(`خطأ في فحص قاعدة البيانات: ${error.message}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  const getTableIcon = (tableName: string) => {
    switch (tableName) {
      case 'users': return Users;
      case 'organizations': return Building;
      case 'surveys': return FileText;
      case 'beneficiaries': return Users;
      case 'activity_log': return Activity;
      case 'roles': return Users;
      case 'subscription_plans': return Activity;
      case 'questions': return FileText;
      case 'responses': return Activity;
      case 'transactions': return Activity;
      case 'requests': return Building;
      default: return Database;
    }
  };

  const getStatusBadge = (status: 'checking' | 'connected' | 'error') => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />متصل</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />خطأ</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800"><RefreshCw className="h-3 w-3 mr-1 animate-spin" />جاري الفحص</Badge>;
    }
  };

  const getTableDisplayName = (tableName: string) => {
    const tableNames: Record<string, string> = {
      'roles': 'الأدوار',
      'subscription_plans': 'خطط الاشتراك',
      'organizations': 'المنظمات',
      'users': 'المستخدمين',
      'beneficiaries': 'المستفيدين',
      'surveys': 'الاستبيانات',
      'questions': 'الأسئلة',
      'responses': 'الاستجابات',
      'activity_log': 'سجل الأنشطة',
      'transactions': 'المعاملات',
      'requests': 'طلبات التسجيل'
    };
    return tableNames[tableName] || tableName;
  };
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            حالة قاعدة البيانات
          </CardTitle>
          <div className="flex items-center gap-3">
            {getStatusBadge(connectionStatus)}
            <Button
              variant="outline"
              size="sm"
              onClick={checkDatabaseConnection}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {connectionStatus === 'error' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>خطأ في الاتصال:</strong> تعذر الاتصال بقاعدة البيانات أو الجداول غير موجودة.
              <br />
              <strong>الحل:</strong> يرجى تشغيل Migration في Supabase SQL Editor:
              <br />
              1. افتح Supabase Dashboard
              <br />
              2. اذهب إلى SQL Editor
              <br />
              3. انسخ محتوى ملف supabase/migrations/complete_social_impact_schema.sql
              <br />
              4. شغل الـ SQL
            </AlertDescription>
          </Alert>
        )}

        {connectionStatus === 'connected' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>متصل بنجاح:</strong> قاعدة البيانات متصلة وجاهزة للاستخدام. جميع الجداول تم التحقق منها.
            </AlertDescription>
          </Alert>
        )}

        {/* Tables Status */}
        <div>
          <h3 className="text-lg font-semibold mb-4">حالة الجداول</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tableStatuses.map((table) => {
              const Icon = getTableIcon(table.name);
              return (
                <div
                  key={table.name}
                  className={`p-4 rounded-lg border-2 ${
                    table.exists 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${table.exists ? 'text-green-600' : 'text-red-600'}`} />
                      <span className="font-medium text-sm">{getTableDisplayName(table.name)}</span>
                    </div>
                    {table.exists ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  
                  {table.exists ? (
                    <div className="text-xs text-green-700">
                      {table.rowCount.toLocaleString('ar-SA')} سجل
                    </div>
                  ) : (
                    <div className="text-xs text-red-700">
                      {table.error || 'الجدول غير موجود'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Connection Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">تفاصيل الاتصال</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>URL: {import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL}</div>
              <div>المنطقة: Supabase Cloud</div>
              <div>الحالة: {connectionStatus === 'connected' ? 'متصل' : 'غير متصل'}</div>
              <div>المشروع: opzxyqfxsqtgfzcnkkoj</div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">إحصائيات سريعة</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>إجمالي الجداول: {tableStatuses.length}</div>
              <div>الجداول الموجودة: {tableStatuses.filter(t => t.exists).length}</div>
              <div>إجمالي السجلات: {tableStatuses.reduce((sum, t) => sum + t.rowCount, 0).toLocaleString('ar-SA')}</div>
              <div>معدل النجاح: {Math.round((tableStatuses.filter(t => t.exists).length / tableStatuses.length) * 100)}%</div>
            </div>
          </div>
          
          {connectionStatus === 'error' && (
            <div className="md:col-span-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium mb-2 text-blue-800">خطوات الإصلاح</h4>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>افتح Supabase Dashboard على الرابط: https://supabase.com/dashboard</li>
                <li>اختر مشروعك: opzxyqfxsqtgfzcnkkoj</li>
                <li>اذهب إلى SQL Editor من القائمة الجانبية</li>
                <li>انسخ محتوى ملف supabase/migrations/complete_social_impact_schema.sql</li>
                <li>الصق المحتوى في SQL Editor واضغط Run</li>
                <li>ارجع هنا واضغط "تحديث" للتحقق من الاتصال</li>
              </ol>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}