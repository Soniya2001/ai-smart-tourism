import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, Calendar, Wallet, MapPin, Bus, Sun, Users, Sparkles, 
  ChevronRight, ArrowRight, RefreshCw, AlertCircle, Clock, Heart, HelpCircle 
} from "lucide-react";
import { TravelPlan } from "../types";

export default function TravelPlanner() {
  const [destination, setDestination] = useState("Madurai, Tamil Nadu");
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState("Moderate");
  const [interests, setInterests] = useState<string[]>(["History", "Architecture", "Food"]);
  const [transport, setTransport] = useState("Auto-Rickshaw & Cabs");
  const [weather, setWeather] = useState("Sunny & Warm");
  const [crowdPreference, setCrowdPreference] = useState("Avoid peak hours (Smart Flow)");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [activeDay, setActiveDay] = useState<number>(1);

  const interestOptions = ["History", "Architecture", "Spiritual", "Culinary/Food", "Shopping", "Arts & Crafts", "Nature & Parks"];

  const handleInterestToggle = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
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
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while planning your trip.");
    } finally {
      setLoading(false);
    }
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
            <Compass className="h-6 w-6 text-emerald-600" />
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
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
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

          {/* Duration & Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-400" />
                Duration (Days)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                />
                <span className="text-sm font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded min-w-[32px] text-center">
                  {duration}
                </span>
              </div>
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
                    Optimizing schedules based on heatmaps for {destination}, matching local temple opening hours, and structuring support for local community stores.
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
                    Select your favorite living heritage destination on the left, customize your weather, interests and transport, and tap generate!
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
                {/* Title Card */}
                <div className="bg-emerald-950 text-white p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                    <Compass className="h-44 w-44 translate-x-10 translate-y-10" />
                  </div>
                  <div className="relative z-10 space-y-2">
                    <div className="text-xs font-mono tracking-widest text-emerald-300 uppercase flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" />
                      <span>Optimized AI Travel Blueprint</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">{plan.title}</h3>
                    <p className="text-xs md:text-sm text-emerald-100/90 leading-relaxed font-sans mt-2">
                      {plan.summary}
                    </p>
                  </div>
                </div>

                {/* Budget Estimate Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5 text-gray-400" /> Budget Breakdown Estimates
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Lodging", value: plan.budgetBreakdown.lodging, bg: "bg-blue-50 text-blue-800" },
                      { label: "Activities", value: plan.budgetBreakdown.activities, bg: "bg-amber-50 text-amber-800" },
                      { label: "Food & Dining", value: plan.budgetBreakdown.food, bg: "bg-emerald-50 text-emerald-800" },
                      { label: "Transit", value: plan.budgetBreakdown.transportation, bg: "bg-purple-50 text-purple-800" }
                    ].map((item) => (
                      <div key={item.label} className={`p-3.5 rounded-xl ${item.bg}`}>
                        <div className="text-[10px] font-medium opacity-80 uppercase tracking-wider">{item.label}</div>
                        <div className="text-base font-bold mt-1">
                          {plan.budgetBreakdown.currency}{item.value.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                    <span>*Calculated based on a <b>{budget}</b> tier multiplier.</span>
                    <span className="font-semibold text-gray-800">
                      Total: {plan.budgetBreakdown.currency}
                      {((plan.budgetBreakdown.lodging || 0) + (plan.budgetBreakdown.activities || 0) + (plan.budgetBreakdown.food || 0) + (plan.budgetBreakdown.transportation || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>

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

                      <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                        {day.activities.map((act, index) => (
                          <div key={index} className="flex gap-4 items-start relative pl-8">
                            {/* Circle Dot Marker */}
                            <div className="absolute left-1 top-2.5 h-4.5 w-4.5 rounded-full border-2 border-white shadow-sm flex items-center justify-center bg-emerald-600 z-10" />

                            <div className="flex-1 bg-white p-4.5 rounded-xl border border-gray-200 shadow-sm space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-50 pb-1.5">
                                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> {act.time}
                                </span>
                                
                                {/* Crowd indicator */}
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] text-gray-400">Crowd Density:</span>
                                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                    act.crowdStatus?.toLowerCase() === "low" 
                                      ? "bg-green-50 text-green-700" 
                                      : act.crowdStatus?.toLowerCase() === "high" 
                                      ? "bg-red-50 text-red-700" 
                                      : "bg-amber-50 text-amber-700"
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

                              <h5 className="font-semibold text-gray-900 text-sm">{act.activity}</h5>
                              <p className="text-xs text-gray-500 leading-relaxed">{act.description}</p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px] border-t border-gray-50 mt-1">
                                <div className="text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                                  <Bus className="h-3.5 w-3.5 text-gray-400" />
                                  <span>Transit: <b>{act.transportRecommendation}</b></span>
                                </div>
                                <div className="text-emerald-800 bg-emerald-50/40 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                                  <Sparkles className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                  <span className="line-clamp-2">Tip: {act.tips}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
