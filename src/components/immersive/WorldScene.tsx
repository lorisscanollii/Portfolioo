"use client";

import { AdaptiveDpr, useCursor } from "@react-three/drei";
import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as THREE from "three";
import {
  aboutArtifacts,
  experienceObjects,
  projects,
  skills,
  worldStations,
  type Project,
  type StationId,
} from "@/data/portfolio";
import type { WorldSelection } from "@/lib/world";

interface WorldSceneProps {
  active: StationId;
  reduced: boolean;
  mobile: boolean;
  visible: boolean;
  resetToken: number;
  selected: WorldSelection | null;
  onSelect: (selection: WorldSelection | null) => void;
  onNavigate: (station: StationId) => void;
  onReady: () => void;
}

const STATION_Z: Record<StationId, number> = {
  home: 0,
  about: -25,
  experience: -54,
  skills: -84,
  projects: -118,
  achievements: -154,
  contact: -188,
};

const STATION_ACCENT: Record<StationId, string> = {
  home: "#5eead4",
  about: "#67e8f9",
  experience: "#6ee7b7",
  skills: "#a7f3d0",
  projects: "#7dd3fc",
  achievements: "#f5c76a",
  contact: "#5eead4",
};

const COLORS = {
  background: "#04080b",
  floor: "#071016",
  metal: "#0b161c",
  metalLight: "#12242b",
  line: "#1b3a40",
  accent: "#5eead4",
  accentSoft: "#34d399",
  cyan: "#67e8f9",
  gold: "#f5c76a",
  warm: "#f0b56b",
  coral: "#e8a090",
  text: "#d9f7f0",
};

const WORLD_X = 2.4;
const CAMERA_LOOK_LEFT = -1.45;

interface CameraConfig {
  position: [number, number, number];
  target: [number, number, number];
}

const DESKTOP_CAMERAS: Record<StationId, CameraConfig> = {
  home: {
    position: [-0.7, 3.3, 15.8],
    target: [-0.5, 2.2, -2.5],
  },
  about: {
    position: [-0.6, 2.8, STATION_Z.about + 13.5],
    target: [CAMERA_LOOK_LEFT, 1.55, STATION_Z.about - 1],
  },
  experience: {
    position: [-0.6, 3.2, STATION_Z.experience + 14.5],
    target: [CAMERA_LOOK_LEFT, 1.45, STATION_Z.experience - 1.5],
  },
  skills: {
    position: [-0.5, 2.65, STATION_Z.skills + 12.5],
    target: [-1.2, 1.95, STATION_Z.skills - 0.5],
  },
  projects: {
    position: [-0.7, 3.8, STATION_Z.projects + 17],
    target: [-1.35, 1.45, STATION_Z.projects - 1.5],
  },
  achievements: {
    position: [-0.5, 2.7, STATION_Z.achievements + 12],
    target: [-1.55, 1.85, STATION_Z.achievements - 0.8],
  },
  contact: {
    position: [-0.5, 2.75, STATION_Z.contact + 12.5],
    target: [-1.45, 1.5, STATION_Z.contact - 1],
  },
};

const MOBILE_CAMERAS: Record<StationId, CameraConfig> = Object.fromEntries(
  worldStations.map((station) => {
    const desktop = DESKTOP_CAMERAS[station.id];
    return [
      station.id,
      {
        position: [
          WORLD_X,
          desktop.position[1] + 0.5,
          desktop.position[2] + 2.2,
        ],
        target: [WORLD_X, desktop.target[1] + 0.15, desktop.target[2]],
      },
    ];
  }),
) as Record<StationId, CameraConfig>;

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

function CameraRig({
  active,
  reduced,
  mobile,
  resetToken,
}: {
  active: StationId;
  reduced: boolean;
  mobile: boolean;
  resetToken: number;
}) {
  const { camera, invalidate } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const look = useRef(new THREE.Vector3());
  const desiredPosition = useMemo(() => new THREE.Vector3(), []);
  const desiredLook = useMemo(() => new THREE.Vector3(), []);
  const config = (mobile ? MOBILE_CAMERAS : DESKTOP_CAMERAS)[active];

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useEffect(() => {
    if (!reduced && resetToken === 0) return;
    camera.position.set(...config.position);
    look.current.set(...config.target);
    camera.lookAt(look.current);
    invalidate();
    // Reset is intentionally a one-shot camera snap in all motion modes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, invalidate, reduced, resetToken]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const parallax = mobile ? 0.08 : 0.48;
    const drift = reduced ? 0 : Math.sin(time * 0.16) * 0.035;

    desiredPosition.set(
      config.position[0] + pointer.current.x * parallax,
      config.position[1] + pointer.current.y * (mobile ? 0.08 : 0.2) + drift,
      config.position[2],
    );
    desiredLook.set(
      config.target[0] + pointer.current.x * parallax * 0.3,
      config.target[1] + pointer.current.y * 0.06 + drift * 0.4,
      config.target[2],
    );

    if (reduced) {
      camera.position.copy(desiredPosition);
      look.current.copy(desiredLook);
      camera.lookAt(look.current);
      return;
    }

    const easing = 1 - Math.exp(-2.35 * delta);
    camera.position.lerp(desiredPosition, easing);
    look.current.lerp(desiredLook, easing);
    camera.lookAt(look.current);
  });

  return null;
}

function Label3D({
  text,
  position,
  width = 2.2,
  color = COLORS.text,
  opacity = 0.92,
}: {
  text: string;
  position: [number, number, number];
  width?: number;
  color?: string;
  opacity?: number;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 160;
    const context = canvas.getContext("2d");

    if (!context) return null;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "600 44px 'Segoe UI', Arial, sans-serif";
    context.shadowColor = color;
    context.shadowBlur = 18;
    context.fillStyle = color;
    context.fillText(text, canvas.width / 2, canvas.height / 2 + 2);

    const next = new THREE.CanvasTexture(canvas);
    next.colorSpace = THREE.SRGBColorSpace;
    next.minFilter = THREE.LinearFilter;
    next.magFilter = THREE.LinearFilter;
    next.generateMipmaps = false;
    return next;
  }, [color, text]);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  if (!texture) return null;

  return (
    <sprite
      position={position}
      scale={[width, width * 0.25, 1]}
      renderOrder={5}
    >
      <spriteMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  );
}

interface ClickableProps {
  children: ReactNode;
  onClick: () => void;
  reduced: boolean;
  accent?: string;
  selected?: boolean;
  hitBox?: [number, number, number];
  hitBoxPosition?: [number, number, number];
  hoverScale?: number;
}

