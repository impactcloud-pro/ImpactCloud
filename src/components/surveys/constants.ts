import { Survey } from '../../App';

// Mock database for surveys (simulates a real database)
let surveysDatabase: Survey[] = [];

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