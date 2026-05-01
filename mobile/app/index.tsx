import { useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { loginWithStrava } from '../lib/auth'
import { api } from '../lib/api'
import { useAuth } from './_layout'

export default function LoginScreen() {
  const { setToken, setUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin() {
    setLoading(true)
    setError(null)
    try {
      const token = await loginWithStrava()
      if (!token) {
        setError('Авторизацію скасовано')
        return
      }
      setToken(token)
      const me = await api.me()
      setUser(me)
    } catch (e: any) {
      setError(e.message ?? 'Помилка входу')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🏃 Черкаси · Strava Segments</Text>
        </View>

        <Text style={styles.logo}>
          Run<Text style={styles.logoAccent}>Cher</Text>
        </Text>

        <Text style={styles.subtitle}>
          Змагайся на сегментах Strava.{'\n'}Набирай бали. Ставай першим.
        </Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[styles.stravaBtn, loading && styles.stravaBtnDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <StravaIcon />
              <Text style={styles.stravaBtnText}>Увійти через Strava</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.howItWorks}>
        {[
          { icon: '🗺️', title: 'Адмін створює турнір', desc: '20 сегментів, 10 рейтингових — але ти не знаєш які.' },
          { icon: '🏃', title: 'Ти бігаєш', desc: 'Записуй тренування в Strava. Ми перевіряємо покриття.' },
          { icon: '🏆', title: 'Набирай бали', desc: 'T_лідер / T_твій × 100. Перший — отримує бонус.' },
        ].map(({ icon, title, desc }) => (
          <View key={title} style={styles.step}>
            <Text style={styles.stepIcon}>{icon}</Text>
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>{title}</Text>
              <Text style={styles.stepDesc}>{desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>RunCher © {new Date().getFullYear()} · Черкаси</Text>
    </SafeAreaView>
  )
}

function StravaIcon() {
  return (
    <Text style={{ marginRight: 8, fontSize: 18 }}>🟠</Text>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#fb923c',
    fontSize: 13,
    fontWeight: '600',
  },
  logo: {
    fontSize: 64,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -2,
  },
  logoAccent: {
    color: '#fc4c02',
  },
  subtitle: {
    fontSize: 17,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 26,
  },
  stravaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fc4c02',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginTop: 8,
    width: '100%',
    gap: 8,
  },
  stravaBtnDisabled: {
    opacity: 0.6,
  },
  stravaBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  error: {
    color: '#f87171',
    fontSize: 13,
    textAlign: 'center',
  },
  howItWorks: {
    backgroundColor: '#1e293b',
    padding: 20,
    gap: 14,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepIcon: {
    fontSize: 22,
    width: 32,
  },
  stepText: {
    flex: 1,
  },
  stepTitle: {
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  stepDesc: {
    color: '#64748b',
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    textAlign: 'center',
    color: '#334155',
    fontSize: 12,
    paddingVertical: 12,
  },
})
