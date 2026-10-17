/** Only an Auth-validated recovery event unlocks the password reset form. */
export function createRecoveryState() {
  let recoveryUserId: string | null = null;
  return {
    observe(event: string, userId?: string) {
      if (event === 'PASSWORD_RECOVERY') recoveryUserId = userId ?? null;
      if (event === 'SIGNED_OUT') recoveryUserId = null;
      if (event === 'SIGNED_IN' && recoveryUserId !== userId) recoveryUserId = null;
    },
    allows(userId: string) { return recoveryUserId === userId; },
    clear() { recoveryUserId = null; },
  };
}

// Browser-only ephemeral proof, never persisted or used by server authorization.
export const recoveryState = createRecoveryState();