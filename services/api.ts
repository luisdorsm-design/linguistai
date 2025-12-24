import { ProficiencyLevel } from '../types';

interface ActivityLog {
  id: string;
  type: 'quiz' | 'voice' | 'culture' | 'vocab';
  title: string;
  xpEarned: number;
  timestamp: number;
}

interface UserDB {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: ProficiencyLevel;
  completed: string[];
  logs: ActivityLog[];
  subscription: 'starter' | 'pro' | 'immersion';
}

interface LessonDB {
  id: string;
  title: string;
  level: string;
  icon: string;
  category: string;
  description?: string;
  videoUrl?: string;
  custom?: boolean;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const LEVELS: ProficiencyLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const XP_PER_LEVEL = 1000;

const DEFAULT_COURSES: LessonDB[] = [
  { id: 'pres-cont', title: 'Present Continuous', level: 'A1', icon: '🏃', category: 'Grammar' },
  { id: 'job-interview', title: 'Corporate Interview Prep', level: 'B2', icon: '💼', category: 'Business' },
  { id: 'condit-1', title: 'First Conditional', level: 'B1', icon: '🔀', category: 'Grammar' },
  { id: 'travel-airport', title: 'Airport Survival', level: 'A2', icon: '✈️', category: 'Travel' }
];

export const api = {
  _saveUser: (user: UserDB) => {
    const levelIndex = Math.min(Math.floor(user.xp / XP_PER_LEVEL), LEVELS.length - 1);
    user.level = LEVELS[levelIndex];
    localStorage.setItem('db_user', JSON.stringify(user));
  },

  auth: {
    login: async (password: string): Promise<UserDB | null> => {
      await delay(800);
      if (password === 'LINGUIST2025') {
        let user = JSON.parse(localStorage.getItem('db_user') || 'null');
        if (!user) {
          user = {
            id: 'u1',
            name: 'Emprendedor Linguist',
            email: 'admin@linguistai.com',
            xp: 250,
            level: 'A1',
            completed: [],
            logs: [],
            subscription: 'starter'
          };
          api._saveUser(user);
        }
        localStorage.setItem('isAuthenticated', 'true');
        return user;
      }
      return null;
    },
    logout: () => {
      localStorage.removeItem('isAuthenticated');
    },
    me: (): UserDB => {
      const data = localStorage.getItem('db_user');
      if (data) return JSON.parse(data);
      return { 
        id: 'u0', name: 'Estudiante', email: '', xp: 0, level: 'A1', 
        completed: [], logs: [], subscription: 'starter' 
      };
    },
    updateSubscription: async (plan: 'pro' | 'immersion') => {
      await delay(1000);
      const user = api.auth.me();
      user.subscription = plan;
      api._saveUser(user);
      return user;
    }
  },

  lessons: {
    getAll: async (): Promise<LessonDB[]> => {
      await delay(400);
      const customs = JSON.parse(localStorage.getItem('db_lessons_custom') || '[]');
      return [...DEFAULT_COURSES, ...customs];
    },
    getById: async (id: string): Promise<LessonDB | undefined> => {
      const all = await api.lessons.getAll();
      return all.find(l => l.id === id);
    },
    create: async (lesson: Omit<LessonDB, 'id'>): Promise<LessonDB> => {
      await delay(1000);
      const id = lesson.title.toLowerCase().replace(/\s+/g, '-');
      const newLesson = { ...lesson, id, custom: true };
      const existing = JSON.parse(localStorage.getItem('db_lessons_custom') || '[]');
      localStorage.setItem('db_lessons_custom', JSON.stringify([...existing, newLesson]));
      return newLesson;
    },
    reset: () => {
      localStorage.removeItem('db_lessons_custom');
      localStorage.removeItem('db_user');
      window.location.reload();
    }
  },

  progress: {
    saveActivity: async (type: ActivityLog['type'], title: string, score: number, lessonId?: string): Promise<UserDB> => {
      await delay(500);
      const user = api.auth.me();
      const xpEarned = Math.floor(score * 10);
      
      const newLog: ActivityLog = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        title,
        xpEarned,
        timestamp: Date.now()
      };

      user.xp += xpEarned;
      user.logs = [newLog, ...(user.logs || [])].slice(0, 50);
      
      if (lessonId && !user.completed.includes(lessonId)) {
        user.completed.push(lessonId);
      }

      api._saveUser(user);
      return user;
    }
  },

  db: {
    getRaw: () => {
      return {
        user: api.auth.me(),
        customLessons: JSON.parse(localStorage.getItem('db_lessons_custom') || '[]'),
        auth: localStorage.getItem('isAuthenticated'),
        storageUsage: `${(JSON.stringify(localStorage).length / 1024).toFixed(2)} KB`
      };
    }
  }
};
