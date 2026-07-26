import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Camera, Upload, Sparkles, BookOpen, Landmark, MapPin, 
  ChevronRight, Languages, Volume2, VolumeX, MessageSquare, 
  ShoppingBag, Award, HelpCircle, RefreshCw, AlertCircle, 
  CornerDownRight, Send, ArrowRight, Star, Heart, Clock, Play, Pause,
  Crown, UserCheck
} from "lucide-react";
import { HeritageMonument, PRESET_MONUMENTS } from "../types";
import { HistoricalPersonality, getPersonalitiesForMonument } from "../lib/personalitiesData";

export default function HeritageExplorer() {
  const [selectedPreset, setSelectedPreset] = useState<string>("meenakshi");
  const [targetLanguage, setTargetLanguage] = useState<string>("English");
  const [monument, setMonument] = useState<HeritageMonument | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Tabs: facts, history, architecture, legends, timeline, businesses, quiz
  const [activeTab, setActiveTab] = useState<string>("history");

  // Historical Personalities state
  const [personalitiesList, setPersonalitiesList] = useState<HistoricalPersonality[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState<HistoricalPersonality | null>(null);

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
  const [voiceEngine, setVoiceEngine] = useState<"gemini" | "browser">("browser"); // Default to browser since it supports translation & fallback 100%
  const [playingTab, setPlayingTab] = useState<"history" | "architecture" | "legends" | null>(null);

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

  // Track last fetched parameters to prevent duplicate fetching
  const lastFetchedRef = useRef<string>("");
  const fetchCounterRef = useRef<number>(0);

  // Clean up audio & speech on unmount, and trigger voice load
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Fetch Heritage details on selection/load
  const fetchHeritageDetails = async (presetId?: string, base64Image?: string, lang?: string) => {
    const currentFetchId = ++fetchCounterRef.current;
    setLoading(true);
    setError(null);
    setMonument(null);
    setChatHistory([]);
    setQuizScore(0);
    setCurrentQuizQuestion(0);
    setSelectedOption(null);
    setQuizSubmitted(false);
    setQuizCompleted(false);

    // Stop active audio
    stopPlayback();

    try {
      const activeLanguage = lang || targetLanguage;
      const payload: any = {
        targetLanguage: activeLanguage
      };
      if (base64Image) {
        payload.image = base64Image;
      } else {
        const idToQuery = presetId || selectedPreset || "meenakshi";
        const queryName = PRESET_MONUMENTS.find(p => p.id === idToQuery)?.name || "Madurai Meenakshi Temple";
        payload.name = queryName;
      }

      const response = await fetch("/api/heritage/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (currentFetchId !== fetchCounterRef.current) return;

      if (!response.ok) {
        throw new Error("Unable to identify or fetch details for this heritage monument.");
      }

      const data = await response.json();
      if (currentFetchId !== fetchCounterRef.current) return;
      setMonument(data);
      setActiveTab("history");

      // Load historical personalities for this monument
      const activePersonalities = getPersonalitiesForMonument(data.name);
      setPersonalitiesList(activePersonalities);
      const initialPers = activePersonalities[0];
      setSelectedPersonality(initialPers);

      // Set initial chatbot context with selected personality greeting
      setChatHistory([
        {
          role: "model",
          parts: [{ text: initialPers.greeting }]
        }
      ]);
    } catch (err: any) {
      if (currentFetchId !== fetchCounterRef.current) return;
      console.error(err);
      setError(err.message || "An error occurred while recognizing monument.");
    } finally {
      if (currentFetchId === fetchCounterRef.current) {
        setLoading(false);
      }
    }
  };

  // Initial load only
  useEffect(() => {
    fetchHeritageDetails("meenakshi", undefined, targetLanguage);
  }, []);

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
        setSelectedPreset("");
        stopCamera();
        fetchHeritageDetails(undefined, dataUrl, targetLanguage);
      }
    }
  };

  // Upload file control
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      setMonument(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setSelectedPreset("");
        fetchHeritageDetails(undefined, result, targetLanguage);
      };
      reader.readAsDataURL(file);
    }
  };

  // Personality switch action
  const handleSelectPersonality = (p: HistoricalPersonality) => {
    if (selectedPersonality?.id === p.id) return;
    setSelectedPersonality(p);
    setChatHistory([
      {
        role: "model",
        parts: [{ text: p.greeting }]
      }
    ]);
  };

  // Chat Guide action
  const sendChatMessage = async (e?: React.FormEvent, directMessage?: string) => {
    if (e) e.preventDefault();
    const msgToSend = directMessage || chatMessage;
    if (!msgToSend.trim() || chatLoading || !monument || !selectedPersonality) return;

    setChatMessage("");
    const userMessage = msgToSend;
    
    // Add user message to UI
    const updatedHistory = [
      ...chatHistory,
      { role: "user", parts: [{ text: userMessage }] }
    ];
    setChatHistory(updatedHistory);
    setChatLoading(true);

    try {
      const systemInstruction = `You are playing the role of ${selectedPersonality.name} (${selectedPersonality.role}, ${selectedPersonality.period}, ${selectedPersonality.dynastyOrBackground}), connected to the monument "${monument.name}" in ${monument.location}.

CRITICAL RAG & GROUNDING INSTRUCTIONS:
1. Speak ALWAYS in character as ${selectedPersonality.name} from your specific historical perspective, tone, and time period. Use polite, respectful, and historically grounded language.
2. Ground all answers strictly in verified historical records, archaeological findings, and authentic folklore about ${monument.name}.
3. Do NOT fabricate historical events or pretend to know about modern events beyond your era.
4. If asked about information that is unavailable or unverified in historical records, respond with:
"Historical records do not provide enough verified information to answer this accurately."
5. You MUST respond in the requested language: "${targetLanguage}". Keep answers concise, educational, and engaging (2-4 sentences).`;

      const response = await fetch("/api/heritage/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: updatedHistory.slice(0, updatedHistory.length - 1),
          systemInstruction,
          personality: selectedPersonality,
          monumentName: monument.name,
          targetLanguage
        })
      });

      if (!response.ok) {
        throw new Error("Failed to receive response from historical figure.");
      }

      const data = await response.json();
      setChatHistory(data.history);
    } catch (err: any) {
      console.error(err);
      setChatHistory(prev => [
        ...prev,
        { role: "model", parts: [{ text: `I apologize, traveler. Historical archives are currently inaccessible. Error: ${err.message}` }] }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // TTS & Browser Voice player
  const startPlayback = async (type: "history" | "architecture" | "legends") => {
    if (!monument) return;

    // Stop any existing playback first
    stopPlayback();

    let speechText = "";
    if (type === "history") {
      speechText = `Welcome to ${monument.name} in ${monument.location}. Let me walk you through its history. ${monument.history}`;
    } else if (type === "architecture") {
      speechText = `Let's explore the architectural style of ${monument.name}. ${monument.architecture}`;
    } else if (type === "legends") {
      speechText = `The sacred legends and folklore of ${monument.name} are remarkable. ${monument.legends}`;
    }

    // Clean up text (strip simple formatting and limit characters for clean synthetic audio)
    const cleanText = speechText.replace(/[*#_`\-]/g, "").substring(0, 500);

    setPlayingTab(type);
    setIsPlaying(true);

    if (voiceEngine === "browser") {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(cleanText);
          (window as any).activeSpeechUtterance = utterance;
          
          // Map target language string to standard locales
          const langMap: Record<string, string> = {
            "English": "en-US",
            "Tamil": "ta-IN",
            "Hindi": "hi-IN",
            "Telugu": "te-IN",
            "Kannada": "kn-IN",
            "Spanish": "es-ES",
            "French": "fr-FR",
            "German": "de-DE",
            "Japanese": "ja-JP",
            "Mandarin": "zh-CN"
          };
          utterance.lang = langMap[targetLanguage] || "en-US";
          
          // Match browser voice
          const voices = window.speechSynthesis.getVoices();
          const matchingVoice = voices.find(v => v.lang.startsWith(utterance.lang));
          if (matchingVoice) {
            utterance.voice = matchingVoice;
          }

          utterance.onend = () => {
            setIsPlaying(false);
            setPlayingTab(null);
            (window as any).activeSpeechUtterance = null;
          };
          utterance.onerror = (e) => {
            console.error("Native speech synthesis error:", e);
            setIsPlaying(false);
            setPlayingTab(null);
            (window as any).activeSpeechUtterance = null;
          };

          window.speechSynthesis.speak(utterance);
          
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        }, 150);
      } else {
        alert("Native device speech synthesis is not supported on this browser.");
        setIsPlaying(false);
        setPlayingTab(null);
      }
    } else {
      // Gemini AI Premium TTS Engine
      setAudioLoading(true);
      try {
        const response = await fetch("/api/heritage/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: cleanText,
            voiceName: selectedVoice
          })
        });

        if (!response.ok) {
          throw new Error("Gemini AI TTS service unavailable.");
        }

        const data = await response.json();
        const url = `data:audio/mp3;base64,${data.audio}`;
        setAudioUrl(url);

        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          setIsPlaying(false);
          setPlayingTab(null);
        };
        audio.onerror = () => {
          setIsPlaying(false);
          setPlayingTab(null);
        };
        await audio.play();
      } catch (err) {
        console.error(err);
        // Fallback gracefully to browser SpeechSynthesis
        setVoiceEngine("browser");
        // Trigger speaking using browser engine instead
        setTimeout(() => {
          window.speechSynthesis.cancel();
          setTimeout(() => {
            const fallbackUtterance = new SpeechSynthesisUtterance(cleanText);
            (window as any).activeSpeechUtterance = fallbackUtterance;
            const langMap: Record<string, string> = {
              "English": "en-US", "Tamil": "ta-IN", "Hindi": "hi-IN", "Telugu": "te-IN",
              "Kannada": "kn-IN", "Spanish": "es-ES", "French": "fr-FR", "German": "de-DE",
              "Japanese": "ja-JP", "Mandarin": "zh-CN"
            };
            fallbackUtterance.lang = langMap[targetLanguage] || "en-US";
            fallbackUtterance.onend = () => {
              setIsPlaying(false);
              setPlayingTab(null);
              (window as any).activeSpeechUtterance = null;
            };
            fallbackUtterance.onerror = () => {
              setIsPlaying(false);
              setPlayingTab(null);
              (window as any).activeSpeechUtterance = null;
            };
            window.speechSynthesis.speak(fallbackUtterance);
            if (window.speechSynthesis.paused) {
              window.speechSynthesis.resume();
            }
          }, 150);
        }, 100);
      } finally {
        setAudioLoading(false);
      }
    }
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setPlayingTab(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const togglePlayback = (type: "history" | "architecture" | "legends") => {
    if (isPlaying && playingTab === type) {
      stopPlayback();
    } else {
      startPlayback(type);
    }
  };

  // Reset audio playback on tab or monument change to prevent sound bleed
  useEffect(() => {
    stopPlayback();
  }, [activeTab, monument]);

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

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs">
            <Languages className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-gray-500">Language:</span>
            <select
              value={targetLanguage}
              onChange={(e) => {
                const newLang = e.target.value;
                setTargetLanguage(newLang);
                fetchHeritageDetails(selectedPreset || undefined, imagePreview || undefined, newLang);
              }}
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
                    fetchHeritageDetails(preset.id, undefined, targetLanguage);
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
                  <div className="text-[10px] font-semibold flex items-center gap-1">
                    {loading ? (
                      <span className="text-amber-800 flex items-center gap-1">
                        <Sparkles className="h-3 w-3 animate-pulse text-amber-600" /> Scanning uploaded image...
                      </span>
                    ) : error ? (
                      <span className="text-red-700 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 text-red-500" /> Scanning failed
                      </span>
                    ) : (
                      <span className="text-emerald-800 flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-emerald-600" /> Image analyzed successfully
                      </span>
                    )}
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
                      fetchHeritageDetails("meenakshi", undefined, targetLanguage);
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
                key="loading"
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
                key="error"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Failed to explore monument</h4>
                  <p className="text-xs text-red-700 mt-1">{error}</p>
                  <button
                    onClick={() => fetchHeritageDetails(undefined, imagePreview || undefined)}
                    className="text-xs font-semibold text-red-900 underline mt-2"
                  >
                    Retry Loading
                  </button>
                </div>
              </motion.div>
            )}

            {!loading && !error && monument && (
              <motion.div
                key="monument"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* API Status Banner */}
                {monument.apiStatus && (monument.apiStatus.status === "exhausted" || monument.apiStatus.status === "invalid_key") && (
                  <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4.5 space-y-2 text-xs text-amber-900 shadow-sm">
                    <div className="flex items-center gap-2 font-bold">
                      <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>Gemini API Status Notice: Operating in Offline Fallback Mode</span>
                    </div>
                    <p className="text-amber-800 leading-relaxed font-sans">
                      {monument.apiStatus.message}
                    </p>
                    <div className="text-[10px] text-amber-600/90 font-mono mt-1">
                      Our system automatically loaded high-quality pre-cached regional plans so your travel drafting works without interruption.
                    </div>
                  </div>
                )}

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

                {/* 🎧 VOICE TOUR GUIDE COMPANION PANEL */}
                <div id="voice-tour-guide-panel" className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/60 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/40">
                    <div className="flex items-center gap-2">
                      <div className="bg-amber-100 p-2 rounded-xl text-amber-800">
                        <Volume2 className={`h-5 w-5 ${isPlaying ? "animate-bounce" : ""}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-950 text-sm tracking-tight flex items-center gap-1.5">
                          <span>Voice Tour Guide Console</span>
                          {isPlaying && (
                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-200 text-amber-800 text-[9px] uppercase font-mono tracking-widest animate-pulse">
                              Active Guide
                            </span>
                          )}
                        </h4>
                        <p className="text-[10px] text-amber-800/80">
                          Select narrative, choose engine, and listen to immersive audio.
                        </p>
                      </div>
                    </div>

                    {/* Engine selection toggle */}
                    <div className="flex items-center bg-amber-100/60 p-1 rounded-xl border border-amber-200/40 self-start sm:self-auto shrink-0">
                      <button
                        onClick={() => { stopPlayback(); setVoiceEngine("browser"); }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                          voiceEngine === "browser"
                            ? "bg-white text-amber-950 shadow-sm"
                            : "text-amber-800 hover:text-amber-950"
                        }`}
                      >
                        📱 Device Speech ({targetLanguage})
                      </button>
                      <button
                        onClick={() => { stopPlayback(); setVoiceEngine("gemini"); }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all flex items-center gap-1 ${
                          voiceEngine === "gemini"
                            ? "bg-white text-amber-950 shadow-sm"
                            : "text-amber-800 hover:text-amber-950"
                        }`}
                      >
                        🌟 Gemini AI (EN)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Controls section */}
                    <div className="md:col-span-7 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => togglePlayback("history")}
                        disabled={audioLoading}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border font-semibold text-xs transition-all ${
                          playingTab === "history" && isPlaying
                            ? "bg-amber-700 text-white border-amber-700 shadow-sm"
                            : "bg-white hover:bg-amber-50 text-gray-800 border-gray-200"
                        }`}
                      >
                        {audioLoading && playingTab === "history" ? (
                          <RefreshCw className="h-4 w-4 animate-spin text-amber-600" />
                        ) : playingTab === "history" && isPlaying ? (
                          <><Pause className="h-4 w-4 text-white" /> Pause History</>
                        ) : (
                          <><Play className="h-4 w-4 text-amber-700" /> Play History</>
                        )}
                      </button>

                      <button
                        onClick={() => togglePlayback("architecture")}
                        disabled={audioLoading}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border font-semibold text-xs transition-all ${
                          playingTab === "architecture" && isPlaying
                            ? "bg-amber-700 text-white border-amber-700 shadow-sm"
                            : "bg-white hover:bg-amber-50 text-gray-800 border-gray-200"
                        }`}
                      >
                        {audioLoading && playingTab === "architecture" ? (
                          <RefreshCw className="h-4 w-4 animate-spin text-amber-600" />
                        ) : playingTab === "architecture" && isPlaying ? (
                          <><Pause className="h-4 w-4 text-white" /> Pause Architecture</>
                        ) : (
                          <><Play className="h-4 w-4 text-amber-700" /> Play Architecture</>
                        )}
                      </button>

                      <button
                        onClick={() => togglePlayback("legends")}
                        disabled={audioLoading}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border font-semibold text-xs transition-all ${
                          playingTab === "legends" && isPlaying
                            ? "bg-amber-700 text-white border-amber-700 shadow-sm"
                            : "bg-white hover:bg-amber-50 text-gray-800 border-gray-200"
                        }`}
                      >
                        {audioLoading && playingTab === "legends" ? (
                          <RefreshCw className="h-4 w-4 animate-spin text-amber-600" />
                        ) : playingTab === "legends" && isPlaying ? (
                          <><Pause className="h-4 w-4 text-white" /> Pause Folklore</>
                        ) : (
                          <><Play className="h-4 w-4 text-amber-700" /> Play Folklore</>
                        )}
                      </button>
                    </div>

                    {/* Secondary voice/accent controls */}
                    <div className="md:col-span-5 bg-amber-100/30 p-3 rounded-xl border border-amber-200/20 flex items-center justify-between gap-3">
                      {voiceEngine === "gemini" ? (
                        <>
                          <span className="text-[10px] text-amber-900 font-semibold shrink-0">AI Persona:</span>
                          <select
                            value={selectedVoice}
                            onChange={(e) => { stopPlayback(); setSelectedVoice(e.target.value); }}
                            className="w-full text-[10px] bg-white border border-amber-200/60 rounded px-2 py-1 text-gray-700 focus:outline-none"
                          >
                            {voicesList.map(v => (
                              <option key={v.name} value={v.name}>{v.desc}</option>
                            ))}
                          </select>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-[10px] text-amber-900 font-medium">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                          <span>Translated to <strong className="font-semibold text-amber-950">{targetLanguage}</strong> using device synthesizer.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Waveform Visualization when playing */}
                  {isPlaying && (
                    <div className="bg-amber-950/90 text-amber-100 text-[10px] p-2.5 rounded-xl flex items-center justify-between gap-4">
                      <span className="font-medium truncate max-w-xs md:max-w-md">
                        🔊 Narrating: <span className="text-amber-300 font-semibold">
                          {playingTab === "history" && "Historical Background Timeline"}
                          {playingTab === "architecture" && "Architectural Carvings & Designs"}
                          {playingTab === "legends" && "Folklore & Mythological Narratives"}
                        </span>
                      </span>
                      <div className="flex items-center gap-0.5 h-3">
                        <span className="w-0.5 bg-amber-400 h-1.5 animate-[pulse_1s_infinite]" />
                        <span className="w-0.5 bg-amber-400 h-3 animate-[pulse_0.7s_infinite_0.1s]" />
                        <span className="w-0.5 bg-amber-400 h-2 animate-[pulse_0.9s_infinite_0.2s]" />
                        <span className="w-0.5 bg-amber-400 h-3 animate-[pulse_0.6s_infinite_0.3s]" />
                        <span className="w-0.5 bg-amber-400 h-1 animate-[pulse_0.8s_infinite_0.4s]" />
                      </div>
                    </div>
                  )}
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
                          <div className="flex items-center justify-between gap-4 bg-amber-50/40 p-3 rounded-xl border border-amber-100/40">
                            <span className="text-xs text-amber-900 font-semibold flex items-center gap-1">
                              <Volume2 className="h-4 w-4 text-amber-700" />
                              Listen to Historical Audio Narrator:
                            </span>
                            <button
                              onClick={() => togglePlayback("history")}
                              disabled={audioLoading}
                              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              {audioLoading && playingTab === "history" ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : playingTab === "history" && isPlaying ? (
                                <><Pause className="h-3 w-3" /> Pause</>
                              ) : (
                                <><Play className="h-3 w-3" /> Play Timeline</>
                              )}
                            </button>
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
                          <div className="flex items-center justify-between gap-4 bg-amber-50/40 p-3 rounded-xl border border-amber-100/40">
                            <span className="text-xs text-amber-900 font-semibold flex items-center gap-1">
                              <Volume2 className="h-4 w-4 text-amber-700" />
                              Listen to Architectural Audio Tour:
                            </span>
                            <button
                              onClick={() => togglePlayback("architecture")}
                              disabled={audioLoading}
                              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              {audioLoading && playingTab === "architecture" ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : playingTab === "architecture" && isPlaying ? (
                                <><Pause className="h-3 w-3" /> Pause</>
                              ) : (
                                <><Play className="h-3 w-3" /> Play Tour</>
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
                          <div className="flex items-center justify-between gap-4 bg-amber-50/40 p-3 rounded-xl border border-amber-100/40">
                            <span className="text-xs text-amber-900 font-semibold flex items-center gap-1">
                              <Volume2 className="h-4 w-4 text-amber-700" />
                              Listen to Mythological Folklore:
                            </span>
                            <button
                              onClick={() => togglePlayback("legends")}
                              disabled={audioLoading}
                              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              {audioLoading && playingTab === "legends" ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : playingTab === "legends" && isPlaying ? (
                                <><Pause className="h-3 w-3" /> Pause</>
                              ) : (
                                <><Play className="h-3 w-3" /> Play Folklore</>
                              )}
                            </button>
                          </div>
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

                {/* 👑 TALK TO HISTORICAL PERSONALITIES SECTION */}
                <div id="talk-to-personalities" className="bg-gradient-to-b from-amber-900/5 via-amber-50/50 to-stone-100/60 rounded-3xl border border-amber-200/80 p-5 md:p-7 shadow-md space-y-5">
                  
                  {/* Header Section */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/60 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="p-1.5 bg-amber-100 text-amber-900 rounded-lg text-lg shadow-xs">👑</span>
                        <h3 className="font-bold text-gray-900 text-base md:text-xl tracking-tight flex items-center gap-2">
                          TALK TO HISTORICAL PERSONALITIES
                        </h3>
                      </div>
                      <p className="text-amber-900/80 font-medium text-xs md:text-sm">
                        Grounded conversations with historical figures based on verified historical sources.
                      </p>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-2 bg-amber-100/80 px-3 py-1.5 rounded-full border border-amber-200 text-amber-900 text-xs font-medium">
                      <Sparkles className="h-3.5 w-3.5 text-amber-700 animate-pulse" />
                      <span>"Converse with the legends who shaped history."</span>
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="bg-white/80 backdrop-blur-xs p-3.5 md:p-4 rounded-2xl border border-amber-200/70 text-xs md:text-sm text-stone-700 leading-relaxed shadow-xs">
                    Step into history by speaking directly with the people who shaped this monument. Select a historical personality and begin an immersive AI-powered conversation grounded in verified historical knowledge.
                  </div>

                  {/* Personality Selector Carousel / Horizontal Scroll */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-amber-950 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Crown className="h-4 w-4 text-amber-600" />
                        Select a Historical Personality ({personalitiesList.length})
                      </span>
                      <span className="text-[11px] text-stone-500 font-normal">Scroll horizontal to view all</span>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-3 pt-1 snap-x no-scrollbar">
                      {personalitiesList.map((p) => {
                        const isSelected = selectedPersonality?.id === p.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => handleSelectPersonality(p)}
                            className={`flex-none w-56 md:w-64 p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer snap-start relative group shadow-sm ${
                              isSelected
                                ? "bg-gradient-to-br from-amber-900 to-yellow-950 text-white border-amber-500 ring-2 ring-amber-500/40 shadow-md scale-[1.02]"
                                : "bg-white hover:bg-amber-50/80 text-stone-800 border-amber-200/80 hover:border-amber-400"
                            }`}
                          >
                            {/* Active speaking badge */}
                            {isSelected && (
                              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-amber-400/20 backdrop-blur-xs border border-amber-400/50 px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-200 animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                                Speaking
                              </div>
                            )}

                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-inner bg-gradient-to-br ${p.colorGradient} border border-amber-200/30 text-white`}>
                                {p.avatarIcon}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className={`font-bold text-xs md:text-sm truncate ${isSelected ? "text-amber-100" : "text-stone-900"}`}>
                                  {p.name}
                                </h4>
                                <p className={`text-[11px] font-medium truncate ${isSelected ? "text-amber-200/90" : "text-amber-800"}`}>
                                  {p.role}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[10px] mt-2 pt-2 border-t border-current/10">
                              <span className={`font-semibold ${isSelected ? "text-amber-200" : "text-stone-600"}`}>
                                {p.period}
                              </span>
                              <span className={`px-2 py-0.5 rounded-md font-medium text-[9px] ${isSelected ? "bg-amber-800/60 text-amber-100" : p.badgeBg}`}>
                                {p.dynastyOrBackground}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Chat Box Container */}
                  {selectedPersonality && (
                    <div className="bg-white rounded-2xl border border-amber-200/90 shadow-md overflow-hidden">
                      
                      {/* Personality Banner Header */}
                      <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-stone-900 text-white p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-amber-800">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-2xl shadow-md border border-amber-300/40">
                            {selectedPersonality.avatarIcon}
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-widest text-amber-300 font-semibold flex items-center gap-1.5">
                              <Crown className="h-3 w-3 text-amber-400" /> Currently Speaking With
                            </div>
                            <h4 className="font-bold text-base md:text-lg text-white flex items-center gap-2">
                              {selectedPersonality.name}
                            </h4>
                            <div className="text-xs text-amber-200/80 font-medium flex items-center gap-2 flex-wrap mt-0.5">
                              <span>{selectedPersonality.role}</span>
                              <span>•</span>
                              <span>{selectedPersonality.dynastyOrBackground}</span>
                              <span>•</span>
                              <span className="text-amber-300 font-semibold">{selectedPersonality.period}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-amber-950/80 border border-amber-700/60 px-3 py-1.5 rounded-xl text-center self-start md:self-auto">
                          <span className="text-[10px] uppercase tracking-wider text-amber-400 block font-semibold">Monument Context</span>
                          <span className="text-xs font-bold text-amber-100">{monument.name}</span>
                        </div>
                      </div>

                      {/* Suggested Questions Chips */}
                      {selectedPersonality.suggestedQuestions && selectedPersonality.suggestedQuestions.length > 0 && (
                        <div className="bg-amber-50/70 border-b border-amber-200/60 p-3 px-4 md:px-5">
                          <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <HelpCircle className="h-3.5 w-3.5 text-amber-700" />
                            Suggested Questions for {selectedPersonality.name}:
                          </div>
                          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {selectedPersonality.suggestedQuestions.map((q, qIdx) => (
                              <button
                                key={qIdx}
                                onClick={() => sendChatMessage(undefined, q)}
                                disabled={chatLoading}
                                className="flex-none bg-white hover:bg-amber-100/80 text-amber-950 text-xs px-3 py-1.5 rounded-full border border-amber-200 hover:border-amber-400 transition-all font-medium shadow-2xs hover:shadow-xs disabled:opacity-50 cursor-pointer whitespace-nowrap"
                              >
                                "{q}"
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Chat Messages Log */}
                      <div className="h-72 md:h-80 overflow-y-auto p-4 md:p-5 space-y-4 bg-gradient-to-b from-stone-50/80 via-white to-amber-50/30">
                        {chatHistory.map((chat, idx) => {
                          const isModel = chat.role === "model";
                          return (
                            <div key={idx} className={`flex ${isModel ? "justify-start" : "justify-end"}`}>
                              <div className={`max-w-[88%] md:max-w-[80%] rounded-2xl p-3.5 md:p-4 text-xs md:text-sm leading-relaxed shadow-xs ${
                                isModel
                                  ? "bg-amber-50/90 text-amber-950 border border-amber-200/80 rounded-tl-xs"
                                  : "bg-amber-900 text-white rounded-tr-xs shadow-sm"
                              }`}>
                                {isModel && (
                                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 border-b border-amber-200/60 pb-1 mb-1.5 flex items-center justify-between gap-2">
                                    <span className="flex items-center gap-1">
                                      <span>{selectedPersonality.avatarIcon}</span>
                                      <span>{selectedPersonality.name}</span>
                                    </span>
                                    <span className="text-[9px] text-amber-700/80 font-medium">Grounded AI</span>
                                  </div>
                                )}
                                <div className="whitespace-pre-wrap">{chat.parts?.[0]?.text}</div>
                              </div>
                            </div>
                          );
                        })}

                        {chatLoading && (
                          <div className="flex justify-start">
                            <div className="bg-amber-100/80 border border-amber-200 text-amber-900 rounded-2xl rounded-tl-xs px-4 py-3 text-xs flex items-center gap-2">
                              <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-700" />
                              <span>{selectedPersonality.name} is consulting historical archives...</span>
                            </div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Chat Form Input */}
                      <form onSubmit={(e) => sendChatMessage(e)} className="p-3.5 md:p-4 bg-white border-t border-amber-200/80 flex gap-2">
                        <input
                          type="text"
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          placeholder={selectedPersonality.placeholderText}
                          className="flex-1 bg-amber-50/40 border border-amber-200/90 px-4 py-2.5 rounded-xl text-xs md:text-sm focus:outline-none focus:border-amber-600 focus:bg-white text-stone-900 placeholder:text-stone-400 font-medium transition-all"
                        />
                        <button
                          type="submit"
                          disabled={chatLoading || !chatMessage.trim()}
                          className="bg-gradient-to-r from-amber-800 to-yellow-900 hover:from-amber-900 hover:to-stone-950 text-white px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 shadow-sm disabled:opacity-40 transition-all cursor-pointer"
                        >
                          <span>Send</span>
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Information Card */}
                  <div className="bg-amber-100/60 border border-amber-200/80 rounded-2xl p-3.5 px-4 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2 font-bold text-amber-900 text-xs">
                      <Sparkles className="h-4 w-4 text-amber-600" />
                      <span>⚡ Powered by Google Gemini</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-amber-800 font-medium">
                      <span>• Grounded using verified historical archives</span>
                      <span>• Multilingual AI Conversations</span>
                      <span>• Retrieval-Augmented Generation (RAG)</span>
                      <span>• Educational AI Experience</span>
                    </div>
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
