import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Html, Sky } from '@react-three/drei';
import type { Group } from 'three';

type World3DProps = {
  region: string;
  location: string;
  hour: number;
  onInteract?: () => void;
};

function Building({ position, size, color, label }: { position: [number, number, number]; size: [number, number, number]; color: string; label: string }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, size[1] / 2, 0]}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.88} />
      </mesh>
      <mesh position={[0, size[1] * 0.68, size[2] / 2 + 0.012]}>
        <boxGeometry args={[size[0] * 0.72, 0.28, 0.035]} />
        <meshStandardMaterial color="#e8ad52" emissive="#5a2e0c" emissiveIntensity={0.18} />
      </mesh>
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x * size[0], size[1] * 0.38, size[2] / 2 + 0.018]}>
          <boxGeometry args={[0.28, 0.48, 0.04]} />
          <meshStandardMaterial color="#172b35" />
        </mesh>
      ))}
      <Html position={[0, size[1] + 0.28, 0]} center distanceFactor={13} style={{ pointerEvents: 'none' }}>
        <span className="world3d-label">{label}</span>
      </Html>
    </group>
  );
}

function Danfo({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, -0.12, 0]}>
      <mesh castShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[2.05, 0.85, 0.95]} />
        <meshStandardMaterial color="#e4bd22" roughness={0.65} />
      </mesh>
      <mesh position={[0.48, 0.78, 0.485]}>
        <boxGeometry args={[0.62, 0.35, 0.025]} />
        <meshStandardMaterial color="#8dc6d0" metalness={0.12} roughness={0.3} />
      </mesh>
      <mesh position={[-0.45, 0.78, 0.485]}>
        <boxGeometry args={[0.55, 0.35, 0.025]} />
        <meshStandardMaterial color="#8dc6d0" metalness={0.12} roughness={0.3} />
      </mesh>
      {[-0.62, 0.62].map((x) => [-0.42, 0.42].map((z) => (
        <mesh key={x + ':' + z} castShadow position={[x, 0.14, z]}>
          <cylinderGeometry args={[0.19, 0.19, 0.12, 16]} />
          <meshStandardMaterial color="#202226" roughness={0.9} />
        </mesh>
      )))}
      <mesh position={[0, 0.53, 0.49]}>
        <boxGeometry args={[0.62, 0.2, 0.025]} />
        <meshStandardMaterial color="#18212a" />
      </mesh>
      <Html position={[0, 1.22, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <span className="world3d-label">DANFO STOP</span>
      </Html>
    </group>
  );
}

function MarketStall({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 1.25, 0]}>
        <boxGeometry args={[1.9, 0.12, 1.15]} />
        <meshStandardMaterial color="#b94e36" />
      </mesh>
      <mesh castShadow position={[0, 0.66, 0]}>
        <boxGeometry args={[1.55, 0.6, 0.72]} />
        <meshStandardMaterial color="#865333" />
      </mesh>
      {[-0.48, 0, 0.48].map((x, i) => (
        <mesh key={x} castShadow position={[x, 1.04, 0.04]}>
          <sphereGeometry args={[0.17, 12, 10]} />
          <meshStandardMaterial color={['#d9a14d', '#6b9c52', '#d15a3d'][i]} />
        </mesh>
      ))}
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.13, 0.19, 1.6, 8]} />
        <meshStandardMaterial color="#68442e" />
      </mesh>
      <mesh castShadow position={[0, 1.85, 0]}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial color="#39784e" roughness={1} />
      </mesh>
    </group>
  );
}

function Player({ positionRef }: { positionRef: React.RefObject<Group | null> }) {
  const group = useRef<Group>(null);
  useFrame(() => {
    if (group.current && positionRef.current) {
      group.current.position.copy(positionRef.current.position);
      group.current.rotation.y = positionRef.current.rotation.y;
    }
  });
  return (
    <group ref={group}>
      <mesh castShadow position={[0, 0.92, 0]}>
        <capsuleGeometry args={[0.28, 0.72, 4, 8]} />
        <meshStandardMaterial color="#d18b58" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 1.62, 0]}>
        <sphereGeometry args={[0.24, 16, 12]} />
        <meshStandardMaterial color="#6b422e" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 1.82, 0]}>
        <sphereGeometry args={[0.245, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.46]} />
        <meshStandardMaterial color="#171719" roughness={1} />
      </mesh>
      <mesh castShadow position={[-0.16, 0.3, 0.02]}>
        <boxGeometry args={[0.16, 0.48, 0.2]} />
        <meshStandardMaterial color="#242d3a" />
      </mesh>
      <mesh castShadow position={[0.16, 0.3, 0.02]}>
        <boxGeometry args={[0.16, 0.48, 0.2]} />
        <meshStandardMaterial color="#242d3a" />
      </mesh>
    </group>
  );
}

