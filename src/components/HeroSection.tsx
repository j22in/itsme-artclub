import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import BouncingAlphabets from './BouncingAlphabets';

interface HeroSectionProps {
  onScrollToNext: () => void;
  onLogoHover: (hovered: boolean) => void;
}

// Hint animation cycle:
// 2s fade-in | 3s visible | 1.5s fade-out | 9s invisible  (total ~15.5 s)
const FADE_IN_MS  = 2000;
const VISIBLE_MS  = 3000;
const FADE_OUT_MS = 1500;
const PAUSE_MS    = 9000;
const CYCLE_MS    = FADE_IN_MS + VISIBLE_MS + FADE_OUT_MS + PAUSE_MS;

export default function HeroSection({ onScrollToNext, onLogoHover }: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  // Once the user has pinned any alphabet, hide the hint forever
  const [hintDone, setHintDone] = useState(false);
  const [hintOpacity, setHintOpacity] = useState(0);
  const rafRef = useRef<number>(0);

  const handleFirstPin = useCallback(() => {
    setHintDone(true);
    cancelAnimationFrame(rafRef.current);
    setHintOpacity(0);
  }, []);

  useEffect(() => {
    if (hintDone) return;

    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const elapsed = (now - start) % CYCLE_MS;

      let opacity = 0;
      if (elapsed < FADE_IN_MS) {
        opacity = elapsed / FADE_IN_MS;
      } else if (elapsed < FADE_IN_MS + VISIBLE_MS) {
        opacity = 1;
      } else if (elapsed < FADE_IN_MS + VISIBLE_MS + FADE_OUT_MS) {
        opacity = 1 - (elapsed - FADE_IN_MS - VISIBLE_MS) / FADE_OUT_MS;
      } else {
        opacity = 0;
      }

      setHintOpacity(opacity);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hintDone]);

  return (
    <div
      id="hero"
      ref={heroRef}
      className="scroll-section w-full min-h-screen flex flex-col justify-start items-center bg-transparent select-none relative overflow-hidden text-center px-6 pt-24 md:pt-28"
    >
      {/* Bouncing alphabet images layer */}
      <BouncingAlphabets heroRef={heroRef} onFirstPin={handleFirstPin} />

      {/* Face Logo */}
      <div
        className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-6 z-20 cursor-pointer bg-transparent pointer-events-auto relative"
        onMouseEnter={() => onLogoHover(true)}
        onMouseLeave={() => onLogoHover(false)}
      >
        <img
          src="/logo.png"
          alt="it's me! art club logo"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              const fallback = document.createElement('div');
              fallback.className = 'w-10 h-10 border-2 border-black rounded-full flex items-center justify-center text-sm font-bold';
              fallback.innerText = ':)';
              parent.appendChild(fallback);
            }
          }}
        />
      </div>

      {/* Centered Title Block at 30vh */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-[30vh] left-1/2 -translate-x-1/2 w-full max-w-[800px] mx-auto z-20 text-center pointer-events-none"
      >
        <div className="space-y-3 flex flex-col items-center justify-center">
          <p className="text-[13px] font-cormorant text-[#000000] tracking-[0.25em] font-normal normal-case">
            kids English &amp; art class
          </p>
          <h1 className="text-[20px] font-handy text-[#000000] font-normal tracking-wide">
            선물같은 시간, it's me! art club
          </h1>

          {/* Hint: shown only until the user first pins an alphabet */}
          {!hintDone && (
            <span
              className="text-[14px] font-handy text-[#FF5F1F] font-normal tracking-wide"
              style={{
                opacity: hintOpacity,
                display: 'block',
                marginTop: '6px',
              }}
              aria-hidden="true"
            >
              떠나니는 알파벳과 그림을 잡아 움직여보세요
            </span>
          )}
        </div>
      </motion.div>

      {/* Bottom scroll down button for mobile */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 md:hidden z-30 animate-bounce cursor-pointer flex flex-col items-center pointer-events-auto"
        onClick={onScrollToNext}
      >
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.25)]">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-20 md:h-24" />
    </div>
  );
}
