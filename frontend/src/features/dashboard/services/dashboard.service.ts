import { api } from '../../../shared/services/api';
import { DashboardSummaryResponse } from '../types/dashboard.types';

export const fetchDashboardSummary = async (): Promise<DashboardSummaryResponse> => {
  const response = await api.get<{ data: DashboardSummaryResponse }>('/dashboard/summary');
  return response.data.data;
};
