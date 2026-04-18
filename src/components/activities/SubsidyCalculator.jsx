import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Float, Plane, Cone } from '@react-three/drei';
import * as THREE from 'three';

/* ─── 3D Tree (improved with multiple layers) ─── */
function Tree({ position = [0, 0, 0], scale = 1, variant = 0 }) {
  const colors = [
    ['#5D4037', '#2E7D32', '#388E3C', '#43A047'],
    ['#4E342E', '#1B5E20', '#2E7D32', '#388E3C'],
    ['#6D4C41', '#33691E', '#558B2F', '#689F38'],
  ];
  const c = colors[variant % colors.length];
  return (
    <group position={position} scale={scale}>
      <Cylinder args={[0.06, 0.14, 1, 6]} position={[0, 0.5, 0]} castShadow>
        <meshStandardMaterial color={c[0]} roughness={0.9} />
      </Cylinder>
      <Cone args={[0.55, 1.2, 8]} position={[0, 1.3, 0]} castShadow>
        <meshStandardMaterial color={c[1]} roughness={0.8} />
      </Cone>
      <Cone args={[0.42, 0.9, 8]} position={[0, 1.85, 0]} castShadow>
        <meshStandardMaterial color={c[2]} roughness={0.8} />
      </Cone>
      <Cone args={[0.28, 0.6, 8]} position={[0, 2.25, 0]} castShadow>
        <meshStandardMaterial color={c[3]} roughness={0.8} />
      </Cone>
    </group>
  );
}

/* ─── Cloud (fades at night) ─── */
function Cloud({ position, dayFactor = 1 }) {
  const ref = useRef();
  const speed = useMemo(() => 0.08 + Math.random() * 0.12, []);
  const startX = useMemo(() => position[0], [position]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = startX + Math.sin(state.clock.elapsedTime * speed) * 2;
    }
  });

  const opacity = 0.85 * dayFactor;

  return (
    <group ref={ref} position={position}>
      <Sphere args={[0.7, 12, 12]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#fff" roughness={1} transparent opacity={opacity} />
      </Sphere>
      <Sphere args={[0.5, 12, 12]} position={[0.6, 0.15, 0]}>
        <meshStandardMaterial color="#f5f5f5" roughness={1} transparent opacity={opacity} />
      </Sphere>
      <Sphere args={[0.55, 12, 12]} position={[-0.5, 0.1, 0.1]}>
        <meshStandardMaterial color="#fafafa" roughness={1} transparent opacity={opacity} />
      </Sphere>
      <Sphere args={[0.4, 12, 12]} position={[0.3, 0.3, 0.2]}>
        <meshStandardMaterial color="#fff" roughness={1} transparent opacity={opacity * 0.9} />
      </Sphere>
    </group>
  );
}

/* ─── Lamp Post (glows at night) ─── */
function LampPost({ position, nightFactor = 0 }) {
  return (
    <group position={position}>
      <Cylinder args={[0.04, 0.06, 2.5, 6]} position={[0, 1.25, 0]} castShadow>
        <meshStandardMaterial color="#37474F" metalness={0.7} roughness={0.3} />
      </Cylinder>
      <Sphere args={[0.12, 8, 8]} position={[0, 2.6, 0]}>
        <meshStandardMaterial 
          color={nightFactor > 0.3 ? '#FFEB3B' : '#FFF9C4'} 
          emissive="#FFD54F" 
          emissiveIntensity={0.3 + nightFactor * 2} 
        />
      </Sphere>
      {/* Light cone at night */}
      {nightFactor > 0.3 && (
        <pointLight 
          position={[0, 2.5, 0]} 
          intensity={nightFactor * 1.5} 
          color="#FFD54F" 
          distance={4} 
        />
      )}
    </group>
  );
}

