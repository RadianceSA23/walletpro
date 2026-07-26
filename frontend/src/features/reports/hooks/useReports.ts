import { useQuery } from '@tanstack/react-query';
import { fetchMonthlyReport, fetchYearlyReport, fetchTopSpending } from '../services/reports.service';

export const useMonthlyReport = (year: number, month: number) => {
  return useQuery({
    queryKey: ['monthlyReport', year, month],
    queryFn: () => fetchMonthlyReport(year, month),
  });
};

export const useYearlyReport = (year: number) => {
  return useQuery({
    queryKey: ['yearlyReport', year],
    queryFn: () => fetchYearlyReport(year),
  });
};

export const useTopSpending = (year: number, month?: number) => {
  return useQuery({
    queryKey: ['topSpending', year, month],
    queryFn: () => fetchTopSpending(year, month),
  });
};
