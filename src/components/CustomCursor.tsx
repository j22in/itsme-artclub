import { useEffect, useState } from 'react';
import { CursorInfo } from '../types';

const cursorNames = [
  '드로잉 펜슬',
  '아티스트 브러시',
  '매직 스타',
  '페인트 팔레트',
  '크리에이티브 하트',
  '레몬 스파클',
  '오렌지 크레용',
  '애플 가든',
  '스카이 벌룬',
  '라벤더 드림',
  '쿠키 베이킹',
  '스위트 캔디',
  '해피 크래프트',
  '체리 블러썸',
  '무지개 판타지'
];

const cursorColors = [
  '#FF5F1F', '#FFB800', '#3B82F6', '#8B5CF6', '#EC4899',
  '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#6366F1',
  '#14B8A6', '#EC4899', '#84CC16', '#A855F7', '#F43F5E'
];

const CURSOR_LIST: CursorInfo[] = Array.from({ length: 15 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return {
    type: `cursor${num}`,
    image: `/cursors/cursor${num}.png`,
    name: cursorNames[i] || `아트 커서 ${num}`,
    color: cursorColors[i] || '#FF5F1F',
  };
});

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [currentCursor, setCurrentCursor] = useState<CursorInfo>(() => {
    const randomIndex = Math.floor(Math.random() * CURSOR_LIST.length);
    return CURSOR_LIST[randomIndex];
  });
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleBgClick = (e: MouseEvent) => {
      // If user clicked on interactive elements (buttons, inputs, links, drag items), don't randomize cursor
      const target = e.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('.interactive-alphabet') ||
        target.closest('[role="button"]')
      ) {
        return;
      }

      // Change to a different random cursor
      setCurrentCursor((prev) => {
        const remaining = CURSOR_LIST.filter((c) => c.type !== prev.type);
        const randomIndex = Math.floor(Math.random() * remaining.length);
        return remaining[randomIndex];
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('click', handleBgClick);

    // Hide original cursor
    document.body.style.cursor = 'none';
    
    // Add custom cursor styling to interactive elements
    const style = document.createElement('style');
    style.innerHTML = `
      a, button, input, textarea, select, [role="button"], .interactive-alphabet {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('click', handleBgClick);
      document.body.style.cursor = 'auto';
      document.head.removeChild(style);
    };
  }, [isVisible]);

  if (isMobile || !isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-16px, -16px) scale(${isClicking ? 0.8 : 1})`,
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Render custom cursor image */}
        <div className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
          <img 
            src={currentCursor.image} 
            alt={currentCursor.name}
            className="w-8 h-8 object-contain"
          />
        </div>
        
        {/* Tiny, super stylish minimal tooltip badge below cursor to label the current creative mood */}
        <div 
          className="absolute top-9 left-7 text-[9px] font-mono tracking-widest uppercase bg-neutral-900/90 text-neutral-100 px-1.5 py-0.5 rounded border border-neutral-700/50 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{ borderColor: currentCursor.color }}
        >
          {currentCursor.name}
        </div>
      </div>
    </div>
  );
}

