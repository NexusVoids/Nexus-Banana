import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";

const quizData = [
  {
    question: "What is 7 × 8?",
    options: ["54", "56", "64", "72"],
    correct: 1,
    category: "Math"
  },
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2,
    category: "Geography"
  },
  {
    question: "What is H2O?",
    options: ["Oxygen", "Water", "Hydrogen", "Carbon"],
    correct: 1,
    category: "Science"
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
    correct: 1,
    category: "Literature"
  },
  {
    question: "What is 15 + 27?",
    options: ["40", "42", "44", "46"],
    correct: 1,
    category: "Math"
  },
];

export default function KahootGame() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);

  React.useEffect(() => {
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

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    setShowResult(true);
    
    const isCorrect = index === quizData[currentQuestion].correct;
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 2);
      setScore(score + 100 + timeBonus);
    }

    setTimeout(() => {
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(20);
      } else {
        setGameOver(true);
      }
    }, 2000);
  };

  const restart = () => {
    setStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(20);
    setGameOver(false);
  };

  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-12 text-center shadow-2xl">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <Zap className="w-20 h-20 text-yellow-300 mx-auto mb-6" />
          </motion.div>
          <h2 className="text-4xl font-black text-white mb-4">BananQuiz!</h2>
          <p className="text-white/90 mb-8">Test your knowledge across Math, Science, and more!</p>
          <div className="grid grid-cols-3 gap-4 mb-8 text-white">
            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold">{quizData.length}</p>
              <p className="text-sm">Questions</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold">20s</p>
              <p className="text-sm">Per Question</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold">🏆</p>
              <p className="text-sm">Win Points</p>
            </div>
          </div>
          <Button
            onClick={() => setStarted(true)}
            className="bg-white text-purple-600 hover:bg-gray-100 text-xl px-12 py-6 rounded-2xl font-bold"
          >
            Start Quiz!
          </Button>
        </div>
      </motion.div>
    );
  }

  if (gameOver) {
    const percentage = Math.round((score / (quizData.length * 150)) * 100);
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
          </div>
          <div className="space-y-3">
            <Button
              onClick={restart}
              className="w-full bg-white text-green-600 hover:bg-gray-100 text-lg py-6 rounded-2xl font-bold"
            >
              Play Again
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  const question = quizData[currentQuestion];
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
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="text-white font-bold">
            Question {currentQuestion + 1}/{quizData.length}
          </div>
          <div className="px-4 py-2 bg-purple-600 rounded-full text-white font-semibold">
            Score: {score}
          </div>
        </div>
        <div className="flex items-center gap-2 text-white">
          <Clock className="w-5 h-5" />
          <span className="text-2xl font-bold">{timeLeft}s</span>
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 mb-6 border border-purple-500/30"
      >
        <div className="text-sm text-purple-400 mb-2">{question.category}</div>
        <h3 className="text-2xl md:text-3xl font-bold text-white">{question.question}</h3>
      </motion.div>

      {/* Options */}
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

      {/* Timer Bar */}
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