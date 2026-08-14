export interface ScoreBreakdown {
  affordability: number;
  transport: number;
  commute: number;
  schools: number;
  familyAmenities: number;
  lifestyle: number;
  healthcare: number;
  areaFundamentals: number;
}

export interface MRTStationInfo {
  name: string;
  code: string;
  lines: string[];
  walkMins: number;
  distanceKm: number;
}

export interface SchoolInfo {
  name: string;
  distanceKm: number;
  zone: '<1km' | '1-2km';
  type: 'Primary' | 'Secondary' | 'Junior College' | 'International';
  tier: 'Top Tier' | 'Established' | 'Popular';
  ballotingRisk: 'High' | 'Moderate' | 'Low';
  specialties: string[];
}

export interface AmenityItem {
  name: string;
  type: 'hawker' | 'mall' | 'park' | 'clinic' | 'supermarket' | 'cafe';
  distanceMins: number;
  rating?: number;
  description?: string;
  tags?: string[];
}

export interface PropertyData {
  hdb: {
    median3Room: number;
    median4Room: number;
    median5Room: number;
    avgPsf: number;
    rentalRate: number;
    yearlyAppreciation: number;
  };
  condo: {
    median1Bed: number;
    median2Bed: number;
    median3Bed: number;
    median4Bed: number;
    avgPsf: number;
    rentalRate: number;
    yearlyAppreciation: number;
  };
  landed?: {
    medianTerrace: number;
    medianSemiD: number;
    avgPsf: number;
    rentalRate: number;
  };
  supplyPipeline: 'High' | 'Moderate' | 'Limited';
  upcomingLaunches: {
    name: string;
    type: 'BTO' | 'EC' | 'Condo';
    completionYear: number;
    estUnits: number;
  }[];
}

export interface CommuteInfo {
  hubId: string;
  hubName: string;
  mrtDurationMins: number;
  driveDurationMins: number;
  transfers: number;
  mrtLines: string[];
  routeSummary: string;
}

export interface ForumHighlight {
  source: 'HardwareZone EDMW' | 'Reddit r/singapore' | 'PropertyGuru Community';
  author: string;
  date: string;
  upvotes: number;
  quote: string;
  sentiment: 'positive' | 'neutral' | 'caution';
}

export interface VideoWalkthrough {
  title: string;
  channel: string;
  views: string;
  duration: string;
  youtubeUrl: string;
  badge: string;
  summary: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  region: 'East' | 'West' | 'North' | 'North-East' | 'Central';
  tagline: string;
  matchScore: number;
  matchTier: 'Excellent match' | 'Very good match' | 'Good match' | 'Moderate match';
  coordinates: {
    lat: number;
    lng: number;
    svgX: number;
    svgY: number;
  };
  boundaryPath: string; // SVG polygon / path
  description: string;
  whyGreatMatch: string;
  scores: ScoreBreakdown;
  keyHighlights: {
    icon: string;
    text: string;
  }[];
  propertySnapshot: PropertyData;
  mrtStations: MRTStationInfo[];
  schools: SchoolInfo[];
  amenities: AmenityItem[];
  commutes: Record<string, CommuteInfo>;
  communitySentiment: {
    overall: 'Overwhelmingly Positive' | 'Positive' | 'Balanced' | 'Mixed';
    score: number;
    pros: string[];
    cons: string[];
    summary: string;
    forumHighlights: ForumHighlight[];
    videos: VideoWalkthrough[];
  };
  officialData: {
    uraCaveats2024: number;
    hdbResaleVolume: number;
    singstatPopulation: number;
    singstatMedianHouseholdIncome: number;
    safetyCrimeIndex: number; // 0-100 (higher = safer)
    greeneryParkCoverage: number; // percentage
  };
}

export interface UserPreferences {
  query: string;
  familySize: 'single' | 'couple' | 'family_with_kids' | 'multi_gen';
  adultsCount: number;
  childrenCount: number;
  propertyCategory: 'all' | 'hdb' | 'condo' | 'landed';
  transactionType: 'rental' | 'resale' | 'new_launch';
  bedroomsMin: number;
  budgetMax: number; // in SGD
  primaryWorkplace: string; // Hub id e.g. 'mbfc'
  secondaryWorkplace?: string; // Hub id e.g. 'changi'
  maxCommuteMins: number;
  mrtPriority: 'critical' | 'high' | 'moderate' | 'any';
  primarySchoolDistance: 'within_1km' | 'within_2km' | 'any';
  schoolTierPreference: 'top_tier' | 'any';
  quietVibePreference: 'very_quiet' | 'balanced' | 'bustling';
  lifestyleTags: string[]; // e.g. 'hawker', 'malls', 'parks', 'cafes', 'healthcare'
}

export interface WorkplaceHub {
  id: string;
  name: string;
  shortName: string;
  region: string;
  description: string;
  coordinates: { svgX: number; svgY: number };
}
