'use client';
import * as THREE from 'three';

// Adinkra-inspired decorative strips along board edges
function BorderStrip({ x, z, width, depth }: { x: number; z: number; width: number; depth: number }) {
  const colors = ['#C8860A', '#8B0000', '#2F4F00', '#C8860A'];
  return (
    <>
      {colors.map((c, i) => (
        <mesh key={i} position={[x, 0.22, z]} receiveShadow>
          <boxGeometry args={[width, 0.04, depth / colors.length]} />
          <meshStandardMaterial color={c} roughness={0.6} metalness={0.1} />
        </mesh>
      ))}
    </>
  );
}

export function Board() {
  return (
    <group>
      {/* Main board body */}
      <mesh receiveShadow position={[0, -0.01, 0]} castShadow>
        <boxGeometry args={[9.8, 0.45, 3.0]} />
        <meshStandardMaterial color="#3B1A00" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Top playing surface */}
      <mesh receiveShadow position={[0, 0.22, 0]}>
        <boxGeometry args={[9.8, 0.01, 3.0]} />
        <meshStandardMaterial color="#6B3000" roughness={0.75} metalness={0.06} />
      </mesh>

      {/* Decorative border - front */}
      <mesh position={[0, 0.22, 1.42]}>
        <boxGeometry args={[9.8, 0.06, 0.16]} />
        <meshStandardMaterial color="#C8860A" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Decorative border - back */}
      <mesh position={[0, 0.22, -1.42]}>
        <boxGeometry args={[9.8, 0.06, 0.16]} />
        <meshStandardMaterial color="#C8860A" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Decorative border - left */}
      <mesh position={[-4.82, 0.22, 0]}>
        <boxGeometry args={[0.16, 0.06, 3.0]} />
        <meshStandardMaterial color="#C8860A" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Decorative border - right */}
      <mesh position={[4.82, 0.22, 0]}>
        <boxGeometry args={[0.16, 0.06, 3.0]} />
        <meshStandardMaterial color="#C8860A" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Inner divider line between P1 and P2 rows */}
      <mesh position={[0, 0.23, 0]}>
        <boxGeometry args={[7.6, 0.02, 0.04]} />
        <meshStandardMaterial color="#C8860A" roughness={0.4} metalness={0.4} />
      </mesh>

      {/* Store dividers */}
      <mesh position={[3.2, 0.23, 0]}>
        <boxGeometry args={[0.04, 0.02, 2.2]} />
        <meshStandardMaterial color="#C8860A" roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[-3.2, 0.23, 0]}>
        <boxGeometry args={[0.04, 0.02, 2.2]} />
        <meshStandardMaterial color="#C8860A" roughness={0.4} metalness={0.4} />
      </mesh>

      {/* Decorative dots pattern on each side */}
      {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((x, i) => (
        <mesh key={i} position={[x, 0.23, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.04, 8]} />
          <meshBasicMaterial color="#C8860A" />
        </mesh>
      ))}

      {/* Legs */}
      {[[-4.2, -1.1], [4.2, -1.1], [-4.2, 1.1], [4.2, 1.1]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, -0.45, lz]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 0.5, 8]} />
          <meshStandardMaterial color="#2A0D00" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}
