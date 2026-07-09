const API_BASE = import.meta.env.VITE_API_BASE ?? 'https://api.numnumtheory.com'

export type AccountType = 'individual' | 'expert' | 'restaurant_provider'

export interface RegisterPayload {
  email: string
  password: string
  display_name: string
  age_confirmed: boolean
  account_type: AccountType
}

export interface RegisterResult {
  user_id: string
  access_token: string
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function registerAccount(payload: RegisterPayload): Promise<RegisterResult> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new ApiError(res.status, body?.detail ?? `Registration failed (${res.status})`)
  }

  return res.json()
}
