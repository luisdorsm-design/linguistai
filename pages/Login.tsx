import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

export const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await authService.login(password);
    if (success) {
      navigate('/');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 p-12 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <h1 className="text-4xl font-black text-indigo-600 mb-2">LinguistAI</h1>
          <p className="text-slate-500">Ingresa la contraseña de acceso</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña (LINGUIST2025)"
              className={`w-full px-6 py-4 rounded-2xl bg-slate-50 border transition-all outline-none text-lg text-center font-bold tracking-widest ${error ? 'border-rose-500 bg-rose-50' : 'border-slate-200 focus:border-indigo-500 focus:bg-white'}`}
            />
            {error && <p className="text-center text-rose-500 text-sm font-bold">Contraseña incorrecta</p>}
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:bg-indigo-700 active:scale-95 transition-all text-lg"
          >
            Acceder a la Plataforma
          </button>
        </form>
      </div>
    </div>
  );
};
