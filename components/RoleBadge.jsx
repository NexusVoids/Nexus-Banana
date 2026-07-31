import React from 'react';
import { ROLES } from '@/lib/roles';

export default function RoleBadge({ role, customRoles = [], small = false }) {
  const def = ROLES[role];
  const custom = !def && customRoles.find(cr => cr.name === role);
  const color = def ? def.color : (custom ? custom.color : '#22c55e');
  const label = def ? def.label : (custom ? custom.name : role);

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border ${small ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'}`}
      style={{ color, borderColor: color, background: `${color}22` }}
    >
      {label}
    </span>
  );
}