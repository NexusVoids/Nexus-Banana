import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from '@/api/base44Client';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your NexusBanan AI assistant. Ask me anything about math, science, reading, or get help with your homework!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Check if user is asking to create a game/script
      const isGameRequest = userMessage.toLowerCase().includes('game') || 
                           userMessage.toLowerCase().includes('script') || 
                           userMessage.toLowerCase().includes('code') ||
                           userMessage.toLowerCase().includes('create') ||
                           userMessage.toLowerCase().includes('make');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a helpful educational assistant for students. Be friendly, encouraging, and explain things clearly.

${isGameRequest ? `IMPORTANT: When students ask you to create games or scripts, provide them with complete, working HTML code that they can copy and save as an .html file. Include inline CSS and JavaScript. Make the games interactive, fun, and educational. Use simple, clear code that works when opened in a browser.

Example format:
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Game Name</title>
    <style>
        /* CSS here */
    </style>
</head>
<body>
    <!-- Game HTML here -->
    <script>
        // JavaScript here
    </script>
</body>
</html>
\`\`\`

After providing the code, explain: "Copy this code into a text editor, save it as 'game.html', and open it in your browser to play!"` : 'Help with homework, math problems, science questions, reading comprehension, and more. Keep responses concise but helpful.'}

Student question: ${userMessage}`,
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble answering that. Please try again!' }]);
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">AI Helper</h2>
          <p className="text-slate-400">Your personal study assistant</p>
        </div>
      </div>

      {/* Chat Area */}
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

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Ask me anything..."
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

      <p className="text-xs text-slate-500 text-center mt-4">
        💡 Tip: Ask me to explain concepts, solve problems, help with homework, or create HTML games for you!
      </p>
    </div>
  );
}