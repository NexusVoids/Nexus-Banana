import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import BookEditor from './BookEditor';

export default function LibraryBooks({ unlockedCodes = [] }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookEditor, setShowBookEditor] = useState(false);

  const { data: customBooks = [] } = useQuery({
    queryKey: ['books'],
    queryFn: () => base44.entities.Book.filter({ approval_status: 'approved' }),
  });

  const featuredBook = {
    title: 'The Bread Book',
    author: 'Brady Wood',
    emoji: '🍞',
    color: 'from-amber-500 via-yellow-500 to-orange-500',
    content_type: 'pending_images'
  };

  const defaultBooks = [
    { title: 'Harry Potter Series', author: 'J.K. Rowling', color: 'from-purple-600 to-indigo-700', emoji: '⚡', content_type: 'external_link', content: 'https://www.readriordan.com' },
    { title: 'Percy Jackson', author: 'Rick Riordan', color: 'from-blue-500 to-cyan-600', emoji: '🔱', content_type: 'external_link', content: 'https://www.readriordan.com' },
    { title: 'Diary of a Wimpy Kid', author: 'Jeff Kinney', color: 'from-red-500 to-orange-500', emoji: '📔', content_type: 'external_link', content: 'https://www.wimpykid.com' },
    { title: 'The Hunger Games', author: 'Suzanne Collins', color: 'from-amber-500 to-orange-600', emoji: '🔥', content_type: 'external_link', content: 'https://www.scholastic.com' },
    { title: 'Wonder', author: 'R.J. Palacio', color: 'from-sky-500 to-blue-600', emoji: '✨', content_type: 'external_link', content: 'https://www.wonderthebook.com' },
    { title: 'The Outsiders', author: 'S.E. Hinton', color: 'from-slate-600 to-gray-700', emoji: '🌙', content_type: 'external_link', content: 'https://www.penguinrandomhouse.com' },
    { title: 'Charlotte\'s Web', author: 'E.B. White', color: 'from-pink-400 to-rose-500', emoji: '🕸️', content_type: 'external_link', content: 'https://www.harpercollins.com' },
    { title: 'Holes', author: 'Louis Sachar', color: 'from-yellow-600 to-amber-700', emoji: '🕳️', content_type: 'external_link', content: 'https://www.scholastic.com' },
    { title: 'The Giver', author: 'Lois Lowry', color: 'from-teal-500 to-green-600', emoji: '🍎', content_type: 'external_link', content: 'https://www.hmhbooks.com' },
    { title: 'Bridge to Terabithia', author: 'Katherine Paterson', color: 'from-green-500 to-emerald-600', emoji: '🌳', content_type: 'external_link', content: 'https://www.harpercollins.com' },
    { title: 'Matilda', author: 'Roald Dahl', color: 'from-violet-500 to-purple-600', emoji: '📚', content_type: 'external_link', content: 'https://www.roalddahl.com' },
    { title: 'The Lightning Thief', author: 'Rick Riordan', color: 'from-yellow-400 to-yellow-600', emoji: '⚡', content_type: 'external_link', content: 'https://www.readriordan.com' },
  ];

  const allBooks = [...customBooks, ...defaultBooks];

  const handleBookClick = (book) => {
    if (book.content_type === 'pending_images') {
      setSelectedBook(book);
      return;
    }
    if (book.content_type === 'external_link') {
      window.open(book.content, '_blank');
      return;
    }
    if (book.content_type === 'text') {
      setSelectedBook(book);
    }
  };

  return (
    <div>
      {/* NEW Button */}
      {unlockedCodes.includes('books') && (
        <div className="mb-6 flex justify-end">
          <Button onClick={() => setShowBookEditor(true)} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            NEW
          </Button>
        </div>
      )}

      {/* Featured Book - The Bread Book */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="mb-8 p-6 md:p-10 rounded-3xl bg-gradient-to-br from-amber-600 via-yellow-600 to-orange-600 shadow-2xl border-4 border-yellow-400 relative overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          {/* Book Cover */}
          <motion.div
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
            className="w-40 h-56 md:w-48 md:h-64 bg-gradient-to-br from-amber-200 via-yellow-300 to-amber-300 rounded-2xl shadow-2xl flex items-center justify-center text-7xl md:text-8xl border-4 border-amber-900 flex-shrink-0"
          >
            🍞
          </motion.div>
          
          {/* Book Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-5 py-2 bg-yellow-300 text-amber-900 rounded-full text-sm font-black mb-4 shadow-lg">
              ⭐ FEATURED BOOK ⭐
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-3 drop-shadow-lg">
              The Bread Book
            </h2>
            <p className="text-2xl md:text-3xl text-yellow-100 font-bold mb-6">
              By: Brady Wood
            </p>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
              An epic tale of bread, adventure, and everything in between. A must-read masterpiece that will change how you see baked goods forever!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBookClick(featuredBook)}
              className="mt-6 px-8 py-3 bg-white text-amber-700 font-black rounded-xl shadow-xl hover:shadow-2xl transition-shadow"
            >
              READ NOW 📖
            </motion.button>
          </div>
        </div>
      </motion.div>

      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-emerald-400" />
        Library Collection
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {allBooks.map((book, i) => (
          <motion.div
            key={book.id || book.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => handleBookClick(book)}
            className={`p-4 rounded-2xl bg-gradient-to-br ${book.color} cursor-pointer shadow-xl relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <span className="text-3xl mb-2 block">{book.logo || book.emoji}</span>
            <h4 className="text-sm font-bold text-white leading-tight">{book.title}</h4>
            <p className="text-white/70 text-xs mt-1">{book.author}</p>
            {book.is_official && <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full mt-2 inline-block">Official</span>}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBook(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              {selectedBook.content_type === 'pending_images' ? (
                <div className="text-center">
                  <div className="text-6xl mb-4">⏳</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{selectedBook.title}</h3>
                  <p className="text-xl text-yellow-400 font-semibold">PLEASE WAIT</p>
                  <p className="text-lg text-yellow-300">PICTURES ARE NOT HERE YET</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">{selectedBook.title}</h3>
                  <p className="text-slate-400 mb-6">by {selectedBook.author}</p>
                  <div className="text-white whitespace-pre-wrap">{selectedBook.content}</div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showBookEditor && (
        <BookEditor onClose={() => setShowBookEditor(false)} />
      )}
    </div>
  );
}