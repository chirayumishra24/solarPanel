import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CustomVideoPlayer } from './CustomVideoPlayer';
import { ActivityBlock } from './ActivityBlock';

const CHAPTER_AUDIO_SOURCES = {
  'module1-chapter1': '/audio/m1ch1.mp3',
  'module1-chapter1-2': '/audio/m1ch2.mp3',
  'module1-chapter1-3': '/audio/m1ch3.mp3',
  'module2-chapter1': '/audio/m2ch1.mp3',
  'module2-chapter2': '/audio/m2ch2.mp3',
  'module2-chapter3': '/audio/m2ch3.mp3',
};

export function ChapterHeader({ block, chapterId }) {
  const audioSrc = chapterId ? CHAPTER_AUDIO_SOURCES[chapterId] ?? null : null;
  return (
    <React.Fragment>
      <HeadingBlock block={block} />
      {audioSrc && (
        <div className="audio-container" style={{ marginTop: '1rem' }}>
          <audio
            key={audioSrc}
            controls
            preload="auto"
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            onError={(e) => console.error('Audio error:', e.target.error)}
          >
            <source src={audioSrc} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </React.Fragment>
  );
}

export function ContentBlocks({ blocks, chapterId }) {
  if (!blocks || !blocks.length) return null;

  return (
    <div className="content-blocks">
      {blocks.map((block, index) => {
        let renderedBlock = null;
        switch (block.type) {
          case 'heading': renderedBlock = <HeadingBlock key={index} block={block} />; break;
          case 'text': renderedBlock = <TextBlock key={index} block={block} />; break;
          case 'video': renderedBlock = <VideoBlock key={index} block={block} />; break;
          case 'image': renderedBlock = <ImageBlock key={index} block={block} />; break;
          case 'list': renderedBlock = <ListBlock key={index} block={block} />; break;
          case 'table': renderedBlock = <TableBlock key={index} block={block} />; break;
          case 'carousel': renderedBlock = <CarouselBlock key={index} block={block} />; break;
          case 'link': renderedBlock = <LinkBlock key={index} block={block} />; break;
          case 'activity': renderedBlock = <ActivityBlock key={index} block={block} />; break;
          default: renderedBlock = null;
        }
        return renderedBlock;
      })}
    </div>
  );
}

function HeadingBlock({ block }) {
  const Tag = `h${block.level}`;
  return (
    <div className={`content-card heading-card level-${block.level}`}>
      <Tag className={`heading-level-${block.level}`}>{block.content}</Tag>
    </div>
  );
}

function TextBlock({ block }) {
  return (
    <div className="content-card text-card">
      <p>{block.content}</p>
    </div>
  );
}

function VideoBlock({ block }) {
  return (
    <div className="content-card video-card" style={{ padding: 0, overflow: 'hidden' }}>
      <CustomVideoPlayer src={block.url} title={block.title} />
    </div>
  );
}

function ImageBlock({ block }) {
  return (
    <div className={`content-card image-card ${block.className || ''}`} style={{ textAlign: 'center', ...block.containerStyle }}>
      <img src={block.url} alt={block.alt || 'Course illustration'} style={{ width: '100%', height: 'auto', margin: '0 auto', display: 'block', ...block.imageStyle }} />
    </div>
  );
}

function ListBlock({ block }) {
  const Tag = block.ordered ? 'ol' : 'ul';
  return (
    <div className="content-card list-card">
      <Tag>
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </Tag>
    </div>
  );
}

function TableBlock({ block }) {
  return (
    <div className="content-card table-card">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {block.headers.map((h, i) => <th key={i}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => <td key={j}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LinkBlock({ block }) {
  return (
    <div className="content-card link-card" style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
      <a
        href={block.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #FFB800 0%, #FF8A00 100%)',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '30px',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(255, 138, 0, 0.4)',
          transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {block.text || 'View Resource'}
      </a>
    </div>
  );
}

function CarouselBlock({ block }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % block.images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + block.images.length) % block.images.length);
  };

  if (!block.images || !block.images.length) return null;

  return (
    <div className="content-card carousel-card" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
      <button
        onClick={handlePrev}
        style={{ position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.6)', borderRadius: '50%', padding: '8px', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '40px', minHeight: '40px' }}
      >
        <ChevronLeft size={22} />
      </button>

      <div style={{ padding: '0', margin: 0, display: 'flex', transition: 'transform 0.3s ease', transform: `translateX(-${currentIndex * 100}%)` }}>
        {block.images.map((img, i) => (
          <img
            key={i}
            src={img.url}
            alt={img.alt || 'Carousel image'}
            style={{ width: '100%', flexShrink: 0, objectFit: 'contain', height: 'auto', maxHeight: '60vh', display: 'block', background: 'rgba(0,0,0,0.1)' }}
          />
        ))}
      </div>

      <button
        onClick={handleNext}
        style={{ position: 'absolute', top: '50%', right: '8px', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.6)', borderRadius: '50%', padding: '8px', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '40px', minHeight: '40px' }}
      >
        <ChevronRight size={22} />
      </button>

      <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
        {block.images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: i === currentIndex ? 'white' : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              minWidth: '12px'
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
