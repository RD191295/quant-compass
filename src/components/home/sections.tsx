import { useRef, useState, type ReactNode, type RefObject } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, ArrowUp, BarChart3, Bot, Brain, ChartCandlestick, ChartNoAxesCombined, Factory, FlaskConical, Layers, Loader2, Menu, Search, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CandleChart, EquityCurve } from './home-charts';
import { aiSuggestions, backtestMetrics, breadth, demoAnswer, getBacktest, getCandles, instruments, sectorHeat, strategies, tickerItems, watchlist, type InstrumentName, type Timeframe } from '@/lib/research/home-demo';

const fmt = (n: number, d = 2) => n.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });
const sign = (n: number) => (n >= 0 ? '+' : '');
const tone = (n: number) => (n >= 0 ? 'text-positive' : 'text-negative');

export function DemoTag({ children = 'Demo data' }: { children?: ReactNode }) {
  return <span className="qe-demo">{children}</span>;
}

function Logo() {
  return <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight"><span className="grid h-7 w-7 place-items-center rounded border border-primary text-primary"><ChartNoAxesCombined size={16} /></span>Quant Compass</Link>;
}

const navItems = [
  { label: 'Markets', href: '#markets' }, { label: 'Equities', href: '#features' }, { label: 'F&O Analytics', href: '#features' },
  { label: 'Commodities', href: '#features' }, { label: 'Quant Lab', href: '#quant' }, { label: 'AI Research', href: '#ai' },
];

export function HomeNav({ onSearch }: { onSearch: () => void }) {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
    <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-5">
      <Logo />
      <nav className="hidden items-center gap-5 text-[13px] text-muted-foreground lg:flex">{navItems.map((n) => <a key={n.label} href={n.href} className="transition-colors hover:text-foreground">{n.label}</a>)}</nav>
      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="icon" aria-label="Ask the AI analyst" onClick={onSearch}><Search size={16} /></Button>
        <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex"><Link to="/login">Sign In</Link></Button>
        <Button asChild size="sm"><Link to="/signup">Get Started</Link></Button>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X size={16} /> : <Menu size={16} />}</Button>
      </div>
    </div>
    {open && <nav className="flex flex-col border-t border-border px-5 py-2 lg:hidden">{navItems.map((n) => <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="py-2 text-sm text-muted-foreground">{n.label}</a>)}<Link to="/login" className="py-2 text-sm text-muted-foreground">Sign In</Link></nav>}
  </header>;
}

export function Ticker() {
  return <div id="markets" className="border-b border-border bg-card">
    <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-5 py-2 qe-noscroll">
      <DemoTag>Illustrative values</DemoTag>
      {tickerItems.map((t) => { const pct = (t.change / (t.price - t.change)) * 100; return <div key={t.name} className="flex shrink-0 items-baseline gap-2 font-mono text-[12px]">
        <span className="font-sans text-[11px] font-medium text-muted-foreground">{t.name}</span><span>{fmt(t.price)}</span><span className={tone(t.change)}>{sign(t.change)}{fmt(t.change)} ({sign(pct)}{pct.toFixed(2)}%)</span></div>; })}
    </div>
  </div>;
}

