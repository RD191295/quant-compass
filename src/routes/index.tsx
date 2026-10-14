import { createFileRoute, Link } from '@tanstack/react-router';
import { Activity, ArrowRight, Database, FlaskConical, Layers, ListFilter, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarketingLayout, marketingHead } from '@/components/marketing/layout';
import { PriceChart } from '@/components/research/common';
import { mockData } from '@/lib/research/mock-provider';

export const Route = createFileRoute('/')({
  head: () => marketingHead('Quantitative research for Indian equities', 'Quant Compass helps Indian investors and researchers screen, rank and study NSE and BSE equities with transparent factor research.'),
  component: Home,
});

const capabilities = [
  { icon: ListFilter, title: 'Equity screener', body: 'Filter the NSE and BSE universe by quality, value and momentum.' },
  { icon: Activity, title: 'Factor rankings', body: 'Compare precomputed factor scores across sectors.' },
  { icon: FlaskConical, title: 'Factor research lab', body: 'Explore how factor models behave across market regimes.' },
  { icon: Layers, title: 'Options intelligence', body: 'Read open interest and volatility context around a stock.' },
  { icon: Star, title: 'Watchlists', body: 'Save stocks to lists that stay with your account.' },
  { icon: Sparkles, title: 'AI research copilot', body: 'Ask questions about a company and its research signals.' },
];

function Home() {
  return <MarketingLayout>
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-primary">Indian equity research</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">Research Indian equities with quantitative clarity.</h1>
        <p className="mt-5 max-w-lg text-muted-foreground">Screen, rank and study NSE and BSE stocks with transparent factor research — built for serious retail investors and professional researchers.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg"><Link to="/signup">Create free account <ArrowRight /></Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/methodology">Read the methodology</Link></Button>
        </div>
      </div>
      <div className="rounded-md border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground"><span>Workspace preview</span><span className="mock-badge">ILLUSTRATIVE SAMPLE DATA</span></div>
        <PriceChart prices={mockData.prices} />
      </div>
    </section>
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-2xl font-semibold">One workspace for the full research process</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c) => <div key={c.title} className="rounded-md border border-border bg-card p-5"><c.icon size={18} className="text-primary" /><h3 className="mt-3 font-medium">{c.title}</h3><p className="mt-1 text-sm text-muted-foreground">{c.body}</p></div>)}
        </div>
      </div>
    </section>
    <section className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-2">
        <div><Database size={18} className="text-primary" /><h2 className="mt-3 text-xl font-semibold">Data integrity first</h2><p className="mt-2 text-sm text-muted-foreground">Every number is labelled with its source. Today the workspace runs on clearly marked demonstration data; licensed market data will be labelled the same way once connected.</p></div>
        <div><ShieldCheck size={18} className="text-primary" /><h2 className="mt-3 text-xl font-semibold">Research, not advice</h2><p className="mt-2 text-sm text-muted-foreground">Quant Compass provides research tools only. Nothing here is a recommendation to buy or sell. Investing in securities involves risk, including loss of capital. <Link to="/risk-disclosure" className="text-primary">Read the risk disclosure</Link>.</p></div>
      </div>
    </section>
    <section className="border-t border-border">
      <div className="mx-auto max-w-3xl px-5 py-16 text-center">
        <h2 className="text-2xl font-semibold">Start your research workspace</h2>
        <p className="mt-2 text-muted-foreground">Free to create. Your watchlists and notes stay private to your account.</p>
        <Button asChild size="lg" className="mt-6"><Link to="/signup">Create free account</Link></Button>
      </div>
    </section>
  </MarketingLayout>;
}
