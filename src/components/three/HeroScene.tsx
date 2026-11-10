"use client";

import { AdaptiveDpr, Float } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import * as THREE from "three";
import { edgePositions, fibonacciSphere, nearestNeighbourEdges } from "./geometry";

type ThemeMode = "dark" | "light";

interface HeroSceneProps {
  active: boolean;
  reduced: boolean;
  mobile: boolean;
  theme: ThemeMode;
}

const PALETTES = {
  dark: {
    accent: "#34d399",
    soft: "#5eead4",
    core: "#0b3b33",
    line: "#2dd4bf",
    particle: "#a7f3d0",
  },
  light: {
    accent: "#047857",
    soft: "#0d9488",
    core: "#0f3d33",
    line: "#0f766e",
    particle: "#065f46",
  },
} as const;

function CanvasCleanup() {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    return () => {
      gl.dispose();
      gl.forceContextLoss();
    };
  }, [gl]);

  return null;
}

/** Re-renders one frame in `demand` mode (reduced motion) after prop changes. */
function InvalidateOnChange({ value }: { value: string }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
  }, [invalidate, value]);

  return null;
}

function Rig({ reduced, children }: { reduced: boolean; children: ReactNode }) {
  const spin = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useFrame((state, delta) => {
    if (!spin.current || !tilt.current || reduced) return;

    // Slow auto-rotation keeps the scene alive without demanding attention.
    spin.current.rotation.y += delta * 0.045;
    spin.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.06;

    // Subtle mouse parallax and scroll drift.
    const scroll = Math.min(window.scrollY / 640, 1);
    tilt.current.rotation.y = THREE.MathUtils.damp(
      tilt.current.rotation.y,
      pointer.current.x * 0.2,
      2.4,
      delta,
    );
    tilt.current.rotation.x = THREE.MathUtils.damp(
      tilt.current.rotation.x,
      -pointer.current.y * 0.14,
      2.4,
      delta,
    );
    tilt.current.position.y = THREE.MathUtils.damp(
      tilt.current.position.y,
      -scroll * 0.55,
      2.4,
      delta,
    );
  });

  return (
    <group ref={tilt}>
      <group ref={spin}>{children}</group>
    </group>
  );
}

function Constellation({
  accent,
  soft,
  mobile,
}: {
  accent: string;
  soft: string;
  mobile: boolean;
}) {
  const count = mobile ? 13 : 19;
  const radius = 2.55;

  const points = useMemo(() => fibonacciSphere(count, radius), [count]);
  const edges = useMemo(
    () => nearestNeighbourEdges(points, mobile ? 1 : 2),
    [points, mobile],
  );
  const positions = useMemo(() => edgePositions(points, edges), [points, edges]);

  return (
    <group>
      {points.map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[index % 4 === 0 ? 0.055 : 0.035, 7, 7]} />
          <meshBasicMaterial color={accent} transparent opacity={0.85} />
        </mesh>
      ))}

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={accent} transparent opacity={0.22} />
      </lineSegments>

      <Pulses
        points={points}
        edges={edges}
        color={soft}
        count={mobile ? 4 : 7}
      />
    </group>
  );
}

function Pulses({
  points,
  edges,
  color,
  count,
}: {
  points: THREE.Vector3[];
  edges: Array<[number, number]>;
  color: string;
  count: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => new THREE.SphereGeometry(0.05, 6, 6), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      }),
    [color],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state) => {
    if (!ref.current || edges.length === 0) return;
    const time = state.clock.elapsedTime;

    for (let index = 0; index < count; index += 1) {
      const edge = edges[index % edges.length];
      const start = points[edge[0]];
      const end = points[edge[1]];
      const progress = (time * 0.12 + index / count) % 1;

      dummy.position.lerpVectors(start, end, progress);
      dummy.scale.setScalar(0.55 + Math.sin(progress * Math.PI) * 0.75);
      dummy.updateMatrix();
      ref.current.setMatrixAt(index, dummy.matrix);
    }

    ref.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geometry, material, count]} />;
}

