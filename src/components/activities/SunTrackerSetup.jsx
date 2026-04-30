import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cone, Sphere, Plane, Line } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Angle Arc Visualization ─── */
function AngleArc({ panelTilt }) {
  const points = useMemo(() => {
    const pts = [];
    const radius = 1.2;
    const segments = 30;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + panelTilt;
    for (let i = 0; i <= segments; i++) {
      const t = startAngle + (endAngle - startAngle) * (i / segments);
      pts.push(new THREE.Vector3(0, Math.sin(t) * radius, Math.cos(t) * radius));
    }
    return pts;
  }, [panelTilt]);

  const degrees = Math.round((panelTilt / Math.PI) * 180);

  return (
    <group position={[0, 4.5, 1.5]}>
      {/* Vertical reference line */}
      <Line
        points={[[0, 0, 0], [0, 0, 1.3]]}
        color="#FFB800"
        lineWidth={1.5}
        dashed
        dashSize={0.1}
        gapSize={0.05}
      />
      {/* Arc showing current tilt angle */}
      {points.length > 1 && (
        <Line
          points={points}
          color="#4CAF50"
          lineWidth={2}
        />
      )}
      {/* Line to panel surface direction */}
      <Line
        points={[[0, 0, 0], [0, Math.sin(-Math.PI / 2 + panelTilt) * 1.3, Math.cos(-Math.PI / 2 + panelTilt) * 1.3]]}
        color="#4CAF50"
        lineWidth={1.5}
      />
    </group>
  );
}

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
      <AngleArc panelTilt={panelTilt} />
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
  },
  {
    question: 'What is the ideal tilt angle for a solar panel in India (~28\u00b0N latitude)?',
    options: ['0\u00b0 (flat)', 'Equal to latitude (~28\u00b0)', '90\u00b0 (vertical)', '180\u00b0 (upside down)'],
    correct: 1,
    explanation: 'The optimal tilt angle for a fixed solar panel is roughly equal to the location\'s latitude. For most of India (~28\u00b0N), a tilt of about 28\u00b0 from horizontal gives the best year-round output!'
  }
];

