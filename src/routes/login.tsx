import { useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { MarketingLayout, marketingHead } from '@/components/marketing/layout';
import { loginSchema, safeRedirect } from '@/lib/auth/schemas';

export const Route = createFileRoute('/login')({
  validateSearch: (s: Record<string, unknown>): { redirect?: string } => (typeof s['redirect'] === 'string' ? { redirect: s['redirect'] } : {}),
  head: () => marketingHead('Sign in', 'Sign in to your Quant Compass research workspace.'),
  component: Login,
});

function Login() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const dest = safeRedirect(redirect);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = loginSchema.safeParse({ email, password });
    if (!p.success) { setError(p.error.issues[0]?.message ?? 'Check your details'); return; }
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithPassword(p.data);
    setBusy(false);
    if (err) { setError('Email or password is incorrect.'); return; }
    void navigate({ to: dest });
  }
  async function google() {
    const r = await lovable.auth.signInWithOAuth('google', { redirect_uri: window.location.origin });
    if (r.error) setError('Google sign-in failed. Please try again.');
    else if (!r.redirected) void navigate({ to: dest });
  }
  return <MarketingLayout>
    <form onSubmit={submit} className="mx-auto flex max-w-sm flex-col gap-3 px-5 py-16">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Label htmlFor="pw">Password</Label>
      <div className="flex gap-2"><Input id="pw" type={show ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /><Button type="button" variant="ghost" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</Button></div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={busy}>Sign in</Button>
      <Button type="button" variant="outline" onClick={google}>Continue with Google</Button>
      <p className="text-sm text-muted-foreground">New here? <Link to="/signup" className="text-primary">Create an account</Link></p>
    </form>
  </MarketingLayout>;
}
