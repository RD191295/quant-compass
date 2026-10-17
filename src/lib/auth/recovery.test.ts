import { describe, expect, it } from 'vitest';
import { createRecoveryState } from './recovery';

describe('Recovery authorization', () => {
  it('does not allow a normal signed-in user to reset a password', () => {
    const state = createRecoveryState();
    state.observe('SIGNED_IN', 'user-a');
    expect(state.allows('user-a')).toBe(false);
  });
  it('allows only the user validated by the recovery event', () => {
    const state = createRecoveryState();
    state.observe('PASSWORD_RECOVERY', 'user-a');
    expect(state.allows('user-a')).toBe(true);
    expect(state.allows('user-b')).toBe(false);
  });
  it('clears recovery permission on sign-out and after completion', () => {
    const state = createRecoveryState();
    state.observe('PASSWORD_RECOVERY', 'user-a');
    state.observe('SIGNED_OUT');
    expect(state.allows('user-a')).toBe(false);
    state.observe('PASSWORD_RECOVERY', 'user-a');
    state.clear();
    expect(state.allows('user-a')).toBe(false);
  });
});