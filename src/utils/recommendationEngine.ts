import { Neighborhood, UserPreferences } from '../types';
import { INITIAL_NEIGHBORHOODS } from '../data/singaporeData';

export function parseNaturalLanguageQuery(query: string): Partial<UserPreferences> {
  const q = query.toLowerCase();
  const result: Partial<UserPreferences> = {};

  // Detect Property Type
  if (q.includes('condo') || q.includes('private') || q.includes('apartment')) {
    result.propertyCategory = 'condo';
  } else if (q.includes('hdb') || q.includes('bto') || q.includes('flat')) {
    result.propertyCategory = 'hdb';
  } else if (q.includes('landed') || q.includes('terrace') || q.includes('bungalow') || q.includes('semi-d')) {
    result.propertyCategory = 'landed';
  }

  // Detect Transaction Type
  if (q.includes('rent') || q.includes('rental') || q.includes('lease') || q.includes('tenant')) {
    result.transactionType = 'rental';
  } else if (q.includes('new launch') || q.includes('bto') || q.includes('under construction')) {
    result.transactionType = 'new_launch';
  } else if (q.includes('buy') || q.includes('purchase') || q.includes('resale') || q.includes('owner')) {
    result.transactionType = 'resale';
  }

  // Detect Bedrooms
  if (q.includes('1-bedroom') || q.includes('1 bedroom') || q.includes('1br') || q.includes('1 bed')) {
    result.bedroomsMin = 1;
  } else if (q.includes('2-bedroom') || q.includes('2 bedroom') || q.includes('2br') || q.includes('2 bed')) {
    result.bedroomsMin = 2;
  } else if (q.includes('3-bedroom') || q.includes('3 bedroom') || q.includes('3br') || q.includes('3 bed') || q.includes('4-room hdb')) {
    result.bedroomsMin = 3;
  } else if (q.includes('4-bedroom') || q.includes('4 bedroom') || q.includes('4br') || q.includes('4 bed') || q.includes('5-room hdb')) {
    result.bedroomsMin = 4;
  }

  // Detect Budget
  const budgetMillionMatch = q.match(/(\d+(\.\d+)?)\s*(m|million|mil)/i);
  if (budgetMillionMatch) {
    const val = parseFloat(budgetMillionMatch[1]);
    result.budgetMax = Math.round(val * 1000000);
  } else {
    const budgetKMatch = q.match(/(\d+)\s*(k|thousand)/i);
    if (budgetKMatch) {
      const val = parseFloat(budgetKMatch[1]);
      result.budgetMax = val < 20 ? val * 1000 : val * 1000;
    }
  }

  // Detect Workplaces
  if (q.includes('mbfc') || q.includes('marina bay') || q.includes('downtown') || q.includes('shenton')) {
    result.primaryWorkplace = 'mbfc';
  } else if (q.includes('changi') || q.includes('expo') || q.includes('aerospace')) {
    result.primaryWorkplace = 'changi_biz';
  } else if (q.includes('one-north') || q.includes('fusionopolis') || q.includes('biopolis') || q.includes('buona vista')) {
    result.primaryWorkplace = 'one_north';
  } else if (q.includes('jurong') || q.includes('tuas') || q.includes('cleantech')) {
    result.primaryWorkplace = 'jurong_lake';
  } else if (q.includes('woodlands') || q.includes('causeway')) {
    result.primaryWorkplace = 'woodlands_regional';
  } else if (q.includes('cbd') || q.includes('raffles') || q.includes('tanjong pagar')) {
    result.primaryWorkplace = 'raffles_place';
  }

  // Detect Secondary Workplace if mentioned (e.g. "I work at MBFC, my wife works at Changi")
  if ((q.includes('wife') || q.includes('husband') || q.includes('partner') || q.includes('and')) && q.includes('changi')) {
    if (result.primaryWorkplace !== 'changi_biz') {
      result.secondaryWorkplace = 'changi_biz';
    }
  }
  if ((q.includes('wife') || q.includes('husband') || q.includes('partner') || q.includes('and')) && (q.includes('mbfc') || q.includes('cbd'))) {
    if (result.primaryWorkplace !== 'mbfc' && result.primaryWorkplace !== 'raffles_place') {
      result.secondaryWorkplace = 'mbfc';
    }
  }

  // Detect School Priority
  if (q.includes('school') || q.includes('primary school') || q.includes('kids') || q.includes('children') || q.includes('balloting')) {
    result.primarySchoolDistance = 'within_1km';
    result.familySize = 'family_with_kids';
  }

  // Detect MRT Priority
  if (q.includes('near mrt') || q.includes('mrt priority') || q.includes('walk to mrt') || q.includes('train')) {
    result.mrtPriority = 'high';
  }

  // Detect Quietness
  if (q.includes('quiet') || q.includes('peaceful') || q.includes('greenery') || q.includes('parks') || q.includes('retiree')) {
    result.quietVibePreference = 'very_quiet';
  } else if (q.includes('bustling') || q.includes('nightlife') || q.includes('city') || q.includes('young couple')) {
    result.quietVibePreference = 'bustling';
  }

  return result;
}

