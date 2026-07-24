"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type PortfolioTheme = "system" | "human";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform float uScroll;
  uniform vec2 uPointer;

  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying float vDepth;

  void main() {
    vUv = uv;
    vec3 p = position;

    float intro = smoothstep(0.0, 1.0, uIntro);
    float depth = 1.0 - (uScroll * 0.76);
    float slowTime = uTime * 0.24;
    float primaryFold = sin((p.x * 0.92) + (p.y * 0.38) + slowTime) * 0.72;
    float secondaryFold = sin((p.x * 2.15) - (p.y * 0.54) - (slowTime * 0.72)) * 0.24;
    float longCurl = cos((p.x * 0.46) - (p.y * 0.92) - slowTime) * 0.22;

    p.z += (primaryFold + secondaryFold + longCurl) * intro * depth;
    p.y += sin((p.x * 0.78) + slowTime) * 0.52 * intro * depth;
    p.x += sin((p.y * 1.18) - (slowTime * 0.55)) * 0.15 * intro;

    vec2 pointerUv = (uPointer * 0.5) + 0.5;
    vec2 pointerDistance = uv - pointerUv;
    float pointerLift = exp(-dot(pointerDistance, pointerDistance) * 8.5);
    p.z += pointerLift * 0.48 * depth;
    p.y += pointerLift * uPointer.y * 0.16;

    // The material unfolds once, then compresses into a band as section two arrives.
    p.x *= mix(0.42, 1.0, intro) * mix(1.0, 1.22, uScroll);
    p.y *= mix(0.04, 1.0, intro) * mix(1.0, 0.18, uScroll);
    p.z += mix(-1.3, 0.0, intro);
    p.y -= uScroll * 1.7;

    vec4 worldPosition = modelMatrix * vec4(p, 1.0);
    vWorldPosition = worldPosition.xyz;
    vDepth = p.z;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uTheme;

  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying float vDepth;

  float random(vec2 point) {
    return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec3 normal = normalize(cross(dFdx(vWorldPosition), dFdy(vWorldPosition)));
    if (!gl_FrontFacing) normal *= -1.0;

    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    vec3 lightDirection = normalize(vec3(-0.42, 0.78, 0.88));
    float diffuse = 0.22 + (max(dot(normal, lightDirection), 0.0) * 0.78);
    float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.15);
    float iridescence = 0.5 + (0.5 * sin((fresnel * 10.5) + (vUv.x * 4.4) - (vUv.y * 2.2) + (uTime * 0.14)));
    float highlight = pow(max(dot(reflect(-lightDirection, normal), viewDirection), 0.0), 24.0);

    vec3 systemBase = vec3(0.022, 0.025, 0.045);
    vec3 systemViolet = vec3(0.49, 0.35, 1.0);
    vec3 systemBlue = vec3(0.12, 0.72, 1.0);
    vec3 systemLime = vec3(0.78, 1.0, 0.28);
    vec3 systemIridescence = mix(systemViolet, systemBlue, iridescence);
    systemIridescence = mix(systemIridescence, systemLime, smoothstep(0.74, 1.0, fresnel) * 0.36);
    vec3 systemColour = mix(systemBase, systemIridescence, (diffuse * 0.74) + (fresnel * 0.52));

    vec3 humanBase = vec3(0.97, 0.79, 0.57);
    vec3 humanCoral = vec3(1.0, 0.27, 0.25);
    vec3 humanRose = vec3(0.93, 0.31, 0.66);
    vec3 humanSky = vec3(0.18, 0.52, 0.94);
    vec3 humanIridescence = mix(humanCoral, humanRose, iridescence);
    humanIridescence = mix(humanIridescence, humanSky, smoothstep(0.72, 1.0, fresnel) * 0.48);
    vec3 humanColour = mix(humanBase, humanIridescence, (diffuse * 0.54) + (fresnel * 0.64));

    vec3 colour = mix(systemColour, humanColour, uTheme);
    colour += highlight * mix(vec3(0.72, 0.88, 1.0), vec3(1.0, 0.86, 0.68), uTheme) * 0.7;
    colour += vDepth * mix(vec3(0.018, 0.01, 0.045), vec3(0.025, 0.0, -0.01), uTheme);
    colour += (random(gl_FragCoord.xy + floor(uTime * 12.0)) - 0.5) * 0.018;

    float edge = smoothstep(0.0, 0.025, vUv.x) * smoothstep(0.0, 0.025, 1.0 - vUv.x);
    edge *= smoothstep(0.0, 0.035, vUv.y) * smoothstep(0.0, 0.035, 1.0 - vUv.y);
    gl_FragColor = vec4(colour, edge * 0.985);
  }
`;

function FoldMesh({ theme, reducedMotion }: { theme: PortfolioTheme; reducedMotion: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const intro = useRef(reducedMotion ? 1 : 0);
  const scrollTarget = useRef(0);
  const { viewport, invalidate } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uScroll: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uTheme: { value: 0 },
    }),
    [],
  );

  useEffect(() => {
    const updateScroll = () => {
      scrollTarget.current = THREE.MathUtils.clamp(window.scrollY / (window.innerHeight * 0.82), 0, 1);
      if (reducedMotion) invalidate();
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, [invalidate, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      intro.current = 1;
    }
    invalidate();
  }, [invalidate, reducedMotion]);

  useFrame((state, delta) => {
    const currentMaterial = material.current;
    if (!currentMaterial) return;

    if (!reducedMotion) {
      intro.current = THREE.MathUtils.damp(intro.current, 1, 2.8, delta);
      currentMaterial.uniforms.uTime.value = state.clock.elapsedTime;
      currentMaterial.uniforms.uPointer.value.lerp(state.pointer, 1 - Math.exp(-delta * 3.8));
      if (group.current) {
        group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, state.pointer.x * 0.11, 3.2, delta);
        group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -state.pointer.y * 0.055, 3.2, delta);
      }
    }

    currentMaterial.uniforms.uIntro.value = intro.current;
    currentMaterial.uniforms.uScroll.value = THREE.MathUtils.damp(
      currentMaterial.uniforms.uScroll.value,
      reducedMotion ? 0 : scrollTarget.current,
      5.2,
      delta,
    );
    currentMaterial.uniforms.uTheme.value = THREE.MathUtils.damp(
      currentMaterial.uniforms.uTheme.value,
      theme === "human" ? 1 : 0,
      3.8,
      delta,
    );
  });

  const responsiveScale = Math.max(0.53, Math.min(1.06, viewport.width / 7.9));

  return (
    <group ref={group} rotation={[-0.08, -0.12, -0.075]} scale={responsiveScale}>
      <mesh>
        <planeGeometry args={[8.4, 4.75, 144, 82]} />
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function LivingFoldScene({ theme, reducedMotion }: { theme: PortfolioTheme; reducedMotion: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.15], fov: 42 }}
      dpr={[1, 1.6]}
      frameloop={reducedMotion ? "demand" : "always"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <FoldMesh theme={theme} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