function Clickable({
  children,
  onClick,
  reduced,
  accent = COLORS.accent,
  selected = false,
  hitBox = [1.7, 2.6, 1.7],
  hitBoxPosition = [0, 1.3, 0],
  hoverScale = 1.035,
}: ClickableProps) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = hovered ? hoverScale : 1;
    if (reduced) {
      group.current.scale.setScalar(target);
      return;
    }
    const scale = THREE.MathUtils.damp(group.current.scale.x, target, 9, delta);
    group.current.scale.setScalar(scale);
  });

  return (
    <group
      ref={group}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onClick();
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setHovered(false);
      }}
    >
      {children}

      {selected && (
        <mesh
          position={[0, 0.035, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          renderOrder={3}
        >
          <ringGeometry args={[0.9, 1.02, 48]} />
          <meshBasicMaterial
            color={accent}
            transparent
            opacity={0.75}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      <mesh position={hitBoxPosition}>
        <boxGeometry args={hitBox} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Pallet({
  position,
  accent = COLORS.accent,
  size = [1.35, 0.18, 1.1],
}: {
  position: [number, number, number];
  accent?: string;
  size?: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={COLORS.metal}
          metalness={0.88}
          roughness={0.28}
        />
      </mesh>
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size[0] * 0.29, size[0] * 0.31, 32]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, -0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size[0] * 0.78, size[2] * 0.68]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.035}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function NavPortal({
  position,
  label,
  direction,
  station,
  accent,
  reduced,
  onNavigate,
}: {
  position: [number, number, number];
  label: string;
  direction: "previous" | "next";
  station: StationId;
  accent: string;
  reduced: boolean;
  onNavigate: (station: StationId) => void;
}) {
  return (
    <Clickable
      reduced={reduced}
      accent={accent}
      onClick={() => onNavigate(station)}
      hitBox={[2.3, 4, 0.8]}
      hitBoxPosition={[0, 1.8, 0]}
      hoverScale={1.025}
    >
      <group position={position}>
        <mesh position={[0, 1.85, 0]}>
          <boxGeometry args={[2.25, 3.4, 0.12]} />
          <meshStandardMaterial
            color={COLORS.metal}
            metalness={0.9}
            roughness={0.24}
          />
        </mesh>
        <mesh position={[0, 1.85, 0.07]}>
          <planeGeometry args={[1.92, 3.06]} />
          <meshBasicMaterial
            color={accent}
            transparent
            opacity={0.075}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[2.5, 0.16, 0.85]} />
          <meshStandardMaterial
            color={COLORS.metalLight}
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 3.66, 0]}>
          <boxGeometry args={[2.48, 0.055, 0.4]} />
          <meshBasicMaterial color={accent} transparent opacity={0.55} />
        </mesh>
        {[0.76, 0.9, 1.04].map((offset, index) => (
          <mesh
            key={offset}
            position={[0, 3.04 - index * 0.17, 0.09]}
            rotation={[0, 0, direction === "next" ? -0.55 : 0.55]}
          >
            <boxGeometry args={[0.36, 0.045, 0.02]} />
            <meshBasicMaterial
              color={accent}
              transparent
              opacity={0.7 - index * 0.13}
            />
          </mesh>
        ))}
        <Label3D
          text={label}
          position={[0, 2.3, 0.12]}
          width={1.72}
          color={accent}
          opacity={0.95}
        />
        <Label3D
          text={direction === "next" ? "NEXT" : "BACK"}
          position={[0, 3.8, 0.12]}
          width={0.9}
          color={COLORS.text}
          opacity={0.55}
        />
      </group>
    </Clickable>
  );
}

function HomeCore({
  position,
  reduced,
  onSelect,
  selected,
}: {
  position: [number, number, number];
  reduced: boolean;
  onSelect: (selection: WorldSelection | null) => void;
  selected: boolean;
}) {
  const orbit = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!orbit.current || reduced) return;
    orbit.current.rotation.y += delta * 0.07;
    orbit.current.rotation.z = Math.sin(orbit.current.rotation.y * 0.4) * 0.05;
  });

  const nodes = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => {
        const angle = (index / 14) * Math.PI * 2;
        const radius = index % 2 === 0 ? 2.45 : 2.9;
        return {
          position: [
            Math.cos(angle) * radius,
            Math.sin(index * 1.7) * 0.42,
            Math.sin(angle) * radius,
          ] as [number, number, number],
          size: index % 4 === 0 ? 0.075 : 0.045,
        };
      }),
    [],
  );

  return (
    <Clickable
      reduced={reduced}
      onClick={() => onSelect(null)}
      selected={selected}
      hitBox={[3.8, 4.6, 3.8]}
      hitBoxPosition={[0, 3.1, 0]}
      hoverScale={1.015}
    >
      <group position={position}>
        <group ref={orbit}>
          <mesh>
            <icosahedronGeometry args={[1.35, 1]} />
            <meshStandardMaterial
              color="#082c2b"
              emissive={COLORS.accent}
              emissiveIntensity={0.36}
              metalness={0.72}
              roughness={0.24}
              flatShading
            />
          </mesh>
          <mesh scale={1.24}>
            <icosahedronGeometry args={[1.35, 1]} />
            <meshBasicMaterial
              color={COLORS.accent}
              wireframe
              transparent
              opacity={0.24}
              depthWrite={false}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2.5, 0.2, 0]}>
            <torusGeometry args={[2.2, 0.012, 5, 96]} />
            <meshBasicMaterial
              color={COLORS.cyan}
              transparent
              opacity={0.36}
              depthWrite={false}
            />
          </mesh>
          <mesh rotation={[Math.PI / 1.8, -0.3, 0.2]}>
            <torusGeometry args={[2.62, 0.006, 5, 96]} />
            <meshBasicMaterial
              color={COLORS.accent}
              transparent
              opacity={0.2}
              depthWrite={false}
            />
          </mesh>
          {nodes.map((node, index) => (
            <mesh key={index} position={node.position}>
              <sphereGeometry args={[node.size, 7, 7]} />
              <meshBasicMaterial
                color={index % 3 === 0 ? COLORS.cyan : COLORS.accent}
                transparent
                opacity={0.82}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
        <Label3D
          text="HOME CORE"
          position={[0, 4.75, 0]}
          width={2.2}
          color={COLORS.accent}
          opacity={0.72}
        />
      </group>
    </Clickable>
  );
}

function DirectoryPanel({
  position,
  label,
  index,
  station,
  accent,
  reduced,
  onNavigate,
}: {
  position: [number, number, number];
  label: string;
  index: string;
  station: StationId;
  accent: string;
  reduced: boolean;
  onNavigate: (station: StationId) => void;
}) {
  return (
    <Clickable
      reduced={reduced}
      accent={accent}
      onClick={() => onNavigate(station)}
      hitBox={[1.38, 1.35, 0.8]}
      hitBoxPosition={[0, 0.62, 0]}
      hoverScale={1.07}
    >
      <group position={position}>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[1.28, 1.02, 0.11]} />
          <meshStandardMaterial
            color={COLORS.metal}
            metalness={0.9}
            roughness={0.26}
          />
        </mesh>
        <mesh position={[0, 0.6, 0.065]}>
          <planeGeometry args={[1.04, 0.78]} />
          <meshBasicMaterial
            color={accent}
            transparent
            opacity={0.07}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 1.15, 0.075]}>
          <boxGeometry args={[0.78, 0.025, 0.02]} />
          <meshBasicMaterial color={accent} transparent opacity={0.55} />
        </mesh>
        <Label3D
          text={label.toUpperCase()}
          position={[0, 0.68, 0.09]}
          width={1.05}
          color={COLORS.text}
          opacity={0.9}
        />
        <Label3D
          text={index}
          position={[0, 1.34, 0]}
          width={0.5}
          color={accent}
          opacity={0.7}
        />
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[1.46, 0.08, 0.44]} />
          <meshStandardMaterial
            color={COLORS.metalLight}
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>
      </group>
    </Clickable>
  );
}

