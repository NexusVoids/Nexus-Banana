import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';

const GAMES = [
  { id: 'sand', name: 'Sand', emoji: '🏖️', desc: 'Draw with falling sand particles', color: 'from-yellow-500 to-orange-500' },
  { id: 'life', name: 'Life', emoji: '🧬', desc: "Conway's Game of Life", color: 'from-green-500 to-emerald-600' },
  { id: 'universe', name: 'Size of Space', emoji: '🌌', desc: 'How big is the universe?', color: 'from-indigo-600 to-purple-700' },
  { id: 'password', name: 'Password Game', emoji: '🔐', desc: 'The password game — can you win?', color: 'from-red-500 to-pink-600' },
  { id: 'human', name: 'Reaction Time', emoji: '⚡', desc: 'Test your reaction speed', color: 'from-cyan-500 to-blue-600' },
  { id: 'budget', name: 'US Budget', emoji: '💰', desc: 'Allocate the US federal budget', color: 'from-green-600 to-teal-600' },
  { id: 'gravity', name: 'Gravity', emoji: '🌍', desc: 'Play with gravity & planets', color: 'from-slate-600 to-gray-700' },
  { id: 'type', name: 'Typing Speed', emoji: '⌨️', desc: 'Test your typing speed', color: 'from-violet-500 to-purple-600' },
  { id: 'billgates', name: "Spend Bill's Money", emoji: '💸', desc: "Spend Bill Gates' fortune!", color: 'from-green-400 to-emerald-600' },
  { id: 'circle', name: 'Perfect Circle', emoji: '⭕', desc: 'Can you draw a perfect circle?', color: 'from-pink-500 to-rose-600' },
  { id: 'snake', name: 'Snake', emoji: '🐍', desc: 'Classic snake game', color: 'from-lime-500 to-green-600' },
  { id: 'wordle', name: 'Word Guess', emoji: '🔤', desc: 'Guess the 5-letter word', color: 'from-amber-500 to-yellow-600' },
  { id: 'ageof', name: 'Guess My Age', emoji: '🎂', desc: 'Can the AI guess your age?', color: 'from-fuchsia-500 to-purple-600' },
  { id: 'sortcolor', name: 'Sort Colors', emoji: '🎨', desc: 'Sort the colors from dark to light', color: 'from-red-400 to-pink-500' },
  { id: 'clickspeed', name: 'Click Speed', emoji: '🖱️', desc: 'How many clicks in 10 seconds?', color: 'from-orange-500 to-red-500' },
  { id: 'memory', name: 'Memory Grid', emoji: '🧠', desc: 'Memorize and repeat the pattern', color: 'from-blue-500 to-indigo-600' },
  { id: 'hangman', name: 'Hangman', emoji: '🪢', desc: 'Classic word guessing game', color: 'from-slate-500 to-zinc-600' },
  { id: 'tictactoe', name: 'Tic Tac Toe', emoji: '❌', desc: 'Play vs computer or a friend', color: 'from-teal-500 to-cyan-600' },
  { id: 'numbercrunch', name: 'Number Crunch', emoji: '🔢', desc: 'Tap numbers 1-25 in order fast!', color: 'from-blue-600 to-violet-600' },
  { id: 'colorblind', name: 'Color Blind Test', emoji: '👁️', desc: 'Can you see the hidden number?', color: 'from-rose-500 to-red-600' },
  { id: 'trivia', name: 'Random Trivia', emoji: '🧩', desc: 'Test your knowledge!', color: 'from-cyan-600 to-teal-600' },
  { id: 'mathrace', name: 'Math Race', emoji: '🏁', desc: 'Solve math as fast as you can!', color: 'from-orange-500 to-yellow-500' },
  { id: 'flipping', name: 'Coin Flip Stats', emoji: '🪙', desc: 'Flip coins — track the odds!', color: 'from-yellow-600 to-amber-700' },
  { id: 'morse', name: 'Morse Code', emoji: '📡', desc: 'Learn and test Morse code!', color: 'from-slate-600 to-slate-800' },
];

