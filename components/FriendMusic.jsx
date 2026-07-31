import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Play, Pause, Trash2, RefreshCw, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getCurrentUpdateCode, getMsUntilReset, formatCountdown } from '@/lib/rotatingCode';

const COLORS = [
  'from-teal-500 to-cyan-500',
  'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-violet-500 to-purple-500',
  'from-lime-500 to-green-500',
  'from-sky-500 to-blue-500',
];

export default function FriendMusic({ isAdmin = false }) {
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const queryClient = useQueryClient();

  const { data: customJams = [], refetch, isFetching } = useQuery({
    queryKey: ['customJams'],
    queryFn: () => base44.entities.CustomJam.filter({ is_public: true }, '-created_date', 50),
  });

  const { data: approvedSongs = [] } = useQuery({
    queryKey: ['approvedSongs'],
    queryFn: () => base44.entities.SongSuggestion.filter({ status: 'approved' }, '-created_date', 50),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CustomJam.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customJams'] }),
  });

  const defaultSongs = [
    { title: "Lincoln's Jam", url: "https://www.youtube.com/watch?v=oiHDfFVIqt8", embedUrl: "https://www.youtube.com/embed/oiHDfFVIqt8", color: "from-blue-500 to-cyan-500" },
    { title: "America's Jam", url: "https://www.youtube.com/watch?v=yebNIHKAC4A", embedUrl: "https://www.youtube.com/embed/yebNIHKAC4A", color: "from-red-500 to-rose-500" },
    { title: "Brady's Jam", url: "https://www.youtube.com/watch?v=3qurK_IJras", embedUrl: "https://www.youtube.com/embed/3qurK_IJras", color: "from-purple-500 to-pink-500" },
    { title: "Dev's Jam", url: "https://www.youtube.com/watch?v=eINKTGikDXg", embedUrl: "https://www.youtube.com/embed/eINKTGikDXg", color: "from-orange-500 to-red-500" },
  ];

  const superApprovedSongs = approvedSongs
    .filter(s => s.status === 'super_approved')
    .map((song, i) => ({
      title: `${song.submitter_name}'s Jam`,
      url: song.youtube_url,
      embedUrl: song.youtube_url.replace('watch?v=', 'embed/').split('&')[0],
      color: COLORS[i % COLORS.length],
    }));

  const smallApprovedSongs = approvedSongs.filter(s => s.status === 'approved').slice(0, 6);

  const dbJamCards = customJams.map((jam, i) => ({
    id: jam.id,
    title: jam.title,
    url: jam.youtube_url,
    embedUrl: jam.youtube_url.replace('watch?v=', 'embed/').split('&')[0],
    color: COLORS[(defaultSongs.length + superApprovedSongs.length + i) % COLORS.length],
    isCustom: true,
  }));

  const allSongs = [...defaultSongs, ...superApprovedSongs, ...dbJamCards];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Jams</h2>
            <p className="text-slate-400">Listen to your friends' favorite jams</p>
          </div>
        </div>
        <Button
          onClick={() => refetch()}
          disabled={isFetching}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 font-bold"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          REFRESH
        </Button>
      </div>

      {/* Featured Jams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {allSongs.map((song, i) => (
          <motion.div
            key={song.title + i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className={`p-6 rounded-2xl bg-gradient-to-br ${song.color} shadow-xl hover:shadow-2xl transition-all relative`}>
              {/* Admin delete button */}
              {isAdmin && song.isCustom && (
                <button
                  onClick={() => deleteMutation.mutate(song.id)}
                  className="absolute top-3 right-3 w-7 h-7 bg-black/30 hover:bg-red-600/80 rounded-full flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                </button>
              )}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white pr-8">{song.title}</h3>
                <Music className="w-6 h-6 text-white/80 flex-shrink-0" />
              </div>
              <Button
                onClick={() => setCurrentPlaying(currentPlaying === song.embedUrl ? null : song.embedUrl)}
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                {currentPlaying === song.embedUrl ? (
                  <><Pause className="w-4 h-4 mr-2" />Stop</>
                ) : (
                  <><Play className="w-4 h-4 mr-2" />Play</>
                )}
              </Button>
              <a href={song.url} target="_blank" rel="noopener noreferrer" className="block mt-3 text-center text-xs text-white/70 hover:text-white transition-colors">
                Open in YouTube
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Small Approved Suggestions */}
      {smallApprovedSongs.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Suggested Songs</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {smallApprovedSongs.map((song, i) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="p-3 rounded-xl bg-slate-800/50 border border-purple-500/20 hover:border-purple-500/40 transition-all"
              >
                <Music className="w-5 h-5 text-purple-400 mb-2" />
                <p className="text-xs text-white font-semibold truncate">{song.song_title}</p>
                <a href={song.youtube_url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:text-cyan-300 mt-1 inline-block">
                  Listen →
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Now Playing */}
      {currentPlaying && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-cyan-400" />
              Now Playing
            </h3>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={currentPlaying}
                className="absolute top-0 left-0 w-full h-full rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Owner's secret update code — hidden at the very bottom */}
      <SecretUpdateCode />
    </div>
  );
}

function SecretUpdateCode() {
  const [code, setCode] = useState(() => getCurrentUpdateCode());
  const [countdown, setCountdown] = useState(() => getMsUntilReset());

  useEffect(() => {
    const tick = setInterval(() => {
      setCode(getCurrentUpdateCode());
      setCountdown(getMsUntilReset());
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="mt-16 pt-10 border-t border-dashed border-amber-500/10 text-center"
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600 mb-3">
        ...a faint inscription glows in the dust...
      </p>
      <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-950/30 to-slate-900/40">
        <Lock className="w-4 h-4 text-amber-500/60" />
        <span className="font-mono font-black text-2xl tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
          {code}
        </span>
      </div>
      <p className="text-[10px] text-slate-600 mt-3">
        refreshes in <span className="font-mono text-amber-500/70">{formatCountdown(countdown)}</span> · use wisely
      </p>
    </motion.div>
  );
}