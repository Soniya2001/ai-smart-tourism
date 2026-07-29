import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, Calendar, Wallet, MapPin, Bus, Sun, Users, Sparkles, 
  ChevronRight, ArrowRight, RefreshCw, AlertCircle, Clock, Heart, HelpCircle,
  Hotel, CheckCircle2, DollarSign, Download, Share2, ExternalLink, QrCode,
  ShieldCheck, Star, Navigation, Map, Printer, CheckSquare, Square, FileText
} from "lucide-react";
import { TravelPlan } from "../types";

export default function TravelPlanner() {
  const [destination, setDestination] = useState("Madurai, Tamil Nadu");
  const [duration, setDuration] = useState(3);
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-03");
  const [budget, setBudget] = useState("Moderate");
  const [interests, setInterests] = useState<string[]>(["History", "Architecture", "Food"]);
  const [transport, setTransport] = useState("Auto-Rickshaw & Cabs");
  const [weather, setWeather] = useState("Sunny & Warm");
  const [crowdPreference, setCrowdPreference] = useState("Avoid peak hours (Smart Flow)");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [packedState, setPackedState] = useState<Record<string, boolean>>({});
  const [showQrModal, setShowQrModal] = useState(false);
  const [copyToast, setCopyToast] = useState(false);
  const [isSharedView, setIsSharedView] = useState(false);

  // Check if page was loaded via a shared trip link
  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const isShared = searchParams.get("sharedTrip") === "true";
    const sharedDest = searchParams.get("dest");

    if (isShared && sharedDest) {
      setIsSharedView(true);
      const sharedDur = parseInt(searchParams.get("duration") || "3", 10);
      const sharedStart = searchParams.get("startDate") || "2026-08-01";
      const sharedEnd = searchParams.get("endDate") || "2026-08-03";
      const sharedBudget = searchParams.get("budget") || "Moderate";
      const sharedInterests = searchParams.get("interests") ? searchParams.get("interests")!.split(",") : ["History", "Architecture"];
      const sharedTransport = searchParams.get("transport") || "Auto-Rickshaw & Cabs";
      const sharedWeather = searchParams.get("weather") || "Sunny & Warm";
      const sharedCrowd = searchParams.get("crowd") || "Avoid peak hours (Smart Flow)";

      setDestination(sharedDest);
      setDuration(sharedDur);
      setStartDate(sharedStart);
      setEndDate(sharedEnd);
      setBudget(sharedBudget);
      setInterests(sharedInterests);
      setTransport(sharedTransport);
      setWeather(sharedWeather);
      setCrowdPreference(sharedCrowd);

      // Try loading cached plan from localStorage
      const saved = localStorage.getItem(`shared_trip_${encodeURIComponent(sharedDest)}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.plan) {
            setPlan(parsed.plan);
            return;
          }
        } catch (e) {
          console.error("Failed to parse cached shared plan", e);
        }
      }

      // Auto-generate itinerary for shared parameters
      fetchSharedItinerary({
        destination: sharedDest,
        duration: sharedDur,
        startDate: sharedStart,
        endDate: sharedEnd,
        budget: sharedBudget,
        interests: sharedInterests,
        transport: sharedTransport,
        weather: sharedWeather,
        crowdPreference: sharedCrowd
      });
    }
  }, []);

  const fetchSharedItinerary = async (paramsObj: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paramsObj)
      });
      if (!response.ok) throw new Error("Failed to load shared trip itinerary.");
      const data = await response.json();
      setPlan(data);
      setActiveDay(1);
      if (data.packingChecklist) {
        const initPacked: Record<string, boolean> = {};
        data.packingChecklist.forEach((item: any) => {
          initPacked[item.id] = item.packed || false;
        });
        setPackedState(initPacked);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load shared trip.");
    } finally {
      setLoading(false);
    }
  };

  const interestOptions = ["History", "Architecture", "Spiritual", "Culinary/Food", "Shopping", "Arts & Crafts", "Nature & Parks"];

  const handleInterestToggle = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    if (val && endDate) {
      const start = new Date(val);
      const end = new Date(endDate);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
      if (diff > 0) setDuration(diff);
    }
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    if (startDate && val) {
      const start = new Date(startDate);
      const end = new Date(val);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
      if (diff > 0) setDuration(diff);
    }
  };

  const updateDuration = (newDur: number) => {
    const validDur = Math.max(1, newDur);
    setDuration(validDur);
    if (startDate) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + validDur - 1);
      setEndDate(start.toISOString().split("T")[0]);
    }
  };

  const generateItinerary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          duration,
          startDate,
          endDate,
          budget,
          interests,
          transport,
          weather,
          crowdPreference
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate travel plan from Gemini API.");
      }

      const data = await response.json();
      setPlan(data);
      setActiveDay(1);
      if (data.packingChecklist) {
        const initPacked: Record<string, boolean> = {};
        data.packingChecklist.forEach((item: any) => {
          initPacked[item.id] = item.packed || false;
        });
        setPackedState(initPacked);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while planning your trip.");
    } finally {
      setLoading(false);
    }
  };

  const togglePackingItem = (id: string) => {
    setPackedState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const downloadChecklist = () => {
    if (!plan || !plan.packingChecklist) return;
    const lines = plan.packingChecklist.map(item => {
      const isDone = packedState[item.id] ? "[X]" : "[ ]";
      return `${isDone} ${item.item} (${item.category}): ${item.reason}`;
    });
    const blob = new Blob([`TRIP PACKING CHECKLIST - ${plan.title}\n\n` + lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${destination.split(",")[0]}_Packing_Checklist.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getShareableTripUrl = () => {
    if (typeof window === "undefined") return "#";
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const params = new URLSearchParams({
      sharedTrip: "true",
      dest: destination,
      duration: String(duration),
      startDate: startDate,
      endDate: endDate,
      budget: budget,
      interests: interests.join(","),
      transport: transport,
      weather: weather,
      crowd: crowdPreference
    });
    return `${origin}${pathname}?${params.toString()}#planner`;
  };

  const getGoogleCalendarUrl = () => {
    if (!plan) return "#";
    const startIso = startDate.replace(/-/g, "") + "T090000Z";
    const endIso = endDate.replace(/-/g, "") + "T180000Z";
    const title = encodeURIComponent(`Trip to ${destination}: ${plan.title}`);
    const details = encodeURIComponent(plan.summary);
    const location = encodeURIComponent(destination);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  };

  const copyShareLink = () => {
    const url = getShareableTripUrl();
    if (plan) {
      try {
        localStorage.setItem(`shared_trip_${encodeURIComponent(destination)}`, JSON.stringify({
          destination, duration, startDate, endDate, budget, interests, transport, weather, crowdPreference, plan
        }));
      } catch (e) {
        console.error("Failed to save plan to localStorage", e);
      }
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 3500);
  };

  // Quick setup helper for Indian Heritage cities
  const quickCities = [
    { name: "Madurai, Tamil Nadu", desc: "Temple City of Gopurams & Jasmine" },
    { name: "Thanjavur, Tamil Nadu", desc: "Home of Living Chola Temples & Art" },
    { name: "Hampi, Karnataka", desc: "UNESCO ruins of Vijayanagara empire" },
    { name: "Agra, Uttar Pradesh", desc: "City of Taj Mahal & Mughal Splendour" }
  ];

  return (
    <div id="travel-planner-section" className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            <Compass className="h-6 w-6 text-teal-600 fill-teal-500" />
            Smart Travel Planner
          </h2>
          <p className="text-gray-500 mt-1">
            Personalized, crowd-aware and weather-optimized AI itineraries centered around living heritage.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full self-start md:self-center">
          <Sparkles className="h-3 w-3 animate-pulse" />
          <span>Weather & Crowd Aware Optimization Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Planning Control Panel */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto pr-1 scrollbar-thin">
          <h3 className="font-medium text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
            Customize Your Experience
          </h3>

          {/* Quick selects */}
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              Popular Heritage Hubs
            </label>
            <div className="grid grid-cols-2 gap-2">
              {quickCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => setDestination(city.name)}
                  className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                    destination === city.name 
                      ? "border-emerald-500 bg-emerald-50/50 text-emerald-950 font-medium" 
                      : "border-gray-100 hover:border-gray-300 text-gray-600 bg-gray-50/40"
                  }`}
                >
                  <div className="font-semibold truncate">{city.name.split(",")[0]}</div>
                  <div className="text-[10px] text-gray-400 truncate mt-0.5">{city.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Destination input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-gray-400" />
              Where would you like to go?
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Madurai, Varanasi, Hampi"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 text-sm bg-gray-50/50"
            />
          </div>

          {/* Travel Dates Selection */}
          <div className="space-y-2 bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100/80">
            <label className="text-xs font-semibold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-emerald-600" />
              Travel Dates Selection
            </label>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 font-medium">Start Date</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 font-medium">End Date</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <p className="text-[10px] text-emerald-800/80 mt-1">
              Dates auto-sync duration and dynamically trigger AI seasonal insights & crowd forecasts.
            </p>
          </div>

          {/* Duration & Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-400" />
                Duration (Days)
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => updateDuration(duration - 1)}
                  className="px-3.5 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-l-xl text-gray-600 font-bold transition-colors border border-gray-200 border-r-0 h-10 flex items-center justify-center text-sm select-none"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={duration || ""}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) updateDuration(val);
                  }}
                  className="w-full text-center border border-gray-200 h-10 text-sm font-bold text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => updateDuration(duration + 1)}
                  className="px-3.5 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-r-xl text-gray-600 font-bold transition-colors border border-gray-200 border-l-0 h-10 flex items-center justify-center text-sm select-none"
                >
                  +
                </button>
              </div>
              <p className="text-[10px] text-gray-400 leading-tight">
                Enter length of stay for tailored AI heritage planning
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Wallet className="h-4 w-4 text-gray-400" />
                Budget Profile
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 focus:outline-none focus:border-emerald-500 text-sm text-gray-700"
              >
                <option value="Budget">Budget (Backpacker)</option>
                <option value="Moderate">Moderate (Standard)</option>
                <option value="Premium">Premium (Luxury/Heritage)</option>
              </select>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4 pt-2">
            {/* Interests */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Heritage & Local Interests</label>
              <div className="flex flex-wrap gap-1.5">
                {interestOptions.map((opt) => {
                  const active = interests.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => handleInterestToggle(opt)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        active 
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-sm font-medium" 
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weather & Transit & Crowd */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Sun className="h-3 w-3" /> Weather
                  </label>
                  <select
                    value={weather}
                    onChange={(e) => setWeather(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-gray-200 bg-gray-50/50 text-xs text-gray-700 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Sunny & Warm">Sunny & Warm</option>
                    <option value="Monsoon / Rainy">Monsoon / Rainy</option>
                    <option value="Cool / Chilly">Cool & Chilly</option>
                    <option value="Humid / Coastal">Humid / Sweltering</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Bus className="h-3 w-3" /> Transit Mode
                  </label>
                  <select
                    value={transport}
                    onChange={(e) => setTransport(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-gray-200 bg-gray-50/50 text-xs text-gray-700 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Auto-Rickshaw & Cabs">Auto-Rickshaws & Cabs</option>
                    <option value="Walking & Bicycles">Walking & Eco-Bikes</option>
                    <option value="Local Metro & Bus">Public Buses & Metros</option>
                    <option value="Chauffeur Driven Car">Private Chauffeur Car</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <Users className="h-3 w-3" /> Crowd Sensitivity
                </label>
                <select
                  value={crowdPreference}
                  onChange={(e) => setCrowdPreference(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-gray-200 bg-gray-50/50 text-xs text-gray-700 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Avoid peak hours (Smart Flow)">Avoid Peak Hours (Smart Flow)</option>
                  <option value="Morning exclusive hours">Sunrise/Early Morning Exclusive</option>
                  <option value="Quiet, slow exploration">Quiet & Slow Exploration</option>
                  <option value="Standard tourist flow">Standard Tourist Flow</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={generateItinerary}
            disabled={loading || !destination || interests.length === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-4 text-sm"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Designing Your Flow...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Intelligent Itinerary</span>
              </>
            )}
          </button>
        </div>

        {/* Itinerary Result Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-4 py-16"
              >
                <div className="relative inline-block">
                  <div className="h-14 w-14 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
                  <Sparkles className="h-5 w-5 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-900">Consulting Heritage Knowledge Graph...</h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Optimizing schedules based on heatmaps for {destination}, calculating seasonal insights, hotel recommendations, and budget savings.
                  </p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Failed to generate itinerary</h4>
                  <p className="text-xs text-red-700 mt-1">{error}</p>
                  <button
                    onClick={generateItinerary}
                    className="text-xs font-semibold text-red-900 underline mt-2 hover:text-red-950"
                  >
                    Retry Generation
                  </button>
                </div>
              </motion.div>
            )}

            {!loading && !error && !plan && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-12 text-center text-gray-400 space-y-3"
              >
                <Compass className="h-10 w-10 mx-auto text-gray-300" />
                <div>
                  <h4 className="font-semibold text-gray-600 text-sm">No Itinerary Drafted Yet</h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                    Select your travel dates and favorite living heritage destination on the left, customize your options, and tap generate!
                  </p>
                </div>
              </motion.div>
            )}

            {!loading && !error && plan && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Export Options Bar */}
                <div className="bg-white p-3.5 rounded-2xl border border-gray-200 flex flex-wrap items-center justify-between gap-2 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                    <Share2 className="h-4 w-4 text-emerald-600" />
                    <span>Trip Export & Sharing:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors"
                      title="Download PDF or print itinerary"
                    >
                      <FileText className="h-3.5 w-3.5 text-gray-600" />
                      <span>PDF / Print</span>
                    </button>

                    <a
                      href={getGoogleCalendarUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Calendar className="h-3.5 w-3.5 text-blue-600" />
                      <span>Google Cal</span>
                    </a>

                    <button
                      onClick={() => setShowQrModal(!showQrModal)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors ${
                        showQrModal ? "bg-emerald-600 text-white shadow-xs" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      <QrCode className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{showQrModal ? "Hide QR" : "QR Code"}</span>
                    </button>

                    <button
                      onClick={copyShareLink}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Share Trip</span>
                    </button>
                  </div>
                </div>

                {/* Shared View Banner notice if loaded from URL */}
                {isSharedView && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
                      <span>Viewing Shared Trip Blueprint for <strong>{destination}</strong> as <strong>Guest Explorer</strong> (No Login Required)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold">Live Shared Plan</span>
                    </div>
                  </div>
                )}

                {/* Toast Notification when link copied */}
                {copyToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-emerald-950 text-white px-4 py-2.5 rounded-xl shadow-lg border border-emerald-700 flex items-center justify-between gap-3 text-xs font-semibold"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Shareable trip URL copied to clipboard! Anyone opening or scanning this link will view this exact plan.</span>
                    </div>
                  </motion.div>
                )}

                {/* QR Code Modal / Card preview */}
                {showQrModal && plan && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-800 flex flex-col md:flex-row items-center gap-5 shadow-xl"
                  >
                    <div className="bg-white p-2.5 rounded-2xl shadow-md shrink-0 text-center space-y-1">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(getShareableTripUrl())}`}
                        alt="Trip QR Code"
                        className="w-32 h-32 object-contain"
                      />
                      <span className="text-[10px] text-gray-500 font-mono block">Scannable 2D QR</span>
                    </div>
                    <div className="space-y-3 text-center md:text-left flex-1 w-full">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-sm text-emerald-100 flex items-center justify-center md:justify-start gap-1.5">
                          <QrCode className="h-4 w-4 text-emerald-400" />
                          Scan to View Trip Plan on Mobile
                        </h5>
                        <button
                          onClick={() => setShowQrModal(false)}
                          className="text-xs text-emerald-300 hover:text-white font-bold px-2 py-0.5 rounded-lg bg-emerald-900/60"
                        >
                          ✕ Close
                        </button>
                      </div>
                      <p className="text-xs text-emerald-200/90 leading-relaxed">
                        Scan this QR code with any smartphone camera to open and view the complete itinerary, weather forecast, and budget guide for <strong>{destination}</strong>.
                      </p>
                      
                      <div className="bg-emerald-900/80 p-2.5 rounded-xl border border-emerald-800/80 flex flex-col sm:flex-row items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={getShareableTripUrl()}
                          className="bg-emerald-950 text-[11px] text-emerald-200 font-mono px-3 py-1.5 rounded-lg w-full outline-none truncate border border-emerald-800"
                        />
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={copyShareLink}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors"
                          >
                            Copy Link
                          </button>
                          <a
                            href={getShareableTripUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <span>Test Link</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>

                      <div className="pt-1 flex flex-wrap gap-2 text-[10px] text-emerald-300 font-mono">
                        <span className="bg-emerald-900 px-2 py-1 rounded border border-emerald-800">
                          🚨 Emergency Support: 112 / 1363 (Tourist Helpline)
                        </span>
                        <span className="bg-emerald-900 px-2 py-1 rounded border border-emerald-800">
                          🏛️ Heritage Care Desk: 1800-425-5111
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* API Status Banner */}
                {plan.apiStatus && (plan.apiStatus.status === "exhausted" || plan.apiStatus.status === "invalid_key") && (
                  <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4.5 space-y-2 text-xs text-amber-900 shadow-sm">
                    <div className="flex items-center gap-2 font-bold">
                      <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>Gemini API Status Notice: Operating in Offline Fallback Mode</span>
                    </div>
                    <p className="text-amber-800 leading-relaxed font-sans">
                      {plan.apiStatus.message}
                    </p>
                    <div className="text-[10px] text-amber-600/90 font-mono mt-1">
                      Our system automatically loaded high-quality pre-cached regional plans so your travel drafting works without interruption.
                    </div>
                  </div>
                )}

                {/* Title Card */}
                <div className="bg-emerald-950 text-white p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                    <Compass className="h-44 w-44 translate-x-10 translate-y-10" />
                  </div>
                  <div className="relative z-10 space-y-2">
                    <div className="text-xs font-mono tracking-widest text-emerald-300 uppercase flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" />
                      <span>Optimized AI Travel Blueprint ({startDate} → {endDate})</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">{plan.title}</h3>
                    <p className="text-xs md:text-sm text-emerald-100/90 leading-relaxed font-sans mt-2">
                      {plan.summary}
                    </p>
                  </div>
                </div>

                {/* 1. AI Seasonal Travel Insights Card */}
                {plan.seasonalInsights && (
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Sun className="h-5 w-5 text-amber-500" />
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">AI Seasonal Travel Insights</h4>
                          <p className="text-[11px] text-gray-400">Weather, festivals & crowd forecasts for your selected dates</p>
                        </div>
                      </div>
                      <div className="bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-amber-200">
                        <span>{plan.seasonalInsights.ratingStars}</span>
                        <span>{plan.seasonalInsights.overallRating}/5.0</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 uppercase font-semibold block">Avg Temperature</span>
                        <span className="text-xs font-bold text-gray-800">{plan.seasonalInsights.avgTemperature}</span>
                      </div>
                      <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 uppercase font-semibold block">Rain Probability</span>
                        <span className="text-xs font-bold text-gray-800">{plan.seasonalInsights.rainProbability}</span>
                      </div>
                      <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 uppercase font-semibold block">Humidity Level</span>
                        <span className="text-xs font-bold text-gray-800">{plan.seasonalInsights.humidity}</span>
                      </div>
                      <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 uppercase font-semibold block">Expected Crowds</span>
                        <span className="text-xs font-bold text-emerald-700">{plan.seasonalInsights.expectedCrowdLevel}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="font-semibold text-gray-700">Local Festivals:</span>
                        {plan.seasonalInsights.majorFestivals.map((f, i) => (
                          <span key={i} className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md font-medium border border-emerald-100">
                            🎉 {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 space-y-1.5 text-xs">
                      <div className="font-semibold text-emerald-950 flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-emerald-600" />
                        <span>Gemini Seasonal Recommendation</span>
                      </div>
                      <p className="text-emerald-900 leading-relaxed">
                        {plan.seasonalInsights.geminiRecommendation}
                      </p>
                      {plan.seasonalInsights.recommendedBetterDates && (
                        <p className="text-emerald-700 text-[11px] italic pt-1 border-t border-emerald-200/60">
                          💡 Alternative Window Tip: {plan.seasonalInsights.recommendedBetterDates}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. AI Budget Optimization & Breakdown */}
                {(() => {
                  const calculatedTotal = (plan.budgetBreakdown.lodging || 0) + (plan.budgetBreakdown.food || 0) + (plan.budgetBreakdown.activities || 0) + (plan.budgetBreakdown.transportation || 0);
                  const displaySavings = plan.budgetOptimization?.potentialSavings ?? Math.round(calculatedTotal * 0.19);
                  const displayOptimizedCost = calculatedTotal - displaySavings;

                  return (
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Wallet className="h-4 w-4 text-emerald-600" /> AI Budget Advisor & Estimates (Per Person)
                          </h4>
                          <p className="text-[11px] text-gray-400 mt-0.5">Estimated expense breakdown per person for {duration} days</p>
                        </div>
                        {plan.budgetOptimization && (
                          <div className="text-xs bg-emerald-100/80 text-emerald-900 font-bold px-3 py-1 rounded-full flex items-center gap-1.5 self-start md:self-auto">
                            <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
                            <span>Potential Savings: {plan.budgetBreakdown.currency}{displaySavings.toLocaleString()} / person</span>
                          </div>
                        )}
                      </div>

                      {/* Prominent Overall Total Price Card */}
                      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white p-4.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-emerald-800">
                        <div>
                          <span className="text-[10px] font-mono tracking-widest text-emerald-300 uppercase block font-bold">
                            Total Estimated Trip Cost (Per Person)
                          </span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-2xl md:text-3xl font-extrabold text-white font-mono">
                              {plan.budgetBreakdown.currency}{calculatedTotal.toLocaleString()}
                            </span>
                            <span className="text-xs text-emerald-200/90 font-normal">
                              ({plan.budgetBreakdown.currency}{Math.round(calculatedTotal / Math.max(1, duration)).toLocaleString()} / day per person)
                            </span>
                          </div>
                          <span className="text-[11px] text-emerald-300/90 block mt-1">
                            Exact sum of Lodging, Food, Activities & Transit per person for {duration} days
                          </span>
                        </div>

                        {plan.budgetOptimization && (
                          <div className="sm:text-right bg-emerald-900/80 p-3 rounded-xl border border-emerald-700/80 shrink-0">
                            <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold block">
                              Gemini Optimized Price
                            </span>
                            <div className="text-xl font-bold font-mono text-emerald-300 mt-0.5">
                              {plan.budgetBreakdown.currency}{displayOptimizedCost.toLocaleString()}
                              <span className="text-xs font-normal text-emerald-200 ml-1">/ person</span>
                            </div>
                            <span className="text-[10px] text-emerald-200 block font-medium">
                              Save {plan.budgetBreakdown.currency}{displaySavings.toLocaleString()} per person
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Category Breakdown Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          {
                            label: "Lodging",
                            value: plan.budgetBreakdown.lodging || 0,
                            rateDetail: `~${plan.budgetBreakdown.currency}${Math.round((plan.budgetBreakdown.lodging || 0) / Math.max(1, duration)).toLocaleString()} / night`,
                            scopeLabel: `Whole Trip (${duration} nights)`,
                            bg: "bg-blue-50/80 text-blue-900 border-blue-100"
                          },
                          {
                            label: "Food & Dining",
                            value: plan.budgetBreakdown.food || 0,
                            rateDetail: `~${plan.budgetBreakdown.currency}${Math.round((plan.budgetBreakdown.food || 0) / Math.max(1, duration)).toLocaleString()} / day`,
                            scopeLabel: `Whole Trip (${duration} days)`,
                            bg: "bg-emerald-50/80 text-emerald-900 border-emerald-100"
                          },
                          {
                            label: "Activities",
                            value: plan.budgetBreakdown.activities || 0,
                            rateDetail: `Entry passes & tours`,
                            scopeLabel: `Whole Trip (${duration} days)`,
                            bg: "bg-amber-50/80 text-amber-900 border-amber-100"
                          },
                          {
                            label: "Transit",
                            value: plan.budgetBreakdown.transportation || 0,
                            rateDetail: `Local cabs & Metro`,
                            scopeLabel: `Whole Trip (${duration} days)`,
                            bg: "bg-purple-50/80 text-purple-900 border-purple-100"
                          }
                        ].map((item) => (
                          <div key={item.label} className={`p-3.5 rounded-xl border flex flex-col justify-between ${item.bg}`}>
                            <div>
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">{item.label}</span>
                                <span className="text-[9px] font-semibold bg-white/80 px-1.5 py-0.5 rounded border border-black/5 text-gray-700">
                                  {item.scopeLabel}
                                </span>
                              </div>
                              <div className="text-base font-bold mt-1.5 font-mono">
                                {plan.budgetBreakdown.currency}{item.value.toLocaleString()}
                              </div>
                            </div>
                            <div className="mt-2 pt-1.5 border-t border-black/5 text-[10px] font-medium text-gray-600 flex items-center justify-between">
                              <span>{item.rateDetail}</span>
                              <span className="text-gray-400">per person</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {plan.budgetOptimization && (
                        <div className="bg-emerald-950 text-white p-4 rounded-xl space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800 pb-2">
                            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                              <DollarSign className="h-4 w-4 text-emerald-400" />
                              Gemini Cost Optimization Summary (Per Person)
                            </span>
                            <div className="text-xs font-mono">
                              Original: <span className="line-through opacity-70">{plan.budgetBreakdown.currency}{calculatedTotal.toLocaleString()}</span>
                              <span className="ml-2 font-bold text-emerald-300">
                                Optimized: {plan.budgetBreakdown.currency}{displayOptimizedCost.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-emerald-100/90 leading-relaxed">
                            {plan.budgetOptimization.explanation}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                            {plan.budgetOptimization.savingsBreakdown.map((s, idx) => (
                              <div key={idx} className="bg-emerald-900/80 p-2.5 rounded-lg border border-emerald-800 flex items-start justify-between gap-2">
                                <div>
                                  <span className="font-semibold text-emerald-300 block">{s.category}</span>
                                  <span className="text-[11px] text-emerald-100/80 leading-tight">{s.suggestion}</span>
                                </div>
                                <span className="text-xs font-bold text-emerald-300 shrink-0">
                                  -{plan.budgetBreakdown.currency}{s.amountSaved}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 3. AI Hotel Recommendations */}
                {plan.hotelRecommendations && plan.hotelRecommendations.length > 0 && (
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                          <Hotel className="h-5 w-5 text-emerald-600" />
                          AI Ranked Hotel Recommendations
                        </h4>
                        <p className="text-[11px] text-gray-400">Dynamically ranked by budget, safety, location, & transit access</p>
                      </div>
                      <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                        Matched to {budget} Tier
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {plan.hotelRecommendations.map((hotel) => (
                        <div key={hotel.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between bg-white">
                          <div>
                            <div className="relative h-36 bg-gray-100">
                              <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                              <div className="absolute top-2 right-2 bg-emerald-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                                {hotel.guestRating}
                              </div>
                            </div>

                            <div className="p-3.5 space-y-2">
                              <div>
                                <h5 className="font-bold text-gray-900 text-xs line-clamp-1">{hotel.name}</h5>
                                <div className="text-emerald-700 font-bold text-sm mt-0.5">{hotel.pricePerNight}</div>
                              </div>

                              <div className="text-[11px] text-gray-500 space-y-1">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                                  <span className="truncate">{hotel.distanceFromAttractions}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Bus className="h-3 w-3 text-gray-400 shrink-0" />
                                  <span className="truncate">{hotel.distanceFromMetro}</span>
                                </div>
                                <div className="flex items-center gap-1 text-emerald-700 font-medium">
                                  <ShieldCheck className="h-3 w-3 shrink-0" />
                                  <span>Safety Score: {hotel.safetyRating}</span>
                                </div>
                              </div>

                              <div className="bg-gray-50 p-2.5 rounded-lg text-[10px] text-gray-600 space-y-1 mt-2 border border-gray-100">
                                <span className="font-semibold text-gray-800 block">Why Gemini Recommends:</span>
                                {hotel.whyRecommended.slice(0, 3).map((reason, i) => (
                                  <div key={i} className="line-clamp-1 text-gray-600">{reason}</div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="p-3 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-1.5 text-[10px] font-semibold">
                            <a
                              href={hotel.bookingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-2 rounded-lg text-center flex items-center justify-center gap-1 transition-colors"
                            >
                              <span>Booking.com</span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                            <a
                              href={hotel.googleHotelsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-2 rounded-lg text-center flex items-center justify-center gap-1 transition-colors"
                            >
                              <span>Google Hotels</span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Day Navigation Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1 border-b border-gray-100 scrollbar-none">
                  {plan.itinerary.map((it) => (
                    <button
                      key={it.dayNumber}
                      onClick={() => setActiveDay(it.dayNumber)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
                        activeDay === it.dayNumber
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Day {it.dayNumber}
                    </button>
                  ))}
                </div>

                {/* Day Theme & Timeline Activities */}
                <AnimatePresence mode="wait">
                  {plan.itinerary.filter(it => it.dayNumber === activeDay).map((day) => (
                    <motion.div
                      key={day.dayNumber}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4"
                    >
                      <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-xs font-medium text-emerald-900">
                        <span className="font-semibold uppercase tracking-wider text-[10px] text-emerald-700 block mb-1">
                          Day {day.dayNumber} Theme Focus
                        </span>
                        {day.theme}
                      </div>

                      <div className="space-y-5 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                        {day.activities.map((act, index) => {
                          const mapsUrl = act.transitInfo?.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.activity + " " + destination)}`;
                          return (
                            <div key={index} className="flex gap-4 items-start relative pl-8">
                              {/* Circle Dot Marker */}
                              <div className="absolute left-1 top-3 h-4.5 w-4.5 rounded-full border-2 border-white shadow-sm flex items-center justify-center bg-emerald-600 z-10" />

                              <div className="flex-1 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3.5">
                                {/* Time & Crowd Density Bar */}
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-100">
                                    <Clock className="h-3.5 w-3.5" /> {act.time}
                                  </span>
                                  
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-gray-400 font-medium">Crowd Density:</span>
                                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                      act.crowdStatus?.toLowerCase() === "low" 
                                        ? "bg-green-50 text-green-700 border border-green-200" 
                                        : act.crowdStatus?.toLowerCase() === "high" 
                                        ? "bg-red-50 text-red-700 border border-red-200" 
                                        : "bg-amber-50 text-amber-700 border border-amber-200"
                                    }`}>
                                      <span className={`h-1.5 w-1.5 rounded-full ${
                                        act.crowdStatus?.toLowerCase() === "low" 
                                          ? "bg-green-600" 
                                          : act.crowdStatus?.toLowerCase() === "high" 
                                          ? "bg-red-600 animate-ping" 
                                          : "bg-amber-600"
                                      }`} />
                                      {act.crowdStatus}
                                    </span>
                                  </div>
                                </div>

                                {/* Title & Description */}
                                <div>
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h5 className="font-bold text-gray-900 text-base">{act.activity}</h5>
                                    <a
                                      href={mapsUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold rounded-lg flex items-center gap-1 border border-emerald-200 transition-colors"
                                    >
                                      <MapPin className="h-3 w-3 text-rose-500" />
                                      <span>Google Maps</span>
                                      <ExternalLink className="h-2.5 w-2.5 text-gray-400" />
                                    </a>
                                  </div>
                                  <p className="text-xs text-gray-600 leading-relaxed mt-1">{act.description}</p>
                                </div>

                                {/* Attraction Specific Details (Metro, Bus, Parking, Accessibility, Wait Time) */}
                                {act.attractionDetails && (
                                  <div className="bg-gray-50/90 p-3 rounded-xl border border-gray-100 text-xs space-y-2">
                                    <div className="font-semibold text-gray-500 text-[10px] uppercase tracking-wider flex items-center gap-1">
                                      <MapPin className="h-3 w-3 text-emerald-600" />
                                      <span>Attraction Logistics & Accessibility</span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[11px] text-gray-700">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-sm">🚇</span>
                                        <div>
                                          <span className="text-[10px] text-gray-400 block leading-tight font-medium">Nearby Metro</span>
                                          <span className="font-semibold text-gray-800">{act.attractionDetails.nearbyMetroStation || "Central Metro"}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-sm">🚌</span>
                                        <div>
                                          <span className="text-[10px] text-gray-400 block leading-tight font-medium">Nearest Bus Stop</span>
                                          <span className="font-semibold text-gray-800">{act.attractionDetails.nearestBusStop || "Main Gate Stop"}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-sm">🅿️</span>
                                        <div>
                                          <span className="text-[10px] text-gray-400 block leading-tight font-medium">Parking</span>
                                          <span className="font-semibold text-gray-800">{act.attractionDetails.parkingAvailability || "Visitor Yard"}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-sm">♿</span>
                                        <div>
                                          <span className="text-[10px] text-gray-400 block leading-tight font-medium">Wheelchair Access</span>
                                          <span className="font-semibold text-gray-800">{act.attractionDetails.wheelchairAccessible || "Yes / Wheelchair Accessible"}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1.5 md:col-span-2">
                                        <span className="text-sm">🎟️</span>
                                        <div>
                                          <span className="text-[10px] text-gray-400 block leading-tight font-medium">Ticket Wait Time</span>
                                          <span className="font-semibold text-gray-800">{act.attractionDetails.ticketWaitingTime || "10 - 15 mins"}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}



                                {/* Tips & Local Secrets */}
                                {act.tips && (
                                  <div className="bg-emerald-50/60 text-emerald-900 p-3 rounded-xl border border-emerald-100 flex items-start gap-2 text-xs">
                                    <Sparkles className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-bold text-emerald-950">Insider Tip: </span>
                                      <span>{act.tips}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* 5. AI Packing Assistant */}
                {plan.packingChecklist && plan.packingChecklist.length > 0 && (() => {
                  const getCategoryIcon = (category: string) => {
                    const lower = (category || "").toLowerCase();
                    if (lower.includes("doc") || lower.includes("id") || lower.includes("pass")) return "📄";
                    if (lower.includes("elec") || lower.includes("tech") || lower.includes("cable")) return "🔌";
                    if (lower.includes("foot") || lower.includes("shoe") || lower.includes("sandal")) return "👟";
                    if (lower.includes("weather") || lower.includes("sun") || lower.includes("rain")) return "☂️";
                    if (lower.includes("attire") || lower.includes("cloth") || lower.includes("dress")) return "👔";
                    if (lower.includes("health") || lower.includes("hydrat") || lower.includes("med") || lower.includes("water")) return "🩺";
                    return "🎒";
                  };

                  const groupedPacking: Record<string, typeof plan.packingChecklist> = {};
                  plan.packingChecklist.forEach(item => {
                    const cat = item.category || "General Essentials";
                    if (!groupedPacking[cat]) groupedPacking[cat] = [];
                    groupedPacking[cat].push(item);
                  });

                  const totalItems = plan.packingChecklist.length;
                  const packedCount = plan.packingChecklist.filter(item => packedState[item.id]).length;
                  const progressPercent = Math.round((packedCount / Math.max(1, totalItems)) * 100);

                  return (
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                            <CheckSquare className="h-5 w-5 text-emerald-600" />
                            AI Smart Packing Assistant
                          </h4>
                          <p className="text-[11px] text-gray-400">Customized checklist grouped by category for {destination} climate & culture</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={downloadChecklist}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>Download Checklist</span>
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Printer className="h-3.5 w-3.5" />
                            <span>Print</span>
                          </button>
                        </div>
                      </div>

                      {/* Progress Indicator */}
                      <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100/90 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-emerald-950">
                          <span>Packing Progress</span>
                          <span className="font-mono">{packedCount} of {totalItems} Packed ({progressPercent}%)</span>
                        </div>
                        <div className="w-full bg-emerald-200/80 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Grouped by Category Name */}
                      <div className="space-y-4 pt-1">
                        {Object.entries(groupedPacking).map(([categoryName, items]) => {
                          const catIcon = getCategoryIcon(categoryName);
                          const catPackedCount = items.filter(i => packedState[i.id]).length;
                          return (
                            <div key={categoryName} className="border border-gray-200/90 rounded-xl overflow-hidden bg-gray-50/30">
                              {/* Category Name Header */}
                              <div className="bg-gray-100/90 px-4 py-2.5 border-b border-gray-200/80 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">{catIcon}</span>
                                  <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                                    {categoryName}
                                  </h5>
                                </div>
                                <span className="text-[10px] font-semibold text-gray-600 bg-white px-2.5 py-0.5 rounded-full border border-gray-200 font-mono">
                                  {catPackedCount} / {items.length}
                                </span>
                              </div>

                              {/* List of Options with Checkboxes */}
                              <div className="p-3 space-y-2 bg-white">
                                {items.map((item) => {
                                  const isPacked = packedState[item.id];
                                  return (
                                    <div
                                      key={item.id}
                                      onClick={() => togglePackingItem(item.id)}
                                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 select-none ${
                                        isPacked
                                          ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
                                          : "bg-white border-gray-200/90 text-gray-800 hover:border-gray-300 hover:bg-gray-50/50"
                                      }`}
                                    >
                                      <button className="mt-0.5 text-emerald-600 shrink-0 focus:outline-none">
                                        {isPacked ? <CheckSquare className="h-4.5 w-4.5 text-emerald-600" /> : <Square className="h-4.5 w-4.5 text-gray-400" />}
                                      </button>
                                      <div className="space-y-0.5 flex-1">
                                        <div className={`text-xs font-semibold ${isPacked ? "line-through text-emerald-800 opacity-80" : "text-gray-900"}`}>
                                          {item.item}
                                        </div>
                                        <p className="text-[11px] text-gray-500 leading-relaxed">
                                          {item.reason}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* 6. Powered by Google Gemini Branding Card */}
                <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-emerald-900 text-white p-5 rounded-2xl border border-emerald-800/80 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
                    <h4 className="font-bold text-sm tracking-tight">Powered by Google Gemini 2.5 Flash</h4>
                  </div>
                  <p className="text-xs text-emerald-100/90 leading-relaxed">
                    This travel planner combines deep geographical reasoning, climate data, regional heritage crowd heatmaps, and local economic benchmarks to build synchronized travel itineraries.
                  </p>
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono text-emerald-300 pt-1 border-t border-emerald-800/60">
                    <span className="bg-emerald-900 px-2 py-0.5 rounded border border-emerald-700">✓ Seasonal Insights</span>
                    <span className="bg-emerald-900 px-2 py-0.5 rounded border border-emerald-700">✓ Hotel Ranking Engine</span>
                    <span className="bg-emerald-900 px-2 py-0.5 rounded border border-emerald-700">✓ Budget Optimization</span>
                    <span className="bg-emerald-900 px-2 py-0.5 rounded border border-emerald-700">✓ Interactive Maps</span>
                    <span className="bg-emerald-900 px-2 py-0.5 rounded border border-emerald-700">✓ Packing Assistant</span>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
