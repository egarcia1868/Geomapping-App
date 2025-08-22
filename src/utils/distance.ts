import {Location} from '../types';

export const calculateDistance = (
  location1: Location,
  location2: Location,
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(location2.latitude - location1.latitude);
  const dLon = toRadians(location2.longitude - location1.longitude);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(location1.latitude)) *
      Math.cos(toRadians(location2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

export const isWithinRadius = (
  userLocation: Location,
  targetLocation: Location,
  radiusMiles: number,
): boolean => {
  const distance = calculateDistance(userLocation, targetLocation);
  return distance <= radiusMiles;
};