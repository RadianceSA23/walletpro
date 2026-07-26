import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { CategoryBreakdownItem } from '../types/dashboard.types';

interface CategoryBreakdownChartProps {
  title: string;
  data: CategoryBreakdownItem[];
}

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ title, data }) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="glass-card p-6 rounded-2xl space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-xs text-slate-400">Distribution by category</p>
      </div>

      {data.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-xs text-slate-500">
          No records logged yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                  }}
                  formatter={(value: any) => formatCurrency(Number(value))}
                />
                <Pie
                  data={data}
                  dataKey="totalAmount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {data.map((item, index) => (
                    <Cell key={`cell-${index}`} fill={item.color || '#6366F1'} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {data.map((item) => (
              <div key={item.categoryId} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color || '#6366F1' }}
                  ></span>
                  <span className="text-slate-300 font-medium truncate max-w-[120px]">
                    {item.categoryName}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-400">{item.percentage}%</span>
                  <span className="text-slate-200 font-semibold">{formatCurrency(item.totalAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
