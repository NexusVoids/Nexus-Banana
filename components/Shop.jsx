import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Coins, Lock, Unlock, Sparkles, Crown, Zap, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ALL_CODES } from '@/components/codesData';
import { spendBananBucks, getBananBucks, hasInfiniteBananBucks } from '@/components/BananBucks';

export default function Shop({ unlockedCodes, onUnlockCode }) {
  const [filter, setFilter] = useState('all');
  
  const getCategoryIcon = (cost) => {
    if (cost === 0) return Star;
    if (cost < 50) return Sparkles;
    if (cost < 150) return Zap;
    return Crown;
  };

  const categories = [
    { id: 'all', label: 'All Items', color: 'from-purple-600 to-pink-600' },
    { id: 'free', label: 'Free', color: 'from-green-600 to-emerald-600' },
    { id: 'cheap', label: 'Under 50', color: 'from-blue-600 to-cyan-600' },
    { id: 'mid', label: '50-150', color: 'from-yellow-600 to-orange-600' },
    { id: 'premium', label: 'Premium', color: 'from-red-600 to-rose-600' },
  ];

  const filterCodes = (codes) => {
    return Object.entries(codes).filter(([code, info]) => {
      if (filter === 'all') return true;
      if (filter === 'free') return info.cost === 0;
      if (filter === 'cheap') return info.cost > 0 && info.cost < 50;
      if (filter === 'mid') return info.cost >= 50 && info.cost <= 150;
      if (filter === 'premium') return info.cost > 150;
      return true;
    });
  };

  const handlePurchase = (code, cost) => {
    if (unlockedCodes.includes(code)) {
      alert('Already owned!');
      return;
    }

    if (cost === 0 || hasInfiniteBananBucks()) {
      onUnlockCode(code);
      return;
    }

    const canAfford = spendBananBucks(cost);
    if (!canAfford) {
      alert(`Not enough BananBucks! You need ${cost} but have ${getBananBucks()}`);
      return;
    }

    onUnlockCode(code);
  };

  const filteredCodes = filterCodes(ALL_CODES);
  const currentBucks = getBananBucks();
  const isInfinite = hasInfiniteBananBucks();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">BananShop</h2>
            <p className="text-slate-400">Unlock codes with your BananBucks</p>
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl px-6 py-3 border border-yellow-500/30">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-2xl font-bold text-white">
              {isInfinite ? '∞' : currentBucks}
            </span>
          </div>
          <p className="text-xs text-slate-400 text-center">BananBucks</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(cat.id)}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
              filter === cat.id
                ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                : 'bg-slate-800/50 text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCodes.map(([code, info], i) => {
          const isUnlocked = unlockedCodes.includes(code);
          const canAfford = isInfinite || currentBucks >= info.cost;
          const Icon = getCategoryIcon(info.cost);

          return (
            <motion.div
              key={code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`p-5 rounded-2xl border-2 transition-all ${
                isUnlocked
                  ? 'bg-green-500/10 border-green-500/40 shadow-lg shadow-green-500/20'
                  : canAfford
                  ? 'bg-slate-800/70 border-purple-500/40 hover:border-purple-500/60'
                  : 'bg-slate-800/30 border-slate-700/40 opacity-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {isUnlocked ? (
                      <Unlock className="w-5 h-5 text-green-400" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  <p className="text-white text-base font-semibold mb-1">
                    {info.name}
                  </p>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {info.desc}
                  </p>
                </div>
                <Icon className={`w-6 h-6 ${isUnlocked ? 'text-green-400' : 'text-purple-400'}`} />
              </div>

              {!isUnlocked && (
                <Button
                  onClick={() => handlePurchase(code, info.cost)}
                  disabled={!canAfford && info.cost > 0}
                  className={`w-full mt-3 font-bold ${
                    canAfford || info.cost === 0
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {info.cost === 0 ? (
                    '✨ Get Free'
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Coins className="w-4 h-4" />
                      <span>Buy for {info.cost}</span>
                    </div>
                  )}
                </Button>
              )}
              {isUnlocked && (
                <div className="mt-3 text-center py-2 bg-green-500/20 rounded-xl">
                  <span className="text-green-400 font-semibold text-sm">✓ Owned</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}