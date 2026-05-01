import { useState, useCallback, useEffect } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, ActivityIndicator, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useAuth } from '../_layout'
import { api, Tournament } from '../../lib/api'
import { clearToken } from '../../lib/auth'

const STATUS_LABELS: Record<string, string> = {
  draft: 'Чернетка',
  active: 'Активний',
  completed: 'Завершено',
}
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  draft:     { bg: '#f3f4f6', text: '#6b7280' },
  active:    { bg: '#dcfce7', text: '#16a34a' },
  completed: { bg: '#dbeafe', text: '#1d4ed8' },
}

export default function ProfileScreen() {
  const { user, setUser, setToken } = useAuth()
  const router = useRouter()
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState<string | null>(null)
  const [myTournaments, setMyTournaments] = useState<Tournament[]>([])
  const [loadingT, setLoadingT] = useState(true)

  const loadTournaments = useCallback(async () => {
    try {
      const all = await api.getTournaments()
      setMyTournaments(all.filter((t) => t.joined))
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    loadTournaments().finally(() => setLoadingT(false))
  }, [])

  async function handleGender(gender: 'male' | 'female') {
    try {
      const updated = await api.updateGender(gender)
      setUser(updated)
    } catch (e: any) {
      Alert.alert('Помилка', e.message)
    }
  }

  async function handleSync() {
    setSyncing(true)
    setSyncMsg(null)
    try {
      const res = await api.syncActivities()
      setSyncMsg(res.message)
    } catch (e: any) {
      setSyncMsg(e.message)
    } finally {
      setSyncing(false)
    }
  }

  async function handleLogout() {
    Alert.alert('Вийти', 'Ви дійсно хочете вийти?', [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Вийти', style: 'destructive', onPress: async () => {
          await clearToken()
          setToken(null)
          setUser(null)
        },
      },
    ])
  }

  if (!user) return null

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Профіль</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Вийти</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar + name */}
        <View style={styles.card}>
          <View style={styles.avatarRow}>
            {user.profile_picture ? (
              <Image source={{ uri: user.profile_picture }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>{user.first_name?.[0]}</Text>
              </View>
            )}
            <View>
              <Text style={styles.name}>{user.full_name}</Text>
              <Text style={styles.strava}>Strava ID: {user.strava_id}</Text>
            </View>
          </View>

          {/* Gender */}
          <View style={styles.divider} />
          <Text style={styles.sectionLabel}>СТАТЬ</Text>
          <View style={styles.genderRow}>
            {(['male', 'female'] as const).map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.genderBtn, user.gender === g && styles.genderBtnActive]}
                onPress={() => handleGender(g)}
              >
                <Text style={[styles.genderText, user.gender === g && styles.genderTextActive]}>
                  {g === 'male' ? '♂ Чоловік' : '♀ Жінка'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sync */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Синхронізація Strava</Text>
          <Text style={styles.cardSubtitle}>Завантажить останні 30 активностей і перевірить сегменти</Text>
          <TouchableOpacity
            style={[styles.syncBtn, syncing && styles.syncBtnDisabled]}
            onPress={handleSync}
            disabled={syncing}
          >
            {syncing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.syncBtnText}>🔄 Синхронізувати</Text>
            )}
          </TouchableOpacity>
          {syncMsg && <Text style={styles.syncMsg}>{syncMsg}</Text>}
        </View>

        {/* My tournaments */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Мої турніри</Text>
          {loadingT ? (
            <ActivityIndicator color="#fc4c02" style={{ marginTop: 12 }} />
          ) : myTournaments.length === 0 ? (
            <Text style={styles.emptyText}>Ви ще не берете участь у турнірах</Text>
          ) : (
            myTournaments.map((t) => {
              const colors = STATUS_COLORS[t.status] ?? STATUS_COLORS.draft
              return (
                <TouchableOpacity
                  key={t.id}
                  style={styles.tournamentRow}
                  onPress={() => router.push(`/tournament/${t.id}`)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.tournamentName}>{t.name}</Text>
                    <Text style={styles.tournamentMeta}>
                      {t.total_segments_count} сегм. · {t.participants_count} уч.
                    </Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: colors.bg }]}>
                    <Text style={[styles.badgeText, { color: colors.text }]}>
                      {STATUS_LABELS[t.status]}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scroll: { padding: 16, gap: 12, paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#111827' },
  logoutText: { fontSize: 14, color: '#ef4444', fontWeight: '600' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    gap: 4,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  avatarPlaceholder: { backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 24, fontWeight: '700', color: '#6b7280' },
  name: { fontSize: 18, fontWeight: '800', color: '#111827' },
  strava: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.5, marginBottom: 8 },
  genderRow: { flexDirection: 'row', gap: 8 },
  genderBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  genderBtnActive: { backgroundColor: '#fc4c02', borderColor: '#fc4c02' },
  genderText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  genderTextActive: { color: '#fff' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: '#9ca3af', marginBottom: 12 },
  syncBtn: {
    backgroundColor: '#fc4c02',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  syncBtnDisabled: { opacity: 0.6 },
  syncBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  syncMsg: { fontSize: 12, color: '#6b7280', textAlign: 'center', marginTop: 8 },
  emptyText: { fontSize: 13, color: '#9ca3af', paddingVertical: 12 },
  tournamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f9fafb',
    gap: 8,
  },
  tournamentName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  tournamentMeta: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },
})
