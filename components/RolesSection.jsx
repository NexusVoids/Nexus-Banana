import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ROLES, ROLE_ORDER } from '@/lib/roles';
import RoleBadge from '@/components/RoleBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users, Shield, Crown } from 'lucide-react';

export default function RolesSection({ currentUser, userProfile, customRoles = [] }) {
  const [username, setUsername] = useState(userProfile?.username || '');
  const [saved, setSaved] = useState(false);
  const queryClient = useQueryClient();

  const { data: allProfiles = [] } = useQuery({
    queryKey: ['userprofiles'],
    queryFn: () => base44.entities.UserProfile.list('-created_date', 100),
  });

  const saveMutation = useMutation({
    mutationFn: async (name) => {
      if (userProfile?.id) {
        return base44.entities.UserProfile.update(userProfile.id, { username: name });
      } else {
        return base44.entities.UserProfile.create({
          username: name,
          user_email: currentUser?.email,
          roles: ['Member'],
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myprofile'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const roleDescriptions = {
    Member: 'Default role. Can chat and browse.',
    Trusted: 'Trusted community members. Can share images in chat.',
    Helper: 'Staff-lite. Access to staff chat.',
    Mod: 'Moderators. Can timeout users and create codes.',
    Admin: 'Administrators. Can ban users and access the Admin Panel.',
    'Executive Team': 'Top leadership. Full access including the Executive Panel.',
  };

  return (
    <div className="space-y-8">
      {/* My Profile */}
      <div className="bg-slate-800/60 border border-purple-500/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-400" />
          My Profile
        </h3>
        {currentUser ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-xl">
                {(userProfile?.username || currentUser.email || '?')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-white font-bold text-lg">{userProfile?.username || 'No username set'}</p>
                <p className="text-slate-400 text-sm">{currentUser.email}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(userProfile?.roles || ['Member']).map(r => (
                    <RoleBadge key={r} role={r} customRoles={customRoles} />
                  ))}
                  {(userProfile?.custom_roles || []).map(r => (
                    <RoleBadge key={r} role={r} customRoles={customRoles} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 max-w-sm">
              <Input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Set your username..."
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Button
                onClick={() => saveMutation.mutate(username)}
                disabled={!username.trim() || saveMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {saved ? '✓ Saved' : 'Save'}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">Loading your profile...</p>
        )}
      </div>

      {/* Role Descriptions */}
      <div className="bg-slate-800/60 border border-purple-500/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-400" />
          Server Roles
        </h3>
        <p className="text-slate-400 text-sm mb-5">Roles are assigned by Executive Team through the Executive Panel.</p>
        <div className="space-y-3">
          {ROLE_ORDER.map((roleName, i) => {
            const def = ROLES[roleName];
            return (
              <motion.div
                key={roleName}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-4 p-3 rounded-xl"
                style={{ background: `${def.color}11`, border: `1px solid ${def.color}44` }}
              >
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: def.color }} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white">{roleName}</span>
                    <RoleBadge role={roleName} />
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">{roleDescriptions[roleName]}</p>
                </div>
              </motion.div>
            );
          })}
          {customRoles.map((cr, i) => (
            <motion.div
              key={cr.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (ROLE_ORDER.length + i) * 0.07 }}
              className="flex items-center gap-4 p-3 rounded-xl"
              style={{ background: `${cr.color}11`, border: `1px solid ${cr.color}44` }}
            >
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cr.color }} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{cr.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full border font-bold" style={{ color: cr.color, borderColor: cr.color, background: `${cr.color}22` }}>Custom</span>
                </div>
                {cr.description && <p className="text-slate-400 text-xs mt-0.5">{cr.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Members List */}
      <div className="bg-slate-800/60 border border-purple-500/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          Members ({allProfiles.length})
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {allProfiles.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {(p.username || p.user_email || '?')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{p.username || p.user_email}</p>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {(p.roles || ['Member']).map(r => <RoleBadge key={r} role={r} customRoles={customRoles} small />)}
                  {(p.custom_roles || []).map(r => <RoleBadge key={r} role={r} customRoles={customRoles} small />)}
                </div>
              </div>
              {p.is_banned && <span className="text-red-400 text-xs font-bold">BANNED</span>}
            </div>
          ))}
          {allProfiles.length === 0 && <p className="text-slate-400 text-sm">No members have set up profiles yet.</p>}
        </div>
      </div>
    </div>
  );
}