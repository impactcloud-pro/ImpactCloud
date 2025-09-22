import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  Search,
  Plus,
  Users,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  Shield,
  UserCheck,
  UserX,
  UserPlus,
  Building,
  MoreHorizontal,
  Trash2,
  Clock,
  Download,
  RefreshCw,
  EyeOff,
  KeyRound,
  Calendar,
  FileText,
  Phone,
  Mail,
  MapPin,
  User
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { EnhancedPageLayout } from './EnhancedPageLayout';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  username?: string;
  password?: string;
  role: 'super_admin' | 'admin' | 'org_manager' | 'beneficiary';
  organization?: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  createdAt: string;
}

// For admin role, we'll show beneficiaries data with survey statistics
interface BeneficiaryData extends User {
  surveyCount: number;
  completedResponses: number;
  uncompletedResponses: number;
}

const mockBeneficiaries: BeneficiaryData[] = [
  {
    id: '1',
    name: 'سارة أحمد الشريف',
    email: 'sara.ahmed@example.com',
    phone: '+966501234567',
    username: 'sara_ahmed',
    role: 'beneficiary',
    organization: 'مؤسسة التنمية الاجتماعية',
    status: 'active',
    createdAt: '2024-01-15',
    surveyCount: 5,
    completedResponses: 3,
    uncompletedResponses: 2
  },
  {
    id: '2',
    name: 'محمد عبدالله القحطاني',
    email: 'mohammed.abdullah@example.com',
    phone: '+966502345678',
    username: 'mohammed_abdullah',
    role: 'beneficiary',
    organization: 'جمعية البر الخيرية',
    status: 'active',
    createdAt: '2024-02-20',
    surveyCount: 3,
    completedResponses: 2,
    uncompletedResponses: 1
  },
  {
    id: '3',
    name: 'فاطمة سالم النجار',
    email: 'fatima.salem@example.com',
    phone: '+966503456789',
    username: 'fatima_salem',
    role: 'beneficiary',
    organization: 'مؤسسة الملك عبدالله للإسكان التنموي',
    status: 'active',
    createdAt: '2024-01-10',
    surveyCount: 7,
    completedResponses: 5,
    uncompletedResponses: 2
  },
  {
    id: '4',
    name: 'عبدالرحمن محمد الدوسري',
    email: 'abdulrahman.mohammed@example.com',
    phone: '+966504567890',
    username: 'abdulrahman_mohammed',
    role: 'beneficiary',
    organization: 'مؤسسة محمد بن راشد للابتكار',
    status: 'active',
    createdAt: '2024-03-05',
    surveyCount: 4,
    completedResponses: 4,
    uncompletedResponses: 0
  },
  {
    id: '5',
    name: 'نورا خالد العتيبي',
    email: 'nora.khaled@example.com',
    phone: '+966505678901',
    username: 'nora_khaled',
    role: 'beneficiary',
    organization: 'جمعية الأطفال المعوقين',
    status: 'active',
    createdAt: '2023-12-18',
    surveyCount: 6,
    completedResponses: 3,
    uncompletedResponses: 3
  },
  {
    id: '6',
    name: 'أحمد يوسف الحربي',
    email: 'ahmed.youssef@example.com',
    phone: '+966506789012',
    username: 'ahmed_youssef',
    role: 'beneficiary',
    organization: 'مؤسسة الأمير سلطان الخيرية',
    status: 'active',
    createdAt: '2024-01-08',
    surveyCount: 8,
    completedResponses: 6,
    uncompletedResponses: 2
  }
];

