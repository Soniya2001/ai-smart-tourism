import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, AlertTriangle, MapPin, Camera, Upload, Send, CheckCircle2, 
  Clock, FileText, Sparkles, AlertCircle, Eye, UserCheck, Search, Filter, 
  ChevronRight, RefreshCw, Layers
} from "lucide-react";
import { TouristComplaint, AIVerificationResult, PRESET_MONUMENTS } from "../types";

const INITIAL_PUBLIC_COMPLAINTS: TouristComplaint[] = [
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
      { stage: "Inspection Started", timestamp: "2026-07-25 11:00 AM", completed: false, notes: "Pending site visit by assigned officer." },
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
      { stage: "Assigned", timestamp: "2026-07-24 04:15 PM", completed: true, notes: "Assigned to Temple Security & Facilities Officer." },
      { stage: "Inspection Started", timestamp: "2026-07-24 04:40 PM", completed: true, notes: "Officer inspecting site obstruction." },
      { stage: "Resolved", timestamp: "In progress", completed: false }
    ]
  }
];

export default function HeritageCare() {
  const [subTab, setSubTab] = useState<"report" | "my-complaints">("report");
  const [complaints, setComplaints] = useState<TouristComplaint[]>(() => {
    const saved = localStorage.getItem("public_heritage_complaints");
    return saved ? JSON.parse(saved) : INITIAL_PUBLIC_COMPLAINTS;
  });

  // Form State
  const [monumentName, setMonumentName] = useState(PRESET_MONUMENTS[0].name);
  const [category, setCategory] = useState("Sanitation & Cleanliness");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<TouristComplaint | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>("GPS Ready (Lat 27.1751, Long 78.0421 | Accuracy ±5m)");
  const [currentCoords, setCurrentCoords] = useState({ lat: 27.1751, lng: 78.0421 });

  // Save to LocalStorage whenever updated
  useEffect(() => {
    localStorage.setItem("public_heritage_complaints", JSON.stringify(complaints));
  }, [complaints]);

  // Handle Geolocation capture
  const handleGetLiveLocation = () => {
    if ("geolocation" in navigator) {
      setLocationStatus("Fetching live satellite GPS coordinates...");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(4));
          const lng = parseFloat(pos.coords.longitude.toFixed(4));
          const acc = Math.round(pos.coords.accuracy || 6);
          setCurrentCoords({ lat, lng });
          setLocationStatus(`Live Satellite GPS Locked: Lat ${lat}, Long ${lng} (Accuracy ±${acc}m)`);
        },
        () => {
          setLocationStatus("GPS Location Locked: Lat 27.1751, Long 78.0421 (Simulated Monument Perimeter ±6m)");
        }
      );
    } else {
      setLocationStatus("GPS Location Locked: Lat 27.1751, Long 78.0421 (±6m)");
    }
  };

  // Sample photo choices for fast testing
  const samplePhotos = [
    { label: "Taj Mahal Litter Issue", url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80" },
    { label: "Meenakshi Temple Ramp", url: "https://images.unsplash.com/photo-1610123598147-f632aa18b275?auto=format&fit=crop&w=600&q=80" },
    { label: "Hampi Pillar Maintenance", url: "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=600&q=80" }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsVerifying(true);
    const finalImg = imageUrl || samplePhotos[0].url;

    try {
      const res = await fetch("/api/complaints/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monumentName,
          category,
          description,
          imageUrl: finalImg,
          latitude: currentCoords.lat,
          longitude: currentCoords.lng,
          address: `${monumentName} Main Premises`,
          deviceAccuracyMeters: 6
        })
      });

      const verificationResult: AIVerificationResult = await res.json();

      const newComplaint: TouristComplaint = {
        id: `CMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        monumentName,
        monumentLocation: "Heritage Premises",
        category,
        description,
        imageUrl: finalImg,
        latitude: currentCoords.lat,
        longitude: currentCoords.lng,
        address: `${monumentName} Site Perimeter`,
        deviceAccuracyMeters: 6,
        timestamp: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
        supportedByCount: 1,
        isPublicUserSubmitted: true,
        aiVerification: verificationResult,
        currentStage: "Verified",
        timeline: [
          { stage: "Submitted", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true, notes: "Logged by public user with geotag metadata." },
          { stage: "Verified", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true, notes: `AI Genuine Confidence: ${verificationResult.aiConfidenceScore}%.` },
          { stage: "Assigned", timestamp: "Pending Dispatch", completed: false, notes: "Automated routing to local site authority." },
          { stage: "Inspection Started", timestamp: "Pending", completed: false },
          { stage: "Resolved", timestamp: "Pending", completed: false }
        ]
      };

      setComplaints((prev) => [newComplaint, ...prev]);
      setSubmittedComplaint(newComplaint);
      setDescription("");
      setImageUrl("");
    } catch (err) {
      console.error("Verification failed:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  const publicUserComplaints = complaints.filter((c) => c.isPublicUserSubmitted);

  return (
    <div className="space-y-6">
      {/* Heritage Care Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              Public Heritage Care Gateway
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-serif tracking-tight text-emerald-50">
              Heritage Care & Visitor Reporting
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Help preserve India's timeless treasures. Report maintenance issues, sanitation needs, or safety concerns directly. Reports are verified using AI image analysis & satellite geofencing.
            </p>
          </div>

          {/* Sub Tab Switcher */}
          <div className="bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 flex items-center gap-1 shrink-0 w-full md:w-auto">
            <button
              onClick={() => { setSubTab("report"); setSubmittedComplaint(null); }}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                subTab === "report" 
                  ? "bg-emerald-600 text-white shadow-md" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <FileText className="h-4 w-4" />
              Report Issue
            </button>

            <button
              onClick={() => setSubTab("my-complaints")}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 relative ${
                subTab === "my-complaints" 
                  ? "bg-emerald-600 text-white shadow-md" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Clock className="h-4 w-4" />
              My Complaints
              {publicUserComplaints.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-400 text-slate-950 font-bold">
                  {publicUserComplaints.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: REPORT ISSUE */}
      {subTab === "report" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-emerald-600" />
                  Submit Site Report
                </h2>
                <p className="text-xs text-slate-500">Provide photos & details for instant AI genuine location verification.</p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                GPS Verified Mode
              </span>
            </div>

            <form onSubmit={handleSubmitComplaint} className="space-y-5">
              {/* Monument Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Select Heritage Site / Monument
                </label>
                <select
                  value={monumentName}
                  onChange={(e) => setMonumentName(e.target.value)}
                  className="w-full text-sm rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2.5 bg-slate-50 font-medium"
                >
                  {PRESET_MONUMENTS.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.location})
                    </option>
                  ))}
                  <option value="Other Heritage Monument">Other Heritage Monument / Site</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Issue Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2.5 bg-slate-50 font-medium"
                >
                  <option value="Sanitation & Cleanliness">Sanitation & Cleanliness (Litter, Restroom, Trash)</option>
                  <option value="Structural & Vandalism">Structural & Vandalism (Cracks, Graffiti, Damaged Railings)</option>
                  <option value="Overcrowding & Queue Safety">Overcrowding & Queue Safety (Bottlenecks, Stampede Risks)</option>
                  <option value="Guide & Vendor Misconduct">Guide & Vendor Misconduct (Overcharging, Unlicensed Guides)</option>
                  <option value="Accessibility & Signage">Accessibility & Signage (Missing Ramps, Broken Elevators)</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Issue Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you observed (e.g. 'Broken stone railing near northern pillar area...')"
                  className="w-full text-sm rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 bg-slate-50"
                  required
                />
              </div>

              {/* Upload Photo or Choose Sample */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Attach Photo Evidence
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl bg-slate-50 hover:bg-emerald-50/50 transition-all text-xs font-semibold text-slate-600">
                      <Upload className="h-4 w-4 text-emerald-600" />
                      <span>{imageUrl ? "Change Uploaded Image" : "Upload Photo from Device"}</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>

                  {/* Sample presets for easy testing */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                      Or select sample test photo:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {samplePhotos.map((photo, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => setImageUrl(photo.url)}
                          className={`relative rounded-lg overflow-hidden border-2 text-left h-16 group transition-all ${
                            imageUrl === photo.url ? "border-emerald-600 ring-2 ring-emerald-500/20" : "border-slate-200 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-900/40 p-1 flex items-end">
                            <span className="text-[10px] text-white font-medium truncate">{photo.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {imageUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 h-36">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded-md"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* GPS Location Bar */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <MapPin className="h-4 w-4 text-emerald-600 animate-pulse" />
                    <span>Geofenced GPS Location Lock</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGetLiveLocation}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    Refresh Satellite GPS
                  </button>
                </div>
                <p className="text-[11px] font-mono text-emerald-800">{locationStatus}</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isVerifying || !description.trim()}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>AI Analyzing Image & Satellite Geofence...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit & Run Genuine AI Verification</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Info / Verification Result Panel */}
          <div className="lg:col-span-5 space-y-6">
            {submittedComplaint ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-200 space-y-5"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Report Successfully Verified</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700">
                    ID: {submittedComplaint.id}
                  </span>
                </div>

                {/* AI Score Badge */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-semibold text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                      AI Genuine Score
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {submittedComplaint.aiVerification.verificationBadgeText}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                      {submittedComplaint.aiVerification.aiConfidenceScore}%
                    </span>
                    <span className="text-xs text-slate-300">
                      Genuine Authenticity Match
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-800">
                    {submittedComplaint.aiVerification.aiSummary}
                  </p>
                </div>

                {/* Verified Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[11px] text-slate-500 block">GPS Distance</span>
                    <span className="font-bold text-slate-800">{submittedComplaint.aiVerification.distanceFromMonumentText}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[11px] text-slate-500 block">Severity Level</span>
                    <span className="font-bold text-amber-600">{submittedComplaint.aiVerification.predictedSeverity}</span>
                  </div>
                </div>

                {/* AI Verification Reasons */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 block">Verification Parameters:</span>
                  <ul className="space-y-1">
                    {submittedComplaint.aiVerification.reasons.map((r, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setSubTab("my-complaints")}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>Track Status in My Complaints</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </motion.div>
            ) : (
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                  <Sparkles className="h-4 w-4" />
                  <span>How Genuine AI Verification Works</span>
                </div>
                
                <p className="text-xs text-slate-300 leading-relaxed">
                  When you submit a report, our Gemini AI models inspect the photo features against official archaeological archives and verify your device's satellite GPS location within a tight geofence perimeter.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <Camera className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">1. Image Architecture Matching</h4>
                      <p className="text-[11px] text-slate-400">Verifies stonework, pillar carvings, and Gopuram motifs against site reference archives.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">2. Geofence Satellite Validation</h4>
                      <p className="text-[11px] text-slate-400">Ensures device coordinates originate within 50 meters of the monument boundaries.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">3. Rapid Officer Dispatch</h4>
                      <p className="text-[11px] text-slate-400">Verified genuine reports are automatically prioritized and routed to on-site authority officers.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MY COMPLAINTS */}
      {subTab === "my-complaints" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-600" />
                My Submitted Complaints
              </h2>
              <p className="text-xs text-slate-500">Track real-time progress and authority resolution status for your reports.</p>
            </div>
            <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              {publicUserComplaints.length} Total Reports Logged
            </span>
          </div>

          {publicUserComplaints.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
              <FileText className="h-12 w-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">No Submitted Complaints Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  You haven't submitted any heritage care reports yet. Use the 'Report Issue' tab to report maintenance or accessibility needs.
                </p>
              </div>
              <button
                onClick={() => setSubTab("report")}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-md hover:bg-emerald-700 transition-all inline-flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Submit Your First Report
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {publicUserComplaints.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-emerald-300 transition-all space-y-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-start gap-3">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.monumentName}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {item.id}
                          </span>
                          <span className="text-xs font-bold text-emerald-800 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-1">{item.monumentName}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {item.address} • Submitted {item.timestamp}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-start md:self-auto">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-500 block">AI Genuine Score</span>
                        <span className="font-mono font-bold text-sm text-emerald-600">
                          {item.aiVerification.aiConfidenceScore}% Genuine
                        </span>
                      </div>
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        item.currentStage === "Resolved" 
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : item.currentStage === "Inspection Started"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-blue-100 text-blue-800 border border-blue-300"
                      }`}>
                        {item.currentStage}
                      </span>
                    </div>
                  </div>

                  {/* Complaint Description */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">"{item.description}"</p>
                    {item.assignedOfficer && (
                      <p className="text-[11px] text-emerald-700 font-semibold mt-2 flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5" />
                        Assigned Officer: {item.assignedOfficer}
                      </p>
                    )}
                  </div>

                  {/* Timeline Tracker */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Resolution Progress Tracker
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {["Submitted", "Verified", "Assigned", "Inspection Started", "Resolved"].map((stg, i) => {
                        const isDone = item.timeline?.find((t) => t.stage === stg)?.completed;
                        const timelineNote = item.timeline?.find((t) => t.stage === stg)?.notes;

                        return (
                          <div
                            key={stg}
                            className={`p-3 rounded-xl border text-center space-y-1 transition-all ${
                              isDone
                                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                                : "bg-slate-50 border-slate-200/60 text-slate-400"
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1">
                              {isDone ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Clock className="h-3.5 w-3.5 text-slate-300" />
                              )}
                              <span className="text-[11px] font-bold">{stg}</span>
                            </div>
                            {timelineNote && (
                              <span className="text-[10px] text-slate-500 block leading-tight line-clamp-2">
                                {timelineNote}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
