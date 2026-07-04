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
}

// ----------------- TRAVEL PLANNER TYPES -----------------

export interface Activity {
  time: string;
  activity: string;
  description: string;
  crowdStatus: "Low" | "Moderate" | "High" | string;
  transportRecommendation: string;
  tips: string;
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

export interface TravelPlan {
  title: string;
  summary: string;
  budgetBreakdown: BudgetBreakdown;
  itinerary: DayItinerary[];
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

export interface TouristSentiment {
  positive: number;
  neutral: number;
  negative: number;
  keyFeedback: string[];
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
}

// ----------------- PRE-SET SIMULATED MONUMENTS -----------------

export const PRESET_MONUMENTS = [
  {
    id: "meenakshi",
    name: "Madurai Meenakshi Temple",
    location: "Madurai, Tamil Nadu, India",
    description: "An ancient, highly complex temple dedicated to Goddess Meenakshi (Parvati) and Lord Sundareswarar (Shiva), featuring 14 majestic Gopurams (towers).",
    imageUrl: "https://images.unsplash.com/photo-1600100397608-f010e4080894?auto=format&fit=crop&w=800&q=80"
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
    imageUrl: "https://images.unsplash.com/photo-1600100397608-f010e4080894?auto=format&fit=crop&w=800&q=80" // fallback
  },
  {
    id: "chola_temples",
    name: "Great Living Chola Temples",
    location: "Thanjavur, Tamil Nadu, India",
    description: "The majestic Brihadisvara Temple, constructed in 1010 CE by Rajaraja I, boasting a solid granite vimana tower that never casts a shadow at noon.",
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
  }
];
