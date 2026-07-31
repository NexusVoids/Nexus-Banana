import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, BookOpen, Code, Zap, ChevronRight } from 'lucide-react';

// ── Banana Language Interpreter ──
function runBanana(code, setOutput, canvas) {
  const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//'));
  const vars = {};
  const ctx = canvas ? canvas.getContext('2d') : null;
  if (ctx) { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#1e1e2e'; ctx.fillRect(0, 0, canvas.width, canvas.height); }

  const resolve = (v) => {
    if (v === undefined) return undefined;
    const s = String(v).trim();
    if (s.startsWith('"') && s.endsWith('"')) return s.slice(1,-1);
    if (!isNaN(s)) return Number(s);
    if (s in vars) return vars[s];
    return s;
  };

  const output = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    // PRINT "text" or PRINT varname
    if (/^PRINT\s+(.+)/i.test(line)) {
      const val = resolve(line.match(/^PRINT\s+(.+)/i)[1]);
      output.push(String(val));
    }
    // SET varname = value
    else if (/^SET\s+(\w+)\s*=\s*(.+)/i.test(line)) {
      const [, name, val] = line.match(/^SET\s+(\w+)\s*=\s*(.+)/i);
      vars[name] = resolve(val);
    }
    // ADD varname + value
    else if (/^ADD\s+(\w+)\s*\+\s*(.+)/i.test(line)) {
      const [, name, val] = line.match(/^ADD\s+(\w+)\s*\+\s*(.+)/i);
      vars[name] = (Number(vars[name]) || 0) + Number(resolve(val));
    }
    // DRAW CIRCLE x y radius color
    else if (/^DRAW CIRCLE\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)/i.test(line) && ctx) {
      const [, x, y, r, col] = line.match(/^DRAW CIRCLE\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)/i);
      ctx.beginPath(); ctx.arc(Number(resolve(x)), Number(resolve(y)), Number(resolve(r)), 0, Math.PI*2);
      ctx.fillStyle = resolve(col); ctx.fill();
    }
    // DRAW RECT x y w h color
    else if (/^DRAW RECT\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)/i.test(line) && ctx) {
      const [, x, y, w, h, col] = line.match(/^DRAW RECT\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)/i);
      ctx.fillStyle = resolve(col); ctx.fillRect(Number(resolve(x)), Number(resolve(y)), Number(resolve(w)), Number(resolve(h)));
    }
    // DRAW TEXT x y "text" color
    else if (/^DRAW TEXT\s+(\S+)\s+(\S+)\s+(".*?"|\S+)\s*(\S+)?/i.test(line) && ctx) {
      const [, x, y, text, col] = line.match(/^DRAW TEXT\s+(\S+)\s+(\S+)\s+(".*?"|\S+)\s*(\S+)?/i);
      ctx.fillStyle = resolve(col) || '#fff'; ctx.font = '20px monospace';
      ctx.fillText(resolve(text), Number(resolve(x)), Number(resolve(y)));
    }
    // REPEAT n TIMES ... END
    else if (/^REPEAT\s+(\S+)\s+TIMES/i.test(line)) {
      const n = Number(resolve(line.match(/^REPEAT\s+(\S+)\s+TIMES/i)[1]));
      const block = [];
      i++;
      while (i < lines.length && !/^END/i.test(lines[i])) { block.push(lines[i]); i++; }
      for (let rep = 0; rep < n; rep++) {
        vars['LOOP_INDEX'] = rep;
        runBanana(block.join('\n'), (v) => output.push(...v), canvas);
      }
    }
    // IF var == value ... END
    else if (/^IF\s+(\S+)\s*(==|!=|>|<)\s*(\S+)/i.test(line)) {
      const [, left, op, right] = line.match(/^IF\s+(\S+)\s*(==|!=|>|<)\s*(\S+)/i);
      const a = resolve(left), b = resolve(right);
      const cond = op === '==' ? a == b : op === '!=' ? a != b : op === '>' ? a > b : a < b;
      const block = [];
      i++;
      while (i < lines.length && !/^END/i.test(lines[i])) { block.push(lines[i]); i++; }
      if (cond) runBanana(block.join('\n'), (v) => output.push(...v), canvas);
    }
    i++;
  }
  setOutput(output);
}

