import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Film, Youtube, User, Play, Pause } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function DeveloperStuff() {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Developer Stuff</h2>
          <p className="text-slate-400">Meet the creator of NexusBanan</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Dev's Favorite Song */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <Music className="w-6 h-6 text-white" />
            <h3 className="text-xl font-bold text-white">DEV'S FAV SONG</h3>
          </div>
          
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 mb-3"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Stop Playing
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                🎵 Play Here
              </>
            )}
          </Button>

          <a
            href="https://www.youtube.com/watch?v=eINKTGikDXg&list=RDeINKTGikDXg&start_radio=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20">
              Open in YouTube
            </Button>
          </a>

          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src="https://www.youtube.com/embed/eINKTGikDXg?autoplay=1"
                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Dev's Favorite Movie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-orange-600 to-red-600 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <Film className="w-6 h-6 text-white" />
            <h3 className="text-xl font-bold text-white">DEV'S FAV MOVIE</h3>
          </div>
          <div className="flex items-center justify-center p-8 bg-black/20 rounded-xl">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/d/d2/Back_to_the_Future.jpg"
              alt="Back to the Future Logo"
              className="max-w-full h-auto rounded-lg shadow-2xl"
              style={{ maxHeight: '300px' }}
            />
          </div>
        </motion.div>

        {/* Developer's YouTube */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <Youtube className="w-6 h-6 text-white" />
            <h3 className="text-xl font-bold text-white">DEVELOPER'S YOUTUBE</h3>
          </div>
          <a
            href="https://www.youtube.com/@nexusvoids"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
              📺 Visit Channel
            </Button>
          </a>
        </motion.div>

        {/* About the Developer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-slate-800/70 border-2 border-cyan-500/40 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">ABOUT THE DEV</h3>
          </div>
          <div className="space-y-3 text-slate-300 leading-relaxed">
            <p>
              Hello my name is <span className="font-bold text-cyan-400">Adam Cocolin</span> I am the developer of this website and this is meant for EDU but who cares have fun if you know the dev ask him for codes in the website for secret Tabs Secret Games and UN EDU.
            </p>
            <p>
              If I have gave you admin please do not show people my special code because IK they will abuse the youtube tool, because I realised it takes you to youtube homepage but I may give it to you for specific reasons I will not give.
            </p>
            <p>
              Please suggest updates some games do not work this is still in beta and thats all I have to say.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}