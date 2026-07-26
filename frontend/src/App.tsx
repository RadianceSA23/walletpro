import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Terminal, LayoutDashboard, BarChart3, LogOut, User } from 'lucide-react';
import { DashboardView } from './features/dashboard/components/DashboardView';
import { ReportsView } from './features/reports/components/ReportsView';
import { LoginView } from './features/auth/components/LoginView';
import { logoutUser } from './features/auth/services/auth.service';

export default function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const profile = localStorage.getItem('user_profile');
    if (token && profile) {
      setIsAuthenticated(true);
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  const handleLoginSuccess = () => {
    const profile = localStorage.getItem('user_profile');
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
    setIsAuthenticated(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              ExpenseTracker <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 ml-2">Enterprise SaaS</span>
            </span>
          </div>

          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                    location.pathname === '/'
                      ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                <Link
                  to="/reports"
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                    location.pathname === '/reports'
                      ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  Reports & CSV
                </Link>

                <div className="h-4 w-px bg-slate-800"></div>

                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <div className="h-7 w-7 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span>{userProfile?.firstName} {userProfile?.lastName}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : null}

            <a
              href="http://localhost:5001/api/docs"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-1.5 ml-2"
            >
              <Terminal className="h-4 w-4" />
              Swagger API Docs
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        {!isAuthenticated ? (
          <LoginView onSuccess={handleLoginSuccess} />
        ) : (
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="/reports" element={<ReportsView />} />
          </Routes>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-slate-500">
          Enterprise Expense Tracker SaaS Architecture — Solution Architect Portfolio Grade
        </div>
      </footer>
    </div>
  );
}
