import { useContext } from 'react';
import { SolarDataContext } from './SolarCourseBackground';

export function PowerPanel() {
  const solarData = useContext(SolarDataContext);
  const energy = solarData?.energy ?? 0;
  
  const inputPower = Math.round(energy * 400); 
  const outputPower = Math.round(inputPower * 0.95);

  return (
    <div className="comic-panel-card">
      <div className="comic-hero-badge">
        <svg className="comic-hero-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Simple superhero bust representation */}
          <path d="M15 100 Q50 20 85 100 Z" fill="#e53e3e" stroke="#111" strokeWidth="6" strokeLinejoin="round"/>
          <path d="M50 35 L40 60 L60 60 Z" fill="#facc15" stroke="#111" strokeWidth="4" strokeLinejoin="round"/>
          <circle cx="50" cy="30" r="18" fill="#facc15" stroke="#111" strokeWidth="6"/>
          {/* Hero Mask / Eyes */}
          <path d="M40 28 Q50 35 60 28" stroke="#111" strokeWidth="5" strokeLinecap="round"/>
        </svg>
      </div>
      
      <div className="comic-title">SOLAR-MAN SAYS:</div>
      
      <div className="comic-content">
        <p style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
          Before storing energy,<br/>
          we need to <span style={{ color: '#0ea5e9' }}>convert</span> it!
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', alignItems: 'center', margin: '1rem 0' }}>
          
          <div style={{ flex: 1, padding: '1rem 0.5rem', border: '5px solid #111', borderRadius: '1rem', background: '#facc15', boxShadow: '5px 5px 0 #111' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>DC IN</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, marginTop: '0.2rem' }}>{inputPower}W</div>
          </div>
          
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111' }}>➔</div>
          
          <div style={{ flex: 1, padding: '1rem 0.5rem', border: '5px solid #111', borderRadius: '1rem', background: '#22c55e', color: '#fff', boxShadow: '5px 5px 0 #111', textShadow: '2px 2px 0 #111' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>AC OUT</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, marginTop: '0.2rem' }}>{outputPower}W</div>
          </div>
          
        </div>
        
        <p style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, marginTop: '0.5rem', textTransform: 'uppercase', color: energy > 0 ? '#10b981' : '#f43f5e' }}>
          {energy > 0 ? "The energy is flowing! ⚡️" : "Waiting for sunshine! 🌙"}
        </p>
      </div>
    </div>
  );
}
