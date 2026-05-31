'use client';
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/lib/gameStore';
import { PIT_POSITIONS, P1_PITS, P2_PITS, P1_STORE, P2_STORE } from '@/lib/gameLogic';
import { Board } from './Board';
import { PitHole } from './PitHole';
import { PlayerHand } from './PlayerHand';
import { Lighting } from './Lighting';

function AdaptiveCamera() {
  const { size, camera } = useThree();

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;

    if (aspect < 0.75) {
      // Portrait phone — zoom out and increase FOV to fit the board
      cam.position.set(0, 14, 9.5);
      cam.fov = 60;
    } else if (aspect < 1.1) {
      // Near-square (small tablet, landscape phone)
      cam.position.set(0, 11, 7.5);
      cam.fov = 50;
    } else {
      // Landscape / desktop
      cam.position.set(0, 8.5, 5.5);
      cam.fov = 42;
    }
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
  }, [size.width, size.height, camera]);

  return null;
}

export function Scene3D() {
  const { displayPits, currentPlayer, phase, capturedPits, selectPit } = useGameStore();

  return (
    <>
      <AdaptiveCamera />
      <OrbitControls
        enablePan={false}
        enableRotate={false}
        enableZoom={true}
        minDistance={6}
        maxDistance={22}
        target={[0, 0, 0]}
        touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN }}
      />

      <Lighting />

      <fog attach="fog" args={['#3B1A00', 18, 38]} />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#1A0A00" roughness={1} />
      </mesh>

      <Board />

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

      <PlayerHand player={1} />
      <PlayerHand player={2} />

      <Environment preset="sunset" />
    </>
  );
}
