import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react'

const makeNode = (val) => ({ id: Math.random().toString(36).slice(2), val })

export default function LinkedListVisualizer() {
  const [type, setType] = useState('singly')
  const [nodes, setNodes] = useState([makeNode(10), makeNode(20), makeNode(30), makeNode(40)])
  const [input, setInput] = useState('')
  const [posInput, setPosInput] = useState('')
  const [highlighted, setHighlighted] = useState([])
  const [message, setMessage] = useState('')
  const [animating, setAnimating] = useState(false)

  const flash = (ids, msg, duration = 1800) => {
    setHighlighted(ids); setMessage(msg)
    setTimeout(() => { setHighlighted([]); setMessage('') }, duration)
  }

  const getVal = () => {
    const v = parseInt(input)
    if (isNaN(v)) { setMessage('Enter a valid number'); return null }
    return v
  }

  const insertHead = () => {
    const v = getVal(); if (v === null) return
    const n = makeNode(v)
    setNodes(prev => [n, ...prev])
    flash([n.id], `Inserted ${v} at head`)
    setInput('')
  }

  const insertTail = () => {
    const v = getVal(); if (v === null) return
    const n = makeNode(v)
    setNodes(prev => [...prev, n])
    flash([n.id], `Inserted ${v} at tail`)
    setInput('')
  }

  const insertAt = () => {
    const v = getVal(); if (v === null) return
    const pos = parseInt(posInput)
    if (isNaN(pos) || pos < 0) { setMessage('Enter valid position'); return }
    const n = makeNode(v)
    setNodes(prev => {
      const arr = [...prev]
      arr.splice(Math.min(pos, arr.length), 0, n)
      return arr
    })
    flash([n.id], `Inserted ${v} at position ${pos}`)
    setInput('')
  }

  const deleteHead = () => {
    if (!nodes.length) return
    const removed = nodes[0].val
    setNodes(prev => prev.slice(1))
    setMessage(`Deleted head: ${removed}`)
    setTimeout(() => setMessage(''), 1500)
  }

  const deleteTail = () => {
    if (!nodes.length) return
    const removed = nodes[nodes.length - 1].val
    setNodes(prev => prev.slice(0, -1))
    setMessage(`Deleted tail: ${removed}`)
    setTimeout(() => setMessage(''), 1500)
  }

  const search = () => {
    const v = getVal(); if (v === null) return
    const found = nodes.filter(n => n.val === v)
    if (found.length) flash(found.map(n => n.id), `Found ${v} at ${nodes.findIndex(n => n.val === v)} position(s)`)
    else { setMessage(`${v} not found`); setTimeout(() => setMessage(''), 1500) }
  }

  const reverse = () => {
    setNodes(prev => [...prev].reverse())
    setMessage('List reversed!')
    setTimeout(() => setMessage(''), 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="section-label">Data Structure Visualizer</p>
        <h1 className="font-display text-2xl font-bold text-white mt-1">Linked List</h1>
        <div className="flex gap-2 mt-2">
          {['singly', 'doubly'].map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize
                ${type === t ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                             : 'bg-surface-700 text-slate-400 hover:text-white border border-white/5'}`}>
              {t} Linked List
            </button>
          ))}
        </div>
      </div>

      {/* Visualization */}
      <div className="viz-container p-6 overflow-x-auto" style={{ minHeight: '180px' }}>
        <div className="flex items-center gap-0 min-w-max mx-auto">
          {/* HEAD pointer */}
          <div className="flex flex-col items-center mr-2">
            <span className="text-xs text-accent-green font-mono font-bold">HEAD</span>
            <div className="w-0.5 h-4 bg-accent-green mx-auto" />
            <ArrowRight className="w-4 h-4 text-accent-green" />
          </div>

          <AnimatePresence mode="popLayout">
            {nodes.map((node, i) => {
              const isHL = highlighted.includes(node.id)
              return (
                <motion.div key={node.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  layout
                  className="flex items-center"
                >
                  {/* Node box */}
                  <div className={`flex rounded-lg overflow-hidden border-2 transition-all duration-300
                    ${isHL ? 'border-primary-500 shadow-glow-sm' : 'border-surface-400'}`}
                    style={{ minWidth: 90 }}>
                    {/* Doubly: prev pointer */}
                    {type === 'doubly' && (
                      <div className="w-7 bg-surface-600 flex items-center justify-center border-r border-surface-400">
                        <ArrowLeft className="w-3 h-3 text-slate-500" />
                      </div>
                    )}
                    {/* Data */}
                    <div className={`flex-1 py-3 px-3 text-center font-mono font-bold text-sm
                      ${isHL ? 'bg-primary-500/20 text-primary-400' : 'bg-surface-700 text-white'}`}>
                      {node.val}
                    </div>
                    {/* Next pointer */}
                    <div className="w-7 bg-surface-600 flex items-center justify-center border-l border-surface-400">
                      {i < nodes.length - 1
                        ? <ArrowRight className="w-3 h-3 text-slate-500" />
                        : <span className="text-slate-600 text-xs">∅</span>}
                    </div>
                  </div>

                  {/* Arrow to next */}
                  {i < nodes.length - 1 && (
                    <div className="flex items-center">
                      <div className="w-5 h-0.5 bg-slate-600" />
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 -ml-1" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>

          {nodes.length === 0 && (
            <div className="text-slate-600 font-mono text-sm py-6">NULL (empty list)</div>
          )}

          {/* TAIL pointer */}
          {nodes.length > 0 && (
            <div className="flex flex-col items-center ml-2">
              <span className="text-xs text-accent-yellow font-mono font-bold">TAIL</span>
              <div className="w-0.5 h-4 bg-accent-yellow mx-auto" />
              <ArrowLeft className="w-4 h-4 text-accent-yellow" />
            </div>
          )}
        </div>
      </div>

      {/* Message */}
      {message && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass-card px-4 py-2.5 border border-primary-500/20 bg-primary-500/5">
          <p className="text-sm font-mono text-slate-300">{message}</p>
        </motion.div>
      )}

      {/* Controls */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass-card p-4 border border-white/5 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Insert</p>
          <input type="number" value={input} onChange={e => setInput(e.target.value)}
            placeholder="Value" className="input-field" />
          <div className="flex gap-2">
            <button onClick={insertHead} className="flex-1 btn-secondary text-sm py-2">Head</button>
            <button onClick={insertTail} className="flex-1 bg-primary-500/20 text-primary-400 border border-primary-500/30 rounded-lg text-sm py-2 hover:bg-primary-500/30 transition-all">Tail</button>
          </div>
          <div className="flex gap-2">
            <input type="number" value={posInput} onChange={e => setPosInput(e.target.value)}
              placeholder="Position" className="input-field flex-1 text-sm" />
            <button onClick={insertAt} className="btn-secondary text-sm px-3">At Pos</button>
          </div>
        </div>

        <div className="glass-card p-4 border border-white/5 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operations</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Del Head', fn: deleteHead, cls: 'bg-accent-red/20 text-accent-red border border-accent-red/30 hover:bg-accent-red/30' },
              { label: 'Del Tail', fn: deleteTail, cls: 'bg-accent-red/20 text-accent-red border border-accent-red/30 hover:bg-accent-red/30' },
              { label: 'Search',   fn: search,     cls: 'bg-accent-green/20 text-accent-green border border-accent-green/30 hover:bg-accent-green/30' },
              { label: 'Reverse',  fn: reverse,    cls: 'bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30 hover:bg-accent-yellow/30' },
            ].map(b => (
              <button key={b.label} onClick={b.fn}
                className={`py-2 rounded-lg text-xs font-semibold transition-all ${b.cls}`}>
                {b.label}
              </button>
            ))}
          </div>
          <button onClick={() => { setNodes([makeNode(10), makeNode(20), makeNode(30), makeNode(40)]); setHighlighted([]); setMessage('') }}
            className="w-full btn-secondary text-sm flex items-center justify-center gap-2 py-2">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        {[
          { label: 'Length', value: nodes.length, color: 'text-primary-400' },
          { label: 'Head', value: nodes[0]?.val ?? 'NULL', color: 'text-accent-green' },
          { label: 'Tail', value: nodes[nodes.length - 1]?.val ?? 'NULL', color: 'text-accent-yellow' },
          { label: 'Type', value: type === 'singly' ? 'Singly' : 'Doubly', color: 'text-orange-400' },
        ].map(s => (
          <div key={s.label} className="glass-card px-3 py-3 border border-white/5">
            <div className={`font-display text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
