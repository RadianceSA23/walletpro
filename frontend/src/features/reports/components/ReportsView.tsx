import React, { useState } from 'react';
import { Download, Calendar, Filter, RefreshCw } from 'lucide-react';
import { useMonthlyReport, useYearlyReport, useTopSpending } from '../hooks/useReports';
import { triggerCSVDownload } from '../services/reports.service';
import { MonthlyReportCard } from './MonthlyReportCard';
import { YearlyReportChart } from './YearlyReportChart';
import { TopSpendingList } from './TopSpendingList';

export const ReportsView: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  const monthlyReportQuery = useMonthlyReport(selectedYear, selectedMonth);
  const yearlyReportQuery = useYearlyReport(selectedYear);
  const topSpendingQuery = useTopSpending(selectedYear, selectedMonth);

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Financial Intelligence Reports</h1>
          <p className="text-xs text-slate-400 mt-0.5">Comprehensive audit reports, expenditure taxonomy rankings, and CSV data export</p>
        </div>

        {/* Date Filter & Export Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <Calendar className="h-4 w-4 text-purple-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-slate-200 outline-none cursor-pointer"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y} className="bg-slate-900 text-slate-200">
                  {y}
                </option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent text-slate-200 outline-none cursor-pointer"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value} className="bg-slate-900 text-slate-200">
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => triggerCSVDownload('expenses', selectedYear, selectedMonth)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-medium transition-all"
          >
            <Download className="h-3.5 w-3.5" /> Export Expenses CSV
          </button>

          <button
            onClick={() => triggerCSVDownload('income', selectedYear, selectedMonth)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs font-medium transition-all"
          >
            <Download className="h-3.5 w-3.5" /> Export Income CSV
          </button>
        </div>
      </div>

      {/* Monthly Summary */}
      {monthlyReportQuery.data && <MonthlyReportCard report={monthlyReportQuery.data} />}

      {/* Grid: Yearly Chart & Top Spending */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {yearlyReportQuery.data && <YearlyReportChart report={yearlyReportQuery.data} />}
        </div>
        <div>
          {topSpendingQuery.data && <TopSpendingList categories={topSpendingQuery.data} />}
        </div>
      </div>
    </div>
  );
};
