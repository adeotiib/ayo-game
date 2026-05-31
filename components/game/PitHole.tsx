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

  const r = isStore ? 0.52 : 0.355;
  const wallH = isStore ? 0.24 : 0.22;   // cylinder height above board surface
  const rBot = r * 0.72;                   // narrower at bottom = bowl taper

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
      onPointerEnter={() => { setHovered(true); if (isClickable) document.body.style.cursor = 'pointer'; }}
      onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      {/*
       * Hollow-pit trick:
       * A cylinder sits ON the board surface (not below it), rendered BackSide.
       * • The outer wall is invisible (BackSide skips front faces).
       * • The inner wall IS visible from above → looks like a dark hole.
       * A dark disc plugs the bottom so you don't see the board through it.
       * The rim ring is a flat ring at the very top, sitting proud on the board.
       */}

      {/* Dark floor — just a hair above the board surface to avoid z-fight */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <circleGeometry args={[rBot + 0.01, 40]} />
        <meshStandardMaterial color="#060100" roughness={1} />
      </mesh>

      {/* Hollow bowl walls — open at top, tapered toward bottom */}
      <mesh position={[0, wallH / 2, 0]}>
        <cylinderGeometry args={[r, rBot, wallH, 40, 3, true]} />
        <meshStandardMaterial
          color="#230A00"
          side={THREE.BackSide}
          roughness={0.93}
          metalness={0.0}
        />
      </mesh>

      {/* Outer rim ring — sits at the top of the bowl, proud of the board */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, wallH + 0.008, 0]}>
        <ringGeometry args={[r, r + 0.07, 40]} />
        <meshStandardMaterial color="#8B5200" roughness={0.55} metalness={0.18} />
      </mesh>

      {/* Gold/red glow around rim on hover or capture */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, wallH + 0.016, 0]}>
        <ringGeometry args={[r + 0.05, r + 0.14, 40]} />
        <meshBasicMaterial
          color={isCapturing ? '#FF4500' : '#FFD700'}
          transparent
          opacity={0}
        />
      </mesh>

      {/* Seeds sit partway up inside the bowl */}
      <group position={[0, wallH * 0.18, 0]}>
        <SeedCluster count={seeds} radius={rBot * 0.88} />
      </group>

      {/* Invisible wider click zone */}
      <mesh visible={false}>
        <cylinderGeometry args={[r + 0.15, r + 0.15, 0.4, 16]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}
