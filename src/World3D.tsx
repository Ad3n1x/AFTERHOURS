import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Sky } from '@react-three/drei';
import type { Group, Vector3 } from 'three';

type Activity = { title: string; detail: string; action: string };
type World3DProps = { region: string; location: string; hour: number; onInteract?: () => void };

type Lot = {
  id: string; label: string; kind: 'home' | 'shop' | 'work' | 'food' | 'community';
  x: number; z: number; w: number; d: number; h: number; color: string;
};
const PALETTE = ['#c38b5e','#c5b39b','#9f604e','#a8a080','#d1a56d','#778b79','#b98a77','#8c9ba1'];
const LOTS: Lot[] = Array.from({ length: 49 }, (_, index) => {
  const col = index % 7, row = Math.floor(index / 7);
  const x = (col - 3) * 14;
  const z = (row - 3) * 14;
  const special = [
    { label: 'MAMA TITI PROVISIONS', kind: 'shop' as const, color: '#c38b5e' },
    { label: 'AKARA & PEPPER', kind: 'food' as const, color: '#b75c38' },
    { label: 'YOUR NEXT HOME', kind: 'home' as const, color: '#d2b18a' },
    { label: 'COMMUNITY CENTRE', kind: 'community' as const, color: '#8b9a78' },
    { label: 'WORKSHOP', kind: 'work' as const, color: '#8d9ba0' },
    { label: 'CORNER SHOP', kind: 'shop' as const, color: '#c58a64' },
    { label: 'FAMILY HOUSE', kind: 'home' as const, color: '#b2a084' },
  ][(col + row * 2) % 7];
  return { id: 'lot-' + index, label: special.label, kind: special.kind, x, z, w: 4.3 + (index % 3) * 0.35, d: 4.2 + (index % 2) * 0.55, h: 2.6 + ((index * 7) % 5) * 0.45, color: special.color || PALETTE[index % PALETTE.length] };
});
const TREES = Array.from({ length: 32 }, (_, i) => ({ x: ((i * 17) % 92) - 46, z: ((i * 29) % 92) - 46 }));
const NPC_STARTS = [
  { name: 'Aunty Bisi', role: 'food seller', x: -7, z: 4, color: '#d88b4d', line: 'Fresh akara is ready. The morning crowd is just starting.' },
  { name: 'Chidi', role: 'mechanic', x: 7, z: -7, color: '#4c887c', line: 'Bring a vehicle by the workshop if you need a quick check.' },
  { name: 'Sade', role: 'student', x: 4, z: 10, color: '#9b79b5', line: 'The community board has job notices and room listings.' },
  { name: 'Musa', role: 'driver', x: -9, z: -8, color: '#c7a94f', line: 'Danfo is loading. Traffic can change the whole journey.' },
];

function Building({ lot, onEnter }: { lot: Lot; onEnter: (lot: Lot) => void }) {
  return <group position={[lot.x, 0, lot.z]} onClick={event => { event.stopPropagation(); onEnter(lot); }}>
    <mesh castShadow receiveShadow position={[0, lot.h / 2, 0]}>
      <boxGeometry args={[lot.w, lot.h, lot.d]} />
      <meshStandardMaterial color={lot.color} roughness={0.9} />
    </mesh>
    <mesh position={[0, lot.h * 0.72, lot.d / 2 + 0.025]}>
      <boxGeometry args={[lot.w * 0.76, 0.42, 0.05]} />
      <meshStandardMaterial color={lot.kind === 'food' ? '#f3c95e' : '#e7d1a1'} emissive="#6c3c14" emissiveIntensity={0.16} />
    </mesh>
    <mesh position={[0, 0.65, lot.d / 2 + 0.035]}>
      <boxGeometry args={[0.64, 1.25, 0.07]} />
      <meshStandardMaterial color="#382b24" />
    </mesh>
    {[-1.25, 1.25].map(x => <mesh key={x} position={[x, lot.h * 0.43, lot.d / 2 + 0.04]}>
      <boxGeometry args={[0.55, 0.55, 0.06]} />
      <meshStandardMaterial color="#8cc3c7" metalness={0.1} roughness={0.3} />
    </mesh>)}
    <mesh position={[0, lot.h + 0.08, 0]}>
      <boxGeometry args={[lot.w + 0.22, 0.15, lot.d + 0.22]} />
      <meshStandardMaterial color="#6f4938" roughness={1} />
    </mesh>
    <Html position={[0, lot.h + 0.55, 0]} center distanceFactor={17} style={{ pointerEvents: 'none' }}>
      <span className="world3d-label">{lot.label}</span>
    </Html>
  </group>;
}

