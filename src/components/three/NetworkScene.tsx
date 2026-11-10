"use client";

import { useCursor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import * as THREE from "three";
import { infrastructure, type InfraNode } from "@/data/portfolio";

type ThemeMode = "dark" | "light";

interface NetworkSceneProps {
  active: boolean;
  reduced: boolean;
  mobile: boolean;
  theme: ThemeMode;
  selectedId: string | null;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
}

const PALETTES = {
  dark: {
    accent: "#34d399",
    soft: "#5eead4",
    line: "#2dd4bf",
    muted: "#5b6b78",
  },
  light: {
    accent: "#047857",
    soft: "#0d9488",
    line: "#0f766e",
    muted: "#64748b",
  },
} as const;

const NODE_INDEX = new Map(infrastructure.nodes.map((node, index) => [node.id, index]));

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

function InvalidateOnChange({ value }: { value: string }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
  }, [invalidate, value]);

  return null;
}

function NetworkRig({
  reduced,
  children,
}: {
  reduced: boolean;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
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
    if (!group.current || reduced) return;
    const time = state.clock.elapsedTime;

    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      Math.sin(time * 0.14) * 0.16 + pointer.current.x * 0.12,
      2.4,
      delta,
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      -pointer.current.y * 0.06,
      2.4,
      delta,
    );
  });

  return <group ref={group}>{children}</group>;
}

function NodeShape({
  kind,
  color,
}: {
  kind: InfraNode["kind"];
  color: string;
}) {
  const material = (
    <meshBasicMaterial color={color} wireframe transparent opacity={0.62} />
  );

  switch (kind) {
    case "cloud":
      return (
        <group>
          <mesh>
            <icosahedronGeometry args={[0.34, 1]} />
            {material}
          </mesh>
          <mesh>
            <sphereGeometry args={[0.46, 10, 10]} />
            <meshBasicMaterial color={color} transparent opacity={0.06} />
          </mesh>
        </group>
      );

    case "network":
      return (
        <group>
          <mesh>
            <boxGeometry args={[0.46, 0.24, 0.36]} />
            {material}
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.3, 5]} />
            <meshBasicMaterial color={color} transparent opacity={0.55} />
          </mesh>
          <mesh position={[0, 0.46, 0]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshBasicMaterial color={color} transparent opacity={0.9} />
          </mesh>
        </group>
      );

    case "server":
      return (
        <group>
          <mesh>
            <boxGeometry args={[0.44, 0.64, 0.34]} />
            {material}
          </mesh>
          {[-0.16, 0, 0.16].map((y) => (
            <mesh key={y} position={[0, y, 0.18]}>
              <boxGeometry args={[0.28, 0.02, 0.01]} />
              <meshBasicMaterial color={color} transparent opacity={0.7} />
            </mesh>
          ))}
          <mesh position={[0.14, 0.24, 0.18]}>
            <sphereGeometry args={[0.028, 6, 6]} />
            <meshBasicMaterial color={color} transparent opacity={0.95} />
          </mesh>
        </group>
      );

    case "computer":
      return (
        <group>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.62, 0.38, 0.05]} />
            {material}
          </mesh>
          <mesh position={[0, -0.08, 0]}>
            <boxGeometry args={[0.06, 0.16, 0.06]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} />
          </mesh>
          <mesh position={[0, -0.18, 0]}>
            <boxGeometry args={[0.34, 0.04, 0.22]} />
            <meshBasicMaterial
              color={color}
              wireframe
              transparent
              opacity={0.45}
            />
          </mesh>
        </group>
      );

    case "device":
    default:
      return (
        <group>
          <mesh>
            <boxGeometry args={[0.5, 0.24, 0.4]} />
            {material}
          </mesh>
          <mesh position={[0, 0.17, -0.02]}>
            <boxGeometry args={[0.32, 0.03, 0.24]} />
            <meshBasicMaterial color={color} transparent opacity={0.45} />
          </mesh>
        </group>
      );
  }
}

