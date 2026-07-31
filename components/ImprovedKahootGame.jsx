import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, Zap, Brain, Shuffle, Plus, Share2, Star, Sparkles as SparklesIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from '@/api/base44Client';
import { addBananBucks } from './BananBucks';

const defaultQuizData = {
  math: [
    { question: "What is 7 × 8?", options: ["54", "56", "64", "72"], correct: 1 },
    { question: "What is 15 + 27?", options: ["40", "42", "44", "46"], correct: 1 },
    { question: "What is 100 ÷ 4?", options: ["20", "25", "30", "35"], correct: 1 },
  ],
  science: [
    { question: "What is H2O?", options: ["Oxygen", "Water", "Hydrogen", "Carbon"], correct: 1 },
    { question: "What planet is closest to the sun?", options: ["Venus", "Mercury", "Mars", "Earth"], correct: 1 },
    { question: "What gas do plants absorb?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"], correct: 2 },
  ],
  geography: [
    { question: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], correct: 2 },
    { question: "Which ocean is largest?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 },
    { question: "What is the tallest mountain?", options: ["K2", "Mount Everest", "Kilimanjaro", "Denali"], correct: 1 },
  ],
  literature: [
    { question: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], correct: 1 },
    { question: "What is a haiku?", options: ["A novel", "A poem", "A play", "An essay"], correct: 1 },
  ],
};

