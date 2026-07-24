"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type SystemDomain = "rules" | "content" | "operations" | "ai";
export type PortfolioTheme = "system" | "human";

const layouts: Record<SystemDomain, [number, number, number][]> = {
  rules: [
    [-2.5, 0, 0], [-1.7, 1.25, -.2], [-1.55, .35, .2], [-1.55, -.8, -.1],
    [-.45, 1.25, .15], [-.35, .35, -.25], [-.35, -.8, .15], [.85, 1.2, -.15],
    [.8, .25, .2], [.8, -.85, -.15], [2, .95, .2], [2.15, .05, -.25],
    [2, -.9, .15], [-1.05, -.58, .55],
  ],
  content: [
    [-2.25, 1.35, -.2], [-.8, 1.35, .15], [.7, 1.35, -.15], [2.15, 1.35, .2],
    [-2.25, .35, .15], [-.8, .35, -.2], [.7, .35, .2], [2.15, .35, -.1],
    [-2.25, -.7, -.2], [-.8, -.7, .2], [.7, -.7, -.15], [2.15, -.7, .15],
    [-.8, -1.45, -.1], [.7, -1.45, .2],
  ],
  operations: [
    [0, 0, .55], [0, 1.65, 0], [1.3, 1.1, -.2], [1.85, 0, .1],
    [1.3, -1.15, -.15], [0, -1.65, .2], [-1.3, -1.15, -.1], [-1.85, 0, .15],
    [-1.3, 1.1, -.2], [.65, .65, .4], [.72, -.65, .35], [-.72, -.65, .4],
    [-.65, .65, .35], [2.45, .35, -.3],
  ],
  ai: [
    [-2.45, -.85, -.2], [-2.05, .25, .2], [-1.55, 1.1, -.1], [-.95, .5, .25],
    [-.45, -.35, -.2], [.1, -1.15, .15], [.55, -.2, .3], [.95, .8, -.2],
    [1.45, 1.35, .15], [1.8, .45, -.15], [2.15, -.55, .25], [1.35, -1.2, -.2],
    [0, .7, .45], [-1.25, -1.25, .1],
  ],
};

const edges: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [1, 4], [2, 5], [3, 6], [4, 7], [5, 8],
  [6, 9], [7, 10], [8, 11], [9, 12], [2, 13], [5, 13], [8, 13], [11, 13],
];

function Network({ domain, theme, reducedMotion }: { domain: SystemDomain; theme: PortfolioTheme; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const instances = useRef<THREE.InstancedMesh>(null);
  const { invalidate } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const current = useRef(layouts[domain].map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  // Rebuild targets only when the selected domain changes; the animation loop
  // then performs no per-frame vector allocations.
  const targetVectors = useMemo(
    () => layouts[domain].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    [domain],
  );
  const linePositions = useMemo(() => new Float32Array(edges.length * 6), []);
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    return geometry;
  }, [linePositions]);

  useEffect(() => {
    invalidate();
  }, [domain, theme, invalidate]);

  useEffect(() => () => lineGeometry.dispose(), [lineGeometry]);

  useFrame((state, delta) => {
    const blend = reducedMotion ? 1 : 1 - Math.exp(-delta * 4.2);

    current.current.forEach((point, index) => {
      point.lerp(targetVectors[index], blend);
      const pulse = reducedMotion ? 1 : 1 + Math.sin(state.clock.elapsedTime * 1.25 + index) * .08;
      dummy.position.copy(point);
      dummy.scale.setScalar(index === 13 ? .18 : .085 * pulse);
      dummy.updateMatrix();
      instances.current?.setMatrixAt(index, dummy.matrix);
    });

    if (instances.current) instances.current.instanceMatrix.needsUpdate = true;

    edges.forEach(([from, to], edgeIndex) => {
      const start = current.current[from];
      const end = current.current[to];
      const offset = edgeIndex * 6;
      linePositions.set([start.x, start.y, start.z, end.x, end.y, end.z], offset);
    });
    const position = lineGeometry.getAttribute("position") as THREE.BufferAttribute;
    position.needsUpdate = true;

    if (group.current && !reducedMotion) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * .12, .04);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -state.pointer.y * .08, .04);
    }
  });

  const nodeColour = theme === "system" ? "#c7ff47" : "#315f24";
  const lineColour = theme === "system" ? "#f2f1eb" : "#16171a";

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={lineColour} transparent opacity={theme === "system" ? .34 : .24} />
      </lineSegments>
      <instancedMesh ref={instances} args={[undefined, undefined, layouts[domain].length]} frustumCulled={false}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={nodeColour} toneMapped={false} />
      </instancedMesh>
      <mesh position={[0, .15, -.65]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.25, .007, 4, 128]} />
        <meshBasicMaterial color={lineColour} transparent opacity={.12} />
      </mesh>
      <mesh position={[-1.05, -.58, .5]}>
        <icosahedronGeometry args={[.26, 1]} />
        <meshBasicMaterial color={nodeColour} wireframe transparent opacity={.72} />
      </mesh>
    </group>
  );
}

export function ComplexityScene({ domain, theme, reducedMotion }: { domain: SystemDomain; theme: PortfolioTheme; reducedMotion: boolean }) {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 6.6], fov: 47 }}
      dpr={[1, 1.5]}
      frameloop={reducedMotion ? "demand" : "always"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <Network domain={domain} theme={theme} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
