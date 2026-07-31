import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, FlaskConical, BookOpen, Calculator, Lock, Unlock, X, Sparkles, Bot, Share2, Music, User, Globe, Shield, Crown, Mouse, Code, Newspaper, Wrench, Zap, Download } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import CategorySection from '@/components/CategorySection';
import ScienceExperiments from '@/components/ScienceExperiments';
import CodeUnlockedGames from '@/components/CodeUnlockedGames';
import SecretGames from '@/components/SecretGames';
import SocialStudiesGames from '@/components/SocialStudiesGames';
import FunGames from '@/components/FunGames';
import LibraryBooks from '@/components/LibraryBooks';
import TechGames from '@/components/TechGames';
import ImprovedAIAssistant from '@/components/ImprovedAIAssistant';
import ImprovedKahootGame from '@/components/ImprovedKahootGame';
import YouTubeViewer from '@/components/YouTubeViewer';
import GameModal from '@/components/GameModal';
import ShareModal from '@/components/ShareModal';
import CodesViewer from '@/components/CodesViewer';
import HTTPRunner from '@/components/HTTPRunner';
import BananBucks, { spendBananBucks, hasInfiniteBananBucks, getBananBucks, addBananBucks } from '@/components/BananBucks';
import { isValidCode, getCodeInfo, getAllCodeNames } from '@/components/codesData';
import FriendMusic from '@/components/FriendMusic';
import DeveloperStuff from '@/components/DeveloperStuff';
import OtherTabs from '@/components/OtherTabs';
import Suggestions from '@/components/Suggestions';
import { base44 } from '@/api/base44Client';
import CodeCreator from '@/components/CodeCreator';
import JamCreator from '@/components/JamCreator';
import BookEditor from '@/components/BookEditor';
import AICodeCountdown from '@/components/AICodeCountdown';
import DeviceSelector from '@/components/DeviceSelector';
import PublicGames from '@/components/PublicGames';
import WebsitesTab from '@/components/WebsitesTab';
import CommunityChat from '@/components/CommunityChat';
import RolesSection from '@/components/RolesSection';
import ExecutivePanel from '@/components/ExecutivePanel';
import AutoClicker from '@/components/AutoClicker';
import GuestProfile from '@/components/GuestProfile';
import BananaLang from '@/components/BananaLang';
import AccountOnboarding from '@/components/AccountOnboarding';
import BanScreen from '@/components/BanScreen';
import WebMaker from '@/components/WebMaker';
import UpdateLog from '@/components/UpdateLog';
import UpdateCodePanel from '@/components/UpdateCodePanel';
import DevPanel from '@/components/DevPanel';
import PlayItAI from '@/components/PlayItAI';
import BananaAI from '@/components/BananaAI';
import NexusFun from '@/components/NexusFun';
import GitExport from '@/components/GitExport';
import { useQuery } from '@tanstack/react-query';
import { hasPermission } from '@/lib/roles';

