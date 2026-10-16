import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Bookmark, Layers, Plus, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { EmptyState, PageHeader, SectionTitle, Change, useResearch, LoadingState } from '@/components/research/common';
import { workspaceQuery, useWorkspaceMutation } from '@/lib/account/queries';
import {
  addWatchlistItem, createWatchlist, deleteResearch, deleteWatchlist, removeWatchlistItem,
  saveResearch, updatePreferences, updateProfile,
} from '@/lib/account/account.functions';
import { newPasswordSchema } from '@/lib/auth/schemas';

function useWorkspace() {
  return useQuery(workspaceQuery);
}

function WorkspaceGate({ children }: { children: (w: NonNullable<ReturnType<typeof useWorkspace>['data']>) => React.ReactNode }) {
  const q = useWorkspace();
  if (q.isPending) return <LoadingState />;
  if (q.isError || !q.data) return <div className="page-content"><EmptyState title="Could not load your workspace" description="Please refresh the page to try again." /></div>;
  return <>{children(q.data)}</>;
}

export function WatchlistsPage() {
  const data = useResearch();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState(data.instruments[0]?.symbol ?? '');
  const create = useWorkspaceMutation((i: { name: string }) => createWatchlist({ data: i }), 'Watchlist created');
  const remove = useWorkspaceMutation((i: { id: string }) => deleteWatchlist({ data: i }), 'Watchlist deleted');
  const add = useWorkspaceMutation((i: { watchlistId: string; symbol: string }) => addWatchlistItem({ data: { ...i, exchange: 'NSE' } }), 'Added to watchlist');
  const drop = useWorkspaceMutation((i: { id: string }) => removeWatchlistItem({ data: i }));
  return <WorkspaceGate>{(w) => {
    const current = w.watchlists.find((l) => l.id === selectedId) ?? w.watchlists[0];
    return <div className="page-content">
      <PageHeader title="Watchlists" description="Your saved lists, kept in your account." />
      <div className="lab-layout">
        <section className="research-panel">
          <SectionTitle title="Your watchlists" subtitle={`${w.watchlists.length} saved`} />
          <form className="flex gap-2 px-5 pb-4" onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; create.mutate({ name }, { onSuccess: () => setName('') }); }}>
            <Input aria-label="New watchlist name" placeholder="New watchlist name" value={name} maxLength={80} onChange={(e) => setName(e.target.value)} />
            <Button type="submit" size="sm" disabled={create.isPending}><Plus /> Create</Button>
          </form>
          <div className="flex flex-col gap-1 px-3 pb-4">
            {w.watchlists.map((l) => <div key={l.id} className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${current?.id === l.id ? 'bg-accent' : ''}`}>
              <button className="flex-1 text-left" onClick={() => setSelectedId(l.id)}>{l.name} <span className="text-muted-foreground">· {l.items.length}</span></button>
              <Button size="icon" variant="ghost" aria-label={`Delete ${l.name}`} onClick={() => { if (confirm(`Delete "${l.name}"?`)) remove.mutate({ id: l.id }); }}><Trash2 size={14} /></Button>
            </div>)}
            {w.watchlists.length === 0 && <p className="px-3 text-sm text-muted-foreground">Create your first watchlist above.</p>}
          </div>
        </section>
        <section className="research-panel">
          <SectionTitle title={current?.name ?? 'No watchlist selected'} subtitle="Prices are sample data · Not live" />
          {current ? <>
            <form className="flex gap-2 px-5 pb-4" onSubmit={(e) => { e.preventDefault(); add.mutate({ watchlistId: current.id, symbol }); }}>
              <select aria-label="Stock to add" className="h-9 rounded-md border border-border bg-background px-2 text-sm" value={symbol} onChange={(e) => setSymbol(e.target.value)}>
                {data.instruments.map((s) => <option key={s.symbol} value={s.symbol}>{s.symbol} · {s.name}</option>)}
              </select>
              <Button type="submit" size="sm" disabled={add.isPending}><Star /> Add stock</Button>
            </form>
            {current.items.length === 0 ? <EmptyState title="This watchlist is empty" description="Add a stock to start tracking it." /> :
              <table className="w-full text-sm"><tbody>{current.items.map((it) => {
                const s = data.instruments.find((x) => x.symbol === it.symbol);
                return <tr key={it.id} className="border-t border-border">
                  <td className="px-5 py-3"><Link to="/app/stocks" search={{ symbol: it.symbol }} className="font-medium">{it.symbol}</Link><div className="text-xs text-muted-foreground">{s?.name ?? it.exchange}</div></td>
                  <td className="px-3 py-3 text-right font-mono">{s ? `₹${s.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}</td>
                  <td className="px-3 py-3 text-right">{s && <Change value={s.change} />}</td>
                  <td className="px-3 py-3 text-right"><Button size="icon" variant="ghost" aria-label={`Remove ${it.symbol}`} onClick={() => drop.mutate({ id: it.id })}><Trash2 size={14} /></Button></td>
                </tr>;
              })}</tbody></table>}
          </> : <EmptyState title="No watchlist yet" description="Create one to start saving stocks." />}
        </section>
      </div>
    </div>;
  }}</WorkspaceGate>;
}

