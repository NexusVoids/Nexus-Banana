import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Trash2, Edit3, Check, X, Zap, Package, Wrench, AlertCircle, ThumbsUp, ThumbsDown, Vote, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TYPE_STYLES = {
  major: { color: 'from-yellow-400 to-orange-500', label: 'MAJOR', icon: Zap, bg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
  minor: { color: 'from-blue-400 to-cyan-500', label: 'NEW', icon: Package, bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
  patch: { color: 'from-green-400 to-emerald-500', label: 'PATCH', icon: Wrench, bg: 'bg-green-500/10 border-green-500/30 text-green-400' },
  hotfix: { color: 'from-red-400 to-pink-500', label: 'HOTFIX', icon: AlertCircle, bg: 'bg-red-500/10 border-red-500/30 text-red-400' },
};

const APPROVE_THRESHOLD = 3;
const REJECT_THRESHOLD = 4;

export default function UpdateLog({ canEdit = false }) {
  const queryClient = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ version: '', title: '', changes: [''], type: 'minor', published_by: '', is_core: false });
  const voterId = (typeof window !== 'undefined' && localStorage.getItem('nexus_local_uid')) || 'anon';

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['updatelogs'],
    queryFn: () => base44.entities.UpdateLog.list('-created_date', 50),
  });

  const createLog = useMutation({
    mutationFn: (data) => base44.entities.UpdateLog.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['updatelogs'] }); setAdding(false); resetForm(); },
  });

  const updateLog = useMutation({
    mutationFn: ({ id, data }) => base44.entities.UpdateLog.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['updatelogs'] }); setEditingId(null); },
  });

  const deleteLog = useMutation({
    mutationFn: (id) => base44.entities.UpdateLog.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['updatelogs'] }),
  });

  const resetForm = () => setForm({ version: '', title: '', changes: [''], type: 'minor', published_by: '', is_core: false });

  const handleSave = () => {
    const cleanChanges = form.changes.filter(c => c.trim());
    if (!form.version.trim() || !form.title.trim()) return;
    if (editingId) {
      updateLog.mutate({ id: editingId, data: { ...form, changes: cleanChanges } });
    } else {
      createLog.mutate({ ...form, changes: cleanChanges, status: 'approved' });
    }
  };

  const startEdit = (log) => {
    setEditingId(log.id);
    setForm({ version: log.version, title: log.title, changes: log.changes?.length ? log.changes : [''], type: log.type || 'minor', published_by: log.published_by || '', is_core: !!log.is_core });
    setAdding(true);
  };

  const addChange = () => setForm(f => ({ ...f, changes: [...f.changes, ''] }));
  const updateChange = (i, val) => setForm(f => ({ ...f, changes: f.changes.map((c, idx) => idx === i ? val : c) }));
  const removeChange = (i) => setForm(f => ({ ...f, changes: f.changes.filter((_, idx) => idx !== i) }));

  const vote = (log, type) => {
    const id = voterId;
    const upvotes = (log.upvotes || []).filter(v => v !== id);
    const downvotes = (log.downvotes || []).filter(v => v !== id);
    if (type === 'up') upvotes.push(id);
    else if (type === 'down') downvotes.push(id);
    const net = upvotes.length - downvotes.length;
    let newStatus = log.status || 'pending';
    if (net >= APPROVE_THRESHOLD && newStatus !== 'approved') newStatus = 'approved';
    else if (downvotes.length - upvotes.length >= REJECT_THRESHOLD && newStatus === 'pending') newStatus = 'rejected';
    updateLog.mutate({ id: log.id, data: { upvotes, downvotes, status: newStatus } });
  };

  const pending = logs.filter(l => (l.status || 'approved') === 'pending');
  const live = logs.filter(l => (l.status || 'approved') === 'approved');
  const rejected = logs.filter(l => l.status === 'rejected');

  const renderLog = (log, i) => {
    const typeStyle = TYPE_STYLES[log.type] || TYPE_STYLES.minor;
    const Icon = typeStyle.icon;
    const isCore = !!log.is_core;
    const userUp = (log.upvotes || []).includes(voterId);
    const userDown = (log.downvotes || []).includes(voterId);
    const isPending = (log.status || 'approved') === 'pending';
    const netVotes = (log.upvotes || []).length - (log.downvotes || []).length;
    const progressPct = Math.min(100, Math.max(0, netVotes / APPROVE_THRESHOLD * 100));
    return (
      <motion.div
        key={log.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.05 }}
        className="bg-slate-800/50 border border-slate-700/40 rounded-2xl overflow-hidden hover:border-slate-600/60 transition-all"
      >
        <div className={`h-1 w-full bg-gradient-to-r ${typeStyle.color}`} />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`px-2.5 py-1 rounded-full text-xs font-black border flex items-center gap-1.5 ${typeStyle.bg}`}>
                <Icon className="w-3 h-3" />
                {typeStyle.label}
              </div>
              <span className="text-slate-500 font-mono text-sm">{log.version}</span>
              {isCore && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold">
                  <Shield className="w-3 h-3" /> CORE
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {log.published_by && <span className="text-xs text-slate-600">by {log.published_by}</span>}
              <span className="text-xs text-slate-600">
                {new Date(log.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              {canEdit && (
                <>
                  <button onClick={() => startEdit(log)} className="text-slate-600 hover:text-blue-400 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {!isCore && (
                    <button onClick={() => deleteLog.mutate(log.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <h3 className="text-white font-black text-lg mt-3">{log.title}</h3>
          {log.proposal_text && (
            <p className="text-xs text-slate-500 italic mt-1">Proposed: "{log.proposal_text}"</p>
          )}
          {(log.changes || []).length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {log.changes.map((change, ci) => (
                <li key={ci} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-cyan-500 mt-0.5 flex-shrink-0">→</span>
                  {change}
                </li>
              ))}
            </ul>
          )}
          {/* Vote bar for pending */}
          {isPending && (
            <div className="mt-4 pt-3 border-t border-slate-700/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                  <Vote className="w-3.5 h-3.5" /> Community Poll
                </span>
                <span className="text-xs text-slate-500">Needs {APPROVE_THRESHOLD} net upvotes to go live</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => vote(log, 'up')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${
                    userUp ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'border-slate-600 text-slate-400 hover:border-green-500/40 hover:text-green-300'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> {(log.upvotes || []).length}
                </button>
                <button
                  onClick={() => vote(log, 'down')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${
                    userDown ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'border-slate-600 text-slate-400 hover:border-red-500/40 hover:text-red-300'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" /> {(log.downvotes || []).length}
                </button>
                <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden ml-2">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white">Update Log</h2>
          <p className="text-slate-400 text-sm mt-1">What's new on NexusBanan · AI proposals go through a community poll</p>
        </div>
        {canEdit && !adding && (
          <Button onClick={() => { setAdding(true); setEditingId(null); resetForm(); }} className="bg-gradient-to-r from-cyan-500 to-blue-600">
            <Plus className="w-4 h-4 mr-2" /> Post Update
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {adding && canEdit && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-800/80 border border-cyan-500/20 rounded-2xl p-5 space-y-4"
          >
            <h3 className="text-white font-bold">{editingId ? 'Edit Update' : 'Post New Update'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Version</label>
                <Input value={form.version} onChange={e => setForm(f => ({ ...f, version: e.target.value }))} placeholder="e.g. v2.4.1" className="bg-slate-900 border-slate-700 text-white h-9 text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full h-9 bg-slate-900 border border-slate-700 rounded-lg px-2 text-white text-sm focus:outline-none">
                  <option value="major">Major</option>
                  <option value="minor">Minor (New Features)</option>
                  <option value="patch">Patch</option>
                  <option value="hotfix">Hotfix</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Title</label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="What's the headline?" className="bg-slate-900 border-slate-700 text-white h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Changes</label>
              <div className="space-y-2">
                {form.changes.map((c, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <span className="text-slate-500 text-sm">•</span>
                    <input
                      value={c}
                      onChange={e => updateChange(i, e.target.value)}
                      placeholder="Describe a change..."
                      className="flex-1 h-8 bg-slate-900 border border-slate-700 rounded-lg px-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                    {form.changes.length > 1 && (
                      <button onClick={() => removeChange(i)} className="text-slate-600 hover:text-red-400"><X className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                ))}
                <button onClick={addChange} className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">+ Add change</button>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Published by</label>
              <Input value={form.published_by} onChange={e => setForm(f => ({ ...f, published_by: e.target.value }))} placeholder="Your name..." className="bg-slate-900 border-slate-700 text-white h-9 text-sm" />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input type="checkbox" checked={form.is_core} onChange={e => setForm(f => ({ ...f, is_core: e.target.checked }))} className="w-4 h-4 accent-amber-500" />
              <Shield className="w-3.5 h-3.5 text-amber-400" /> Mark as Core Mechanic (protected from deletion)
            </label>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={createLog.isPending || updateLog.isPending} className="bg-gradient-to-r from-green-500 to-emerald-600">
                <Check className="w-4 h-4 mr-1" /> {editingId ? 'Save Changes' : 'Post Update'}
              </Button>
              <Button onClick={() => { setAdding(false); setEditingId(null); resetForm(); }} variant="outline" className="border-slate-600 text-slate-400">
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="text-slate-500 text-center py-10">Loading updates...</div>
      ) : (
        <>
          {/* Pending polls */}
          {pending.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
                <Vote className="w-5 h-5" /> Pending Polls ({pending.length})
              </h3>
              <div className="space-y-5">{pending.map(renderLog)}</div>
            </div>
          )}

          {/* Live updates */}
          <div>
            {pending.length > 0 && <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2"><Check className="w-5 h-5" /> Live Updates</h3>}
            {live.length === 0 && pending.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No updates posted yet.</p>
              </div>
            ) : live.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No live updates yet — vote on pending polls above!</p>
            ) : (
              <div className="space-y-5">{live.map(renderLog)}</div>
            )}
          </div>

          {/* Rejected (collapsed) */}
          {rejected.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-600 mb-2">Rejected ({rejected.length})</h3>
              <div className="space-y-3 opacity-50">{rejected.map(renderLog)}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}