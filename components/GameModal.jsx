import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Maximize2, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function GameModal({ game, onClose }) {
  const [playMode, setPlayMode] = useState(null);

  if (!playMode) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-md w-full border border-purple-500/30"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
              <p className="text-slate-400">{game.desc}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-slate-300 mb-6 text-sm">Choose how you want to play:</p>

          <div className="space-y-3">
            <Button
              onClick={() => setPlayMode('internal')}
              className="w-full h-auto py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <div className="flex items-center gap-3">
                <Maximize2 className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Play Here</div>
                  <div className="text-xs opacity-80">Play in this website</div>
                </div>
              </div>
            </Button>

            <Button
              onClick={() => window.open(game.externalUrl, '_blank')}
              className="w-full h-auto py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Play in New Tab</div>
                  <div className="text-xs opacity-80">Opens in a new tab (unblocked)</div>
                </div>
              </div>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Internal play mode - show iframe
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900/50 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{game.emoji}</span>
            <div>
              <h3 className="text-white font-bold">{game.name}</h3>
              <p className="text-xs text-slate-400">{game.desc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game Area */}
        <div className="flex-1 relative">
          <iframe
            src={game.internalUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    </motion.div>
  );
}