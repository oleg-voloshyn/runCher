import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import SegmentMap from '../components/SegmentMap'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../api/client'

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-600',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
}

export default function TournamentDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { data: tournament, loading, error, setData } = useApi(() => api.getTournament(id), [id])
  const [joining, setJoining] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [nextSyncAt, setNextSyncAt] = useState(() =>
    user?.next_sync_at ? new Date(user.next_sync_at) : null
  )
  const syncOnCooldown = nextSyncAt && nextSyncAt > new Date()
  const locale = i18n.language === 'uk' ? 'uk-UA' : 'en-GB'

  async function handleJoin() {
    if (!user) return navigate('/login')
    setJoining(true)
    try {
      await api.joinTournament(id)
      setData((t) => ({ ...t, joined: true, participants_count: t.participants_count + 1 }))
    } catch (e) {
      alert(e.message)
    } finally {
      setJoining(false)
    }
  }

  async function handleLeave() {
    setJoining(true)
    try {
      await api.leaveTournament(id)
      setData((t) => ({ ...t, joined: false, participants_count: t.participants_count - 1 }))
    } catch (e) {
      alert(e.message)
    } finally {
      setJoining(false)
    }
  }

  async function handleSync() {
    setSyncing(true)
    try {
      const res = await api.syncActivities()
      if (res.next_sync_at) setNextSyncAt(new Date(res.next_sync_at))
      alert(res.message)
    } catch (e) {
      alert(e.message)
    } finally {
      setSyncing(false)
    }
  }

  if (loading)
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      </Layout>
    )
  if (error)
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">{error}</div>
      </Layout>
    )
  if (!tournament) return null

  const {
    name,
    description,
    status,
    starts_at,
    total_segments_count,
    rated_segments_count,
    participants_count,
    joined,
    segments = [],
  } = tournament

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Link
          to="/tournaments"
          className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block"
        >
          {t('detail.backToAll')}
        </Link>

        <div className="flex items-start gap-3 mb-2 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{name}</h1>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full self-center shrink-0 ${STATUS_COLORS[status]}`}
          >
            {t(`status.${status}`)}
          </span>
        </div>

        {description && <p className="text-gray-500 text-sm sm:text-base mb-3">{description}</p>}

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-4">
          <span>
            📍 {total_segments_count} {t('detail.segments')}
          </span>
          <span>
            🏆 {rated_segments_count} {t('detail.rated')}
          </span>
          <span>
            👥 {participants_count} {t('detail.participants')}
          </span>
          {starts_at && <span>📅 {new Date(starts_at).toLocaleDateString(locale)}</span>}
        </div>

        {/* Action buttons */}
        {status === 'active' && user && (
          <div className="flex flex-wrap gap-2">
            {joined ? (
              <>
                <div className="flex flex-col items-start gap-0.5">
                  <button
                    onClick={handleSync}
                    disabled={syncing || syncOnCooldown}
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {syncing ? <Spinner className="h-4 w-4" /> : '🔄'} {t('detail.syncStrava')}
                  </button>
                  {syncOnCooldown && (
                    <span className="text-xs text-gray-400 px-1">
                      {t('profile.nextSyncAt')}{' '}
                      {nextSyncAt.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLeave}
                  disabled={joining}
                  className="text-sm text-red-500 hover:text-red-700 border border-red-200 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  {t('detail.leaveTournament')}
                </button>
              </>
            ) : (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="bg-[#fc4c02] hover:bg-[#e04400] text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {joining ? t('detail.joining') : t('detail.join')}
              </button>
            )}
            <Link
              to={`/tournaments/${id}/leaderboard`}
              className="border border-[#fc4c02] text-[#fc4c02] hover:bg-orange-50 font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
            >
              {t('detail.leaderboard')}
            </Link>
          </div>
        )}

        {!(status === 'active' && user) && (
          <Link
            to={`/tournaments/${id}/leaderboard`}
            className="inline-flex border border-[#fc4c02] text-[#fc4c02] hover:bg-orange-50 font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
          >
            {t('detail.leaderboard')}
          </Link>
        )}
      </div>

      {/* Joined banner */}
      {joined && status === 'active' && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 sm:px-5 py-3 mb-6 text-sm text-green-800 font-medium">
          ✅ {t('detail.participantBanner')}
        </div>
      )}

      {/* Map */}
      <SegmentMap segments={segments} />

      {/* Segments */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{t('detail.tournamentSegments')}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{t('detail.segmentsHidden')}</p>
        </div>

        {segments.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400 text-sm">
            {t('detail.noSegments')}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {segments.map((seg, i) => (
              <div
                key={seg.id}
                className="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {seg.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {seg.distance ? `${(seg.distance / 1000).toFixed(2)} km` : ''}
                      {seg.average_grade ? ` · ${seg.average_grade}% ${t('detail.grade')}` : ''}
                    </p>
                  </div>
                </div>

                {seg.is_rated !== undefined && (
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {seg.is_rated ? (
                      <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2 py-1 rounded-full whitespace-nowrap">
                        #{seg.order_number} {t('detail.rated')}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
