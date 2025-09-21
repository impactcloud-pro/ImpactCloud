import { Survey } from '../../App';

// Mock database for surveys (simulates a real database)
let surveysDatabase: Survey[] = [
  {
    id: 'survey-001',
    title: 'استبيان قياس الأثر الاجتماعي - برنامج التدريب المهني',
    organization: 'مؤسسة التنمية المهنية',
    description: 'قياس أثر برنامج التدريب المهني على تحسين فرص العمل والدخل للمستفيدين',
    selectedSectors: ['income_work', 'education_culture'],
    selectedFilters: ['gender', 'age', 'education'],
    preQuestions: [],
    postQuestions: [],
    beneficiaries: [],
    createdAt: new Date('2024-01-15'),
    status: 'active',
    responses: 45
  },
  {
    id: 'survey-002',
    title: 'استبيان تقييم برنامج الدعم الصحي',
    organization: 'جمعية الرعاية الصحية',
    description: 'تقييم فعالية برامج الدعم الصحي والتوعية الصحية',
    selectedSectors: ['health_environment'],
    selectedFilters: ['gender', 'age', 'region'],
    preQuestions: [],
    postQuestions: [],
    beneficiaries: [],
    createdAt: new Date('2024-01-10'),
    status: 'active',
    responses: 32
  },
  {
    id: 'survey-003',
    title: 'دراسة أثر مشاريع الإسكان التنموي',
    organization: 'مؤسسة الإسكان التنموي',
    description: 'قياس أثر مشاريع الإسكان على تحسين جودة الحياة',
    selectedSectors: ['housing_infrastructure'],
    selectedFilters: ['region', 'marital_status', 'income'],
    preQuestions: [],
    postQuestions: [],
    beneficiaries: [],
    createdAt: new Date('2024-01-05'),
    status: 'completed',
    responses: 78
  },
  {
    id: 'survey-004',
    title: 'استبيان تقييم برامج التعليم المجتمعي',
    organization: 'مؤسسة التعليم للجميع',
    description: 'قياس أثر برامج محو الأمية والتعليم المجتمعي على المستفيدين',
    selectedSectors: ['education_culture'],
    selectedFilters: ['gender', 'age', 'education', 'region'],
    preQuestions: [],
    postQuestions: [],
    beneficiaries: [],
    createdAt: new Date('2024-01-20'),
    status: 'draft',
    responses: 12
  },
  {
    id: 'survey-005',
    title: 'دراسة تأثير برامج التمكين الاقتصادي للنساء',
    organization: 'جمعية تمكين المرأة',
    description: 'تقييم أثر برامج التمكين الاقتصادي على زيادة دخل النساء واستقلاليتهن المالية',
    selectedSectors: ['income_work'],
    selectedFilters: ['gender', 'age', 'marital_status', 'education'],
    preQuestions: [],
    postQuestions: [],
    beneficiaries: [],
    createdAt: new Date('2024-02-01'),
    status: 'active',
    responses: 67
  }
];

// Function to get all surveys from the database
export function getAllSurveys(): Survey[] {
  return [...surveysDatabase];
}

// Function to add a survey to the database
export function addSurveyToDatabase(survey: Survey): void {
  surveysDatabase.unshift(survey);
}

// Function to delete a survey from the database
export function deleteSurveyFromDatabase(surveyId: string): boolean {
  const initialLength = surveysDatabase.length;
  surveysDatabase = surveysDatabase.filter(survey => survey.id !== surveyId);
  return surveysDatabase.length < initialLength;
}

// Function to update a survey in the database
export function updateSurveyInDatabase(surveyId: string, updatedSurvey: Survey): boolean {
  const index = surveysDatabase.findIndex(survey => survey.id === surveyId);
  if (index !== -1) {
    surveysDatabase[index] = updatedSurvey;
    return true;
  }
  return false;
}

// Function to get a specific survey from the database
export function getSurveyFromDatabase(surveyId: string): Survey | undefined {
  return surveysDatabase.find(survey => survey.id === surveyId);
}

// Export for backward compatibility
export const mockSurveys = surveysDatabase;