export function SavedResearchPage() {
  const [title, setTitle] = useState('');
  const save = useWorkspaceMutation((i: { title: string }) => saveResearch({ data: { title: i.title, researchType: 'note', configuration: {} } }), 'Research note saved');
  const del = useWorkspaceMutation((i: { id: string }) => deleteResearch({ data: i }), 'Removed');
  return <WorkspaceGate>{(w) => <div className="page-content">
    <PageHeader title="Saved Research" description="Notes and research setups saved to your account." />
    <section className="research-panel">
      <form className="flex gap-2 p-5" onSubmit={(e) => { e.preventDefault(); if (!title.trim()) return; save.mutate({ title }, { onSuccess: () => setTitle('') }); }}>
        <Input aria-label="Research note title" placeholder="Write a quick research note title" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} />
        <Button type="submit" size="sm" disabled={save.isPending}><Bookmark /> Save</Button>
      </form>
      {w.research.length === 0 ? <EmptyState title="Nothing saved yet" description="Saved notes and research setups will appear here." /> :
        <ul>{w.research.map((r) => <li key={r.id} className="flex items-center justify-between border-t border-border px-5 py-3 text-sm">
          <div><strong className="font-medium">{r.title}</strong><div className="text-xs text-muted-foreground">{r.researchType} · {new Date(r.createdAt).toLocaleDateString('en-IN')}</div></div>
          <Button size="icon" variant="ghost" aria-label={`Delete ${r.title}`} onClick={() => del.mutate({ id: r.id })}><Trash2 size={14} /></Button>
        </li>)}</ul>}
    </section>
  </div>}</WorkspaceGate>;
}

export function OptionsPage() {
  const data = useResearch();
  const [symbol, setSymbol] = useState(data.instruments[0]?.symbol ?? '');
  const stock = data.instruments.find((s) => s.symbol === symbol) ?? data.instruments[0];
  const sample = [
    { offset: -2, callOi: '1.2L', putOi: '3.8L', iv: '24.1%' }, { offset: -1, callOi: '2.4L', putOi: '3.1L', iv: '22.7%' },
    { offset: 0, callOi: '4.6L', putOi: '4.2L', iv: '21.9%' }, { offset: 1, callOi: '3.9L', putOi: '1.8L', iv: '22.4%' },
    { offset: 2, callOi: '2.7L', putOi: '0.9L', iv: '23.6%' },
  ];
  if (!stock) return <EmptyState title="No instruments" description="Sample dataset unavailable." />;
  const step = stock.price > 2000 ? 50 : 20;
  const atm = Math.round(stock.price / step) * step;
  return <div className="page-content">
    <PageHeader title="Options Intelligence" description="Open interest and implied volatility context."><span className="outline-badge">SAMPLE DATA</span></PageHeader>
    <section className="research-panel">
      <SectionTitle title={`${stock.symbol} option chain`} subtitle="Illustrative sample values · No live derivatives data connected" />
      <div className="px-5 pb-4"><select aria-label="Underlying" className="h-9 rounded-md border border-border bg-background px-2 text-sm" value={symbol} onChange={(e) => setSymbol(e.target.value)}>{data.instruments.map((s) => <option key={s.symbol}>{s.symbol}</option>)}</select></div>
      <table className="w-full text-sm"><thead><tr className="text-xs text-muted-foreground"><th className="px-5 py-2 text-left">Call OI</th><th>Strike</th><th>Put OI</th><th className="px-5 text-right">Sample IV</th></tr></thead>
        <tbody>{sample.map((r) => <tr key={r.offset} className={`border-t border-border ${r.offset === 0 ? 'bg-accent' : ''}`}><td className="px-5 py-3 font-mono">{r.callOi}</td><td className="text-center font-mono">₹{(atm + r.offset * step).toLocaleString('en-IN')}</td><td className="text-center font-mono">{r.putOi}</td><td className="px-5 text-right font-mono">{r.iv}</td></tr>)}</tbody></table>
      <p className="research-prose flex items-center gap-2"><Layers size={14} /> Values are fixed demonstration figures. Live options data will appear once a licensed provider is connected. Not investment advice.</p>
    </section>
  </div>;
}

