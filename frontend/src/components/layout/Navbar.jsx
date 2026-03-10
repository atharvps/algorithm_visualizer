import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, Zap, User, LogOut, Heart, LayoutDashboard, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import useAuthStore from '@/store/authStore'

export default function Navbar({ onMenuClick }) {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-surface-800/80 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-700 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center group-hover:shadow-glow-sm transition-all">
                <Zap className="w-4 h-4 text-primary-400" />
              </div>
              <span className="font-display font-bold text-lg text-white hidden sm:block">
                Algo<span className="text-primary-400">Viz</span>
              </span>
            </Link>
          </div>

          {/* Right: auth */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/favorites" className="btn-ghost hidden sm:flex items-center gap-1.5 text-sm">
                  <Heart className="w-4 h-4" /> Favorites
                </Link>
                <div className="relative" ref={dropRef}>
                  <button
                    onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-700 border border-white/10 hover:border-primary-500/30 transition-all text-sm"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
                      <span className="text-primary-400 font-bold text-xs">
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-white hidden sm:block max-w-[100px] truncate">{user?.username}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-surface-700 border border-white/10 rounded-xl shadow-card overflow-hidden z-50"
                    >
                      <Link to="/dashboard" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-300 hover:bg-surface-600 hover:text-white transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link to="/profile" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-300 hover:bg-surface-600 hover:text-white transition-colors">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <Link to="/favorites" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-300 hover:bg-surface-600 hover:text-white transition-colors">
                        <Heart className="w-4 h-4" /> Favorites
                      </Link>
                      <div className="border-t border-white/5 mt-1">
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-accent-red hover:bg-accent-red/10 transition-colors">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm hidden sm:block">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
