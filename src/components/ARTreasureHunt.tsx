import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Award, QrCode, Sparkles, Compass, MapPin, CheckCircle, 
  HelpCircle, Trophy, Gift, ArrowRight, Camera, RefreshCw,
  Clock, Search, Upload, Play, Pause, Volume2, VolumeX,
  BookOpen, Film, Smile, UserCheck, Hammer, Feather, Crown,
  Sliders, Layers, Eye, Sparkle, Info, ChevronRight
} from "lucide-react";
import { 
  FEATURED_TIME_MONUMENTS, 
  getMonumentTimeData, 
  MonumentTimeData, 
  TimelineEra 
} from "../lib/timeMachineData";

interface Badge {
  id: string;
  name: string;
  landmark: string;
  rarity: "Common" | "Rare" | "Epic";
  unlocked: boolean;
  color: string;
  icon: string;
  myth: string;
}

export default function ARTreasureHunt() {
  const [activeTab, setActiveTab] = useState<"timemachine" | "badges" | "certificate">("timemachine");
  const [score, setScore] = useState<number>(100);

  // -------------------------------------------------------------
  // AI TIME MACHINE STATE
  // -------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState<string>("Madurai Meenakshi Temple");
  const [monumentData, setMonumentData] = useState<MonumentTimeData>(FEATURED_TIME_MONUMENTS.meenakshi);
  const [selectedYear, setSelectedYear] = useState<number>(1650);
  const [storyMode, setStoryMode] = useState<"historian" | "documentary" | "child" | "traveler" | "architect" | "storyteller">("storyteller");
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [splitPosition, setSplitPosition] = useState<number>(50);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Preset search options
  const searchPresets = [
    { name: "Meenakshi Temple", query: "Madurai Meenakshi Temple" },
    { name: "Taj Mahal", query: "Taj Mahal" },
    { name: "Hampi Ruins", query: "Hampi Virupaksha Temple" },
    { name: "Konark Sun Temple", query: "Konark Sun Temple" },
    { name: "Machu Picchu", query: "Machu Picchu" },
    { name: "Colosseum", query: "Roman Colosseum" },
    { name: "Great Wall of China", query: "Great Wall of China" }
  ];

  // Storytelling perspectives configuration
  const storytellingModes = [
    {
      id: "historian",
      title: "Historian",
      icon: <BookOpen className="h-4 w-4 text-amber-600" />,
      tagline: "Historically accurate narration",
      bgClass: "border-amber-200 bg-amber-50/70 text-amber-950"
    },
    {
      id: "documentary",
      title: "Documentary",
      icon: <Film className="h-4 w-4 text-blue-600" />,
      tagline: "Netflix history documentary style",
      bgClass: "border-blue-200 bg-blue-50/70 text-blue-950"
    },
    {
      id: "child",
      title: "Child Mode",
      icon: <Smile className="h-4 w-4 text-emerald-600" />,
      tagline: "Simple & engaging for kids",
      bgClass: "border-emerald-200 bg-emerald-50/70 text-emerald-950"
    },
    {
      id: "traveler",
      title: "Traveler",
      icon: <UserCheck className="h-4 w-4 text-purple-600" />,
      tagline: "What visitors experienced",
      bgClass: "border-purple-200 bg-purple-50/70 text-purple-950"
    },
    {
      id: "architect",
      title: "Architect",
      icon: <Hammer className="h-4 w-4 text-stone-600" />,
      tagline: "Engineering & construction focus",
      bgClass: "border-stone-200 bg-stone-50/70 text-stone-950"
    },
    {
      id: "storyteller",
      title: "Storyteller",
      icon: <Feather className="h-4 w-4 text-rose-600" />,
      tagline: "Grounded immersive narrative",
      bgClass: "border-rose-200 bg-rose-50/70 text-rose-950"
    }
  ];

  // Badges state for wallet
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: "gopuram",
      name: "Gopuram Master",
      landmark: "Madurai Meenakshi Temple",
      rarity: "Epic",
      unlocked: true,
      color: "from-amber-600 to-yellow-800",
      icon: "🛕",
      myth: "Legend says the Thousand Pillar Hall was built in a single night from divine stone carvings."
    },
    {
      id: "marble",
      name: "Marble Sentinel",
      landmark: "Taj Mahal",
      rarity: "Rare",
      unlocked: true,
      color: "from-rose-500 to-pink-700",
      icon: "🕌",
      myth: "The white marble changes its hue from pale pink in the morning to golden yellow under moonlight."
    },
    {
      id: "charioteer",
      name: "Stone Charioteer",
      landmark: "Hampi Ruins",
      rarity: "Epic",
      unlocked: false,
      color: "from-amber-700 to-orange-800",
      icon: "🛒",
      myth: "The stone wheels of the famous Hampi chariot used to spin freely before they were protected."
    },
    {
      id: "vimana",
      name: "Vimana Seeker",
      landmark: "Great Living Chola Temples",
      rarity: "Rare",
      unlocked: false,
      color: "from-emerald-600 to-teal-800",
      icon: "👑",
      myth: "The solid 80-tonne granite capstone (Vimana) never casts a shadow at noon throughout the year."
    }
  ]);

  // Handle Search Query submit
  const handleSearchSubmit = async (e?: React.FormEvent, directQuery?: string) => {
    if (e) e.preventDefault();
    const q = directQuery || searchQuery;
    if (!q.trim()) return;

    setIsSearching(true);
    try {
      // 1. Try local featured database first
      const matched = getMonumentTimeData(q);
      setMonumentData(matched);
      setCustomImage(null);

      // Set initial selected year to nearest historical era
      const eraYears = matched.timelineEras.map(e => e.year);
      if (eraYears.length > 0) {
        setSelectedYear(eraYears[Math.floor(eraYears.length / 2)] || matched.constructionYear);
      }

      // 2. Call Gemini API endpoint in background to enrich if needed
      fetch("/api/timemachine/reconstruct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, year: selectedYear })
      }).then(res => res.json()).then(data => {
        if (data && !data.fallback && data.snapshot) {
          // Enrich snapshot if Gemini returned richer details
          setMonumentData(prev => ({
            ...prev,
            snapshot: {
              ...prev.snapshot,
              builder: data.snapshot.builder || prev.snapshot.builder,
              dynasty: data.snapshot.dynasty || prev.snapshot.dynasty,
              architecturalStyle: data.snapshot.architecturalStyle || prev.snapshot.architecturalStyle
            }
          }));
        }
      }).catch(err => console.log("Gemini Time Machine fetch note:", err));

    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle image upload with Gemini Vision identification
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      setCustomImage(base64Data);
      setIsSearching(true);

      // Call Gemini Vision endpoint
      fetch("/api/timemachine/reconstruct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Data, query: "Uploaded Heritage Image", year: selectedYear })
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.monumentName) {
            const detected = getMonumentTimeData(data.monumentName);
            setSearchQuery(data.monumentName);
            setMonumentData(detected);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setIsSearching(false));
    };
    reader.readAsDataURL(file);
  };

  // Auto-play timeline animation timer
  useEffect(() => {
    let interval: any = null;
    if (isPlayingAuto) {
      interval = setInterval(() => {
        setSelectedYear(prev => {
          const minYear = monumentData.constructionYear || 1200;
          if (prev <= minYear) {
            setIsPlayingAuto(false);
            return 2026;
          }
          return Math.max(minYear, prev - 50);
        });
      }, 1800);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlayingAuto, monumentData]);

  // Find nearest era for currently selected year
  const getNearestEra = (): TimelineEra => {
    if (!monumentData.timelineEras || monumentData.timelineEras.length === 0) {
      return {
        year: selectedYear,
        yearLabel: `${selectedYear} CE`,
        eraName: "Historical Reconstruction Era",
        todayImage: monumentData.currentImage,
        reconstructionImage: monumentData.currentImage,
        keyTransformations: ["Historical stone masonry", "Active community celebrations"],
        narrations: {
          historian: `${monumentData.name} in ${selectedYear} CE.`,
          documentary: `Visualizing ${monumentData.name} through the centuries.`,
          child: `Imagine visiting this place long ago!`,
          traveler: `Travelers step into the historical courtyard.`,
          architect: `Traditional architectural engineering.`,
          storyteller: `History unfolds across the centuries.`
        }
      };
    }

    let closest = monumentData.timelineEras[0];
    let minDiff = Math.abs(selectedYear - closest.year);

    for (const era of monumentData.timelineEras) {
      const diff = Math.abs(selectedYear - era.year);
      if (diff < minDiff) {
        minDiff = diff;
        closest = era;
      }
    }
    return closest;
  };

  const currentEra = getNearestEra();
  const currentNarration = currentEra.narrations[storyMode] || currentEra.narrations.storyteller;

  // TTS audio playback handler
  const handleToggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(currentNarration);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const isEligibleForCertificate = unlockedCount === badges.length;

  return (
    <div id="ai-time-machine-container" className="space-y-8 font-sans">
      
      {/* Module Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 text-amber-900 rounded-xl text-xl shadow-xs">🕰</span>
            <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
              AI TIME MACHINE
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-900 text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-700">
              Flagship Experience
            </span>
          </div>
          <p className="text-amber-950/80 font-medium text-xs md:text-sm mt-1">
            Travel through centuries. Experience history through AI.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-200 px-4 py-2 rounded-2xl text-center shadow-xs">
            <span className="block text-[10px] text-amber-900 font-semibold uppercase tracking-wider">Heritage Explorer XP</span>
            <span className="font-bold text-amber-950 text-sm">{score} XP</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-amber-200/80 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: "timemachine", label: "🕰 AI Time Machine", count: "4D Historical Reconstruction" },
          { id: "badges", label: "🎖 My Heritage Wallet", count: `${unlockedCount}/${badges.length}` },
          { id: "certificate", label: "📜 Official Curator Certificate", count: isEligibleForCertificate ? "Ready" : "Locked" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-semibold rounded-2xl shrink-0 transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-amber-800 via-amber-900 to-yellow-950 text-white shadow-md font-bold ring-2 ring-amber-500/30"
                : "bg-amber-50/70 hover:bg-amber-100/80 text-stone-700 border border-amber-200/60"
            }`}
          >
            {tab.label} <span className="ml-1 opacity-80 text-[10px]">({tab.count})</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* ========================================================= */}
        {/* TAB 1: 🕰 AI TIME MACHINE */}
        {/* ========================================================= */}
        {activeTab === "timemachine" && (
          <motion.div
            key="timemachine"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* --------------------------------------------------- */}
              {/* LEFT PANEL: SEARCH, UPLOAD & DETECTION CONTROLS */}
              {/* --------------------------------------------------- */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Panel Header */}
                <div className="bg-gradient-to-br from-amber-900 via-yellow-950 to-stone-900 text-white rounded-3xl p-6 border border-amber-700/60 shadow-lg space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10 text-8xl font-serif select-none pointer-events-none">
                    🏛
                  </div>
                  <div className="flex items-center gap-2 text-amber-300 font-mono text-xs font-semibold uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                    Interactive Portal
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
                      🕰 AI TIME MACHINE
                    </h3>
                    <p className="text-amber-200/90 text-xs font-medium mt-1">
                      Travel through history using Google Gemini.
                    </p>
                  </div>
                  <p className="text-stone-300 text-xs leading-relaxed border-t border-amber-800/80 pt-3">
                    Explore how monuments transformed across centuries using AI-powered historical reconstruction.
                  </p>
                </div>

                {/* Search Heritage Site Box */}
                <div className="bg-white rounded-3xl border border-amber-200/80 p-5 shadow-sm space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                      <Search className="h-3.5 w-3.5 text-amber-700" />
                      Search Heritage Site
                    </label>
                    <p className="text-[11px] text-stone-500">
                      Search any monument worldwide
                    </p>
                  </div>

                  <form onSubmit={(e) => handleSearchSubmit(e)} className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. Meenakshi Temple, Taj Mahal, Colosseum..."
                      className="flex-1 bg-amber-50/50 border border-amber-200 px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-amber-600 text-stone-900 placeholder:text-stone-400 font-medium"
                    />
                    <button
                      type="submit"
                      disabled={isSearching}
                      className="bg-amber-900 hover:bg-black text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      {isSearching ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                    </button>
                  </form>

                  {/* Preset Suggestions Chips */}
                  <div className="space-y-2 pt-1 border-t border-amber-100">
                    <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">Popular Heritage Sites</span>
                    <div className="flex flex-wrap gap-1.5">
                      {searchPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSearchQuery(preset.query);
                            handleSearchSubmit(undefined, preset.query);
                          }}
                          className={`text-[11px] px-2.5 py-1 rounded-full border transition-all font-medium cursor-pointer ${
                            monumentData.name.toLowerCase().includes(preset.name.toLowerCase())
                              ? "bg-amber-900 text-white border-amber-900 shadow-2xs font-semibold"
                              : "bg-amber-50/60 hover:bg-amber-100 text-amber-950 border-amber-200"
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upload Monument Image */}
                <div className="bg-white rounded-3xl border border-amber-200/80 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                      <Upload className="h-3.5 w-3.5 text-amber-700" />
                      Upload Monument Image
                    </label>
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                      Gemini Vision
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-500">
                    Upload any photograph to identify architectural style, construction era, and historical context.
                  </p>

                  <label className="border-2 border-dashed border-amber-300/80 hover:border-amber-600 bg-amber-50/40 hover:bg-amber-50 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center">
                    <Camera className="h-6 w-6 text-amber-700" />
                    <span className="text-xs font-semibold text-amber-950">Click or drag image to scan</span>
                    <span className="text-[10px] text-stone-400">Supports JPG, PNG, WEBP</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>

                  {customImage && (
                    <div className="relative rounded-2xl overflow-hidden border border-amber-200 mt-2">
                      <img src={customImage} alt="Uploaded Monument" className="w-full h-32 object-cover" />
                      <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                        ✓ Scanned with Gemini Vision
                      </span>
                    </div>
                  )}
                </div>

                {/* Detected Monument Information Card */}
                <div className="bg-gradient-to-br from-stone-900 to-amber-950 text-white rounded-3xl p-5 border border-amber-800/80 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-800/60 pb-3">
                    <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1">
                      <Crown className="h-3 w-3" /> Active Monument Context
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md font-mono">
                      Detected
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-white font-serif">{monumentData.name}</h4>
                    <p className="text-xs text-amber-200/90 flex items-center gap-1 mt-0.5 font-medium">
                      <MapPin className="h-3 w-3 text-amber-400 shrink-0" /> {monumentData.location}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-amber-950/80 p-2.5 rounded-xl border border-amber-800/50">
                      <span className="block text-[10px] text-amber-400 font-semibold uppercase">Construction</span>
                      <span className="font-bold text-amber-100">{monumentData.constructionYearLabel}</span>
                    </div>
                    <div className="bg-amber-950/80 p-2.5 rounded-xl border border-amber-800/50">
                      <span className="block text-[10px] text-amber-400 font-semibold uppercase">Current Year</span>
                      <span className="font-bold text-amber-100">{monumentData.currentYearLabel}</span>
                    </div>
                  </div>

                  <div className="bg-amber-900/40 border border-amber-700/50 p-3 rounded-2xl text-xs space-y-1">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">Historical Timeline Span</span>
                    <p className="text-stone-300 text-[11px] leading-relaxed">
                      Transforming through centuries from <span className="font-semibold text-amber-200">{monumentData.constructionYear} CE</span> to <span className="font-semibold text-amber-200">2026 CE</span>.
                    </p>
                  </div>
                </div>

              </div>


              {/* --------------------------------------------------- */}
              {/* RIGHT PANEL: LARGE COMPARISON, YEAR SLIDER & STORY */}
              {/* --------------------------------------------------- */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Large Immersive Comparison Container */}
                <div className="bg-white rounded-3xl border border-amber-200/90 shadow-lg p-5 md:p-6 space-y-5 relative overflow-hidden">
                  
                  {/* Top Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                          Era: {currentEra.eraName}
                        </span>
                        <span className="text-xs font-bold text-amber-900 bg-yellow-100 px-2.5 py-1 rounded-lg">
                          Year {selectedYear} CE
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-stone-900 text-lg md:text-xl mt-1">
                        Realistic AI Historical Reconstruction
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSplitPosition(prev => prev === 50 ? 100 : prev === 100 ? 0 : 50)}
                        className="text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Layers className="h-3.5 w-3.5 text-amber-700" />
                        <span>Toggle View Mode</span>
                      </button>
                    </div>
                  </div>

                  {/* Image Comparison Box */}
                  <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden border border-amber-300/80 shadow-inner bg-stone-900 select-none">
                    
                    {/* Background Today Image */}
                    <img 
                      src={customImage || currentEra.todayImage || monumentData.currentImage} 
                      alt={`${monumentData.name} - Modern View`} 
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                    
                    {/* Overlay Historical Image clipped by Split Position */}
                    <div 
                      className="absolute inset-0 overflow-hidden transition-all duration-300"
                      style={{ width: `${splitPosition}%` }}
                    >
                      <img 
                        src={customImage || currentEra.reconstructionImage || monumentData.currentImage} 
                        alt={`${monumentData.name} - Historical Reconstruction (${selectedYear} CE)`} 
                        className="w-full h-full object-cover max-w-none"
                        style={{ 
                          width: "100%", 
                          height: "100%", 
                          objectFit: "cover",
                          filter: selectedYear < 2026 ? "sepia(0.15) saturate(1.1) contrast(1.05)" : "none" 
                        }}
                      />
                      <div className="absolute top-4 left-4 bg-amber-950/90 text-amber-200 border border-amber-500/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                        <span>Reconstruction: {monumentData.name} ({selectedYear} CE)</span>
                      </div>
                    </div>

                    {/* Today Badge on Right */}
                    <div className="absolute top-4 right-4 bg-black/70 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/20 shadow-md flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Today (2026 CE)</span>
                    </div>

                    {/* Split Line Indicator */}
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-amber-400 cursor-ew-resize flex items-center justify-center shadow-lg"
                      style={{ left: `${splitPosition}%` }}
                    >
                      <div className="w-7 h-7 rounded-full bg-amber-500 border-2 border-white text-stone-900 flex items-center justify-center shadow-md font-bold text-xs">
                        ↔
                      </div>
                    </div>

                    {/* Subtitle Bar overlay at bottom */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent p-4 pt-8 text-white flex items-end justify-between gap-4">
                      <div>
                        <span className="text-[10px] text-amber-300 uppercase tracking-widest font-bold block flex items-center gap-1">
                          <span>🏛 Historical Reconstruction of {monumentData.name}</span>
                        </span>
                        <p className="text-xs md:text-sm font-semibold text-stone-100">
                          {currentEra.keyTransformations[0] || `Historical structures and architectural detail of ${monumentData.name}.`}
                        </p>
                      </div>
                      <span className="text-[10px] bg-amber-900/80 border border-amber-600/80 px-2.5 py-1 rounded-lg text-amber-200 font-mono shrink-0 flex items-center gap-1">
                        <span>✓ Verified Monument Lock</span>
                      </span>
                    </div>

                  </div>

                  {/* --------------------------------------------------- */}
                  {/* 🕰 YEAR SLIDER CONTROLS */}
                  {/* --------------------------------------------------- */}
                  <div className="bg-gradient-to-r from-amber-900/5 via-amber-50 to-stone-100 p-5 rounded-2xl border border-amber-200/80 space-y-4">
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-amber-700 animate-spin-slow" />
                        <h4 className="font-bold text-stone-900 text-sm md:text-base uppercase tracking-wider">
                          🕰 YEAR SLIDER (TRAVEL BACK IN TIME)
                        </h4>
                      </div>

                      <button
                        onClick={() => setIsPlayingAuto(!isPlayingAuto)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isPlayingAuto 
                            ? "bg-rose-700 text-white" 
                            : "bg-amber-900 hover:bg-stone-950 text-white"
                        }`}
                      >
                        {isPlayingAuto ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        <span>{isPlayingAuto ? "Pause Auto-Travel" : "Auto-Play Timeline"}</span>
                      </button>
                    </div>

                    {/* Slider Track */}
                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between items-center text-xs font-bold font-mono">
                        <span className="text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-300">
                          Construction Year: {monumentData.constructionYear} CE
                        </span>
                        <span className="text-amber-950 text-base font-serif font-extrabold underline decoration-amber-500 decoration-2">
                          SELECTED: {selectedYear} CE
                        </span>
                        <span className="text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-md border border-stone-300">
                          TODAY: 2026 CE
                        </span>
                      </div>

                      <input
                        type="range"
                        min={monumentData.constructionYear || 1200}
                        max={2026}
                        step={25}
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="w-full accent-amber-800 cursor-pointer h-2.5 bg-amber-200 rounded-lg"
                      />

                      <div className="flex justify-between text-[10px] text-stone-500 font-medium pt-0.5">
                        <span>{monumentData.constructionYear} CE</span>
                        <span>1400 CE</span>
                        <span>1600 CE</span>
                        <span>1800 CE</span>
                        <span>1900 CE</span>
                        <span>2026 CE (Today)</span>
                      </div>
                    </div>

                    {/* Key Transformations Bullet List */}
                    <div className="bg-white/90 p-3.5 rounded-xl border border-amber-200/70 text-xs space-y-2">
                      <span className="font-bold text-amber-950 uppercase tracking-wider text-[11px] block flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                        Dynamic Transformations in {selectedYear} CE:
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-stone-700">
                        {currentEra.keyTransformations.map((trans, tIdx) => (
                          <div key={tIdx} className="flex items-start gap-1.5 font-medium">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{trans}</span>
                          </div>
                        ))}
                        <div className="flex items-start gap-1.5 font-medium text-amber-900">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>Broken structures complete • Missing sculptures reappear • Paint returns</span>
                        </div>
                        <div className="flex items-start gap-1.5 font-medium text-amber-900">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>Gardens flourish • Bazaars appear • Historical clothing changes</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* --------------------------------------------------- */}
                {/* 🎭 AI STORYTELLING MODES */}
                {/* --------------------------------------------------- */}
                <div className="bg-white rounded-3xl border border-amber-200/90 shadow-md p-5 md:p-6 space-y-5">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="p-1 bg-amber-100 text-amber-900 rounded-md text-base">🎭</span>
                        <h4 className="font-bold text-stone-900 text-base md:text-lg">
                          AI STORYTELLING MODES
                        </h4>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Choose Perspective — Experience history through distinct narrative voices
                      </p>
                    </div>

                    <button
                      onClick={handleToggleSpeech}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        isSpeaking
                          ? "bg-rose-700 text-white border-rose-800 animate-pulse"
                          : "bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300"
                      }`}
                    >
                      {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-amber-700" />}
                      <span>{isSpeaking ? "Stop Narration" : "Listen Narration"}</span>
                    </button>
                  </div>

                  {/* Mode Selector Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    {storytellingModes.map((mode) => {
                      const isActive = storyMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => setStoryMode(mode.id as any)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                            isActive
                              ? "bg-gradient-to-br from-amber-900 to-yellow-950 text-white border-amber-600 shadow-md ring-2 ring-amber-500/30"
                              : "bg-stone-50/70 hover:bg-amber-50/80 text-stone-800 border-amber-200/70"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`p-1.5 rounded-lg ${isActive ? "bg-amber-800 text-white" : "bg-white text-stone-700"}`}>
                              {mode.icon}
                            </span>
                            {isActive && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
                          </div>

                          <div>
                            <span className="font-bold text-xs block leading-tight">{mode.title}</span>
                            <span className={`text-[9px] block mt-0.5 line-clamp-1 ${isActive ? "text-amber-200" : "text-stone-500"}`}>
                              {mode.tagline}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Dynamic Narration Box */}
                  <div className="bg-gradient-to-br from-amber-900 via-amber-950 to-stone-900 text-white p-5 rounded-2xl border border-amber-700/80 shadow-md space-y-3 relative">
                    <div className="flex items-center justify-between border-b border-amber-800/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-amber-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                          {storytellingModes.find(m => m.id === storyMode)?.title} Perspective ({selectedYear} CE)
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-200/80 italic font-mono">
                        Grounding: Verified Historical Records
                      </span>
                    </div>

                    <p className="text-xs md:text-sm leading-relaxed text-amber-50 font-serif italic p-1">
                      "{currentNarration}"
                    </p>
                  </div>

                </div>

                {/* --------------------------------------------------- */}
                {/* HISTORICAL SNAPSHOT */}
                {/* --------------------------------------------------- */}
                <div className="bg-white rounded-3xl border border-amber-200/90 shadow-sm p-5 md:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                    <h4 className="font-bold text-stone-900 text-base font-serif flex items-center gap-2">
                      📜 Historical Snapshot
                    </h4>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-300">
                      Archival Summary
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200/60">
                      <span className="block text-[10px] text-amber-800 font-bold uppercase">Builder / Patron</span>
                      <span className="font-bold text-stone-900 text-xs mt-0.5 block">{monumentData.snapshot.builder}</span>
                    </div>

                    <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200/60">
                      <span className="block text-[10px] text-amber-800 font-bold uppercase">Dynasty / Era</span>
                      <span className="font-bold text-stone-900 text-xs mt-0.5 block">{monumentData.snapshot.dynasty}</span>
                    </div>

                    <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200/60">
                      <span className="block text-[10px] text-amber-800 font-bold uppercase">Construction Year</span>
                      <span className="font-bold text-stone-900 text-xs mt-0.5 block">{monumentData.snapshot.constructionYear}</span>
                    </div>

                    <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200/60">
                      <span className="block text-[10px] text-amber-800 font-bold uppercase">Architectural Style</span>
                      <span className="font-bold text-stone-900 text-xs mt-0.5 block">{monumentData.snapshot.architecturalStyle}</span>
                    </div>

                    <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200/60">
                      <span className="block text-[10px] text-amber-800 font-bold uppercase">UNESCO Status</span>
                      <span className="font-bold text-stone-900 text-xs mt-0.5 block">{monumentData.snapshot.unescoStatus}</span>
                    </div>

                    <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200/60">
                      <span className="block text-[10px] text-amber-800 font-bold uppercase">Major Festivals</span>
                      <span className="font-bold text-stone-900 text-xs mt-0.5 block">{monumentData.snapshot.majorFestivals}</span>
                    </div>
                  </div>

                  {/* Historical Importance */}
                  <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs space-y-1">
                    <span className="font-bold text-stone-900 uppercase tracking-wider text-[10px] block">Historical Importance</span>
                    <p className="text-stone-700 leading-relaxed font-medium">
                      {monumentData.snapshot.historicalImportance}
                    </p>
                  </div>

                  {/* Interesting Facts */}
                  <div className="space-y-2 pt-1">
                    <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] block flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                      Interesting Historical Facts:
                    </span>
                    <div className="space-y-1.5">
                      {monumentData.snapshot.interestingFacts.map((fact, fIdx) => (
                        <div key={fIdx} className="bg-amber-50/40 p-2.5 rounded-xl border border-amber-200/50 text-xs text-stone-800 flex items-start gap-2 font-medium">
                          <span className="text-amber-700 font-bold shrink-0">💡</span>
                          <span>{fact}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* --------------------------------------------------- */}
                {/* GEMINI INTEGRATION BADGE */}
                {/* --------------------------------------------------- */}
                <div className="bg-gradient-to-r from-amber-900 via-yellow-950 to-stone-900 text-white rounded-3xl p-5 border border-amber-700/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                      <span className="font-bold text-sm text-white">Powered by Google Gemini</span>
                    </div>
                    <p className="text-amber-200/80 text-xs">
                      Combining Gemini Vision, Multimodal RAG, and AI Timeline Intelligence for living heritage.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
                    <span className="bg-amber-800/80 text-amber-100 border border-amber-600/60 px-2.5 py-1 rounded-lg">✔ Gemini Vision</span>
                    <span className="bg-amber-800/80 text-amber-100 border border-amber-600/60 px-2.5 py-1 rounded-lg">✔ Historical Reconstruction</span>
                    <span className="bg-amber-800/80 text-amber-100 border border-amber-600/60 px-2.5 py-1 rounded-lg">✔ AI Image Generation</span>
                    <span className="bg-amber-800/80 text-amber-100 border border-amber-600/60 px-2.5 py-1 rounded-lg">✔ Timeline Intelligence</span>
                    <span className="bg-amber-800/80 text-amber-100 border border-amber-600/60 px-2.5 py-1 rounded-lg">✔ Multimodal AI</span>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MY HERITAGE WALLET */}
        {/* ========================================================= */}
        {activeTab === "badges" && (
          <motion.div
            key="badges"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {badges.map((badge) => (
              <div 
                key={badge.id}
                className={`bg-white rounded-2xl border border-amber-200 p-5 space-y-4 relative overflow-hidden flex flex-col justify-between ${
                  !badge.unlocked ? "opacity-60 bg-stone-50/50" : "shadow-sm hover:shadow-md transition-shadow"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${badge.color} text-white flex items-center justify-center text-2xl shadow`}>
                    {badge.unlocked ? badge.icon : "🔒"}
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    badge.rarity === "Epic" ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"
                  }`}>
                    {badge.rarity}
                  </span>
                </div>

                <div className="space-y-1 pt-2">
                  <h4 className="font-bold text-stone-900 text-sm">{badge.name}</h4>
                  <p className="text-[10px] text-stone-500 font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-amber-700" /> {badge.landmark}
                  </p>
                </div>

                {badge.unlocked ? (
                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200/60 text-[11px] text-amber-950 leading-relaxed italic">
                    💡 "{badge.myth}"
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-stone-100 text-[11px] text-stone-400 font-mono text-center">
                    🔒 Explore this monument in AI Time Machine to unlock.
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-amber-100 pt-3 mt-1">
                  <span className="text-[10px] text-stone-400 font-semibold uppercase">STATUS</span>
                  <span className={`text-[10px] font-bold ${badge.unlocked ? "text-amber-800" : "text-stone-400"}`}>
                    {badge.unlocked ? "✓ Collected in Wallet" : "Locked"}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CURATOR CERTIFICATE */}
        {/* ========================================================= */}
        {activeTab === "certificate" && (
          <motion.div
            key="certificate"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto"
          >
            {isEligibleForCertificate ? (
              <div className="bg-amber-50/90 border-4 border-double border-amber-300 p-8 rounded-3xl shadow-lg relative overflow-hidden space-y-6 text-center">
                <div className="absolute top-0 right-0 p-4 opacity-10 font-serif text-8xl pointer-events-none select-none">
                  AI
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono tracking-widest text-amber-900 uppercase font-bold">
                    UNESCO & AI GLOBAL HERITAGE FOUNDATION
                  </div>
                  <h3 className="text-2xl font-serif text-amber-950 font-bold">Certificate of Heritage Intelligence</h3>
                </div>

                <p className="text-xs text-stone-700 italic max-w-md mx-auto leading-relaxed">
                  This certifies that the bearer has completed all AI Time Machine exploration challenges and unlocked all digital badges in their Heritage Wallet.
                </p>

                <div className="py-4 border-y border-amber-200 max-w-sm mx-auto space-y-1">
                  <div className="text-xs font-bold text-amber-900 uppercase">HERITAGE EXPLORER EXCELLENCE</div>
                  <div className="font-mono text-xs text-stone-600">Uniquely Generated Hash: <span className="font-bold text-stone-900">7A42-BB48-AE9E</span></div>
                </div>

                <div className="flex justify-between items-center px-8 text-left text-xs font-medium text-stone-600 pt-4">
                  <div>
                    <span className="block border-b border-stone-400 pb-1 font-semibold text-stone-900">Gemini AI Curator</span>
                    <span className="text-[10px] text-stone-400 mt-1 block">Chief Advisor AI</span>
                  </div>
                  <div>
                    <span className="block border-b border-stone-400 pb-1 font-semibold text-stone-900">Living Communities Trust</span>
                    <span className="text-[10px] text-stone-400 mt-1 block">Affiliate Partner</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => alert("Certificate downloaded successfully!")}
                    className="bg-amber-900 hover:bg-black text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Download Digital Copy
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-amber-200 p-8 text-center space-y-4">
                <div className="text-4xl grayscale">📜</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-stone-900 text-sm">Certificate is Currently Locked</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                    You need to collect all primary digital badges to qualify for the Chief Curator's Certificate of Heritage Intelligence.
                  </p>
                </div>

                <div className="max-w-xs mx-auto space-y-1 pt-2">
                  <div className="flex justify-between text-xs text-stone-600 font-semibold">
                    <span>Badges Collected</span>
                    <span>{unlockedCount} / {badges.length}</span>
                  </div>
                  <div className="w-full bg-amber-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-amber-800 h-full transition-all"
                      style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setBadges(prev => prev.map(b => ({ ...b, unlocked: true })));
                    setScore(prev => prev + 300);
                  }}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-semibold text-xs px-4 py-2 rounded-xl mt-2 transition-all cursor-pointer"
                >
                  Demo Assist: Unlock all badges
                </button>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
