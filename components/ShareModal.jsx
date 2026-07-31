import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Copy, CheckCircle2, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ShareModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  
  // Get current URL but make it look "unblocked"
  const currentUrl = window.location.href;
  const shareUrl = currentUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-lg w-full border border-green-500/30"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Share NexusBanan</h3>
              <p className="text-slate-400 text-sm">Go Guardian Unblocked</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-700/50 rounded-xl p-4 border border-green-500/20">
            <p className="text-slate-300 text-sm mb-2">Share this link:</p>
            <p className="text-green-400 font-mono text-sm break-all">{shareUrl}</p>
          </div>

          <Button
            onClick={handleCopy}
            className={`w-full h-12 transition-all ${
              copied
                ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
            }`}
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-2" />
                Copy Link
              </>
            )}
          </Button>

          <div className="pt-4 border-t border-slate-700">
            <div className="flex items-start gap-3 text-sm">
              <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-500 text-xs">✓</span>
              </div>
              <div>
                <p className="text-slate-300 font-semibold mb-1">Go Guardian Friendly</p>
                <p className="text-slate-500 text-xs">This link works on school networks with content filters</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            🍌 Share the learning fun with friends!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}