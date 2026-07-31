import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Code, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function HTTPRunner({ onClose }) {
  const [htmlCode, setHtmlCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    if (!htmlCode.trim()) {
      alert('Please enter some HTML code!');
      return;
    }
    setIsRunning(true);
  };

  const resetCode = () => {
    setIsRunning(false);
    setHtmlCode('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <div className="h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900/50 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">HTML Runner</h3>
              <p className="text-xs text-slate-400">Run HTML, CSS & JavaScript</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isRunning ? (
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-4">
              <div>
                <label className="text-white font-semibold mb-2 block">
                  Paste your HTML code:
                </label>
                <Textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  placeholder="<!DOCTYPE html>
<html>
<head>
    <title>My Game</title>
    <style>
        body { font-family: Arial; text-align: center; }
    </style>
</head>
<body>
    <h1>Hello World!</h1>
    <script>
        console.log('Game started!');
    </script>
</body>
</html>"
                  className="bg-slate-800 border-purple-500/30 text-white font-mono text-sm min-h-[400px]"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={runCode}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Run Code
                </Button>
                <Button
                  onClick={resetCode}
                  variant="outline"
                  className="h-12 border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Clear
                </Button>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <p>💡 Tip: You can include CSS in a {'<style>'} tag and JavaScript in a {'<script>'} tag</p>
                <p>⚠️ Make sure your HTML is complete with opening and closing tags</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 relative">
            <button
              onClick={resetCode}
              className="absolute top-4 right-4 z-10 px-4 py-2 bg-slate-800 rounded-xl text-white font-semibold hover:bg-slate-700"
            >
              ← Back to Editor
            </button>
            <iframe
              srcDoc={htmlCode}
              className="w-full h-full border-0"
              title="HTML Output"
              sandbox="allow-scripts allow-modals allow-forms allow-popups"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}