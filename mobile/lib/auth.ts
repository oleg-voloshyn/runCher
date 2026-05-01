import * as WebBrowser from 'expo-web-browser'
import * as SecureStore from 'expo-secure-store'

const TOKEN_KEY = 'mobile_token'
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000'
const CLIENT_ID = process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID ?? '49283'

// Rails callback URL — requires `adb reverse tcp:3000 tcp:3000` on emulator
// or set EXPO_PUBLIC_API_URL to your machine's IP and Strava redirect_uri accordingly
const REDIRECT_URI = `${API_URL}/auth/strava/callback`

export function stravaAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'activity:read_all',
    state: 'mobile',
  })
  return `https://www.strava.com/oauth/mobile/authorize?${params}`
}

export async function loginWithStrava(): Promise<string | null> {
  const result = await WebBrowser.openAuthSessionAsync(
    stravaAuthUrl(),
    'runcher://auth'
  )

  if (result.type !== 'success') return null

  try {
    const url = new URL(result.url)
    const token = url.searchParams.get('token')
    if (token) {
      await SecureStore.setItemAsync(TOKEN_KEY, token)
      return token
    }
  } catch {
    // malformed URL
  }
  return null
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY)
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY)
}
