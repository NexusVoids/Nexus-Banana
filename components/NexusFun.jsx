import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Zap, Trophy, Star } from 'lucide-react';

const GAMES = [
  { id: 'tetris', name: 'Tetris', emoji: '🟦', desc: 'Classic block stacking', color: 'from-blue-600 to-cyan-600', hot: true },
  { id: 'flappy', name: 'Flappy Bird', emoji: '🐦', desc: 'Tap to fly through pipes!', color: 'from-yellow-500 to-green-500', hot: true },
  { id: 'snake', name: 'Snake', emoji: '🐍', desc: 'Eat and grow!', color: 'from-lime-500 to-green-700' },
  { id: 'breakout', name: 'Breakout', emoji: '🧱', desc: 'Break all the bricks!', color: 'from-red-500 to-orange-600' },
  { id: 'dino', name: 'Dino Run', emoji: '🦕', desc: 'Jump over cacti!', color: 'from-stone-600 to-stone-800' },
  { id: 'pong', name: 'Pong vs AI', emoji: '🏓', desc: 'Beat the AI!', color: 'from-purple-600 to-pink-600' },
  { id: 'minesweeper', name: 'Minesweeper', emoji: '💣', desc: 'Find the mines!', color: 'from-gray-600 to-slate-700' },
  { id: 'connect4', name: 'Connect 4', emoji: '🔴', desc: '4 in a row wins!', color: 'from-red-600 to-yellow-500' },
  { id: 'space_invaders', name: 'Space Invaders', emoji: '👾', desc: 'Defend Earth!', color: 'from-green-700 to-emerald-900', hot: true },
  { id: 'platformer', name: 'Platformer', emoji: '🏃', desc: 'Collect all coins!', color: 'from-emerald-500 to-cyan-500' },
  { id: 'paint', name: 'Paint Studio', emoji: '🎨', desc: 'Full art canvas', color: 'from-pink-500 to-purple-600' },
  { id: 'chess2d', name: '2P Chess', emoji: '♟️', desc: 'Classic chess', color: 'from-amber-800 to-yellow-700' },
  { id: 'asteroid', name: 'Asteroids', emoji: '🚀', desc: 'Shoot the rocks!', color: 'from-slate-700 to-indigo-800' },
  { id: 'wordle2', name: 'Wordle', emoji: '🔤', desc: 'Guess the 5-letter word', color: 'from-amber-500 to-yellow-600' },
  { id: 'memory2', name: 'Memory Match', emoji: '🧠', desc: 'Match the pairs!', color: 'from-violet-500 to-indigo-600' },
];

// High scores stored in localStorage
function getHighScore(id) {
  return parseInt(localStorage.getItem(`nexus_hs_${id}`) || '0');
}
function setHighScore(id, score) {
  if (score > getHighScore(id)) localStorage.setItem(`nexus_hs_${id}`, score);
}

