import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Gamepad2, X, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PublicGames({ isAdmin }) {
  const [playingGame, setPlayingGame] = useState(null);
  const queryClient = useQueryClient();

  const { data: games = [], isLoading } = useQuery({
    queryKey: ['webgames'],
    queryFn: () => base44.entities.WebGame.filter({ is_public: true }, '-created_date', 50),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.WebGame.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['webgames'] }),
  });

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Gamepad2 className="w-8 h-8 text-purple-400" />
        Public Games
      </h2>
      <p className="text-slate-400 mb-6 text-sm">Games created and posted by the community using Web Gen or HTML Runner.</p>

      {isLoading && (
        <div className="text-center py-20 text-slate-400">Loading games...</div>
      )}

      {!isLoading && games.length === 0 && (
        <div className="text-center py-20">
          <span className="text-6xl mb-4 block">🎮</span>
          <p className="text-slate-400">No games posted yet. Use the Web Gen or HTML button to create and post one!</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-slate-800/60 border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-colors"
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">{game.title}</h3>
                  {game.creator_name && (
                    <p className="text-slate-400 text-xs mt-1">by {game.creator_name}</p>
                  )}
                  {game.description && (
                    <p className="text-slate-300 text-sm mt-2">{game.description}</p>
                  )}
                </div>
                {isAdmin && (
                  <button
                    onClick={() => deleteMutation.mutate(game.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setPlayingGame(game)}
                className="mt-4 w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl text-sm transition-all"
              >
                ▶ Play Game
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full-screen game player */}
      <AnimatePresence>
        {playingGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700">
              <span className="text-white font-bold">{playingGame.title}</span>
              <Button onClick={() => setPlayingGame(null)} variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <iframe
              srcDoc={playingGame.html_content}
              className="flex-1 w-full border-0 bg-white"
              title={playingGame.title}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}