// ── Simple Banana Interpreter (English-like) ──
function runSimpleBanana(code, setOutput, canvas) {
  const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('note:'));
  const output = [];
  const ctx = canvas ? canvas.getContext('2d') : null;
  if (ctx) { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#1e1e2e'; ctx.fillRect(0, 0, canvas.width, canvas.height); }

  for (const line of lines) {
    // say "hello"
    if (/^say\s+"(.*)"/i.test(line)) output.push(line.match(/^say\s+"(.*)"/i)[1]);
    // count from X to Y (print numbers)
    else if (/^count from (\d+) to (\d+)/i.test(line)) {
      const [, a, b] = line.match(/^count from (\d+) to (\d+)/i);
      for (let n = +a; n <= +b; n++) output.push(String(n));
    }
    // repeat X times: say "..."
    else if (/^repeat (\d+) times:\s*say\s+"(.*)"/i.test(line)) {
      const [, n, msg] = line.match(/^repeat (\d+) times:\s*say\s+"(.*)"/i);
      for (let j = 0; j < +n; j++) output.push(msg);
    }
    // draw a red circle at 100, 100
    else if (/^draw a (\w+) circle at (\d+),\s*(\d+)/i.test(line) && ctx) {
      const [, color, x, y] = line.match(/^draw a (\w+) circle at (\d+),\s*(\d+)/i);
      ctx.beginPath(); ctx.arc(+x, +y, 40, 0, Math.PI*2); ctx.fillStyle = color; ctx.fill();
    }
    // draw a blue box at 50, 50 size 80
    else if (/^draw a (\w+) box at (\d+),\s*(\d+) size (\d+)/i.test(line) && ctx) {
      const [, color, x, y, s] = line.match(/^draw a (\w+) box at (\d+),\s*(\d+) size (\d+)/i);
      ctx.fillStyle = color; ctx.fillRect(+x, +y, +s, +s);
    }
    // write "Hello" at 100, 100
    else if (/^write "([^"]*)" at (\d+),\s*(\d+)/i.test(line) && ctx) {
      const [, text, x, y] = line.match(/^write "([^"]*)" at (\d+),\s*(\d+)/i);
      ctx.fillStyle = '#fff'; ctx.font = '22px monospace'; ctx.fillText(text, +x, +y);
    }
  }
  setOutput(output);
}

const BANANA_TUTORIALS = [
  {
    lang: 'Banana',
    title: 'Hello World',
    desc: 'Print your first message',
    code: `// My first Banana program!\nPRINT "Hello, World!"\nPRINT "Welcome to Banana lang 🍌"`,
  },
  {
    lang: 'Banana',
    title: 'Variables & Math',
    desc: 'Using SET and ADD',
    code: `SET score = 10\nADD score + 5\nPRINT score\nSET name = "Banana"\nPRINT name`,
  },
  {
    lang: 'Banana',
    title: 'Drawing Shapes',
    desc: 'Draw on the canvas',
    code: `DRAW RECT 10 10 200 150 #4f46e5\nDRAW CIRCLE 300 100 60 #f59e0b\nDRAW TEXT 100 200 "Hi!" #ffffff`,
  },
  {
    lang: 'Banana',
    title: 'Loops',
    desc: 'Repeat things with REPEAT',
    code: `REPEAT 5 TIMES\n  PRINT "Banan!"\nEND`,
  },
  {
    lang: 'Banana',
    title: 'If Statements',
    desc: 'Make decisions with IF',
    code: `SET score = 10\nIF score > 5\n  PRINT "You passed!"\nEND\nIF score < 5\n  PRINT "Try again"\nEND`,
  },
  {
    lang: 'SimpleBanana',
    title: 'Say Hello',
    desc: 'Your first SimpleBanana program',
    code: `note: This is a comment\nsay "Hello World!"\nsay "I love Banana 🍌"`,
  },
  {
    lang: 'SimpleBanana',
    title: 'Counting',
    desc: 'Count from one number to another',
    code: `say "Let me count!"\ncount from 1 to 5\nsay "Done counting!"`,
  },
  {
    lang: 'SimpleBanana',
    title: 'Repeat Things',
    desc: 'Repeat a message multiple times',
    code: `repeat 3 times: say "Banana!"\nsay "All done!"`,
  },
  {
    lang: 'SimpleBanana',
    title: 'Drawing',
    desc: 'Draw shapes in plain English',
    code: `draw a blue circle at 150, 150\ndraw a red box at 250, 50 size 100\nwrite "Cool!" at 160, 160`,
  },
];

