import { useEffect, useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { MarketingLayout, marketingHead } from '@/components/marketing/layout';
import { resetSchema } from '@/lib/auth/schemas';

export const Route = createFileRoute('/reset-password')({
  ssr: false,
  head: () => marketingHead('Choose a new password', 'Set a new password for your Quant Compass account.'),
  component: ResetPassword,
});

function ResetPassword() {
  const [status, setStatus] = useState<'checking' | 'ready' | 'expired'>('checking');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // The recovery link signs the user in; the auth client may still be exchanging
    // the code when we first read the session, so retry briefly.
    (async () => {
      for (let attempt = 0; attempt < 5; attempt++) {
        const { data } = await supabase.auth.getUser();
        if (cancelled) return;
        if (data.user) { setStatus('ready'); return; }
        await new Promise((r) => setTimeout(r, 600));
      }
      if (!cancelled) setStatus('expired');
    })();
    return () => { cancelled = true; };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = resetSchema.safeParse({ password, confirmPassword });
    if (!p.success) { setError(p.error.issues[0]?.message ?? 'Check your details'); return; }
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ password: p.data.password });
    setBusy(false);
    if (err) setError('Could not update your password. Request a fresh reset link and try again.');
    else setDone(true);
  }

  return <MarketingLayout>
    <div className="mx-auto max-w-sm px-5 py-16">
      {status === 'checking' && <p className="text-sm text-muted-foreground">Checking your reset link…</p>}
      {status === 'expired' && <>
        <h1 className="text-2xl font-semibold">Link expired</h1>
        <p className="mt-2 text-sm text-muted-foreground">This reset link is invalid or has already been used.</p>
        <p className="mt-4 text-sm text-muted-foreground"><Link to="/forgot-password" className="text-primary">Request a new link</Link></p>
      </>}
      {status === 'ready' && (done ? <>
        <h1 className="text-2xl font-semibold">Password updated</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your new password is saved. Use it to sign in from now on.</p>
        <p className="mt-4 text-sm text-muted-foreground"><Link to="/login" className="text-primary">Sign in</Link></p>
      </> : <form onSubmit={submit} className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">Choose a new password</h1>
        <Label htmlFor="pw">New password</Label>
        <Input id="pw" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Label htmlFor="cpw">Confirm new password</Label>
        <Input id="cpw" type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={busy}>Update password</Button>
      </form>)}
    </div>
  </MarketingLayout>;
}
