import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Save } from 'lucide-react'
import useAuthStore from '@/store/authStore'
import toast from 'react-hot-toast'
import api from '@/utils/api'

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore()
  const [bio, setBio] = useState(user?.bio || '')
  const [saving, setSaving] = useState(false)
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [changingPass, setChangingPass] = useState(false)

  const saveProfile = async () => {
    setSaving(true)
    await updateProfile({ bio })
    setSaving(false)
  }

  const changePassword = async () => {
    if (passForm.newPassword !== passForm.confirm) { toast.error('Passwords do not match'); return }
    setChangingPass(true)
    try {
      await api.put('/auth/password', { currentPassword: passForm.currentPassword, newPassword: passForm.newPassword })
      toast.success('Password changed')
      setPassForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
    setChangingPass(false)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="section-label">Account</p>
        <h1 className="font-display text-2xl font-bold text-white mt-1">Profile Settings</h1>
      </div>

      {/* Avatar */}
      <div className="glass-card p-6 border border-white/5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary-500/20 border-2 border-primary-500/40 flex items-center justify-center">
          <span className="font-display font-bold text-2xl text-primary-400">{user?.username?.[0]?.toUpperCase()}</span>
        </div>
        <div>
          <h2 className="font-display font-bold text-white text-lg">{user?.username}</h2>
          <p className="text-slate-400 text-sm">{user?.email}</p>
          <p className="text-slate-500 text-xs mt-0.5 capitalize">{user?.role} · Member since {new Date(user?.createdAt).getFullYear()}</p>
        </div>
      </div>

      {/* Bio */}
      <div className="glass-card p-6 border border-white/5 space-y-4">
        <h3 className="font-display font-semibold text-white">Profile Info</h3>
        <div>
          <label className="text-sm text-slate-400 mb-1.5 block">Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)}
            rows={3} maxLength={200} placeholder="Tell us about yourself..."
            className="input-field resize-none" />
          <p className="text-xs text-slate-600 mt-1">{bio.length}/200</p>
        </div>
        <button onClick={saveProfile} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          {saving ? <div className="w-4 h-4 border-2 border-surface-900 border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {/* Stats */}
      <div className="glass-card p-6 border border-white/5 space-y-4">
        <h3 className="font-display font-semibold text-white">Statistics</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Sessions', value: user?.stats?.totalSessions ?? 0 },
            { label: 'Favorites', value: user?.stats?.favoriteCount ?? 0 },
            { label: 'Visualized', value: user?.stats?.algorithmsVisualized ?? 0 },
          ].map(s => (
            <div key={s.label} className="bg-surface-800 rounded-lg p-3">
              <div className="font-display text-2xl font-bold text-primary-400">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password */}
      <div className="glass-card p-6 border border-white/5 space-y-4">
        <h3 className="font-display font-semibold text-white">Change Password</h3>
        {['currentPassword', 'newPassword', 'confirm'].map(k => (
          <div key={k}>
            <label className="text-sm text-slate-400 mb-1.5 block capitalize">
              {k === 'currentPassword' ? 'Current Password' : k === 'newPassword' ? 'New Password' : 'Confirm New Password'}
            </label>
            <input type="password" value={passForm[k]}
              onChange={e => setPassForm(p => ({ ...p, [k]: e.target.value }))}
              placeholder="••••••••" className="input-field" />
          </div>
        ))}
        <button onClick={changePassword} disabled={changingPass} className="btn-secondary flex items-center gap-2 disabled:opacity-50">
          {changingPass ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
          Update Password
        </button>
      </div>
    </div>
  )
}
