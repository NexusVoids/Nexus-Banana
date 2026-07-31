import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search, Play } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function YouTubeViewer({ onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Create YouTube search URL
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
    window.open(searchUrl, '_blank');
  };

  const handleLoadVideo = () => {
    if (!videoUrl.trim()) return;
    
    // Extract video ID from various YouTube URL formats
    let videoId = '';
    try {
      if (videoUrl.includes('youtube.com/watch?v=')) {
        videoId = videoUrl.split('v=')[1]?.split('&')[0];
      } else if (videoUrl.includes('youtu.be/')) {
        videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      } else if (videoUrl.includes('youtube.com/embed/')) {
        videoId = videoUrl.split('embed/')[1]?.split('?')[0];
      } else {
        // Assume it's just a video ID
        videoId = videoUrl;
      }
    } catch (e) {
      alert('Invalid YouTube URL');
      return;
    }

    if (videoId) {
      setVideoUrl(`https://www.youtube.com/embed/${videoId}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl overflow-y-auto"
    >
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-purple-500"
              >
                📺 YouTube Viewer
              </motion.h2>
              <p className="text-slate-400 mt-1">Watch educational videos</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-slate-700"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Search Bar */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search YouTube..."
                className="bg-slate-800 border-purple-500/30 text-white placeholder:text-slate-500"
              />
              <Button
                onClick={handleSearch}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex gap-2">
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLoadVideo()}
                placeholder="Paste YouTube URL or video ID..."
                className="bg-slate-800 border-purple-500/30 text-white placeholder:text-slate-500"
              />
              <Button
                onClick={handleLoadVideo}
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Load
              </Button>
            </div>
          </div>

          {/* Video Player */}
          {videoUrl.includes('embed') ? (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={videoUrl}
                className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="bg-slate-800/50 rounded-2xl p-12 text-center">
              <Play className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Enter a YouTube URL above to watch videos</p>
            </div>
          )}

          {/* Quick Links */}
          <div className="mt-8">
            <h3 className="text-white font-semibold mb-4">🎓 Educational Channels</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Khan Academy', url: 'https://www.youtube.com/@khanacademy' },
                { name: 'CrashCourse', url: 'https://www.youtube.com/@crashcourse' },
                { name: 'TED-Ed', url: 'https://www.youtube.com/@TED-Ed' },
                { name: 'SciShow', url: 'https://www.youtube.com/@SciShow' },
              ].map((channel) => (
                <a
                  key={channel.name}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-800 rounded-xl text-slate-300 hover:bg-slate-700 transition-colors text-sm text-center"
                >
                  {channel.name}
                </a>
              ))}
            </div>
          </div>

          {/* I LIKE BANAN Button - appears at bottom when scrolled */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 pt-8 border-t border-slate-700 text-center"
          >
            <p className="text-slate-500 text-sm mb-4">Scroll down to find the magic button... 🍌</p>
            <div className="h-32" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setVideoUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
              }}
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl font-black text-xl text-white shadow-2xl shadow-yellow-500/30"
            >
              🍌 I LIKE BANAN 🍌
            </motion.button>
            <p className="text-xs text-slate-600 mt-4">Click to watch in this viewer!</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}