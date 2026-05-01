import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { useApi } from '../hooks/useApi'
import { api } from '../api/client'

function fmtTime(seconds) {
  if (!seconds) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const { id } = useParams()
  const [gender, setGender] = useState('')

  const { data, loading, error } = useApi(
    () => api.getLeaderboard(id, gender),
    [id, gender]
  )

  const tournament = data
  const rankings       = data?.rankings || []
  const segmentLeaders = data?.segment_leaders || []

  return (
    <Layout>
      <div className="mb-8">
        <Link to={`/tournaments/${id}`} className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
          ← Назад до турніру
        </Link>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-black text-gray-900">🏆 Рейтинг</h1>

          {/* Gender tabs */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 gap-1">
            {[{ key: '', label: 'Всі' }, { key: 'male', label: '♂ Чоловіки' }, { key: 'female', label: '♀ Жінки' }].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setGender(key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  gender === key ? 'bg-[#fc4c02] text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && <div className="flex justify-center py-20"><Spinner /></div>}
      {error   && <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main leaderboard */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Загальний рейтинг</h2>
              </div>

              {rankings.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-400">
                  <p className="text-4xl mb-3">🏁</p>
                  <p>Ще немає результатів</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {rankings.map((p, i) => (
                    <div
                      key={p.user_id}
                      className={`flex items-center gap-4 px-6 py-4 ${i === 0 ? 'bg-orange-50/60' : ''}`}
                    >
                      <div className="w-8 text-center flex-shrink-0">
                        {i < 3 ? (
                          <span className="text-2xl">{MEDALS[i]}</span>
                        ) : (
                          <span className="text-sm font-bold text-gray-400">{p.rank}</span>
                        )}
                      </div>

                      {p.profile_picture ? (
                        <img src={p.profile_picture} alt={p.full_name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold flex-shrink-0">
                          {p.full_name[0]}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{p.full_name}</p>
                        <p className="text-xs text-gray-400">
                          {p.gender === 'female' ? '♀' : '♂'}
                          {p.completion_order && (
                            <span className="ml-2 text-green-600 font-medium">
                              ✓ фінішував #{p.completion_order}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-gray-900 text-lg">{p.overall_score.toFixed(1)}</p>
                        <p className="text-xs text-gray-400">
                          {p.total_score.toFixed(1)}
                          {p.bonus_score > 0 && (
                            <span className="text-orange-500"> +{p.bonus_score.toFixed(0)} бонус</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Segment leaders */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Лідери сегментів</h2>
                <p className="text-xs text-gray-400 mt-0.5">Рейтингові сегменти в порядку</p>
              </div>

              {segmentLeaders.length === 0 ? (
                <div className="px-5 py-8 text-center text-gray-400 text-sm">Немає даних</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {segmentLeaders.map(seg => (
                    <div key={seg.segment_id} className="px-5 py-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                          {seg.order_number}
                        </span>
                        <p className="text-sm font-medium text-gray-800 truncate">{seg.segment_name}</p>
                      </div>
                      {seg.leader ? (
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>🏅 {seg.leader.full_name}</span>
                          <span className="font-mono font-semibold text-gray-700">{fmtTime(seg.leader.elapsed_time)}</span>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">Ніхто ще не пройшов</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </Layout>
  )
}
