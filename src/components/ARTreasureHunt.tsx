import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Clock, Search, BookOpen, Award, Trophy, 
  CheckCircle2, XCircle, ArrowRight, RotateCcw, Lock, 
  MapPin, Landmark, HelpCircle, ChevronRight, ShieldCheck, Star, ArrowLeft,
  Puzzle, RefreshCw, Eye, Check, Zap, Layers, Play, CheckCircle
} from "lucide-react";

import HeritageWallet from "./HeritageWallet";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface TimeTravelData {
  monumentName: string;
  historicalYear: string;
  location?: string;
  imageUrl: string;
  presentImageUrl?: string;
  historicalImageUrl?: string;
  overviewDescription: string;
  historicalFacts: string[];
  quizQuestions: QuizQuestion[];
}

type DifficultyLevel = "easy" | "medium" | "hard";

export default function ARTreasureHunt() {
  const [activeTab, setActiveTab] = useState<"puzzle" | "quiz" | "wallet">("puzzle");
  const [searchInput, setSearchInput] = useState<string>("Madurai Meenakshi Temple");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Monument Historical Data State
  const [monumentData, setMonumentData] = useState<TimeTravelData | null>(null);

  // Puzzle State
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy");
  const [gridSize, setGridSize] = useState<number>(3); // 3x3 Easy, 4x4 Medium, 5x5 Hard
  const [puzzlePieces, setPuzzlePieces] = useState<number[]>([]);
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [moves, setMoves] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isPuzzleSolved, setIsPuzzleSolved] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [badgeUnlocked, setBadgeUnlocked] = useState<boolean>(false);

  // Preset Examples
  const exampleMonuments = [
    "Madurai Meenakshi Temple",
    "Taj Mahal",
    "Hampi Virupaksha Temple",
    "Brihadeeswara Temple"
  ];

  // Helper to generate a solvable shuffled board
  const createShuffledBoard = (size: number) => {
    const total = size * size;
    const arr = Array.from({ length: total }, (_, i) => i);
    
    // Pairwise swaps to ensure random shuffling
    for (let i = 0; i < total * 15; i++) {
      const a = Math.floor(Math.random() * total);
      const b = Math.floor(Math.random() * total);
      if (a !== b) {
        const temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
      }
    }
    
    // Ensure board is not already solved
    if (arr.every((val, idx) => val === idx)) {
      const temp = arr[0];
      arr[0] = arr[1];
      arr[1] = temp;
    }
    return arr;
  };

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !isPuzzleSolved) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isPuzzleSolved]);

  // Initial Load: Generate Default Monument Data
  useEffect(() => {
    handleGeneratePuzzle("Madurai Meenakshi Temple");
  }, []);

  // Fetch Monument Data & Reset Puzzle
  const handleGeneratePuzzle = async (targetQuery?: string) => {
    const query = (targetQuery || searchInput).trim();
    if (!query) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/time-travel/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: query })
      });

      if (!response.ok) {
        throw new Error("Failed to load monument data. Please try again.");
      }

      const data: TimeTravelData = await response.json();
      setMonumentData(data);
      
      // Initialize Puzzle Board
      resetPuzzleBoard(gridSize, data);

      // Reset Quiz
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setIsQuizSubmitted(false);
      setBadgeUnlocked(false);
    } catch (err: any) {
      console.error("Puzzle generation error:", err);
      setErrorMsg("Could not load monument puzzle. Please check your network and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Puzzle Board with specific size
  const resetPuzzleBoard = (size: number, data?: TimeTravelData) => {
    const shuffled = createShuffledBoard(size);
    setGridSize(size);
    setPuzzlePieces(shuffled);
    setSelectedTileIndex(null);
    setDraggedIndex(null);
    setMoves(0);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setIsPuzzleSolved(false);
    setShowCelebration(false);
  };

  // Handle Difficulty Change
  const handleDifficultyChange = (newDiff: DifficultyLevel) => {
    let size = 3;
    if (newDiff === "medium") size = 4;
    if (newDiff === "hard") size = 5;

    setDifficulty(newDiff);
    if (monumentData) {
      resetPuzzleBoard(size, monumentData);
    }
  };

  // Swap Two Pieces
  const swapPieces = (idxA: number, idxB: number) => {
    if (isPuzzleSolved) return;

    setPuzzlePieces(prev => {
      const next = [...prev];
      const temp = next[idxA];
      next[idxA] = next[idxB];
      next[idxB] = temp;

      // Check if solved
      const solved = next.every((val, i) => val === i);
      if (solved) {
        setIsPuzzleSolved(true);
        setIsTimerRunning(false);
        setShowCelebration(true);
      }
      return next;
    });

    setMoves(m => m + 1);
  };

  // Click Tile Handler
  const handleTileClick = (index: number) => {
    if (isPuzzleSolved) return;

    if (selectedTileIndex === null) {
      setSelectedTileIndex(index);
    } else if (selectedTileIndex === index) {
      setSelectedTileIndex(null);
    } else {
      swapPieces(selectedTileIndex, index);
      setSelectedTileIndex(null);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    swapPieces(draggedIndex, targetIndex);
    setDraggedIndex(null);
  };

  // Auto-Solve Shortcut (for user convenience / test)
  const handleAutoSolve = () => {
    if (!monumentData || isPuzzleSolved) return;
    const total = gridSize * gridSize;
    const solved = Array.from({ length: total }, (_, i) => i);
    setPuzzlePieces(solved);
    setIsPuzzleSolved(true);
    setIsTimerRunning(false);
    setShowCelebration(true);
  };

  // Format Timer MM:SS
  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate Progress
  const correctCount = puzzlePieces.filter((pieceVal, idx) => pieceVal === idx).length;
  const totalTiles = gridSize * gridSize;
  const progressPercentage = Math.round((correctCount / totalTiles) * 100);

  // Image Fallback SVG
  const getFallbackSvg = (title: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="%231e1b4b"/>
      <path d="M200 450 L200 250 L300 180 L400 250 L400 450 Z M450 450 L450 180 L550 120 L650 180 L650 450 Z" fill="none" stroke="%23fbbf24" stroke-width="8" opacity="0.7"/>
      <text x="400" y="300" font-family="sans-serif" font-size="32" font-weight="bold" fill="%23ffffff" text-anchor="middle">${encodeURIComponent(title)}</text>
      <text x="400" y="350" font-family="sans-serif" font-size="18" fill="%23a5f3fc" text-anchor="middle">HERITAGE MONUMENT PUZZLE</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${svg}`;
  };

  // Quiz Handlers
  const handleSelectOption = (optionIndex: number) => {
    if (isQuizSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleSubmitQuiz = () => {
    setIsQuizSubmitted(true);
    
    // Check score
    if (monumentData?.quizQuestions) {
      let count = 0;
      monumentData.quizQuestions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correctIndex) {
          count += 1;
        }
      });

      // Passing score: 80% or above (4 or 5 correct out of 5)
      if (count >= 4) {
        setBadgeUnlocked(true);
        unlockBadgeInStorage(monumentData.monumentName);
      } else {
        setBadgeUnlocked(false);
      }
    }
  };

  const unlockBadgeInStorage = (monumentName: string) => {
    try {
      const stored = localStorage.getItem("heritage_wallet_badges");
      let badges = stored ? JSON.parse(stored) : [];
      
      // Unlock Knowledge Badge "History Scholar"
      let found = false;
      badges = badges.map((b: any) => {
        if (b.id === "k2" || b.id === "k1") {
          found = true;
          return {
            ...b,
            unlocked: true,
            earnedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            remainingText: "Completed!"
          };
        }
        return b;
      });

      if (!found) {
        badges.push({
          id: `m_${Date.now()}`,
          name: `${monumentName} Scholar`,
          category: "Knowledge",
          tier: "Rare",
          iconName: "BookOpen",
          description: `Mastered the heritage puzzle and scored 80%+ on ${monumentName}.`,
          unlocked: true,
          earnedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          currentProgress: 1,
          totalRequired: 1,
          remainingText: "Completed!",
          xp: 500
        });
      }

      localStorage.setItem("heritage_wallet_badges", JSON.stringify(badges));
    } catch (e) {
      console.error("Failed to unlock badge in storage:", e);
    }
  };

  // Quiz Score Stats
  const calculateScore = () => {
    if (!monumentData?.quizQuestions) return { correctCount: 0, percentage: 0 };
    let count = 0;
    monumentData.quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        count += 1;
      }
    });
    const percentage = Math.round((count / monumentData.quizQuestions.length) * 100);
    return { correctCount: count, percentage };
  };

  const getRankTitle = (correctCount: number) => {
    if (correctCount >= 5) return { title: "History Master", color: "text-amber-800 bg-amber-100 border-amber-300" };
    if (correctCount >= 3) return { title: "Good Explorer", color: "text-emerald-800 bg-emerald-100 border-emerald-300" };
    return { title: "Needs Improvement", color: "text-amber-800 bg-amber-100 border-amber-300" };
  };

  const monumentImage = monumentData?.presentImageUrl || monumentData?.imageUrl || getFallbackSvg(monumentData?.monumentName || "Monument");

  // Overview Paragraphs Split
  const overviewParagraphs = monumentData?.overviewDescription
    ? monumentData.overviewDescription.split(/\n\n+/).filter(p => p.trim().length > 0)
    : [];

  return (
    <div className="space-y-6">
      {/* Module Navigation Sub-Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Puzzle className="h-6 w-6 text-indigo-600" />
            Heritage Quest & Puzzle
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Rebuild history through interactive monument puzzles, uncover rich facts, and test your knowledge.
          </p>
        </div>

        {/* 3 Sub-Tabs */}
        <div className="flex items-center gap-2 bg-gray-100/80 p-1 rounded-2xl border border-gray-200 self-start md:self-auto flex-wrap">
          <button
            onClick={() => setActiveTab("puzzle")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "puzzle"
                ? "bg-white text-indigo-900 shadow-sm border border-gray-200/80"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Puzzle className="h-4 w-4 text-indigo-600" />
            <span>Heritage Puzzle</span>
          </button>

          <button
            onClick={() => setActiveTab("quiz")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "quiz"
                ? "bg-white text-indigo-900 shadow-sm border border-gray-200/80"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BookOpen className="h-4 w-4 text-emerald-600" />
            <span>Learn & Quiz</span>
            {monumentData && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("wallet")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "wallet"
                ? "bg-amber-500 text-stone-950 shadow-sm border border-amber-400 font-extrabold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Trophy className="h-4 w-4 text-amber-600" />
            <span>Heritage Wallet</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: HERITAGE PUZZLE */}
      {/* ========================================================================= */}
      {activeTab === "puzzle" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-800 shadow-sm relative overflow-hidden">
            <div className="relative z-10 space-y-1">
              <h3 className="text-3xl font-black tracking-tight text-amber-300 flex items-center gap-2">
                🏛 Heritage Puzzle
              </h3>
              <p className="text-sm font-medium text-indigo-200">
                "Rebuild history, discover its story."
              </p>
            </div>
            <Puzzle className="absolute right-6 -bottom-4 h-32 w-32 text-indigo-800/30 pointer-events-none" />
          </div>

          {/* Search Box Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Enter a monument or heritage site
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGeneratePuzzle()}
                    placeholder="Enter a monument or heritage site..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                  />
                </div>

                <button
                  onClick={() => handleGeneratePuzzle()}
                  disabled={isLoading || !searchInput.trim()}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating Puzzle...</span>
                    </>
                  ) : (
                    <>
                      <Puzzle className="h-4 w-4" />
                      <span>Generate Puzzle</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Examples Pill List */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Examples:
              </span>
              {exampleMonuments.map((monument) => (
                <button
                  key={monument}
                  onClick={() => {
                    setSearchInput(monument);
                    handleGeneratePuzzle(monument);
                  }}
                  className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 text-gray-700 border border-gray-200 font-medium transition-all cursor-pointer"
                >
                  • {monument}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* PUZZLE GAME CANVAS */}
          {monumentData && !isLoading && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                
                {/* Puzzle Header Bar */}
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-indigo-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full border border-indigo-200 inline-block mb-1">
                      Monument Puzzle Challenge
                    </span>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                      {monumentData.monumentName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {monumentData.location || "World Heritage Site"} • Era {monumentData.historicalYear}
                    </p>
                  </div>

                  {/* Difficulty Selection Buttons */}
                  <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-500 uppercase px-2">Difficulty:</span>
                    <button
                      onClick={() => handleDifficultyChange("easy")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                        difficulty === "easy"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Easy (3×3)
                    </button>
                    <button
                      onClick={() => handleDifficultyChange("medium")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                        difficulty === "medium"
                          ? "bg-amber-600 text-white shadow-sm"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Medium (4×4)
                    </button>
                    <button
                      onClick={() => handleDifficultyChange("hard")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                        difficulty === "hard"
                          ? "bg-rose-600 text-white shadow-sm"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Hard (5×5)
                    </button>
                  </div>
                </div>

                {/* Puzzle Stats Display Bar */}
                <div className="px-6 py-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
                  <div className="flex items-center gap-6 flex-wrap text-xs font-bold">
                    {/* Progress Stat */}
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span className="text-slate-400">Progress:</span>
                      <span className="text-emerald-300 font-extrabold">{progressPercentage}% ({correctCount}/{totalTiles})</span>
                    </div>

                    {/* Timer Stat */}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-400" />
                      <span className="text-slate-400">Timer:</span>
                      <span className="text-amber-300 font-mono font-bold text-sm">{formatTimer(timerSeconds)}</span>
                    </div>

                    {/* Moves Stat */}
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-sky-400" />
                      <span className="text-slate-400">Moves:</span>
                      <span className="text-sky-300 font-extrabold">{moves}</span>
                    </div>

                    {/* Difficulty Badge */}
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-800 text-[11px] font-extrabold text-indigo-300 border border-slate-700">
                      <span>{difficulty.toUpperCase()} ({gridSize}×{gridSize})</span>
                    </div>
                  </div>

                  {/* Puzzle Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => resetPuzzleBoard(gridSize)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Shuffle</span>
                    </button>

                    {!isPuzzleSolved && (
                      <button
                        onClick={handleAutoSolve}
                        className="px-3 py-1.5 rounded-lg bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-indigo-700 cursor-pointer"
                      >
                        <Zap className="h-3.5 w-3.5 text-amber-400" />
                        <span>Auto Solve</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* PUZZLE GRID CANVAS AREA */}
                <div className="p-6 bg-slate-950 flex flex-col items-center justify-center min-h-[380px]">
                  {/* Solved Celebration Banner */}
                  {isPuzzleSolved && showCelebration && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      className="mb-6 w-full max-w-xl p-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl shadow-xl text-center space-y-1.5 border border-emerald-400"
                    >
                      <div className="flex items-center justify-center gap-2 text-2xl font-black">
                        <Sparkles className="h-6 w-6 text-amber-300 animate-spin" />
                        <span>🎉 Puzzle Completed!</span>
                      </div>
                      <p className="text-sm font-bold text-emerald-100">
                        Excellent work! You successfully reconstructed {monumentData.monumentName}.
                      </p>
                      <div className="text-xs font-mono text-amber-200 pt-1">
                        Completed in {formatTimer(timerSeconds)} with {moves} moves!
                      </div>
                    </motion.div>
                  )}

                  {/* Puzzle Grid or Full Completed Image */}
                  {isPuzzleSolved ? (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative p-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-2xl shadow-2xl overflow-hidden max-w-full"
                      style={{
                        width: gridSize === 3 ? "420px" : gridSize === 4 ? "480px" : "520px",
                        maxWidth: "100%",
                        aspectRatio: "1 / 1"
                      }}
                    >
                      <div className="relative w-full h-full rounded-xl overflow-hidden group">
                        <img
                          src={monumentImage}
                          alt={monumentData.monumentName}
                          className="w-full h-full object-cover rounded-xl transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40 w-fit mb-1">
                            ✓ Complete Monument Image Reconstructed
                          </span>
                          <h4 className="text-lg font-black text-amber-300 drop-shadow">
                            {monumentData.monumentName}
                          </h4>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div 
                      className="grid gap-1.5 p-2.5 bg-slate-900 rounded-2xl border-2 border-slate-800 shadow-2xl max-w-full overflow-hidden"
                      style={{
                        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                        width: gridSize === 3 ? "420px" : gridSize === 4 ? "480px" : "520px",
                        maxWidth: "100%",
                        aspectRatio: "1 / 1"
                      }}
                    >
                      {puzzlePieces.map((pieceVal, slotIndex) => {
                        const isPieceCorrect = pieceVal === slotIndex;
                        const isSelected = selectedTileIndex === slotIndex;
                        
                        // Calculate original piece row & col for background offset
                        const origRow = Math.floor(pieceVal / gridSize);
                        const origCol = pieceVal % gridSize;
                        
                        const bgPosX = (origCol / (gridSize - 1)) * 100;
                        const bgPosY = (origRow / (gridSize - 1)) * 100;

                        return (
                          <div
                            key={`slot_${slotIndex}`}
                            draggable={!isPuzzleSolved}
                            onDragStart={(e) => handleDragStart(e, slotIndex)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, slotIndex)}
                            onClick={() => handleTileClick(slotIndex)}
                            className={`relative rounded-lg overflow-hidden cursor-pointer select-none transition-all duration-200 group ${
                              isSelected 
                                ? "ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 scale-95 z-20 shadow-xl" 
                                : isPieceCorrect
                                ? "border border-emerald-500/50 hover:border-emerald-400"
                                : "border border-slate-700 hover:border-amber-400/60"
                            }`}
                            style={{
                              backgroundImage: `url(${monumentImage})`,
                              backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                              backgroundPosition: `${bgPosX}% ${bgPosY}%`
                            }}
                          >
                            {/* Correct piece indicator */}
                            {isPieceCorrect && (
                              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500/80 text-white flex items-center justify-center text-[9px] shadow-sm">
                                ✓
                              </div>
                            )}

                            {/* Selected Overlay */}
                            {isSelected && (
                              <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                                <span className="text-xs font-black text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded shadow">
                                  Selected
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 text-center mt-4 italic">
                    {isPuzzleSolved 
                      ? "✨ History reconstructed! Scroll down to explore the historical overview and facts."
                      : "Tip: Drag and drop or click any two tiles to swap their positions."}
                  </p>
                </div>
              </div>

              {/* REVEALED HISTORICAL CONTENT AFTER PUZZLE SOLVED */}
              <AnimatePresence>
                {isPuzzleSolved && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    {/* History Overview Card */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                        <BookOpen className="h-5 w-5 text-indigo-600" />
                        <h4 className="text-lg font-bold text-gray-900">History Overview</h4>
                      </div>

                      <div className="space-y-4 text-sm text-gray-700 leading-relaxed font-normal">
                        {overviewParagraphs.length > 0 ? (
                          overviewParagraphs.map((para, idx) => (
                            <p key={idx} className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                              {para}
                            </p>
                          ))
                        ) : (
                          <p className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                            {monumentData.overviewDescription}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Historical Facts Card */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-2">
                          <Landmark className="h-5 w-5 text-amber-600" />
                          <h4 className="text-lg font-bold text-gray-900">Historical Facts</h4>
                        </div>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          {monumentData.historicalFacts.length} Verified Facts
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {monumentData.historicalFacts.map((fact, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-gradient-to-r from-amber-50/40 to-orange-50/30 border border-amber-200/80 flex items-start gap-3"
                          >
                            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </div>
                            <p className="text-xs font-medium text-gray-800 leading-relaxed">
                              {fact}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CONTINUE TO QUIZ BUTTON */}
                    <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-6 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-indigo-800">
                      <div className="space-y-1 text-center sm:text-left">
                        <h4 className="text-lg font-extrabold text-amber-300">Ready to Test Your Knowledge?</h4>
                        <p className="text-xs text-indigo-200">
                          Take the 5-question Heritage Quiz based on this monument to unlock a new Heritage Badge.
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveTab("quiz")}
                        className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
                      >
                        <span>Continue to Quiz</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LEARN & QUIZ */}
      {/* ========================================================================= */}
      {activeTab === "quiz" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {!monumentData ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-4">
              <HelpCircle className="h-12 w-12 text-gray-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900 text-lg">No Active Monument Quiz</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Please solve or select a monument puzzle in the Heritage Puzzle tab first to generate your custom quiz.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("puzzle")}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-extrabold shadow-sm hover:bg-indigo-700 transition-all cursor-pointer"
              >
                Go to Heritage Puzzle
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Quiz Header Banner */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                    Monument Heritage Quiz
                  </span>
                  <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                    {monumentData.monumentName} Quiz
                  </h3>
                  <p className="text-xs text-gray-500">
                    5 questions based on the History Overview and Historical Facts.
                  </p>
                </div>

                <div className="text-xs font-bold text-gray-700 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 self-start sm:self-auto">
                  Question {currentQuestionIndex + 1} of {monumentData.quizQuestions.length}
                </div>
              </div>

              {/* QUIZ SUBMITTED RESULTS VIEW */}
              {isQuizSubmitted ? (
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6 text-center">
                  {(() => {
                    const score = calculateScore();
                    const rank = getRankTitle(score.correctCount);
                    const passed = score.correctCount >= 4;

                    return (
                      <div className="space-y-6 max-w-xl mx-auto">
                        <div className="space-y-2">
                          <div className="inline-block p-4 bg-indigo-50 rounded-full text-indigo-600 mb-2">
                            <Trophy className="h-10 w-10 text-amber-500" />
                          </div>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${rank.color}`}>
                            {rank.title}
                          </span>
                          <h3 className="text-3xl font-black text-gray-900">
                            You scored {score.correctCount} / {monumentData.quizQuestions.length}
                          </h3>
                          <p className="text-sm font-bold text-gray-600">
                            Score: {score.percentage}%
                          </p>
                        </div>

                        {/* BADGE UNLOCK ANNOUNCEMENT */}
                        {passed ? (
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-6 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 rounded-2xl shadow-xl space-y-2 border border-amber-300"
                          >
                            <div className="flex items-center justify-center gap-2 text-xl font-black">
                              <Sparkles className="h-6 w-6 text-slate-950" />
                              <span>🎉 Congratulations!</span>
                            </div>
                            <p className="text-sm font-extrabold text-slate-900">
                              You unlocked a new Heritage Badge.
                            </p>
                            <p className="text-xs font-medium text-slate-800">
                              Your historical mastery has been recorded in your Heritage Wallet.
                            </p>
                          </motion.div>
                        ) : (
                          <div className="p-5 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl space-y-1 text-xs font-semibold">
                            <p className="text-sm font-extrabold text-amber-950">Keep exploring and try again to unlock this badge.</p>
                            <p className="text-amber-800">You need 80% or higher (at least 4/5 correct) to earn the Heritage Badge.</p>
                          </div>
                        )}

                        {/* QUESTION BY QUESTION BREAKDOWN */}
                        <div className="space-y-3 text-left pt-4 border-t border-gray-100">
                          <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                            Answer Breakdown
                          </h4>
                          {monumentData.quizQuestions.map((q, idx) => {
                            const userAns = userAnswers[idx];
                            const isCorrect = userAns === q.correctIndex;
                            return (
                              <div key={q.id} className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                                isCorrect ? "bg-emerald-50/60 border-emerald-200 text-emerald-950" : "bg-rose-50/60 border-rose-200 text-rose-950"
                              }`}>
                                <div className="flex items-center justify-between font-bold">
                                  <span>Q{idx + 1}. {q.question}</span>
                                  <span>{isCorrect ? "✓ Correct" : "✗ Incorrect"}</span>
                                </div>
                                <p className="text-gray-600 font-medium">
                                  Your answer: {q.options[userAns] || "Not answered"}
                                </p>
                                {!isCorrect && (
                                  <p className="text-emerald-700 font-semibold">
                                    Correct answer: {q.options[q.correctIndex]}
                                  </p>
                                )}
                                {q.explanation && (
                                  <p className="text-[11px] text-gray-500 italic pt-1">
                                    💡 {q.explanation}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex items-center justify-center gap-3 pt-2">
                          <button
                            onClick={() => {
                              setIsQuizSubmitted(false);
                              setUserAnswers({});
                              setCurrentQuestionIndex(0);
                            }}
                            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <RotateCcw className="h-4 w-4" />
                            <span>Retake Quiz</span>
                          </button>

                          <button
                            onClick={() => setActiveTab("puzzle")}
                            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                          >
                            <Puzzle className="h-4 w-4" />
                            <span>Solve Another Puzzle</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* SINGLE QUESTION ACTIVE STEPPER VIEW */
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                  {(() => {
                    const currentQ = monumentData.quizQuestions[currentQuestionIndex];
                    if (!currentQ) return null;

                    return (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                            Question {currentQuestionIndex + 1} of {monumentData.quizQuestions.length}
                          </span>
                          <h4 className="text-lg font-black text-gray-900 leading-snug">
                            {currentQ.question}
                          </h4>
                        </div>

                        {/* Options List */}
                        <div className="space-y-3">
                          {currentQ.options.map((optionText, optIdx) => {
                            const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectOption(optIdx)}
                                className={`w-full p-4 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                  isSelected
                                    ? "bg-indigo-50 border-indigo-600 text-indigo-950 ring-2 ring-indigo-600/20 shadow-sm"
                                    : "bg-white border-gray-200 hover:border-gray-300 text-gray-800 hover:bg-gray-50/50"
                                }`}
                              >
                                <span className="flex items-center gap-3">
                                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                                    isSelected ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"
                                  }`}>
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span>{optionText}</span>
                                </span>

                                {isSelected && <Check className="h-4 w-4 text-indigo-600" />}
                              </button>
                            );
                          })}
                        </div>

                        {/* Navigation Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <button
                            onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
                            disabled={currentQuestionIndex === 0}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40 transition-all cursor-pointer"
                          >
                            Previous
                          </button>

                          {currentQuestionIndex < monumentData.quizQuestions.length - 1 ? (
                            <button
                              onClick={() => setCurrentQuestionIndex(i => i + 1)}
                              disabled={userAnswers[currentQuestionIndex] === undefined}
                              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold disabled:opacity-50 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                            >
                              <span>Next Question</span>
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={handleSubmitQuiz}
                              disabled={Object.keys(userAnswers).length < monumentData.quizQuestions.length}
                              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black disabled:opacity-50 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Submit Quiz</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HERITAGE WALLET */}
      {/* ========================================================================= */}
      {activeTab === "wallet" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <HeritageWallet />
        </motion.div>
      )}
    </div>
  );
}
