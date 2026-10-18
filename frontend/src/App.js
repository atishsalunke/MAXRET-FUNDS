import React, { useState } from 'react';
import './styles/globals.css';
import { AuthProvider, useAuth } from './utils/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AnalyzePage from './pages/AnalyzePage';
import DashboardPage from './pages/DashboardPage';
import ExplorePage from './pages/ExplorePage';
import PortfolioPage from './pages/PortfolioPage';

function AppInner() {
  const { updatePortfolio } = useAuth();
  const [page, setPage] = useState('home');
  const [results, setResults] = useState(null);

  const navigate = (p) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPage(p);
  };

  const handleResults = (data) => {
    setResults(data);
    // Save to user portfolio history
    updatePortfolio(data);
    navigate('dashboard');
  };

  const handleReset = () => {
    setResults(null);
    navigate('analyze');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="bg-grid" />
      <div className="bg-glow-1" />
      <div className="bg-glow-2" />

      {page !== 'auth' && <Navbar currentPage={page} onNavigate={navigate} />}

      {page === 'home'      && <HomePage onNavigate={navigate} />}
      {page === 'auth'      && <AuthPage onNavigate={navigate} />}
      {page === 'analyze'   && <AnalyzePage onResults={handleResults} />}
      {page === 'dashboard' && <DashboardPage results={results} onReset={handleReset} />}
      {page === 'explore'   && <ExplorePage onNavigate={navigate} />}
      {page === 'portfolio' && <PortfolioPage onNavigate={navigate} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}