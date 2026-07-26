import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, Lock, LogOut, TrendingUp, AlertTriangle, MapPin, ExternalLink, 
  UserCheck, CheckCircle2, Clock, Users, Building, Activity, Sparkles, Sliders, 
  Search, Filter, Send, Phone, RefreshCw, FileText, BarChart3, AlertCircle, Eye
} from "lucide-react";
import Dashboard from "./Dashboard";
import { TouristComplaint, AIVerificationResult } from "../types";

const ALL_INITIAL_COMPLAINTS: TouristComplaint[] = [
  {
    id: "CMP-2026-8901",
    monumentName: "Taj Mahal",
    monumentLocation: "Agra, Uttar Pradesh",
    category: "Sanitation & Cleanliness",
    description: "Overflowing litter bin near the eastern outer garden path causing odor and unhygienic conditions.",
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80",
    latitude: 27.1751,
    longitude: 78.0421,
    address: "Eastern Promenade Path, Taj Mahal Complex",
    deviceAccuracyMeters: 6,
    timestamp: "2026-07-25 10:14 AM",
    supportedByCount: 42,
    isPublicUserSubmitted: true,
    currentStage: "Assigned",
    assignedOfficer: "Inspector V. Sharma (Agra Zone)",
    aiVerification: {
      imageMatchesMonument: true,
      gpsMatchesMonument: true,
      distanceFromMonumentText: "14 metres",
      distanceFromMonumentMeters: 14,
      aiConfidenceScore: 97,
      overallStatus: "Verified Complaint",
      badgeColor: "green",
      verificationBadgeText: "✔ Verified Location (97%)",
      aiSummary: "High confidence genuine complaint. Image architecture and GPS coordinates match Taj Mahal Eastern Promenade within 14 meters.",
      classifiedCategory: "Sanitation & Facilities",
      predictedSeverity: "Medium",
      reasons: [
        "Image visual features match Taj Mahal eastern red sandstone archways",
        "GPS coordinates place report 14m inside site perimeter",
        "No duplicate report detected within 2-hour window"
      ],
      isDuplicate: false,
      supportCount: 42
    },
    timeline: [
      { stage: "Submitted", timestamp: "2026-07-25 10:14 AM", completed: true, notes: "Logged via Public Heritage Care Portal with GPS metadata." },
      { stage: "Verified", timestamp: "2026-07-25 10:15 AM", completed: true, notes: "Automated AI Genuine & Geofence verification score: 97%." },
      { stage: "Assigned", timestamp: "2026-07-25 10:30 AM", completed: true, notes: "Assigned to Inspector V. Sharma (Sanitation Unit)." },
      { stage: "Inspection Started", timestamp: "Pending", completed: false },
      { stage: "Resolved", timestamp: "Pending", completed: false }
    ]
  },
  {
    id: "CMP-2026-8902",
    monumentName: "Madurai Meenakshi Temple",
    monumentLocation: "Madurai, Tamil Nadu",
    category: "Accessibility & Signage",
    description: "Wheelchair ramp near South Gopuram entrance is blocked by vendor barrier.",
    imageUrl: "https://images.unsplash.com/photo-1610123598147-f632aa18b275?auto=format&fit=crop&w=600&q=80",
    latitude: 9.9195,
    longitude: 78.1193,
    address: "South Gopuram Entrance, Meenakshi Temple",
    deviceAccuracyMeters: 8,
    timestamp: "2026-07-24 03:45 PM",
    supportedByCount: 18,
    isPublicUserSubmitted: true,
    currentStage: "Inspection Started",
    assignedOfficer: "Officer K. Ramanathan",
    aiVerification: {
      imageMatchesMonument: true,
      gpsMatchesMonument: true,
      distanceFromMonumentText: "19 metres",
      distanceFromMonumentMeters: 19,
      aiConfidenceScore: 94,
      overallStatus: "Verified Complaint",
      badgeColor: "green",
      verificationBadgeText: "✔ Verified Location (94%)",
      aiSummary: "Genuine accessibility obstruction report verified at South Gopuram.",
      classifiedCategory: "Accessibility & Safety",
      predictedSeverity: "High",
      reasons: [
        "Temple tower motif identified in uploaded photo",
        "GPS coordinates match South Gate corridor"
      ],
      isDuplicate: false,
      supportCount: 18
    },
    timeline: [
      { stage: "Submitted", timestamp: "2026-07-24 03:45 PM", completed: true },
      { stage: "Verified", timestamp: "2026-07-24 03:46 PM", completed: true },
      { stage: "Assigned", timestamp: "2026-07-24 04:15 PM", completed: true },
      { stage: "Inspection Started", timestamp: "2026-07-24 04:40 PM", completed: true, notes: "Officer inspecting site obstruction." },
      { stage: "Resolved", timestamp: "In progress", completed: false }
    ]
  },
  {
    id: "CMP-2026-8903",
    monumentName: "Hampi Virupaksha Temple",
    monumentLocation: "Hampi, Karnataka",
    category: "Structural & Vandalism",
    description: "Minor hairline fissure observed on eastern pillared pavilion base.",
    imageUrl: "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=600&q=80",
    latitude: 15.3350,
    longitude: 76.4600,
    address: "Eastern Pavilion, Hampi Complex",
    deviceAccuracyMeters: 5,
    timestamp: "2026-07-23 11:20 AM",
    supportedByCount: 64,
    isPublicUserSubmitted: false,
    currentStage: "Submitted",
    aiVerification: {
      imageMatchesMonument: true,
      gpsMatchesMonument: true,
      distanceFromMonumentText: "22 metres",
      distanceFromMonumentMeters: 22,
      aiConfidenceScore: 91,
      overallStatus: "Verified Complaint",
      badgeColor: "green",
      verificationBadgeText: "✔ Verified Location (91%)",
      aiSummary: "Fissure report matches granite stonework in Hampi Virupaksha eastern complex.",
      classifiedCategory: "Structural Preservation",
      predictedSeverity: "Critical",
      reasons: [
        "Granite texture and carving patterns match Hampi archaeological archives",
        "GPS within 22m of pavilion"
      ],
      isDuplicate: false,
      supportCount: 64
    },
    timeline: [
      { stage: "Submitted", timestamp: "2026-07-23 11:20 AM", completed: true },
      { stage: "Verified", timestamp: "2026-07-23 11:21 AM", completed: true },
      { stage: "Assigned", timestamp: "Pending", completed: false },
      { stage: "Inspection Started", timestamp: "Pending", completed: false },
      { stage: "Resolved", timestamp: "Pending", completed: false }
    ]
  }
];

