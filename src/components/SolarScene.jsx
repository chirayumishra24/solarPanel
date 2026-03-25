import { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

import { SkyEnvironment } from './SkyEnvironment';
import { Stars } from './Stars';
import { Moon } from './Moon';
import { Sun3D } from './Sun3D';
import { SolarPanel } from './SolarPanel';
import { EnergyFlow } from './EnergyFlow';
import { Ground } from './Ground';
import { SolarPanelField } from './SolarPanelField';
import { useSolarTime } from '../hooks/useSolarTime';
import { useMouseParallax } from '../hooks/useMouseParallax';

export function SolarScene({ timeSpeed, panelTiltDeg, onUpdate }) {
  const { update } = useSolarTime(timeSpeed, panelTiltDeg);
  const { lerp } = useMouseParallax();
  
  // Initialize with initial solar time
  const [data, setData] = useState(() => update(0));

  useFrame((state, delta) => {
    // Update solar calculations
    const newData = update(delta);
    setData(newData);
    onUpdate?.(newData);

    // Mouse parallax on camera — centered on panels
    const m = lerp(0.03);
    const cam = state.camera;
    cam.position.x = 5 + m.x * 2.0;
    cam.position.y = 4 + m.y * 1.0;
    cam.position.z = 12;
    cam.lookAt(0, 1.2, -2);
  });

  if (!data) return null;

  return (
    <>
      {/* Environment */}
      <SkyEnvironment
        skyColors={data.skyColors}
        sunPosition={data.sunPosition}
        sunColor={data.sunColor}
        dayPhase={data.dayPhase}
      />
      <Stars altitude={data.altitude} />
      <Moon sunPosition={data.sunPosition} altitude={data.altitude} />

      {/* Lighting */}
      <ambientLight
        color={data.dayPhase === 'night' ? '#1a2848' : '#394a6b'}
        intensity={data.dayPhase === 'night' ? 0.5 : 0.4}
      />
      <Sun3D
        position={data.sunPosition}
        sunColor={data.sunColor}
        altitude={data.altitude}
      />

      {/* Scene objects */}
      <SolarPanel
        tiltDeg={panelTiltDeg}
        energy={data.energy}
      />
      <EnergyFlow
        energy={data.energy}
        panelPosition={[0, 1.5, 0]}
        targetPosition={[6, 0, 2]}
      />
      <SolarPanelField tiltDeg={panelTiltDeg} energy={data.energy} />
      <Ground dayPhase={data.dayPhase} />

      {/* Fog */}
      <fog attach="fog" args={[data.dayPhase === 'night' ? '#0a1225' : '#0a1628', 30, 120]} />

      {/* Postprocessing */}
      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}
