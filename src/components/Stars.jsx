import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const STAR_COUNT = 900;

// Generate a soft circular star sprite texture
function createStarTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const center = size / 2;

  // Outer soft glow
  const outerGrad = ctx.createRadialGradient(center, center, 0, center, center, center);
  outerGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  outerGrad.addColorStop(0.15, 'rgba(255, 255, 255, 0.9)');
  outerGrad.addColorStop(0.3, 'rgba(200, 220, 255, 0.4)');
  outerGrad.addColorStop(0.6, 'rgba(150, 180, 255, 0.1)');
  outerGrad.addColorStop(1, 'rgba(100, 150, 255, 0)');

  ctx.fillStyle = outerGrad;
  ctx.fillRect(0, 0, size, size);

  // 4-point star cross for sparkle effect
  ctx.globalCompositeOperation = 'lighter';
  const drawRay = (angle, length, width) => {
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(angle);
    const rayGrad = ctx.createLinearGradient(0, 0, length, 0);
    rayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    rayGrad.addColorStop(0.5, 'rgba(200, 220, 255, 0.15)');
    rayGrad.addColorStop(1, 'rgba(150, 180, 255, 0)');
    ctx.fillStyle = rayGrad;
    ctx.fillRect(0, -width / 2, length, width);
    ctx.fillRect(-length, -width / 2, length, width);
    ctx.restore();
  };

  drawRay(0, center * 0.9, 2);
  drawRay(Math.PI / 2, center * 0.9, 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export function Stars({ altitude }) {
  const ref = useRef();

  const [starTexture] = useState(() => createStarTexture());

  const [positions] = useState(() => {
    const arr = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.92 + 0.08);
      const r = 90 + Math.random() * 70;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi);
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  });

  const [baseSizes] = useState(() => {
    const arr = new Float32Array(STAR_COUNT);
    for (let i = 0; i < STAR_COUNT; i++) {
      const rand = Math.random();
      if (rand < 0.03) arr[i] = 5.0 + Math.random() * 3.0;      // 3% very bright stars
      else if (rand < 0.12) arr[i] = 2.5 + Math.random() * 2.5;  // 9% bright
      else if (rand < 0.35) arr[i] = 1.2 + Math.random() * 1.5;  // 23% medium
      else arr[i] = 0.5 + Math.random() * 0.8;                    // 65% dim
    }
    return arr;
  });

  // Per-star blink speed and phase offset for varied twinkling
  const [blinkData] = useState(() => {
    const arr = new Float32Array(STAR_COUNT * 2); // [speed, phase] pairs
    for (let i = 0; i < STAR_COUNT; i++) {
      arr[i * 2] = 0.8 + Math.random() * 3.0;     // blink speed
      arr[i * 2 + 1] = Math.random() * Math.PI * 2; // phase offset
    }
    return arr;
  });

  const [colors] = useState(() => {
    const arr = new Float32Array(STAR_COUNT * 3);
    const palette = [
      [1, 1, 1],
      [0.85, 0.9, 1],
      [1, 0.95, 0.85],
      [0.7, 0.82, 1],
      [1, 0.9, 0.7],
      [0.92, 0.94, 1],
      [1, 0.8, 0.6],
    ];
    for (let i = 0; i < STAR_COUNT; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      arr[i * 3] = c[0];
      arr[i * 3 + 1] = c[1];
      arr[i * 3 + 2] = c[2];
    }
    return arr;
  });

  const altDeg = altitude * (180 / Math.PI);
  const opacity = altDeg < -6 ? 1 : altDeg < 2 ? Math.max(0, (2 - altDeg) / 8) : 0;

  useFrame((state) => {
    if (ref.current && opacity > 0) {
      const time = state.clock.elapsedTime;
      const sizeAttr = ref.current.geometry.getAttribute('size');
      for (let i = 0; i < STAR_COUNT; i++) {
        const speed = blinkData[i * 2];
        const phase = blinkData[i * 2 + 1];
        // Realistic twinkling: mix of multiple frequencies
        const blink1 = Math.sin(time * speed + phase);
        const blink2 = Math.sin(time * speed * 0.7 + phase * 1.3) * 0.3;
        const twinkle = 0.5 + 0.5 * (blink1 + blink2) / 1.3;
        sizeAttr.array[i] = baseSizes[i] * (0.3 + 0.7 * twinkle);
      }
      sizeAttr.needsUpdate = true;
      ref.current.material.opacity = opacity;
    }
  });

  if (opacity <= 0) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={STAR_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={STAR_COUNT}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={STAR_COUNT}
          array={new Float32Array(baseSizes)}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        map={starTexture}
        vertexColors
        size={3.0}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        alphaTest={0.01}
      />
    </points>
  );
}
