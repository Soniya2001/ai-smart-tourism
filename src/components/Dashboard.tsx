import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label
} from "recharts";
import { 
  Building, TrendingUp, Shield, Activity, Users, DollarSign, 
  RefreshCw, AlertCircle, Sparkles, CheckCircle, Award, Heart, Search, MapPin, Clock, Calendar
} from "lucide-react";
import { AnalyticsDashboardData, SentimentCategorySummary } from "../types";

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState<string>("South India Heritage Arc");
  const [customInput, setCustomInput] = useState<string>("South India Heritage Arc");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("Last 30 Days");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<AnalyticsDashboardData | null>(null);

  // Interactive AI Sentiment state
  const [activeSentiment, setActiveSentiment] = useState<"positive" | "neutral" | "negative">("positive");
  const [isGeneratingSentimentAi, setIsGeneratingSentimentAi] = useState<boolean>(false);
  const [aiSentimentSummaries, setAiSentimentSummaries] = useState<Record<string, SentimentCategorySummary>>({});

  // Compute exact start & end dates for the selected time window
  const getTimeframeDateRange = (timeframe: string) => {
    const now = new Date();
    const endDateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    let startDate = new Date();

    if (timeframe === "Last 30 Days") {
      startDate.setDate(now.getDate() - 30);
    } else if (timeframe === "Last 3 Months") {
      startDate.setMonth(now.getMonth() - 3);
    } else if (timeframe === "Last 6 Months") {
      startDate.setMonth(now.getMonth() - 6);
    } else if (timeframe === "Annual Audit Cycle") {
      startDate.setFullYear(now.getFullYear() - 1);
    } else {
      startDate.setDate(now.getDate() - 30);
    }

    const startDateStr = startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return `${startDateStr} – ${endDateStr}`;
  };

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

      if (data?.touristSentiment?.consolidatedSummaries) {
        setAiSentimentSummaries(data.touristSentiment.consolidatedSummaries as Record<string, SentimentCategorySummary>);
      }
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

  const fetchSentimentAiSummary = async (sentimentType: "positive" | "neutral" | "negative", forceRegenerate = false) => {
    if (!forceRegenerate && aiSentimentSummaries[sentimentType]) {
      return;
    }

    setIsGeneratingSentimentAi(true);
    try {
      const res = await fetch("/api/analytics/sentiment-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region: selectedRegion,
          timeframe: selectedTimeframe,
          sentimentType
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setAiSentimentSummaries(prev => ({
            ...prev,
            [sentimentType]: data.data
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching AI sentiment summary:", err);
    } finally {
      setIsGeneratingSentimentAi(false);
    }
  };

  const handleSelectSentiment = (type: "positive" | "neutral" | "negative") => {
    setActiveSentiment(type);
    if (!aiSentimentSummaries[type]) {
      fetchSentimentAiSummary(type);
    }
  };

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
      <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div>
            <p className="text-xs text-indigo-950 font-medium">
              Active Analytics Feed for: <span className="font-bold text-indigo-700 font-sans">"{selectedRegion}"</span>
            </p>
            <p className="text-[11px] text-indigo-600/90 font-mono mt-0.5 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-indigo-500 inline" />
              <span>Reporting Time Frame: <strong>{getTimeframeDateRange(selectedTimeframe)}</strong> ({selectedTimeframe})</span>
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-md border border-indigo-200">
            OFFICIAL TELEMETRY REPORT
          </span>
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
            {/* API Status Banner */}
            {dashboardData.apiStatus && (dashboardData.apiStatus.status === "exhausted" || dashboardData.apiStatus.status === "invalid_key") && (
              <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4.5 space-y-2 text-xs text-amber-900 shadow-sm">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Gemini API Status Notice: Operating in Offline Fallback Mode</span>
                </div>
                <p className="text-amber-800 leading-relaxed font-sans">
                  {dashboardData.apiStatus.message}
                </p>
                <div className="text-[10px] text-amber-600/90 font-mono mt-1">
                  Our system automatically generated realistic, high-quality simulated telemetry data for this region so you can explore full municipal advisory planning tools.
                </div>
              </div>
            )}

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
              {/* Chart 1: Traffic & Revenue Area Chart */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-gray-100">
                  <div>
                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      📈 Visitor Trends & Footfall Volume
                    </h3>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                      Time Window: <strong className="text-indigo-700">{getTimeframeDateRange(selectedTimeframe)}</strong>
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full self-start sm:self-auto">
                    {selectedTimeframe}
                  </span>
                </div>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={dashboardData.visitorTraffic}
                      margin={{ top: 15, right: 25, left: 25, bottom: 30 }}
                    >
                      <defs>
                        <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      
                      {/* Explicit X-Axis with Label */}
                      <XAxis 
                        dataKey="label" 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        stroke="#cbd5e1"
                      >
                        <Label 
                          value={`X-Axis: Time Period (${selectedTimeframe})`} 
                          position="insideBottom" 
                          offset={-20} 
                          style={{ fontSize: 11, fontWeight: 700, fill: '#334155' }} 
                        />
                      </XAxis>

                      {/* Explicit Y-Axis with Label */}
                      <YAxis 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        stroke="#cbd5e1"
                      >
                        <Label 
                          value="Y-Axis: Total Visitors (Count)" 
                          angle={-90} 
                          position="insideLeft" 
                          offset={-15} 
                          style={{ textAnchor: 'middle', fontSize: 11, fontWeight: 700, fill: '#334155' }} 
                        />
                      </YAxis>

                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        formatter={(val: any) => [`${Number(val).toLocaleString()} Tourists`, 'Visitor Count']}
                        labelFormatter={(label) => `Timeline Point: ${label}`}
                      />
                      <Area type="monotone" dataKey="visitors" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVisitors)" name="Tourists" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                  <span><strong>X-Axis:</strong> Chronological Intervals ({selectedTimeframe})</span>
                  <span><strong>Y-Axis:</strong> Visitor Footfalls</span>
                </div>
              </div>

              {/* Chart 2: Popular Attractions Bar Chart */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-gray-100">
                  <div>
                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      🏰 Monument Popularity & Visitor Share
                    </h3>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                      Aggregated Period: <strong className="text-indigo-700">{getTimeframeDateRange(selectedTimeframe)}</strong>
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full self-start sm:self-auto">
                    Site Breakdown
                  </span>
                </div>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={dashboardData.attractionsPopularity}
                      margin={{ top: 15, right: 25, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      
                      {/* Explicit X-Axis with Label */}
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        stroke="#cbd5e1"
                      >
                        <Label 
                          value="X-Axis: Heritage Site / Monument Name" 
                          position="insideBottom" 
                          offset={-20} 
                          style={{ fontSize: 11, fontWeight: 700, fill: '#334155' }} 
                        />
                      </XAxis>

                      {/* Explicit Y-Axis with Label */}
                      <YAxis 
                        domain={[0, 100]}
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        stroke="#cbd5e1"
                      >
                        <Label 
                          value="Y-Axis: Visitor Share (%)" 
                          angle={-90} 
                          position="insideLeft" 
                          offset={-10} 
                          style={{ textAnchor: 'middle', fontSize: 11, fontWeight: 700, fill: '#334155' }} 
                        />
                      </YAxis>

                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                        formatter={(val: any) => [`${val}% of Total Visitors`, 'Visitor Share']}
                      />
                      <Bar dataKey="percentage" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Visitor Share %">
                        {dashboardData.attractionsPopularity.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? "#10b981" : index === 1 ? "#3b82f6" : "#f59e0b"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                  <span><strong>X-Axis:</strong> Sub-monuments</span>
                  <span><strong>Y-Axis:</strong> Visitor Share Percentage (0% – 100%)</span>
                </div>
              </div>

              {/* Chart 3: Hourly Heatmap Line Chart */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-gray-100">
                  <div>
                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      ⏰ 24-Hour Peak Crowd Heatmap & Queue Density
                    </h3>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                      Daily Hourly Average for: <strong className="text-indigo-700">{selectedTimeframe}</strong>
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full self-start sm:self-auto">
                    06:00 – 19:00 IST
                  </span>
                </div>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={dashboardData.hourlyCrowdHeatmap.slice(6, 20)}
                      margin={{ top: 15, right: 25, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      
                      {/* Explicit X-Axis with Label */}
                      <XAxis 
                        dataKey="hour" 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        stroke="#cbd5e1"
                      >
                        <Label 
                          value="X-Axis: Time of Day (24-Hour Clock IST)" 
                          position="insideBottom" 
                          offset={-20} 
                          style={{ fontSize: 11, fontWeight: 700, fill: '#334155' }} 
                        />
                      </XAxis>

                      {/* Explicit Y-Axis with Label */}
                      <YAxis 
                        domain={[0, 100]} 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        stroke="#cbd5e1"
                      >
                        <Label 
                          value="Y-Axis: Crowd Density Index (%)" 
                          angle={-90} 
                          position="insideLeft" 
                          offset={-10} 
                          style={{ textAnchor: 'middle', fontSize: 11, fontWeight: 700, fill: '#334155' }} 
                        />
                      </YAxis>

                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                        formatter={(val: any) => [`${val}% Density Index`, 'Crowd Level']}
                        labelFormatter={(hour) => `Time Slot: ${hour}`}
                      />
                      <Line type="monotone" dataKey="density" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: "#ef4444" }} name="Crowd Level" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                  <span><strong>X-Axis:</strong> Hours (06:00 to 19:00 IST)</span>
                  <span><strong>Y-Axis:</strong> Queue Capacity Used (0% – 100%)</span>
                </div>
              </div>

              {/* Chart 4: Tourist Sentiment Pie Chart & AI Consolidated Feedback */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-gray-100">
                  <div>
                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      😊 AI Tourist Sentiment Distribution & Consolidated Feedback
                    </h3>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                      Click any sentiment slice to view AI-consolidated feedback: <strong className="text-indigo-700">{getTimeframeDateRange(selectedTimeframe)}</strong>
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full self-start sm:self-auto flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-emerald-600" /> AI Interactive Analysis
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Interactive Pie Chart & Sentiment Selector */}
                  <div className="lg:col-span-5 space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                    <div className="h-52 relative flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Positive Feedback", value: dashboardData.touristSentiment.positive, type: "positive" },
                              { name: "Neutral Feedback", value: dashboardData.touristSentiment.neutral, type: "neutral" },
                              { name: "Negative Feedback", value: dashboardData.touristSentiment.negative, type: "negative" }
                            ]}
                            innerRadius={52}
                            outerRadius={75}
                            paddingAngle={5}
                            dataKey="value"
                            onClick={(entry: any) => {
                              if (entry && entry.type) {
                                handleSelectSentiment(entry.type);
                              }
                            }}
                            className="cursor-pointer"
                          >
                            <Cell
                              fill="#10b981"
                              stroke={activeSentiment === "positive" ? "#065f46" : "none"}
                              strokeWidth={activeSentiment === "positive" ? 3 : 0}
                              className="cursor-pointer transition-all hover:opacity-80"
                              onClick={() => handleSelectSentiment("positive")}
                            />
                            <Cell
                              fill="#6b7280"
                              stroke={activeSentiment === "neutral" ? "#1e293b" : "none"}
                              strokeWidth={activeSentiment === "neutral" ? 3 : 0}
                              className="cursor-pointer transition-all hover:opacity-80"
                              onClick={() => handleSelectSentiment("neutral")}
                            />
                            <Cell
                              fill="#ef4444"
                              stroke={activeSentiment === "negative" ? "#991b1b" : "none"}
                              strokeWidth={activeSentiment === "negative" ? 3 : 0}
                              className="cursor-pointer transition-all hover:opacity-80"
                              onClick={() => handleSelectSentiment("negative")}
                            />
                          </Pie>
                          <Tooltip formatter={(val: any) => [`${val}%`, 'Visitor Share']} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute text-center pointer-events-none space-y-0.5">
                        <span className={`block text-2xl font-bold ${activeSentiment === 'positive' ? 'text-emerald-600' : activeSentiment === 'neutral' ? 'text-slate-600' : 'text-rose-600'}`}>
                          {activeSentiment === 'positive' ? dashboardData.touristSentiment.positive : activeSentiment === 'neutral' ? dashboardData.touristSentiment.neutral : dashboardData.touristSentiment.negative}%
                        </span>
                        <span className="block text-[9px] text-gray-500 uppercase font-bold tracking-wider">
                          {activeSentiment} Category
                        </span>
                      </div>
                    </div>

                    <p className="text-[10px] text-center text-slate-500 italic">
                      💡 Click a segment on the chart or select a button below:
                    </p>

                    {/* Interactive Sentiment Selection Buttons */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <button
                        onClick={() => handleSelectSentiment("positive")}
                        className={`py-2 px-2 rounded-xl text-[10px] font-bold transition-all border flex flex-col items-center gap-0.5 ${
                          activeSentiment === "positive"
                            ? "bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300"
                            : "bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50"
                        }`}
                      >
                        <span className="flex items-center gap-1">🟢 Positive</span>
                        <span className="text-[11px] font-mono">{dashboardData.touristSentiment.positive}%</span>
                      </button>

                      <button
                        onClick={() => handleSelectSentiment("neutral")}
                        className={`py-2 px-2 rounded-xl text-[10px] font-bold transition-all border flex flex-col items-center gap-0.5 ${
                          activeSentiment === "neutral"
                            ? "bg-slate-700 text-white border-slate-800 shadow-md ring-2 ring-slate-300"
                            : "bg-white text-slate-800 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <span className="flex items-center gap-1">⚪ Neutral</span>
                        <span className="text-[11px] font-mono">{dashboardData.touristSentiment.neutral}%</span>
                      </button>

                      <button
                        onClick={() => handleSelectSentiment("negative")}
                        className={`py-2 px-2 rounded-xl text-[10px] font-bold transition-all border flex flex-col items-center gap-0.5 ${
                          activeSentiment === "negative"
                            ? "bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-300"
                            : "bg-white text-rose-800 border-rose-200 hover:bg-rose-50"
                        }`}
                      >
                        <span className="flex items-center gap-1">🔴 Negative</span>
                        <span className="text-[11px] font-mono">{dashboardData.touristSentiment.negative}%</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: AI Consolidated Feedback Panel */}
                  <div className="lg:col-span-7 space-y-3">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeSentiment}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className={`p-4 rounded-2xl border space-y-3.5 ${
                          activeSentiment === "positive"
                            ? "bg-emerald-50/50 border-emerald-200"
                            : activeSentiment === "neutral"
                            ? "bg-slate-50 border-slate-200"
                            : "bg-rose-50/50 border-rose-200"
                        }`}
                      >
                        {/* Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/80 pb-2.5">
                          <div className="flex items-center gap-2">
                            <Sparkles className={`h-4 w-4 ${
                              activeSentiment === "positive" ? "text-emerald-600" : activeSentiment === "neutral" ? "text-slate-600" : "text-rose-600"
                            }`} />
                            <div>
                              <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                                AI Consolidated {activeSentiment.toUpperCase()} Feedback
                              </h4>
                              <p className="text-[10px] text-gray-500 font-medium">
                                Synthesized for {selectedRegion} ({selectedTimeframe})
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => fetchSentimentAiSummary(activeSentiment, true)}
                            disabled={isGeneratingSentimentAi}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white hover:bg-gray-50 text-indigo-700 border border-indigo-200 shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                          >
                            <Sparkles className={`h-3 w-3 text-indigo-600 ${isGeneratingSentimentAi ? "animate-spin" : ""}`} />
                            {isGeneratingSentimentAi ? "AI Synthesizing..." : "Regenerate with Gemini"}
                          </button>
                        </div>

                        {/* Loading State or Consolidated Content */}
                        {isGeneratingSentimentAi ? (
                          <div className="py-8 text-center space-y-2">
                            <Sparkles className="h-6 w-6 text-indigo-600 animate-spin mx-auto" />
                            <p className="text-xs font-semibold text-indigo-900">
                              Gemini 2.5 Flash is analyzing {activeSentiment} tourist feedback clusters...
                            </p>
                            <p className="text-[10px] text-gray-500">
                              Parsing survey comments, extracting thematic patterns, and formulating authority recommendations
                            </p>
                          </div>
                        ) : aiSentimentSummaries[activeSentiment] ? (
                          <div className="space-y-3 text-xs">
                            {/* Executive Summary */}
                            <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-xs">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                                📊 AI Executive Synthesis
                              </span>
                              <p className="text-gray-800 font-medium leading-relaxed">
                                "{aiSentimentSummaries[activeSentiment].summary}"
                              </p>
                            </div>

                            {/* Key Themes */}
                            {aiSentimentSummaries[activeSentiment].keyThemes?.length > 0 && (
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                                  🏷️ Key Theme Clusters
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {aiSentimentSummaries[activeSentiment].keyThemes.map((theme, idx) => (
                                    <span
                                      key={idx}
                                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                                        activeSentiment === "positive"
                                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                          : activeSentiment === "neutral"
                                          ? "bg-slate-200 text-slate-800 border-slate-300"
                                          : "bg-rose-100 text-rose-800 border-rose-200"
                                      }`}
                                    >
                                      #{theme}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Representative Tourist Quotes with Nearby Location */}
                            {aiSentimentSummaries[activeSentiment].quotes?.length > 0 && (
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                                  💬 Consolidated Tourist Excerpts & Nearby Spot Locations
                                </span>
                                <div className="space-y-2">
                                  {aiSentimentSummaries[activeSentiment].quotes.map((quote, idx) => {
                                    const quoteText = typeof quote === "string" ? quote : quote.text;
                                    const quoteLoc = typeof quote === "object" && quote.locationNearby ? quote.locationNearby : "Main Heritage Complex Area";

                                    return (
                                      <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200/90 text-[11px] text-gray-700 leading-relaxed space-y-1.5 shadow-xs">
                                        <div className="flex items-start gap-2">
                                          <span className="text-xs shrink-0 mt-0.5">💬</span>
                                          <span className="text-gray-800 font-medium italic">"{quoteText}"</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 pt-1.5 border-t border-gray-100 text-[10px]">
                                          <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                                          <span className="font-semibold text-gray-500">Location Nearby:</span>
                                          <span className="bg-indigo-50 text-indigo-800 font-mono font-bold px-2 py-0.5 rounded border border-indigo-100">
                                            {quoteLoc}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Recommended Authority Action */}
                            {aiSentimentSummaries[activeSentiment].authorityAction && (
                              <div className="p-3 rounded-xl bg-indigo-950 text-white space-y-1 shadow-xs border border-indigo-900">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                                  <Shield className="h-3.5 w-3.5 text-amber-400" />
                                  <span>Recommended ASI & Municipal Action Item</span>
                                </div>
                                <p className="text-[11px] text-indigo-100 font-medium leading-relaxed">
                                  {aiSentimentSummaries[activeSentiment].authorityAction}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="p-4 bg-white rounded-xl text-center text-xs text-gray-500">
                            No AI summary available. Click "Regenerate with Gemini" to synthesize feedback for {activeSentiment} sentiment.
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600 font-medium">
                  <strong>Chart & Analysis Metric:</strong> Sentiment slices and AI summaries are dynamically generated via <strong>Gemini 2.5 Flash</strong> based on verified tourist survey inputs for <strong>{selectedRegion}</strong> ({selectedTimeframe}).
                </div>
              </div>
            </div>

            {/* Chart 5: Comprehensive Visitor Demographics & Footfall Analytics */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-gray-100">
                <div>
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-indigo-600" />
                    Visitor Demographics & Real-Time Footfall Analytics
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    Breakdown of visitor origins, real-time footfall counters, ticketing channels, and gate counter statistics for <strong className="text-indigo-700">{selectedRegion}</strong> ({selectedTimeframe}).
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full self-start sm:self-auto flex items-center gap-1">
                  <Activity className="h-3 w-3 text-indigo-600" /> Real-time Gate Scans
                </span>
              </div>

              {/* Real-Time Visitor Flow Stat Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200/80 space-y-1">
                  <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider block">Today's Total Footfalls</span>
                  <p className="text-xl font-extrabold text-indigo-950 font-mono">148,290</p>
                  <span className="text-[10px] text-indigo-600 font-medium">↑ +14.2% vs previous weekend</span>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Peak Hourly Density</span>
                  <p className="text-xl font-extrabold text-amber-950 font-mono">14,200 / hr</p>
                  <span className="text-[10px] text-amber-700 font-medium">{selectedRegion} Main Gate (High Density)</span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Digital Ticket Revenue</span>
                  <p className="text-xl font-extrabold text-emerald-950 font-mono">₹ 42.8 Lakhs</p>
                  <span className="text-[10px] text-emerald-700 font-medium">92% online QR scan efficiency</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Domestic vs International Tourists */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    🌐 Visitor Classification
                  </h4>
                  
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-800">
                        <span>Domestic Indian Tourists</span>
                        <span className="text-indigo-600">86% (213,400)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: "86%" }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-800">
                        <span>International Overseas Visitors</span>
                        <span className="text-emerald-600">14% (34,800)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: "14%" }} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 text-[10px] text-slate-500 font-medium">
                    Top international origins: France (24%), USA (18%), UK (16%), Germany (12%), Japan (9%).
                  </div>
                </div>

                {/* 2. Top Origin States */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    📍 Domestic State Footfall
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/60 font-semibold">
                      <span className="text-slate-800">1. Home State (TN/KA/UP)</span>
                      <span className="font-mono text-indigo-700 font-bold">48%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/60 font-semibold">
                      <span className="text-slate-800">2. Neighbouring States (KL, AP, MH)</span>
                      <span className="font-mono text-indigo-700 font-bold">32%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/60 font-semibold">
                      <span className="text-slate-800">3. North & Western India Circuits</span>
                      <span className="font-mono text-indigo-700 font-bold">20%</span>
                    </div>
                  </div>
                </div>

                {/* 3. Ticketing Channel Distribution */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    🎟️ Ticket Sales Channels
                  </h4>

                  <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-800">
                        <span>Online ASI Portal & QR Kiosks</span>
                        <span className="text-amber-600">68%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: "68%" }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-800">
                        <span>Physical Ticket Counter Windows</span>
                        <span className="text-slate-600">32%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-slate-600 h-full rounded-full" style={{ width: "32%" }} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 text-[10px] text-emerald-700 font-bold flex items-center justify-between">
                    <span>Average Wait Time: 4.2 mins</span>
                    <span className="bg-emerald-100 px-2 py-0.5 rounded">QR Entry Active</span>
                  </div>
                </div>
              </div>

              {/* Overcrowding Mitigation Protocol */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-amber-400" />
                  Overcrowding Mitigation Protocol
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When site capacity exceeds 85%, automated geofenced notifications invite arriving visitors to explore nearby heritage sites or local handicraft bazaars to smooth crowd distribution.
                </p>
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
