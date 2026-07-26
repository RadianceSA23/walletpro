import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Zap, AlertCircle } from 'lucide-react';
import { loginUser } from '../services/auth.service';

interface LoginViewProps {
  onSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('demo@expensetracker.com');
  const [password, setPassword] = useState('Password@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginUser(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message?.[0] || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setEmail('demo@expensetracker.com');
    setPassword('Password@123');
    setLoading(true);
    setError(null);

    try {
      await loginUser('demo@expensetracker.com', 'Password@123');
      onSuccess();
    } catch (err: any) {
      setError('Demo login failed. Ensure NestJS backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Enterprise Expense Tracker</h2>
          <p className="text-xs text-slate-400">Sign in with your enterprise credentials or launch Demo Mode</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500 transition-all font-mono"
                placeholder="user@expensetracker.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500 transition-all font-mono"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Quick Demo Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-2xs uppercase">
            <span className="bg-slate-950 px-2 text-slate-500 font-semibold tracking-wider">Solution Architect Showcase</span>
          </div>
        </div>

        {/* 1-Click Demo Login Button */}
        <button
          onClick={handleQuickDemo}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-purple-500/30 text-purple-300 text-xs font-bold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/10"
        >
          <Zap className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
          1-Click Launch Demo Account
        </button>

        <div className="text-center text-2xs text-slate-500 font-mono">
          Demo: <span className="text-slate-400">demo@expensetracker.com</span> / <span className="text-slate-400">Password@123</span>
        </div>
      </div>
    </div>
  );
};