export function SettingsPage() {
  return <WorkspaceGate>{(w) => <SettingsForm w={w} />}</WorkspaceGate>;
}

function SettingsForm({ w }: { w: NonNullable<ReturnType<typeof useWorkspace>['data']> }) {
  const [fullName, setFullName] = useState(w.fullName);
  const [prefs, setPrefs] = useState(w.preferences);
  const [pw, setPw] = useState({ next: '' });
  const [pwBusy, setPwBusy] = useState(false);
  const profile = useWorkspaceMutation((i: { fullName: string }) => updateProfile({ data: i }), 'Profile saved');
  const preferences = useWorkspaceMutation((i: typeof prefs) => updatePreferences({ data: i }), 'Preferences saved');
  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    const parsed = newPasswordSchema.safeParse(pw.next);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? 'Choose a stronger password'); return; }
    setPwBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw.next });
    setPwBusy(false);
    if (error) toast.error('Could not change your password. Please try again.');
    else { toast.success('Password updated'); setPw({ next: '' }); }
  }
  return <div className="page-content max-w-3xl">
    <PageHeader title="Settings" description="Manage your profile, preferences and security." />
    <section className="research-panel mb-5">
      <SectionTitle title="Profile" subtitle={w.email} />
      <form className="flex flex-col gap-3 px-5 pb-5" onSubmit={(e) => { e.preventDefault(); profile.mutate({ fullName }); }}>
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" value={fullName} maxLength={120} onChange={(e) => setFullName(e.target.value)} />
        <Button type="submit" size="sm" className="self-start" disabled={profile.isPending}>Save profile</Button>
      </form>
    </section>
    <section className="research-panel mb-5">
      <SectionTitle title="Preferences" />
      <form className="flex flex-col gap-4 px-5 pb-5" onSubmit={(e) => { e.preventDefault(); preferences.mutate(prefs); }}>
        <Label className="flex flex-col gap-2">Theme
          <select className="h-9 rounded-md border border-border bg-background px-2 text-sm" value={prefs.theme} onChange={(e) => setPrefs({ ...prefs, theme: e.target.value as 'dark' | 'light' })}><option value="dark">Dark</option><option value="light">Light</option></select>
        </Label>
        <Label className="flex flex-col gap-2">Timezone
          <Input value={prefs.timezone} maxLength={64} onChange={(e) => setPrefs({ ...prefs, timezone: e.target.value })} />
        </Label>
        <Label className="flex items-center justify-between">Email notifications <Switch checked={prefs.emailNotifications} onCheckedChange={(v) => setPrefs({ ...prefs, emailNotifications: v })} /></Label>
        <Label className="flex items-center justify-between">Weekly research digest <Switch checked={prefs.researchDigest} onCheckedChange={(v) => setPrefs({ ...prefs, researchDigest: v })} /></Label>
        <Button type="submit" size="sm" className="self-start" disabled={preferences.isPending}>Save preferences</Button>
      </form>
    </section>
    <section className="research-panel">
      <SectionTitle title="Change password" />
      <form className="flex flex-col gap-3 px-5 pb-5" onSubmit={changePassword}>
        <Label htmlFor="new">New password</Label>
        <Input id="new" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ next: e.target.value })} />
        <Button type="submit" size="sm" className="self-start" disabled={pwBusy}>Update password</Button>
      </form>
    </section>
  </div>;
}
