
import { api } from './api';

export const authService = {
  login: async (password: string) => {
    const user = await api.auth.login(password);
    return !!user;
  },
  logout: () => {
    api.auth.logout();
  },
  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },
  getUser: () => {
    return api.auth.me();
  },
  updateProgress: async (xpToAdd: number, lessonId: string) => {
    // Nota: El XP ahora se calcula basado en el score en api.progress.saveActivity
    // Fix: Use saveActivity instead of save as defined in services/api.ts
    return await api.progress.saveActivity('quiz', `Progress: ${lessonId}`, xpToAdd / 10, lessonId);
  }
};