function PlayerModel() {
  return <group>
    <mesh castShadow position={[0, 0.91, 0]}><capsuleGeometry args={[0.27, 0.72, 4, 8]} /><meshStandardMaterial color="#d18b58" roughness={0.9} /></mesh>
    <mesh castShadow position={[0, 1.56, 0]}><sphereGeometry args={[0.23, 16, 12]} /><meshStandardMaterial color="#70472f" roughness={0.95} /></mesh>
    <mesh castShadow position={[0, 1.76, 0]}><sphereGeometry args={[0.235, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.46]} /><meshStandardMaterial color="#181719" roughness={1} /></mesh>
    <mesh castShadow position={[-0.15, 0.28, 0.015]}><boxGeometry args={[0.15, 0.44, 0.19]} /><meshStandardMaterial color="#273546" /></mesh>
    <mesh castShadow position={[0.15, 0.28, 0.015]}><boxGeometry args={[0.15, 0.44, 0.19]} /><meshStandardMaterial color="#273546" /></mesh>
  </group>;
}

function Danfo({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return <group position={position} rotation={[0, rotation, 0]}>
    <mesh castShadow position={[0, 0.58, 0]}><boxGeometry args={[2.45, 0.88, 1.1]} /><meshStandardMaterial color="#e4bd22" roughness={0.7} /></mesh>
    <mesh position={[0.48, 0.79, 0.56]}><boxGeometry args={[0.68, 0.36, 0.025]} /><meshStandardMaterial color="#8dc6d0" roughness={0.35} /></mesh>
    <mesh position={[-0.43, 0.79, 0.56]}><boxGeometry args={[0.56, 0.36, 0.025]} /><meshStandardMaterial color="#8dc6d0" roughness={0.35} /></mesh>
    <mesh position={[0, 0.55, 0.57]}><boxGeometry args={[0.65, 0.19, 0.03]} /><meshStandardMaterial color="#22262b" /></mesh>
    {[-0.78, 0.78].map(x => [-0.43, 0.43].map(z => <mesh key={x + ':' + z} castShadow position={[x, 0.17, z]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.19, 0.19, 0.14, 16]} /><meshStandardMaterial color="#202226" /></mesh>))}
    <Html position={[0, 1.28, 0]} center distanceFactor={15} style={{ pointerEvents: 'none' }}><span className="world3d-label">DANFO / LOCAL ROUTE</span></Html>
  </group>;
}

function Tree({ x, z }: { x: number; z: number }) {
  return <group position={[x, 0, z]}>
    <mesh castShadow position={[0, 0.7, 0]}><cylinderGeometry args={[0.12, 0.18, 1.4, 7]} /><meshStandardMaterial color="#68442e" /></mesh>
    <mesh castShadow position={[0, 1.7, 0]}><icosahedronGeometry args={[0.72, 1]} /><meshStandardMaterial color="#39784e" roughness={1} /></mesh>
  </group>;
}

function NPC({ npc, onTalk }: { npc: typeof NPC_STARTS[number]; onTalk: (npc: typeof NPC_STARTS[number]) => void }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.x = npc.x + Math.sin(clock.elapsedTime * 0.28 + npc.z) * 0.45;
    ref.current.position.z = npc.z + Math.cos(clock.elapsedTime * 0.22 + npc.x) * 0.35;
  });
  return <group ref={ref} position={[npc.x, 0, npc.z]} onClick={event => { event.stopPropagation(); onTalk(npc); }}>
    <mesh castShadow position={[0, 0.84, 0]}><capsuleGeometry args={[0.24, 0.62, 3, 7]} /><meshStandardMaterial color={npc.color} /></mesh>
    <mesh castShadow position={[0, 1.43, 0]}><sphereGeometry args={[0.2, 12, 10]} /><meshStandardMaterial color="#70472f" /></mesh>
    <Html position={[0, 1.9, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}><span className="world3d-label">{npc.name}</span></Html>
  </group>;
}

