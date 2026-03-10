import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart2, Search, GitBranch, GitMerge, Link as LinkIcon,
  Layers, Grid, Maximize2, RefreshCw, Type, TrendingUp,
  Zap, Swords, X, LayoutDashboard
} from 'lucide-react'
import useAuthStore from '@/store/authStore'

const NAV_SECTIONS = [
  {
    label: 'General',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', authRequired: true },
      { to: '/race-mode', icon: Swords,          label: 'Race Mode',  badge: 'NEW' },
      { to: '/complexity', icon: TrendingUp,      label: 'Complexity Growth' },
    ],
  },
  {
    label: 'Algorithms',
    items: [
      { to: '/sorting',       icon: BarChart2,   label: 'Sorting',          color: '#00e5ff' },
      { to: '/searching',     icon: Search,      label: 'Searching',        color: '#00ff88' },
      { to: '/graph',         icon: GitBranch,   label: 'Graph',            color: '#a855f7' },
      { to: '/sliding-window',icon: Maximize2,   label: 'Sliding Window',   color: '#38bdf8' },
      { to: '/recursion',     icon: RefreshCw,   label: 'Recursion Tree',   color: '#818cf8' },
      { to: '/string-algo',   icon: Type,        label: 'String Algorithms',color: '#38bdf8' },
    ],
  },
  {
    label: 'Data Structures',
    items: [
      { to: '/tree',          icon: GitMerge,    label: 'Binary Search Tree', color: '#ffd700' },
      { to: '/linked-list',   icon: LinkIcon,    label: 'Linked List',        color: '#ff8c42' },
      { to: '/stack-queue',   icon: Layers,      label: 'Stack & Queue',      color: '#ec4899' },
      { to: '/dynamic-programming', icon: Grid,  label: 'Dynamic Programming',color: '#ff4757' },
    ],
  },
]

function NavItem({ item, onClick, isAuth }) {
  const Icon = item.icon
  if (item.authRequired && !isAuth) return null

  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group
         ${isActive
           ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
           : 'text-slate-400 hover:text-white hover:bg-surface-600'
         }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`flex-shrink-0 transition-colors ${isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'}`}
               style={isActive && item.color ? { color: item.color } : {}}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-accent-green/20 text-accent-green rounded">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar({ open, onClose }) {
  const { isAuthenticated } = useAuthStore()

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-400" />
          </div>
          <span className="font-display font-bold text-white">
            Algo<span className="text-primary-400">Viz</span>
          </span>
        </div>
        <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-700 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="section-label mb-2 px-3">{section.label}</p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem key={item.to} item={item} onClick={onClose} isAuth={isAuthenticated} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <p className="text-xs text-slate-600 text-center">AlgoViz v1.0.0</p>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-shrink-0 bg-surface-800 border-r border-white/5 flex-col h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-surface-800 border-r border-white/5 flex flex-col"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
