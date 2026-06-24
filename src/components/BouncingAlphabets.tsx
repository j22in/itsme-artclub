import React, { useEffect, useRef, useState, useCallback } from 'react';

// ─── Config ──────────────────────────────────────────────────────────
const TOTAL_ALPHA   = 82;
const ALPHA_COUNT   = 25; // random alphabets
const ALPHA_SIZE    = 50; // px (fixed display size)

// Drawing real pixel dimensions (w × h)
const DRAWINGS: { id: string; w: number; h: number }[] = [
  { id: 'drawing_01', w: 91,  h: 83  },
  { id: 'drawing_02', w: 87,  h: 84  },
  { id: 'drawing_03', w: 109, h: 105 },
  { id: 'drawing_04', w: 83,  h: 71  },
  { id: 'drawing_05', w: 92,  h: 108 },
];

function pickRandom(total: number, count: number): number[] {
  const indices: number[] = [];
  while (indices.length < count) {
    const n = Math.floor(Math.random() * total) + 1;
    if (!indices.includes(n)) indices.push(n);
  }
  return indices;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

// ─── Types ────────────────────────────────────────────────────────────
interface Ball {
  uid: string;       // unique key
  src: string;       // image src path
  w: number;         // display width px
  h: number;         // display height px
  x: number;         // center x
  y: number;         // center y
  vx: number;
  vy: number;
  rot: number;
  rotV: number;
  pinned: boolean;
  pinnedX: number;
  pinnedY: number;
}

interface DragState {
  uid: string;
  offsetX: number;
  offsetY: number;
}

// ─── Component ────────────────────────────────────────────────────────
export default function BouncingAlphabets({
  heroRef,
  onFirstPin,
}: {
  heroRef: React.RefObject<HTMLDivElement | null>;
  onFirstPin?: () => void;
}) {
  const canvasRef    = useRef<HTMLDivElement>(null);
  const ballsRef     = useRef<Ball[]>([]);
  const [balls, setBalls] = useState<Ball[]>([]);
  const animRef      = useRef<number>(0);
  const dragRef      = useRef<DragState | null>(null);
  const isInHero     = useRef(true);
  const hasPinnedRef = useRef(false);

  // Detect mobile (< 700 px) for drawings scaling
  const isMobile = (): boolean =>
    typeof window !== 'undefined' && window.innerWidth < 700;

  // Build initial ball list
  const initBalls = useCallback(() => {
    const container = canvasRef.current;
    if (!container) return;
    const { width, height } = container.getBoundingClientRect();
    if (width === 0) return;

    const mobile = isMobile();
    const items: Ball[] = [];

    // 1) All 5 drawings (required)
    DRAWINGS.forEach((d) => {
      const scale = mobile ? 0.5 : 1;
      const dw = d.w * scale;
      const dh = d.h * scale;
      const x = dw / 2 + Math.random() * (width  - dw);
      const y = dh / 2 + Math.random() * (height - dh);
      const speed = 0.7 + Math.random() * 1.2;
      const angle = Math.random() * Math.PI * 2;
      items.push({
        uid: d.id,
        src: `/alphabets/${d.id}.png`,
        w: dw,
        h: dh,
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rot: (Math.random() - 0.5) * 30,
        rotV: (Math.random() - 0.5) * 0.6,
        pinned: false,
        pinnedX: 0,
        pinnedY: 0,
      });
    });

    // 2) 25 random alphabets
    const actualAlphaSize = mobile ? ALPHA_SIZE * 0.6 : ALPHA_SIZE;
    const alphaIndices = pickRandom(TOTAL_ALPHA, ALPHA_COUNT);
    alphaIndices.forEach((idx) => {
      const half = actualAlphaSize / 2;
      const x = half + Math.random() * (width  - actualAlphaSize);
      const y = half + Math.random() * (height - actualAlphaSize);
      const speed = 0.8 + Math.random() * 1.4;
      const angle = Math.random() * Math.PI * 2;
      items.push({
        uid: `alpha_${idx}`,
        src: `/alphabets/alphabet_${pad(idx)}.png`,
        w: actualAlphaSize,
        h: actualAlphaSize,
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rot: Math.random() * 360,
        rotV: (Math.random() - 0.5) * 1.2,
        pinned: false,
        pinnedX: 0,
        pinnedY: 0,
      });
    });

    ballsRef.current = items;
    setBalls([...items]);
  }, []);

  // Animation loop
  useEffect(() => {
    initBalls();

    const animate = () => {
      const container = canvasRef.current;
      if (!container) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }
      const { width, height } = container.getBoundingClientRect();

      ballsRef.current = ballsRef.current.map((b) => {
        if (b.pinned) return b;

        let { x, y, vx, vy, rot, rotV, w, h } = b;
        const hw = w / 2;
        const hh = h / 2;

        x += vx;
        y += vy;
        rot += rotV;

        if (x - hw < 0)      { x = hw;          vx =  Math.abs(vx); }
        if (x + hw > width)  { x = width - hw;   vx = -Math.abs(vx); }
        if (y - hh < 0)      { y = hh;           vy =  Math.abs(vy); }
        if (y + hh > height) { y = height - hh;  vy = -Math.abs(vy); }

        return { ...b, x, y, vx, vy, rot };
      });

      setBalls([...ballsRef.current]);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [initBalls]);

  // Unpin all when hero scrolls out of view
  useEffect(() => {
    if (!heroRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && isInHero.current) {
          isInHero.current = false;
          ballsRef.current = ballsRef.current.map((b) => {
            if (!b.pinned) return b;
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.8 + Math.random() * 1.2;
            return { ...b, pinned: false, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
          });
        } else if (entry.isIntersecting) {
          isInHero.current = true;
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, [heroRef]);

  // ─── Hit-test (uses per-ball w/h) ────────────────────────────────
  const getBallAtPoint = (cx: number, cy: number): Ball | null => {
    const container = canvasRef.current;
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    const px = cx - rect.left;
    const py = cy - rect.top;

    // Prefer pinned (higher z) then others, reverse order = topmost
    const sorted = [...ballsRef.current].sort((a, b) =>
      (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)
    );

    for (const b of sorted) {
      const bx = b.pinned ? b.pinnedX : b.x;
      const by = b.pinned ? b.pinnedY : b.y;
      const hw = b.w / 2 + 6;  // slight padding for easier grab
      const hh = b.h / 2 + 6;
      if (px >= bx - hw && px <= bx + hw && py >= by - hh && py <= by + hh) {
        return b;
      }
    }
    return null;
  };

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const ball = getBallAtPoint(e.clientX, e.clientY);
    if (!ball) return;
    e.preventDefault();

    const container = canvasRef.current!;
    const rect = container.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const bx = ball.pinned ? ball.pinnedX : ball.x;
    const by = ball.pinned ? ball.pinnedY : ball.y;

    dragRef.current = { uid: ball.uid, offsetX: px - bx, offsetY: py - by };

    ballsRef.current = ballsRef.current.map((b) =>
      b.uid === ball.uid ? { ...b, pinned: false, vx: 0, vy: 0 } : b
    );
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    e.preventDefault();

    const container = canvasRef.current!;
    const rect = container.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    ballsRef.current = ballsRef.current.map((b) => {
      if (b.uid !== drag.uid) return b;
      const hw = b.w / 2;
      const hh = b.h / 2;
      const newX = Math.max(hw, Math.min(rect.width  - hw, px - drag.offsetX));
      const newY = Math.max(hh, Math.min(rect.height - hh, py - drag.offsetY));
      return { ...b, x: newX, y: newY, vx: 0, vy: 0 };
    });
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;

    ballsRef.current = ballsRef.current.map((b) => {
      if (b.uid !== drag.uid) return b;
      return { ...b, pinned: true, pinnedX: b.x, pinnedY: b.y, vx: 0, vy: 0, rotV: 0 };
    });

    if (!hasPinnedRef.current) {
      hasPinnedRef.current = true;
      onFirstPin?.();
    }
  }, [onFirstPin]);

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <div
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-10 overflow-hidden"
      style={{ touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {balls.map((b) => {
        const cx = b.pinned ? b.pinnedX : b.x;
        const cy = b.pinned ? b.pinnedY : b.y;
        return (
          <div
            key={b.uid}
            className="absolute select-none"
            style={{
              width:  b.w,
              height: b.h,
              left:   cx - b.w / 2,
              top:    cy - b.h / 2,
              transform: `rotate(${b.rot}deg)`,
              cursor: 'grab',
              filter: b.pinned
                ? 'none'
                : 'drop-shadow(0 2px 5px rgba(0,0,0,0.08))',
              zIndex: b.pinned ? 30 : 10,
            }}
          >
            <img
              src={b.src}
              alt=""
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
