import * as THREE from 'three';

/**
 * Moon mesh with soft glow — positioned opposite to the sun.
 */
export function Moon({ sunPosition, altitude }) {
  const altDeg = altitude * (180 / Math.PI);

  // Moon is visible when sun is below horizon
  if (altDeg > 2) return null;

  const opacity = altDeg < -6 ? 1 : Math.max(0, (2 - altDeg) / 8);

  // Place moon roughly opposite the sun, high in the night sky
  const moonX = -sunPosition[0] * 0.6;
  const moonY = Math.max(15, Math.abs(sunPosition[1]) * 0.8 + 20);
  const moonZ = -sunPosition[2] * 0.6;

  const moonColor = new THREE.Color(0.7, 0.75, 0.9);

  return (
    <group position={[moonX, moonY, moonZ]}>
      {/* Moon disc */}
      <mesh>
        <sphereGeometry args={[1.8, 24, 24]} />
        <meshBasicMaterial
          color={moonColor}
          transparent
          opacity={opacity * 0.95}
          toneMapped={false}
        />
      </mesh>

      {/* Inner glow */}
      <mesh scale={2.5}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#8090b8"
          transparent
          opacity={opacity * 0.12}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {/* Wide glow halo*/}
      <mesh scale={5}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial
          color="#6878a8"
          transparent
          opacity={opacity * 0.05}
          toneMapped={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Moonlight — directional light illuminating the scene */}
      <directionalLight
        color="#7088b8"
        intensity={opacity * 0.6}
        position={[0, 0, 0]}
        target-position={[-moonX, -moonY, -moonZ]}
      />
    </group>
  );
}
