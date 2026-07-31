import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Beaker, Atom, Leaf, Microscope, Zap, Globe } from 'lucide-react';
import GameModal from './GameModal';

export default function ScienceExperiments({ hasGoGuardian = false }) {
  const experiments = [
    { name: 'Volcano Eruption', desc: 'Create explosive reactions!', icon: Beaker, color: 'from-red-500 to-orange-500' },
    { name: 'Atom Smasher', desc: 'Explore particle physics', icon: Atom, color: 'from-blue-500 to-purple-500' },
    { name: 'Plant Growth Lab', desc: 'Watch seeds become trees', icon: Leaf, color: 'from-green-500 to-lime-500' },
    { name: 'Microscope World', desc: 'Zoom into tiny universes', icon: Microscope, color: 'from-pink-500 to-rose-500' },
    { name: 'Electricity Circuit', desc: 'Build working circuits', icon: Zap, color: 'from-yellow-500 to-amber-500' },
    { name: 'Earth Explorer', desc: 'Journey through layers', icon: Globe, color: 'from-cyan-500 to-teal-500' },
  ];

  const allGames = [
    // GoGuardian safe (edu sites)
    { name: 'PhET Simulations', desc: 'Interactive science sims', color: 'from-emerald-500 to-green-600', emoji: '🔬', url: 'https://phet.colorado.edu/en/simulations/filter?subjects=chemistry&type=html', goGuardianSafe: true },
    { name: 'NASA Solar System', desc: 'Travel the solar system', color: 'from-indigo-500 to-blue-600', emoji: '🪐', url: 'https://eyes.nasa.gov/apps/solar-system/', goGuardianSafe: true },
    { name: 'PhET Physics', desc: 'Motion and forces', color: 'from-orange-500 to-red-500', emoji: '🎱', url: 'https://phet.colorado.edu/en/simulations/filter?subjects=physics&type=html', goGuardianSafe: true },
    { name: 'Cells Alive', desc: 'Biology up close', color: 'from-lime-500 to-green-500', emoji: '🧬', url: 'https://www.cellsalive.com/', goGuardianSafe: true },
    { name: 'PBS Learning Science', desc: 'Science videos & games', color: 'from-sky-500 to-blue-500', emoji: '🌦️', url: 'https://pbslearningmedia.org/', goGuardianSafe: true },
    { name: 'NASA Kids Club', desc: 'Space games for kids', color: 'from-purple-500 to-violet-600', emoji: '🚀', url: 'https://www.nasa.gov/kids-club/', goGuardianSafe: true },
    // Non-GoGuardian (fun but may be blocked)
    { name: 'Spore Cell Stage', desc: 'Evolve your cell!', color: 'from-pink-500 to-rose-600', emoji: '🦠', url: 'https://poki.com/en/g/spore', goGuardianSafe: false },
    { name: 'Coolmath Science', desc: 'Fun science puzzles', color: 'from-amber-500 to-orange-600', emoji: '⚗️', url: 'https://www.coolmathgames.com/', goGuardianSafe: false },
  ];

  const [selectedGame, setSelectedGame] = useState(null);
  const games = hasGoGuardian ? allGames.filter(g => g.goGuardianSafe) : allGames;
  const gamesList = games.map(g => ({ ...g, internalUrl: g.url, externalUrl: g.url, embeddable: false }));

  const handleGameClick = (game) => {
    window.open(game.url, '_blank');
  };

  return (
    <>
      <div className="space-y-12">
        {hasGoGuardian && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm font-medium">
            🛡️ Blocked Mode — showing only unblocked educational games
          </div>
        )}

        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Beaker className="w-5 h-5 text-green-400" />
            Interactive Experiments
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {experiments.map((exp, i) => (
              <motion.div
                key={exp.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`p-5 rounded-2xl bg-gradient-to-br ${exp.color} cursor-pointer shadow-xl relative overflow-hidden`}
              >
                <div className="absolute top-2 right-2 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                <exp.icon className="w-10 h-10 text-white mb-3" />
                <h4 className="text-lg font-bold text-white">{exp.name}</h4>
                <p className="text-white/80 text-sm">{exp.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Science Games</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gamesList.map((game, i) => (
              <motion.div
                key={game.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => handleGameClick(game)}
                className={`p-6 rounded-2xl bg-gradient-to-br ${game.color} cursor-pointer shadow-xl relative`}
              >
                <span className="text-4xl mb-3 block">{game.emoji}</span>
                <h4 className="text-xl font-bold text-white">{game.name}</h4>
                <p className="text-white/80 text-sm mt-1">{game.desc}</p>
                <span className="absolute top-3 right-3 text-xs bg-white/20 px-2 py-0.5 rounded-full text-white">🔗 New Tab</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center py-8 border-t border-purple-500/20"
        >
          <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 tracking-widest">
            ADAM WAS HERE
          </p>
          <p className="text-xs text-slate-500 mt-1">🍌 Est. 2024</p>
        </motion.div>
      </div>

      
    </>
  );
}