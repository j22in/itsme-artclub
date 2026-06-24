import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface AlphabetItem {
  id: string;
  char: string;
  initialX: number; // percentage (0 - 100)
  initialY: number; // percentage (10 - 70)
  size: number; // size in px
  color: string;
  rotation: number;
}

const ALPHABETS: AlphabetItem[] = [
  { id: 'l1', char: 'I', initialX: 12, initialY: 20, size: 75, color: '#FF5F1F', rotation: -12 },
  { id: 'l2', char: 'T', initialX: 22, initialY: 35, size: 68, color: '#1E1C1A', rotation: 15 },
  { id: 'l3', char: 'S', initialX: 32, initialY: 15, size: 70, color: '#FF5F1F', rotation: -8 },
  { id: 'l4', char: 'M', initialX: 43, initialY: 28, size: 85, color: '#1E1C1A', rotation: 22 },
  { id: 'l5', char: 'E', initialX: 54, initialY: 18, size: 72, color: '#FF5F1F', rotation: -18 },
  { id: 'l6', char: '!', initialX: 62, initialY: 32, size: 65, color: '#F9A885', rotation: 30 },
  { id: 'l7', char: 'A', initialX: 72, initialY: 15, size: 80, color: '#1E1C1A', rotation: -10 },
  { id: 'l8', char: 'R', initialX: 82, initialY: 38, size: 74, color: '#FF5F1F', rotation: 14 },
  { id: 'l9', char: 'T', initialX: 90, initialY: 22, size: 72, color: '#F9A885', rotation: -15 },
  { id: 'l10', char: 'C', initialX: 18, initialY: 50, size: 65, color: '#F9A885', rotation: 25 },
  { id: 'l11', char: 'L', initialX: 38, initialY: 48, size: 70, color: '#FF5F1F', rotation: -20 },
  { id: 'l12', char: 'U', initialX: 76, initialY: 46, size: 78, color: '#1E1C1A', rotation: 12 },
  { id: 'l13', char: 'B', initialX: 86, initialY: 52, size: 82, color: '#FF5F1F', rotation: -5 },
];

// Magnet snap points on the mountain (percentage coords of parent container)
// We align these to the mountain peaks in the SVG background
interface SnapPoint {
  id: string;
  x: number; // percentage
  y: number; // percentage (distance from top)
  label: string;
  isOccupied: string | null; // ID of the letter snapping to it
}

