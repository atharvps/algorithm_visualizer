import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'

export default function CodePanel({ lines = [], language = 'cpp', onLangChange, activeLines = [], algoName }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass-card border border-white/5 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-accent-red/60" />
            <div className="w-3 h-3 rounded-full bg-accent-yellow/60" />
            <div className="w-3 h-3 rounded-full bg-accent-green/60" />
          </div>
          <span className="text-xs text-slate-500 font-mono ml-1">
            {algoName?.toLowerCase().replace(/\s/g, '-')}.{language === 'cpp' ? 'cpp' : 'py'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            {['cpp', 'python'].map((lang) => (
              <button key={lang} onClick={() => onLangChange?.(lang)}
                className={`px-2.5 py-1 text-xs font-mono font-medium transition-colors
                  ${language === lang ? 'bg-primary-500/20 text-primary-400' : 'text-slate-500 hover:text-white'}`}>
                {lang === 'cpp' ? 'C++' : 'Python'}
              </button>
            ))}
          </div>
          <button onClick={handleCopy}
            className="p-1.5 rounded text-slate-500 hover:text-white hover:bg-white/5 transition-all">
            {copied ? <Check className="w-3.5 h-3.5 text-accent-green" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Code content */}
      <div className="flex-1 overflow-auto p-4">
        <pre className="font-mono text-xs leading-relaxed">
          {lines.map((line, i) => (
            <motion.div key={i}
              className={`flex rounded px-2 py-0.5 -mx-2 ${activeLines.includes(i) ? 'code-line-active' : ''}`}
              animate={activeLines.includes(i) ? { backgroundColor: '#00e5ff15' } : {}}>
              <span className="text-slate-600 select-none w-6 flex-shrink-0 text-right mr-4">{i + 1}</span>
              <span className={activeLines.includes(i) ? 'text-primary-300' : 'text-slate-300'}>
                {line || ' '}
              </span>
            </motion.div>
          ))}
        </pre>
      </div>
    </div>
  )
}
