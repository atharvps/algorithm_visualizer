import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

const makeEl = (val) => ({ id: Math.random().toString(36).slice(2), val })

function StackViz({ items, highlight }) {
  return (
    <div className="flex flex-col items-center gap-1 min-h-64">
      <div className="text-xs text-slate-500 mb-2 font-mono">TOP ▼</div>
      <AnimatePresence mode="popLayout">
        {[...items].reverse().map((item, i) => {
          const isTop = i === 0
          const isHL = highlight === item.id
          return (
            <motion.div key={item.id}
              initial={{ opacity: 0, y: -30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.8 }}
              layout
              className={`w-36 py-3 rounded-lg text-center font-mono font-bold text-sm border-2 transition-all
                ${isHL ? 'border-primary-500 bg-primary-500/20 text-primary-300 shadow-glow-sm'
                       : isTop ? 'border-accent-yellow/60 bg-accent-yellow/10 text-accent-yellow'
                               : 'border-surface-400 bg-surface-700 text-white'}`}>
              {item.val}
              {isTop && <span className="ml-1 text-xs text-accent-yellow opacity-70">← top</span>}
            </motion.div>
          )
        })}
      </AnimatePresence>
      {items.length === 0 && (
        <div className="w-36 py-3 rounded-lg border-2 border-dashed border-surface-400 text-center text-slate-600 text-sm">empty</div>
      )}
      <div className="w-36 h-1.5 bg-surface-500 rounded mt-1" />
      <div className="text-xs text-slate-600 font-mono">BOTTOM</div>
    </div>
  )
}

function QueueViz({ items, highlight }) {
  return (
    <div className="overflow-x-auto py-4">
      <div className="flex items-center gap-1 min-w-max mx-auto">
        <div className="text-xs text-accent-green font-mono font-bold mr-2">FRONT →</div>
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => {
            const isFront = i === 0
            const isBack = i === items.length - 1
            const isHL = highlight === item.id
            return (
              <motion.div key={item.id}
                initial={{ opacity: 0, x: 40, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.8 }}
                layout
                className={`w-16 py-4 rounded-lg text-center font-mono font-bold text-sm border-2 transition-all
                  ${isHL ? 'border-primary-500 bg-primary-500/20 text-primary-300 shadow-glow-sm'
                         : isFront ? 'border-accent-green/60 bg-accent-green/10 text-accent-green'
                                   : isBack ? 'border-pink-500/60 bg-pink-500/10 text-pink-400'
                                            : 'border-surface-400 bg-surface-700 text-white'}`}>
                {item.val}
                {isFront && <div className="text-xs opacity-70 mt-0.5">front</div>}
                {isBack && !isFront && <div className="text-xs opacity-70 mt-0.5">back</div>}
              </motion.div>
            )
          })}
        </AnimatePresence>
        {items.length === 0 && (
          <div className="w-20 py-4 rounded-lg border-2 border-dashed border-surface-400 text-center text-slate-600 text-sm">empty</div>
        )}
        <div className="text-xs text-pink-400 font-mono font-bold ml-2">← BACK</div>
      </div>
    </div>
  )
}