export default function NexusFun({ onClose }) {
  const [active, setActive] = useState(null);
  const [highScores, setHighScores] = useState({});

  useEffect(() => {
    const hs = {};
    GAMES.forEach(g => { hs[g.id] = getHighScore(g.id); });
    setHighScores(hs);
  }, [active]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#080818] overflow-y-auto"
    >
      <div className="min-h-screen">
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/30 to-cyan-900/20">
          <div className="flex items-center gap-3">
            {active && (
              <button onClick={() => setActive(null)} className="text-white/60 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <Zap className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              {active ? GAMES.find(g => g.id === active)?.name : 'Nexus.fun'}
            </h1>
            {!active && <span className="text-white/30 text-sm hidden sm:inline">— built-in arcade</span>}
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!active ? (
            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-6xl mx-auto">
                {GAMES.map((g, i) => (
                  <motion.button
                    key={g.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActive(g.id)}
                    className={`p-4 rounded-2xl bg-gradient-to-br ${g.color} text-left shadow-xl border border-white/10 relative overflow-hidden`}
                  >
                    {g.hot && <span className="absolute top-2 right-2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-black">HOT</span>}
                    <div className="text-3xl mb-2">{g.emoji}</div>
                    <div className="text-white font-bold text-sm">{g.name}</div>
                    <div className="text-white/60 text-xs mt-0.5">{g.desc}</div>
                    {highScores[g.id] > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <Trophy className="w-3 h-3 text-yellow-400" />
                        <span className="text-yellow-400 text-xs font-bold">{highScores[g.id]}</span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
              <p className="text-center text-white/20 text-sm mt-8">⚡ {GAMES.length} games • High scores saved locally</p>
            </motion.div>
          ) : (
            <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[calc(100vh-65px)]">
              <NexusGame id={active} onScore={(s) => setHighScore(active, s)} highScore={getHighScore(active)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function NexusGame({ id, onScore, highScore }) {
  if (id === 'tetris') return <TetrisGame onScore={onScore} highScore={highScore} />;
  if (id === 'flappy') return <FlappyBird onScore={onScore} highScore={highScore} />;
  if (id === 'snake') return <SnakeGame onScore={onScore} highScore={highScore} />;
  if (id === 'breakout') return <BreakoutGame onScore={onScore} highScore={highScore} />;
  if (id === 'dino') return <DinoRun onScore={onScore} highScore={highScore} />;
  if (id === 'pong') return <PongGame />;
  if (id === 'minesweeper') return <Minesweeper />;
  if (id === 'connect4') return <Connect4 />;
  if (id === 'platformer') return <PlatformerGame onScore={onScore} highScore={highScore} />;
  if (id === 'space_invaders') return <SpaceInvaders onScore={onScore} highScore={highScore} />;
  if (id === 'paint') return <PaintStudio />;
  if (id === 'chess2d') return <Chess2D />;
  if (id === 'asteroid') return <AsteroidGame onScore={onScore} highScore={highScore} />;
  if (id === 'wordle2') return <WordleGame />;
  if (id === 'memory2') return <MemoryMatch />;
  return null;
}

// ─── TETRIS ───
function TetrisGame({ onScore, highScore }) {
  const W = 10, H = 20, CELL = 26;
  const PIECES = [
    { shape: [[1,1,1,1]], color: '#00f5ff' },
    { shape: [[1,1],[1,1]], color: '#ffd600' },
    { shape: [[1,1,1],[0,1,0]], color: '#aa00ff' },
    { shape: [[1,1,1],[1,0,0]], color: '#ff6d00' },
    { shape: [[1,1,1],[0,0,1]], color: '#2979ff' },
    { shape: [[1,1,0],[0,1,1]], color: '#00e676' },
    { shape: [[0,1,1],[1,1,0]], color: '#ff1744' },
  ];
  const canvasRef = useRef(null);
  const boardRef = useRef(Array.from({ length: H }, () => Array(W).fill(null)));
  const pieceRef = useRef(null);
  const scoreRef = useRef(0);
  const runningRef = useRef(false);
  const lastDropRef = useRef(0);
  const animRef = useRef(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle, playing, over

  const rotate = (shape) => shape[0].map((_, i) => shape.map(r => r[i]).reverse());

  const newPiece = () => {
    const p = PIECES[Math.floor(Math.random() * PIECES.length)];
    return { shape: p.shape.map(r => [...r]), color: p.color, x: 3, y: 0 };
  };

  const collides = (board, piece, ox = 0, oy = 0) => {
    for (let r = 0; r < piece.shape.length; r++)
      for (let c = 0; c < piece.shape[r].length; c++)
        if (piece.shape[r][c]) {
          const nx = piece.x + c + ox, ny = piece.y + r + oy;
          if (nx < 0 || nx >= W || ny >= H || (ny >= 0 && board[ny]?.[nx])) return true;
        }
    return false;
  };

  const drawFrame = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, W * CELL, H * CELL);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) ctx.strokeRect(c * CELL, r * CELL, CELL, CELL);
    boardRef.current.forEach((row, r) => row.forEach((col, c) => {
      if (col) {
        ctx.fillStyle = col;
        ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, 4);
      }
    }));
    const p = pieceRef.current;
    if (p) {
      p.shape.forEach((row, r) => row.forEach((v, c) => {
        if (v && p.y + r >= 0) {
          ctx.fillStyle = p.color;
          ctx.fillRect((p.x + c) * CELL + 1, (p.y + r) * CELL + 1, CELL - 2, CELL - 2);
        }
      }));
    }
  }, []);

  const tick = useCallback((ts) => {
    if (!runningRef.current) return;
    if (ts - lastDropRef.current > 500) {
      const p = pieceRef.current;
      if (!p) return;
      if (!collides(boardRef.current, p, 0, 1)) {
        p.y++;
      } else {
        // Merge
        p.shape.forEach((row, r) => row.forEach((v, c) => {
          if (v && p.y + r >= 0) boardRef.current[p.y + r][p.x + c] = p.color;
        }));
        // Clear lines
        const kept = boardRef.current.filter(row => row.some(v => !v));
        const cleared = H - kept.length;
        while (kept.length < H) kept.unshift(Array(W).fill(null));
        boardRef.current = kept;
        if (cleared > 0) {
          const pts = [0, 100, 300, 500, 800][cleared] || 800;
          scoreRef.current += pts;
          setScore(scoreRef.current);
          onScore(scoreRef.current);
        }
        // Next piece
        const next = newPiece();
        if (collides(boardRef.current, next)) {
          runningRef.current = false;
          pieceRef.current = null;
          drawFrame();
          setPhase('over');
          return;
        }
        pieceRef.current = next;
      }
      lastDropRef.current = ts;
    }
    drawFrame();
    animRef.current = requestAnimationFrame(tick);
  }, [drawFrame, onScore]);

  const startGame = () => {
    boardRef.current = Array.from({ length: H }, () => Array(W).fill(null));
    scoreRef.current = 0;
    setScore(0);
    pieceRef.current = newPiece();
    runningRef.current = true;
    lastDropRef.current = 0;
    setPhase('playing');
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const handler = (e) => {
      if (!runningRef.current || !pieceRef.current) return;
      const p = pieceRef.current;
      if (e.key === 'ArrowLeft' && !collides(boardRef.current, p, -1)) { p.x--; drawFrame(); }
      if (e.key === 'ArrowRight' && !collides(boardRef.current, p, 1)) { p.x++; drawFrame(); }
      if (e.key === 'ArrowDown' && !collides(boardRef.current, p, 0, 1)) { p.y++; drawFrame(); }
      if (e.key === 'ArrowUp') {
        const rotated = { ...p, shape: rotate(p.shape) };
        if (!collides(boardRef.current, rotated)) { p.shape = rotated.shape; drawFrame(); }
      }
      if (e.key === ' ') {
        e.preventDefault();
        while (!collides(boardRef.current, p, 0, 1)) p.y++;
        drawFrame();
      }
    };
    window.addEventListener('keydown', handler);
    return () => { window.removeEventListener('keydown', handler); cancelAnimationFrame(animRef.current); runningRef.current = false; };
  }, [drawFrame, tick]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0a0a1a] gap-3 p-4">
      <div className="flex items-center gap-6">
        <div className="text-center"><p className="text-white/40 text-xs">SCORE</p><p className="text-cyan-400 font-black text-2xl">{score}</p></div>
        <button onClick={startGame} className="px-5 py-2 bg-cyan-600 text-white font-black rounded-xl hover:bg-cyan-500 transition-colors">
          {phase === 'idle' ? '▶ Start' : '🔄 Restart'}
        </button>
        <div className="text-center"><p className="text-white/40 text-xs">BEST</p><p className="text-yellow-400 font-black text-2xl">{highScore}</p></div>
      </div>
      {phase === 'over' && <p className="text-red-400 font-black text-xl animate-pulse">💀 GAME OVER</p>}
      <canvas ref={canvasRef} width={W * CELL} height={H * CELL} className="rounded-xl border border-white/10 shadow-2xl shadow-cyan-500/10" />
      <p className="text-white/30 text-xs">← → move • ↑ rotate • ↓ drop • Space hard-drop</p>
    </div>
  );
}

// ─── FLAPPY BIRD ───
function FlappyBird({ onScore, highScore }) {
  const canvasRef = useRef(null);
  const runningRef = useRef(false);
  const stateRef = useRef(null);
  const animRef = useRef(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState('idle');
  const W = 380, H = 480;

  const doJump = useCallback(() => {
    if (stateRef.current) stateRef.current.bird.vy = -9;
  }, []);

  const startGame = useCallback(() => {
    stateRef.current = { bird: { y: 240, vy: 0 }, pipes: [], frame: 0, score: 0 };
    setScore(0);
    setPhase('playing');
    runningRef.current = true;
    cancelAnimationFrame(animRef.current);

    const loop = () => {
      if (!runningRef.current) return;
      const st = stateRef.current;
      if (!st) return;
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      st.frame++;
      st.bird.vy = Math.min(st.bird.vy + 0.55, 12);
      st.bird.y += st.bird.vy;

      if (st.frame % 85 === 0) {
        const gap = 150, top = 60 + Math.random() * (H - gap - 120);
        st.pipes.push({ x: W, top, bottom: top + gap, scored: false });
      }
      st.pipes.forEach(p => { p.x -= 3; });
      st.pipes = st.pipes.filter(p => p.x > -70);
      st.pipes.forEach(p => { if (!p.scored && p.x + 60 < 80) { p.scored = true; st.score++; setScore(st.score); onScore(st.score); } });

      const bx = 80, by = st.bird.y, br = 16;
      const dead = by - br < 0 || by + br > H || st.pipes.some(p =>
        bx + br > p.x && bx - br < p.x + 60 && (by - br < p.top || by + br > p.bottom)
      );

      // Draw sky
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#1a3a6a'); grad.addColorStop(1, '#2a5a9a');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
      // Clouds
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      [{ x: (st.frame * 0.3) % (W + 100) - 50, y: 60, w: 80 }, { x: (st.frame * 0.2 + 200) % (W + 100) - 50, y: 100, w: 60 }].forEach(cl => {
        ctx.beginPath(); ctx.ellipse(cl.x, cl.y, cl.w, 20, 0, 0, Math.PI * 2); ctx.fill();
      });
      // Pipes
      st.pipes.forEach(p => {
        // Top pipe
        const tg = ctx.createLinearGradient(p.x, 0, p.x + 60, 0);
        tg.addColorStop(0, '#16a34a'); tg.addColorStop(1, '#22c55e');
        ctx.fillStyle = tg;
        ctx.fillRect(p.x, 0, 60, p.top);
        ctx.fillRect(p.x - 5, p.top - 22, 70, 22);
        // Bottom pipe
        ctx.fillRect(p.x, p.bottom, 60, H - p.bottom);
        ctx.fillRect(p.x - 5, p.bottom, 70, 22);
      });
      // Ground
      ctx.fillStyle = '#92400e'; ctx.fillRect(0, H - 10, W, 10);
      // Bird body
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(Math.min(Math.max(st.bird.vy * 0.04, -0.5), 1));
      ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.ellipse(0, 0, 18, 14, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f97316'; ctx.fillRect(12, -3, 10, 6);
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(6, -5, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(8, -5, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.beginPath(); ctx.arc(9, -6, 1, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      // Score HUD
      ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(W / 2 - 30, 10, 60, 32); 
      ctx.fillStyle = '#fff'; ctx.font = 'bold 22px monospace'; ctx.textAlign = 'center';
      ctx.fillText(st.score, W / 2, 32); ctx.textAlign = 'left';

      if (dead) { runningRef.current = false; stateRef.current = null; setPhase('dead'); return; }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
  }, [onScore]);

  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Space') { e.preventDefault(); if (phase === 'idle' || phase === 'dead') startGame(); else doJump(); }
    };
    window.addEventListener('keydown', handler);
    return () => { window.removeEventListener('keydown', handler); cancelAnimationFrame(animRef.current); runningRef.current = false; };
  }, [phase, startGame, doJump]);

  const handleClick = () => { if (phase === 'idle' || phase === 'dead') startGame(); else doJump(); };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#1a3a6a] gap-3 p-4">
      <div className="flex items-center gap-6">
        <div className="text-center"><p className="text-white/40 text-xs">SCORE</p><p className="text-yellow-400 font-black text-2xl">{score}</p></div>
        {(phase === 'idle' || phase === 'dead') && (
          <button onClick={startGame} className="px-5 py-2 bg-yellow-500 text-black font-black rounded-xl hover:bg-yellow-400">
            {phase === 'dead' ? '🔄 Retry' : '▶ Start'}
          </button>
        )}
        <div className="text-center"><p className="text-white/40 text-xs">BEST</p><p className="text-yellow-400 font-black text-2xl">{highScore}</p></div>
      </div>
      {phase === 'dead' && <p className="text-red-400 font-black text-xl">💀 Crashed!</p>}
      <canvas ref={canvasRef} width={W} height={H} onClick={handleClick}
        className="rounded-2xl border border-white/10 cursor-pointer shadow-2xl max-h-[65vh]" />
      <p className="text-white/40 text-sm">Click or Space to flap!</p>
    </div>
  );
}

// ─── SNAKE ───
function SnakeGame({ onScore, highScore }) {
  const canvasRef = useRef(null);
  const COLS = 22, ROWS = 18, CELL = 24;
  const dirRef = useRef({ x: 1, y: 0 });
  const snakeRef = useRef([{ x: 11, y: 9 }]);
  const foodRef = useRef({ x: 16, y: 9 });
  const runningRef = useRef(false);
  const animRef = useRef(null);
  const lastTickRef = useRef(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState('idle');

  const placeFood = () => {
    let pos;
    do { pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
    while (snakeRef.current.some(s => s.x === pos.x && s.y === pos.y));
    foodRef.current = pos;
  };

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0a1a0a'; ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
    ctx.strokeStyle = 'rgba(0,255,0,0.04)';
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) ctx.strokeRect(c * CELL, r * CELL, CELL, CELL);
    // Food
    const f = foodRef.current;
    const grad = ctx.createRadialGradient(f.x * CELL + CELL / 2, f.y * CELL + CELL / 2, 2, f.x * CELL + CELL / 2, f.y * CELL + CELL / 2, CELL / 2);
    grad.addColorStop(0, '#ff6b6b'); grad.addColorStop(1, '#c0392b');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(f.x * CELL + CELL / 2, f.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2); ctx.fill();
    // Snake
    snakeRef.current.forEach((seg, i) => {
      const g2 = ctx.createLinearGradient(seg.x * CELL, seg.y * CELL, seg.x * CELL + CELL, seg.y * CELL + CELL);
      g2.addColorStop(0, i === 0 ? '#4ade80' : '#22c55e');
      g2.addColorStop(1, i === 0 ? '#16a34a' : '#15803d');
      ctx.fillStyle = g2;
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
      if (i === 0) {
        ctx.fillStyle = '#fff';
        const ex = dirRef.current.x, ey = dirRef.current.y;
        ctx.fillRect(seg.x * CELL + CELL / 2 + ex * 4 + ey * 3 - 2, seg.y * CELL + CELL / 2 + ey * 4 - ex * 3 - 2, 4, 4);
        ctx.fillRect(seg.x * CELL + CELL / 2 + ex * 4 - ey * 3 - 2, seg.y * CELL + CELL / 2 + ey * 4 + ex * 3 - 2, 4, 4);
      }
    });
  }, []);

  const startGame = () => {
    snakeRef.current = [{ x: 11, y: 9 }];
    dirRef.current = { x: 1, y: 0 };
    placeFood();
    setScore(0);
    setPhase('playing');
    runningRef.current = true;
    lastTickRef.current = 0;
    cancelAnimationFrame(animRef.current);

    const loop = (ts) => {
      if (!runningRef.current) return;
      if (ts - lastTickRef.current > 130) {
        lastTickRef.current = ts;
        const snake = snakeRef.current;
        const head = { x: snake[0].x + dirRef.current.x, y: snake[0].y + dirRef.current.y };
        if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || snake.some(s => s.x === head.x && s.y === head.y)) {
          runningRef.current = false;
          setPhase('over');
          return;
        }
        const ate = head.x === foodRef.current.x && head.y === foodRef.current.y;
        snakeRef.current = [head, ...snake];
        if (ate) { placeFood(); setScore(s => { const ns = s + 10; onScore(ns); return ns; }); }
        else snakeRef.current.pop();
      }
      draw();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const handler = (e) => {
      const d = dirRef.current;
      if (e.key === 'ArrowUp' && d.y !== 1) dirRef.current = { x: 0, y: -1 };
      if (e.key === 'ArrowDown' && d.y !== -1) dirRef.current = { x: 0, y: 1 };
      if (e.key === 'ArrowLeft' && d.x !== 1) dirRef.current = { x: -1, y: 0 };
      if (e.key === 'ArrowRight' && d.x !== -1) dirRef.current = { x: 1, y: 0 };
    };
    window.addEventListener('keydown', handler);
    return () => { window.removeEventListener('keydown', handler); cancelAnimationFrame(animRef.current); runningRef.current = false; };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0a1a0a] gap-3 p-4">
      <div className="flex items-center gap-6">
        <div className="text-center"><p className="text-white/40 text-xs">SCORE</p><p className="text-green-400 font-black text-2xl">{score}</p></div>
        <button onClick={startGame} className="px-5 py-2 bg-green-600 text-white font-black rounded-xl hover:bg-green-500">{phase === 'idle' ? '▶ Start' : '🔄 Restart'}</button>
        <div className="text-center"><p className="text-white/40 text-xs">BEST</p><p className="text-yellow-400 font-black text-2xl">{highScore}</p></div>
      </div>
      {phase === 'over' && <p className="text-red-400 font-black text-xl">💀 Game Over!</p>}
      <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} className="rounded-xl border border-green-900/50 shadow-2xl max-w-full" />
      <div className="grid grid-cols-3 gap-2 mt-1">
        <div /><button onMouseDown={() => { const d=dirRef.current; if(d.y!==1) dirRef.current={x:0,y:-1}; }} className="w-12 h-10 bg-white/10 rounded-xl text-white text-lg hover:bg-white/20">▲</button><div />
        <button onMouseDown={() => { const d=dirRef.current; if(d.x!==1) dirRef.current={x:-1,y:0}; }} className="w-12 h-10 bg-white/10 rounded-xl text-white text-lg hover:bg-white/20">◀</button>
        <button onMouseDown={() => { const d=dirRef.current; if(d.y!==-1) dirRef.current={x:0,y:1}; }} className="w-12 h-10 bg-white/10 rounded-xl text-white text-lg hover:bg-white/20">▼</button>
        <button onMouseDown={() => { const d=dirRef.current; if(d.x!==-1) dirRef.current={x:1,y:0}; }} className="w-12 h-10 bg-white/10 rounded-xl text-white text-lg hover:bg-white/20">▶</button>
      </div>
    </div>
  );
}

// ─── BREAKOUT ───
function BreakoutGame({ onScore, highScore }) {
  const canvasRef = useRef(null);
  const runningRef = useRef(false);
  const stateRef = useRef(null);
  const animRef = useRef(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState('idle');
  const W = 480, H = 420;

  const makeBricks = () => {
    const colors = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6'];
    return Array.from({ length: 6 }, (_, r) =>
      Array.from({ length: 8 }, (_, c) => ({ x: 8 + c * 59, y: 30 + r * 28, w: 53, h: 20, alive: true, color: colors[r], pts: (6 - r) * 10 }))
    ).flat();
  };

  const startGame = () => {
    stateRef.current = { ball: { x: 240, y: 320, vx: 3.5, vy: -4.5 }, paddleX: 180, paddleW: 90, bricks: makeBricks(), score: 0 };
    setScore(0); setPhase('playing'); runningRef.current = true;
    cancelAnimationFrame(animRef.current);

    const loop = () => {
      if (!runningRef.current) return;
      const st = stateRef.current;
      if (!st) return;
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      const { ball } = st;
      ball.x += ball.vx; ball.y += ball.vy;
      if (ball.x < 8 || ball.x > W - 8) ball.vx *= -1;
      if (ball.y < 8) ball.vy = Math.abs(ball.vy);
      if (ball.y > H + 10) { runningRef.current = false; stateRef.current = null; setPhase('dead'); return; }

      // Paddle hit
      if (ball.y > H - 35 && ball.y < H - 22 && ball.x > st.paddleX && ball.x < st.paddleX + st.paddleW) {
        ball.vy = -Math.abs(ball.vy);
        ball.vx += ((ball.x - (st.paddleX + st.paddleW / 2)) / 18);
        ball.vx = Math.max(-6, Math.min(6, ball.vx));
      }

      // Brick hits
      for (const b of st.bricks) {
        if (!b.alive) continue;
        if (ball.x > b.x && ball.x < b.x + b.w && ball.y > b.y && ball.y < b.y + b.h) {
          b.alive = false; ball.vy *= -1; st.score += b.pts; setScore(st.score); onScore(st.score); break;
        }
      }
      if (st.bricks.every(b => !b.alive)) { runningRef.current = false; stateRef.current = null; setPhase('win'); return; }

      // Draw
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#0a0a1a'); bg.addColorStop(1, '#0f0f2e');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      st.bricks.forEach(b => {
        if (!b.alive) return;
        ctx.fillStyle = b.color; ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(b.x, b.y, b.w, 4);
        ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.strokeRect(b.x, b.y, b.w, b.h);
      });
      // Paddle
      const pg = ctx.createLinearGradient(st.paddleX, 0, st.paddleX + st.paddleW, 0);
      pg.addColorStop(0, '#6366f1'); pg.addColorStop(1, '#818cf8');
      ctx.fillStyle = pg; ctx.fillRect(st.paddleX, H - 30, st.paddleW, 14);
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(st.paddleX, H - 30, st.paddleW, 4);
      // Ball
      const ballGrad = ctx.createRadialGradient(ball.x - 3, ball.y - 3, 1, ball.x, ball.y, 9);
      ballGrad.addColorStop(0, '#fff'); ballGrad.addColorStop(1, '#c7d2fe');
      ctx.fillStyle = ballGrad;
      ctx.beginPath(); ctx.arc(ball.x, ball.y, 9, 0, Math.PI * 2); ctx.fill();

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const mm = (e) => {
      if (!stateRef.current) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) stateRef.current.paddleX = Math.max(0, Math.min(W - stateRef.current.paddleW, e.clientX - rect.left - stateRef.current.paddleW / 2));
    };
    const touch = (e) => {
      if (!stateRef.current) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) stateRef.current.paddleX = Math.max(0, Math.min(W - stateRef.current.paddleW, e.touches[0].clientX - rect.left - stateRef.current.paddleW / 2));
    };
    window.addEventListener('mousemove', mm);
    window.addEventListener('touchmove', touch);
    return () => { window.removeEventListener('mousemove', mm); window.removeEventListener('touchmove', touch); cancelAnimationFrame(animRef.current); runningRef.current = false; };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0a0a1a] gap-3 p-4">
      <div className="flex items-center gap-6">
        <div className="text-center"><p className="text-white/40 text-xs">SCORE</p><p className="text-orange-400 font-black text-2xl">{score}</p></div>
        <button onClick={startGame} className="px-5 py-2 bg-orange-600 text-white font-black rounded-xl hover:bg-orange-500">{phase === 'idle' ? '▶ Start' : '🔄 Restart'}</button>
        <div className="text-center"><p className="text-white/40 text-xs">BEST</p><p className="text-yellow-400 font-black text-2xl">{highScore}</p></div>
      </div>
      {phase === 'dead' && <p className="text-red-400 font-black text-xl">💀 Ball Lost!</p>}
      {phase === 'win' && <p className="text-green-400 font-black text-xl">🎉 You Win!</p>}
      <canvas ref={canvasRef} width={W} height={H} className="rounded-xl border border-white/10 cursor-none shadow-2xl max-w-full" />
      <p className="text-white/30 text-xs">Move mouse to control paddle</p>
    </div>
  );
}

