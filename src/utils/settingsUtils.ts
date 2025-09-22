import { toast } from 'sonner';
import { systemRoles, allPermissions } from '../constants/settingsConstants';

export const getUserStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'suspended': return 'bg-red-100 text-red-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getUserStatusLabel = (status: string) => {
  switch (status) {
    case 'active': return 'نشط';
    case 'suspended': return 'معلق';
    case 'pending': return 'في الانتظار';
    default: return status;
  }
};

export const getRoleDisplayName = (role: string) => {
  const roleObj = systemRoles.find(r => r.name === role);
  return roleObj ? roleObj.displayName : role;
};

export const getIntegrationStatusColor = (status: string) => {
  switch (status) {
    case 'connected': return 'bg-green-100 text-green-800';
    case 'disconnected': return 'bg-gray-100 text-gray-800';
    case 'error': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getIntegrationStatusLabel = (status: string) => {
  switch (status) {
    case 'connected': return 'متصل';
    case 'disconnected': return 'غير متصل';
    case 'error': return 'خطأ';
    default: return status;
  }
};

export const getPermissionsByCategory = (category: string) => {
  return allPermissions.filter(p => p.category === category);
};

export const copyBankDetails = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success('تم نسخ النص');
};

export const exportSettingsToExcel = (settingsData: Record<string, any>) => {
  try {
    // Convert to CSV format for Excel compatibility
    let csvContent = 'القسم,المفتاح,القيمة\n';
    
    Object.entries(settingsData).forEach(([section, data]) => {
      if (Array.isArray(data)) {
        // Handle arrays (like users)
        data.forEach((item, index) => {
          Object.entries(item).forEach(([key, value]) => {
            csvContent += `"${section} - ${index + 1}","${key}","${value}"\n`;
          });
        });
      } else if (typeof data === 'object') {
        // Handle objects (like settings)
        Object.entries(data).forEach(([key, value]) => {
          csvContent += `"${section}","${key}","${value}"\n`;
        });
      }
    });

    // Create and download file
    const blob = new Blob(['\ufeff' + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `إعدادات-النظام-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('تم تصدير الإعدادات بنجاح كملف Excel');
  } catch (error) {
    toast.error('حدث خطأ في تصدير الإعدادات');
  }
};