function HomeInterior({ onExit, onToast }: { onExit: () => void; onToast: (s: string) => void }) {
  return <>
    <color attach="background" args={['#34271f']} />
    <ambientLight intensity={1.1} />
    <directionalLight position={[-4, 8, 5]} intensity={1.7} castShadow />
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[15, 15]} /><meshStandardMaterial color="#c5a57c" roughness={1} /></mesh>
    <mesh position={[0, 1.6, -5]}><boxGeometry args={[10, 3.2, 0.25]} /><meshStandardMaterial color="#c7ad8b" /></mesh>
    <mesh position={[-4.9, 1.6, 0]}><boxGeometry args={[0.25, 3.2, 10]} /><meshStandardMaterial color="#c7ad8b" /></mesh>
    <mesh position={[4.9, 1.6, 0]}><boxGeometry args={[0.25, 3.2, 10]} /><meshStandardMaterial color="#c7ad8b" /></mesh>
    <mesh castShadow position={[-2, 0.45, -2]}><boxGeometry args={[2.4, 0.45, 1.7]} /><meshStandardMaterial color="#875b46" /></mesh>
    <mesh castShadow position={[-2, 0.76, -2]}><boxGeometry args={[2.35, 0.22, 1.65]} /><meshStandardMaterial color="#d7c3a4" /></mesh>
    <mesh castShadow position={[2.3, 0.7, -1.7]}><boxGeometry args={[1.2, 1.4, 0.8]} /><meshStandardMaterial color="#4c5a5a" /></mesh>
    <mesh castShadow position={[2.3, 1.48, -1.7]}><boxGeometry args={[1.23, 0.12, 0.83]} /><meshStandardMaterial color="#252d32" /></mesh>
    <mesh castShadow position={[0.2, 0.55, 1.2]}><boxGeometry args={[1.7, 0.12, 0.8]} /><meshStandardMaterial color="#895b38" /></mesh>
    <mesh castShadow position={[0.2, 0.9, 1.2]}><boxGeometry args={[0.1, 0.6, 0.1]} /><meshStandardMaterial color="#895b38" /></mesh>
    <mesh position={[0, 1.9, -4.82]}><boxGeometry args={[2, 0.8, 0.08]} /><meshStandardMaterial color="#62858b" /></mesh>
    <Html position={[0, 3.1, 0]} center><div className="world3d-interior-sign">YOUR HOME · SAFE ZONE</div></Html>
    <Html position={[-2, 1.7, -2]} center><button className="world3d-hotspot" onClick={() => onToast('You rested on your foam mattress. Energy restored in the life simulator.')}>Rest</button></Html>
    <Html position={[2.3, 2.3, -1.7]} center><button className="world3d-hotspot" onClick={() => onToast('Your home storage is ready for furniture upgrades.')}>Storage</button></Html>
    <Html position={[0, 0.4, 4]} center><button className="world3d-hotspot" onClick={onExit}>EXIT TO STREET</button></Html>
  </>;
}

