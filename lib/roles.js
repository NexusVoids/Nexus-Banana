// Role definitions and utilities

export const ROLES = {
  Member: {
    label: 'Member',
    color: '#22c55e',
    bgClass: 'bg-green-500',
    textClass: 'text-green-400',
    borderClass: 'border-green-500',
    level: 1,
    permissions: ['chat', 'view'],
  },
  Trusted: {
    label: 'Trusted',
    color: '#eab308',
    bgClass: 'bg-yellow-500',
    textClass: 'text-yellow-400',
    borderClass: 'border-yellow-500',
    level: 2,
    permissions: ['chat', 'view', 'upload_images'],
  },
  Helper: {
    label: 'Helper',
    color: '#a855f7',
    bgClass: 'bg-purple-500',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-500',
    level: 3,
    permissions: ['chat', 'view', 'upload_images', 'staff_chat'],
  },
  Mod: {
    label: 'Mod',
    color: '#92400e',
    bgClass: 'bg-amber-800',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-800',
    level: 4,
    permissions: ['chat', 'view', 'upload_images', 'staff_chat', 'timeout', 'warn', 'create_codes', 'delete_messages'],
  },
  Admin: {
    label: 'Admin',
    color: '#ef4444',
    bgClass: 'bg-red-500',
    textClass: 'text-red-400',
    borderClass: 'border-red-500',
    level: 5,
    permissions: ['chat', 'view', 'upload_images', 'staff_chat', 'timeout', 'warn', 'create_codes', 'delete_messages', 'ban', 'give_badges', 'rank_users', 'admin_panel'],
  },
  'Executive Team': {
    label: 'Executive Team',
    color: '#1e293b',
    bgClass: 'bg-slate-900',
    textClass: 'text-slate-100',
    borderClass: 'border-slate-600',
    level: 6,
    permissions: ['chat', 'view', 'upload_images', 'staff_chat', 'timeout', 'warn', 'create_codes', 'delete_messages', 'ban', 'give_badges', 'rank_users', 'admin_panel', 'executive_panel', 'give_bucks', 'create_custom_roles'],
  },
  Founder: {
    label: 'Founder',
    color: '#f59e0b',
    bgClass: 'bg-amber-500',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500',
    level: 7,
    permissions: ['chat', 'view', 'upload_images', 'staff_chat', 'timeout', 'warn', 'create_codes', 'delete_messages', 'ban', 'give_badges', 'rank_users', 'admin_panel', 'executive_panel', 'give_bucks', 'create_custom_roles', 'delete_accounts', 'flag_name', 'change_name', 'kick'],
  },
};

export const ROLE_ORDER = ['Member', 'Trusted', 'Helper', 'Mod', 'Admin', 'Executive Team', 'Founder'];

// APR code grants ALL permissions locally
export const APR_PERMISSIONS = [
  'chat', 'view', 'upload_images', 'staff_chat', 'timeout', 'warn',
  'create_codes', 'delete_messages', 'ban', 'give_badges', 'rank_users',
  'admin_panel', 'executive_panel', 'give_bucks', 'create_custom_roles',
  'kick', 'change_name', 'flag_name', 'delete_accounts',
];

export const ALL_BADGES = [
  { id: 'admin', label: 'Admin', emoji: '🛡️', color: '#ef4444', desc: 'Part of the Admin team' },
  { id: 'trusted', label: 'Trusted', emoji: '✅', color: '#eab308', desc: 'A trusted community member' },
  { id: 'popular', label: 'Popular', emoji: '🔥', color: '#f97316', desc: 'Very popular around here' },
  { id: 'og', label: 'OG', emoji: '👴', color: '#8b5cf6', desc: 'An original member' },
  { id: 'veteran', label: 'Veteran', emoji: '⚔️', color: '#64748b', desc: 'A long-time veteran' },
  { id: 'bananer', label: 'Bananer', emoji: '🍌', color: '#eab308', desc: 'True Banan energy' },
  { id: 'richy', label: 'Richy', emoji: '💰', color: '#22c55e', desc: 'Rolling in BananBucks' },
  { id: 'chatter_bug', label: 'Chatter Bug', emoji: '🐛', color: '#06b6d4', desc: 'Sent 100+ messages' },
];

export function getHighestRole(roles = []) {
  let highest = null;
  let highestLevel = 0;
  for (const r of roles) {
    const def = ROLES[r];
    if (def && def.level > highestLevel) {
      highest = r;
      highestLevel = def.level;
    }
  }
  return highest || 'Member';
}

export function hasPermission(roles = [], permission) {
  // Check APR code
  if (typeof localStorage !== 'undefined' && localStorage.getItem('aprCodeActive') === 'true') {
    if (APR_PERMISSIONS.includes(permission)) return true;
  }
  for (const r of roles) {
    const def = ROLES[r];
    if (def && def.permissions.includes(permission)) return true;
  }
  return false;
}

export function getRoleStyle(roleName, customRoles = []) {
  if (ROLES[roleName]) return ROLES[roleName];
  const custom = customRoles.find(cr => cr.name === roleName);
  if (custom) {
    return {
      label: custom.name,
      color: custom.color,
      bgClass: '',
      textClass: '',
      borderClass: '',
      level: 1.5,
    };
  }
  return ROLES['Member'];
}