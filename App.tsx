
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { LiveLab } from './pages/LiveLab';
import { GrammarHub } from './pages/GrammarHub';
import { VocabVisualizer } from './pages/VocabVisualizer';
import { CultureBook } from './pages/CultureBook';
import { JobPrep } from './pages/JobPrep';
import { LiveTeachers } from './pages/LiveTeachers';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Pricing } from './pages/Pricing';
import { Classroom } from './pages/Classroom';
import { LessonDetail } from './pages/LessonDetail';
import { AdminPanel } from './pages/AdminPanel';
import { authService } from './services/auth';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return authService.isAuthenticated() ? (
    <Layout>{children}</Layout>
  ) : (
    <Navigate to="/welcome" />
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/live" element={<PrivateRoute><LiveLab /></PrivateRoute>} />
        <Route path="/classroom" element={<PrivateRoute><Classroom /></PrivateRoute>} />
        <Route path="/lesson/:id/:level" element={<PrivateRoute><LessonDetail /></PrivateRoute>} />
        <Route path="/grammar" element={<PrivateRoute><GrammarHub /></PrivateRoute>} />
        <Route path="/vocab" element={<PrivateRoute><VocabVisualizer /></PrivateRoute>} />
        <Route path="/culture" element={<PrivateRoute><CultureBook /></PrivateRoute>} />
        <Route path="/career" element={<PrivateRoute><JobPrep /></PrivateRoute>} />
        <Route path="/tutors" element={<PrivateRoute><LiveTeachers /></PrivateRoute>} />
        <Route path="/pricing" element={<PrivateRoute><Pricing /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
