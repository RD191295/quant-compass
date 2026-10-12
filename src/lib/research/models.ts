export interface Instrument { symbol: string; name: string; sector: string; exchange: 'NSE' | 'BSE'; price: number; change: number; marketCap: string; pe: number; score: number; volume: string }
export interface DailyPrice { date: string; close: number; benchmark: number; volume: number }
export interface FactorScore { name: string; score: number; change: number }
export interface ApiError { code: string; message: string; retryable: boolean }
export interface MarketIndex { name: string; symbol: string; value: string; change: string; positive: boolean; points: number[] }
export interface Sector { name: string; change: number; advances: number; declines: number }
export interface ResearchData { instruments: Instrument[]; prices: DailyPrice[]; instrumentPrices: Record<string, DailyPrice[]>; indexPrices: Record<string, DailyPrice[]>; factors: FactorScore[]; indices: MarketIndex[]; sectors: Sector[]; timestamp: string; quality: 'mock'; }
export interface ResearchProvider { getResearch(): Promise<ResearchData> }
