import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { KPICards } from './KPICards';
import { MonthlyTrendChart } from './MonthlyTrendChart';
import { CategoryBreakdownChart } from './CategoryBreakdownChart';
import { RecentTransactionsTable } from './RecentTransactionsTable';

export const DashboardView: React.FC = () => {
  const { data, isLoading, isError, refetch, isRefetching } = useDashboard();

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="h-8 w-8 text-purple-500 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Aggregating financial metrics...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="glass-card p-8 rounded-2xl text-center space-y-4 max-w-md mx-auto my-12">
        <div className="h-12 w-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Dashboard Data Unavailable</h3>
          <p className="text-xs text-slate-400 mt-1">Unable to connect to financial analytics aggregation gateway.</p>
        </div>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-lg shadow-purple-500/20"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} /> Retry Sync
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Sync */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Financial Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">Real-time overview of current balance, income streams, and operational expenses</p>
        </div>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-all"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-purple-400 ${isRefetching ? 'animate-spin' : ''}`} /> Refresh Metrics
        </button>
      </div>

      {/* KPI Cards */}
      <KPICards metrics={data.metrics} />

      {/* Monthly Trend Chart */}
      <MonthlyTrendChart data={data.monthlyTrend} />

      {/* Category Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBreakdownChart title="Expense by Category" data={data.expenseByCategory} />
        <CategoryBreakdownChart title="Income by Category" data={data.incomeByCategory} />
      </div>

      {/* Recent Transactions Table */}
      <RecentTransactionsTable transactions={data.recentTransactions} />
    </div>
  );
};
