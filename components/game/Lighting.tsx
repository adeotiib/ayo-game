'use client';
export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.6} color="#FFF0D0" />
      <directionalLight
        position={[3, 8, 4]}
        intensity={1.4}
        color="#FFE8B0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <pointLight position={[-4, 3, -3]} intensity={0.5} color="#FF8C42" />
      <pointLight position={[4, 3, 3]} intensity={0.3} color="#FFD700" />
    </>
  );
}