const mockUsers: User[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@exology.com',
    username: 'admin_ahmed',
    phone: '+966501234567',
    role: 'super_admin',
    organization: 'Exology',
    status: 'active',
    lastLogin: '2025-01-13 10:30',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'فاطمة العلي',
    email: 'fatima@atharonaa.org',
    username: 'fatima_ali',
    phone: '+966507654321',
    role: 'admin',
    organization: 'Atharonaa',
    status: 'active',
    lastLogin: '2025-01-13 09:15',
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    name: 'محمد الخالد',
    email: 'mohammed@ngo.org',
    username: 'mohammed_khaled',
    role: 'org_manager',
    organization: 'جمعية الخير',
    status: 'active',
    lastLogin: '2025-01-12 16:45',
    createdAt: '2024-03-10'
  },
  {
    id: '4',
    name: 'سارة أحمد',
    email: 'sara@example.com',
    username: 'sara_ahmed',
    role: 'beneficiary',
    status: 'pending',
    createdAt: '2025-01-10'
  },
  {
    id: '5',
    name: 'عبدالله الجبير',
    email: 'abdullah@ngo.org',
    username: 'abdullah_jubair',
    role: 'org_manager',
    organization: 'مؤسسة التنمية',
    status: 'inactive',
    lastLogin: '2024-12-20 14:20',
    createdAt: '2024-04-05'
  }
];

interface UserManagementProps {
  userRole: 'super_admin' | 'admin' | 'org_manager';
}

