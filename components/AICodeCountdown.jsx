import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Code, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { spendBananBucks, getBananBucks, hasInfiniteBananBucks } from './BananBucks';

const HOUR_IN_MS = 60 * 60 * 1000;
const SKIP_LIMITS = {
  '1min': { cost: 10, maxPerDay: 20, duration: 60 * 1000 },
  '10min': { cost: 40, maxPerDay: 3, duration: 10 * 60 * 1000 },
  '30min': { cost: 95, maxPerDay: 2, duration: 30 * 60 * 1000 },
  '60min': { cost: 185, maxPerDay: 1, duration: 60 * 60 * 1000 }
};

export default function AICodeCountdown() {
  const [nextCodeTime, setNextCodeTime] = useState(() => {
    const saved = localStorage.getItem('nextAICodeTime');
    return saved ? parseInt(saved) : Date.now() + HOUR_IN_MS;
  });
  
  const [skipUsage, setSkipUsage] = useState(() => {
    const saved = localStorage.getItem('skipUsage');
    return saved ? JSON.parse(saved) : {
      '1min': { count: 0, resetTime: Date.now() + (25 * HOUR_IN_MS) },
      '10min': { count: 0, resetTime: Date.now() + (25 * HOUR_IN_MS) },
      '30min': { count: 0, resetTime: Date.now() + (25 * HOUR_IN_MS) },
      '60min': { count: 0, resetTime: Date.now() + (25 * HOUR_IN_MS) }
    };
  });

  const [currentCode, setCurrentCode] = useState(() => {
    return localStorage.getItem('currentAICode') || null;
  });

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const left = Math.max(0, nextCodeTime - now);
      setTimeLeft(left);

      // Generate new code when timer hits 0
      if (left === 0 && !currentCode) {
        generateNewCode();
      }

      // Check for skip resets
      const newSkipUsage = { ...skipUsage };
      let changed = false;
      Object.keys(skipUsage).forEach(key => {
        if (now >= skipUsage[key].resetTime) {
          newSkipUsage[key] = { count: 0, resetTime: now + (25 * HOUR_IN_MS) };
          changed = true;
        }
      });
      if (changed) {
        setSkipUsage(newSkipUsage);
        localStorage.setItem('skipUsage', JSON.stringify(newSkipUsage));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextCodeTime, currentCode, skipUsage]);

  const generateNewCode = () => {
    // Generate worldwide code based on current hour
    const currentHour = Math.floor(Date.now() / HOUR_IN_MS);
    const adjectives = ['SUPER', 'MEGA', 'ULTRA', 'HYPER', 'TURBO', 'POWER', 'MAGIC', 'GOLDEN'];
    const nouns = ['BANANA', 'CODE', 'KEY', 'STAR', 'GEM', 'FIRE', 'BOLT', 'CROWN'];
    
    // Use current hour as seed for consistent worldwide code
    const adjIndex = currentHour % adjectives.length;
    const nounIndex = Math.floor(currentHour / adjectives.length) % nouns.length;
    const number = currentHour % 100;
    
    const code = `${adjectives[adjIndex]}${nouns[nounIndex]}${number}`;
    
    setCurrentCode(code);
    localStorage.setItem('currentAICode', code);
    localStorage.setItem('currentAICodeValue', code); // Store for codes section
    
    const newTime = Date.now() + HOUR_IN_MS;
    setNextCodeTime(newTime);
    localStorage.setItem('nextAICodeTime', newTime.toString());
  };

  const handleSkip = (type) => {
    const config = SKIP_LIMITS[type];
    const usage = skipUsage[type];

    // Check limits
    if (usage.count >= config.maxPerDay) {
      alert(`You've used all your ${type} skips for today! Resets in ${formatTime(usage.resetTime - Date.now())}`);
      return;
    }

    // Check special 30min rule
    if (type === '30min' && skipUsage['30min'].count >= 1 && skipUsage['60min'].count >= 1) {
      alert('Two 30-minute skips count as a full hour skip. You\'ve already used your hour skip!');
      return;
    }

    // Check BananBucks
    if (!hasInfiniteBananBucks() && getBananBucks() < config.cost) {
      alert(`Not enough BananBucks! Need ${config.cost}`);
      return;
    }

    // Spend bucks
    if (!spendBananBucks(config.cost)) {
      alert('Payment failed!');
      return;
    }

    // Apply skip
    const newTime = Math.max(Date.now(), nextCodeTime - config.duration);
    setNextCodeTime(newTime);
    localStorage.setItem('nextAICodeTime', newTime.toString());

    // Update usage
    const newSkipUsage = {
      ...skipUsage,
      [type]: { ...usage, count: usage.count + 1 }
    };

    // Special rule: two 30min = one 60min
    if (type === '30min' && skipUsage['30min'].count === 1) {
      newSkipUsage['60min'].count = 1;
    }

    setSkipUsage(newSkipUsage);
    localStorage.setItem('skipUsage', JSON.stringify(newSkipUsage));

    // If timer hits 0, generate code
    if (newTime <= Date.now()) {
      generateNewCode();
    }
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mb-2">
          🧠 AI Code Countdown
        </h2>
        <p className="text-slate-400">New codes generate every hour. Skip time to unlock early!</p>
      </div>

      {/* Current Code Display */}
      {currentCode ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 border-4 border-green-400 text-center"
        >
          <div className="text-sm text-green-200 mb-2">✅ CURRENT CODE AVAILABLE</div>
          <div className="text-5xl font-black text-white mb-4">{currentCode}</div>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(currentCode);
              alert('Code copied! Go to CODES button to redeem it.');
            }}
            className="bg-white/20 hover:bg-white/30 text-white"
          >
            Copy to Redeem
          </Button>
          <Button
            onClick={() => {
              setCurrentCode(null);
              localStorage.removeItem('currentAICode');
              const newTime = Date.now() + HOUR_IN_MS;
              setNextCodeTime(newTime);
              localStorage.setItem('nextAICodeTime', newTime.toString());
            }}
            variant="outline"
            className="ml-3 border-white/30 text-white hover:bg-white/10"
          >
            Claim & Start New Timer
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/30 text-center"
        >
          <Clock className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <div className="text-sm text-slate-400 mb-2">NEXT CODE IN</div>
          <div className="text-6xl font-black text-white mb-6">{formatTime(timeLeft)}</div>
          <div className="text-slate-400 text-sm">
            {timeLeft === 0 ? 'Generating code...' : 'Skip time below to unlock early!'}
          </div>
        </motion.div>
      )}

      {/* Skip Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(SKIP_LIMITS).map(([key, config]) => {
          const usage = skipUsage[key];
          const remaining = config.maxPerDay - usage.count;
          const resetTime = usage.resetTime - Date.now();

          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.03 }}
              className="p-4 rounded-xl bg-slate-800 border-2 border-purple-500/30"
            >
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h3 className="text-white font-bold">{key.toUpperCase()} SKIP</h3>
              </div>
              <div className="space-y-2 mb-4">
                <div className="text-sm text-slate-400">
                  Cost: <span className="text-yellow-400 font-bold">{config.cost} BB</span>
                </div>
                <div className="text-sm text-slate-400">
                  Remaining: <span className="text-cyan-400 font-bold">{remaining}/{config.maxPerDay}</span>
                </div>
                {remaining === 0 && (
                  <div className="text-xs text-red-400">
                    Resets in {formatTime(resetTime)}
                  </div>
                )}
              </div>
              <Button
                onClick={() => handleSkip(key)}
                disabled={remaining === 0 || timeLeft === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
              >
                Skip {key}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
          <div className="text-sm text-blue-200 space-y-1">
            <p>• All skip limits reset every 25 hours</p>
            <p>• Two 30-minute skips count as one 60-minute skip</p>
            <p>• 1-minute and 10-minute skips don't stack into larger skips</p>
            <p>• New codes generate automatically every hour</p>
          </div>
        </div>
      </div>
    </div>
  );
}