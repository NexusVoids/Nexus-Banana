import React from 'react';
import { motion } from 'framer-motion';

export default function FunGames() {
  const games = [
    { name: 'Banana Jump', desc: 'Endless jumping fun!', color: 'from-yellow-400 to-yellow-600', emoji: '🍌' },
    { name: 'Speed Racer', desc: 'Race to the finish', color: 'from-red-500 to-pink-500', emoji: '🏎️' },
    { name: 'Puzzle Master', desc: 'Brain-teasing puzzles', color: 'from-purple-500 to-indigo-500', emoji: '🧩' },
    { name: 'Adventure Quest', desc: 'Epic RPG adventure', color: 'from-green-500 to-emerald-500', emoji: '⚔️' },
    { name: 'Code Breaker', desc: 'Learn coding basics', color: 'from-cyan-500 to-blue-500', emoji: '💻' },
    { name: 'Block Builder', desc: 'Create amazing worlds', color: 'from-orange-500 to-red-500', emoji: '🧱' },
    { name: 'Space Shooter', desc: 'Defend the galaxy', color: 'from-slate-700 to-purple-800', emoji: '🚀' },
    { name: 'Ninja Slice', desc: 'Slice and dice!', color: 'from-pink-500 to-rose-600', emoji: '🥷' },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        🎮 Fun Games + Coding
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {games.map((game, i) => (
          <motion.div
            key={game.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            className={`p-5 rounded-2xl bg-gradient-to-br ${game.color} cursor-pointer shadow-xl`}
          >
            <span className="text-3xl mb-2 block">{game.emoji}</span>
            <h4 className="text-lg font-bold text-white">{game.name}</h4>
            <p className="text-white/80 text-xs mt-1">{game.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}