function HomeZone({
  z,
  reduced,
  selected,
  onSelect,
  onNavigate,
}: {
  z: number;
  reduced: boolean;
  selected: WorldSelection | null;
  onSelect: (selection: WorldSelection | null) => void;
  onNavigate: (station: StationId) => void;
}) {
  return (
    <group>
      <HomeCore
        position={[WORLD_X + 0.9, 3.2, z - 1.1]}
        reduced={reduced}
        onSelect={onSelect}
        selected={selected?.kind === "contact" && selected.id === "home-core"}
      />

      {worldStations.slice(1).map((station, index) => (
        <DirectoryPanel
          key={station.id}
          station={station.id}
          label={station.label}
          index={station.index}
          reduced={reduced}
          accent={
            station.id === "achievements"
              ? COLORS.gold
              : station.id === "projects"
                ? COLORS.cyan
                : COLORS.accent
          }
          position={[
            -0.8 + index * 1.72,
            1.35 + (index % 2) * 0.14,
            z - 4.6 - Math.abs(index - 2.5) * 0.28,
          ]}
          onNavigate={onNavigate}
        />
      ))}

      <mesh position={[WORLD_X + 0.9, 0.04, z - 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.15, 3.23, 72]} />
        <meshBasicMaterial
          color={COLORS.accent}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function ArtifactShape({
  type,
  accent,
}: {
  type: (typeof aboutArtifacts)[number]["id"];
  accent: string;
}) {
  if (type === "infrastructure") {
    return (
      <group>
        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[1.05, 1.35, 0.76]} />
          <meshStandardMaterial
            color={COLORS.metalLight}
            metalness={0.82}
            roughness={0.28}
          />
        </mesh>
        {[-0.3, 0, 0.3].map((y) => (
          <group key={y} position={[0, 0.65 + y, 0.42]}>
            <mesh>
              <boxGeometry args={[0.72, 0.14, 0.02]} />
              <meshBasicMaterial color={accent} transparent opacity={0.4} />
            </mesh>
            <mesh position={[0.26, 0, 0.02]}>
              <sphereGeometry args={[0.026, 6, 6]} />
              <meshBasicMaterial color={accent} />
            </mesh>
          </group>
        ))}
      </group>
    );
  }

  if (type === "support") {
    return (
      <group>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.2, 0.76, 0.08]} />
          <meshStandardMaterial
            color={COLORS.metalLight}
            metalness={0.78}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 0.55, 0.05]}>
          <planeGeometry args={[1.02, 0.6]} />
          <meshBasicMaterial color={accent} transparent opacity={0.13} />
        </mesh>
        <mesh position={[0, 0.55, 0.08]}>
          <torusGeometry args={[0.18, 0.012, 5, 32]} />
          <meshBasicMaterial color={COLORS.text} transparent opacity={0.36} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.035, 0.055, 0.42, 8]} />
          <meshStandardMaterial color={COLORS.metal} roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.06, 0]}>
          <boxGeometry args={[0.52, 0.045, 0.28]} />
          <meshStandardMaterial
            color={COLORS.metal}
            metalness={0.8}
            roughness={0.32}
          />
        </mesh>
      </group>
    );
  }

  if (type === "development") {
    return (
      <group>
        <mesh position={[0, 0.68, 0]}>
          <boxGeometry args={[0.68, 1.45, 0.5]} />
          <meshStandardMaterial
            color="#0b2028"
            emissive={accent}
            emissiveIntensity={0.12}
            metalness={0.78}
            roughness={0.25}
          />
        </mesh>
        {[-0.36, -0.06, 0.24, 0.54].map((y, index) => (
          <mesh key={y} position={[0, 0.68 + y, 0.26]}>
            <boxGeometry args={[0.38 + (index % 2) * 0.12, 0.022, 0.02]} />
            <meshBasicMaterial
              color={index === 2 ? COLORS.cyan : accent}
              transparent
              opacity={0.66}
            />
          </mesh>
        ))}
        <mesh position={[0, 1.45, 0]} rotation={[0, 0.5, 0]}>
          <octahedronGeometry args={[0.18, 0]} />
          <meshBasicMaterial color={accent} wireframe />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh position={[-0.2, 0.55, 0]} rotation={[0.2, 0.35, 0]}>
        <boxGeometry args={[0.58, 0.58, 0.58]} />
        <meshStandardMaterial
          color={COLORS.metalLight}
          metalness={0.72}
          roughness={0.34}
          wireframe
        />
      </mesh>
      <mesh position={[0.26, 0.82, 0.1]} rotation={[-0.3, -0.25, 0.2]}>
        <boxGeometry args={[0.54, 0.54, 0.54]} />
        <meshStandardMaterial
          color="#12383a"
          emissive={accent}
          emissiveIntensity={0.18}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0.06, 1.18, -0.16]} rotation={[0.4, 0.1, 0]}>
        <icosahedronGeometry args={[0.2, 0]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.75} />
      </mesh>
      <mesh position={[-0.62, 0.95, -0.2]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshStandardMaterial
          color="#152e35"
          metalness={0.7}
          roughness={0.28}
          wireframe
        />
      </mesh>
    </group>
  );
}