function Scene({ hour, interior, onEnter, onTalk, onActivity, onToast, onExitHome }: {
  hour: number; interior: boolean; onEnter: (lot: Lot) => void;
  onTalk: (npc: typeof NPC_STARTS[number]) => void; onActivity: (a: Activity) => void; onToast: (s: string) => void; onExitHome: () => void;
}) {
  const playerRef = useRef<Group>(null);
  const keys = useRef(new Set<string>());
  const [moving, setMoving] = useState(false);
  const movement = useRef({ x: 0, z: 0 });
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','e','escape'].includes(key)) {
        if (!(event.target instanceof HTMLElement) || !['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName)) event.preventDefault();
        keys.current.add(key);
      }
    };
    const up = (event: KeyboardEvent) => keys.current.delete(event.key.toLowerCase());
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);
  useFrame(({ camera }, delta) => {
    if (!playerRef.current) return;
    const p = playerRef.current.position;
    const k = keys.current;
    const speed = (interior ? 2.6 : 7.8) * Math.min(delta, 0.045);
    let dx = 0, dz = 0;
    if (k.has('w') || k.has('arrowup')) dz -= speed;
    if (k.has('s') || k.has('arrowdown')) dz += speed;
    if (k.has('a') || k.has('arrowleft')) dx -= speed;
    if (k.has('d') || k.has('arrowright')) dx += speed;
    const isMoving = dx !== 0 || dz !== 0;
    if (interior) {
      p.x = Math.max(-4.1, Math.min(4.1, p.x + dx));
      p.z = Math.max(-3.8, Math.min(3.8, p.z + dz));
    } else {
      let nx = Math.max(-49, Math.min(49, p.x + dx));
      let nz = Math.max(-49, Math.min(49, p.z + dz));
      const blocked = LOTS.some(lot => nx > lot.x-lot.w/2-0.45 && nx < lot.x+lot.w/2+0.45 && nz > lot.z-lot.d/2-0.45 && nz < lot.z+lot.d/2+0.45);
      if (!blocked) { p.x = nx; p.z = nz; }
      else {
        const blockedX = LOTS.some(lot => nx > lot.x-lot.w/2-0.45 && nx < lot.x+lot.w/2+0.45 && p.z > lot.z-lot.d/2-0.45 && p.z < lot.z+lot.d/2+0.45);
        const blockedZ = LOTS.some(lot => p.x > lot.x-lot.w/2-0.45 && p.x < lot.x+lot.w/2+0.45 && nz > lot.z-lot.d/2-0.45 && nz < lot.z+lot.d/2+0.45);
        if (!blockedX) p.x = nx;
        if (!blockedZ) p.z = nz;
      }
    }
    if (isMoving) playerRef.current.rotation.y = Math.atan2(dx, dz) + Math.PI;
    movement.current.x = p.x; movement.current.z = p.z;
    setMoving(previous => previous === isMoving ? previous : isMoving);
    const target = interior ? { x: p.x + 5.6, y: 5.4, z: p.z + 7 } : { x: p.x + 8.8, y: 8.3, z: p.z + 10.5 };
    camera.position.lerp(target as Vector3, 1 - Math.pow(0.001, Math.min(delta, 0.05)));
    camera.lookAt(p.x, interior ? 0.8 : 0.65, p.z);
  });
  useEffect(() => {
    if (interior && playerRef.current) playerRef.current.position.set(0,0,2.7);
    if (!interior && playerRef.current) playerRef.current.position.set(0,0,-7);
  }, [interior]);
  const dusk = hour >= 18 || hour < 6;
  const activity = (title: string, detail: string, action: string) => onActivity({ title, detail, action });
  return <>
    {interior ? <HomeInterior onExit={onExitHome} onToast={onToast} /> : <>
      <color attach="background" args={[dusk ? '#17212d' : '#a8d0d4']} />
      <fog attach="fog" args={[dusk ? '#263342' : '#a8c4bf', 32, 100]} />
      <ambientLight intensity={dusk ? 0.5 : 1.1} />
      <directionalLight castShadow position={[-25, 38, 18]} intensity={dusk ? 1.05 : 2} shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <Sky sunPosition={dusk ? ([0.2,-0.08,-1] as [number,number,number]) : ([2,3,1] as [number,number,number])} turbidity={8} rayleigh={1.5} />
      <mesh receiveShadow rotation={[-Math.PI/2,0,0]} position={[0,-0.08,0]}><planeGeometry args={[120,120]} /><meshStandardMaterial color="#a69a77" roughness={1} /></mesh>
      {Array.from({length:8},(_,i)=><group key={'roadx'+i}>
        <mesh receiveShadow position={[(i-3.5)*14,0,-0.01]}><boxGeometry args={[4.8,0.025,112]} /><meshStandardMaterial color="#343a3b" roughness={1} /></mesh>
        {Array.from({length:18},(_,j)=><mesh key={j} position={[(i-3.5)*14,0.02,-52+j*6]}><boxGeometry args={[0.1,0.02,2.5]} /><meshStandardMaterial color="#e5d5a3" /></mesh>)}
      </group>)}
      {Array.from({length:8},(_,i)=><mesh key={'roadz'+i} receiveShadow position={[0,0.006,(i-3.5)*14]}><boxGeometry args={[112,0.025,4.8]} /><meshStandardMaterial color="#343a3b" roughness={1} /></mesh>)}
      {LOTS.map(lot=><Building key={lot.id} lot={lot} onEnter={onEnter} />)}
      {TREES.map((tree,i)=><Tree key={i} {...tree} />)}
      <Danfo position={[8,0,-2]} rotation={Math.PI/2} />
      <Danfo position={[-24,0,25]} rotation={0} />
      {NPC_STARTS.map(npc=><NPC key={npc.name} npc={npc} onTalk={onTalk} />)}
      <mesh position={[-8,0.2,4]}><boxGeometry args={[0.1,0.4,0.1]} /><meshStandardMaterial color="#ddd1b1" /></mesh>
      <Html position={[-8,1.7,4]} center distanceFactor={15}><button className="world3d-hotspot" onClick={() => activity('Community noticeboard','Job listings, room adverts and neighbourhood notices.','board')}>COMMUNITY BOARD</button></Html>
      <Html position={[8,1.5,-4]} center distanceFactor={15}><button className="world3d-hotspot" onClick={() => activity('Danfo bus stop','Local rides cost ₦300 in the game and advance the day.','transport')}>RIDE DANFO · ₦300</button></Html>
    </>}
    <group ref={playerRef} position={[0,0,-7]}><PlayerModel /></group>
    <Html fullscreen>
      <div className="world3d-hud">
        <span className="world3d-live"><i /> {interior ? 'HOME INTERIOR' : 'OPEN WORLD / NIGERIA'}</span>
        <span>{dusk ? 'EVENING / NIGHT' : 'DAYTIME'} · WASD / ARROWS</span>
        <span className="world3d-motion">{moving ? 'WALKING' : 'FREE ROAM'}</span>
      </div>
    </Html>
  </>;
}