export default function SunTrackerSetup() {
  const [timeOfDay, setTimeOfDay] = useState(12);
  const [panelTilt, setPanelTilt] = useState(Math.PI / 4);
  const [panelPan, setPanelPan] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [peakEfficiency, setPeakEfficiency] = useState(0);
  const [showAngleInfo, setShowAngleInfo] = useState(false);

  // Overlay states
  const [showStartOverlay, setShowStartOverlay] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showCongrats, setShowCongrats] = useState(false);
  const [hasTriggeredQuiz, setHasTriggeredQuiz] = useState(false);

  // Derived angle values in degrees
  const tiltDeg = Math.round((panelTilt / Math.PI) * 180);
  const panDeg = Math.round((panelPan / Math.PI) * 180);

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

  const isActivityBlocked = showStartOverlay || showQuiz || showCongrats;

  return (
    <div className="sun-tracker-activity" style={{ display: 'flex', flexDirection: 'column', color: 'white' }}>

      {/* ═══ SMALL INSTRUCTION CARD (above activity) ═══ */}
      {showStartOverlay && (
        <div className="sun-tracker-overlay-card" style={{
          margin: '12px', padding: '14px',
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          border: '1px solid #FFB800', borderRadius: '12px',
          display: 'flex', flexDirection: 'column', gap: '10px'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <img src="/images/solar-man.png" alt="Solar Man"
              style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid #FFB800', background: '#FFB800', objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.5' }}>
              <strong style={{ color: '#FFB800' }}>Solar Man:</strong> Align the panel to face the sun!
              Adjust Tilt & Pan sliders to hit{' '}
              <strong style={{ color: '#4CAF50' }}>{'\u2265'}80% efficiency</strong>.
            </div>
          </div>
          <button
            onClick={() => setShowStartOverlay(false)}
            style={{
              padding: '10px 20px', background: '#FFB800', border: 'none', borderRadius: '8px',
              color: '#000', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', alignSelf: 'flex-start'
            }}
          >
            {'\ud83d\ude80'} Start Simulation
          </button>
        </div>
      )}

      {/* ═══ QUIZ CARD (above activity) ═══ */}
      {showQuiz && (
        <div className="sun-tracker-overlay-card" style={{
          margin: '12px', padding: '14px',
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          border: '1px solid #4CAF50', borderRadius: '12px',
          display: 'flex', flexDirection: 'column', gap: '10px'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <img src="/images/solar-man.png" alt="Solar Man"
              style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid #4CAF50', background: '#4CAF50', objectFit: 'cover', flexShrink: 0 }} />
            <div>
              <div style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: '12px' }}>
                Quiz {'\u2014'} Question {quizIdx + 1}/{QUIZ_QUESTIONS.length}
              </div>
              <div style={{ fontSize: '14px', color: '#fff', fontWeight: 'bold', marginTop: '4px' }}>
                {currentQ.question}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {currentQ.options.map((opt, i) => {
              let bg = 'rgba(255,255,255,0.06)';
              let bdr = 'rgba(255,255,255,0.1)';
              let clr = '#e2e8f0';
              if (isAnswered) {
                if (i === currentQ.correct) { bg = 'rgba(76,175,80,0.2)'; bdr = '#4CAF50'; clr = '#4CAF50'; }
                else if (i === quizAnswers[quizIdx] && !isCorrect) { bg = 'rgba(244,67,54,0.2)'; bdr = '#f44336'; clr = '#f44336'; }
              }
              return (
                <button key={i} onClick={() => handleQuizAnswer(i)} disabled={isAnswered}
                  style={{
                    padding: '10px 12px', background: bg, border: `2px solid ${bdr}`,
                    borderRadius: '8px', color: clr, fontSize: '13px', fontWeight: '600',
                    cursor: isAnswered ? 'default' : 'pointer', textAlign: 'left',
                    transition: 'all 0.2s',
                    opacity: isAnswered && i !== currentQ.correct && i !== quizAnswers[quizIdx] ? 0.4 : 1
                  }}>
                  <span style={{ marginRight: '8px', fontWeight: 'bold' }}>{String.fromCharCode(65 + i)}.</span>{opt}
                  {isAnswered && i === currentQ.correct && ' \u2713'}
                  {isAnswered && i === quizAnswers[quizIdx] && !isCorrect && i !== currentQ.correct && ' \u2717'}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div>
              <div style={{
                background: isCorrect ? 'rgba(76,175,80,0.15)' : 'rgba(244,67,54,0.15)',
                padding: '10px', borderRadius: '8px', marginBottom: '10px',
                borderLeft: `4px solid ${isCorrect ? '#4CAF50' : '#f44336'}`,
                fontSize: '13px', lineHeight: '1.5'
              }}>
                <strong style={{ color: isCorrect ? '#4CAF50' : '#f44336' }}>
                  {isCorrect ? 'Correct!' : 'Incorrect.'}
                </strong>{' '}{currentQ.explanation}
              </div>
              <button onClick={handleQuizNext} style={{
                padding: '10px 16px', background: '#4CAF50', border: 'none', borderRadius: '8px',
                color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px'
              }}>
                {quizIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question \u27a1' : 'Finish Quiz \ud83d\udc4d'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══ CONGRATS CARD (above activity) ═══ */}
      {showCongrats && (
        <div className="sun-tracker-overlay-card" style={{
          margin: '12px', padding: '14px',
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          border: '1px solid #FFB800', borderRadius: '12px',
          display: 'flex', flexDirection: 'column', gap: '10px'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <img src="/images/solar-man.png" alt="Solar Man"
              style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid #FFB800', background: '#FFB800', objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.5' }}>
              <strong style={{ color: '#4CAF50' }}>Amazing work!</strong>{' '}
              Peak efficiency: <strong style={{ color: '#FFB800' }}>{peakEfficiency.toFixed(0)}%</strong>.
              Quiz: <strong>{quizScore}/{QUIZ_QUESTIONS.length}</strong> correct.
            </div>
          </div>
          <button onClick={() => setShowCongrats(false)} style={{
            padding: '10px 16px', background: '#30363d', border: 'none', borderRadius: '8px',
            color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', alignSelf: 'flex-start'
          }}>
            Back to Sandbox {'\u27a1'}
          </button>
        </div>
      )}

      {/* ═══ ACTUAL ACTIVITY (dimmed when card is showing) ═══ */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        opacity: isActivityBlocked ? 0.2 : 1,
        pointerEvents: isActivityBlocked ? 'none' : 'auto',
        transition: 'opacity 0.3s ease'
      }}>
        {/* Controls Header */}
        <div style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.8)', borderBottom: '2px solid #333', flexShrink: 0 }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#FFB800', fontSize: 'clamp(14px, 3.5vw, 18px)' }}>
            {'\u2600\ufe0f'} Sun Tracker Sandbox
          </h3>
          <p style={{ margin: '0 0 12px 0', fontSize: 'clamp(11px, 2.5vw, 14px)', color: '#ccc' }}>
            Adjust the time of day and align your solar panel to maximize energy production!
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 160px', minWidth: '0' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                <span>Time of Day: {Math.floor(timeOfDay)}:00</span>
              </label>
              <input
                type="range" min="6" max="18" step="0.5"
                value={timeOfDay} onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ flex: '1 1 160px', minWidth: '0' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                <span>Panel Tilt (Up/Down): <strong style={{ color: '#4CAF50' }}>{tiltDeg}{'\u00b0'}</strong></span>
                <span style={{ color: '#8b949e', fontSize: '10px' }}>0{'\u00b0'} = flat, 90{'\u00b0'} = vertical</span>
              </label>
              <input
                type="range" min="0" max={Math.PI / 2} step="0.01"
                value={panelTilt} onChange={(e) => setPanelTilt(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ flex: '1 1 160px', minWidth: '0' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                <span>Panel Pan (Left/Right): <strong style={{ color: '#58a6ff' }}>{panDeg > 0 ? `+${panDeg}` : panDeg}{'\u00b0'}</strong></span>
                <span style={{ color: '#8b949e', fontSize: '10px' }}>Azimuth</span>
              </label>
              <input
                type="range" min={-Math.PI/2} max={Math.PI/2} step="0.01"
                value={panelPan} onChange={(e) => setPanelPan(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* 3D Canvas - fixed height */}
        <div style={{ height: '350px', flexShrink: 0 }}>
          <Canvas shadows camera={{ position: [8, 5, 10], fov: 45 }} style={{ width: '100%', height: '100%' }}>
            <color attach="background" args={['#87CEEB']} />
            <SunTrackerScene timeOfDay={timeOfDay} panelTilt={panelTilt} panelPan={panelPan} setEfficiency={setEfficiency} />
          </Canvas>
        </div>

        {/* HUD Row (static, below canvas) */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '14px',
          background: '#0d1117', borderTop: '2px solid #30363d'
        }}>
          {/* Efficiency Meter */}
          <div style={{
            flex: '1 1 180px', minWidth: '0',
            background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px',
            border: '1px solid #444'
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

          {/* Angle Info */}
          <div style={{
            flex: '1 1 220px', minWidth: '0',
            background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px',
            border: '1px solid #30363d'
          }}>
            <div
              onClick={() => setShowAngleInfo(!showAngleInfo)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', userSelect: 'none'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#FFB800' }}>{'\ud83d\udcd0'} Panel Angle</div>
              <span style={{ fontSize: '10px', color: '#8b949e' }}>{showAngleInfo ? '\u25bc Hide' : '\u25b6 Learn More'}</span>
            </div>

            <div style={{
              display: 'flex', gap: '12px', marginTop: '10px',
              background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '8px 10px'
            }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '9px', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tilt</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4CAF50' }}>{tiltDeg}{'\u00b0'}</div>
              </div>
              <div style={{ width: '1px', background: '#30363d' }} />
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '9px', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Azimuth</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#58a6ff' }}>{panDeg > 0 ? `+${panDeg}` : panDeg}{'\u00b0'}</div>
              </div>
            </div>

            {showAngleInfo && (
              <div style={{ marginTop: '12px', fontSize: '11px', lineHeight: '1.5', color: '#c9d1d9' }}>
                <div style={{
                  background: 'rgba(255,184,0,0.08)', border: '1px solid rgba(255,184,0,0.2)',
                  borderRadius: '8px', padding: '10px', marginBottom: '8px'
                }}>
                  <div style={{ fontWeight: 'bold', color: '#FFB800', marginBottom: '4px', fontSize: '11px' }}>{'\ud83d\udccf'} How Angles Are Measured</div>
                  <p style={{ margin: '0 0 6px 0' }}>
                    <strong style={{ color: '#4CAF50' }}>Tilt angle</strong> (elevation): Measured from the <em>horizontal surface</em>.
                    0{'\u00b0'} = flat, 90{'\u00b0'} = vertical.
                  </p>
                  <p style={{ margin: '0' }}>
                    <strong style={{ color: '#58a6ff' }}>Azimuth</strong> (pan): Measured from <em>true south</em>.
                    0{'\u00b0'} = south. Negative = east. Positive = west.
                  </p>
                </div>

                <div style={{
                  background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.2)',
                  borderRadius: '8px', padding: '10px'
                }}>
                  <div style={{ fontWeight: 'bold', color: '#4CAF50', marginBottom: '4px', fontSize: '11px' }}>{'\ud83d\udca1'} Pro Tip</div>
                  <p style={{ margin: 0 }}>
                    For India (~28{'\u00b0'}N), ideal tilt is ~28{'\u00b0'} facing south.
                    Steeper in winter (+15{'\u00b0'}), flatter in summer (-15{'\u00b0'}).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
