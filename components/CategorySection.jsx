import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, FlaskConical, BookOpen, Sparkles, Monitor, Shield, ShieldOff } from 'lucide-react';

export default function CategorySection({ onResetDevice, hasGoGuardian, onToggleGoGuardian }) {
  const categories = [
    {
      title: 'Math Games',
      icon: Calculator,
      color: 'from-cyan-500 to-blue-600',
      shadow: 'shadow-cyan-500/30',
      desc: 'Master numbers through play',
      games: ['Number Ninja', 'Algebra Quest', 'Geometry Dash'],
    },
    {
      title: 'Science Games',
      icon: FlaskConical,
      color: 'from-green-500 to-emerald-600',
      shadow: 'shadow-green-500/30',
      desc: 'Discover & experiment',
      games: ['Lab Simulator', 'Planet Explorer', 'Chemistry Mix'],
    },
    {
      title: 'ELA & Reading',
      icon: BookOpen,
      color: 'from-pink-500 to-purple-600',
      shadow: 'shadow-pink-500/30',
      desc: 'Words come alive',
      games: ['Word Wizard', 'Story Builder', 'Grammar Galaxy'],
    },
  ];

  return (
    <>
      {/* Inspiration Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-8"
      >
        <a 
          href="https://neal.fun" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl text-purple-300 hover:text-purple-200 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Inspiration from Neal.Fun</span>
        </a>
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={onResetDevice}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            <Monitor className="w-4 h-4" />
            Change Device / Menu
          </button>
          <button
            onClick={onToggleGoGuardian}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
              hasGoGuardian
                ? 'bg-green-500/20 border-green-500/40 text-green-400 hover:bg-green-500/30'
                : 'bg-slate-700/50 border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {hasGoGuardian ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
            Blocked Mode: {hasGoGuardian ? 'ON' : 'OFF'}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
        <motion.div
          key={cat.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          whileHover={{ y: -8, scale: 1.02 }}
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${cat.color} p-6 cursor-pointer shadow-2xl ${cat.shadow}`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
              <cat.icon className="w-7 h-7 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">{cat.title}</h3>
            <p className="text-white/80 mb-4">{cat.desc}</p>
            
            <div className="space-y-2">
              {cat.games.map((game) => (
                <div
                  key={game}
                  className="flex items-center gap-2 text-white/90 text-sm"
                >
                  <Sparkles className="w-3 h-3" />
                  {game}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        ))}
      </div>
    </>
  );
}