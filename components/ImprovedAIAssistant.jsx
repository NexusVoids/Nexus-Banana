import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Loader2, AlertTriangle, Shield, Timer } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from '@/api/base44Client';

export default function ImprovedAIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your NexusBanan AI assistant. Ask me anything about math, science, reading, get help with homework, or ask me to create HTML games for you!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [isShutdown, setIsShutdown] = useState(false);
  const [needsOwnerCode, setNeedsOwnerCode] = useState(false);
  const [ownerCodeInput, setOwnerCodeInput] = useState('');
  const [bypassMode, setBypassMode] = useState(false);
  const [countdown, setCountdown] = useState({ minutes: 0, seconds: 0 });

  // Generate daily owner code
  const getDailyOwnerCode = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const seed = dayOfYear + today.getFullYear() * 1000;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'OWNER-';
    for (let i = 0; i < 6; i++) {
      const index = (seed * (i + 1) * 7) % chars.length;
      code += chars[index];
    }
    return code;
  };

  // Generate hourly bypass code
  const getHourlyBypassCode = () => {
    const now = new Date();
    const hoursSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60));
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'BYPASS-';
    for (let i = 0; i < 4; i++) {
      const index = (hoursSinceEpoch * (i + 1) * 13) % chars.length;
      code += chars[index];
    }
    return code;
  };

  // Countdown timer for bypass
  useEffect(() => {
    if (bypassMode) {
      const timer = setInterval(() => {
        const now = new Date();
        const nextHour = new Date(now);
        nextHour.setHours(nextHour.getHours() + 1);
        nextHour.setMinutes(0);
        nextHour.setSeconds(0);
        const diff = nextHour - now;
        const minutes = Math.floor(diff / 1000 / 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setCountdown({ minutes, seconds });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [bypassMode]);

  const checkIfTestQuestion = (text) => {
    const testPatterns = [
      /what is the answer to question \d+/i,
      /solve this problem for me/i,
      /do my homework/i,
      /write my essay/i,
      /complete this assignment/i,
      /cheat/i,
    ];
    return testPatterns.some(pattern => pattern.test(text));
  };

  const checkIfComplex = (text) => {
    const complexPatterns = [
      /advanced calculus/i,
      /quantum mechanics/i,
      /organic chemistry/i,
      /differential equations/i,
      /college level/i,
    ];
    return complexPatterns.some(pattern => pattern.test(text));
  };

  const verifyOwnerCode = () => {
    const correctCode = getDailyOwnerCode();
    const bypassCode = bypassMode ? getHourlyBypassCode() : null;
    
    if (ownerCodeInput === correctCode || ownerCodeInput === bypassCode) {
      setNeedsOwnerCode(false);
      setOwnerCodeInput('');
      return true;
    }
    alert('Invalid owner code! Try again.');
    return false;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    if (isShutdown) {
      alert('AI Assistant is in safety mode. Please refresh to restart.');
      return;
    }

    const userMessage = input;
    setInput('');
    setQuestionCount(prev => prev + 1);

    // Check for suspicious patterns
    if (checkIfTestQuestion(userMessage)) {
      setMessages(prev => [...prev, 
        { role: 'user', content: userMessage },
        { role: 'assistant', content: '⚠️ I detected this might be a test question. I\'m here to help you LEARN, not to help you cheat. I\'m shutting down for safety.' }
      ]);
      setIsShutdown(true);
      return;
    }

    // Check if too many questions (spam protection)
    if (questionCount > 20) {
      setMessages(prev => [...prev, 
        { role: 'user', content: userMessage },
        { role: 'assistant', content: '⚠️ Too many questions detected. Taking a break for safety. Refresh to restart!' }
      ]);
      setIsShutdown(true);
      return;
    }

    // Check if complex
    if (checkIfComplex(userMessage)) {
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      setNeedsOwnerCode(true);
      return;
    }

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const isGameRequest = userMessage.toLowerCase().includes('game') || 
                           userMessage.toLowerCase().includes('script') || 
                           userMessage.toLowerCase().includes('html') ||
                           userMessage.toLowerCase().includes('create') ||
                           userMessage.toLowerCase().includes('make');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a helpful educational assistant for students. Be friendly, encouraging, and explain things clearly.

${isGameRequest ? `IMPORTANT: When students ask you to create games or scripts, provide them with complete, working HTML code that they can copy and save as an .html file. Include inline CSS and JavaScript. Make the games interactive, fun, and educational. Use simple, clear code that works when opened in a browser.

Provide code in this format:
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Game Name</title>
    <style>
        body { margin: 0; padding: 20px; font-family: Arial; background: #1a1a2e; color: white; }
        /* More CSS */
    </style>
</head>
<body>
    <h1>Game Title</h1>
    <!-- Game HTML -->
    <script>
        // JavaScript game logic
    </script>
</body>
</html>
\`\`\`

After code, say: "Copy this entire code, paste it into a text editor, save as 'game.html', and open in your browser!"` : 'Help with homework, math problems, science questions, reading comprehension, and more. Keep responses concise but helpful.'}

Student question: ${userMessage}`,
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble answering that. Please try again!' }]);
    }
    
    setLoading(false);
  };

  const continueWithOwnerCode = async () => {
    if (!verifyOwnerCode()) return;
    
    const lastUserMessage = messages[messages.length - 1].content;
    setLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an advanced educational AI assistant. Help with complex academic topics. Be detailed and thorough.\n\nQuestion: ${lastUserMessage}`,
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error processing complex query.' }]);
    }
    
    setLoading(false);
  };

  // Check if user unlocked NEXUSVOIDS
  useEffect(() => {
    const codes = JSON.parse(localStorage.getItem('nexusBananCodes') || '[]');
    if (codes.includes('nexusvoids')) {
      setBypassMode(true);
    }
  }, []);

  if (needsOwnerCode) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl p-8 text-center border-4 border-yellow-400">
          <Shield className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Owner Permission Required</h3>
          <p className="text-white/90 mb-6">This question is too complex. Enter today's owner code to continue.</p>
          
          {bypassMode && (
            <div className="bg-black/20 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-center gap-2 text-yellow-300 mb-2">
                <Timer className="w-4 h-4" />
                <span className="font-mono font-bold">Next code in: {countdown.minutes}:{countdown.seconds.toString().padStart(2, '0')}</span>
              </div>
              <p className="text-xs text-white/70">Bypass Code: <span className="font-mono font-bold">{getHourlyBypassCode()}</span></p>
            </div>
          )}
          
          <Input
            value={ownerCodeInput}
            onChange={(e) => setOwnerCodeInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && continueWithOwnerCode()}
            placeholder="Enter owner code..."
            className="bg-white/20 border-white/30 text-white placeholder:text-white/50 mb-4"
          />
          <div className="flex gap-3">
            <Button
              onClick={continueWithOwnerCode}
              className="flex-1 bg-white text-orange-600 hover:bg-gray-100 font-bold"
            >
              Verify & Continue
            </Button>
            <Button
              onClick={() => setNeedsOwnerCode(false)}
              variant="outline"
              className="text-white border-white/30"
            >
              Cancel
            </Button>
          </div>
          <p className="text-xs text-white/60 mt-4">Daily code: {getDailyOwnerCode()}</p>
        </div>
      </div>
    );
  }

  if (isShutdown) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-red-600 to-rose-700 rounded-3xl p-12 text-center">
          <AlertTriangle className="w-20 h-20 text-yellow-300 mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-white mb-4">Safety Mode Activated</h3>
          <p className="text-white/90 mb-6">The AI has detected suspicious activity and shut down to prevent misuse.</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-white text-red-600 hover:bg-gray-100 font-bold px-8 py-4"
          >
            Refresh to Restart
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">AI Helper</h2>
          <p className="text-slate-400">Your personal study assistant {bypassMode && '⚡ Bypass Mode Active'}</p>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 mb-4 h-[500px] overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                  : 'bg-slate-700/50 text-slate-100'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-semibold text-cyan-400">AI Assistant</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-700/50 p-4 rounded-2xl">
                <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Ask me anything or request HTML games..."
          className="bg-slate-800 border-purple-500/30 text-white placeholder:text-slate-500"
          disabled={loading}
        />
        <Button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-xs text-slate-500">
          💡 Ask me to explain concepts, solve problems, or create games!
        </p>
        <p className="text-xs text-slate-600">
          Questions: {questionCount}/20
        </p>
      </div>
    </div>
  );
}