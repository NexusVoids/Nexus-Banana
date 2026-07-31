import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ROLE_ORDER, hasPermission, ALL_BADGES } from '@/lib/roles';
import RoleBadge from '@/components/RoleBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Crown, Plus, X, Ban, Clock, Coins, AlertTriangle, Shield, Flag, Award, Trash2 } from 'lucide-react';

export default function ExecutivePanel({ currentUser }) {
  const queryClient = useQueryClient();
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#ff6600');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [search, setSearch] = useState('');

  const canRank = hasPermission(currentUser?.roles || [], 'rank_users');
  const canBan = hasPermission(currentUser?.roles || [], 'ban');
  const canDeleteAccounts = hasPermission(currentUser?.roles || [], 'delete_accounts');
  const canWarn = hasPermission(currentUser?.roles || [], 'warn');
  const canGiveBadges = hasPermission(currentUser?.roles || [], 'give_badges');
  const canGiveBucks = hasPermission(currentUser?.roles || [], 'give_bucks');
  const canCreateRoles = hasPermission(currentUser?.roles || [], 'create_custom_roles');
  const isExecutive = hasPermission(currentUser?.roles || [], 'executive_panel');

  const { data: profiles = [] } = useQuery({
    queryKey: ['exec-profiles'],
    queryFn: () => base44.entities.UserProfile.list('-created_date', 200),
  });

  const { data: customRoles = [] } = useQuery({
    queryKey: ['customroles'],
    queryFn: () => base44.entities.CustomRole.list(),
  });

  const updateProfile = useMutation({
    mutationFn: ({ id, data }) => base44.entities.UserProfile.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exec-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['userprofiles'] });
      queryClient.invalidateQueries({ queryKey: ['myprofile'] });
    },
  });

  const createCustomRole = useMutation({
    mutationFn: (data) => base44.entities.CustomRole.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customroles'] });
      setNewRoleName(''); setNewRoleColor('#ff6600'); setNewRoleDesc('');
    },
  });

  const deleteCustomRole = useMutation({
    mutationFn: (id) => base44.entities.CustomRole.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customroles'] }),
  });

  const showMsg = (msg) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 3000);
  };

  const grantRole = (profile, role) => {
    const current = profile.roles || ['Member'];
    if (current.includes(role)) return;
    updateProfile.mutate({ id: profile.id, data: { roles: [...current, role] } });
    showMsg(`✓ Granted ${role} to ${profile.username || profile.user_email}`);
  };

  const revokeRole = (profile, role) => {
    const current = profile.roles || ['Member'];
    if (role === 'Member') return;
    updateProfile.mutate({ id: profile.id, data: { roles: current.filter(r => r !== role) } });
    showMsg(`✓ Revoked ${role} from ${profile.username || profile.user_email}`);
  };

  const grantCustomRole = (profile, roleName) => {
    const current = profile.custom_roles || [];
    if (current.includes(roleName)) return;
    updateProfile.mutate({ id: profile.id, data: { custom_roles: [...current, roleName] } });
    showMsg(`✓ Granted "${roleName}"`);
  };

  const revokeCustomRole = (profile, roleName) => {
    const current = profile.custom_roles || [];
    updateProfile.mutate({ id: profile.id, data: { custom_roles: current.filter(r => r !== roleName) } });
    showMsg(`✓ Revoked "${roleName}"`);
  };

  const toggleBadge = (profile, badgeId) => {
    const current = profile.badges || [];
    const hasBadge = current.includes(badgeId);
    const updated = hasBadge ? current.filter(b => b !== badgeId) : [...current, badgeId];
    updateProfile.mutate({ id: profile.id, data: { badges: updated } });
    const badge = ALL_BADGES.find(b => b.id === badgeId);
    showMsg(hasBadge ? `✓ Removed ${badge?.label} badge` : `✓ Gave ${badge?.label} badge to ${profile.username || profile.user_email}`);
  };

  const warnUser = (profile) => {
    const reason = window.prompt(`Warning reason for ${profile.username || profile.user_email}?`);
    if (!reason) return;
    const currentWarnings = profile.warnings || [];
    const newWarnings = [...currentWarnings, reason];
    let extraData = {};
    if (newWarnings.length >= 3 && !profile.is_banned) {
      const banExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      extraData = { is_banned: true, ban_expires: banExpires, ban_reason: 'Auto-ban: 3 warnings reached' };
      showMsg(`⚠️ ${profile.username || profile.user_email} received warning #${newWarnings.length} → Auto-banned 24h!`);
    } else {
      showMsg(`⚠️ Warning #${newWarnings.length} issued to ${profile.username || profile.user_email}`);
    }
    updateProfile.mutate({ id: profile.id, data: { warnings: newWarnings, ...extraData } });
  };

  const revokeWarning = (profile, idx) => {
    const newWarnings = (profile.warnings || []).filter((_, i) => i !== idx);
    updateProfile.mutate({ id: profile.id, data: { warnings: newWarnings } });
    showMsg(`✓ Warning revoked from ${profile.username || profile.user_email}`);
  };

  const banUser = (profile, duration) => {
    const expires = duration === 'permanent' ? null : new Date(Date.now() + duration * 60 * 60 * 1000).toISOString();
    const reason = window.prompt(`Ban reason for ${profile.username || profile.user_email}?`) || '';
    updateProfile.mutate({ id: profile.id, data: { is_banned: true, ban_expires: expires, ban_reason: reason } });
    showMsg(`🚫 Banned ${profile.username || profile.user_email}${duration !== 'permanent' ? ` for ${duration}h` : ' permanently'}`);
  };

  const unbanUser = (profile) => {
    updateProfile.mutate({ id: profile.id, data: { is_banned: false, ban_expires: null, ban_reason: '', warnings: [] } });
    showMsg(`✓ Unbanned ${profile.username || profile.user_email} & cleared warnings`);
  };

  const timeoutUser = (profile, minutes) => {
    const until = new Date(Date.now() + minutes * 60 * 1000).toISOString();
    updateProfile.mutate({ id: profile.id, data: { timeout_until: until } });
    showMsg(`⏱ Timed out ${profile.username || profile.user_email} for ${minutes} min`);
  };

  const giveBucks = (profile) => {
    const amount = parseInt(window.prompt(`Give BananBucks to ${profile.username || profile.user_email}?`) || '0');
    if (!amount || isNaN(amount)) return;
    updateProfile.mutate({ id: profile.id, data: { banan_bucks: (profile.banan_bucks || 0) + amount } });
    showMsg(`✓ Gave ${amount} BananBucks to ${profile.username || profile.user_email}`);
  };

  const changeName = (profile) => {
    const newName = window.prompt(`New username for ${profile.username || profile.user_email}?`, profile.username || '');
    if (!newName?.trim()) return;
    updateProfile.mutate({ id: profile.id, data: { username: newName.trim(), flagged_name: false } });
    showMsg(`✓ Username changed to "${newName.trim()}"`);
  };

  const flagName = (profile) => {
    updateProfile.mutate({ id: profile.id, data: { flagged_name: !profile.flagged_name } });
    showMsg(profile.flagged_name ? `✓ Name flag removed` : `🚩 Name flagged as inappropriate`);
  };

  const deleteAccount = async (profile) => {
    if (!window.confirm(`DELETE account "${profile.username || profile.user_email}"? This cannot be undone.`)) return;
    await base44.entities.UserProfile.delete(profile.id);
    queryClient.invalidateQueries({ queryKey: ['exec-profiles'] });
    showMsg(`🗑️ Deleted account: ${profile.username || profile.user_email}`);
  };

  const filteredProfiles = profiles.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (p.username || '').toLowerCase().includes(q) || (p.user_email || '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Crown className="w-8 h-8 text-yellow-400" />
        <div>
          <h2 className="text-3xl font-bold text-white">Mod Panel</h2>
          <p className="text-slate-400 text-sm">
            {localStorage.getItem('aprCodeActive') === 'true'
              ? '🔑 APR — Full permissions active'
              : 'Rank & moderation tools'}
          </p>
        </div>
      </div>

      {actionMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 border border-green-500/40 text-green-400 px-4 py-2 rounded-xl text-sm font-semibold"
        >
          {actionMsg}
        </motion.div>
      )}

      {/* Custom Roles Manager — executive only */}
      {(isExecutive || canCreateRoles) && (
        <div className="bg-slate-800/60 border border-yellow-500/20 rounded-2xl p-5">
          <h3 className="text-lg font-bold text-yellow-400 mb-4">Custom Roles</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {customRoles.map(cr => (
              <div key={cr.id} className="flex items-center gap-1 px-3 py-1 rounded-full border" style={{ borderColor: cr.color, background: `${cr.color}22` }}>
                <span className="text-sm font-bold" style={{ color: cr.color }}>{cr.name}</span>
                <button onClick={() => deleteCustomRole.mutate(cr.id)} className="ml-1 text-slate-400 hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-end">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Role Name</label>
              <Input value={newRoleName} onChange={e => setNewRoleName(e.target.value)} placeholder="e.g. Veteran" className="w-36 bg-slate-700 border-slate-600 text-white h-8 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Color</label>
              <input type="color" value={newRoleColor} onChange={e => setNewRoleColor(e.target.value)} className="w-14 h-8 rounded cursor-pointer border-0" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Description</label>
              <Input value={newRoleDesc} onChange={e => setNewRoleDesc(e.target.value)} placeholder="Short description" className="w-48 bg-slate-700 border-slate-600 text-white h-8 text-sm" />
            </div>
            <Button
              onClick={() => createCustomRole.mutate({ name: newRoleName, color: newRoleColor, description: newRoleDesc })}
              disabled={!newRoleName.trim()}
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700 h-8"
            >
              <Plus className="w-3 h-3 mr-1" /> Create
            </Button>
          </div>
        </div>
      )}

      {/* Users Management */}
      <div className="bg-slate-800/60 border border-purple-500/20 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-lg font-bold text-white">User Management ({profiles.length} users)</h3>
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-48 bg-slate-700 border-slate-600 text-white h-8 text-sm"
          />
        </div>
        <div className="space-y-4">
          {filteredProfiles.map(p => (
            <div key={p.id} className={`bg-slate-700/50 rounded-xl p-4 space-y-3 ${p.flagged_name ? 'border border-red-500/40' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" /> : (p.username || p.user_email || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-white font-bold text-sm ${p.flagged_name ? 'text-red-300' : ''}`}>
                      {p.username || 'No username'}
                      {p.flagged_name && <span className="ml-1 text-xs text-red-400">🚩 Flagged</span>}
                    </span>
                    {p.real_name && <span className="text-slate-300 text-xs">({p.real_name})</span>}
                    <span className="text-slate-400 text-xs truncate">{p.user_email}</span>
                    {p.is_banned && <span className="text-xs text-red-400 font-bold">🚫 BANNED</span>}
                    {(p.warnings || []).length > 0 && (
                      <span className="text-xs text-orange-400 font-bold">⚠️ {p.warnings.length} warn{p.warnings.length > 1 ? 's' : ''}</span>
                    )}
                    {p.banan_bucks > 0 && <span className="text-xs text-yellow-400">🍌 {p.banan_bucks}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(p.roles || ['Member']).map(r => <RoleBadge key={r} role={r} customRoles={customRoles} small />)}
                    {(p.custom_roles || []).map(r => <RoleBadge key={r} role={r} customRoles={customRoles} small />)}
                  </div>
                  {/* Badges row */}
                  {(p.badges || []).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(p.badges || []).map(bid => {
                        const b = ALL_BADGES.find(x => x.id === bid);
                        if (!b) return null;
                        return (
                          <span key={bid} className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${b.color}33`, color: b.color, border: `1px solid ${b.color}55` }}>
                            {b.emoji} {b.label}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Role Assignment */}
              {canRank && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Role</p>
                  <div className="flex flex-wrap gap-2 items-center">
                    <select
                      value={(p.roles || ['Member']).find(r => ROLE_ORDER.includes(r)) || 'Member'}
                      onChange={e => {
                        const newRole = e.target.value;
                        const otherRoles = (p.roles || ['Member']).filter(r => !ROLE_ORDER.includes(r));
                        updateProfile.mutate({ id: p.id, data: { roles: [newRole, ...otherRoles] } });
                        showMsg(`✓ Set ${p.username || p.user_email}'s role to ${newRole}`);
                      }}
                      className="bg-slate-700 border border-slate-600 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500"
                    >
                      {ROLE_ORDER.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    {customRoles.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {customRoles.map(cr => {
                          const has = (p.custom_roles || []).includes(cr.name);
                          return (
                            <button
                              key={cr.id}
                              onClick={() => has ? revokeCustomRole(p, cr.name) : grantCustomRole(p, cr.name)}
                              className="text-xs px-2 py-1 rounded-full border font-bold transition-all"
                              style={{ color: has ? cr.color : '#888', borderColor: has ? cr.color : '#555', background: has ? `${cr.color}22` : 'transparent' }}
                            >
                              {has ? '✓ ' : '+ '}{cr.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Badge Assignment */}
              {canGiveBadges && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Badges</p>
                  <div className="flex flex-wrap gap-1">
                    {ALL_BADGES.map(badge => {
                      const has = (p.badges || []).includes(badge.id);
                      return (
                        <button
                          key={badge.id}
                          onClick={() => toggleBadge(p, badge.id)}
                          title={badge.desc}
                          className="text-xs px-2 py-0.5 rounded-full border font-bold transition-all"
                          style={{ color: has ? badge.color : '#888', borderColor: has ? badge.color : '#555', background: has ? `${badge.color}22` : 'transparent' }}
                        >
                          {badge.emoji} {has ? '✓' : '+'} {badge.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {canWarn && (p.warnings || []).length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider">Warnings ({p.warnings.length}/3)</p>
                  <div className="space-y-1">
                    {p.warnings.map((w, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-orange-300 bg-orange-500/10 rounded-lg px-2 py-1">
                        <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                        <span className="flex-1">{w}</span>
                        <button onClick={() => revokeWarning(p, i)} className="text-slate-400 hover:text-green-400">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-1.5">
                {canGiveBucks && (
                  <Button onClick={() => giveBucks(p)} size="sm" variant="outline" className="h-7 text-xs border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10">
                    <Coins className="w-3 h-3 mr-1" /> Bucks
                  </Button>
                )}
                {canWarn && (
                  <Button onClick={() => warnUser(p)} size="sm" variant="outline" className="h-7 text-xs border-orange-500/40 text-orange-400 hover:bg-orange-500/10">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Warn
                  </Button>
                )}
                <Button onClick={() => timeoutUser(p, 10)} size="sm" variant="outline" className="h-7 text-xs border-amber-500/40 text-amber-400 hover:bg-amber-500/10">
                  <Clock className="w-3 h-3 mr-1" /> TO 10m
                </Button>
                <Button onClick={() => timeoutUser(p, 60)} size="sm" variant="outline" className="h-7 text-xs border-amber-500/40 text-amber-400 hover:bg-amber-500/10">
                  <Clock className="w-3 h-3 mr-1" /> TO 1h
                </Button>
                {hasPermission(currentUser?.roles || [], 'flag_name') || hasPermission(currentUser?.roles || [], 'executive_panel') ? (
                  <>
                    <Button onClick={() => changeName(p)} size="sm" variant="outline" className="h-7 text-xs border-blue-500/40 text-blue-400 hover:bg-blue-500/10">
                      ✏️ Name
                    </Button>
                    <Button onClick={() => flagName(p)} size="sm" variant="outline" className={`h-7 text-xs ${p.flagged_name ? 'border-green-500/40 text-green-400' : 'border-red-500/40 text-red-400'}`}>
                      <Flag className="w-3 h-3 mr-1" /> {p.flagged_name ? 'Unflag' : 'Flag Name'}
                    </Button>
                  </>
                ) : null}
                {canBan && (
                  p.is_banned ? (
                    <Button onClick={() => unbanUser(p)} size="sm" variant="outline" className="h-7 text-xs border-green-500/40 text-green-400 hover:bg-green-500/10">
                      Unban
                    </Button>
                  ) : (
                    <>
                      <Button onClick={() => banUser(p, 24)} size="sm" variant="outline" className="h-7 text-xs border-red-500/40 text-red-400 hover:bg-red-500/10">
                        <Ban className="w-3 h-3 mr-1" /> Ban 24h
                      </Button>
                      <Button onClick={() => banUser(p, 'permanent')} size="sm" variant="outline" className="h-7 text-xs border-red-800/60 text-red-600 hover:bg-red-900/20">
                        <Ban className="w-3 h-3 mr-1" /> Perm Ban
                      </Button>
                    </>
                  )
                )}
                {canDeleteAccounts && (
                  <Button onClick={() => deleteAccount(p)} size="sm" variant="outline" className="h-7 text-xs border-rose-700/60 text-rose-500 hover:bg-rose-900/20">
                    <Trash2 className="w-3 h-3 mr-1" /> Delete Account
                  </Button>
                )}
              </div>
            </div>
          ))}
          {filteredProfiles.length === 0 && <p className="text-slate-400 text-sm">No users found.</p>}
        </div>
      </div>
    </div>
  );
}