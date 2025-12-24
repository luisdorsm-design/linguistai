
import React, { useState } from 'react';
import { api } from '../services/api';
import { useNotifications, NotificationContainer } from '../components/Notifications';
import { useNavigate } from 'react-router-dom';

const PlanCard: React.FC<{ name: string, price: string, features: string[], popular?: boolean, onSelect: () => void }> = ({ name, price, features, popular, onSelect }) => (
  <div className={`relative p-8 rounded-[2.5rem] bg-white border-2 transition-all hover:scale-[1.02] ${popular ? 'border-indigo-600 shadow-2xl shadow-indigo-100' : 'border-slate-100 shadow-lg'}`}>
    {popular && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
        Más Popular
      </div>
    )}
    <h3 className="text-xl font-bold text-slate-800 mb-2">{name}</h3>
    <div className="flex items-baseline mb-8">
      <span className="text-4xl font-black text-slate-900">${price}</span>
      <span className="text-slate-500 ml-1">/mes</span>
    </div>
    <ul className="space-y-4 mb-8">
      {features.map((f, i) => (
        <li key={i} className="flex items-center text-slate-600 text-sm">
          <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 text-[10px] font-bold">✓</span>
          {f}
        </li>
      ))}
    </ul>
    <button 
      onClick={onSelect}
      className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${popular ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
    >
      Activar Plan →
    </button>
  </div>
);

export const Pricing: React.FC = () => {
  const { notify, notifications } = useNotifications();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSelect = async (plan: 'pro' | 'immersion') => {
    setLoading(true);
    try {
      await api.auth.updateSubscription(plan);
      notify(`¡Plan ${plan.toUpperCase()} activado con éxito!`, "success");
      setTimeout(() => navigate('/'), 1500);
    } catch (e) {
      notify("Error al procesar pago simulado", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12">
      <NotificationContainer notifications={notifications} />
      
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[300] flex flex-col items-center justify-center space-y-6">
           <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="font-black text-slate-900 uppercase tracking-widest text-xs">Conectando con Pasarela de Pago...</p>
        </div>
      )}

      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl font-[900] text-slate-900 tracking-tight">Impulsa tu Inglés 🚀</h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">Únete a cientos de alumnos que ya están dominando el idioma con IA avanzada.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <PlanCard 
          name="Starter" 
          price="0" 
          features={['Acceso al Culture Book (5 escenarios)', 'IA Tutor Limitado (10 min/día)', 'Niveles A1-A2', 'Vocabulario Básico']} 
          onSelect={() => notify("Ya estás en el plan Starter", "info")}
        />
        <PlanCard 
          name="Professional" 
          price="29" 
          popular
          features={['Escenarios culturales ilimitados', 'IA Tutor Ilimitado (Kore)', 'Niveles A1-C2', 'Career Prep STAR', 'Soporte prioritario']} 
          onSelect={() => handleSelect('pro')}
        />
        <PlanCard 
          name="Immersion" 
          price="99" 
          features={['Clases con Nativos Certificados', 'Plan de Estudio Personalizado', 'Certificación Blockchain', 'Acceso a Eventos VIP']} 
          onSelect={() => handleSelect('immersion')}
        />
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-[900] tracking-tight">Seguridad de Grado Bancario 🔒</h2>
            <p className="text-indigo-200/60 max-w-sm font-medium">Tus pagos están protegidos por encriptación de extremo a extremo y procesamiento vía Stripe.</p>
            <div className="flex space-x-6 pt-4">
               <span className="text-xl font-black tracking-widest opacity-40">VISA</span>
               <span className="text-xl font-black tracking-widest opacity-40">MASTERCARD</span>
               <span className="text-xl font-black tracking-widest opacity-40">AMEX</span>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 w-full max-w-md">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</div>
                <p className="text-sm font-bold">Garantía de devolución de 14 días</p>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</div>
                <p className="text-sm font-bold">Cancela en cualquier momento</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
