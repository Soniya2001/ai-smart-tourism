import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, Landmark, MapPin, IndianRupee, ShieldCheck, CheckCircle2, 
  CreditCard, QrCode, Building2, Sparkles, Award, Download, Share2, 
  Search, Users, ArrowRight, X, FileText, Lock, ChevronRight, Check
} from "lucide-react";
import { TourismDonation as TourismDonationRecord, HeritageDonationSite, PRESET_MONUMENTS } from "../types";

const FEATURED_HERITAGE_SITES: HeritageDonationSite[] = [
  {
    id: "site-1",
    name: "Madurai Meenakshi Temple",
    location: "Madurai",
    state: "Tamil Nadu",
    category: "Temple & Shrine",
    imageUrl: "https://images.unsplash.com/photo-1610123598147-f632aa18b275?auto=format&fit=crop&w=800&q=80",
    targetFund: 1000000,
    raisedFund: 785000,
    activeCause: "Golden Lotus Tank Water Purification & Eco-Toilets",
    donorCount: 420
  },
  {
    id: "site-2",
    name: "Taj Mahal",
    location: "Agra",
    state: "Uttar Pradesh",
    category: "Mausoleum & Garden",
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    targetFund: 2500000,
    raisedFund: 1920000,
    activeCause: "Marble Mud-pack Cleaning & Electric Buggy Transit",
    donorCount: 1150
  },
  {
    id: "site-3",
    name: "Hampi Virupaksha & Ruins",
    location: "Hampi",
    state: "Karnataka",
    category: "Heritage Complex",
    imageUrl: "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=800&q=80",
    targetFund: 1500000,
    raisedFund: 940000,
    activeCause: "Stone Chariot Conservation & Solar Pathway Lamps",
    donorCount: 680
  },
  {
    id: "site-4",
    name: "Mahabalipuram Shore Temple",
    location: "Mamallapuram",
    state: "Tamil Nadu",
    category: "Coastal Monolithic Rock-cut",
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    targetFund: 800000,
    raisedFund: 610000,
    activeCause: "Seawall Erosion Shield & Braille Signage for Visually Impaired",
    donorCount: 390
  },
  {
    id: "site-5",
    name: "Ajanta & Ellora Caves",
    location: "Sambhaji Nagar",
    state: "Maharashtra",
    category: "Cave & Fresco Murals",
    imageUrl: "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=800&q=80",
    targetFund: 1200000,
    raisedFund: 850000,
    activeCause: "Fresco Mural Humidity Control & Digital Lighting",
    donorCount: 510
  },
  {
    id: "site-6",
    name: "Konark Sun Temple",
    location: "Konark",
    state: "Odisha",
    category: "UNESCO Sun Chariot",
    imageUrl: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
    targetFund: 1800000,
    raisedFund: 1250000,
    activeCause: "Stone Carvings Structural Stabilization & Light Show",
    donorCount: 740
  }
];

const RECENT_DONATION_FEED: TourismDonationRecord[] = [
  {
    id: "DON-2026-8810",
    donorName: "Karthik Subramanian",
    monumentName: "Madurai Meenakshi Temple",
    location: "Madurai, Tamil Nadu",
    cause: "Golden Lotus Tank Water Purification & Eco-Toilets",
    amount: 5000,
    currency: "₹",
    paymentMethod: "UPI",
    transactionId: "TXN983210482",
    timestamp: "2 hours ago",
    isAnonymous: false,
    message: "Proud to support our heritage for future generations!",
    taxExemptionClaimed: true
  },
  {
    id: "DON-2026-8809",
    donorName: "Rohan & Sneha Kapoor",
    monumentName: "Taj Mahal",
    location: "Agra, Uttar Pradesh",
    cause: "Marble Mud-pack Cleaning & Electric Buggy Transit",
    amount: 2500,
    currency: "₹",
    paymentMethod: "Card",
    transactionId: "TXN873910291",
    timestamp: "4 hours ago",
    isAnonymous: false,
    message: "In memory of our anniversary trip.",
    taxExemptionClaimed: true
  },
  {
    id: "DON-2026-8808",
    donorName: "Anonymous Donor",
    monumentName: "Hampi Virupaksha & Ruins",
    location: "Hampi, Karnataka",
    cause: "Stone Chariot Conservation & Solar Pathway Lamps",
    amount: 10000,
    currency: "₹",
    paymentMethod: "NetBanking",
    transactionId: "TXN772910382",
    timestamp: "6 hours ago",
    isAnonymous: true,
    message: "",
    taxExemptionClaimed: false
  }
];

