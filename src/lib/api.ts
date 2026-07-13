const API_BASE = import.meta.env.VITE_API_BASE ?? 'https://api.numnumtheory.com'

export type AccountType = 'individual' | 'expert' | 'restaurant_provider'

export interface RegisterPayload {
  email: string
  password: string
  display_name: string
  age_confirmed: boolean
  account_type: AccountType
  registration_number?: string
  wants_contributor?: boolean
}

export interface RegisterResult {
  user_id: string
  access_token: string
}

export interface LoginPayload {
  email: string
  password: string
  device_hint?: string
}

export interface MeResponse {
  user_id: string
  email: string
  display_name: string
  age_confirmed: boolean
  created_at: string
  contributor_id: string | null
  is_superadmin: boolean
  org_id: string | null
  role: string | null
  is_expert: boolean
  contributor_interest: boolean
  org_type: 'expert_clinic' | 'restaurant_provider' | null
  verification_status: 'pending' | 'verified' | 'rejected' | null
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function handleResponse<T>(res: Response, fallbackMessage: string): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new ApiError(res.status, body?.detail ?? `${fallbackMessage} (${res.status})`)
  }
  return res.json()
}

export async function registerAccount(payload: RegisterPayload): Promise<RegisterResult> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse<RegisterResult>(res, 'Registration failed')
}

export async function loginAccount(payload: LoginPayload): Promise<RegisterResult> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse<RegisterResult>(res, 'Sign in failed')
}

export async function getMe(token: string): Promise<MeResponse> {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return handleResponse<MeResponse>(res, 'Could not load account')
}
