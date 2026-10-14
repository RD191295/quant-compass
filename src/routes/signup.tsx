import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { MarketingLayout, marketingHead } from '@/components/marketing/layout';
import { signupSchema } from '@/lib/auth/schemas';

export const Route = createFileRoute('/signup')({
  head: () => marketingHead('Create account', 'Create your free Quant Compass research account.'),
  component: Signup,
});

function Signup() {
  const [f, setF] = useState({ fullName: '', email: '', password: '', confirmPassword: '', acceptTerms: false });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = signupSchema.safeParse(f);
    if (!p.success) { setError(p.error.issues[0]?.message ?? 'Check your details'); return; }
    setBusy(true);
    const { error: err } = await supabase.auth.signUp({ email: p.data.email, password: p.data.password, options: { emailRedirectTo: window.location.origin, data: { full_name: p.data.fullName } } });
    setBusy(false);
    if (err) setError('Could not create your account. Please try again.'); else setDone(true);
  }
  return <MarketingLayout>
    {done ? <div className="mx-auto max-w-sm px-5 py-16"><h1 className="text-2xl font-semibold">Check your email</h1><p className="mt-2 text-muted-foreground">Confirm your address using the link we sent, then sign in.</p></div> :
    <form onSubmit={submit} className="mx-auto flex max-w-sm flex-col gap-3 px-5 py-16">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <Label htmlFor="n">Full name</Label><Input id="n" value={f.fullName} onChange={(e) => setF({ ...f, fullName: e.target.value })} />
      <Label htmlFor="e">Email</Label><Input id="e" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <Label htmlFor="p">Password</Label><Input id="p" type="password" autoComplete="new-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
      <Label htmlFor="c">Confirm password</Label><Input id="c" type="password" autoComplete="new-password" value={f.confirmPassword} onChange={(e) => setF({ ...f, confirmPassword: e.target.value })} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.acceptTerms} onChange={(e) => setF({ ...f, acceptTerms: e.target.checked })} /> I accept the <Link to="/terms" className="text-primary">terms</Link> and <Link to="/privacy" className="text-primary">privacy policy</Link></label>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={busy}>Create account</Button>
      <p className="text-sm text-muted-foreground">Already have an account? <Link to="/login" className="text-primary">Sign in</Link></p>
    </form>}
  </MarketingLayout>;
}