// ─── DINO RUN ───
function DinoRun({ onScore, highScore }) {
  const canvasRef = useRef(null);
  const runningRef = useRef(false);
  const animRef = useRef(null);
  const stateRef = useRef(null);
  const jumpRef = useRef(false);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState('idle');
  const W = 580, H = 180;

  const doJump = useCallback(() => {
    const st = stateRef.current;
    if (st && st.dino.onGround) { st.dino.vy = -14; st.dino.onGround = false; }
  }, []);

  const startGame = useCallback(() => {
    stateRef.current = { dino: { y: 130, vy: 0, onGround: true }, obstacles: [], clouds: [{ x: 300, y: 40 }, { x: 500, y: 60 }], frame: 0, score: 0, speed: 5 };
    setScore(0); setPhase('playing'); runningRef.current = true;
    cancelAnimationFrame(animRef.current);

    const loop = () => {
      if (!runningRef.current) return;
      const st = stateRef.current;
      if (!st) return;
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      st.frame++;
      st.score = Math.floor(st.frame / 7);
      st.speed = 5 + st.score / 150;

      if (jumpRef.current && st.dino.onGround) { st.dino.vy = -14; st.dino.onGround = false; }

      st.dino.vy += 0.9; st.dino.y += st.dino.vy;
      if (st.dino.y >= 130) { st.dino.y = 130; st.dino.vy = 0; st.dino.onGround = true; }

      if (st.frame % Math.max(50, 100 - Math.floor(st.score / 10)) === 0) {
        st.obstacles.push({ x: W, h: 20 + Math.floor(Math.random() * 3) * 10, type: Math.random() < 0.3 ? 'bird' : 'cactus' });
      }
      st.obstacles.forEach(o => o.x -= st.speed);
      st.obstacles = st.obstacles.filter(o => o.x > -40);
      st.clouds.forEach(c => { c.x -= 1; if (c.x < -80) c.x = W + 80; });

      if (st.frame % 60 === 0) { setScore(st.score); onScore(st.score); }

      const dead = st.obstacles.some(o => {
        if (o.type === 'bird') return o.x < 70 && o.x > 20 && st.dino.y < 100 && st.dino.y > 60;
        return o.x < 65 && o.x > 25 && st.dino.y + 36 > H - 10 - o.h;
      });

      if (dead) { runningRef.current = false; stateRef.current = null; setPhase('dead'); return; }

      // Draw
      ctx.fillStyle = '#e8f4f0'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      st.clouds.forEach(c => { ctx.beginPath(); ctx.ellipse(c.x, c.y, 40, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(c.x + 25, c.y + 5, 28, 11, 0, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = '#94a3b8'; ctx.fillRect(0, H - 8, W, 2);

      // Dino
      const dy = st.dino.y, leg = st.frame % 12 < 6 && st.dino.onGround;
      ctx.fillStyle = '#475569';
      ctx.fillRect(30, dy, 32, 30); ctx.fillRect(58, dy + 6, 10, 10);
      ctx.fillStyle = '#e8f4f0'; ctx.fillRect(30 + 22, dy + 2, 8, 6);
      ctx.fillStyle = '#475569';
      if (st.dino.onGround) { ctx.fillRect(leg ? 36 : 44, dy + 30, 8, 8); ctx.fillRect(leg ? 44 : 36, dy + 30, 8, 8); }

      // Obstacles
      st.obstacles.forEach(o => {
        if (o.type === 'bird') {
          ctx.fillStyle = '#64748b';
          const oy = 85;
          ctx.fillRect(o.x, oy, 20, 10);
          const fw = st.frame % 20 < 10;
          ctx.fillRect(o.x - 5, oy - (fw ? 8 : 2), 12, 6);
          ctx.fillRect(o.x + 13, oy - (fw ? 8 : 2), 12, 6);
        } else {
          ctx.fillStyle = '#16a34a'; ctx.fillRect(o.x, H - 8 - o.h, 16, o.h);
          ctx.fillStyle = '#15803d'; ctx.fillRect(o.x - 4, H - 8 - o.h, 8, Math.min(o.h, 12));
          ctx.fillStyle = '#16a34a'; ctx.fillRect(o.x + 10, H - 8 - o.h + 6, 8, Math.min(o.h - 6, 10));
        }
      });

      ctx.fillStyle = '#94a3b8'; ctx.font = '14px monospace';
      ctx.fillText(String(st.score).padStart(5, '0'), W - 70, 22);

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
  }, [onScore]);

  useEffect(() => {
    const kd = (e) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (phase === 'idle' || phase === 'dead') startGame();
        else jumpRef.current = true;
      }
    };
    const ku = (e) => { if (e.code === 'Space' || e.key === 'ArrowUp') jumpRef.current = false; };
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); cancelAnimationFrame(animRef.current); runningRef.current = false; };
  }, [phase, startGame]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#e8f4f0] gap-3 p-4">
      <div className="flex items-center gap-6">
        <p className="text-slate-700 font-black text-xl">{String(score).padStart(5, '0')}</p>
        {(phase === 'idle' || phase === 'dead') && (
          <button onClick={startGame} className="px-5 py-2 bg-slate-700 text-white font-black rounded-xl hover:bg-slate-600">{phase === 'dead' ? '🔄 Retry' : '▶ Start'}</button>
        )}
        <p className="text-slate-500 text-sm">Best: {highScore}</p>
      </div>
      {phase === 'dead' && <p className="text-red-600 font-black">💀 Game Over!</p>}
      <canvas ref={canvasRef} width={W} height={H} onClick={() => { if (phase === 'idle' || phase === 'dead') startGame(); else doJump(); }}
        className="rounded-xl border border-slate-300 cursor-pointer max-w-full shadow-lg bg-[#e8f4f0]" />
      <p className="text-slate-500 text-sm">Click, Space, or ↑ to jump</p>
    </div>
  );
}

// ─── PONG ───
function PongGame() {
  const canvasRef = useRef(null);
  const runningRef = useRef(false);
  const animRef = useRef(null);
  const stateRef = useRef(null);
  const mouseYRef = useRef(200);
  const [scores, setScores] = useState([0, 0]);
  const [phase, setPhase] = useState('idle');
  const W = 500, H = 400, PH = 80, PW = 14;

  const startGame = () => {
    stateRef.current = { ball: { x: 250, y: 200, vx: 4.5 * (Math.random() < 0.5 ? 1 : -1), vy: 3 * (Math.random() < 0.5 ? 1 : -1) }, p1: 160, p2: 160, score: [0, 0] };
    setScores([0, 0]); setPhase('playing'); runningRef.current = true;
    cancelAnimationFrame(animRef.current);

    const loop = () => {
      if (!runningRef.current) return;
      const st = stateRef.current; if (!st) return;
      const ctx = canvasRef.current?.getContext('2d'); if (!ctx) return;

      st.p1 = Math.max(0, Math.min(H - PH, mouseYRef.current - PH / 2));
      const aiTarget = st.ball.y - PH / 2;
      if (aiTarget > st.p2) st.p2 = Math.min(H - PH, st.p2 + 4);
      else st.p2 = Math.max(0, st.p2 - 4);

      st.ball.x += st.ball.vx; st.ball.y += st.ball.vy;
      if (st.ball.y < 8 || st.ball.y > H - 8) st.ball.vy *= -1;

      if (st.ball.x < PW + 14 && st.ball.x > 0 && st.ball.y > st.p1 && st.ball.y < st.p1 + PH) {
        st.ball.vx = Math.abs(st.ball.vx) * 1.04;
        st.ball.vy += (st.ball.y - (st.p1 + PH / 2)) * 0.08;
      }
      if (st.ball.x > W - PW - 14 && st.ball.x < W && st.ball.y > st.p2 && st.ball.y < st.p2 + PH) {
        st.ball.vx = -Math.abs(st.ball.vx) * 1.04;
      }

      if (st.ball.x < 0) { st.score[1]++; setScores([...st.score]); st.ball = { x: 250, y: 200, vx: 4.5, vy: 3 * (Math.random() < 0.5 ? 1 : -1) }; }
      if (st.ball.x > W) { st.score[0]++; setScores([...st.score]); st.ball = { x: 250, y: 200, vx: -4.5, vy: 3 * (Math.random() < 0.5 ? 1 : -1) }; }
      if (st.score[0] >= 7 || st.score[1] >= 7) { runningRef.current = false; stateRef.current = null; setPhase('done'); return; }

      ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, W, H);
      ctx.setLineDash([8, 8]); ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke(); ctx.setLineDash([]);
      // Paddles with glow
      ctx.shadowColor = '#6366f1'; ctx.shadowBlur = 10;
      ctx.fillStyle = '#6366f1'; ctx.fillRect(PW, st.p1, PW, PH);
      ctx.shadowColor = '#f472b6'; ctx.shadowBlur = 10;
      ctx.fillStyle = '#f472b6'; ctx.fillRect(W - PW * 2, st.p2, PW, PH);
      ctx.shadowBlur = 0;
      // Ball
      ctx.shadowColor = '#fff'; ctx.shadowBlur = 12;
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(st.ball.x, st.ball.y, 8, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const mm = (e) => { const r = canvasRef.current?.getBoundingClientRect(); if (r) mouseYRef.current = e.clientY - r.top; };
    window.addEventListener('mousemove', mm);
    return () => { window.removeEventListener('mousemove', mm); cancelAnimationFrame(animRef.current); runningRef.current = false; };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0a0a1a] gap-4 p-4">
      <div className="flex items-center gap-10">
        <div className="text-center"><p className="text-indigo-400/60 text-xs">YOU</p><p className="text-indigo-400 font-black text-4xl">{scores[0]}</p></div>
        <button onClick={startGame} className="px-5 py-2 bg-purple-600 text-white font-black rounded-xl hover:bg-purple-500">{phase === 'idle' ? '▶ Start' : '🔄 Restart'}</button>
        <div className="text-center"><p className="text-pink-400/60 text-xs">AI</p><p className="text-pink-400 font-black text-4xl">{scores[1]}</p></div>
      </div>
      {phase === 'done' && <p className={`font-black text-xl ${scores[0] > scores[1] ? 'text-indigo-400' : 'text-pink-400'}`}>{scores[0] > scores[1] ? '🎉 You win!' : '🤖 AI wins!'}</p>}
      <canvas ref={canvasRef} width={W} height={H} className="rounded-xl border border-white/10 cursor-none shadow-2xl max-w-full" />
      <p className="text-white/30 text-xs">Move mouse to control your paddle (left) • First to 7</p>
    </div>
  );
}

// ─── MINESWEEPER ───
function Minesweeper() {
  const ROWS = 9, COLS = 9, MINES = 10;
  const [cells, setCells] = useState(() => makeBoard());
  const [phase, setPhase] = useState('playing');
  const [flags, setFlags] = useState(0);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

  function makeBoard() {
    const board = Array.from({ length: ROWS }, (_, r) => Array.from({ length: COLS }, (_, c) => ({ r, c, mine: false, revealed: false, flagged: false, adj: 0 })));
    let placed = 0;
    while (placed < MINES) { const r = Math.floor(Math.random() * ROWS), c = Math.floor(Math.random() * COLS); if (!board[r][c].mine) { board[r][c].mine = true; placed++; } }
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) { if (!board[r][c].mine) { let adj = 0; for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { if (board[r + dr]?.[c + dc]?.mine) adj++; } board[r][c].adj = adj; } }
    return board;
  }

  useEffect(() => {
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const reveal = (r, c, board) => {
    if (board[r]?.[c]?.revealed || board[r]?.[c]?.flagged) return board;
    const nb = board.map(row => row.map(cell => ({ ...cell })));
    const flood = (rr, cc) => { if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS || nb[rr][cc].revealed) return; nb[rr][cc].revealed = true; if (nb[rr][cc].adj === 0 && !nb[rr][cc].mine) for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) flood(rr + dr, cc + dc); };
    flood(r, c); return nb;
  };

  const click = (r, c) => {
    if (phase !== 'playing') return;
    let nb = reveal(r, c, cells);
    if (nb[r][c].mine) { clearInterval(timerRef.current); nb = nb.map(row => row.map(cell => ({ ...cell, revealed: true }))); setPhase('dead'); }
    else if (nb.flat().filter(cell => !cell.mine).every(cell => cell.revealed)) { clearInterval(timerRef.current); setPhase('win'); }
    setCells(nb);
  };

  const flag = (e, r, c) => { e.preventDefault(); if (phase !== 'playing' || cells[r][c].revealed) return; const nb = cells.map(row => row.map(cell => ({ ...cell }))); nb[r][c].flagged = !nb[r][c].flagged; setFlags(f => nb[r][c].flagged ? f + 1 : f - 1); setCells(nb); };

  const reset = () => { setCells(makeBoard()); setPhase('playing'); setFlags(0); setTime(0); clearInterval(timerRef.current); timerRef.current = setInterval(() => setTime(t => t + 1), 1000); };

  const NUMS = ['', '#3b82f6', '#16a34a', '#ef4444', '#7c3aed', '#dc2626', '#0891b2', '#000', '#6b7280'];

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#1a1a2e] gap-4 p-6">
      <div className="flex items-center gap-6">
        <p className="text-white font-bold">💣 {MINES - flags}</p>
        <p className="text-white font-bold">⏱ {time}s</p>
        {phase === 'dead' && <p className="text-red-400 font-black">💥 BOOM!</p>}
        {phase === 'win' && <p className="text-green-400 font-black">🎉 Cleared in {time}s!</p>}
        <button onClick={reset} className="px-4 py-2 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600">🔄 New</button>
      </div>
      <div className="border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        {cells.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => (
              <button key={c} onClick={() => click(r, c)} onContextMenu={e => flag(e, r, c)}
                className={`w-9 h-9 text-xs font-black border border-slate-700/50 flex items-center justify-center transition-all ${cell.revealed ? (cell.mine ? 'bg-red-700' : 'bg-slate-600') : 'bg-slate-800 hover:bg-slate-700 active:bg-slate-600'}`}
                style={{ color: cell.revealed && !cell.mine && cell.adj ? NUMS[cell.adj] : 'inherit' }}>
                {cell.revealed ? (cell.mine ? '💣' : cell.adj || '') : (cell.flagged ? '🚩' : '')}
              </button>
            ))}
          </div>
        ))}
      </div>
      <p className="text-white/30 text-xs">Left click reveal • Right click flag</p>
    </div>
  );
}

