import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins } from 'lucide-react';

export default function BananBucks() {
  const [points, setPoints] = useState(() => {
    return parseInt(localStorage.getItem('bananBucks') || '0');
  });
  const [showAnimation, setShowAnimation] = useState(false);
  const [animAmount, setAnimAmount] = useState(0);

  useEffect(() => {
    localStorage.setItem('bananBucks', points.toString());

    // Listen for point changes
    const handlePointsChange = (e) => {
      const newPoints = e.detail.points;
      const diff = newPoints - points;

      if (diff > 0) {
        setAnimAmount(diff);
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 1500);
      }

      setPoints(newPoints);
    };

    window.addEventListener('bananBucksChange', handlePointsChange);
    return () => window.removeEventListener('bananBucksChange', handlePointsChange);
  }, [points]);

  return (
    <div className="relative">
      










      

      <AnimatePresence>
        {showAnimation &&
        <motion.div
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -50, scale: 1.5 }}
          exit={{ opacity: 0 }}
          className="absolute top-0 right-0 text-green-400 font-bold text-2xl pointer-events-none">
          
            +{animAmount}
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}

// Helper functions
export const addBananBucks = (amount) => {
  const current = parseInt(localStorage.getItem('bananBucks') || '0');
  const hasInfinite = localStorage.getItem('infiniteBananBucks') === 'true';

  if (hasInfinite) return current; // Already infinite

  const newTotal = current + amount;
  localStorage.setItem('bananBucks', newTotal.toString());

  window.dispatchEvent(new CustomEvent('bananBucksChange', {
    detail: { points: newTotal }
  }));

  return newTotal;
};

export const spendBananBucks = (amount) => {
  const hasInfinite = localStorage.getItem('infiniteBananBucks') === 'true';
  if (hasInfinite) {
    // Still dispatch event to update UI
    const current = parseInt(localStorage.getItem('bananBucks') || '0');
    window.dispatchEvent(new CustomEvent('bananBucksChange', {
      detail: { points: current }
    }));
    return true; // Can always afford
  }

  const current = parseInt(localStorage.getItem('bananBucks') || '0');
  if (current < amount) return false;

  const newTotal = current - amount;
  localStorage.setItem('bananBucks', newTotal.toString());

  window.dispatchEvent(new CustomEvent('bananBucksChange', {
    detail: { points: newTotal }
  }));

  return true;
};

export const getBananBucks = () => {
  return parseInt(localStorage.getItem('bananBucks') || '0');
};

export const hasInfiniteBananBucks = () => {
  return localStorage.getItem('infiniteBananBucks') === 'true';
};