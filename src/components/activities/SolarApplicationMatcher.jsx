import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Cylinder, Torus, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ─── 3D Scene: A spinning globe with location markers ─── */
function Globe({ highlightType }) {
  const globeRef = useRef();
  const markersRef = useRef();

  useFrame((_, delta) => {
    if (globeRef.current) globeRef.current.rotation.y += delta * 0.15;
    if (markersRef.current) markersRef.current.rotation.y += delta * 0.15;
  });

  // Marker positions on sphere for each application type
  const markers = [
    { type: 'residential', pos: [0, 1.8, 0.8], color: '#e67e22', label: '🏠' },
    { type: 'space', pos: [0, 3.2, 0], color: '#8e44ad', label: '🚀' },
    { type: 'agriculture', pos: [1.2, 0.5, 1.4], color: '#27ae60', label: '🌾' },
    { type: 'portable', pos: [-1.5, 1, 0.8], color: '#3498db', label: '🎒' },
    { type: 'bipv', pos: [0.8, 1.5, -1.2], color: '#1abc9c', label: '🏗️' },
    { type: 'transport', pos: [-0.5, -0.3, 1.8], color: '#e74c3c', label: '🚗' },
    { type: 'floating', pos: [-1, -1, 1.2], color: '#2980b9', label: '💧' },
  ];

  return (
    <group>
      {/* Earth-like globe */}
      <group ref={globeRef}>
        <Sphere args={[2, 32, 32]}>
          <MeshDistortMaterial color="#1a5276" roughness={0.8} metalness={0.1} distort={0.05} speed={2} />
        </Sphere>
        {/* Continents (simplified shapes) */}
        <Sphere args={[2.02, 16, 16]} rotation={[0.3, 0.5, 0]}>
          <meshStandardMaterial color="#27ae60" wireframe transparent opacity={0.4} />
        </Sphere>
      </group>

      {/* Location Markers */}
      <group ref={markersRef}>
        {markers.map((m) => (
          <group key={m.type} position={m.pos}>
            <Float speed={3} floatIntensity={0.3}>
              <Sphere args={[highlightType === m.type ? 0.22 : 0.12, 16, 16]}>
                <meshStandardMaterial
                  color={m.color}
                  emissive={m.color}
                  emissiveIntensity={highlightType === m.type ? 1.5 : 0.3}
                />
              </Sphere>
              {highlightType === m.type && (
                <Torus args={[0.35, 0.03, 8, 32]} rotation={[Math.PI / 2, 0, 0]}>
                  <meshBasicMaterial color={m.color} transparent opacity={0.6} />
                </Torus>
              )}
            </Float>
          </group>
        ))}
      </group>

      {/* Orbiting satellite for space */}
      <Float speed={2} floatIntensity={0.5}>
        <group position={[0, 3.5, 0]}>
          <Box args={[0.15, 0.08, 0.15]}>
            <meshStandardMaterial color="#ccc" metalness={0.8} />
          </Box>
          <Box args={[0.6, 0.02, 0.2]} position={[0.35, 0, 0]}>
            <meshStandardMaterial color="#1a3b5c" metalness={0.5} />
          </Box>
          <Box args={[0.6, 0.02, 0.2]} position={[-0.35, 0, 0]}>
            <meshStandardMaterial color="#1a3b5c" metalness={0.5} />
          </Box>
        </group>
      </Float>
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
    <div style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: '#0d1117', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* 3D Globe */}
      <div style={{ width: '320px', flexShrink: 0, position: 'relative' }}>
        <Canvas camera={{ position: [0, 2, 6], fov: 40 }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[-3, 2, 4]} intensity={0.5} color="#FFB800" />
          <Globe highlightType={current.correct} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
        <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: '#484f58', textAlign: 'center', pointerEvents: 'none' }}>
          Drag to rotate the globe
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