const DONATION_CAUSES = [
  "General Tourism & Heritage Conservation Fund",
  "Cleanliness, Eco-Toilets & Waste Recycling",
  "Structural Conservation & Stone Restoration",
  "Solar Lighting, Wheelchair Ramps & Accessibility",
  "Digital Audio Guides, QR Narrations & Signage",
  "Local Heritage Guide & Artisan Welfare Fund"
];

export default function TourismDonation() {
  const [selectedSite, setSelectedSite] = useState<HeritageDonationSite>(FEATURED_HERITAGE_SITES[0]);
  const [customLocationName, setCustomLocationName] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  
  // Form Fields
  const [selectedCause, setSelectedCause] = useState(DONATION_CAUSES[0]);
  const [amount, setAmount] = useState<number>(1000);
  const [customAmountInput, setCustomAmountInput] = useState<string>("");
  const [donorName, setDonorName] = useState("");
  const [email, setEmail] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Card" | "NetBanking">("UPI");

  // Payment Modal & Confirmation State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedDonation, setCompletedDonation] = useState<TourismDonationRecord | null>(null);

  // Donors Feed State
  const [donorList, setDonorList] = useState<TourismDonationRecord[]>(() => {
    const saved = localStorage.getItem("tourism_donations_list");
    return saved ? JSON.parse(saved) : RECENT_DONATION_FEED;
  });

  useEffect(() => {
    localStorage.setItem("tourism_donations_list", JSON.stringify(donorList));
  }, [donorList]);

  // Handle Location Select
  const handleSelectSite = (site: HeritageDonationSite) => {
    setSelectedSite(site);
    setSelectedCause(site.activeCause);
    setCustomLocationName("");
  };

  // Amount Chips
  const presetAmounts = [250, 500, 1000, 2500, 5000, 10000];

  const handleAmountChip = (amt: number) => {
    setAmount(amt);
    setCustomAmountInput("");
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmountInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setAmount(num);
    }
  };

  // Trigger Pay Modal
  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    setShowPaymentModal(true);
  };

  // Confirm Payment
  const handleConfirmPayment = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      const activeMonumentName = customLocationName.trim() || selectedSite.name;
      const activeLocation = customLocationName.trim() ? "Custom Tourism Site, India" : `${selectedSite.location}, ${selectedSite.state}`;
      
      const newDonation: TourismDonationRecord = {
        id: `DON-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        donorName: isAnonymous ? "Anonymous Heritage Patron" : (donorName.trim() || "Generous Tourist"),
        email: email.trim(),
        monumentName: activeMonumentName,
        location: activeLocation,
        cause: selectedCause,
        amount: amount,
        currency: "₹",
        paymentMethod: paymentMethod,
        transactionId: `TXN${Math.floor(100000000 + Math.random() * 900000000)}`,
        timestamp: "Just now",
        isAnonymous,
        message: message.trim(),
        taxExemptionClaimed: panNumber.trim().length > 0
      };

      setDonorList(prev => [newDonation, ...prev]);
      setCompletedDonation(newDonation);
      setIsProcessingPayment(false);

      // Also update site raised funds locally if matching site
      const siteIndex = FEATURED_HERITAGE_SITES.findIndex(s => s.name === activeMonumentName);
      if (siteIndex !== -1) {
        FEATURED_HERITAGE_SITES[siteIndex].raisedFund += amount;
        FEATURED_HERITAGE_SITES[siteIndex].donorCount += 1;
      }
    }, 1500);
  };

  const totalFundRaised = donorList.reduce((acc, d) => acc + d.amount, 6305000);

  const filteredSites = FEATURED_HERITAGE_SITES.filter(s => 
    s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.location.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.state.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl border border-amber-700/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <Heart className="h-64 w-64 text-amber-300" />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30">
            <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-400" />
            <span>National Tourism & Heritage Preservation Fund</span>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Adopt & Preserve India's Living Heritage
          </h2>
          
          <p className="text-amber-100/90 text-xs md:text-sm leading-relaxed">
            Select any heritage location, contribute directly towards clean water tanks, wheelchair ramps, stone restoration, or audio guides, and receive an instant 80G tax exemption receipt.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <div className="bg-amber-950/70 border border-amber-700/60 px-3.5 py-1.5 rounded-xl flex items-center gap-2 font-mono">
              <IndianRupee className="h-4 w-4 text-amber-400" />
              <span className="font-extrabold text-white text-base">₹{totalFundRaised.toLocaleString()}</span>
              <span className="text-amber-200 text-[10px]">Total Contributed</span>
            </div>
            
            <div className="bg-amber-950/70 border border-amber-700/60 px-3.5 py-1.5 rounded-xl flex items-center gap-2 font-mono">
              <Users className="h-4 w-4 text-emerald-400" />
              <span className="font-extrabold text-white text-base">3,980+</span>
              <span className="text-amber-200 text-[10px]">Global Patrons</span>
            </div>

            <div className="bg-amber-950/70 border border-amber-700/60 px-3.5 py-1.5 rounded-xl flex items-center gap-2 font-mono">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              <span className="font-extrabold text-white text-xs">80G Tax Exempt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Location Selection + Click to Pay Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Select Custom Tourism Location */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <MapPin className="h-5 w-5 text-amber-600" />
              1. Select Tourism Location
            </h3>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Custom Location
            </span>
          </div>

          {/* Location Input Box */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                Tourism Location or Monument Name
              </label>
              <div className="relative">
                <Landmark className="h-4 w-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customLocationName}
                  onChange={(e) => setCustomLocationName(e.target.value)}
                  placeholder="e.g. Madurai Meenakshi Temple, Taj Mahal Agra, Golden Temple..."
                  className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50/50 font-medium"
                />
              </div>
            </div>

            {/* Quick Popular Tourism Locations */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">
                Or Quick Pick Popular Tourism Location:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Madurai Meenakshi Temple",
                  "Taj Mahal, Agra",
                  "Hampi Virupaksha Temple",
                  "Mahabalipuram Shore Temple",
                  "Konark Sun Temple",
                  "Ajanta & Ellora Caves",
                  "Golden Temple, Amritsar",
                  "Sanchi Stupa, MP"
                ].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setCustomLocationName(loc)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      customLocationName === loc
                        ? "bg-amber-700 text-white border-amber-800 font-bold shadow-sm"
                        : "bg-gray-50 text-gray-700 hover:bg-amber-100/60 border-gray-200"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Currently Selected Summary Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-4 rounded-2xl border border-amber-300 shadow-sm space-y-2">
            <span className="text-[10px] uppercase font-extrabold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
              Destination Confirmed
            </span>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 bg-amber-200/80 rounded-xl flex items-center justify-center shrink-0 text-amber-800">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900 text-sm leading-snug">
                  {customLocationName.trim() || selectedSite.name}
                </h4>
                <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>Verified Tourism Destination, India</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Donation Amount, Details & CLICK TO PAY Form */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-600 fill-rose-600" />
                2. Enter Amount & Pay
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Supporting: <span className="font-bold text-amber-900">{customLocationName || selectedSite.name}</span>
              </p>
            </div>
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              80G Tax Exemption
            </span>
          </div>

          <form onSubmit={handleInitiatePayment} className="space-y-6">
            {/* Cause Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                Select Specific Preservation Cause
              </label>
              <select
                value={selectedCause}
                onChange={(e) => setSelectedCause(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50/50"
              >
                {DONATION_CAUSES.map((cause) => (
                  <option key={cause} value={cause}>{cause}</option>
                ))}
              </select>
            </div>

            {/* Donation Amount Chips */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center justify-between">
                <span>Select Donation Amount (₹ INR)</span>
                <span className="text-amber-800 font-mono font-bold text-sm">Selected: ₹{amount.toLocaleString()}</span>
              </label>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {presetAmounts.map((amt) => {
                  const isSelected = amount === amt && !customAmountInput;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleAmountChip(amt)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold font-mono transition-all border ${
                        isSelected
                          ? "bg-amber-700 text-white border-amber-800 shadow-sm ring-2 ring-amber-500"
                          : "bg-gray-50 text-gray-800 hover:bg-amber-100/60 border-gray-200"
                      }`}
                    >
                      ₹{amt.toLocaleString()}
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount Input */}
              <div>
                <input
                  type="number"
                  value={customAmountInput}
                  onChange={handleCustomAmount}
                  placeholder="Or enter custom amount in ₹ (e.g. 1500, 25000)..."
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50/50 font-mono"
                />
              </div>
            </div>

            {/* Donor Personal Information */}
            <div className="space-y-3 bg-gray-50/60 p-4 rounded-2xl border border-gray-200">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                Patron Details (For Tax Exemption & Receipt)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Email Address (For Tax Receipt)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    PAN Card Number (Optional for 80G Tax Exemption)
                  </label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. ABCDE1234F"
                    maxLength={10}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white font-mono uppercase"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
                    />
                    <span>Keep my name anonymous on the public donors wall</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Dedication Note or Message (Optional)</label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. In honor of our family visit to Tamil Nadu heritage temples..."
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                />
              </div>
            </div>

            {/* Payment Mode Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                Select Payment Gateway
              </label>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "UPI", label: "UPI Instant (GPay / PhonePe)", icon: <QrCode className="h-4 w-4 text-emerald-600" /> },
                  { id: "Card", label: "Debit / Credit Card", icon: <CreditCard className="h-4 w-4 text-blue-600" /> },
                  { id: "NetBanking", label: "Net Banking", icon: <Building2 className="h-4 w-4 text-purple-600" /> }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPaymentMethod(mode.id as any)}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === mode.id
                        ? "bg-amber-100/70 text-amber-950 border-amber-600 ring-2 ring-amber-500/50 shadow-sm"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                    }`}
                  >
                    {mode.icon}
                    <span>{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CLICK TO PAY BUTTON */}
            <button
              type="submit"
              disabled={amount <= 0}
              className="w-full py-4 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 hover:from-amber-800 hover:to-slate-900 text-white font-extrabold text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 border border-amber-600/50"
            >
              <IndianRupee className="h-5 w-5 text-amber-300" />
              <span>Click to Pay ₹{amount.toLocaleString()} Now</span>
              <ArrowRight className="h-5 w-5 text-amber-300" />
            </button>

            <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
              <Lock className="h-3.5 w-3.5 text-emerald-600" />
              <span>256-Bit SSL Encrypted Official Ministry of Tourism Donation Gateway</span>
            </p>
          </form>
        </div>
      </div>

      {/* PUBLIC DONORS WALL & IMPACT LOG */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-600" />
              Public Heritage Donors Wall & Impact Ticker
            </h4>
            <p className="text-xs text-gray-500">Real-time contributions made by heritage patrons across the nation</p>
          </div>
          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
            {donorList.length} Verified Contributions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {donorList.map((donor) => (
            <div key={donor.id} className="bg-amber-50/40 p-4 rounded-xl border border-amber-100 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-xs">
                    {donor.isAnonymous ? "🔒 Anonymous Heritage Patron" : donor.donorName}
                  </span>
                  <span className="text-xs font-extrabold font-mono text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded border border-amber-300">
                    ₹{donor.amount.toLocaleString()}
                  </span>
                </div>

                <div className="text-[11px] text-gray-600 flex items-center gap-1 font-medium">
                  <Landmark className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                  <span className="truncate">{donor.monumentName}</span>
                </div>

                <p className="text-[10px] text-amber-900/80 italic line-clamp-2">
                  "{donor.cause}"
                </p>

                {donor.message && (
                  <p className="text-[11px] text-gray-700 bg-white p-2 rounded-lg border border-gray-100 mt-1">
                    "{donor.message}"
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                <span>{donor.transactionId}</span>
                <span>{donor.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INTERACTIVE PAYMENT & RECEIPT MODAL */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6 relative border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => { setShowPaymentModal(false); setCompletedDonation(null); }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {!completedDonation ? (
                /* Active Payment Modal Flow */
                <div className="space-y-6 text-center">
                  <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
                    <CreditCard className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900">Complete Tourism Donation</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Paying <span className="font-bold text-amber-900 font-mono">₹{amount.toLocaleString()}</span> for <span className="font-bold text-gray-800">{customLocationName || selectedSite.name}</span>
                    </p>
                  </div>

                  {paymentMethod === "UPI" && (
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                      <p className="text-xs font-semibold text-gray-700">Scan UPI QR Code using GPay, PhonePe or Paytm:</p>
                      <div className="w-40 h-40 bg-white p-2 rounded-xl border border-gray-300 mx-auto shadow-sm flex items-center justify-center relative">
                        {/* Simulated QR Code Visual */}
                        <div className="grid grid-cols-5 gap-1.5 w-full h-full p-1 opacity-80">
                          {Array.from({ length: 25 }).map((_, idx) => (
                            <div key={idx} className={`rounded-sm ${idx % 2 === 0 || idx % 5 === 0 ? "bg-black" : "bg-amber-200"}`} />
                          ))}
                        </div>
                        <div className="absolute bg-white p-1 rounded-md shadow border border-gray-200">
                          <IndianRupee className="h-5 w-5 text-amber-700" />
                        </div>
                      </div>
                      <p className="text-[10px] font-mono text-gray-500">UPI ID: heritage.preservation@gov.in</p>
                    </div>
                  )}

                  {paymentMethod === "Card" && (
                    <div className="space-y-3 text-left bg-gray-50 p-4 rounded-2xl border border-gray-200">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Card Number</label>
                        <input
                          type="text"
                          defaultValue="4532 •••• •••• 8821"
                          className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-white font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Expiry</label>
                          <input type="text" defaultValue="08/29" className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-white font-mono" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">CVV</label>
                          <input type="password" defaultValue="•••" className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-white font-mono" />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "NetBanking" && (
                    <div className="space-y-2 text-left bg-gray-50 p-4 rounded-2xl border border-gray-200">
                      <label className="block text-[10px] font-bold text-gray-600 uppercase">Select Bank</label>
                      <select className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-white font-semibold">
                        <option>State Bank of India (SBI)</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                      </select>
                    </div>
                  )}

                  <button
                    onClick={handleConfirmPayment}
                    disabled={isProcessingPayment}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Sparkles className="h-4 w-4 animate-spin text-amber-300" />
                        <span>Processing Payment & Generating 80G Receipt...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                        <span>Confirm Payment of ₹{amount.toLocaleString()}</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Donation Successful Receipt View */
                <div className="space-y-5 text-center py-2">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                      Donation Successful & Verified
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2">Thank You, {completedDonation.donorName}!</h3>
                    <p className="text-xs text-gray-600">
                      Your contribution of <span className="font-extrabold text-amber-900 font-mono">₹{completedDonation.amount.toLocaleString()}</span> to <span className="font-bold">{completedDonation.monumentName}</span> has been received.
                    </p>
                  </div>

                  {/* Receipt Preview Details Box */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-left space-y-2 text-xs">
                    <div className="flex justify-between border-b border-gray-200 pb-2 font-mono">
                      <span className="text-gray-500">Receipt No:</span>
                      <span className="font-bold text-gray-800">{completedDonation.id}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2 font-mono">
                      <span className="text-gray-500">Transaction ID:</span>
                      <span className="font-bold text-gray-800">{completedDonation.transactionId}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">Cause Supported:</span>
                      <span className="font-bold text-amber-900 text-right">{completedDonation.cause}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">80G Tax Exemption:</span>
                      <span className="font-bold text-emerald-700">{completedDonation.taxExemptionClaimed ? "Issued under IT Act Sec 80G" : "Receipt Available"}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      onClick={() => alert(`Official 80G Tax Exemption Receipt #${completedDonation.id} downloaded successfully to your device.`)}
                      className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4 text-amber-200" />
                      <span>Download Official 80G Tax Exemption Receipt</span>
                    </button>
                    
                    <button
                      onClick={() => { setShowPaymentModal(false); setCompletedDonation(null); }}
                      className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors"
                    >
                      Close & Return to Portal
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
