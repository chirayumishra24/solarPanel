import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Float, Plane, Cone } from '@react-three/drei';
import * as THREE from 'three';

/* ─── 3D Tree ─── */
function Tree({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <Cylinder args={[0.08, 0.12, 0.8, 6]} position={[0, 0.4, 0]} castShadow>
        <meshStandardMaterial color="#5D4037" roughness={0.9} />
      </Cylinder>
      <Cone args={[0.5, 1, 8]} position={[0, 1.2, 0]} castShadow>
        <meshStandardMaterial color="#2E7D32" roughness={0.8} />
      </Cone>
      <Cone args={[0.4, 0.8, 8]} position={[0, 1.7, 0]} castShadow>
        <meshStandardMaterial color="#388E3C" roughness={0.8} />
      </Cone>
    </group>
  );
}

/* ─── Neighbor House ─── */
function NeighborHouse({ position = [0, 0, 0], color = '#e0d8cc', roofColor = '#795548' }) {
  return (
    <group position={position}>
      <Box args={[2.5, 1.8, 2.5]} position={[0, 0.9, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} />
      </Box>
      <Box args={[0.5, 1, 0.05]} position={[0, 0.5, 1.26]} receiveShadow>
        <meshStandardMaterial color="#5D4037" />
      </Box>
      <Box args={[0.35, 0.35, 0.05]} position={[-0.7, 1.2, 1.26]}>
        <meshStandardMaterial color="#81D4FA" metalness={0.3} />
      </Box>
      {/* Gabled roof using two angled planes */}
      <group position={[0, 1.8, 0]}>
        <Box args={[2.7, 0.12, 2.7]} position={[0, 0, 0]} castShadow>
          <meshStandardMaterial color={roofColor} />
        </Box>
        <Box args={[2.9, 0.12, 1.5]} position={[0, 0.35, 0]} rotation={[0, 0, 0]} castShadow>
          <meshStandardMaterial color={roofColor} />
        </Box>
        <mesh position={[0, 0.65, 0]} castShadow>
          <coneGeometry args={[1.8, 0.7, 4]} />
          <meshStandardMaterial color={roofColor} />
        </mesh>
      </group>
    </group>
  );
}

/* ─── 3D Colony House with dynamic solar panels ─── */
function SolarHouse({ capacity, isSuccess }) {
  const panelsRef = useRef();
  const sunRef = useRef();

  useFrame((state) => {
    if (sunRef.current) {
      const t = state.clock.elapsedTime * 0.3;
      sunRef.current.position.x = Math.cos(t) * 8;
      sunRef.current.position.y = Math.sin(t) * 4 + 6;
    }
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

  return (
    <group>
      {/* Sky */}
      <color attach="background" args={['#87CEEB']} />
      
      {/* Sun */}
      <group ref={sunRef} position={[5, 7, 2]}>
        <Sphere args={[0.6, 16, 16]}>
          <meshBasicMaterial color="#FFD700" />
        </Sphere>
        <pointLight intensity={1.5} color="#FFD700" distance={25} />
      </group>

      {/* Bright sky hemisphere light */}
      <hemisphereLight skyColor="#87CEEB" groundColor="#4a7c59" intensity={0.6} />

      {/* Main House */}
      <group position={[0, 0, 0]}>
        {/* Walls */}
        <Box args={[4, 2.5, 3.5]} position={[0, 1.25, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#FAFAFA" />
        </Box>
        {/* Door */}
        <Box args={[0.7, 1.4, 0.05]} position={[0, 0.7, 1.76]} receiveShadow>
          <meshStandardMaterial color="#6b4226" />
        </Box>
        {/* Windows */}
        <Box args={[0.5, 0.5, 0.05]} position={[-1.2, 1.5, 1.76]}>
          <meshStandardMaterial color="#81D4FA" metalness={0.3} />
        </Box>
        <Box args={[0.5, 0.5, 0.05]} position={[1.2, 1.5, 1.76]}>
          <meshStandardMaterial color="#81D4FA" metalness={0.3} />
        </Box>

        {/* Proper gabled roof */}
        <group position={[0, 2.5, 0]}>
          {/* Base overhang */}
          <Box args={[4.5, 0.12, 4]} position={[0, 0, 0]} castShadow receiveShadow>
            <meshStandardMaterial color="#B71C1C" />
          </Box>
          {/* Middle tier */}
          <Box args={[3.8, 0.12, 3.2]} position={[0, 0.4, 0]} castShadow>
            <meshStandardMaterial color="#C62828" />
          </Box>
          {/* Ridge / peak */}
          <Box args={[3, 0.12, 2.4]} position={[0, 0.75, 0]} castShadow>
            <meshStandardMaterial color="#D32F2F" />
          </Box>
          {/* Top cap */}
          <Box args={[2, 0.12, 1.4]} position={[0, 1.05, 0]} castShadow>
            <meshStandardMaterial color="#E53935" />
          </Box>
          {/* Ridge line */}
          <Box args={[0.8, 0.1, 0.6]} position={[0, 1.3, 0]} castShadow>
            <meshStandardMaterial color="#EF5350" />
          </Box>
        </group>

        {/* Solar Panels on roof */}
        <group ref={panelsRef} position={[0, 3.2, 0.6]} rotation={[0.35, 0, 0]}>
          {panels.map((p, i) => (
            <group key={i} position={[p.x, p.baseY, p.z]} userData={{ baseY: p.baseY }}>
              <Box args={[0.8, 0.06, 0.55]} castShadow>
                <meshStandardMaterial
                  color={isSuccess ? '#2196F3' : '#1a3b5c'}
                  metalness={0.85}
                  roughness={0.15}
                  emissive={isSuccess ? '#2196F3' : '#000'}
                  emissiveIntensity={isSuccess ? 0.3 : 0}
                />
              </Box>
              <Box args={[0.8, 0.061, 0.01]} position={[0, 0.001, 0]}>
                <meshBasicMaterial color="#0a1929" />
              </Box>
              <Box args={[0.01, 0.061, 0.55]} position={[0, 0.001, 0]}>
                <meshBasicMaterial color="#0a1929" />
              </Box>
            </group>
          ))}
        </group>
      </group>

      {/* ═══ COLONY ENVIRONMENT ═══ */}

      {/* Ground - bright green grass */}
      <Plane args={[60, 60]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <meshStandardMaterial color="#4CAF50" roughness={0.9} />
      </Plane>

      {/* Road in front of house */}
      <Box args={[40, 0.03, 3]} position={[0, 0, 4.5]} receiveShadow>
        <meshStandardMaterial color="#607D8B" roughness={0.8} />
      </Box>
      {/* Road center line */}
      <Box args={[40, 0.04, 0.15]} position={[0, 0.01, 4.5]}>
        <meshStandardMaterial color="#FFD54F" />
      </Box>
      {/* Sidewalk */}
      <Box args={[40, 0.02, 1]} position={[0, 0, 2.8]} receiveShadow>
        <meshStandardMaterial color="#BDBDBD" roughness={0.7} />
      </Box>

      {/* Neighbor Houses */}
      <NeighborHouse position={[-6, 0, 0]} color="#FFF3E0" roofColor="#795548" />
      <NeighborHouse position={[6, 0, 0]} color="#E3F2FD" roofColor="#455A64" />
      <NeighborHouse position={[-6, 0, 8]} color="#F3E5F5" roofColor="#6D4C41" />
      <NeighborHouse position={[0, 0, 9]} color="#E8F5E9" roofColor="#5D4037" />
      <NeighborHouse position={[6, 0, 8]} color="#FFF8E1" roofColor="#607D8B" />

      {/* Trees */}
      <Tree position={[-3.5, 0, 2]} scale={1.2} />
      <Tree position={[3.5, 0, 2]} scale={1} />
      <Tree position={[-8, 0, 3]} scale={0.9} />
      <Tree position={[8, 0, 3]} scale={1.1} />
      <Tree position={[-5, 0, 7]} scale={0.8} />
      <Tree position={[5, 0, 7]} scale={1} />
      <Tree position={[0, 0, -3]} scale={1.3} />
      <Tree position={[-9, 0, -2]} scale={1} />
      <Tree position={[9, 0, -2]} scale={0.9} />

      {/* Garden fence around main house */}
      {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((x, i) => (
        <group key={`fence-${i}`} position={[x, 0, 2.3]}>
          <Cylinder args={[0.03, 0.03, 0.6, 4]} position={[0, 0.3, 0]} castShadow>
            <meshStandardMaterial color="#8D6E63" />
          </Cylinder>
        </group>
      ))}
      <Box args={[5.5, 0.05, 0.05]} position={[0, 0.5, 2.3]}>
        <meshStandardMaterial color="#8D6E63" />
      </Box>
      <Box args={[5.5, 0.05, 0.05]} position={[0, 0.25, 2.3]}>
        <meshStandardMaterial color="#8D6E63" />
      </Box>

      {/* Money pile when success */}
      {isSuccess && (
        <Float speed={3} floatIntensity={0.3}>
          <group position={[3, 1, 2]}>
            {[0, 0.15, 0.3].map((y, i) => (
              <Cylinder key={i} args={[0.25, 0.25, 0.12, 16]} position={[0, y, 0]}>
                <meshStandardMaterial color="#4CAF50" metalness={0.6} />
              </Cylinder>
            ))}
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

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#0d1117', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderBottom: '2px solid #30363d', flexShrink: 0 }}>
        <h3 style={{ margin: '0 0 4px 0', color: '#FFB800', fontSize: '18px' }}>💰 Subsidy Calculator</h3>
        <p style={{ margin: 0, color: '#8b949e', fontSize: '12px' }}>See how much government subsidy YOU would get!</p>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        
        {/* 3D Colony House */}
        <div style={{ width: '340px', flexShrink: 0, position: 'relative' }}>
          <Canvas camera={{ position: [5, 4, 8], fov: 40 }} shadows>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
            <SolarHouse capacity={capacity} isSuccess={isSuccess} />
            <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 5} />
          </Canvas>
          <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', padding: '6px 10px', borderRadius: '6px', fontSize: '11px' }}>
            {capacity} kW → {capacity} panel{capacity > 1 ? 's' : ''} on roof
          </div>
        </div>

        {/* Controls + Results */}
        <div style={{ flex: 1, display: 'flex', borderLeft: '2px solid #30363d', minWidth: 0 }}>
          
          {/* Left: Inputs */}
          <div style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
            
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
          <div style={{ width: '220px', background: '#161b22', borderLeft: '2px solid #30363d', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0, overflowY: 'auto', zIndex: 5 }}>
            <div style={{ fontSize: '10px', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '1px' }}>Breakdown</div>

            <div style={{ background: '#21262d', borderRadius: '8px', padding: '12px', border: '1px solid #30363d' }}>
              <div style={{ fontSize: '10px', color: '#8b949e', marginBottom: '3px' }}>Central (PM Surya Ghar)</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#4CAF50' }}>₹{centralSubsidy.toLocaleString()}</div>
              {capacity >= 3 && <div style={{ fontSize: '9px', color: '#f0883e', marginTop: '3px' }}>⚠️ Capped at ₹78,000</div>}
            </div>

            <div style={{ background: '#21262d', borderRadius: '8px', padding: '12px', border: '1px solid #30363d' }}>
              <div style={{ fontSize: '10px', color: '#8b949e', marginBottom: '3px' }}>State Top-up</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: stateTopUp > 0 ? '#58a6ff' : '#484f58' }}>{stateTopUp > 0 ? `₹${stateTopUp.toLocaleString()}` : '₹0'}</div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #238636 0%, #2ea043 100%)', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '10px', opacity: 0.8, marginBottom: '3px' }}>Total Subsidy</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>₹{totalSubsidy.toLocaleString()}</div>
            </div>

            <div style={{ height: '1px', background: '#30363d' }} />

            <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
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