// ─── CONNECT 4 ───
function Connect4() {
  const ROWS = 6, COLS = 7;
  const empty = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const [board, setBoard] = useState(empty);
  const [turn, setTurn] = useState('red');
  const [winner, setWinner] = useState(null);
  const [hover, setHover] = useState(null);

  const checkWin = (b, r, c, color) => {
    const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (const [dr, dc] of dirs) { let cnt = 1; for (let i = 1; i < 4; i++) { if (b[r + dr * i]?.[c + dc * i] === color) cnt++; else break; } for (let i = 1; i < 4; i++) { if (b[r - dr * i]?.[c - dc * i] === color) cnt++; else break; } if (cnt >= 4) return true; }
    return false;
  };

  const drop = (col) => {
    if (winner) return;
    const nb = board.map(r => [...r]);
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!nb[r][col]) { nb[r][col] = turn; setBoard(nb); if (checkWin(nb, r, col, turn)) setWinner(turn); else setTurn(t => t === 'red' ? 'yellow' : 'red'); return; }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#1a1a2e] gap-4 p-6">
      <div className="flex items-center gap-4">
        {winner ? <p className={`font-black text-2xl ${winner === 'red' ? 'text-red-400' : 'text-yellow-400'}`}>{winner === 'red' ? '🔴' : '🟡'} Wins! 🎉</p>
          : <p className="text-white font-bold text-lg">{turn === 'red' ? '🔴 Red' : '🟡 Yellow'}'s Turn</p>}
        <button onClick={() => { setBoard(empty()); setTurn('red'); setWinner(null); }} className="px-4 py-2 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600">🔄 Reset</button>
      </div>
      {/* Column hover indicators */}
      <div className="flex gap-1.5" style={{ marginBottom: -8 }}>
        {Array.from({ length: COLS }, (_, c) => (
          <div key={c} className="w-12 h-4 flex items-center justify-center">
            {hover === c && !winner && <div className={`w-4 h-4 rounded-full ${turn === 'red' ? 'bg-red-400' : 'bg-yellow-400'} opacity-70`} />}
          </div>
        ))}
      </div>
      <div className="bg-blue-800 p-2 rounded-2xl shadow-2xl">
        {board.map((row, r) => (
          <div key={r} className="flex gap-1.5 mb-1.5">
            {row.map((cell, c) => (
              <button key={c} onClick={() => drop(c)} onMouseEnter={() => setHover(c)} onMouseLeave={() => setHover(null)} disabled={!!winner}
                className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center hover:bg-slate-800 transition-all">
                {cell && <div className={`w-10 h-10 rounded-full shadow-inner transition-all ${cell === 'red' ? 'bg-gradient-to-br from-red-400 to-red-600' : 'bg-gradient-to-br from-yellow-300 to-yellow-500'}`} />}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PLATFORMER ───
function PlatformerGame({ onScore, highScore }) {
  const canvasRef = useRef(null);
  const runningRef = useRef(false);
  const animRef = useRef(null);
  const keysRef = useRef({});
  const stateRef = useRef(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState('idle');
  const W = 580, H = 380;

  const PLATFORMS = [{ x: 0, y: 350, w: 180, h: 14 }, { x: 220, y: 290, w: 140, h: 14 }, { x: 420, y: 240, w: 160, h: 14 }, { x: 0, y: 240, w: 120, h: 14 }, { x: 150, y: 200, w: 110, h: 14 }, { x: 310, y: 160, w: 100, h: 14 }, { x: 460, y: 130, w: 120, h: 14 }, { x: 60, y: 135, w: 110, h: 14 }, { x: 200, y: 85, w: 100, h: 14 }, { x: 350, y: 60, w: 80, h: 14 }];
  const COIN_POS = [{ x: 90, y: 330 }, { x: 280, y: 265 }, { x: 490, y: 215 }, { x: 60, y: 215 }, { x: 195, y: 175 }, { x: 355, y: 135 }, { x: 510, y: 105 }, { x: 110, y: 110 }, { x: 245, y: 60 }, { x: 385, y: 35 }];

  const startGame = () => {
    stateRef.current = { player: { x: 20, y: 310, vx: 0, vy: 0, onGround: false }, coins: COIN_POS.map(c => ({ ...c, collected: false })), score: 0, particles: [] };
    setScore(0); setPhase('playing'); runningRef.current = true;
    cancelAnimationFrame(animRef.current);

    const loop = () => {
      if (!runningRef.current) return;
      const st = stateRef.current; if (!st) return;
      const ctx = canvasRef.current?.getContext('2d'); if (!ctx) return;
      const p = st.player;

      const left = keysRef.current['ArrowLeft'] || keysRef.current['a'] || keysRef.current['A'];
      const right = keysRef.current['ArrowRight'] || keysRef.current['d'] || keysRef.current['D'];
      const jump = keysRef.current['ArrowUp'] || keysRef.current['w'] || keysRef.current['W'] || keysRef.current[' '];

      if (left) p.vx = Math.max(p.vx - 0.8, -5);
      else if (right) p.vx = Math.min(p.vx + 0.8, 5);
      else p.vx *= 0.75;
      if (jump && p.onGround) { p.vy = -14; p.onGround = false; }

      p.vy = Math.min(p.vy + 0.65, 14); p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = 0; if (p.x > W - 20) p.x = W - 20;
      p.onGround = false;

      PLATFORMS.forEach(pl => {
        if (p.x + 20 > pl.x && p.x < pl.x + pl.w && p.y + 28 > pl.y && p.y + 28 < pl.y + pl.h + 10 && p.vy >= 0) { p.y = pl.y - 28; p.vy = 0; p.onGround = true; }
      });
      if (p.y > H + 50) { p.x = 20; p.y = 310; p.vx = 0; p.vy = 0; }

      // Coins
      st.coins.forEach(co => {
        if (!co.collected && Math.hypot(p.x + 10 - co.x, p.y + 14 - co.y) < 18) {
          co.collected = true; st.score++; setScore(st.score); onScore(st.score);
          for (let i = 0; i < 6; i++) st.particles.push({ x: co.x, y: co.y, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6 - 3, life: 30, color: '#fbbf24' });
        }
      });
      st.particles.forEach(pt => { pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.3; pt.life--; });
      st.particles = st.particles.filter(pt => pt.life > 0);

      if (st.coins.every(c => c.collected)) { runningRef.current = false; stateRef.current = null; setPhase('win'); return; }

      // Draw
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#0f172a'); bgGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);

      // Stars bg
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      for (let i = 0; i < 40; i++) ctx.fillRect((i * 137 + 13) % W, (i * 79 + 7) % 180, 1, 1);

      // Platforms
      PLATFORMS.forEach(pl => {
        const pg = ctx.createLinearGradient(pl.x, pl.y, pl.x, pl.y + pl.h);
        pg.addColorStop(0, '#22d3ee'); pg.addColorStop(1, '#0891b2');
        ctx.fillStyle = pg; ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
        ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(pl.x, pl.y, pl.w, 3);
      });

      // Coins
      const cAngle = Date.now() / 500;
      st.coins.forEach((co, i) => {
        if (!co.collected) {
          ctx.save(); ctx.translate(co.x, co.y + Math.sin(cAngle + i) * 3);
          ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fde68a'; ctx.fillRect(-3, -4, 2, 8);
          ctx.restore();
        }
      });

      // Particles
      st.particles.forEach(pt => {
        ctx.globalAlpha = pt.life / 30;
        ctx.fillStyle = pt.color; ctx.beginPath(); ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Player
      ctx.fillStyle = '#a78bfa'; ctx.fillRect(p.x, p.y, 20, 28);
      ctx.fillStyle = '#c4b5fd'; ctx.fillRect(p.x + 3, p.y + 2, 14, 10);
      ctx.fillStyle = '#7c3aed'; ctx.fillRect(p.x, p.y + 28, left ? 14 : 6, 6); ctx.fillRect(p.x + (left ? 6 : 14), p.y + 28, 6, 6);

      // HUD
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(5, 5, 120, 28);
      ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 16px sans-serif'; ctx.fillText(`🪙 ${st.score}/${COIN_POS.length}`, 12, 24);

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const kd = e => keysRef.current[e.key] = true;
    const ku = e => keysRef.current[e.key] = false;
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); cancelAnimationFrame(animRef.current); runningRef.current = false; };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0f172a] gap-3 p-4">
      <div className="flex items-center gap-6">
        <div className="text-center"><p className="text-white/40 text-xs">COINS</p><p className="text-yellow-400 font-black text-2xl">{score}/10</p></div>
        <button onClick={startGame} className="px-5 py-2 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-500">{phase === 'idle' ? '▶ Start' : '🔄 Restart'}</button>
        <div className="text-center"><p className="text-white/40 text-xs">BEST</p><p className="text-yellow-400 font-black text-2xl">{highScore}</p></div>
      </div>
      {phase === 'win' && <p className="text-yellow-400 font-black text-xl animate-bounce">🎉 All coins collected!</p>}
      <canvas ref={canvasRef} width={W} height={H} className="rounded-xl border border-white/10 max-w-full shadow-2xl" />
      <p className="text-white/30 text-xs">WASD / Arrow keys to move & jump</p>
    </div>
  );
}

// ─── SPACE INVADERS ───
function SpaceInvaders({ onScore, highScore }) {
  const canvasRef = useRef(null);
  const runningRef = useRef(false);
  const animRef = useRef(null);
  const keysRef = useRef({});
  const stateRef = useRef(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState('idle');
  const W = 500, H = 420;

  const makeAliens = () => { const a = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) a.push({ x: 35 + c * 50, y: 30 + r * 40, alive: true, r }); return a; };

  const startGame = () => {
    stateRef.current = { ship: { x: 230 }, bullets: [], alienBullets: [], aliens: makeAliens(), alienDir: 1, frame: 0, score: 0, lives: 3, shootCooldown: 0 };
    setScore(0); setPhase('playing'); runningRef.current = true;
    cancelAnimationFrame(animRef.current);

    const loop = () => {
      if (!runningRef.current) return;
      const st = stateRef.current; if (!st) return;
      const ctx = canvasRef.current?.getContext('2d'); if (!ctx) return;

      st.frame++;
      if (st.shootCooldown > 0) st.shootCooldown--;
      if (keysRef.current['ArrowLeft'] || keysRef.current['a']) st.ship.x = Math.max(0, st.ship.x - 5);
      if (keysRef.current['ArrowRight'] || keysRef.current['d']) st.ship.x = Math.min(W - 40, st.ship.x + 5);
      if ((keysRef.current[' '] || keysRef.current['ArrowUp']) && st.shootCooldown === 0) {
        st.bullets.push({ x: st.ship.x + 19, y: H - 55 });
        st.shootCooldown = 20;
      }

      st.bullets.forEach(b => b.y -= 9); st.bullets = st.bullets.filter(b => b.y > 0);
      st.alienBullets.forEach(b => b.y += 4.5); st.alienBullets = st.alienBullets.filter(b => b.y < H);

      if (st.frame % 28 === 0) {
        const living = st.aliens.filter(a => a.alive);
        if (living.length === 0) { runningRef.current = false; stateRef.current = null; setPhase('win'); return; }
        const atEdge = living.some(a => a.x < 8 || a.x > W - 40);
        if (atEdge) { st.aliens.forEach(a => a.y += 18); st.alienDir *= -1; }
        else st.aliens.forEach(a => a.x += st.alienDir * (6 + (36 - living.length) * 0.2));
        if (Math.random() < 0.35 && living.length > 0) {
          const cols = [...new Set(living.map(a => Math.round(a.x / 50)))];
          const col = cols[Math.floor(Math.random() * cols.length)];
          const shooter = living.filter(a => Math.round(a.x / 50) === col).sort((a, b) => b.y - a.y)[0];
          if (shooter) st.alienBullets.push({ x: shooter.x + 12, y: shooter.y + 24 });
        }
      }

      // Collisions
      for (let bi = st.bullets.length - 1; bi >= 0; bi--) {
        for (let ai = st.aliens.length - 1; ai >= 0; ai--) {
          const a = st.aliens[ai], b = st.bullets[bi];
          if (a.alive && Math.abs(b.x - a.x - 12) < 18 && Math.abs(b.y - a.y - 12) < 18) {
            a.alive = false; st.bullets.splice(bi, 1); st.score += 10 + a.r * 5; setScore(st.score); onScore(st.score); break;
          }
        }
      }
      for (let bi = st.alienBullets.length - 1; bi >= 0; bi--) {
        const b = st.alienBullets[bi];
        if (Math.abs(b.x - st.ship.x - 20) < 20 && b.y > H - 52) { st.alienBullets.splice(bi, 1); st.lives--; if (st.lives <= 0) { runningRef.current = false; stateRef.current = null; setPhase('dead'); return; } }
      }
      if (st.aliens.filter(a => a.alive).some(a => a.y > H - 80)) { runningRef.current = false; stateRef.current = null; setPhase('dead'); return; }

      // Draw
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      for (let i = 0; i < 80; i++) ctx.fillRect((i * 73 + st.frame * 0.2) % W, (i * 47) % H, 1, 1);

      const ACOLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
      st.aliens.forEach(a => {
        if (!a.alive) return;
        const anim = Math.floor(st.frame / 15) % 2;
        ctx.fillStyle = ACOLORS[a.r]; ctx.fillRect(a.x, a.y, 24, 20);
        ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(a.x + 2, a.y + 4, 6, 6); ctx.fillRect(a.x + 16, a.y + 4, 6, 6); ctx.fillRect(a.x + 6, a.y + 12, 12, 5);
        ctx.fillStyle = ACOLORS[a.r];
        if (anim) { ctx.fillRect(a.x - 4, a.y + 16, 6, 4); ctx.fillRect(a.x + 22, a.y + 16, 6, 4); }
      });

      // Ship with glow
      ctx.shadowColor = '#60a5fa'; ctx.shadowBlur = 8;
      ctx.fillStyle = '#60a5fa'; ctx.fillRect(st.ship.x, H - 42, 40, 18); ctx.fillRect(st.ship.x + 15, H - 54, 10, 14);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fbbf24'; st.bullets.forEach(b => { ctx.fillRect(b.x - 2, b.y, 4, 14); });
      ctx.fillStyle = '#f43f5e'; st.alienBullets.forEach(b => { ctx.fillRect(b.x - 2, b.y, 4, 12); });
      ctx.fillStyle = '#60a5fa'; ctx.font = '14px monospace';
      ctx.fillText(`❤️ ${st.lives}   ${st.score}`, 10, H - 5);

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const kd = e => { keysRef.current[e.key] = true; if (e.key === ' ') e.preventDefault(); };
    const ku = e => keysRef.current[e.key] = false;
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); cancelAnimationFrame(animRef.current); runningRef.current = false; };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black gap-3 p-4">
      <div className="flex items-center gap-6">
        <div className="text-center"><p className="text-white/40 text-xs">SCORE</p><p className="text-green-400 font-black text-2xl">{score}</p></div>
        <button onClick={startGame} className="px-5 py-2 bg-green-700 text-white font-black rounded-xl hover:bg-green-600">{phase === 'idle' ? '▶ Start' : '🔄 Restart'}</button>
        <div className="text-center"><p className="text-white/40 text-xs">BEST</p><p className="text-yellow-400 font-black text-2xl">{highScore}</p></div>
      </div>
      {phase === 'dead' && <p className="text-red-400 font-black text-xl">💀 Earth Invaded!</p>}
      {phase === 'win' && <p className="text-green-400 font-black text-xl">🎉 Earth Saved!</p>}
      <canvas ref={canvasRef} width={W} height={H} className="rounded-xl border border-green-900/40 shadow-2xl max-w-full" />
      <p className="text-white/30 text-xs">← → to move • Space/↑ to shoot</p>
    </div>
  );
}

// ─── PAINT STUDIO ───
function PaintStudio() {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#6366f1');
  const [size, setSize] = useState(8);
  const [shape, setShape] = useState('free');
  const drawing = useRef(false);
  const last = useRef(null);
  const startPos = useRef(null);
  const snapshot = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 680, 430); }
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: (e.clientX - rect.left) * (680 / rect.width), y: (e.clientY - rect.top) * (430 / rect.height) };
  };

  const down = (e) => {
    drawing.current = true;
    const pos = getPos(e); last.current = pos; startPos.current = pos;
    const ctx = canvasRef.current.getContext('2d');
    snapshot.current = ctx.getImageData(0, 0, 680, 430);
    if (tool === 'fill') flood(Math.round(pos.x), Math.round(pos.y));
  };

  const move = (e) => {
    if (!drawing.current || tool === 'fill') return;
    const ctx = canvasRef.current.getContext('2d');
    const pos = getPos(e);
    if (shape !== 'free') {
      ctx.putImageData(snapshot.current, 0, 0);
      ctx.strokeStyle = tool === 'eraser' ? '#fff' : color;
      ctx.fillStyle = color;
      ctx.lineWidth = size;
      ctx.lineCap = 'round';
      const sw = pos.x - startPos.current.x, sh = pos.y - startPos.current.y;
      ctx.beginPath();
      if (shape === 'rect') ctx.strokeRect(startPos.current.x, startPos.current.y, sw, sh);
      else if (shape === 'circle') { ctx.ellipse(startPos.current.x + sw / 2, startPos.current.y + sh / 2, Math.abs(sw / 2), Math.abs(sh / 2), 0, 0, Math.PI * 2); ctx.stroke(); }
      else if (shape === 'line') { ctx.moveTo(startPos.current.x, startPos.current.y); ctx.lineTo(pos.x, pos.y); ctx.stroke(); }
    } else {
      ctx.strokeStyle = tool === 'eraser' ? '#fff' : color;
      ctx.lineWidth = tool === 'eraser' ? size * 3 : size;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(last.current.x, last.current.y); ctx.lineTo(pos.x, pos.y); ctx.stroke();
      last.current = pos;
    }
  };

  const flood = (sx, sy) => {
    const ctx = canvasRef.current.getContext('2d');
    const imgData = ctx.getImageData(0, 0, 680, 430);
    const d = imgData.data;
    const idx = (x, y) => (y * 680 + x) * 4;
    const ti = idx(sx, sy);
    const tr = d[ti], tg = d[ti + 1], tb = d[ti + 2];
    const match = color.match(/\w\w/g);
    if (!match) return;
    const [fr, fg, fb] = match.map(h => parseInt(h, 16));
    if (tr === fr && tg === fg && tb === fb) return;
    const stack = [[sx, sy]];
    while (stack.length) {
      const [x, y] = stack.pop();
      if (x < 0 || x >= 680 || y < 0 || y >= 430) continue;
      const i = idx(x, y);
      if (d[i] === tr && d[i + 1] === tg && d[i + 2] === tb) { d[i] = fr; d[i + 1] = fg; d[i + 2] = fb; d[i + 3] = 255; stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]); }
    }
    ctx.putImageData(imgData, 0, 0);
  };

  const COLORS = ['#000', '#fff', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#a3e635', '#fb923c', '#f43f5e', '#14b8a6'];

  return (
    <div className="flex flex-col h-full bg-[#1a1a2e] p-3 gap-2">
      <div className="flex items-center gap-2 flex-wrap bg-[#0d0d1a] p-2 rounded-xl">
        {['pen', 'eraser', 'fill'].map(t => <button key={t} onClick={() => setTool(t)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${tool === t ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>{t === 'pen' ? '✏️' : t === 'eraser' ? '⬜ Erase' : '🪣 Fill'}</button>)}
        {['free', 'rect', 'circle', 'line'].map(s => <button key={s} onClick={() => setShape(s)} className={`px-2 py-1.5 rounded-lg text-xs font-bold ${shape === s && tool === 'pen' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>{s === 'free' ? '〰️' : s === 'rect' ? '▭' : s === 'circle' ? '○' : '╱'}</button>)}
        <div className="flex items-center gap-1"><span className="text-white/40 text-xs">sz</span><input type="range" min={1} max={50} value={size} onChange={e => setSize(+e.target.value)} className="w-16 accent-purple-500" /></div>
        <div className="flex gap-1 flex-wrap">{COLORS.map(c => <button key={c} onClick={() => { setColor(c); setTool('pen'); }} className="w-5 h-5 rounded border-2 transition-all" style={{ background: c, borderColor: color === c ? '#fff' : 'transparent' }} />)}<input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-5 h-5 rounded cursor-pointer" /></div>
        <button onClick={() => { const ctx = canvasRef.current.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 680, 430); }} className="px-2 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-xs font-bold hover:bg-red-600/40">🗑</button>
        <button onClick={() => { const a = document.createElement('a'); a.href = canvasRef.current.toDataURL(); a.download = 'nexus-art.png'; a.click(); }} className="px-2 py-1.5 bg-green-600/20 text-green-400 rounded-lg text-xs font-bold hover:bg-green-600/40">💾</button>
      </div>
      <canvas ref={canvasRef} width={680} height={430}
        className="rounded-xl border border-white/10 bg-white cursor-crosshair flex-1 max-w-full"
        style={{ touchAction: 'none' }}
        onMouseDown={down} onMouseMove={move}
        onMouseUp={() => drawing.current = false}
        onMouseLeave={() => drawing.current = false} />
    </div>
  );
}

// ─── ASTEROIDS ───
function AsteroidGame({ onScore, highScore }) {
  const canvasRef = useRef(null);
  const runningRef = useRef(false);
  const animRef = useRef(null);
  const keysRef = useRef({});
  const stateRef = useRef(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState('idle');
  const W = 580, H = 440;

  const randAsteroid = (cx = W / 2, cy = H / 2) => {
    let x, y;
    do { x = Math.random() * W; y = Math.random() * H; } while (Math.hypot(x - cx, y - cy) < 120);
    const a = Math.random() * Math.PI * 2;
    return { x, y, vx: Math.cos(a) * (1.5 + Math.random()), vy: Math.sin(a) * (1.5 + Math.random()), r: 28 + Math.random() * 18, rot: 0, rotV: (Math.random() - 0.5) * 0.04 };
  };

  const startGame = () => {
    const ship = { x: W / 2, y: H / 2, angle: -Math.PI / 2, vx: 0, vy: 0, inv: 0 };
    stateRef.current = { ship, bullets: [], asteroids: Array.from({ length: 5 }, () => randAsteroid()), score: 0, lives: 3, shootCD: 0 };
    setScore(0); setPhase('playing'); runningRef.current = true;
    cancelAnimationFrame(animRef.current);

    const loop = () => {
      if (!runningRef.current) return;
      const st = stateRef.current; if (!st) return;
      const ctx = canvasRef.current?.getContext('2d'); if (!ctx) return;
      const { ship } = st;
      if (st.shootCD > 0) st.shootCD--;

      if (keysRef.current['ArrowLeft'] || keysRef.current['a']) ship.angle -= 0.07;
      if (keysRef.current['ArrowRight'] || keysRef.current['d']) ship.angle += 0.07;
      if (keysRef.current['ArrowUp'] || keysRef.current['w']) { ship.vx += Math.cos(ship.angle) * 0.35; ship.vy += Math.sin(ship.angle) * 0.35; }
      if ((keysRef.current[' '] || keysRef.current['x']) && st.shootCD === 0) {
        st.bullets.push({ x: ship.x + Math.cos(ship.angle) * 22, y: ship.y + Math.sin(ship.angle) * 22, vx: Math.cos(ship.angle) * 9 + ship.vx, vy: Math.sin(ship.angle) * 9 + ship.vy, life: 55 });
        st.shootCD = 12;
      }

      ship.vx *= 0.985; ship.vy *= 0.985;
      ship.x = (ship.x + ship.vx + W) % W; ship.y = (ship.y + ship.vy + H) % H;
      if (ship.inv > 0) ship.inv--;

      for (let i = st.bullets.length - 1; i >= 0; i--) {
        const b = st.bullets[i]; b.x += b.vx; b.y += b.vy; b.life--;
        b.x = (b.x + W) % W; b.y = (b.y + H) % H;
        if (b.life <= 0) { st.bullets.splice(i, 1); continue; }
        for (let j = st.asteroids.length - 1; j >= 0; j--) {
          const a = st.asteroids[j];
          if (Math.hypot(b.x - a.x, b.y - a.y) < a.r) {
            if (a.r > 16) { for (let k = 0; k < 2; k++) { const ang = Math.random() * Math.PI * 2; st.asteroids.push({ x: a.x, y: a.y, vx: a.vx + Math.cos(ang) * 1.5, vy: a.vy + Math.sin(ang) * 1.5, r: a.r * 0.55, rot: 0, rotV: (Math.random() - 0.5) * 0.06 }); } }
            st.asteroids.splice(j, 1); st.bullets.splice(i, 1);
            st.score += Math.round(100 / (a.r / 10)); setScore(st.score); onScore(st.score);
            if (st.asteroids.length === 0) for (let k = 0; k < 5; k++) st.asteroids.push(randAsteroid(ship.x, ship.y));
            break;
          }
        }
      }

      st.asteroids.forEach(a => { a.x = (a.x + a.vx + W) % W; a.y = (a.y + a.vy + H) % H; a.rot += a.rotV; });

      if (ship.inv === 0) {
        for (const a of st.asteroids) {
          if (Math.hypot(ship.x - a.x, ship.y - a.y) < a.r + 10) { st.lives--; ship.inv = 150; if (st.lives <= 0) { runningRef.current = false; stateRef.current = null; setPhase('dead'); return; } break; }
        }
      }

      // Draw
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      for (let i = 0; i < 60; i++) ctx.fillRect((i * 137 + 23) % W, (i * 97 + 11) % H, 1, 1);

      st.asteroids.forEach(a => {
        ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(a.rot);
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) { const ang = (i / 8) * Math.PI * 2, r = a.r * (0.8 + Math.sin(ang * 3 + a.rot) * 0.2); i === 0 ? ctx.moveTo(Math.cos(ang) * r, Math.sin(ang) * r) : ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r); }
        ctx.closePath(); ctx.stroke(); ctx.restore();
      });

      if (ship.inv === 0 || Math.floor(ship.inv / 6) % 2 === 0) {
        ctx.save(); ctx.translate(ship.x, ship.y); ctx.rotate(ship.angle);
        ctx.shadowColor = '#60a5fa'; ctx.shadowBlur = 8;
        ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(-12, 11); ctx.lineTo(-7, 0); ctx.lineTo(-12, -11); ctx.closePath(); ctx.stroke();
        if (keysRef.current['ArrowUp'] || keysRef.current['w']) { ctx.strokeStyle = '#f97316'; ctx.shadowColor = '#f97316'; ctx.beginPath(); ctx.moveTo(-7, 4); ctx.lineTo(-18 - Math.random() * 8, 0); ctx.lineTo(-7, -4); ctx.stroke(); }
        ctx.shadowBlur = 0; ctx.restore();
      }

      ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 4;
      ctx.fillStyle = '#fbbf24';
      st.bullets.forEach(b => { ctx.beginPath(); ctx.arc(b.x, b.y, 3, 0, Math.PI * 2); ctx.fill(); });
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#fff'; ctx.font = 'bold 14px monospace';
      ctx.fillText(`❤️ ${'█'.repeat(st.lives)}  ${st.score}`, 10, 22);

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const kd = e => { keysRef.current[e.key] = true; if (e.key === ' ') e.preventDefault(); };
    const ku = e => keysRef.current[e.key] = false;
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); cancelAnimationFrame(animRef.current); runningRef.current = false; };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black gap-3 p-4">
      <div className="flex items-center gap-6">
        <div className="text-center"><p className="text-white/40 text-xs">SCORE</p><p className="text-blue-400 font-black text-2xl">{score}</p></div>
        <button onClick={startGame} className="px-5 py-2 bg-blue-700 text-white font-black rounded-xl hover:bg-blue-600">{phase === 'idle' ? '▶ Start' : '🔄 Restart'}</button>
        <div className="text-center"><p className="text-white/40 text-xs">BEST</p><p className="text-yellow-400 font-black text-2xl">{highScore}</p></div>
      </div>
      {phase === 'dead' && <p className="text-red-400 font-black text-xl">💀 Ship Destroyed!</p>}
      <canvas ref={canvasRef} width={W} height={H} className="rounded-xl border border-white/10 shadow-2xl max-w-full" />
      <p className="text-white/30 text-xs">← → rotate • ↑/W thrust • Space/X shoot</p>
    </div>
  );
}

// ─── 2-PLAYER CHESS ───
function Chess2D() {
  const initBoard = () => {
    const b = Array.from({ length: 8 }, () => Array(8).fill(null));
    const order = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
    order.forEach((p, c) => { b[0][c] = { p, color: 'b' }; b[7][c] = { p, color: 'w' }; });
    for (let c = 0; c < 8; c++) { b[1][c] = { p: 'P', color: 'b' }; b[6][c] = { p: 'P', color: 'w' }; }
    return b;
  };
  const [board, setBoard] = useState(initBoard);
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState('w');
  const [msg, setMsg] = useState('');
  const SYMBOLS = { wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙', bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟' };

  const click = (r, c) => {
    const cell = board[r][c];
    if (selected) {
      const [sr, sc] = selected;
      if (sr === r && sc === c) { setSelected(null); return; }
      const piece = board[sr][sc];
      if (cell?.color === piece.color) { setSelected([r, c]); return; }
      const nb = board.map(row => [...row]);
      if (cell?.p === 'K') { setMsg(`${cell.color === 'w' ? 'Black' : 'White'} wins! 👑`); }
      nb[r][c] = piece; nb[sr][sc] = null;
      if (piece.p === 'P' && (r === 0 || r === 7)) nb[r][c] = { p: 'Q', color: piece.color };
      setBoard(nb); setTurn(t => t === 'w' ? 'b' : 'w'); setSelected(null);
    } else {
      if (cell?.color === turn) setSelected([r, c]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#1a1a0a] gap-3 p-4">
      <div className="flex items-center gap-4">
        {msg ? <p className="text-yellow-400 font-black text-xl">{msg}</p> : <p className="text-white font-bold text-lg">{turn === 'w' ? '⬜ White' : '⬛ Black'}'s turn</p>}
        <button onClick={() => { setBoard(initBoard()); setTurn('w'); setSelected(null); setMsg(''); }} className="px-4 py-2 bg-amber-700 text-white font-bold rounded-xl hover:bg-amber-600">🔄 New Game</button>
      </div>
      <div className="border-2 border-amber-900 rounded-lg overflow-hidden shadow-2xl">
        {board.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => {
              const light = (r + c) % 2 === 0;
              const isSel = selected && selected[0] === r && selected[1] === c;
              const canMove = selected && !isSel && cell?.color !== board[selected[0]][selected[1]]?.color;
              return (
                <button key={c} onClick={() => click(r, c)}
                  className="w-12 h-12 flex items-center justify-center text-3xl transition-all hover:brightness-110 relative"
                  style={{ background: isSel ? '#fbbf24' : light ? '#f0d9b5' : '#b58863' }}>
                  {canMove && !cell && <div className="w-4 h-4 rounded-full bg-black/20" />}
                  {canMove && cell && <div className="absolute inset-0 border-4 border-black/30 rounded" />}
                  {cell ? SYMBOLS[cell.color + cell.p] : ''}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <p className="text-white/30 text-xs">Click to select, click again to move • Pawns promote to Queen</p>
    </div>
  );
}

// ─── WORDLE ───
function WordleGame() {
  const WORDS = ['PLANT', 'CRANE', 'SHADE', 'BRICK', 'FLAME', 'GHOST', 'TRACK', 'SWORD', 'BLADE', 'STOVE', 'CROWN', 'BRAVE', 'CLOUD', 'TIGER', 'PIANO', 'STORM', 'GRAPE', 'MAGIC', 'OCEAN', 'PEARL', 'MANGO', 'NEXUS', 'BLAZE', 'FROST', 'CRAZE', 'GLOOM', 'SHINY', 'RISKY', 'BLANK', 'CRISP'];
  const [answer] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState('');
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  const submit = () => {
    if (current.length !== 5 || done) { setShake(true); setTimeout(() => setShake(false), 500); return; }
    const g = current.toUpperCase();
    const ng = [...guesses, g];
    setGuesses(ng); setCurrent('');
    if (g === answer || ng.length >= 6) setDone(true);
  };

  const getTile = (guess, i) => {
    const l = guess[i];
    if (l === answer[i]) return 'bg-green-600 border-green-500 text-white';
    if (answer.includes(l)) return 'bg-yellow-600 border-yellow-500 text-white';
    return 'bg-slate-700 border-slate-600 text-white';
  };

  const KEYBOARD = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
  const getKeyColor = (k) => {
    for (const g of guesses) {
      for (let i = 0; i < 5; i++) {
        if (g[i] === k) { if (k === answer[i]) return 'bg-green-600 text-white'; }
      }
    }
    for (const g of guesses) {
      if (g.includes(k)) { if (answer.includes(k)) return 'bg-yellow-600 text-white'; return 'bg-slate-700 text-white/50'; }
    }
    return 'bg-slate-600 text-white';
  };

  return (
    <div className="flex flex-col items-center h-full bg-[#111] p-4 gap-3 overflow-y-auto">
      <h2 className="text-2xl font-black text-white">🔤 WORDLE</h2>
      {done && <p className={`font-black text-xl ${guesses[guesses.length - 1] === answer ? 'text-green-400' : 'text-red-400'}`}>{guesses[guesses.length - 1] === answer ? '🎉 Correct!' : `Answer: ${answer}`}</p>}
      <div className="space-y-1.5">
        {Array.from({ length: 6 }, (_, row) => (
          <div key={row} className={`flex gap-1.5 ${row === guesses.length && shake ? 'animate-bounce' : ''}`}>
            {Array.from({ length: 5 }, (_, col) => {
              const guess = guesses[row];
              const letter = guess ? guess[col] : (row === guesses.length ? current[col] : '');
              const color = guess ? getTile(guess, col) : 'bg-slate-800 border-slate-600 text-white';
              return <div key={col} className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center font-black text-xl transition-all ${color}`}>{letter || ''}</div>;
            })}
          </div>
        ))}
      </div>
      {!done && (
        <div className="flex gap-2">
          <input ref={inputRef} value={current} onChange={e => setCurrent(e.target.value.slice(0, 5).toUpperCase().replace(/[^A-Z]/g, ''))}
            onKeyDown={e => e.key === 'Enter' && submit()} maxLength={5}
            className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-white font-black text-xl w-36 text-center focus:outline-none focus:border-green-500 uppercase"
            placeholder="WORD" autoFocus />
          <button onClick={submit} disabled={current.length !== 5} className="px-5 py-2 bg-green-600 rounded-xl text-white font-bold hover:bg-green-500 disabled:opacity-30">Enter</button>
        </div>
      )}
      <div className="space-y-1 mt-1">
        {KEYBOARD.map(row => (
          <div key={row} className="flex gap-1 justify-center">
            {row.split('').map(k => <button key={k} onClick={() => { if (current.length < 5) setCurrent(c => c + k); }} className={`w-8 h-9 rounded-lg text-xs font-black transition-all ${getKeyColor(k)}`}>{k}</button>)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MEMORY MATCH ───
function MemoryMatch() {
  const EMOJIS = ['🍌', '🚀', '🦊', '🎮', '⚡', '🔥', '🌙', '💎', '🐉', '👾', '🎯', '🌈'];
  const makeCards = () => [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5).map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false }));
  const [cards, setCards] = useState(makeCards);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);
  const lockRef = useRef(false);

  useEffect(() => {
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const click = (id) => {
    if (lockRef.current) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    const newFlipped = [...flipped, id];
    setCards(newCards); setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      lockRef.current = true;
      const [a, b] = newFlipped.map(fid => newCards.find(c => c.id === fid));
      if (a.emoji === b.emoji) {
        const matched = newCards.map(c => newFlipped.includes(c.id) ? { ...c, matched: true } : c);
        setCards(matched); setFlipped([]); lockRef.current = false;
        if (matched.every(c => c.matched)) { clearInterval(timerRef.current); setWon(true); }
      } else {
        setTimeout(() => { setCards(nc => nc.map(c => newFlipped.includes(c.id) ? { ...c, flipped: false } : c)); setFlipped([]); lockRef.current = false; }, 900);
      }
    }
  };

  const reset = () => { setCards(makeCards()); setFlipped([]); setMoves(0); setWon(false); setTime(0); lockRef.current = false; clearInterval(timerRef.current); timerRef.current = setInterval(() => setTime(t => t + 1), 1000); };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0d0d1a] gap-4 p-4">
      <div className="flex items-center gap-6">
        <p className="text-white font-bold">🎯 {moves} moves</p>
        <p className="text-white font-bold">⏱ {time}s</p>
        <button onClick={reset} className="px-4 py-2 bg-violet-700 text-white font-bold rounded-xl hover:bg-violet-600">🔄 New Game</button>
      </div>
      {won && <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-400 font-black text-2xl">🎉 Won in {moves} moves & {time}s!</motion.p>}
      <div className="grid grid-cols-6 gap-2">
        {cards.map(card => (
          <motion.button key={card.id} onClick={() => click(card.id)}
            whileTap={{ scale: 0.9 }}
            className={`w-14 h-14 rounded-2xl text-2xl flex items-center justify-center font-bold transition-all border-2 ${card.matched ? 'bg-green-600/20 border-green-500/50' : card.flipped ? 'bg-violet-600/30 border-violet-400' : 'bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-500'}`}>
            {(card.flipped || card.matched) ? card.emoji : '?'}
          </motion.button>
        ))}
      </div>
    </div>
  );
}