import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Cylinder, Plane, Float, Text, RoundedBox, Cone, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/* ════════════════════════════════════════════════════════
   3D SOLAR CITY DIORAMA
   Interactive miniature world showing all 7 solar
   application types in their real-world context.
   Each installation glows when its scenario is active.
   ════════════════════════════════════════════════════════ */

/* ─── Dynamic Daytime Sky ─── */
function DynamicSky({ sunAngle }) {
  const { scene } = useThree();
  useFrame(() => {
    const h = Math.sin(sunAngle);
    const r = 0.45 + h * 0.1;
    const g = 0.70 + h * 0.12;
    const b = 0.88 + h * 0.06;
    scene.background = new THREE.Color(r, g, b);
  });
  return null;
}

/* ─── Moving Sun (directional light) ─── */
function SunLight({ sunAngle }) {
  const x = Math.cos(sunAngle) * 30;
  const y = Math.max(Math.sin(sunAngle) * 30 + 5, 8);
  return (
    <directionalLight
      position={[x, y, -10]}
      intensity={2.5}
      color="#fff5e0"
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-left={-20}
      shadow-camera-right={20}
      shadow-camera-top={20}
      shadow-camera-bottom={-20}
      shadow-camera-near={1}
      shadow-camera-far={80}
    />
  );
}

/* ─── Selection Beacon (glows over the active installation) ─── */
function SelectionBeacon({ position, color, label }) {
  const ringRef = useRef();
  const beamRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 1.5;
      ringRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.08);
    }
    if (beamRef.current) {
      beamRef.current.material.opacity = 0.15 + Math.sin(t * 4) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Pulsing ring at ground level */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[1.6, 1.85, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Vertical light beam */}
      <mesh ref={beamRef} position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 5, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
      {/* Floating label */}
      <Float speed={3} floatIntensity={0.2}>
        <Text
          position={[0, 5.5, 0]}
          fontSize={0.35}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          {label}
        </Text>
      </Float>
    </group>
  );
}

/* ─── Tree (reusable) ─── */
function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <Cylinder args={[0.06, 0.08, 0.6, 6]} position={[0, 0.3, 0]} castShadow>
        <meshStandardMaterial color="#5d4037" />
      </Cylinder>
      <Cone args={[0.3, 0.7, 8]} position={[0, 0.85, 0]} castShadow>
        <meshStandardMaterial color="#2e7d32" />
      </Cone>
      <Cone args={[0.22, 0.5, 8]} position={[0, 1.2, 0]} castShadow>
        <meshStandardMaterial color="#388e3c" />
      </Cone>
    </group>
  );
}

/* ─── Reusable Solar Panel ─── */
function SolarPanel({ position, rotation = [0, 0, 0], scale = 1, selected }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Box args={[0.5, 0.02, 0.35]} castShadow>
        <meshStandardMaterial
          color="#1a3a5c"
          metalness={0.85}
          roughness={0.15}
          emissive={selected ? "#4dd0e1" : "#000000"}
          emissiveIntensity={selected ? 0.5 : 0}
        />
      </Box>
      <Box args={[0.52, 0.025, 0.37]}>
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.3} />
      </Box>
    </group>
  );
}

/* ═════════════════════════════════════
   INSTALLATION COMPONENTS (7 types)
   ═════════════════════════════════════ */

