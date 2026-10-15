// Illustrative, deterministic demo data for the public homepage. Not market data.
export interface TickerItem { name: string; price: number; change: number }
export interface Candle { t: string; open: number; high: number; low: number; close: number }
export type Timeframe = '5m' | '15m' | '1H' | '1D' | '1W';
export interface BacktestPoint { t: string; strategy: number; benchmark: number }
export interface StrategyRow { name: string; cagr: number; sharpe: number; maxDd: number; winRate: number; trades: number }

export const tickerItems: TickerItem[] = [
  { name: 'NIFTY 50', price: 24812.4, change: 118.35 },
  { name: 'SENSEX', price: 81456.9, change: 342.1 },
  { name: 'BANK NIFTY', price: 52310.75, change: -186.4 },
  { name: 'INDIA VIX', price: 13.42, change: -0.38 },
  { name: 'NIFTY MIDCAP', price: 57204.2, change: 265.8 },
  { name: 'GOLD', price: 74215, change: 410 },
  { name: 'CRUDE OIL', price: 6182, change: -54 },
];

export const instruments = ['NIFTY 50', 'BANK NIFTY', 'SENSEX', 'NIFTY MIDCAP'] as const;
export type InstrumentName = (typeof instruments)[number];
const bases: Record<InstrumentName, number> = { 'NIFTY 50': 24800, 'BANK NIFTY': 52300, SENSEX: 81450, 'NIFTY MIDCAP': 57200 };
const tfVol: Record<Timeframe, number> = { '5m': 0.0012, '15m': 0.002, '1H': 0.0035, '1D': 0.009, '1W': 0.02 };

function rng(seed: number) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function hash(str: string) { let h = 2166136261; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h; }

export function getCandles(inst: InstrumentName, tf: Timeframe, count = 48): Candle[] {
  const r = rng(hash(inst + tf)); const vol = tfVol[tf];
  let price = bases[inst] * (1 - vol * 6);
  return Array.from({ length: count }, (_, i) => {
    const open = price; const drift = (r() - 0.46) * vol * 2 * open;
    const close = open + drift;
    const high = Math.max(open, close) + r() * vol * open * 0.8;
    const low = Math.min(open, close) - r() * vol * open * 0.8;
    price = close;
    return { t: `${tf} #${i + 1}`, open: +open.toFixed(2), high: +high.toFixed(2), low: +low.toFixed(2), close: +close.toFixed(2) };
  });
}

export const watchlist = [
  { symbol: 'RELIANCE', change: 1.24 }, { symbol: 'HDFCBANK', change: -0.62 }, { symbol: 'INFY', change: 0.88 },
  { symbol: 'TCS', change: 0.41 }, { symbol: 'ICICIBANK', change: -0.35 }, { symbol: 'LT', change: 1.71 },
];
export const breadth = { advances: 1482, declines: 867, unchanged: 94 };
export const sectorHeat = [
  { name: 'IT', change: 1.4 }, { name: 'Bank', change: -0.6 }, { name: 'Auto', change: 0.9 }, { name: 'Pharma', change: 0.3 },
  { name: 'FMCG', change: -0.2 }, { name: 'Metal', change: 1.9 }, { name: 'Energy', change: -1.1 }, { name: 'Realty', change: 2.3 },
];

export function getBacktest(): BacktestPoint[] {
  const r = rng(42); let s = 100, b = 100;
  return Array.from({ length: 60 }, (_, i) => {
    s *= 1 + (r() - 0.44) * 0.04; b *= 1 + (r() - 0.46) * 0.03;
    return { t: `M${i + 1}`, strategy: +s.toFixed(1), benchmark: +b.toFixed(1) };
  });
}
export const backtestMetrics = { cagr: 14.2, maxDd: -18.6, sharpe: 1.12, winRate: 54.3, trades: 286 };
export const strategies: StrategyRow[] = [
  { name: 'Momentum 12-1', cagr: 14.2, sharpe: 1.12, maxDd: -18.6, winRate: 54.3, trades: 286 },
  { name: 'Low volatility', cagr: 10.8, sharpe: 1.05, maxDd: -11.4, winRate: 56.1, trades: 198 },
  { name: 'Quality + value', cagr: 12.1, sharpe: 0.94, maxDd: -15.9, winRate: 52.7, trades: 224 },
];

export const aiSuggestions = ['Analyze NIFTY market structure', 'Explain Bank NIFTY option OI', 'Find stocks with unusual volume', 'Compare trading strategies'];
export function demoAnswer(q: string): string {
  const l = q.toLowerCase();
  if (l.includes('oi') || l.includes('option')) return 'Demo response: in an options OI review, the assistant would compare call and put open interest by strike, highlight where OI is building or unwinding, and relate that to implied volatility. No live options chain is connected, so no actual levels are shown.';
  if (l.includes('volume')) return 'Demo response: an unusual-volume scan would compare today\u2019s traded volume with each stock\u2019s 20-day average and list outliers with price context. Market data is not connected yet, so no stocks are named.';
  if (l.includes('strateg')) return 'Demo response: a strategy comparison would line up CAGR, Sharpe ratio, maximum drawdown and win rate from backtests on the same period and universe. The sample figures on this page are illustrative only.';
  return 'Demo response: a market-structure read would cover trend, recent swing highs and lows, breadth, and volatility regime for the index you name. This preview is not connected to live data or an AI model, so it gives no actual analysis.';
}
