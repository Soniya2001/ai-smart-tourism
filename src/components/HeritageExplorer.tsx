import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Camera, Upload, Sparkles, BookOpen, Landmark, MapPin, 
  ChevronRight, Languages, Volume2, VolumeX, MessageSquare, 
  ShoppingBag, Award, HelpCircle, RefreshCw, AlertCircle, 
  CornerDownRight, Send, ArrowRight, Star, Heart, Clock, Play, Pause
} from "lucide-react";
import { HeritageMonument, PRESET_MONUMENTS } from "../types";

export default function HeritageExplorer() {
  const [selectedPreset, setSelectedPreset] = useState<string>("meenakshi");
  const [targetLanguage, setTargetLanguage] = useState<string>("English");
  const [monument, setMonument] = useState<HeritageMonument | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Tabs: facts, history, architecture, legends, timeline, businesses, quiz
  const [activeTab, setActiveTab] = useState<string>("history");

  // Camera & Image upload state
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Chat interface state
  const [chatMessage, setChatMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Audio Guide state
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<string>("Kore"); // Kore, Zephyr, Puck, Charon, Fenrir

  // Quiz state
  const [quizScore, setQuizScore] = useState<number>(0);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Available languages
  const languagesList = [
    "English", "Tamil", "Hindi", "Telugu", "Kannada", "Spanish", "French", "German", "Japanese", "Mandarin"
  ];

  // Voices available
  const voicesList = [
    { name: "Kore", desc: "Balanced Female" },
    { name: "Zephyr", desc: "Warm Male" },
    { name: "Puck", desc: "Friendly Youthful" },
    { name: "Charon", desc: "Deep Resonant" },
    { name: "Fenrir", desc: "Expressive Storyteller" }
  ];

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Cleanup audio
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Fetch Heritage details on selection/load
  const fetchHeritageDetails = async (nameQuery?: string, base64Image?: string) => {
    setLoading(true);
    setError(null);
    setMonument(null);
    setChatHistory([]);
    setQuizScore(0);
    setCurrentQuizQuestion(0);
    setSelectedOption(null);
    setQuizSubmitted(false);
    setQuizCompleted(false);

    // Stop audio
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setAudioUrl(null);
    }

    try {
      const payload: any = {
        targetLanguage
      };
      if (base64Image) {
        payload.image = base64Image;
      } else {
        const queryName = nameQuery || PRESET_MONUMENTS.find(p => p.id === selectedPreset)?.name || "Madurai Meenakshi Temple";
        payload.name = queryName;
      }

      const response = await fetch("/api/heritage/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Unable to identify or fetch details for this heritage monument.");
      }

      const data = await response.json();
      setMonument(data);
      setActiveTab("history");

      // Set initial chatbot context
      setChatHistory([
        {
          role: "model",
          parts: [{ text: `Welcome to ${data.name}! I am your AI Heritage Companion. Feel free to ask me any questions about the history, architectural style, or local folk tales surrounding this place.` }]
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while recognizing monument.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPreset && !imagePreview) {
      fetchHeritageDetails();
    }
  }, [selectedPreset, targetLanguage]);

  // Web camera controls
  const startCamera = async () => {
    setCameraActive(true);
    setImagePreview(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied or unavailable", err);
      alert("Could not access camera. Please upload an image file instead.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setImagePreview(dataUrl);
        stopCamera();
        fetchHeritageDetails(undefined, dataUrl);
      }
    }
  };

  // Upload file control
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setSelectedPreset("");
        fetchHeritageDetails(undefined, result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Chat Guide action
  const sendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || chatLoading || !monument) return;

    const userMessage = chatMessage;
    setChatMessage("");
    
    // Add user message to UI
    const updatedHistory = [
      ...chatHistory,
      { role: "user", parts: [{ text: userMessage }] }
    ];
    setChatHistory(updatedHistory);
    setChatLoading(true);

    try {
      const response = await fetch("/api/heritage/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: updatedHistory.slice(0, updatedHistory.length - 1), // exclude the last one since we send it separately
          systemInstruction: `You are an expert heritage guide at ${monument.name} situated in ${monument.location}. 
          Answer tourist queries with deep historical context, architectural detail, and fascinating tales. Keep explanations highly immersive and friendly.`
        })
      });

      if (!response.ok) {
        throw new Error("Failed to receive response from your guide.");
      }

      const data = await response.json();
      setChatHistory(data.history);
    } catch (err: any) {
      console.error(err);
      setChatHistory(prev => [
        ...prev,
        { role: "model", parts: [{ text: `I apologize, I am having trouble connecting to my local archives right now. Please try again! Error: ${err.message}` }] }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // TTS Narrator
  const generateVoiceGuide = async () => {
    if (!monument) return;
    
    // Select correct narration text based on active tab
    let speechText = "";
    if (activeTab === "history") {
      speechText = `Welcome to ${monument.name} in ${monument.location}. Let me guide you through its historical timeline. ${monument.history.substring(0, 400)}`;
    } else if (activeTab === "architecture") {
      speechText = `The structural style of ${monument.name} is magnificent. Here is a guide to its architectural elements: ${monument.architecture.substring(0, 400)}`;
    } else {
      speechText = `This is ${monument.name}. Built in ${monument.quickFacts.established} by ${monument.quickFacts.builder}. Enjoy your smart heritage journey!`;
    }

    setAudioLoading(true);
    try {
      const response = await fetch("/api/heritage/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: speechText,
          voiceName: selectedVoice
        })
      });

      if (!response.ok) {
        throw new Error("TTS generation failed");
      }

      const data = await response.json();
      const base64Audio = data.audio;
      const url = `data:audio/mp3;base64,${base64Audio}`;
      setAudioUrl(url);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error(err);
      alert("Failed to generate voice narration. Make sure your GEMINI_API_KEY supports TTS modality.");
    } finally {
      setAudioLoading(false);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) {
      generateVoiceGuide();
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Quiz interactive controller
  const handleQuizAnswer = (optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedOption(optionIdx);
  };

  const submitQuizAnswer = () => {
    if (selectedOption === null || !monument) return;
    setQuizSubmitted(true);
    const isCorrect = selectedOption === monument.quiz[currentQuizQuestion].answerIndex;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuizQuestion = () => {
    if (!monument) return;
    setSelectedOption(null);
    setQuizSubmitted(false);
    if (currentQuizQuestion < monument.quiz.length - 1) {
      setCurrentQuizQuestion(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuizScore(0);
    setCurrentQuizQuestion(0);
    setSelectedOption(null);
    setQuizSubmitted(false);
    setQuizCompleted(false);
  };

  return (
    <div id="heritage-explorer-section" className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            <Landmark className="h-6 w-6 text-amber-600" />
            Multimodal Heritage Explorer
          </h2>
          <p className="text-gray-500 mt-1">
            Scan monuments using Gemini Vision, listen to pleasant audio guides, and quiz yourself on history.
          </p>
        </div>

        {/* Language selector & Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs">
            <Languages className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-gray-500">Language:</span>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="font-semibold text-gray-700 bg-transparent focus:outline-none"
            >
              {languagesList.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Capture & Presets selection */}
        <div className="lg:col-span-4 space-y-6">
          {/* Preset List */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="h-4 w-4 text-amber-600" />
              Living Heritage Library
            </h3>
            <div className="space-y-2">
              {PRESET_MONUMENTS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPreset(preset.id);
                    setImagePreview(null);
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex gap-3 transition-all ${
                    selectedPreset === preset.id && !imagePreview
                      ? "border-amber-500 bg-amber-50/50"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <img 
                    src={preset.imageUrl} 
                    alt={preset.name}
                    className="h-12 w-12 rounded-lg object-cover bg-gray-100 border border-gray-100 shrink-0" 
                  />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 text-xs truncate">{preset.name}</h4>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{preset.location}</p>
                    <p className="text-[10px] text-gray-500 line-clamp-1 mt-1">{preset.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Camera Scan & Image Upload */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="h-4 w-4 text-amber-600" />
              Multimodal Vision Scan
            </h3>
            
            <div className="space-y-3">
              {/* Camera Preview Box */}
              {cameraActive ? (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-gray-800">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-2 border-dashed border-amber-400 opacity-60 pointer-events-none m-4 rounded-lg" />
                  <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2 px-4">
                    <button
                      onClick={capturePhoto}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-md flex items-center gap-1"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> Take Snap
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={startCamera}
                    className="flex-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-semibold p-4 rounded-xl text-xs flex flex-col items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Camera className="h-5 w-5 text-amber-700" />
                    <span>Open Live Camera</span>
                  </button>

                  <label className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold p-4 rounded-xl text-xs flex flex-col items-center justify-center gap-2 transition-all cursor-pointer">
                    <Upload className="h-5 w-5 text-gray-500" />
                    <span>Upload Image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              )}

              {imagePreview && (
                <div className="relative rounded-xl overflow-hidden border border-amber-200 bg-amber-50/20 p-2 space-y-2">
                  <div className="text-[10px] font-semibold text-amber-800 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 animate-pulse" /> Scanning uploaded image...
                  </div>
                  <img 
                    src={imagePreview} 
                    alt="Upload Preview" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setSelectedPreset("meenakshi");
                    }}
                    className="text-[10px] text-gray-400 hover:text-gray-600 block text-right underline"
                  >
                    Clear scanned image
                  </button>
                </div>
              )}
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>

        {/* Right Column: Heritage Explainer Dashboard */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-4 py-20"
              >
                <div className="relative inline-block">
                  <div className="h-14 w-14 rounded-full border-4 border-amber-100 border-t-amber-600 animate-spin" />
                  <Landmark className="h-5 w-5 text-amber-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-900">Decoding Multimodal Image...</h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Gemini is processing architectural carvings, historic scriptures, and translating everything to {targetLanguage}.
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
                  <h4 className="font-semibold text-sm">Failed to explore monument</h4>
                  <p className="text-xs text-red-700 mt-1">{error}</p>
                  <button
                    onClick={() => fetchHeritageDetails()}
                    className="text-xs font-semibold text-red-900 underline mt-2"
                  >
                    Retry Loading
                  </button>
                </div>
              </motion.div>
            )}

            {!loading && !error && monument && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Header Info */}
                <div className="bg-amber-950 text-white p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                    <Landmark className="h-44 w-44 translate-x-10 translate-y-10" />
                  </div>
                  <div className="relative z-10 space-y-2">
                    <div className="text-xs font-mono tracking-widest text-amber-300 uppercase flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" />
                      <span>Heritage Intelligence Report</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">{monument.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-amber-100">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{monument.location}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Facts Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 bg-amber-50/30 p-4 rounded-xl border border-amber-100/40 text-xs">
                  <div>
                    <span className="block text-gray-400 text-[10px] uppercase">Established</span>
                    <span className="font-semibold text-gray-800">{monument.quickFacts.established}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-[10px] uppercase">Builder / Ruler</span>
                    <span className="font-semibold text-gray-800 truncate block">{monument.quickFacts.builder}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-[10px] uppercase">Architecture Style</span>
                    <span className="font-semibold text-gray-800 truncate block">{monument.quickFacts.architecturalStyle}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-[10px] uppercase">Deity / Purpose</span>
                    <span className="font-semibold text-gray-800 truncate block">{monument.quickFacts.primaryDeityOrPurpose}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="block text-gray-400 text-[10px] uppercase">Best Time to Visit</span>
                    <span className="font-semibold text-amber-900 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-amber-600" /> {monument.quickFacts.bestTimeToVisit}
                    </span>
                  </div>
                </div>

                {/* Main Content Tabs */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="flex bg-gray-50 border-b border-gray-200 overflow-x-auto scrollbar-none">
                    {[
                      { id: "history", label: "📜 History", desc: "Lore & Timeline" },
                      { id: "architecture", label: "🏛 Architecture", desc: "Design & Style" },
                      { id: "legends", label: "✨ Folklore", desc: "Myths & Legends" },
                      { id: "photos", label: "📸 Photos & Views", desc: "Best Vantage Points" },
                      { id: "localSupport", label: "🛍 Community Support", desc: "Crafts & Food" },
                      { id: "quiz", label: "🏆 Fun Quiz", desc: "Badges & Certificates" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-3 border-b-2 text-xs font-semibold text-center shrink-0 transition-all ${
                          activeTab === tab.id
                            ? "border-amber-600 text-amber-950 bg-white"
                            : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
                        }`}
                      >
                        <div>{tab.label}</div>
                        <div className="text-[9px] font-normal text-gray-400 mt-0.5">{tab.desc}</div>
                      </button>
                    ))}
                  </div>

                  <div className="p-6">
                    <AnimatePresence mode="wait">
                      {/* HISTORY TAB */}
                      {activeTab === "history" && (
                        <motion.div
                          key="history"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-6"
                        >
                          <div className="flex items-center justify-between gap-4 bg-gray-50 p-3 rounded-xl">
                            <span className="text-xs text-gray-600 font-medium">🎧 Generate dynamic audio guide for history:</span>
                            <div className="flex items-center gap-2">
                              <select 
                                value={selectedVoice} 
                                onChange={(e) => setSelectedVoice(e.target.value)}
                                className="text-xs bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none"
                              >
                                {voicesList.map(v => (
                                  <option key={v.name} value={v.name}>{v.desc}</option>
                                ))}
                              </select>
                              <button
                                onClick={toggleAudio}
                                disabled={audioLoading}
                                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1"
                              >
                                {audioLoading ? (
                                  <RefreshCw className="h-3 w-3 animate-spin" />
                                ) : isPlaying ? (
                                  <><Pause className="h-3 w-3" /> Pause</>
                                ) : (
                                  <><Play className="h-3 w-3" /> Play Audio</>
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                              {monument.history}
                            </p>
                            
                            <div className="pt-4 border-t border-gray-100">
                              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Historical Construction Timeline</h4>
                              <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-200">
                                {monument.timeline?.map((item, idx) => (
                                  <div key={idx} className="flex gap-4 items-start pl-6 relative">
                                    <div className="absolute left-[5px] top-2 h-2 w-2 rounded-full bg-amber-600" />
                                    <div>
                                      <span className="text-xs font-bold text-amber-950 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">{item.year}</span>
                                      <p className="text-xs text-gray-500 mt-1">{item.event}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* ARCHITECTURE TAB */}
                      {activeTab === "architecture" && (
                        <motion.div
                          key="architecture"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center justify-between gap-4 bg-gray-50 p-3 rounded-xl">
                            <span className="text-xs text-gray-600 font-medium">🎧 Generate audio guide for architecture:</span>
                            <button
                              onClick={toggleAudio}
                              disabled={audioLoading}
                              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1"
                            >
                              {audioLoading ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : isPlaying ? (
                                <><Pause className="h-3 w-3" /> Pause</>
                              ) : (
                                <><Play className="h-3 w-3" /> Play Audio</>
                              )}
                            </button>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                            {monument.architecture}
                          </p>
                        </motion.div>
                      )}

                      {/* LEGENDS TAB */}
                      {activeTab === "legends" && (
                        <motion.div
                          key="legends"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                            <h4 className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">Sacred Folklore & Mythology</h4>
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                              {monument.legends}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {/* PHOTOS & VIEWS */}
                      {activeTab === "photos" && (
                        <motion.div
                          key="photos"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Expert Photo Spot Recommendations</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {monument.photoSpots?.map((spot, idx) => (
                              <div key={idx} className="p-4 bg-amber-50/20 border border-amber-100 rounded-xl space-y-1">
                                <h5 className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                                  <Camera className="h-4 w-4 text-amber-600" /> {spot.spot}
                                </h5>
                                <div className="text-[11px] text-amber-800 font-mono">Best Time: {spot.bestTime}</div>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{spot.tip}</p>
                              </div>
                            ))}
                          </div>

                          <div className="pt-4 border-t border-gray-100 space-y-3">
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Other Nearby Historic Sites</h4>
                            <div className="space-y-2">
                              {monument.nearbyAttractions?.map((att, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                  <div>
                                    <h5 className="font-semibold text-xs text-gray-800">{att.name}</h5>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{att.description}</p>
                                  </div>
                                  <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                                    {att.distance}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* LOCAL SUPPORT */}
                      {activeTab === "localSupport" && (
                        <motion.div
                          key="localSupport"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-6"
                        >
                          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-1">
                            <h4 className="text-xs font-semibold text-emerald-800 uppercase flex items-center gap-1">
                              <ShoppingBag className="h-4 w-4" /> Supporting the Local Community
                            </h4>
                            <p className="text-xs text-emerald-700 leading-relaxed">
                              Every landmark visited is connected to a thriving local community. Support handloom weavers, traditional workshops, and local culinary masters to keep heritage alive!
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Handicrafts */}
                            <div className="space-y-2">
                              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                🎨 Traditional Handicrafts
                              </h5>
                              <div className="space-y-2">
                                {monument.localBusinesses.handicrafts?.map((item, idx) => (
                                  <div key={idx} className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                    <div className="flex items-center justify-between">
                                      <span className="font-semibold text-xs text-gray-800">{item.name}</span>
                                      <span className="text-[9px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full">{item.itemType}</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-1">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Dining */}
                            <div className="space-y-2">
                              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                🍲 Authentic Regional Dining
                              </h5>
                              <div className="space-y-2">
                                {monument.localBusinesses.restaurants?.map((item, idx) => (
                                  <div key={idx} className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                    <div className="flex items-center justify-between">
                                      <span className="font-semibold text-xs text-gray-800">{item.name}</span>
                                      <span className="text-[9px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full">{item.cuisineType}</span>
                                    </div>
                                    <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">Must try: {item.mustTryDish}</div>
                                    <p className="text-[11px] text-gray-500 mt-1">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Performances */}
                            <div className="space-y-2">
                              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                🎭 Live Cultural Events
                              </h5>
                              <div className="space-y-2">
                                {monument.localBusinesses.performances?.map((item, idx) => (
                                  <div key={idx} className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                    <div className="flex items-center justify-between">
                                      <span className="font-semibold text-xs text-gray-800">{item.name}</span>
                                      <span className="text-[9px] font-mono bg-purple-50 text-purple-800 px-2 py-0.5 rounded-full">{item.schedule}</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-1">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Artisan Workshops */}
                            <div className="space-y-2">
                              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                🏺 Hands-on Workshops
                              </h5>
                              <div className="space-y-2">
                                {monument.localBusinesses.workshops?.map((item, idx) => (
                                  <div key={idx} className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                    <div className="flex items-center justify-between">
                                      <span className="font-semibold text-xs text-gray-800">{item.name}</span>
                                      <span className="text-[9px] font-mono bg-rose-50 text-rose-800 px-2 py-0.5 rounded-full">{item.duration}</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-1">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* TRIVIA QUIZ */}
                      {activeTab === "quiz" && (
                        <motion.div
                          key="quiz"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-6 max-w-xl mx-auto py-4"
                        >
                          <div className="text-center space-y-1">
                            <h4 className="text-base font-bold text-amber-950 flex items-center justify-center gap-1.5">
                              <Award className="h-5 w-5 text-amber-600" />
                              Heritage Badge Challenge
                            </h4>
                            <p className="text-xs text-gray-400">Complete this 3-question trivia challenge about {monument.name} to earn your digital badge!</p>
                          </div>

                          {!quizCompleted ? (
                            <div className="bg-amber-50/30 p-5 rounded-2xl border border-amber-100 space-y-4">
                              <div className="flex justify-between items-center border-b border-amber-100 pb-2.5">
                                <span className="text-xs font-bold text-amber-900">Question {currentQuizQuestion + 1} of {monument.quiz.length}</span>
                                <span className="text-xs font-mono text-gray-500">Score: {quizScore}</span>
                              </div>

                              <div className="space-y-3">
                                <p className="font-semibold text-sm text-gray-800">{monument.quiz[currentQuizQuestion].question}</p>
                                <div className="space-y-2">
                                  {monument.quiz[currentQuizQuestion].options.map((opt, idx) => {
                                    let style = "border-gray-200 hover:border-amber-400 bg-white text-gray-700";
                                    if (selectedOption === idx) {
                                      style = "border-amber-600 bg-amber-50 text-amber-950 font-semibold";
                                    }
                                    if (quizSubmitted) {
                                      if (idx === monument.quiz[currentQuizQuestion].answerIndex) {
                                        style = "border-green-600 bg-green-50 text-green-950 font-semibold";
                                      } else if (selectedOption === idx) {
                                        style = "border-red-600 bg-red-50 text-red-950";
                                      } else {
                                        style = "opacity-60 border-gray-100 bg-white";
                                      }
                                    }

                                    return (
                                      <button
                                        key={idx}
                                        disabled={quizSubmitted}
                                        onClick={() => handleQuizAnswer(idx)}
                                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${style}`}
                                      >
                                        <span>{opt}</span>
                                        {quizSubmitted && idx === monument.quiz[currentQuizQuestion].answerIndex && (
                                          <span className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded">Correct</span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {quizSubmitted && (
                                <div className="p-3 bg-white rounded-xl border border-gray-100 text-xs text-gray-500 space-y-1">
                                  <div className="font-semibold text-gray-800">Explanation:</div>
                                  <p>{monument.quiz[currentQuizQuestion].explanation}</p>
                                </div>
                              )}

                              <div className="pt-2 flex justify-end">
                                {!quizSubmitted ? (
                                  <button
                                    onClick={submitQuizAnswer}
                                    disabled={selectedOption === null}
                                    className="bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-semibold text-xs px-4 py-2 rounded-lg"
                                  >
                                    Submit Answer
                                  </button>
                                ) : (
                                  <button
                                    onClick={nextQuizQuestion}
                                    className="bg-amber-950 hover:bg-black text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1"
                                  >
                                    <span>{currentQuizQuestion < monument.quiz.length - 1 ? "Next Question" : "See Results"}</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center space-y-4">
                              <div className="text-4xl">🏆</div>
                              <div className="space-y-1">
                                <h5 className="font-bold text-gray-900 text-sm">Challenge Complete!</h5>
                                <p className="text-xs text-gray-500">You scored {quizScore} out of {monument.quiz.length}</p>
                              </div>

                              {quizScore === monument.quiz.length ? (
                                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800">
                                  🥇 <b>Perfect Score!</b> You have unlocked the exclusive <b>Explorer Badge</b> for {monument.name}. This is saved to your AR Treasure Hunt wallet!
                                </div>
                              ) : (
                                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-800">
                                  👍 <b>Good effort!</b> Feel free to try again to unlock the master badge.
                                </div>
                              )}

                              <div className="flex gap-2 justify-center pt-2">
                                <button
                                  onClick={resetQuiz}
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs px-4 py-2 rounded-lg"
                                >
                                  Retry Quiz
                                </button>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Chat Companion / RAG Guide */}
                <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4.5 w-4.5 text-amber-600 animate-pulse" />
                      <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider">Conversational Heritage Guide</h4>
                    </div>
                    <span className="text-[10px] text-gray-400">Ask questions like you are talking to a local professor</span>
                  </div>

                  {/* Chat logs */}
                  <div className="h-44 overflow-y-auto space-y-3 bg-white p-4 rounded-xl border border-gray-100">
                    {chatHistory.map((chat, idx) => {
                      const isModel = chat.role === "model";
                      return (
                        <div key={idx} className={`flex ${isModel ? "justify-start" : "justify-end"}`}>
                          <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                            isModel 
                              ? "bg-amber-50 text-amber-950 border border-amber-100/60" 
                              : "bg-amber-900 text-white"
                          }`}>
                            {chat.parts?.[0]?.text}
                          </div>
                        </div>
                      );
                    })}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-400 rounded-xl px-3 py-2 text-xs flex items-center gap-1.5">
                          <RefreshCw className="h-3 w-3 animate-spin" /> Thinking...
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat input form */}
                  <form onSubmit={sendChatMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder={`Ask me anything about ${monument.name}...`}
                      className="flex-1 bg-white border border-gray-200 px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-gray-800"
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !chatMessage.trim()}
                      className="bg-amber-900 hover:bg-black text-white px-3 py-2 rounded-xl text-xs font-semibold disabled:opacity-40"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
