import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function TvGallery() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const totalImages = 24;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 1 ? totalImages : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalImages ? 1 : prev + 1));
  };

  return (
    <div className="w-full h-[100svh] bg-transparent flex flex-col items-center justify-center px-4 overflow-hidden snap-start">
      {/* '이츠미TV' Text Overlay above the TV */}
      <div className="text-[#FF5F1F] font-handy tracking-wider mb-6 text-center w-full" style={{ fontSize: 'clamp(20px, 3vw, 26px)' }}>
        이츠미TV
      </div>
      
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
          className="absolute z-10 overflow-hidden"
          style={{
            left: '20%',        // 200px / 1000px
            top: '16.6667%',    // 100px / 600px
            width: '48%',       // 480px / 1000px
            height: '58.3333%', // 350px / 600px
            borderRadius: '16% / 22%', // slight curvature matching typical CRT TV screen
            backgroundImage: 'url(/tv/tv_noise.gif)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
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

        {/* PC Blinking Hint Text */}
        <AnimatePresence>
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
            className="hidden md:flex absolute z-30 pointer-events-none text-black font-handy whitespace-nowrap items-center gap-1"
            style={{
              left: '86.5%',       // Moved right
              top: '11.5%',        // Moved up
              fontSize: 'clamp(12px, 1.8vw, 18px)' // scales with screen, max 18px
            }}
          >
            ← Turn the dial!
          </motion.div>
        </AnimatePresence>

        {/* Mobile Blinking Hint Text */}
        <AnimatePresence>
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
            className="md:hidden absolute z-30 pointer-events-none text-black font-handy flex flex-col items-center leading-tight"
            style={{
              left: '76.6%',       // Centered roughly over the dials
              top: '13.1667%',     // Aligned with dials
              marginTop: '-80px',  // Moved up 80px
              transform: 'translateX(-50%)',
              fontSize: '14px'
            }}
          >
            <span>Turn the dial!</span>
            <span className="text-[12px]">↓</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
