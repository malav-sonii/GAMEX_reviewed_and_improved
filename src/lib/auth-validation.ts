export type AuthResult =
  | { ok: true; redirectTo: string }
  | { ok: false; error: string; fields?: Record<string, string> }

export function validateEmail(value: unknown) {
  const email = typeof value === 'string' ? value.trim().toLowerCase() : ''
  if (!email) return { value: email, error: 'Email is required.' }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { value: email, error: 'Enter a valid email address.' }
  }
  return { value: email }
}

export function validatePassword(value: unknown, strict = false) {
  const password = typeof value === 'string' ? value : ''
  if (!password) return { value: password, error: 'Password is required.' }
  if (strict && password.length < 8) {
    return { value: password, error: 'Use at least 8 characters.' }
  }
  if (password.length > 1024) return { value: password, error: 'Password is too long.' }
  return { value: password }
}

export function safeRedirect(value: unknown) {
  if (
    typeof value !== 'string' ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\') ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) return '/dashboard'

  try {
    const base = new URL('https://gamex.invalid')
    const target = new URL(value, base)
    if (target.origin !== base.origin) return '/dashboard'
    return `${target.pathname}${target.search}${target.hash}`
  } catch {
    return '/dashboard'
  }
}
