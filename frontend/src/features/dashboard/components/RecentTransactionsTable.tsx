import React from 'react';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { RecentTransaction } from '../types/dashboard.types';

interface RecentTransactionsTableProps {
  transactions: RecentTransaction[];
}

export const RecentTransactionsTable: React.FC<RecentTransactionsTableProps> = ({ transactions }) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="glass-card p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
          <p className="text-xs text-slate-400">Latest 10 incomes and expenses activity</p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="h-32 flex items-center justify-center text-xs text-slate-500">
          No recent activity found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Title</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3">
                    {tx.type === 'INCOME' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        <ArrowUpRight className="h-3 w-3" /> Income
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                        <ArrowDownRight className="h-3 w-3" /> Expense
                      </span>
                    )}
                  </td>
                  <td className="py-3 font-medium text-slate-200">{tx.title}</td>
                  <td className="py-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-medium text-slate-200"
                      style={{ backgroundColor: `${tx.categoryColor}20`, border: `1px solid ${tx.categoryColor}40` }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: tx.categoryColor }}
                      ></span>
                      {tx.categoryName}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-500" />
                    {formatDate(tx.date)}
                  </td>
                  <td
                    className={`py-3 text-right font-bold font-mono ${
                      tx.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
