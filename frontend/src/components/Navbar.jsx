import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user } = useAuth()
  const { t, i18n } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  function toggleLanguage() {
    const next = i18n.language === 'uk' ? 'en' : 'uk'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
  }

  function handleLogout(e) {
    e.preventDefault()
    fetch('/logout', { method: 'DELETE', credentials: 'include' }).then(
      () => (window.location.href = '/')
    )
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  const navLinkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-orange-50 text-[#fc4c02]'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <span className="text-xl font-black text-[#fc4c02] tracking-tight">RunCher</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          <NavLink to="/tournaments" className={navLinkClass}>
            {t('nav.tournaments')}
          </NavLink>
          {user && (
            <NavLink to="/profile" className={navLinkClass}>
              {t('nav.profile')}
            </NavLink>
          )}
          {(user?.role === 'admin' || user?.role === 'moderator') && (
            <a
              href="/admin"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Admin
            </a>
          )}
        </nav>

        {/* Desktop right */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="text-xs font-semibold text-gray-400 hover:text-gray-700 border border-gray-200 rounded-md px-2 py-1 transition-colors"
          >
            {i18n.language === 'uk' ? 'EN' : 'UA'}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              {user.profile_picture && (
                <img
                  src={user.profile_picture}
                  alt={user.full_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <span className="text-sm font-medium text-gray-700">{user.first_name}</span>
              <a
                href="/logout"
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                {t('nav.logout')}
              </a>
            </div>
          ) : (
            <a
              href="/auth/strava/login"
              className="flex items-center gap-2 bg-[#fc4c02] hover:bg-[#e04400] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <StravaIcon />
              {t('nav.login')}
            </a>
          )}
        </div>

        {/* Mobile right */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="text-xs font-semibold text-gray-400 hover:text-gray-700 border border-gray-200 rounded-md px-2 py-1 transition-colors"
          >
            {i18n.language === 'uk' ? 'EN' : 'UA'}
          </button>
          {!user && (
            <a
              href="/auth/strava/login"
              className="flex items-center gap-1.5 bg-[#fc4c02] hover:bg-[#e04400] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            >
              <StravaIcon />
              {t('nav.login')}
            </a>
          )}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          <NavLink to="/tournaments" className={navLinkClass} onClick={closeMenu}>
            {t('nav.tournaments')}
          </NavLink>
          {user && (
            <NavLink to="/profile" className={navLinkClass} onClick={closeMenu}>
              {t('nav.profile')}
            </NavLink>
          )}
          {(user?.role === 'admin' || user?.role === 'moderator') && (
            <a
              href="/admin"
              className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              onClick={closeMenu}
            >
              Admin
            </a>
          )}
          {user && (
            <div className="flex items-center gap-3 px-4 py-2 border-t border-gray-100 mt-2 pt-3">
              {user.profile_picture && (
                <img
                  src={user.profile_picture}
                  alt={user.full_name}
                  className="w-7 h-7 rounded-full object-cover"
                />
              )}
              <span className="text-sm font-medium text-gray-700 flex-1">{user.full_name}</span>
              <a
                href="/logout"
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
              >
                {t('nav.logout')}
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

function StravaIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066z" />
      <path d="M11.374 14.105l2.197-4.35-2.197-4.332L9.178 9.755z" />
    </svg>
  )
}

function IconMenu() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function IconX() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
