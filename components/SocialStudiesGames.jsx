import React from 'react';
import { motion } from 'framer-motion';

export default function SocialStudiesGames() {
  const games = [
    { name: 'Time Traveler', desc: 'Journey through history', color: 'from-amber-500 to-orange-600', emoji: '⏰' },
    { name: 'World Civilizations', desc: 'Build ancient empires', color: 'from-yellow-500 to-amber-500', emoji: '🏛️' },
    { name: 'Geography Quest', desc: 'Explore every continent', color: 'from-green-500 to-teal-500', emoji: '🗺️' },
    { name: 'American History', desc: 'From colonies to today', color: 'from-blue-500 to-indigo-500', emoji: '🦅' },
    { name: 'World Wars', desc: 'Learn major conflicts', color: 'from-gray-600 to-slate-700', emoji: '⚔️' },
    { name: 'Ancient Egypt', desc: 'Pyramids and pharaohs', color: 'from-yellow-600 to-orange-700', emoji: '🏺' },
    { name: 'Medieval Times', desc: 'Knights and castles', color: 'from-purple-600 to-indigo-600', emoji: '🏰' },
    { name: 'Map Master', desc: 'Name every country', color: 'from-cyan-500 to-blue-500', emoji: '🌍' },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        📜 Social Studies & History Games
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {games.map((game, i) => (
          <motion.div
            key={game.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05, y: -5 }}
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