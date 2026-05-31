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
  const ringRef = useRef<THREE.Mesh>(null);

  const radius = isStore ? 0.48 : 0.33;
  const depth = isStore ? 0.4 : 0.28;

  useFrame((_, dt) => {
    if (!ringRef.current) return;
    const target = (hovered && isClickable) ? 1 : isCapturing ? 1.5 : 0;
    (ringRef.current.material as THREE.MeshBasicMaterial).opacity +=
      (target - (ringRef.current.material as THREE.MeshBasicMaterial).opacity) * Math.min(1, dt * 10);
  });

  return (
    <group
      position={position}
      onClick={(e) => { e.stopPropagation(); if (isClickable) onSelect(); }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Bowl shell (outer) */}
      <mesh receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius * 0.75, depth, 24, 1, true]} />
        <meshStandardMaterial color="#2A0F00" side={THREE.BackSide} roughness={0.9} />
      </mesh>

      {/* Rim ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[radius - 0.01, radius + 0.04, 32]} />
        <meshStandardMaterial color="#5A3000" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Gold highlight ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[radius + 0.04, radius + 0.1, 32]} />
        <meshBasicMaterial color={isCapturing ? '#FF4500' : '#FFD700'} transparent opacity={0} />
      </mesh>

      {/* Seeds */}
      <SeedCluster count={seeds} radius={radius * 0.85} />

      {/* Cursor pointer area */}
      {isClickable && (
        <mesh position={[0, 0.15, 0]} visible={false}>
          <cylinderGeometry args={[radius + 0.12, radius + 0.12, 0.3, 16]} />
          <meshBasicMaterial />
        </mesh>
      )}
    </group>
  );
}
