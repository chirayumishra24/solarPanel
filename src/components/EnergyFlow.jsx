import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 24;

export function EnergyFlow({ energy = 0, panelPosition = [0, 1.5, 0], targetPosition = [6, 0.5, 2] }) {
  const particlesRef = useRef();
  const offsetRef = useRef(0);

  // Build a realistic wire path: panel → down post → along ground → up to house
  const { curve, wireCurve } = useMemo(() => {
    const pStart = new THREE.Vector3(...panelPosition);
    const pEnd = new THREE.Vector3(...targetPosition);

    // Wire goes: panel bottom → ground level → horizontal run → up to house
    const pts = [
      pStart.clone(),
      new THREE.Vector3(pStart.x, 0.15, pStart.z),                    // down post
      new THREE.Vector3(pStart.x + 0.5, 0.08, pStart.z + 0.3),       // ground bend
      new THREE.Vector3((pStart.x + pEnd.x) * 0.5, 0.05, (pStart.z + pEnd.z) * 0.5), // mid ground
      new THREE.Vector3(pEnd.x - 0.5, 0.08, pEnd.z - 0.3),           // approach house
      new THREE.Vector3(pEnd.x, 0.15, pEnd.z),                        // up to house
      pEnd.clone(),
    ];

    const c = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.3);

    return { curve: c, wireCurve: c };
  }, [panelPosition[0], panelPosition[1], panelPosition[2],
      targetPosition[0], targetPosition[1], targetPosition[2]]);

  // Wire support poles
  const polePositions = useMemo(() => {
    return [0.15, 0.35, 0.55, 0.75].map((t) => {
      const p = curve.getPoint(t);
      return [p.x, 0, p.z];
    });
  }, [curve]);

  // Particle positions along wire
  const particlePositions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = i / PARTICLE_COUNT;
      const p = curve.getPoint(t);
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    }
    return arr;
  }, [curve]);

  useFrame((_, delta) => {
    if (!particlesRef.current || energy <= 0.01) return;

    offsetRef.current += delta * (0.3 + energy * 1.2);

    const posAttr = particlesRef.current.geometry.getAttribute('position');
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = ((i / PARTICLE_COUNT) + offsetRef.current) % 1;
      const p = curve.getPoint(t);
      posAttr.array[i * 3] = p.x;
      posAttr.array[i * 3 + 1] = p.y;
      posAttr.array[i * 3 + 2] = p.z;
    }
    posAttr.needsUpdate = true;
    particlesRef.current.material.opacity = 0.4 + energy * 0.6;
  });

  return (
    <group>
      {/* Physical wire/cable — always visible */}
      <mesh>
        <tubeGeometry args={[wireCurve, 48, 0.025, 6, false]} />
        <meshStandardMaterial
          color="#1a2a40"
          metalness={0.7}
          roughness={0.4}
          emissive="#4de0ff"
          emissiveIntensity={energy * 0.3}
        />
      </mesh>

      {/* Outer glow on wire when active */}
      {energy > 0.01 && (
        <mesh>
          <tubeGeometry args={[wireCurve, 48, 0.06, 6, false]} />
          <meshBasicMaterial
            color="#4de0ff"
            transparent
            opacity={energy * 0.12}
            toneMapped={false}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Wire support poles */}
      {polePositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[0.02, 0.025, 0.2, 6]} />
          <meshStandardMaterial color="#3a4050" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* Electricity particles flowing along the wire */}
      {energy > 0.01 && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={PARTICLE_COUNT}
              array={particlePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#4de0ff"
            size={0.12}
            sizeAttenuation
            transparent
            opacity={0.8}
            toneMapped={false}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Target: house */}
      <group position={targetPosition}>
        {/* House body */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[1, 0.7, 0.7]} />
          <meshStandardMaterial
            color="#0d1a2e"
            metalness={0.4}
            roughness={0.5}
            emissive="#4de0ff"
            emissiveIntensity={energy * 0.15}
          />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 0.85, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[0.7, 0.4, 4]} />
          <meshStandardMaterial
            color="#1a2845"
            metalness={0.3}
            roughness={0.6}
          />
        </mesh>
        {/* Window glow — brightness based on energy */}
        <mesh position={[0.15, 0.35, 0.351]}>
          <planeGeometry args={[0.2, 0.25]} />
          <meshBasicMaterial
            color={energy > 0.3 ? '#ffdd66' : '#223344'}
            transparent
            opacity={0.3 + energy * 0.7}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[-0.2, 0.35, 0.351]}>
          <planeGeometry args={[0.15, 0.25]} />
          <meshBasicMaterial
            color={energy > 0.3 ? '#ffdd66' : '#223344'}
            transparent
            opacity={0.3 + energy * 0.7}
            toneMapped={false}
          />
        </mesh>
        {/* Door */}
        <mesh position={[0, 0.18, 0.351]}>
          <planeGeometry args={[0.18, 0.35]} />
          <meshBasicMaterial color="#0a1220" />
        </mesh>
      </group>
    </group>
  );
}
