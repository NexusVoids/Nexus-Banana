import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

function getLocalUserId() {
  let id = localStorage.getItem('nexus_local_uid');
  if (!id) {
    id = 'local_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('nexus_local_uid', id);
  }
  return id;
}

export default function AccountOnboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [realName, setRealName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setAvatarUrl(file_url);
    setUploading(false);
  };

  const handleCreate = async () => {
    if (!username.trim() || !realName.trim()) return;
    setSaving(true);
    setError('');

    const localId = getLocalUserId();
    const identifier = `anon_${localId}`;

    const existing = await base44.entities.UserProfile.filter({ user_email: identifier }, '-created_date', 1);

    // Secret Founder check — real name "Adam" gets Founder role
    const isFounder = realName.trim().toLowerCase() === 'adam';
    const assignedRoles = isFounder ? ['Founder'] : ['Member'];

    const data = {
      username: username.trim(),
      real_name: realName.trim(),
      user_email: identifier,
      bio,
      avatar_url: avatarUrl,
      roles: assignedRoles,
      badges: [],
      warnings: [],
      banan_bucks: isFounder ? 999999 : 0,
      message_count: 0
    };

    if (existing[0]) {
      await base44.entities.UserProfile.update(existing[0].id, { username: username.trim(), real_name: realName.trim(), bio, avatar_url: avatarUrl, roles: assignedRoles });
    } else {
      await base44.entities.UserProfile.create(data);
    }

    if (isFounder) {
      localStorage.setItem('aprCodeActive', 'true');
      localStorage.setItem('infiniteBananBucks', 'true');
    }
    localStorage.setItem('onboardingComplete_' + localId, 'true');
    setSaving(false);
    onComplete(identifier);
  };

  const steps = [
    {
      title: 'Welcome to NexusBanan! 🍌',
      subtitle: 'Choose a username — this is how others will see you',
      content: (
        <div className="space-y-4 w-full max-w-sm mx-auto">
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Your username..."
            maxLength={32}
            autoFocus
            onKeyDown={e => e.key === 'Enter' && username.trim() && setStep(1)}
            className="w-full bg-[#1e1e2e] border border-white/20 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-yellow-500"
          />
          <p className="text-white/30 text-sm text-center">{username.length}/32 characters</p>
          <button
            onClick={() => setStep(1)}
            disabled={!username.trim()}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl disabled:opacity-40 hover:opacity-90 text-lg"
          >
            Next →
          </button>
        </div>
      )
    },
    {
      title: 'Your Real Name',
      subtitle: 'First and last name — only staff can see this',
      content: (
        <div className="space-y-4 w-full max-w-sm mx-auto">
          <input
            value={realName}
            onChange={e => setRealName(e.target.value)}
            placeholder="e.g. John Smith"
            maxLength={64}
            autoFocus
            onKeyDown={e => e.key === 'Enter' && realName.trim() && setStep(2)}
            className="w-full bg-[#1e1e2e] border border-white/20 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-yellow-500"
          />
          <p className="text-white/30 text-xs text-center">This won't be shown publicly — staff use it for verification.</p>
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20">← Back</button>
            <button
              onClick={() => setStep(2)}
              disabled={!realName.trim()}
              className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl disabled:opacity-40 hover:opacity-90"
            >
              Next →
            </button>
          </div>
        </div>
      )
    },
    {
      title: 'Profile Picture',
      subtitle: 'Upload a photo or skip — you can change it later',
      content: (
        <div className="space-y-6 text-center w-full max-w-sm mx-auto">
          <div className="w-28 h-28 mx-auto rounded-full border-4 border-white/20 overflow-hidden bg-[#1e1e2e] flex items-center justify-center">
            {avatarUrl ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-5xl">🍌</span>}
          </div>
          <label className={`block px-6 py-3 rounded-xl cursor-pointer font-semibold text-sm transition-all ${uploading ? 'bg-white/10 text-white/40' : 'bg-white/10 text-white hover:bg-white/20'}`}>
            {uploading ? 'Uploading...' : avatarUrl ? '📷 Change Photo' : '📷 Upload Photo'}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
          </label>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20">← Back</button>
            <button onClick={() => setStep(3)} className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl hover:opacity-90">
              {avatarUrl ? 'Next →' : 'Skip →'}
            </button>
          </div>
        </div>
      )
    },
    {
      title: 'Add a Bio',
      subtitle: 'Tell people a little about yourself (optional)',
      content: (
        <div className="space-y-4 w-full max-w-sm mx-auto">
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Write something about yourself..."
            maxLength={200}
            rows={4}
            className="w-full bg-[#1e1e2e] border border-white/20 rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:border-yellow-500"
          />
          <p className="text-white/30 text-sm text-right">{bio.length}/200</p>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20">← Back</button>
            <button onClick={() => setStep(4)} className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl hover:opacity-90">
              Next →
            </button>
          </div>
        </div>
      )
    },
    {
      title: "You're all set! 🎉",
      subtitle: 'Review your profile and jump in!',
      content: (
        <div className="space-y-6 text-center w-full max-w-sm mx-auto">
          <div className="bg-white/5 rounded-2xl p-6 space-y-3">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-yellow-400 bg-[#1e1e2e] flex items-center justify-center">
              {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-3xl">🍌</span>}
            </div>
            <div className="text-white font-black text-xl">{username}</div>
            <div className="text-white/40 text-xs">👤 {realName}</div>
            {bio && <p className="text-white/50 text-sm italic">"{bio}"</p>}
            <div className="flex justify-center gap-2 flex-wrap">
              <span className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full font-bold">Member</span>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button onClick={() => setStep(3)} className="px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20">← Back</button>
            <button
              onClick={handleCreate}
              disabled={saving}
              className="flex-1 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-black font-black rounded-xl hover:opacity-90 disabled:opacity-50 text-lg"
            >
              {saving ? 'Creating...' : '✅ Create Account!'}
            </button>
          </div>
        </div>
      )
    },
  ];

  const s = steps[step];

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-yellow-400' : i < step ? 'w-2 bg-green-400' : 'w-2 bg-white/20'}`} />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="bg-[#13132a] rounded-3xl p-8 border border-purple-500/20 shadow-2xl"
          >
            <h2 className="text-2xl font-black text-white mb-2 text-center">{s.title}</h2>
            <p className="text-white/40 text-sm text-center mb-8">{s.subtitle}</p>
            {s.content}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}