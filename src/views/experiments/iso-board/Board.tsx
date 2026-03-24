import { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  type HeightLevel,
  VISUAL_SCALE,
  BASE_Y,
  HEIGHT_COLORS,
  isWater,
} from "./terrain";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GRID_SIZE = 20;
const TILE      = 0.94;   // slight gap between tiles
const WATER_Y   = -0.08;  // world-Y of the water surface plane

// Isometric camera setup — camera sits at target + ISO_OFFSET
const ISO_OFFSET = new THREE.Vector3(20, 20, 20);
const PAN_FWD    = new THREE.Vector3(-1, 0, -1).normalize(); // ↑ screen → -X -Z world
const PAN_RIGHT  = new THREE.Vector3( 1, 0, -1).normalize(); // → screen →  +X -Z world
const PAN_SPEED  = 7;     // world units per second
const ZOOM_MIN   = 14;
const ZOOM_MAX   = 90;

// ---------------------------------------------------------------------------
// Tile
// ---------------------------------------------------------------------------

/**
 * A single extruded tile.
 * The box always extends down to BASE_Y so tile sides are always solid.
 */
function Tile({
  col,
  row,
  height,
}: {
  col: number;
  row: number;
  height: HeightLevel;
}) {
  const topY   = height * VISUAL_SCALE;
  const boxH   = topY - BASE_Y;           // total height of box geometry
  const centerY = BASE_Y + boxH / 2;      // Y of box centre
  const offset  = (GRID_SIZE - 1) / 2;   // centre the board at origin

  const color = useMemo(() => {
    // Add a tiny per-tile brightness variation for a painterly effect
    const base = new THREE.Color(HEIGHT_COLORS[height]);
    const jitter = (hash(col * 31 + row * 17) - 0.5) * 0.07;
    base.offsetHSL(0, 0, jitter);
    return base;
  }, [col, row, height]);

  return (
    <mesh
      position={[col - offset, centerY, row - offset]}
      receiveShadow
      castShadow
    >
      <boxGeometry args={[TILE, boxH, TILE]} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
}

/** Tiny deterministic hash for per-tile colour variation */
function hash(n: number): number {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

// ---------------------------------------------------------------------------
// Water surface
// ---------------------------------------------------------------------------

function WaterPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, WATER_Y, 0]}>
      <planeGeometry args={[GRID_SIZE + 2, GRID_SIZE + 2]} />
      <meshLambertMaterial
        color="#1b5080"
        transparent
        opacity={0.62}
        depthWrite={false}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Camera rig
// ---------------------------------------------------------------------------

interface CameraRigProps {
  freeMode: boolean;
}

function CameraRig({ freeMode }: CameraRigProps) {
  const { camera, gl } = useThree();
  const keys      = useRef(new Set<string>());
  const panTarget = useRef(new THREE.Vector3(0, 0, 0));
  const zoom      = useRef(42);
  const freeModeRef = useRef(freeMode);

  // Keep ref in sync so wheel/frame handlers don't close over stale freeMode
  useEffect(() => {
    freeModeRef.current = freeMode;
  }, [freeMode]);

  // Initial camera position
  useEffect(() => {
    const oc = camera as THREE.OrthographicCamera;
    oc.zoom = zoom.current;
    oc.near = 0.01;
    oc.far  = 400;
    camera.position.copy(ISO_OFFSET);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    oc.updateProjectionMatrix();
  }, [camera]);

  // Snap back to isometric when leaving free mode
  useEffect(() => {
    if (!freeMode) {
      const oc = camera as THREE.OrthographicCamera;
      const t = panTarget.current;
      camera.position.set(
        t.x + ISO_OFFSET.x,
        t.y + ISO_OFFSET.y,
        t.z + ISO_OFFSET.z
      );
      camera.lookAt(t);
      oc.zoom = zoom.current;
      oc.updateProjectionMatrix();
    }
  }, [freeMode, camera]);

  // Keyboard listeners
  useEffect(() => {
    const ARROW_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
    const onDown = (e: KeyboardEvent) => {
      if (ARROW_KEYS.has(e.key)) e.preventDefault(); // stop page scroll
      keys.current.add(e.key);
    };
    const onUp = (e: KeyboardEvent) => keys.current.delete(e.key);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup",   onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup",   onUp);
    };
  }, []);

  // Wheel zoom (locked mode only — OrbitControls handles free mode)
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (freeModeRef.current) return;
      e.preventDefault();
      const oc = camera as THREE.OrthographicCamera;
      zoom.current = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoom.current - e.deltaY * 0.07));
      oc.zoom = zoom.current;
      oc.updateProjectionMatrix();
    };
    gl.domElement.addEventListener("wheel", onWheel, { passive: false });
    return () => gl.domElement.removeEventListener("wheel", onWheel);
  }, [camera, gl]);

  // Per-frame: arrow-key pan
  useFrame((_, delta) => {
    if (freeModeRef.current) return;
    const speed = PAN_SPEED * delta;
    const t = panTarget.current;

    if (keys.current.has("ArrowUp"))    t.addScaledVector(PAN_FWD,    speed);
    if (keys.current.has("ArrowDown"))  t.addScaledVector(PAN_FWD,   -speed);
    if (keys.current.has("ArrowLeft"))  t.addScaledVector(PAN_RIGHT,  -speed);
    if (keys.current.has("ArrowRight")) t.addScaledVector(PAN_RIGHT,   speed);

    camera.position.set(
      t.x + ISO_OFFSET.x,
      t.y + ISO_OFFSET.y,
      t.z + ISO_OFFSET.z
    );
    camera.lookAt(t);
  });

  return (
    <OrbitControls
      enabled={freeMode}
      makeDefault={freeMode}
      enableDamping
      dampingFactor={0.08}
    />
  );
}

// ---------------------------------------------------------------------------
// Board — main export
// ---------------------------------------------------------------------------

interface BoardProps {
  heightMap: HeightLevel[][];
  freeMode: boolean;
}

export function Board({ heightMap, freeMode }: BoardProps) {
  return (
    <>
      {/* Atmosphere */}
      <fog attach="fog" args={["#090d16", 38, 72]} />
      <color attach="background" args={["#090d16"]} />

      {/* Lighting */}
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[12, 22, 8]}
        intensity={1.3}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-camera-near={0.1}
        shadow-camera-far={80}
      />
      {/* Soft fill from opposite side */}
      <directionalLight position={[-8, 10, -10]} intensity={0.25} color="#6080b0" />

      {/* Camera controls */}
      <CameraRig freeMode={freeMode} />

      {/* Terrain */}
      <group>
        {heightMap.map((row, ri) =>
          row.map((h, ci) => (
            <Tile key={`${ri}-${ci}`} col={ci} row={ri} height={h} />
          ))
        )}
        <WaterPlane />
      </group>
    </>
  );
}
