import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Tournament } from '../lib/api'
import StatusBadge from './StatusBadge'

type Props = {
  tournament: Tournament
  onPress: () => void
}

function formatDate(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function TournamentCard({ tournament, onPress }: Props) {
  const { name, description, status, starts_at, ends_at, total_segments_count, participants_count, joined } = tournament

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.top}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <StatusBadge status={status} />
      </View>

      {description ? (
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
      ) : null}

      <View style={styles.meta}>
        <MetaChip icon="📍" label={`${total_segments_count} сегм.`} />
        <MetaChip icon="👥" label={`${participants_count} уч.`} />
        {starts_at && <MetaChip icon="📅" label={formatDate(starts_at)!} />}
        {joined && <MetaChip icon="✅" label="Учасник" highlight />}
      </View>
    </TouchableOpacity>
  )
}

function MetaChip({ icon, label, highlight }: { icon: string; label: string; highlight?: boolean }) {
  return (
    <View style={[styles.chip, highlight && styles.chipHighlight]}>
      <Text style={styles.chipIcon}>{icon}</Text>
      <Text style={[styles.chipText, highlight && styles.chipTextHighlight]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    gap: 10,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
    lineHeight: 22,
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipHighlight: { backgroundColor: '#fff7ed' },
  chipIcon: { fontSize: 11 },
  chipText: { fontSize: 11, color: '#6b7280', fontWeight: '600' },
  chipTextHighlight: { color: '#c2410c' },
})
