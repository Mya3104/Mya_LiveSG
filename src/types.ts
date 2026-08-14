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

export interface WorkplaceLocation {
  id?: string;
  name: string; // e.g. "Marina Bay Financial Centre" or "Raffles Place"
  subtitle?: string; // e.g. "Marina Bay · Downtown Core" or "Raffles Place MRT · Downtown Core"
  address?: string;
  mrtStation?: string;
  area?: string;
  lat?: number;
  lng?: number;
  hubId?: string; // e.g. 'mbfc', 'raffles_place', 'one_north', 'changi_biz', 'jurong_lake', 'woodlands_regional', 'tampines'
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
  workplaceLocation?: WorkplaceLocation | null;
  selectedPriorities?: string[]; // array of selected priority IDs: 'workplace', 'commute', 'affordability', 'quiet', 'food', 'family', 'schools', 'shopping', 'transport', 'nightlife', 'central', 'healthcare'
  secondaryWorkplace?: string; // Hub id e.g. 'changi'
  maxCommuteMins: number;
  mrtPriority: 'critical' | 'high' | 'moderate' | 'any';
  primarySchoolDistance: 'within_1km' | 'within_2km' | 'any';
  schoolTierPreference: 'top_tier' | 'any';
  quietVibePreference: 'very_quiet' | 'balanced' | 'bustling';
  lifestyleTags: string[]; // e.g. 'hawker', 'malls', 'parks', 'cafes', 'healthcare'
}

export interface HDBTransaction {
  _id: number | string;
  month: string;
  town: string;
  flat_type: string;
  block: string;
  street_name: string;
  storey_range: string;
  floor_area_sqm: number;
  floor_area_sqft: number;
  flat_model: string;
  lease_commence_date: string;
  remaining_lease: string;
  remaining_lease_years: number;
  resale_price: number;
  psf: number;
  psm: number;
}

export interface HDBFlatTypeStats {
  flatType: string;
  count: number;
  medianPrice: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  avgPsf: number;
  avgFloorAreaSqm: number;
}

export interface HDBPriceDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface HDBMonthlyTrend {
  month: string;
  avgPrice: number;
  medianPrice: number;
  avgPsf: number;
  volume: number;
}

export interface HDBTownStatistics {
  town: string;
  totalTransactions: number;
  overallMedianPrice: number;
  overallAvgPrice: number;
  overallAvgPsf: number;
  overallAvgPsm: number;
  byFlatType: Record<string, HDBFlatTypeStats>;
  monthlyTrends: HDBMonthlyTrend[];
  priceDistribution: HDBPriceDistribution[];
  leaseStats: {
    minRemainingYears: number;
    maxRemainingYears: number;
    avgRemainingYears: number;
  };
  dataSource: {
    name: string;
    resourceId: string;
    lastUpdated: string;
    isLive: boolean;
  };
}

export interface WorkplaceHub {
  id: string;
  name: string;
  shortName: string;
  region: string;
  description: string;
  coordinates: { svgX: number; svgY: number };
}

export interface OneMapSearchResult {
  SEARCHVAL: string;
  BLK_NO: string;
  ROAD_NAME: string;
  BUILDING: string;
  ADDRESS: string;
  POSTAL: string;
  X: string;
  Y: string;
  LATITUDE: string;
  LONGITUDE: string;
}

export interface OneMapSearchResponse {
  found: number;
  totalNumPages: number;
  pageNum: number;
  results: OneMapSearchResult[];
}

export interface OneMapReverseGeocodeResult {
  BUILDINGNAME?: string;
  BLOCK?: string;
  ROAD?: string;
  POSTALCODE?: string;
  X?: string;
  Y?: string;
  LATITUDE?: string;
  LONGITUDE?: string;
  [key: string]: any;
}

export interface OneMapRouteResponse {
  status: number | string;
  status_message?: string;
  route_geometry?: string;
  route_summary?: {
    total_time?: number;
    total_distance?: number;
    start_point?: string;
    end_point?: string;
  };
  route_instructions?: Array<[number, string, number, string, string, string, string, string] | any>;
  plan?: {
    date?: string;
    from?: { name: string; lat: number; lon: number };
    to?: { name: string; lat: number; lon: number };
    itineraries?: Array<{
      duration: number; // in seconds
      startTime: number;
      endTime: number;
      walkTime: number;
      transitTime: number;
      waitingTime: number;
      walkDistance: number;
      legs: Array<{
        mode: string;
        route?: string;
        agencyName?: string;
        from: { name: string; lat: number; lon: number };
        to: { name: string; lat: number; lon: number };
        startTime: number;
        endTime: number;
        duration: number;
        distance: number;
        legGeometry?: { points: string };
      }>;
    }>;
  };
  [key: string]: any;
}

export interface OneMapTokenStatus {
  hasCredentials: boolean;
  tokenActive: boolean;
  expiresAt: string | null;
  emailConfigured: string | null;
}

