import { Link } from '@tanstack/react-router';
import { ChartNoAxesCombined } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSessionUser } from '@/lib/auth/use-session';

export function marketingHead(title: string, description: string) {
  const full = `${title} · Quant Compass`;
  return {
    meta: [
      { title: full }, { name: 'description', content: description },
      { property: 'og:title', content: full }, { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
    ],
  };
}

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { user } = useSessionUser();
  return <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2 font-semibold"><span className="grid h-8 w-8 place-items-center rounded border border-primary text-primary"><ChartNoAxesCombined size={18} /></span>Quant Compass</Link>
        <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
          <Link to="/methodology" className="hover:text-foreground">Methodology</Link>
          <Link to="/risk-disclosure" className="hover:text-foreground">Risk disclosure</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
        </nav>
        <div className="flex gap-2">
          {user ? <Button asChild size="sm"><Link to="/app">Open workspace</Link></Button> : <>
            <Button asChild size="sm" variant="ghost"><Link to="/login">Sign in</Link></Button>
            <Button asChild size="sm"><Link to="/signup">Get started</Link></Button>
          </>}
        </div>
      </div>
    </header>
    <main>{children}</main>
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 text-sm text-muted-foreground md:grid-cols-[2fr_1fr_1fr]">
        <div><strong className="text-foreground">Quant Compass</strong><p className="mt-2 max-w-sm">Quantitative research tools for Indian equities. Research only — not investment advice. Not a SEBI-registered advisor.</p></div>
        <div className="flex flex-col gap-2"><Link to="/methodology">Methodology</Link><Link to="/contact">Contact</Link></div>
        <div className="flex flex-col gap-2"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/risk-disclosure">Risk disclosure</Link></div>
      </div>
      <p className="pb-8 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Quant Compass</p>
    </footer>
  </div>;
}

export function ProsePage({ title, intro, sections }: { title: string; intro: string; sections: { heading: string; body: string }[] }) {
  return <MarketingLayout>
    <article className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-4 text-muted-foreground">{intro}</p>
      {sections.map((s) => <section key={s.heading} className="mt-10"><h2 className="text-lg font-medium">{s.heading}</h2><p className="mt-2 leading-7 text-muted-foreground">{s.body}</p></section>)}
    </article>
  </MarketingLayout>;
}