export default function InteractiveAlphabet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [snapPoints, setSnapPoints] = useState<SnapPoint[]>([
    { id: 'p1', x: 15, y: 72, label: '서녘 봉우리', isOccupied: null },
    { id: 'p2', x: 26, y: 78, label: '들판 언덕', isOccupied: null },
    { id: 'p3', x: 42, y: 73, label: '중앙 봉우리', isOccupied: null },
    { id: 'p4', x: 58, y: 80, label: '아틀리에 기슭', isOccupied: null },
    { id: 'p5', x: 74, y: 71, label: '동녘 주봉', isOccupied: null },
    { id: 'p6', x: 88, y: 76, label: '이츠미 계곡', isOccupied: null },
  ]);

  // Letter states tracking their current coordinate and if they are snapped
  const [lettersState, setLettersState] = useState(() => 
    ALPHABETS.map((item) => ({
      ...item,
      currentX: item.initialX,
      currentY: item.initialY,
      snappedTo: null as string | null, // Snap point ID or null
      isDragging: false,
    }))
  );

  const [activeBurst, setActiveBurst] = useState<{ x: number; y: number; color: string } | null>(null);

  // floating animation offsets via requestAnimationFrame
  const [floatOffset, setFloatOffset] = useState<number>(0);

  useEffect(() => {
    let animationFrameId: number;
    let tick = 0;
    const updateFloat = () => {
      tick += 0.015;
      setFloatOffset(tick);
      animationFrameId = requestAnimationFrame(updateFloat);
    };
    updateFloat();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Handle Drag ends: calculate if near any snap point
  const handleDragEnd = (letterId: string, event: any, info: any) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calculate drag release position as percentages within container
    const releaseX = ((info.point.x - containerRect.left) / containerRect.width) * 100;
    const releaseY = ((info.point.y - containerRect.top) / containerRect.height) * 100;

    // Find closest snap point within range (e.g. 10% distance threshold)
    let closestSnap: SnapPoint | null = null;
    let minDistance = 12; // Snap radius threshold (%)

    // filter snap points that are either unoccupied or occupied by THIS letter
    const availableSnaps = snapPoints.map(p => {
      if (p.isOccupied === letterId) return { ...p, isOccupied: null };
      return p;
    });

    availableSnaps.forEach((point) => {
      if (point.isOccupied === null) {
        const dx = releaseX - point.x;
        const dy = releaseY - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) {
          minDistance = distance;
          closestSnap = point;
        }
      }
    });

    setLettersState((prev) =>
      prev.map((l) => {
        if (l.id === letterId) {
          if (closestSnap) {
            // Trigger beautiful particle burst
            setActiveBurst({
              x: closestSnap.x,
              y: closestSnap.y,
              color: l.color,
            });
            setTimeout(() => setActiveBurst(null), 800);

            return {
              ...l,
              currentX: closestSnap.x,
              currentY: closestSnap.y,
              snappedTo: closestSnap.id,
              isDragging: false,
            };
          } else {
            // No snap found, let it drop at the release location
            return {
              ...l,
              currentX: Math.max(5, Math.min(95, releaseX)),
              currentY: Math.max(10, Math.min(85, releaseY)),
              snappedTo: null,
              isDragging: false,
            };
          }
        }
        return l;
      })
    );

    // Update snap point occupation state
    setSnapPoints((prev) =>
      prev.map((p) => {
        // Release previous lock from this letter
        let isOccupied = p.isOccupied === letterId ? null : p.isOccupied;
        // Lock to new snap
        if (closestSnap && p.id === (closestSnap as SnapPoint).id) {
          isOccupied = letterId;
        }
        return { ...p, isOccupied };
      })
    );
  };

  const handleDragStart = (letterId: string) => {
    setLettersState((prev) =>
      prev.map((l) => {
        if (l.id === letterId) {
          // Unsnap if dragging starts
          if (l.snappedTo) {
            setSnapPoints((points) =>
              points.map((p) => (p.id === l.snappedTo ? { ...p, isOccupied: null } : p))
            );
          }
          return { ...l, snappedTo: null, isDragging: true };
        }
        return l;
      })
    );
  };

  const resetAlphabets = () => {
    setLettersState(
      ALPHABETS.map((item) => ({
        ...item,
        currentX: item.initialX,
        currentY: item.initialY,
        snappedTo: null,
        isDragging: false,
      }))
    );
    setSnapPoints((prev) => prev.map((p) => ({ ...p, isOccupied: null })));
  };

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full z-20 pointer-events-auto">
      {/* Visual Indicator of Magnet Snap Zones (Subtle pulsating dashed circles that guide the user) */}
      {snapPoints.map((point) => (
        <div
          key={point.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none select-none group"
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
        >
          <div className={`w-12 h-12 rounded-full border border-dashed flex items-center justify-center transition-all duration-500 ${
            point.isOccupied 
              ? 'border-orange-500/20 bg-orange-500/5 scale-90' 
              : 'border-orange-500/40 bg-orange-500/5 animate-pulse scale-100 hover:scale-110'
          }`}>
            <div className={`w-2 h-2 rounded-full ${point.isOccupied ? 'bg-orange-500/30' : 'bg-orange-500'}`} />
          </div>
          <span className="text-[9px] font-mono tracking-widest text-orange-500/50 mt-1 uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {point.label}
          </span>
        </div>
      ))}

      {/* Snap Burst Particle Animation */}
      {activeBurst && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-30"
          style={{ left: `${activeBurst.x}%`, top: `${activeBurst.y}%` }}
        >
          <div className="relative">
            {/* Pulsing ring */}
            <div 
              className="absolute -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 animate-ping"
              style={{ borderColor: activeBurst.color, animationDuration: '0.6s' }}
            />
            {/* Spark particles */}
            {[...Array(8)].map((_, idx) => {
              const angle = (idx * 45 * Math.PI) / 180;
              const dx = Math.cos(angle) * 45;
              const dy = Math.sin(angle) * 45;
              return (
                <div
                  key={idx}
                  className="absolute w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: activeBurst.color,
                    left: 0,
                    top: 0,
                    transform: `translate(${dx}px, ${dy}px) scale(0)`,
                    animation: `burst-spark-particle 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards`,
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Letters */}
      {lettersState.map((l, index) => {
        // Floating motion formulas based on index to create offset ripples
        const uniqueSine = Math.sin(floatOffset + index * 0.4);
        const uniqueCosine = Math.cos(floatOffset * 0.8 + index * 0.5);
        
        // Float displacement (only if NOT dragged and NOT snapped)
        const dx = l.isDragging || l.snappedTo ? 0 : uniqueSine * 15;
        const dy = l.isDragging || l.snappedTo ? 0 : uniqueCosine * 22;
        const rotationVal = l.isDragging 
          ? 0 
          : l.snappedTo 
            ? 0 
            : l.rotation + (uniqueSine * 8);

        return (
          <motion.div
            key={l.id}
            drag
            dragConstraints={containerRef}
            dragElastic={0.4}
            dragMomentum={true}
            onDragStart={() => handleDragStart(l.id)}
            onDragEnd={(event, info) => handleDragEnd(l.id, event, info)}
            className="absolute -translate-x-1/2 -translate-y-1/2 select-none interactive-alphabet z-30"
            style={{
              left: `${l.currentX}%`,
              top: `${l.currentY}%`,
              x: dx,
              y: dy,
              rotate: rotationVal,
            }}
            whileHover={{ scale: 1.15, filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.15))' }}
            whileDrag={{ scale: 1.2, rotate: 0, zIndex: 50 }}
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 18,
            }}
          >
            {/* The beautiful bubble shell for each alphabet element */}
            <div 
              className={`flex items-center justify-center font-sans font-black select-none rounded-[32%] transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.06)] border ${
                l.snappedTo 
                  ? 'bg-orange-500 border-orange-400 text-white ring-4 ring-orange-500/20' 
                  : 'bg-white border-neutral-100 hover:border-orange-200 text-neutral-800'
              }`}
              style={{
                width: `${l.size}px`,
                height: `${l.size}px`,
                fontSize: `${l.size * 0.52}px`,
                boxShadow: l.snappedTo 
                  ? 'inset 0 -4px 0px rgba(0,0,0,0.15), 0 8px 16px rgba(255,95,31,0.25)' 
                  : 'inset 0 -3px 0px rgba(0,0,0,0.08), 0 6px 12px rgba(0,0,0,0.04)',
              }}
            >
              {/* Internal subtle shiny effect */}
              <div className="absolute top-[8%] left-[10%] w-[25%] h-[12%] bg-white/40 rounded-full blur-[0.5px]" />
              <span 
                className="select-none select-none-all select-none"
                style={{ color: l.snappedTo ? '#FFFFFF' : l.color }}
              >
                {l.char}
              </span>
            </div>
          </motion.div>
        );
      })}

      {/* Floating Magnet Reset Badge (In-app micro-action button) */}
      <button
        onClick={resetAlphabets}
        id="btn-reset-alphabets"
        className="absolute bottom-6 right-6 z-40 bg-white/75 backdrop-blur border border-neutral-200 text-neutral-600 font-mono text-[10px] tracking-widest uppercase py-2 px-3.5 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 pointer-events-auto"
      >
        알파벳 정렬 리셋 ↺
      </button>

      {/* Custom Keyframe CSS for Burst Particle */}
      <style>{`
        @keyframes burst-spark-particle {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--dx, 0), var(--dy, 0)) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