function ServerStack({ color }: { color: string }) {
  return (
    <group position={[-2.45, -1.2, 0.35]} rotation={[0.22, -0.5, 0]}>
      {[-0.44, 0, 0.44].map((y) => (
        <group key={y} position={[0, y, 0]}>
          <mesh>
            <boxGeometry args={[1.05, 0.27, 0.7]} />
            <meshBasicMaterial
              color={color}
              wireframe
              transparent
              opacity={0.48}
            />
          </mesh>
          <mesh position={[0.36, 0, 0.36]}>
            <circleGeometry args={[0.032, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.9} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.78, 0]}>
        <boxGeometry args={[0.78, 0.05, 0.54]} />
        <meshBasicMaterial color={color} transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function Particles({
  count,
  color,
  reduced,
}: {
  count: number;
  color: string;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const radius = 3.6 + Math.random() * 3.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      values[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      values[index * 3 + 1] = radius * Math.cos(phi) * 0.72;
      values[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return values;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y += delta * 0.018;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.08) * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

function SceneContents({ mobile, theme }: { mobile: boolean; theme: ThemeMode }) {
  const palette = PALETTES[theme];

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 6, 5]} intensity={2.4} />
      <pointLight
        position={[-4, -2, 3]}
        intensity={16}
        distance={14}
        decay={2}
        color={palette.accent}
      />

      <group scale={0.92}>
        <mesh>
          <icosahedronGeometry args={[1.7, 1]} />
          <meshStandardMaterial
            color={palette.core}
            emissive={palette.accent}
            emissiveIntensity={0.28}
            metalness={0.5}
            roughness={0.38}
            flatShading
            transparent
            opacity={0.85}
          />
        </mesh>

        <mesh scale={1.42}>
          <icosahedronGeometry args={[1.7, 1]} />
          <meshBasicMaterial
            color={palette.accent}
            wireframe
            transparent
            opacity={0.22}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2.35, 0.25, 0]}>
          <torusGeometry args={[2.72, 0.008, 5, 96]} />
          <meshBasicMaterial
            color={palette.line}
            transparent
            opacity={0.34}
          />
        </mesh>
        <mesh rotation={[Math.PI / 1.8, -0.35, 0.3]}>
          <torusGeometry args={[2.98, 0.006, 5, 96]} />
          <meshBasicMaterial
            color={palette.line}
            transparent
            opacity={0.22}
          />
        </mesh>

        <Constellation
          accent={palette.accent}
          soft={palette.soft}
          mobile={mobile}
        />

        <ServerStack color={palette.soft} />

        <Float speed={1.3} rotationIntensity={0.55} floatIntensity={0.7}>
          <mesh position={[2.5, 1.35, 0.15]}>
            <octahedronGeometry args={[0.38, 0]} />
            <meshBasicMaterial
              color={palette.soft}
              wireframe
              transparent
              opacity={0.5}
            />
          </mesh>
        </Float>

        <Float speed={1.1} rotationIntensity={0.4} floatIntensity={0.6}>
          <mesh position={[-2.55, 1.55, -0.35]} rotation={[0.4, 0.2, 0.2]}>
            <tetrahedronGeometry args={[0.4, 0]} />
            <meshBasicMaterial
              color={palette.accent}
              wireframe
              transparent
              opacity={0.4}
            />
          </mesh>
        </Float>

        <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
          <mesh position={[2.2, -1.3, 0.5]}>
            <boxGeometry args={[0.52, 0.52, 0.52]} />
            <meshBasicMaterial
              color={palette.line}
              wireframe
              transparent
              opacity={0.34}
            />
          </mesh>
        </Float>

        <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.65}>
          <mesh position={[1.75, 0.1, -1.15]}>
            <torusGeometry args={[0.26, 0.055, 6, 22]} />
            <meshBasicMaterial
              color={palette.accent}
              transparent
              opacity={0.35}
            />
          </mesh>
        </Float>
      </group>
    </>
  );
}

export default function HeroScene({
  active,
  reduced,
  mobile,
  theme,
}: HeroSceneProps) {
  const palette = PALETTES[theme];

  return (
    <Canvas
      dpr={[1, mobile ? 1.5 : 2]}
      frameloop={!active ? "never" : reduced ? "demand" : "always"}
      performance={{ min: 0.5 }}
      gl={{
        antialias: !mobile,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0.15, 8], fov: 45 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <InvalidateOnChange value={`${theme}:${reduced}:${active}`} />
        <Rig reduced={reduced}>
          <SceneContents mobile={mobile} theme={theme} />
        </Rig>
        <Particles
          count={mobile ? 60 : 140}
          color={palette.particle}
          reduced={reduced}
        />
        <AdaptiveDpr />
        <CanvasCleanup />
      </Suspense>
    </Canvas>
  );
}