export default function BananaLang({ onClose }) {
  const [tab, setTab] = useState('ide');
  const [lang, setLang] = useState('Banana');
  const [code, setCode] = useState(BANANA_TUTORIALS[0].code);
  const [output, setOutput] = useState([]);
  const [tutCat, setTutCat] = useState('all');
  const canvasRef = useRef(null);

  const run = () => {
    const canvas = canvasRef.current;
    const handler = (arr) => setOutput(arr);
    if (lang === 'Banana') runBanana(code, handler, canvas);
    else runSimpleBanana(code, handler, canvas);
  };

  const tutorials = tutCat === 'all' ? BANANA_TUTORIALS : BANANA_TUTORIALS.filter(t => t.lang === tutCat);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full bg-[#0d0d1a] flex flex-col overflow-hidden rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-purple-500/20 bg-[#13132a]">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍌</span>
          <div>
            <h2 className="text-white font-black text-lg">Banana Language</h2>
            <p className="text-purple-300/60 text-xs">Custom coding language by NexusBanan</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[#1e1e3a] rounded-xl p-1 gap-1">
            {['ide', 'tutorials'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-purple-600 text-white' : 'text-white/40 hover:text-white'}`}>
                {t === 'ide' ? '💻 IDE' : '📚 Tutorials'}
              </button>
            ))}
          </div>

        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {tab === 'ide' ? (
          <div className="flex h-full gap-0">
            {/* Editor */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-3 px-4 py-2 bg-[#1a1a2e] border-b border-white/5">
                <div className="flex bg-[#0d0d1a] rounded-lg p-0.5 gap-0.5">
                  {['Banana', 'SimpleBanana'].map(l => (
                    <button key={l} onClick={() => setLang(l)}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${lang === l ? 'bg-yellow-500 text-black' : 'text-white/40 hover:text-white'}`}>
                      {l === 'Banana' ? '🍌 Banana' : '🐣 SimpleBanana'}
                    </button>
                  ))}
                </div>
                <button onClick={run}
                  className="flex items-center gap-2 px-4 py-1.5 bg-green-500 hover:bg-green-400 text-black rounded-lg text-xs font-bold transition-colors ml-auto">
                  <Play className="w-3 h-3" /> Run
                </button>
              </div>
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 bg-[#0d0d1a] text-green-300 font-mono text-sm p-4 focus:outline-none resize-none border-0"
                style={{ fontFamily: 'monospace', lineHeight: 1.6 }}
              />
            </div>
            {/* Output & Canvas */}
            <div className="w-80 flex flex-col border-l border-white/5 bg-[#111122]">
              <div className="px-4 py-2 border-b border-white/5 text-xs text-white/40 font-bold uppercase tracking-wider">Canvas</div>
              <canvas ref={canvasRef} width={320} height={200} className="w-full bg-[#1e1e2e]" />
              <div className="px-4 py-2 border-b border-white/5 text-xs text-white/40 font-bold uppercase tracking-wider">Output</div>
              <div className="flex-1 overflow-y-auto p-3 font-mono text-sm space-y-1">
                {output.length === 0 ? (
                  <p className="text-white/20">Run your code to see output here...</p>
                ) : output.map((line, i) => (
                  <div key={i} className="text-green-400">&gt; {line}</div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full">
            {/* Tutorial list */}
            <div className="w-72 border-r border-white/5 overflow-y-auto bg-[#111122]">
              <div className="p-4">
                <div className="flex gap-2 mb-4">
                  {['all', 'Banana', 'SimpleBanana'].map(c => (
                    <button key={c} onClick={() => setTutCat(c)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${tutCat === c ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/40 hover:text-white'}`}>
                      {c === 'all' ? 'All' : c === 'Banana' ? '🍌' : '🐣'}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  {tutorials.map((t, i) => (
                    <button key={i} onClick={() => { setCode(t.code); setLang(t.lang); setTab('ide'); }}
                      className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.lang === 'Banana' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-purple-500/20 text-purple-300'}`}>{t.lang}</span>
                        <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-white/60" />
                      </div>
                      <div className="text-white font-semibold text-sm mt-1">{t.title}</div>
                      <div className="text-white/40 text-xs">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Tutorial content */}
            <div className="flex-1 overflow-y-auto p-8">
              <h2 className="text-3xl font-black text-white mb-2">📚 Banana Language Docs</h2>
              <p className="text-white/40 mb-8">Select a tutorial on the left to open it in the IDE.</p>
              <div className="grid gap-6">
                <div className="bg-[#1a1a2e] rounded-2xl p-6">
                  <h3 className="text-yellow-400 font-black text-lg mb-3">🍌 Banana Language</h3>
                  <p className="text-white/60 text-sm mb-4">A structured language with clear commands. Good for logic, math, and drawing.</p>
                  <div className="space-y-2 font-mono text-sm">
                    {[
                      ['PRINT "text"', 'Output text'],
                      ['SET var = value', 'Create/set a variable'],
                      ['ADD var + number', 'Add to a variable'],
                      ['REPEAT n TIMES ... END', 'Loop n times'],
                      ['IF var op val ... END', 'Conditional (==, !=, >, <)'],
                      ['DRAW CIRCLE x y r color', 'Draw a circle'],
                      ['DRAW RECT x y w h color', 'Draw a rectangle'],
                      ['DRAW TEXT x y "text" color', 'Draw text on canvas'],
                    ].map(([cmd, desc]) => (
                      <div key={cmd} className="flex gap-4">
                        <span className="text-green-400 w-56 shrink-0">{cmd}</span>
                        <span className="text-white/40">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#1a1a2e] rounded-2xl p-6">
                  <h3 className="text-purple-400 font-black text-lg mb-3">🐣 SimpleBanana</h3>
                  <p className="text-white/60 text-sm mb-4">Plain English coding — great for beginners. Just describe what you want!</p>
                  <div className="space-y-2 font-mono text-sm">
                    {[
                      ['say "message"', 'Print a message'],
                      ['count from X to Y', 'Print numbers X through Y'],
                      ['repeat N times: say "..."', 'Repeat a message N times'],
                      ['draw a COLOR circle at X, Y', 'Draw a circle'],
                      ['draw a COLOR box at X, Y size S', 'Draw a square'],
                      ['write "text" at X, Y', 'Draw text on canvas'],
                      ['note: ...', 'Comment (ignored)'],
                    ].map(([cmd, desc]) => (
                      <div key={cmd} className="flex gap-4">
                        <span className="text-purple-300 w-56 shrink-0">{cmd}</span>
                        <span className="text-white/40">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}