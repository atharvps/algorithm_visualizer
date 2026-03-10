import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart2, Search, GitBranch, GitMerge, Link as LinkIcon, Layers, Grid, Maximize2, RefreshCw, Type, TrendingUp, Swords, ArrowRight, Heart, BookOpen } from 'lucide-react'
import useAuthStore from '@/store/authStore'

const CATEGORIES = [
  { to: '/sorting',       icon: BarChart2, label: 'Sorting',          color: '#00e5ff', count: '6 algos' },
  { to: '/searching',     icon: Search,    label: 'Searching',         color: '#00ff88', count: '2 algos' },
  { to: '/graph',         icon: GitBranch, label: 'Graph',             color: '#a855f7', count: '5 algos' },
  { to: '/tree',          icon: GitMerge,  label: 'BST',               color: '#ffd700', count: '1 DS' },
  { to: '/linked-list',   icon: LinkIcon,  label: 'Linked List',       color: '#ff8c42', count: '2 DS' },
  { to: '/stack-queue',   icon: Layers,    label: 'Stack & Queue',     color: '#ec4899', count: '2 DS' },
  { to: '/dynamic-programming', icon: Grid, label: 'DP',              color: '#ff4757', count: '3 algos' },
  { to: '/sliding-window',icon: Maximize2, label: 'Sliding Window',    color: '#38bdf8', count: '2 algos' },
  { to: '/recursion',     icon: RefreshCw, label: 'Recursion',         color: '#818cf8', count: '3 trees' },
  { to: '/string-algo',   icon: Type,      label: 'String',            color: '#38bdf8', count: '1 algo' },
  { to: '/complexity',    icon: TrendingUp,label: 'Complexity',         color: '#00e5ff', count: 'Charts' },
  { to: '/race-mode',     icon: Swords,    label: 'Race Mode',         color: '#ffd700', count: 'Compare' },
]

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="section-label">Dashboard</p>
        <h1 className="font-display text-3xl font-bold text-white mt-1">
          Welcome back, <span className="text-primary-400">{user?.username}</span> 👋
        </h1>
        <p className="text-slate-400 mt-2">Pick an algorithm and start visualizing</p>
      </motion.div>

      {/* Quick stats */}
      <motion.div initial="hidden" animate="show" variants={stagger}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Sessions', value: user?.stats?.totalSessions ?? 0, color: 'text-primary-400' },
          { label: 'Favorites', value: user?.stats?.favoriteCount ?? 0, color: 'text-accent-yellow' },
          { label: 'Visualized', value: user?.stats?.algorithmsVisualized ?? 0, color: 'text-accent-green' },
          { label: 'Available', value: '40+', color: 'text-purple-400' },
        ].map(s => (
          <motion.div key={s.label} variants={fadeUp} className="glass-card p-4 border border-white/5 text-center">
            <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/favorites" className="btn-secondary flex items-center gap-2 text-sm">
          <Heart className="w-4 h-4 text-accent-red" /> My Favorites
        </Link>
        <Link to="/race-mode" className="btn-secondary flex items-center gap-2 text-sm">
          <Swords className="w-4 h-4 text-accent-yellow" /> Race Mode
        </Link>
        <Link to="/complexity" className="btn-secondary flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-primary-400" /> Complexity Charts
        </Link>
      </div>

      {/* Categories grid */}
      <div>
        <h2 className="font-display text-lg font-semibold text-white mb-4">All Categories</h2>
        <motion.div initial="hidden" animate="show" variants={stagger}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            return (
              <motion.div key={cat.to} variants={fadeUp}>
                <Link to={cat.to}
                  className="glass-card-hover p-4 flex flex-col gap-2 group block h-full">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
                         style={{ background: `${cat.color}20`, border: `1px solid ${cat.color}30` }}>
                      <Icon className="w-4 h-4" style={{ color: cat.color }} />
                    </div>
                    <span className="text-xs text-slate-600">{cat.count}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm group-hover:text-primary-400 transition-colors font-display">{cat.label}</h3>
                  </div>
                  <div className="mt-auto flex items-center gap-1 text-xs text-slate-600 group-hover:text-primary-400 transition-colors">
                    Open <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