export default function Home() {
  const [deviceType, setDeviceType] = useState(() => {
    return localStorage.getItem('deviceType') || null;
  });
  const [hasGoGuardian, setHasGoGuardian] = useState(() => {
    const val = localStorage.getItem('hasGoGuardian');
    return val === null ? null : val === 'true';
  });
  const [activeTab, setActiveTab] = useState('home');
  const [codeInput, setCodeInput] = useState('');
  const [unlockedCodes, setUnlockedCodes] = useState(() => {
    const saved = localStorage.getItem('nexusBananCodes');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSecretGames, setShowSecretGames] = useState(false);
  const [codeMessage, setCodeMessage] = useState('');
  const [showAI, setShowAI] = useState(false);
  const [showYouTube, setShowYouTube] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showShareLink, setShowShareLink] = useState(false);
  const [showCodesViewer, setShowCodesViewer] = useState(false);
  const [showHTTPRunner, setShowHTTPRunner] = useState(false);
  const [showWebsiteGenerator, setShowWebsiteGenerator] = useState(false);
  const [showCodeCreator, setShowCodeCreator] = useState(false);
  const [showJamCreator, setShowJamCreator] = useState(false);
  const [showAutoClicker, setShowAutoClicker] = useState(false);
  const [showBananaLang, setShowBananaLang] = useState(false);
  const [showNexusFun, setShowNexusFun] = useState(false);
  const [showUpdateCodePanel, setShowUpdateCodePanel] = useState(false);
  const [showBananaAI, setShowBananaAI] = useState(false);
  const [devUnlocked, setDevUnlocked] = useState(() => localStorage.getItem('devPanelUnlocked') === 'true');
  const [localUserId] = useState(() => {
    let id = localStorage.getItem('nexus_local_uid');
    if (!id) { id = 'local_' + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('nexus_local_uid', id); }
    return id;
  });
  const [onboardingDone, setOnboardingDone] = useState(() => {
    // Check by local ID (works without email too)
    const localId = localStorage.getItem('nexus_local_uid');
    return localId ? localStorage.getItem('onboardingComplete_' + localId) === 'true' : false;
  });

  const profileIdentifier = `anon_${localUserId}`;
  const { data: userProfile } = useQuery({
    queryKey: ['myprofile', profileIdentifier],
    queryFn: () => base44.entities.UserProfile.filter({ user_email: profileIdentifier }, '-created_date', 1).then(r => r[0] || null),
    enabled: onboardingDone,
    refetchInterval: 30000,
  });

  const { data: customRoles = [] } = useQuery({
    queryKey: ['customroles'],
    queryFn: () => base44.entities.CustomRole.list(),
  });

  const isAdmin = false;
  const aprActive = localStorage.getItem('aprCodeActive') === 'true';
  const isExecutive = hasPermission(userProfile?.roles || [], 'executive_panel') || aprActive;
  const isMasterKey = isExecutive;

  useEffect(() => {
    localStorage.setItem('nexusBananCodes', JSON.stringify(unlockedCodes));
  }, [unlockedCodes]);

  const handleCodeSubmit = () => {
    const code = codeInput.toLowerCase().trim();
    
    if (!isValidCode(code)) {
      setCodeMessage('Invalid code... try again!');
      setTimeout(() => setCodeMessage(''), 2000);
      setCodeInput('');
      return;
    }
    
    // BREAD code - unlock only breadPowered codes
    if (code === 'bread') {
      const allCodes = getAllCodeNames();
      const breadPoweredCodes = allCodes.filter(c => {
        const info = getCodeInfo(c);
        return info && info.breadPowered;
      });
      setUnlockedCodes(breadPoweredCodes);
      localStorage.setItem('infiniteBananBucks', 'true');
      setCodeMessage('🍞 BREAD POWER! All Bread-Powered codes unlocked!');
      setTimeout(() => setCodeMessage(''), 3000);
      setCodeInput('');
      return;
    }
    
    if (unlockedCodes.includes(code)) {
      setCodeMessage('Already unlocked!');
      setTimeout(() => setCodeMessage(''), 2000);
      setCodeInput('');
      return;
    }
    
    const codeInfo = getCodeInfo(code);
    
    // Check if can afford
    if (codeInfo.cost > 0) {
      const canAfford = hasInfiniteBananBucks() || getBananBucks() >= codeInfo.cost;
      if (!canAfford) {
        setCodeMessage(`Need ${codeInfo.cost} BananBucks!`);
        setTimeout(() => setCodeMessage(''), 2000);
        setCodeInput('');
        return;
      }
      spendBananBucks(codeInfo.cost);
    }
    
    // Special code handlers
    if (code === 'infinitebanan' || code === 'nexus') {
      localStorage.setItem('infiniteBananBucks', 'true');
      setCodeMessage('🎉 Infinite BananBucks activated!');
    } else if (code === 'see codes') {
      setCodeMessage('📋 Code viewer unlocked! Check the tabs!');
    } else if (code === 'penn') {
      setCodeMessage('🎨 Code Creator unlocked!');
      setTimeout(() => setShowCodeCreator(true), 500);
    } else if (code === 'jam') {
      setCodeMessage('🎵 Jam Creator unlocked!');
      setTimeout(() => setShowJamCreator(true), 500);
    } else if (code === 'books') {
      setCodeMessage('📚 Book Editor unlocked!');
      setActiveTab('ela');
    } else if (code === 'apr') {
      localStorage.setItem('aprCodeActive', 'true');
      setCodeMessage('🔑 APR activated! Full rank & mod permissions granted!');
    } else if (code === 'banana') {
      setCodeMessage('🍌 Banana Language unlocked! Go to the Banana tab!');
      setTimeout(() => setActiveTab('banana'), 800);
    } else {
      setCodeMessage(`🎉 Code "${code.toUpperCase()}" unlocked!`);
    }
    
    setUnlockedCodes([...unlockedCodes, code]);
    setTimeout(() => setCodeMessage(''), 3000);
    setCodeInput('');
  };

  const tabs = [
    { id: 'home', label: 'Home', icon: Gamepad2 },
    { id: 'math', label: 'Math', icon: Calculator },
    { id: 'science', label: 'Science', icon: FlaskConical },
    { id: 'ela', label: 'ELA', icon: BookOpen },
    { id: 'bananquiz', label: 'BananQuiz', icon: Sparkles },
    { id: 'playit', label: 'Play-it AI', icon: Bot },
    { id: 'jams', label: "Jam's", icon: Music },
    { id: 'ai-codes', label: 'AI Code Countdown', icon: Bot },
    { id: 'suggestions', label: 'Suggestions', icon: Sparkles },
    { id: 'developer', label: 'Developer Stuff', icon: User },
    { id: 'public-games', label: 'Public Games', icon: Gamepad2 },
    { id: 'websites', label: 'Websites', icon: Globe },
    { id: 'chat', label: 'Chat', icon: User },
    { id: 'roles', label: 'Roles', icon: Shield },
    { id: 'profile', label: 'Profile', icon: User },
    ...((isExecutive || hasPermission(userProfile?.roles || [], 'rank_users') || hasPermission(userProfile?.roles || [], 'warn') || hasPermission(userProfile?.roles || [], 'timeout')) ? [{ id: 'executive', label: 'Mod Panel', icon: Crown }] : []),
    ...(unlockedCodes.includes('banana') ? [{ id: 'banana', label: 'Banana Lang', icon: Code }] : []),
    { id: 'webmaker', label: 'Web Maker', icon: Wrench },
    { id: 'git', label: 'Get Website Files', icon: Download },
    { id: 'updates', label: 'Updates', icon: Newspaper },
    ...(devUnlocked ? [{ id: 'dev', label: 'Dev Panel', icon: Code }] : []),
  ];

  // Add "OTHER TABS" if any code-unlocked content exists
  const hasOtherTabs = unlockedCodes.length > 0 || unlockedCodes.includes('ai') || unlockedCodes.includes('see codes');
  if (hasOtherTabs) {
    tabs.push({ id: 'other', label: 'Other Tabs', icon: Unlock });
  }

  // Device-specific class names
  const getContainerClass = () => {
    if (deviceType === 'phone') {
      return 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-sm';
    }
    return 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900';
  };

  if (!deviceType || hasGoGuardian === null) {
    return (
      <DeviceSelector
        onSelect={(device, gg) => {
          setDeviceType(device);
          setHasGoGuardian(gg);
        }}
      />
    );
  }

  // Show onboarding for ALL users who haven't set up a profile yet (no email required)
  if (!onboardingDone) {
    return (
      <AccountOnboarding
        onComplete={(identifier) => {
          setOnboardingDone(true);
        }}
      />
    );
  }

  // Show ban screen if user is banned
  if (userProfile?.is_banned) {
    // Check if ban has expired
    if (userProfile.ban_expires && new Date(userProfile.ban_expires) < new Date()) {
      // Ban expired - don't show ban screen
    } else {
      return <BanScreen userProfile={userProfile} />;
    }
  }

  return (
    <div className={getContainerClass()}>
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920')] bg-cover bg-center opacity-10" />
        <div className={`relative z-10 px-4 ${deviceType === 'phone' ? 'py-4' : 'py-8'}`}>
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center ${deviceType === 'phone' ? 'gap-2' : 'gap-3'}`}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`${deviceType === 'phone' ? 'w-10 h-10' : 'w-14 h-14'} bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 cursor-pointer`}
                  >
                    <span className={deviceType === 'phone' ? 'text-lg' : 'text-2xl'}>🍌</span>
                  </motion.button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-yellow-500/30">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">🍌 Banana Menu</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 pt-4">
                    <DialogClose asChild>
                      <Button onClick={() => setShowBananaAI(true)} className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 font-bold">
                        <Bot className="w-4 h-4 mr-2" />
                        Banana AI — Change the Site
                      </Button>
                    </DialogClose>
                    {unlockedCodes.includes('jam') && (
                      <Button onClick={() => setShowJamCreator(true)} className="w-full bg-gradient-to-r from-pink-600 to-purple-600">
                        <Music className="w-4 h-4 mr-2" />
                        Create Your Jam
                      </Button>
                    )}
                    {unlockedCodes.includes('penn') && (
                      <Button onClick={() => setShowCodeCreator(true)} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                        <Bot className="w-4 h-4 mr-2" />
                        Create Custom Code
                      </Button>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              <div>
                <h1 className={`${deviceType === 'phone' ? 'text-xl' : 'text-3xl md:text-4xl'} font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400`}>
                  NexusBanan.net
                </h1>
                <p className={`${deviceType === 'phone' ? 'text-[10px]' : 'text-xs'} text-purple-300/70`}>Educational Gaming Hub</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center ${deviceType === 'phone' ? 'gap-1' : 'gap-2 sm:gap-3'}`}
            >
              {deviceType !== 'phone' && (
                <>
                  <BananBucks />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowHTTPRunner(true)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl text-white font-semibold shadow-lg shadow-orange-500/30"
                  >
                    <span className="hidden sm:inline">HTML</span>
                    <span className="sm:hidden">▶</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowWebsiteGenerator(true)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-semibold shadow-lg shadow-blue-500/30"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden sm:inline">Web Gen</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowShareLink(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white font-semibold shadow-lg shadow-green-500/30"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAutoClicker(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-900 to-green-700 border border-green-500/40 rounded-xl text-green-400 font-semibold shadow-lg"
                  >
                    <Mouse className="w-4 h-4" />
                    <span className="hidden sm:inline">AutoClick</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNexusFun(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl text-white font-semibold shadow-lg shadow-cyan-500/30"
                  >
                    <Zap className="w-4 h-4" />
                    <span className="hidden sm:inline">Nexus.fun</span>
                  </motion.button>
                </>
              )}

              {/* Secret X Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSecretGames(true)}
                className={`${deviceType === 'phone' ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500 hover:text-cyan-400 transition-colors`}
              >
                <X className={deviceType === 'phone' ? 'w-4 h-4' : 'w-5 h-5'} />
              </motion.button>

              {/* Code Input */}
              <Dialog>
                <DialogTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 ${deviceType === 'phone' ? 'px-2 py-1.5 text-xs' : 'px-4 py-2'} bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold shadow-lg shadow-purple-500/30`}
                  >
                    <Lock className={deviceType === 'phone' ? 'w-3 h-3' : 'w-4 h-4'} />
                    <span className={deviceType === 'phone' ? '' : 'hidden sm:inline'}>Codes</span>
                  </motion.button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-purple-500/30">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
                      🔐 Enter Secret Code
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Input
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmit()}
                      placeholder="Type your code..."
                      className="bg-slate-800 border-purple-500/30 text-white placeholder:text-slate-500"
                    />
                    <Button 
                      onClick={handleCodeSubmit}
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Unlock
                    </Button>
                    <AnimatePresence>
                      {codeMessage && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`text-center font-semibold ${codeMessage.includes('🎉') ? 'text-green-400' : 'text-red-400'}`}
                        >
                          {codeMessage}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <div className="pt-4 border-t border-slate-700">
                      <p className="text-xs text-slate-500 text-center">
                        Unlocked this session: {unlockedCodes.length} codes
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Top Action Buttons for Mobile */}
      {deviceType === 'phone' && (
        <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-purple-500/20 px-2 py-2">
          <div className="flex items-center justify-between gap-1">
            <BananBucks />
            <Button onClick={() => setShowHTTPRunner(true)} size="sm" variant="outline" className="text-xs px-2 h-7 border-cyan-500/30">
              HTML
            </Button>
            <Button onClick={() => setShowWebsiteGenerator(true)} size="sm" variant="outline" className="text-xs px-2 h-7 border-purple-500/30">
              Web
            </Button>
            <Button onClick={() => setShowShareLink(true)} size="sm" variant="outline" className="text-xs px-2 h-7 border-pink-500/30">
              Share
            </Button>
            <Button onClick={() => setShowCodesViewer(true)} size="sm" variant="outline" className="text-xs px-2 h-7 border-yellow-500/30">
              Codes
            </Button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-xl border-b border-purple-500/20 shadow-lg" style={deviceType === 'phone' ? { top: '52px' } : {}}>
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <div className={`flex gap-1 overflow-x-auto ${deviceType === 'phone' ? 'py-1' : 'py-2 sm:py-3'} scrollbar-hide`}>
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 ${deviceType === 'phone' ? 'px-2 py-1 text-xs' : 'px-3 sm:px-4 py-2 text-sm'} rounded-xl font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <tab.icon className={deviceType === 'phone' ? 'w-3 h-3' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'} />
                {deviceType === 'phone' ? (
                  <span>{tab.label.split(' ')[0]}</span>
                ) : (
                  <>
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`max-w-6xl mx-auto px-4 ${deviceType === 'phone' ? 'py-4 pb-20' : 'py-8'}`}>
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">NexusBanan</span>
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto">
                  Your ultimate educational gaming destination. Learn math, science, and reading through fun interactive games!
                </p>
              </div>
              {/* Owner's Vault banner */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setShowUpdateCodePanel(true)}
                className="w-full max-w-3xl mx-auto mb-10 relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/60 via-purple-950/60 to-slate-900/60 px-5 py-4 flex items-center gap-4 text-left"
              >
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="w-11 h-11 flex-shrink-0 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm sm:text-base">Owner has left — ask him for the secret code to add updates</p>
                  <p className="text-amber-300/70 text-xs mt-0.5">Tap here to enter the code & write an update with AI</p>
                </div>
                <span className="hidden sm:flex items-center gap-1 text-amber-300 text-xs font-semibold flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5" /> Enter
                </span>
              </motion.button>
              <CategorySection
                hasGoGuardian={hasGoGuardian}
                onResetDevice={() => {
                  localStorage.removeItem('deviceType');
                  localStorage.removeItem('hasGoGuardian');
                  setDeviceType(null);
                  setHasGoGuardian(null);
                }}
                onToggleGoGuardian={() => {
                  const next = !hasGoGuardian;
                  setHasGoGuardian(next);
                  localStorage.setItem('hasGoGuardian', String(next));
                }}
              />
            </motion.div>
          )}

          {activeTab === 'math' && (
            <motion.div
              key="math"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Calculator className="w-8 h-8 text-cyan-400" />
                Math Games
              </h2>
              <MathGames hasGoGuardian={hasGoGuardian} />
            </motion.div>
          )}

          {activeTab === 'science' && (
            <motion.div
              key="science"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <FlaskConical className="w-8 h-8 text-green-400" />
                Science Games & Experiments
              </h2>
              <ScienceExperiments hasGoGuardian={hasGoGuardian} />
            </motion.div>
          )}

          {activeTab === 'ela' && (
            <motion.div
              key="ela"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-pink-400" />
                ELA & Reading Games
              </h2>
              <ELAGames unlockedCodes={unlockedCodes} hasGoGuardian={hasGoGuardian} />
            </motion.div>
          )}

          {activeTab === 'playit' && (
            <motion.div
              key="playit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PlayItAI hasGoGuardian={hasGoGuardian} />
            </motion.div>
          )}

          {activeTab === 'other' && (
            <motion.div
              key="other"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <OtherTabs 
                unlockedCodes={unlockedCodes}
                onUnlockCode={(code) => {
                  if (!unlockedCodes.includes(code)) {
                    setUnlockedCodes([...unlockedCodes, code]);
                  }
                }}
                onOpenYouTube={() => setShowYouTube(true)}
              />
            </motion.div>
          )}

          {activeTab === 'bananquiz' && (
            <motion.div
              key="bananquiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ImprovedKahootGame />
            </motion.div>
          )}

          {activeTab === 'jams' && (
            <motion.div
              key="jams"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FriendMusic isAdmin={isMasterKey} />
            </motion.div>
          )}

          {activeTab === 'suggestions' && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Suggestions />
            </motion.div>
          )}

          {activeTab === 'ai-codes' && (
            <motion.div
              key="ai-codes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AICodeCountdown />
            </motion.div>
          )}

          {activeTab === 'developer' && (
            <motion.div
              key="developer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DeveloperStuff />
            </motion.div>
          )}

          {activeTab === 'public-games' && (
            <motion.div
              key="public-games"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PublicGames isAdmin={isMasterKey} />
            </motion.div>
          )}

          {activeTab === 'websites' && (
            <motion.div
              key="websites"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <WebsitesTab />
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <User className="w-8 h-8 text-purple-400" />
                Community Chat
              </h2>
              <CommunityChat userProfile={userProfile} customRoles={customRoles} />

            </motion.div>
          )}

          {activeTab === 'roles' && (
            <motion.div
              key="roles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <RolesSection currentUser={null} userProfile={userProfile} customRoles={customRoles} />
            </motion.div>
          )}

          {activeTab === 'executive' && (isExecutive || hasPermission(userProfile?.roles || [], 'rank_users') || hasPermission(userProfile?.roles || [], 'warn') || hasPermission(userProfile?.roles || [], 'timeout')) && (
            <motion.div
              key="executive"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ExecutivePanel currentUser={{ roles: userProfile?.roles || [] }} />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GuestProfile />
            </motion.div>
          )}

          {activeTab === 'banana' && unlockedCodes.includes('banana') && (
            <motion.div
              key="banana"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-2xl overflow-hidden"
              style={{ height: '80vh' }}
            >
              <BananaLang onClose={() => setActiveTab('home')} />
            </motion.div>
          )}

          {activeTab === 'webmaker' && (
            <motion.div
              key="webmaker"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <WebMaker userProfile={userProfile} />
            </motion.div>
          )}

          {activeTab === 'git' && (
            <motion.div
              key="git"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GitExport />
            </motion.div>
          )}

          {activeTab === 'updates' && (
            <motion.div
              key="updates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <UpdateLog canEdit={isExecutive} />
            </motion.div>
          )}

          {activeTab === 'dev' && devUnlocked && (
            <motion.div
              key="dev"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DevPanel userProfile={userProfile} customRoles={customRoles} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showSecretGames && (
          <SecretGames onClose={() => setShowSecretGames(false)} />
        )}
        {showYouTube && (
          <YouTubeViewer onClose={() => setShowYouTube(false)} />
        )}
        {selectedGame && (
          <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
        )}
        {showShareLink && (
          <ShareModal onClose={() => setShowShareLink(false)} />
        )}
        {showCodesViewer && (
          <CodesViewer 
            onClose={() => setShowCodesViewer(false)}
            unlockedCodes={unlockedCodes}
            onUnlockCode={(code) => {
              if (!unlockedCodes.includes(code)) {
                setUnlockedCodes([...unlockedCodes, code]);
              }
            }}
          />
        )}
        {showHTTPRunner && (
          <HTTPRunner onClose={() => setShowHTTPRunner(false)} />
        )}
        {showWebsiteGenerator && (
          <WebsiteGenerator onClose={() => setShowWebsiteGenerator(false)} />
        )}
        {showCodeCreator && (
          <CodeCreator onClose={() => setShowCodeCreator(false)} />
        )}
        {showJamCreator && (
          <JamCreator onClose={() => setShowJamCreator(false)} />
        )}
        {showAutoClicker && (
          <AutoClicker onClose={() => setShowAutoClicker(false)} />
        )}
        {showNexusFun && (
          <NexusFun onClose={() => setShowNexusFun(false)} />
        )}
        {showUpdateCodePanel && (
          <UpdateCodePanel
            open={showUpdateCodePanel}
            onClose={() => setShowUpdateCodePanel(false)}
            onUnlock={() => setDevUnlocked(true)}
          />
        )}
        {showBananaAI && (
          <BananaAI open={showBananaAI} onClose={() => setShowBananaAI(false)} />
        )}

      </AnimatePresence>
    </div>
  );
}

function WebsiteGenerator({ onClose }) {
  const [prompt, setPrompt] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [generatedCode, setGeneratedCode] = React.useState('');
  const [showPreview, setShowPreview] = React.useState(false);
  const [posting, setPosting] = React.useState(false);
  const [postName, setPostName] = React.useState('');

  const generateWebsite = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a complete, beautiful, single-page HTML website with inline CSS and JavaScript based on this description: ${prompt}. 
        Make it visually stunning with modern design, gradients, animations, and responsive layout. 
        Include all necessary HTML, CSS, and JS in one file. Make it production-ready and impressive.
        IMPORTANT: Return ONLY the HTML code, no explanations or markdown.`,
        add_context_from_internet: false
      });
      
      setGeneratedCode(response);
      setShowPreview(true);
    } catch (error) {
      alert('Failed to generate website. Please try again!');
    }
    setLoading(false);
  };

  const downloadHTML = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-game.html';
    a.click();
  };

  const postGame = async () => {
    if (!postName.trim()) { alert('Enter a name for your game!'); return; }
    setPosting(true);
    await base44.entities.WebGame.create({
      title: postName,
      html_content: generatedCode,
      is_public: true,
    });
    setPosting(false);
    alert('Game posted to Public Games!');
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
        className="bg-slate-900 rounded-2xl shadow-2xl border border-purple-500/30 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-slate-700 flex items-center justify-between bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Website Generator</h2>
              <p className="text-sm text-slate-400">Describe your website and AI will create it</p>
            </div>
          </div>
          <Button onClick={onClose} variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {!showPreview ? (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Describe your website</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., Create a portfolio website for a photographer with a hero section, gallery grid, and contact form. Use dark theme with purple accents..."
                  className="w-full h-40 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
              <Button
                onClick={generateWebsite}
                disabled={loading || !prompt.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-6"
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
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Website
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="p-4 bg-slate-800/50 flex flex-wrap gap-2 items-center">
              <Button onClick={() => setShowPreview(false)} variant="outline" size="sm">
                ← Back
              </Button>
              <Button onClick={downloadHTML} className="bg-green-600 hover:bg-green-700" size="sm">
                ⬇ Download HTML
              </Button>
              <Button
                onClick={() => { navigator.clipboard.writeText(generatedCode); alert('Code copied!'); }}
                variant="outline"
                size="sm"
              >
                📋 Copy Code
              </Button>
              <div className="flex items-center gap-2 ml-auto">
                <input
                  value={postName}
                  onChange={e => setPostName(e.target.value)}
                  placeholder="Game name..."
                  className="h-8 text-sm bg-slate-700 border border-slate-600 rounded-lg px-3 text-white placeholder:text-slate-400 focus:outline-none w-36"
                />
                <Button
                  onClick={postGame}
                  disabled={posting}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  size="sm"
                >
                  {posting ? '...' : '🚀 Post Game'}
                </Button>
              </div>
            </div>
            <iframe
              srcDoc={generatedCode}
              className="flex-1 w-full border-0 bg-white"
              title="Website Preview"
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function MathGames({ hasGoGuardian = false }) {
  const [selectedGame, setSelectedGame] = React.useState(null);
  
  const allGames = [
    { name: 'Desmos Graphing', desc: 'Interactive graphing calculator', color: 'from-teal-500 to-cyan-600', emoji: '📈', internalUrl: 'https://www.desmos.com/calculator', externalUrl: 'https://www.desmos.com/calculator', embeddable: true, goGuardianSafe: true },
    { name: 'GeoGebra', desc: 'Geometry & algebra tools', color: 'from-blue-500 to-cyan-500', emoji: '🔢', internalUrl: 'https://www.geogebra.org/calculator', externalUrl: 'https://www.geogebra.org/calculator', embeddable: true, goGuardianSafe: true },
    { name: 'Math Playground', desc: 'Tons of math games', color: 'from-purple-500 to-pink-500', emoji: '🥷', internalUrl: null, externalUrl: 'https://www.mathplayground.com/', embeddable: false, goGuardianSafe: true },
    { name: 'Khan Academy Math', desc: 'Learn & practice math', color: 'from-green-500 to-teal-500', emoji: '🧙', internalUrl: null, externalUrl: 'https://www.khanacademy.org/math', embeddable: false, goGuardianSafe: true },
    { name: 'Prodigy Math', desc: 'RPG math adventure', color: 'from-yellow-500 to-orange-500', emoji: '🚀', internalUrl: null, externalUrl: 'https://www.prodigygame.com/', embeddable: false, goGuardianSafe: true },
    { name: 'Times Table Rock Stars', desc: 'Speed multiplication', color: 'from-pink-500 to-rose-500', emoji: '🏎️', internalUrl: null, externalUrl: 'https://ttrockstars.com/', embeddable: false, goGuardianSafe: true },
    { name: 'Coolmath Games', desc: 'Fun math puzzles', color: 'from-orange-500 to-red-500', emoji: '🎮', internalUrl: null, externalUrl: 'https://www.coolmathgames.com/', embeddable: false, goGuardianSafe: false },
    { name: 'Scratch Math', desc: 'Code math projects', color: 'from-indigo-500 to-purple-500', emoji: '💡', internalUrl: null, externalUrl: 'https://scratch.mit.edu/', embeddable: false, goGuardianSafe: false },
  ];

  const games = hasGoGuardian ? allGames.filter(g => g.goGuardianSafe) : allGames;

  const handleClick = (game) => {
    if (game.embeddable) {
      setSelectedGame(game);
    } else {
      window.open(game.externalUrl, '_blank');
    }
  };

  return (
    <>
      {hasGoGuardian && (
        <div className="flex items-center gap-2 px-4 py-2 mb-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm font-medium">
          🛡️ Blocked Mode — showing only unblocked educational games
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game, i) => (
          <motion.div
            key={game.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.03, y: -5 }}
            onClick={() => handleClick(game)}
            className={`p-6 rounded-2xl bg-gradient-to-br ${game.color} cursor-pointer shadow-xl relative`}
          >
            <span className="text-4xl mb-3 block">{game.emoji}</span>
            <h3 className="text-xl font-bold text-white">{game.name}</h3>
            <p className="text-white/80 text-sm mt-1">{game.desc}</p>
            <span className="absolute top-3 right-3 text-xs bg-white/20 px-2 py-0.5 rounded-full text-white">
              {game.embeddable ? '▶ Play Here' : '🔗 New Tab'}
            </span>
          </motion.div>
        ))}
      </div>
      {selectedGame && <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />}
    </>
  );
}

function ELAGames({ unlockedCodes = [], hasGoGuardian = false }) {
  const allGames = [
    { name: 'Vocabulary.com', desc: 'Build vocabulary fast', color: 'from-pink-500 to-purple-500', emoji: '✨', externalUrl: 'https://www.vocabulary.com/play/', goGuardianSafe: true },
    { name: 'Read Theory', desc: 'Reading comprehension', color: 'from-orange-500 to-yellow-500', emoji: '📖', externalUrl: 'https://www.readtheory.org/', goGuardianSafe: true },
    { name: 'Spelling City', desc: 'Spelling & vocabulary games', color: 'from-violet-500 to-purple-500', emoji: '🐝', externalUrl: 'https://spellingcity.com/', goGuardianSafe: true },
    { name: 'Grammaropolis', desc: 'Navigate grammar rules', color: 'from-green-500 to-emerald-500', emoji: '🌌', externalUrl: 'https://www.grammaropolis.com/', goGuardianSafe: true },
    { name: 'CommonLit', desc: 'Read & discuss literature', color: 'from-cyan-500 to-blue-500', emoji: '📚', externalUrl: 'https://www.commonlit.org/', goGuardianSafe: true },
    { name: 'Poetry Foundation', desc: 'Explore great poetry', color: 'from-rose-500 to-pink-500', emoji: '🎤', externalUrl: 'https://www.poetryfoundation.org/', goGuardianSafe: true },
    { name: 'Storyboard That', desc: 'Create your own stories', color: 'from-amber-500 to-orange-500', emoji: '✍️', externalUrl: 'https://www.storyboardthat.com/', goGuardianSafe: false },
    { name: 'Scratch', desc: 'Code your own stories', color: 'from-teal-500 to-cyan-500', emoji: '🎯', externalUrl: 'https://scratch.mit.edu/', goGuardianSafe: false },
  ];

  const games = hasGoGuardian ? allGames.filter(g => g.goGuardianSafe) : allGames;

  return (
    <>
      <LibraryBooks unlockedCodes={unlockedCodes} />
      {hasGoGuardian && (
        <div className="flex items-center gap-2 px-4 py-2 mb-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm font-medium">
          🛡️ Blocked Mode — showing only unblocked educational games
        </div>
      )}
      <h3 className="text-2xl font-bold text-white mt-8 mb-4">ELA Games</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game, i) => (
          <motion.div
            key={game.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.03, y: -5 }}
            onClick={() => window.open(game.externalUrl, '_blank')}
            className={`p-6 rounded-2xl bg-gradient-to-br ${game.color} cursor-pointer shadow-xl relative`}
          >
            <span className="text-4xl mb-3 block">{game.emoji}</span>
            <h3 className="text-xl font-bold text-white">{game.name}</h3>
            <p className="text-white/80 text-sm mt-1">{game.desc}</p>
            <span className="absolute top-3 right-3 text-xs bg-white/20 px-2 py-0.5 rounded-full text-white">🔗 New Tab</span>
          </motion.div>
        ))}
      </div>
    </>
  );
}