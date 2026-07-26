import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, ShieldCheck, User, Lock, Sparkles, MapPin, 
  Landmark, Clock, ArrowRight, CheckCircle2, Building2, 
  Globe2, ShieldAlert, HeartHandshake, Eye, Key, ChevronRight
} from "lucide-react";

interface LoginPageProps {
  onLogin: (portal: "public" | "authority", userInfo: { name: string; email: string; role: string; language?: string }) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<"public" | "authority">("public");

  // Public Form state
  const [publicName, setPublicName] = useState("");
  const [publicEmail, setPublicEmail] = useState("");
  const [publicLanguage, setPublicLanguage] = useState("English");

  // Authority Form state
  const [authEmail, setAuthEmail] = useState("officer.ramesh@asi.gov.in");
  const [authDept, setAuthDept] = useState("Archaeological Survey of India (ASI)");
  const [authPin, setAuthPin] = useState("1234");
  const [authError, setAuthError] = useState("");

  const handlePublicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin("public", {
      name: publicName.trim() || "Explorer Tourist",
      email: publicEmail.trim() || "tourist@oorpayana.org",
      role: "Public Tourist",
      language: publicLanguage
    });
  };

  const handleAuthoritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) {
      setAuthError("Please enter your official email ID.");
      return;
    }
    setAuthError("");
    onLogin("authority", {
      name: "Dr. K. Ramesh",
      email: authEmail,
      role: `${authDept} Executive Officer`
    });
  };

  const handleQuickDemo = (type: "public" | "authority") => {
    if (type === "public") {
      onLogin("public", {
        name: "Ananya Sharma",
        email: "ananya.s@example.com",
        role: "Public Tourist",
        language: "English"
      });
    } else {
      onLogin("authority", {
        name: "Dr. K. Ramesh (ASI Director)",
        email: "ramesh.director@asi.gov.in",
        role: "Archaeological Survey of India - Zone Lead"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Decorative Lighting & Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Logo Header */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-emerald-900/40 border border-emerald-400/30">
            🧭
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white font-serif">Oor Payana</h1>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                AI Heritage Platform
              </span>
            </div>
            <p className="text-xs text-slate-400">Discover the soul of every city.</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span>Gemini 2.5 Engine Integrated</span>
          </span>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        
        {/* Left Column: App Title, App Description, Platform Features */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-full backdrop-blur">
              <Landmark className="h-3.5 w-3.5 text-emerald-400" />
              <span>Unified Public & Archaeological Authority Portal</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-serif">
              Bridge Living Monuments & Modern Responsible Tourism
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              <strong className="text-emerald-400 font-semibold">Oor Payana</strong> is an intelligent multimodal heritage platform that empowers travelers with crowd-aware itineraries, AI visual monument identification, and time-travel historic simulations — while giving heritage management authorities predictive crowd analytics and geofenced conservation tools.
            </p>
          </div>

          {/* Key Capabilities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              {
                icon: <Compass className="h-5 w-5 text-emerald-400" />,
                title: "Smart Travel Itineraries",
                desc: "Personalized, weather-aware plans featuring authentic local food and artisan spots."
              },
              {
                icon: <Landmark className="h-5 w-5 text-amber-400" />,
                title: "Multimodal Gemini Explorer",
                desc: "Snap photos of temple carvings or monuments for instant history & multilingual audio guides."
              },
              {
                icon: <Clock className="h-5 w-5 text-purple-400" />,
                title: "Crowd & Transit Intelligence",
                desc: "Live route optimization, peak hour advisories, and per-person cost breakdown guidance."
              },
              {
                icon: <ShieldCheck className="h-5 w-5 text-blue-400" />,
                title: "Heritage Care & Authority Portal",
                desc: "Public geofenced reporting connected directly to ASI real-time complaint & conservation dispatch."
              }
            ].map((feat, idx) => (
              <div key={idx} className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 backdrop-blur hover:border-slate-700 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-slate-800/80 rounded-xl">
                    {feat.icon}
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">{feat.title}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-normal">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* Quick Demo Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-slate-800/80">
            <span className="text-xs text-slate-400 font-medium">Quick One-Click Access:</span>
            <button
              onClick={() => handleQuickDemo("public")}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900/80 transition-all flex items-center gap-1.5"
            >
              <span>Explore Public Portal</span>
              <ArrowRight className="h-3 w-3" />
            </button>
            <button
              onClick={() => handleQuickDemo("authority")}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-950 text-amber-300 border border-amber-700/60 hover:bg-amber-900/80 transition-all flex items-center gap-1.5"
            >
              <span>Access Authority Portal</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Login Box with Tabs */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            
            {/* Login Tab Header */}
            <div className="flex items-center p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("public")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === "public"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <User className="h-4 w-4" />
                <span>Public Portal</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("authority")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === "authority"
                    ? "bg-amber-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Authority Portal</span>
              </button>
            </div>

            {/* TAB CONTENT: PUBLIC TOURIST LOGIN */}
            {activeTab === "public" ? (
              <motion.form
                key="public-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handlePublicSubmit}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Public Tourist Sign In</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full">
                      Free Access
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Plan trips, identify heritage monuments, and explore historical eras.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Your Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Ananya Sharma"
                        value={publicName}
                        onChange={(e) => setPublicName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all pl-9"
                      />
                      <User className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="tourist@example.com"
                        value={publicEmail}
                        onChange={(e) => setPublicEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all pl-9"
                      />
                      <Globe2 className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Preferred Audio & Narration Language
                    </label>
                    <select
                      value={publicLanguage}
                      onChange={(e) => setPublicLanguage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all"
                    >
                      <option value="English">English</option>
                      <option value="Tamil">Tamil (தமிழ்)</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                      <option value="Telugu">Telugu (తెలుగు)</option>
                      <option value="Kannada">Kannada (கன்னட)</option>
                      <option value="French">French (Français)</option>
                      <option value="German">German (Deutsch)</option>
                      <option value="Spanish">Spanish (Español)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 group"
                  >
                    <span>Enter Public Tourist Portal</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => handleQuickDemo("public")}
                      className="text-[11px] text-slate-400 hover:text-emerald-400 underline underline-offset-2 transition-colors"
                    >
                      Skip login & continue as Guest Tourist
                    </button>
                  </div>
                </div>
              </motion.form>
            ) : (
              /* TAB CONTENT: AUTHORITY LOGIN */
              <motion.form
                key="authority-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleAuthoritySubmit}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>ASI & Heritage Authority Login</span>
                    <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded-full font-mono">
                      Restricted
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Official access for municipal officers, ASI leads, and conservation teams.
                  </p>
                </div>

                {authError && (
                  <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-red-400 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Official Email / Badge ID
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all pl-9"
                        required
                      />
                      <Building2 className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Department / Organization
                    </label>
                    <select
                      value={authDept}
                      onChange={(e) => setAuthDept(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
                    >
                      <option value="Archaeological Survey of India (ASI)">Archaeological Survey of India (ASI)</option>
                      <option value="Ministry of Tourism & Heritage Board">Ministry of Tourism & Heritage Board</option>
                      <option value="City Municipal Conservation Authority">City Municipal Conservation Authority</option>
                      <option value="Monuments Preservation Taskforce">Monuments Preservation Taskforce</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                      <span>Security PIN / Passcode</span>
                      <span className="text-[10px] text-amber-400/80 font-mono">(Demo PIN: 1234)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={authPin}
                        onChange={(e) => setAuthPin(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-all pl-9"
                      />
                      <Key className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-900/50 flex items-center justify-center gap-2 group"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Authenticate Authority Portal Access</span>
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => handleQuickDemo("authority")}
                      className="text-[11px] text-slate-400 hover:text-amber-400 underline underline-offset-2 transition-colors"
                    >
                      One-click demo officer login
                    </button>
                  </div>
                </div>
              </motion.form>
            )}

            {/* Footer Notice */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-[10px] text-slate-500">
              Encrypted Session • Government & Tourism Heritage Compliance
            </div>
          </div>
        </div>

      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between border-t border-slate-900">
        <div>Oor Payana — Living Monuments & Smart Tourism Engine</div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <span>Public & Officer Portals</span>
          <span>•</span>
          <span>Powered by Gemini Multimodal Models</span>
        </div>
      </footer>
    </div>
  );
}
