import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Upload, ExternalLink, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function BookEditor({ onClose }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('📘');
  const [copyright, setCopyright] = useState('');
  const [contentType, setContentType] = useState('text');
  const [content, setContent] = useState('');
  const [isOfficial, setIsOfficial] = useState(false);
  const [viewMode, setViewMode] = useState('create');
  const [selectedBook, setSelectedBook] = useState(null);

  const queryClient = useQueryClient();

  const { data: books = [] } = useQuery({
    queryKey: ['books'],
    queryFn: () => base44.entities.Book.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (bookData) => base44.entities.Book.create(bookData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      alert('Book created! Waiting for staff approval if marked as official.');
      resetForm();
    },
  });

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setDescription('');
    setLogo('📘');
    setCopyright('');
    setContentType('text');
    setContent('');
    setIsOfficial(false);
  };

  const handleCreate = () => {
    if (!title || !author) {
      alert('Title and Author are required!');
      return;
    }

    createMutation.mutate({
      title,
      author,
      description,
      logo,
      copyright,
      content_type: contentType,
      content,
      is_official: isOfficial,
      approval_status: isOfficial ? 'pending' : 'approved',
      color: ['from-blue-500 to-purple-500', 'from-green-500 to-emerald-500', 'from-pink-500 to-rose-500', 'from-orange-500 to-red-500'][Math.floor(Math.random() * 4)]
    });
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    if (book.content_type === 'pending_images') {
      return;
    }
    if (book.content_type === 'external_link') {
      window.open(book.content, '_blank');
    }
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
        className="bg-slate-900 rounded-2xl shadow-2xl border border-purple-500/30 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Book Editor</h2>
                <p className="text-sm text-slate-400">Create and manage library books</p>
              </div>
            </div>
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => setViewMode('create')} variant={viewMode === 'create' ? 'default' : 'outline'} size="sm">
              Create Book
            </Button>
            <Button onClick={() => setViewMode('library')} variant={viewMode === 'library' ? 'default' : 'outline'} size="sm">
              View Library
            </Button>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {viewMode === 'create' ? (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Amazing Book" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Author</label>
                  <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="John Doe" className="bg-slate-800 border-slate-700 text-white" />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Description</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="An epic tale of..." className="bg-slate-800 border-slate-700 text-white min-h-[80px]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Logo (Emoji or URL)</label>
                  <Input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="📘 or image URL" className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Copyright</label>
                  <Input value={copyright} onChange={(e) => setCopyright(e.target.value)} placeholder="© 2026" className="bg-slate-800 border-slate-700 text-white" />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Content Type</label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Content</SelectItem>
                    <SelectItem value="external_link">External Reading Site</SelectItem>
                    <SelectItem value="pending_images">Pending Images</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  {contentType === 'text' && 'Book Text'}
                  {contentType === 'external_link' && 'External URL'}
                  {contentType === 'pending_images' && 'Note'}
                </label>
                {contentType === 'pending_images' ? (
                  <p className="text-slate-400 text-sm p-4 bg-slate-800 rounded-xl">This book will show "PLEASE WAIT PICTURES ARE NOT HERE YET" when clicked</p>
                ) : (
                  <Textarea 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    placeholder={contentType === 'text' ? 'Enter the full book text...' : 'https://example.com/book'}
                    className="bg-slate-800 border-slate-700 text-white min-h-[120px]" 
                  />
                )}
              </div>

              <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <Checkbox checked={isOfficial} onCheckedChange={setIsOfficial} />
                <div>
                  <p className="text-white font-semibold text-sm">Mark as Official</p>
                  <p className="text-slate-400 text-xs">Requires staff approval in dashboard</p>
                </div>
              </div>

              <Button onClick={handleCreate} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Book
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {books.map((book, i) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleBookClick(book)}
                  className={`p-4 rounded-2xl bg-gradient-to-br ${book.color} cursor-pointer shadow-xl`}
                >
                  <div className="text-3xl mb-2">{book.logo}</div>
                  <h4 className="text-sm font-bold text-white leading-tight">{book.title}</h4>
                  <p className="text-white/70 text-xs mt-1">{book.author}</p>
                  {book.approval_status === 'pending' && <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full mt-2 inline-block">Pending</span>}
                  {book.is_official && book.approval_status === 'approved' && <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full mt-2 inline-block">Official</span>}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-60 flex items-center justify-center p-4"
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
              ) : selectedBook.content_type === 'text' ? (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">{selectedBook.title}</h3>
                  <p className="text-slate-400 mb-6">by {selectedBook.author}</p>
                  <div className="text-white whitespace-pre-wrap">{selectedBook.content}</div>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}