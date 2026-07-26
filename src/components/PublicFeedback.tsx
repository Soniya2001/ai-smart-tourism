import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Star, Camera, Upload, Send, CheckCircle2, ThumbsUp, 
  MessageSquare, Sparkles, Filter, Search, Calendar, User, 
  Tag, MapPin, Trash2, Heart, Award, ShieldCheck, Landmark, Check
} from "lucide-react";
import { PublicFeedback, MONUMENT_TYPES, PRESET_MONUMENTS } from "../types";

const INITIAL_PUBLIC_FEEDBACK: PublicFeedback[] = [
  {
    id: "REV-2026-001",
    visitorName: "Priya Sundaram",
    monumentName: "Madurai Meenakshi Temple",
    monumentType: "Temple / Shrine",
    location: "Madurai, Tamil Nadu",
    overallRating: 5,
    categoryRatings: {
      cleanliness: 5,
      crowdManagement: 4,
      facilities: 5,
      accessibility: 4,
      guideQuality: 5
    },
    visitDate: "2026-07-22",
    reviewText: "Breathtaking experience at the South Gopuram! Cleanliness around the temple tank has improved significantly. The digital audio narration guide was extremely insightful.",
    imageUrl: "https://images.unsplash.com/photo-1610123598147-f632aa18b275?auto=format&fit=crop&w=800&q=80",
    wouldRecommend: true,
    timestamp: "2026-07-22 04:30 PM",
    aiSentimentTag: "Very Positive",
    likesCount: 28
  },
  {
    id: "REV-2026-002",
    visitorName: "Ananya Sharma",
    monumentName: "Taj Mahal",
    monumentType: "Tomb & Mausoleum",
    location: "Agra, Uttar Pradesh",
    overallRating: 5,
    categoryRatings: {
      cleanliness: 5,
      crowdManagement: 5,
      facilities: 4,
      accessibility: 5,
      guideQuality: 5
    },
    visitDate: "2026-07-20",
    reviewText: "Morning sunrise visit was smooth with quick electronic gate entry. Restroom facilities near the western gate were well-maintained and spotless.",
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    wouldRecommend: true,
    timestamp: "2026-07-20 09:15 AM",
    aiSentimentTag: "Very Positive",
    likesCount: 42
  },
  {
    id: "REV-2026-003",
    visitorName: "Vikram Malhotra",
    monumentName: "Hampi Virupaksha Temple & Ruins",
    monumentType: "Heritage Complex & Ruins",
    location: "Hampi, Karnataka",
    overallRating: 4,
    categoryRatings: {
      cleanliness: 4,
      crowdManagement: 4,
      facilities: 3,
      accessibility: 4,
      guideQuality: 5
    },
    visitDate: "2026-07-18",
    reviewText: "Incredible historical architecture! Suggest adding more shaded seating near the Stone Chariot section for senior citizens during peak afternoon sun.",
    imageUrl: "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=800&q=80",
    wouldRecommend: true,
    timestamp: "2026-07-18 02:45 PM",
    aiSentimentTag: "Constructive",
    likesCount: 19
  }
];

