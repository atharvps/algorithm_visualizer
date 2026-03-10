import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Zap, UserPlus } from 'lucide-react'
import useAuthStore from '@/store/authStore'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuthStore()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.username || form.username.length < 3) e.username = 'Username must be at least 3 characters'
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) e.username = 'Letters, numbers, underscores only'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.password || form.password.length < 8) e.password = 'Min 8 characters'
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) e.password = 'Need uppercase, lowercase & number'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const result = await register({ username: form.username, email: form.email, password: form.password })
    if (result.success) navigate('/dashboard')
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-400" />
            </div>
            <span className="font-display font-bold text-xl text-white">Algo<span className="text-primary-400">Viz</span></span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white">Create account</h1>
          <p className="text-slate-400 mt-1 text-sm">Start mastering algorithms today</p>
        </div>

        <div className="glass-card p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'username', label: 'Username', placeholder: 'cool_coder42', type: 'text' },
              { key: 'email',    label: 'Email',    placeholder: 'you@example.com', type: 'email' },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
                <input type={type} value={form[key]} onChange={set(key)} placeholder={placeholder}
                  className={`input-field ${errors[key] ? 'border-accent-red/50' : ''}`} />
                {errors[key] && <p className="text-accent-red text-xs mt-1">{errors[key]}</p>}
              </div>
            ))}

            {['password', 'confirm'].map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {key === 'password' ? 'Password' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form[key]}
                    onChange={set(key)}
                    placeholder="••••••••"
                    className={`input-field pr-10 ${errors[key] ? 'border-accent-red/50' : ''}`}
                  />
                  {key === 'password' && (
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                {errors[key] && <p className="text-accent-red text-xs mt-1">{errors[key]}</p>}
              </div>
            ))}

            <button type="submit" disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading
                ? <div className="w-4 h-4 border-2 border-surface-900 border-t-transparent rounded-full animate-spin" />
                : <><UserPlus className="w-4 h-4" /> Create Account</>
              }
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
