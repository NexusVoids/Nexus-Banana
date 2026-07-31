import React from 'react';
import { motion } from 'framer-motion';
import { Code, Terminal, Cpu, Binary } from 'lucide-react';

export default function TechGames() {
  const games = [
    { name: 'Code Academy', desc: 'Learn Python basics', icon: Code, color: 'from-blue-500 to-indigo-600' },
    { name: 'HTML Builder', desc: 'Create web pages', icon: Terminal, color: 'from-orange-500 to-red-500' },
    { name: 'Robot Commander', desc: 'Program your robot', icon: Cpu, color: 'from-purple-500 to-pink-500' },
    { name: 'Binary Challenge', desc: 'Master 1s and 0s', icon: Binary, color: 'from-green-500 to-teal-500' },
    { name: 'JavaScript Journey', desc: 'Interactive coding', icon: Code, color: 'from-yellow-500 to-amber-500' },
    { name: 'CSS Designer', desc: 'Style like a pro', icon: Terminal, color: 'from-cyan-500 to-blue-500' },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Code className="w-5 h-5 text-blue-400" />
        Tech & Coding Games
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game, i) => (
          <motion.div
            key={game.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.03, x: 5 }}
            className={`p-6 rounded-2xl bg-gradient-to-br ${game.color} cursor-pointer shadow-xl flex items-start gap-4`}
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <game.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">{game.name}</h4>
              <p className="text-white/80 text-sm mt-1">{game.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}