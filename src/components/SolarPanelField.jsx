import { useState, useMemo } from 'react';
import * as THREE from 'three';

/**
 * Background solar panel field — instanced rows of panels for a solar farm look.
 * These are decorative (non-interactive) and use instancing for performance.
 */
export function SolarPanelField({ tiltDeg = 30, energy = 0 }) {
  const tiltRad = tiltDeg * (Math.PI / 180);

  // Define grid positions for the field
  const [positions] = useState(() => {
    const pts = [];
    // Rows of panels behind and to the sides of the main panel
    for (let row = 0; row < 4; row++) {
      for (let col = -3; col <= 3; col++) {
        // Skip center position where the main interactive panel is
        if (row === 0 && col === 0) continue;

        const x = col * 4.5;
        const z = -row * 3.5 - 4;
        // Slight random offset for organic feel
        const xOff = (Math.random() - 0.5) * 0.3;
        const zOff = (Math.random() - 0.5) * 0.3;
        pts.push([x + xOff, 0, z + zOff]);
      }
    }
    return pts;
  });

  const cellMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0.05, 0.07, 0.18),
    metalness: 0.3,
    roughness: 0.2,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    emissive: new THREE.Color(0.0, 0.25, 0.65),
    emissiveIntensity: energy * 0.35,
  }), [energy]);

  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.45, 0.48, 0.52),
    metalness: 0.85,
    roughness: 0.25,
  }), []);

  const postMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#3a4050',
    metalness: 0.7,
    roughness: 0.35,
  }), []);

  // Panel dimensions (slightly smaller than main panel)
  const PW = 3.8;
  const PH = 2.0;

  return (
    <group>
      {positions.map((pos, i) => (
        <group key={i} position={[pos[0], 1.3, pos[2]]}>
          {/* Panel face - tilted */}
          <group rotation={[-tiltRad, 0, 0]}>
            {/* Frame */}
            <mesh material={frameMat} castShadow receiveShadow>
              <boxGeometry args={[PW + 0.12, PH + 0.12, 0.05]} />
            </mesh>
            {/* Glass surface */}
            <mesh material={cellMat} castShadow receiveShadow position={[0, 0, 0.03]}>
              <boxGeometry args={[PW, PH, 0.015]} />
            </mesh>
            {/* Cell grid lines */}
            {[-0.33, 0, 0.33].map((fy, li) => (
              <mesh key={`h-${li}`} position={[0, fy * PH * 0.5, 0.04]}>
                <boxGeometry args={[PW, 0.006, 0.001]} />
                <meshBasicMaterial color="#1a2040" transparent opacity={0.5} />
              </mesh>
            ))}
            {[-0.25, 0, 0.25].map((fx, li) => (
              <mesh key={`v-${li}`} position={[fx * PW, 0, 0.04]}>
                <boxGeometry args={[0.006, PH, 0.001]} />
                <meshBasicMaterial color="#1a2040" transparent opacity={0.5} />
              </mesh>
            ))}
          </group>
          {/* Support post */}
          <mesh position={[0, -0.65, -0.2]} material={postMat} castShadow>
            <cylinderGeometry args={[0.05, 0.07, 1.3, 6]} />
          </mesh>
          {/* Support arm */}
          <mesh position={[0, -0.4, -0.1]} rotation={[0.3, 0, 0]} material={postMat} castShadow>
            <cylinderGeometry args={[0.025, 0.035, 0.8, 6]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
