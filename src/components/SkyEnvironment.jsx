import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec3 vWorldPosition;
void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform vec3 uTopColor;
uniform vec3 uBottomColor;
uniform vec3 uSunPosition;
uniform vec3 uSunGlowColor;
uniform float uSunGlowIntensity;

varying vec3 vWorldPosition;

void main() {
  // Normalized direction from center
  vec3 dir = normalize(vWorldPosition);
  
  // Gradient factor: 0 at bottom, 1 at top
  float h = dir.y * 0.5 + 0.5;
  h = pow(h, 0.8);
  
  vec3 skyColor = mix(uBottomColor, uTopColor, h);
  
  // Sun glow
  vec3 sunDir = normalize(uSunPosition);
  float sunDot = max(dot(dir, sunDir), 0.0);
  
  // Tight core glow
  float sunDisc = pow(sunDot, 256.0) * 2.0;
  // Wider atmospheric glow
  float sunGlow = pow(sunDot, 8.0) * 0.4 * uSunGlowIntensity;
  // Very wide horizon scatter
  float scatter = pow(sunDot, 2.5) * 0.15 * uSunGlowIntensity;
  
  vec3 glowColor = uSunGlowColor * (sunDisc + sunGlow + scatter);
  
  // Horizon haze
  float horizonFactor = 1.0 - abs(dir.y);
  horizonFactor = pow(horizonFactor, 4.0) * 0.12;
  vec3 hazeColor = mix(uSunGlowColor, vec3(0.6, 0.65, 0.8), 0.5);
  
  gl_FragColor = vec4(skyColor + glowColor + hazeColor * horizonFactor, 1.0);
}
`;

export function SkyEnvironment({ skyColors, sunPosition, sunColor, dayPhase }) {
  const matRef = useRef();

  const uniforms = useMemo(() => ({
    uTopColor: { value: new THREE.Color(...skyColors.top) },
    uBottomColor: { value: new THREE.Color(...skyColors.bottom) },
    uSunPosition: { value: new THREE.Vector3(...sunPosition) },
    uSunGlowColor: { value: new THREE.Color(sunColor.r, sunColor.g, sunColor.b) },
    uSunGlowIntensity: { value: dayPhase === 'night' ? 0 : 1 },
  }), []);

  // Update uniforms each render
  if (matRef.current) {
    matRef.current.uniforms.uTopColor.value.set(...skyColors.top);
    matRef.current.uniforms.uBottomColor.value.set(...skyColors.bottom);
    matRef.current.uniforms.uSunPosition.value.set(...sunPosition);
    matRef.current.uniforms.uSunGlowColor.value.set(sunColor.r, sunColor.g, sunColor.b);
    matRef.current.uniforms.uSunGlowIntensity.value = dayPhase === 'night' ? 0 : 1;
  }

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[200, 32, 32]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
