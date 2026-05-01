import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../api/client'

const STATUS_LABELS = { draft: 'Чернетка', active: 'Активний', completed: 'Завершено' }
const STATUS_COLORS = { draft: 'bg-gray-100 text-gray-600', active: 'bg-green-100 text-green-700', completed: 'bg-blue-100 text-blue-700' }

export default function TournamentDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: tournament, loading, error, setData } = useApi(() => api.getTournament(id), [id])
  const [joining, setJoining] = useState(false)
  const [syncing, setSyncing] = useState(false)

  async function handleJoin() {
    if (!user) return navigate('/login')
    setJoining(true)
    try {
      await api.joinTournament(id)
      setData(t => ({ ...t, joined: true, participants_count: t.participants_count + 1 }))
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
      setData(t => ({ ...t, joined: false, participants_count: t.participants_count - 1 }))
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
      alert(res.message)
    } catch (e) {
      alert(e.message)
    } finally {
      setSyncing(false)
    }
  }

  if (loading) return <Layout><div className="flex justify-center py-20"><Spinner /></div></Layout>
  if (error)   return <Layout><div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">{error}</div></Layout>
  if (!tournament) return null

  const { name, description, status, starts_at, ends_at, total_segments_count, rated_segments_count, participants_count, joined, segments = [] } = tournament

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <Link to="/tournaments" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">← Всі турніри</Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-gray-900">{name}</h1>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[status]}`}>
                {STATUS_LABELS[status]}
              </span>
            </div>
            {description && <p className="text-gray-500">{description}</p>}
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span>📍 {total_segments_count} сегментів</span>
              <span>🏆 {rated_segments_count} рейтингових</span>
              <span>👥 {participants_count} учасників</span>
              {starts_at && <span>📅 {new Date(starts_at).toLocaleDateString('uk-UA')}</span>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {status === 'active' && user && (
              <>
                {joined ? (
                  <>
                    <button
                      onClick={handleSync}
                      disabled={syncing}
                      className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {syncing ? <Spinner className="h-4 w-4" /> : '🔄'} Синхронізувати Strava
                    </button>
                    <button
                      onClick={handleLeave}
                      disabled={joining}
                      className="text-sm text-red-500 hover:text-red-700 border border-red-200 px-4 py-2 rounded-xl transition-colors"
                    >
                      Вийти з турніру
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleJoin}
                    disabled={joining}
                    className="bg-[#fc4c02] hover:bg-[#e04400] text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {joining ? 'Приєднання...' : 'Приєднатися'}
                  </button>
                )}
              </>
            )}

            <Link
              to={`/tournaments/${id}/leaderboard`}
              className="border border-[#fc4c02] text-[#fc4c02] hover:bg-orange-50 font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
            >
              🏆 Рейтинг
            </Link>
          </div>
        </div>
      </div>

      {/* Joined banner */}
      {joined && status === 'active' && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 mb-6 text-sm text-green-800 font-medium flex items-center gap-2">
          ✅ Ви берете участь у цьому турнірі. Бігайте по сегментах і синхронізуйте активності зі Strava.
        </div>
      )}

      {/* Segments */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Сегменти турніру</h2>
          <p className="text-xs text-gray-400 mt-0.5">Рейтингові сегменти та їх порядок — прихований до рейтингу</p>
        </div>

        {segments.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400 text-sm">Сегменти ще не додані</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {segments.map((seg, i) => (
              <div key={seg.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{seg.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {seg.distance ? `${(seg.distance / 1000).toFixed(2)} km` : ''}
                      {seg.average_grade ? ` · ${seg.average_grade}% ухил` : ''}
                    </p>
                  </div>
                </div>

                {/* is_rated / order_number only visible to moderators */}
                {seg.is_rated !== undefined && (
                  <div className="flex items-center gap-2">
                    {seg.is_rated ? (
                      <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2.5 py-1 rounded-full">
                        #{seg.order_number} рейтинг.
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
