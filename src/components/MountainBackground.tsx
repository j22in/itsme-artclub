import { useEffect, useState } from 'react';

export default function MountainBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position ratio from center (-0.5 to 0.5)
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
      {/* Background radial gradient to give an artistic soft glow */}
      <div className="absolute inset-0 bg-radial-[circle_at_center_top] from-orange-50/40 via-transparent to-transparent opacity-70" />

      {/* Layer 1: Far Mountain (Slow Parallax, Pale warm cream-beige) */}
      <div 
        className="absolute bottom-0 left-[-5%] w-[110%] h-[55%] transition-transform duration-500 ease-out origin-bottom"
        style={{
          transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 5}px) scale(1.02)`,
        }}
      >
        <svg viewBox="0 0 1440 600" className="w-full h-full min-h-[300px] preserve-3d" preserveAspectRatio="none">
          <path 
            d="M0,600 L0,320 C180,240 320,380 480,280 C640,180 800,290 980,190 C1160,90 1300,260 1440,210 L1440,600 Z" 
            fill="#EDE6DA" 
            className="opacity-70"
          />
        </svg>
      </div>

      {/* Layer 2: Mid Mountain (Medium Parallax, Soft Terracotta Orange) */}
      <div 
        className="absolute bottom-0 left-[-10%] w-[120%] h-[42%] transition-transform duration-300 ease-out origin-bottom"
        style={{
          transform: `translate(${mousePos.x * -18}px, ${mousePos.y * -8}px) scale(1.04)`,
        }}
      >
        <svg viewBox="0 0 1440 450" className="w-full h-full min-h-[220px]" preserveAspectRatio="none">
          <path 
            d="M0,450 L0,220 C220,130 400,290 620,180 C840,70 1020,240 1220,150 C1380,80 1400,190 1440,130 L1440,450 Z" 
            fill="#F9A885" 
            className="opacity-50"
          />
        </svg>
      </div>

      {/* Layer 3: Foreground Main Mountain (Fast Parallax, Deep Charcoal/Sand stone with an artistic stroke) */}
      <div 
        className="absolute bottom-[-2px] left-[-5%] w-[110%] h-[32%] transition-transform duration-150 ease-out origin-bottom z-10"
        style={{
          transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 12}px) scale(1.01)`,
        }}
      >
        <svg viewBox="0 0 1440 350" className="w-full h-full min-h-[160px]" preserveAspectRatio="none">
          {/* Base shape */}
          <path 
            d="M0,350 L0,150 C120,180 240,110 380,200 C520,290 710,130 890,240 C1070,350 1200,160 1440,210 L1440,350 Z" 
            fill="#1E1C1A" 
          />
          {/* Neon Orange artistic line trace along the foreground peak to emphasize '주황 띠' and brand colors */}
          <path 
            d="M0,150 C120,180 240,110 380,200 C520,290 710,130 890,240 C1070,350 1200,160 1440,210" 
            stroke="#FF5F1F" 
            strokeWidth="4" 
            fill="none" 
            strokeLinecap="round"
            className="opacity-95"
          />
          {/* Subtle textured shadows */}
          <path 
            d="M380,200 C520,290 710,130 890,240 L890,350 L380,350 Z" 
            fill="#151412" 
            className="opacity-40"
          />
        </svg>
      </div>

      {/* Interactive Horizon Anchor Line (Allows items to 'snap' or stick on foreground mountain top) */}
      <div className="absolute bottom-[28%] left-0 w-full border-t border-dashed border-orange-500/10 z-20" />
    </div>
  );
}
