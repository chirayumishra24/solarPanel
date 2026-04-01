import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cone, Sphere, Plane, Text } from '@react-three/drei';
import * as THREE from 'three';

function House({ panelTilt, panelPan, sunPosition, setEfficiency }) {
  const panelRef = useRef();
  
  // Calculate relative efficiency based on sun position and panel orientation
  useFrame(() => {
    if (panelRef.current) {
      const panelNormal = new THREE.Vector3(0, 1, 0);
      panelNormal.applyEuler(panelRef.current.rotation);
      
      const sunDir = new THREE.Vector3().copy(sunPosition).normalize();
      
      // Dot product for alignment
      const dot = panelNormal.dot(sunDir);
      
      // Calculate efficiency: if dot is < 0, sun is behind panel. max is 1.
      const eff = Math.max(0, dot) * 100;
      setEfficiency(eff);
    }
  });

  return (
    <group position={[0, -1, 0]}>
      {/* House Body */}
      <Box args={[4, 3, 4]} position={[0, 1.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f0efe9" />
      </Box>
      <Box args={[1, 2, 0.1]} position={[0, 1, 2.01]} receiveShadow>
        <meshStandardMaterial color="#8b5a2b" />
      </Box>
      
      {/* House Roof */}
      <Cone args={[3.5, 2, 4]} position={[0, 4, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#a04040" />
      </Cone>
      
      {/* Solar Panel Base */}
      <group position={[0, 4.5, 1.5]}>
        <group ref={panelRef} rotation={[panelTilt, panelPan, 0]}>
          <Box args={[2, 0.1, 1.5]} castShadow>
            <meshStandardMaterial color="#1a3b5c" metalness={0.8} roughness={0.2} />
          </Box>
          <Box args={[2.1, 0.05, 1.6]} position={[0, -0.05, 0]}>
            <meshStandardMaterial color="#bbbbbb" metalness={0.5} roughness={0.5} />
          </Box>
        </group>
      </group>
    </group>
  );
}

function SunTrackerScene({ timeOfDay, panelTilt, panelPan, setEfficiency }) {
  // Calculate sun position based on time of day (0 to 24)
  // 6 = sunrise (East), 12 = noon (Up), 18 = sunset (West)
  const sunPosition = useMemo(() => {
    const angle = ((timeOfDay - 6) / 12) * Math.PI; // 0 to PI between 6 and 18
    const radius = 15;
    const x = Math.cos(angle) * radius; // East to West
    const y = Math.max(Math.sin(angle) * radius, -2); // Arc over the sky
    const z = 2; // Slightly forward
    return new THREE.Vector3(x, y, z);
  }, [timeOfDay]);

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[sunPosition.x, sunPosition.y, sunPosition.z]} 
        intensity={Math.max(0, Math.sin(((timeOfDay - 6) / 12) * Math.PI) * 2)} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024} 
      />
      
      <Sphere args={[1, 32, 32]} position={[sunPosition.x, sunPosition.y, sunPosition.z]}>
        <meshBasicMaterial color="#ffdd00" />
      </Sphere>
      
      <House panelTilt={panelTilt} panelPan={panelPan} sunPosition={sunPosition} setEfficiency={setEfficiency} />
      
      <Plane args={[50, 50]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.01, 0]} receiveShadow>
        <meshStandardMaterial color="#4a7c59" />
      </Plane>
      
      <OrbitControls makeDefault minPolarAngle={Math.PI/6} maxPolarAngle={Math.PI/2 - 0.1} />
    </>
  );
}

export default function SunTrackerSetup() {
  const [timeOfDay, setTimeOfDay] = useState(12); // 12 noon
  const [panelTilt, setPanelTilt] = useState(Math.PI / 4); // 45 degrees
  const [panelPan, setPanelPan] = useState(0); // Facing straight
  const [efficiency, setEfficiency] = useState(0);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', color: 'white' }}>
      <div style={{ padding: '15px', background: 'rgba(0,0,0,0.8)', borderBottom: '2px solid #333' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#FFB800' }}>Sun Tracker Sandbox</h3>
        <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#ccc' }}>Adjust the time of day and align your solar panel to maximize energy production!</p>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
              <span>Time of Day: {Math.floor(timeOfDay)}:00</span>
            </label>
            <input 
              type="range" min="6" max="18" step="0.5" 
              value={timeOfDay} onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
              <span>Panel Tilt (Up/Down)</span>
            </label>
            <input 
              type="range" min="0" max={Math.PI / 2} step="0.1" 
              value={panelTilt} onChange={(e) => setPanelTilt(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
              <span>Panel Pan (Left/Right)</span>
            </label>
            <input 
              type="range" min={-Math.PI/2} max={Math.PI/2} step="0.1" 
              value={panelPan} onChange={(e) => setPanelPan(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
      
      <div style={{ position: 'relative', flex: 1 }}>
        <Canvas shadows camera={{ position: [8, 5, 10], fov: 45 }}>
          <color attach="background" args={['#87CEEB']} />
          {/* Change sky color based on time of day */}
          <SunTrackerScene timeOfDay={timeOfDay} panelTilt={panelTilt} panelPan={panelPan} setEfficiency={setEfficiency} />
        </Canvas>
        
        {/* Efficiency Meter HUD */}
        <div style={{ 
          position: 'absolute', bottom: '20px', right: '20px', 
          background: 'rgba(0,0,0,0.7)', padding: '15px', borderRadius: '10px',
          border: '1px solid #444', width: '200px'
        }}>
          <div style={{ fontSize: '14px', marginBottom: '8px', fontWeight: 'bold' }}>Energy Output</div>
          <div style={{ height: '20px', background: '#222', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              width: `${Math.min(100, efficiency)}%`, 
              background: efficiency > 80 ? '#4CAF50' : efficiency > 40 ? '#FFEB3B' : '#F44336',
              transition: 'width 0.2s, background 0.2s'
            }} />
          </div>
          <div style={{ textAlign: 'right', marginTop: '5px', fontSize: '18px', fontWeight: 'bold', color: efficiency > 80 ? '#4CAF50' : 'white' }}>
            {efficiency.toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
}
