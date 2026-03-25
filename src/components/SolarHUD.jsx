import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { SolarDataContext } from './SolarCourseBackground';
import { chapters } from '../data/chapters';

export function SolarHUD() {
  const location = useLocation();
  const solarData = useContext(SolarDataContext);
  if (!solarData) return null;

  // Extract chapter info from URL to dynamically get the summary
  const match = location.pathname.match(/\/module\/(\d+)\/chapter\/(\d+)/);
  const chapterIdKey = match ? `${match[1]}-${match[2]}` : null;
  const chapterData = chapterIdKey ? chapters[chapterIdKey] : null;
  const summaryText = chapterData?.summary || 'Select a topic to begin learning.';

  const energy = solarData.energy ?? 0;
  const energyPct = Math.round(energy * 100);
  const altDeg = solarData.altitudeDeg?.toFixed(1) ?? '0';
  const azDeg = solarData.azimuthDeg?.toFixed(1) ?? '0';

  return (
    <div className="hud-column">
      {/* Compact info panel */}
      <div className="solar-hud">
        <div className="solar-hud-header">
          <div className="solar-hud-dot" />
          <div className="solar-hud-title">Solar Simulator</div>
          <div className="solar-hud-time">{solarData.timeString ?? '--'}</div>
        </div>

        <div className="solar-hud-stats">
          <div className="solar-hud-stat">
            <span className="solar-hud-stat-label">Output</span>
            <span className="solar-hud-stat-value">{energyPct}%</span>
          </div>
          <div className="solar-hud-stat">
            <span className="solar-hud-stat-label">Sun Alt.</span>
            <span className="solar-hud-stat-value">{altDeg}°</span>
          </div>
          <div className="solar-hud-stat">
            <span className="solar-hud-stat-label">Azimuth</span>
            <span className="solar-hud-stat-value">{azDeg}°</span>
          </div>
          <div className="solar-hud-stat">
            <span className="solar-hud-stat-label">Season</span>
            <span className="solar-hud-stat-value">{solarData.seasonFactor?.toFixed(2) ?? '1.00'}x</span>
          </div>
        </div>

        <div className="solar-hud-bar">
          <div className="solar-hud-bar-fill" style={{ width: `${energyPct}%` }} />
        </div>

        <div className="solar-hud-control">
          <div className="solar-hud-control-header">
            <span>Panel Tilt</span>
            <span>{solarData.panelTilt ?? 30}°</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="90" 
            value={solarData.panelTilt ?? 30}
            onChange={(e) => solarData.setPanelTilt?.(Number(e.target.value))}
            className="solar-tilt-slider"
          />
        </div>

        <div className="solar-hud-control">
          <div className="solar-hud-control-header">
            <span>Speed</span>
            <span>REAL-TIME</span>
          </div>
          <div className="solar-hud-speed-row">
            {[1, 60, 360, 1000].map(s => (
              <button 
                key={s}
                className={`solar-hud-speed-btn ${solarData.timeSpeed === s ? 'is-active' : ''}`}
                onClick={() => solarData.setTimeSpeed?.(s)}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <div className="solar-hud-footer">
          📍 26.8°N, 75.7°E
        </div>
      </div>

      {/* Separate Character Summary Card (Solar-Man Says) */}
      <div className="comic-panel-card">
        <div className="comic-hero-badge">
          <img src="/solar-hero.png" alt="Solar-Man" className="comic-hero-image" />
        </div>
        <div className="comic-title">SOLAR-MAN SAYS:</div>
        <div className="comic-content">
          <p>{summaryText}</p>
        </div>
      </div>
    </div>
  );
}
