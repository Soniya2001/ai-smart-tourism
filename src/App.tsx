import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, Landmark, Trophy, TrendingUp, Sparkles, MapPin, 
  BookOpen, HelpCircle, Heart, Star, Users, ArrowRight, Github 
} from "lucide-react";

import TravelPlanner from "./components/TravelPlanner";
import HeritageExplorer from "./components/HeritageExplorer";
import ARTreasureHunt from "./components/ARTreasureHunt";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [activeModule, setActiveModule] = useState<string>("planner");

  const modules = [
    { id: "planner", label: "Smart Travel Planner", icon: <Compass className="h-4 w-4" />, desc: "Personalized, crowd-aware plans" },
    { id: "explorer", label: "Multimodal Explorer", icon: <Landmark className="h-4 w-4" />, desc: "Gemini Vision & Audio Guide" },
    { id: "gamification", label: "AR Treasure Hunt", icon: <Trophy className="h-4 w-4" />, desc: "Collect badges & earn ranks" },
    { id: "dashboard", label: "Decision Dashboard", icon: <TrendingUp className="h-4 w-4" />, desc: "Visitor, crowd & structural insights" }
  ];

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
              <h1 className="font-bold text-gray-900 text-sm md:text-base leading-none tracking-tight">
                AI Smart Tourism & Heritage Platform
              </h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase mt-1">
                Preserving Heritage Through Intelligent Experiences
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
              <Sparkles className="h-3 w-3 text-emerald-600 animate-pulse" />
              <span>Gemini 3.5 Core Engine Active</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner/Introduction */}
        <section id="platform-hero" className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="absolute top-0 right-0 p-8 text-9xl text-gray-50/60 font-black select-none pointer-events-none font-serif">
            INDIA
          </div>
          <div className="md:col-span-8 space-y-3 relative z-10">
            <div className="text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Live Multimodal Heritage Recognition & RAG
            </div>
            <h2 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900 leading-tight">
              Bridge the Gap Between Living Monuments and Modern Tourism
            </h2>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-2xl">
              Equip tourists with customized, weather-optimized itinerary guides, interactive voice narration, and AR badge hunting, while empowering local municipalities with deep predictive crowd analytics and structural conservation advisories.
            </p>
          </div>
          <div className="md:col-span-4 grid grid-cols-2 gap-3 relative z-10">
            {[
              { label: "Community Support", value: "Local Artisans & Cuisines" },
              { label: "Interactive RAG", value: "Speak naturally like a local" },
              { label: "Vision Scanning", value: "Instantly recognize carvings" },
              { label: "Decision Insights", value: "Real-time structural audits" }
            ].map((feature, i) => (
              <div key={i} className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100">
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">{feature.label}</span>
                <span className="font-semibold text-gray-800 text-xs block mt-1">{feature.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic Workspace Workspace */}
        <section id="module-workspace" className="space-y-6">
          {/* Module Selector Navigation Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {modules.map((mod) => {
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

          {/* Render Active Module with Animation */}
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

              {activeModule === "gamification" && (
                <motion.div
                  key="gamification"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <ARTreasureHunt />
                </motion.div>
              )}

              {activeModule === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Dashboard />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Aesthetic Footer */}
      <footer id="platform-footer" className="bg-white border-t border-gray-200 py-6 mt-12 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-800 text-[10px] font-bold">
              AI
            </div>
            <span className="font-semibold text-gray-600">AI Smart Tourism & Heritage Intelligence</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by Gemini Multimodal Models & Spatial RAG Archives</span>
            <span>|</span>
            <span className="text-gray-500 font-medium">Affiliated with Sustainable Local Living Communities</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
