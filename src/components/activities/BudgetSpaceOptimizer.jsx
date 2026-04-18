import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Cone } from '@react-three/drei';

/* ─── 3D Roof Scene ─── */
function RoofScene({ monoCount, polyCount }) {
  const placedPanels = [];

  const slotPositions = [
    { x: -1.2, z: -0.4 },
    { x: 0,    z: -0.4 },
    { x: 1.2,  z: -0.4 },
    { x: -1.2, z: 0.6 },
    { x: 0,    z: 0.6 },
    { x: 1.2,  z: 0.6 },
  ];

  let slotIdx = 0;

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

  for (let i = 0; i < monoCount && slotIdx < slotPositions.length; i++) {
    const s = slotPositions[slotIdx];
    placedPanels.push({ type: 'mono', x: s.x, z: s.z });
    slotIdx += 1;
  }

  return (
    <group position={[0, -1.5, 0]}>
      <Box args={[5, 2.5, 4]} position={[0, 1.25, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#e8e4de" />
      </Box>
      <Box args={[0.8, 1.6, 0.1]} position={[0, 0.8, 2.01]} receiveShadow>
        <meshStandardMaterial color="#6b4226" />
      </Box>
      <Cone args={[4.2, 2.2, 4]} position={[0, 3.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#8b3a3a" />
      </Cone>

      <group position={[0, 4.2, 0.8]} rotation={[0.55, 0, 0]}>
        {slotPositions.map((s, i) => (
          <Box key={`slot-${i}`} args={[1, 0.02, 0.85]} position={[s.x, 0, s.z]}>
            <meshStandardMaterial color="#555" transparent opacity={0.3} />
          </Box>
        ))}

        {placedPanels.map((panel, i) => (
          panel.type === 'poly' ? (
            <group key={`panel-${i}`} position={[panel.x, 0.08, panel.z]}>
              <Box args={[2.2, 0.1, 0.8]} castShadow>
                <meshStandardMaterial color="#3498db" metalness={0.6} roughness={0.25} />
              </Box>
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

/* ─── Solar Man Success Popup ─── */
function SolarManSuccessPopup({ power, cost, mono, poly, onClose }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', animation: 'fadeInSM 0.4s ease'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '20px', border: '3px solid #4CAF50',
        maxWidth: '460px', width: '100%', padding: '28px',
        boxShadow: '0 0 60px rgba(76,175,80,0.25)',
        animation: 'popInSM 0.5s cubic-bezier(0.175,0.885,0.32,1.275)'
      }}>
        {/* Solar Man Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            border: '3px solid #4CAF50', overflow: 'hidden', flexShrink: 0,
            background: 'linear-gradient(135deg, #FFB800, #FF6B00)',
            boxShadow: '0 0 20px rgba(76,175,80,0.4)'
          }}>
            <img src="/images/solar-man.png" alt="Solar Man" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#4CAF50', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Solar Man Says</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff' }}>🎉 Congratulations!</div>
          </div>
        </div>

        {/* Trophy */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '48px' }}>🏆</div>
          <div style={{ fontSize: '16px', color: '#4CAF50', fontWeight: 'bold', marginTop: '6px' }}>
            Mission Accomplished!
          </div>
          <div style={{ fontSize: '13px', color: '#8b949e', marginTop: '4px' }}>
            You found the perfect panel combination!
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.3)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#8b949e', marginBottom: '3px' }}>POWER</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4CAF50' }}>{power}kW</div>
          </div>
          <div style={{ background: 'rgba(88,166,255,0.1)', border: '1px solid rgba(88,166,255,0.3)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#8b949e', marginBottom: '3px' }}>COST</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#58a6ff' }}>${cost}</div>
          </div>
          <div style={{ background: 'rgba(26,42,58,0.3)', border: '1px solid rgba(26,42,58,0.5)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#8b949e', marginBottom: '3px' }}>MONO</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>{mono}</div>
          </div>
          <div style={{ background: 'rgba(52,152,219,0.1)', border: '1px solid rgba(52,152,219,0.3)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#8b949e', marginBottom: '3px' }}>POLY</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3498db' }}>{poly}</div>
          </div>
        </div>

        <button onClick={onClose} style={{
          display: 'block', width: '100%', padding: '14px',
          border: 'none', borderRadius: '12px',
          background: 'linear-gradient(135deg, #4CAF50 0%, #2ea043 100%)',
          color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(76,175,80,0.3)'
        }}>
          🔙 Continue Exploring
        </button>
      </div>
      <style>{`
        @keyframes fadeInSM { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popInSM { 0% { transform: scale(0.8) translateY(20px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}

/* ─── Main Component ─── */
export default function BudgetSpaceOptimizer() {
  const [monoCount, setMonoCount] = useState(0);
  const [polyCount, setPolyCount] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);

  const MONO_POWER = 4, MONO_COST = 1000, MONO_SPACE = 1;
  const POLY_POWER = 6, POLY_COST = 800, POLY_SPACE = 2;
  const MAX_SPACE = 6, GOAL_POWER = 20, MAX_BUDGET = 4000;

  const currentPower = (monoCount * MONO_POWER) + (polyCount * POLY_POWER);
  const currentCost = (monoCount * MONO_COST) + (polyCount * POLY_COST);
  const currentSpace = (monoCount * MONO_SPACE) + (polyCount * POLY_SPACE);

  const isSuccess = currentPower >= GOAL_POWER && currentCost <= MAX_BUDGET && currentSpace <= MAX_SPACE;

  // Trigger success popup
  if (isSuccess && !hasShownPopup) {
    setHasShownPopup(true);
    setTimeout(() => setShowSuccessPopup(true), 600);
  }

  const canAddMono = (monoCount + 1) * MONO_SPACE + polyCount * POLY_SPACE <= MAX_SPACE;
  const canAddPoly = monoCount * MONO_SPACE + (polyCount + 1) * POLY_SPACE <= MAX_SPACE;

  const reset = () => { setMonoCount(0); setPolyCount(0); setShowSuccessPopup(false); setHasShownPopup(false); };

  const powerPct = Math.min(100, (currentPower / GOAL_POWER) * 100);
  const costPct = Math.min(100, (currentCost / MAX_BUDGET) * 100);
  const spacePct = Math.min(100, (currentSpace / MAX_SPACE) * 100);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#0d1117', color: 'white', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* Header with Activity Aim */}
      <div style={{ padding: '12px 16px', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderBottom: '2px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ flex: '1 1 200px', minWidth: 0 }}>
          <h3 style={{ margin: '0 0 4px 0', color: '#FFB800', fontSize: 'clamp(14px, 3.5vw, 18px)' }}>🏠 Roof Space Optimizer</h3>
          <p style={{ margin: 0, color: '#8b949e', fontSize: 'clamp(11px, 2.5vw, 13px)' }}>
            Place panels on the roof to hit {GOAL_POWER}kW within your ${MAX_BUDGET} budget!
          </p>
        </div>
        <button onClick={reset} style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #da3633 0%, #b62324 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
          🔄 Reset
        </button>
      </div>

      {/* Activity Aim Banner */}
      <div style={{
        padding: '10px 20px', background: 'rgba(255,184,0,0.08)',
        borderBottom: '1px solid rgba(255,184,0,0.2)', flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: '10px'
      }}>
        <span style={{ fontSize: '16px' }}>🎯</span>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#FFB800', textTransform: 'uppercase', letterSpacing: '1px' }}>AIM: </span>
          <span style={{ fontSize: '12px', color: '#c9d1d9' }}>
            Choose the right combination of Monocrystalline & Polycrystalline panels to achieve <strong style={{ color: '#4CAF50' }}>{GOAL_POWER}kW power</strong> within <strong style={{ color: '#58a6ff' }}>${MAX_BUDGET} budget</strong> using only <strong style={{ color: '#f0883e' }}>{MAX_SPACE} roof slots</strong>.
          </span>
        </div>
      </div>

      {/* Main area: 3D left + controls right — stacks on mobile */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, flexWrap: 'wrap' }}>
        
        {/* 3D Viewport */}
        <div style={{ flex: '1 1 300px', position: 'relative', minWidth: 0, minHeight: '250px' }}>
          <Canvas camera={{ position: [0, 7, 9], fov: 40 }} style={{ background: '#0d1117' }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[8, 10, 5]} intensity={1.2} castShadow />
            <RoofScene monoCount={monoCount} polyCount={polyCount} />
            <OrbitControls makeDefault enablePan={false} minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.2} minDistance={8} maxDistance={18} />
          </Canvas>
          
          {isSuccess && !showSuccessPopup && (
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
        <div style={{ width: '100%', maxWidth: '280px', flex: '0 0 auto', background: '#161b22', padding: '14px', borderLeft: '2px solid #30363d', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', zIndex: 5 }}>
          
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
                onClick={(e) => { e.stopPropagation(); setMonoCount(prev => Math.max(0, prev - 1)); setHasShownPopup(false); }}
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
                onClick={(e) => { e.stopPropagation(); setPolyCount(prev => Math.max(0, prev - 1)); setHasShownPopup(false); }}
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

      {/* Solar Man Success Popup */}
      {showSuccessPopup && (
        <SolarManSuccessPopup
          power={currentPower}
          cost={currentCost}
          mono={monoCount}
          poly={polyCount}
          onClose={() => setShowSuccessPopup(false)}
        />
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -15px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
