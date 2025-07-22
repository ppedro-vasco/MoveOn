// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage'; // Dashboard do Admin
import UserPage from './pages/UserPage';   // Dashboard do Usuário
import Navbar from './components/Navbar';

// Importar os componentes do protótipo
import HealthTracker from './pages/HealthTracker';
import Profile from './pages/Profile';
import Recipes from './pages/Recipes';

// NOVO: Importar as páginas específicas do Ambulatório
import AdminAmbulatorioPage from './pages/AdminAmbulatorioPage'; // Página do Ambulatório para Admin
import UserAmbulatorioPage from './pages/UserAmbulatorioPage';   // Página do Ambulatório para Usuário

import { AuthProvider, useAuth } from './context/AuthContext';

// Tipagem do usuário (DEVE ser a mesma do AuthContext.tsx)
interface User {
  id: string;
  username: string;
  name: string;
  user_type: 'admin' | 'user';
  cpf?: string;
  registro?: string;
  avatar?: string;
}

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<User['user_type']>;
}

// Componente de rota protegida
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg font-medium text-gray-700">Carregando autenticação...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.user_type)) {
    console.warn(`Usuário ${user.username} (${user.user_type}) tentou acessar rota restrita. Redirecionando.`);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Componente que decide qual página do Ambulatório renderizar
const AmbulatorioRouter: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg font-medium text-gray-700">Carregando Ambulatório...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.user_type === 'admin') {
    return <AdminAmbulatorioPage />;
  } else if (user.user_type === 'user') {
    return <UserAmbulatorioPage />;
  } else {
    // Caso um tipo de usuário inesperado acesse /ambulatorio
    return <Navigate to="/login" replace />;
  }
};


// Conteúdo principal da aplicação
const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  let defaultRedirect = "/login";

  if (!loading && user) {
    if (user.user_type === 'admin') {
      defaultRedirect = "/admin";
    } else if (user.user_type === 'user') {
      defaultRedirect = "/user";
    } else {
      defaultRedirect = "/login";
    }
  }

  const showNavbar = user && !loading && location.pathname !== '/login';

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {showNavbar && <Navbar />}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminPage />
            </PrivateRoute>
          } />
          <Route path="/user" element={
            <PrivateRoute allowedRoles={['user']}>
              <UserPage />
            </PrivateRoute>
          } />
          {/* Rotas para os componentes do protótipo */}
          <Route path="/health-tracker" element={
            <PrivateRoute allowedRoles={['admin', 'user']}>
              <HealthTracker />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute allowedRoles={['admin', 'user']}>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/recipes" element={
            <PrivateRoute allowedRoles={['admin', 'user']}>
              <Recipes />
            </PrivateRoute>
          } />
          {/* NOVO: Rota para o Ambulatório, que usará o AmbulatorioRouter */}
          <Route path="/ambulatorio" element={
            <PrivateRoute allowedRoles={['admin', 'user']}> {/* Protege o acesso geral ao /ambulatorio */}
              <AmbulatorioRouter /> {/* Componente que decide a página específica */}
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to={defaultRedirect} replace />} />
        </Routes>
      </main>
    </div>
  );
};

// Componente principal
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
