import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Wand2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { base44 } from '@/api/base44Client';
import { ALL_CODES } from './codesData';

export default function CodeCreator({ onClose }) {
  const [codeName, setCodeName] = useState('');
  const [description, setDescription] = useState('');
  const [whatItDoes, setWhatItDoes] = useState('');
  const [unlockCode, setUnlockCode] = useState('');
  const [breadPowered, setBreadPowered] = useState(true);
  const [loading, setLoading] = useState(false);

  const generateWithAI = async () => {
    if (!description) {
      alert('Please enter a description first!');
      return;
    }

    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this description: "${description}", create:
        1. A short catchy name for this code (2-3 words)
        2. A brief one-line description
        3. What this code would unlock/do (be specific and fun)
        4. A memorable unlock code (single word, lowercase, related to the theme)`,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            desc: { type: "string" },
            whatItDoes: { type: "string" },
            code: { type: "string" }
          }
        }
      });

      setCodeName(response.name);
      setDescription(response.desc);
      setWhatItDoes(response.whatItDoes);
      setUnlockCode(response.code.toLowerCase());
    } catch (error) {
      alert('Failed to generate with AI. Please try again!');
    }
    setLoading(false);
  };

  const createCode = () => {
    if (!codeName || !description || !unlockCode) {
      alert('Please fill in all fields!');
      return;
    }

    const newCode = {
      name: codeName,
      desc: description,
      action: whatItDoes,
      cost: 0,
      breadPowered: breadPowered
    };

    // Add to ALL_CODES
    ALL_CODES[unlockCode.toLowerCase().trim()] = newCode;

    // Save to localStorage
    const customCodes = JSON.parse(localStorage.getItem('customCodes') || '{}');
    customCodes[unlockCode.toLowerCase().trim()] = newCode;
    localStorage.setItem('customCodes', JSON.stringify(customCodes));

    alert(`✅ Code created! Use "${unlockCode}" to unlock it!`);
    setCodeName('');
    setDescription('');
    setWhatItDoes('');
    setUnlockCode('');
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
        className="bg-slate-900 rounded-2xl shadow-2xl border border-purple-500/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Code Creator</h2>
              <p className="text-sm text-slate-400">Create custom codes with AI</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">What should this code do?</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Unlock special math games, give rainbow theme, access secret area..."
              className="bg-slate-800 border-slate-700 text-white min-h-[80px]"
            />
          </div>

          <Button
            onClick={generateWithAI}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  ⚡
                </motion.div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate with AI
              </>
            )}
          </Button>

          <div className="border-t border-slate-700 pt-4 space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Code Name</label>
              <Input
                value={codeName}
                onChange={(e) => setCodeName(e.target.value)}
                placeholder="Super Speed Mode"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-2 block">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Move at lightning speed"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-2 block">What It Does</label>
              <Input
                value={whatItDoes}
                onChange={(e) => setWhatItDoes(e.target.value)}
                placeholder="Increases game speed by 2x"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-2 block">Unlock Code</label>
              <Input
                value={unlockCode}
                onChange={(e) => setUnlockCode(e.target.value)}
                placeholder="speedster"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <Checkbox
                checked={breadPowered}
                onCheckedChange={setBreadPowered}
              />
              <div>
                <p className="text-white font-semibold text-sm">Bread Powered</p>
                <p className="text-slate-400 text-xs">Can be unlocked with BREAD code</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={createCode}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Code
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}