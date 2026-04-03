import React, { useState, useRef, useEffect, useCallback } from 'react';

const COMPONENTS = [
  { id: 'panel', name: 'Solar Panel', role: 'The Catcher', color: '#1a3b5c', img: '/images/comp-solar-panel.png', hint: 'Catches sunlight' },
  { id: 'controller', name: 'Charge Controller', role: 'The Guard', color: '#8E44AD', img: '/images/comp-controller.png', hint: 'Protects the battery' },
  { id: 'battery', name: 'Battery', role: 'The Lunchbox', color: '#27AE60', img: '/images/comp-battery.png', hint: 'Stores extra energy' },
  { id: 'inverter', name: 'Inverter', role: 'The Translator', color: '#D35400', img: '/images/comp-inverter.png', hint: 'DC → AC conversion' },
  { id: 'tv', name: 'Television', role: 'The Goal', color: '#2C3E50', img: '/images/comp-tv.png', hint: 'Uses AC power' }
];

const CORRECT_ORDER = ['panel', 'controller', 'battery', 'inverter', 'tv'];

const ERROR_MESSAGES = {
  'panel-tv': '💥 Zap! The TV only speaks AC, but the panel sends DC. You need an Inverter to translate!',
  'panel-inverter': '⚠️ The inverter works, but without a battery, you lose power at night! Add a Charge Controller & Battery first.',
  'panel-battery': '🔥 Careful! Without a Charge Controller, the battery might overheat!',
  'battery-tv': '💥 The battery stores DC power, but the TV needs AC. You need the Inverter!',
  'inverter-tv': '🤔 Close! But where is the inverter getting its power from? Start from the Panel.',
};

