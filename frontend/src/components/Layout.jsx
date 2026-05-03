import { Link } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">{children}</main>
      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <span>© {new Date().getFullYear()} RunCher</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-gray-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-gray-600 transition-colors">
              Terms of Service
            </Link>
            <a
              href="https://www.strava.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              Powered by Strava
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
