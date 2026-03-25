import { useEffect, useRef } from 'react';

/**
 * Track normalized mouse position for subtle camera parallax.
 * Returns a ref containing { x, y } in range [-1, 1].
 */
export function useMouseParallax() {
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Call this in useFrame to get smoothly lerped values
  const lerp = (factor = 0.05) => {
    mouse.current.x += (target.current.x - mouse.current.x) * factor;
    mouse.current.y += (target.current.y - mouse.current.y) * factor;
    return mouse.current;
  };

  return { mouse, lerp };
}
