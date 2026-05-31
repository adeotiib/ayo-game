'use client';
import { useMemo } from 'react';
import * as THREE from 'three';

const COLORS = ['#C84B11', '#D4A017', '#8B4513', '#CD853F', '#A0522D', '#D2691E'];

interface Props {
  count: number;
  radius: number;
}

export function SeedCluster({ count, radius }: Props) {
  const positions = useMemo(() => {
    const pos: [number, number, number][] = [];
    const cap = Math.min(count, 32);
    for (let i = 0; i < cap; i++) {
      const angle = i * 2.399; // golden angle
      const r = Math.sqrt((i + 0.5) / cap) * radius * 0.82;
      const layer = Math.floor(i / 10);
      pos.push([
        Math.cos(angle) * r,
        0.04 + layer * 0.09,
        Math.sin(angle) * r,
      ]);
    }
    return pos;
  }, [count, radius]);

  return (
    <>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <sphereGeometry args={[0.055, 7, 7]} />
          <meshStandardMaterial color={COLORS[i % COLORS.length]} roughness={0.75} />
        </mesh>
      ))}
    </>
  );
}
