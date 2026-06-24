import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 3000 }) {
  const mesh = useRef<THREE.Points>(null!);
  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 5 + Math.random() * 20;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      siz[i] = Math.random() * 1.5 + 0.3;
    }
    return [pos, siz];
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.015;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.03;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#FF5E00"
        transparent
        opacity={0.35}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function KnowledgeGraph() {
  const group = useRef<THREE.Group>(null!);
  const nodeCount = 45;
  const connectionCount = 60;

  const { nodes, connections } = useMemo(() => {
    const n: { pos: THREE.Vector3; size: number; phase: number }[] = [];
    for (let i = 0; i < nodeCount; i++) {
      n.push({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 6
        ),
        size: 0.04 + Math.random() * 0.06,
        phase: Math.random() * Math.PI * 2,
      });
    }
    const conn: [number, number][] = [];
    for (let i = 0; i < connectionCount; i++) {
      conn.push([
        Math.floor(Math.random() * nodeCount),
        Math.floor(Math.random() * nodeCount),
      ]);
    }
    return { nodes: n, connections: conn };
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.children.forEach((child, i) => {
        if (i < nodeCount && child instanceof THREE.Mesh) {
          const node = nodes[i];
          child.position.y += Math.sin(state.clock.elapsedTime * 0.2 + node.phase) * 0.0003;
          const scale = 1 + Math.sin(state.clock.elapsedTime * 0.3 + node.phase) * 0.2;
          child.scale.setScalar(scale);
        }
      });
    }
  });

  return (
    <group ref={group}>
      {nodes.map((node, i) => (
        <mesh key={`node-${i}`} position={node.pos}>
          <sphereGeometry args={[node.size, 12, 12]} />
          <meshBasicMaterial color="#FF7B2E" transparent opacity={0.4} />
        </mesh>
      ))}
      {connections.map(([a, b], i) => {
        if (!nodes[a] || !nodes[b]) return null;
        const positions = new Float32Array([
          nodes[a].pos.x, nodes[a].pos.y, nodes[a].pos.z,
          nodes[b].pos.x, nodes[b].pos.y, nodes[b].pos.z,
        ]);
        return (
          <line key={`conn-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={positions}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#FF5E00" transparent opacity={0.15} />
          </line>
        );
      })}
    </group>
  );
}

function FloatingDocs() {
  const group = useRef<THREE.Group>(null!);
  const docs = useMemo(() => {
    const arr: {
      pos: THREE.Vector3;
      size: number;
      rotation: number;
      speed: number;
      phase: number;
    }[] = [];
    for (let i = 0; i < 12; i++) {
      arr.push({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 10 - 2,
          (Math.random() - 0.5) * 8 - 3
        ),
        size: 0.08 + Math.random() * 0.1,
        rotation: Math.random() * Math.PI,
        speed: 0.1 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.children.forEach((child, i) => {
        if (i < docs.length) {
          const doc = docs[i];
          child.position.y += Math.sin(state.clock.elapsedTime * doc.speed + doc.phase) * 0.0004;
          child.rotation.z = doc.rotation + Math.sin(state.clock.elapsedTime * 0.1 + doc.phase) * 0.1;
        }
      });
    }
  });

  return (
    <group ref={group}>
      {docs.map((doc, i) => (
        <mesh key={`doc-${i}`} position={doc.pos} rotation={[0, doc.rotation, doc.rotation * 0.3]}>
          <planeGeometry args={[doc.size * 2.5, doc.size * 3.2]} />
          <meshBasicMaterial
            color="#1F0F08"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(doc.size * 2.5, doc.size * 3.2)]} />
            <lineBasicMaterial color="#FF5E00" transparent opacity={0.2} />
          </lineSegments>
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <Particles count={4000} />
      <KnowledgeGraph />
      <FloatingDocs />
      <ambientLight intensity={0.1} />
    </>
  );
}

export default function ParticleBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
