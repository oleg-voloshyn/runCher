import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout'
import TournamentCard from '../components/TournamentCard'
import Spinner from '../components/Spinner'
import { useApi } from '../hooks/useApi'
import { api } from '../api/client'

export default function Tournaments() {
  const { t } = useTranslation()
  const { data: tournaments, loading, error } = useApi(() => api.getTournaments())
  const [filter, setFilter] = useState('all')

  const FILTERS = [
    { key: 'all', label: t('tournaments.filterAll') },
    { key: 'active', label: t('tournaments.filterActive') },
    { key: 'completed', label: t('tournaments.filterCompleted') },
  ]

  const filtered = (tournaments || []).filter((t) => filter === 'all' || t.status === filter)

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-4">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{t('tournaments.title')}</h1>

        <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 gap-1">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                filter === key ? 'bg-[#fc4c02] text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🏁</p>
              <p className="text-lg font-medium">{t('tournaments.empty')}</p>
              <p className="text-sm mt-1">{t('tournaments.emptyHint')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  )
}
