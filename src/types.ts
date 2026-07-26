// Shared TypeScript interfaces for the AI Smart Tourism & Heritage Platform

export interface QuickFacts {
  established: string;
  builder: string;
  architecturalStyle: string;
  primaryDeityOrPurpose: string;
  bestTimeToVisit: string;
}

export interface PhotoSpot {
  spot: string;
  bestTime: string;
  tip: string;
}

export interface NearbyAttraction {
  name: string;
  distance: string;
  description: string;
}

export interface HandicraftItem {
  name: string;
  itemType: string;
  description: string;
}

export interface RestaurantItem {
  name: string;
  cuisineType: string;
  mustTryDish: string;
  description: string;
}

export interface PerformanceItem {
  name: string;
  schedule: string;
  description: string;
}

export interface WorkshopItem {
  name: string;
  duration: string;
  description: string;
}

export interface LocalBusinesses {
  handicrafts: HandicraftItem[];
  restaurants: RestaurantItem[];
  performances: PerformanceItem[];
  workshops: WorkshopItem[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface ApiStatus {
  status: string;
  message: string;
}

export interface HeritageMonument {
  name: string;
  location: string;
  quickFacts: QuickFacts;
  history: string;
  architecture: string;
  culturalSignificance: string;
  legends: string;
  timeline: { year: string; event: string }[];
  photoSpots: PhotoSpot[];
  nearbyAttractions: NearbyAttraction[];
  localBusinesses: LocalBusinesses;
  quiz: QuizQuestion[];
  apiStatus?: ApiStatus;
}

// ----------------- TRAVEL PLANNER TYPES -----------------

export interface ActivityTransitInfo {
  currentLocation: string;
  nextDestination: string;
  walkingDistance: string;
  walkingTime: string;
  publicTransportRoute: string;
  taxiEstimate: string;
  routeDistance: string;
  estimatedTravelTime: string;
  googleMapsUrl: string;
  recommendedMode?: string;
  geminiSuggestionBadge?: string;
  weatherAlertNote?: string;
  bestOptionLabel?: string;
}

export interface ActivityAttractionDetails {
  nearbyMetroStation: string;
  nearestBusStop: string;
  parkingAvailability: string;
  wheelchairAccessible: string;
  ticketWaitingTime: string;
}

export interface Activity {
  time: string;
  activity: string;
  description: string;
  crowdStatus: "Low" | "Moderate" | "High" | string;
  transportRecommendation: string;
  tips: string;
  transitInfo?: ActivityTransitInfo;
  attractionDetails?: ActivityAttractionDetails;
}

export interface DayItinerary {
  dayNumber: number;
  theme: string;
  activities: Activity[];
}

export interface BudgetBreakdown {
  food: number;
  activities: number;
  lodging: number;
  transportation: number;
  currency: string;
}

export interface SeasonalInsights {
  overallRating: number;
  ratingStars: string;
  currentSeason: string;
  avgTemperature: string;
  rainProbability: string;
  humidity: string;
  expectedCrowdLevel: string;
  majorFestivals: string[];
  specialEvents: string[];
  tourismSeason: string;
  geminiRecommendation: string;
  recommendedBetterDates?: string;
}

export interface HotelRecommendation {
  id: string;
  name: string;
  starRating: number;
  pricePerNight: string;
  distanceFromAttractions: string;
  distanceFromMetro: string;
  safetyRating: string;
  guestRating: string;
  image: string;
  whyRecommended: string[];
  bookingUrl: string;
  agodaUrl: string;
  googleHotelsUrl: string;
  airbnbUrl: string;
}

export interface BudgetOptimization {
  currentEstimatedCost: number;
  optimizedCost: number;
  potentialSavings: number;
  currency: string;
  explanation: string;
  savingsBreakdown: {
    category: string;
    suggestion: string;
    amountSaved: number;
  }[];
}

export interface RoutePoint {
  id: string;
  order: number;
  name: string;
  type: string;
  arrivalTime: string;
  walkingDistance: string;
  drivingTime: string;
  metroRoute: string;
  transitDetails: string;
  googleMapsUrl: string;
}

export interface RouteMapData {
  totalDistance: string;
  totalTravelTime: string;
  totalWalkingDistance: string;
  points: RoutePoint[];
}

export interface PackingItem {
  id: string;
  category: string;
  item: string;
  reason: string;
  packed: boolean;
}

export interface ExportData {
  emergencyContacts: { name: string; number: string }[];
  qrCodeUrl: string;
  shareableUrl: string;
}

export interface TravelPlan {
  title: string;
  summary: string;
  budgetBreakdown: BudgetBreakdown;
  itinerary: DayItinerary[];
  seasonalInsights?: SeasonalInsights;
  hotelRecommendations?: HotelRecommendation[];
  budgetOptimization?: BudgetOptimization;
  routeMap?: RouteMapData;
  packingChecklist?: PackingItem[];
  exportData?: ExportData;
  apiStatus?: ApiStatus;
}

// ----------------- ANALYTICS TYPES -----------------

export interface VisitorTrend {
  label: string;
  visitors: number;
  revenue: number;
}

export interface AttractionPopularity {
  name: string;
  percentage: number;
  rating: number;
}

export interface CrowdHeatmapPoint {
  hour: string;
  density: number;
  status: "Low" | "Medium" | "Peak" | "Overloaded" | string;
}

export interface SentimentQuoteItem {
  text: string;
  locationNearby: string;
}

export interface SentimentCategorySummary {
  summary: string;
  keyThemes: string[];
  quotes: (string | SentimentQuoteItem)[];
  authorityAction: string;
}

export interface TouristSentiment {
  positive: number;
  neutral: number;
  negative: number;
  keyFeedback: string[];
  consolidatedSummaries?: {
    positive?: SentimentCategorySummary;
    neutral?: SentimentCategorySummary;
    negative?: SentimentCategorySummary;
  };
}

export interface ConservationAdvisory {
  structuralHealthSummary: string;
  environmentalFactors: string;
  conservationActions: string[];
  budgetAllocationRecommendation: string;
}

export interface AnalyticsDashboardData {
  region: string;
  timeframe: string;
  visitorTraffic: VisitorTrend[];
  attractionsPopularity: AttractionPopularity[];
  hourlyCrowdHeatmap: CrowdHeatmapPoint[];
  touristSentiment: TouristSentiment;
  conservationAdvisory: ConservationAdvisory;
  apiStatus?: ApiStatus;
}

// ----------------- COMPLAINT VERIFICATION TYPES -----------------

export interface ComplaintTimelineStep {
  stage: "Submitted" | "Verified" | "Assigned" | "Inspection Started" | "Resolved";
  timestamp: string;
  completed: boolean;
  notes?: string;
}

export interface AIVerificationResult {
  imageMatchesMonument: boolean;
  gpsMatchesMonument: boolean;
  distanceFromMonumentText: string;
  distanceFromMonumentMeters: number;
  aiConfidenceScore: number; // 0 - 100
  overallStatus: "Verified Complaint" | "Needs Review" | "Possible Fake Report";
  badgeColor: "green" | "yellow" | "red";
  verificationBadgeText: string;
  aiSummary: string;
  classifiedCategory: string;
  predictedSeverity: "Low" | "Medium" | "High" | "Critical";
  reasons: string[];
  isDuplicate: boolean;
  similarComplaintId?: string;
  supportCount: number;
}

export interface TouristComplaint {
  id: string;
  monumentName: string;
  monumentLocation?: string;
  category: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  address: string;
  deviceAccuracyMeters: number;
  timestamp: string;
  supportedByCount: number;
  aiVerification: AIVerificationResult;
  timeline: ComplaintTimelineStep[];
  currentStage: "Submitted" | "Verified" | "Assigned" | "Inspection Started" | "Resolved";
  assignedOfficer?: string;
  isPublicUserSubmitted?: boolean; // Flag to identify user's own complaints in 'My Complaints'
}

// ----------------- PUBLIC MONUMENT FEEDBACK TYPES -----------------

export interface CategoryRatings {
  cleanliness: number;
  crowdManagement: number;
  facilities: number;
  accessibility: number;
  guideQuality: number;
}

export interface PublicFeedback {
  id: string;
  visitorName: string;
  monumentName: string;
  monumentType: string;
  location?: string;
  overallRating: number; // 1 - 5
  categoryRatings: CategoryRatings;
  visitDate: string;
  reviewText: string;
  imageUrl?: string;
  wouldRecommend: boolean;
  timestamp: string;
  aiSentimentTag?: "Very Positive" | "Positive" | "Neutral" | "Constructive";
  likesCount?: number;
}

export interface TourismDonation {
  id: string;
  donorName: string;
  email?: string;
  monumentName: string;
  location: string;
  cause: string;
  amount: number;
  currency: string;
  paymentMethod: "UPI" | "Card" | "NetBanking";
  transactionId: string;
  timestamp: string;
  isAnonymous: boolean;
  message?: string;
  taxExemptionClaimed: boolean;
}

export interface HeritageDonationSite {
  id: string;
  name: string;
  location: string;
  state: string;
  category: string;
  imageUrl: string;
  targetFund: number;
  raisedFund: number;
  activeCause: string;
  donorCount: number;
}


export const MONUMENT_TYPES = [
  "Temple / Shrine",
  "Fort & Citadel",
  "Palace & Royal Residence",
  "Museum & Gallery",
  "Cave & Rock-Cut Architecture",
  "Tomb & Mausoleum",
  "Park & Garden",
  "Heritage Complex & Ruins",
  "Memorial & Tower",
  "Bridge & Aqueduct",
  "Other Cultural Site"
] as const;

// ----------------- PRE-SET SIMULATED MONUMENTS -----------------

export const PRESET_MONUMENTS = [
  {
    id: "meenakshi",
    name: "Madurai Meenakshi Temple",
    location: "Madurai, Tamil Nadu, India",
    description: "An ancient, highly complex temple dedicated to Goddess Meenakshi (Parvati) and Lord Sundareswarar (Shiva), featuring 14 majestic Gopurams (towers).",
    imageUrl: "https://images.unsplash.com/photo-1610123598147-f632aa18b275?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "tajmahal",
    name: "Taj Mahal",
    location: "Agra, Uttar Pradesh, India",
    description: "A breathtaking white-marble mausoleum commissioned in 1632 by Mughal Emperor Shah Jahan, combining Islamic, Persian, and Indian architectural styles.",
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "hampi",
    name: "Hampi Virupaksha Temple & Ruins",
    location: "Hampi, Karnataka, India",
    description: "The architectural marvel and political heart of the historical Vijayanagara Empire, featuring stone chariots, musical pillars, and sacred monoliths.",
    imageUrl: "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "chola_temples",
    name: "Great Living Chola Temples",
    location: "Thanjavur, Tamil Nadu, India",
    description: "The majestic Brihadisvara Temple, constructed in 1010 CE by Rajaraja I, boasting a solid granite vimana tower that never casts a shadow at noon.",
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
  }
];
