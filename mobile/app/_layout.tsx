import { useEffect, useState } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import { getToken } from '../lib/auth'
import { api, User } from '../lib/api'

export type AuthContextType = {
  user: User | null
  setUser: (u: User | null) => void
  token: string | null
  setToken: (t: string | null) => void
}

import { createContext, useContext } from 'react'
export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {},
})
export const useAuth = () => useContext(AuthContext)

function AuthGuard({ token }: { token: string | null }) {
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    const inTabs = segments[0] === '(tabs)'
    if (!token && inTabs) {
      router.replace('/')
    } else if (token && !inTabs) {
      router.replace('/(tabs)/tournaments')
    }
  }, [token, segments])

  return null
}

export default function RootLayout() {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    getToken().then(async (t) => {
      if (t) {
        setToken(t)
        try {
          const me = await api.me()
          setUser(me)
        } catch {
          setToken(null)
        }
      }
      setReady(true)
    })
  }, [])

  if (!ready) return null

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <AuthGuard token={token} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="tournament/[id]"
            options={{
              headerShown: true,
              headerTitle: '',
              headerBackTitle: 'Назад',
              headerTintColor: '#fc4c02',
              headerStyle: { backgroundColor: '#fff' },
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="tournament/[id]/leaderboard"
            options={{
              headerShown: true,
              headerTitle: 'Рейтинг',
              headerBackTitle: 'Назад',
              headerTintColor: '#fc4c02',
              headerStyle: { backgroundColor: '#fff' },
              headerShadowVisible: false,
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </AuthContext.Provider>
  )
}
