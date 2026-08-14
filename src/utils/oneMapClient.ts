import {
  OneMapSearchResponse,
  OneMapReverseGeocodeResult,
  OneMapRouteResponse,
  OneMapTokenStatus,
} from '../types';

export async function fetchOneMapTokenStatus(): Promise<OneMapTokenStatus> {
  const res = await fetch('/api/onemap/token-status');
  if (!res.ok) {
    throw new Error('Failed to fetch OneMap status');
  }
  return res.json();
}

export async function refreshOneMapToken(): Promise<OneMapTokenStatus & { tokenMinted: boolean }> {
  const res = await fetch('/api/onemap/token/refresh', { method: 'POST' });
  if (!res.ok) {
    throw new Error('Failed to refresh OneMap token');
  }
  return res.json();
}

export async function searchOneMap(
  searchVal: string,
  pageNum = 1
): Promise<OneMapSearchResponse> {
  const params = new URLSearchParams({
    searchVal,
    returnGeom: 'Y',
    getAddrDetails: 'Y',
    pageNum: String(pageNum),
  });
  const res = await fetch(`/api/onemap/search?${params.toString()}`);
  if (!res.ok) {
    throw new Error('OneMap search failed');
  }
  return res.json();
}

export async function reverseGeocodeOneMap(
  lat: number,
  lng: number,
  buffer = 40
): Promise<{ GeocodeInfo?: OneMapReverseGeocodeResult[] }> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    buffer: String(buffer),
    addressType: 'All',
  });
  const res = await fetch(`/api/onemap/reverse-geocode?${params.toString()}`);
  if (!res.ok) {
    throw new Error('OneMap reverse geocoding failed');
  }
  return res.json();
}

export async function getOneMapRoute(params: {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  routeType: 'walk' | 'drive' | 'cycle' | 'pt';
  date?: string;
  time?: string;
  mode?: 'TRANSIT' | 'BUS' | 'RAIL';
}): Promise<OneMapRouteResponse> {
  const query = new URLSearchParams({
    startLat: String(params.startLat),
    startLng: String(params.startLng),
    endLat: String(params.endLat),
    endLng: String(params.endLng),
    routeType: params.routeType,
  });

  if (params.date) query.append('date', params.date);
  if (params.time) query.append('time', params.time);
  if (params.mode) query.append('mode', params.mode);

  const res = await fetch(`/api/onemap/route?${query.toString()}`);
  if (!res.ok) {
    throw new Error('OneMap routing failed');
  }
  return res.json();
}