interface AuthorityPortalProps {
  onLogoutToPublic: () => void;
}

export default function AuthorityPortal({ onLogoutToPublic }: AuthorityPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("authority_auth_session") === "true";
  });

  const [authPin, setAuthPin] = useState("");
  const [authEmail, setAuthEmail] = useState("officer@asi.gov.in");
  const [loginError, setLoginError] = useState("");

  // Load complaints
  const [allComplaints, setAllComplaints] = useState<TouristComplaint[]>(() => {
    const saved = localStorage.getItem("public_heritage_complaints");
    return saved ? JSON.parse(saved) : ALL_INITIAL_COMPLAINTS;
  });

  // Complaint Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStage, setFilterStage] = useState("ALL");
  const [filterSeverity, setFilterSeverity] = useState("ALL");

  // Selected complaint for details / status update
  const [selectedComplaint, setSelectedComplaint] = useState<TouristComplaint | null>(null);
  const [assignOfficerName, setAssignOfficerName] = useState("");
  const [updateStageValue, setUpdateStageValue] = useState<"Submitted" | "Verified" | "Assigned" | "Inspection Started" | "Resolved">("Assigned");
  const [resolutionNoteInput, setResolutionNoteInput] = useState("");

  // Settings state
  const [geofenceRadius, setGeofenceRadius] = useState(30);
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(85);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("public_heritage_complaints", JSON.stringify(allComplaints));
  }, [allComplaints]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authPin === "1234" || authPin === "" || authEmail.toLowerCase().includes("asi")) {
      setIsAuthenticated(true);
      localStorage.setItem("authority_auth_session", "true");
      setLoginError("");
    } else {
      setLoginError("Invalid Security PIN. (Use demo PIN: 1234)");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("authority_auth_session");
    onLogoutToPublic();
  };

  const handleSelectComplaint = (complaint: TouristComplaint) => {
    setSelectedComplaint(complaint);
    setAssignOfficerName(complaint.assignedOfficer || "Inspector V. Sharma (Agra Zone)");
    setUpdateStageValue(complaint.currentStage);
    setResolutionNoteInput("");
  };

  const handleSaveComplaintStatus = () => {
    if (!selectedComplaint) return;

    const updated = allComplaints.map((c) => {
      if (c.id === selectedComplaint.id) {
        const updatedTimeline = c.timeline.map((step) => {
          if (step.stage === updateStageValue) {
            return {
              ...step,
              completed: true,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              notes: resolutionNoteInput || step.notes || `Updated status by ${assignOfficerName}`
            };
          }
          return step;
        });

        return {
          ...c,
          assignedOfficer: assignOfficerName,
          currentStage: updateStageValue,
          timeline: updatedTimeline
        };
      }
      return c;
    });

    setAllComplaints(updated);
    setSelectedComplaint(null);
  };

  // Filter complaints
  const filteredComplaints = allComplaints.filter((c) => {
    const matchesSearch = c.monumentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = filterStage === "ALL" || c.currentStage === filterStage;
    const matchesSev = filterSeverity === "ALL" || c.aiVerification.predictedSeverity === filterSeverity;
    return matchesSearch && matchesStage && matchesSev;
  });

  // If not logged in, show security login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-200/80 space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-slate-900 tracking-tight">
              Heritage Authority Portal
            </h1>
            <p className="text-xs text-slate-500">
              Archaeological Survey & Heritage Management Official Access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Official Government Email
              </label>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="officer@asi.gov.in"
                className="w-full text-sm rounded-xl border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-3 bg-slate-50 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Security PIN / Password
              </label>
              <input
                type="password"
                value={authPin}
                onChange={(e) => setAuthPin(e.target.value)}
                placeholder="Enter PIN (Demo PIN: 1234)"
                className="w-full text-sm rounded-xl border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-3 bg-slate-50 font-mono"
              />
            </div>

            {loginError && (
              <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 border border-amber-500/30"
            >
              <Lock className="h-4 w-4" />
              <span>Authenticate Officer Access</span>
            </button>
          </form>

          {/* Demo Quick Bypass */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-2">
            <span className="text-[11px] text-slate-400 block font-medium">Quick Demo Evaluation Mode:</span>
            <button
              type="button"
              onClick={() => {
                setIsAuthenticated(true);
                localStorage.setItem("authority_auth_session", "true");
              }}
              className="w-full py-2 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300/80 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>Sign In as Zone Commander (Demo Access)</span>
            </button>
            <button
              type="button"
              onClick={onLogoutToPublic}
              className="text-xs text-slate-500 hover:text-slate-800 underline block mx-auto pt-1"
            >
              ← Return to Public Tourist Portal
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AUTHORITY PORTAL HEADER */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 flex items-center justify-center font-bold text-xl shadow-lg border border-amber-300/30 shrink-0">
              <ShieldCheck className="h-7 w-7 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Archaeological Survey & Tourism Authority
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Command Center
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold font-serif text-white tracking-tight mt-0.5">
                Heritage Management Authority Portal
              </h1>
              <p className="text-xs text-slate-400">
                Logged in as <span className="text-amber-300 font-bold">Officer V. Sharma</span> (Zone HQ - Agra & Southern Monuments Circle)
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 flex items-center gap-2 shrink-0"
          >
            <LogOut className="h-4 w-4 text-amber-400" />
            <span>Switch to Public Portal</span>
          </button>
        </div>
      </div>

      {/* DECISION DASHBOARD */}
      <div className="space-y-6">
        <Dashboard />
      </div>

    </div>
  );
}
