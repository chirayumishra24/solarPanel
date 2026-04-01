import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/* ─── 3D Factory Scene ─── */
function FactoryBuilding({ color, scale = 1, position = [0, 0, 0], selected }) {
  const groupRef = useRef();
  useFrame((_, delta) => {
    if (groupRef.current && selected) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main building */}
      <RoundedBox args={[2, 1.5, 1.5]} radius={0.1} position={[0, 0.75, 0]} castShadow>
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.6} />
      </RoundedBox>
      {/* Roof */}
      <Box args={[2.2, 0.15, 1.7]} position={[0, 1.55, 0]} castShadow>
        <meshStandardMaterial color="#333" metalness={0.5} />
      </Box>
      {/* Solar panels on roof */}
      <group position={[0, 1.7, 0]} rotation={[-0.3, 0, 0]}>
        <Box args={[0.6, 0.05, 0.4]} position={[-0.5, 0, 0]} castShadow>
          <meshStandardMaterial color="#1a3b5c" metalness={0.8} roughness={0.2} />
        </Box>
        <Box args={[0.6, 0.05, 0.4]} position={[0.5, 0, 0]} castShadow>
          <meshStandardMaterial color="#1a3b5c" metalness={0.8} roughness={0.2} />
        </Box>
      </group>
      {/* Chimney */}
      <Cylinder args={[0.12, 0.15, 0.6, 8]} position={[0.7, 1.85, -0.4]} castShadow>
        <meshStandardMaterial color="#555" />
      </Cylinder>
      {/* Door */}
      <Box args={[0.4, 0.6, 0.05]} position={[0, 0.3, 0.78]}>
        <meshStandardMaterial color="#8b5a2b" />
      </Box>
      {/* Glow ring when selected */}
      {selected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.4, 1.6, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function FactoryScene({ selectedMfg }) {
  const FACTORY_POSITIONS = [
    { id: 'waaree', pos: [-3, 0, 0], color: '#e67e22' },
    { id: 'adani', pos: [-1.5, 0, -2], color: '#2ecc71' },
    { id: 'reliance', pos: [1.5, 0, -2], color: '#3498db' },
    { id: 'vikram', pos: [3, 0, 0], color: '#9b59b6' },
    { id: 'goldi', pos: [1.5, 0, 2], color: '#f1c40f' },
    { id: 'tata', pos: [-1.5, 0, 2], color: '#1abc9c' },
  ];

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[8, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.3} color="#FFB800" />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {FACTORY_POSITIONS.map(f => (
        <Float key={f.id} speed={selectedMfg === f.id ? 3 : 0} floatIntensity={selectedMfg === f.id ? 0.15 : 0}>
          <FactoryBuilding
            color={f.color}
            position={f.pos}
            scale={selectedMfg === f.id ? 1.15 : 0.85}
            selected={selectedMfg === f.id}
          />
        </Float>
      ))}
      
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} maxPolarAngle={Math.PI / 2.5} minPolarAngle={Math.PI / 4} />
    </>
  );
}

/* ─── Data ─── */
const MANUFACTURERS = [
  { id: 'waaree', name: 'Waaree Energies', logo: '🏭', capacity: '13-15 GW', capacityNum: 14, integration: 'Module + Cell', tech: 'TOPCon, Bifacial', color: '#e67e22', fact: 'India\'s #1 solar module manufacturer and the largest portfolio on the ALMM list.' },
  { id: 'adani', name: 'Adani Solar', logo: '⚡', capacity: '10+ GW', capacityNum: 10, integration: 'Fully Integrated (Ingot to Module)', tech: 'Mono-PERC, TOPCon', color: '#2ecc71', fact: 'Fully vertically integrated — from raw ingot to finished module, all under one roof.' },
  { id: 'reliance', name: 'Reliance (Indosol)', logo: '🔬', capacity: '6 GW', capacityNum: 6, integration: 'Fully Integrated (Quartz to Module)', tech: 'HJT (Heterojunction)', color: '#3498db', fact: 'Uses next-gen HJT technology — the most efficient cell architecture available today.' },
  { id: 'vikram', name: 'Vikram Solar', logo: '🌟', capacity: '9.5 GW', capacityNum: 9.5, integration: 'Module + Cell', tech: 'N-Type TOPCon', color: '#9b59b6', fact: 'A major exporter to Europe with a strong focus on N-Type TOPCon efficiency.' },
  { id: 'goldi', name: 'Goldi Solar', logo: '🥇', capacity: '14 GW', capacityNum: 14, integration: 'Module focused', tech: 'N-type, G12 cells', color: '#f1c40f', fact: 'Uses the largest G12 cell format for maximum power per panel.' },
  { id: 'tata', name: 'Tata Power Solar', logo: '🏢', capacity: '4.5+ GW', capacityNum: 4.5, integration: 'Module + Cell', tech: 'High-efficiency Mono', color: '#1abc9c', fact: 'One of India\'s oldest solar manufacturers with deep EPC experience.' },
];

