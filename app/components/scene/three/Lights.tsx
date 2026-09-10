"use client";

export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.32} color="#e8e2d6" />
      <directionalLight position={[4, 6, 8]} intensity={0.85} color="#f2e6d4" />
      <pointLight
        position={[-6, 3, -6]}
        intensity={16}
        distance={28}
        decay={2}
        color="#c9a87c"
      />
      <pointLight
        position={[6, -2, -20]}
        intensity={20}
        distance={32}
        decay={2}
        color="#c9a87c"
      />
      <pointLight
        position={[0, 2, -34]}
        intensity={22}
        distance={32}
        decay={2}
        color="#e0a13c"
      />
    </>
  );
}
