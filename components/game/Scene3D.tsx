'use client';
import { PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei';
import { useGameStore } from '@/lib/gameStore';
import { PIT_POSITIONS, P1_PITS, P2_PITS, P1_STORE, P2_STORE } from '@/lib/gameLogic';
import { Board } from './Board';
import { PitHole } from './PitHole';
import { PlayerHand } from './PlayerHand';
import { Lighting } from './Lighting';

export function Scene3D() {
  const { displayPits, currentPlayer, phase, capturedPits, selectPit } = useGameStore();

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 8.5, 5.5]} fov={42} />
      <OrbitControls
        enablePan={false}
        enableRotate={false}
        enableZoom={true}
        minDistance={8}
        maxDistance={18}
        target={[0, 0, 0]}
      />

      <Lighting />

      {/* Warm fog */}
      <fog attach="fog" args={['#3B1A00', 18, 35]} />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#1A0A00" roughness={1} />
      </mesh>

      <Board />

      {/* Pits */}
      {PIT_POSITIONS.map((pos, i) => {
        const isStore = i === P1_STORE || i === P2_STORE;
        const isP1Pit = P1_PITS.includes(i);
        const isP2Pit = P2_PITS.includes(i);
        const clickable =
          phase === 'playing' &&
          ((currentPlayer === 1 && isP1Pit) || (currentPlayer === 2 && isP2Pit)) &&
          displayPits[i] > 0;

        return (
          <PitHole
            key={i}
            index={i}
            seeds={displayPits[i]}
            isStore={isStore}
            isClickable={clickable}
            isCapturing={capturedPits.includes(i)}
            position={pos}
            onSelect={() => selectPit(i)}
          />
        );
      })}

      {/* Player hands */}
      <PlayerHand player={1} />
      <PlayerHand player={2} />

      {/* Subtle table surface reflection */}
      <Environment preset="sunset" />
    </>
  );
}