export default function NealFun({ onClose }) {
  const [active, setActive] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#111] overflow-y-auto"
    >
      <div className="min-h-screen">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            {active && (
              <button onClick={() => setActive(null)} className="text-white/60 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-2xl font-black text-white">
              {active ? GAMES.find(g => g.id === active)?.name : 'Neal.fun'}
            </h1>
            {!active && <span className="text-white/40 text-sm">— fun things to do on the internet</span>}
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!active ? (
            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {GAMES.map((g, i) => (
                  <motion.button
                    key={g.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.04, y: -4 }}
                    onClick={() => setActive(g.id)}
                    className={`p-5 rounded-2xl bg-gradient-to-br ${g.color} text-left shadow-xl`}
                  >
                    <div className="text-4xl mb-2">{g.emoji}</div>
                    <div className="text-white font-bold">{g.name}</div>
                    <div className="text-white/70 text-xs mt-1">{g.desc}</div>
                  </motion.button>
                ))}
              </div>
              <p className="text-center text-white/20 text-sm mt-8">100% offline — no internet required 🎉</p>
            </motion.div>
          ) : (
            <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[calc(100vh-65px)]">
              <GameComponent id={active} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function GameComponent({ id }) {
  if (id === 'sand') return <SandGame />;
  if (id === 'life') return <LifeGame />;
  if (id === 'universe') return <UniverseScale />;
  if (id === 'password') return <PasswordGame />;
  if (id === 'human') return <ReactionTest />;
  if (id === 'budget') return <BudgetGame />;
  if (id === 'gravity') return <GravityGame />;
  if (id === 'type') return <TypeSpeed />;
  if (id === 'billgates') return <BillGatesGame />;
  if (id === 'circle') return <PerfectCircle />;
  if (id === 'snake') return <SnakeGame />;
  if (id === 'wordle') return <WordleGame />;
  if (id === 'ageof') return <GuessAge />;
  if (id === 'sortcolor') return <SortColors />;
  if (id === 'clickspeed') return <ClickSpeed />;
  if (id === 'memory') return <MemoryGrid />;
  if (id === 'hangman') return <Hangman />;
  if (id === 'tictactoe') return <TicTacToe />;
  if (id === 'numbercrunch') return <NumberCrunch />;
  if (id === 'colorblind') return <ColorBlindTest />;
  if (id === 'trivia') return <TriviaGame />;
  if (id === 'mathrace') return <MathRace />;
  if (id === 'flipping') return <CoinFlip />;
  if (id === 'morse') return <MorseCode />;
  return null;
}

// ─── SAND GAME ───
function SandGame() {
  const canvasRef = useRef(null);
  const gridRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, down: false });
  const animRef = useRef(null);
  const brushRef = useRef('sand');
  const [brush, setBrush] = useState('sand');
  const COLS = 120, ROWS = 80, CELL = 6;
  const COLORS = { sand: ['#f4d44d','#e8c841','#f0cf60'], water: ['#4fc3f7','#29b6f6','#81d4fa'], stone: ['#9e9e9e','#757575','#bdbdbd'], fire: ['#ff5722','#ff7043','#ffab40'], empty: null };

  const setBrushBoth = (t) => { brushRef.current = t; setBrush(t); };

  useEffect(() => {
    gridRef.current = Array.from({ length: ROWS }, () => Array(COLS).fill(null).map(() => ({ type: 'empty', color: null })));
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const paint = (mx, my) => {
      const col = Math.floor(mx / CELL);
      const row = Math.floor(my / CELL);
      const t = brushRef.current;
      for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) {
        const r = row + dr, c = col + dc;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
          const palette = COLORS[t];
          gridRef.current[r][c] = t === 'empty' ? { type: 'empty', color: null } : { type: t, color: palette[Math.floor(Math.random() * palette.length)] };
        }
      }
    };

    const update = () => {
      const g = gridRef.current;
      if (mouseRef.current.down) paint(mouseRef.current.x, mouseRef.current.y);
      const newG = g.map(row => row.map(c => ({ ...c })));
      for (let r = ROWS - 1; r >= 0; r--) {
        for (let c = 0; c < COLS; c++) {
          const cell = g[r][c];
          if (cell.type === 'sand') {
            if (r + 1 < ROWS && newG[r+1][c].type === 'empty') {
              newG[r+1][c] = cell; newG[r][c] = { type: 'empty', color: null };
            } else if (r + 1 < ROWS && c - 1 >= 0 && newG[r+1][c-1].type === 'empty') {
              newG[r+1][c-1] = cell; newG[r][c] = { type: 'empty', color: null };
            } else if (r + 1 < ROWS && c + 1 < COLS && newG[r+1][c+1].type === 'empty') {
              newG[r+1][c+1] = cell; newG[r][c] = { type: 'empty', color: null };
            }
          } else if (cell.type === 'water') {
            if (r + 1 < ROWS && newG[r+1][c].type === 'empty') {
              newG[r+1][c] = cell; newG[r][c] = { type: 'empty', color: null };
            } else {
              const dir = Math.random() > 0.5 ? 1 : -1;
              if (c + dir >= 0 && c + dir < COLS && newG[r][c+dir].type === 'empty') {
                newG[r][c+dir] = cell; newG[r][c] = { type: 'empty', color: null };
              }
            }
          } else if (cell.type === 'fire') {
            if (Math.random() < 0.05) newG[r][c] = { type: 'empty', color: null };
            else if (r - 1 >= 0 && newG[r-1][c].type === 'empty' && Math.random() < 0.3) {
              newG[r-1][c] = { type: 'fire', color: COLORS.fire[Math.floor(Math.random()*3)] };
            }
          }
        }
      }
      gridRef.current = newG;
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        if (gridRef.current[r][c].type !== 'empty') {
          ctx.fillStyle = gridRef.current[r][c].color;
          ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
        }
      }
      animRef.current = requestAnimationFrame(update);
    };
    animRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animRef.current);
  }, []); // only run once — brush is read via ref

  const handleMouse = (e, down) => {
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, down };
  };

  return (
    <div className="flex flex-col items-center h-full bg-[#111] p-4 gap-4 overflow-y-auto">
      <div className="flex gap-2 flex-wrap justify-center">
        {Object.keys(COLORS).map(t => (
          <button key={t} onClick={() => setBrushBoth(t)}
            className={`px-4 py-2 rounded-xl font-bold text-sm capitalize transition-all ${brush === t ? 'ring-2 ring-white bg-white/20 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
            {t === 'empty' ? '🗑 Erase' : t === 'sand' ? '🏖 Sand' : t === 'water' ? '💧 Water' : t === 'stone' ? '🪨 Stone' : '🔥 Fire'}
          </button>
        ))}
        <button onClick={() => { gridRef.current = Array.from({ length: ROWS }, () => Array(COLS).fill(null).map(() => ({ type: 'empty', color: null }))); }}
          className="px-4 py-2 rounded-xl font-bold text-sm bg-white/5 text-white/60 hover:bg-white/10">🗑 Clear All</button>
      </div>
      <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL}
        className="rounded-xl cursor-crosshair border border-white/10 max-w-full"
        onMouseMove={e => handleMouse(e, mouseRef.current.down)}
        onMouseDown={e => handleMouse(e, true)}
        onMouseUp={e => handleMouse(e, false)}
        onMouseLeave={() => { mouseRef.current.down = false; }}
      />
      <p className="text-white/30 text-xs">Click and drag to draw particles</p>
    </div>
  );
}

// ─── GAME OF LIFE ───
function LifeGame() {
  const canvasRef = useRef(null);
  const gridRef = useRef([]);
  const runRef = useRef(false);
  const [running, setRunning] = useState(false);
  const animRef = useRef(null);
  const COLS = 100, ROWS = 60, CELL = 8;

  const randomize = () => {
    gridRef.current = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => Math.random() < 0.3));
  };

  useEffect(() => {
    randomize();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const draw = () => {
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
      ctx.fillStyle = '#4ade80';
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        if (gridRef.current[r]?.[c]) ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
      }
    };
    const step = () => {
      const g = gridRef.current;
      const next = Array.from({ length: ROWS }, (_, r) => Array.from({ length: COLS }, (_, c) => {
        let n = 0;
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = (r + dr + ROWS) % ROWS, nc = (c + dc + COLS) % COLS;
          if (g[nr]?.[nc]) n++;
        }
        return g[r][c] ? n === 2 || n === 3 : n === 3;
      }));
      gridRef.current = next;
    };
    let last = 0;
    const loop = (ts) => {
      if (ts - last > 100) { if (runRef.current) step(); draw(); last = ts; }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const toggle = () => { runRef.current = !runRef.current; setRunning(r => !r); };

  return (
    <div className="flex flex-col items-center h-full bg-[#111] p-4 gap-4">
      <div className="flex gap-3">
        <button onClick={toggle} className={`px-5 py-2 rounded-xl font-bold text-sm ${running ? 'bg-red-500 text-white' : 'bg-green-500 text-black'}`}>
          {running ? '⏸ Pause' : '▶ Play'}
        </button>
        <button onClick={() => { randomize(); }} className="px-5 py-2 rounded-xl font-bold text-sm bg-white/10 text-white hover:bg-white/20">
          🎲 Randomize
        </button>
        <button onClick={() => { gridRef.current = Array.from({ length: ROWS }, () => Array(COLS).fill(false)); }} className="px-5 py-2 rounded-xl font-bold text-sm bg-white/10 text-white hover:bg-white/20">
          🗑 Clear
        </button>
      </div>
      <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} className="rounded-xl border border-white/10" />
    </div>
  );
}

// ─── UNIVERSE SCALE ───
function UniverseScale() {
  const [idx, setIdx] = useState(0);
  const items = [
    { name: 'Proton', size: '0.0000000000001 mm', emoji: '⚛️', color: 'from-red-600 to-orange-600' },
    { name: 'Atom', size: '0.0000001 mm', emoji: '🔵', color: 'from-orange-500 to-yellow-500' },
    { name: 'Virus', size: '0.0001 mm', emoji: '🦠', color: 'from-green-500 to-teal-500' },
    { name: 'Human Cell', size: '0.01 mm', emoji: '🔬', color: 'from-cyan-500 to-blue-500' },
    { name: 'Ant', size: '1 mm', emoji: '🐜', color: 'from-yellow-600 to-amber-600' },
    { name: 'Human', size: '1.7 m', emoji: '🧍', color: 'from-purple-500 to-violet-600' },
    { name: 'Mount Everest', size: '8,849 m', emoji: '🏔️', color: 'from-slate-500 to-gray-600' },
    { name: 'Earth', size: '12,742 km', emoji: '🌍', color: 'from-blue-600 to-green-600' },
    { name: 'The Sun', size: '1.4 million km', emoji: '☀️', color: 'from-yellow-400 to-orange-500' },
    { name: 'Solar System', size: '287 billion km', emoji: '🪐', color: 'from-indigo-500 to-purple-700' },
    { name: 'Milky Way', size: '946 quadrillion km', emoji: '🌌', color: 'from-purple-800 to-indigo-900' },
    { name: 'Observable Universe', size: '880 sextillion km', emoji: '✨', color: 'from-black to-indigo-950' },
  ];
  const cur = items[idx];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-6 bg-[#0a0a1a]">
      <motion.div key={idx} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`w-40 h-40 rounded-full bg-gradient-to-br ${cur.color} flex items-center justify-center text-6xl shadow-2xl`}>
        {cur.emoji}
      </motion.div>
      <div className="text-center">
        <motion.h2 key={`name-${idx}`} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl font-black text-white">{cur.name}</motion.h2>
        <motion.p key={`size-${idx}`} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-white/50 mt-2">{cur.size}</motion.p>
      </div>
      <div className="flex gap-4">
        <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0} className="px-8 py-3 bg-white/10 rounded-xl text-white font-bold disabled:opacity-30 hover:bg-white/20">← Smaller</button>
        <button onClick={() => setIdx(i => Math.min(items.length - 1, i + 1))} disabled={idx === items.length - 1} className="px-8 py-3 bg-white/10 rounded-xl text-white font-bold disabled:opacity-30 hover:bg-white/20">Bigger →</button>
      </div>
      <div className="flex gap-1">
        {items.map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/20'}`} />)}
      </div>
    </div>
  );
}

