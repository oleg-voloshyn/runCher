const BASE = '/api/v1'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include',
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok)
    throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status, data })
  return data
}

export const api = {
  // Auth
  getMe: () => request('/me'),
  updateGender: (gender) => request('/me', { method: 'PATCH', body: { gender } }),

  // Tournaments
  getTournaments: () => request('/tournaments'),
  getTournament: (id) => request(`/tournaments/${id}`),
  createTournament: (data) =>
    request('/tournaments', { method: 'POST', body: { tournament: data } }),
  joinTournament: (id) => request(`/tournaments/${id}/join`, { method: 'POST' }),

  // Leaderboard
  getLeaderboard: (id, gender) =>
    request(`/tournaments/${id}/leaderboard${gender ? `?gender=${gender}` : ''}`),

  // Segments
  getSegments: () => request('/segments'),

  // Activities
  getActivities: () => request('/activities'),

  // Sync
  syncActivities: () => request('/sync_activities', { method: 'POST' }),
}

export function stravaLoginUrl() {
  const clientId = import.meta.env.VITE_STRAVA_CLIENT_ID
  const redirectUri =
    import.meta.env.VITE_STRAVA_REDIRECT_URI || 'http://localhost:5173/auth/strava/callback'
  const scope = 'read,profile:read_all,activity:read_all'
  return `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&approval_prompt=auto`
}
