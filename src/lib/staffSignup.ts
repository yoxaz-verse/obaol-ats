export type StaffSignupFailureKind =
  | 'existing_account'
  | 'rate_limited'
  | 'email_delivery'
  | 'invalid_email'
  | 'invalid_password'
  | 'database'
  | 'network'
  | 'unknown';

type AuthErrorLike = Error & {
  code?: string;
  status?: number;
};

export interface StaffSignupFailure {
  kind: StaffSignupFailureKind;
  message: string;
}

const SIGNUP_FAILURE_MESSAGES: Record<StaffSignupFailureKind, string> = {
  existing_account: 'An account already exists for this email. Please log in or reset your password.',
  rate_limited: 'Too many signup or email requests were made. Please wait a few minutes and try again.',
  email_delivery: 'We could not send the confirmation email. Please try again later or contact support.',
  invalid_email: 'Please enter a valid email address and try again.',
  invalid_password: 'The password does not meet the security requirements. Please choose a stronger password.',
  database: 'We could not finish creating your account. Please try again later or contact support.',
  network: 'We could not reach the signup service. Check your connection and try again.',
  unknown: 'An unexpected error occurred during signup. Please try again or contact support.',
};

function authErrorDetails(error: unknown): { code: string; message: string; status?: number } {
  if (!(error instanceof Error)) return { code: '', message: String(error ?? '') };
  const authError = error as AuthErrorLike;
  return {
    code: authError.code?.toLowerCase() ?? '',
    message: authError.message.toLowerCase(),
    status: authError.status,
  };
}

export function classifyStaffSignupError(error: unknown): StaffSignupFailure {
  const { code, message, status } = authErrorDetails(error);
  let kind: StaffSignupFailureKind = 'unknown';

  if (
    code === 'user_already_exists' ||
    code === 'email_exists' ||
    message.includes('already registered') ||
    message.includes('already exists')
  ) {
    kind = 'existing_account';
  } else if (
    status === 429 ||
    code.includes('rate_limit') ||
    message.includes('rate limit') ||
    message.includes('too many requests')
  ) {
    kind = 'rate_limited';
  } else if (
    code === 'email_send_failed' ||
    message.includes('sending confirmation email') ||
    message.includes('smtp') ||
    message.includes('confirmation email')
  ) {
    kind = 'email_delivery';
  } else if (
    code === 'email_address_invalid' ||
    message.includes('invalid email') ||
    message.includes('email address is invalid')
  ) {
    kind = 'invalid_email';
  } else if (
    code === 'weak_password' ||
    message.includes('password')
  ) {
    kind = 'invalid_password';
  } else if (
    message.includes('database') ||
    message.includes('trigger') ||
    message.includes('handle_new_user')
  ) {
    kind = 'database';
  } else if (
    message.includes('failed to fetch') ||
    message.includes('network') ||
    message.includes('timed out') ||
    message.includes('connection')
  ) {
    kind = 'network';
  }

  return { kind, message: SIGNUP_FAILURE_MESSAGES[kind] };
}

export function staffSignupErrorLog(error: unknown): Record<string, unknown> {
  if (!(error instanceof Error)) {
    return { name: 'UnknownError', message: String(error ?? 'Unknown signup error') };
  }

  const authError = error as AuthErrorLike;
  return {
    name: authError.name,
    message: authError.message,
    code: authError.code,
    status: authError.status,
  };
}

export function isDuplicateSignupResponse(user: { identities?: unknown[] | null } | null): boolean {
  return !!user && Array.isArray(user.identities) && user.identities.length === 0;
}
