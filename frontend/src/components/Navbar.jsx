import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-black text-[#fc4c02] tracking-tight">RunCher</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          <NavLink
            to="/tournaments"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-orange-50 text-[#fc4c02]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
            }
          >
            Турніри
          </NavLink>
          {user && (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-orange-50 text-[#fc4c02]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
              }
            >
              Профіль
            </NavLink>
          )}
          {(user?.role === 'admin' || user?.role === 'moderator') && (
            <a
              href={`${import.meta.env.VITE_RAILS_URL || 'http://localhost:3000'}/admin`}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Admin
            </a>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {user.profile_picture && (
                <img src={user.profile_picture} alt={user.full_name} className="w-8 h-8 rounded-full object-cover" />
              )}
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.first_name}</span>
              <a
                href="/logout"
                data-method="delete"
                onClick={e => {
                  e.preventDefault()
                  fetch('/logout', { method: 'DELETE', credentials: 'include' })
                    .then(() => window.location.href = '/')
                }}
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                Вийти
              </a>
            </div>
          ) : (
            <a
              href="/auth/strava/login"
              className="flex items-center gap-2 bg-[#fc4c02] hover:bg-[#e04400] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <StravaIcon />
              Увійти
            </a>
          )}
        </div>

      </div>
    </header>
  )
}

function StravaIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066z"/>
      <path d="M11.374 14.105l2.197-4.35-2.197-4.332L9.178 9.755z"/>
    </svg>
  )
}
