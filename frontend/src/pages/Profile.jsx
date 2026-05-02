import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { useAuth } from '../contexts/AuthContext'
import { useApi } from '../hooks/useApi'
import { api } from '../api/client'

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-600',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
}

export default function Profile() {
  const { user } = useAuth()
  const { t, i18n } = useTranslation()
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState(null)
  const { data: tournaments, loading } = useApi(() => api.getTournaments())
  const locale = i18n.language === 'uk' ? 'uk-UA' : 'en-GB'

  if (!user) return <Navigate to="/" replace />

  const myTournaments = (tournaments || []).filter((t) => t.joined)

  async function handleSync() {
    setSyncing(true)
    setSyncMsg(null)
    try {
      const res = await api.syncActivities()
      setSyncMsg(res.message)
    } catch (e) {
      setSyncMsg(e.message)
    } finally {
      setSyncing(false)
    }
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex flex-col items-center text-center mb-4">
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user.full_name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mb-4 ring-4 ring-orange-100"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl font-bold mb-4">
                  {user.first_name?.[0]}
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-900">{user.full_name}</h2>
              {user.email && <p className="text-sm text-gray-400 mt-1">{user.email}</p>}
              <a
                href={`https://www.strava.com/athletes/${user.strava_id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-xs text-[#fc4c02] hover:underline"
              >
                <StravaIcon /> {t('profile.stravaProfile')}
              </a>
            </div>
          </div>

          {/* Sync card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-1">{t('profile.syncTitle')}</h3>
            <p className="text-xs text-gray-400 mb-4">{t('profile.syncDesc')}</p>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="w-full flex items-center justify-center gap-2 bg-[#fc4c02] hover:bg-[#e04400] disabled:opacity-50 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
            >
              {syncing ? <Spinner className="h-4 w-4" /> : '🔄'}{' '}
              {syncing ? t('profile.syncing') : t('profile.sync')}
            </button>
            {syncMsg && <p className="mt-3 text-xs text-center text-gray-500">{syncMsg}</p>}
          </div>
        </div>

        {/* My tournaments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">{t('profile.myTournaments')}</h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : myTournaments.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-400">
                <p className="text-4xl mb-3">🏁</p>
                <p className="font-medium">{t('profile.notParticipating')}</p>
                <a
                  href="/tournaments"
                  className="mt-3 inline-block text-sm text-[#fc4c02] hover:underline"
                >
                  {t('profile.viewTournaments')}
                </a>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {myTournaments.map((tournament) => (
                  <div key={tournament.id} className="px-4 sm:px-6 py-4">
                    <div className="flex items-start justify-between gap-2">
                      <a
                        href={`/tournaments/${tournament.id}`}
                        className="font-semibold text-gray-900 hover:text-[#fc4c02] transition-colors text-sm sm:text-base leading-tight"
                      >
                        {tournament.name}
                      </a>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${STATUS_COLORS[tournament.status]}`}
                      >
                        {t(`status.${tournament.status}`)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>
                          {tournament.total_segments_count} {t('profile.segments')}
                        </span>
                        <span>👥 {tournament.participants_count}</span>
                        {tournament.starts_at && (
                          <span className="hidden sm:inline">
                            {new Date(tournament.starts_at).toLocaleDateString(locale)}
                          </span>
                        )}
                      </div>
                      <a
                        href={`/tournaments/${tournament.id}/leaderboard`}
                        className="text-xs text-[#fc4c02] hover:underline shrink-0"
                      >
                        {t('profile.leaderboard')}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

function StravaIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066z" />
      <path d="M11.374 14.105l2.197-4.35-2.197-4.332L9.178 9.755z" />
    </svg>
  )
}
