import { useState, useEffect, useRef, useContext } from 'react';
import { ContentBlocks } from './ContentBlocks';
import { ThemeContext } from './SolarCourseBackground';
import { SolarHUD } from './SolarHUD';

export function ChapterLayout({ chapterData }) {
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef(null);
  const dayPhase = useContext(ThemeContext);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollHeight <= clientHeight) {
      setProgress(100);
      return;
    }
    const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setProgress(Math.min(100, Math.max(0, scrolled)));
  };

  useEffect(() => {
    // Delay initial check to avoid synchronous setState inside effect
    requestAnimationFrame(() => handleScroll());
  }, [chapterData]);

  if (!chapterData) return null;

  // Add the theme class. For similar lighting phases, group them via CSS or mapping.
  // dayPhase will be: night, twilight, morning, day, afternoon, evening
  const themeClass = `theme-${dayPhase || 'night'}`;

  return (
    <div className={`chapter-overlay-container ${themeClass}`}>
      {/* Progress bar at top edge */}
      <div className="chapter-progress-bar-container">
        <div
          className="chapter-progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Scrollable content area */}
      <div 
        className="chapter-scroll-area" 
        id="chapter-scroll-area"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <SolarHUD />
        
        <div className="chapter-content-wrapper">
          <ContentBlocks blocks={chapterData.blocks} />
        </div>
      </div>
    </div>
  );
}