export default function World3D({ region, location, hour, onInteract }: World3DProps) {
  const [interior, setInterior] = useState(false);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [toast, setToast] = useState('');
  const [npc, setNpc] = useState<typeof NPC_STARTS[number] | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const onEnter = useCallback((lot: Lot) => {
    if (lot.kind === 'home') { setInterior(true); setToast('You entered a furnished starter home. Explore the room and use the hotspots.'); setActivity(null); }
    else if (lot.kind === 'shop') setActivity({ title: lot.label, detail: 'Browse everyday essentials and neighbourhood supplies.', action: 'shop' });
    else if (lot.kind === 'food') setActivity({ title: lot.label, detail: 'Fresh street food from the neighbourhood seller.', action: 'food' });
    else if (lot.kind === 'work') setActivity({ title: lot.label, detail: 'Ask about a shift, learn a trade or pick up a small job.', action: 'work' });
    else setActivity({ title: lot.label, detail: 'Meet residents and look for community notices.', action: 'community' });
  }, []);
  const onTalk = useCallback((person: typeof NPC_STARTS[number]) => { setNpc(person); setActivity({ title: person.name + ' · ' + person.role, detail: person.line, action: 'talk' }); }, []);
  const doActivity = () => {
    if (!activity) return;
    const messages: Record<string,string> = {
      shop: 'Shop visited. Essentials and inventory systems are ready to expand.',
      food: 'Street-food stop recorded. Your life-sim meal action remains available above.',
      work: 'You found a local work lead. Use the career panel above to take a paid shift.',
      community: 'Community visited. Check your notebook for investigation leads.',
      talk: npc ? npc.name + ': ' + npc.line : 'You spoke with a neighbour.',
      board: 'You checked the community board for jobs, room adverts and notices.',
      transport: 'Danfo ride selected. The life-sim transport action is available in the city panel.',
    };
    setToast(messages[activity.action] || activity.detail);
    if (activity.action === 'community' || activity.action === 'board' || activity.action === 'talk') onInteract?.();
    setActivity(null);
  };
  const moveBy = (key: string, down: boolean) => {
    window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { key, bubbles: true }));
  };
  const backToStreet = () => { setInterior(false); setToast('You stepped back out into the neighbourhood.'); };
  return <section className="world3d-panel" aria-label="Playable 3D Nigerian open world">
    <div className="world3d-panel-heading">
      <div><div className="eyebrow">REAL-TIME 3D / WEBGL OPEN WORLD</div><h2>{interior ? 'Your own little space.' : 'The streets are yours to explore.'}</h2><p>{interior ? 'Move around the room, rest, check your storage and head back outside.' : 'Explore a wider Nigerian neighbourhood. Visit homes, talk to residents, find work, browse shops and move freely through the streets.'}</p></div>
      <div className="world3d-location"><span>YOUR LOCATION</span><strong>{region}</strong><small>{interior ? 'Starter home · Interior' : location + ' · Day ' + (hour < 6 ? 'early hours' : hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening')}</small></div>
    </div>
    <div className="world3d-canvas">
      <Canvas shadows dpr={[1,1.25]} camera={{ position:[8.8,8.3,12.5], fov:48 }} gl={{ antialias:true, powerPreference:'low-power' }}>
        <Scene hour={hour} interior={interior} onEnter={onEnter} onTalk={onTalk} onActivity={setActivity} onToast={setToast} onExitHome={backToStreet} />
      </Canvas>
      <div className="world3d-controls" aria-label="Touch movement controls">
        <div className="world3d-dpad">
          <button onPointerDown={() => moveBy('w',true)} onPointerUp={() => moveBy('w',false)} onPointerLeave={() => moveBy('w',false)} aria-label="Move forward">▲</button>
          <div><button onPointerDown={() => moveBy('a',true)} onPointerUp={() => moveBy('a',false)} onPointerLeave={() => moveBy('a',false)} aria-label="Move left">◀</button><button onPointerDown={() => moveBy('s',true)} onPointerUp={() => moveBy('s',false)} onPointerLeave={() => moveBy('s',false)} aria-label="Move backward">▼</button><button onPointerDown={() => moveBy('d',true)} onPointerUp={() => moveBy('d',false)} onPointerLeave={() => moveBy('d',false)} aria-label="Move right">▶</button></div>
        </div>
        <button className="world3d-map-toggle" onClick={() => setMapOpen(v=>!v)}>▦ {mapOpen ? 'Hide map' : 'City map'}</button>
      </div>
    </div>
    <div className="world3d-worldbar">
      <span>🛣️ 7 × 7 CITY BLOCKS</span><span>🏠 ENTERABLE HOMES</span><span>🧍 RESIDENTS</span><span>🚌 LOCAL TRANSPORT</span><span>🌗 DAY / NIGHT</span>
    </div>
    {mapOpen && <div className="world3d-minimap"><div className="world3d-minimap-title">NEIGHBOURHOOD MAP <small>Tap any building in the 3D world to visit it</small></div><div className="world3d-map-grid">{LOTS.map((lot,i)=><span key={lot.id} title={lot.label} className={'map-' + lot.kind} aria-label={lot.label}>{lot.kind==='home'?'⌂':lot.kind==='food'?'●':lot.kind==='work'?'▤':lot.kind==='community'?'✦':'■'}</span>)}</div><p>Roads connect the blocks. Homes lead to interiors; shops, food stalls and workplaces open activity cards.</p></div>}
    {activity && !interior && <div className="world3d-activity-card"><div><div className="eyebrow">INTERACTION / NEIGHBOURHOOD</div><h3>{activity.title}</h3><p>{activity.detail}</p></div><div className="world3d-activity-buttons"><button onClick={doActivity}>Interact <span>↗</span></button><button className="world3d-dismiss" onClick={() => setActivity(null)}>Not now</button></div></div>}
    {interior && <div className="world3d-activity-card"><div><div className="eyebrow">HOME / SAFE ZONE</div><h3>Starter home</h3><p>Walk to the bed to rest, inspect storage or use the exit hotspot. Home upgrades remain in the life simulator panel.</p></div><button onClick={backToStreet}>Leave home ↗</button></div>}
    {toast && <div className="world3d-toastbar" role="status"><span>{toast}</span><button onClick={() => setToast('')} aria-label="Dismiss message">×</button></div>}
    <div className="world3d-actions"><span><strong>Controls:</strong> WASD / arrows or touch pad · click a building or resident to interact.</span><button onClick={() => { setActivity(null); setNpc(null); onInteract?.(); }}>Investigate nearby <span>↗</span></button></div>
    <p className="world3d-footnote">Playable 3D prototype · city layout, movement, enterable home, residents and interactions run in your browser. Save/account and multiplayer systems are not enabled.</p>
  </section>;
}
