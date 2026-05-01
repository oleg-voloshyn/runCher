import { useState, useEffect, useCallback } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Image,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { api, Leaderboard, LeaderboardEntry, SegmentLeader } from '../../../lib/api'

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const GENDERS = [
  { key: '', label: 'Всі' },
  { key: 'male', label: '♂ Чол.' },
  { key: 'female', label: '♀ Жін.' },
]

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function LeaderboardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [gender, setGender] = useState('')
  const [data, setData] = useState<Leaderboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.getLeaderboard(id!, gender || undefined)
      setData(res)
      setError(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [id, gender])

  useEffect(() => { load() }, [load])

  return (
    <View style={styles.container}>
      {/* Gender filter */}
      <View style={styles.filterBar}>
        {GENDERS.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[styles.filterBtn, gender === key && styles.filterBtnActive]}
            onPress={() => setGender(key)}
          >
            <Text style={[styles.filterText, gender === key && styles.filterTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#fc4c02" size="large" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={data?.rankings ?? []}
          keyExtractor={(item) => String(item.user_id)}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            data && data.segment_leaders.length > 0 ? (
              <SegmentLeaders leaders={data.segment_leaders} />
            ) : null
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Немає учасників</Text>
          }
          renderItem={({ item }) => <RankRow entry={item} />}
        />
      )}
    </View>
  )
}

function RankRow({ entry }: { entry: LeaderboardEntry }) {
  const medal = MEDAL[entry.rank]
  return (
    <View style={[styles.rankRow, entry.rank <= 3 && styles.rankRowTop]}>
      <View style={styles.rankCell}>
        {medal ? (
          <Text style={styles.medal}>{medal}</Text>
        ) : (
          <Text style={styles.rankNum}>{entry.rank}</Text>
        )}
      </View>
      {entry.profile_picture ? (
        <Image source={{ uri: entry.profile_picture }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarInitial}>{entry.full_name[0]}</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.rankName}>{entry.full_name}</Text>
        <Text style={styles.rankGender}>
          {entry.gender === 'male' ? '♂' : '♀'}
          {entry.completion_order ? ` · фін. #${entry.completion_order}` : ''}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.rankScore}>{entry.overall_score.toFixed(1)}</Text>
        {entry.bonus_score > 0 && (
          <Text style={styles.rankBonus}>+{entry.bonus_score.toFixed(1)} бонус</Text>
        )}
      </View>
    </View>
  )
}

function SegmentLeaders({ leaders }: { leaders: SegmentLeader[] }) {
  return (
    <View style={styles.leadersCard}>
      <Text style={styles.leadersTitle}>Лідери сегментів</Text>
      {leaders.map((seg) => (
        <View key={seg.segment_id} style={styles.leaderRow}>
          <View style={styles.leaderSegment}>
            <Text style={styles.leaderOrder}>#{seg.order_number}</Text>
            <Text style={styles.leaderName} numberOfLines={1}>{seg.segment_name}</Text>
          </View>
          {seg.leader ? (
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.leaderUser}>{seg.leader.full_name}</Text>
              <Text style={styles.leaderTime}>{formatTime(seg.leader.elapsed_time)}</Text>
            </View>
          ) : (
            <Text style={styles.noLeader}>—</Text>
          )}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  filterBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    padding: 12,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#f9fafb',
  },
  filterBtnActive: { backgroundColor: '#fc4c02' },
  filterText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  filterTextActive: { color: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#ef4444', fontSize: 14 },
  list: { padding: 16, gap: 8, paddingBottom: 32 },
  emptyText: { textAlign: 'center', color: '#9ca3af', marginTop: 40 },
  leadersCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 12,
    gap: 4,
  },
  leadersTitle: { fontSize: 14, fontWeight: '800', color: '#111827', marginBottom: 8 },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#f9fafb',
  },
  leaderSegment: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  leaderOrder: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: '#fc4c02',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  leaderName: { fontSize: 12, color: '#374151', fontWeight: '600', flex: 1 },
  leaderUser: { fontSize: 12, fontWeight: '700', color: '#111827' },
  leaderTime: { fontSize: 11, color: '#6b7280' },
  noLeader: { color: '#d1d5db', fontSize: 14 },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  rankRowTop: { borderColor: '#fed7aa' },
  rankCell: { width: 32, alignItems: 'center' },
  medal: { fontSize: 22 },
  rankNum: { fontSize: 15, fontWeight: '800', color: '#9ca3af' },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  avatarPlaceholder: { backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 14, fontWeight: '700', color: '#6b7280' },
  rankName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  rankGender: { fontSize: 11, color: '#9ca3af', marginTop: 1 },
  rankScore: { fontSize: 16, fontWeight: '900', color: '#fc4c02' },
  rankBonus: { fontSize: 10, color: '#16a34a', fontWeight: '600' },
})
