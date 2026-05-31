'use client';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SeedCluster } from './SeedCluster';

interface Props {
  index: number;
  seeds: number;
  isStore: boolean;
  isClickable: boolean;
  isCapturing: boolean;
  position: [number, number, number];
  onSelect: () => void;
}

export function PitHole({ seeds, isStore, isClickable, isCapturing, position, onSelect }: Props) {
  const [hovered, setHovered] = useState(false);
  const glowRef = useRef<THREE.Mesh>(null);

  const r = isStore ? 0.52 : 0.36;

  useFrame((_, dt) => {
    if (!glowRef.current) return;
    const mat = glowRef.current.material as THREE.MeshBasicMaterial;
    const want = isCapturing ? 1 : (hovered && isClickable) ? 0.85 : 0;
    mat.opacity += (want - mat.opacity) * Math.min(1, dt * 12);
  });

  return (
    <group
      position={position}
      onClick={(e) => { e.stopPropagation(); if (isClickable) onSelect(); }}
      onPointerEnter={() => {
        setHovered(true);
        if (isClickable) document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Outer raised rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <ringGeometry args={[r * 0.82, r + 0.05, 40]} />
        <meshStandardMaterial color="#7B4200" roughness={0.6} metalness={0.15} />
      </mesh>

      {/* Dark pit interior */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[r * 0.82, 40]} />
        <meshStandardMaterial color="#110400" roughness={0.95} />
      </mesh>

      {/* Inner shadow ring for depth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[r * 0.6, r * 0.82, 40]} />
        <meshStandardMaterial color="#2A0B00" roughness={0.9} />
      </mesh>

      {/* Glow ring (hover / capture) */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[r + 0.03, r + 0.1, 40]} />
        <meshBasicMaterial
          color={isCapturing ? '#FF4500' : '#FFD700'}
          transparent
          opacity={0}
        />
      </mesh>

      {/* Seeds sit inside the pit */}
      <group position={[0, 0.02, 0]}>
        <SeedCluster count={seeds} radius={r * 0.72} />
      </group>

      {/* Invisible larger click zone */}
      <mesh visible={false}>
        <cylinderGeometry args={[r + 0.15, r + 0.15, 0.3, 16]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}