export default function PublicFeedbackForm() {
  const [reviews, setReviews] = useState<PublicFeedback[]>(() => {
    const saved = localStorage.getItem("public_monument_feedback");
    return saved ? JSON.parse(saved) : INITIAL_PUBLIC_FEEDBACK;
  });

  // Form State
  const [visitorName, setVisitorName] = useState("");
  const [monumentName, setMonumentName] = useState(PRESET_MONUMENTS[0].name);
  const [monumentType, setMonumentType] = useState<string>(MONUMENT_TYPES[0]);
  const [overallRating, setOverallRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  // Category Ratings
  const [cleanliness, setCleanliness] = useState<number>(5);
  const [crowdManagement, setCrowdManagement] = useState<number>(4);
  const [facilities, setFacilities] = useState<number>(4);
  const [accessibility, setAccessibility] = useState<number>(4);
  const [guideQuality, setGuideQuality] = useState<number>(5);

  const [visitDate, setVisitDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [reviewText, setReviewText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReview, setSubmittedReview] = useState<PublicFeedback | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("public_monument_feedback", JSON.stringify(reviews));
  }, [reviews]);

  // Handle Photo Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Sample Photos for quick select
  const samplePhotos = [
    { label: "Taj Mahal View", url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80" },
    { label: "Meenakshi Temple Gopuram", url: "https://images.unsplash.com/photo-1610123598147-f632aa18b275?auto=format&fit=crop&w=800&q=80" },
    { label: "Hampi Ruins", url: "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=800&q=80" },
    { label: "Chola Temple Architecture", url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80" }
  ];

  // Submit Feedback
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!monumentName.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Determine AI sentiment tag
      let sentiment: "Very Positive" | "Positive" | "Neutral" | "Constructive" = "Positive";
      if (overallRating === 5) sentiment = "Very Positive";
      else if (overallRating === 4) sentiment = "Positive";
      else if (overallRating <= 3) sentiment = "Constructive";

      const newFeedback: PublicFeedback = {
        id: `REV-${Date.now().toString().slice(-6)}`,
        visitorName: visitorName.trim() || "Anonymous Tourist",
        monumentName: monumentName.trim(),
        monumentType: monumentType,
        overallRating,
        categoryRatings: {
          cleanliness,
          crowdManagement,
          facilities,
          accessibility,
          guideQuality
        },
        visitDate,
        reviewText: reviewText.trim() || "Wonderful experience exploring this cultural monument.",
        imageUrl: imageUrl || samplePhotos[0].url,
        wouldRecommend,
        timestamp: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
        aiSentimentTag: sentiment,
        likesCount: 1
      };

      setReviews(prev => [newFeedback, ...prev]);
      setSubmittedReview(newFeedback);
      setIsSubmitting(false);

      // Reset form fields
      setReviewText("");
      setImageUrl("");
    }, 600);
  };

  // Calculate Average Ratings
  const avgOverall = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length).toFixed(1)
    : "5.0";
  
  const recommendPercent = reviews.length > 0
    ? Math.round((reviews.filter(r => r.wouldRecommend).length / reviews.length) * 100)
    : 100;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-lg border border-emerald-700/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <Award className="h-64 w-64 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
            <Star className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
            <span>Public Visitor Feedback & Monument Reviews</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Rate Monument Cleanliness, Facilities & Experience
          </h2>
          <p className="text-emerald-100/90 text-xs md:text-sm leading-relaxed">
            Select the monument type, share your rating, upload photos, and help local heritage authorities improve visitor amenities across India.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-emerald-200">
            <div className="flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-700/60 font-mono">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-white text-sm">{avgOverall}</span> / 5.0 Average Score
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-700/60 font-mono">
              <ThumbsUp className="h-4 w-4 text-emerald-400" />
              <span className="font-bold text-white text-sm">{recommendPercent}%</span> Recommend
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-700/60 font-mono">
              <MessageSquare className="h-4 w-4 text-emerald-300" />
              <span className="font-bold text-white text-sm">{reviews.length}</span> Public Reviews
            </div>
          </div>
        </div>
      </div>

      {/* FEEDBACK FORM */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        {submittedReview ? (
          /* Success Card View */
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-gray-900">Thank You for Your Feedback!</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your rating and review for <span className="font-bold text-emerald-800">{submittedReview.monumentName}</span> ({submittedReview.monumentType}) has been published to the Public Portal.
              </p>
            </div>

            {/* Submitted Card Preview */}
            <div className="max-w-xl mx-auto bg-gray-50 p-5 rounded-2xl border border-gray-200 text-left space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {submittedReview.monumentType}
                  </span>
                  <h4 className="font-bold text-gray-900 text-base mt-1">{submittedReview.monumentName}</h4>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-amber-900 font-bold text-xs">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{submittedReview.overallRating}.0 / 5</span>
                </div>
              </div>

              {submittedReview.imageUrl && (
                <img src={submittedReview.imageUrl} alt="Uploaded monument" className="w-full h-48 object-cover rounded-xl border border-gray-200" />
              )}

              <p className="text-xs text-gray-700 italic bg-white p-3 rounded-xl border border-gray-100">
                "{submittedReview.reviewText}"
              </p>

              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                <span>By: {submittedReview.visitorName}</span>
                <span>Visit Date: {submittedReview.visitDate}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setSubmittedReview(null)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                Submit Another Review
              </button>
            </div>
          </motion.div>
        ) : (
            /* Active Form */
            <form onSubmit={handleSubmitFeedback} className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Star className="h-5 w-5 text-emerald-600 fill-emerald-600" />
                  Public Monument Feedback Form
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  All fields marked with an asterisk (<span className="text-rose-500">*</span>) are used to collect public statistics on monument condition & service quality.
                </p>
              </div>

              {/* 1. Monument Name & Preset Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Monument / Heritage Site Name <span className="text-rose-500">*</span>
                </label>
                
                {/* Preset Chips */}
                <div className="flex flex-wrap gap-2">
                  {PRESET_MONUMENTS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setMonumentName(preset.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                        monumentName === preset.name
                          ? "bg-emerald-100 text-emerald-900 border-2 border-emerald-600 font-bold"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <Landmark className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  required
                  value={monumentName}
                  onChange={(e) => setMonumentName(e.target.value)}
                  placeholder="Or type any monument name (e.g. Red Fort, Ajanta Caves, Victoria Memorial)..."
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
                />
              </div>

              {/* 2. Monument Type Selected by Public */}
              <div className="space-y-3 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
                <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-emerald-700" />
                  Monument Type (Categorized by Public) <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-gray-600">Select the primary heritage architecture category for this site:</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {MONUMENT_TYPES.map((mType) => {
                    const isSelected = monumentType === mType;
                    return (
                      <button
                        key={mType}
                        type="button"
                        onClick={() => setMonumentType(mType)}
                        className={`p-2.5 rounded-xl text-xs text-left font-semibold transition-all flex items-center justify-between gap-1.5 ${
                          isSelected
                            ? "bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500"
                            : "bg-white text-gray-800 hover:bg-emerald-100/50 border border-gray-200"
                        }`}
                      >
                        <span className="truncate">{mType}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-white shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Overall Rating & Category Ratings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/60 p-5 rounded-2xl border border-gray-200">
                {/* Overall Rating */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Overall Visitor Rating <span className="text-rose-500">*</span>
                  </label>
                  
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (hoverRating !== null ? hoverRating : overallRating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setOverallRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 hover:scale-110 transition-transform focus:outline-none"
                        >
                          <Star className={`h-8 w-8 ${active ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
                        </button>
                      );
                    })}
                    <span className="ml-2 font-bold text-sm text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      {overallRating === 5 ? "5.0 - Excellent" : overallRating === 4 ? "4.0 - Very Good" : overallRating === 3 ? "3.0 - Good" : overallRating === 2 ? "2.0 - Fair" : "1.0 - Poor"}
                    </span>
                  </div>
                </div>

                {/* Sub-Category Ratings */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-gray-800 uppercase tracking-wider block mb-2">Category Ratings</span>
                  {[
                    { label: "🧹 Cleanliness & Hygiene", val: cleanliness, set: setCleanliness },
                    { label: "👥 Crowd & Queue Flow", val: crowdManagement, set: setCrowdManagement },
                    { label: "🏛️ Visitor Facilities", val: facilities, set: setFacilities },
                    { label: "♿ Accessibility & Signage", val: accessibility, set: setAccessibility },
                    { label: "🎙️ Tour Guide & Info", val: guideQuality, set: setGuideQuality },
                  ].map((cat) => (
                    <div key={cat.label} className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-700">{cat.label}</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => cat.set(s)}
                            className="p-0.5"
                          >
                            <Star className={`h-4 w-4 ${s <= cat.val ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Photo Upload / Attachment Section */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="h-4 w-4 text-emerald-600" />
                  Attach Monument Photo
                </label>

                {/* Quick Sample Image Buttons */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-gray-500">Quick-attach sample photo or upload your own:</span>
                  <div className="flex flex-wrap gap-2">
                    {samplePhotos.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => setImageUrl(s.url)}
                        className={`text-[11px] px-3 py-1 rounded-lg border transition-all ${
                          imageUrl === s.url
                            ? "bg-emerald-100 text-emerald-900 border-emerald-500 font-bold"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        📷 {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                  <label className="flex-1 w-full border-2 border-dashed border-gray-300 hover:border-emerald-500 p-4 rounded-2xl text-center cursor-pointer bg-gray-50/50 hover:bg-emerald-50/30 transition-all">
                    <Upload className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                    <span className="text-xs font-semibold text-gray-700 block">Click or Drag & Drop Photo Here</span>
                    <span className="text-[10px] text-gray-400">Supports JPG, PNG, WEBP</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>

                  {imageUrl && (
                    <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden border-2 border-emerald-500 shrink-0 group">
                      <img src={imageUrl} alt="Uploaded Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-full shadow-md hover:bg-rose-700 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                        Photo Attached
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Detailed Review & Experience */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Detailed Review & Visitor Suggestions
                </label>
                <textarea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details about your visit (e.g., crowd wait times, ticket counter speed, guide helpfulness, cleanliness of walkways)..."
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
                />
              </div>

              {/* 6. Visitor Name, Visit Date, Recommendation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/40 p-4 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Your Name / Public Alias</label>
                  <input
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="e.g. Ramesh K. (Optional)"
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Date of Visit</label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Would You Recommend This Site?</label>
                  <button
                    type="button"
                    onClick={() => setWouldRecommend(!wouldRecommend)}
                    className={`w-full p-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                      wouldRecommend
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-rose-50 text-rose-800 border-rose-300"
                    }`}
                  >
                    <ThumbsUp className={`h-4 w-4 ${wouldRecommend ? "text-emerald-600" : "text-rose-600 rotate-180"}`} />
                    <span>{wouldRecommend ? "Yes, Highly Recommended!" : "Needs Facilities Improvement"}</span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !monumentName.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin text-amber-300" />
                    <span>Publishing Feedback & Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 text-emerald-200" />
                    <span>Submit Public Monument Review</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
    </div>
  );
}
