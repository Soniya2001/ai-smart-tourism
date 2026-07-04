import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Award, QrCode, Sparkles, Compass, MapPin, CheckCircle, 
  HelpCircle, RefreshCw, Smartphone, Trophy, Gift, ArrowRight 
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"badges" | "scanchallenge" | "certificate">("badges");
  const [scannedCode, setScannedCode] = useState<string>("");
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanLoading, setScanLoading] = useState<boolean>(false);
  const [score, setScore] = useState<number>(100); // starts with base score

  // Interactive badges state
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: "gopuram",
      name: "Gopuram Master",
      landmark: "Madurai Meenakshi Temple",
      rarity: "Epic",
      unlocked: true,
      color: "from-purple-500 to-indigo-600",
      icon: "🛕",
      myth: "Legend says the Thousand Pillar Hall was built in a single night from divine stone carvings."
    },
    {
      id: "marble",
      name: "Marble Sentinel",
      landmark: "Taj Mahal",
      rarity: "Rare",
      unlocked: false,
      color: "from-rose-400 to-pink-600",
      icon: "🕌",
      myth: "The white marble changes its hue from pale pink in the morning to golden yellow under moonlight."
    },
    {
      id: "charioteer",
      name: "Stone Charioteer",
      landmark: "Hampi Ruins",
      rarity: "Epic",
      unlocked: true,
      color: "from-amber-500 to-orange-600",
      icon: "🛒",
      myth: "The stone wheels of the famous Hampi chariot used to spin freely before they were protected."
    },
    {
      id: "vimana",
      name: "Vimana Seeker",
      landmark: "Great Living Chola Temples",
      rarity: "Rare",
      unlocked: false,
      color: "from-emerald-500 to-teal-600",
      icon: "👑",
      myth: "The solid 80-tonne granite capstone (Vimana) never casts a shadow at noon throughout the year."
    }
  ]);

  const [simulatedScans] = useState([
    { code: "SCAN_MEENAKSHI_99", name: "Thousand Pillar Hall Anchor", badgeId: "gopuram", fact: "Unlocked! You discovered the hidden chamber where ancient celestial musicians used to perform." },
    { code: "SCAN_TAJ_01", name: "Mughal Mirror Garden", badgeId: "marble", fact: "Unlocked! Shah Jahan designed the garden reflections to look like a heavenly paradise." },
    { code: "SCAN_HAMPI_Chariot", name: "Musical Pillar Anchor", badgeId: "charioteer", fact: "Unlocked! Tapping these stone pillars produces seven musical notes (Saptaswara)." },
    { code: "SCAN_CHOLA_05", name: "Thanjavur Vimana Shadow Arch", badgeId: "vimana", fact: "Unlocked! The shadow falls inward, a miracle of Medieval Dravidian engineering." }
  ]);

  const handleSimulatedScan = (code: string) => {
    setScanLoading(true);
    setScanResult(null);
    setTimeout(() => {
      const match = simulatedScans.find(s => s.code === code);
      if (match) {
        setScanResult(match.fact);
        setScore(prev => prev + 50);

        // Unlock badge
        setBadges(prev => prev.map(b => {
          if (b.id === match.badgeId) {
            return { ...b, unlocked: true };
          }
          return b;
        }));
      } else {
        setScanResult("Invalid QR Code or AR Anchor. Try scanning one of the official site landmarks!");
      }
      setScanLoading(false);
    }, 1200);
  };

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const isEligibleForCertificate = unlockedCount === badges.length;

  return (
    <div id="treasure-hunt-section" className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            <Trophy className="h-6 w-6 text-indigo-600" />
            AR Treasure Hunt & Gamification
          </h2>
          <p className="text-gray-500 mt-1">
            Complete scavenger challenges at heritage sites, scan AR landmarks, collect mythical badges, and earn certified ranks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl text-center">
            <span className="block text-[10px] text-indigo-400 font-semibold uppercase">Total Score</span>
            <span className="font-bold text-indigo-950 text-base">{score} XP</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: "badges", label: "🎖 My Heritage Wallet", count: `${unlockedCount}/${badges.length}` },
          { id: "scanchallenge", label: "📷 Simulated AR Anchors", count: "Fictional Scan" },
          { id: "certificate", label: "📜 Official Curator Certificate", count: isEligibleForCertificate ? "Ready" : "Locked" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl shrink-0 transition-all ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label} <span className="ml-1 opacity-75 text-[10px]">({tab.count})</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* WALLET / BADGES TAB */}
        {activeTab === "badges" && (
          <motion.div
            key="badges"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {badges.map((badge) => (
              <div 
                key={badge.id}
                className={`bg-white rounded-2xl border border-gray-200 p-5 space-y-4 relative overflow-hidden flex flex-col justify-between ${
                  !badge.unlocked ? "opacity-60 bg-gray-50/50" : "shadow-sm hover:shadow-md transition-shadow"
                }`}
              >
                {/* Visual Header */}
                <div className="flex justify-between items-start">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${badge.color} text-white flex items-center justify-center text-2xl shadow`}>
                    {badge.unlocked ? badge.icon : "🔒"}
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    badge.rarity === "Epic" ? "bg-purple-100 text-purple-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {badge.rarity}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-1 pt-2">
                  <h4 className="font-bold text-gray-900 text-sm">{badge.name}</h4>
                  <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {badge.landmark}
                  </p>
                </div>

                {badge.unlocked ? (
                  <div className="bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/50 text-[11px] text-indigo-900 leading-relaxed italic">
                    💡 "{badge.myth}"
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-gray-100 text-[11px] text-gray-400 font-mono text-center">
                    🔒 Find and scan the QR code at the monument entrance to unlock this.
                  </div>
                )}

                {/* Unlock status */}
                <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-1">
                  <span className="text-[10px] text-gray-400 font-semibold">STATUS</span>
                  <span className={`text-[10px] font-bold ${badge.unlocked ? "text-green-600" : "text-gray-400"}`}>
                    {badge.unlocked ? "✓ Collected" : "Locked"}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* SIMULATED AR ANCHOR SCANNER */}
        {activeTab === "scanchallenge" && (
          <motion.div
            key="scanchallenge"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-3">
                <Smartphone className="h-4.5 w-4.5 text-indigo-600" />
                Simulate AR Landmark Scan
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                In a real tourist environment, pointing the smartphone camera or scanning QR plaques on-site triggers instant recognition. Select a simulated location anchor below to test.
              </p>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Click to simulate physical QR Scan
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {simulatedScans.map((scan) => {
                    const linkedBadge = badges.find(b => b.id === scan.badgeId);
                    return (
                      <button
                        key={scan.code}
                        onClick={() => {
                          setScannedCode(scan.code);
                          handleSimulatedScan(scan.code);
                        }}
                        className={`p-3.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                          scannedCode === scan.code
                            ? "border-indigo-500 bg-indigo-50/50"
                            : "border-gray-100 hover:border-gray-200 bg-gray-50/30"
                        }`}
                      >
                        <div>
                          <div className="font-bold text-gray-800">{scan.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">{scan.code}</div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          linkedBadge?.unlocked ? "bg-green-100 text-green-800" : "bg-indigo-100 text-indigo-800"
                        }`}>
                          {linkedBadge?.unlocked ? "Collected" : "Tap to Unlock"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[300px] flex flex-col justify-center items-center text-center space-y-4">
              <AnimatePresence mode="wait">
                {scanLoading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin mx-auto" />
                    <p className="text-xs font-semibold text-gray-500">Decrypting Spatial AR Anchor scriptures...</p>
                  </motion.div>
                )}

                {!scanLoading && !scanResult && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2 text-gray-400"
                  >
                    <QrCode className="h-14 w-14 mx-auto text-gray-300" />
                    <div>
                      <h4 className="font-semibold text-gray-600 text-sm">Waiting for QR Trigger</h4>
                      <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">
                        Select one of the physical anchors on the left to simulate unlocking the corresponding badge!
                      </p>
                    </div>
                  </motion.div>
                )}

                {!scanLoading && scanResult && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4 p-5 bg-indigo-50/40 border border-indigo-100 rounded-2xl max-w-md"
                  >
                    <div className="text-4xl">🎁</div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-indigo-950 text-sm">Landmark Fact Decoded!</h4>
                      <p className="text-xs text-gray-600 leading-relaxed mt-2 bg-white p-3 rounded-xl border border-indigo-50 text-left">
                        {scanResult}
                      </p>
                    </div>
                    <div className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full inline-block">
                      +50 Experience Points Gained!
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* CERTIFICATE TAB */}
        {activeTab === "certificate" && (
          <motion.div
            key="certificate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            {isEligibleForCertificate ? (
              <div className="bg-amber-50/50 border-4 border-double border-amber-300 p-8 rounded-2xl shadow-lg relative overflow-hidden space-y-6 text-center">
                <div className="absolute top-0 right-0 p-4 opacity-10 font-serif text-8xl pointer-events-none select-none">
                  AI
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono tracking-widest text-amber-800 uppercase">
                    UNESCO & AI GLOBAL HERITAGE FOUNDATION
                  </div>
                  <h3 className="text-2xl font-serif text-amber-950 font-bold">Certificate of Heritage Intelligence</h3>
                </div>

                <p className="text-xs text-gray-500 italic max-w-md mx-auto leading-relaxed">
                  This certifies that the bearer has completed all multimodal exploration challenges, answered interactive quizzes, and unlocked all 4 primary AI heritage badges.
                </p>

                <div className="py-4 border-y border-amber-200/60 max-w-sm mx-auto space-y-1">
                  <div className="text-xs font-bold text-amber-900 uppercase">HERITAGE EXPLORER EXCELLENCE</div>
                  <div className="font-mono text-xs text-gray-500">Uniquely Generated Hash: <span className="font-bold text-gray-800">7A42-BB48-AE9E</span></div>
                </div>

                <div className="flex justify-between items-center px-8 text-left text-xs font-medium text-gray-500 pt-4">
                  <div>
                    <span className="block border-b border-gray-400 pb-1 font-semibold text-gray-800">Gemini AI Curator</span>
                    <span className="text-[10px] text-gray-400 mt-1 block">Chief Advisor AI</span>
                  </div>
                  <div>
                    <span className="block border-b border-gray-400 pb-1 font-semibold text-gray-800">Living Communities Trust</span>
                    <span className="text-[10px] text-gray-400 mt-1 block">Affiliate Partner</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => alert("Certificate downloaded successfully!")}
                    className="bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs px-6 py-2.5 rounded-lg shadow-md"
                  >
                    Download Digital Copy
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-4">
                <div className="text-4xl grayscale">📜</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">Certificate is Currently Locked</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                    You need to collect all 4 primary digital badges to qualify for the Chief Curator's Certificate of Heritage Intelligence.
                  </p>
                </div>

                {/* Progress */}
                <div className="max-w-xs mx-auto space-y-1 pt-2">
                  <div className="flex justify-between text-xs text-gray-500 font-semibold">
                    <span>Badges Collected</span>
                    <span>{unlockedCount} / {badges.length}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full transition-all"
                      style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    // Help user unlock everything for test demo convenience
                    setBadges(prev => prev.map(b => ({ ...b, unlocked: true })));
                    setScore(prev => prev + 200);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-indigo-700 font-semibold text-xs px-4 py-2 rounded-lg mt-2 transition-all"
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
