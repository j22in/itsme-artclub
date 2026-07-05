import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function TvGallery() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [showHint, setShowHint] = useState(true);
  const totalImages = 24;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 1 ? totalImages : prev - 1));
    setShowHint(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalImages ? 1 : prev + 1));
    setShowHint(false);
  };

  return (
    <div className="w-full h-screen bg-transparent flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Container with max-width 650px (approx 65% of original 1000px) and fixed aspect ratio to mimic the 1000x600 size */}
      <div 
        className="relative w-full max-w-[650px]"
        style={{ aspectRatio: '1000 / 600' }}
      >
        {/* Background TV Frame */}
        <img 
          src="/tv/TV.png" 
          alt="Vintage TV Frame" 
          className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none drop-shadow-lg"
          referrerPolicy="no-referrer"
        />

        {/* Inner Gallery Image (Behind TV Frame if the frame has a transparent hole, or z-10) */}
        {/* We place it at z-10 so the TV frame overlaps it cleanly if there are rounded corners in the TV image transparency */}
        <div 
          className="absolute z-10 overflow-hidden bg-neutral-200"
          style={{
            left: '20%',        // 200px / 1000px
            top: '16.6667%',    // 100px / 600px
            width: '48%',       // 480px / 1000px
            height: '58.3333%', // 350px / 600px
            borderRadius: '16% / 22%', // slight curvature matching typical CRT TV screen
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={`/tv/tv_image-${currentIndex}.png`}
              alt={`Gallery image ${currentIndex}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
        </div>

        {/* Previous Button (Invisible clickable area) */}
        <button
          onClick={handlePrev}
          aria-label="Previous image"
          className="absolute z-30 cursor-pointer rounded-full hover:bg-white/20 active:bg-black/20 transition-colors"
          style={{
            left: '74.3%',      // 743px / 1000px
            top: '13.1667%',    // 79px / 600px
            width: '3%',        // 30px / 1000px
            height: '5%',       // 30px / 600px
          }}
        />

        {/* Next Button (Invisible clickable area) */}
        <button
          onClick={handleNext}
          aria-label="Next image"
          className="absolute z-30 cursor-pointer rounded-full hover:bg-white/20 active:bg-black/20 transition-colors"
          style={{
            left: '78.9%',      // 789px / 1000px
            top: '13.1667%',    // 79px / 600px
            width: '3%',        // 30px / 1000px
            height: '5%',       // 30px / 600px
          }}
        />

        {/* Blinking Hint Text */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 2, 
                times: [0, 0.3, 0.7, 1],
                repeat: Infinity, 
                repeatType: 'loop',
                ease: 'easeInOut' 
              }}
              className="absolute z-30 pointer-events-none text-[#FF5F1F] font-handy whitespace-nowrap flex items-center gap-1"
              style={{
                left: '85%',       // Moved right by ~20px
                top: '12.1667%',   // Moved up by ~8px
                fontSize: 'clamp(12px, 1.8vw, 18px)' // scales with screen, max 18px
              }}
            >
              ← Turn the dial!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
