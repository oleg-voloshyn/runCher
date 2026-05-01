import { useState } from 'react'
import Layout from '../components/Layout'
import TournamentCard from '../components/TournamentCard'
import Spinner from '../components/Spinner'
import { useApi } from '../hooks/useApi'
import { api } from '../api/client'

const FILTERS = [
  { key: 'all',       label: 'Всі' },
  { key: 'active',    label: 'Активні' },
  { key: 'completed', label: 'Завершені' },
]

export default function Tournaments() {
  const { data: tournaments, loading, error } = useApi(() => api.getTournaments())
  const [filter, setFilter] = useState('all')

  const filtered = (tournaments || []).filter(t => filter === 'all' || t.status === filter)

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-black text-gray-900">Турніри</h1>

        <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 gap-1">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === key ? 'bg-[#fc4c02] text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-20"><Spinner /></div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm">{error}</div>
      )}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🏁</p>
              <p className="text-lg font-medium">Немає турнірів</p>
              <p className="text-sm mt-1">Перевірте пізніше або змініть фільтр</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(t => <TournamentCard key={t.id} tournament={t} />)}
            </div>
          )}
        </>
      )}
    </Layout>
  )
}
