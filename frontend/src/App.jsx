import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Spinner from './components/Spinner'

import Home from './pages/Home'
import Tournaments from './pages/Tournaments'
import TournamentDetail from './pages/TournamentDetail'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'

export default function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner className="h-10 w-10" />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tournaments" element={<Tournaments />} />
      <Route path="/tournaments/:id" element={<TournamentDetail />} />
      <Route path="/tournaments/:id/leaderboard" element={<Leaderboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />
      {/* Catch auth redirect back from Strava */}
      <Route path="/auth/strava/callback" element={<OAuthCallback />} />
    </Routes>
  )
}

function OAuthCallback() {
  // Strava redirects here → Rails sessions#create processes it (via Vite proxy),
  // then Rails redirects browser to /  — this component is just a fallback.
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Spinner className="h-10 w-10" />
    </div>
  )
}