/* ─── Neighbor House (improved with more detail) ─── */
function NeighborHouse({ position = [0, 0, 0], color = '#e0d8cc', roofColor = '#795548', windowColor = '#81D4FA' }) {
  return (
    <group position={position}>
      {/* Foundation */}
      <Box args={[2.8, 0.15, 2.8]} position={[0, 0.075, 0]} receiveShadow>
        <meshStandardMaterial color="#9E9E9E" roughness={0.8} />
      </Box>
      {/* Walls */}
      <Box args={[2.5, 2, 2.5]} position={[0, 1.075, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Door */}
      <Box args={[0.5, 1.1, 0.06]} position={[0, 0.625, 1.28]} receiveShadow>
        <meshStandardMaterial color="#5D4037" />
      </Box>
      {/* Door knob */}
      <Sphere args={[0.03, 8, 8]} position={[0.15, 0.6, 1.32]}>
        <meshStandardMaterial color="#FFD54F" metalness={0.8} />
      </Sphere>
      {/* Windows front */}
      <Box args={[0.4, 0.4, 0.06]} position={[-0.7, 1.4, 1.28]}>
        <meshStandardMaterial color={windowColor} metalness={0.3} />
      </Box>
      <Box args={[0.4, 0.4, 0.06]} position={[0.7, 1.4, 1.28]}>
        <meshStandardMaterial color={windowColor} metalness={0.3} />
      </Box>
      {/* Window frame crosses */}
      <Box args={[0.4, 0.03, 0.07]} position={[-0.7, 1.4, 1.3]}>
        <meshStandardMaterial color="#fff" />
      </Box>
      <Box args={[0.03, 0.4, 0.07]} position={[-0.7, 1.4, 1.3]}>
        <meshStandardMaterial color="#fff" />
      </Box>
      {/* Side window */}
      <Box args={[0.06, 0.35, 0.35]} position={[1.28, 1.4, 0]}>
        <meshStandardMaterial color={windowColor} metalness={0.3} />
      </Box>
      {/* Gabled roof */}
      <group position={[0, 2.075, 0]}>
        <Box args={[2.8, 0.1, 2.8]} position={[0, 0.05, 0]} castShadow>
          <meshStandardMaterial color={roofColor} />
        </Box>
        <Box args={[2.4, 0.1, 2.2]} position={[0, 0.3, 0]} castShadow>
          <meshStandardMaterial color={roofColor} />
        </Box>
        <mesh position={[0, 0.65, 0]} castShadow>
          <coneGeometry args={[1.6, 0.6, 4]} />
          <meshStandardMaterial color={roofColor} />
        </mesh>
      </group>
    </group>
  );
}

/* ─── Flower Bed ─── */
function FlowerBed({ position }) {
  const flowerColors = ['#E91E63', '#FF5722', '#FFEB3B', '#9C27B0', '#FF9800'];
  return (
    <group position={position}>
      {/* Dirt bed */}
      <Box args={[1.5, 0.08, 0.6]} position={[0, 0.04, 0]} receiveShadow>
        <meshStandardMaterial color="#5D4037" roughness={0.95} />
      </Box>
      {/* Flowers */}
      {[-0.5, -0.2, 0.1, 0.4].map((x, i) => (
        <group key={i} position={[x, 0.1, 0]}>
          <Cylinder args={[0.01, 0.01, 0.2, 4]} position={[0, 0.1, 0]}>
            <meshStandardMaterial color="#4CAF50" />
          </Cylinder>
          <Sphere args={[0.06, 8, 8]} position={[0, 0.22, 0]}>
            <meshStandardMaterial color={flowerColors[i % flowerColors.length]} />
          </Sphere>
        </group>
      ))}
    </group>
  );
}

/* ─── Sky background that changes with day/night ─── */
function DynamicSky({ sunAngle }) {
  const { scene } = useThree();
  
  useFrame(() => {
    // sunAngle: 0 = sunrise, PI/2 = noon, PI = sunset, 3PI/2 = midnight
    const sunHeight = Math.sin(sunAngle); // -1 to 1
    
    let r, g, b;
    if (sunHeight > 0.15) {
      // Day: bright blue sky
      r = 0.53; g = 0.81; b = 0.92;
    } else if (sunHeight > 0) {
      // Sunset/sunrise: orange
      const t = sunHeight / 0.15;
      r = 0.53 * t + 0.95 * (1 - t);
      g = 0.81 * t + 0.5 * (1 - t);
      b = 0.92 * t + 0.2 * (1 - t);
    } else if (sunHeight > -0.3) {
      // Twilight: deep blue/purple
      const t = (sunHeight + 0.3) / 0.3;
      r = 0.95 * t + 0.08 * (1 - t);
      g = 0.5 * t + 0.08 * (1 - t);
      b = 0.2 * t + 0.18 * (1 - t);
    } else {
      // Night: dark navy
      r = 0.05; g = 0.05; b = 0.12;
    }
    
    scene.background = new THREE.Color(r, g, b);
  });

  return null;
}

/* ─── Sun Rays (visible light beams from the sun direction, no sphere) ─── */
function SunRays({ sunAngle }) {
  const lightRef = useRef();
  const raysRef = useRef();
  
  const sunHeight = Math.sin(sunAngle);
  const isDay = sunHeight > -0.05;
  
  // Sun position far away so it only acts as a directional light source
  const sunX = Math.cos(sunAngle) * 50;
  const sunY = Math.sin(sunAngle) * 50;
  const sunZ = -15;
  
  // Sun light intensity based on height
  const intensity = isDay ? Math.max(0, sunHeight) * 2.5 : 0;
  
  // Sun color: white at noon, warm orange near horizon
  const sunColor = useMemo(() => {
    if (sunHeight > 0.3) return '#FFFFFF';
    if (sunHeight > 0) return '#FFD700';
    return '#FF8C00';
  }, [sunHeight > 0.3, sunHeight > 0]);
  
  return (
    <>
      {/* Main directional "sun" light — no visible sphere */}
      <directionalLight
        ref={lightRef}
        position={[sunX, sunY, sunZ]}
        intensity={intensity}
        color={sunColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-camera-near={1}
        shadow-camera-far={100}
      />
    </>
  );
}

/* ─── Stars (visible at night) ─── */
function Stars({ nightFactor }) {
  const starsData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 80; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.45; // upper hemisphere
      const r = 45 + Math.random() * 5;
      data.push({
        pos: [
          Math.sin(phi) * Math.cos(theta) * r,
          Math.cos(phi) * r,
          Math.sin(phi) * Math.sin(theta) * r,
        ],
        size: 0.04 + Math.random() * 0.08,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
    return data;
  }, []);

  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((star, i) => {
        const twinkle = Math.sin(state.clock.elapsedTime * 2 + starsData[i].twinkle) * 0.5 + 0.5;
        star.material.opacity = nightFactor * twinkle;
      });
    }
  });

  if (nightFactor < 0.2) return null;

  return (
    <group ref={groupRef}>
      {starsData.map((s, i) => (
        <Sphere key={i} args={[s.size, 6, 6]} position={s.pos}>
          <meshBasicMaterial color="#ffffff" transparent opacity={nightFactor * 0.7} />
        </Sphere>
      ))}
    </group>
  );
}

