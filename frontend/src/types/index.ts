export interface MetricItem {
  value: number;
  change: number;
  trend?: 'UP' | 'DOWN' | 'STABLE';
  sparkline?: number[];
  symbol?: string;
  price?: number;
  change_pct?: number;
}

export interface DashboardMetrics {
  total_assets: MetricItem;
  available_balance: MetricItem;
  total_expenditure: MetricItem;
  net_cash_flow: MetricItem;
  pending_payments: MetricItem;
  risk_exposure: MetricItem;
  budget_utilization: MetricItem;
  market_index: MetricItem;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  asset_type: 'INDEX' | 'FOREX' | 'COMMODITY' | 'CRYPTO' | 'EQUITY';
  price: number;
  change_amount: number;
  change_pct: number;
  high_24h: number;
  low_24h: number;
  volume: number;
  last_updated: string;
}

export interface GlobalPulseData {
  mode: string;
  timestamp: string;
  assets: MarketAsset[];
}

export interface Transaction {
  id: number;
  transaction_code: string;
  account_id: number;
  department_id: number;
  department_name?: string;
  category: string;
  amount: number;
  currency: string;
  transaction_type: 'DEBIT' | 'CREDIT';
  risk_score: number;
  status: 'Completed' | 'Pending' | 'Flagged' | 'Under Review' | 'Failed';
  timestamp: string;
  description?: string;
  counterparty?: string;
  anomaly_reason?: string;
}

export interface DepartmentBudget {
  department_id: number;
  department_code: string;
  department_name: string;
  allocated_budget: number;
  spent_budget: number;
  remaining_budget: number;
  utilization_pct: number;
  manager: string;
  risk_level: string;
  status: string;
}

export interface AgentRun {
  id: number;
  name: string;
  status: 'ACTIVE' | 'IDLE' | 'WAITING' | 'WARNING' | 'ERROR';
  current_task: string;
  last_run: string;
  confidence: number;
  risk_rating: number;
  events_processed: number;
  execution_time_ms: number;
}

export interface AgentEvent {
  timestamp: string;
  stage: string;
  agent_name: string;
  message: string;
  confidence: number;
  risk_rating: number;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  user_or_agent: string;
  action: string;
  entity_type: string;
  entity_id: string;
  previous_value?: string;
  new_value?: string;
  risk_rating: string;
  result: string;
}