// ─── PASSWORD GAME ───
function PasswordGame() {
  const [pw, setPw] = useState('');
  const rules = [
    { label: 'At least 8 characters', check: p => p.length >= 8 },
    { label: 'Includes a number', check: p => /\d/.test(p) },
    { label: 'Includes an uppercase letter', check: p => /[A-Z]/.test(p) },
    { label: 'Includes a special character (!@#$%)', check: p => /[!@#$%^&*]/.test(p) },
    { label: 'Includes a month (e.g. January)', check: p => /january|february|march|april|may|june|july|august|september|october|november|december/i.test(p) },
    { label: 'Includes a Roman numeral', check: p => /\b(I|V|X|L|C|D|M)+\b/.test(p) },
    { label: 'Digits sum to 25', check: p => p.match(/\d/g)?.reduce((a,b) => a + +b, 0) === 25 },
    { label: 'Includes an emoji', check: p => /\p{Emoji}/u.test(p) },
    { label: 'Length is a prime number', check: p => { const n = p.length; if (n < 2) return false; for (let i=2;i<=Math.sqrt(n);i++) if(n%i===0) return false; return true; }},
    { label: 'Includes "🐔" (chicken emoji)', check: p => p.includes('🐔') },
  ];
  const passed = rules.filter(r => r.check(pw)).length;
  const allDone = passed === rules.length;
  return (
    <div className="flex flex-col items-center h-full bg-[#111] p-6 gap-6 overflow-y-auto">
      <div className="w-full max-w-lg">
        <h2 className="text-2xl font-black text-white mb-2">The Password Game</h2>
        <p className="text-white/40 text-sm mb-4">Your password must satisfy all rules.</p>
        <input value={pw} onChange={e => setPw(e.target.value)} placeholder="Type your password..."
          className="w-full bg-[#1e1e2e] border border-white/20 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-purple-500 mb-6" />
        {allDone && <div className="text-center text-2xl font-black text-green-400 mb-4">🎉 You WIN! Great password!</div>}
        <div className="space-y-2">
          {rules.map((r, i) => {
            const ok = r.check(pw);
            const show = i === 0 || rules[i-1].check(pw);
            if (!show && !ok) return null;
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-3 p-3 rounded-xl ${ok ? 'bg-green-500/10 border border-green-500/30' : 'bg-white/5 border border-white/10'}`}>
                <span className="text-xl">{ok ? '✅' : '❌'}</span>
                <span className={ok ? 'text-green-300' : 'text-white/60'}>Rule {i+1}: {r.label}</span>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-4 text-center text-white/30 text-sm">{passed}/{rules.length} rules passed</div>
      </div>
    </div>
  );
}

// ─── REACTION TEST ───
function ReactionTest() {
  const [phase, setPhase] = useState('wait'); // wait, ready, click, result
  const [results, setResults] = useState([]);
  const startRef = useRef(null);
  const timerRef = useRef(null);

  const start = () => {
    setPhase('ready');
    const delay = 2000 + Math.random() * 4000;
    timerRef.current = setTimeout(() => { startRef.current = Date.now(); setPhase('click'); }, delay);
  };

  const handleClick = () => {
    if (phase === 'wait') { start(); return; }
    if (phase === 'ready') { clearTimeout(timerRef.current); setPhase('wait'); return; }
    if (phase === 'click') {
      const t = Date.now() - startRef.current;
      setResults(r => [...r.slice(-9), t]);
      setPhase('result');
    }
    if (phase === 'result') start();
  };

  const avg = results.length ? Math.round(results.reduce((a,b)=>a+b,0)/results.length) : null;

  return (
    <div onClick={handleClick} className={`flex flex-col items-center justify-center h-full cursor-pointer transition-colors ${
      phase === 'click' ? 'bg-green-500' : phase === 'ready' ? 'bg-red-900' : 'bg-[#1a1a2e]'
    }`}>
      <div className="text-center pointer-events-none">
        {phase === 'wait' && <><p className="text-4xl font-black text-white">Click to Start</p><p className="text-white/50 mt-2">Click anywhere when the screen turns green</p></>}
        {phase === 'ready' && <><p className="text-4xl font-black text-white">Wait for green...</p><p className="text-white/50 mt-2">Don't click yet! (click to restart)</p></>}
        {phase === 'click' && <p className="text-5xl font-black text-white">CLICK NOW!</p>}
        {phase === 'result' && <>
          <p className="text-6xl font-black text-white">{results[results.length-1]}ms</p>
          <p className="text-white/60 mt-2">Click to try again</p>
          {avg && <p className="text-white/40 mt-1">Average: {avg}ms ({results.length} tries)</p>}
        </>}
      </div>
      {results.length > 0 && (
        <div className="absolute bottom-8 flex gap-2">
          {results.map((r, i) => <div key={i} className="bg-white/20 px-3 py-1 rounded-lg text-white text-sm">{r}ms</div>)}
        </div>
      )}
    </div>
  );
}

// ─── US BUDGET ───
function BudgetGame() {
  const total = 6500; // billions
  const [allocs, setAllocs] = useState({ Defense: 900, Healthcare: 1600, 'Social Security': 1300, Education: 200, Infrastructure: 150, NASA: 25, Environment: 50, Other: 2275 });
  const used = Object.values(allocs).reduce((a,b)=>a+b,0);
  const left = total - used;
  return (
    <div className="h-full overflow-y-auto bg-[#111] p-6">
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-black text-white mb-1">Allocate the US Budget</h2>
        <p className="text-white/40 text-sm mb-6">Total budget: ${total}B &nbsp;|&nbsp; Remaining: <span className={left < 0 ? 'text-red-400' : 'text-green-400'}>${left}B</span></p>
        <div className="space-y-4">
          {Object.entries(allocs).map(([k, v]) => (
            <div key={k}>
              <div className="flex justify-between text-sm mb-1"><span className="text-white">{k}</span><span className="text-white/60">${v}B</span></div>
              <input type="range" min={0} max={3000} step={25} value={v}
                onChange={e => setAllocs(a => ({ ...a, [k]: +e.target.value }))}
                className="w-full accent-cyan-500" />
            </div>
          ))}
        </div>
        <div className={`mt-6 p-4 rounded-xl text-center font-bold ${left === 0 ? 'bg-green-500/20 text-green-400' : left < 0 ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/50'}`}>
          {left === 0 ? '✅ Budget balanced!' : left < 0 ? `⚠️ Over budget by $${Math.abs(left)}B` : `$${left}B unallocated`}
        </div>
      </div>
    </div>
  );
}

// ─── GRAVITY ───
function GravityGame() {
  const canvasRef = useRef(null);
  const bodiesRef = useRef([]);
  const animRef = useRef(null);

  useEffect(() => {
    bodiesRef.current = [
      { x: 400, y: 250, vx: 0, vy: 0, mass: 5000, radius: 30, color: '#f59e0b', fixed: true },
      { x: 600, y: 250, vx: 0, vy: -3, mass: 10, radius: 8, color: '#60a5fa', fixed: false },
      { x: 250, y: 250, vx: 0, vy: 4, mass: 10, radius: 8, color: '#34d399', fixed: false },
    ];
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const G = 200;

    const step = () => {
      const b = bodiesRef.current;
      for (let i = 0; i < b.length; i++) {
        if (b[i].fixed) continue;
        let ax = 0, ay = 0;
        for (let j = 0; j < b.length; j++) {
          if (i === j) continue;
          const dx = b[j].x - b[i].x, dy = b[j].y - b[i].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          const f = G * b[j].mass / (dist * dist + 100);
          ax += f * dx / dist; ay += f * dy / dist;
        }
        b[i].vx += ax * 0.016; b[i].vy += ay * 0.016;
        b[i].x += b[i].vx; b[i].y += b[i].vy;
        if (b[i].x < 0 || b[i].x > 800) b[i].vx *= -1;
        if (b[i].y < 0 || b[i].y > 500) b[i].vy *= -1;
      }
      ctx.fillStyle = 'rgba(17,17,17,0.2)';
      ctx.fillRect(0, 0, 800, 500);
      for (const body of b) {
        ctx.beginPath();
        ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2);
        ctx.fillStyle = body.color;
        ctx.fill();
      }
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const addBody = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const colors = ['#f472b6','#a78bfa','#fb923c','#4ade80'];
    bodiesRef.current.push({ x, y, vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5, mass: 10 + Math.random()*30, radius: 6+Math.random()*8, color: colors[Math.floor(Math.random()*4)], fixed: false });
  };

  return (
    <div className="flex flex-col items-center h-full bg-[#111] p-4 gap-4">
      <p className="text-white/40 text-sm">Click anywhere to add a new body. Watch gravity do its thing!</p>
      <canvas ref={canvasRef} width={800} height={500} onClick={addBody} className="rounded-xl border border-white/10 cursor-crosshair max-w-full" />
    </div>
  );
}

// ─── BILL GATES MONEY ───
function BillGatesGame() {
  const BUDGET = 120000000000; // $120 billion
  const items = [
    { name: 'Big Mac', price: 5, emoji: '🍔' },
    { name: 'Coffee', price: 5, emoji: '☕' },
    { name: 'Movie Ticket', price: 15, emoji: '🎬' },
    { name: 'iPhone 15', price: 999, emoji: '📱' },
    { name: 'MacBook Pro', price: 2499, emoji: '💻' },
    { name: 'Rolex Watch', price: 10000, emoji: '⌚' },
    { name: 'Tesla Model S', price: 90000, emoji: '🚗' },
    { name: 'Private Jet', price: 65000000, emoji: '✈️' },
    { name: 'Yacht', price: 7500000, emoji: '🛥️' },
    { name: 'NBA Team', price: 2500000000, emoji: '🏀' },
    { name: 'Island', price: 50000000, emoji: '🏝️' },
    { name: 'Mansion', price: 50000000, emoji: '🏰' },
  ];
  const [cart, setCart] = useState({});
  const spent = items.reduce((s, it) => s + (cart[it.name] || 0) * it.price, 0);
  const left = BUDGET - spent;
  const pct = Math.min(100, (spent / BUDGET) * 100);
  const fmt = (n) => n >= 1e9 ? `$${(n/1e9).toFixed(2)}B` : n >= 1e6 ? `$${(n/1e6).toFixed(1)}M` : `$${n.toLocaleString()}`;

  return (
    <div className="h-full overflow-y-auto bg-[#0a1a0a] p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-black text-green-400 mb-1">💸 Spend Bill Gates' Money</h2>
        <p className="text-white/40 text-sm mb-4">Budget: {fmt(BUDGET)} — Spent: <span className="text-green-400">{fmt(spent)}</span> — Left: <span className={left < 0 ? 'text-red-400' : 'text-green-300'}>{fmt(left)}</span></p>
        <div className="w-full bg-white/10 rounded-full h-3 mb-6">
          <div className="h-3 rounded-full bg-gradient-to-r from-green-500 to-yellow-400 transition-all" style={{ width: `${pct}%` }} />
        </div>
        {left < 0 && <div className="text-center text-2xl font-black text-green-400 mb-4">🎉 You spent it all! Congrats, you're broke!</div>}
        <div className="grid grid-cols-2 gap-3">
          {items.map(it => (
            <div key={it.name} className="bg-white/5 rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{it.emoji}</span>
                <div>
                  <p className="text-white font-bold text-sm">{it.name}</p>
                  <p className="text-green-400 text-xs">{fmt(it.price)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-between">
                <button onClick={() => setCart(c => ({ ...c, [it.name]: Math.max(0, (c[it.name]||0)-1) }))} className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 font-black hover:bg-red-500/40">−</button>
                <span className="text-white font-bold">{cart[it.name] || 0}</span>
                <button onClick={() => setCart(c => ({ ...c, [it.name]: (c[it.name]||0)+1 }))} className="w-7 h-7 rounded-lg bg-green-500/20 text-green-400 font-black hover:bg-green-500/40">+</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PERFECT CIRCLE ───
function PerfectCircle() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const pointsRef = useRef([]);

  const startDraw = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    pointsRef.current = [{ x: e.clientX - rect.left, y: e.clientY - rect.top }];
    setDrawing(true);
    setScore(null);
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, 500, 400);
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pointsRef.current[0].x, pointsRef.current[0].y);
  };
  const moveDraw = (e) => {
    if (!drawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const pt = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    pointsRef.current.push(pt);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
  };
  const endDraw = () => {
    if (!drawing || pointsRef.current.length < 10) { setDrawing(false); return; }
    setDrawing(false);
    const pts = pointsRef.current;
    const cx = pts.reduce((s,p)=>s+p.x,0)/pts.length;
    const cy = pts.reduce((s,p)=>s+p.y,0)/pts.length;
    const radii = pts.map(p => Math.sqrt((p.x-cx)**2+(p.y-cy)**2));
    const avgR = radii.reduce((a,b)=>a+b,0)/radii.length;
    const variance = radii.reduce((s,r)=>s+(r-avgR)**2,0)/radii.length;
    const stddev = Math.sqrt(variance);
    const pct = Math.max(0, Math.min(100, 100 - (stddev / avgR) * 150));
    // Draw ideal circle
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = 'rgba(74,222,128,0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5,5]);
    ctx.beginPath();
    ctx.arc(cx, cy, avgR, 0, Math.PI*2);
    ctx.stroke();
    ctx.setLineDash([]);
    setScore(Math.round(pct));
  };

  return (
    <div className="flex flex-col items-center h-full bg-[#111] p-6 gap-4">
      <h2 className="text-xl font-black text-white">Draw a Perfect Circle</h2>
      <p className="text-white/40 text-sm">Click and drag to draw. Release to see your score!</p>
      <canvas ref={canvasRef} width={500} height={380}
        className="rounded-2xl border border-white/10 bg-[#0a0a15] cursor-crosshair max-w-full"
        onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
      />
      {score !== null && (
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <p className={`text-5xl font-black ${score >= 90 ? 'text-green-400' : score >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>{score}%</p>
          <p className="text-white/50 mt-1">{score >= 95 ? '🏆 PERFECT!' : score >= 85 ? '⭐ Excellent!' : score >= 70 ? '👍 Pretty good!' : score >= 50 ? '🙂 Not bad!' : '😅 Keep trying!'}</p>
        </motion.div>
      )}
    </div>
  );
}

// ─── SNAKE GAME ───
function SnakeGame() {
  const COLS = 20, ROWS = 16, CELL = 22;
  const [state, setState] = useState('idle');
  const snakeRef = useRef([{ x: 10, y: 8 }]);
  const dirRef = useRef({ x: 1, y: 0 });
  const foodRef = useRef({ x: 15, y: 8 });
  const [score, setScore] = useState(0);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  const placeFood = () => {
    foodRef.current = { x: Math.floor(Math.random()*COLS), y: Math.floor(Math.random()*ROWS) };
  };

  const draw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0a0a15';
    ctx.fillRect(0, 0, COLS*CELL, ROWS*CELL);
    // Food
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(foodRef.current.x*CELL+CELL/2, foodRef.current.y*CELL+CELL/2, CELL/2-2, 0, Math.PI*2);
    ctx.fill();
    // Snake
    snakeRef.current.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#4ade80' : '#22c55e';
      ctx.fillRect(seg.x*CELL+1, seg.y*CELL+1, CELL-2, CELL-2);
    });
  };

  const startGame = () => {
    snakeRef.current = [{ x: 10, y: 8 }];
    dirRef.current = { x: 1, y: 0 };
    placeFood();
    setScore(0);
    setState('playing');
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const s = snakeRef.current;
      const head = { x: s[0].x + dirRef.current.x, y: s[0].y + dirRef.current.y };
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || s.some(seg => seg.x === head.x && seg.y === head.y)) {
        clearInterval(intervalRef.current);
        setState('dead');
        return;
      }
      const ate = head.x === foodRef.current.x && head.y === foodRef.current.y;
      const newSnake = [head, ...s];
      if (!ate) newSnake.pop();
      else { placeFood(); setScore(sc => sc + 1); }
      snakeRef.current = newSnake;
      draw();
    }, 120);
  };

  useEffect(() => { draw(); }, []);
  useEffect(() => () => clearInterval(intervalRef.current), []);

  useEffect(() => {
    const handler = (e) => {
      const map = { ArrowUp:{x:0,y:-1}, ArrowDown:{x:0,y:1}, ArrowLeft:{x:-1,y:0}, ArrowRight:{x:1,y:0} };
      if (map[e.key]) { e.preventDefault(); const d = map[e.key]; if (d.x !== -dirRef.current.x || d.y !== -dirRef.current.y) dirRef.current = d; }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex flex-col items-center h-full bg-[#0a0a15] p-6 gap-4">
      <div className="flex items-center gap-6">
        <p className="text-white font-bold">Score: <span className="text-green-400">{score}</span></p>
        <button onClick={startGame} className="px-5 py-2 bg-green-500 text-black font-black rounded-xl hover:bg-green-400">
          {state === 'idle' ? '▶ Start' : state === 'dead' ? '🔄 Restart' : '🔄 Restart'}
        </button>
      </div>
      {state === 'dead' && <p className="text-red-400 font-black text-xl">💀 Game Over! Score: {score}</p>}
      <canvas ref={canvasRef} width={COLS*CELL} height={ROWS*CELL} className="rounded-xl border border-white/10 max-w-full" />
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div /><button onMouseDown={() => dirRef.current.y !== 1 && (dirRef.current = {x:0,y:-1})} className="w-12 h-12 bg-white/10 rounded-xl text-white text-xl hover:bg-white/20">▲</button><div />
        <button onMouseDown={() => dirRef.current.x !== 1 && (dirRef.current = {x:-1,y:0})} className="w-12 h-12 bg-white/10 rounded-xl text-white text-xl hover:bg-white/20">◀</button>
        <button onMouseDown={() => dirRef.current.y !== -1 && (dirRef.current = {x:0,y:1})} className="w-12 h-12 bg-white/10 rounded-xl text-white text-xl hover:bg-white/20">▼</button>
        <button onMouseDown={() => dirRef.current.x !== -1 && (dirRef.current = {x:1,y:0})} className="w-12 h-12 bg-white/10 rounded-xl text-white text-xl hover:bg-white/20">▶</button>
      </div>
    </div>
  );
}

// ─── WORDLE ───
function WordleGame() {
  const WORDS = ['PLANT','CRANE','SHADE','BRICK','FLAME','GHOST','TRACK','SWORD','BLADE','STOVE','CROWN','BRAVE','CLOUD','TIGER','PIANO','STORM','GRAPE','MAGIC','OCEAN','PEARL'];
  const [answer] = useState(() => WORDS[Math.floor(Math.random()*WORDS.length)]);
  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState('');
  const [done, setDone] = useState(false);

  const submit = () => {
    if (current.length !== 5 || done) return;
    const newGuesses = [...guesses, current.toUpperCase()];
    setGuesses(newGuesses);
    setCurrent('');
    if (current.toUpperCase() === answer || newGuesses.length >= 6) setDone(true);
  };

  const getTileColor = (guess, i, letter) => {
    if (letter === answer[i]) return 'bg-green-600 border-green-500';
    if (answer.includes(letter)) return 'bg-yellow-600 border-yellow-500';
    return 'bg-slate-700 border-slate-600';
  };

  return (
    <div className="flex flex-col items-center h-full bg-[#111] p-6 gap-4 overflow-y-auto">
      <h2 className="text-xl font-black text-white">🔤 Word Guess</h2>
      <p className="text-white/40 text-xs">Guess the 5-letter word in 6 tries</p>
      <div className="space-y-1.5">
        {Array.from({length:6},(_,row) => (
          <div key={row} className="flex gap-1.5">
            {Array.from({length:5},(_,col) => {
              const guess = guesses[row];
              const letter = guess ? guess[col] : (row === guesses.length ? current[col] : '');
              const color = guess ? getTileColor(guess, col, guess[col]) : 'bg-slate-800 border-slate-600';
              return <div key={col} className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-white font-black text-lg ${color}`}>{letter || ''}</div>;
            })}
          </div>
        ))}
      </div>
      {done && <div className="text-center"><p className={`text-2xl font-black ${guesses[guesses.length-1] === answer ? 'text-green-400' : 'text-red-400'}`}>{guesses[guesses.length-1] === answer ? '🎉 Correct!' : `😢 Answer: ${answer}`}</p></div>}
      {!done && (
        <div className="flex gap-2">
          <input value={current} onChange={e => setCurrent(e.target.value.slice(0,5).toUpperCase())} onKeyDown={e => e.key === 'Enter' && submit()} maxLength={5}
            className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-white font-black text-lg w-32 text-center focus:outline-none focus:border-purple-500 uppercase" placeholder="WORD" />
          <button onClick={submit} disabled={current.length!==5} className="px-5 py-2 bg-purple-600 rounded-xl text-white font-bold hover:bg-purple-500 disabled:opacity-30">Enter</button>
        </div>
      )}
    </div>
  );
}

// ─── GUESS AGE ───
function GuessAge() {
  const questions = [
    { q: "Pick a social media you actually use:", opts: ["TikTok", "Facebook", "Instagram", "LinkedIn"] },
    { q: "What music do you vibe with?", opts: ["Pop/Hip-Hop", "Rock/Metal", "Country", "Classical"] },
    { q: "How do you feel about Mondays?", opts: ["Literally fine", "Mild dread", "Deep suffering", "Retired, don't care"] },
    { q: "Your preferred way to pay:", opts: ["Phone tap", "Card tap", "Card swipe", "Cash only"] },
    { q: "Your phone storage situation:", opts: ["Cloud everything", "Always full", "Delete old apps", "What's cloud?"] },
  ];
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const cur = answers.length;

  const answer = (opt) => {
    const newAnswers = [...answers, opt];
    if (newAnswers.length === questions.length) {
      // Fake "AI" age logic
      const scores = { TikTok: -8, Facebook: 12, Instagram: 2, LinkedIn: 15, "Pop/Hip-Hop": -3, "Rock/Metal": 5, Country: 8, Classical: 20, "Literally fine": -5, "Mild dread": 5, "Deep suffering": 10, "Retired, don't care": 25, "Phone tap": -5, "Card tap": 0, "Card swipe": 8, "Cash only": 15, "Cloud everything": -3, "Always full": 3, "Delete old apps": 6, "What's cloud?": 20 };
      const base = 22;
      const total = newAnswers.reduce((s, a) => s + (scores[a] || 0), base);
      setResult(Math.max(13, Math.min(80, total)));
    } else {
      setAnswers(newAnswers);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0d0d1a] p-6 gap-6">
      {result ? (
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <p className="text-white/50 text-lg mb-2">The AI thinks you are...</p>
          <p className="text-8xl font-black text-fuchsia-400">{result}</p>
          <p className="text-white/40 mt-3">years old 🎂</p>
          <button onClick={() => { setAnswers([]); setResult(null); }} className="mt-6 px-6 py-3 bg-fuchsia-600 rounded-xl text-white font-bold hover:bg-fuchsia-500">Try Again</button>
        </motion.div>
      ) : (
        <div className="max-w-md w-full">
          <div className="flex gap-1 mb-6">
            {questions.map((_, i) => <div key={i} className={`flex-1 h-1.5 rounded-full ${i < cur ? 'bg-fuchsia-500' : 'bg-white/10'}`} />)}
          </div>
          <motion.p key={cur} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-xl font-bold text-white mb-6 text-center">{questions[cur].q}</motion.p>
          <div className="grid grid-cols-2 gap-3">
            {questions[cur].opts.map(opt => (
              <button key={opt} onClick={() => answer(opt)} className="p-4 bg-white/5 hover:bg-fuchsia-500/20 border border-white/10 hover:border-fuchsia-500/50 rounded-2xl text-white font-semibold transition-all">{opt}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SORT COLORS ───
function SortColors() {
  const generate = () => {
    const hues = Array.from({length: 8}, (_, i) => Math.round((i / 8) * 360));
    return hues.sort(() => Math.random() - 0.5).map((h, i) => ({ id: i, hue: h }));
  };
  const [tiles, setTiles] = useState(generate);
  const [done, setDone] = useState(false);
  const [moves, setMoves] = useState(0);
  const [dragging, setDragging] = useState(null);

  const drop = (targetId) => {
    if (dragging === null || dragging === targetId) return;
    const newTiles = [...tiles];
    const fromIdx = newTiles.findIndex(t => t.id === dragging);
    const toIdx = newTiles.findIndex(t => t.id === targetId);
    [newTiles[fromIdx], newTiles[toIdx]] = [newTiles[toIdx], newTiles[fromIdx]];
    setTiles(newTiles);
    setMoves(m => m + 1);
    setDragging(null);
    // Check sorted
    const sorted = newTiles.every((t, i) => i === 0 || newTiles[i-1].hue <= t.hue);
    if (sorted) setDone(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#111] p-6 gap-6">
      <h2 className="text-xl font-black text-white">Sort the Colors</h2>
      <p className="text-white/40 text-sm">Drag to sort from dark red → through the rainbow → back to red</p>
      {done ? (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <p className="text-4xl font-black text-green-400">🎉 Sorted!</p>
          <p className="text-white/50 mt-2">{moves} moves</p>
          <button onClick={() => { setTiles(generate()); setDone(false); setMoves(0); }} className="mt-4 px-6 py-3 bg-green-600 rounded-xl text-white font-bold">Play Again</button>
        </motion.div>
      ) : (
        <>
          <div className="flex gap-3 flex-wrap justify-center">
            {tiles.map(t => (
              <div key={t.id} draggable
                onDragStart={() => setDragging(t.id)}
                onDragOver={e => e.preventDefault()}
                onDrop={() => drop(t.id)}
                className={`w-16 h-16 rounded-2xl cursor-grab active:cursor-grabbing border-4 transition-all ${dragging === t.id ? 'border-white scale-110' : 'border-transparent'}`}
                style={{ background: `hsl(${t.hue}, 80%, 55%)` }} />
            ))}
          </div>
          <p className="text-white/30 text-sm">Moves: {moves}</p>
        </>
      )}
    </div>
  );
}

// ─── CLICK SPEED ───
function ClickSpeed() {
  const [phase, setPhase] = useState('idle');
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef(null);

  const start = () => {
    setPhase('playing');
    setClicks(0);
    setTimeLeft(10);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setPhase('done'); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0a0a1a] gap-6 p-6">
      <h2 className="text-2xl font-black text-white">🖱️ Click Speed Test</h2>
      {phase === 'done' ? (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <p className="text-7xl font-black text-orange-400">{clicks}</p>
          <p className="text-white/50 mt-2">clicks in 10 seconds = {(clicks/10).toFixed(1)} CPS</p>
          <p className="text-white/30 text-sm mt-1">{clicks >= 100 ? '🏆 Insane!' : clicks >= 70 ? '🔥 Great!' : clicks >= 50 ? '👍 Decent!' : '😅 Keep practicing!'}</p>
          <button onClick={() => { setPhase('idle'); setClicks(0); setTimeLeft(10); }} className="mt-6 px-6 py-3 bg-orange-600 rounded-xl text-white font-bold hover:bg-orange-500">Try Again</button>
        </motion.div>
      ) : (
        <>
          {phase === 'playing' && <p className="text-5xl font-black text-orange-400">{timeLeft}s</p>}
          <button
            onClick={phase === 'idle' ? start : () => setClicks(c => c + 1)}
            className={`w-48 h-48 rounded-full text-white font-black text-2xl transition-all active:scale-95 shadow-2xl
              ${phase === 'idle' ? 'bg-gradient-to-br from-orange-500 to-red-600 hover:scale-105' :
              'bg-gradient-to-br from-orange-400 to-red-500 hover:brightness-110'}`}
          >
            {phase === 'idle' ? 'START' : `CLICK!\n${clicks}`}
          </button>
          {phase === 'playing' && <p className="text-3xl font-black text-white">{clicks} clicks</p>}
        </>
      )}
    </div>
  );
}

// ─── MEMORY GRID ───
function MemoryGrid() {
  const SIZE = 4;
  const [phase, setPhase] = useState('idle'); // idle, show, input, win, lose
  const [pattern, setPattern] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [level, setLevel] = useState(1);
  const [flash, setFlash] = useState(null);

  const startLevel = (lvl) => {
    const count = 3 + lvl;
    const cells = Array.from({length: SIZE*SIZE}, (_, i) => i);
    const selected = cells.sort(() => Math.random()-0.5).slice(0, count);
    setPattern(selected);
    setUserInput([]);
    setPhase('show');
    let i = 0;
    const showNext = () => {
      if (i >= selected.length) { setFlash(null); setPhase('input'); return; }
      setFlash(selected[i]);
      i++;
      setTimeout(() => { setFlash(null); setTimeout(showNext, 300); }, 600);
    };
    setTimeout(showNext, 500);
  };

  const handleCell = (idx) => {
    if (phase !== 'input') return;
    if (userInput.includes(idx)) return;
    const newInput = [...userInput, idx];
    setUserInput(newInput);
    if (!pattern.includes(idx)) { setPhase('lose'); return; }
    if (newInput.length === pattern.length) { setPhase('win'); }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0d0d1a] gap-6 p-6">
      <h2 className="text-2xl font-black text-white">🧠 Memory Grid</h2>
      <p className="text-white/40 text-sm">
        {phase === 'idle' && 'Watch the pattern, then click the same cells!'}
        {phase === 'show' && '👀 Memorize...'}
        {phase === 'input' && `Click the ${pattern.length} highlighted cells!`}
        {phase === 'win' && '🎉 Correct! Next level!'}
        {phase === 'lose' && '💀 Wrong! Try again.'}
      </p>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
        {Array.from({length: SIZE*SIZE}, (_, i) => {
          const isPattern = pattern.includes(i);
          const isFlash = flash === i;
          const isSelected = userInput.includes(i);
          return (
            <button key={i} onClick={() => handleCell(i)}
              className={`w-14 h-14 rounded-xl transition-all border-2 ${
                isFlash ? 'bg-blue-400 border-blue-300 scale-110' :
                phase === 'show' && isPattern ? 'bg-blue-900 border-blue-700' :
                isSelected && isPattern ? 'bg-green-500 border-green-400' :
                isSelected ? 'bg-red-500 border-red-400' :
                phase === 'win' && isPattern ? 'bg-green-500/30 border-green-500/50' :
                'bg-white/5 border-white/10 hover:bg-white/10'
              }`} />
          );
        })}
      </div>
      {(phase === 'idle' || phase === 'win' || phase === 'lose') && (
        <button onClick={() => { const lvl = phase === 'win' ? level + 1 : 1; setLevel(lvl); startLevel(lvl); }}
          className="px-8 py-3 bg-blue-600 rounded-xl text-white font-black hover:bg-blue-500">
          {phase === 'idle' ? '▶ Start' : phase === 'win' ? `Level ${level + 1} →` : '🔄 Restart'}
        </button>
      )}
      {phase !== 'idle' && <p className="text-white/30 text-sm">Level {level}</p>}
    </div>
  );
}

// ─── HANGMAN ───
function Hangman() {
  const WORDS = ['BANANA','PYTHON','GALAXY','PUZZLE','KNIGHT','WIZARD','CACTUS','JUNGLE','BRIDGE','PLANET','SHADOW','BOTTLE','CASTLE','MIRROR','ROCKET'];
  const [word] = useState(() => WORDS[Math.floor(Math.random()*WORDS.length)]);
  const [guessed, setGuessed] = useState(new Set());
  const wrong = [...guessed].filter(l => !word.includes(l));
  const won = word.split('').every(l => guessed.has(l));
  const lost = wrong.length >= 6;

  const guess = (l) => { if (!won && !lost) setGuessed(s => new Set([...s, l])); };

  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="flex flex-col items-center h-full bg-[#0d0d0d] p-6 gap-5 overflow-y-auto">
      <h2 className="text-2xl font-black text-white">🪢 Hangman</h2>
      {/* Stick figure */}
      <svg width="140" height="130" className="mt-2">
        <line x1="20" y1="125" x2="120" y2="125" stroke="#fff" strokeWidth="3"/>
        <line x1="70" y1="10" x2="70" y2="125" stroke="#fff" strokeWidth="3"/>
        <line x1="70" y1="10" x2="110" y2="10" stroke="#fff" strokeWidth="3"/>
        <line x1="110" y1="10" x2="110" y2="25" stroke="#fff" strokeWidth="3"/>
        {wrong.length >= 1 && <circle cx="110" cy="35" r="10" stroke="#ef4444" strokeWidth="3" fill="none"/>}
        {wrong.length >= 2 && <line x1="110" y1="45" x2="110" y2="80" stroke="#ef4444" strokeWidth="3"/>}
        {wrong.length >= 3 && <line x1="110" y1="55" x2="90" y2="70" stroke="#ef4444" strokeWidth="3"/>}
        {wrong.length >= 4 && <line x1="110" y1="55" x2="130" y2="70" stroke="#ef4444" strokeWidth="3"/>}
        {wrong.length >= 5 && <line x1="110" y1="80" x2="90" y2="100" stroke="#ef4444" strokeWidth="3"/>}
        {wrong.length >= 6 && <line x1="110" y1="80" x2="130" y2="100" stroke="#ef4444" strokeWidth="3"/>}
      </svg>
      <div className="flex gap-3">
        {word.split('').map((l, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className={`text-2xl font-black ${won ? 'text-green-400' : lost ? 'text-red-400' : 'text-white'}`}>{guessed.has(l) ? l : '_'}</span>
            <div className="w-6 h-0.5 bg-white/30" />
          </div>
        ))}
      </div>
      {(won || lost) && <p className={`text-xl font-black ${won ? 'text-green-400' : 'text-red-400'}`}>{won ? '🎉 You win!' : `😢 It was ${word}`}</p>}
      <div className="flex flex-wrap gap-1.5 max-w-xs justify-center">
        {ALPHA.map(l => (
          <button key={l} onClick={() => guess(l)} disabled={guessed.has(l) || won || lost}
            className={`w-9 h-9 rounded-lg font-bold text-sm transition-all ${
              guessed.has(l) ? (word.includes(l) ? 'bg-green-600/40 text-green-300' : 'bg-red-900/40 text-red-400') : 'bg-white/10 text-white hover:bg-white/20 disabled:opacity-30'
            }`}>{l}</button>
        ))}
      </div>
      <p className="text-white/30 text-sm">{wrong.length}/6 wrong guesses</p>
    </div>
  );
}

// ─── TIC TAC TOE ───
function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);
  const [vsAI, setVsAI] = useState(true);

  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const getWinner = (b) => { for (const [a,c,d] of wins) if (b[a] && b[a]===b[c] && b[a]===b[d]) return b[a]; return b.every(Boolean) ? 'Draw' : null; };

  const aiMove = (b) => {
    const empty = b.map((v,i)=>v?null:i).filter(i=>i!==null);
    for (const combo of wins) { const [a,c,d] = combo; if (b[a]==='O'&&b[c]==='O'&&!b[d]) return d; if (b[a]==='O'&&b[d]==='O'&&!b[c]) return c; if (b[c]==='O'&&b[d]==='O'&&!b[a]) return a; }
    for (const combo of wins) { const [a,c,d] = combo; if (b[a]==='X'&&b[c]==='X'&&!b[d]) return d; if (b[a]==='X'&&b[d]==='X'&&!b[c]) return c; if (b[c]==='X'&&b[d]==='X'&&!b[a]) return a; }
    if (!b[4]) return 4;
    return empty[Math.floor(Math.random()*empty.length)];
  };

  const click = (i) => {
    const winner = getWinner(board);
    if (board[i] || winner) return;
    const nb = [...board]; nb[i] = xTurn ? 'X' : 'O';
    setBoard(nb); setXTurn(!xTurn);
    if (vsAI && xTurn && !getWinner(nb)) {
      setTimeout(() => {
        const ai = aiMove(nb);
        if (ai !== undefined) {
          const nb2 = [...nb]; nb2[ai] = 'O';
          setBoard(nb2); setXTurn(true);
        }
      }, 300);
    }
  };

  const winner = getWinner(board);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0d0d1a] gap-6 p-6">
      <h2 className="text-2xl font-black text-white">❌ Tic Tac Toe</h2>
      <div className="flex gap-2">
        <button onClick={() => setVsAI(true)} className={`px-4 py-2 rounded-xl text-sm font-bold ${vsAI ? 'bg-teal-600 text-white' : 'bg-white/10 text-white/60'}`}>vs AI</button>
        <button onClick={() => setVsAI(false)} className={`px-4 py-2 rounded-xl text-sm font-bold ${!vsAI ? 'bg-teal-600 text-white' : 'bg-white/10 text-white/60'}`}>vs Friend</button>
      </div>
      {winner ? <p className={`text-xl font-black ${winner === 'Draw' ? 'text-yellow-400' : 'text-green-400'}`}>{winner === 'Draw' ? "It's a draw!" : `${winner} wins! 🎉`}</p>
        : <p className="text-white/50">{xTurn ? "X's turn" : "O's turn"}</p>}
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button key={i} onClick={() => click(i)}
            className={`w-20 h-20 rounded-2xl text-4xl font-black border-2 transition-all hover:scale-105 ${
              cell === 'X' ? 'bg-teal-500/20 border-teal-500/50 text-teal-400' :
              cell === 'O' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
              'bg-white/5 border-white/10 hover:bg-white/10'
            }`}>{cell}</button>
        ))}
      </div>
      <button onClick={() => { setBoard(Array(9).fill(null)); setXTurn(true); }} className="px-6 py-2 bg-white/10 rounded-xl text-white font-bold hover:bg-white/20">Reset</button>
    </div>
  );
}

// ─── TYPE SPEED ───
function TypeSpeed() {
  const texts = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump!",
    "The five boxing wizards jump quickly.",
    "Sphinx of black quartz, judge my vow.",
  ];
  const [textIdx] = useState(() => Math.floor(Math.random() * texts.length));
  const target = texts[textIdx];
  const [typed, setTyped] = useState('');
  const [start, setStart] = useState(null);
  const [done, setDone] = useState(false);

  const handleType = (e) => {
    if (done) return;
    if (!start) setStart(Date.now());
    const v = e.target.value;
    setTyped(v);
    if (v === target) setDone(true);
  };

  const elapsed = start && done ? ((Date.now() - start) / 1000).toFixed(2) : null;
  const wpm = elapsed ? Math.round((target.split(' ').length / elapsed) * 60) : null;

  return (
    <div className="flex flex-col items-center h-full bg-[#111] p-8 gap-6">
      <div className="max-w-2xl w-full">
        <h2 className="text-2xl font-black text-white mb-6 text-center">⌨️ Typing Speed Test</h2>
        <div className="bg-[#1e1e2e] rounded-2xl p-6 mb-6 text-xl font-mono leading-relaxed">
          {target.split('').map((ch, i) => {
            const typedCh = typed[i];
            return (
              <span key={i} className={typedCh === undefined ? 'text-white/30' : typedCh === ch ? 'text-green-400' : 'text-red-400 bg-red-500/20'}>
                {ch}
              </span>
            );
          })}
        </div>
        <textarea value={typed} onChange={handleType} disabled={done}
          placeholder="Start typing here..."
          className="w-full bg-[#1e1e2e] border border-white/20 rounded-xl p-4 text-white font-mono text-lg focus:outline-none focus:border-purple-500 resize-none h-24" />
        {done && (
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mt-6">
            <p className="text-5xl font-black text-green-400">{wpm} WPM</p>
            <p className="text-white/50 mt-2">Completed in {elapsed}s</p>
            <button onClick={() => { setTyped(''); setStart(null); setDone(false); }} className="mt-4 px-6 py-3 bg-purple-600 rounded-xl text-white font-bold hover:bg-purple-500">Try Again</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── NUMBER CRUNCH ───
function NumberCrunch() {
  const [numbers, setNumbers] = useState([]);
  const [next, setNext] = useState(1);
  const [phase, setPhase] = useState('idle');
  const [time, setTime] = useState(0);
  const startRef = useRef(null);
  const timerRef = useRef(null);

  const start = () => {
    const nums = Array.from({length:25},(_,i)=>i+1).sort(()=>Math.random()-0.5);
    const positions = nums.map((n,i)=>({n,x:5+((i%5)*19),y:5+Math.floor(i/5)*18}));
    setNumbers(positions); setNext(1); setPhase('playing');
    startRef.current = Date.now();
    timerRef.current = setInterval(()=>setTime(((Date.now()-startRef.current)/1000).toFixed(2)),50);
  };

  const click = (n) => {
    if(n!==next) return;
    if(n===25){clearInterval(timerRef.current);setPhase('done');}
    setNext(n+1);
    setNumbers(prev=>prev.filter(x=>x.n!==n));
  };

  useEffect(()=>()=>clearInterval(timerRef.current),[]);

  return(
    <div className="flex flex-col items-center justify-center h-full bg-[#0a0a1a] gap-4 p-4">
      <h2 className="text-2xl font-black text-white">🔢 Number Crunch</h2>
      <p className="text-white/40 text-sm">Click numbers 1 → 25 in order as fast as possible!</p>
      {phase!=='idle'&&<p className="text-blue-400 font-black text-2xl">{time}s</p>}
      {phase==='done'?<motion.div initial={{scale:0}}animate={{scale:1}}className="text-center"><p className="text-5xl font-black text-green-400">{time}s!</p><p className="text-white/50 mt-2">{time<10?'🏆 Insane!':time<20?'⭐ Great!':'👍 Nice!'}</p><button onClick={()=>{setPhase('idle');setTime(0);setNumbers([]);}} className="mt-4 px-6 py-3 bg-blue-600 rounded-xl text-white font-bold">Play Again</button></motion.div>:(
      phase==='idle'?<button onClick={start} className="px-8 py-4 bg-blue-600 text-white font-black rounded-xl text-xl hover:bg-blue-500">▶ Start</button>:(
      <div className="relative w-full max-w-sm h-64 border border-white/10 rounded-2xl bg-white/5">
        {numbers.map(({n,x,y})=>(
          <button key={n} onClick={()=>click(n)}
            className={`absolute w-10 h-8 rounded-lg font-black text-sm transition-all hover:scale-110 ${n===next?'bg-blue-500 text-white ring-2 ring-blue-300':'bg-white/10 text-white/70'}`}
            style={{left:`${x}%`,top:`${y}%`}}>{n}</button>
        ))}
        <p className="absolute bottom-2 right-3 text-white/30 text-xs">Next: {next}</p>
      </div>
    ))}
    </div>
  );
}

// ─── COLOR BLIND TEST ───
function ColorBlindTest() {
  const PLATES = [
    {number:12,bg:'#c8a87a',dots:'#7a9c5c',distract:'#c8a87a'},
    {number:8,bg:'#b89a5a',dots:'#5c7a3a',distract:'#c8a87a'},
    {number:5,bg:'#c8b87a',dots:'#7a5c3a',distract:'#a8c87a'},
    {number:29,bg:'#a89a7a',dots:'#5a7a9c',distract:'#a87a5a'},
    {number:74,bg:'#9a8a6a',dots:'#6a8a4a',distract:'#a87a4a'},
  ];
  const [idx,setIdx]=useState(0);
  const [guess,setGuess]=useState('');
  const [results,setResults]=useState([]);
  const plate=PLATES[idx];

  const submit=()=>{
    if(!guess.trim()) return;
    const correct=parseInt(guess)===plate.number;
    setResults(r=>[...r,{number:plate.number,guess,correct}]);
    setGuess('');
    if(idx+1<PLATES.length) setIdx(i=>i+1);
    else setIdx(PLATES.length);
  };

  const done=idx>=PLATES.length;
  const score=results.filter(r=>r.correct).length;

  // Generate dot pattern SVG
  const generateDots = (p) => {
    const dots=[];
    const SIZE=180;
    // Background dots
    for(let i=0;i<300;i++){
      const x=Math.sin(i*2.3+1)*80+90,y=Math.cos(i*1.7+0.5)*80+90;
      const r=4+Math.sin(i*3)*2;
      dots.push(<circle key={`b${i}`} cx={x} cy={y} r={r} fill={p.bg} opacity={0.7+Math.sin(i)*0.3}/>);
    }
    // Number dots
    const numStr=String(p.number);
    const positions=numStr==='12'?[[60,70],[60,90],[60,110],[75,60],[90,70],[90,80],[90,90],[75,100],[75,120],[110,70],[110,90],[110,110],[110,130]]:
      numStr==='8'?[[80,60],[80,80],[80,100],[80,120],[100,60],[100,120],[90,90]]:
      numStr==='5'?[[80,60],[90,60],[100,60],[80,80],[90,90],[100,100],[80,120],[90,120],[100,120]]:
      [[70,70],[80,70],[90,70],[70,90],[70,110],[80,110],[90,110],[90,90],[80,90],[100,90],[100,110]];
    positions.forEach((pos,i)=>dots.push(<circle key={`n${i}`} cx={pos[0]} cy={pos[1]} r={7} fill={p.dots} opacity={0.9}/>));
    return dots;
  };

  return(
    <div className="flex flex-col items-center justify-center h-full bg-[#111] gap-5 p-6">
      <h2 className="text-2xl font-black text-white">👁️ Color Blind Test</h2>
      {done?(
        <div className="text-center">
          <p className="text-5xl font-black text-white mb-2">{score}/{PLATES.length}</p>
          <p className={`text-xl ${score>=4?'text-green-400':score>=2?'text-yellow-400':'text-red-400'}`}>{score>=4?'Normal color vision 👍':score>=2?'Possible color deficiency ⚠️':'May have color blindness 🔴'}</p>
          <p className="text-white/30 text-xs mt-2">This is not a medical diagnosis.</p>
          {results.map((r,i)=><p key={i} className={`text-sm mt-1 ${r.correct?'text-green-400':'text-red-400'}`}>{r.correct?'✅':'❌'} Plate {i+1}: Was {r.number}, you said {r.guess}</p>)}
          <button onClick={()=>{setIdx(0);setResults([]);setGuess('');}} className="mt-4 px-6 py-3 bg-rose-600 rounded-xl text-white font-bold">Try Again</button>
        </div>
      ):(
        <>
          <p className="text-white/40 text-sm">Plate {idx+1} of {PLATES.length} — What number do you see?</p>
          <svg width={180} height={180} className="rounded-full border-4 border-white/20">
            <circle cx={90} cy={90} r={90} fill={plate.bg}/>
            {generateDots(plate)}
          </svg>
          <div className="flex gap-3">
            <input value={guess} onChange={e=>setGuess(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()}
              placeholder="Enter number..." type="number"
              className="bg-[#1e1e2e] border border-white/20 rounded-xl px-4 py-3 text-white w-36 text-center text-2xl font-black focus:outline-none focus:border-rose-500"/>
            <button onClick={submit} disabled={!guess} className="px-6 py-3 bg-rose-600 rounded-xl text-white font-bold hover:bg-rose-500 disabled:opacity-30">Submit</button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── TRIVIA ───
function TriviaGame() {
  const QUESTIONS = [
    {q:"What is the chemical symbol for gold?",opts:["Au","Go","Gd","Ag"],a:0},
    {q:"How many bones are in the adult human body?",opts:["196","206","216","186"],a:1},
    {q:"What planet is known as the Red Planet?",opts:["Venus","Jupiter","Mars","Saturn"],a:2},
    {q:"Who painted the Mona Lisa?",opts:["Van Gogh","Picasso","Da Vinci","Rembrandt"],a:2},
    {q:"What is the largest ocean on Earth?",opts:["Atlantic","Indian","Arctic","Pacific"],a:3},
    {q:"How many sides does a hexagon have?",opts:["5","6","7","8"],a:1},
    {q:"What is the fastest land animal?",opts:["Lion","Cheetah","Leopard","Horse"],a:1},
    {q:"What year did World War II end?",opts:["1943","1944","1945","1946"],a:2},
    {q:"What is the capital of Japan?",opts:["Seoul","Beijing","Tokyo","Bangkok"],a:2},
    {q:"How many strings does a standard guitar have?",opts:["4","5","6","7"],a:2},
  ];
  const [qi,setQi]=useState(0);
  const [score,setScore]=useState(0);
  const [picked,setPicked]=useState(null);
  const [done,setDone]=useState(false);
  const q=QUESTIONS[qi];

  const pick=(i)=>{
    if(picked!==null) return;
    setPicked(i);
    if(i===q.a) setScore(s=>s+1);
    setTimeout(()=>{
      if(qi+1>=QUESTIONS.length){setDone(true);}
      else{setQi(qi=>qi+1);setPicked(null);}
    },1000);
  };

  return(
    <div className="flex flex-col items-center justify-center h-full bg-[#0a1a1a] gap-6 p-6">
      {done?(
        <div className="text-center">
          <p className="text-6xl font-black text-cyan-400">{score}/{QUESTIONS.length}</p>
          <p className="text-white/50 mt-2">{score>=9?'🏆 Perfect!':score>=7?'⭐ Great!':score>=5?'👍 Good!':'📚 Study more!'}</p>
          <button onClick={()=>{setQi(0);setScore(0);setPicked(null);setDone(false);}} className="mt-6 px-6 py-3 bg-cyan-600 rounded-xl text-white font-bold">Play Again</button>
        </div>
      ):(
        <>
          <div className="flex gap-1 w-full max-w-sm">
            {QUESTIONS.map((_,i)=><div key={i} className={`flex-1 h-1.5 rounded-full ${i<qi?'bg-cyan-500':i===qi?'bg-white':'bg-white/10'}`}/>)}
          </div>
          <p className="text-white/40 text-sm">Question {qi+1} of {QUESTIONS.length} • Score: {score}</p>
          <motion.p key={qi} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="text-xl font-bold text-white text-center max-w-sm">{q.q}</motion.p>
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            {q.opts.map((opt,i)=>(
              <button key={i} onClick={()=>pick(i)} disabled={picked!==null}
                className={`p-4 rounded-2xl font-semibold text-sm transition-all border-2 ${
                  picked===null?'bg-white/5 border-white/10 text-white hover:bg-cyan-500/20 hover:border-cyan-500':
                  i===q.a?'bg-green-500/20 border-green-400 text-green-300':
                  i===picked?'bg-red-500/20 border-red-400 text-red-300':
                  'bg-white/5 border-white/10 text-white/40'
                }`}>{opt}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── MATH RACE ───
function MathRace() {
  const [phase,setPhase]=useState('idle');
  const [q,setQ]=useState(null);
  const [input,setInput]=useState('');
  const [score,setScore]=useState(0);
  const [timeLeft,setTimeLeft]=useState(60);
  const [streak,setStreak]=useState(0);
  const timerRef=useRef(null);
  const inputRef=useRef(null);

  const makeQ=()=>{
    const ops=['+','-','×'];
    const op=ops[Math.floor(Math.random()*ops.length)];
    let a,b,ans;
    if(op==='+'){a=Math.floor(Math.random()*50)+1;b=Math.floor(Math.random()*50)+1;ans=a+b;}
    else if(op==='-'){a=Math.floor(Math.random()*50)+20;b=Math.floor(Math.random()*a)+1;ans=a-b;}
    else{a=Math.floor(Math.random()*12)+1;b=Math.floor(Math.random()*12)+1;ans=a*b;}
    return{text:`${a} ${op} ${b}`,ans};
  };

  const start=()=>{
    setScore(0);setStreak(0);setTimeLeft(60);setQ(makeQ());setPhase('playing');setInput('');
    timerRef.current=setInterval(()=>setTimeLeft(t=>{if(t<=1){clearInterval(timerRef.current);setPhase('done');return 0;}return t-1;}),1000);
    setTimeout(()=>inputRef.current?.focus(),100);
  };

  const submit=()=>{
    if(!input.trim()||!q) return;
    if(parseInt(input)===q.ans){
      const pts=1+(streak>=4?2:streak>=2?1:0);
      setScore(s=>s+pts);setStreak(s=>s+1);
    } else setStreak(0);
    setQ(makeQ());setInput('');
    inputRef.current?.focus();
  };

  useEffect(()=>()=>clearInterval(timerRef.current),[]);

  return(
    <div className="flex flex-col items-center justify-center h-full bg-[#0a0a0a] gap-6 p-6">
      <h2 className="text-2xl font-black text-white">🏁 Math Race</h2>
      {phase==='idle'&&<button onClick={start} className="px-8 py-4 bg-orange-600 text-white font-black rounded-xl text-xl hover:bg-orange-500">▶ Start (60s)</button>}
      {phase==='playing'&&(
        <>
          <div className="flex items-center gap-8">
            <p className="text-orange-400 font-black text-3xl">{timeLeft}s</p>
            <p className="text-white font-bold">Score: <span className="text-yellow-400 text-xl">{score}</span></p>
            {streak>=3&&<p className="text-orange-300 font-bold">🔥 x{streak} streak!</p>}
          </div>
          <motion.p key={q?.text} initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} className="text-5xl font-black text-white">{q?.text} = ?</motion.p>
          <div className="flex gap-3">
            <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()}
              type="number" placeholder="Answer"
              className="bg-[#1e1e2e] border border-white/20 rounded-xl px-5 py-3 text-white text-2xl font-black w-36 text-center focus:outline-none focus:border-orange-500"/>
            <button onClick={submit} className="px-6 py-3 bg-orange-600 rounded-xl text-white font-bold hover:bg-orange-500">✓</button>
          </div>
        </>
      )}
      {phase==='done'&&(
        <motion.div initial={{scale:0}} animate={{scale:1}} className="text-center">
          <p className="text-6xl font-black text-orange-400">{score}</p>
          <p className="text-white/50 mt-2">points in 60 seconds!</p>
          <p className="text-white/30 text-sm">{score>=50?'🏆 Math genius!':score>=30?'⭐ Excellent!':score>=15?'👍 Good!':'📚 Keep practicing!'}</p>
          <button onClick={()=>{setPhase('idle');}} className="mt-6 px-6 py-3 bg-orange-600 rounded-xl text-white font-bold">Play Again</button>
        </motion.div>
      )}
    </div>
  );
}

// ─── COIN FLIP ───
function CoinFlip() {
  const [flips,setFlips]=useState([]);
  const [flipping,setFlipping]=useState(false);
  const heads=flips.filter(f=>f==='H').length;
  const tails=flips.filter(f=>f==='T').length;

  const flip=(n=1)=>{
    setFlipping(true);
    setTimeout(()=>{
      setFlips(f=>[...f,...Array.from({length:n},()=>Math.random()<0.5?'H':'T')]);
      setFlipping(false);
    },400);
  };

  const pct=flips.length?Math.round((heads/flips.length)*100):50;

  return(
    <div className="flex flex-col items-center justify-center h-full bg-[#0a0a0a] gap-6 p-6">
      <h2 className="text-2xl font-black text-white">🪙 Coin Flip Stats</h2>
      <motion.div animate={flipping?{rotateY:360}:{}} transition={{duration:0.4}}
        className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-5xl shadow-2xl shadow-yellow-500/30">
        🪙
      </motion.div>
      <div className="flex gap-6 text-center">
        <div><p className="text-4xl font-black text-white">{heads}</p><p className="text-white/40 text-sm">Heads</p></div>
        <div><p className="text-4xl font-black text-white">{tails}</p><p className="text-white/40 text-sm">Tails</p></div>
        <div><p className="text-4xl font-black text-cyan-400">{flips.length}</p><p className="text-white/40 text-sm">Total</p></div>
      </div>
      {flips.length>0&&(
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-sm text-white/50 mb-1"><span>Heads {pct}%</span><span>{100-pct}% Tails</span></div>
          <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all" style={{width:`${pct}%`}}/>
          </div>
        </div>
      )}
      <div className="flex gap-3 flex-wrap justify-center">
        {[1,10,100].map(n=>(
          <button key={n} onClick={()=>flip(n)} disabled={flipping}
            className="px-5 py-3 bg-yellow-600/20 border border-yellow-500/40 text-yellow-300 font-bold rounded-xl hover:bg-yellow-600/30 disabled:opacity-40">
            Flip {n===1?'1x':`${n}x`}
          </button>
        ))}
        {flips.length>0&&<button onClick={()=>setFlips([])} className="px-5 py-3 bg-white/5 text-white/50 font-bold rounded-xl hover:bg-white/10">Reset</button>}
      </div>
      <div className="flex gap-1 flex-wrap max-w-sm justify-center max-h-20 overflow-hidden">
        {flips.slice(-50).map((f,i)=><span key={i} className={`text-xs font-bold ${f==='H'?'text-yellow-400':'text-blue-400'}`}>{f}</span>)}
      </div>
    </div>
  );
}

// ─── MORSE CODE ───
function MorseCode() {
  const MORSE={'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.'};
  const [mode,setMode]=useState('translate');
  const [text,setText]=useState('');
  const [testWord,setTestWord]=useState('');
  const [testInput,setTestInput]=useState('');
  const [testResult,setTestResult]=useState(null);

  const toMorse=(t)=>t.toUpperCase().split('').map(c=>MORSE[c]||'').join(' ');
  const fromMorse=(m)=>m.trim().split(' ').map(code=>Object.entries(MORSE).find(([,v])=>v===code)?.[0]||'?').join('');

  const newTestWord=()=>{
    const words=['SOS','CAT','DOG','HELLO','NEXUS','BANANA','CODE','GAME'];
    setTestWord(words[Math.floor(Math.random()*words.length)]);
    setTestInput('');setTestResult(null);
  };

  const checkMorse=()=>{
    const answer=toMorse(testWord);
    setTestResult(testInput.trim()===answer?'correct':'wrong');
  };

  return(
    <div className="flex flex-col items-center h-full bg-[#0a0a0a] gap-4 p-6 overflow-y-auto">
      <h2 className="text-2xl font-black text-white">📡 Morse Code</h2>
      <div className="flex gap-2">
        {['translate','test','table'].map(m=><button key={m} onClick={()=>setMode(m)} className={`px-4 py-2 rounded-xl text-sm font-bold capitalize ${mode===m?'bg-slate-600 text-white':'bg-white/5 text-white/50 hover:bg-white/10'}`}>{m}</button>)}
      </div>
      {mode==='translate'&&(
        <div className="w-full max-w-sm space-y-4">
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Type text to convert to Morse..." rows={3}
            className="w-full bg-[#1e1e2e] border border-white/20 rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:border-slate-500"/>
          {text&&<div className="bg-[#1e1e2e] rounded-xl p-4"><p className="text-green-400 font-mono text-lg tracking-widest">{toMorse(text)}</p></div>}
        </div>
      )}
      {mode==='test'&&(
        <div className="w-full max-w-sm space-y-4 text-center">
          {!testWord?<button onClick={newTestWord} className="px-6 py-3 bg-slate-600 rounded-xl text-white font-bold">Start Test</button>:(
            <>
              <p className="text-white/40 text-sm">Translate this word to Morse:</p>
              <p className="text-4xl font-black text-white">{testWord}</p>
              <input value={testInput} onChange={e=>setTestInput(e.target.value)} placeholder="... --- ..."
                className="w-full bg-[#1e1e2e] border border-white/20 rounded-xl px-4 py-3 text-white font-mono text-center text-lg focus:outline-none focus:border-slate-500"/>
              <div className="flex gap-3 justify-center">
                <button onClick={checkMorse} className="px-5 py-2 bg-slate-600 rounded-xl text-white font-bold hover:bg-slate-500">Check</button>
                <button onClick={newTestWord} className="px-5 py-2 bg-white/10 rounded-xl text-white font-bold hover:bg-white/20">New Word</button>
              </div>
              {testResult&&<p className={`font-black text-xl ${testResult==='correct'?'text-green-400':'text-red-400'}`}>{testResult==='correct'?'✅ Correct!':'❌ Answer: '+toMorse(testWord)}</p>}
            </>
          )}
        </div>
      )}
      {mode==='table'&&(
        <div className="grid grid-cols-4 gap-1 max-w-md w-full">
          {Object.entries(MORSE).map(([char,code])=>(
            <div key={char} className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-white font-black">{char}</p>
              <p className="text-green-400 font-mono text-xs">{code}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}