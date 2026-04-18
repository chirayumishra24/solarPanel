import { useState, useEffect, useRef, useContext } from 'react';
import { ContentBlocks, ChapterHeader } from './ContentBlocks';
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

  const hasTitleBlock = chapterData.blocks[0]?.type === 'heading' && chapterData.blocks[0]?.level === 1;
  const titleBlock = hasTitleBlock ? chapterData.blocks[0] : null;
  const restBlocks = hasTitleBlock ? chapterData.blocks.slice(1) : chapterData.blocks;

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
        <div className="chapter-scroll-content">
          {/* Main Chapter Title and Audio rendered explicitly at the top */}
          {titleBlock && (
            <div className="chapter-main-title">
              <ChapterHeader block={titleBlock} chapterId={chapterData.id} />
            </div>
          )}

          <div className="desktop-split">
            <SolarHUD />
            <div className="chapter-content-wrapper">
              <ContentBlocks blocks={restBlocks} chapterId={chapterData.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