function Scene({ hour, onSelect, selected }: { hour: number; onSelect: (name: string) => void; selected: string }) {
  const playerRef = useRef<Group>(null);
  const keys = useRef(new Set<string>());
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        event.preventDefault();
        keys.current.add(key);
      }
    };
    const up = (event: KeyboardEvent) => keys.current.delete(event.key.toLowerCase());
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useFrame(({ camera }, delta) => {
    if (!playerRef.current) return;
    const p = playerRef.current.position;
    const k = keys.current;
    const speed = 4.2 * Math.min(delta, 0.05);
    let dx = 0;
    let dz = 0;
    if (k.has('w') || k.has('arrowup')) dz -= speed;
    if (k.has('s') || k.has('arrowdown')) dz += speed;
    if (k.has('a') || k.has('arrowleft')) dx -= speed;
    if (k.has('d') || k.has('arrowright')) dx += speed;
    const isMoving = dx !== 0 || dz !== 0;
    if (isMoving) {
      p.x = Math.max(-8.2, Math.min(8.2, p.x + dx));
      p.z = Math.max(-5.5, Math.min(5.5, p.z + dz));
      playerRef.current.rotation.y = Math.atan2(dx, dz) + Math.PI;
    }
    setMoving(previous => previous === isMoving ? previous : isMoving);
    const target = [p.x + 8.5, 8.5, p.z + 10.5] as const;
    camera.position.lerp({ x: target[0], y: target[1], z: target[2] } as any, 1 - Math.pow(0.001, Math.min(delta, 0.05)));
    camera.lookAt(p.x, 0.6, p.z);
  });

  const choose = (name: string) => onSelect(name);
  const dusk = hour >= 18 || hour < 6;
  return (
    <>
      <color attach="background" args={[dusk ? '#17212d' : '#a8d0d4']} />
      <fog attach="fog" args={[dusk ? '#263342' : '#a8c4bf', 18, 42]} />
      <ambientLight intensity={dusk ? 0.5 : 1.25} />
      <directionalLight castShadow position={[-7, 12, 6]} intensity={dusk ? 1.2 : 2.2} shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <Sky sunPosition={dusk ? [0.2, -0.08, -1] : [2, 3, 1]} turbidity={8} rayleigh={1.5} />
      <Environment preset="city" />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#b9a982" roughness={1} />
      </mesh>
      <mesh receiveShadow position={[0, 0.005, 0]}>
        <boxGeometry args={[5.3, 0.025, 28]} />
        <meshStandardMaterial color="#353b3d" roughness={1} />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[0, 0.025, -12 + i * 3.4]}>
          <boxGeometry args={[0.12, 0.018, 1.2]} />
          <meshStandardMaterial color="#e4d6a3" />
        </mesh>
      ))}
      <Building position={[-5.8, 0, -3.5]} size={[3.3, 3.2, 2.8]} color="#c18c5d" label="PROVISIONS" />
      <Building position={[5.8, 0, -5.2]} size={[3.5, 4.4, 3]} color="#d4bda0" label="COMMUNITY" />
      <Building position={[-6.3, 0, 4.2]} size={[3.2, 2.6, 2.8]} color="#a45f4c" label="LOCAL SHOP" />
      <Building position={[6.4, 0, 4.6]} size={[3.4, 3.3, 2.7]} color="#8f9c79" label="WORKSHOP" />
      <Danfo position={[2.7, 0, -1.7]} />
      <MarketStall position={[-3.1, 0, 1.2]} />
      <MarketStall position={[3.5, 0, 4]} />
      <Tree position={[-8, 0, -7]} />
      <Tree position={[8.5, 0, -7.8]} />
      <Tree position={[-8.6, 0, 7.5]} />
      <group ref={playerRef} position={[0, 0, 2]}>
        <Player positionRef={playerRef} />
      </group>
      {selected ? <Html position={[0, 3.2, -1]} center><div className="world3d-toast">Selected: {selected}</div></Html> : null}
      <Html fullscreen>
        <div className="world3d-hud">
          <span className="world3d-live"><i /> 3D NEIGHBOURHOOD</span>
          <span>{dusk ? 'EVENING / NIGHT' : 'DAYTIME'} · WASD / ARROWS</span>
          <span className="world3d-motion">{moving ? 'WALKING' : 'FREE ROAM'}</span>
        </div>
      </Html>
    </>
  );
}

export default function World3D({ region, location, hour, onInteract }: World3DProps) {
  const [selected, setSelected] = useState('');
  return (
    <section className="world3d-panel" aria-label="Playable 3D Nigerian neighbourhood">
      <div className="world3d-panel-heading">
        <div><div className="eyebrow">REAL-TIME 3D / WEBGL</div><h2>Walk the neighbourhood.</h2><p>Explore a stylised Nigerian street in 3D. Use WASD or arrow keys, then choose a local activity.</p></div>
        <div className="world3d-location"><span>REGION / LOCATION</span><strong>{region}</strong><small>{location}</small></div>
      </div>
      <div className="world3d-canvas">
        <Canvas shadows dpr={[1, 1.35]} camera={{ position: [8.5, 8.5, 12.5], fov: 48 }} gl={{ antialias: true, powerPreference: 'low-power' }}>
          <Scene hour={hour} selected={selected} onSelect={setSelected} />
        </Canvas>
      </div>
      <div className="world3d-actions">
        <span><strong>Objective:</strong> move around the street and explore the local shops.</span>
        <button onClick={() => { setSelected(''); onInteract?.(); }}>Interact with neighbourhood <span>↗</span></button>
      </div>
      <p className="world3d-footnote">3D prototype · Progress and life systems remain connected to AFTERHOURS. Multiplayer is not enabled.</p>
    </section>
  );
}
