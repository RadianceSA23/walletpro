import { useQuery } from '@tanstack/react-query';
import { fetchDashboardSummary } from '../services/dashboard.service';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: fetchDashboardSummary,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
