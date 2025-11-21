import type { Location } from './types/location';

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const calculateDistanceKm = (from: Location, to: Location) => {
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);

  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};

export const formatDistance = (distanceKm: number) => {
  if (distanceKm >= 1) {
    return `${distanceKm.toFixed(2)}km`;
  }
  return `${Math.round(distanceKm * 1000)}m`;
};
