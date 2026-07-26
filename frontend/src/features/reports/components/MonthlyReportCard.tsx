import React from 'react';
import { PiggyBank, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { MonthlyReportSummary } from '../types/reports.types';

interface MonthlyReportCardProps {
  report: MonthlyReportSummary;
}

export const MonthlyReportCard: React.FC<MonthlyReportCardProps> = ({ report }) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="glass-card p-6 rounded-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Monthly Financial Performance</h3>
          <p className="text-xs text-slate-400">Year {report.year} — Month {report.month}</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          Savings Rate: {report.savingsRate}%
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Income</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">
            {formatCurrency(report.totalIncome)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Expenses</span>
            <TrendingDown className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400 font-mono">
            {formatCurrency(report.totalExpense)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Net Monthly Savings</span>
            <PiggyBank className="h-4 w-4 text-purple-400" />
          </div>
          <div className={`text-xl font-bold font-mono ${report.netSavings >= 0 ? 'text-purple-300' : 'text-rose-400'}`}>
            {formatCurrency(report.netSavings)}
          </div>
        </div>
      </div>
    </div>
  );
};
