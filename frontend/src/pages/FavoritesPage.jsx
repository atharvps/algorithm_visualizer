import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Pin, Trash2, Search, BarChart2, GitBranch, GitMerge } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '@/utils/api'
import toast from 'react-hot-toast'

const CATEGORY_ROUTES = {
  sorting: '/sorting', searching: '/searching', graph: '/graph', tree: '/tree',
  linkedlist: '/linked-list', stackqueue: '/stack-queue', 'dynamic-programming': '/dynamic-programming',
  'sliding-window': '/sliding-window', recursion: '/recursion', string: '/string-algo', complexity: '/complexity',
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchFavorites() }, [])

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/favorites')
      setFavorites(res.data.data)
    } catch {
      toast.error('Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id) => {
    try {
      await api.delete(`/favorites/${id}`)
      setFavorites(prev => prev.filter(f => f._id !== id))
      toast.success('Removed from favorites')
    } catch { toast.error('Failed to remove') }
  }

  const togglePin = async (id) => {
    try {
      const res = await api.patch(`/favorites/${id}/pin`)
      setFavorites(prev => prev.map(f => f._id === id ? res.data.data.favorite : f))
    } catch { toast.error('Failed to toggle pin') }
  }

  const filtered = favorites.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div>
        <p className="section-label">User Library</p>
        <h1 className="font-display text-2xl font-bold text-white mt-1 flex items-center gap-2">
          <Heart className="w-6 h-6 text-accent-red fill-current" /> My Favorites
        </h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search favorites..." className="input-field pl-9" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400">{search ? 'No matching favorites' : 'No favorites yet'}</p>
          {!search && <Link to="/sorting" className="btn-primary mt-4 inline-flex">Start Exploring</Link>}
        </div>
      ) : (
        <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }}>
          {filtered.map(fav => (
            <motion.div key={fav._id}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              className="glass-card-hover p-4 border border-white/5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white font-display">{fav.name}</h3>
                  <span className="text-xs text-slate-500 capitalize">{fav.category}</span>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => togglePin(fav._id)}
                    className={`p-1.5 rounded transition-all ${fav.isPinned ? 'text-accent-yellow' : 'text-slate-600 hover:text-slate-300'}`}>
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => remove(fav._id)}
                    className="p-1.5 rounded text-slate-600 hover:text-accent-red transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {fav.timeComplexity && (
                <div className="flex flex-wrap gap-1.5">
                  {fav.timeComplexity.best  && <span className="complexity-best text-[10px]">{fav.timeComplexity.best}</span>}
                  {fav.timeComplexity.worst && <span className="complexity-worst text-[10px]">{fav.timeComplexity.worst}</span>}
                  {fav.spaceComplexity      && <span className="complexity-space text-[10px]">{fav.spaceComplexity}</span>}
                </div>
              )}
              {fav.notes && <p className="text-xs text-slate-400 line-clamp-2">{fav.notes}</p>}
              <Link to={CATEGORY_ROUTES[fav.category] || '/sorting'}
                className="mt-auto text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1">
                View Visualizer →
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
