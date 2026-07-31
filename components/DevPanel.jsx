import React from 'react';
import { motion } from 'framer-motion';
import { Code, Crown } from 'lucide-react';
import ExecutivePanel from '@/components/ExecutivePanel';
import UpdateLog from '@/components/UpdateLog';

export default function DevPanel({ userProfile, customRoles }) {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-cyan-950/60 via-purple-950/60 to-slate-900/60 border border-cyan-500/30 rounded-2xl p-5 flex items-center gap-4"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <Code className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            Dev Panel <Crown className="w-5 h-5 text-amber-400" />
          </h2>
          <p className="text-cyan-300/70 text-sm">Full control — granted via the owner's code. Grant roles, make new roles, moderate chat, post updates, and everything else.</p>
        </div>
      </motion.div>

      <ExecutivePanel currentUser={{ roles: ['Founder'] }} />
      <UpdateLog canEdit />
    </div>
  );
}