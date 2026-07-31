import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Unlock, Bot, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CodeUnlockedGames from '@/components/CodeUnlockedGames';
import ImprovedAIAssistant from '@/components/ImprovedAIAssistant';
import CodesViewer from '@/components/CodesViewer';

export default function OtherTabs({ unlockedCodes, onUnlockCode, onOpenYouTube }) {
  const [activeSubTab, setActiveSubTab] = useState('unlocked');

  const subTabs = [];
  
  if (unlockedCodes.length > 0) {
    subTabs.push({ id: 'unlocked', label: 'Code Unlocked', icon: Unlock });
  }
  
  if (unlockedCodes.includes('ai')) {
    subTabs.push({ id: 'ai', label: 'AI Helper', icon: Bot });
  }
  
  if (unlockedCodes.includes('see codes')) {
    subTabs.push({ id: 'codes', label: 'All Codes', icon: Lock });
  }

  // Set default active tab to first available
  React.useEffect(() => {
    if (subTabs.length > 0 && !subTabs.find(t => t.id === activeSubTab)) {
      setActiveSubTab(subTabs[0].id);
    }
  }, [unlockedCodes]);

  return (
    <div>
      {/* Sub-navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {subTabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            variant={activeSubTab === tab.id ? "default" : "outline"}
            className={activeSubTab === tab.id 
              ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
              : "bg-slate-800/50 text-slate-400 hover:text-white border-slate-700"
            }
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      {activeSubTab === 'unlocked' && (
        <CodeUnlockedGames 
          unlockedCodes={unlockedCodes} 
          onOpenYouTube={onOpenYouTube}
        />
      )}

      {activeSubTab === 'ai' && (
        <ImprovedAIAssistant />
      )}

      {activeSubTab === 'codes' && (
        <CodesViewer 
          unlockedCodes={unlockedCodes}
          onUnlockCode={onUnlockCode}
        />
      )}
    </div>
  );
}