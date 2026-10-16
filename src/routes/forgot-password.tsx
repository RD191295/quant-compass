import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { MarketingLayout, marketingHead } from '@/components/marketing/layout';
import { forgotSchema } from '@/lib/auth/schemas';

export const Route = createFileRoute('/forgot-password')({
  head: () => marketingHead('Reset your password', 'Request a password reset link for your Quant Compass account.'),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = forgotSchema.safeParse({ email });
    if (!p.success) { setError(p.error.issues[0]?.message ?? 'Check your email'); return; }
    setBusy(true);
    // Same message regardless of whether the account exists — no account enumeration.
    const { error: err } = await supabase.auth.resetPasswordForEmail(p.data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (err) setError('Could not send the email. Please try again.');
    else setSent(true);
  }
  return <MarketingLayout>
    <div className="mx-auto max-w-sm px-5 py-16">
      {sent ? <>
        <h1 className="text-2xl font-semibold">Check your email</h1>
        <p className="mt-2 text-sm text-muted-foreground">If an account exists for {email}, we sent a link to choose a new password. The link expires shortly.</p>
        <p className="mt-4 text-sm text-muted-foreground"><Link to="/login" className="text-primary">Back to sign in</Link></p>
      </> : <form onSubmit={submit} className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">Forgot password?</h1>
        <p className="text-sm text-muted-foreground">Enter the email on your account and we'll send a link to choose a new password.</p>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={busy}>Send reset link</Button>
        <p className="text-sm text-muted-foreground">Remembered it? <Link to="/login" className="text-primary">Sign in</Link></p>
      </form>}
    </div>
  </MarketingLayout>;
}
