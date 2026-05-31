'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/lib/gameStore';
import { PIT_POSITIONS, P1_PITS, P2_PITS } from '@/lib/gameLogic';
import { Player } from '@/types/game';

interface FingerProps {
  posX: number;
  posZ: number;
  length: number;
  width: number;
  color: string;
  curl: number;
}

function Finger({ posX, posZ, length, width, color, curl }: FingerProps) {
  return (
    <group position={[posX, 0, posZ]}>
      <group rotation={[curl, 0, 0]}>
        <mesh position={[0, 0, -(length / 2 + 0.01)]} castShadow>
          <capsuleGeometry args={[width, length, 4, 6]} />
          <meshStandardMaterial color={color} roughness={0.75} />
        </mesh>
      </group>
    </group>
  );
}

interface HandModelProps {
  color: string;
  glowColor?: string;
  isGrabbing: boolean;
}

function HandModel({ color, glowColor, isGrabbing }: HandModelProps) {
  const curl = isGrabbing ? 1.15 : 0.06;

  return (
    <group>
      {/* Palm */}
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.055, 0.22]} />
        <meshStandardMaterial color={color} roughness={0.72} />
      </mesh>

      {/* Wrist */}
      <mesh position={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[0.24, 0.05, 0.12]} />
        <meshStandardMaterial color={color} roughness={0.72} />
      </mesh>

      {/* Knuckle bumps */}
      {[-0.09, -0.03, 0.03, 0.09].map((x, i) => (
        <mesh key={i} position={[x, 0.025, -0.1]} castShadow>
          <sphereGeometry args={[0.032, 6, 6]} />
          <meshStandardMaterial color={color} roughness={0.72} />
        </mesh>
      ))}

      {/* Fingers */}
      <Finger posX={-0.09} posZ={-0.11} length={0.16} width={0.024} color={color} curl={curl} />
      <Finger posX={-0.03} posZ={-0.11} length={0.19} width={0.026} color={color} curl={curl} />
      <Finger posX={0.03}  posZ={-0.11} length={0.18} width={0.025} color={color} curl={curl} />
      <Finger posX={0.09}  posZ={-0.11} length={0.14} width={0.022} color={color} curl={curl} />

      {/* Thumb */}
      <group position={[0.17, 0.01, 0.06]} rotation={[0.15, 0, -0.75 + (isGrabbing ? 0.55 : 0)]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.028, 0.13, 4, 6]} />
          <meshStandardMaterial color={color} roughness={0.72} />
        </mesh>
      </group>

      {/* AI glow effect */}
      {glowColor && (
        <mesh>
          <boxGeometry args={[0.36, 0.07, 0.28]} />
          <meshBasicMaterial color={glowColor} transparent opacity={0.18} />
        </mesh>
      )}
    </group>
  );
}

// Idle positions sit clearly outside the board (board front/back edge is z=±1.4)
const IDLE_POS: Record<Player, THREE.Vector3> = {
  1: new THREE.Vector3(0, 0.4, 2.6),
  2: new THREE.Vector3(0, 0.4, -2.6),
};

export function PlayerHand({ player }: { player: Player }) {
  const ref = useRef<THREE.Group>(null);
  const { handPit, handPlayer, isHandGrabbing, phase, currentPlayer, mode } = useGameStore();

  const isAnimating = handPlayer === player && phase === 'animating';
  // Always show hand during gameplay — idle when not your turn, active when it is
  const visible = phase === 'playing' || phase === 'animating' || phase === 'gameover';

  // Move to active pit only when it's this player animating; otherwise rest outside board
  const target = new THREE.Vector3();
  if (isAnimating && handPit !== null) {
    const [px, , pz] = PIT_POSITIONS[handPit];
    target.set(px, 0.75, pz);
  } else {
    target.copy(IDLE_POS[player]);
  }

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.position.lerp(target, Math.min(1, dt * 9));
    // Subtle idle bob
    if (!isAnimating) {
      ref.current.position.y +=
        Math.sin(Date.now() * 0.002) * 0.003;
    }
  });

  // P2 hand is rotated 180° on Y so fingers point toward board center
  const yRot = player === 2 ? Math.PI : 0;
  const skinColor = player === 1 ? '#C48B3A' : '#8C5120';
  const glowColor = mode === 'ai' && player === 2 ? '#FF6A00' : undefined;

  return (
    <group ref={ref} visible={visible} rotation={[0, yRot, 0]}>
      <HandModel color={skinColor} glowColor={glowColor} isGrabbing={isHandGrabbing && handPlayer === player} />
    </group>
  );
}
