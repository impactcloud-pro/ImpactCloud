export const mockSurveyResults = {
  id: 'survey-123',
  title: 'استبيان قياس الأثر الاجتماعي للبرامج التعليمية',
  organization: 'مؤسسة التنمية الاجتماعية',
  totalResponses: 156,
  totalBeneficiaries: 250,
  completionRate: 62.4,
  averageCompletionTime: '12 دقيقة',
  lastUpdated: new Date(),
  status: 'active',
  
  // Demographics data
  demographics: {
    gender: [
      { name: 'ذكر', value: 89, percentage: 57 },
      { name: 'أنثى', value: 67, percentage: 43 }
    ],
    age: [
      { name: '18-25', value: 45, percentage: 29 },
      { name: '26-35', value: 62, percentage: 40 },
      { name: '36-45', value: 35, percentage: 22 },
      { name: '46+', value: 14, percentage: 9 }
    ],
    region: [
      { name: 'الرياض', value: 78, percentage: 50 },
      { name: 'جدة', value: 34, percentage: 22 },
      { name: 'الدمام', value: 26, percentage: 17 },
      { name: 'أخرى', value: 18, percentage: 11 }
    ],
    education: [
      { name: 'ثانوي', value: 32, percentage: 20 },
      { name: 'جامعي', value: 89, percentage: 57 },
      { name: 'دراسات عليا', value: 35, percentage: 23 }
    ]
  },

  // Impact data - before vs after
  impactData: {
    education_culture: {
      title: 'التعليم والثقافة',
      before: 2.3,
      after: 4.1,
      improvement: 78,
      responses: [
        { question: 'تقييم المهارات', before: 2.1, after: 4.2 },
        { question: 'مستوى التعليم', before: 2.5, after: 4.0 },
        { question: 'الثقة بالنفس', before: 2.3, after: 4.1 }
      ]
    },
    income_work: {
      title: 'الدخل والعمل',
      before: 1.8,
      after: 3.7,
      improvement: 105,
      responses: [
        { question: 'فرص العمل', before: 1.5, after: 3.8 },
        { question: 'مستوى الدخل', before: 2.1, after: 3.6 },
        { question: 'الاستقرار المهني', before: 1.8, after: 3.7 }
      ]
    }
  },

  // Trends over time
  trendsData: [
    { date: 'يناير', responses: 23, satisfaction: 3.2 },
    { date: 'فبراير', responses: 34, satisfaction: 3.5 },
    { date: 'مارس', responses: 45, satisfaction: 3.8 },
    { date: 'أبريل', responses: 54, satisfaction: 4.1 }
  ],

  // Key insights
  insights: [
    {
      type: 'positive',
      title: 'تحسن ملحوظ في المهارات',
      description: 'ارتفع متوسط تقييم المهارات من 2.1 إلى 4.2 بنسبة 100%',
      impact: 'high'
    },
    {
      type: 'positive', 
      title: 'زيادة فرص العمل',
      description: '78% من المشاركين حصلوا على عمل أو تحسنت فرصهم الوظيفية',
      impact: 'high'
    },
    {
      type: 'neutral',
      title: 'معدل إكمال جيد',
      description: 'معدل إكمال الاستبيان 62% وهو معدل جيد للاستبيانات الطويلة',
      impact: 'medium'
    },
    {
      type: 'attention',
      title: 'تفاوت في المناطق',
      description: 'هناك تفاوت في النتائج بين المناطق المختلفة يحتاج دراسة',
      impact: 'medium'
    }
  ]
};

export const CHART_COLORS = ['#183259', '#2a4a7a', '#4a6ba3', '#6b85cc', '#8da4c7'];