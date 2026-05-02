import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-600',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
}

export default function TournamentCard({ tournament }) {
  const { t, i18n } = useTranslation()
  const {
    id,
    name,
    description,
    status,
    starts_at,
    ends_at,
    total_segments_count,
    rated_segments_count,
    participants_count,
    joined,
  } = tournament
  const locale = i18n.language === 'uk' ? 'uk-UA' : 'en-GB'

  return (
    <Link
      to={`/tournaments/${id}`}
      className="block bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:shadow-md hover:border-orange-200 transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-[#fc4c02] transition-colors">
          {name}
        </h3>
        <span
          className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[status]}`}
        >
          {t(`status.${status}`)}
        </span>
      </div>

      {description && <p className="text-sm text-gray-500 mb-4 line-clamp-2">{description}</p>}

      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
        <span>
          📍 {total_segments_count} {t('card.segments')}
        </span>
        <span>
          🏆 {rated_segments_count} {t('card.rated')}
        </span>
        <span>👥 {participants_count}</span>
      </div>

      {(starts_at || ends_at) && (
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
          {starts_at && <span>{new Date(starts_at).toLocaleDateString(locale)}</span>}
          {starts_at && ends_at && <span> — </span>}
          {ends_at && <span>{new Date(ends_at).toLocaleDateString(locale)}</span>}
        </div>
      )}

      {joined && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-[#fc4c02] font-semibold">
          <span>✓</span> {t('card.joined')}
        </div>
      )}
    </Link>
  )
}
