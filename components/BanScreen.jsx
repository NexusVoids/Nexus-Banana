import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export default function BanScreen({ userProfile }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isPermanent, setIsPermanent] = useState(false);
  const [showAppeal, setShowAppeal] = useState(false);
  const [appealText, setAppealText] = useState('');
  const [appealSent, setAppealSent] = useState(false);

  useEffect(() => {
    if (!userProfile?.ban_expires) {
      setIsPermanent(true);
      return;
    }

    const calcTime = () => {
      const now = Date.now();
      const expires = new Date(userProfile.ban_expires).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setTimeLeft({ hours, minutes, seconds });
    };

    calcTime();
    const interval = setInterval(calcTime, 1000);
    return () => clearInterval(interval);
  }, [userProfile]);

  const pad = (n) => String(n).padStart(2, '0');

  const sendAppeal = async () => {
    if (!appealText.trim()) return;
    // Store appeal as a suggestion
    await base44.entities.SuggestionItem.create({
      category: 'other',
      title: `Ban Appeal: ${userProfile?.username || 'User'}`,
      description: `APPEAL from ${userProfile?.username || userProfile?.user_email}: ${appealText}`,
      submitter_name: userProfile?.username || 'Banned User',
      status: 'pending'
    });
    setAppealSent(true);
    setShowAppeal(false);
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-900/40 rounded-full"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, repeatType: 'reverse' }}
          />
        ))}
      </div>

      {/* Glitch scanlines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.03) 2px, rgba(255,0,0,0.03) 4px)',
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl w-full"
      >
        {/* Big XX */}
        <motion.div
          animate={{ scale: [1, 1.02, 1], opacity: [1, 0.85, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[120px] md:text-[180px] font-black text-red-600 leading-none select-none mb-4"
          style={{ textShadow: '0 0 60px rgba(255,0,0,0.5), 0 0 120px rgba(255,0,0,0.2)', fontFamily: 'monospace' }}
        >
          ✕✕
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-black text-red-500 mb-2 tracking-widest uppercase"
          style={{ textShadow: '0 0 20px rgba(255,0,0,0.6)' }}
        >
          You Are Banned
        </motion.h1>

        {userProfile?.ban_reason && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-red-400/70 text-sm mb-6 max-w-md"
          >
            Reason: <span className="text-red-300 font-semibold">{userProfile.ban_reason}</span>
          </motion.p>
        )}

        {/* Timer */}
        {isPermanent ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-red-950/60 border border-red-800/50 rounded-2xl px-8 py-4 mb-8"
          >
            <p className="text-red-400 text-lg font-bold tracking-widest">⚠ PERMANENT BAN ⚠</p>
            <p className="text-red-600 text-xs mt-1">This ban has no expiration date</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <p className="text-red-600/60 text-xs uppercase tracking-widest mb-3 font-bold">Time Remaining</p>
            <div className="flex items-center gap-3">
              <div className="bg-red-950/80 border border-red-800/50 rounded-xl px-6 py-4 min-w-[90px]">
                <div className="text-5xl font-black text-red-400 font-mono" style={{ textShadow: '0 0 20px rgba(255,0,0,0.5)' }}>
                  {pad(timeLeft.hours)}
                </div>
                <div className="text-xs text-red-700 uppercase tracking-widest mt-1">Hours</div>
              </div>
              <div className="text-3xl font-black text-red-700 font-mono">:</div>
              <div className="bg-red-950/80 border border-red-800/50 rounded-xl px-6 py-4 min-w-[90px]">
                <div className="text-5xl font-black text-red-400 font-mono" style={{ textShadow: '0 0 20px rgba(255,0,0,0.5)' }}>
                  {pad(timeLeft.minutes)}
                </div>
                <div className="text-xs text-red-700 uppercase tracking-widest mt-1">Minutes</div>
              </div>
              <div className="text-3xl font-black text-red-700 font-mono">:</div>
              <div className="bg-red-950/80 border border-red-800/50 rounded-xl px-6 py-4 min-w-[90px]">
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-5xl font-black text-red-500/70 font-mono"
                >
                  {pad(timeLeft.seconds)}
                </motion.div>
                <div className="text-xs text-red-700 uppercase tracking-widest mt-1">Seconds</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Appeal button */}
        {!appealSent ? (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => setShowAppeal(true)}
            className="px-8 py-3 bg-transparent border border-red-800/60 text-red-600 hover:border-red-600 hover:text-red-400 rounded-xl font-bold tracking-wider transition-all text-sm uppercase"
          >
            Submit an Appeal
          </motion.button>
        ) : (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-green-500/80 text-sm font-semibold border border-green-800/40 px-6 py-3 rounded-xl"
          >
            ✓ Appeal submitted — staff will review it
          </motion.p>
        )}
      </motion.div>

      {/* Appeal Modal */}
      <AnimatePresence>
        {showAppeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShowAppeal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-zinc-950 border border-red-900/50 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-red-400 font-black text-xl mb-1">Submit Appeal</h3>
              <p className="text-zinc-500 text-sm mb-4">Explain why you believe this ban was unfair or should be lifted.</p>
              <textarea
                value={appealText}
                onChange={e => setAppealText(e.target.value)}
                placeholder="Write your appeal here..."
                rows={5}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-red-700 mb-4"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowAppeal(false)} className="flex-1 py-2 bg-zinc-800 text-zinc-400 rounded-xl font-semibold hover:bg-zinc-700 text-sm">
                  Cancel
                </button>
                <button onClick={sendAppeal} disabled={!appealText.trim()} className="flex-1 py-2 bg-red-900/60 border border-red-700/50 text-red-400 rounded-xl font-semibold hover:bg-red-900 text-sm disabled:opacity-40">
                  Submit Appeal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}