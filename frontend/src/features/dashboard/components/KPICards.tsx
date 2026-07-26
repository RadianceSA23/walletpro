import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Calendar, CreditCard } from 'lucide-react';
import { KPIMetrics } from '../types/dashboard.types';

interface KPICardsProps {
  metrics: KPIMetrics;
}

export const KPICards: React.FC<KPICardsProps> = ({ metrics }) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Current Balance */}
      <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Balance</span>
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Wallet className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className={`text-2xl font-bold tracking-tight ${metrics.currentBalance >= 0 ? 'text-white' : 'text-rose-400'}`}>
            {formatCurrency(metrics.currentBalance)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Total Net Liquidity</p>
        </div>
      </div>

      {/* Today Expenses */}
      <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today Expenses</span>
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <TrendingDown className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-rose-400">
            {formatCurrency(metrics.todayExpenses)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Logged today</p>
        </div>
      </div>

      {/* Today Income */}
      <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today Income</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-emerald-400">
            {formatCurrency(metrics.todayIncome)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Received today</p>
        </div>
      </div>

      {/* Monthly Expense */}
      <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Expense</span>
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <CreditCard className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-amber-300">
            {formatCurrency(metrics.monthlyExpense)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Current billing cycle</p>
        </div>
      </div>

      {/* Monthly Income */}
      <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Income</span>
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Calendar className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-indigo-300">
            {formatCurrency(metrics.monthlyIncome)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Current billing cycle</p>
        </div>
      </div>
    </div>
  );
};
