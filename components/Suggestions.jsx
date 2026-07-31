import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, Music, Bug, Sparkles, Gamepad2, Shield, Calendar, HelpCircle, ThumbsUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const CATEGORIES = [
  { id: 'song', label: 'Song Request', icon: Music, color: 'from-pink-500 to-purple-600', emoji: '🎵', desc: 'Suggest a song for Friend Music' },
  { id: 'bug', label: 'Bug Report', icon: Bug, color: 'from-red-500 to-orange-600', emoji: '🐛', desc: 'Report something broken' },
  { id: 'feature', label: 'Feature Idea', icon: Sparkles, color: 'from-yellow-400 to-orange-500', emoji: '💡', desc: 'Suggest a new feature' },
  { id: 'game', label: 'Game Request', icon: Gamepad2, color: 'from-green-500 to-teal-600', emoji: '🎮', desc: 'Request a new game or activity' },
  { id: 'rule', label: 'Rule Change', icon: Shield, color: 'from-blue-500 to-indigo-600', emoji: '📜', desc: 'Suggest a rule modification' },
  { id: 'event', label: 'Event Idea', icon: Calendar, color: 'from-violet-500 to-purple-600', emoji: '🎉', desc: 'Propose a community event' },
  { id: 'other', label: 'Other', icon: HelpCircle, color: 'from-slate-500 to-slate-600', emoji: '💬', desc: 'Anything else on your mind' },
];

const STATUS_STYLES = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  approved: 'bg-green-500/20 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export default function Suggestions() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', submitter_name: '', youtube_url: '', is_clean: false });
  const [submitted, setSubmitted] = useState(false);
  const [filterCat, setFilterCat] = useState('all');
  const queryClient = useQueryClient();

  const { data: suggestions = [] } = useQuery({
    queryKey: ['suggestions-new'],
    queryFn: () => base44.entities.SuggestionItem.list('-created_date', 100),
    refetchInterval: 15000,
  });

  const submitMutation = useMutation({
    mutationFn: (data) => base44.entities.SuggestionItem.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions-new'] });
      setSubmitted(true);
      setForm({ title: '', description: '', submitter_name: '', youtube_url: '', is_clean: false });
      setTimeout(() => { setSubmitted(false); setSelectedCategory(null); }, 3000);
    },
  });

  const upvoteMutation = useMutation({
    mutationFn: ({ id, current }) => base44.entities.SuggestionItem.update(id, { upvotes: (current || 0) + 1 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suggestions-new'] }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.submitter_name.trim()) return;
    submitMutation.mutate({ ...form, category: selectedCategory });
  };

  const filtered = filterCat === 'all' ? suggestions : suggestions.filter(s => s.category === filterCat);

  if (submitted) {
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-24">
        <div className="text-8xl mb-4">✅</div>
        <h3 className="text-3xl font-black text-white mb-2">Suggestion Submitted!</h3>
        <p className="text-slate-400">Staff will review it soon. Thank you!</p>
      </motion.div>
    );
  }

  if (selectedCategory) {
    const cat = CATEGORIES.find(c => c.id === selectedCategory);
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto">
        <button onClick={() => setSelectedCategory(null)} className="text-slate-400 hover:text-white text-sm mb-6 flex items-center gap-1">
          ← Back to categories
        </button>
        <div className={`bg-gradient-to-br ${cat.color} p-1 rounded-2xl mb-6`}>
          <div className="bg-slate-900 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{cat.emoji}</span>
              <div>
                <h3 className="text-white font-black text-xl">{cat.label}</h3>
                <p className="text-slate-400 text-sm">{cat.desc}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
          <div>
            <label className="text-sm text-slate-400 block mb-1.5">Title / Summary *</label>
            <Input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder={selectedCategory === 'bug' ? 'What broke?' : selectedCategory === 'song' ? 'Song name...' : 'Brief title...'}
              className="bg-slate-900 border-slate-700 text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-1.5">Details (optional)</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder={selectedCategory === 'bug' ? 'Steps to reproduce, what happened, etc.' : 'Describe your idea in more detail...'}
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
            />
          </div>

          {selectedCategory === 'song' && (
            <>
              <div>
                <label className="text-sm text-slate-400 block mb-1.5">YouTube URL</label>
                <Input
                  value={form.youtube_url}
                  onChange={e => setForm({ ...form, youtube_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                <input
                  type="checkbox"
                  checked={form.is_clean}
                  onChange={e => setForm({ ...form, is_clean: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-yellow-300 text-sm font-semibold">✓ I confirm this song is clean and school-appropriate</span>
              </label>
            </>
          )}

          <div>
            <label className="text-sm text-slate-400 block mb-1.5">Your Name *</label>
            <Input
              value={form.submitter_name}
              onChange={e => setForm({ ...form, submitter_name: e.target.value })}
              placeholder="Your display name..."
              className="bg-slate-900 border-slate-700 text-white"
              required
            />
          </div>

          <Button type="submit" disabled={submitMutation.isPending || !form.title.trim() || !form.submitter_name.trim()} className={`w-full bg-gradient-to-r ${cat.color} text-white font-bold py-5`}>
            <Send className="w-4 h-4 mr-2" />
            {submitMutation.isPending ? 'Submitting...' : 'Submit Suggestion'}
          </Button>
        </form>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-white mb-1">Suggestions</h2>
        <p className="text-slate-400">Share your ideas, report bugs, request songs, and more!</p>
      </div>

      {/* Category picker */}
      <div>
        <h3 className="text-white font-bold mb-3">What would you like to suggest?</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={`bg-gradient-to-br ${cat.color} p-0.5 rounded-2xl group`}
            >
              <div className="bg-slate-900 group-hover:bg-slate-800/80 rounded-[14px] p-4 h-full transition-colors text-left">
                <span className="text-3xl block mb-2">{cat.emoji}</span>
                <p className="text-white font-bold text-sm">{cat.label}</p>
                <p className="text-slate-400 text-xs mt-0.5">{cat.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h3 className="text-white font-bold text-lg">Recent Suggestions ({suggestions.length})</h3>
          <div className="flex gap-1.5 flex-wrap">
            {['all', ...CATEGORIES.map(c => c.id)].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${filterCat === cat ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                {cat === 'all' ? 'All' : CATEGORIES.find(c => c.id === cat)?.emoji + ' ' + CATEGORIES.find(c => c.id === cat)?.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-slate-500 text-center py-10">No suggestions in this category yet. Be the first!</p>
          ) : (
            filtered.map((s, i) => {
              const cat = CATEGORIES.find(c => c.id === s.category) || CATEGORIES[6];
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0 mt-0.5">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-bold text-sm">{s.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[s.status] || STATUS_STYLES.pending}`}>
                          {s.status}
                        </span>
                      </div>
                      {s.description && <p className="text-slate-400 text-xs mt-1">{s.description}</p>}
                      {s.youtube_url && (
                        <a href={s.youtube_url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-xs hover:underline mt-0.5 block">
                          View on YouTube →
                        </a>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-slate-500 text-xs">by {s.submitter_name}</span>
                        <button
                          onClick={() => upvoteMutation.mutate({ id: s.id, current: s.upvotes })}
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-purple-400 transition-colors"
                        >
                          <ThumbsUp className="w-3 h-3" /> {s.upvotes || 0}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}