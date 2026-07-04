import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  Building, TrendingUp, Shield, Activity, Users, DollarSign, 
  RefreshCw, AlertCircle, Sparkles, CheckCircle, Award, Heart, Search, MapPin
} from "lucide-react";
import { AnalyticsDashboardData } from "../types";

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState<string>("South India Heritage Arc");
  const [customInput, setCustomInput] = useState<string>("South India Heritage Arc");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("Last 30 Days");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<AnalyticsDashboardData | null>(null);

  const fetchAnalytics = async (regionToFetch = selectedRegion) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedRegion: regionToFetch,
          selectedTimeframe
        })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch official analytics from advisor engine.");
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(selectedRegion);
  }, [selectedRegion, selectedTimeframe]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      setSelectedRegion(customInput.trim());
    }
  };

  const handleQuickSelect = (region: string) => {
    setCustomInput(region);
    setSelectedRegion(region);
  };

  const quickPresets = [
    "South India Heritage Arc",
    "Golden Triangle Arc",
    "Brihadisvara Temple, Thanjavur",
    "Hampi Ruins, Karnataka",
    "Machu Picchu, Peru",
    "Rome Colosseum, Italy"
  ];

  // Sentiment colors
  const SENTIMENT_COLORS = ["#10b981", "#6b7280", "#ef4444"];

  return (
    <div id="analytics-dashboard-section" className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-gray-100 pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            Decision Intelligence Dashboard
          </h2>
          <p className="text-gray-500 text-sm max-w-2xl">
            Real-time municipal advisory report, crowd trends, sentiment analysis, and structural health tracking. Enter any architectural heritage monument globally.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Report Cycle:</span>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="text-xs bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 3 Months">Last 3 Months</option>
            <option value="Last 6 Months">Last 6 Months</option>
            <option value="Annual Audit Cycle">Annual Audit Cycle</option>
          </select>
        </div>
      </div>

      {/* Dynamic Architecture Input Panel */}
      <div className="bg-gray-50 border border-gray-200/60 p-5 rounded-2xl space-y-4">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <MapPin className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="e.g. Brihadisvara Temple, Machu Picchu, Ajanta Caves, Taj Mahal..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 placeholder:text-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !customInput.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm shrink-0"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 text-amber-300" />
            )}
            Generate Custom AI Report
          </button>
        </form>

        {/* Quick presets row */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Popular Architectural Hubs</span>
          <div className="flex flex-wrap gap-2">
            {quickPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleQuickSelect(preset)}
                className={`text-[11px] px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  selectedRegion === preset
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Active Analysis Header Banner */}
      <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <p className="text-xs text-indigo-950 font-medium">
            Active Analytics Feed for: <span className="font-bold text-indigo-700 font-sans">"{selectedRegion}"</span>
          </p>
        </div>
        <div className="text-[10px] font-mono font-bold text-indigo-500 bg-indigo-100/50 px-2.5 py-1 rounded-md">
          MUNICIPAL GRADE SIMULATION
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-4 py-20"
          >
            <div className="relative inline-block">
              <div className="h-14 w-14 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
              <Activity className="h-5 w-5 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-gray-900">Synthesizing Advisory Telemetry...</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Compiling feedback sentiment, ticketing revenues, structural sensor streams, and eco-tourism recommendations.
              </p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Advisory synthesis failed</h4>
              <p className="text-xs text-red-700 mt-1">{error}</p>
              <button
                onClick={fetchAnalytics}
                className="text-xs font-semibold text-red-900 underline mt-2"
              >
                Retry Request
              </button>
            </div>
          </motion.div>
        )}

        {!loading && !error && dashboardData && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">Est. Period Visitors</span>
                  <span className="font-bold text-gray-900 text-lg">
                    {dashboardData.visitorTraffic.reduce((acc, curr) => acc + curr.visitors, 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-green-600 font-medium block mt-0.5">↑ 12% vs last cycle</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">Est. Revenue Share</span>
                  <span className="font-bold text-gray-900 text-lg">
                    {dashboardData.visitorTraffic[0]?.revenue ? (
                      `₹${dashboardData.visitorTraffic.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}`
                    ) : "₹3,45,000"}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">Supporting local artisans</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">Conservation Urgency</span>
                  <span className="font-bold text-amber-800 text-lg">Moderate</span>
                  <span className="text-[10px] text-amber-600 font-medium block mt-0.5">3 Advisory measures active</span>
                </div>
              </div>
            </div>

            {/* Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Traffic & Revenue Line Chart */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  📈 Visitor Trends & Ticketing Revenue
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardData.visitorTraffic}>
                      <defs>
                        <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                      <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
                      <Tooltip />
                      <Area type="monotone" dataKey="visitors" stroke="#4f46e5" fillOpacity={1} fill="url(#colorVisitors)" name="Tourists" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Popular Attractions Bar Chart */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  🏰 Monument Popularity & Visitor Share
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.attractionsPopularity}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                      <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
                      <Tooltip />
                      <Bar dataKey="percentage" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Visitor Share %">
                        {dashboardData.attractionsPopularity.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? "#10b981" : index === 1 ? "#3b82f6" : "#f59e0b"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Hourly Heatmap Trend */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  ⏰ 24-Hour Crowd Heatmap & Queue Density
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboardData.hourlyCrowdHeatmap.slice(6, 20)}> {/* zoom in daytime */}
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#9ca3af" />
                      <Tooltip />
                      <Line type="monotone" dataKey="density" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Crowd Level" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sentiment & Qualitatitve feedback */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    😊 Tourist Sentiment Shares
                  </h3>
                  <div className="h-44 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Positive Feedback", value: dashboardData.touristSentiment.positive },
                            { name: "Neutral Feedback", value: dashboardData.touristSentiment.neutral },
                            { name: "Negative Feedback", value: dashboardData.touristSentiment.negative }
                          ]}
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {SENTIMENT_COLORS.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center space-y-0.5">
                      <span className="block text-2xl font-bold text-green-600">{dashboardData.touristSentiment.positive}%</span>
                      <span className="block text-[10px] text-gray-400 uppercase font-semibold">Positive</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    💬 Recent Visitor Feedback
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {dashboardData.touristSentiment.keyFeedback.map((feedback, idx) => (
                      <div key={idx} className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs text-gray-600 leading-relaxed italic">
                        "{feedback}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Heritage Conservation Advisory Report */}
            <div className="bg-indigo-950 text-white p-6 rounded-2xl space-y-6">
              <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                <Shield className="h-6 w-6 text-indigo-300" />
                <div>
                  <h3 className="text-base font-semibold text-white">AI Heritage Conservation Advisory Report</h3>
                  <p className="text-xs text-indigo-200">Prepared by the chief AI Advisory agent in partnership with local municipalities.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-indigo-200 uppercase tracking-wider">Structural Health & Stone Decay Observations</h4>
                    <p className="text-indigo-100/90 leading-relaxed">{dashboardData.conservationAdvisory.structuralHealthSummary}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-indigo-200 uppercase tracking-wider">Environmental Impact Assessment</h4>
                    <p className="text-indigo-100/90 leading-relaxed">{dashboardData.conservationAdvisory.environmentalFactors}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-bold text-indigo-200 uppercase tracking-wider">Recommended Conservation Measures</h4>
                    <ul className="space-y-1.5 list-disc pl-4 text-indigo-100/90 leading-relaxed">
                      {dashboardData.conservationAdvisory.conservationActions.map((action, idx) => (
                        <li key={idx}>{action}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1.5">
                    <h4 className="font-bold text-amber-300 uppercase tracking-wider">Suggested Budget Distribution</h4>
                    <p className="text-indigo-100/95 leading-relaxed">{dashboardData.conservationAdvisory.budgetAllocationRecommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
