
import React, { useEffect, useState } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  return { notifications, notify };
};

export const NotificationContainer: React.FC<{ notifications: Notification[] }> = ({ notifications }) => {
  return (
    <div className="fixed bottom-8 right-8 z-[200] space-y-3 pointer-events-none">
      {notifications.map(n => (
        <div 
          key={n.id} 
          className={`px-6 py-4 rounded-2xl shadow-2xl border-2 animate-in slide-in-from-right-12 duration-300 pointer-events-auto flex items-center space-x-3 min-w-[300px] ${
            n.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
            n.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800' :
            'bg-indigo-50 border-indigo-100 text-indigo-800'
          }`}
        >
          <span className="text-xl">
            {n.type === 'success' ? '✅' : n.type === 'error' ? '❌' : '🔔'}
          </span>
          <p className="font-bold text-sm">{n.message}</p>
        </div>
      ))}
    </div>
  );
};
