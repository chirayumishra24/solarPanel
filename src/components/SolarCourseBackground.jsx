import { useState, useCallback, createContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { SolarScene } from './SolarScene';
import { useLocation } from 'react-router-dom';
import { Maximize, Minimize } from 'lucide-react';
import { chapters } from '../data/chapters';

export const ThemeContext = createContext('night');
export const SolarDataContext = createContext(null);

const SPEED_OPTIONS = [
  { label: '1×', value: 1 },
  { label: '60×', value: 60 },
  { label: '360×', value: 360 },
  { label: '1000×', value: 1000 },
];

export function SolarCourseBackground({ children }) {
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [panelTilt, setPanelTilt] = useState(30);
  const [solarData, setSolarData] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const location = useLocation();

  const handleUpdate = useCallback((data) => {
    setSolarData(data);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="solar-shell">
      <Canvas
        className="solar-canvas"
        camera={{ position: [6, 4, 10], fov: 55, near: 0.1, far: 300 }}
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          toneMapping: 3,
          toneMappingExposure: 1.0,
        }}
      >
        <SolarScene
          timeSpeed={timeSpeed}
          panelTiltDeg={panelTilt}
          onUpdate={handleUpdate}
        />
      </Canvas>



    {/* Fullscreen Button */}
      <button 
        className="fullscreen-toggle-btn" 
        onClick={toggleFullscreen}
        aria-label="Toggle Fullscreen"
      >
        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </button>

      {/* Render course content overlay */}
      <ThemeContext.Provider value={solarData?.dayPhase || 'night'}>
        <SolarDataContext.Provider value={{
          ...solarData,
          timeSpeed,
          setTimeSpeed,
          panelTilt,
          setPanelTilt
        }}>
          {children}
        </SolarDataContext.Provider>
      </ThemeContext.Provider>
    </div>
  );
}
