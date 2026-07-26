import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, Landmark, Trophy, Sparkles, MapPin, 
  BookOpen, HelpCircle, Heart, Star, Users, ArrowRight, Github, Clock, 
  ShieldCheck, HeartHandshake, Lock, LogOut, UserCheck, Puzzle
} from "lucide-react";

import TravelPlanner from "./components/TravelPlanner";
import HeritageExplorer from "./components/HeritageExplorer";
import ARTreasureHunt from "./components/ARTreasureHunt";
import PublicFeedbackForm from "./components/PublicFeedback";
import TourismDonation from "./components/TourismDonation";
import AuthorityPortal from "./components/AuthorityPortal";
import LoginPage from "./components/LoginPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [portalMode, setPortalMode] = useState<"public" | "authority">("public");
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
    language?: string;
  }>({
    name: "Guest Explorer",
    email: "guest@oorpayana.org",
    role: "Public Tourist"
  });

  const [activeModule, setActiveModule] = useState<string>("planner");

  const handleLogin = (
    portal: "public" | "authority",
    userInfo: { name: string; email: string; role: string; language?: string }
  ) => {
    setPortalMode(portal);
    setCurrentUser(userInfo);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Public Portal Navigation Modules ONLY (NO Decision Dashboard in Public navigation)
  const publicModules = [
    { id: "planner", label: "Smart Travel Planner", icon: <Compass className="h-4 w-4 text-teal-600 fill-teal-500" />, desc: "Personalized, crowd-aware plans" },
    { id: "explorer", label: "Multimodal Heritage Explorer", icon: <Landmark className="h-4 w-4 text-amber-700" />, desc: "Gemini Vision & Audio Guide" },
    { id: "timetravel", label: "Heritage Puzzle & Quiz", icon: <Puzzle className="h-4 w-4 text-indigo-600" />, desc: "Rebuild history & test your knowledge" },
    { id: "feedback", label: "Public Feedback", icon: <Star className="h-4 w-4 text-amber-500 fill-amber-500" />, desc: "Rate monument ratings, photos & reviews" },
    { id: "donation", label: "Donate for Tourism", icon: <Heart className="h-4 w-4 text-emerald-600 fill-emerald-500" />, desc: "Select location, adopt & click to pay" }
  ];

  // Render Login Page if not authenticated
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans antialiased text-gray-800">
      {/* Top Navigation Bar */}
      <header id="platform-header" className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
              🧭
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-base md:text-lg leading-none tracking-tight flex items-center gap-2">
                Oor Payana
                <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${
                  portalMode === "public" 
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}>
                  {portalMode === "public" ? "Public Tourist Portal" : "Authority Portal"}
                </span>
              </h1>
              <p className="text-[11px] text-emerald-700 font-semibold tracking-wide mt-0.5">
                Discover the soul of every city.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-xs bg-slate-100 text-slate-700 font-medium px-3 py-1 rounded-xl border border-slate-200">
              <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>{currentUser.name}</span>
              <span className="text-slate-400">|</span>
              <span className="text-[10px] font-mono text-slate-500">{currentUser.role}</span>
            </div>

            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
              <Sparkles className="h-3 w-3 text-emerald-600 animate-pulse" />
              <span>Gemini 2.5 Core</span>
            </span>

            <button
              onClick={handleLogout}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5 border border-slate-300"
              title="Sign Out to Login Page"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {portalMode === "authority" ? (
          /* AUTHORITY PORTAL */
          <AuthorityPortal onLogoutToPublic={() => setPortalMode("public")} />
        ) : (
          /* PUBLIC PORTAL */
          <>
            {/* Banner/Hero for Public Users */}
            <section id="platform-hero" className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="absolute top-0 right-0 p-8 text-9xl text-gray-50/60 font-black select-none pointer-events-none font-serif">
                INDIA
              </div>
              <div className="md:col-span-8 space-y-3 relative z-10">
                <div className="text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Live Multimodal Heritage Recognition & Travel Guide
                </div>
                <h2 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900 leading-tight">
                  Bridge the Gap Between Living Monuments and Modern Tourism
                </h2>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-2xl">
                  Equip tourists with customized, weather-optimized itinerary guides, interactive voice narration, and public monument ratings & feedback.
                </p>
              </div>
              <div className="md:col-span-4 grid grid-cols-2 gap-3 relative z-10">
                {[
                  { label: "Community Support", value: "Local Artisans & Cuisines" },
                  { label: "Interactive RAG", value: "Speak naturally like a local" },
                  { label: "Vision Scanning", value: "Instantly recognize carvings" },
                  { label: "Public Feedback", value: "Ratings, photos & monument type" }
                ].map((feature, i) => (
                  <div key={i} className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">{feature.label}</span>
                    <span className="font-semibold text-gray-800 text-xs block mt-1">{feature.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Public Navigation Modules */}
            <section id="module-workspace" className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {publicModules.map((mod) => {
                  const active = activeModule === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => setActiveModule(mod.id)}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                        active 
                          ? "bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/10" 
                          : "bg-white/80 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                        active ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        {mod.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-xs">{mod.label}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5 truncate">{mod.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Public Module Container */}
              <div className="bg-white/60 backdrop-blur rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {activeModule === "planner" && (
                    <motion.div
                      key="planner"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <TravelPlanner />
                    </motion.div>
                  )}

                  {activeModule === "explorer" && (
                    <motion.div
                      key="explorer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <HeritageExplorer />
                    </motion.div>
                  )}

                  {activeModule === "timetravel" && (
                    <motion.div
                      key="timetravel"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <ARTreasureHunt />
                    </motion.div>
                  )}

                  {activeModule === "feedback" && (
                    <motion.div
                      key="feedback"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <PublicFeedbackForm />
                    </motion.div>
                  )}

                  {activeModule === "donation" && (
                    <motion.div
                      key="donation"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <TourismDonation />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Aesthetic Footer with Official Gateway Access */}
      <footer id="platform-footer" className="bg-white border-t border-gray-200 py-6 mt-12 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-800 text-[10px] font-bold">
              OP
            </div>
            <span className="font-semibold text-gray-700">Oor Payana — Discover the soul of every city.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Powered by Gemini Multimodal Models</span>
            <span>|</span>
            {/* Portal Switch / Return to Login Page */}
            {portalMode === "public" ? (
              <button
                onClick={() => {
                  setPortalMode("authority");
                  setCurrentUser({
                    name: "Dr. K. Ramesh (ASI Lead)",
                    email: "ramesh.director@asi.gov.in",
                    role: "Archaeological Survey of India"
                  });
                }}
                className="text-slate-500 hover:text-slate-800 text-xs flex items-center gap-1 font-semibold underline decoration-slate-300 transition-colors"
              >
                <Lock className="h-3 w-3 text-slate-400" />
                <span>Switch to Archaeological Survey & Authority Portal</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setPortalMode("public");
                  setCurrentUser({
                    name: "Ananya Sharma",
                    email: "ananya.s@example.com",
                    role: "Public Tourist"
                  });
                }}
                className="text-emerald-600 hover:text-emerald-700 text-xs flex items-center gap-1 font-semibold underline decoration-emerald-300 transition-colors"
              >
                ← Return to Public Tourist Portal
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