export default function ImprovedKahootGame() {
  const [mode, setMode] = useState(null); // null, 'play', 'create', 'host'
  const [category, setCategory] = useState('random');
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  
  // Host mode
  const [hostCode, setHostCode] = useState('');
  const [customQuestions, setCustomQuestions] = useState([
    { question: '', options: ['', '', '', ''], correct: 0 }
  ]);

  useEffect(() => {
    if (started && !showResult && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswer(null);
            return 20;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [started, showResult, gameOver, currentQuestion]);

  const generateAIQuestions = async (topic) => {
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 5 multiple choice quiz questions about ${topic} for middle school students. Make them educational and fun.`,
        response_json_schema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  options: { type: "array", items: { type: "string" } },
                  correct: { type: "number" }
                }
              }
            }
          }
        }
      });
      
      setQuestions(response.questions || []);
      setStarted(true);
    } catch (error) {
      alert('Failed to generate questions. Please try again!');
    }
    setLoading(false);
  };

  const startGame = async () => {
    if (category === 'ai') {
      const topic = prompt('What topic should I generate questions about?');
      if (topic) {
        await generateAIQuestions(topic);
      }
      return;
    }

    let selectedQuestions = [];
    if (category === 'random') {
      const allQuestions = Object.values(defaultQuizData).flat();
      selectedQuestions = allQuestions.sort(() => Math.random() - 0.5).slice(0, 5);
    } else {
      selectedQuestions = defaultQuizData[category] || [];
    }
    
    setQuestions(selectedQuestions);
    setStarted(true);
  };

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    setShowResult(true);
    
    const isCorrect = index === questions[currentQuestion].correct;
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 2);
      const streakBonus = streak * 10;
      const points = 100 + timeBonus + streakBonus;
      setScore(score + points);
      addBananBucks(points);
      setStreak(streak + 1);
      setShowCorrectAnimation(true);
      setTimeout(() => setShowCorrectAnimation(false), 1000);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(20);
      } else {
        setGameOver(true);
        // Bonus for completing quiz
        addBananBucks(50);
      }
    }, 2000);
  };

  const restart = () => {
    setMode(null);
    setStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(20);
    setGameOver(false);
    setCategory('random');
  };

  const createCustomQuiz = () => {
    const validQuestions = customQuestions.filter(q => 
      q.question.trim() && q.options.every(opt => opt.trim())
    );
    
    if (validQuestions.length === 0) {
      alert('Please add at least one complete question!');
      return;
    }
    
    const code = 'QUIZ-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setHostCode(code);
    localStorage.setItem(`quiz_${code}`, JSON.stringify(validQuestions));
    setQuestions(validQuestions);
    setStarted(true);
  };

  const addQuestion = () => {
    setCustomQuestions([...customQuestions, { question: '', options: ['', '', '', ''], correct: 0 }]);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Brain className="w-16 h-16 text-purple-500 mx-auto mb-4" />
        </motion.div>
        <p className="text-white text-lg">AI is generating questions...</p>
      </div>
    );
  }

  if (!mode) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-12 text-center shadow-2xl mb-6">
          <Zap className="w-20 h-20 text-yellow-300 mx-auto mb-6" />
          <h2 className="text-4xl font-black text-white mb-4">BananQuiz!</h2>
          <p className="text-white/90 mb-8">Choose your game mode</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => setMode('play')}
            className="h-32 bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 flex-col gap-3"
          >
            <Shuffle className="w-10 h-10" />
            <div>
              <div className="font-bold text-lg">Play Quiz</div>
              <div className="text-xs opacity-80">Choose category or random</div>
            </div>
          </Button>

          <Button
            onClick={() => setMode('ai')}
            className="h-32 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex-col gap-3"
          >
            <Brain className="w-10 h-10" />
            <div>
              <div className="font-bold text-lg">AI Generated</div>
              <div className="text-xs opacity-80">Custom topic quiz</div>
            </div>
          </Button>

          <Button
            onClick={() => setMode('create')}
            className="h-32 bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex-col gap-3"
          >
            <Plus className="w-10 h-10" />
            <div>
              <div className="font-bold text-lg">Create & Host</div>
              <div className="text-xs opacity-80">Make custom quiz</div>
            </div>
          </Button>
        </div>
      </motion.div>
    );
  }

  if (mode === 'ai') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 text-center">
          <Brain className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">AI Quiz Generator</h3>
          <p className="text-white/90 mb-6">I'll generate custom questions on any topic!</p>
          <Button
            onClick={() => generateAIQuestions('general knowledge')}
            className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-6"
          >
            Generate Random Topic
          </Button>
          <div className="mt-4">
            <Button onClick={restart} variant="outline" className="text-white border-white/30">
              ← Back
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-800 rounded-3xl p-6 mb-6">
          <h3 className="text-2xl font-bold text-white mb-4">Create Custom Quiz</h3>
          
          {customQuestions.map((q, qIndex) => (
            <div key={qIndex} className="bg-slate-700 rounded-2xl p-4 mb-4">
              <Input
                value={q.question}
                onChange={(e) => {
                  const newQ = [...customQuestions];
                  newQ[qIndex].question = e.target.value;
                  setCustomQuestions(newQ);
                }}
                placeholder={`Question ${qIndex + 1}`}
                className="mb-3 bg-slate-600 border-0 text-white"
              />
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex gap-2 mb-2">
                  <Input
                    value={opt}
                    onChange={(e) => {
                      const newQ = [...customQuestions];
                      newQ[qIndex].options[optIndex] = e.target.value;
                      setCustomQuestions(newQ);
                    }}
                    placeholder={`Option ${optIndex + 1}`}
                    className="bg-slate-600 border-0 text-white"
                  />
                  <Button
                    onClick={() => {
                      const newQ = [...customQuestions];
                      newQ[qIndex].correct = optIndex;
                      setCustomQuestions(newQ);
                    }}
                    className={q.correct === optIndex ? 'bg-green-600' : 'bg-slate-600'}
                  >
                    ✓
                  </Button>
                </div>
              ))}
            </div>
          ))}

          <div className="flex gap-3">
            <Button onClick={addQuestion} className="flex-1 bg-blue-600">
              <Plus className="w-4 h-4 mr-2" /> Add Question
            </Button>
            <Button onClick={createCustomQuiz} className="flex-1 bg-green-600">
              <Share2 className="w-4 h-4 mr-2" /> Create & Get Code
            </Button>
            <Button onClick={restart} variant="outline">
              Cancel
            </Button>
          </div>
          
          {hostCode && (
            <div className="mt-4 p-4 bg-green-600 rounded-xl text-white text-center">
              <p className="font-bold">Quiz Code: {hostCode}</p>
              <p className="text-sm opacity-80">Share this code with others!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-12 text-center shadow-2xl">
          <Zap className="w-20 h-20 text-yellow-300 mx-auto mb-6" />
          <h2 className="text-4xl font-black text-white mb-4">Choose Category</h2>
          
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-white text-purple-600 font-bold mb-6">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="random">🎲 Random Mix</SelectItem>
              <SelectItem value="math">➕ Math</SelectItem>
              <SelectItem value="science">🔬 Science</SelectItem>
              <SelectItem value="geography">🌍 Geography</SelectItem>
              <SelectItem value="literature">📚 Literature</SelectItem>
              <SelectItem value="ai">🤖 AI Generated (Custom)</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={startGame}
            className="bg-white text-purple-600 hover:bg-gray-100 text-xl px-12 py-6 rounded-2xl font-bold mb-4"
          >
            Start Quiz!
          </Button>

          <Button onClick={restart} variant="outline" className="text-white border-white/30">
            ← Back
          </Button>
        </div>
      </motion.div>
    );
  }

  if (gameOver) {
    const percentage = Math.round((score / (questions.length * 150)) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-12 text-center shadow-2xl">
          <Trophy className="w-24 h-24 text-yellow-300 mx-auto mb-6" />
          <h2 className="text-4xl font-black text-white mb-4">Quiz Complete!</h2>
          <div className="bg-white/20 rounded-2xl p-8 backdrop-blur-sm mb-8">
            <p className="text-6xl font-black text-white mb-2">{score}</p>
            <p className="text-white/90 text-xl">Total Points</p>
            <p className="text-white/80 mt-4">{percentage}% Correct</p>
            <p className="text-yellow-300 font-bold mt-2">+{score + 50} BananBucks earned! 🍌</p>
          </div>
          <Button
            onClick={restart}
            className="w-full bg-white text-green-600 hover:bg-gray-100 text-lg py-6 rounded-2xl font-bold"
          >
            Play Again
          </Button>
        </div>
      </motion.div>
    );
  }

  const question = questions[currentQuestion];
  const colors = [
    'from-red-500 to-rose-600',
    'from-blue-500 to-cyan-600',
    'from-yellow-500 to-orange-600',
    'from-green-500 to-emerald-600',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="text-white font-bold">
            Question {currentQuestion + 1}/{questions.length}
          </div>
          <div className="px-4 py-2 bg-purple-600 rounded-full text-white font-semibold">
            Score: {score}
          </div>
          {streak > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-4 py-2 bg-orange-600 rounded-full text-white font-semibold flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {streak} Streak!
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-2 text-white">
          <Clock className="w-5 h-5" />
          <span className="text-2xl font-bold">{timeLeft}s</span>
        </div>
      </div>

      <AnimatePresence>
        {showCorrectAnimation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: [0, 360] }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="text-8xl">⭐</div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={currentQuestion}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 mb-6 border border-purple-500/30"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-white">{question.question}</h3>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correct;
          const showColors = showResult;

          return (
            <motion.button
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!showResult ? { scale: 1.03 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              className={`p-6 rounded-2xl font-bold text-white text-lg transition-all ${
                showColors
                  ? isCorrect
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 ring-4 ring-green-400'
                    : isSelected
                    ? 'bg-gradient-to-br from-red-500 to-rose-600 ring-4 ring-red-400'
                    : 'bg-gradient-to-br ' + colors[index] + ' opacity-50'
                  : 'bg-gradient-to-br ' + colors[index] + ' hover:shadow-xl'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showColors && isCorrect && <span className="text-2xl">✓</span>}
                {showColors && isSelected && !isCorrect && <span className="text-2xl">✗</span>}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ width: '100%' }}
          animate={{ width: `${(timeLeft / 20) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}