export function Hero({ inputRef }: { inputRef: RefObject<HTMLTextAreaElement | null> }) {
  const [q, setQ] = useState('');
  const [state, setState] = useState<{ q: string; a: string | null } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ask = (text: string) => {
    const query = text.trim(); if (!query) return;
    setQ(query); setState({ q: query, a: null });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState({ q: query, a: demoAnswer(query) }), 700);
  };
  return <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-sky">AI-powered market intelligence</p>
      <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight md:text-[52px]">Trade with data.<br />Think like a quant.</h1>
      <p className="mt-5 max-w-xl text-[15px] leading-7 text-muted-foreground">Your intelligent workspace for Indian markets. Discover opportunities, analyze derivatives, test strategies, and understand risk using AI-powered research and quantitative analytics.</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Button asChild size="lg"><a href="#dashboard">Explore Markets <ArrowRight /></a></Button>
        <Button asChild size="lg" variant="outline"><a href="#quant">Explore Quant Tools</a></Button>
      </div>
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
        {[{ i: BarChart3, t: 'Quant-grade analytics' }, { i: Brain, t: 'AI-powered research' }, { i: Layers, t: 'Built for Indian markets' }].map(({ i: I, t }) => <li key={t} className="flex items-center gap-2"><I size={15} className="text-primary" />{t}</li>)}
      </ul>
    </div>
    <div id="ai" className="scroll-mt-20 rounded-lg border border-border bg-card p-5 shadow-[var(--float-shadow)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3"><span className="grid h-9 w-9 place-items-center rounded-md bg-elevated text-accent-sky"><Bot size={18} /></span><div><h2 className="font-semibold">Ask your AI Market Analyst</h2><p className="text-[13px] text-muted-foreground">Turn market data into actionable insights.</p></div></div>
        <DemoTag>Demo mode</DemoTag>
      </div>
      <form className="relative mt-4" onSubmit={(e) => { e.preventDefault(); ask(q); }}>
        <textarea ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(q); } }} rows={4} aria-label="Ask the AI analyst" placeholder="Ask anything about NIFTY, options OI, volatility, stocks, or trading strategies..." className="w-full resize-none rounded-md bg-elevated p-3 pr-14 text-sm leading-6" />
        <Button type="submit" size="icon" aria-label="Submit question" disabled={!q.trim()} className="absolute bottom-3 right-3"><ArrowUp size={16} /></Button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">{aiSuggestions.map((s) => <button key={s} type="button" onClick={() => ask(s)} className="rounded-full border border-border bg-elevated px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:border-primary hover:text-foreground">{s}</button>)}</div>
      {state && <div className="mt-4 rounded-md border border-border bg-background p-3 text-[13px]" aria-live="polite">
        <p className="font-medium">{state.q}</p>
        {state.a ? <p className="mt-2 leading-6 text-muted-foreground"><Sparkles size={13} className="mr-1 inline text-accent-sky" />{state.a}</p> : <p className="mt-2 flex items-center gap-2 text-muted-foreground"><Loader2 size={13} className="animate-spin" />Preparing demo response…</p>}
      </div>}
      <p className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">Research grounded in available market data. This preview is not connected to an AI model or live feed.</p>
    </div>
  </section>;
}

