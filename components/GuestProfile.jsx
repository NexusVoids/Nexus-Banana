import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Edit3, Check, X, Heart, Camera, Upload, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ALL_BADGES } from '@/lib/roles';

const GAME_OPTIONS = [
  '🎮 Math Playground', '🧙 Khan Academy', '🚀 Prodigy Math', '📈 Desmos',
  '🎯 Poki Games', '✨ Vocabulary.com', '📖 Read Theory', '🧪 Science Games',
  '🏎️ Racing Games', '🧩 Puzzle Games', '⚔️ RPG Games', '🔫 Shooter Games',
];

const AVATAR_EMOJIS = ['🍌', '🦊', '🐼', '🤖', '👾', '🦁', '🐸', '🐉', '🦄', '👻', '🎮', '⚡', '🔥', '🌙', '🎯', '💎'];

export default function GuestProfile() {
  const queryClient = useQueryClient();
  const fileRef = useRef(null);

  // Local guest profile (no-account version)
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('guestProfile');
    return saved ? JSON.parse(saved) : {
      username: '',
      avatar: '🍌',
      avatarUrl: null,
      bio: '',
      favoriteGames: [],
      customBadge: '',
    };
  });

  const [editing, setEditing] = useState(!profile.username);
  const [editForm, setEditForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Try to fetch server-side profile for staff-given badges
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    base44.auth.me().then(u => setCurrentUser(u)).catch(() => {});
  }, []);

  const { data: serverProfile } = useQuery({
    queryKey: ['myprofile', currentUser?.email],
    queryFn: () => base44.entities.UserProfile.filter({ user_email: currentUser.email }, '-created_date', 1).then(r => r[0] || null),
    enabled: !!currentUser?.email,
  });

  const updateServerProfile = useMutation({
    mutationFn: ({ id, data }) => base44.entities.UserProfile.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myprofile', currentUser?.email] }),
  });

  const saveProfile = () => {
    if (!editForm.username.trim()) return;
    const updated = { ...editForm, username: editForm.username.trim() };
    setProfile(updated);
    localStorage.setItem('guestProfile', JSON.stringify(updated));
    // Sync username + avatar to server profile if it exists
    if (serverProfile?.id) {
      updateServerProfile.mutate({ id: serverProfile.id, data: { username: updated.username, avatar_url: updated.avatarUrl || null } });
    }
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setEditForm(p => ({ ...p, avatarUrl: file_url }));
    setUploading(false);
  };

  const toggleGame = (game) => {
    setEditForm(prev => ({
      ...prev,
      favoriteGames: prev.favoriteGames.includes(game)
        ? prev.favoriteGames.filter(g => g !== game)
        : [...prev.favoriteGames, game].slice(0, 6),
    }));
  };

  const deleteMyData = async () => {
    if (!window.confirm('Delete all your data? This will remove your account and cannot be undone.')) return;
    // Delete server profile record if it exists
    if (serverProfile?.id) {
      await base44.entities.UserProfile.delete(serverProfile.id);
    }
    // Wipe all local storage keys for this user
    const localId = localStorage.getItem('nexus_local_uid');
    localStorage.removeItem('guestProfile');
    localStorage.removeItem('nexusBananCodes');
    localStorage.removeItem('infiniteBananBucks');
    localStorage.removeItem('aprCodeActive');
    if (localId) {
      localStorage.removeItem('onboardingComplete_' + localId);
    }
    localStorage.removeItem('nexus_local_uid');
    window.location.reload();
  };

  const staffBadges = (serverProfile?.badges || [])
    .map(bid => ALL_BADGES.find(b => b.id === bid))
    .filter(Boolean);

  if (!profile.username && !editing) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-6xl mb-4">👤</div>
        <h3 className="text-2xl font-bold text-white mb-2">Create Your Profile</h3>
        <p className="text-slate-400 mb-6 text-center">No account needed — just pick a name and go!</p>
        <button
          onClick={() => setEditing(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold"
        >
          Set Up Profile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <User className="w-8 h-8 text-purple-400" />
        My Profile
        <span className="text-sm font-normal text-green-400 ml-auto bg-green-400/10 px-3 py-1 rounded-full border border-green-400/30">
          ✓ No login needed
        </span>
      </h2>

      {editing ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/60 border border-purple-500/30 rounded-2xl p-6 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Edit Profile</h3>
            {profile.username && (
              <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Profile Picture Upload */}
          <div>
            <label className="text-slate-300 text-sm font-medium mb-3 block">Profile Picture</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-4xl flex-shrink-0 shadow-lg">
                {editForm.avatarUrl
                  ? <img src={editForm.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  : editForm.avatar}
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-500/40 rounded-xl text-purple-300 hover:bg-purple-600/30 text-sm transition-colors"
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
                {editForm.avatarUrl && (
                  <button
                    onClick={() => setEditForm(p => ({ ...p, avatarUrl: null }))}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-xl text-slate-400 hover:text-red-400 text-sm transition-colors"
                  >
                    <X className="w-4 h-4" /> Remove
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
            </div>
          </div>

          {/* Emoji Avatar (fallback) */}
          {!editForm.avatarUrl && (
            <div>
              <label className="text-slate-300 text-sm font-medium mb-3 block">Or Pick an Emoji Avatar</label>
              <div className="grid grid-cols-8 gap-2">
                {AVATAR_EMOJIS.map(em => (
                  <button
                    key={em}
                    onClick={() => setEditForm(p => ({ ...p, avatar: em }))}
                    className={`w-full aspect-square text-2xl rounded-xl flex items-center justify-center transition-all ${
                      editForm.avatar === em
                        ? 'bg-purple-500/40 border-2 border-purple-400 scale-110'
                        : 'bg-slate-700/50 border border-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Username */}
          <div>
            <label className="text-slate-300 text-sm font-medium mb-2 block">Username *</label>
            <input
              type="text"
              value={editForm.username}
              onChange={e => setEditForm(p => ({ ...p, username: e.target.value.slice(0, 20) }))}
              placeholder="Enter your username..."
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
              maxLength={20}
            />
            <p className="text-slate-500 text-xs mt-1">{editForm.username.length}/20 chars</p>
          </div>

          {/* Bio */}
          <div>
            <label className="text-slate-300 text-sm font-medium mb-2 block">Bio (optional)</label>
            <textarea
              value={editForm.bio}
              onChange={e => setEditForm(p => ({ ...p, bio: e.target.value.slice(0, 150) }))}
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400 resize-none"
            />
            <p className="text-slate-500 text-xs mt-1">{editForm.bio.length}/150 chars</p>
          </div>

          {/* Custom Badge */}
          <div>
            <label className="text-slate-300 text-sm font-medium mb-2 block">Custom Badge Text (optional)</label>
            <input
              type="text"
              value={editForm.customBadge}
              onChange={e => setEditForm(p => ({ ...p, customBadge: e.target.value.slice(0, 20) }))}
              placeholder="e.g. Pro Gamer, Math Wizard..."
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Favorite Games */}
          <div>
            <label className="text-slate-300 text-sm font-medium mb-3 block">
              Favorite Games <span className="text-slate-500">(up to 6)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GAME_OPTIONS.map(game => (
                <button
                  key={game}
                  onClick={() => toggleGame(game)}
                  className={`px-3 py-2 rounded-lg border text-sm transition-all text-left ${
                    editForm.favoriteGames.includes(game)
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                      : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {game}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={saveProfile}
            disabled={!editForm.username.trim() || uploading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-bold flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Save Profile
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Profile Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl overflow-hidden flex items-center justify-center text-4xl shadow-lg shadow-purple-500/30">
                  {profile.avatarUrl
                    ? <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    : profile.avatar}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">{profile.username}</h3>
                  {profile.customBadge && (
                    <span className="inline-block mt-1 px-3 py-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-white text-xs font-bold">
                      ✦ {profile.customBadge}
                    </span>
                  )}
                  {profile.bio && <p className="text-slate-400 text-sm mt-2 max-w-xs">{profile.bio}</p>}
                </div>
              </div>
              <button
                onClick={() => { setEditForm(profile); setEditing(true); }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 hover:text-white text-sm flex items-center gap-2 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            </div>

            {/* Staff-given Badges */}
            {staffBadges.length > 0 && (
              <div className="mb-4">
                <p className="text-slate-500 text-xs font-medium mb-2">STAFF BADGES</p>
                <div className="flex flex-wrap gap-2">
                  {staffBadges.map(badge => (
                    <div
                      key={badge.id}
                      title={badge.desc}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow"
                      style={{ background: `${badge.color}33`, border: `1px solid ${badge.color}66`, color: badge.color }}
                    >
                      <span>{badge.emoji}</span>
                      {badge.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings display */}
            {serverProfile && (serverProfile.warnings || []).length > 0 && (
              <div className="mt-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                <p className="text-orange-400 text-xs font-bold">⚠️ {serverProfile.warnings.length}/3 Warning{serverProfile.warnings.length > 1 ? 's' : ''}</p>
                <p className="text-orange-300/70 text-xs mt-0.5">3 warnings = auto 24h ban</p>
              </div>
            )}
          </div>

          {/* Favorite Games */}
          {profile.favoriteGames.length > 0 && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" />
                Favorite Games
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.favoriteGames.map(g => (
                  <span key={g} className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 text-sm">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Delete My Data */}
          <div className="bg-slate-800/40 border border-red-900/30 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-sm">Delete My Data</p>
              <p className="text-slate-500 text-xs">Permanently removes your account & resets everything</p>
            </div>
            <button
              onClick={deleteMyData}
              className="flex items-center gap-2 px-4 py-2 bg-red-900/30 border border-red-700/40 rounded-xl text-red-400 hover:bg-red-900/50 text-sm font-semibold transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Staff Badges', value: staffBadges.length, icon: '🏅' },
              { label: 'Fav Games', value: profile.favoriteGames.length, icon: '🎮' },
              { label: 'Messages', value: serverProfile?.message_count || 0, icon: '💬' },
            ].map(stat => (
              <div key={stat.label} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-slate-500 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}