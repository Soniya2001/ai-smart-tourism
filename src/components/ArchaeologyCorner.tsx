import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Landmark, Search, Filter, Sparkles, BookOpen, Volume2, VolumeX, 
  Heart, Calendar, MapPin, Plus, CheckCircle2, Award, Info, 
  ExternalLink, Layers, Globe, History, Compass, ArrowRight, Share2, ShieldCheck
} from "lucide-react";

export interface ArchaeologyDiscovery {
  id: string;
  title: string;
  category: "Civilizations" | "Marine & Submerged" | "Excavations & Artifacts" | "Scripts & Inscriptions";
  location: string;
  periodEra: string;
  discoveredYear: string;
  shortFact: string;
  detailedFact: string;
  didYouKnow: string;
  significance: string;
  imageUrl: string;
  sourceAuthority: string;
  likesCount: number;
  tags: string[];
}

const INITIAL_DISCOVERIES: ArchaeologyDiscovery[] = [
  {
    id: "ARCH-001",
    title: "Keezhadi Vaigai Valley Civilization",
    category: "Civilizations",
    location: "Keezhadi, Sivaganga District, Tamil Nadu",
    periodEra: "600 BCE – 300 BCE",
    discoveredYear: "2015 – Present",
    shortFact: "Radiocarbon dating proves an urban Sangam Era civilization flourished along the Vaigai river contemporary to the Gangetic Plain urbanization.",
    detailedFact: "Archaeological excavations at Keezhadi have unearthed over 18,000 artifacts including potsherds inscribed with Tamil-Brahmi script, weaving tools, carnelian beads, terracotta structures, and closed brick drainage channels. The findings establish that widespread literacy and sophisticated industrial crafts existed in South India as early as 600 BCE.",
    didYouKnow: "Over 56 potsherds found at Keezhadi bear personal names written in Tamil-Brahmi script, indicating widespread literacy among ordinary citizens 2,600 years ago!",
    significance: "Redefines the antiquity of Sangam Era literacy and urban culture in South India.",
    imageUrl: "https://images.unsplash.com/photo-1600100397608-f010e423b963?auto=format&fit=crop&w=800&q=80",
    sourceAuthority: "Archaeological Survey of India (ASI) & Tamil Nadu State Dept of Archaeology",
    likesCount: 142,
    tags: ["Sangam Era", "Tamil-Brahmi", "Urban Planning", "Vaigai"]
  },
  {
    id: "ARCH-002",
    title: "Sinauli Copper-Age Royal Chariots & Swords",
    category: "Excavations & Artifacts",
    location: "Sinauli, Baghpat, Uttar Pradesh",
    periodEra: "2000 BCE – 1800 BCE",
    discoveredYear: "2018",
    shortFact: "Discovery of India's earliest physical wooden chariots with solid wheels covered in copper inlays and warrior burial pits.",
    detailedFact: "Excavations at Sinauli revealed 12 burial pits containing three full-sized wooden chariots reinforced with copper bands, antenna-hilted swords, copper helmets, and shield fittings. These artifacts provide physical evidence of sophisticated metallurgy and warrior elite culture during the Late Bronze Age.",
    didYouKnow: "The chariots found at Sinauli were horse-driven or ox-drawn wheeled vehicles with solid wooden wheels encased in copper triangle motifs, dating back nearly 4,000 years!",
    significance: "First discovery of Bronze Age chariots in the Indian subcontinent.",
    imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    sourceAuthority: "Excavation Branch, ASI New Delhi",
    likesCount: 118,
    tags: ["Chariots", "Copper Age", "Bronze Age Metallurgy", "Sinauli"]
  },
  {
    id: "ARCH-003",
    title: "Submerged Port City of Poompuhar (Kaveripoompattinam)",
    category: "Marine & Submerged",
    location: "Off Bay of Bengal coast, Tamil Nadu",
    periodEra: "300 BCE – 500 CE",
    discoveredYear: "2020 – 2024",
    shortFact: "Underwater sonar mapping revealed submerged stone harbor docks, ring wells, and urban layouts submerged beneath coastal waters.",
    detailedFact: "Marine archaeological explorations using multi-beam echo sounders and side-scan sonars identified submerged masonry structures, brick wharves, and pottery clusters 3 to 5 km off the modern coast. The findings match descriptions in the ancient Tamil epic 'Silappatikaram' about the great seaport destroyed by a tsunami or marine transgression.",
    didYouKnow: "Submerged harbor structures extend over 10 km into the sea, showing how coastal sea levels swallowed ancient global trading ports over the past two millennia!",
    significance: "Validates classical Sangam literary accounts of maritime trade ports swallowed by the sea.",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    sourceAuthority: "National Institute of Oceanography (NIO) & CSIR",
    likesCount: 165,
    tags: ["Underwater Archaeology", "Marine Port", "Silappatikaram", "Oceanography"]
  },
  {
    id: "ARCH-004",
    title: "Dholavira Stone-Cut Water Reservoirs",
    category: "Civilizations",
    location: "Khadir Bet, Rann of Kutch, Gujarat",
    periodEra: "2600 BCE – 1900 BCE",
    discoveredYear: "UNESCO Site (Excavated 1989-present)",
    shortFact: "Features the world's oldest sophisticated stone-cut rainwater harvesting reservoir network and a 10-character signboard.",
    detailedFact: "Dholavira is an Indus Valley metropolis surrounded by 16 massive reservoirs carved directly out of bedrock. The city harvested seasonal stormwater streams into interconnected dams and underground storm drains, sustaining a thriving population in an arid desert environment.",
    didYouKnow: "Dholavira featured a massive wooden signboard with 10 giant Indus script symbols (~37 cm high), crafted from white crystalline gypsum, designed to be seen from the city gateway!",
    significance: "Masterpiece of Indus Valley hydraulic engineering and urban stone masonry.",
    imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    sourceAuthority: "ASI & UNESCO World Heritage Centre",
    likesCount: 132,
    tags: ["Harappan", "Indus Script", "Water Conservation", "UNESCO"]
  },
  {
    id: "ARCH-005",
    title: "Porunai River Iron Age Industrial Complex",
    category: "Excavations & Artifacts",
    location: "Mayiladumparai & Sivagalai, Tamil Nadu",
    periodEra: "2172 BCE (Iron Age)",
    discoveredYear: "2021 – 2023",
    shortFact: "Accelerator Mass Spectrometry (AMS) dating confirms iron smelting and toolmaking in India dates back to 2172 BCE.",
    detailedFact: "Charcoal samples extracted from iron furnaces and urn burials at Mayiladumparai dated iron usage to 4,200 years ago. This discovery pushed back the timeline of the Iron Age in India by several centuries, proving early expertise in high-temperature metallurgy.",
    didYouKnow: "The 2172 BCE carbon date established that iron technology developed independently in South India long before previously assumed!",
    significance: "Rewrites the global history of early Iron Age metallurgy and furnace engineering.",
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    sourceAuthority: "Beta Analytic Lab (USA) & Tamil Nadu Archaeology Dept",
    likesCount: 95,
    tags: ["Iron Age", "Metallurgy", "AMS Dating", "Mayiladumparai"]
  },
  {
    id: "ARCH-006",
    title: "Submerged Ancient City Structures of Dwarka",
    category: "Marine & Submerged",
    location: "Gulf of Kutch, Dwarka, Gujarat",
    periodEra: "1500 BCE – 500 BCE",
    discoveredYear: "1983 – Present",
    shortFact: "Marine excavations discovered submerged stone anchor blocks, fortification bastions, and pottery at depths of 10-20 meters.",
    detailedFact: "Underwater expeditions off the Dwarka coast led by marine archaeologists uncovered triangular and L-shaped stone anchors, foundation walls, and semicircular stone bastions matching ancient coastal port descriptions.",
    didYouKnow: "Over 50 large stone anchors weighing up to 200 kg each were recovered, proving Dwarka was a busy international maritime anchorage for ancient trading vessels!",
    significance: "Pioneering Indian marine archaeological site demonstrating ancient port anchorage.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    sourceAuthority: "Marine Archaeology Unit, NIO Goa",
    likesCount: 154,
    tags: ["Dwarka", "Marine Archaeology", "Stone Anchors", "Gujarat Coast"]
  },
  {
    id: "ARCH-007",
    title: "Rakhigarhi Harappan DNA & City Grid",
    category: "Civilizations",
    location: "Hisar District, Haryana",
    periodEra: "3500 BCE – 1900 BCE",
    discoveredYear: "1963 / Major 2014-2022 Excavations",
    shortFact: "The largest Indus Valley civilization site (~550 hectares) with intact multi-room mudbrick houses, jewelry workshops, and ancient DNA analysis.",
    detailedFact: "Excavations at Rakhigarhi proved it is significantly larger than Mohenjo-Daro and Harappa. Archeologists uncovered lapis lazuli workshops, terracotta toy carts, shell bangles, public drainage, and skeletal remains that yielded the first ancient genome sequence from the Indus Valley.",
    didYouKnow: "Rakhigarhi spans over 550 hectares across 11 mounds, making it the sprawling capital metropolis of the Indus Valley Civilization!",
    significance: "Largest Harappan metropolis revealing indigenous ancient genetics and crafts.",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    sourceAuthority: "Deccan College Pune & ASI",
    likesCount: 121,
    tags: ["Indus Valley", "Rakhigarhi", "Ancient DNA", "Metropolis"]
  },
  {
    id: "ARCH-008",
    title: "Muziris Roman Trade Amphorae & Papyrus Document",
    category: "Scripts & Inscriptions",
    location: "Pattanam, Kodungallur, Kerala",
    periodEra: "100 BCE – 400 CE",
    discoveredYear: "2007 – Present",
    shortFact: "Excavations unearthed thousands of Roman amphorae sherds, terra sigillata pottery, and Mesopotamian glass beads.",
    detailedFact: "Pattanam excavations identified the lost spice port of Muziris. Discoveries include a 6-meter wooden canoe, Roman coins of Augustus Caesar, Mediterranean pottery, and gemstone intaglios. This matches the Vienna Papyrus document detailing a massive loan contract for black pepper shipment between Muziris and Alexandria.",
    didYouKnow: "The Vienna Papyrus records a single ship cargo of black pepper, ivory, and textiles from Muziris valued at over 7 million Roman sesterces!",
    significance: "Confirms the legendary Indo-Roman black pepper maritime trade route.",
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    sourceAuthority: "Kerala Council for Historical Research (KCHR)",
    likesCount: 109,
    tags: ["Muziris", "Spice Trade", "Roman Amphorae", "Vienna Papyrus"]
  }
];

