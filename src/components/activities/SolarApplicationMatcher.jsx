import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Cylinder, Torus, Float, Stars, useTexture, Sparkles, Trail } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Space Adventure Solar System Scene ─── */
function RotatingSun() {
  const sunRef = useRef();
  useFrame((_, delta) => {
    if (sunRef.current) sunRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={sunRef}>
      {/* Core */}
      <Sphere args={[1.5, 64, 64]}>
        <meshBasicMaterial color="#ffcc00" />
      </Sphere>
      {/* Corona / Outer glow */}
      <Sphere args={[1.8, 64, 64]}>
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.3} side={THREE.BackSide} />
      </Sphere>
      <Sphere args={[2.3, 64, 64]}>
        <meshBasicMaterial color="#ff5500" transparent opacity={0.1} side={THREE.BackSide} />
      </Sphere>
      {/* Solar flares / energy dust */}
      <Sparkles count={400} scale={3.5} size={6} speed={0.4} color="#ff9900" opacity={0.6} />
      {/* Sun Light Source */}
      <pointLight position={[0, 0, 0]} intensity={6} color="#fff1ba" distance={100} decay={1.5} castShadow />
    </group>
  );
}

function Planet({ p, highlightType, earthTexture }) {
  const orbitRef = useRef();
  const groupRef = useRef();
  const isSelected = highlightType === p.type;
  
  // Rotate the planet around the sun
  useFrame((_, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * p.speed;
    }
    if (groupRef.current) {
      // Planet's own rotation
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={orbitRef}>
      {/* Orbit Path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[p.distance - 0.02, p.distance + 0.02, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={isSelected ? 0.25 : 0.04} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Planet Mesh & Elements */}
      <group position={[p.distance, 0, 0]} ref={groupRef}>
        <Trail width={isSelected ? 1.5 : 0.5} color={p.color} length={isSelected ? 8 : 4} attenuation={(t) => t * t}>
          <Float speed={2} floatIntensity={0.5}>
            {/* Core planet */}
            <Sphere args={[isSelected ? p.size * 1.5 : p.size, 64, 64]} castShadow receiveShadow>
              {p.isEarth ? (
                <meshStandardMaterial map={earthTexture} roughness={0.6} metalness={0.1} />
              ) : (
                <meshStandardMaterial color={p.color} roughness={0.7} metalness={0.2} />
              )}
            </Sphere>
            
            {/* Atmospheric glow */}
            <Sphere args={[isSelected ? p.size * 1.6 : p.size * 1.1, 32, 32]}>
              <meshStandardMaterial color={isSelected ? '#ffffff' : p.color} transparent opacity={isSelected ? 0.3 : 0.15} roughness={1} side={THREE.BackSide} />
            </Sphere>

            {/* Planetary Rings */}
            {p.hasRings && (
              <mesh rotation={[Math.PI / 2.5, 0, 0]} receiveShadow castShadow>
                <ringGeometry args={[p.size * 1.6, p.size * 2.4, 64]} />
                <meshStandardMaterial color={p.color} transparent opacity={0.6} side={THREE.DoubleSide} metalness={0.4} roughness={0.6} />
              </mesh>
            )}

            {/* Highlight Selection Indicator */}
            {isSelected && (
              <Sphere args={[p.size * 1.8, 32, 32]}>
                <meshBasicMaterial color={p.color} transparent opacity={0.2} wireframe />
              </Sphere>
            )}
          </Float>
        </Trail>
      </group>
    </group>
  );
}

function SolarSystemScene({ highlightType }) {
  const earthTexture = useTexture('/images/earth-texture.png');
  
  useMemo(() => {
    earthTexture.minFilter = THREE.LinearFilter;
    earthTexture.magFilter = THREE.LinearFilter;
    earthTexture.colorSpace = THREE.SRGBColorSpace;
  }, [earthTexture]);

  const planets = [
    { type: 'residential', color: '#e67e22', distance: 2.8, speed: 0.6, size: 0.2, hasRings: false },
    { type: 'space', color: '#8e44ad', distance: 4.0, speed: 0.45, size: 0.25, hasRings: false },
    { type: 'agriculture', color: '#27ae60', distance: 5.5, speed: 0.35, size: 0.35, hasRings: false, isEarth: true },
    { type: 'portable', color: '#3498db', distance: 7.0, speed: 0.28, size: 0.2, hasRings: false },
    { type: 'bipv', color: '#1abc9c', distance: 8.8, speed: 0.2, size: 0.45, hasRings: true },
    { type: 'transport', color: '#e74c3c', distance: 10.5, speed: 0.15, size: 0.3, hasRings: false },
    { type: 'floating', color: '#2980b9', distance: 12.5, speed: 0.1, size: 0.4, hasRings: false },
  ];

  return (
    <group>
      <Stars radius={100} depth={50} count={5000} factor={5} saturation={0.5} fade speed={1.5} />
      <Sparkles count={1500} scale={30} size={1.5} speed={0.2} color="#ffffff" opacity={0.3} />
      <ambientLight intensity={0.03} />
      <RotatingSun />
      {planets.map(p => (
        <Planet key={p.type} p={p} highlightType={highlightType} earthTexture={earthTexture} />
      ))}
    </group>
  );
}

/* ─── Data ─── */
const SCENARIOS = [
  { id: 1, scenario: 'A family in Mumbai wants to reduce their monthly electricity bill and run their AC using the sun.', correct: 'residential', explanation: 'Rooftop residential solar is perfect for powering home appliances and reducing grid dependency!' },
  { id: 2, scenario: 'An astronaut on the International Space Station needs to power the station\'s systems 24/7.', correct: 'space', explanation: 'In space, there are no clouds or night — solar wings provide constant power to satellites and the ISS!' },
  { id: 3, scenario: 'A farmer in rural Rajasthan needs to pump water from a well without any diesel.', correct: 'agriculture', explanation: 'Solar water pumping (Agrivoltaics) replaces diesel pumps, saving money and the environment!' },
  { id: 4, scenario: 'A hiker trekking through the Himalayas needs to keep their GPS charged while walking.', correct: 'portable', explanation: 'Portable solar panels on backpacks can charge devices on the go — perfect for remote adventures!' },
  { id: 5, scenario: 'An architect is designing a glass skyscraper in Delhi that should generate its own power without ugly panels.', correct: 'bipv', explanation: 'Building-Integrated Photovoltaics (BIPV) use transparent solar glass that generates power without blocking the view!' },
  { id: 6, scenario: 'A logistics company wants their electric delivery vans to gain extra range while parked in the sun.', correct: 'transport', explanation: 'Solar roofs on EVs can add 15-30km of range per day just from parking in the sun!' },
  { id: 7, scenario: 'A city has a large reservoir and wants to generate power without wasting any farmland.', correct: 'floating', explanation: 'Floatovoltaics (floating solar) save land, reduce water evaporation, and the water naturally cools the panels for 5-10% more efficiency!' },
];

const APPLICATION_TYPES = [
  { id: 'residential', label: '🏠 Residential', color: '#e67e22' },
  { id: 'space', label: '🚀 Space', color: '#8e44ad' },
  { id: 'agriculture', label: '🌾 Agriculture', color: '#27ae60' },
  { id: 'portable', label: '🎒 Portable', color: '#3498db' },
  { id: 'bipv', label: '🏗️ BIPV', color: '#1abc9c' },
  { id: 'transport', label: '🚗 Transport', color: '#e74c3c' },
  { id: 'floating', label: '💧 Floating', color: '#2980b9' },
];

export default function SolarApplicationMatcher() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const current = SCENARIOS[currentIdx];
  const totalCorrect = Object.entries(answers).filter(([id, ans]) => {
    const s = SCENARIOS.find(sc => sc.id === parseInt(id));
    return s && s.correct === ans;
  }).length;

  const handleSelect = (typeId) => {
    if (showResult) return;
    setAnswers(prev => ({ ...prev, [current.id]: typeId }));
    setShowResult(true);
  };

  const handleNext = () => { setShowResult(false); if (currentIdx < SCENARIOS.length - 1) setCurrentIdx(prev => prev + 1); };
  const handlePrev = () => { setShowResult(false); if (currentIdx > 0) setCurrentIdx(prev => prev - 1); };
  const handleReset = () => { setCurrentIdx(0); setAnswers({}); setShowResult(false); };

  const isCorrect = answers[current.id] === current.correct;
  const isAnswered = answers[current.id] !== undefined;
  const allDone = Object.keys(answers).length === SCENARIOS.length;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: '#0a0a1a', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* 3D Earth Scene */}
      <div style={{ width: '320px', flexShrink: 0, position: 'relative' }}>
        <Canvas camera={{ position: [0, 12, 18], fov: 45 }}>
          <ambientLight intensity={0.15} />
          <SolarSystemScene highlightType={current.correct} />
          <OrbitControls enableZoom={true} enablePan={false} maxDistance={25} minDistance={5} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
        <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: '#8b949e', textAlign: 'center', pointerEvents: 'none', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
          🌌 Drag to rotate view • Scroll to zoom
        </div>
      </div>

      {/* Quiz Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderLeft: '2px solid #30363d' }}>
        {/* Header */}
        <div style={{ padding: '14px 20px', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderBottom: '2px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', color: '#FFB800', fontSize: '18px' }}>🌍 Solar Application Matcher</h3>
            <p style={{ margin: 0, color: '#8b949e', fontSize: '12px' }}>Match the scenario to the correct solar application!</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', color: '#8b949e' }}>Score: <strong style={{ color: '#4CAF50' }}>{totalCorrect}</strong>/{SCENARIOS.length}</span>
            <button onClick={handleReset} style={{ padding: '5px 12px', background: '#da3633', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Reset</button>
          </div>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '5px', padding: '10px 20px', justifyContent: 'center', flexShrink: 0 }}>
          {SCENARIOS.map((s, i) => {
            const ans = answers[s.id];
            return (
              <button key={s.id} onClick={() => { setCurrentIdx(i); setShowResult(!!answers[s.id]); }}
                style={{ width: '26px', height: '26px', borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold',
                  background: i === currentIdx ? '#FFB800' : ans ? (ans === s.correct ? '#238636' : '#da3633') : '#30363d',
                  color: i === currentIdx ? '#000' : '#fff', transition: 'all 0.2s' }}>
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 20px 16px', gap: '12px', overflow: 'auto' }}>
          {/* Scenario */}
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '16px', flexShrink: 0 }}>
            <div style={{ fontSize: '10px', color: '#8b949e', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Scenario {currentIdx + 1} of {SCENARIOS.length}</div>
            <p style={{ fontSize: '15px', lineHeight: '1.5', margin: 0 }}>{current.scenario}</p>
          </div>

          {/* Answer Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
            {APPLICATION_TYPES.map(type => {
              const selected = answers[current.id] === type.id;
              const isCorrectAnswer = current.correct === type.id;
              let bg = `${type.color}22`, border = `${type.color}44`;
              if (showResult && isAnswered) {
                if (isCorrectAnswer) { bg = '#23863622'; border = '#238636'; }
                else if (selected && !isCorrect) { bg = '#da363322'; border = '#da3633'; }
              }
              return (
                <button key={type.id} onClick={(e) => { e.stopPropagation(); handleSelect(type.id); }} disabled={isAnswered}
                  style={{ padding: '12px 8px', background: bg, border: `2px solid ${border}`, borderRadius: '10px', color: 'white', cursor: isAnswered ? 'default' : 'pointer', fontSize: '12px', fontWeight: 'bold', transition: 'all 0.2s', opacity: isAnswered && !isCorrectAnswer && !selected ? 0.4 : 1 }}>
                  {type.label}
                  {showResult && isCorrectAnswer && ' ✓'}
                  {showResult && selected && !isCorrect && ' ✗'}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && isAnswered && (
            <div style={{ padding: '12px 14px', borderRadius: '10px', background: isCorrect ? 'rgba(35,134,54,0.15)' : 'rgba(218,54,51,0.15)', border: `1px solid ${isCorrect ? '#238636' : '#da3633'}`, fontSize: '13px', lineHeight: '1.4' }}>
              <strong>{isCorrect ? '✅ Correct!' : '❌ Not quite!'}</strong> {current.explanation}
            </div>
          )}

          {/* Nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', flexShrink: 0 }}>
            <button onClick={handlePrev} disabled={currentIdx === 0} style={{ padding: '7px 16px', background: '#21262d', border: '1px solid #30363d', color: 'white', borderRadius: '8px', cursor: currentIdx === 0 ? 'default' : 'pointer', opacity: currentIdx === 0 ? 0.3 : 1 }}>← Prev</button>
            {allDone && (
              <div style={{ padding: '7px 16px', background: totalCorrect === SCENARIOS.length ? '#238636' : '#FFB800', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px', color: totalCorrect === SCENARIOS.length ? 'white' : '#000' }}>
                {totalCorrect === SCENARIOS.length ? '🏆 Perfect!' : `${totalCorrect}/${SCENARIOS.length}`}
              </div>
            )}
            <button onClick={handleNext} disabled={currentIdx === SCENARIOS.length - 1} style={{ padding: '7px 16px', background: '#238636', border: 'none', color: 'white', borderRadius: '8px', cursor: currentIdx === SCENARIOS.length - 1 ? 'default' : 'pointer', opacity: currentIdx === SCENARIOS.length - 1 ? 0.3 : 1, fontWeight: 'bold' }}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
