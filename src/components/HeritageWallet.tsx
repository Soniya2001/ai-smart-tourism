import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, Award, Sparkles, Clock, BookOpen, Landmark, Compass, 
  Globe, GraduationCap, Star, MessageSquare, Camera, ShieldAlert, 
  Sprout, Heart, ShieldCheck, Crown, Lock, CheckCircle2, ChevronRight, 
  Info, Share2, Zap, Check, X, RotateCcw, Volume2, VolumeX, MapPin
} from "lucide-react";

export interface BadgeItem {
  id: string;
  name: string;
  category: "Knowledge" | "Exploration" | "Community" | "Conservation" | "Special";
  tier: "Common" | "Rare" | "Epic" | "Legendary";
  iconName: string;
  description: string;
  unlocked: boolean;
  earnedDate?: string;
  currentProgress?: number;
  totalRequired?: number;
  remainingText?: string;
  xp: number;
}

// Initial Preset Badges Dataset
export const INITIAL_BADGES: BadgeItem[] = [
  // 1. Knowledge Badges
  {
    id: "k1",
    name: "Heritage Explorer",
    category: "Knowledge",
    tier: "Common",
    iconName: "Landmark",
    description: "Completed your first AI Time Travel historical reconstruction.",
    unlocked: true,
    earnedDate: "12 July 2026",
    currentProgress: 1,
    totalRequired: 1,
    remainingText: "Completed!",
    xp: 250
  },
  {
    id: "k2",
    name: "History Scholar",
    category: "Knowledge",
    tier: "Rare",
    iconName: "BookOpen",
    description: "Demonstrated strong historical knowledge by scoring above 80% in a Heritage Quiz.",
    unlocked: true,
    earnedDate: "12 July 2026",
    currentProgress: 1,
    totalRequired: 1,
    remainingText: "Completed!",
    xp: 500
  },
  {
    id: "k3",
    name: "Heritage Master",
    category: "Knowledge",
    tier: "Epic",
    iconName: "GraduationCap",
    description: "Achieved a perfect 100% score in five different monument quizzes.",
    unlocked: false,
    currentProgress: 3,
    totalRequired: 5,
    remainingText: "Complete 2 more quizzes with 100% score.",
    xp: 1000
  },
  {
    id: "k4",
    name: "World Heritage Expert",
    category: "Knowledge",
    tier: "Legendary",
    iconName: "Globe",
    description: "Mastered historical knowledge and completed quizzes for 10 different world heritage sites.",
    unlocked: false,
    currentProgress: 4,
    totalRequired: 10,
    remainingText: "Explore & complete quizzes for 6 more sites.",
    xp: 2000
  },

  // 2. Exploration Badges
  {
    id: "e1",
    name: "Time Traveler",
    category: "Exploration",
    tier: "Rare",
    iconName: "Clock",
    description: "Journeyed through time by generating 10 historical reconstructions.",
    unlocked: false,
    currentProgress: 6,
    totalRequired: 10,
    remainingText: "Generate 4 more historical time travel views.",
    xp: 500
  },
  {
    id: "e2",
    name: "Monument Explorer",
    category: "Exploration",
    tier: "Epic",
    iconName: "Compass",
    description: "Explored 15 different ancient monuments and architectural wonders.",
    unlocked: false,
    currentProgress: 8,
    totalRequired: 15,
    remainingText: "Explore 7 more heritage locations.",
    xp: 1000
  },
  {
    id: "e3",
    name: "Cultural Voyager",
    category: "Exploration",
    tier: "Legendary",
    iconName: "MapPin",
    description: "Expanded cultural horizons by exploring heritage landmarks from 5 different states or countries.",
    unlocked: false,
    currentProgress: 3,
    totalRequired: 5,
    remainingText: "Visit monuments from 2 more states or countries.",
    xp: 1500
  },

  // 3. Community Badges
  {
    id: "c1",
    name: "Heritage Contributor",
    category: "Community",
    tier: "Common",
    iconName: "MessageSquare",
    description: "Contributed public review feedback to help preserve monument heritage.",
    unlocked: true,
    earnedDate: "15 June 2026",
    currentProgress: 1,
    totalRequired: 1,
    remainingText: "Completed!",
    xp: 250
  },
  {
    id: "c2",
    name: "Community Voice",
    category: "Community",
    tier: "Rare",
    iconName: "Star",
    description: "Actively shaped heritage tourism with 10 verified community feedback reports.",
    unlocked: false,
    currentProgress: 4,
    totalRequired: 10,
    remainingText: "Submit 6 more feedback reports.",
    xp: 750
  },
  {
    id: "c3",
    name: "Heritage Reporter",
    category: "Community",
    tier: "Epic",
    iconName: "Camera",
    description: "Helped protect monuments by filing a verified complaint with photo evidence and GPS coordinates.",
    unlocked: true,
    earnedDate: "20 July 2026",
    currentProgress: 1,
    totalRequired: 1,
    remainingText: "Completed!",
    xp: 1200
  },

  // 4. Conservation Badges
  {
    id: "d1",
    name: "Heritage Protector",
    category: "Conservation",
    tier: "Common",
    iconName: "Sprout",
    description: "Supported historical preservation by making your first heritage donation.",
    unlocked: true,
    earnedDate: "01 May 2026",
    currentProgress: 1,
    totalRequired: 1,
    remainingText: "Completed!",
    xp: 300
  },
  {
    id: "d2",
    name: "Conservation Supporter",
    category: "Conservation",
    tier: "Rare",
    iconName: "Heart",
    description: "Pledged financial support towards the upkeep and restoration of 3 different heritage sites.",
    unlocked: false,
    currentProgress: 2,
    totalRequired: 3,
    remainingText: "Donate to 1 more heritage site.",
    xp: 800
  },
  {
    id: "d3",
    name: "Heritage Guardian",
    category: "Conservation",
    tier: "Legendary",
    iconName: "ShieldCheck",
    description: "Achieved multi-faceted guardianship by completing donation, feedback, and quiz milestones.",
    unlocked: false,
    currentProgress: 2,
    totalRequired: 3,
    remainingText: "Complete final conservation milestone.",
    xp: 2500
  },

  // 5. Special Achievement Badges
  {
    id: "s1",
    name: "Legend of Heritage",
    category: "Special",
    tier: "Legendary",
    iconName: "Crown",
    description: "Achieved the ultimate honor by collecting every single badge in the application.",
    unlocked: false,
    currentProgress: 5,
    totalRequired: 15,
    remainingText: "Unlock 10 more badges.",
    xp: 5000
  },
  {
    id: "s2",
    name: "Gemini Heritage Champion",
    category: "Special",
    tier: "Legendary",
    iconName: "Sparkles",
    description: "Pioneered AI-driven heritage learning with flawless scores across all historical reconstructions.",
    unlocked: false,
    currentProgress: 2,
    totalRequired: 5,
    remainingText: "Complete all AI time travel experiences with 100%.",
    xp: 5000
  }
];

