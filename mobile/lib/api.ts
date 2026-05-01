import { getToken } from './auth'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken()
  const res = await fetch(`${BASE_URL}/api/v1${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `HTTP ${res.status}`)
  }

  if (res.status === 204) return undefined as unknown as T
  return res.json()
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type User = {
  id: number
  first_name: string
  last_name: string
  full_name: string
  profile_picture: string | null
  gender: 'male' | 'female'
  role: string
  strava_id: string
}

export type Tournament = {
  id: number
  name: string
  description: string | null
  status: 'draft' | 'active' | 'completed'
  starts_at: string | null
  ends_at: string | null
  total_segments_count: number
  rated_segments_count: number
  participants_count: number
  joined: boolean
  segments?: Segment[]
}

export type Segment = {
  id: number
  strava_id: string
  name: string
  distance: number
  average_grade?: number
  is_rated?: boolean
  order_number?: number
}

export type LeaderboardEntry = {
  rank: number
  user_id: number
  full_name: string
  profile_picture: string | null
  gender: 'male' | 'female'
  total_score: number
  bonus_score: number
  overall_score: number
  completion_order: number | null
  completed_at: string | null
}

export type SegmentLeader = {
  order_number: number
  segment_id: number
  segment_name: string
  leader: {
    user_id: number
    full_name: string
    elapsed_time: number
    score: number
  } | null
}

export type Leaderboard = {
  tournament_id: number
  gender_filter: string | null
  rankings: LeaderboardEntry[]
  segment_leaders: SegmentLeader[]
}

// ─── Endpoints ───────────────────────────────────────────────────────────────

export const api = {
  me: () => request<User>('/me'),

  updateGender: (gender: string) =>
    request<User>('/me', { method: 'PATCH', body: JSON.stringify({ gender }) }),

  getTournaments: () => request<Tournament[]>('/tournaments'),

  getTournament: (id: number | string) =>
    request<Tournament>(`/tournaments/${id}`),

  joinTournament: (id: number | string) =>
    request<{ message: string }>(`/tournaments/${id}/join`, { method: 'POST' }),

  leaveTournament: (id: number | string) =>
    request<void>(`/tournaments/${id}/leave`, { method: 'DELETE' }),

  getLeaderboard: (id: number | string, gender?: string) => {
    const params = gender ? `?gender=${gender}` : ''
    return request<Leaderboard>(`/tournaments/${id}/leaderboard${params}`)
  },

  syncActivities: () =>
    request<{ message: string }>('/sync_activities', { method: 'POST' }),
}
