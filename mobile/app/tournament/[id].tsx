import { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native'
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router'
import { api, Tournament } from '../../lib/api'
import { useAuth } from '../_layout'
import StatusBadge from '../../components/StatusBadge'

function formatDate(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function TournamentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const navigation = useNavigation()
  const { user } = useAuth()
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.getTournament(id!)
      .then((data) => {
        setTournament(data)
        navigation.setOptions({ headerTitle: data.name })
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleJoin() {
    if (!tournament) return
    setJoining(true)
    try {
      await api.joinTournament(tournament.id)
      setTournament((t) => t ? { ...t, joined: true, participants_count: t.participants_count + 1 } : t)
    } catch (e: any) {
      Alert.alert('Помилка', e.message)
    } finally {
      setJoining(false)
    }
  }

  async function handleLeave() {
    if (!tournament) return
    Alert.alert('Вийти з турніру', 'Ви дійсно хочете покинути цей турнір?', [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Вийти', style: 'destructive', onPress: async () => {
          setJoining(true)
          try {
            await api.leaveTournament(tournament.id)
            setTournament((t) => t ? { ...t, joined: false, participants_count: t.participants_count - 1 } : t)
          } catch (e: any) {
            Alert.alert('Помилка', e.message)
          } finally {
            setJoining(false)
          }
        },
      },
    ])
  }

  async function handleSync() {
    setSyncing(true)
    try {
      const res = await api.syncActivities()
      Alert.alert('Готово', res.message)
    } catch (e: any) {
      Alert.alert('Помилка', e.message)
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#fc4c02" size="large" />
      </View>
    )
  }

  if (error || !tournament) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? 'Не знайдено'}</Text>
      </View>
    )
  }

  const { name, description, status, starts_at, ends_at, total_segments_count, rated_segments_count, participants_count, joined, segments = [] } = tournament

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Header info */}
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{name}</Text>
          <StatusBadge status={status} />
        </View>
        {description ? <Text style={styles.description}>{description}</Text> : null}

        <View style={styles.metaRow}>
          <MetaItem icon="📍" label={`${total_segments_count} сегм.`} />
          <MetaItem icon="🏆" label={`${rated_segments_count} рейт.`} />
          <MetaItem icon="👥" label={`${participants_count} уч.`} />
          {starts_at && <MetaItem icon="📅" label={formatDate(starts_at)!} />}
        </View>
      </View>

      {/* Joined banner */}
      {joined && status === 'active' && (
        <View style={styles.joinedBanner}>
          <Text style={styles.joinedText}>✅ Ви берете участь. Бігайте та синхронізуйте Strava!</Text>
        </View>
      )}

      {/* Actions */}
      {status === 'active' && user && (
        <View style={styles.actionsRow}>
          {joined ? (
            <>
              <TouchableOpacity
                style={[styles.btn, styles.btnSecondary, { flex: 1 }]}
                onPress={handleSync}
                disabled={syncing}
              >
                {syncing
                  ? <ActivityIndicator color="#374151" size="small" />
                  : <Text style={styles.btnSecondaryText}>🔄 Синхр. Strava</Text>
                }
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnDanger]}
                onPress={handleLeave}
                disabled={joining}
              >
                <Text style={styles.btnDangerText}>Вийти</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary, { flex: 1 }]}
              onPress={handleJoin}
              disabled={joining}
            >
              {joining
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={styles.btnPrimaryText}>Приєднатися</Text>
              }
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Leaderboard button */}
      <TouchableOpacity
        style={[styles.btn, styles.btnOutline]}
        onPress={() => router.push(`/tournament/${id}/leaderboard`)}
      >
        <Text style={styles.btnOutlineText}>🏆 Переглянути рейтинг</Text>
      </TouchableOpacity>

      {/* Segments */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Сегменти турніру</Text>
        <Text style={styles.sectionSubtitle}>Рейтингові сегменти та порядок — приховані</Text>

        {segments.length === 0 ? (
          <Text style={styles.emptyText}>Сегменти ще не додані</Text>
        ) : (
          segments.map((seg, i) => (
            <View key={seg.id} style={styles.segmentRow}>
              <View style={styles.segmentIndex}>
                <Text style={styles.segmentIndexText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.segmentName}>{seg.name}</Text>
                <Text style={styles.segmentMeta}>
                  {seg.distance ? `${(seg.distance / 1000).toFixed(2)} km` : ''}
                  {seg.average_grade ? ` · ${seg.average_grade}% ухил` : ''}
                </Text>
              </View>
              {seg.is_rated !== undefined && seg.is_rated && (
                <View style={styles.ratedBadge}>
                  <Text style={styles.ratedBadgeText}>#{seg.order_number}</Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  )
}

function MetaItem({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaIcon}>{icon}</Text>
      <Text style={styles.metaLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scroll: { padding: 16, gap: 12, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#ef4444' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    gap: 8,
  },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  name: { fontSize: 22, fontWeight: '900', color: '#111827', flex: 1 },
  description: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaIcon: { fontSize: 13 },
  metaLabel: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  joinedBanner: {
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  joinedText: { color: '#15803d', fontSize: 13, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', gap: 8 },
  btn: {
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  btnPrimary: { backgroundColor: '#fc4c02' },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnSecondary: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
  btnSecondaryText: { color: '#374151', fontWeight: '600', fontSize: 14 },
  btnDanger: { borderWidth: 1, borderColor: '#fecaca', paddingHorizontal: 16 },
  btnDangerText: { color: '#ef4444', fontWeight: '600', fontSize: 14 },
  btnOutline: { borderWidth: 1.5, borderColor: '#fc4c02' },
  btnOutlineText: { color: '#fc4c02', fontWeight: '700', fontSize: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  sectionSubtitle: { fontSize: 11, color: '#9ca3af', marginTop: -4, marginBottom: 4 },
  emptyText: { fontSize: 13, color: '#9ca3af', paddingVertical: 8 },
  segmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f9fafb',
  },
  segmentIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentIndexText: { fontSize: 12, fontWeight: '700', color: '#6b7280' },
  segmentName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  segmentMeta: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  ratedBadge: {
    backgroundColor: '#fff7ed',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  ratedBadgeText: { color: '#c2410c', fontSize: 11, fontWeight: '700' },
})
