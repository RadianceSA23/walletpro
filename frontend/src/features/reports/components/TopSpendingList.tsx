import React from 'react';
import { TopCategoryReportItem } from '../types/reports.types';

interface TopSpendingListProps {
  categories: TopCategoryReportItem[];
}

export const TopSpendingList: React.FC<TopSpendingListProps> = ({ categories }) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="glass-card p-6 rounded-2xl space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">Top Spending Categories</h3>
        <p className="text-xs text-slate-400">Highest expenditure taxonomy ranking</p>
      </div>

      {categories.length === 0 ? (
        <div className="h-36 flex items-center justify-center text-xs text-slate-500">
          No expenditure data logged.
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-purple-400 font-bold">#{idx + 1}</span>
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: cat.color || '#6366F1' }}
                  ></span>
                  <span className="text-slate-200 font-medium">{cat.categoryName}</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-400 text-2xs">{cat.transactionCount} txns</span>
                  <span className="text-rose-400 font-bold">{formatCurrency(cat.totalAmount)}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color || '#6366F1',
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
