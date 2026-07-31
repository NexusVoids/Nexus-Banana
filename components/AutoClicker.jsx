import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mouse, Settings, X, Zap, Target, Activity } from 'lucide-react';

export default function AutoClicker({ onClose }) {
  const [isRunning, setIsRunning] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [interval, setIntervalMs] = useState(100);
  const [unit, setUnit] = useState('ms');
  const [doubleClick, setDoubleClick] = useState(false);
  const [hotkey, setHotkey] = useState('F6');
  const [settingHotkey, setSettingHotkey] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [clickSound, setClickSound] = useState(false);
  const [randomize, setRandomize] = useState(false);
  const [clickHistory, setClickHistory] = useState([]);
  const [sessionTime, setSessionTime] = useState(0);
  const intervalRef = useRef(null);
  const hotKeyRef = useRef(hotkey);
  const sessionRef = useRef(null);
  const audioCtx = useRef(null);

  hotKeyRef.current = hotkey;

  const getIntervalMs = useCallback(() => {
    const base = unit === 's' ? interval * 1000 : interval;
    if (randomize) {
      const jitter = base * 0.2;
      return base + (Math.random() * jitter * 2 - jitter);
    }
    return base;
  }, [interval, unit, randomize]);

  const playClick = useCallback(() => {
    if (!clickSound) return;
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioCtx.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  }, [clickSound]);

  const doClick = useCallback(() => {
    const el = document.elementFromPoint(cursorPos.x, cursorPos.y);
    if (el) {
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: cursorPos.x, clientY: cursorPos.y }));
      if (doubleClick) {
        el.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true, clientX: cursorPos.x, clientY: cursorPos.y }));
      }
    }
    playClick();
    setClickCount(c => {
      const next = c + 1;
      setClickHistory(h => [...h.slice(-19), next]);
      return next;
    });
  }, [cursorPos, doubleClick, playClick]);

  useEffect(() => {
    const move = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    if (isRunning) {
      const tick = () => {
        doClick();
        intervalRef.current = setTimeout(tick, getIntervalMs());
      };
      intervalRef.current = setTimeout(tick, getIntervalMs());
      sessionRef.current = setInterval(() => setSessionTime(t => t + 1), 1000);
    } else {
      clearTimeout(intervalRef.current);
      clearInterval(sessionRef.current);
    }
    return () => {
      clearTimeout(intervalRef.current);
      clearInterval(sessionRef.current);
    };
  }, [isRunning, doClick, getIntervalMs]);

  useEffect(() => {
    const handler = (e) => {
      if (settingHotkey) return;
      if (e.key === hotKeyRef.current || e.code === hotKeyRef.current) {
        e.preventDefault();
        setIsRunning(r => !r);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [settingHotkey]);

  const handleHotkeySet = (e) => {
    e.preventDefault();
    const key = e.key === ' ' ? 'Space' : e.key;
    setHotkey(key);
    setSettingHotkey(false);
  };

  const cps = unit === 's' ? (1 / interval).toFixed(2) : (1000 / interval).toFixed(1);
  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-[#0d1117] border border-green-500/30 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-green-500/20 bg-green-500/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Mouse className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Auto Clicker</h2>
              <p className="text-green-400 text-xs">GG Undetectable • Pro Edition</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Main Status */}
          <div className="bg-[#161b22] border border-slate-700/50 rounded-xl p-6 flex flex-col items-center gap-4">
            <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-300 cursor-pointer ${
              isRunning
                ? 'border-green-400 bg-green-400/10 shadow-[0_0_40px_rgba(74,222,128,0.4)] animate-pulse'
                : 'border-slate-600 bg-slate-800/50 hover:border-slate-400'
            }`} onClick={() => setIsRunning(r => !r)}>
              <Mouse className={`w-10 h-10 transition-colors ${isRunning ? 'text-green-400' : 'text-slate-500'}`} />
            </div>

            <div className="text-center">
              <div className={`text-3xl font-black tracking-widest ${isRunning ? 'text-green-400' : 'text-slate-400'}`}>
                {isRunning ? 'CLICKING' : 'IDLE'}
              </div>
              <div className="text-slate-500 text-xs mt-1">
                {isRunning ? `Press ${hotkey} to stop` : `Press ${hotkey} to start`}
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 w-full">
              <div className="bg-slate-800/60 rounded-lg p-3 text-center">
                <div className="text-green-400 font-bold text-lg">{clickCount.toLocaleString()}</div>
                <div className="text-slate-500 text-xs">Clicks</div>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-3 text-center">
                <div className="text-cyan-400 font-bold text-lg">{cps}</div>
                <div className="text-slate-500 text-xs">CPS</div>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-3 text-center">
                <div className="text-purple-400 font-bold text-lg">{formatTime(sessionTime)}</div>
                <div className="text-slate-500 text-xs">Time</div>
              </div>
            </div>

            {/* Mini click graph */}
            {clickHistory.length > 1 && (
              <div className="w-full h-10 flex items-end gap-0.5">
                {clickHistory.map((v, i) => {
                  const max = Math.max(...clickHistory);
                  const h = max > 0 ? (v / max) * 100 : 0;
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-green-500/40 rounded-sm transition-all"
                      style={{ height: `${h}%`, minHeight: '2px' }}
                    />
                  );
                })}
              </div>
            )}

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setIsRunning(r => !r)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                  isRunning
                    ? 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
                    : 'bg-green-500 text-black hover:bg-green-400'
                }`}
              >
                {isRunning ? '⏹ STOP' : '▶ START'}
              </button>
              <button
                onClick={() => { setClickCount(0); setClickHistory([]); setSessionTime(0); }}
                className="px-4 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 text-sm transition-all"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-amber-400/80 text-xs">
            ⚠ Fires real mouse click events within this browser tab. Works great in iframe games!
          </div>

          {/* Settings */}
          <div className="bg-[#161b22] border border-slate-700/50 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
              <Settings className="w-4 h-4" />
              Settings
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">HOTKEY</label>
                <button
                  onFocus={() => setSettingHotkey(true)}
                  onBlur={() => setSettingHotkey(false)}
                  onKeyDown={settingHotkey ? handleHotkeySet : undefined}
                  className={`w-full h-10 rounded-lg border text-center font-mono text-sm transition-colors outline-none ${
                    settingHotkey
                      ? 'border-green-400 bg-green-400/10 text-green-300'
                      : 'border-slate-600 bg-slate-800 text-white hover:border-slate-500'
                  }`}
                >
                  {settingHotkey ? 'Press a key...' : hotkey}
                </button>
                <p className="text-slate-600 text-xs mt-1">Click then press any key</p>
              </div>

              <div>
                <label className="text-slate-400 text-xs mb-1 block">CLICK INTERVAL</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    min="1"
                    value={interval}
                    onChange={e => setIntervalMs(Number(e.target.value) || 1)}
                    className="flex-1 h-10 rounded-lg border border-slate-600 bg-slate-800 text-white px-3 text-sm focus:outline-none focus:border-green-400"
                  />
                  <select
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="h-10 rounded-lg border border-slate-600 bg-slate-800 text-white px-2 text-sm focus:outline-none"
                  >
                    <option value="ms">ms</option>
                    <option value="s">s</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick presets */}
            <div>
              <label className="text-slate-400 text-xs mb-2 block">QUICK PRESETS</label>
              <div className="flex gap-2 flex-wrap">
                {[['1 CPS', 1000, 'ms'], ['5 CPS', 200, 'ms'], ['10 CPS', 100, 'ms'], ['20 CPS', 50, 'ms'], ['50 CPS', 20, 'ms']].map(([label, val, u]) => (
                  <button
                    key={label}
                    onClick={() => { setIntervalMs(val); setUnit(u); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      interval === val && unit === u
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2">
              {[
                { label: 'Double Click', desc: 'Double-click each interval', val: doubleClick, set: setDoubleClick },
                { label: 'Randomize Timing', desc: '±20% jitter (more human)', val: randomize, set: setRandomize },
                { label: 'Click Sound', desc: 'Play tick sound', val: clickSound, set: setClickSound },
              ].map(({ label, desc, val, set }) => (
                <div key={label} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <div className="text-white text-sm font-medium">{label}</div>
                    <div className="text-slate-500 text-xs">{desc}</div>
                  </div>
                  <button
                    onClick={() => set(v => !v)}
                    className={`w-11 h-6 rounded-full transition-all relative ${val ? 'bg-green-500' : 'bg-slate-700'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${val ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}