function NodeGroup({
  node,
  index,
  color,
  active,
  selected,
  mobile,
  reduced,
  onHover,
  onSelect,
}: {
  node: InfraNode;
  index: number;
  color: string;
  active: boolean;
  selected: boolean;
  mobile: boolean;
  reduced: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;

    const targetScale = active ? 1.16 : 1;
    const nextScale = THREE.MathUtils.damp(
      group.current.scale.x,
      targetScale,
      9,
      delta,
    );
    group.current.scale.setScalar(nextScale);

    if (!reduced) {
      group.current.position.y =
        node.position[1] + Math.sin(state.clock.elapsedTime * 0.7 + index) * 0.025;
    }
  });

  return (
    <group
      ref={group}
      position={node.position}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHover(node.id);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        onHover(null);
      }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(node.id);
      }}
    >
      <NodeShape kind={node.kind} color={color} />

      {(active || selected) && (
        <mesh>
          <sphereGeometry args={[0.55, 18, 18]} />
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={selected ? 0.4 : 0.24}
          />
        </mesh>
      )}

      {/* Invisible, oversized hit target for touch and precise pointers. */}
      <mesh>
        <sphereGeometry args={[mobile ? 0.72 : 0.58, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Connections({
  nodes,
  links,
  activeId,
  color,
}: {
  nodes: InfraNode[];
  links: Array<{ from: string; to: string }>;
  activeId: string | null;
  color: string;
}) {
  const positions = useMemo(() => {
    const values = new Float32Array(links.length * 6);
    links.forEach((link, index) => {
      const from = nodes.find((node) => node.id === link.from);
      const to = nodes.find((node) => node.id === link.to);
      if (!from || !to) return;
      values.set(from.position, index * 6);
      values.set(to.position, index * 6 + 3);
    });
    return values;
  }, [links, nodes]);

  const activePositions = useMemo(() => {
    if (!activeId) return null;
    const activeLinks = links.filter(
      (link) => link.from === activeId || link.to === activeId,
    );
    if (activeLinks.length === 0) return null;

    const values = new Float32Array(activeLinks.length * 6);
    activeLinks.forEach((link, index) => {
      const from = nodes.find((node) => node.id === link.from);
      const to = nodes.find((node) => node.id === link.to);
      if (!from || !to) return;
      values.set(from.position, index * 6);
      values.set(to.position, index * 6 + 3);
    });
    return values;
  }, [activeId, links, nodes]);

  return (
    <>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.18} />
      </lineSegments>

      {activePositions && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[activePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={color} transparent opacity={0.6} />
        </lineSegments>
      )}
    </>
  );
}

function LinkPulses({
  nodes,
  links,
  color,
  count,
}: {
  nodes: InfraNode[];
  links: Array<{ from: string; to: string }>;
  color: string;
  count: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => new THREE.SphereGeometry(0.045, 6, 6), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.85,
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
    if (!ref.current || links.length === 0) return;
    const time = state.clock.elapsedTime;

    for (let index = 0; index < count; index += 1) {
      const link = links[index % links.length];
      const start = nodes[NODE_INDEX.get(link.from) ?? 0];
      const end = nodes[NODE_INDEX.get(link.to) ?? 0];
      const progress = (time * 0.16 + index / count) % 1;

      dummy.position.set(
        THREE.MathUtils.lerp(start.position[0], end.position[0], progress),
        THREE.MathUtils.lerp(start.position[1], end.position[1], progress),
        THREE.MathUtils.lerp(start.position[2], end.position[2], progress),
      );
      dummy.scale.setScalar(0.6 + Math.sin(progress * Math.PI) * 0.6);
      dummy.updateMatrix();
      ref.current.setMatrixAt(index, dummy.matrix);
    }

    ref.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geometry, material, count]} />;
}

function Grid({ color }: { color: string }) {
  const ref = useRef<THREE.GridHelper>(null);

  useEffect(() => {
    const material = ref.current?.material as THREE.Material | undefined;
    if (material) {
      material.transparent = true;
      material.opacity = 0.12;
      material.depthWrite = false;
    }
  }, [color]);

  return (
    <gridHelper
      ref={ref}
      args={[13, 26, color, color]}
      position={[0, -2.85, 0]}
    />
  );
}

export default function NetworkScene({
  active,
  reduced,
  mobile,
  theme,
  selectedId,
  hoveredId,
  onHover,
  onSelect,
}: NetworkSceneProps) {
  const palette = PALETTES[theme];
  const activeId = hoveredId ?? selectedId;

  useCursor(Boolean(hoveredId));

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
      camera={{ position: [0, 0.2, 7.6], fov: 45 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      onPointerMissed={() => onSelect(null)}
      style={{ position: "absolute", inset: 0, touchAction: "pan-y" }}
    >
      <Suspense fallback={null}>
        <InvalidateOnChange value={`${theme}:${reduced}:${selectedId}:${hoveredId}`} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 6, 5]} intensity={2} />

        <NetworkRig reduced={reduced}>
          <Grid color={palette.muted} />
          <Connections
            nodes={infrastructure.nodes}
            links={infrastructure.links}
            activeId={activeId}
            color={palette.line}
          />
          {infrastructure.nodes.map((node, index) => (
            <NodeGroup
              key={node.id}
              node={node}
              index={index}
              color={
                node.id === activeId ? palette.soft : palette.accent
              }
              active={node.id === activeId}
              selected={node.id === selectedId}
              mobile={mobile}
              reduced={reduced}
              onHover={onHover}
              onSelect={onSelect}
            />
          ))}
          <LinkPulses
            nodes={infrastructure.nodes}
            links={infrastructure.links}
            color={palette.soft}
            count={mobile ? 5 : 8}
          />
        </NetworkRig>

        <CanvasCleanup />
      </Suspense>
    </Canvas>
  );
}
