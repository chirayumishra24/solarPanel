import { useState, useEffect, useRef, useCallback } from 'react';
import { getSunPosition, getSunColor, getDayPhase, getSunScenePosition, calculateEnergy } from '../utils/solarCalculations';
import { getSkyColors, formatTime, getSeasonFactor } from '../utils/timeHelpers';

const DEFAULT_LAT = 28.6139; // New Delhi
const DEFAULT_LNG = 77.209;

export function useSolarTime(timeSpeed = 1, panelTiltDeg = 30) {
  const [location, setLocation] = useState({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
  const [locationName, setLocationName] = useState('New Delhi, IN');
  const timeRef = useRef(null);
  const lastRealRef = useRef(null);

  if (timeRef.current === null) {
    timeRef.current = Date.now();
    lastRealRef.current = Date.now();
  }

  // Geolocation on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationName(`${pos.coords.latitude.toFixed(1)}°N, ${pos.coords.longitude.toFixed(1)}°E`);
        },
        () => { /* keep defaults */ }
      );
    }
  }, []);

  const update = useCallback((_deltaMs) => {
    const now = Date.now();
    const realDelta = now - lastRealRef.current;
    lastRealRef.current = now;
    timeRef.current += realDelta * timeSpeed;

    const simDate = new Date(timeRef.current);
    const { lat, lng } = location;

    const sunPos = getSunPosition(simDate, lat, lng);
    const sunColor = getSunColor(sunPos.altitude);
    const dayPhase = getDayPhase(sunPos.altitude);
    const skyColors = getSkyColors(sunPos.altitude);
    const scenePos = getSunScenePosition(sunPos, 50);
    const seasonFactor = getSeasonFactor(simDate, lat);

    // Panel normal based on tilt — tilted south-facing panel
    const tiltRad = panelTiltDeg * (Math.PI / 180);
    const panelNormal = [0, Math.cos(tiltRad), -Math.sin(tiltRad)];
    const sunDir = [sunPos.x, sunPos.y, sunPos.z];
    const len = Math.sqrt(sunDir[0] ** 2 + sunDir[1] ** 2 + sunDir[2] ** 2);
    if (len > 0) {
      sunDir[0] /= len;
      sunDir[1] /= len;
      sunDir[2] /= len;
    }

    const rawEnergy = calculateEnergy(panelNormal, sunDir);
    const energy = sunPos.altitude > 0 ? rawEnergy * seasonFactor : 0;

    return {
      sunPosition: scenePos,
      sunDirection: sunDir,
      altitude: sunPos.altitude,
      altitudeDeg: sunPos.altitude * (180 / Math.PI),
      azimuth: sunPos.azimuth,
      azimuthDeg: sunPos.azimuth * (180 / Math.PI),
      dayPhase,
      sunColor,
      skyColors,
      energy,
      panelNormal,
      panelTiltDeg,
      time: simDate,
      timeString: formatTime(simDate),
      lat: location.lat,
      lng: location.lng,
      locationName,
      seasonFactor,
    };
  }, [location, locationName, timeSpeed, panelTiltDeg]);

  // Reset time reference when speed changes
  useEffect(() => {
    lastRealRef.current = Date.now();
  }, [timeSpeed]);

  return { update, location };
}
