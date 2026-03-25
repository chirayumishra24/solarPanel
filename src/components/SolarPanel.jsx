import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PANEL_ROWS = 2;
const PANEL_COLS = 3;
const CELL_W = 1.6;
const CELL_H = 1.0;
const GAP = 0.15;
const FRAME_THICKNESS = 0.06;

export function SolarPanel({ tiltDeg = 30, energy = 0, onHover, onUnhover }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  const tiltRad = tiltDeg * (Math.PI / 180);

  // Panel cell material
  const cellMatRef = useRef();
  if (!cellMatRef.current) {
    cellMatRef.current = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.05, 0.07, 0.18),
      metalness: 0.3,
      roughness: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      reflectivity: 0.9,
      envMapIntensity: 1.2,
      emissive: new THREE.Color(0.0, 0.3, 0.8),
      emissiveIntensity: 0,
    });
  }
  const cellMat = cellMatRef.current;

  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: hovered ? new THREE.Color(0.3, 0.85, 1) : new THREE.Color(0.55, 0.58, 0.62),
    metalness: 0.9,
    roughness: 0.2,
  }), [hovered]);

  // Update emissive based on energy
  useFrame(() => {
    if (cellMat) {
      cellMat.emissiveIntensity = energy * 0.5;
      // Subtle pulsing effect
      const t = performance.now() * 0.001;
      cellMat.emissiveIntensity += Math.sin(t * 2) * 0.03 * energy;
    }
  });

  const totalW = PANEL_COLS * CELL_W + (PANEL_COLS - 1) * GAP;
  const totalH = PANEL_ROWS * CELL_H + (PANEL_ROWS - 1) * GAP;

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
    onHover?.();
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'auto';
    onUnhover?.();
  };

  return (
    <group
      ref={groupRef}
      position={[0, 1.5, 0]}
      rotation={[-tiltRad, 0, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Frame */}
      <mesh material={frameMat} castShadow receiveShadow>
        <boxGeometry args={[totalW + 0.2, totalH + 0.2, FRAME_THICKNESS]} />
      </mesh>

      {/* Solar cells */}
      {Array.from({ length: PANEL_ROWS * PANEL_COLS }, (_, i) => {
        const row = Math.floor(i / PANEL_COLS);
        const col = i % PANEL_COLS;
        const x = (col - (PANEL_COLS - 1) / 2) * (CELL_W + GAP);
        const y = (row - (PANEL_ROWS - 1) / 2) * (CELL_H + GAP);
        return (
          <mesh
            key={i}
            position={[x, y, FRAME_THICKNESS / 2 + 0.005]}
            material={cellMat}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[CELL_W, CELL_H, 0.02]} />
          </mesh>
        );
      })}

      {/* Cell grid lines on each panel */}
      {Array.from({ length: PANEL_ROWS * PANEL_COLS }, (_, i) => {
        const row = Math.floor(i / PANEL_COLS);
        const col = i % PANEL_COLS;
        const x = (col - (PANEL_COLS - 1) / 2) * (CELL_W + GAP);
        const y = (row - (PANEL_ROWS - 1) / 2) * (CELL_H + GAP);
        return (
          <group key={`grid-${i}`} position={[x, y, FRAME_THICKNESS / 2 + 0.03]}>
            {/* Horizontal lines */}
            {[0.25, 0.5, 0.75].map((f, li) => (
              <mesh key={`h-${li}`} position={[0, (f - 0.5) * CELL_H, 0]}>
                <boxGeometry args={[CELL_W, 0.008, 0.001]} />
                <meshBasicMaterial color="#1a2040" transparent opacity={0.6} />
              </mesh>
            ))}
            {/* Vertical lines */}
            {[0.25, 0.5, 0.75].map((f, li) => (
              <mesh key={`v-${li}`} position={[(f - 0.5) * CELL_W, 0, 0]}>
                <boxGeometry args={[0.008, CELL_H, 0.001]} />
                <meshBasicMaterial color="#1a2040" transparent opacity={0.6} />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* Support post */}
      <mesh position={[0, -totalH / 2 - 0.5, -0.3]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 1.5, 8]} />
        <meshStandardMaterial color="#404550" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Support arm angled */}
      <mesh
        position={[0, -totalH / 2 - 0.2, -0.15]}
        rotation={[0.3, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.03, 0.04, 1.0, 6]} />
        <meshStandardMaterial color="#404550" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}