export function rankNeighborhoods(
  preferences: UserPreferences,
  customList: Neighborhood[] = INITIAL_NEIGHBORHOODS,
  hdbStatsMap?: Record<string, { median3Room?: number; median4Room?: number; median5Room?: number; avgPsf?: number }>
): Neighborhood[] {
  return customList
    .map((n) => {
      let totalScore = 0;
      let weightSum = 0;

      // Copy or augment propertySnapshot with live HDB stats if available
      const hdbLive = hdbStatsMap?.[n.id] || hdbStatsMap?.[n.name.toUpperCase()];
      const effectiveHdb = {
        ...n.propertySnapshot.hdb,
        median3Room: hdbLive?.median3Room || n.propertySnapshot.hdb.median3Room,
        median4Room: hdbLive?.median4Room || n.propertySnapshot.hdb.median4Room,
        median5Room: hdbLive?.median5Room || n.propertySnapshot.hdb.median5Room,
        avgPsf: hdbLive?.avgPsf || n.propertySnapshot.hdb.avgPsf,
      };

      // 1. Commute Factor (Weight: 25)
      const primaryHub = preferences.primaryWorkplace || 'mbfc';
      const primaryCommute = n.commutes[primaryHub] || n.commutes['mbfc'];
      let commuteScore = 100 - Math.max(0, (primaryCommute.mrtDurationMins - 15) * 2.2);

      if (preferences.secondaryWorkplace && n.commutes[preferences.secondaryWorkplace]) {
        const secCommute = n.commutes[preferences.secondaryWorkplace];
        const secScore = 100 - Math.max(0, (secCommute.mrtDurationMins - 15) * 2.2);
        commuteScore = (commuteScore * 0.55 + secScore * 0.45);
      }

      if (primaryCommute.mrtDurationMins > preferences.maxCommuteMins) {
        commuteScore -= (primaryCommute.mrtDurationMins - preferences.maxCommuteMins) * 1.5;
      }
      commuteScore = Math.max(20, Math.min(100, Math.round(commuteScore)));
      totalScore += commuteScore * 25;
      weightSum += 25;

      // 2. Affordability Factor (Weight: 25)
      let pricePoint = 1500000;
      if (preferences.propertyCategory === 'hdb') {
        if (preferences.bedroomsMin <= 2) {
          pricePoint = effectiveHdb.median3Room;
        } else if (preferences.bedroomsMin === 3) {
          pricePoint = effectiveHdb.median4Room;
        } else {
          pricePoint = effectiveHdb.median5Room;
        }
      } else if (preferences.propertyCategory === 'condo') {
        pricePoint = preferences.bedroomsMin >= 3 ? n.propertySnapshot.condo.median3Bed : n.propertySnapshot.condo.median2Bed;
      } else {
        pricePoint = n.propertySnapshot.condo.median3Bed;
      }

      let affordScore = 90;
      if (preferences.budgetMax > 0) {
        if (pricePoint <= preferences.budgetMax) {
          const buffer = preferences.budgetMax - pricePoint;
          affordScore = Math.min(100, 85 + (buffer / preferences.budgetMax) * 15);
        } else {
          const excess = pricePoint - preferences.budgetMax;
          affordScore = Math.max(30, 85 - (excess / preferences.budgetMax) * 50);
        }
      }
      affordScore = Math.max(20, Math.min(100, Math.round(affordScore)));
      totalScore += affordScore * 25;
      weightSum += 25;

      // 3. School Factor (Weight: 20)
      let schoolScore = n.scores.schools;
      const schoolsWithin1Km = n.schools.filter((s) => s.zone === '<1km');
      if (preferences.primarySchoolDistance === 'within_1km') {
        if (schoolsWithin1Km.length >= 3) schoolScore += 5;
        if (schoolsWithin1Km.length === 0) schoolScore -= 20;
      }
      if (preferences.schoolTierPreference === 'top_tier') {
        const hasTopTier = schoolsWithin1Km.some((s) => s.tier === 'Top Tier');
        if (hasTopTier) schoolScore += 5;
      }
      schoolScore = Math.max(30, Math.min(100, Math.round(schoolScore)));
      totalScore += schoolScore * (preferences.familySize === 'family_with_kids' ? 22 : 12);
      weightSum += (preferences.familySize === 'family_with_kids' ? 22 : 12);

      // 4. Transport & MRT Factor (Weight: 15)
      let transportScore = n.scores.transport;
      if (preferences.mrtPriority === 'critical') {
        const walkDist = n.mrtStations[0]?.walkMins || 10;
        transportScore = walkDist <= 4 ? 98 : walkDist <= 7 ? 90 : 75;
      }
      totalScore += transportScore * 15;
      weightSum += 15;

      // 5. Amenities & Lifestyle (Weight: 15)
      let lifestyleScore = (n.scores.familyAmenities + n.scores.lifestyle) / 2;
      if (preferences.quietVibePreference === 'very_quiet') {
        if (n.officialData.greeneryParkCoverage > 40) lifestyleScore += 5;
      }
      totalScore += lifestyleScore * 15;
      weightSum += 15;

      const finalMatchScore = Math.round(totalScore / weightSum);
      let matchTier: Neighborhood['matchTier'] = 'Good match';
      if (finalMatchScore >= 90) matchTier = 'Excellent match';
      else if (finalMatchScore >= 83) matchTier = 'Very good match';
      else if (finalMatchScore >= 75) matchTier = 'Good match';
      else matchTier = 'Moderate match';

      return {
        ...n,
        propertySnapshot: {
          ...n.propertySnapshot,
          hdb: effectiveHdb,
        },
        scores: {
          ...n.scores,
          affordability: affordScore,
        },
        matchScore: finalMatchScore,
        matchTier,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
