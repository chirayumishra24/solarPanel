import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Rewind, FastForward } from 'lucide-react';

export function CustomVideoPlayer({ src, title }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleLoadedData = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const manualChange = Number(e.target.value);
    if (videoRef.current) {
      const time = (manualChange / 100) * duration;
      videoRef.current.currentTime = time;
      setProgress(manualChange);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (isMuted && volume === 0) setVolume(1);
    }
  };

  const handleVolume = (e) => {
    const manualVolume = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = manualVolume;
      videoRef.current.muted = manualVolume === 0;
      setVolume(manualVolume);
      setIsMuted(manualVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const changePlaybackRate = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      setShowSettings(false);
    }
  };

  const skipForward = (e) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 5, duration);
    }
  };

  const skipBackward = (e) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 5, 0);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      skipForward();
    } else if (e.key === 'ArrowLeft') {
      skipBackward();
    } else if (e.key === ' ') {
      e.preventDefault();
      togglePlay();
    }
  };

  // Fallback for youtube or external links that can't be played in HTML5 video
  if (src && src.includes('youtube.com')) {
    return (
      <div className="video-wrapper" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
        <iframe
          src={src}
          title={title || 'YouTube Video'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      </div>
    );
  }

  return (
    <div 
      className="custom-video-container" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#000',
        borderRadius: isFullscreen ? '0' : '10px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxShadow: isFullscreen ? 'none' : '0 8px 30px rgba(0,0,0,0.5)',
        outline: 'none'
      }}
    >
      <video
        ref={videoRef}
        src={src}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={handleLoadedData}
        onEnded={() => setIsPlaying(false)}
        style={{
          width: '100%',
          maxHeight: isFullscreen ? '100vh' : '500px',
          objectFit: 'contain',
          cursor: 'pointer'
        }}
      />

      {/* Play/Pause Overlay animation could go here */}

      <div 
        className="video-controls"
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          padding: '20px 15px 10px',
          transition: 'opacity 0.3s ease',
          opacity: showControls ? 1 : 0,
          pointerEvents: showControls ? 'auto' : 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        {/* Progress Bar */}
        <div style={{ padding: '0 5px' }}>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={progress || 0}
            onChange={handleSeek}
            style={{
              width: '100%',
              height: '4px',
              cursor: 'pointer',
              accentColor: '#FF0000',
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '2px',
              appearance: 'none',
              outline: 'none',
              transition: 'height 0.1s'
            }}
            onMouseOver={(e) => e.target.style.height = '6px'}
            onMouseOut={(e) => e.target.style.height = '4px'}
          />
        </div>

        {/* Lower Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={skipBackward} style={{ ...btnStyle, opacity: 0.8 }} title="Rewind 5s (Left Arrow)">
              <Rewind size={20} fill="currentColor" />
            </button>
            <button onClick={togglePlay} style={btnStyle} title="Play/Pause (Space)">
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>
            <button onClick={skipForward} style={{ ...btnStyle, opacity: 0.8 }} title="Forward 5s (Right Arrow)">
              <FastForward size={20} fill="currentColor" />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} className="volume-container">
              <button onClick={toggleMute} style={btnStyle}>
                {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolume}
                style={{
                  width: '60px',
                  height: '4px',
                  cursor: 'pointer',
                  accentColor: '#fff',
                }}
              />
            </div>

            <div style={{ fontSize: '13px', fontFamily: 'sans-serif' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', position: 'relative' }}>
            {/* Settings Menu */}
            {showSettings && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                right: '40px',
                background: 'rgba(28,28,28,0.9)',
                borderRadius: '8px',
                padding: '10px 0',
                marginBottom: '10px',
                minWidth: '150px'
              }}>
                <div style={{ padding: '5px 15px', fontSize: '12px', color: '#aaa', borderBottom: '1px solid #444', marginBottom: '5px' }}>
                  Playback Speed
                </div>
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                  <button 
                    key={rate}
                    onClick={() => changePlaybackRate(rate)}
                    style={{
                      ...btnStyle,
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '5px 15px',
                      background: rate === playbackRate ? 'rgba(255,255,255,0.1)' : 'transparent',
                      fontSize: '14px',
                      borderRadius: '0'
                    }}
                  >
                    {rate === 1 ? 'Normal' : `${rate}x`}
                  </button>
                ))}
              </div>
            )}

            <button onClick={() => setShowSettings(!showSettings)} style={btnStyle}>
              <Settings size={22} />
            </button>
            <button onClick={toggleFullscreen} style={btnStyle}>
              {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  background: 'none',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  padding: '0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.1s',
};

// CSS to hide scrollbar on range inputs
const style = document.createElement('style');
style.textContent = `
  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: currentColor;
    border-radius: 50%;
    cursor: pointer;
  }
`;
document.head.appendChild(style);
