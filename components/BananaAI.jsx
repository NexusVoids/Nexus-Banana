import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Shield, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';

const EXAMPLES = [
  'Add a new Sudoku game to the Math tab',
  'Make the homepage banner rainbow animated',
  'Add a daily streak counter for visitors',
  'Add dark mode toggle to the header',
];

export default function BananaAI({ open, onClose }) {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  if (!open) return null;

  const generate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError('');
    setResult(null);
    setPosted(false);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are "Banana AI", the website evolution assistant for NexusBanan.net — an educational gaming hub with game tabs (Math, Science, ELA), a community chat, user profiles, a BananBucks economy, roles & permissions, a Jams/music section, and a code/unlock system.

A user wants to change or add something to the website. Their request: "${prompt}"

Generate a structured update proposal.

HARD RULE — CORE MECHANICS CAN NOT BE DELETED: You may NEVER propose deleting, removing, disabling, or replacing these core mechanics: the game tabs (Math, Science, ELA, BananQuiz), the chat system, user accounts/profiles, the BananBucks economy, roles & permissions, the Jams/music section, the code/unlock system, the Update Log, and the Dev Panel. You CAN improve, extend, tweak, or add to them — but never remove them. If the user asks to delete a core mechanic, refuse and propose a safe alternative instead.

Return ONLY a JSON object with:
{
  "version": a semver string like "v2.5.0" (increment logically),
  "title": a short punchy headline (max 60 chars),
  "type": one of "major" | "minor" | "patch" | "hotfix",
  "changes": an array of 2-4 short bullet-style strings describing what will change,
  "proposal_text": the user's request rephrased in one sentence,
  "published_by": "Banana AI"
}`,
        response_json_schema: {
          type: 'object',
          properties: {
            version: { type: 'string' },
            title: { type: 'string' },
            type: { type: 'string', enum: ['major', 'minor', 'patch', 'hotfix'] },
            changes: { type: 'array', items: { type: 'string' } },
            proposal_text: { type: 'string' },
            published_by: { type: 'string' },
          },
          required: ['version', 'title', 'type', 'changes', 'proposal_text', 'published_by'],
        },
      });
      setResult(res);
    } catch (e) {
      setError('Banana AI had trouble thinking. Try again!');
    }
    setGenerating(false);
  };

  const submitProposal = async () => {
    if (!result) return;
    setPosting(true);
    setError('');
    try {
      await base44.entities.UpdateLog.create({
        version: result.version,
        title: result.title,
        type: result.type,
        changes: result.changes || [],
        proposal_text: result.proposal_text || prompt,
        published_by: result.published_by || 'Banana AI',
        status: 'pending',
        is_core: false,
      });
      queryClient.invalidateQueries({ queryKey: ['updatelogs'] });
      setPosted(true);
      setResult(null);
      setPrompt('');
    } catch (e) {
      setError('Failed to submit proposal. Try again.');
    }
    setPosting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-[95] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-gradient-to-br from-yellow-950/60 via-slate-900 to-purple-950/60 rounded-3xl border border-yellow-500/40 shadow-2xl shadow-orange-900/40 overflow-hidden"
      >
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>

        <div className="relative p-6 sm:p-7">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-orange-500/30">
              🍌
            </motion.div>
            <div>
              <h2 className="text-2xl font-black text-white">Banana AI</h2>
              <p className="text-yellow-300/70 text-xs">Describe a change — it goes to a community poll before going live</p>
            </div>
          </div>

          {/* Core protection banner */}
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 mb-4">
            <Shield className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-300/90 font-semibold">Core mechanics can not be deleted — the AI will refuse harmful requests.</p>
          </div>

          {posted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center">
                <Check className="w-7 h-7 text-white" />
              </motion.div>
              <h3 className="text-white font-bold text-lg">Proposal submitted!</h3>
              <p className="text-slate-400 text-sm mt-1">It's now in the Update Log pending poll. Get enough upvotes and it goes live.</p>
              <Button onClick={onClose} className="mt-5 bg-gradient-to-r from-green-500 to-emerald-600">Done</Button>
            </motion.div>
          ) : !result ? (
            <div className="space-y-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe a change to make to the website... e.g. 'Add a Sudoku game to the Math tab'"
                rows={4}
                className="w-full bg-slate-800/70 border border-yellow-500/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-yellow-400 resize-none"
              />
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLES.map((ex) => (
                  <button key={ex} onClick={() => setPrompt(ex)} className="text-[11px] px-2 py-1 rounded-full bg-slate-800/60 border border-slate-700 text-slate-400 hover:border-yellow-400/40 hover:text-yellow-300 transition-colors">
                    {ex}
                  </button>
                ))}
              </div>
              <Button onClick={generate} disabled={generating || !prompt.trim()} className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white py-5 font-black disabled:opacity-40">
                {generating ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Banana AI is thinking...</>) : (<><Sparkles className="w-5 h-5 mr-2" /> Generate Proposal</>)}
              </Button>
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="bg-slate-800/70 border border-yellow-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-xs font-bold uppercase">{result.type}</span>
                  <span className="font-mono text-amber-400 text-sm">{result.version}</span>
                </div>
                <h3 className="text-white font-black text-lg">{result.title}</h3>
                <ul className="space-y-1">
                  {(result.changes || []).map((c, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-yellow-500">→</span>{c}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-slate-500 italic pt-1">"{result.proposal_text}"</p>
              </div>
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              <div className="flex gap-2">
                <Button onClick={() => setResult(null)} variant="outline" className="border-slate-600 text-slate-300 flex-1">Redo</Button>
                <Button onClick={submitProposal} disabled={posting} className="bg-gradient-to-r from-green-500 to-emerald-600 flex-1">
                  {posting ? 'Submitting...' : (<><Send className="w-4 h-4 mr-1.5" /> Send to Poll</>)}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}