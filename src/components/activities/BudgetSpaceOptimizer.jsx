import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Cone } from '@react-three/drei';

/* ─── 3D Roof Scene ─── */
function RoofScene({ monoCount, polyCount }) {
  const placedPanels = [];

  // Grid positions on roof — 2 rows x 3 columns of unit slots
  const slotPositions = [
    { x: -1.2, z: -0.4 },
    { x: 0,    z: -0.4 },
    { x: 1.2,  z: -0.4 },
    { x: -1.2, z: 0.6 },
    { x: 0,    z: 0.6 },
    { x: 1.2,  z: 0.6 },
  ];

  let slotIdx = 0;

  // Place Poly panels first (each takes 2 adjacent slots visually)
  for (let i = 0; i < polyCount && slotIdx < slotPositions.length - 1; i++) {
    const s1 = slotPositions[slotIdx];
    const s2 = slotPositions[slotIdx + 1];
    placedPanels.push({
      type: 'poly',
      x: (s1.x + s2.x) / 2,
      z: s1.z,
    });
    slotIdx += 2;
  }

  // Place Mono panels (each takes 1 slot)
  for (let i = 0; i < monoCount && slotIdx < slotPositions.length; i++) {
    const s = slotPositions[slotIdx];
    placedPanels.push({ type: 'mono', x: s.x, z: s.z });
    slotIdx += 1;
  }

  return (
    <group position={[0, -1.5, 0]}>
      {/* House body */}
      <Box args={[5, 2.5, 4]} position={[0, 1.25, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#e8e4de" />
      </Box>
      {/* Door */}
      <Box args={[0.8, 1.6, 0.1]} position={[0, 0.8, 2.01]} receiveShadow>
        <meshStandardMaterial color="#6b4226" />
      </Box>
      {/* Roof */}
      <Cone args={[4.2, 2.2, 4]} position={[0, 3.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#8b3a3a" />
      </Cone>

      {/* Slot grid indicators */}
      <group position={[0, 4.2, 0.8]} rotation={[0.55, 0, 0]}>
        {slotPositions.map((s, i) => (
          <Box key={`slot-${i}`} args={[1, 0.02, 0.85]} position={[s.x, 0, s.z]}>
            <meshStandardMaterial color="#555" transparent opacity={0.3} />
          </Box>
        ))}

        {/* Placed panels */}
        {placedPanels.map((panel, i) => (
          panel.type === 'poly' ? (
            <group key={`panel-${i}`} position={[panel.x, 0.08, panel.z]}>
              <Box args={[2.2, 0.1, 0.8]} castShadow>
                <meshStandardMaterial color="#3498db" metalness={0.6} roughness={0.25} />
              </Box>
              {/* Grid lines on poly panel */}
              <Box args={[2.2, 0.11, 0.02]} position={[0, 0.01, 0]}>
                <meshBasicMaterial color="#2980b9" />
              </Box>
              <Box args={[0.02, 0.11, 0.8]} position={[0, 0.01, 0]}>
                <meshBasicMaterial color="#2980b9" />
              </Box>
            </group>
          ) : (
            <group key={`panel-${i}`} position={[panel.x, 0.08, panel.z]}>
              <Box args={[1, 0.1, 0.8]} castShadow>
                <meshStandardMaterial color="#1a2a3a" metalness={0.85} roughness={0.15} />
              </Box>
              {/* Grid lines on mono panel */}
              <Box args={[1, 0.11, 0.02]} position={[0, 0.01, 0]}>
                <meshBasicMaterial color="#0f1a2a" />
              </Box>
              <Box args={[0.02, 0.11, 0.8]} position={[0, 0.01, 0]}>
                <meshBasicMaterial color="#0f1a2a" />
              </Box>
            </group>
          )
        ))}
      </group>
    </group>
  );
}

/* ─── Main Component ─── */
export default function BudgetSpaceOptimizer() {
  const [monoCount, setMonoCount] = useState(0);
  const [polyCount, setPolyCount] = useState(0);

  const MONO_POWER = 4, MONO_COST = 1000, MONO_SPACE = 1;
  const POLY_POWER = 6, POLY_COST = 800, POLY_SPACE = 2;
  const MAX_SPACE = 6, GOAL_POWER = 20, MAX_BUDGET = 4000;

  const currentPower = (monoCount * MONO_POWER) + (polyCount * POLY_POWER);
  const currentCost = (monoCount * MONO_COST) + (polyCount * POLY_COST);
  const currentSpace = (monoCount * MONO_SPACE) + (polyCount * POLY_SPACE);

  const isSuccess = currentPower >= GOAL_POWER && currentCost <= MAX_BUDGET && currentSpace <= MAX_SPACE;

  const canAddMono = (monoCount + 1) * MONO_SPACE + polyCount * POLY_SPACE <= MAX_SPACE;
  const canAddPoly = monoCount * MONO_SPACE + (polyCount + 1) * POLY_SPACE <= MAX_SPACE;

  const reset = () => { setMonoCount(0); setPolyCount(0); };

  /* Progress bars */
  const powerPct = Math.min(100, (currentPower / GOAL_POWER) * 100);
  const costPct = Math.min(100, (currentCost / MAX_BUDGET) * 100);
  const spacePct = Math.min(100, (currentSpace / MAX_SPACE) * 100);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#0d1117', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ padding: '14px 20px', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderBottom: '2px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', color: '#FFB800', fontSize: '18px' }}>🏠 Roof Space Optimizer</h3>
          <p style={{ margin: 0, color: '#8b949e', fontSize: '13px' }}>
            Place panels on the roof to hit {GOAL_POWER}kW within your ${MAX_BUDGET} budget!
          </p>
        </div>
        <button onClick={reset} style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #da3633 0%, #b62324 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
          🔄 Reset
        </button>
      </div>

      {/* Main area: 3D left + controls right */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        
        {/* 3D Viewport */}
        <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <Canvas camera={{ position: [0, 7, 9], fov: 40 }} style={{ background: '#0d1117' }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[8, 10, 5]} intensity={1.2} castShadow />
            <RoofScene monoCount={monoCount} polyCount={polyCount} />
            <OrbitControls makeDefault enablePan={false} minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.2} minDistance={8} maxDistance={18} />
          </Canvas>
          
          {isSuccess && (
            <div style={{ 
              position: 'absolute', top: '15px', left: '50%', transform: 'translateX(-50%)', 
              background: 'linear-gradient(135deg, #238636 0%, #2ea043 100%)', 
              padding: '10px 24px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px',
              boxShadow: '0 4px 20px rgba(46, 160, 67, 0.5)', animation: 'slideDown 0.5s ease', zIndex: 10
            }}>
              🎯 Mission Accomplished! 🎯
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div style={{ width: '280px', background: '#161b22', padding: '16px', borderLeft: '2px solid #30363d', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flexShrink: 0, zIndex: 5 }}>
          
          {/* Goals Dashboard */}
          <div style={{ background: '#21262d', padding: '14px', borderRadius: '12px', border: '1px solid #30363d' }}>
            <h4 style={{ margin: '0 0 12px 0', textTransform: 'uppercase', fontSize: '11px', color: '#8b949e', letterSpacing: '1px' }}>Mission Goals</h4>
            
            {/* Power */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span>⚡ Power ≥ {GOAL_POWER}kW</span>
                <span style={{ color: currentPower >= GOAL_POWER ? '#4CAF50' : '#f85149', fontWeight: 'bold' }}>{currentPower}kW</span>
              </div>
              <div style={{ height: '6px', background: '#30363d', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${powerPct}%`, background: currentPower >= GOAL_POWER ? '#4CAF50' : '#FFB800', transition: 'all 0.3s', borderRadius: '3px' }} />
              </div>
            </div>

            {/* Budget */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span>💰 Budget ≤ ${MAX_BUDGET}</span>
                <span style={{ color: currentCost <= MAX_BUDGET ? '#4CAF50' : '#f85149', fontWeight: 'bold' }}>${currentCost}</span>
              </div>
              <div style={{ height: '6px', background: '#30363d', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${costPct}%`, background: currentCost <= MAX_BUDGET ? '#4CAF50' : '#f85149', transition: 'all 0.3s', borderRadius: '3px' }} />
              </div>
            </div>

            {/* Space */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span>📐 Space ≤ {MAX_SPACE} slots</span>
                <span style={{ color: currentSpace <= MAX_SPACE ? '#4CAF50' : '#f85149', fontWeight: 'bold' }}>{currentSpace}/{MAX_SPACE}</span>
              </div>
              <div style={{ height: '6px', background: '#30363d', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${spacePct}%`, background: currentSpace <= MAX_SPACE ? '#4CAF50' : '#f85149', transition: 'all 0.3s', borderRadius: '3px' }} />
              </div>
            </div>
          </div>

          {/* Monocrystalline Card */}
          <div style={{ background: 'rgba(26, 42, 58, 0.5)', padding: '14px', borderRadius: '12px', border: '1px solid #1a3b5c' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '3px', background: '#1a2a3a' }} />
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Monocrystalline</span>
            </div>
            <div style={{ fontSize: '11px', color: '#8b949e', marginBottom: '12px' }}>
              ⚡ {MONO_POWER}kW &nbsp;|&nbsp; 💰 ${MONO_COST} &nbsp;|&nbsp; 📐 {MONO_SPACE} slot
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); setMonoCount(prev => Math.max(0, prev - 1)); }}
                disabled={monoCount === 0}
                style={{ width: '40px', height: '40px', background: monoCount === 0 ? '#21262d' : '#30363d', border: 'none', color: 'white', borderRadius: '8px', cursor: monoCount === 0 ? 'default' : 'pointer', fontSize: '20px', fontWeight: 'bold', opacity: monoCount === 0 ? 0.3 : 1, transition: 'all 0.2s' }}
              >−</button>
              <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#58a6ff' }}>{monoCount}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); if (canAddMono) setMonoCount(prev => prev + 1); }}
                disabled={!canAddMono}
                style={{ width: '40px', height: '40px', background: !canAddMono ? '#21262d' : '#238636', border: 'none', color: 'white', borderRadius: '8px', cursor: !canAddMono ? 'default' : 'pointer', fontSize: '20px', fontWeight: 'bold', opacity: !canAddMono ? 0.3 : 1, transition: 'all 0.2s' }}
              >+</button>
            </div>
          </div>

          {/* Polycrystalline Card */}
          <div style={{ background: 'rgba(52, 152, 219, 0.1)', padding: '14px', borderRadius: '12px', border: '1px solid #2980b9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '3px', background: '#3498db' }} />
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Polycrystalline</span>
            </div>
            <div style={{ fontSize: '11px', color: '#8b949e', marginBottom: '12px' }}>
              ⚡ {POLY_POWER}kW &nbsp;|&nbsp; 💰 ${POLY_COST} &nbsp;|&nbsp; 📐 {POLY_SPACE} slots
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); setPolyCount(prev => Math.max(0, prev - 1)); }}
                disabled={polyCount === 0}
                style={{ width: '40px', height: '40px', background: polyCount === 0 ? '#21262d' : '#30363d', border: 'none', color: 'white', borderRadius: '8px', cursor: polyCount === 0 ? 'default' : 'pointer', fontSize: '20px', fontWeight: 'bold', opacity: polyCount === 0 ? 0.3 : 1, transition: 'all 0.2s' }}
              >−</button>
              <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#58a6ff' }}>{polyCount}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); if (canAddPoly) setPolyCount(prev => prev + 1); }}
                disabled={!canAddPoly}
                style={{ width: '40px', height: '40px', background: !canAddPoly ? '#21262d' : '#238636', border: 'none', color: 'white', borderRadius: '8px', cursor: !canAddPoly ? 'default' : 'pointer', fontSize: '20px', fontWeight: 'bold', opacity: !canAddPoly ? 0.3 : 1, transition: 'all 0.2s' }}
              >+</button>
            </div>
          </div>

          {/* Hint */}
          <div style={{ fontSize: '11px', color: '#484f58', textAlign: 'center', padding: '8px', fontStyle: 'italic' }}>
            💡 Hint: Try mixing both panel types to balance cost and space!
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -15px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
