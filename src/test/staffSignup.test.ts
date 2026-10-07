import { describe, expect, it } from 'vitest';
import {
  classifyStaffSignupError,
  isDuplicateSignupResponse,
  staffSignupErrorLog,
} from '@/lib/staffSignup';

function authError(message: string, code?: string, status?: number): Error {
  return Object.assign(new Error(message), { code, status });
}

describe('staff signup errors', () => {
  it.each([
    [authError('User already registered', 'user_already_exists', 422), 'existing_account'],
    [authError('Email rate limit exceeded', 'over_email_send_rate_limit', 429), 'rate_limited'],
    [authError('Error sending confirmation email', 'email_send_failed', 500), 'email_delivery'],
    [authError('Email address is invalid', 'email_address_invalid', 400), 'invalid_email'],
    [authError('Password should contain a symbol', 'weak_password', 422), 'invalid_password'],
    [authError('Database error saving new user', 'unexpected_failure', 500), 'database'],
    [new TypeError('Failed to fetch'), 'network'],
  ])('classifies %s as %s', (error, expectedKind) => {
    expect(classifyStaffSignupError(error).kind).toBe(expectedKind);
  });

  it('uses a safe fallback instead of exposing an unknown server message', () => {
    const failure = classifyStaffSignupError(authError('internal detail that should not reach the UI'));
    expect(failure.kind).toBe('unknown');
    expect(failure.message).not.toContain('internal detail');
  });

  it('detects Supabase duplicate-signup identity responses', () => {
    expect(isDuplicateSignupResponse({ identities: [] })).toBe(true);
    expect(isDuplicateSignupResponse({ identities: [{}] })).toBe(false);
    expect(isDuplicateSignupResponse(null)).toBe(false);
  });

  it('logs structured auth details without adding submitted credentials', () => {
    expect(staffSignupErrorLog(authError('Database error', 'unexpected_failure', 500))).toEqual({
      name: 'Error',
      message: 'Database error',
      code: 'unexpected_failure',
      status: 500,
    });
  });
});
