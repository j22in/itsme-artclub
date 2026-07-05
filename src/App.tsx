import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';

import Home from './pages/Home';
import Classes from './pages/Classes';
import ItsMeArtClub from './pages/ItsMeArtClub';
import Business from './pages/Business';

export default function App() {
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLogoHovered(false); // Close mobile menu if open
  }, [location.pathname]);

  return (
    <div className="relative w-full min-h-screen bg-white text-neutral-800 scroll-smooth selection:bg-orange-100 selection:text-orange-600 flex flex-col">
      
      {/* 1. Artist-themed Interactive Custom Cursor */}
      <CustomCursor />

      {/* 2. Centered Floating Navigation Bar */}
      <Navbar forceShow={isLogoHovered} onMenuToggle={setIsLogoHovered} />

      {/* 3. Global Fixed Background Mountain & Footer Layer */}
      <div 
        id="global-mountain-background"
        className="fixed bottom-0 left-0 w-full h-[32vh] md:h-[40vh] z-0 pointer-events-none select-none overflow-hidden flex flex-col justify-end bg-transparent"
      >
        {/* Soft transparent gradient to blend top of mountain into pure white background */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
        
        {/* Green peak image */}
        <img 
          src="/background.png" 
          alt="Green mountain peaks" 
          className="absolute inset-0 w-full h-full object-cover object-bottom opacity-100"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80";
          }}
        />

        {/* Footnote Footer overlay printed over the mountain peaks */}
        <div className="relative z-20 w-full text-center pb-5 px-6 bg-gradient-to-t from-black/20 via-transparent to-transparent pt-10 pointer-events-auto">
          <p className="text-[9.5px] md:text-[10px] text-white/95 font-sans tracking-wide leading-relaxed max-w-[900px] mx-auto drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] font-light opacity-80">
            이츠미아트클럽 (IT'S ME! ART CLUB) | 대표자: 민지인 | 사업자등록번호: 427-34-01607 | 이메일: itsmeartclub@gmail.com
            <span className="block md:inline md:ml-2">
              © 2026 IT'S ME! ARTCLUB. All rights reserved.
            </span>
          </p>
        </div>
      </div>

      {/* 4. Routing Container */}
      <div className="w-full flex flex-col relative z-10 bg-transparent flex-grow">
        <Routes>
          <Route path="/" element={<Home onLogoHover={setIsLogoHovered} />} />
          <Route path="/our-story/itsme-art-club" element={<ItsMeArtClub />} />
          <Route path="/our-story/classes" element={<Classes />} />
          <Route path="/business" element={<Business />} />
        </Routes>
      </div>

      {/* Mobile Floating Action Button (Menu Toggle) */}
      {!isLogoHovered && (
        <div
          className="md:hidden fixed top-6 left-6 w-14 h-14 rounded-full overflow-hidden flex items-center justify-center z-[100] cursor-pointer bg-white/90 backdrop-blur-md shadow-lg pointer-events-auto transition-transform active:scale-95 border border-neutral-200"
          onClick={() => setIsLogoHovered(true)}
        >
          <img
            src="/logo.png"
            alt="Menu toggle"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* Global CSS overrides to disable native snaps and enable pure smooth scrolling */}
      <style>{`
        html {
          background-color: #ffffff;
          scroll-behavior: smooth;
          scroll-snap-type: y mandatory;
          overflow-y: auto !important;
          height: auto !important;
          min-height: 100vh;
        }
        body, #root {
          background-color: #ffffff;
        }
      `}</style>
    </div>
  );
}