export default function SolarTeamWiring() {
  const [connections, setConnections] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [nodesPos, setNodesPos] = useState({});
  const [successAnim, setSuccessAnim] = useState(false);
  const containerRef = useRef(null);
  const resizeObserverRef = useRef(null);

  const updateNodePositions = useCallback(() => {
    if (!containerRef.current) return;
    const rects = {};
    const containerRect = containerRef.current.getBoundingClientRect();

    COMPONENTS.forEach(comp => {
      const el = containerRef.current.querySelector(`[data-node-id="${comp.id}"]`);
      if (el) {
        const rect = el.getBoundingClientRect();
        rects[comp.id] = {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2
        };
      }
    });
    setNodesPos(rects);
  }, []);

  useEffect(() => {
    const timer = setTimeout(updateNodePositions, 300);
    
    if (containerRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => updateNodePositions());
      resizeObserverRef.current.observe(containerRef.current);
    }

    window.addEventListener('resize', updateNodePositions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateNodePositions);
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
    };
  }, [updateNodePositions]);

  useEffect(() => {
    const timer = setTimeout(updateNodePositions, 50);
    return () => clearTimeout(timer);
  }, [connections, updateNodePositions]);

  const getErrorKey = (a, b) => {
    const sorted = [a, b].sort();
    return sorted.join('-');
  };

  const handleNodeClick = (id) => {
    setErrorMsg('');
    
    if (!activeNode) {
      setActiveNode(id);
      return;
    }
    
    if (activeNode === id) {
      setActiveNode(null);
      return;
    }

    const exists = connections.some(
      c => (c.from === activeNode && c.to === id) || (c.from === id && c.to === activeNode)
    );
    if (exists) {
      setActiveNode(null);
      return;
    }

    const newConn = { from: activeNode, to: id };
    const newConnections = [...connections, newConn];
    setConnections(newConnections);
    setActiveNode(null);

    const errKey = getErrorKey(activeNode, id);
    if (ERROR_MESSAGES[errKey]) {
      setErrorMsg(ERROR_MESSAGES[errKey]);
    }
  };

  const reset = () => {
    setConnections([]);
    setActiveNode(null);
    setErrorMsg('');
    setSuccessAnim(false);
  };

  const checkWin = () => {
    if (connections.length < CORRECT_ORDER.length - 1) return false;
    
    const adj = {};
    connections.forEach(c => {
      if (!adj[c.from]) adj[c.from] = [];
      if (!adj[c.to]) adj[c.to] = [];
      adj[c.from].push(c.to);
      adj[c.to].push(c.from);
    });

    for (let i = 0; i < CORRECT_ORDER.length - 1; i++) {
      const from = CORRECT_ORDER[i];
      const to = CORRECT_ORDER[i + 1];
      if (!adj[from] || !adj[from].includes(to)) return false;
    }
    return true;
  };

  const isSuccess = checkWin();

  useEffect(() => {
    if (isSuccess && !successAnim) {
      setSuccessAnim(true);
      setErrorMsg('');
    }
  }, [isSuccess, successAnim]);

  const getConnectedCorrectly = () => {
    const correct = new Set(['panel']);
    for (let i = 0; i < CORRECT_ORDER.length - 1; i++) {
      const from = CORRECT_ORDER[i];
      const to = CORRECT_ORDER[i + 1];
      const found = connections.some(
        c => (c.from === from && c.to === to) || (c.from === to && c.to === from)
      );
      if (found) {
        correct.add(to);
      } else {
        break;
      }
    }
    return correct;
  };

  const correctSet = getConnectedCorrectly();

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#0d1117', color: 'white', fontFamily: 'sans-serif', userSelect: 'none' }}>
      
      {/* Header */}
      <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderBottom: '2px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h3 style={{ margin: '0 0 6px 0', color: '#FFB800', fontSize: '18px' }}>⚡ Build the Solar Team</h3>
          <p style={{ margin: 0, color: '#8b949e', fontSize: '13px' }}>
            Click two components to wire them together. Connect them in the right order: Panel → Controller → Battery → Inverter → TV
          </p>
        </div>
        <button 
          onClick={reset}
          style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #da3633 0%, #b62324 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', whiteSpace: 'nowrap' }}
        >
          🔄 Reset
        </button>
      </div>

      {/* Error / Hint Bar */}
      {errorMsg && (
        <div style={{ 
          padding: '12px 20px', background: 'rgba(218, 54, 51, 0.15)', borderBottom: '1px solid rgba(218, 54, 51, 0.3)',
          color: '#f85149', fontSize: '13px', animation: 'shakeX 0.4s ease', flexShrink: 0
        }}>
          {errorMsg}
        </div>
      )}

      {/* Wiring Canvas */}
      <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: '30px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* SVG Wires */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {connections.map((conn, i) => {
            const p1 = nodesPos[conn.from];
            const p2 = nodesPos[conn.to];
            if (!p1 || !p2) return null;

            const isCorrectConn = (() => {
              for (let j = 0; j < CORRECT_ORDER.length - 1; j++) {
                const a = CORRECT_ORDER[j], b = CORRECT_ORDER[j + 1];
                if ((conn.from === a && conn.to === b) || (conn.from === b && conn.to === a)) return true;
              }
              return false;
            })();

            const color = isSuccess ? '#4CAF50' : isCorrectConn ? '#FFB800' : '#f85149';

            return (
              <g key={i}>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color} strokeWidth="10" strokeLinecap="round" opacity="0.2" filter="url(#glow)" />
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color} strokeWidth="4" strokeLinecap="round" className={isSuccess ? 'wire-success' : 'wire-flowing'} />
                <circle r="6" fill={color} opacity="0.9">
                  <animateMotion dur="1.5s" repeatCount="indefinite" path={`M${p1.x},${p1.y} L${p2.x},${p2.y}`} />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Component Nodes with Realistic Images */}
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', height: '100%', gap: '12px', flexWrap: 'wrap' }}>
          {COMPONENTS.map((comp, idx) => {
            const isActive = activeNode === comp.id;
            const isCorrect = correctSet.has(comp.id);
            const isTVOn = isSuccess && comp.id === 'tv';

            return (
              <div 
                key={comp.id}
                data-node-id={comp.id}
                onClick={() => handleNodeClick(comp.id)}
                style={{
                  width: '120px',
                  minHeight: '160px',
                  backgroundColor: isActive ? '#30363d' : `${comp.color}22`,
                  borderRadius: '16px',
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'center', alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: isActive 
                    ? '0 0 25px rgba(255,184,0,0.5)' 
                    : isTVOn 
                      ? '0 0 30px rgba(76,175,80,0.6)' 
                      : '0 4px 12px rgba(0,0,0,0.4)',
                  border: isActive 
                    ? '3px solid #FFB800' 
                    : isCorrect 
                      ? '3px solid rgba(76,175,80,0.5)' 
                      : '3px solid #30363d',
                  zIndex: 2,
                  transition: 'all 0.25s ease',
                  transform: isActive ? 'scale(1.08)' : isTVOn ? 'scale(1.1)' : 'scale(1)',
                  padding: '15px 8px',
                  position: 'relative',
                }}
              >
                {/* Step number */}
                <div style={{ 
                  position: 'absolute', top: '-10px', left: '-10px', 
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: isCorrect ? '#4CAF50' : '#30363d',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 'bold', border: '2px solid #0d1117'
                }}>
                  {idx + 1}
                </div>

                {/* Realistic Image */}
                <div style={{ 
                  width: '64px', height: '64px', marginBottom: '8px',
                  borderRadius: '10px', overflow: 'hidden',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <img src={comp.img} alt={comp.name} style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    filter: isTVOn ? 'brightness(1.3) saturate(1.2)' : 'none',
                    transition: 'filter 0.3s'
                  }} />
                </div>
                <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>{comp.name}</div>
                <div style={{ textAlign: 'center', fontSize: '10px', color: '#8b949e', fontStyle: 'italic' }}>{comp.role}</div>
                
                {isTVOn && (
                  <div style={{ fontSize: '10px', marginTop: '6px', color: '#4CAF50', fontWeight: 'bold', animation: 'pulse 1s infinite' }}>
                    📡 ON
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Success Banner */}
        {isSuccess && (
          <div style={{ 
            position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', 
            background: 'linear-gradient(135deg, #238636 0%, #2ea043 100%)', 
            padding: '12px 28px', borderRadius: '30px', fontWeight: 'bold',
            boxShadow: '0 4px 20px rgba(46, 160, 67, 0.4)', zIndex: 10,
            fontSize: '14px', animation: 'slideUp 0.5s ease'
          }}>
            ⚡ The Solar Team is complete! The TV is powered! ⚡
          </div>
        )}
      </div>

      <style>{`
        @keyframes flow {
          0% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes pulseSuccess {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .wire-flowing {
          stroke-dasharray: 8 6;
          animation: flow 0.8s linear infinite;
        }
        .wire-success {
          animation: pulseSuccess 2s infinite;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
