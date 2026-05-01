import { View, Text, StyleSheet } from 'react-native'

type Status = 'draft' | 'active' | 'completed'

const CONFIG: Record<Status, { label: string; bg: string; text: string }> = {
  draft:     { label: 'Чернетка', bg: '#f3f4f6', text: '#6b7280' },
  active:    { label: 'Активний', bg: '#dcfce7', text: '#16a34a' },
  completed: { label: 'Завершено', bg: '#dbeafe', text: '#1d4ed8' },
}

export default function StatusBadge({ status }: { status: string }) {
  const cfg = CONFIG[status as Status] ?? CONFIG.draft
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.text, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 11, fontWeight: '700' },
})