const features = [
  { icon: ChartCandlestick, title: 'Equity Intelligence', body: 'Screen and study NSE and BSE stocks across technical and fundamental lenses.', items: ['Stock screening', 'Technical indicators', 'Fundamental metrics', 'Sector analysis'] },
  { icon: Layers, title: 'Options Intelligence', body: 'Read derivatives positioning and volatility around any underlying.', items: ['Options chain', 'Open interest analysis', 'Implied volatility and Greeks', 'Payoff analysis'] },
  { icon: FlaskConical, title: 'Quant Lab', body: 'Test rule-based ideas and measure risk before committing capital.', items: ['Strategy backtesting', 'Equity curves', 'Risk-adjusted returns', 'Drawdown analysis'] },
  { icon: Factory, title: 'Futures & Commodities', body: 'Track futures structure and MCX commodity contracts through expiry.', items: ['Futures open interest', 'Basis and rollover', 'Commodity price analytics', 'Expiry tracking'] },
];
export function Features() {
  return <section id="features" className="scroll-mt-16 border-t border-border">
    <div className="mx-auto max-w-7xl px-5 py-16">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Everything you need to analyze the markets.</h2>
      <p className="mt-2 text-muted-foreground">From market discovery to advanced quantitative research.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map((f) => <div key={f.title} className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/60">
        <f.icon size={20} className="text-primary" /><h3 className="mt-4 font-semibold">{f.title}</h3><p className="mt-1 text-[13px] leading-6 text-muted-foreground">{f.body}</p>
        <ul className="mt-4 space-y-1.5 text-[13px]">{f.items.map((i) => <li key={i} className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-accent-sky" />{i}</li>)}</ul>
        <Link to="/signup" className="mt-5 inline-flex items-center gap-1 text-[13px] text-primary">Explore <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" /></Link>
      </div>)}</div>
    </div>
  </section>;
}

const tfs: Timeframe[] = ['5m', '15m', '1H', '1D', '1W'];
export function Dashboard() {
  const [inst, setInst] = useState<InstrumentName>('NIFTY 50');
  const [tf, setTf] = useState<Timeframe>('1D');
  const candles = getCandles(inst, tf);
  const last = candles[candles.length - 1]!; const first = candles[0]!;
  const chg = ((last.close - first.open) / first.open) * 100;
  const total = breadth.advances + breadth.declines + breadth.unchanged;
  return <section id="dashboard" className="scroll-mt-16 border-t border-border">
    <div className="mx-auto max-w-7xl px-5 py-16">
      <div className="flex flex-wrap items-end justify-between gap-3"><h2 className="text-2xl font-semibold tracking-tight md:text-3xl">See the market beyond the headlines.</h2><DemoTag>Illustrative historical data · Not live</DemoTag></div>
      <div className="mt-8 grid overflow-hidden rounded-lg border border-border bg-card lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 border-b border-border p-4 lg:border-b-0 lg:border-r">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <select aria-label="Instrument" value={inst} onChange={(e) => setInst(e.target.value as InstrumentName)} className="h-8 bg-elevated text-[13px] text-foreground">{instruments.map((i) => <option key={i}>{i}</option>)}</select>
              <span className="font-mono text-lg">{fmt(last.close)}</span><span className={`font-mono text-[12px] ${tone(chg)}`}>{sign(chg)}{chg.toFixed(2)}%</span>
            </div>
            <div className="flex rounded-md border border-border p-0.5" role="group" aria-label="Timeframe">{tfs.map((t) => <button key={t} type="button" aria-pressed={tf === t} onClick={() => setTf(t)} className={`rounded px-2.5 py-1 font-mono text-[11px] ${tf === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>)}</div>
          </div>
          <div className="mt-3 h-[320px]"><CandleChart data={candles} /></div>
        </div>
        <div className="grid content-start gap-5 p-4 text-[12px]">
          <div><h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Watchlist</h3>{watchlist.map((w) => <div key={w.symbol} className="flex justify-between border-b border-border py-1.5 font-mono last:border-0"><span className="font-sans">{w.symbol}</span><span className={tone(w.change)}>{sign(w.change)}{w.change.toFixed(2)}%</span></div>)}</div>
          <div><h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Market breadth</h3>
            <div className="flex h-2 overflow-hidden rounded-full"><span className="bg-positive" style={{ width: `${(breadth.advances / total) * 100}%` }} /><span className="bg-muted-foreground" style={{ width: `${(breadth.unchanged / total) * 100}%` }} /><span className="flex-1 bg-negative" /></div>
            <div className="mt-1.5 flex justify-between font-mono text-[11px]"><span className="text-positive">{breadth.advances} adv</span><span className="text-negative">{breadth.declines} dec</span></div></div>
          <div><h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Sector heatmap</h3>
            <div className="grid grid-cols-4 gap-1">{sectorHeat.map((s) => <div key={s.name} title={`${s.name} ${sign(s.change)}${s.change}% (demo)`} className="rounded p-1.5 text-center" style={{ background: `color-mix(in oklab, var(${s.change >= 0 ? '--positive' : '--negative'}) ${Math.min(15 + Math.abs(s.change) * 18, 60)}%, var(--card))` }}><div className="text-[10px]">{s.name}</div><div className="font-mono text-[10px]">{sign(s.change)}{s.change.toFixed(1)}%</div></div>)}</div></div>
        </div>
      </div>
    </div>
  </section>;
}

export function QuantPreview() {
  const data = getBacktest();
  const m = backtestMetrics;
  const metrics = [{ l: 'CAGR', v: `${m.cagr}%` }, { l: 'Max drawdown', v: `${m.maxDd}%`, neg: true }, { l: 'Sharpe ratio', v: m.sharpe.toFixed(2) }, { l: 'Win rate', v: `${m.winRate}%` }, { l: 'Trades', v: String(m.trades) }];
  return <section id="quant" className="scroll-mt-16 border-t border-border">
    <div className="mx-auto max-w-7xl px-5 py-16">
      <h2 className="max-w-3xl text-2xl font-semibold tracking-tight md:text-3xl">Test strategies. Measure risk. Make better-informed decisions.</h2>
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between"><h3 className="text-[13px] font-medium">Sample backtest · Momentum 12-1</h3><DemoTag>Illustrative metrics</DemoTag></div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">{metrics.map((x) => <div key={x.l} className="rounded-md bg-elevated p-2.5"><div className="text-[11px] text-muted-foreground">{x.l}</div><div className={`mt-1 font-mono text-base ${x.neg ? 'text-negative' : ''}`}>{x.v}</div></div>)}</div>
          <div className="mt-4 h-[220px]"><EquityCurve data={data} /></div>
        </div>
        <div className="flex flex-col rounded-lg border border-border bg-card p-4">
          <h3 className="text-[13px] font-medium">Strategy comparison</h3>
          <div className="mt-3 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="text-left text-[11px] text-muted-foreground"><th className="py-2 font-normal">Strategy</th><th className="font-normal">CAGR</th><th className="font-normal">Sharpe</th><th className="font-normal">Max DD</th></tr></thead>
            <tbody className="font-mono">{strategies.map((s) => <tr key={s.name} className="border-t border-border"><td className="py-2.5 font-sans">{s.name}</td><td>{s.cagr}%</td><td>{s.sharpe.toFixed(2)}</td><td className="text-negative">{s.maxDd}%</td></tr>)}</tbody></table></div>
          <p className="mt-4 text-[11px] leading-5 text-muted-foreground">Sample figures for illustration only. Backtests are hypothetical, do not reflect actual trading and do not guarantee future returns.</p>
          <Button asChild className="mt-auto self-start"><Link to="/signup">Explore Quant Lab <ArrowRight /></Link></Button>
        </div>
      </div>
    </div>
  </section>;
}

export function FinalCta({ onAi }: { onAi: () => void }) {
  return <section className="border-t border-border"><div className="mx-auto max-w-3xl px-5 py-20 text-center">
    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Go beyond charts. Understand the market.</h2>
    <p className="mt-3 text-muted-foreground">Bring market data, quantitative research, and AI-powered analysis into one intelligent workspace.</p>
    <div className="mt-7 flex flex-wrap justify-center gap-3"><Button asChild size="lg"><Link to="/signup">Get Started</Link></Button><Button size="lg" variant="outline" onClick={onAi}>Explore AI Research</Button></div>
  </div></section>;
}

export function HomeFooter() {
  return <footer className="border-t border-border bg-card"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 text-[13px] text-muted-foreground md:grid-cols-[2fr_1fr_1fr]">
    <div><Logo /><p className="mt-3 max-w-sm">AI-assisted quantitative research for Indian equities, derivatives and commodities.</p></div>
    <div className="flex flex-col gap-2"><a href="#markets">Markets</a><a href="#quant">Quant Analytics</a><a href="#ai">AI Research</a><Link to="/methodology">About</Link><Link to="/contact">Contact</Link></div>
    <div className="flex flex-col gap-2"><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms of Service</Link><Link to="/risk-disclosure">Risk disclosure</Link></div>
  </div>
  <p className="mx-auto max-w-7xl px-5 pb-8 text-[11px] leading-5 text-muted-foreground">Research tools only — not investment advice. Not registered with SEBI as an investment adviser or research analyst. Trading in equities, derivatives and commodities involves substantial risk, including loss of capital. All values on this page are illustrative demo data. © {new Date().getFullYear()} Quant Compass</p>
  </footer>;
}
