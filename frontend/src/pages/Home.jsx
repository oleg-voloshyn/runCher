import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { stravaLoginUrl } from '../api/client'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#fc4c02] blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-orange-400 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 sm:py-36 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-orange-300 text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            🏃 Черкаси · Strava Segments
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight mb-6">
            Run<span className="text-[#fc4c02]">Cher</span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Змагайся з друзями на сегментах Strava. Знаходь рейтингові сегменти, набирай бали, ставай першим.
          </p>

          {user ? (
            <Link
              to="/tournaments"
              className="inline-flex items-center gap-2 bg-[#fc4c02] hover:bg-[#e04400] text-white font-bold text-lg px-8 py-4 rounded-2xl transition-colors shadow-lg shadow-orange-900/30"
            >
              Дивитись турніри →
            </Link>
          ) : (
            <a
              href={stravaLoginUrl()}
              className="inline-flex items-center gap-3 bg-[#fc4c02] hover:bg-[#e04400] text-white font-bold text-lg px-8 py-4 rounded-2xl transition-colors shadow-lg shadow-orange-900/30"
            >
              <StravaIcon size={24} />
              Увійти через Strava
            </a>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-14">Як це працює</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { step: '01', icon: '🗺️', title: 'Адмін створює турнір', desc: 'Обирає 20 сегментів, 10 з яких рейтингові — але ти не знаєш які.' },
            { step: '02', icon: '🏃', title: 'Ти бігаєш і записуєш', desc: 'Записуй тренування в Strava. Ми автоматично перевіряємо покриття сегментів.' },
            { step: '03', icon: '🏆', title: 'Набирай бали', desc: 'Бали = час лідера / твій час × 100. Перший хто пройде всі рейтингові сегменти — отримує бонус.' },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="relative">
              <div className="text-6xl font-black text-gray-100 absolute -top-4 -left-2 select-none">{step}</div>
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
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-black text-center mb-14">Формула балів</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <div className="bg-slate-800 rounded-2xl p-8 text-center mb-6">
                <p className="text-slate-400 text-sm mb-3">За кожен сегмент</p>
                <p className="text-3xl font-mono font-bold text-[#fc4c02]">
                  (T<sub>лідер</sub> / T<sub>твій</sub>) × 100
                </p>
                <p className="text-slate-400 text-sm mt-3">Окремо для чоловіків і жінок</p>
              </div>
              <div className="bg-slate-800 rounded-2xl p-8 text-center">
                <p className="text-slate-400 text-sm mb-3">Бонус за завершення</p>
                <p className="text-3xl font-mono font-bold text-green-400">
                  N × (11 − місце)
                </p>
                <p className="text-slate-400 text-sm mt-3">Для перших 10 хто пройшов усі рейтингові сегменти</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { place: '🥇 1 місце', formula: 'N × 10 балів', ex: '20 учасників = 200 бонусних балів' },
                { place: '🥈 2 місце', formula: 'N × 9 балів',  ex: '20 учасників = 180 бонусних балів' },
                { place: '🥉 3 місце', formula: 'N × 8 балів',  ex: '20 учасників = 160 бонусних балів' },
              ].map(({ place, formula, ex }) => (
                <div key={place} className="bg-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{place}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{ex}</p>
                  </div>
                  <span className="text-[#fc4c02] font-mono font-bold text-sm">{formula}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Готовий до старту?</h2>
          <p className="text-gray-500 mb-8">Увійди через Strava і приєднуйся до турнірів</p>
          <a
            href={stravaLoginUrl()}
            className="inline-flex items-center gap-3 bg-[#fc4c02] hover:bg-[#e04400] text-white font-bold text-lg px-8 py-4 rounded-2xl transition-colors"
          >
            <StravaIcon size={22} />
            Увійти через Strava
          </a>
        </section>
      )}

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        RunCher © {new Date().getFullYear()} · Черкаси, Україна
      </footer>
    </div>
  )
}

function StravaIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066z"/>
      <path d="M11.374 14.105l2.197-4.35-2.197-4.332L9.178 9.755z"/>
    </svg>
  )
}
