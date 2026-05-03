import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { stravaLoginUrl } from '../api/client'

export default function Home() {
  const { user } = useAuth()
  const { t, i18n } = useTranslation()

  function toggleLanguage() {
    const next = i18n.language === 'uk' ? 'en' : 'uk'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
  }

  const steps = [
    { step: '01', icon: '🗺️', title: t('home.step1Title'), desc: t('home.step1Desc') },
    { step: '02', icon: '🏃', title: t('home.step2Title'), desc: t('home.step2Desc') },
    { step: '03', icon: '🏆', title: t('home.step3Title'), desc: t('home.step3Desc') },
  ]

  const places = [
    {
      place: t('home.place1'),
      formula: 'N × 10',
      ex: `20 ${t('home.participants')} = 200 ${t('home.bonusPoints')}`,
    },
    {
      place: t('home.place2'),
      formula: 'N × 9',
      ex: `20 ${t('home.participants')} = 180 ${t('home.bonusPoints')}`,
    },
    {
      place: t('home.place3'),
      formula: 'N × 8',
      ex: `20 ${t('home.participants')} = 160 ${t('home.bonusPoints')}`,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#fc4c02] blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-orange-400 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-16 sm:py-24 lg:py-36 text-center">
          <button
            onClick={toggleLanguage}
            className="absolute top-4 right-6 text-xs font-semibold text-white/50 hover:text-white border border-white/20 hover:border-white/40 rounded-md px-2.5 py-1 transition-colors backdrop-blur-sm"
          >
            {i18n.language === 'uk' ? 'EN' : 'UA'}
          </button>

          <div className="inline-flex items-center gap-2 bg-white/10 text-orange-300 text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            🏃 Черкаси · Strava Segments
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight mb-6">
            Run<span className="text-[#fc4c02]">Cher</span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            {t('home.tagline')}
          </p>

          {user ? (
            <Link
              to="/tournaments"
              className="inline-flex items-center gap-2 bg-[#fc4c02] hover:bg-[#e04400] text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-2xl transition-colors shadow-lg shadow-orange-900/30"
            >
              {t('home.viewTournaments')}
            </Link>
          ) : (
            <a
              href={stravaLoginUrl()}
              className="inline-flex items-center gap-3 bg-[#fc4c02] hover:bg-[#e04400] text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-2xl transition-colors shadow-lg shadow-orange-900/30"
            >
              <StravaIcon size={22} />
              {t('home.loginWithStrava')}
            </a>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 text-center mb-10 sm:mb-14">
          {t('home.howItWorks')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {steps.map(({ step, icon, title, desc }) => (
            <div key={step} className="relative">
              <div className="text-6xl font-black text-gray-100 absolute -top-4 -left-2 select-none">
                {step}
              </div>
              <div className="relative bg-white rounded-2xl border border-gray-200 p-6">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scoring */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-10 sm:mb-14">
            {t('home.scoringTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <div className="bg-slate-800 rounded-2xl p-6 sm:p-8 text-center mb-4 sm:mb-6">
                <p className="text-slate-400 text-sm mb-3">{t('home.perSegment')}</p>
                <p className="text-2xl sm:text-3xl font-mono font-bold text-[#fc4c02]">
                  (T<sub>leader</sub> / T<sub>you</sub>) × 100
                </p>
                <p className="text-slate-400 text-sm mt-3">{t('home.genderSplit')}</p>
              </div>
              <div className="bg-slate-800 rounded-2xl p-6 sm:p-8 text-center">
                <p className="text-slate-400 text-sm mb-3">{t('home.completionBonus')}</p>
                <p className="text-2xl sm:text-3xl font-mono font-bold text-green-400">
                  N × (11 − place)
                </p>
                <p className="text-slate-400 text-sm mt-3">{t('home.first10')}</p>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {places.map(({ place, formula, ex }) => (
                <div
                  key={place}
                  className="bg-slate-800 rounded-xl p-4 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="font-semibold">{place}</p>
                    <p className="text-slate-400 text-xs mt-0.5 truncate">{ex}</p>
                  </div>
                  <span className="text-[#fc4c02] font-mono font-bold text-sm shrink-0">
                    {formula}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">
            {t('home.readyToStart')}
          </h2>
          <p className="text-gray-500 mb-8">{t('home.loginCta')}</p>
          <a
            href={stravaLoginUrl()}
            className="inline-flex items-center gap-3 bg-[#fc4c02] hover:bg-[#e04400] text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-2xl transition-colors"
          >
            <StravaIcon size={22} />
            {t('home.loginWithStrava')}
          </a>
        </section>
      )}

      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <span>© {new Date().getFullYear()} RunCher</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
            <a href="https://www.strava.com" target="_blank" rel="noreferrer" className="hover:text-gray-600 transition-colors">
              Powered by Strava
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function StravaIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066z" />
      <path d="M11.374 14.105l2.197-4.35-2.197-4.332L9.178 9.755z" />
    </svg>
  )
}
