import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from '@/api/base44Client';

export default function JamCreator({ onClose }) {
  const [jamName, setJamName] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  const createJam = async () => {
    if (!jamName || !youtubeUrl) {
      alert('Please fill in all fields!');
      return;
    }

    setLoading(true);
    await base44.entities.CustomJam.create({
      title: `${jamName}'s Jam`,
      youtube_url: youtubeUrl,
      creator_name: jamName,
      is_public: isPublic,
    });
    setLoading(false);
    alert(`✅ ${jamName}'s Jam created!`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 rounded-2xl shadow-2xl border border-purple-500/30 w-full max-w-md"
      >
        <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-pink-600/10 to-purple-600/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create Your Jam</h2>
              <p className="text-sm text-slate-400">Add your featured song</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Your Name</label>
            <Input
              value={jamName}
              onChange={(e) => setJamName(e.target.value)}
              placeholder="Alex"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-2 block">YouTube URL</label>
            <Input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-2 block">Who can see this jam?</label>
            <div className="flex gap-3">
              <button
                onClick={() => setIsPublic(true)}
                className={`flex-1 py-2 rounded-xl font-semibold text-sm transition-all ${isPublic ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                🌍 Everyone
              </button>
              <button
                onClick={() => setIsPublic(false)}
                className={`flex-1 py-2 rounded-xl font-semibold text-sm transition-all ${!isPublic ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                🔒 Only Me
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={createJam}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {loading ? 'Creating...' : 'Create Jam'}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}