import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, X, Clock, Bot, Send, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import {
  getCurrentUpdateCode,
  getMsUntilReset,
  formatCountdown,
  verifyUpdateCode,
} from '@/lib/rotatingCode';

export default function UpdateCodePanel({ open, onClose, onUnlock }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '', '', '']);
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [shake, setShake] = useState(0);
  const [countdown, setCountdown] = useState(getMsUntilReset());
  const inputsRef = useRef([]);

  // AI update form
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [posting, setPosting] = useState(false);
  const [result, setResult] = useState(null);
  const [aiError, setAiError] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!open) return;
    const tick = setInterval(() => setCountdown(getMsUntilReset()), 1000);
    return () => clearInterval(tick);
  }, [open]);

  useEffect(() => {
    if (open) {
      setDigits(['', '', '', '', '', '', '', '']);
      setError(false);
      setUnlocked(false);
      setPrompt('');
      setResult(null);
      setAiError('');
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    }
  }, [open]);

  // Auto-advance digit inputs
  const handleDigitChange = (i, val) => {
    const clean = val.replace(/\D/g, '').slice(-1);
    setDigits(prev => {
      const next = [...prev];
      next[i] = clean;
      return next;
    });
    if (clean && i < 7) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    } else if (e.key === 'Enter') {
      attemptUnlock();
    }
  };

  const attemptUnlock = () => {
    const entered = digits.join('');
    if (verifyUpdateCode(entered)) {
      setUnlocked(true);
      setError(false);
      localStorage.setItem('devPanelUnlocked', 'true');
      onUnlock?.();
    } else {
      setError(true);
      setShake(s => s + 1);
      setDigits(['', '', '', '', '', '', '', '']);
      setTimeout(() => inputsRef.current[0]?.focus(), 50);
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
    if (pasted.length === 8) {
      e.preventDefault();
      setDigits(pasted.split(''));
      inputsRef.current[7]?.focus();
    }
  };

  const generateUpdate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setAiError('');
    setResult(null);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are writing a website update-log entry for "NexusBanan.net", an educational gaming hub. Based on this description from a contributor: "${prompt}".\n\nGenerate a polished, exciting update entry. Return JSON with:\n- version: a semver-style string like "v2.4.1" (increment logically)\n- title: a short punchy headline (max 60 chars)\n- type: one of "major" | "minor" | "patch" | "hotfix"\n- changes: an array of 2-5 short bullet-style strings describing what changed\n- published_by: "Anonymous Contributor"`,
        response_json_schema: {
          type: 'object',
          properties: {
            version: { type: 'string' },
            title: { type: 'string' },
            type: { type: 'string', enum: ['major', 'minor', 'patch', 'hotfix'] },
            changes: { type: 'array', items: { type: 'string' } },
            published_by: { type: 'string' },
          },
          required: ['version', 'title', 'type', 'changes', 'published_by'],
        },
      });
      setResult(res);
    } catch (e) {
      setAiError('AI generation failed. Try again.');
    }
    setGenerating(false);
  };

  const publishUpdate = async () => {
    if (!result) return;
    setPosting(true);
    try {
      await base44.entities.UpdateLog.create({
        version: result.version,
        title: result.title,
        type: result.type,
        changes: result.changes || [],
        proposal_text: prompt,
        published_by: result.published_by || 'Anonymous Contributor',
        status: 'pending',
        is_core: false,
      });
      queryClient.invalidateQueries({ queryKey: ['updatelogs'] });
      setResult(null);
      setPrompt('');
      setUnlocked(false);
      onClose();
    } catch (e) {
      setAiError('Failed to post update. Try again.');
    }
    setPosting(false);
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-[90] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 rounded-3xl border border-purple-500/40 shadow-2xl shadow-purple-900/50 overflow-hidden"
      >
        {/* Neon glow accents */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative p-7">
          {!unlocked ? (
            <>
              {/* LOCKED VIEW */}
              <div className="text-center mb-6">
                <motion.div
                  animate={{ rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/40"
                >
                  <Lock className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-black text-white">Owner's Vault</h2>
                <p className="text-slate-400 text-sm mt-1">Enter the 8-digit update code</p>
              </div>

              <motion.div
                key={shake}
                animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="flex justify-center gap-1.5 sm:gap-2 mb-4"
                onPaste={handlePaste}
              >
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    value={d}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    inputMode="numeric"
                    maxLength={1}
                    className={`w-9 h-12 sm:w-11 sm:h-14 text-center text-2xl font-black rounded-xl border-2 bg-slate-800/60 text-white transition-all focus:outline-none ${
                      error
                        ? 'border-red-500/70 shadow-lg shadow-red-500/30'
                        : d
                        ? 'border-cyan-400/70 shadow-lg shadow-cyan-500/30'
                        : 'border-purple-500/30 focus:border-cyan-400'
                    }`}
                  />
                ))}
              </motion.div>

              <div className="flex items-center justify-center gap-2 mb-5 text-xs">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-500">Code resets in</span>
                <span className="font-mono font-bold text-amber-400">{formatCountdown(countdown)}</span>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-red-400 text-sm font-semibold mb-4 flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-4 h-4" /> Wrong code — try again
                  </motion.p>
                )}
              </AnimatePresence>

              <Button
                onClick={attemptUnlock}
                disabled={digits.join('').length !== 8}
                className="w-full bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 hover:opacity-90 text-lg py-6 font-black disabled:opacity-40"
              >
                <Sparkles className="w-5 h-5 mr-2" /> Unlock
              </Button>

              <p className="text-center text-[11px] text-slate-600 mt-4">
                Hint: scroll to the very bottom of the Jams section...
              </p>
            </>
          ) : (
            <>
              {/* UNLOCKED — AI UPDATE CREATOR */}
              <div className="text-center mb-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center"
                >
                  <Check className="w-7 h-7 text-white" />
                </motion.div>
                <h2 className="text-2xl font-black text-white">Vault Unlocked</h2>
                <p className="text-slate-400 text-sm mt-1">Describe an update — AI will write it</p>
              </div>

              {!result ? (
                <div className="space-y-3">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Added a new Banana Language tutorial section and fixed the chat scroll bug"
                    rows={4}
                    className="w-full bg-slate-800/70 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-400 resize-none"
                  />
                  <Button
                    onClick={generateUpdate}
                    disabled={generating || !prompt.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 py-5"
                  >
                    {generating ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="mr-2">⚡</motion.div>
                        AI is writing...
                      </>
                    ) : (
                      <>
                        <Bot className="w-5 h-5 mr-2" /> Generate Update
                      </>
                    )}
                  </Button>
                  {aiError && <p className="text-red-400 text-sm text-center">{aiError}</p>}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className="bg-slate-800/70 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase">{result.type}</span>
                      <span className="font-mono text-amber-400 text-sm">{result.version}</span>
                    </div>
                    <h3 className="text-white font-black text-lg">{result.title}</h3>
                    <ul className="space-y-1">
                      {(result.changes || []).map((c, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-cyan-500">→</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-slate-500 pt-1">by {result.published_by}</p>
                  </div>
                  {aiError && <p className="text-red-400 text-sm text-center">{aiError}</p>}
                  <div className="flex gap-2">
                    <Button onClick={() => setResult(null)} variant="outline" className="border-slate-600 text-slate-300 flex-1">
                      Redo
                    </Button>
                    <Button onClick={publishUpdate} disabled={posting} className="bg-gradient-to-r from-green-500 to-emerald-600 flex-1">
                      {posting ? 'Posting...' : (<><Send className="w-4 h-4 mr-1.5" /> Publish</>)}
                    </Button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}