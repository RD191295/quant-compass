import { Area, AreaChart, Bar, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { BacktestPoint, Candle } from '@/lib/research/home-demo';

const fmt = (n: number) => n.toLocaleString('en-IN', { maximumFractionDigits: 2 });

interface CandleShapeProps { x?: number; y?: number; width?: number; height?: number; payload?: Candle }
function CandleShape({ x = 0, y = 0, width = 0, height = 0, payload }: CandleShapeProps) {
  if (!payload) return null;
  const { open, close, high, low } = payload;
  const up = close >= open;
  const ppu = height / Math.max(high - low, 0.0001);
  const top = y + (high - Math.max(open, close)) * ppu;
  const bodyH = Math.max(Math.abs(open - close) * ppu, 1);
  const cx = x + width / 2;
  const color = up ? 'var(--positive)' : 'var(--negative)';
  return <g><line x1={cx} x2={cx} y1={y} y2={y + height} stroke={color} strokeWidth={1} /><rect x={x + width * 0.15} width={width * 0.7} y={top} height={bodyH} fill={color} /></g>;
}

function CandleTip({ active, payload }: { active?: boolean; payload?: { payload: Candle }[] }) {
  if (!active || !payload?.length) return null;
  const c = payload[0]?.payload; if (!c) return null;
  return <div className="qe-tip"><strong>{c.t}</strong><span>O {fmt(c.open)}</span><span>H {fmt(c.high)}</span><span>L {fmt(c.low)}</span><span>C {fmt(c.close)}</span><em>Demo data</em></div>;
}

export function CandleChart({ data }: { data: Candle[] }) {
  const rows = data.map((d) => ({ ...d, range: [d.low, d.high] as [number, number] }));
  return <ResponsiveContainer width="100%" height="100%">
    <ComposedChart data={rows} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
      <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
      <XAxis dataKey="t" hide />
      <YAxis orientation="right" domain={['auto', 'auto']} tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} tickFormatter={(v: number) => fmt(Math.round(v))} width={58} axisLine={false} tickLine={false} />
      <Tooltip content={<CandleTip />} cursor={{ fill: 'var(--primary-tint)' }} />
      <Bar dataKey="range" shape={<CandleShape />} isAnimationActive={false} />
    </ComposedChart>
  </ResponsiveContainer>;
}

export function EquityCurve({ data }: { data: BacktestPoint[] }) {
  return <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
      <defs><linearGradient id="qeEq" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs>
      <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
      <XAxis dataKey="t" hide />
      <YAxis orientation="right" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} width={40} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
      <Tooltip contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', fontSize: 11 }} labelStyle={{ color: 'var(--muted-foreground)' }} />
      <Area type="monotone" dataKey="benchmark" name="Benchmark (demo)" stroke="var(--muted-foreground)" fill="none" strokeDasharray="3 3" />
      <Area type="monotone" dataKey="strategy" name="Strategy (demo)" stroke="var(--primary)" fill="url(#qeEq)" strokeWidth={1.6} />
    </AreaChart>
  </ResponsiveContainer>;
}
