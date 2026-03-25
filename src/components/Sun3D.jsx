import { useRef } from 'react';
import * as THREE from 'three';

export function Sun3D({ position, sunColor, altitude }) {
  const lightRef = useRef();
  const meshRef = useRef();

  const altDeg = altitude * (180 / Math.PI);
  const isVisible = altDeg > -4;

  // Intensity scales with altitude
  const lightIntensity = altDeg > 0
    ? Math.min(altDeg / 30, 1) * 3.5
    : Math.max(0, (altDeg + 4) / 4) * 0.5;

  // Sun sphere gets larger near horizon (atmospheric lensing effect)
  const horizonFactor = altDeg > 0 && altDeg < 15 ? 1 + (1 - altDeg / 15) * 0.4 : 1;
  const sphereScale = 2.5 * horizonFactor;

  const color = new THREE.Color(sunColor.r, sunColor.g, sunColor.b);

  if (!isVisible) return null;

  return (
    <group position={position}>
      {/* Sun sphere */}
      <mesh ref={meshRef} scale={sphereScale}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>

      {/* Inner glow */}
      <mesh scale={sphereScale * 1.8}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {/* Outer halo */}
      <mesh scale={sphereScale * 3.5}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.06}
          toneMapped={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Directional light toward scene center */}
      <directionalLight
        ref={lightRef}
        color={color}
        intensity={lightIntensity}
        position={[0, 0, 0]}
        target-position={[-position[0], -position[1], -position[2]]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.1}
        shadow-camera-far={100}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.001}
      />
    </group>
  );
}
