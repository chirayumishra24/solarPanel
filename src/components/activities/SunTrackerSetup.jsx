import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cone, Sphere, Plane } from '@react-three/drei';
import * as THREE from 'three';

/* ─── 3D House with Panel ─── */
function House({ panelTilt, panelPan, sunPosition, setEfficiency }) {
  const panelRef = useRef();
  
  useFrame(() => {
    if (panelRef.current) {
      const panelNormal = new THREE.Vector3(0, 1, 0);
      panelNormal.applyEuler(panelRef.current.rotation);
      const sunDir = new THREE.Vector3().copy(sunPosition).normalize();
      const dot = panelNormal.dot(sunDir);
      const eff = Math.max(0, dot) * 100;
      setEfficiency(eff);
    }
  });

  return (
    <group position={[0, -1, 0]}>
      <Box args={[4, 3, 4]} position={[0, 1.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f0efe9" />
      </Box>
      <Box args={[1, 2, 0.1]} position={[0, 1, 2.01]} receiveShadow>
        <meshStandardMaterial color="#8b5a2b" />
      </Box>
      <Cone args={[3.5, 2, 4]} position={[0, 4, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#a04040" />
      </Cone>
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
  const sunPosition = useMemo(() => {
    const angle = ((timeOfDay - 6) / 12) * Math.PI;
    const radius = 15;
    const x = Math.cos(angle) * radius;
    const y = Math.max(Math.sin(angle) * radius, -2);
    const z = 2;
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

/* ─── Solar Man Overlay Component ─── */
function SolarManOverlay({ title, children, onClose, closeLabel = 'Continue' }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.4s ease'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '20px', border: '3px solid #FFB800',
        maxWidth: '520px', width: '100%', padding: '28px',
        boxShadow: '0 0 60px rgba(255,184,0,0.25)',
        animation: 'popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275)'
      }}>
        {/* Solar Man Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            border: '3px solid #FFB800', overflow: 'hidden', flexShrink: 0,
            background: 'linear-gradient(135deg, #FFB800, #FF6B00)',
            boxShadow: '0 0 20px rgba(255,184,0,0.4)'
          }}>
            <img src="/images/solar-man.png" alt="Solar Man" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#FFB800', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Solar Man Says</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>{title}</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.6' }}>
          {children}
        </div>

        {/* Close Button */}
        {onClose && (
          <button onClick={onClose} style={{
            display: 'block', width: '100%', marginTop: '20px',
            padding: '14px', border: 'none', borderRadius: '12px',
            background: 'linear-gradient(135deg, #FFB800 0%, #FF8A00 100%)',
            color: '#000', fontWeight: 'bold', fontSize: '16px',
            cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 15px rgba(255,184,0,0.3)',
          }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {closeLabel}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Quiz Questions ─── */
const QUIZ_QUESTIONS = [
  {
    question: 'At what time of day does the solar panel produce the MOST energy?',
    options: ['6:00 AM (Sunrise)', '12:00 PM (Noon)', '6:00 PM (Sunset)', '3:00 AM (Night)'],
    correct: 1,
    explanation: 'At noon (12 PM), the sun is directly overhead, so the panel receives maximum sunlight and produces the most energy!'
  },
  {
    question: 'What happens to energy output when the panel faces AWAY from the sun?',
    options: ['It stays the same', 'It increases', 'It drops to nearly 0%', 'The panel breaks'],
    correct: 2,
    explanation: 'When the panel faces away from the sun, it cannot absorb photons, so energy output drops to nearly 0%. Alignment is crucial!'
  }
];

export default function SunTrackerSetup() {
  const [timeOfDay, setTimeOfDay] = useState(12);
  const [panelTilt, setPanelTilt] = useState(Math.PI / 4);
  const [panelPan, setPanelPan] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [peakEfficiency, setPeakEfficiency] = useState(0);

  // Overlay states
  const [showStartOverlay, setShowStartOverlay] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showCongrats, setShowCongrats] = useState(false);
  const [hasTriggeredQuiz, setHasTriggeredQuiz] = useState(false);

  // Track peak efficiency
  if (efficiency > peakEfficiency) {
    setPeakEfficiency(efficiency);
  }

  // Trigger quiz when efficiency crosses 80% for the first time
  if (efficiency >= 80 && !hasTriggeredQuiz && !showStartOverlay) {
    setHasTriggeredQuiz(true);
    setTimeout(() => setShowQuiz(true), 1500);
  }

  const handleQuizAnswer = (answerIdx) => {
    setQuizAnswers(prev => ({ ...prev, [quizIdx]: answerIdx }));
  };

  const handleQuizNext = () => {
    if (quizIdx < QUIZ_QUESTIONS.length - 1) {
      setQuizIdx(prev => prev + 1);
    } else {
      setShowQuiz(false);
      setShowCongrats(true);
    }
  };

  const currentQ = QUIZ_QUESTIONS[quizIdx];
  const isAnswered = quizAnswers[quizIdx] !== undefined;
  const isCorrect = quizAnswers[quizIdx] === currentQ.correct;
  const quizScore = Object.entries(quizAnswers).filter(([idx, ans]) => QUIZ_QUESTIONS[parseInt(idx)].correct === ans).length;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', color: 'white', position: 'relative' }}>
      <div style={{ padding: '15px', background: 'rgba(0,0,0,0.8)', borderBottom: '2px solid #333' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#FFB800' }}>☀️ Sun Tracker Sandbox</h3>
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
          <div style={{ fontSize: '10px', color: '#8b949e', marginTop: '4px' }}>
            Peak: {peakEfficiency.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* ═══ START OVERLAY ═══ */}
      {showStartOverlay && (
        <SolarManOverlay title="Welcome to the Sun Tracker!" onClose={() => setShowStartOverlay(false)} closeLabel="🚀 Start Simulation">
          <div style={{ background: 'rgba(255,184,0,0.1)', border: '1px solid rgba(255,184,0,0.3)', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
            <div style={{ fontWeight: 'bold', color: '#FFB800', marginBottom: '6px', fontSize: '13px' }}>📋 PROBLEM STATEMENT</div>
            <p style={{ margin: 0 }}>
              A house has a solar panel on its roof. Your mission is to <strong style={{ color: '#FFB800' }}>align the panel</strong> so that it faces the sun at different times of day and achieve <strong style={{ color: '#4CAF50' }}>≥80% energy efficiency</strong>.
            </p>
          </div>
          <div style={{ fontSize: '13px' }}>
            <div style={{ fontWeight: 'bold', color: '#FFB800', marginBottom: '8px' }}>🎮 HOW TO PLAY:</div>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Use the <strong>Time slider</strong> to move the sun across the sky</li>
              <li>Adjust <strong>Panel Tilt</strong> (up/down) and <strong>Panel Pan</strong> (left/right)</li>
              <li>Watch the <strong>Energy Output</strong> meter — aim for green!</li>
              <li>Once you hit ≥80%, a quick quiz will test your knowledge!</li>
            </ul>
          </div>
        </SolarManOverlay>
      )}

      {/* ═══ QUIZ OVERLAY ═══ */}
      {showQuiz && (
        <SolarManOverlay title={`Quiz — Question ${quizIdx + 1}/${QUIZ_QUESTIONS.length}`}>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#fff' }}>{currentQ.question}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {currentQ.options.map((opt, i) => {
              let bg = 'rgba(255,255,255,0.06)';
              let border = 'rgba(255,255,255,0.1)';
              let color = '#e2e8f0';
              if (isAnswered) {
                if (i === currentQ.correct) { bg = 'rgba(76,175,80,0.2)'; border = '#4CAF50'; color = '#4CAF50'; }
                else if (i === quizAnswers[quizIdx] && !isCorrect) { bg = 'rgba(244,67,54,0.2)'; border = '#f44336'; color = '#f44336'; }
              }
              return (
                <button key={i} onClick={() => handleQuizAnswer(i)} disabled={isAnswered}
                  style={{
                    padding: '12px 16px', background: bg, border: `2px solid ${border}`,
                    borderRadius: '10px', color, fontSize: '13px', fontWeight: '600',
                    cursor: isAnswered ? 'default' : 'pointer', textAlign: 'left',
                    transition: 'all 0.2s', opacity: isAnswered && i !== currentQ.correct && i !== quizAnswers[quizIdx] ? 0.4 : 1
                  }}>
                  <span style={{ marginRight: '8px', fontWeight: 'bold' }}>{String.fromCharCode(65 + i)}.</span> {opt}
                  {isAnswered && i === currentQ.correct && ' ✓'}
                  {isAnswered && i === quizAnswers[quizIdx] && !isCorrect && i !== currentQ.correct && ' ✗'}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div style={{
              padding: '12px', borderRadius: '10px', marginBottom: '12px',
              background: isCorrect ? 'rgba(76,175,80,0.15)' : 'rgba(244,67,54,0.15)',
              border: `1px solid ${isCorrect ? '#4CAF50' : '#f44336'}`,
              fontSize: '13px'
            }}>
              <strong>{isCorrect ? '✅ Correct!' : '❌ Not quite.'}</strong> {currentQ.explanation}
            </div>
          )}

          {isAnswered && (
            <button onClick={handleQuizNext} style={{
              display: 'block', width: '100%', padding: '14px',
              border: 'none', borderRadius: '12px',
              background: 'linear-gradient(135deg, #FFB800 0%, #FF8A00 100%)',
              color: '#000', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255,184,0,0.3)',
            }}>
              {quizIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'See Results 🎉'}
            </button>
          )}
        </SolarManOverlay>
      )}

      {/* ═══ CONGRATULATIONS OVERLAY ═══ */}
      {showCongrats && (
        <SolarManOverlay title="Congratulations! 🎉" onClose={() => setShowCongrats(false)} closeLabel="🔙 Back to Simulation">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏆</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#FFB800', marginBottom: '6px' }}>
              Mission Complete!
            </div>
            <div style={{ fontSize: '14px', color: '#8b949e' }}>
              You aligned the panel to ≥80% efficiency and answered {quizScore}/{QUIZ_QUESTIONS.length} questions correctly!
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, rgba(76,175,80,0.2), rgba(76,175,80,0.05))',
            border: '1px solid rgba(76,175,80,0.3)', borderRadius: '12px',
            padding: '16px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', color: '#4CAF50', fontWeight: 'bold', marginBottom: '4px' }}>
              ⚡ Peak Efficiency Achieved: {peakEfficiency.toFixed(0)}%
            </div>
            <div style={{ fontSize: '12px', color: '#8b949e' }}>
              Quiz Score: {quizScore}/{QUIZ_QUESTIONS.length}
            </div>
          </div>
        </SolarManOverlay>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
