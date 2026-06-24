import { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import FindClassSection from './components/FindClassSection';
import ContactSection from './components/ContactSection';

export default function App() {
  const [currentSection, setCurrentSection] = useState('hero');
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [showMobileFab, setShowMobileFab] = useState(false);
  const isScrollingRef = useRef(false);

  // Monitor scroll for mobile FAB visibility
  useEffect(() => {
    const handleScrollForFab = () => {
      // Hero section face is near the top. Show FAB if scrolled past 300px
      setShowMobileFab(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScrollForFab, { passive: true });
    handleScrollForFab();
    return () => window.removeEventListener('scroll', handleScrollForFab);
  }, []);

  // Monitor scrolling to highlight correct nav item in the floating navbar
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Precise middle trigger
      threshold: 0.1,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    const sectionIds = ['hero', 'about', 'classes', 'contact'];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);
  // Custom Smooth Magnetic Scroll (자석 스크롤)
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let lastScrollY = window.scrollY;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const smoothScrollTo = (targetY: number, duration: number) => {
      const startY = window.scrollY;
      const difference = targetY - startY;
      let startTime: number | null = null;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percent = Math.min(progress / duration, 1);
        
        window.scrollTo(0, startY + difference * easeOutCubic(percent));

        if (progress < duration) {
          window.requestAnimationFrame(step);
        } else {
          isScrollingRef.current = false;
        }
      };
      
      window.requestAnimationFrame(step);
    };

    const handleScroll = () => {
      // Disable JS magnetic scroll completely on mobile to allow native touch scroll to perform optimally
      if (window.innerWidth < 768) return;
      if (isScrollingRef.current) return;

      const currentScrollY = window.scrollY;
      // Determine scroll direction
      const direction = currentScrollY > lastScrollY ? 'down' : 'up';
      lastScrollY = currentScrollY;

      clearTimeout(scrollTimeout);
      
      // Debounce to detect when scroll stops (200ms)
      scrollTimeout = setTimeout(() => {
        if (isScrollingRef.current) return;

        const sectionIds = ['hero', 'about', 'classes', 'contact'];
        const viewportHeight = window.innerHeight;

        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            
            if (direction === 'down') {
              // 스크롤 내릴 때: 다음 섹션의 상단이 화면의 하단 60% 안으로 들어오면 강하게 끌어당김
              if (rect.top > 10 && rect.top < viewportHeight * 0.6) {
                isScrollingRef.current = true;
                setCurrentSection(id);
                smoothScrollTo(window.scrollY + rect.top, 700);
                break;
              }
            } else {
              // 스크롤 올릴 때: 이전 섹션의 상단이 화면 위쪽 40% 범위 안으로 내려오면 강하게 끌어당김
              if (rect.top < -10 && rect.top > -viewportHeight * 0.4) {
                isScrollingRef.current = true;
                setCurrentSection(id);
                smoothScrollTo(window.scrollY + rect.top, 700);
                break;
              }
            }
          }
        }
      }, 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);
  const navigateToSection = (id: string) => {
    // Small delay to allow menu animation to start if needed
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        // Native smooth scroll
        el.scrollIntoView({ behavior: 'smooth' });
        setCurrentSection(id);
      }
    }, 50);
    setIsLogoHovered(false); // Hide navbar on mobile after navigating
  };

  const scrollToAbout = () => {
    navigateToSection('about');
  };

  return (
    <div className="relative w-full min-h-screen bg-white text-neutral-800 scroll-smooth selection:bg-orange-100 selection:text-orange-600">
      
      {/* 1. Artist-themed Interactive Custom Cursor */}
      <CustomCursor />

      {/* 2. Centered Floating Navigation Bar */}
      <Navbar onNavigate={navigateToSection} currentSection={currentSection} forceShow={isLogoHovered} />

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
        <div className="relative z-20 w-full text-center pb-5 px-6 bg-gradient-to-t from-black/20 via-transparent to-transparent pt-10">
          <p className="text-[9.5px] md:text-[10px] text-white/95 font-sans tracking-wide leading-relaxed max-w-[900px] mx-auto drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] font-light opacity-80">
            이츠미아트클럽 (IT'S ME! ART CLUB) | 대표자: 민지인 | 사업자등록번호: 427-34-01607 | 이메일: itsmeartclub@gmail.com
            <span className="block md:inline md:ml-2">
              © 2026 IT'S ME! ARTCLUB. All rights reserved.
            </span>
          </p>
        </div>
      </div>

      {/* 4. Sequential Natural Scroll Sections with transparent backgrounds */}
      <div className="w-full flex flex-col relative z-10 bg-transparent">
        {/* Hero / Welcome Section */}
        <HeroSection onScrollToNext={scrollToAbout} onLogoHover={setIsLogoHovered} />

        {/* About Club & Main Programs Section */}
        <AboutSection />

        {/* Find a Class Section */}
        <FindClassSection />

        {/* Business Partnership Contact Section */}
        <ContactSection />

        {/* Transparent bottom spacer so the user can scroll to fully reveal the fixed mountain background and footer */}
        <div className="h-[12vh] md:h-[18vh] bg-transparent pointer-events-none" />
      </div>

      {/* Mobile Floating Action Button (Menu Toggle) */}
      {(showMobileFab || isLogoHovered) && (
        <div
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full overflow-hidden flex items-center justify-center z-[100] cursor-pointer bg-white/90 backdrop-blur-md shadow-lg pointer-events-auto transition-transform active:scale-95 border border-neutral-200"
          onClick={() => setIsLogoHovered(prev => !prev)}
        >
          {isLogoHovered ? (
            <X className="w-6 h-6 text-neutral-800" />
          ) : (
            <img
              src="/logo.png"
              alt="Menu toggle"
              className="w-full h-full object-contain"
            />
          )}
        </div>
      )}

      {/* Global CSS overrides to disable native snaps and enable pure smooth scrolling */}
      <style>{`
        html {
          background-color: #ffffff;
          scroll-behavior: smooth;
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