export default function StackQueueVisualizer() {
  const [mode, setMode] = useState('stack')
  const [items, setItems] = useState([makeEl(10), makeEl(20), makeEl(30)])
  const [input, setInput] = useState('')
  const [highlight, setHighlight] = useState(null)
  const [message, setMessage] = useState('')
  const [peekVal, setPeekVal] = useState(null)

  const flash = (id, msg) => {
    setHighlight(id); setMessage(msg)
    setTimeout(() => { setHighlight(null); setMessage('') }, 1500)
  }

  const push = () => {
    const v = parseInt(input); if (isNaN(v)) return
    const el = makeEl(v)
    setItems(prev => [...prev, el])
    flash(el.id, `${mode === 'stack' ? 'Push' : 'Enqueue'} ${v}`)
    setInput('')
    setPeekVal(null)
  }

  const pop = () => {
    if (!items.length) { setMessage('Empty!'); setTimeout(() => setMessage(''), 1000); return }
    if (mode === 'stack') {
      const top = items[items.length - 1]
      flash(top.id, `Pop: removed ${top.val}`)
      setTimeout(() => setItems(prev => prev.slice(0, -1)), 400)
    } else {
      const front = items[0]
      flash(front.id, `Dequeue: removed ${front.val}`)
      setTimeout(() => setItems(prev => prev.slice(1)), 400)
    }
    setPeekVal(null)
  }

  const peek = () => {
    if (!items.length) { setMessage('Empty!'); setTimeout(() => setMessage(''), 1000); return }
    const el = mode === 'stack' ? items[items.length - 1] : items[0]
    setPeekVal(el.val)
    flash(el.id, `Peek: top is ${el.val}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="section-label">Data Structure Visualizer</p>
        <h1 className="font-display text-2xl font-bold text-white mt-1">Stack & Queue</h1>
        <div className="flex gap-2 mt-2">
          {['stack', 'queue'].map(m => (
            <button key={m} onClick={() => { setMode(m); setItems([makeEl(10), makeEl(20), makeEl(30)]); setMessage(''); setPeekVal(null) }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize
                ${mode === m ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                             : 'bg-surface-700 text-slate-400 hover:text-white border border-white/5'}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Visualization */}
        <div className="viz-container p-6 flex items-center justify-center" style={{ minHeight: '320px' }}>
          {mode === 'stack'
            ? <StackViz items={items} highlight={highlight} />
            : <QueueViz items={items} highlight={highlight} />
          }
        </div>

        {/* Controls + info */}
        <div className="space-y-4">
          {/* Complexity */}
          <div className="glass-card p-4 border border-white/5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Complexity</p>
            <div className="flex flex-wrap gap-2">
              <span className="complexity-best">Push/Pop: O(1)</span>
              <span className="complexity-space">Space: O(n)</span>
            </div>
          </div>

          {/* Operation */}
          <div className="glass-card p-4 border border-white/5 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operations</p>
            <input type="number" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && push()}
              placeholder={mode === 'stack' ? 'Value to push...' : 'Value to enqueue...'} className="input-field" />
            <div className="grid grid-cols-3 gap-2">
              <button onClick={push} className="py-2.5 rounded-lg text-sm font-semibold bg-primary-500/20 text-primary-400 border border-primary-500/30 hover:bg-primary-500/30 transition-all">
                {mode === 'stack' ? 'Push' : 'Enqueue'}
              </button>
              <button onClick={pop} className="py-2.5 rounded-lg text-sm font-semibold bg-accent-red/20 text-accent-red border border-accent-red/30 hover:bg-accent-red/30 transition-all">
                {mode === 'stack' ? 'Pop' : 'Dequeue'}
              </button>
              <button onClick={peek} className="py-2.5 rounded-lg text-sm font-semibold bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30 hover:bg-accent-yellow/30 transition-all">
                Peek
              </button>
            </div>
            <button onClick={() => { setItems([makeEl(10), makeEl(20), makeEl(30)]); setMessage(''); setPeekVal(null) }}
              className="w-full btn-secondary text-sm flex items-center justify-center gap-2 py-2">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Size', value: items.length, color: 'text-primary-400' },
              { label: mode === 'stack' ? 'Top' : 'Front',
                value: items.length ? (mode === 'stack' ? items[items.length-1].val : items[0].val) : 'NULL',
                color: 'text-accent-yellow' },
            ].map(s => (
              <div key={s.label} className="glass-card px-3 py-3 border border-white/5 text-center">
                <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {(message || peekVal !== null) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass-card px-4 py-3 border border-primary-500/20 bg-primary-500/5">
              <p className="text-sm font-mono text-slate-300">{message}</p>
              {peekVal !== null && <p className="text-primary-400 font-mono font-bold text-lg mt-1">{peekVal}</p>}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