function AboutZone({
  z,
  reduced,
  selected,
  onSelect,
}: {
  z: number;
  reduced: boolean;
  selected: WorldSelection | null;
  onSelect: (selection: WorldSelection | null) => void;
}) {
  const positions: [number, number, number][] = [
    [-0.7, 0, z - 1.1],
    [1.45, 0, z - 1.9],
    [3.6, 0, z - 1.9],
    [5.75, 0, z - 1.1],
  ];

  return (
    <group>
      {aboutArtifacts.map((artifact, index) => (
        <Clickable
          key={artifact.id}
          reduced={reduced}
          accent={index === 3 ? COLORS.cyan : COLORS.accent}
          selected={selected?.kind === "about" && selected.id === artifact.id}
          onClick={() => onSelect({ kind: "about", id: artifact.id })}
          hitBox={[1.7, 3.4, 1.6]}
          hitBoxPosition={[0, 1.4, 0]}
        >
          <group position={positions[index]}>
            <Pallet
              position={[0, 0, 0]}
              accent={index === 3 ? COLORS.cyan : COLORS.accent}
            />
            <group position={[0, 0.95, 0]}>
              <ArtifactShape type={artifact.id} accent={COLORS.accent} />
            </group>
            <Label3D
              text={artifact.label}
              position={[0, 3, 0]}
              width={1.75}
              color={index === 3 ? COLORS.cyan : COLORS.accent}
              opacity={0.88}
            />
          </group>
        </Clickable>
      ))}

      <mesh position={[WORLD_X, 0.02, z - 3.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.1, 4.18, 72]} />
        <meshBasicMaterial
          color={COLORS.accent}
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function ServerRack({
  position,
  accent,
}: {
  position: [number, number, number];
  accent: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 1.45, 0]}>
        <boxGeometry args={[1.18, 2.8, 0.92]} />
        <meshStandardMaterial
          color={COLORS.metal}
          metalness={0.9}
          roughness={0.24}
        />
      </mesh>
      {[0.25, 0.62, 0.99, 1.36, 1.73, 2.1, 2.47].map((y, index) => (
        <group key={y} position={[0, y, 0.48]}>
          <mesh>
            <boxGeometry args={[0.92, 0.2, 0.03]} />
            <meshBasicMaterial
              color={index % 3 === 0 ? accent : "#163138"}
              transparent
              opacity={index % 3 === 0 ? 0.4 : 0.65}
            />
          </mesh>
          <mesh position={[0.34, 0, 0.03]}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshBasicMaterial
              color={index % 4 === 0 ? COLORS.cyan : "#4ade80"}
            />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 2.92, 0]}>
        <boxGeometry args={[1.32, 0.08, 1.02]} />
        <meshBasicMaterial color={accent} transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function SupportDesk({ position, accent }: { position: [number, number, number]; accent: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.74, 0]}>
        <boxGeometry args={[2.4, 0.12, 1.05]} />
        <meshStandardMaterial
          color={COLORS.metalLight}
          metalness={0.82}
          roughness={0.3}
        />
      </mesh>
      {[-0.95, 0.95].map((x) => (
        <mesh key={x} position={[x, 0.35, 0]}>
          <boxGeometry args={[0.08, 0.7, 0.7]} />
          <meshStandardMaterial color={COLORS.metal} metalness={0.8} roughness={0.32} />
        </mesh>
      ))}
      <mesh position={[0, 1.35, -0.18]}>
        <boxGeometry args={[1.5, 0.9, 0.09]} />
        <meshStandardMaterial
          color={COLORS.metal}
          metalness={0.88}
          roughness={0.26}
        />
      </mesh>
      <mesh position={[0, 1.35, -0.12]}>
        <planeGeometry args={[1.33, 0.73]} />
        <meshBasicMaterial color={accent} transparent opacity={0.13} />
      </mesh>
      {[-0.28, -0.06, 0.16].map((y, index) => (
        <mesh key={y} position={[0, 1.35 + y, -0.1]}>
          <boxGeometry args={[0.72 - index * 0.1, 0.02, 0.01]} />
          <meshBasicMaterial
            color={index === 1 ? COLORS.cyan : accent}
            transparent
            opacity={0.52}
          />
        </mesh>
      ))}
      <mesh position={[0, 1.35, -0.6]}>
        <cylinderGeometry args={[0.025, 0.025, 0.42, 7]} />
        <meshStandardMaterial color={COLORS.metal} />
      </mesh>
      <mesh position={[0, 0.83, 0.24]} rotation={[-0.12, 0, 0]}>
        <boxGeometry args={[0.9, 0.045, 0.28]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0.92, 1.02, -0.1]} rotation={[0, 0.3, 0]}>
        <torusGeometry args={[0.16, 0.025, 7, 20]} />
        <meshBasicMaterial color={accent} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function NetworkSpine({ position, accent }: { position: [number, number, number]; accent: string }) {
  return (
    <group position={position}>
      {[0.35, 0.68, 1.01].map((y, index) => (
        <group key={y} position={[0, y, 0]}>
          <mesh>
            <boxGeometry args={[1.8, 0.22, 0.65]} />
            <meshStandardMaterial
              color={COLORS.metal}
              metalness={0.9}
              roughness={0.25}
            />
          </mesh>
          {[-0.66, -0.44, -0.22, 0, 0.22, 0.44, 0.66].map((x) => (
            <mesh key={x} position={[x, 0.01, 0.34]}>
              <boxGeometry args={[0.08, 0.06, 0.025]} />
              <meshBasicMaterial
                color={index === 1 ? COLORS.cyan : accent}
                transparent
                opacity={0.75}
              />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 1.37, 0]}>
        <boxGeometry args={[0.06, 0.72, 0.06]} />
        <meshStandardMaterial color={COLORS.metalLight} />
      </mesh>
      <mesh position={[0, 1.78, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color={accent} />
      </mesh>
    </group>
  );
}

function PrinterStation({ position, accent }: { position: [number, number, number]; accent: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.78, 0]}>
        <boxGeometry args={[1.5, 0.95, 1.05]} />
        <meshStandardMaterial
          color={COLORS.metalLight}
          metalness={0.74}
          roughness={0.32}
        />
      </mesh>
      <mesh position={[0, 1.3, 0.12]}>
        <boxGeometry args={[1.1, 0.05, 0.4]} />
        <meshBasicMaterial color={accent} transparent opacity={0.24} />
      </mesh>
      <mesh position={[0, 0.87, 0.56]}>
        <boxGeometry args={[0.7, 0.2, 0.03]} />
        <meshBasicMaterial color="#d9f7f0" transparent opacity={0.32} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[1.2, 0.12, 0.82]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.02, 0.55]}>
        <sphereGeometry args={[0.035, 7, 7]} />
        <meshBasicMaterial color="#4ade80" />
      </mesh>
    </group>
  );
}

function MonitoringWall({ position, accent }: { position: [number, number, number]; accent: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[2.8, 1.75, 0.1]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.88} roughness={0.25} />
      </mesh>
      {[-0.9, 0, 0.9].map((x, index) => (
        <group key={x} position={[x, 1.6, 0.07]}>
          <mesh>
            <planeGeometry args={[0.76, 1.32]} />
            <meshBasicMaterial
              color={index === 0 ? "#0d2328" : "#0b1d23"}
              transparent
              opacity={0.95}
            />
          </mesh>
          {[0.35, 0.15, -0.05, -0.25, -0.45].map((y, lineIndex) => (
            <mesh key={y} position={[0, y, 0.012]}>
              <boxGeometry
                args={[
                  0.42 + (lineIndex % 3) * 0.09,
                  0.025,
                  0.01,
                ]}
              />
              <meshBasicMaterial
                color={lineIndex === 2 ? accent : COLORS.cyan}
                transparent
                opacity={0.55 - lineIndex * 0.06}
              />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[2.8, 0.08, 0.4]} />
        <meshStandardMaterial color={COLORS.metalLight} metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

function ClassroomPod({ position, accent }: { position: [number, number, number]; accent: string }) {
  return (
    <group position={position}>
      {[-0.85, 0.85].map((x, index) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.64, 0]}>
            <boxGeometry args={[1.2, 0.1, 0.62]} />
            <meshStandardMaterial color={COLORS.metalLight} metalness={0.8} roughness={0.32} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.08, 0.56, 0.08]} />
            <meshStandardMaterial color={COLORS.metal} />
          </mesh>
          <mesh position={[0, 1.0, -0.12]}>
            <boxGeometry args={[0.62, 0.42, 0.06]} />
            <meshStandardMaterial color={COLORS.metal} metalness={0.82} roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.0, -0.08]}>
            <planeGeometry args={[0.5, 0.31]} />
            <meshBasicMaterial color={accent} transparent opacity={0.09} />
          </mesh>
          <mesh position={[0, 0.42, 0.35]}>
            <boxGeometry args={[0.38, 0.28, 0.06]} />
            <meshStandardMaterial color={COLORS.metal} metalness={0.7} roughness={0.36} />
          </mesh>
          {index === 0 && (
            <mesh position={[0, 1.36, -0.12]}>
              <sphereGeometry args={[0.035, 7, 7]} />
              <meshBasicMaterial color={COLORS.cyan} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

function Cable({
  points,
  color,
  opacity = 0.4,
}: {
  points: [number, number, number][];
  color: string;
  opacity?: number;
}) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map((point) => new THREE.Vector3(...point)),
    );
    return new THREE.TubeGeometry(curve, 24, 0.018, 4, false);
  }, [points]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function ExperienceZone({
  z,
  reduced,
  selected,
  onSelect,
}: {
  z: number;
  reduced: boolean;
  selected: WorldSelection | null;
  onSelect: (selection: WorldSelection | null) => void;
}) {
  const objectById = new Map(experienceObjects.map((object) => [object.id, object]));

  return (
    <group>
      <Clickable
        reduced={reduced}
        selected={selected?.kind === "experience" && selected.id === "server-core"}
        onClick={() => onSelect({ kind: "experience", id: "server-core" })}
        hitBox={[2.2, 4.3, 1.8]}
        hitBoxPosition={[0, 1.8, 0]}
      >
        <group position={[0.8, 0, z + 0.6]}>
          <ServerRack position={[0, 0, 0]} accent={COLORS.accent} />
          <ServerRack position={[1.55, 0, 0]} accent={COLORS.cyan} />
          <Label3D
            text={objectById.get("server-core")?.label ?? "SERVER CORE"}
            position={[0.75, 3.3, 0]}
            width={2.1}
            color={COLORS.accent}
            opacity={0.85}
          />
        </group>
      </Clickable>

      <Clickable
        reduced={reduced}
        selected={selected?.kind === "experience" && selected.id === "support-desk"}
        onClick={() => onSelect({ kind: "experience", id: "support-desk" })}
        hitBox={[2.8, 2.3, 1.55]}
        hitBoxPosition={[0, 1.15, 0]}
      >
        <group position={[5.7, 0, z + 0.3]}>
          <SupportDesk position={[0, 0, 0]} accent={COLORS.accent} />
          <Label3D
            text={objectById.get("support-desk")?.label ?? "SUPPORT DESK"}
            position={[0, 2.4, 0]}
            width={2.05}
            color={COLORS.accent}
            opacity={0.85}
          />
        </group>
      </Clickable>

      <Clickable
        reduced={reduced}
        selected={selected?.kind === "experience" && selected.id === "network-spine"}
        onClick={() => onSelect({ kind: "experience", id: "network-spine" })}
        hitBox={[2.5, 2.4, 1.5]}
        hitBoxPosition={[0, 1.15, 0]}
      >
        <group position={[2.4, 0, z - 2.3]}>
          <NetworkSpine position={[0, 0, 0]} accent={COLORS.cyan} />
          <Label3D
            text={objectById.get("network-spine")?.label ?? "NETWORK SPINE"}
            position={[0, 2.25, 0]}
            width={2.15}
            color={COLORS.cyan}
            opacity={0.82}
          />
          <Cable
            points={[
              [0.8, 1, 0],
              [1.5, 1.2, 1.2],
              [3.4, 0.7, 1.8],
              [5.2, 1.2, 0.9],
            ]}
            color={COLORS.cyan}
          />
        </group>
      </Clickable>

      <Clickable
        reduced={reduced}
        selected={selected?.kind === "experience" && selected.id === "printer"}
        onClick={() => onSelect({ kind: "experience", id: "printer" })}
        hitBox={[2.1, 2.1, 1.5]}
        hitBoxPosition={[0, 1.05, 0]}
      >
        <group position={[8, 0, z - 1.1]}>
          <PrinterStation position={[0, 0, 0]} accent={COLORS.accent} />
          <Label3D
            text={objectById.get("printer")?.label ?? "PRINT STATION"}
            position={[0, 1.95, 0]}
            width={1.65}
            color={COLORS.accent}
            opacity={0.74}
          />
        </group>
      </Clickable>

      <Clickable
        reduced={reduced}
        selected={selected?.kind === "experience" && selected.id === "monitoring-wall"}
        onClick={() => onSelect({ kind: "experience", id: "monitoring-wall" })}
        hitBox={[3.2, 2.4, 1.3]}
        hitBoxPosition={[0, 1.35, 0]}
      >
        <group position={[5.7, 0, z - 3.8]}>
          <MonitoringWall position={[0, 0, 0]} accent={COLORS.cyan} />
          <Label3D
            text={objectById.get("monitoring-wall")?.label ?? "MONITORING WALL"}
            position={[0, 2.7, 0]}
            width={2.3}
            color={COLORS.cyan}
            opacity={0.72}
          />
        </group>
      </Clickable>

      <Clickable
        reduced={reduced}
        selected={selected?.kind === "experience" && selected.id === "classroom"}
        onClick={() => onSelect({ kind: "experience", id: "classroom" })}
        hitBox={[2.8, 1.8, 1.5]}
        hitBoxPosition={[0, 0.9, 0]}
      >
        <group position={[-0.2, 0, z + 3.4]}>
          <ClassroomPod position={[0, 0, 0]} accent={COLORS.accent} />
          <Label3D
            text={objectById.get("classroom")?.label ?? "CLASSROOM / EXAM"}
            position={[0, 1.8, 0]}
            width={2.2}
            color={COLORS.accent}
            opacity={0.7}
          />
        </group>
      </Clickable>
    </group>
  );
}

function SkillShape({ index, color }: { index: number; color: string }) {
  const material = (
    <meshStandardMaterial
      color="#0d2a2c"
      emissive={color}
      emissiveIntensity={0.22}
      metalness={0.65}
      roughness={0.3}
      flatShading
    />
  );

  switch (index % 6) {
    case 0:
      return <mesh><boxGeometry args={[0.58, 0.58, 0.58]} />{material}</mesh>;
    case 1:
      return <mesh><octahedronGeometry args={[0.42, 0]} />{material}</mesh>;
    case 2:
      return <mesh><torusGeometry args={[0.33, 0.11, 8, 24]} />{material}</mesh>;
    case 3:
      return <mesh><cylinderGeometry args={[0.3, 0.38, 0.62, 6]} />{material}</mesh>;
    case 4:
      return <mesh><dodecahedronGeometry args={[0.4, 0]} />{material}</mesh>;
    default:
      return <mesh><tetrahedronGeometry args={[0.44, 0]} />{material}</mesh>;
  }
}

function SkillsZone({
  z,
  reduced,
  selected,
  onSelect,
}: {
  z: number;
  reduced: boolean;
  selected: WorldSelection | null;
  onSelect: (selection: WorldSelection | null) => void;
}) {
  const network = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!network.current || reduced) return;
    network.current.rotation.y += delta * 0.045;
  });

  const nodes = useMemo(
    () =>
      skills.map((category, index) => {
        const angle = (index / skills.length) * Math.PI * 2;
        return {
          category,
          position: [
            Math.cos(angle) * 3.15,
            Math.sin(index * 1.45) * 0.62,
            Math.sin(angle) * 1.55,
          ] as [number, number, number],
        };
      }),
    [],
  );

  const linkPositions = useMemo(() => {
    const positions: number[] = [];
    for (const node of nodes) {
      positions.push(0, 0, 0, ...node.position);
    }
    for (let index = 0; index < nodes.length; index += 1) {
      const current = nodes[index].position;
      const next = nodes[(index + 1) % nodes.length].position;
      positions.push(...current, ...next);
    }
    return new Float32Array(positions);
  }, [nodes]);

  return (
    <group position={[WORLD_X, 1.9, z]}>
      <mesh>
        <icosahedronGeometry args={[0.52, 1]} />
        <meshStandardMaterial
          color="#0b3030"
          emissive={COLORS.accent}
          emissiveIntensity={0.32}
          metalness={0.7}
          roughness={0.24}
          flatShading
        />
      </mesh>
      <mesh scale={1.32}>
        <icosahedronGeometry args={[0.52, 1]} />
        <meshBasicMaterial
          color={COLORS.accent}
          wireframe
          transparent
          opacity={0.28}
          depthWrite={false}
        />
      </mesh>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linkPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={COLORS.accent} transparent opacity={0.18} />
      </lineSegments>

      <group ref={network}>
        {nodes.map(({ category, position }, index) => {
          const isSelected =
            selected?.kind === "skill" && selected.id === category.category;
          const color = isSelected ? COLORS.cyan : COLORS.accent;

          return (
            <Clickable
              key={category.category}
              reduced={reduced}
              accent={color}
              selected={isSelected}
              onClick={() =>
                onSelect({ kind: "skill", id: category.category })
              }
              hitBox={[1.35, 1.35, 1.35]}
              hitBoxPosition={[0, 0, 0]}
              hoverScale={1.1}
            >
              <group position={position}>
                <SkillShape index={index} color={color} />
                <mesh scale={1.55}>
                  <sphereGeometry args={[0.43, 12, 12]} />
                  <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={isSelected ? 0.11 : 0.035}
                    depthWrite={false}
                  />
                </mesh>
                <Label3D
                  text={category.category.toUpperCase()}
                  position={[0, 0.85, 0]}
                  width={1.55}
                  color={color}
                  opacity={0.78}
                />
              </group>
            </Clickable>
          );
        })}
      </group>

      <Label3D
        text="TECHNOLOGY NETWORK"
        position={[0, 4.3, 0]}
        width={2.6}
        color={COLORS.text}
        opacity={0.42}
      />
    </group>
  );
}

function ProjectArtifactShape({ project }: { project: Project }) {
  if (project.id === "finora") {
    return (
      <group>
        <mesh position={[0, 0.56, 0]}>
          <boxGeometry args={[1.3, 0.78, 0.08]} />
          <meshStandardMaterial
            color="#0a2027"
            emissive={COLORS.accent}
            emissiveIntensity={0.1}
            metalness={0.7}
            roughness={0.28}
          />
        </mesh>
        <mesh position={[0, 0.56, 0.05]}>
          <planeGeometry args={[1.14, 0.62]} />
          <meshBasicMaterial color={COLORS.accent} transparent opacity={0.07} />
        </mesh>
        {[0.4, 0.68, 0.54, 0.86].map((height, index) => (
          <mesh
            key={index}
            position={[-0.36 + index * 0.24, 0.22 + height / 2, 0.1]}
          >
            <boxGeometry args={[0.1, height, 0.04]} />
            <meshBasicMaterial
              color={index === 2 ? COLORS.cyan : COLORS.accent}
              transparent
              opacity={0.48}
            />
          </mesh>
        ))}
        <mesh position={[0, 1.45, 0]} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[0.58, 0.012, 5, 64]} />
          <meshBasicMaterial
            color={COLORS.cyan}
            transparent
            opacity={0.38}
            depthWrite={false}
          />
        </mesh>
      </group>
    );
  }

  if (project.id === "playground-life") {
    return (
      <group>
        <mesh position={[-0.38, 0.38, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#2a6f63"
            emissive="#2a6f63"
            emissiveIntensity={0.16}
            roughness={0.46}
          />
        </mesh>
        <mesh position={[0.3, 0.58, 0.06]} rotation={[0.3, 0.4, 0.2]}>
          <boxGeometry args={[0.46, 0.46, 0.46]} />
          <meshStandardMaterial
            color="#7a5b42"
            emissive="#7a5b42"
            emissiveIntensity={0.12}
            roughness={0.5}
          />
        </mesh>
        <mesh position={[0.1, 1.05, -0.08]} rotation={[0.2, 0, 0.3]}>
          <octahedronGeometry args={[0.26, 0]} />
          <meshStandardMaterial
            color="#bc6c5b"
            emissive="#bc6c5b"
            emissiveIntensity={0.18}
            roughness={0.45}
          />
        </mesh>
        <mesh position={[-0.56, 0.92, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.28, 0.035, 6, 24, Math.PI]} />
          <meshBasicMaterial color={COLORS.coral} transparent opacity={0.65} />
        </mesh>
        <mesh position={[0.05, 0.08, 0]}>
          <cylinderGeometry args={[0.72, 0.72, 0.04, 30]} />
          <meshStandardMaterial color={COLORS.metalLight} metalness={0.7} roughness={0.34} />
        </mesh>
      </group>
    );
  }

  if (project.id === "college-tv-display") {
    return (
      <group>
        <mesh position={[0, 0.68, 0]}>
          <boxGeometry args={[1.5, 0.9, 0.12]} />
          <meshStandardMaterial color="#0c1b22" metalness={0.86} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.68, 0.07]}>
          <planeGeometry args={[1.27, 0.68]} />
          <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.11} />
        </mesh>
        {[-0.2, 0.04, 0.28].map((y, index) => (
          <mesh key={y} position={[0, 0.68 + y, 0.08]}>
            <boxGeometry args={[0.78 - index * 0.12, 0.035, 0.01]} />
            <meshBasicMaterial
              color={index === 1 ? COLORS.accent : COLORS.text}
              transparent
              opacity={0.52}
            />
          </mesh>
        ))}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.045, 0.075, 0.3, 8]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
      </group>
    );
  }

  if (project.id === "property-management") {
    return (
      <group>
        {[
          [-0.42, 0.44, 0.42, 0.88],
          [0.12, 0.62, 0.38, 1.22],
          [0.51, 0.34, 0.34, 0.68],
        ].map(([x, width, depth, height], index) => (
          <group key={index} position={[x, height / 2 + 0.08, index * 0.04]}>
            <mesh>
              <boxGeometry args={[width, height, depth]} />
              <meshStandardMaterial
                color={index === 1 ? "#163239" : "#0e242b"}
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>
            {[0.25, 0.55, 0.8].map((y, windowIndex) => (
              <mesh
                key={y}
                position={[0, y * height - height / 2, depth / 2 + 0.012]}
              >
                <boxGeometry args={[width * 0.18, 0.035, 0.01]} />
                <meshBasicMaterial
                  color={windowIndex === 1 ? COLORS.cyan : COLORS.accent}
                  transparent
                  opacity={0.55}
                />
              </mesh>
            ))}
          </group>
        ))}
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.82, 0.82, 0.04, 28]} />
          <meshStandardMaterial color={COLORS.metalLight} metalness={0.7} roughness={0.34} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.25, 0.88, 0.34]} />
        <meshStandardMaterial
          color={COLORS.metal}
          metalness={0.8}
          roughness={0.3}
          wireframe
        />
      </mesh>
      {[-0.28, 0.02, 0.32].map((y, index) => (
        <group key={y} position={[0, 0.55 + y, 0.18]}>
          <mesh>
            <boxGeometry args={[0.94, 0.04, 0.3]} />
            <meshBasicMaterial color={COLORS.metalLight} />
          </mesh>
          {[-0.34, -0.06, 0.22].map((x) => (
            <mesh key={x} position={[x, 0.08, 0]}>
              <boxGeometry args={[0.16, 0.16, 0.16]} />
              <meshStandardMaterial
                color={index === 1 ? "#2b5047" : "#1b363b"}
                metalness={0.4}
                roughness={0.45}
              />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 1.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.52, 0.012, 5, 64]} />
        <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function ProjectPedestal({
  project,
  position,
  reduced,
  selected,
  onSelect,
}: {
  project: Project;
  position: [number, number, number];
  reduced: boolean;
  selected: boolean;
  onSelect: (selection: WorldSelection | null) => void;
}) {
  return (
    <Clickable
      reduced={reduced}
      accent={project.id === "playground-life" ? COLORS.coral : COLORS.cyan}
      selected={selected}
      onClick={() => onSelect({ kind: "project", id: project.id })}
      hitBox={[2.2, 3.1, 1.7]}
      hitBoxPosition={[0, 1.35, 0]}
      hoverScale={1.045}
    >
      <group position={position}>
        <Pallet position={[0, 0, 0]} accent={COLORS.cyan} size={[1.7, 0.2, 1.3]} />
        <group position={[0, 1.15, 0]}>
          <ProjectArtifactShape project={project} />
        </group>
        <Label3D
          text={project.name.toUpperCase()}
          position={[0, 2.55, 0]}
          width={2.25}
          color={COLORS.text}
          opacity={0.86}
        />
        <Label3D
          text={project.statusLabel.toUpperCase()}
          position={[0, 2.2, 0]}
          width={1.25}
          color={project.status === "live" ? COLORS.accent : COLORS.cyan}
          opacity={0.55}
        />
      </group>
    </Clickable>
  );
}

function ProjectsZone({
  z,
  reduced,
  selected,
  onSelect,
}: {
  z: number;
  reduced: boolean;
  selected: WorldSelection | null;
  onSelect: (selection: WorldSelection | null) => void;
}) {
  return (
    <group>
      {projects.map((project, index) => (
        <ProjectPedestal
          key={project.id}
          project={project}
          reduced={reduced}
          selected={selected?.kind === "project" && selected.id === project.id}
          onSelect={onSelect}
          position={[
            -1.1 + index * 2.02,
            0,
            z - 0.7 - Math.abs(index - 2) * 0.35,
          ]}
        />
      ))}
      <Label3D
        text="EXHIBITION / ILLUSTRATIVE 3D CONCEPTS"
        position={[4, 4.15, z - 1]}
        width={4}
        color={COLORS.text}
        opacity={0.35}
      />
    </group>
  );
}

function Trophy({
  position,
  reduced,
  selected,
  onSelect,
}: {
  position: [number, number, number];
  reduced: boolean;
  selected: boolean;
  onSelect: (selection: WorldSelection | null) => void;
}) {
  const rotor = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!rotor.current || reduced) return;
    rotor.current.rotation.y += delta * 0.13;
  });

  return (
    <Clickable
      reduced={reduced}
      accent={COLORS.gold}
      selected={selected}
      onClick={() => onSelect({ kind: "achievement", id: "prishtina-inovate" })}
      hitBox={[2.4, 3.8, 2.2]}
      hitBoxPosition={[0, 1.85, 0]}
      hoverScale={1.02}
    >
      <group position={position}>
        <mesh position={[0, 0.23, 0]}>
          <cylinderGeometry args={[1.0, 1.2, 0.42, 8]} />
          <meshStandardMaterial color="#101b20" metalness={0.9} roughness={0.24} />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.78, 0.92, 0.08, 8]} />
          <meshBasicMaterial color={COLORS.gold} transparent opacity={0.22} />
        </mesh>
        <group ref={rotor} position={[0, 1.35, 0]}>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.14, 0.23, 0.62, 12]} />
            <meshStandardMaterial color={COLORS.gold} metalness={0.95} roughness={0.18} />
          </mesh>
          <mesh position={[0, 0.92, 0]}>
            <cylinderGeometry args={[0.58, 0.24, 0.66, 24, 1, true]} />
            <meshStandardMaterial
              color={COLORS.gold}
              metalness={0.96}
              roughness={0.16}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0.62, 0]}>
            <sphereGeometry args={[0.24, 16, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
            <meshStandardMaterial
              color={COLORS.gold}
              metalness={0.95}
              roughness={0.18}
              side={THREE.DoubleSide}
            />
          </mesh>
          {[-1, 1].map((side) => (
            <mesh
              key={side}
              position={[side * 0.55, 1.02, 0]}
              rotation={[0, 0, side * 0.3]}
            >
              <torusGeometry args={[0.33, 0.055, 7, 24, Math.PI * 1.35]} />
              <meshStandardMaterial
                color={COLORS.gold}
                metalness={0.95}
                roughness={0.2}
              />
            </mesh>
          ))}
          <mesh position={[0, 1.38, 0]} rotation={[0, Math.PI / 4, 0]}>
            <octahedronGeometry args={[0.24, 0]} />
            <meshStandardMaterial
              color={COLORS.gold}
              emissive={COLORS.gold}
              emissiveIntensity={0.22}
              metalness={0.9}
              roughness={0.18}
            />
          </mesh>
        </group>

        <mesh position={[0, 0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.28, 1.34, 64]} />
          <meshBasicMaterial
            color={COLORS.gold}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 2.55, 0]}>
          <coneGeometry args={[1.25, 2.9, 32, 1, true]} />
          <meshBasicMaterial
            color={COLORS.gold}
            transparent
            opacity={0.026}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <pointLight
          position={[0, 3.2, 0.4]}
          intensity={12}
          distance={7}
          decay={2}
          color={COLORS.gold}
        />
        <Label3D
          text="1ST PLACE"
          position={[0, 3.12, 0]}
          width={2.3}
          color={COLORS.gold}
          opacity={0.95}
        />
        <Label3D
          text="PRISHTINA INOVATE HEALTHCARE"
          position={[0, 3.46, 0]}
          width={3.6}
          color={COLORS.text}
          opacity={0.62}
        />
        <Label3D
          text="PLAYGROUND LIFE"
          position={[0, 3.74, 0]}
          width={2.35}
          color={COLORS.gold}
          opacity={0.55}
        />
      </group>
    </Clickable>
  );
}

