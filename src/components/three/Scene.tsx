import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 2500;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x += delta * 0.01;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#6366f1"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.65}
      />
    </Points>
  );
}

function FloatingRing({
  radius,
  speed,
  tilt,
}: {
  radius: number;
  speed: number;
  tilt: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * speed;
    ref.current.rotation.x = tilt + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.007, 16, 120]} />
      <meshBasicMaterial color="#818cf8" transparent opacity={0.3} />
    </mesh>
  );
}

function CoreSphere() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.2;
    ref.current.rotation.x = state.clock.elapsedTime * 0.1;
    const s = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.04;
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.6, 4]} />
      <meshPhongMaterial
        color="#4f46e5"
        emissive="#312e81"
        wireframe
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#818cf8" />
      <pointLight position={[-5, -3, -5]} intensity={0.8} color="#6366f1" />
      <CoreSphere />
      <FloatingRing radius={1.4} speed={0.3} tilt={0.4} />
      <FloatingRing radius={2.0} speed={-0.18} tilt={1.1} />
      <FloatingRing radius={2.6} speed={0.12} tilt={0.7} />
      <ParticleField />
    </Canvas>
  );
}