export function UserManagement({ userRole }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryData[]>(mockBeneficiaries);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [organizationFilter, setOrganizationFilter] = useState('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isViewBeneficiaryOpen, setIsViewBeneficiaryOpen] = useState(false);
  const [isEditBeneficiaryOpen, setIsEditBeneficiaryOpen] = useState(false);
  const [viewingBeneficiary, setViewingBeneficiary] = useState<BeneficiaryData | null>(null);
  const [editingBeneficiary, setEditingBeneficiary] = useState<BeneficiaryData | null>(null);
  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    role: 'beneficiary' as User['role'],
    organization: ''
  });

  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    role: 'beneficiary' as User['role'],
    organization: '',
    status: 'active' as User['status']
  });

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const generateUsername = (name: string, email: string) => {
    const namepart = name.split(' ')[0].toLowerCase();
    const emailpart = email.split('@')[0].toLowerCase();
    return `${namepart}_${emailpart}`.replace(/[^a-zA-Z0-9_]/g, '');
  };

  const getRoleLabel = (role: User['role']) => {
    const labels = {
      super_admin: 'مدير النظام',
      admin: 'مدير',
      org_manager: 'مدير منظمة',
      beneficiary: 'مستفيد'
    };
    return labels[role];
  };

  const getRoleColor = (role: User['role']) => {
    const colors = {
      super_admin: 'bg-purple-100 text-purple-800',
      admin: 'bg-blue-100 text-blue-800',
      org_manager: 'bg-green-100 text-green-800',
      beneficiary: 'bg-gray-100 text-gray-800'
    };
    return colors[role];
  };

  const getStatusColor = (status: User['status']) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status];
  };

  const getStatusLabel = (status: User['status']) => {
    const labels = {
      active: 'نشط',
      inactive: 'غير نشط',
      pending: 'في الانتظار'
    };
    return labels[status];
  };

  // Filter users based on current user's role
  const getVisibleUsers = () => {
    // For admin role, show beneficiaries data
    if (userRole === 'admin') {
      let filteredBeneficiaries = beneficiaries;

      // Apply search and filters
      if (searchTerm) {
        filteredBeneficiaries = filteredBeneficiaries.filter(user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.organization && user.organization.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      if (statusFilter !== 'all') {
        filteredBeneficiaries = filteredBeneficiaries.filter(user => user.status === statusFilter);
      }

      if (organizationFilter !== 'all') {
        filteredBeneficiaries = filteredBeneficiaries.filter(user => 
          user.organization === organizationFilter
        );
      }

      return filteredBeneficiaries;
    }

    // For other roles, use original logic
    let filteredUsers = users;

    if (userRole === 'super_admin') {
      // Super admins can see all users
      filteredUsers = users;
    } else if (userRole === 'org_manager') {
      // Org managers can only see beneficiaries
      filteredUsers = users.filter(user => user.role === 'beneficiary');
    }

    // Apply search and filters
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (roleFilter !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
    }

    return filteredUsers;
  };

  // Get unique organizations for filter
  const getUniqueOrganizations = () => {
    if (userRole === 'admin') {
      return Array.from(new Set(beneficiaries.map(b => b.organization).filter(Boolean)));
    }
    return [];
  };

  const getAvailableRoles = () => {
    if (userRole === 'super_admin') {
      return [
        { value: 'admin', label: 'مدير' },
        { value: 'org_manager', label: 'مدير منظمة' },
        { value: 'beneficiary', label: 'مستفيد' }
      ];
    } else if (userRole === 'admin') {
      return [
        { value: 'org_manager', label: 'مدير منظمة' },
        { value: 'beneficiary', label: 'مستفيد' }
      ];
    } else {
      return [
        { value: 'beneficiary', label: 'مستفيد' }
      ];
    }
  };

  // Export function
  const handleExportUsers = () => {
    try {
      let headers: string[];
      let csvContent: string;

      if (userRole === 'admin') {
        // Headers for beneficiaries data
        headers = ['تاريخ التسجيل', 'اسم المستفيد', 'المنظمة', 'البريد الإلكتروني', 'رقم الهاتف', 'عدد الاستبيانات', 'عدد المستجيبين', 'عدد غير المستجيبين', 'الحالة'];
        csvContent = [
          headers.join(','),
          ...getVisibleUsers().map(user => {
            const beneficiary = user as BeneficiaryData;
            return [
              new Date(beneficiary.createdAt).toLocaleDateString('ar-SA'),
              `"${beneficiary.name}"`,
              `"${beneficiary.organization || ''}"`,
              `"${beneficiary.email}"`,
              `"${beneficiary.phone || ''}"`,
              beneficiary.surveyCount,
              beneficiary.completedResponses,
              beneficiary.uncompletedResponses,
              `"${getStatusLabel(beneficiary.status)}"`
            ].join(',');
          })
        ].join('\n');
      } else {
        // Headers for regular users data
        headers = ['الاسم', 'البريد الإلكتروني', 'اسم المستخدم', 'الهاتف', 'الدور', 'المنظمة', 'الحالة', 'آخر دخول', 'تاريخ الإنشاء'];
        csvContent = [
          headers.join(','),
          ...getVisibleUsers().map(user => [
            `"${user.name}"`,
            `"${user.email}"`,
            `"${user.username || ''}"`,
            `"${user.phone || ''}"`,
            `"${getRoleLabel(user.role)}"`,
            `"${user.organization || ''}"`,
            `"${getStatusLabel(user.status)}"`,
            `"${user.lastLogin || 'لم يسجل دخول'}"`,
            new Date(user.createdAt).toLocaleDateString('ar-SA')
          ].join(','))
        ].join('\n');
      }

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      const filename = userRole === 'admin' ? 'beneficiaries_export' : 'users_export';
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`تم تصدير بيانات ${userRole === 'admin' ? 'المستفيدين' : 'المستخدمين'} بنجاح!`);
    } catch (error) {
      toast.error('حدث خطأ في تصدير البيانات');
    }
  };

  // Refresh function
  const handleRefreshUsers = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, this would fetch latest data from API
      const updatedUsers = users.map(user => ({
        ...user,
        lastUpdate: new Date().toISOString()
      }));
      
      setUsers(updatedUsers);
      toast.success('تم تحديث بيانات المستخدمين بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ في تحديث البيانات');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.username || !newUser.password) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // Check for duplicate username or email
    const usernameExists = users.some(user => user.username === newUser.username);
    const emailExists = users.some(user => user.email === newUser.email);

    if (usernameExists) {
      toast.error('اسم المستخدم مستخدم بالفعل');
      return;
    }

    if (emailExists) {
      toast.error('البريد الإلكتروني مستخدم بالفعل');
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setUsers(prev => [...prev, user]);

    setNewUser({
      name: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      role: 'beneficiary',
      organization: ''
    });
    setIsAddUserOpen(false);
    
    toast.success(`تم إنشاء المستخدم بنجاح! اسم المستخدم: ${user.username}`);
  };

  const handleViewUser = (user: User) => {
    setViewingUser(user);
    setIsViewUserOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditUserData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      username: user.username || '',
      password: '',
      role: user.role,
      organization: user.organization || '',
      status: user.status
    });
    setIsEditUserOpen(true);
  };

  const handleSaveEditUser = () => {
    if (!editingUser) return;

    if (!editUserData.name || !editUserData.email || !editUserData.username) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // Check for duplicate username or email with other users
    const usernameExists = users.some(user => 
      user.id !== editingUser.id && user.username === editUserData.username
    );
    const emailExists = users.some(user => 
      user.id !== editingUser.id && user.email === editUserData.email
    );

    if (usernameExists) {
      toast.error('اسم المستخدم مستخدم بالفعل');
      return;
    }

    if (emailExists) {
      toast.error('البريد الإلكتروني مستخدم بالفعل');
      return;
    }

    setUsers(prev => prev.map(user =>
      user.id === editingUser.id ? {
        ...user,
        name: editUserData.name,
        email: editUserData.email,
        phone: editUserData.phone || undefined,
        username: editUserData.username,
        ...(editUserData.password && { password: editUserData.password }),
        role: editUserData.role,
        organization: editUserData.organization || undefined,
        status: editUserData.status
      } : user
    ));

    setIsEditUserOpen(false);
    setEditingUser(null);
    toast.success('تم تحديث بيانات المستخدم بنجاح');
  };

  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    toast.success(`تم تغيير حالة المستخدم إلى "${getStatusLabel(newStatus)}"`);
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(user => user.id !== userId));
    setDeleteUserId(null);
    toast.success(`تم حذف المستخدم "${user?.name}" بنجاح`);
  };

  // Functions for beneficiary actions (Admin role only)
  const handleViewBeneficiary = (beneficiaryId: string) => {
    const beneficiary = beneficiaries.find(b => b.id === beneficiaryId);
    if (beneficiary) {
      setViewingBeneficiary(beneficiary);
      setIsViewBeneficiaryOpen(true);
    }
  };

  const handleEditBeneficiary = (beneficiaryId: string) => {
    const beneficiary = beneficiaries.find(b => b.id === beneficiaryId);
    if (beneficiary) {
      setEditingBeneficiary(beneficiary);
      setIsEditBeneficiaryOpen(true);
    }
  };

  const handleDeleteBeneficiary = (beneficiaryId: string) => {
    const beneficiary = beneficiaries.find(b => b.id === beneficiaryId);
    if (beneficiary) {
      setBeneficiaries(prev => prev.filter(b => b.id !== beneficiaryId));
      toast.success(`تم حذف المستفيد "${beneficiary.name}" بنجاح`);
    }
  };

  const handleSaveEditBeneficiary = () => {
    if (!editingBeneficiary) return;

    setBeneficiaries(prev => prev.map(b => 
      b.id === editingBeneficiary.id ? editingBeneficiary : b
    ));
    
    setIsEditBeneficiaryOpen(false);
    setEditingBeneficiary(null);
    toast.success('تم تحديث بيانات المستفيد بنجاح');
  };

  const headerStats = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{getVisibleUsers().length}</div>
            <div className="text-blue-200">{userRole === 'admin' ? 'إجمالي المستفيدين' : 'إجمالي المستخدمين'}</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <UserCheck className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">
              {getVisibleUsers().filter(u => u.status === 'active').length}
            </div>
            <div className="text-blue-200">{userRole === 'admin' ? 'المستفيدين النشطين' : 'المستخدمين النشطين'}</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          {userRole === 'admin' ? <FileText className="h-6 w-6 text-white" /> : <Clock className="h-6 w-6 text-white" />}
          <div>
            <div className="text-2xl font-bold text-white">
              {userRole === 'admin' 
                ? getVisibleUsers().reduce((sum, user) => sum + (user as BeneficiaryData).surveyCount, 0)
                : getVisibleUsers().filter(u => u.status === 'pending').length
              }
            </div>
            <div className="text-blue-200">{userRole === 'admin' ? 'إجمالي الاستبيانات' : 'في الانتظار'}</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          {userRole === 'admin' ? <CheckCircle className="h-6 w-6 text-white" /> : <UserX className="h-6 w-6 text-white" />}
          <div>
            <div className="text-2xl font-bold text-white">
              {userRole === 'admin' 
                ? getVisibleUsers().reduce((sum, user) => sum + (user as BeneficiaryData).completedResponses, 0)
                : getVisibleUsers().filter(u => u.status === 'inactive').length
              }
            </div>
            <div className="text-blue-200">{userRole === 'admin' ? 'إجمالي المكتملة' : 'غير النشطين'}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <EnhancedPageLayout
      pageId="user-management"
      userRole={userRole}
      description={userRole === 'admin' ? "عرض وإدارة بيانات المستفيدين وإحصائيات مشاركتهم في الاستبيانات" : "إدارة حسابات المستخدمين وصلاحياتهم في النظام"}
      icon={<Users className="h-8 w-8" />}
      headerContent={headerStats}
    >
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder={userRole === 'admin' ? "البحث عن مستفيد أو منظمة..." : "البحث عن مستخدم..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            
            {userRole !== 'admin' && (
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأدوار</SelectItem>
                  {getAvailableRoles().map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
              </SelectContent>
            </Select>

            {userRole === 'admin' && (
              <Select value={organizationFilter} onValueChange={setOrganizationFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="المنظمة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المنظمات</SelectItem>
                  {getUniqueOrganizations().map(org => (
                    <SelectItem key={org} value={org}>{org}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportUsers}
              className="hover:bg-green-50 hover:border-green-200"
            >
              <Download className="h-4 w-4 ml-2" />
              تصدير التقرير
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefreshUsers}
              disabled={isRefreshing}
              className="hover:bg-blue-50 hover:border-blue-200"
            >
              <RefreshCw className={`h-4 w-4 ml-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'جاري التحديث...' : 'تحديث'}
            </Button>
            
            {userRole === 'admin' && (
              <Button 
                className="bg-[#183259] hover:bg-[#2a4a7a]"
                onClick={() => setIsAddUserOpen(true)}
              >
                <UserPlus className="h-4 w-4 ml-2" />
                إضافة مستفيد
              </Button>
            )}
            
            {userRole === 'super_admin' && (
              <Button 
                className="bg-[#183259] hover:bg-[#2a4a7a]"
                onClick={() => setIsAddUserOpen(true)}
              >
                <UserPlus className="h-4 w-4 ml-2" />
                إضافة مستخدم
              </Button>
            )}
            
            {userRole === 'org_manager' && (
              <Button 
                className="bg-[#183259] hover:bg-[#2a4a7a]"
                onClick={() => setIsAddUserOpen(true)}
              >
                <UserPlus className="h-4 w-4 ml-2" />
                إضافة مستفيد
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <div className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {userRole === 'admin' ? (
                  <>
                    <TableHead className="text-right">تاريخ التسجيل</TableHead>
                    <TableHead className="text-right">اسم المستفيد</TableHead>
                    <TableHead className="text-right">المنظمة</TableHead>
                    <TableHead className="text-right">البريد الإلكتروني</TableHead>
                    <TableHead className="text-right">رقم الهاتف</TableHead>
                    <TableHead className="text-right">عدد الاستبيانات</TableHead>
                    <TableHead className="text-right">المكتملة</TableHead>
                    <TableHead className="text-right">غير المكتملة</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead className="text-right">المستخدم</TableHead>
                    <TableHead className="text-right">البريد الإلكتروني</TableHead>
                    <TableHead className="text-right">الدور</TableHead>
                    <TableHead className="text-right">المنظمة</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">آخر دخول</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {getVisibleUsers().map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50/50">
                  {userRole === 'admin' ? (
                    <>
                      <TableCell className="text-right">
                        <div className="text-sm">
                          {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-[#183259] text-white text-xs">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">@{user.username}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm">{user.organization}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm">{user.email}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm">{user.phone || '-'}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm font-medium">
                          {(user as BeneficiaryData).surveyCount}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm text-green-600 font-medium">
                          {(user as BeneficiaryData).completedResponses}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm text-orange-600 font-medium">
                          {(user as BeneficiaryData).uncompletedResponses}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={getStatusColor(user.status)}>
                          {getStatusLabel(user.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewBeneficiary(user.id)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>عرض تفاصيل المستفيد</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditBeneficiary(user.id)}
                                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>تعديل بيانات المستفيد</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                <AlertDialogDescription>
                                  هل أنت متأكد من حذف المستفيد "{user.name}"؟ لا يمكن التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteBeneficiary(user.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-[#183259] text-white text-xs">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">@{user.username}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm">{user.email}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={getRoleColor(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm">{user.organization || '-'}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={getStatusColor(user.status)}>
                          {getStatusLabel(user.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm text-gray-500">
                          {user.lastLogin || 'لم يسجل دخول'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewUser(user)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>عرض تفاصيل المستخدم</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          {userRole === 'super_admin' && (
                            <>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditUser(user)}
                                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>تعديل بيانات المستخدم</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      هل أنت متأكد من حذف المستخدم "{user.name}"؟ لا يمكن التراجع عن هذا الإجراء.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      حذف
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* View Beneficiary Dialog */}
      <Dialog open={isViewBeneficiaryOpen} onOpenChange={setIsViewBeneficiaryOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">تفاصيل المستفيد</DialogTitle>
            <DialogDescription>
              عرض جميع بيانات المستفيد وإحصائيات مشاركته في الاستبيانات
            </DialogDescription>
          </DialogHeader>
          {viewingBeneficiary && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-[#183259] text-white text-xl">
                      {viewingBeneficiary.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{viewingBeneficiary.name}</h3>
                    <p className="text-gray-600">@{viewingBeneficiary.username}</p>
                    <Badge className={getStatusColor(viewingBeneficiary.status)}>
                      {getStatusLabel(viewingBeneficiary.status)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">البريد الإلكتروني</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{viewingBeneficiary.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">رقم الهاتف</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{viewingBeneficiary.phone || 'غير محدد'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">المنظمة</Label>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span>{viewingBeneficiary.organization}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">تاريخ التسجيل</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{new Date(viewingBeneficiary.createdAt).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
              </div>

              {/* Survey Statistics */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">إحصائيات الاستبيانات</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{viewingBeneficiary.surveyCount}</div>
                    <div className="text-sm text-blue-600">إجمالي الاستبيانات</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{viewingBeneficiary.completedResponses}</div>
                    <div className="text-sm text-green-600">الردود المكتملة</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">{viewingBeneficiary.uncompletedResponses}</div>
                    <div className="text-sm text-orange-600">الردود غير المكتملة</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewBeneficiaryOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={isViewUserOpen} onOpenChange={setIsViewUserOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">تفاصيل المستخدم</DialogTitle>
            <DialogDescription>
              عرض جميع بيانات المستخدم ومعلومات الحساب
            </DialogDescription>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-[#183259] text-white text-xl">
                      {viewingUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{viewingUser.name}</h3>
                    <p className="text-gray-600">@{viewingUser.username}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getRoleColor(viewingUser.role)}>
                        {getRoleLabel(viewingUser.role)}
                      </Badge>
                      <Badge className={getStatusColor(viewingUser.status)}>
                        {getStatusLabel(viewingUser.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">البريد الإلكتروني</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{viewingUser.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">رقم الهاتف</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{viewingUser.phone || 'غير محدد'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">المنظمة</Label>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span>{viewingUser.organization || 'غير محدد'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">تاريخ الإنشاء</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{new Date(viewingUser.createdAt).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">آخر دخول</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{viewingUser.lastLogin || 'لم يسجل دخول'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">اسم المستخدم</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{viewingUser.username}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewUserOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة مستخدم جديد</DialogTitle>
            <DialogDescription>
              أدخل بيانات المستخدم الجديد
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل *</Label>
              <Input
                id="name"
                placeholder="أدخل الاسم الكامل"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <Input
                id="email"
                type="email"
                placeholder="أدخل البريد الإلكتروني"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                placeholder="أدخل رقم الهاتف"
                value={newUser.phone}
                onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم *</Label>
              <Input
                id="username"
                placeholder="أدخل اسم المستخدم"
                value={newUser.username}
                onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (newUser.name && newUser.email) {
                    setNewUser(prev => ({ ...prev, username: generateUsername(newUser.name, newUser.email) }));
                  }
                }}
                disabled={!newUser.name || !newUser.email}
              >
                إنشاء تلقائي
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setNewUser(prev => ({ ...prev, password: generatePassword() }))}
              >
                <KeyRound className="h-4 w-4 ml-2" />
                إنشاء كلمة مرور عشوائية
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">الدور *</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value as User['role'] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableRoles().map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">المنظمة</Label>
              <Input
                id="organization"
                placeholder="أدخل اسم المنظمة"
                value={newUser.organization}
                onChange={(e) => setNewUser(prev => ({ ...prev, organization: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddUser}>
              <UserPlus className="h-4 w-4 ml-2" />
              إضافة المستخدم
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل بيانات المستخدم</DialogTitle>
            <DialogDescription>
              تحديث بيانات المستخدم المحدد
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">الاسم الكامل *</Label>
              <Input
                id="edit-name"
                placeholder="أدخل الاسم الكامل"
                value={editUserData.name}
                onChange={(e) => setEditUserData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">البريد الإلكتروني *</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="أدخل البريد الإلكتروني"
                value={editUserData.email}
                onChange={(e) => setEditUserData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">رقم الهاتف</Label>
              <Input
                id="edit-phone"
                placeholder="أدخل رقم الهاتف"
                value={editUserData.phone}
                onChange={(e) => setEditUserData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-username">اسم المستخدم *</Label>
              <Input
                id="edit-username"
                placeholder="أدخل اسم المستخدم"
                value={editUserData.username}
                onChange={(e) => setEditUserData(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">كلمة المرور الجديدة</Label>
              <div className="relative">
                <Input
                  id="edit-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="اتركها فارغة للاحتفاظ بالحالية"
                  value={editUserData.password}
                  onChange={(e) => setEditUserData(prev => ({ ...prev, password: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">الدور *</Label>
              <Select value={editUserData.role} onValueChange={(value) => setEditUserData(prev => ({ ...prev, role: value as User['role'] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableRoles().map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-organization">المنظمة</Label>
              <Input
                id="edit-organization"
                placeholder="أدخل اسم المنظمة"
                value={editUserData.organization}
                onChange={(e) => setEditUserData(prev => ({ ...prev, organization: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">الحالة *</Label>
              <Select value={editUserData.status} onValueChange={(value) => setEditUserData(prev => ({ ...prev, status: value as User['status'] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                  <SelectItem value="pending">في الانتظار</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveEditUser}>
              <Save className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Beneficiary Dialog */}
      <Dialog open={isEditBeneficiaryOpen} onOpenChange={setIsEditBeneficiaryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل بيانات المستفيد</DialogTitle>
            <DialogDescription>
              تحديث بيانات المستفيد المحدد
            </DialogDescription>
          </DialogHeader>
          {editingBeneficiary && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-beneficiary-name">الاسم الكامل *</Label>
                <Input
                  id="edit-beneficiary-name"
                  placeholder="أدخل الاسم الكامل"
                  value={editingBeneficiary.name}
                  onChange={(e) => setEditingBeneficiary(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-beneficiary-email">البريد الإلكتروني *</Label>
                <Input
                  id="edit-beneficiary-email"
                  type="email"
                  placeholder="أدخل البريد الإلكتروني"
                  value={editingBeneficiary.email}
                  onChange={(e) => setEditingBeneficiary(prev => prev ? ({ ...prev, email: e.target.value }) : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-beneficiary-phone">رقم الهاتف</Label>
                <Input
                  id="edit-beneficiary-phone"
                  placeholder="أدخل رقم الهاتف"
                  value={editingBeneficiary.phone || ''}
                  onChange={(e) => setEditingBeneficiary(prev => prev ? ({ ...prev, phone: e.target.value }) : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-beneficiary-organization">المنظمة</Label>
                <Input
                  id="edit-beneficiary-organization"
                  placeholder="أدخل اسم المنظمة"
                  value={editingBeneficiary.organization || ''}
                  onChange={(e) => setEditingBeneficiary(prev => prev ? ({ ...prev, organization: e.target.value }) : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-beneficiary-status">الحالة *</Label>
                <Select 
                  value={editingBeneficiary.status} 
                  onValueChange={(value) => setEditingBeneficiary(prev => prev ? ({ ...prev, status: value as User['status'] }) : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                    <SelectItem value="pending">في الانتظار</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditBeneficiaryOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveEditBeneficiary}>
              <Save className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </EnhancedPageLayout>
  );
}