const CHALLENGES = [
  { id: 1, question: 'Which manufacturer has the HIGHEST production capacity?', answer: 'waaree' },
  { id: 2, question: 'Which company is FULLY integrated from Quartz to Module (the deepest integration)?', answer: 'reliance' },
  { id: 3, question: 'Which manufacturer uses HJT (Heterojunction) technology?', answer: 'reliance' },
  { id: 4, question: 'Which company uses the largest G12 cell format?', answer: 'goldi' },
  { id: 5, question: 'Which is India\'s oldest solar manufacturer with deep EPC experience?', answer: 'tata' },
];

export default function ManufacturerLab() {
  const [mode, setMode] = useState('explore');
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [challengeAnswers, setChallengeAnswers] = useState({});
  const [selectedCard, setSelectedCard] = useState('waaree');
  const [sortBy, setSortBy] = useState('capacityNum');

  const sorted = [...MANUFACTURERS].sort((a, b) => b[sortBy] - a[sortBy]);
  const currentChallenge = CHALLENGES[challengeIdx];
  const challengeCorrect = Object.entries(challengeAnswers).filter(([id, ans]) => {
    const ch = CHALLENGES.find(c => c.id === parseInt(id));
    return ch && ch.answer === ans;
  }).length;

  const handleChallengeAnswer = (mfgId) => {
    if (challengeAnswers[currentChallenge.id]) return;
    setChallengeAnswers(prev => ({ ...prev, [currentChallenge.id]: mfgId }));
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#0d1117', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderBottom: '2px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <h3 style={{ margin: 0, color: '#FFB800', fontSize: '18px' }}>🔬 Manufacturer Comparison Lab</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setMode('explore')} style={{ padding: '5px 12px', background: mode === 'explore' ? '#FFB800' : '#21262d', color: mode === 'explore' ? '#000' : '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>📊 Explore</button>
          <button onClick={() => setMode('challenge')} style={{ padding: '5px 12px', background: mode === 'challenge' ? '#FFB800' : '#21262d', color: mode === 'challenge' ? '#000' : '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>🎯 Challenge</button>
        </div>
      </div>

      {/* Main: 3D left + Panel right */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        
        {/* 3D Factory Scene */}
        <div style={{ width: '340px', flexShrink: 0, position: 'relative' }}>
          <Canvas camera={{ position: [0, 6, 8], fov: 45 }} shadows>
            <FactoryScene selectedMfg={mode === 'explore' ? selectedCard : (challengeAnswers[currentChallenge?.id] || null)} />
          </Canvas>
          <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: '#484f58', pointerEvents: 'none' }}>
            Selected factory glows & floats
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ flex: 1, borderLeft: '2px solid #30363d', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {mode === 'explore' ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px', gap: '10px', overflow: 'auto' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', color: '#8b949e' }}>Sort:</span>
                <button onClick={() => setSortBy('capacityNum')} style={{ padding: '3px 10px', background: sortBy === 'capacityNum' ? '#238636' : '#21262d', color: '#fff', border: '1px solid #30363d', borderRadius: '5px', cursor: 'pointer', fontSize: '10px' }}>Capacity</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                {sorted.map((mfg) => (
                  <div key={mfg.id} onClick={() => setSelectedCard(mfg.id)}
                    style={{ background: selectedCard === mfg.id ? `${mfg.color}22` : '#161b22', border: `2px solid ${selectedCard === mfg.id ? mfg.color : '#30363d'}`, borderRadius: '10px', padding: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{mfg.logo}</span>
                      <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{mfg.name}</span>
                    </div>
                    <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#8b949e' }}>Capacity</span><span style={{ color: '#58a6ff', fontWeight: 'bold' }}>{mfg.capacity}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#8b949e' }}>Tech</span><span>{mfg.tech}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#8b949e' }}>Integration</span><span style={{ fontSize: '10px' }}>{mfg.integration}</span></div>
                    </div>
                    {selectedCard === mfg.id && (
                      <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', fontSize: '11px', color: '#c9d1d9', lineHeight: '1.3' }}>💡 {mfg.fact}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px', gap: '12px', overflow: 'auto' }}>
              <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexShrink: 0 }}>
                {CHALLENGES.map((ch, i) => {
                  const ans = challengeAnswers[ch.id];
                  return (
                    <button key={ch.id} onClick={() => setChallengeIdx(i)}
                      style={{ width: '26px', height: '26px', borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold',
                        background: i === challengeIdx ? '#FFB800' : ans ? (ans === ch.answer ? '#238636' : '#da3633') : '#30363d',
                        color: i === challengeIdx ? '#000' : '#fff' }}>{i + 1}</button>
                  );
                })}
              </div>
              <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '10px', padding: '14px', flexShrink: 0 }}>
                <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.4' }}>{currentChallenge.question}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                {MANUFACTURERS.map(mfg => {
                  const answered = challengeAnswers[currentChallenge.id] !== undefined;
                  const selected = challengeAnswers[currentChallenge.id] === mfg.id;
                  const isCorrectAnswer = currentChallenge.answer === mfg.id;
                  let bg = '#161b22', border = '#30363d';
                  if (answered) {
                    if (isCorrectAnswer) { bg = '#23863622'; border = '#238636'; }
                    else if (selected) { bg = '#da363322'; border = '#da3633'; }
                  }
                  return (
                    <button key={mfg.id} onClick={(e) => { e.stopPropagation(); handleChallengeAnswer(mfg.id); }} disabled={answered}
                      style={{ padding: '12px', background: bg, border: `2px solid ${border}`, borderRadius: '8px', color: 'white', cursor: answered ? 'default' : 'pointer', textAlign: 'center', transition: 'all 0.2s', opacity: answered && !isCorrectAnswer && !selected ? 0.4 : 1 }}>
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>{mfg.logo}</div>
                      <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{mfg.name}</div>
                      {answered && isCorrectAnswer && <div style={{ fontSize: '10px', marginTop: '3px', color: '#4CAF50' }}>✓</div>}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', flexShrink: 0 }}>
                <button onClick={() => setChallengeIdx(prev => Math.max(0, prev - 1))} disabled={challengeIdx === 0}
                  style={{ padding: '6px 14px', background: '#21262d', border: '1px solid #30363d', color: 'white', borderRadius: '6px', cursor: challengeIdx === 0 ? 'default' : 'pointer', opacity: challengeIdx === 0 ? 0.3 : 1 }}>← Prev</button>
                <span style={{ fontSize: '12px', color: '#8b949e', alignSelf: 'center' }}>Score: <strong style={{ color: '#4CAF50' }}>{challengeCorrect}</strong>/{CHALLENGES.length}</span>
                <button onClick={() => setChallengeIdx(prev => Math.min(CHALLENGES.length - 1, prev + 1))} disabled={challengeIdx === CHALLENGES.length - 1}
                  style={{ padding: '6px 14px', background: '#238636', border: 'none', color: 'white', borderRadius: '6px', cursor: challengeIdx === CHALLENGES.length - 1 ? 'default' : 'pointer', opacity: challengeIdx === CHALLENGES.length - 1 ? 0.3 : 1, fontWeight: 'bold' }}>Next →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
