import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Sparkles, Search, Play, ExternalLink, ShieldCheck, ShieldAlert, Bot, Loader2, RotateCcw, Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

const SUGGESTIONS = ['Minecraft', 'Roblox', 'Chess', '2048', "Among Us", 'Tetris', 'Cookie Clicker', 'Slope'];

export default function PlayItAI({ hasGoGuardian }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [playing, setPlaying] = useState(false);

  const search = async (gameName) => {
    const q = (gameName ?? query).trim();
    if (!q) return;
    setQuery(q);
    setLoading(true);
    setError('');
    setResult(null);
    setPlaying(false);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are "Play-it AI", an expert at finding ways to play ANY game in a web browser — even when school web filters like GoGuardian block common gaming sites.

The user wants to play: "${q}"
GoGuardian / school filtering is currently: ${hasGoGuardian ? 'ACTIVE (will block most mainstream game sites)' : 'INACTIVE (no filtering)'}.

Search the web for the best playable browser version of this game. Consider:
- Official web/HTML5 versions
- Google Sites embeds and Google Doodle versions
- Unblocked game mirrors and educational portal versions
- itch.io / poki / crazygames embeddable versions
- Whether the URL is likely to be caught by GoGuardian if filtering is active

Return ONLY a JSON object with exactly these fields:
{
  "game_name": string (the game's real name),
  "description": string (1-2 sentences about the game and its appeal),
  "best_play_url": string (the single best direct URL to actually play the game right now),
  "play_method": one of "embedded_web" | "external_site" | "google_sites_mirror" | "html5_embed" | "google_doodle",
  "is_embeddable": boolean (true if the game can be shown inside an iframe on this page),
  "is_likely_blocked": boolean (whether GoGuardian would likely block best_play_url),
  "blocked_note": string (if blocked: a short note + a suggested workaround; otherwise empty string),
  "alternative_url": string (a backup URL if the primary is blocked, or empty string),
  "controls": string (brief description of how to play / controls),
  "category": string (e.g. "Puzzle", "Action", "Strategy", "Arcade")
}`,
        add_context_from_internet: true,
        model: 'gemini_3_flash',
        response_json_schema: {
          type: 'object',
          properties: {
            game_name: { type: 'string' },
            description: { type: 'string' },
            best_play_url: { type: 'string' },
            play_method: { type: 'string' },
            is_embeddable: { type: 'boolean' },
            is_likely_blocked: { type: 'boolean' },
            blocked_note: { type: 'string' },
            alternative_url: { type: 'string' },
            controls: { type: 'string' },
            category: { type: 'string' },
          },
          required: ['game_name', 'description', 'best_play_url', 'play_method', 'is_embeddable', 'is_likely_blocked', 'blocked_note', 'alternative_url', 'controls', 'category'],
        },
      });
      setResult(res);
      setHistory((h) => [{ q, res }, ...h.filter((x) => x.q !== q)].slice(0, 6));
    } catch (e) {
      setError("Play-it AI couldn't find that one. Try another game name!");
    }
    setLoading(false);
  };

  const reset = () => {
    setResult(null);
    setQuery('');
    setError('');
    setPlaying(false);
  };

  const url = result?.best_play_url;
  const altUrl = result?.alternative_url;
  const blocked = result?.is_likely_blocked && hasGoGuardian;
  const embeddable = result?.is_embeddable && !blocked;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-indigo-950/70 via-purple-950/60 to-slate-900/70 p-6 sm:p-8">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-center gap-4">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/40"
          >
            <Bot className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Play-it <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-pink-400">AI</span>
            </h2>
            <p className="text-slate-300 text-sm mt-1">Ask for any game — AI finds a way to play it, blocked or unblocked.</p>
          </div>
        </div>
        <div className="relative mt-5 flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${hasGoGuardian ? 'text-amber-400' : 'text-green-400'}`} />
          <span className={`text-xs font-semibold ${hasGoGuardian ? 'text-amber-300' : 'text-green-300'}`}>
            GoGuardian: {hasGoGuardian ? 'Active — AI will route around filters' : 'Off — full access'}
          </span>
        </div>
      </motion.div>

      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
            placeholder="Type any game name... (e.g. Minecraft, Chess, Slope)"
            className="w-full h-12 pl-10 pr-4 rounded-2xl bg-slate-800/80 border border-purple-500/30 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>
        <Button onClick={() => search()} disabled={loading || !query.trim()} className="h-12 px-6 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 hover:opacity-90 font-bold">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 mr-1.5" />}
          {loading ? 'Searching...' : 'Find'}
        </Button>
      </div>

      {/* Suggestions */}
      {!result && !loading && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => search(s)}
              className="px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700 text-slate-300 text-xs font-semibold hover:border-cyan-400/50 hover:text-cyan-300 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-purple-500/20 bg-slate-800/40 p-8 text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="text-slate-300 text-sm">Play-it AI is scanning the web for a playable version...</p>
        </motion.div>
      )}

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      {/* Result */}
      <AnimatePresence mode="wait">
        {result && !loading && (
          <motion.div
            key={result.game_name + url}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border border-purple-500/30 bg-slate-800/60 overflow-hidden"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between gap-3 flex-wrap p-4 border-b border-slate-700/50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-bold truncate">{result.game_name}</h3>
                  <span className="text-xs text-slate-400">{result.category} · {result.play_method?.replace(/_/g, ' ')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {blocked ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-bold">
                    <ShieldAlert className="w-3.5 h-3.5" /> Likely Blocked
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/15 border border-green-500/40 text-green-300 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Playable
                  </span>
                )}
                <button onClick={reset} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400" title="New search">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <p className="text-slate-300 text-sm">{result.description}</p>

              {result.controls && (
                <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-900/50 rounded-lg p-3">
                  <Gamepad2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-400" />
                  <span><span className="font-semibold text-slate-300">Controls:</span> {result.controls}</span>
                </div>
              )}

              {blocked && result.blocked_note && (
                <div className="flex items-start gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                  <Lock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>{result.blocked_note}</span>
                </div>
              )}

              {/* Embed or external play */}
              {embeddable && playing ? (
                <div className="relative w-full rounded-xl overflow-hidden border border-slate-700" style={{ paddingBottom: '62%' }}>
                  <iframe src={url} className="absolute inset-0 w-full h-full" allow="autoplay; fullscreen; gamepad" allowFullScreen />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {embeddable && (
                    <Button onClick={() => setPlaying(true)} className="bg-gradient-to-r from-green-500 to-emerald-600">
                      <Play className="w-4 h-4 mr-1.5" /> Play Here
                    </Button>
                  )}
                  {url && (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold">
                      <ExternalLink className="w-4 h-4" /> Open in New Tab
                    </a>
                  )}
                  {blocked && altUrl && (
                    <a href={altUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md border border-amber-500/50 text-amber-300 text-sm font-bold hover:bg-amber-500/10">
                      <ShieldAlert className="w-4 h-4" /> Try Unblocked Mirror
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      {history.length > 0 && !result && !loading && (
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Recent searches</p>
          <div className="space-y-2">
            {history.map((h, i) => (
              <button key={i} onClick={() => search(h.q)} className="w-full flex items-center gap-2 p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-cyan-400/40 text-left">
                <Gamepad2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="text-slate-200 text-sm font-semibold">{h.q}</span>
                <span className="text-xs text-slate-500 ml-auto">{h.res?.category}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}