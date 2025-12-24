
export type ProficiencyLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface UserStats {
  xp: number;
  level: number;
  proficiency: ProficiencyLevel;
  streak: number;
  completedLessons: string[];
}

export interface QuizQuestion {
  id: number;
  type: 'multiple' | 'complete' | 'correct';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  level: ProficiencyLevel;
  theory: string;
  videoUrl?: string;
  quiz: QuizQuestion[];
}

export interface VocabularyItem {
  word: string;
  definition: string;
  example: string;
  imageUrl?: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
