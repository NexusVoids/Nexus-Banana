import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import NealFun from './NealFun';

export default function SecretGames({ onClose }) {
  const [showNeal, setShowNeal] = useState(false);
  const games = [
    { name: 'Roblox', url: 'https://www.roblox.com/', color: 'from-red-500 to-red-700', emoji: '🟥', badge: '🔥 HOT' },
    { name: 'Roblox Now.gg', url: 'https://now.gg/apps/roblox-corporation/5349/roblox.html', color: 'from-red-600 to-orange-600', emoji: '🎮', badge: '▶ Cloud' },
    { name: 'Minecraft', url: 'https://minecraft.net/', color: 'from-green-600 to-green-800', emoji: '⛏️', badge: '🔥 HOT' },
    { name: 'Minecraft Now.gg', url: 'https://now.gg/apps/mojang/2534/minecraft.html', color: 'from-green-500 to-emerald-700', emoji: '🟩', badge: '▶ Cloud' },
    { name: 'Flappy Bird', url: 'https://flappybird.io/', color: 'from-green-400 to-green-600', emoji: '🐦' },
    { name: 'YouTube', url: 'https://www.youtube.com/', color: 'from-red-500 to-red-700', emoji: '▶️' },
    { name: 'Subway Surfers', url: 'https://poki.com/en/g/subway-surfers', color: 'from-yellow-400 to-orange-500', emoji: '🛹' },
    { name: 'Slope', url: 'https://slope-game.com/', color: 'from-purple-500 to-indigo-600', emoji: '⛷️' },
    { name: 'Shell Shockers', url: 'https://shellshock.io/', color: 'from-amber-400 to-yellow-500', emoji: '🥚' },
    { name: '1v1.LOL', url: 'https://1v1.lol/', color: 'from-blue-500 to-cyan-500', emoji: '🔫' },
    { name: 'Drift Hunters', url: 'https://drifthunters.io/', color: 'from-slate-600 to-gray-700', emoji: '🚗' },
    { name: 'Basketball Stars', url: 'https://poki.com/en/g/basketball-stars', color: 'from-orange-500 to-red-500', emoji: '🏀' },
    { name: 'Retro Bowl', url: 'https://retro-bowl.io/', color: 'from-green-600 to-emerald-700', emoji: '🏈' },
    { name: 'Smash Karts', url: 'https://smashkarts.io/', color: 'from-pink-500 to-rose-600', emoji: '🏎️' },
    { name: 'Paper.io', url: 'https://paper-io.com/', color: 'from-cyan-400 to-blue-500', emoji: '📄' },
    { name: 'Krunker', url: 'https://krunker.io/', color: 'from-violet-500 to-purple-600', emoji: '🎯' },
    { name: 'Friday Night Funkin', url: 'https://fridaynightfunkin.net/', color: 'from-purple-600 to-pink-600', emoji: '🎵' },
    { name: 'Minecraft Classic', url: 'https://classic.minecraft.net/', color: 'from-yellow-600 to-green-700', emoji: '🧱', badge: '✅ Free' },
    { name: 'Now.gg Games', url: 'https://now.gg/', color: 'from-blue-600 to-indigo-700', emoji: '☁️', badge: '▶ Cloud' },
    { name: 'Fortnite', url: 'https://www.epicgames.com/fortnite/en-US/home', color: 'from-yellow-500 to-purple-700', emoji: '🏆' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl overflow-y-auto"
    >
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
              >
                🤫 Secret Zone
              </motion.h2>
              <p className="text-slate-400 mt-1">Shhh... you found it!</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-slate-700"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Neal Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => setShowNeal(true)}
            className="w-full p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 cursor-pointer shadow-xl mb-6 flex items-center gap-4"
          >
            <span className="text-5xl">🌐</span>
            <div className="text-left">
              <h4 className="text-2xl font-black text-white">Neal</h4>
              <p className="text-white/70 text-sm">Fun interactive experiences — 100% offline & unblocked!</p>
            </div>
            <span className="ml-auto bg-white/20 px-3 py-1 rounded-full text-white text-sm font-bold">PLAY ▶</span>
          </motion.button>

          {/* Games Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {games.map((game, i) => (
              <motion.a
                key={game.name}
                href={game.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`p-5 rounded-2xl bg-gradient-to-br ${game.color} cursor-pointer shadow-xl relative overflow-hidden group`}
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
                {game.badge && (
                  <span className="absolute top-2 left-2 text-xs bg-black/40 px-2 py-0.5 rounded-full text-white font-bold">{game.badge}</span>
                )}
                <span className="text-4xl mb-3 block">{game.emoji}</span>
                <h4 className="text-lg font-bold text-white">{game.name}</h4>
                <p className="text-white/60 text-xs mt-1">Click to play</p>
              </motion.a>
            ))}
          </div>

          <AnimatePresence>
            {showNeal && <NealFun onClose={() => setShowNeal(false)} />}
          </AnimatePresence>

          {/* Warning */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-slate-500 text-sm">
              ⚠️ These links open external sites. Play responsibly!
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}