/* ─── Moon (visible at night) ─── */
function Moon({ sunAngle, nightFactor }) {
  // Moon is opposite the sun
  const moonX = -Math.cos(sunAngle) * 40;
  const moonY = -Math.sin(sunAngle) * 30 + 10;
  
  if (nightFactor < 0.3) return null;
  
  return (
    <group position={[moonX, Math.max(moonY, 5), -20]}>
      <Sphere args={[1.5, 24, 24]}>
        <meshBasicMaterial color="#F5F5DC" transparent opacity={nightFactor * 0.9} />
      </Sphere>
      {/* Moonlight */}
      <pointLight intensity={nightFactor * 0.4} color="#C0C8E0" distance={60} />
    </group>
  );
}

/* ─── 3D Colony House with dynamic solar panels ─── */
function SolarHouse({ capacity, isSuccess }) {
  const panelsRef = useRef();
  const [sunAngle, setSunAngle] = useState(Math.PI * 0.4); // start near noon

  useFrame((state) => {
    // Full day/night cycle: one complete rotation every ~30 seconds
    const t = state.clock.elapsedTime * 0.2;
    const angle = t % (Math.PI * 2);
    setSunAngle(angle);
    
    if (panelsRef.current && isSuccess) {
      panelsRef.current.children.forEach((child, i) => {
        child.position.y = Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.05 + child.userData.baseY;
      });
    }
  });

  const panels = useMemo(() => {
    const arr = [];
    const maxPanels = Math.min(capacity, 10);
    const cols = Math.min(maxPanels, 4);
    const rows = Math.ceil(maxPanels / cols);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols && arr.length < maxPanels; c++) {
        arr.push({
          x: (c - (cols - 1) / 2) * 0.9,
          z: (r - (rows - 1) / 2) * 0.65,
          baseY: 0.08,
        });
      }
    }
    return arr;
  }, [capacity]);

  // Compute day/night factors
  const sunHeight = Math.sin(sunAngle);
  const dayFactor = Math.max(0, Math.min(1, (sunHeight + 0.1) / 0.5)); // 0=night, 1=day
  const nightFactor = 1 - dayFactor;
  
  // Get time label
  const getTimeLabel = () => {
    const norm = ((sunAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    if (norm < Math.PI * 0.15) return { label: '🌅 Sunrise', color: '#FF8C00' };
    if (norm < Math.PI * 0.85) return { label: '☀️ Day', color: '#FFD700' };
    if (norm < Math.PI * 1.0) return { label: '🌇 Sunset', color: '#FF6347' };
    if (norm < Math.PI * 1.85) return { label: '🌙 Night', color: '#7B68EE' };
    return { label: '🌅 Dawn', color: '#FF8C00' };
  };
  const timeInfo = getTimeLabel();

  return (
    <group>
      {/* Dynamic sky color */}
      <DynamicSky sunAngle={sunAngle} />
      
      {/* Sun rays — directional light only, no visible sphere */}
      <SunRays sunAngle={sunAngle} />
      
      {/* Stars visible at night */}
      <Stars nightFactor={nightFactor} />
      
      {/* Moon at night */}
      <Moon sunAngle={sunAngle} nightFactor={nightFactor} />

      {/* Clouds (fade at night) */}
      <Cloud position={[-6, 8, -5]} dayFactor={dayFactor} />
      <Cloud position={[4, 9, -8]} dayFactor={dayFactor} />
      <Cloud position={[8, 7.5, -3]} dayFactor={dayFactor} />

      {/* Ambient light — dimmer at night */}
      <ambientLight intensity={0.15 + dayFactor * 0.45} />
      <hemisphereLight 
        skyColor={dayFactor > 0.5 ? '#87CEEB' : '#1a1a3e'} 
        groundColor={dayFactor > 0.5 ? '#4a7c59' : '#0a0a1a'} 
        intensity={0.2 + dayFactor * 0.5} 
      />

      {/* Main House */}
      <group position={[0, 0, 0]}>
        {/* Foundation */}
        <Box args={[4.4, 0.2, 4]} position={[0, 0.1, 0]} receiveShadow>
          <meshStandardMaterial color="#9E9E9E" roughness={0.7} />
        </Box>

        {/* Walls with slight texture variation */}
        <Box args={[4, 2.5, 3.5]} position={[0, 1.45, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#FAFAFA" />
        </Box>

        {/* Wall trim / baseboard */}
        <Box args={[4.05, 0.1, 3.55]} position={[0, 0.25, 0]}>
          <meshStandardMaterial color="#E0E0E0" />
        </Box>

        {/* Door with frame */}
        <Box args={[0.85, 1.6, 0.06]} position={[0, 0.9, 1.78]} receiveShadow>
          <meshStandardMaterial color="#4E342E" />
        </Box>
        <Box args={[0.7, 1.5, 0.07]} position={[0, 0.85, 1.79]} receiveShadow>
          <meshStandardMaterial color="#6D4C41" />
        </Box>
        {/* Door knob */}
        <Sphere args={[0.04, 8, 8]} position={[0.25, 0.85, 1.83]}>
          <meshStandardMaterial color="#FFD54F" metalness={0.9} roughness={0.1} />
        </Sphere>

        {/* Windows with frames */}
        {[[-1.2, 1.6], [1.2, 1.6]].map(([x, y], i) => (
          <group key={i} position={[x, y, 1.76]}>
            {/* Window frame */}
            <Box args={[0.65, 0.6, 0.06]}>
              <meshStandardMaterial color="#EEEEEE" />
            </Box>
            {/* Glass */}
            <Box args={[0.55, 0.5, 0.07]}>
              <meshStandardMaterial color="#81D4FA" metalness={0.4} roughness={0.1} transparent opacity={0.7} />
            </Box>
            {/* Cross bars */}
            <Box args={[0.55, 0.03, 0.08]}>
              <meshStandardMaterial color="#fff" />
            </Box>
            <Box args={[0.03, 0.5, 0.08]}>
              <meshStandardMaterial color="#fff" />
            </Box>
          </group>
        ))}

        {/* Side windows */}
        {[[2.01, 1.6, 0], [-2.01, 1.6, 0]].map(([x, y, z], i) => (
          <group key={`side-${i}`} position={[x, y, z]}>
            <Box args={[0.06, 0.45, 0.45]}>
              <meshStandardMaterial color="#81D4FA" metalness={0.3} transparent opacity={0.6} />
            </Box>
          </group>
        ))}

        {/* Proper gabled roof */}
        <group position={[0, 2.7, 0]}>
          {/* Base overhang */}
          <Box args={[4.6, 0.12, 4.1]} position={[0, 0, 0]} castShadow receiveShadow>
            <meshStandardMaterial color="#B71C1C" />
          </Box>
          {/* Layer 2 */}
          <Box args={[4, 0.12, 3.5]} position={[0, 0.35, 0]} castShadow>
            <meshStandardMaterial color="#C62828" />
          </Box>
          {/* Layer 3 */}
          <Box args={[3.2, 0.12, 2.8]} position={[0, 0.65, 0]} castShadow>
            <meshStandardMaterial color="#D32F2F" />
          </Box>
          {/* Layer 4 */}
          <Box args={[2.4, 0.12, 2]} position={[0, 0.92, 0]} castShadow>
            <meshStandardMaterial color="#E53935" />
          </Box>
          {/* Ridge */}
          <Box args={[1.4, 0.12, 1.2]} position={[0, 1.15, 0]} castShadow>
            <meshStandardMaterial color="#EF5350" />
          </Box>
          {/* Ridge cap */}
          <Box args={[0.5, 0.1, 0.4]} position={[0, 1.35, 0]} castShadow>
            <meshStandardMaterial color="#F44336" />
          </Box>
        </group>

        {/* Solar Panels on roof — raised well above roof surface */}
        <group ref={panelsRef} position={[0, 4.4, 0.3]} rotation={[0.4, 0, 0]}>
          {panels.map((p, i) => (
            <group key={i} position={[p.x, p.baseY, p.z]} userData={{ baseY: p.baseY }}>
              {/* Mounting legs — visible aluminium stands */}
              <Cylinder args={[0.025, 0.025, 0.5, 6]} position={[-0.35, -0.28, -0.2]} rotation={[0.15, 0, 0]}>
                <meshStandardMaterial color="#B0BEC5" metalness={0.7} roughness={0.3} />
              </Cylinder>
              <Cylinder args={[0.025, 0.025, 0.5, 6]} position={[0.35, -0.28, -0.2]} rotation={[0.15, 0, 0]}>
                <meshStandardMaterial color="#B0BEC5" metalness={0.7} roughness={0.3} />
              </Cylinder>
              <Cylinder args={[0.025, 0.025, 0.35, 6]} position={[-0.35, -0.2, 0.2]} rotation={[-0.1, 0, 0]}>
                <meshStandardMaterial color="#B0BEC5" metalness={0.7} roughness={0.3} />
              </Cylinder>
              <Cylinder args={[0.025, 0.025, 0.35, 6]} position={[0.35, -0.2, 0.2]} rotation={[-0.1, 0, 0]}>
                <meshStandardMaterial color="#B0BEC5" metalness={0.7} roughness={0.3} />
              </Cylinder>
              {/* Panel frame (aluminium border) */}
              <Box args={[1.05, 0.05, 0.72]} position={[0, -0.02, 0]}>
                <meshStandardMaterial color="#B0BEC5" metalness={0.7} roughness={0.25} />
              </Box>
              {/* Panel glass — the solar cell surface */}
              <Box args={[1, 0.07, 0.68]} castShadow>
                <meshStandardMaterial
                  color={isSuccess ? '#1565C0' : '#1a3b5c'}
                  metalness={0.9}
                  roughness={0.1}
                  emissive={isSuccess ? '#2196F3' : '#111'}
                  emissiveIntensity={isSuccess ? 0.4 : 0.05}
                />
              </Box>
              {/* Grid lines — cell dividers */}
              <Box args={[1, 0.075, 0.015]} position={[0, 0.002, 0.17]}>
                <meshBasicMaterial color="#0a1929" />
              </Box>
              <Box args={[1, 0.075, 0.015]} position={[0, 0.002, -0.17]}>
                <meshBasicMaterial color="#0a1929" />
              </Box>
              <Box args={[0.015, 0.075, 0.68]} position={[0.25, 0.002, 0]}>
                <meshBasicMaterial color="#0a1929" />
              </Box>
              <Box args={[0.015, 0.075, 0.68]} position={[-0.25, 0.002, 0]}>
                <meshBasicMaterial color="#0a1929" />
              </Box>
              <Box args={[0.015, 0.075, 0.68]} position={[0, 0.002, 0]}>
                <meshBasicMaterial color="#0a1929" />
              </Box>
            </group>
          ))}
        </group>

        {/* Chimney */}
        <Box args={[0.4, 0.8, 0.4]} position={[-1.2, 4.1, -0.6]} castShadow>
          <meshStandardMaterial color="#795548" />
        </Box>
        <Box args={[0.5, 0.1, 0.5]} position={[-1.2, 4.55, -0.6]}>
          <meshStandardMaterial color="#6D4C41" />
        </Box>
      </group>

      {/* ═══ ENVIRONMENT ═══ */}

      {/* Ground - textured grass */}
      <Plane args={[80, 80]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <meshStandardMaterial color="#4CAF50" roughness={0.9} />
      </Plane>

      {/* Pathway to house door — extends from house front to sidewalk */}
      {[0, 0.7, 1.4, 2.1, 2.8, 3.5, 4.2].map((z, i) => (
        <Box key={`path-${i}`} args={[0.8, 0.02, 0.55]} position={[0, 0.01, 2.2 + z]} receiveShadow>
          <meshStandardMaterial color="#BDBDBD" roughness={0.8} />
        </Box>
      ))}

      {/* Sidewalk (house side) */}
      <Box args={[50, 0.03, 1.2]} position={[0, 0.01, 7]} receiveShadow>
        <meshStandardMaterial color="#BDBDBD" roughness={0.7} />
      </Box>

      {/* Road — well separated from house */}
      <Box args={[50, 0.04, 3.5]} position={[0, 0.01, 9.5]} receiveShadow>
        <meshStandardMaterial color="#546E7A" roughness={0.85} />
      </Box>
      {/* Road center line (dashed) */}
      {[-8, -5, -2, 1, 4, 7, 10, 13, -11, -14].map((x, i) => (
        <Box key={`dash-${i}`} args={[1.5, 0.05, 0.12]} position={[x, 0.04, 9.5]}>
          <meshStandardMaterial color="#FFD54F" />
        </Box>
      ))}

      {/* Sidewalk (far side of road) */}
      <Box args={[50, 0.03, 1]} position={[0, 0.01, 11.8]} receiveShadow>
        <meshStandardMaterial color="#BDBDBD" roughness={0.7} />
      </Box>

      {/* ═══ Neighbor Houses ═══ */}
      {/* Same side as main house */}
      <NeighborHouse position={[-7, 0, 0]} color="#FFF3E0" roofColor="#795548" />
      <NeighborHouse position={[7, 0, 0]} color="#E3F2FD" roofColor="#455A64" windowColor="#B3E5FC" />
      {/* Across the road */}
      <NeighborHouse position={[-7, 0, 13.5]} color="#F3E5F5" roofColor="#6D4C41" />
      <NeighborHouse position={[0, 0, 14]} color="#E8F5E9" roofColor="#5D4037" />
      <NeighborHouse position={[7, 0, 13.5]} color="#FFF8E1" roofColor="#607D8B" />
      <NeighborHouse position={[-13, 0, 13]} color="#FCE4EC" roofColor="#8D6E63" />
      <NeighborHouse position={[13, 0, 13]} color="#E0F7FA" roofColor="#546E7A" />

      {/* Trees — front yard */}
      <Tree position={[-3.5, 0, 3.5]} scale={1.2} variant={0} />
      <Tree position={[3.5, 0, 3.5]} scale={1} variant={1} />
      {/* Trees — along sidewalk */}
      <Tree position={[-5, 0, 6.5]} scale={1.1} variant={2} />
      <Tree position={[5, 0, 6.5]} scale={0.9} variant={0} />
      {/* Trees — across the road */}
      <Tree position={[-5.5, 0, 12.5]} scale={0.8} variant={1} />
      <Tree position={[5.5, 0, 12.5]} scale={1} variant={2} />
      {/* Trees — behind house */}
      <Tree position={[0, 0, -3.5]} scale={1.4} variant={0} />
      <Tree position={[-10, 0, -2]} scale={1} variant={1} />
      <Tree position={[10, 0, -2]} scale={0.9} variant={2} />
      <Tree position={[-3, 0, -4]} scale={0.7} variant={0} />
      <Tree position={[4, 0, -3]} scale={0.8} variant={1} />
      {/* Trees — far background */}
      <Tree position={[-14, 0, 14]} scale={1.1} variant={2} />
      <Tree position={[14, 0, 14]} scale={1.2} variant={0} />
      <Tree position={[-9, 0, 5]} scale={0.9} variant={1} />
      <Tree position={[9, 0, 5]} scale={1} variant={2} />

      {/* Flower beds — front of house */}
      <FlowerBed position={[-2.5, 0, 2.5]} />
      <FlowerBed position={[2.5, 0, 2.5]} />

      {/* Garden fence around main house front yard */}
      {[-3, -2, -1, 0, 1, 2, 3].map((x, i) => (
        <group key={`fence-${i}`} position={[x, 0, 3.2]}>
          <Cylinder args={[0.03, 0.03, 0.7, 4]} position={[0, 0.35, 0]} castShadow>
            <meshStandardMaterial color="#8D6E63" />
          </Cylinder>
          {/* Fence point */}
          <Cone args={[0.04, 0.08, 4]} position={[0, 0.74, 0]}>
            <meshStandardMaterial color="#A1887F" />
          </Cone>
        </group>
      ))}
      {/* Fence rails */}
      <Box args={[6.5, 0.05, 0.05]} position={[0, 0.55, 3.2]}>
        <meshStandardMaterial color="#8D6E63" />
      </Box>
      <Box args={[6.5, 0.05, 0.05]} position={[0, 0.3, 3.2]}>
        <meshStandardMaterial color="#8D6E63" />
      </Box>

      {/* Lamp posts — along sidewalk, glow at night */}
      <LampPost position={[-5, 0, 7]} nightFactor={nightFactor} />
      <LampPost position={[5, 0, 7]} nightFactor={nightFactor} />
      <LampPost position={[0, 0, 12]} nightFactor={nightFactor} />
      
      {/* Window glow at night */}
      {nightFactor > 0.3 && (
        <>
          <pointLight position={[0, 1.5, 2]} intensity={nightFactor * 0.5} color="#FFD54F" distance={3} />
          <pointLight position={[-1.2, 1.6, 2]} intensity={nightFactor * 0.3} color="#FFD54F" distance={2} />
          <pointLight position={[1.2, 1.6, 2]} intensity={nightFactor * 0.3} color="#FFD54F" distance={2} />
        </>
      )}

      {/* Time of day indicator — positioned in scene as a floating badge */}
      {/* (rendered as HUD overlay in the parent instead) */}

      {/* Money pile when success */}
      {isSuccess && (
        <Float speed={3} floatIntensity={0.3}>
          <group position={[3, 1.5, 2]}>
            {[0, 0.15, 0.3, 0.45].map((y, i) => (
              <Cylinder key={i} args={[0.25, 0.25, 0.12, 16]} position={[0, y, 0]}>
                <meshStandardMaterial color="#4CAF50" metalness={0.6} />
              </Cylinder>
            ))}
            {/* Rupee symbol floating */}
            <Sphere args={[0.15, 12, 12]} position={[0, 0.7, 0]}>
              <meshStandardMaterial color="#FFD700" metalness={0.8} emissive="#FFD700" emissiveIntensity={0.2} />
            </Sphere>
          </group>
        </Float>
      )}
    </group>
  );
}

/* ─── Data ─── */
const STATES = [
  { id: 'up', name: 'Uttar Pradesh', topUp: 30000, topUpLabel: '₹30,000 (₹15k/kW, capped ₹30k)' },
  { id: 'delhi', name: 'Delhi', topUp: 6000, topUpLabel: '₹6,000 (~₹2-3k/kW) + GBI' },
  { id: 'mh', name: 'Maharashtra', topUp: 15000, topUpLabel: '₹15,000 (SMART program)' },
  { id: 'tn', name: 'Tamil Nadu', topUp: 20000, topUpLabel: '₹20,000 (CM Solar Scheme)' },
  { id: 'guj', name: 'Gujarat', topUp: 10000, topUpLabel: '₹10,000 (State RE incentive)' },
  { id: 'raj', name: 'Rajasthan', topUp: 0, topUpLabel: 'No additional state top-up' },
  { id: 'ka', name: 'Karnataka', topUp: 0, topUpLabel: 'No additional state top-up' },
  { id: 'other', name: 'Other State', topUp: 0, topUpLabel: 'Check your state portal' },
];

const ELIGIBILITY_RULES = [
  { id: 'dcr', label: 'DCR Panels (Indian-made)', icon: '🇮🇳' },
  { id: 'almm', label: 'ALMM Approved brand', icon: '✅' },
  { id: 'vendor', label: 'Empanelled vendor', icon: '🏪' },
  { id: 'grid', label: 'Grid-Connected (no batteries)', icon: '🔌' },
];

const STEPS = [
  { id: 1, title: 'Register', icon: '📝', desc: 'Sign up at pmsuryaghar.gov.in' },
  { id: 2, title: 'Apply', icon: '📋', desc: 'Submit for technical feasibility' },
  { id: 3, title: 'Install', icon: '🔧', desc: 'Choose a registered vendor & install' },
  { id: 4, title: 'Net-Meter', icon: '⚡', desc: 'DISCOM inspects & installs meter' },
  { id: 5, title: 'Claim', icon: '💰', desc: 'Upload bank details, receive DBT' },
];

export default function SubsidyCalculator() {
  const [capacity, setCapacity] = useState(3);
  const [state, setState] = useState('up');
  const [showSteps, setShowSteps] = useState(false);
  const [checkedRules, setCheckedRules] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const getCentralSubsidy = (kw) => {
    if (kw <= 0) return 0;
    if (kw <= 1) return 30000;
    if (kw <= 2) return 60000;
    return 78000;
  };

  const centralSubsidy = getCentralSubsidy(capacity);
  const stateData = STATES.find(s => s.id === state);
  const stateTopUp = stateData ? stateData.topUp : 0;
  const totalSubsidy = centralSubsidy + stateTopUp;
  const systemCost = capacity * 45000;
  const outOfPocket = Math.max(0, systemCost - totalSubsidy);
  const dailyUnits = capacity * 4;
  const monthlySavings = dailyUnits * 30 * 8;
  const paybackMonths = outOfPocket > 0 ? Math.ceil(outOfPocket / monthlySavings) : 0;
  const allRulesChecked = checkedRules.length === ELIGIBILITY_RULES.length;
  const isSuccess = allRulesChecked && totalSubsidy > 0;

  const toggleRule = (ruleId) => setCheckedRules(prev => prev.includes(ruleId) ? prev.filter(r => r !== ruleId) : [...prev, ruleId]);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      const elem = containerRef.current;
      if (elem) {
        if (elem.requestFullscreen) elem.requestFullscreen();
        else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
        else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Listen for fullscreen change events  
  React.useEffect(() => {
    const onFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFSChange);
    return () => document.removeEventListener('fullscreenchange', onFSChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: isFullscreen ? '100vh' : '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        backgroundColor: '#0d1117', 
        color: 'white', 
        fontFamily: 'sans-serif',
        position: 'relative'
      }}
    >
      {/* Header */}
      <div style={{ padding: '10px 14px', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderBottom: '2px solid #30363d', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ flex: '1 1 180px', minWidth: 0 }}>
          <h3 style={{ margin: '0 0 3px 0', color: '#FFB800', fontSize: 'clamp(14px, 3.5vw, 18px)' }}>💰 Subsidy Calculator</h3>
          <p style={{ margin: 0, color: '#8b949e', fontSize: 'clamp(10px, 2vw, 12px)' }}>See how much government subsidy YOU would get!</p>
        </div>
        {/* Fullscreen toggle button */}
        <button 
          onClick={toggleFullscreen}
          style={{
            padding: '8px 14px',
            background: isFullscreen ? 'rgba(244,67,54,0.2)' : 'rgba(255,184,0,0.15)',
            border: `1px solid ${isFullscreen ? '#f44336' : '#FFB800'}`,
            borderRadius: '8px',
            color: isFullscreen ? '#f44336' : '#FFB800',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = `0 0 15px ${isFullscreen ? 'rgba(244,67,54,0.3)' : 'rgba(255,184,0,0.3)'}` }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
        >
          <span style={{ fontSize: '16px' }}>{isFullscreen ? '⊖' : '⊕'}</span>
          {isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}
        </button>
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
        
        {/* 3D Colony House — takes up the full area */}
        <div style={{ flex: 1, position: 'relative', minHeight: isFullscreen ? '400px' : '300px' }}>
          <Canvas camera={{ position: [6, 5, 10], fov: 38 }} shadows>
            {/* All lighting is now handled inside SolarHouse for day/night sync */}
            <SolarHouse capacity={capacity} isSuccess={isSuccess} />
            <OrbitControls 
              enableZoom={true} 
              enablePan={false} 
              maxPolarAngle={Math.PI / 2.1} 
              minPolarAngle={Math.PI / 6} 
              minDistance={5}
              maxDistance={20}
            />
          </Canvas>
          {/* Panel count badge */}
          <div style={{ 
            position: 'absolute', top: '10px', left: '10px', 
            background: 'rgba(0,0,0,0.65)', padding: '6px 12px', borderRadius: '8px', 
            fontSize: '12px', backdropFilter: 'blur(6px)', border: '1px solid #30363d' 
          }}>
            🏠 {capacity} kW → {capacity} panel{capacity > 1 ? 's' : ''} on roof
          </div>
          {/* Day/Night cycle badge */}
          <div style={{ 
            position: 'absolute', top: '10px', right: '10px', 
            background: 'rgba(0,0,0,0.7)', padding: '6px 14px', borderRadius: '8px', 
            fontSize: '12px', backdropFilter: 'blur(6px)', border: '1px solid #30363d',
            display: 'flex', alignItems: 'center', gap: '6px',
            animation: 'fadeIn 0.3s ease'
          }}>
            <span style={{ fontSize: '14px' }}>🔄</span>
            <span style={{ color: '#8b949e' }}>Day / Night Cycle Active</span>
          </div>
        </div>

        {/* Controls + Results — at the bottom, overlaying the 3D scene */}
        <div style={{ 
          background: 'rgba(13,17,23,0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '2px solid #30363d',
          display: 'flex',
          flexWrap: 'wrap',
          minHeight: 0,
          flexShrink: 0,
        }}>
          
          {/* Left: Inputs */}
          <div style={{ 
            flex: '1 1 280px', 
            padding: '12px 14px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px', 
            overflowY: 'auto',
            maxHeight: isFullscreen ? '350px' : '280px',
            minWidth: 0,
          }}>
            
            {/* Capacity */}
            <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '10px', padding: '12px' }}>
              <div style={{ fontSize: '10px', color: '#8b949e', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>System Capacity</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[1, 2, 3, 5, 10].map(kw => (
                  <button key={kw} onClick={(e) => { e.stopPropagation(); setCapacity(kw); }}
                    style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px',
                      background: capacity === kw ? '#FFB800' : '#21262d', color: capacity === kw ? '#000' : '#fff', transition: 'all 0.2s' }}>
                    {kw} kW
                  </button>
                ))}
              </div>
              <div style={{ marginTop: '6px', fontSize: '10px', color: '#8b949e' }}>
                {capacity <= 1 && '1 BHK / Small apartment'}
                {capacity === 2 && '2-3 BHK / Small family'}
                {capacity === 3 && '3 BHK / AC usage'}
                {capacity === 5 && 'Large home / heavy usage'}
                {capacity === 10 && 'Commercial-grade'}
              </div>
            </div>

            {/* State */}
            <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '10px', padding: '12px' }}>
              <div style={{ fontSize: '10px', color: '#8b949e', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your State</div>
              <select value={state} onChange={(e) => setState(e.target.value)}
                style={{ width: '100%', padding: '8px', background: '#21262d', color: 'white', border: '1px solid #30363d', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
                {STATES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <div style={{ marginTop: '6px', fontSize: '10px', color: '#58a6ff' }}>{stateData?.topUpLabel}</div>
            </div>

            {/* Eligibility */}
            <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '10px', padding: '12px' }}>
              <div style={{ fontSize: '10px', color: '#8b949e', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Eligibility Checklist</div>
              {ELIGIBILITY_RULES.map(rule => (
                <div key={rule.id} onClick={() => toggleRule(rule.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px', cursor: 'pointer', borderRadius: '5px', marginBottom: '3px', background: checkedRules.includes(rule.id) ? 'rgba(35,134,54,0.1)' : 'transparent' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${checkedRules.includes(rule.id) ? '#238636' : '#30363d'}`, background: checkedRules.includes(rule.id) ? '#238636' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0 }}>
                    {checkedRules.includes(rule.id) && '✓'}
                  </div>
                  <span style={{ fontSize: '12px' }}>{rule.icon} {rule.label}</span>
                </div>
              ))}
              {allRulesChecked && <div style={{ marginTop: '6px', fontSize: '11px', color: '#4CAF50', fontWeight: 'bold' }}>✅ Eligible!</div>}
            </div>

            {/* Steps */}
            <button onClick={() => setShowSteps(!showSteps)}
              style={{ padding: '10px', background: '#21262d', border: '1px solid #30363d', borderRadius: '8px', color: '#58a6ff', cursor: 'pointer', textAlign: 'left', fontSize: '12px', fontWeight: 'bold' }}>
              {showSteps ? '▼' : '▶'} How to Apply (5 Steps)
            </button>
            {showSteps && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {STEPS.map((step) => (
                  <div key={step.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '8px 10px', background: '#161b22', borderRadius: '6px', border: '1px solid #30363d' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#21262d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{step.icon}</div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{step.title}</div>
                      <div style={{ fontSize: '11px', color: '#8b949e' }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Results */}
          <div style={{ 
            flex: '0 0 auto',
            width: '100%',
            maxWidth: '260px',
            background: '#161b22', 
            borderLeft: '2px solid #30363d', 
            padding: '12px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px', 
            overflowY: 'auto',
            maxHeight: isFullscreen ? '350px' : '280px',
          }}>
            <div style={{ fontSize: '11px', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Breakdown</div>

            <div style={{ background: '#21262d', borderRadius: '8px', padding: '12px', border: '1px solid #30363d' }}>
              <div style={{ fontSize: '10px', color: '#8b949e', marginBottom: '3px' }}>Central (PM Surya Ghar)</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>₹{centralSubsidy.toLocaleString()}</div>
              {capacity >= 3 && <div style={{ fontSize: '9px', color: '#f0883e', marginTop: '3px' }}>⚠️ Capped at ₹78,000</div>}
            </div>

            <div style={{ background: '#21262d', borderRadius: '8px', padding: '12px', border: '1px solid #30363d' }}>
              <div style={{ fontSize: '10px', color: '#8b949e', marginBottom: '3px' }}>State Top-up</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: stateTopUp > 0 ? '#58a6ff' : '#484f58' }}>{stateTopUp > 0 ? `₹${stateTopUp.toLocaleString()}` : '₹0'}</div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #238636 0%, #2ea043 100%)', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '10px', opacity: 0.8, marginBottom: '3px' }}>Total Subsidy</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>₹{totalSubsidy.toLocaleString()}</div>
            </div>

            <div style={{ height: '1px', background: '#30363d' }} />

            <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#8b949e' }}>System Cost</span><span>₹{systemCost.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#8b949e' }}>Out-of-Pocket</span><span style={{ fontWeight: 'bold', color: '#f0883e' }}>₹{outOfPocket.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#8b949e' }}>Monthly Savings</span><span style={{ color: '#4CAF50' }}>₹{monthlySavings.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#8b949e' }}>Payback</span><span style={{ fontWeight: 'bold', color: '#58a6ff' }}>{paybackMonths > 0 ? `~${paybackMonths}mo` : '🎉'}</span></div>
            </div>

            <div style={{ fontSize: '9px', color: '#484f58', marginTop: 'auto', lineHeight: '1.3' }}>
              * Est. ₹45k/kW, 4 units/kW/day, ₹8/unit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
