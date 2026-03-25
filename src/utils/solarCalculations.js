import SunCalc from 'suncalc';

/**
 * Get sun position as both angles and a 3D direction vector.
 * @param {Date} date
 * @param {number} lat  — latitude in degrees
 * @param {number} lng  — longitude in degrees
 * @returns {{ azimuth: number, altitude: number, x: number, y: number, z: number }}
 */
export function getSunPosition(date, lat, lng) {
  const pos = SunCalc.getPosition(date, lat, lng);
  // SunCalc azimuth: 0 = south, π = north, positive = west
  // Convert to scene coords: x = east/west, y = up, z = north/south
  const alt = pos.altitude; // radians, negative = below horizon
  const az = pos.azimuth;  // radians from south, clockwise

  const cosAlt = Math.cos(alt);
  const x = -Math.sin(az) * cosAlt;
  const y = Math.sin(alt);
  const z = -Math.cos(az) * cosAlt;

  return {
    azimuth: az,
    altitude: alt,
    x, y, z,
  };
}

/**
 * Calculate energy output as dot(panelNormal, sunDirection), clamped to [0, 1].
 * @param {[number,number,number]} panelNormal  — unit normal of panel surface
 * @param {[number,number,number]} sunDir       — unit direction TO the sun
 * @returns {number} 0–1 intensity
 */
export function calculateEnergy(panelNormal, sunDir) {
  const dot =
    panelNormal[0] * sunDir[0] +
    panelNormal[1] * sunDir[1] +
    panelNormal[2] * sunDir[2];
  return Math.max(dot, 0);
}

/**
 * Map sun altitude to a warm-cool color interpolation.
 * @param {number} altitude — radians
 * @returns {{ r: number, g: number, b: number }}
 */
export function getSunColor(altitude) {
  const altDeg = altitude * (180 / Math.PI);

  if (altDeg < -6) {
    // Deep night — pale moonlight
    return { r: 0.15, g: 0.18, b: 0.35 };
  }
  if (altDeg < 0) {
    // Twilight — deep orange
    const t = (altDeg + 6) / 6; // 0→1
    return lerpColor({ r: 0.15, g: 0.18, b: 0.35 }, { r: 0.95, g: 0.45, b: 0.2 }, t);
  }
  if (altDeg < 15) {
    // Sunrise/sunset — orange → warm yellow
    const t = altDeg / 15;
    return lerpColor({ r: 0.95, g: 0.45, b: 0.2 }, { r: 1, g: 0.85, b: 0.55 }, t);
  }
  if (altDeg < 40) {
    // Morning/evening — warm yellow → white
    const t = (altDeg - 15) / 25;
    return lerpColor({ r: 1, g: 0.85, b: 0.55 }, { r: 1, g: 0.98, b: 0.92 }, t);
  }
  // High sun — bright white
  return { r: 1, g: 0.98, b: 0.92 };
}

/**
 * Determine the current phase of day.
 * @param {number} altitude — radians
 * @returns {'night'|'twilight'|'morning'|'noon'|'evening'}
 */
export function getDayPhase(altitude) {
  const altDeg = altitude * (180 / Math.PI);
  if (altDeg < -6) return 'night';
  if (altDeg < 0) return 'twilight';
  if (altDeg < 25) return 'morning'; // also used for evening, context matters
  return 'noon';
}

/**
 * Get sun orbit radius for scene placement.
 */
export function getSunScenePosition(sunPos, radius = 50) {
  return [sunPos.x * radius, sunPos.y * radius, sunPos.z * radius];
}

function lerpColor(a, b, t) {
  t = Math.max(0, Math.min(1, t));
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}
