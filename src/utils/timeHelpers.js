/**
 * Sky gradient colours for each day phase.
 * Returns [topColor, bottomColor] as hex strings.
 */
export function getSkyColors(altitude) {
  const altDeg = altitude * (180 / Math.PI);

  if (altDeg < -12) {
    // Deep night — brightened dark navy/slate
    return { top: [0.06, 0.08, 0.18], bottom: [0.09, 0.12, 0.22] };
  }
  if (altDeg < -6) {
    // Astronomical twilight
    const t = (altDeg + 12) / 6;
    return {
      top: lerp3([0.06, 0.08, 0.18], [0.08, 0.07, 0.18], t),
      bottom: lerp3([0.09, 0.12, 0.22], [0.15, 0.08, 0.18], t),
    };
  }
  if (altDeg < 0) {
    // Civil twilight — dawn/dusk
    const t = (altDeg + 6) / 6;
    return {
      top: lerp3([0.04, 0.03, 0.12], [0.15, 0.1, 0.25], t),
      bottom: lerp3([0.12, 0.06, 0.14], [0.85, 0.35, 0.15], t),
    };
  }
  if (altDeg < 15) {
    // Low sun — golden hour
    const t = altDeg / 15;
    return {
      top: lerp3([0.15, 0.1, 0.25], [0.2, 0.35, 0.65], t),
      bottom: lerp3([0.85, 0.35, 0.15], [0.55, 0.7, 0.85], t),
    };
  }
  if (altDeg < 40) {
    // Mid-day ramp
    const t = (altDeg - 15) / 25;
    return {
      top: lerp3([0.2, 0.35, 0.65], [0.15, 0.4, 0.75], t),
      bottom: lerp3([0.55, 0.7, 0.85], [0.5, 0.72, 0.9], t),
    };
  }
  // Full day
  return { top: [0.15, 0.4, 0.75], bottom: [0.5, 0.72, 0.9] };
}

/**
 * Format a Date as "HH:MM AM/PM"
 */
export function formatTime(date) {
  let h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

/**
 * Season factor: slight variation in sun path intensity.
 * Returns 0.8–1.0 multiplier.
 */
export function getSeasonFactor(date, lat) {
  const dayOfYear = getDayOfYear(date);
  // Northern hemisphere: peak at summer solstice (day ~172)
  const declination = 23.45 * Math.sin(((360 / 365) * (dayOfYear - 81)) * (Math.PI / 180));
  // Simple factor: closer latitude is to declination → higher factor
  const diff = Math.abs(lat - declination);
  return Math.max(0.8, 1 - diff / 120);
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / 86400000);
}

function lerp3(a, b, t) {
  t = Math.max(0, Math.min(1, t));
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}
