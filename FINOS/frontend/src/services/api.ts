const API_BASE = '/api/v1';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  getDashboardMetrics: () => fetchApi<any>('/dashboard/metrics'),
  getGlobalPulse: () => fetchApi<any>('/dashboard/pulse'),
  getTransactions: (params?: string) => fetchApi<any>(`/transactions/${params ? `?${params}` : ''}`),
  getTransactionDetail: (id: number) => fetchApi<any>(`/transactions/${id}`),
  getBudgets: () => fetchApi<any>('/budgets/'),
  getCashFlow: () => fetchApi<any>('/cash-flow/'),
  getRiskSummary: () => fetchApi<any>('/risk/summary'),
  getForecasting: (periods: number = 6) => fetchApi<any>(`/forecasting/?periods=${periods}`),
  getAgents: () => fetchApi<any>('/agents/'),
  getAgentTimeline: () => fetchApi<any>('/agents/timeline'),
  triggerAgentStep: () => fetchApi<any>('/agents/trigger', { method: 'POST' }),
  runAStar: (data: any) => fetchApi<any>('/algorithms/a-star', { method: 'POST', body: JSON.stringify(data) }),
  runCSP: (data: any) => fetchApi<any>('/algorithms/csp', { method: 'POST', body: JSON.stringify(data) }),
  runLogicRules: (data: any) => fetchApi<any>('/algorithms/logic-rules', { method: 'POST', body: JSON.stringify(data) }),
  runBayesian: (data: any) => fetchApi<any>('/algorithms/bayesian-risk', { method: 'POST', body: JSON.stringify(data) }),
  runMinimax: () => fetchApi<any>('/algorithms/minimax', { method: 'POST' }),
  runAnomaly: () => fetchApi<any>('/algorithms/anomaly-detection', { method: 'POST' }),
  runPlanner: (data: any) => fetchApi<any>('/planner/optimize', { method: 'POST', body: JSON.stringify(data) }),
  getReportsList: () => fetchApi<any>('/reports/'),
  getAuditTrail: (params?: string) => fetchApi<any>(`/audit/${params ? `?${params}` : ''}`),
  getSystemStatus: () => fetchApi<any>('/system/status'),
  getSettings: () => fetchApi<any>('/settings/'),
  updateSettings: (data: any) => fetchApi<any>('/settings/', { method: 'POST', body: JSON.stringify(data) })
};
