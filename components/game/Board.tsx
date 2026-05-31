'use client';

export function Board() {
  return (
    <group>
      {/* Main board body */}
      <mesh receiveShadow castShadow position={[0, -0.01, 0]}>
        <boxGeometry args={[9.6, 0.46, 2.8]} />
        <meshStandardMaterial color="#3B1A00" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Top playing surface */}
      <mesh receiveShadow position={[0, 0.22, 0]}>
        <boxGeometry args={[9.6, 0.01, 2.8]} />
        <meshStandardMaterial color="#6B3000" roughness={0.72} metalness={0.06} />
      </mesh>

      {/* Gold border strips */}
      {/* Front */}
      <mesh position={[0, 0.23, 1.37]}>
        <boxGeometry args={[9.6, 0.07, 0.12]} />
        <meshStandardMaterial color="#C8860A" roughness={0.4} metalness={0.35} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.23, -1.37]}>
        <boxGeometry args={[9.6, 0.07, 0.12]} />
        <meshStandardMaterial color="#C8860A" roughness={0.4} metalness={0.35} />
      </mesh>
      {/* Left */}
      <mesh position={[-4.74, 0.23, 0]}>
        <boxGeometry args={[0.12, 0.07, 2.8]} />
        <meshStandardMaterial color="#C8860A" roughness={0.4} metalness={0.35} />
      </mesh>
      {/* Right */}
      <mesh position={[4.74, 0.23, 0]}>
        <boxGeometry args={[0.12, 0.07, 2.8]} />
        <meshStandardMaterial color="#C8860A" roughness={0.4} metalness={0.35} />
      </mesh>

      {/* Store dividers (vertical bars separating store from play area) */}
      <mesh position={[3.12, 0.23, 0]}>
        <boxGeometry args={[0.06, 0.08, 2.0]} />
        <meshStandardMaterial color="#C8860A" roughness={0.4} metalness={0.35} />
      </mesh>
      <mesh position={[-3.12, 0.23, 0]}>
        <boxGeometry args={[0.06, 0.08, 2.0]} />
        <meshStandardMaterial color="#C8860A" roughness={0.4} metalness={0.35} />
      </mesh>

      {/* Center divider between P1 and P2 rows */}
      <mesh position={[0, 0.24, 0]}>
        <boxGeometry args={[6.3, 0.04, 0.04]} />
        <meshStandardMaterial color="#C8860A" roughness={0.4} metalness={0.35} />
      </mesh>

      {/* Kente color accents on side edges */}
      {['#C8860A', '#8B0000', '#2F4F00', '#FFD700', '#C8860A', '#8B0000'].map((c, i) => (
        <mesh key={`fl${i}`} position={[0, 0.245, 1.38 - i * 0.004]}>
          <boxGeometry args={[9.6, 0.03, 0.003]} />
          <meshStandardMaterial color={c} roughness={0.3} />
        </mesh>
      ))}

      {/* Board legs */}
      {([-4.0, 4.0] as number[]).flatMap(x =>
        ([-0.9, 0.9] as number[]).map(z => (
          <mesh key={`leg${x}${z}`} position={[x, -0.48, z]} castShadow>
            <cylinderGeometry args={[0.1, 0.13, 0.5, 8]} />
            <meshStandardMaterial color="#2A0D00" roughness={0.9} />
          </mesh>
        ))
      )}
    </group>
  );
}
