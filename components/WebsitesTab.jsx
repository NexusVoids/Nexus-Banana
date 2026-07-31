import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Copy, Check } from 'lucide-react';

const WEBSITES = [
  {
    name: 'Neal.Fun',
    desc: 'Fun interactive web experiments and mini-games that inspired this site.',
    url: 'https://neal.fun',
    emoji: '✨',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'NexusBanan.net',
    desc: 'This website! Share it with your friends.',
    url: window.location.origin,
    emoji: '🍌',
    color: 'from-yellow-400 to-orange-500',
    isSelf: true,
  },
  {
    name: 'Host Admin Abuse',
    desc: 'A fun admin abuse game — become the most powerful host!',
    url: 'https://admin-abuse-pro.base44.app/',
    emoji: '👑',
    color: 'from-red-500 to-rose-600',
  },
];

export default function WebsitesTab() {
  const [copied, setCopied] = useState(null);

  const handleCopy = (url, name) => {
    navigator.clipboard.writeText(url);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
        🌐 Cool Websites
      </h2>
      <p className="text-slate-400 mb-6 text-sm">A curated list of fun and useful websites.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {WEBSITES.map((site, i) => (
          <motion.div
            key={site.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-purple-500/40 transition-colors"
          >
            <div className={`h-2 bg-gradient-to-r ${site.color}`} />
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{site.emoji}</span>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">{site.name}</h3>
                  {site.isSelf && (
                    <span className="text-xs text-yellow-400 font-medium">⭐ This site</span>
                  )}
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-4">{site.desc}</p>
              <div className="flex gap-2">
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 flex items-center justify-center gap-2 py-2 bg-gradient-to-r ${site.color} text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Visit
                </a>
                <button
                  onClick={() => handleCopy(site.url, site.name)}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-xl text-sm transition-colors flex items-center gap-1"
                >
                  {copied === site.name ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === site.name ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}