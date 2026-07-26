import { api } from '../../../shared/services/api';
import { MonthlyReportSummary, YearlyReportSummary, TopCategoryReportItem } from '../types/reports.types';

export const fetchMonthlyReport = async (year: number, month: number): Promise<MonthlyReportSummary> => {
  const response = await api.get<{ data: MonthlyReportSummary }>('/reports/monthly', { params: { year, month } });
  return response.data.data;
};

export const fetchYearlyReport = async (year: number): Promise<YearlyReportSummary> => {
  const response = await api.get<{ data: YearlyReportSummary }>('/reports/yearly', { params: { year } });
  return response.data.data;
};

export const fetchTopSpending = async (year: number, month?: number): Promise<TopCategoryReportItem[]> => {
  const response = await api.get<{ data: TopCategoryReportItem[] }>('/reports/top-spending', { params: { year, month } });
  return response.data.data;
};

export const triggerCSVDownload = (type: 'expenses' | 'income', year: number, month?: number) => {
  let url = `/api/v1/reports/export/csv?type=${type}&year=${year}`;
  if (month) url += `&month=${month}`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${type}-report-${year}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
