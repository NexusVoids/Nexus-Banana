import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Unlock, BookMarked, Code, Gamepad, History, Youtube, Zap } from 'lucide-react';
import SocialStudiesGames from './SocialStudiesGames';
import FunGames from './FunGames';
import LibraryBooks from './LibraryBooks';
import TechGames from './TechGames';
import ImprovedKahootGame from './ImprovedKahootGame';

export default function CodeUnlockedGames({ unlockedCodes, onOpenYouTube }) {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    { code: 'ss', label: 'Social Studies & History', icon: History, color: 'from-amber-500 to-orange-600' },
    { code: 'banan', label: 'Fun Games & Coding', icon: Gamepad, color: 'from-yellow-400 to-yellow-600' },
    { code: 'library', label: 'Library Books', icon: BookMarked, color: 'from-emerald-500 to-green-600' },
    { code: 'tech', label: 'Tech & Coding', icon: Code, color: 'from-blue-500 to-indigo-600' },
    { code: 'nexus', label: 'BananQuiz', icon: Zap, color: 'from-purple-500 to-pink-600' },
    { code: 'adam', label: 'YouTube Viewer', icon: Youtube, color: 'from-red-500 to-rose-600' },
  ];

  const availableSections = sections.filter(s => unlockedCodes.includes(s.code));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
          <Unlock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Code Unlocked Games</h2>
          <p className="text-slate-400">Your secret collection</p>
        </div>
      </div>

      {availableSections.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg">No codes unlocked yet!</p>
          <p className="text-slate-500 text-sm mt-2">Enter codes to unlock secret content</p>
        </div>
      ) : (
        <>
          {/* Section Selector */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {availableSections.map((section) => (
              <motion.button
                key={section.code}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveSection(activeSection === section.code ? null : section.code)}
                className={`p-4 rounded-2xl bg-gradient-to-br ${section.color} text-white font-semibold shadow-lg transition-all ${
                  activeSection === section.code ? 'ring-4 ring-white/50' : ''
                }`}
              >
                <section.icon className="w-8 h-8 mb-2 mx-auto" />
                <span className="text-sm">{section.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Content */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {activeSection === 'ss' && <SocialStudiesGames />}
            {activeSection === 'banan' && <FunGames />}
            {activeSection === 'library' && <LibraryBooks />}
            {activeSection === 'tech' && <TechGames />}
            {activeSection === 'nexus' && <ImprovedKahootGame />}
            {activeSection === 'adam' && (
              <div className="text-center py-12">
                <Youtube className="w-24 h-24 text-red-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">YouTube Viewer</h3>
                <p className="text-slate-400 mb-6">Watch educational videos and more!</p>
                <button
                  onClick={onOpenYouTube}
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl text-white font-bold hover:scale-105 transition-transform"
                >
                  Open YouTube Viewer
                </button>
              </div>
            )}
            {!activeSection && (
              <p className="text-center text-slate-400 py-10">Select a category above to view content</p>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}