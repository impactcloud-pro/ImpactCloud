import { 
  PlayCircle,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return PlayCircle;
    case 'draft':
      return Clock;
    case 'completed':
      return CheckCircle;
    default:
      return AlertCircle;
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'active':
      return 'نشط';
    case 'draft':
      return 'مسودة';
    case 'completed':
      return 'مكتمل';
    default:
      return 'غير معروف';
  }
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const getSectorTitle = (sectorId: string): string => {
  switch (sectorId) {
    case 'income_work':
      return 'الدخل والعمل';
    case 'health_environment':
      return 'الصحة والبيئة';
    case 'housing_infrastructure':
      return 'الإسكان والبنية التحتية';
    case 'education_culture':
      return 'التعليم والثقافة';
    default:
      return sectorId;
  }
};