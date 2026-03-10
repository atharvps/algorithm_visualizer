import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, BarChart2, Search, GitBranch, GitMerge, Link as LinkIcon,
  Layers, Grid, Swords, ArrowRight, Star, Play, ChevronRight,
  TrendingUp, RefreshCw, Type, Maximize2
} from 'lucide-react'
import useAuthStore from '@/store/authStore'

const FEATURES = [
  { icon: BarChart2, label: 'Sorting',    desc: '6 algorithms with step-by-step animation',  color: '#00e5ff', to: '/sorting' },
  { icon: Search,    label: 'Searching',  desc: 'Linear & Binary search visualized',          color: '#00ff88', to: '/searching' },
  { icon: GitBranch, label: 'Graph',      desc: 'BFS, DFS, Dijkstra, Prim, Kruskal',         color: '#a855f7', to: '/graph' },
  { icon: GitMerge,  label: 'Trees',      desc: 'BST with insert, delete, traversals',        color: '#ffd700', to: '/tree' },
  { icon: LinkIcon,  label: 'Linked List',desc: 'Singly & Doubly with all operations',        color: '#ff8c42', to: '/linked-list' },
  { icon: Layers,    label: 'Stack/Queue',desc: 'Push, pop, enqueue, dequeue animations',     color: '#ec4899', to: '/stack-queue' },
  { icon: Grid,      label: 'Dynamic Prog',desc: 'Fibonacci, Knapsack, LCS, Matrix Chain',   color: '#ff4757', to: '/dynamic-programming' },
  { icon: Maximize2, label: 'Sliding Win',desc: 'Window movement and subarray animations',   color: '#38bdf8', to: '/sliding-window' },
  { icon: RefreshCw, label: 'Recursion',  desc: 'Call tree visualization with stack trace',  color: '#818cf8', to: '/recursion' },
  { icon: Type,      label: 'Strings',    desc: 'KMP pattern matching step-by-step',         color: '#38bdf8', to: '/string-algo' },
  { icon: TrendingUp,label: 'Complexity', desc: 'Big-O growth comparison charts',            color: '#00e5ff', to: '/complexity' },
  { icon: Swords,    label: 'Race Mode',  desc: 'Compare two algorithms side-by-side',       color: '#ffd700', to: '/race-mode' },
]

const STATS = [
  { value: '12+', label: 'Algorithm Categories' },
  { value: '40+', label: 'Algorithms & Data Structures' },
  { value: '2',   label: 'Code Languages' },
  { value: '∞',   label: 'Learning Potential' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
}

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen bg-surface-900 text-white overflow-x-hidden">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-surface-900/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-400" />
            </div>
            <span className="font-display font-bold text-lg">
              Algo<span className="text-primary-400">Viz</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-slate-400 hover:text-white text-sm transition-colors">Features</a>
            <a href="#algorithms" className="text-slate-400 hover:text-white text-sm transition-colors">Algorithms</a>
            <a href="#about" className="text-slate-400 hover:text-white text-sm transition-colors">About</a>
          </nav>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
                Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium mb-6">
              <Star className="w-3.5 h-3.5 fill-current" />
              Interactive Algorithm Visualizer Platform
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Visualize{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 text-glow">
                Algorithms
              </span>
              <br />in Motion
            </motion.h1>

            <motion.p variants={fadeUp} className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Step-by-step animated visualizations of 40+ algorithms and data structures.
              Watch code execute line-by-line, compare performance, and master computer science.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={isAuthenticated ? '/dashboard' : '/register'}
                    className="btn-primary text-base py-3 px-8 flex items-center gap-2 group">
                <Play className="w-4 h-4" />
                Start Visualizing
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/sorting" className="btn-secondary text-base py-3 px-8 flex items-center gap-2">
                Try Sorting Demo
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Mini visualization preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 relative max-w-4xl mx-auto"
          >
            <div className="glass-card p-6 border border-primary-500/20 shadow-glow">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-accent-red/70" />
                <div className="w-3 h-3 rounded-full bg-accent-yellow/70" />
                <div className="w-3 h-3 rounded-full bg-accent-green/70" />
                <span className="ml-2 text-slate-500 text-xs font-mono">bubble-sort.cpp — AlgoViz</span>
              </div>
              <MiniSortingPreview />
            </div>
            {/* Glow effect under card */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary-500/20 blur-xl rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/5 bg-surface-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {STATS.map((s) => (
              <motion.div key={s.label} variants={fadeUp} className="text-center">
                <div className="font-display text-4xl font-bold text-primary-400 text-glow">{s.value}</div>
                <div className="text-slate-400 text-sm mt-1">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features grid */}
      <section id="algorithms" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <p className="section-label mb-3">Explore Everything</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Every Algorithm, Visualized
              </h2>
              <p className="text-slate-400 mt-4 max-w-xl mx-auto">
                From basic sorting to complex graph traversals — watch every operation animated in real-time.
              </p>
            </motion.div>

            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {FEATURES.map((f) => {
                const Icon = f.icon
                return (
                  <motion.div key={f.label} variants={fadeUp}>
                    <Link to={f.to}
                      className="group glass-card-hover p-5 flex flex-col gap-3 h-full cursor-pointer block"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                           style={{ background: `${f.color}20`, border: `1px solid ${f.color}30` }}>
                        <Icon className="w-5 h-5" style={{ color: f.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors font-display">{f.label}</h3>
                        <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">{f.desc}</p>
                      </div>
                      <div className="mt-auto flex items-center gap-1 text-xs text-slate-600 group-hover:text-primary-400 transition-colors">
                        Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature highlights */}
      <section id="features" className="py-20 bg-surface-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid lg:grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: 'Real-time Visualization', desc: 'Watch algorithms execute step-by-step with adjustable animation speed from 0.25× to 8×.' },
              { icon: '💻', title: 'Code Sync', desc: 'See the exact line of C++ or Python being executed as the animation plays out.' },
              { icon: '🏁', title: 'Race Mode', desc: 'Compare two algorithms side-by-side with live comparisons, swaps, and execution time tracking.' },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeUp} className="glass-card p-6 border border-white/5">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-display font-semibold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
              Ready to Master<br />
              <span className="text-primary-400">Algorithms?</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 mb-8 text-lg">
              Create an account to save your progress, favorite algorithms, and custom inputs.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary text-base py-3 px-10 flex items-center gap-2">
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/sorting" className="btn-ghost text-base py-3 px-6">
                Try Without Account
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary-400" />
            <span className="font-display font-bold text-white">Algo<span className="text-primary-400">Viz</span></span>
          </div>
          <p className="text-slate-600 text-sm">Built for FAANG-level portfolio excellence</p>
        </div>
      </footer>
    </div>
  )
}

// Mini animated sorting preview
function MiniSortingPreview() {
  const bars = [65, 25, 90, 40, 75, 55, 85, 30, 70, 45, 60, 80, 35, 95, 50]
  return (
    <div className="flex items-end justify-center gap-1 h-32 px-4">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-sm"
          style={{ backgroundColor: i === 2 ? '#00e5ff' : i === 7 ? '#ffd700' : '#1d2f47' }}
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ delay: i * 0.04, duration: 0.5, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