/* 1 ─ Residential House with Rooftop Solar */
function ResidentialHouse({ selected }) {
  const em = selected ? 0.35 : 0;
  return (
    <group position={[-5, 0, -3.5]}>
      {/* House body */}
      <Box args={[1.8, 1.2, 1.4]} position={[0, 0.6, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#e8d5b7" emissive="#e67e22" emissiveIntensity={em} />
      </Box>
      {/* Roof halves */}
      <Box args={[2.0, 0.08, 1.1]} position={[0, 1.35, -0.35]} rotation={[0.45, 0, 0]} castShadow>
        <meshStandardMaterial color="#8b4513" />
      </Box>
      <Box args={[2.0, 0.08, 1.1]} position={[0, 1.35, 0.35]} rotation={[-0.45, 0, 0]} castShadow>
        <meshStandardMaterial color="#8b4513" />
      </Box>
      {/* Solar panels on roof */}
      <SolarPanel position={[-0.3, 1.55, -0.35]} rotation={[0.45, 0, 0]} selected={selected} />
      <SolarPanel position={[0.3, 1.55, -0.35]} rotation={[0.45, 0, 0]} selected={selected} />
      {/* Windows */}
      <Box args={[0.3, 0.3, 0.02]} position={[-0.45, 0.8, 0.71]}>
        <meshStandardMaterial color="#87CEEB" metalness={0.5} roughness={0.2} />
      </Box>
      <Box args={[0.3, 0.3, 0.02]} position={[0.45, 0.8, 0.71]}>
        <meshStandardMaterial color="#87CEEB" metalness={0.5} roughness={0.2} />
      </Box>
      {/* Door */}
      <Box args={[0.35, 0.55, 0.02]} position={[0, 0.28, 0.71]}>
        <meshStandardMaterial color="#6d4c2a" />
      </Box>
      {/* White fence */}
      {[-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2].map((x, i) => (
        <Cylinder key={i} args={[0.02, 0.02, 0.35, 6]} position={[x, 0.18, 1.15]} castShadow>
          <meshStandardMaterial color="#fff" />
        </Cylinder>
      ))}
      {/* Fence cross-rail */}
      <Box args={[2.4, 0.03, 0.02]} position={[0, 0.25, 1.15]}>
        <meshStandardMaterial color="#fff" />
      </Box>
      {/* Garden patch */}
      <Box args={[2.5, 0.02, 0.4]} position={[0, 0.005, 1.4]} receiveShadow>
        <meshStandardMaterial color="#4caf50" />
      </Box>
      {/* Mailbox */}
      <Cylinder args={[0.03, 0.03, 0.4, 6]} position={[1.3, 0.2, 1.15]} castShadow>
        <meshStandardMaterial color="#333" />
      </Cylinder>
      <Box args={[0.12, 0.1, 0.08]} position={[1.3, 0.45, 1.15]} castShadow>
        <meshStandardMaterial color="#e53935" />
      </Box>
    </group>
  );
}

/* 2 ─ Space Station (orbiting above the diorama) */
function SpaceStation({ selected }) {
  const stationRef = useRef();
  useFrame((state) => {
    if (stationRef.current) {
      const t = state.clock.elapsedTime * 0.12;
      stationRef.current.position.x = Math.cos(t) * 5;
      stationRef.current.position.z = Math.sin(t) * 5;
      stationRef.current.rotation.y = t;
    }
  });
  const em = selected ? 0.45 : 0;
  return (
    <group ref={stationRef} position={[0, 8, 0]}>
      {/* Central habitation module */}
      <Cylinder args={[0.15, 0.15, 1.0, 8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <meshStandardMaterial color="#ccc" metalness={0.7} roughness={0.3} emissive="#8e44ad" emissiveIntensity={em} />
      </Cylinder>
      {/* Node module (perpendicular) */}
      <Cylinder args={[0.1, 0.1, 0.5, 8]} castShadow>
        <meshStandardMaterial color="#bbb" metalness={0.6} roughness={0.4} />
      </Cylinder>
      {/* Solar wing — left array */}
      <group position={[-0.7, 0, 0]}>
        <Box args={[0.05, 1.4, 0.5]} castShadow>
          <meshStandardMaterial color="#1a3a5c" metalness={0.85} roughness={0.15} emissive="#4dd0e1" emissiveIntensity={selected ? 0.6 : 0} />
        </Box>
        {/* Support truss */}
        <Box args={[0.25, 0.02, 0.02]} position={[0.12, 0, 0]}>
          <meshStandardMaterial color="#999" metalness={0.7} />
        </Box>
      </group>
      {/* Solar wing — right array */}
      <group position={[0.7, 0, 0]}>
        <Box args={[0.05, 1.4, 0.5]} castShadow>
          <meshStandardMaterial color="#1a3a5c" metalness={0.85} roughness={0.15} emissive="#4dd0e1" emissiveIntensity={selected ? 0.6 : 0} />
        </Box>
        <Box args={[0.25, 0.02, 0.02]} position={[-0.12, 0, 0]}>
          <meshStandardMaterial color="#999" metalness={0.7} />
        </Box>
      </group>
      {/* Radiator panel */}
      <Box args={[0.04, 0.15, 0.7]} position={[0, 0.2, 0]} castShadow>
        <meshStandardMaterial color="#ddd" metalness={0.6} />
      </Box>
      {/* Antenna */}
      <Cylinder args={[0.008, 0.008, 0.35, 4]} position={[0, -0.15, 0.4]}>
        <meshStandardMaterial color="#fff" />
      </Cylinder>
      <Sphere args={[0.025, 8, 8]} position={[0, -0.15, 0.58]}>
        <meshStandardMaterial color="#eee" metalness={0.5} />
      </Sphere>
      {/* Selected sparkle effect */}
      {selected && (
        <Sparkles count={50} scale={2.5} size={3} speed={0.5} color="#8e44ad" opacity={0.6} />
      )}
    </group>
  );
}

/* 3 ─ Farm with Solar Water Pump (Agriculture) */
function FarmArea({ selected }) {
  const em = selected ? 0.3 : 0;
  return (
    <group position={[-5, 0, 3.5]}>
      {/* Crop field rows */}
      {[0, 0.3, 0.6, 0.9, 1.2].map((z, i) => (
        <Box key={i} args={[2.5, 0.08, 0.12]} position={[0, 0.04, z - 0.3]} receiveShadow>
          <meshStandardMaterial color="#558b2f" />
        </Box>
      ))}
      {/* Tilled earth between rows */}
      <Plane args={[2.5, 1.6]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0.3]} receiveShadow>
        <meshStandardMaterial color="#6d4c41" roughness={0.95} />
      </Plane>
      {/* Solar pump structure */}
      <group position={[1.6, 0, 0.6]}>
        <Cylinder args={[0.08, 0.08, 0.8, 8]} position={[0, 0.4, 0]} castShadow>
          <meshStandardMaterial color="#666" metalness={0.6} />
        </Cylinder>
        <SolarPanel position={[0, 0.9, 0]} rotation={[-0.5, 0, 0]} scale={0.8} selected={selected} />
        {/* Water pipe */}
        <Cylinder args={[0.025, 0.025, 1.2, 6]} position={[-0.7, 0.15, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <meshStandardMaterial color="#607d8b" metalness={0.5} />
        </Cylinder>
      </group>
      {/* Well */}
      <Cylinder args={[0.2, 0.2, 0.3, 12]} position={[1.6, 0.15, -0.3]} castShadow>
        <meshStandardMaterial color="#795548" />
      </Cylinder>
      <Cylinder args={[0.15, 0.15, 0.05, 12]} position={[1.6, 0.32, -0.3]}>
        <meshStandardMaterial color="#2196f3" metalness={0.3} emissive="#27ae60" emissiveIntensity={em} />
      </Cylinder>
      {/* Small barn */}
      <Box args={[0.8, 0.6, 0.6]} position={[-1.0, 0.3, 0.6]} castShadow>
        <meshStandardMaterial color="#a1887f" emissive="#27ae60" emissiveIntensity={em} />
      </Box>
      <Box args={[0.9, 0.08, 0.7]} position={[-1.0, 0.65, 0.6]} castShadow>
        <meshStandardMaterial color="#6d4c41" />
      </Box>
      {/* Scarecrow */}
      <Cylinder args={[0.02, 0.02, 0.7, 4]} position={[0.5, 0.35, 0.9]} castShadow>
        <meshStandardMaterial color="#5d4037" />
      </Cylinder>
      <Box args={[0.5, 0.02, 0.02]} position={[0.5, 0.55, 0.9]}>
        <meshStandardMaterial color="#5d4037" />
      </Box>
      <Sphere args={[0.06, 8, 8]} position={[0.5, 0.75, 0.9]}>
        <meshStandardMaterial color="#ffcc80" />
      </Sphere>
    </group>
  );
}

/* 4 ─ Hiker with Portable Solar Panel */
function PortableHiker({ selected }) {
  const em = selected ? 0.4 : 0;
  return (
    <group position={[0, 0, -6]}>
      {/* Rocky terrain / small mountain */}
      <Cone args={[1.2, 1.8, 8]} position={[-0.5, 0.9, -0.5]} castShadow>
        <meshStandardMaterial color="#8d6e63" roughness={0.95} />
      </Cone>
      <Cone args={[0.7, 1.2, 6]} position={[0.8, 0.6, -0.8]} castShadow>
        <meshStandardMaterial color="#795548" roughness={0.95} />
      </Cone>
      {/* Snow cap on larger peak */}
      <Cone args={[0.3, 0.3, 8]} position={[-0.5, 1.65, -0.5]} castShadow>
        <meshStandardMaterial color="#fff" roughness={0.5} />
      </Cone>
      {/* Hiker figure */}
      <group position={[0.3, 0, 0.5]}>
        {/* Body */}
        <Cylinder args={[0.08, 0.06, 0.5, 8]} position={[0, 0.45, 0]} castShadow>
          <meshStandardMaterial color="#e53935" emissive="#3498db" emissiveIntensity={em} />
        </Cylinder>
        {/* Head */}
        <Sphere args={[0.1, 16, 16]} position={[0, 0.8, 0]} castShadow>
          <meshStandardMaterial color="#ffcc80" />
        </Sphere>
        {/* Hat */}
        <Cylinder args={[0.12, 0.14, 0.05, 12]} position={[0, 0.9, 0]} castShadow>
          <meshStandardMaterial color="#ff8f00" />
        </Cylinder>
        {/* Legs */}
        <Cylinder args={[0.03, 0.03, 0.3, 6]} position={[-0.05, 0.1, 0]}>
          <meshStandardMaterial color="#1565c0" />
        </Cylinder>
        <Cylinder args={[0.03, 0.03, 0.3, 6]} position={[0.05, 0.1, 0]}>
          <meshStandardMaterial color="#1565c0" />
        </Cylinder>
        {/* Backpack */}
        <Box args={[0.14, 0.22, 0.1]} position={[0, 0.52, -0.09]} castShadow>
          <meshStandardMaterial color="#ff8f00" />
        </Box>
        {/* Solar panel on backpack */}
        <Box args={[0.13, 0.14, 0.02]} position={[0, 0.57, -0.15]} castShadow>
          <meshStandardMaterial color="#1a3a5c" metalness={0.85} roughness={0.15} emissive="#4dd0e1" emissiveIntensity={selected ? 0.6 : 0} />
        </Box>
        {/* Hiking stick */}
        <Cylinder args={[0.012, 0.012, 0.7, 4]} position={[0.15, 0.28, 0.05]} rotation={[0.15, 0, -0.1]}>
          <meshStandardMaterial color="#5d4037" />
        </Cylinder>
      </group>
      {/* Hiking trail/path */}
      <Box args={[3.5, 0.01, 0.3]} position={[0, 0.005, 1.0]} rotation={[0, 0.3, 0]}>
        <meshStandardMaterial color="#a1887f" roughness={0.9} />
      </Box>
      {/* Small campfire */}
      <group position={[-0.8, 0, 0.7]}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Cylinder key={i} args={[0.03, 0.03, 0.12, 4]}
            position={[Math.cos(i * Math.PI / 3) * 0.1, 0.06, Math.sin(i * Math.PI / 3) * 0.1]} castShadow>
            <meshStandardMaterial color="#795548" />
          </Cylinder>
        ))}
        <Sphere args={[0.04, 8, 8]} position={[0, 0.12, 0]}>
          <meshStandardMaterial color="#ff6600" emissive="#ff4400" emissiveIntensity={0.5} />
        </Sphere>
        <Sparkles count={8} scale={0.15} size={2} speed={1.5} color="#ff6600" opacity={0.8} />
      </group>
    </group>
  );
}

/* 5 ─ BIPV Glass Skyscraper */
function BIPVSkyscraper({ selected }) {
  const em = selected ? 0.3 : 0;
  return (
    <group position={[5, 0, -3.5]}>
      {/* Main glass tower */}
      <Box args={[1.2, 3.5, 1.0]} position={[0, 1.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color="#4fc3f7"
          metalness={0.7}
          roughness={0.1}
          transparent
          opacity={0.75}
          emissive="#1abc9c"
          emissiveIntensity={em}
        />
      </Box>
      {/* Floor separator lines */}
      {[0.5, 1.0, 1.5, 2.0, 2.5, 3.0].map((y, i) => (
        <Box key={i} args={[1.22, 0.02, 1.02]} position={[0, y, 0]}>
          <meshStandardMaterial color="#b0bec5" metalness={0.6} />
        </Box>
      ))}
      {/* Roof */}
      <Box args={[1.3, 0.06, 1.1]} position={[0, 3.53, 0]} castShadow>
        <meshStandardMaterial color="#78909c" metalness={0.7} />
      </Box>
      {/* Helipad circle on roof */}
      <Cylinder args={[0.3, 0.3, 0.01, 24]} position={[0, 3.57, 0]}>
        <meshStandardMaterial color="#fdd835" />
      </Cylinder>
      {/* Ground plaza */}
      <Box args={[2.5, 0.02, 2.0]} position={[0, 0.005, 0]} receiveShadow>
        <meshStandardMaterial color="#cfd8dc" roughness={0.8} />
      </Box>
      {/* Entrance */}
      <Box args={[0.5, 0.6, 0.02]} position={[0, 0.3, 0.51]}>
        <meshStandardMaterial color="#263238" metalness={0.5} />
      </Box>
      {/* Revolving door indicator */}
      <Cylinder args={[0.12, 0.12, 0.55, 12]} position={[0, 0.28, 0.52]}>
        <meshStandardMaterial color="#90a4ae" transparent opacity={0.4} />
      </Cylinder>
      {/* Side shorter building */}
      <Box args={[0.6, 1.5, 0.8]} position={[1.2, 0.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color="#80deea"
          metalness={0.6}
          roughness={0.2}
          transparent
          opacity={0.65}
          emissive="#1abc9c"
          emissiveIntensity={em * 0.5}
        />
      </Box>
    </group>
  );
}

/* 6 ─ EV with Solar Roof (Transport) */
function TransportEV({ selected }) {
  const em = selected ? 0.3 : 0;
  return (
    <group position={[5, 0, 3.5]}>
      {/* Car body */}
      <RoundedBox args={[1.2, 0.4, 0.6]} radius={0.08} position={[0, 0.3, 0]} castShadow>
        <meshStandardMaterial color="#e0e0e0" metalness={0.5} roughness={0.3} emissive="#e74c3c" emissiveIntensity={em} />
      </RoundedBox>
      {/* Cabin */}
      <RoundedBox args={[0.7, 0.3, 0.55]} radius={0.06} position={[0.05, 0.6, 0]} castShadow>
        <meshStandardMaterial color="#90a4ae" metalness={0.6} roughness={0.2} transparent opacity={0.8} />
      </RoundedBox>
      {/* Solar roof panel */}
      <Box args={[0.72, 0.02, 0.57]} position={[0.05, 0.76, 0]} castShadow>
        <meshStandardMaterial color="#1a3a5c" metalness={0.85} roughness={0.15} emissive="#4dd0e1" emissiveIntensity={selected ? 0.6 : 0} />
      </Box>
      {/* Wheels */}
      {[[-0.35, 0.12, 0.32], [-0.35, 0.12, -0.32], [0.35, 0.12, 0.32], [0.35, 0.12, -0.32]].map((pos, i) => (
        <Cylinder key={i} args={[0.1, 0.1, 0.06, 16]} position={pos} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <meshStandardMaterial color="#212121" roughness={0.9} />
        </Cylinder>
      ))}
      {/* Headlights */}
      <Sphere args={[0.04, 8, 8]} position={[-0.6, 0.32, 0.18]}>
        <meshStandardMaterial color="#fff" emissive="#fdd835" emissiveIntensity={0.3} />
      </Sphere>
      <Sphere args={[0.04, 8, 8]} position={[-0.6, 0.32, -0.18]}>
        <meshStandardMaterial color="#fff" emissive="#fdd835" emissiveIntensity={0.3} />
      </Sphere>
      {/* Charging station */}
      <group position={[1.2, 0, 0]}>
        <Box args={[0.18, 0.9, 0.18]} position={[0, 0.45, 0]} castShadow>
          <meshStandardMaterial color="#4caf50" emissive="#4caf50" emissiveIntensity={selected ? 0.35 : 0.05} />
        </Box>
        <Sphere args={[0.08, 12, 12]} position={[0, 0.95, 0]}>
          <meshStandardMaterial color="#76ff03" emissive="#76ff03" emissiveIntensity={0.4} />
        </Sphere>
        {/* Charging status screen */}
        <Box args={[0.12, 0.08, 0.01]} position={[0, 0.65, 0.1]}>
          <meshStandardMaterial color="#00e676" emissive="#00e676" emissiveIntensity={0.5} />
        </Box>
        {/* Cable to car */}
        <Cylinder args={[0.012, 0.012, 0.6, 6]} position={[-0.35, 0.4, 0]} rotation={[0, 0, -0.6]}>
          <meshStandardMaterial color="#333" />
        </Cylinder>
      </group>
      {/* Parking area ground */}
      <Box args={[2.8, 0.005, 1.5]} position={[0.3, 0.003, 0]} receiveShadow>
        <meshStandardMaterial color="#546e7a" roughness={0.9} />
      </Box>
      {/* Parking lines */}
      <Box args={[0.04, 0.007, 1.0]} position={[-0.8, 0.006, 0]}>
        <meshStandardMaterial color="#fdd835" />
      </Box>
      <Box args={[0.04, 0.007, 1.0]} position={[1.4, 0.006, 0]}>
        <meshStandardMaterial color="#fdd835" />
      </Box>
    </group>
  );
}

/* 7 ─ Floating Solar on Reservoir */
function FloatingPanels({ selected }) {
  const waterRef = useRef();
  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.material.opacity = 0.65 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });
  const em = selected ? 0.25 : 0;
  return (
    <group position={[0, 0, 6]}>
      {/* Water body */}
      <Plane ref={waterRef} args={[4.5, 3.5]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
        <meshStandardMaterial color="#1565c0" transparent opacity={0.7} metalness={0.4} roughness={0.3} emissive="#2980b9" emissiveIntensity={em * 0.4} />
      </Plane>
      {/* Floating panel arrays — 3x3 grid */}
      {[
        [-0.9, 0.06, -0.6], [-0.2, 0.06, -0.6], [0.5, 0.06, -0.6],
        [-0.9, 0.06, 0.1],  [-0.2, 0.06, 0.1],  [0.5, 0.06, 0.1],
        [-0.5, 0.06, 0.8],  [0.2, 0.06, 0.8],   [0.9, 0.06, 0.8],
      ].map((pos, i) => (
        <group key={i} position={pos}>
          <Box args={[0.5, 0.02, 0.4]} castShadow>
            <meshStandardMaterial color="#1a3a5c" metalness={0.85} roughness={0.15} emissive="#4dd0e1" emissiveIntensity={selected ? 0.5 : 0} />
          </Box>
          {/* Pontoon floats */}
          <Cylinder args={[0.035, 0.035, 0.55, 6]} position={[0, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color="#ffa726" />
          </Cylinder>
        </group>
      ))}
      {/* Buoy markers */}
      <Sphere args={[0.06, 10, 10]} position={[1.8, 0.06, 1.0]}>
        <meshStandardMaterial color="#f44336" emissive="#f44336" emissiveIntensity={0.3} />
      </Sphere>
      <Sphere args={[0.06, 10, 10]} position={[-1.8, 0.06, -1.0]}>
        <meshStandardMaterial color="#f44336" emissive="#f44336" emissiveIntensity={0.3} />
      </Sphere>
      {/* Shore edges */}
      <Box args={[4.7, 0.08, 0.2]} position={[0, 0.01, -1.8]}>
        <meshStandardMaterial color="#795548" roughness={0.9} />
      </Box>
      <Box args={[4.7, 0.08, 0.2]} position={[0, 0.01, 1.8]}>
        <meshStandardMaterial color="#795548" roughness={0.9} />
      </Box>
      <Box args={[0.2, 0.08, 3.6]} position={[-2.35, 0.01, 0]}>
        <meshStandardMaterial color="#795548" roughness={0.9} />
      </Box>
      <Box args={[0.2, 0.08, 3.6]} position={[2.35, 0.01, 0]}>
        <meshStandardMaterial color="#795548" roughness={0.9} />
      </Box>
      {/* Small wooden jetty */}
      <Box args={[0.3, 0.04, 1.0]} position={[1.8, 0.03, -1.3]}>
        <meshStandardMaterial color="#8d6e63" />
      </Box>
    </group>
  );
}

/* ─── MAIN DIORAMA SCENE ─── */
function DioramaScene({ highlightType }) {
  const [sunAngle, setSunAngle] = useState(Math.PI * 0.5);

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.15;
    setSunAngle(Math.PI * 0.5 + Math.sin(t) * Math.PI * 0.3);
  });

  const LABELS = {
    residential: '🏠 Residential Solar',
    space: '🚀 Space Solar',
    agriculture: '🌾 Agri-Solar Pump',
    portable: '🎒 Portable Solar',
    bipv: '🏗️ BIPV Glass',
    transport: '🚗 Solar EV',
    floating: '💧 Floating Solar',
  };

  const POSITIONS = {
    residential: [-5, 0, -3.5],
    space: [0, 8, 0],
    agriculture: [-5, 0, 3.5],
    portable: [0, 0, -6],
    bipv: [5, 0, -3.5],
    transport: [5, 0, 3.5],
    floating: [0, 0, 6],
  };

  const COLORS = {
    residential: '#e67e22',
    space: '#8e44ad',
    agriculture: '#27ae60',
    portable: '#3498db',
    bipv: '#1abc9c',
    transport: '#e74c3c',
    floating: '#2980b9',
  };

  return (
    <>
      <DynamicSky sunAngle={sunAngle} />
      <SunLight sunAngle={sunAngle} />
      <ambientLight intensity={0.5} />
      <hemisphereLight groundColor="#3e2723" skyColor="#87CEEB" intensity={0.55} />

      {/* ── Ground ── */}
      <Plane args={[35, 35]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <meshStandardMaterial color="#4a7c3f" roughness={0.85} />
      </Plane>

      {/* ── Roads (cross pattern with roundabout) ── */}
      <Box args={[20, 0.01, 1.2]} position={[0, 0.005, 0]} receiveShadow>
        <meshStandardMaterial color="#616161" roughness={0.9} />
      </Box>
      <Box args={[1.2, 0.01, 20]} position={[0, 0.005, 0]} receiveShadow>
        <meshStandardMaterial color="#616161" roughness={0.9} />
      </Box>
      {/* Center roundabout */}
      <Cylinder args={[1.0, 1.0, 0.015, 32]} position={[0, 0.008, 0]}>
        <meshStandardMaterial color="#616161" roughness={0.85} />
      </Cylinder>
      <Cylinder args={[0.6, 0.6, 0.03, 24]} position={[0, 0.02, 0]}>
        <meshStandardMaterial color="#4caf50" roughness={0.8} />
      </Cylinder>
      {/* Mini fountain in roundabout */}
      <Cylinder args={[0.1, 0.15, 0.15, 12]} position={[0, 0.1, 0]} castShadow>
        <meshStandardMaterial color="#90a4ae" metalness={0.5} />
      </Cylinder>
      <Sphere args={[0.05, 12, 12]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#4fc3f7" emissive="#4fc3f7" emissiveIntensity={0.3} />
      </Sphere>

      {/* Road markings — dashed center lines */}
      {[-8, -6, -4, -2, 2, 4, 6, 8].map((x, i) => (
        <Box key={`hm${i}`} args={[0.8, 0.012, 0.06]} position={[x, 0.012, 0]}>
          <meshStandardMaterial color="#fdd835" />
        </Box>
      ))}
      {[-8, -6, -4, -2, 2, 4, 6, 8].map((z, i) => (
        <Box key={`vm${i}`} args={[0.06, 0.012, 0.8]} position={[0, 0.012, z]}>
          <meshStandardMaterial color="#fdd835" />
        </Box>
      ))}

      {/* ── Trees scattered ── */}
      <Tree position={[-2.5, 0, -2.2]} />
      <Tree position={[2.5, 0, -2.2]} />
      <Tree position={[-2.5, 0, 2.2]} />
      <Tree position={[2.5, 0, 2.2]} />
      <Tree position={[-7.5, 0, 0]} scale={1.2} />
      <Tree position={[7.5, 0, 0]} scale={0.9} />
      <Tree position={[-3.5, 0, -5.5]} scale={0.8} />
      <Tree position={[3.5, 0, 5.5]} scale={1.1} />
      <Tree position={[-8, 0, -7]} />
      <Tree position={[8, 0, -7]} scale={0.9} />
      <Tree position={[-8, 0, 7]} scale={1.1} />
      <Tree position={[8, 0, 7]} />
      <Tree position={[-3, 0, 7.5]} scale={0.7} />
      <Tree position={[3, 0, -7.5]} scale={1.3} />

      {/* ── Street lights ── */}
      {[[-3, 0.6], [3, 0.6], [-3, -0.6], [3, -0.6]].map(([x, z], i) => (
        <group key={`sl${i}`}>
          <Cylinder args={[0.025, 0.025, 1.2, 6]} position={[x, 0.6, z]} castShadow>
            <meshStandardMaterial color="#666" metalness={0.7} />
          </Cylinder>
          <Sphere args={[0.05, 8, 8]} position={[x, 1.25, z]}>
            <meshStandardMaterial color="#fff9c4" emissive="#fdd835" emissiveIntensity={0.2} />
          </Sphere>
        </group>
      ))}

      {/* ═══ The 7 Installations ═══ */}
      <ResidentialHouse selected={highlightType === 'residential'} />
      <SpaceStation selected={highlightType === 'space'} />
      <FarmArea selected={highlightType === 'agriculture'} />
      <PortableHiker selected={highlightType === 'portable'} />
      <BIPVSkyscraper selected={highlightType === 'bipv'} />
      <TransportEV selected={highlightType === 'transport'} />
      <FloatingPanels selected={highlightType === 'floating'} />

      {/* ═══ Selection Beacon ═══ */}
      {highlightType && POSITIONS[highlightType] && (
        <SelectionBeacon
          position={POSITIONS[highlightType]}
          color={COLORS[highlightType]}
          label={LABELS[highlightType]}
        />
      )}

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        maxDistance={25}
        minDistance={5}
        autoRotate
        autoRotateSpeed={0.4}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 6}
      />
    </>
  );
}

/* ═══════════════════════════════════════════
   QUIZ DATA & UI (unchanged from before)
   ═══════════════════════════════════════════ */

const SCENARIOS = [
  { id: 1, scenario: 'A family in Mumbai wants to reduce their monthly electricity bill and run their AC using the sun.', correct: 'residential', explanation: 'Rooftop residential solar is perfect for powering home appliances and reducing grid dependency!' },
  { id: 2, scenario: 'An astronaut on the International Space Station needs to power the station\'s systems 24/7.', correct: 'space', explanation: 'In space, there are no clouds or night — solar wings provide constant power to satellites and the ISS!' },
  { id: 3, scenario: 'A farmer in rural Rajasthan needs to pump water from a well without any diesel.', correct: 'agriculture', explanation: 'Solar water pumping (Agrivoltaics) replaces diesel pumps, saving money and the environment!' },
  { id: 4, scenario: 'A hiker trekking through the Himalayas needs to keep their GPS charged while walking.', correct: 'portable', explanation: 'Portable solar panels on backpacks can charge devices on the go — perfect for remote adventures!' },
  { id: 5, scenario: 'An architect is designing a glass skyscraper in Delhi that should generate its own power without ugly panels.', correct: 'bipv', explanation: 'Building-Integrated Photovoltaics (BIPV) use transparent solar glass that generates power without blocking the view!' },
  { id: 6, scenario: 'A logistics company wants their electric delivery vans to gain extra range while parked in the sun.', correct: 'transport', explanation: 'Solar roofs on EVs can add 15-30km of range per day just from parking in the sun!' },
  { id: 7, scenario: 'A city has a large reservoir and wants to generate power without wasting any farmland.', correct: 'floating', explanation: 'Floatovoltaics (floating solar) save land, reduce water evaporation, and the water naturally cools the panels for 5-10% more efficiency!' },
];

const APPLICATION_TYPES = [
  { id: 'residential', label: '🏠 Residential', color: '#e67e22' },
  { id: 'space', label: '🚀 Space', color: '#8e44ad' },
  { id: 'agriculture', label: '🌾 Agriculture', color: '#27ae60' },
  { id: 'portable', label: '🎒 Portable', color: '#3498db' },
  { id: 'bipv', label: '🏗️ BIPV', color: '#1abc9c' },
  { id: 'transport', label: '🚗 Transport', color: '#e74c3c' },
  { id: 'floating', label: '💧 Floating', color: '#2980b9' },
];

export default function SolarApplicationMatcher() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const current = SCENARIOS[currentIdx];
  const totalCorrect = Object.entries(answers).filter(([id, ans]) => {
    const s = SCENARIOS.find(sc => sc.id === parseInt(id));
    return s && s.correct === ans;
  }).length;

  const handleSelect = (typeId) => {
    if (showResult) return;
    setAnswers(prev => ({ ...prev, [current.id]: typeId }));
    setShowResult(true);
  };

  const handleNext = () => { setShowResult(false); if (currentIdx < SCENARIOS.length - 1) setCurrentIdx(prev => prev + 1); };
  const handlePrev = () => { setShowResult(false); if (currentIdx > 0) setCurrentIdx(prev => prev - 1); };
  const handleReset = () => { setCurrentIdx(0); setAnswers({}); setShowResult(false); };

  const isCorrect = answers[current.id] === current.correct;
  const isAnswered = answers[current.id] !== undefined;
  const allDone = Object.keys(answers).length === SCENARIOS.length;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: '#0f1923', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* 3D Diorama Viewer */}
      <div style={{ width: '380px', flexShrink: 0, position: 'relative' }}>
        <Canvas camera={{ position: [10, 12, 14], fov: 50 }} shadows>
          <DioramaScene highlightType={current.correct} />
        </Canvas>
        <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: '#8b949e', textAlign: 'center', pointerEvents: 'none', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
          🏙️ Drag to explore the city • Scroll to zoom
        </div>
      </div>

      {/* Quiz Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderLeft: '2px solid #30363d' }}>
        {/* Header */}
        <div style={{ padding: '14px 20px', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderBottom: '2px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', color: '#FFB800', fontSize: '18px' }}>🏙️ Solar Application Matcher</h3>
            <p style={{ margin: 0, color: '#8b949e', fontSize: '12px' }}>Match the scenario to the correct solar application in the city!</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', color: '#8b949e' }}>Score: <strong style={{ color: '#4CAF50' }}>{totalCorrect}</strong>/{SCENARIOS.length}</span>
            <button onClick={handleReset} style={{ padding: '5px 12px', background: '#da3633', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Reset</button>
          </div>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '5px', padding: '10px 20px', justifyContent: 'center', flexShrink: 0 }}>
          {SCENARIOS.map((s, i) => {
            const ans = answers[s.id];
            return (
              <button key={s.id} onClick={() => { setCurrentIdx(i); setShowResult(!!answers[s.id]); }}
                style={{ width: '26px', height: '26px', borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold',
                  background: i === currentIdx ? '#FFB800' : ans ? (ans === s.correct ? '#238636' : '#da3633') : '#30363d',
                  color: i === currentIdx ? '#000' : '#fff', transition: 'all 0.2s' }}>
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 20px 16px', gap: '12px', overflow: 'auto' }}>
          {/* Scenario */}
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '16px', flexShrink: 0 }}>
            <div style={{ fontSize: '10px', color: '#8b949e', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Scenario {currentIdx + 1} of {SCENARIOS.length}</div>
            <p style={{ fontSize: '15px', lineHeight: '1.5', margin: 0 }}>{current.scenario}</p>
          </div>

          {/* Answer Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
            {APPLICATION_TYPES.map(type => {
              const selected = answers[current.id] === type.id;
              const isCorrectAnswer = current.correct === type.id;
              let bg = `${type.color}22`, border = `${type.color}44`;
              if (showResult && isAnswered) {
                if (isCorrectAnswer) { bg = '#23863622'; border = '#238636'; }
                else if (selected && !isCorrect) { bg = '#da363322'; border = '#da3633'; }
              }
              return (
                <button key={type.id} onClick={(e) => { e.stopPropagation(); handleSelect(type.id); }} disabled={isAnswered}
                  style={{ padding: '12px 8px', background: bg, border: `2px solid ${border}`, borderRadius: '10px', color: 'white', cursor: isAnswered ? 'default' : 'pointer', fontSize: '12px', fontWeight: 'bold', transition: 'all 0.2s', opacity: isAnswered && !isCorrectAnswer && !selected ? 0.4 : 1 }}>
                  {type.label}
                  {showResult && isCorrectAnswer && ' ✓'}
                  {showResult && selected && !isCorrect && ' ✗'}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && isAnswered && (
            <div style={{ padding: '12px 14px', borderRadius: '10px', background: isCorrect ? 'rgba(35,134,54,0.15)' : 'rgba(218,54,51,0.15)', border: `1px solid ${isCorrect ? '#238636' : '#da3633'}`, fontSize: '13px', lineHeight: '1.4' }}>
              <strong>{isCorrect ? '✅ Correct!' : '❌ Not quite!'}</strong> {current.explanation}
            </div>
          )}

          {/* Nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', flexShrink: 0 }}>
            <button onClick={handlePrev} disabled={currentIdx === 0} style={{ padding: '7px 16px', background: '#21262d', border: '1px solid #30363d', color: 'white', borderRadius: '8px', cursor: currentIdx === 0 ? 'default' : 'pointer', opacity: currentIdx === 0 ? 0.3 : 1 }}>← Prev</button>
            {allDone && (
              <div style={{ padding: '7px 16px', background: totalCorrect === SCENARIOS.length ? '#238636' : '#FFB800', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px', color: totalCorrect === SCENARIOS.length ? 'white' : '#000' }}>
                {totalCorrect === SCENARIOS.length ? '🏆 Perfect!' : `${totalCorrect}/${SCENARIOS.length}`}
              </div>
            )}
            <button onClick={handleNext} disabled={currentIdx === SCENARIOS.length - 1} style={{ padding: '7px 16px', background: '#238636', border: 'none', color: 'white', borderRadius: '8px', cursor: currentIdx === SCENARIOS.length - 1 ? 'default' : 'pointer', opacity: currentIdx === SCENARIOS.length - 1 ? 0.3 : 1, fontWeight: 'bold' }}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