export default function ArchaeologyCorner() {
  const [discoveries, setDiscoveries] = useState<ArchaeologyDiscovery[]>(() => {
    const saved = localStorage.getItem("public_archaeology_discoveries");
    return saved ? JSON.parse(saved) : INITIAL_DISCOVERIES;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeDiscovery, setActiveDiscovery] = useState<ArchaeologyDiscovery | null>(null);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  
  // Suggestion Modal State
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newCategory, setNewCategory] = useState<ArchaeologyDiscovery["category"]>("Civilizations");
  const [newFact, setNewFact] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filter Categories
  const categories = ["All", "Civilizations", "Marine & Submerged", "Excavations & Artifacts", "Scripts & Inscriptions"];

  const filteredDiscoveries = discoveries.filter(item => {
    const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortFact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isAlreadyLiked = !!likedIds[id];
    const newStatus = !isAlreadyLiked;

    setLikedIds(prev => ({ ...prev, [id]: newStatus }));

    setDiscoveries(prevList => {
      const updated = prevList.map(item => {
        if (item.id === id) {
          return {
            ...item,
            likesCount: isAlreadyLiked ? Math.max(0, item.likesCount - 1) : item.likesCount + 1
          };
        }
        return item;
      });
      localStorage.setItem("public_archaeology_discoveries", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSpeak = (id: string, textToSpeak: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking === id) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(null);
      utterance.onerror = () => setIsSpeaking(null);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(id);
    }
  };

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLocation || !newFact) return;

    const newItem: ArchaeologyDiscovery = {
      id: `ARCH-USER-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      location: newLocation,
      periodEra: "Recently Documented",
      discoveredYear: new Date().getFullYear().toString(),
      shortFact: newFact,
      detailedFact: `${newFact} Submitted by public visitor for archaeological review.`,
      didYouKnow: `Local citizen discovery reported near ${newLocation}. Verified by public crowd report.`,
      significance: "Public discovery submitted for archaeological verification.",
      imageUrl: "https://images.unsplash.com/photo-1600100397608-f010e423b963?auto=format&fit=crop&w=800&q=80",
      sourceAuthority: "Public Citizen Submission (Pending ASI Review)",
      likesCount: 1,
      tags: ["Public Discovery", "New Finding", newCategory]
    };

    const updated = [newItem, ...discoveries];
    setDiscoveries(updated);
    localStorage.setItem("public_archaeology_discoveries", JSON.stringify(updated));

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowSubmitModal(false);
      setNewTitle("");
      setNewLocation("");
      setNewFact("");
    }, 1800);
  };

  return (
    <div id="archaeology-corner-root" className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-amber-500/20">
        <div className="absolute top-0 right-0 p-12 text-9xl text-amber-500/5 font-black pointer-events-none font-serif select-none">
          DIG
        </div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-amber-500/30">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Public Archaeological Intelligence Corner</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-amber-100 font-serif">
            Unearthing Ancient Civilizations & Discoveries
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Explore verified archaeological findings, submerged ancient harbor cities, newly carbon-dated civilizations, and copper-age artifacts across India and global heritage sites.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Report / Submit New Discovery</span>
            </button>

            <span className="text-[11px] text-amber-200/80 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-amber-500/20 flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              <span>{discoveries.length} Archaeology Cards Verified</span>
            </span>
          </div>
        </div>
      </div>

      {/* Daily Spotlight Highlight Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-stone-900/5 to-amber-500/10 border border-amber-300/40 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row gap-5 items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
            📜
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                Archaeology Fact of the Day
              </span>
              <span className="text-xs text-stone-500 font-medium">Sangam Era Radiocarbon Evidence</span>
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Keezhadi Pottery Script Proves Widespread Urban Literacy at 600 BCE
            </h3>
            <p className="text-xs text-stone-600 max-w-3xl leading-relaxed">
              Over 56 potsherds excavated at Keezhadi feature personal names written in Tamil-Brahmi script on everyday household pottery, demonstrating that ordinary citizens possessed writing literacy over 2,600 years ago.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            const keezhadi = discoveries.find(d => d.id === "ARCH-001");
            if (keezhadi) setActiveDiscovery(keezhadi);
          }}
          className="shrink-0 bg-stone-900 hover:bg-stone-800 text-amber-200 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 border border-stone-700 shadow"
        >
          <span>Explore Keezhadi Card</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-amber-600 text-white shadow-md"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                }`}
              >
                {cat === "All" && <Compass className="h-3.5 w-3.5" />}
                {cat === "Civilizations" && <Landmark className="h-3.5 w-3.5" />}
                {cat === "Marine & Submerged" && <Globe className="h-3.5 w-3.5" />}
                {cat === "Excavations & Artifacts" && <Layers className="h-3.5 w-3.5" />}
                {cat === "Scripts & Inscriptions" && <BookOpen className="h-3.5 w-3.5" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search discoveries, sites, era..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Archaeology Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDiscoveries.map((item) => {
          const isLiked = !!likedIds[item.id];
          const isAudioActive = isSpeaking === item.id;

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Image & Header Overlay */}
              <div>
                <div className="relative h-48 w-full bg-stone-900 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
                    {item.category}
                  </span>

                  {/* Audio Narrator Button */}
                  <button
                    onClick={(e) => handleSpeak(item.id, `${item.title}. ${item.shortFact}. Did you know? ${item.didYouKnow}`, e)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow ${
                      isAudioActive
                        ? "bg-amber-500 text-slate-950 animate-bounce"
                        : "bg-slate-950/70 text-amber-300 hover:bg-slate-900"
                    }`}
                    title="Listen to Audio Fact Narration"
                  >
                    {isAudioActive ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                  </button>

                  {/* Title & Location Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                    <span className="text-[10px] font-mono text-amber-300 font-bold flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {item.periodEra}
                    </span>
                    <h3 className="font-bold text-base text-white leading-tight drop-shadow-sm">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-stone-300 flex items-center gap-1 font-medium truncate">
                      <MapPin className="h-3 w-3 text-amber-400 shrink-0" /> {item.location}
                    </p>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 space-y-3">
                  {/* Short Fact */}
                  <p className="text-xs text-stone-700 leading-relaxed font-medium">
                    {item.shortFact}
                  </p>

                  {/* Did You Know Box */}
                  <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 space-y-1">
                    <div className="flex items-center gap-1 text-[10px] font-extrabold text-amber-800 uppercase tracking-wider">
                      <Info className="h-3 w-3 text-amber-600" /> Did You Know?
                    </div>
                    <p className="text-[11px] text-amber-950 leading-normal font-sans">
                      {item.didYouKnow}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md border border-stone-200">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between gap-2">
                <button
                  onClick={(e) => handleLike(item.id, e)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all border ${
                    isLiked
                      ? "bg-rose-50 text-rose-600 border-rose-200"
                      : "bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200"
                  }`}
                >
                  <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                  <span>{item.likesCount}</span>
                </button>

                <button
                  onClick={() => setActiveDiscovery(item)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-sm"
                >
                  <span>Full Discovery Fact</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredDiscoveries.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-8 space-y-2">
          <Landmark className="h-10 w-10 text-stone-300 mx-auto" />
          <h4 className="font-bold text-stone-700">No Archaeology Facts Found</h4>
          <p className="text-xs text-stone-500">Try adjusting your search keyword or selecting "All" categories.</p>
        </div>
      )}

      {/* Detailed Modal */}
      <AnimatePresence>
        {activeDiscovery && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8"
            >
              <div className="relative h-64 bg-slate-900">
                <img
                  src={activeDiscovery.imageUrl}
                  alt={activeDiscovery.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <button
                  onClick={() => setActiveDiscovery(null)}
                  className="absolute top-4 right-4 bg-slate-950/80 hover:bg-slate-900 text-white h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border border-stone-700"
                >
                  ✕
                </button>

                <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                    {activeDiscovery.category} • {activeDiscovery.periodEra}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-serif">
                    {activeDiscovery.title}
                  </h3>
                  <p className="text-xs text-stone-300 flex items-center gap-1 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" /> {activeDiscovery.location}
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 mb-1">
                    Comprehensive Archaeological Findings
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                    {activeDiscovery.detailedFact}
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                    <Award className="h-4 w-4 text-amber-600" /> Historical & Cultural Significance
                  </div>
                  <p className="text-xs text-stone-600 font-medium leading-relaxed">
                    {activeDiscovery.significance}
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                    Verified Source & Excavation Authority
                  </span>
                  <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    {activeDiscovery.sourceAuthority}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
                  <button
                    onClick={() => setActiveDiscovery(null)}
                    className="bg-stone-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-stone-800 transition-all"
                  >
                    Close Discovery Fact
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Submit / Report Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 border border-stone-200 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-amber-600" />
                  <h3 className="font-extrabold text-stone-900 text-base">Report Archaeological Finding</h3>
                </div>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="text-stone-400 hover:text-stone-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                  <h4 className="font-bold text-stone-900 text-base">Discovery Fact Submitted!</h4>
                  <p className="text-xs text-stone-500">
                    Thank you! Your report has been added to the public Archaeology Corner list for community review.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSuggestSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Discovery / Site Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Submerged Stone Pillar off Mahabalipuram"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Category
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Civilizations">Civilizations</option>
                        <option value="Marine & Submerged">Marine & Submerged</option>
                        <option value="Excavations & Artifacts">Excavations & Artifacts</option>
                        <option value="Scripts & Inscriptions">Scripts & Inscriptions</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Location / District *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mahabalipuram, Chengalpattu"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Key Archaeological Fact / Observation *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe what was unearthed or discovered (e.g. terracotta potsherds, stone masonry foundation, copper coin cluster)..."
                      value={newFact}
                      onChange={(e) => setNewFact(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(false)}
                      className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow"
                    >
                      Submit Archaeology Fact
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
