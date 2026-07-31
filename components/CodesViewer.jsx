import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, Unlock, Coins, Search } from 'lucide-react';
import { ALL_CODES } from '@/components/codesData';
import { Input } from "@/components/ui/input";
import { spendBananBucks, getBananBucks, hasInfiniteBananBucks } from './BananBucks';

export default function CodesViewer({ onClose, unlockedCodes, onUnlockCode }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCodes = Object.entries(ALL_CODES).filter(([code, info]) =>
    code.includes(searchTerm.toLowerCase()) ||
    info.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    info.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUnlock = (code, cost) => {
    if (unlockedCodes.includes(code)) return;
    
    if (cost > 0) {
      const canAfford = spendBananBucks(cost);
      if (!canAfford && !hasInfiniteBananBucks()) {
        alert(`Not enough BananBucks! You need ${cost} but have ${getBananBucks()}`);
        return;
      }
    }
    
    onUnlockCode(code);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400">
            🔐 All Secret Codes
          </h2>
          <p className="text-slate-400 mt-1">
            {unlockedCodes.length} / {Object.keys(ALL_CODES).length} unlocked
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search codes..."
          className="bg-slate-800 border-purple-500/30 text-white"
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Codes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCodes.map(([code, info], i) => {
          const isUnlocked = unlockedCodes.includes(code);
          const canAfford = hasInfiniteBananBucks() || getBananBucks() >= info.cost;

          return (
            <motion.div
              key={code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`p-4 rounded-2xl border-2 ${
                isUnlocked
                  ? 'bg-green-500/10 border-green-500/30'
                  : canAfford
                  ? 'bg-slate-800/50 border-purple-500/30'
                  : 'bg-slate-800/30 border-slate-700/30 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {isUnlocked ? (
                      <Unlock className="w-4 h-4 text-green-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-500" />
                    )}
                    <h3 className="font-bold text-white uppercase text-sm">
                      {code}
                    </h3>
                  </div>
                  <p className="text-slate-300 text-sm font-semibold">
                    {info.name}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    {info.desc}
                  </p>
                </div>
              </div>

              {!isUnlocked && (
                <button
                  onClick={() => handleUnlock(code, info.cost)}
                  disabled={!canAfford && info.cost > 0}
                  className={`w-full mt-3 py-2 px-3 rounded-xl font-semibold text-sm transition-all ${
                    canAfford || info.cost === 0
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {info.cost === 0 ? (
                    'Unlock Free'
                  ) : (
                    <div className="flex items-center justify-center gap-1">
                      <Coins className="w-3 h-3" />
                      {info.cost}
                    </div>
                  )}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}