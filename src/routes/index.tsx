import { useRef } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { marketingHead } from '@/components/marketing/layout';
import { Dashboard, Features, FinalCta, Hero, HomeFooter, HomeNav, QuantPreview, Ticker } from '@/components/home/sections';

export const Route = createFileRoute('/')({
  head: () => marketingHead('AI market intelligence for Indian markets', 'Analyze NSE/BSE equities, F&O and MCX commodities with AI-assisted research, charting and quantitative backtesting.'),
  component: Home,
});

function Home() {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const focusAi = () => { document.getElementById('ai')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => inputRef.current?.focus(), 300); };
  return <div className="qe-home min-h-screen bg-background text-foreground">
    <HomeNav onSearch={focusAi} />
    <Ticker />
    <main>
      <Hero inputRef={inputRef} />
      <Features />
      <Dashboard />
      <QuantPreview />
      <FinalCta onAi={focusAi} />
    </main>
    <HomeFooter />
  </div>;
}
