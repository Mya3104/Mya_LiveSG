import { CommuteInfo, Neighborhood, WorkplaceLocation } from '../types';
import { WORKPLACE_HUBS } from '../data/singaporeData';
import { resolveWorkplaceToHubId } from '../data/singaporeWorkplaces';

/**
 * Computes great-circle distance between two Singapore coordinates using Haversine formula (km)
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 1. WORKPLACE GEOCODING / RESOLUTION
 * Resolves any workplace location (whether standard hub, custom search result, or coordinates)
 * to its effective hub ID or coordinate object.
 */
export function resolveWorkplaceDestination(workplace?: WorkplaceLocation | null, fallbackHubId = 'mbfc'): {
  hubId: string;
  name: string;
  lat?: number;
  lng?: number;
  isCustomLocation: boolean;
} {
  if (!workplace || !workplace.name) {
    const defaultHub = WORKPLACE_HUBS.find((h) => h.id === fallbackHubId) || WORKPLACE_HUBS[0];
    return {
      hubId: defaultHub.id,
      name: defaultHub.shortName || defaultHub.name,
      isCustomLocation: false,
    };
  }

  const hubId = workplace.hubId || resolveWorkplaceToHubId(workplace.name + ' ' + (workplace.address || ''));
  return {
    hubId,
    name: workplace.name,
    lat: workplace.lat,
    lng: workplace.lng,
    isCustomLocation: Boolean(workplace.lat && workplace.lng),
  };
}

/**
 * 2. ROUTING / COMMUTE ESTIMATION
 * Computes accurate door-to-door transit and drive commute estimates
 * between a neighbourhood and a workplace location.
 */
export function estimateNeighbourhoodCommute(
  neighborhood: Neighborhood,
  workplace?: WorkplaceLocation | null,
  fallbackHubId = 'mbfc'
): CommuteInfo {
  const dest = resolveWorkplaceDestination(workplace, fallbackHubId);

  // If the neighbourhood already has pre-computed verified transit data for this hub:
  if (neighborhood.commutes && neighborhood.commutes[dest.hubId]) {
    const baseCommute = neighborhood.commutes[dest.hubId];

    // If custom coordinates are provided and different from the hub centre, calculate fine-grained adjustment
    if (dest.lat && dest.lng && neighborhood.coordinates?.lat && neighborhood.coordinates?.lng) {
      const distanceKm = calculateHaversineDistanceKm(
        neighborhood.coordinates.lat,
        neighborhood.coordinates.lng,
        dest.lat,
        dest.lng
      );

      // Fine-tune duration based on actual physical distance (Singapore MRT/Bus average 30km/h + 8m first/last mile)
      const adjustedMrt = Math.max(8, Math.round(distanceKm * 1.8 + 6));
      const adjustedDrive = Math.max(5, Math.round(distanceKm * 1.1 + 4));

      return {
        ...baseCommute,
        // Blend baseline hub transit time with distance calculation
        mrtDurationMins: Math.round((baseCommute.mrtDurationMins * 2 + adjustedMrt) / 3),
        driveDurationMins: Math.round((baseCommute.driveDurationMins * 2 + adjustedDrive) / 3),
      };
    }

    return baseCommute;
  }

  // Fallback if hubId isn't explicitly in neighbourhood dataset: compute from coordinates
  if (dest.lat && dest.lng && neighborhood.coordinates?.lat && neighborhood.coordinates?.lng) {
    const distanceKm = calculateHaversineDistanceKm(
      neighborhood.coordinates.lat,
      neighborhood.coordinates.lng,
      dest.lat,
      dest.lng
    );

    const mrtDurationMins = Math.max(10, Math.round(distanceKm * 2.0 + 8));
    const driveDurationMins = Math.max(6, Math.round(distanceKm * 1.2 + 5));

    return {
      hubId: dest.hubId,
      hubName: dest.name,
      mrtDurationMins,
      driveDurationMins,
      transfers: distanceKm > 15 ? 2 : distanceKm > 7 ? 1 : 0,
      mrtLines: neighborhood.mrtStations.flatMap((s) => s.lines).slice(0, 2),
      routeSummary: `Estimated ${Math.round(distanceKm)}km transit corridor`,
    };
  }

  // Default to MBFC / Downtown commute
  return (
    neighborhood.commutes['mbfc'] || {
      hubId: 'mbfc',
      hubName: 'Downtown / Marina Bay',
      mrtDurationMins: 28,
      driveDurationMins: 18,
      transfers: 1,
      mrtLines: ['MRT'],
      routeSummary: 'Transit route to Central Singapore',
    }
  );
}

/**
 * 3. RECOMMENDATION COMMUTE SCORE
 * Transforms commute duration & transit convenience into a normalised 0-100 score
 */
export function calculateCommuteScore(
  commute: CommuteInfo,
  maxToleranceMins = 45,
  walkToMrtMins = 6
): number {
  let score = 100 - Math.max(0, (commute.mrtDurationMins - 12) * 2.2);

  // Direct line bonus / multi-transfer penalty
  if (commute.transfers === 0) {
    score += 6;
  } else if (commute.transfers >= 2) {
    score -= 6;
  }

  // MRT station proximity
  if (walkToMrtMins <= 4) {
    score += 4;
  } else if (walkToMrtMins > 10) {
    score -= 4;
  }

  // Commute tolerance cap penalty
  if (commute.mrtDurationMins > maxToleranceMins) {
    score -= (commute.mrtDurationMins - maxToleranceMins) * 1.8;
  }

  return Math.max(20, Math.min(100, Math.round(score)));
}