// Helper to render badge icon dynamically
export function RenderBadgeIcon({ name, className }: { name: string; className?: string }) {
  const cls = className || "h-6 w-6";
  switch (name) {
    case "Landmark": return <Landmark className={cls} />;
    case "BookOpen": return <BookOpen className={cls} />;
    case "GraduationCap": return <GraduationCap className={cls} />;
    case "Globe": return <Globe className={cls} />;
    case "Clock": return <Clock className={cls} />;
    case "Compass": return <Compass className={cls} />;
    case "MapPin": return <MapPin className={cls} />;
    case "MessageSquare": return <MessageSquare className={cls} />;
    case "Star": return <Star className={cls} />;
    case "Camera": return <Camera className={cls} />;
    case "Sprout": return <Sprout className={cls} />;
    case "Heart": return <Heart className={cls} />;
    case "ShieldCheck": return <ShieldCheck className={cls} />;
    case "Crown": return <Crown className={cls} />;
    case "Sparkles": return <Sparkles className={cls} />;
    default: return <Award className={cls} />;
  }
}

// Sound Synthesis for Achievement Unlocks
function playAchievementChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now + i * 0.08);

      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.45);
    });
  } catch (err) {
    console.warn("Audio play prevented:", err);
  }
}

export default function HeritageWallet() {
  const [badges, setBadges] = useState<BadgeItem[]>(() => {
    const saved = localStorage.getItem("heritage_wallet_badges");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_BADGES;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const [unlockedPopupBadge, setUnlockedPopupBadge] = useState<BadgeItem | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Persist badges state changes to localStorage
  useEffect(() => {
    localStorage.setItem("heritage_wallet_badges", JSON.stringify(badges));
  }, [badges]);

  // Calculations for Summary Header
  const totalBadges = badges.length;
  const earnedBadges = badges.filter(b => b.unlocked);
  const earnedCount = earnedBadges.length;
  const completionPercentage = Math.round((earnedCount / totalBadges) * 100);

  const totalXP = earnedBadges.reduce((acc, b) => acc + b.xp, 0);

  // Determine Level based on XP
  const getLevelInfo = (xp: number) => {
    if (xp >= 5000) return { level: "Legendary Guardian", levelNum: 5, color: "text-amber-800 bg-amber-100 border-amber-300" };
    if (xp >= 3000) return { level: "Heritage Master", levelNum: 4, color: "text-indigo-800 bg-indigo-100 border-indigo-300" };
    if (xp >= 1500) return { level: "History Scholar", levelNum: 3, color: "text-emerald-800 bg-emerald-100 border-emerald-300" };
    if (xp >= 500) return { level: "Heritage Explorer", levelNum: 2, color: "text-teal-800 bg-teal-100 border-teal-300" };
    return { level: "Novice Tourist", levelNum: 1, color: "text-gray-800 bg-gray-100 border-gray-300" };
  };

  const levelInfo = getLevelInfo(totalXP);

  // Find next closest locked badge
  const nextLockedBadge = badges.find(b => !b.unlocked);
  const nextBadgeProgress = nextLockedBadge 
    ? `${nextLockedBadge.name} (${Math.round(((nextLockedBadge.currentProgress || 0) / (nextLockedBadge.totalRequired || 1)) * 100)}%)`
    : "All Badges Unlocked!";

  // Category list
  const categories = ["All", "Knowledge", "Exploration", "Community", "Conservation", "Special"];

  // Filtered Badges
  const filteredBadges = badges.filter(b => {
    if (selectedCategory !== "All" && b.category !== selectedCategory) return false;
    return true;
  });

  // Function to unlock a badge (e.g. simulation or action trigger)
  const triggerUnlockBadge = (badgeId: string) => {
    const target = badges.find(b => b.id === badgeId);
    if (!target) return;

    if (target.unlocked) {
      setToastMsg(`You already unlocked "${target.name}"!`);
      setTimeout(() => setToastMsg(null), 2500);
      return;
    }

    const updated = badges.map(b => {
      if (b.id === badgeId) {
        return {
          ...b,
          unlocked: true,
          earnedDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
          currentProgress: b.totalRequired || 1,
          remainingText: "Completed!"
        };
      }
      return b;
    });

    setBadges(updated);
    
    // Trigger celebration chime & popup
    if (soundEnabled) {
      playAchievementChime();
    }

    const newlyUnlocked = updated.find(b => b.id === badgeId) || target;
    setUnlockedPopupBadge(newlyUnlocked);
  };

  // Reset Badges to Default (for testing/demo)
  const handleResetBadges = () => {
    setBadges(INITIAL_BADGES);
    setToastMsg("Badges reset to default state.");
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Tier Styling Config
  const getTierBadgeStyle = (tier: BadgeItem["tier"], unlocked: boolean) => {
    if (!unlocked) {
      return {
        cardBg: "bg-gray-50/80 border-gray-200 grayscale-[0.6] opacity-90",
        iconContainer: "bg-gray-200/80 text-gray-400 border-gray-300",
        tierPill: "bg-gray-200 text-gray-600 border-gray-300",
        titleColor: "text-gray-700",
        descColor: "text-gray-500",
      };
    }

    switch (tier) {
      case "Common":
        return {
          cardBg: "bg-gradient-to-br from-amber-50/40 via-white to-stone-50 border-amber-200 hover:border-amber-400 shadow-sm hover:shadow-md",
          iconContainer: "bg-amber-100 text-amber-800 border-amber-300 shadow-sm",
          tierPill: "bg-amber-100/80 text-amber-900 border-amber-300",
          titleColor: "text-stone-900",
          descColor: "text-stone-600",
        };
      case "Rare":
        return {
          cardBg: "bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/40 border-emerald-300 hover:border-emerald-500 shadow-sm hover:shadow-md",
          iconContainer: "bg-emerald-600 text-white border-emerald-400 shadow-sm",
          tierPill: "bg-emerald-100 text-emerald-900 border-emerald-300",
          titleColor: "text-emerald-950",
          descColor: "text-emerald-800/90",
        };
      case "Epic":
        return {
          cardBg: "bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40 border-indigo-300 hover:border-indigo-500 shadow-sm hover:shadow-md",
          iconContainer: "bg-indigo-600 text-white border-indigo-400 shadow-sm",
          tierPill: "bg-indigo-100 text-indigo-900 border-indigo-300",
          titleColor: "text-indigo-950",
          descColor: "text-indigo-900/80",
        };
      case "Legendary":
        return {
          cardBg: "bg-gradient-to-br from-amber-100/60 via-amber-50 to-orange-100/50 border-amber-400 hover:border-amber-500 shadow-md hover:shadow-lg ring-1 ring-amber-300/50",
          iconContainer: "bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-300 shadow-md animate-pulse",
          tierPill: "bg-amber-200 text-amber-950 border-amber-400 font-black",
          titleColor: "text-amber-950 font-black",
          descColor: "text-amber-900",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-stone-900 text-amber-200 text-xs font-bold px-4 py-3 rounded-xl shadow-xl border border-amber-500/30 flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* TOP SUMMARY SECTION */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 text-white p-6 md:p-8 rounded-3xl border border-amber-500/30 shadow-xl relative overflow-hidden space-y-6">
        {/* Subtle Decorative Background Shapes */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Title & Level Info */}
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                Collectible Achievement Gallery
              </span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? "Mute sound effects" : "Enable sound effects"}
                className="p-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-amber-300 text-xs flex items-center gap-1 transition-all border border-amber-500/20"
              >
                {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5 text-stone-500" />}
              </button>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Trophy className="h-7 w-7 text-amber-400" />
              Heritage Wallet
            </h2>

            <p className="text-xs text-stone-300 leading-relaxed">
              Earn collectible heritage badges by exploring historical time travel views, passing quizzes, filing community feedback, and supporting monument conservation.
            </p>
          </div>

          {/* Quick Demo Reset / Simulation Actions */}
          <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
            <button
              onClick={handleResetBadges}
              className="px-3 py-2 bg-stone-800/90 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl text-xs font-semibold border border-stone-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Badges</span>
            </button>

            <button
              onClick={() => {
                const locked = badges.find(b => !b.unlocked);
                if (locked) triggerUnlockBadge(locked.id);
                else setToastMsg("All badges unlocked already!");
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5 text-yellow-200 animate-bounce" />
              <span>Simulate Next Unlock</span>
            </button>
          </div>
        </div>

        {/* 5 Stats KPI Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4 border-t border-amber-500/20 relative z-10">
          
          {/* KPI 1: Badges Earned */}
          <div className="bg-stone-800/80 p-4 rounded-2xl border border-amber-500/20 space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Badges Earned
            </span>
            <div className="text-xl md:text-2xl font-black text-amber-400">
              {earnedCount} <span className="text-xs font-normal text-stone-400">/ {totalBadges}</span>
            </div>
            <span className="text-[10px] text-stone-400 block font-mono">
              {totalBadges - earnedCount} remaining
            </span>
          </div>

          {/* KPI 2: Completion Percentage */}
          <div className="bg-stone-800/80 p-4 rounded-2xl border border-amber-500/20 space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Completion
            </span>
            <div className="text-xl md:text-2xl font-black text-emerald-400">
              {completionPercentage}%
            </div>
            {/* Progress bar line */}
            <div className="w-full bg-stone-700 h-1.5 rounded-full overflow-hidden mt-1">
              <div 
                className="bg-emerald-400 h-1.5 transition-all duration-500" 
                style={{ width: `${completionPercentage}%` }} 
              />
            </div>
          </div>

          {/* KPI 3: Current Level */}
          <div className="bg-stone-800/80 p-4 rounded-2xl border border-amber-500/20 space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Current Level
            </span>
            <div className="text-sm font-black text-amber-300 truncate mt-0.5">
              {levelInfo.level}
            </div>
            <span className="text-[10px] text-amber-400/80 block font-mono">
              Level {levelInfo.levelNum} Explorer
            </span>
          </div>

          {/* KPI 4: XP Points */}
          <div className="bg-stone-800/80 p-4 rounded-2xl border border-amber-500/20 space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              XP Points
            </span>
            <div className="text-xl md:text-2xl font-black text-yellow-300 flex items-center gap-1">
              <span>{totalXP.toLocaleString()}</span>
              <span className="text-xs font-bold text-amber-400">XP</span>
            </div>
            <span className="text-[10px] text-stone-400 block font-mono">
              Total accumulated
            </span>
          </div>

          {/* KPI 5: Next Badge Progress */}
          <div className="bg-stone-800/80 p-4 rounded-2xl border border-amber-500/20 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Next Unlock
            </span>
            <div className="text-xs font-extrabold text-amber-200 truncate mt-1">
              {nextBadgeProgress}
            </div>
            <span className="text-[10px] text-stone-400 block italic">
              Keep exploring to unlock
            </span>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* CATEGORY FILTER TABS */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-stone-200 pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            const count = cat === "All" ? badges.length : badges.filter(b => b.category === cat).length;
            const earnedCatCount = cat === "All" ? earnedCount : badges.filter(b => b.category === cat && b.unlocked).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  active
                    ? "bg-amber-900 text-amber-100 shadow-sm ring-1 ring-amber-800"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  active ? "bg-amber-800 text-amber-200" : "bg-stone-200 text-stone-600"
                }`}>
                  {earnedCatCount}/{count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Showing <span className="font-bold text-stone-900">{filteredBadges.length}</span> badges
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BADGES RESPONSIVE CARD GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const style = getTierBadgeStyle(badge.tier, badge.unlocked);
          const progressPercent = badge.unlocked 
            ? 100 
            : Math.round(((badge.currentProgress || 0) / (badge.totalRequired || 1)) * 100);

          return (
            <motion.div
              key={badge.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedBadge(badge)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-4 ${style.cardBg}`}
            >
              {/* Top Row: Category + Tier Pill + Lock Indicator */}
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full border ${style.tierPill}`}>
                  {badge.tier}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100/80 text-stone-600 border border-stone-200">
                    +{badge.xp} XP
                  </span>

                  {badge.unlocked ? (
                    <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-stone-500 bg-stone-200/80 border border-stone-300 px-2 py-0.5 rounded-full">
                      <Lock className="h-3 w-3 text-stone-500" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Middle Row: Badge Icon + Name + Description */}
              <div className="flex items-start gap-3.5">
                {/* Icon Circle */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border relative ${style.iconContainer}`}>
                  <RenderBadgeIcon name={badge.iconName} className="h-6 w-6" />
                  
                  {!badge.unlocked && (
                    <div className="absolute inset-0 bg-stone-900/40 rounded-2xl flex items-center justify-center">
                      <Lock className="h-5 w-5 text-stone-200 drop-shadow-md" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className={`text-base font-extrabold leading-snug truncate ${style.titleColor}`}>
                    {badge.name}
                  </h3>
                  <p className={`text-xs line-clamp-2 leading-relaxed ${style.descColor}`}>
                    {badge.description}
                  </p>
                </div>
              </div>

              {/* Bottom Row: Earned Date OR Progress Indicator */}
              <div className="pt-3 border-t border-stone-200/60 space-y-1.5">
                {badge.unlocked ? (
                  <div className="flex items-center justify-between text-[11px] text-stone-600 font-medium">
                    <span className="flex items-center gap-1 text-emerald-800 font-bold">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      Earned {badge.earnedDate || "Recently"}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">Completed</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-stone-600">
                      <span>Progress: {badge.currentProgress || 0} / {badge.totalRequired}</span>
                      <span>{progressPercent}%</span>
                    </div>

                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-600 h-1.5 transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <p className="text-[10px] text-stone-500 italic truncate pt-0.5">
                      Remaining: {badge.remainingText}
                    </p>
                  </div>
                )}
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* BADGE DETAIL MODAL DIALOG */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-all z-10 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Modal Banner Header */}
              <div className={`p-8 text-center space-y-4 border-b relative ${
                selectedBadge.unlocked
                  ? "bg-gradient-to-br from-amber-100/80 via-amber-50 to-orange-100/50 border-amber-200"
                  : "bg-stone-100 border-stone-200"
              }`}>
                {/* Giant Badge Icon */}
                <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center border shadow-lg relative ${
                  selectedBadge.unlocked
                    ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-300 shadow-amber-500/20"
                    : "bg-stone-300 text-stone-500 border-stone-400"
                }`}>
                  <RenderBadgeIcon name={selectedBadge.iconName} className="h-10 w-10" />
                  {!selectedBadge.unlocked && (
                    <div className="absolute inset-0 bg-stone-900/40 rounded-3xl flex items-center justify-center">
                      <Lock className="h-8 w-8 text-white drop-shadow-md" />
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-stone-900 text-amber-300 inline-block mb-1">
                    {selectedBadge.tier} • {selectedBadge.category} Badge
                  </span>
                  <h3 className="text-2xl font-black text-stone-900">
                    {selectedBadge.name}
                  </h3>
                </div>
              </div>

              {/* Modal Content Details */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Unlock Requirement & Description
                  </h4>
                  <p className="text-xs md:text-sm text-stone-800 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200 font-medium">
                    "{selectedBadge.description}"
                  </p>
                </div>

                {/* Status & Progress Box */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-stone-600">Unlock Status:</span>
                    {selectedBadge.unlocked ? (
                      <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-stone-600 bg-stone-200 px-2.5 py-0.5 rounded-full border border-stone-300 flex items-center gap-1">
                        <Lock className="h-3.5 w-3.5" /> Locked
                      </span>
                    )}
                  </div>

                  {selectedBadge.unlocked ? (
                    <div className="flex items-center justify-between text-xs text-stone-700 pt-2 border-t border-stone-200">
                      <span className="font-medium text-stone-500">Date Earned:</span>
                      <span className="font-extrabold text-amber-900">{selectedBadge.earnedDate || "12 July 2026"}</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5 pt-2 border-t border-stone-200">
                      <div className="flex justify-between text-xs font-bold text-stone-700">
                        <span>Progress: {selectedBadge.currentProgress || 0} / {selectedBadge.totalRequired}</span>
                        <span>{Math.round(((selectedBadge.currentProgress || 0) / (selectedBadge.totalRequired || 1)) * 100)}%</span>
                      </div>
                      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-600 h-2 transition-all duration-300"
                          style={{ width: `${Math.round(((selectedBadge.currentProgress || 0) / (selectedBadge.totalRequired || 1)) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-stone-600 italic">
                        Remaining: {selectedBadge.remainingText}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-stone-700 pt-2 border-t border-stone-200">
                    <span className="font-medium text-stone-500">XP Reward:</span>
                    <span className="font-extrabold text-amber-600">+{selectedBadge.xp} XP</span>
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  {!selectedBadge.unlocked ? (
                    <button
                      onClick={() => {
                        triggerUnlockBadge(selectedBadge.id);
                        setSelectedBadge(null);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Zap className="h-4 w-4 text-yellow-200" />
                      <span>Unlock Badge Now (Demo)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setToastMsg(`Achievement copied to clipboard!`);
                        setTimeout(() => setToastMsg(null), 2500);
                      }}
                      className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share Achievement</span>
                    </button>
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* CELEBRATORY UNLOCK ANIMATION POPUP MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {unlockedPopupBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 text-white rounded-3xl max-w-md w-full border-2 border-amber-400 shadow-2xl p-8 text-center space-y-6 relative overflow-hidden"
            >
              {/* Confetti particles effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-2 left-10 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
                <div className="absolute top-12 right-12 w-3 h-3 bg-emerald-400 rounded-full animate-bounce" />
                <div className="absolute bottom-10 left-16 w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
              </div>

              {/* Popup Header */}
              <div className="space-y-1">
                <span className="text-3xl animate-bounce inline-block">🎉</span>
                <h3 className="text-2xl font-black text-amber-300 tracking-tight">
                  Congratulations!
                </h3>
                <p className="text-xs text-stone-300 font-medium">
                  You unlocked a new Heritage Badge:
                </p>
              </div>

              {/* Badge Icon & Title */}
              <div className="p-6 rounded-2xl bg-stone-800/90 border border-amber-400/40 space-y-3 shadow-inner">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <RenderBadgeIcon name={unlockedPopupBadge.iconName} className="h-8 w-8" />
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    {unlockedPopupBadge.tier} Tier
                  </span>
                  <h4 className="text-xl font-black text-white mt-1">
                    {unlockedPopupBadge.name}
                  </h4>
                  <p className="text-xs text-stone-300 mt-1 line-clamp-2">
                    {unlockedPopupBadge.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-amber-500/20 text-xs font-black text-amber-400 flex items-center justify-center gap-1">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>+{unlockedPopupBadge.xp} XP Earned</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setUnlockedPopupBadge(null)}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-stone-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Continue Exploring
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
