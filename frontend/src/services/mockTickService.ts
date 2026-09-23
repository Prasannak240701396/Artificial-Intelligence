// Simulated Live Market Tick Service for FINOS Prototype

export interface MarketTick {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  high: number;
  low: number;
  prevClose: number;
  currency: string;
  lastUpdated: string;
  history: { time: string; value: number }[];
}

export interface LiveFinancialEvent {
  id: string;
  timestamp: string;
  title: string;
  type: 'BUDGET' | 'BALANCE' | 'RECEIVABLE' | 'RISK' | 'AGENT';
  message: string;
}

type TickCallback = (ticks: Record<string, MarketTick>) => void;
type EventCallback = (event: LiveFinancialEvent) => void;

class MockTickService {
  private ticks: Record<string, MarketTick> = {
    'NIFTY 50': {
      symbol: 'NIFTY 50',
      name: 'NIFTY 50 Index',
      price: 24580.45,
      change: 142.30,
      changePct: 0.58,
      high: 24650.00,
      low: 24410.20,
      prevClose: 24438.15,
      currency: '₹',
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false }),
      history: this.generateInitialHistory(24438.15, 20),
    },
    'S&P 500': {
      symbol: 'S&P 500',
      name: 'S&P 500 Index',
      price: 5620.10,
      change: 28.50,
      changePct: 0.51,
      high: 5635.80,
      low: 5590.20,
      prevClose: 5591.60,
      currency: '$',
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false }),
      history: this.generateInitialHistory(5591.60, 20),
    },
    'BANK NIFTY': {
      symbol: 'BANK NIFTY',
      name: 'NIFTY Bank Index',
      price: 52340.80,
      change: -180.40,
      changePct: -0.34,
      high: 52800.00,
      low: 52150.00,
      prevClose: 52521.20,
      currency: '₹',
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false }),
      history: this.generateInitialHistory(52521.20, 20),
    },
    'NASDAQ': {
      symbol: 'NASDAQ',
      name: 'NASDAQ Composite',
      price: 17890.25,
      change: 154.60,
      changePct: 0.87,
      high: 17950.00,
      low: 17720.00,
      prevClose: 17735.65,
      currency: '$',
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false }),
      history: this.generateInitialHistory(17735.65, 20),
    },
    'DOW JONES': {
      symbol: 'DOW JONES',
      name: 'Dow Jones Industrial',
      price: 41240.15,
      change: -45.20,
      changePct: -0.11,
      high: 41380.00,
      low: 41100.00,
      prevClose: 41285.35,
      currency: '$',
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false }),
      history: this.generateInitialHistory(41285.35, 20),
    },
    'SENSEX': {
      symbol: 'SENSEX',
      name: 'BSE SENSEX 30',
      price: 81450.60,
      change: 320.40,
      changePct: 0.39,
      high: 81680.00,
      low: 81100.00,
      prevClose: 81130.20,
      currency: '₹',
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false }),
      history: this.generateInitialHistory(81130.20, 20),
    },
    'FTSE 100': {
      symbol: 'FTSE 100',
      name: 'London FTSE 100',
      price: 8280.15,
      change: 42.80,
      changePct: 0.52,
      high: 8310.00,
      low: 8230.00,
      prevClose: 8237.35,
      currency: '£',
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false }),
      history: this.generateInitialHistory(8237.35, 20),
    },
    'NIKKEI 225': {
      symbol: 'NIKKEI 225',
      name: 'Tokyo Nikkei 225',
      price: 37840.50,
      change: -210.30,
      changePct: -0.55,
      high: 38100.00,
      low: 37650.00,
      prevClose: 38050.80,
      currency: '¥',
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false }),
      history: this.generateInitialHistory(38050.80, 20),
    },
    'GOLD RESERVE': {
      symbol: 'GOLD RESERVE',
      name: 'Gold Bullion Futures',
      price: 2510.40,
      change: 18.60,
      changePct: 0.75,
      high: 2525.00,
      low: 2490.00,
      prevClose: 2491.80,
      currency: '$',
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false }),
      history: this.generateInitialHistory(2491.80, 20),
    },
    'CRUDE OIL': {
      symbol: 'CRUDE OIL',
      name: 'Brent Crude Futures',
      price: 74.25,
      change: -1.15,
      changePct: -1.52,
      high: 75.80,
      low: 73.90,
      prevClose: 75.40,
      currency: '$',
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false }),
      history: this.generateInitialHistory(75.40, 20),
    },
  };

  private tickListeners: Set<TickCallback> = new Set();
  private eventListeners: Set<EventCallback> = new Set();
  private timer: any = null;
  private intervalMs: number = 2500;

  constructor() {
    this.startSimulation();
  }

  private generateInitialHistory(basePrice: number, count: number) {
    const history = [];
    const now = new Date();
    for (let i = count; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 60000);
      const noise = (Math.random() - 0.48) * (basePrice * 0.003);
      history.push({
        time: t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        value: Number((basePrice + noise).toFixed(2)),
      });
    }
    return history;
  }

  public setSpeed(ms: number) {
    this.intervalMs = ms;
    if (this.timer) {
      clearInterval(this.timer);
      this.startSimulation();
    }
  }

  private startSimulation() {
    this.timer = setInterval(() => {
      const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });

      Object.keys(this.ticks).forEach((sym) => {
        const item = this.ticks[sym];
        const deltaPct = (Math.random() - 0.49) * 0.0015;
        const newPrice = Number((item.price * (1 + deltaPct)).toFixed(2));
        const diff = Number((newPrice - item.prevClose).toFixed(2));
        const pct = Number(((diff / item.prevClose) * 100).toFixed(2));

        item.price = newPrice;
        item.change = diff;
        item.changePct = pct;
        item.high = Math.max(item.high, newPrice);
        item.low = Math.min(item.low, newPrice);
        item.lastUpdated = nowStr;

        const newHistory = [...item.history.slice(1), { time: nowStr, value: newPrice }];
        item.history = newHistory;
      });

      this.notifyTickListeners();

      if (Math.random() > 0.6) {
        this.emitRandomEvent(nowStr);
      }
    }, this.intervalMs);
  }

  private emitRandomEvent(timestamp: string) {
    const events: Omit<LiveFinancialEvent, 'id' | 'timestamp'>[] = [
      { type: 'BUDGET', title: 'Budget Utilization Updated', message: 'Public Works Department consumed ₹14.2L for road maintenance.' },
      { type: 'BALANCE', title: 'Available Balance Updated', message: 'Treasury reserve auto-settled $2.4M treasury bill yield.' },
      { type: 'RECEIVABLE', title: 'Expected Receivables Updated', message: 'Municipal tax collection ledger credited +₹45.8L.' },
      { type: 'RISK', title: 'Risk Score Recalibrated', message: 'Liquidity risk index decreased by 0.8% following reserve re-balancing.' },
      { type: 'AGENT', title: 'Monitoring Agent Heartbeat', message: 'Zero policy violations detected across 1,240 active purchase orders.' },
    ];
    const picked = events[Math.floor(Math.random() * events.length)];
    const event: LiveFinancialEvent = {
      ...picked,
      id: `EVT-${Date.now()}`,
      timestamp,
    };
    this.eventListeners.forEach((cb) => cb(event));
  }

  public getTicks(): Record<string, MarketTick> {
    return { ...this.ticks };
  }

  public subscribeTicks(callback: TickCallback): () => void {
    this.tickListeners.add(callback);
    callback(this.ticks);
    return () => this.tickListeners.delete(callback);
  }

  public subscribeEvents(callback: EventCallback): () => void {
    this.eventListeners.add(callback);
    return () => this.eventListeners.delete(callback);
  }

  private notifyTickListeners() {
    this.tickListeners.forEach((cb) => cb({ ...this.ticks }));
  }
}

export const mockTickService = new MockTickService();