function AchievementsZone({
  z,
  reduced,
  selected,
  onSelect,
}: {
  z: number;
  reduced: boolean;
  selected: WorldSelection | null;
  onSelect: (selection: WorldSelection | null) => void;
}) {
  return (
    <group>
      <Trophy
        position={[WORLD_X + 0.6, 0, z - 0.4]}
        reduced={reduced}
        selected={
          selected?.kind === "achievement" && selected.id === "prishtina-inovate"
        }
        onSelect={onSelect}
      />
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[WORLD_X + 0.6 + side * 2.65, 2.1, z - 1.4]}
          rotation={[0, side * 0.28, 0]}
        >
          <planeGeometry args={[0.05, 3.4]} />
          <meshBasicMaterial
            color={COLORS.gold}
            transparent
            opacity={0.22}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function ContactTerminal({
  position,
  reduced,
  selected,
  onSelect,
}: {
  position: [number, number, number];
  reduced: boolean;
  selected: boolean;
  onSelect: (selection: WorldSelection | null) => void;
}) {
  const rings = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!rings.current || reduced) return;
    rings.current.rotation.z += delta * 0.16;
    rings.current.position.y = 2.1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.08;
  });

  return (
    <Clickable
      reduced={reduced}
      accent={COLORS.accent}
      selected={selected}
      onClick={() => onSelect({ kind: "contact", id: "contact-terminal" })}
      hitBox={[5, 3.5, 2.4]}
      hitBoxPosition={[0, 1.5, 0]}
      hoverScale={1.02}
    >
      <group position={position}>
        <mesh position={[0, 0.82, 0]}>
          <boxGeometry args={[4.3, 0.12, 1.4]} />
          <meshStandardMaterial color={COLORS.metalLight} metalness={0.86} roughness={0.28} />
        </mesh>
        {[-1.7, 1.7].map((x) => (
          <mesh key={x} position={[x, 0.4, 0]}>
            <boxGeometry args={[0.09, 0.78, 0.86]} />
            <meshStandardMaterial color={COLORS.metal} metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[0, 1.55, -0.2]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[2.8, 1.35, 0.1]} />
          <meshStandardMaterial color={COLORS.metal} metalness={0.86} roughness={0.26} />
        </mesh>
        <mesh position={[0, 1.55, -0.13]} rotation={[-0.1, 0, 0]}>
          <planeGeometry args={[2.52, 1.1]} />
          <meshBasicMaterial color={COLORS.accent} transparent opacity={0.09} />
        </mesh>
        <mesh position={[0, 1.55, -0.11]} rotation={[-0.1, 0, 0]}>
          <ringGeometry args={[0.33, 0.35, 40]} />
          <meshBasicMaterial
            color={COLORS.accent}
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0.92, 0.35]} rotation={[-0.12, 0, 0]}>
          <boxGeometry args={[1.6, 0.05, 0.4]} />
          <meshStandardMaterial color={COLORS.metal} metalness={0.72} roughness={0.36} />
        </mesh>
        <group ref={rings} position={[0, 2.1, 0]}>
          {[0.62, 1.05, 1.5].map((radius, index) => (
            <mesh key={radius} rotation={[-Math.PI / 2.2, 0.2, 0]}>
              <torusGeometry args={[radius, 0.012, 5, 64]} />
              <meshBasicMaterial
                color={index === 1 ? COLORS.cyan : COLORS.accent}
                transparent
                opacity={0.28 - index * 0.06}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
        <mesh position={[0, 2.9, 0]}>
          <sphereGeometry args={[0.09, 10, 10]} />
          <meshBasicMaterial color={COLORS.accent} />
        </mesh>
        <Label3D
          text="OPEN CHANNEL"
          position={[0, 3.18, 0]}
          width={2}
          color={COLORS.accent}
          opacity={0.85}
        />
      </group>
    </Clickable>
  );
}

function ContactZone({
  z,
  reduced,
  selected,
  onSelect,
}: {
  z: number;
  reduced: boolean;
  selected: WorldSelection | null;
  onSelect: (selection: WorldSelection | null) => void;
}) {
  return (
    <group>
      <ContactTerminal
        position={[WORLD_X + 0.2, 0, z - 0.6]}
        reduced={reduced}
        selected={
          selected?.kind === "contact" && selected.id === "contact-terminal"
        }
        onSelect={onSelect}
      />
      <mesh position={[WORLD_X + 0.2, 0.02, z - 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.28, 72]} />
        <meshBasicMaterial
          color={COLORS.accent}
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function StationPlatform({ z, accent }: { z: number; accent: string }) {
  return (
    <group position={[2.4, 0, z]}>
      <mesh position={[0, -0.16, 0]}>
        <boxGeometry args={[18.5, 0.3, 14.5]} />
        <meshStandardMaterial
          color={COLORS.floor}
          metalness={0.82}
          roughness={0.34}
        />
      </mesh>
      <mesh position={[0, 0.002, 6.85]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18.1, 0.16]} />
        <meshBasicMaterial color={accent} transparent opacity={0.4} />
      </mesh>
      <mesh position={[-8.9, 2.2, 0]}>
        <boxGeometry args={[0.06, 4.4, 13.8]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.72} roughness={0.4} />
      </mesh>
      <mesh position={[8.9, 2.2, 0]}>
        <boxGeometry args={[0.06, 4.4, 13.8]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.72} roughness={0.4} />
      </mesh>
      <mesh position={[-8.9, 4.4, 0]}>
        <boxGeometry args={[0.1, 0.06, 13.8]} />
        <meshBasicMaterial color={accent} transparent opacity={0.22} />
      </mesh>
      <mesh position={[8.9, 4.4, 0]}>
        <boxGeometry args={[0.1, 0.06, 13.8]} />
        <meshBasicMaterial color={accent} transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function Corridor() {
  const starPositions = useMemo(() => {
    const positions = new Float32Array(330 * 3);
    for (let index = 0; index < 330; index += 1) {
      positions[index * 3] = -16 + Math.random() * 42;
      positions[index * 3 + 1] = 0.6 + Math.random() * 12;
      positions[index * 3 + 2] = 24 - Math.random() * 232;
    }
    return positions;
  }, []);

  const gridPositions = useMemo(() => {
    const positions: number[] = [];
    for (let x = -10; x <= 17; x += 2.2) {
      positions.push(x, 0.012, 24, x, 0.012, -208);
    }
    for (let z = 24; z >= -208; z -= 9.5) {
      positions.push(-10, 0.012, z, 17, 0.012, z);
    }
    return new Float32Array(positions);
  }, []);

  const lightPositions = useMemo(
    () =>
      Array.from({ length: 26 }, (_, index) => (
        [2.4, 6.2, 20 - index * 9.1] as [number, number, number]
      )),
    [],
  );

  return (
    <group>
      <mesh position={[3.5, -0.2, -92]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 232]} />
        <meshStandardMaterial
          color="#050d12"
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[gridPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#17343b" transparent opacity={0.28} />
      </lineSegments>

      {[-4.4, 11.2].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.12, -92]}>
            <boxGeometry args={[0.07, 0.07, 232]} />
            <meshBasicMaterial color={COLORS.accent} transparent opacity={0.24} />
          </mesh>
          <mesh position={[x, 0.16, -92]}>
            <boxGeometry args={[0.18, 0.04, 232]} />
            <meshStandardMaterial color={COLORS.metalLight} metalness={0.82} roughness={0.32} />
          </mesh>
        </group>
      ))}

      {worldStations.map((station) => (
        <StationPlatform
          key={station.id}
          z={STATION_Z[station.id]}
          accent={STATION_ACCENT[station.id]}
        />
      ))}

      {worldStations.map((station) => {
        const z = STATION_Z[station.id];
        return (
          <group key={`arch-${station.id}`} position={[3.5, 0, z]}>
            {[-6.6, 13.6].map((x) => (
              <mesh key={x} position={[x, 3.1, 0]}>
                <boxGeometry args={[0.12, 6.2, 0.12]} />
                <meshStandardMaterial color={COLORS.metal} metalness={0.8} roughness={0.3} />
              </mesh>
            ))}
            <mesh position={[3.5, 6.2, 0]}>
              <boxGeometry args={[20.3, 0.12, 0.12]} />
              <meshStandardMaterial color={COLORS.metal} metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[3.5, 6.14, 0]}>
              <boxGeometry args={[19.5, 0.035, 0.07]} />
              <meshBasicMaterial
                color={STATION_ACCENT[station.id]}
                transparent
                opacity={0.34}
              />
            </mesh>
          </group>
        );
      })}

      {lightPositions.map((position, index) => (
        <mesh key={index} position={position}>
          <boxGeometry args={[0.5, 0.035, 1.4]} />
          <meshBasicMaterial color={COLORS.accent} transparent opacity={0.35} />
        </mesh>
      ))}

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#8be9d8"
          size={0.032}
          sizeAttenuation
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </points>

      <Cable
        points={[
          [0, 6.0, 22],
          [4, 5.5, -12],
          [8, 6.1, -44],
          [0, 5.6, -78],
          [7, 6.0, -116],
          [2, 5.4, -154],
          [5, 5.9, -194],
        ]}
        color={COLORS.accent}
        opacity={0.14}
      />
      <Cable
        points={[
          [8, 5.8, 22],
          [2, 5.4, -20],
          [9, 6.0, -55],
          [1, 5.5, -94],
          [6, 6.1, -132],
          [0, 5.4, -170],
        ]}
        color={COLORS.cyan}
        opacity={0.1}
      />

      {[12, -16, -44, -73, -101, -132, -168, -206].map((z, index) => (
        <mesh
          key={z}
          position={[index % 2 === 0 ? -2.2 : 9.2, 3.1 + (index % 3) * 0.8, z]}
          rotation={[0, index % 2 === 0 ? 0.25 : -0.25, 0]}
        >
          <planeGeometry args={[1.6, 2.7]} />
          <meshBasicMaterial
            color={COLORS.accent}
            transparent
            opacity={0.028}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function ZoneContent({
  active,
  z,
  reduced,
  selected,
  onSelect,
  onNavigate,
}: {
  active: StationId;
  z: number;
  reduced: boolean;
  selected: WorldSelection | null;
  onSelect: (selection: WorldSelection | null) => void;
  onNavigate: (station: StationId) => void;
}) {
  switch (active) {
    case "home":
      return (
        <HomeZone
          z={z}
          reduced={reduced}
          selected={selected}
          onSelect={onSelect}
          onNavigate={onNavigate}
        />
      );
    case "about":
      return <AboutZone z={z} reduced={reduced} selected={selected} onSelect={onSelect} />;
    case "experience":
      return (
        <ExperienceZone
          z={z}
          reduced={reduced}
          selected={selected}
          onSelect={onSelect}
        />
      );
    case "skills":
      return <SkillsZone z={z} reduced={reduced} selected={selected} onSelect={onSelect} />;
    case "projects":
      return (
        <ProjectsZone
          z={z}
          reduced={reduced}
          selected={selected}
          onSelect={onSelect}
        />
      );
    case "achievements":
      return (
        <AchievementsZone
          z={z}
          reduced={reduced}
          selected={selected}
          onSelect={onSelect}
        />
      );
    case "contact":
      return (
        <ContactZone
          z={z}
          reduced={reduced}
          selected={selected}
          onSelect={onSelect}
        />
      );
    default:
      return null;
  }
}

function SceneContents({
  active,
  reduced,
  mobile,
  visible,
  resetToken,
  selected,
  onSelect,
  onNavigate,
}: Omit<WorldSceneProps, "onReady">) {
  const activeIndex = worldStations.findIndex((station) => station.id === active);
  const nextStation = worldStations[(activeIndex + 1) % worldStations.length];
  const previousStation =
    worldStations[(activeIndex - 1 + worldStations.length) % worldStations.length];
  const accent = STATION_ACCENT[active];
  const z = STATION_Z[active];

  return (
    <>
      <color attach="background" args={[COLORS.background]} />
      <fog attach="fog" args={[COLORS.background, 26, 92]} />

      <ambientLight intensity={0.48} />
      <hemisphereLight args={["#71c9bd", "#020508", 0.48]} />
      <directionalLight
        position={[6, 12, 8]}
        intensity={1.8}
        color="#d9f7f0"
      />
      <pointLight
        position={[0, 5, z + 5]}
        intensity={34}
        distance={19}
        decay={2}
        color={accent}
      />
      <pointLight
        position={[7, 3.2, z - 3]}
        intensity={20}
        distance={13}
        decay={2}
        color={COLORS.cyan}
      />

      <CameraRig
        active={active}
        reduced={reduced}
        mobile={mobile}
        resetToken={resetToken}
      />
      <Corridor />

      <ZoneContent
        active={active}
        z={z}
        reduced={reduced}
        selected={selected}
        onSelect={onSelect}
        onNavigate={onNavigate}
      />

      <ZoneContent
        active={nextStation.id}
        z={STATION_Z[nextStation.id]}
        reduced
        selected={null}
        onSelect={() => undefined}
        onNavigate={onNavigate}
      />

      <NavPortal
        position={[8.3, 0, z + 2.8]}
        label={nextStation.label.toUpperCase()}
        direction="next"
        station={nextStation.id}
        accent={STATION_ACCENT[nextStation.id]}
        reduced={reduced}
        onNavigate={onNavigate}
      />
      <NavPortal
        position={[-4.2, 0, z + 3.2]}
        label={previousStation.label.toUpperCase()}
        direction="previous"
        station={previousStation.id}
        accent={STATION_ACCENT[previousStation.id]}
        reduced={reduced}
        onNavigate={onNavigate}
      />

      <InvalidateOnChange
        value={`${active}:${mobile}:${reduced}:${visible}:${selected?.kind ?? ""}:${selected?.id ?? ""}`}
      />
      <AdaptiveDpr />
      <CanvasCleanup />
    </>
  );
}

export default function WorldScene({
  active,
  reduced,
  mobile,
  visible,
  resetToken,
  selected,
  onSelect,
  onNavigate,
  onReady,
}: WorldSceneProps) {
  return (
    <Canvas
      dpr={[1, mobile ? 1.3 : 1.75]}
      frameloop={!visible ? "never" : reduced ? "demand" : "always"}
      performance={{ min: 0.45 }}
      camera={{
        position: DESKTOP_CAMERAS.home.position,
        fov: mobile ? 58 : 44,
        near: 0.1,
        far: 260,
      }}
      gl={{
        antialias: !mobile,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(COLORS.background);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
        window.requestAnimationFrame(() => onReady());
      }}
      onPointerMissed={() => onSelect(null)}
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <SceneContents
          active={active}
          reduced={reduced}
          mobile={mobile}
          visible={visible}
          resetToken={resetToken}
          selected={selected}
          onSelect={onSelect}
          onNavigate={onNavigate}
        />
      </Suspense>
    </Canvas>
  );
}
