import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  currentSection: string;
  forceShow?: boolean;
}

export default function Navbar({ onNavigate, currentSection, forceShow = false }: NavbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  const forceShowRef = useRef(forceShow);
  const isHoveredRef = useRef(isHovered);

  useEffect(() => {
    forceShowRef.current = forceShow;
    isHoveredRef.current = isHovered;
  }, [forceShow, isHovered]);

  // Sync forceShow state
  useEffect(() => {
    if (forceShow) {
      setIsVisible(true);
    } else if (!isHovered) {
      setIsVisible(false);
    }
  }, [forceShow, isHovered]);

  useEffect(() => {
    // Reveal the centered navbar when cursor is at the top of the viewport (within 100px)
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 100) {
        setIsVisible(true);
      } else if (!isHoveredRef.current && window.scrollY > 80) {
        setIsVisible(false);
      }
    };

    // Show navbar automatically or hide at top
    const handleScroll = () => {
      const top = window.scrollY < 50;
      setIsAtTop(top);
      
      // If forceShow is true (e.g. mobile menu open), respect it and don't auto-hide on scroll!
      if (forceShowRef.current) return;

      if (!isHoveredRef.current) {
        setIsVisible(false);
      }
    };

    // Initial check
    const top = window.scrollY < 50;
    setIsAtTop(top);
    // Let the other useEffect handle forceShow. Default to hidden on mount.
    setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const menuItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'classes', label: 'Classes' },
    { id: 'contact', label: 'Business' },
    { id: 'instagram', label: 'Instagram', link: 'https://www.instagram.com/itsme_artclub' }
  ];

  return (
    <>
      {/* Invisible Top Sensor Area */}
      <div className="fixed top-0 left-0 w-full h-4 z-50 pointer-events-auto bg-transparent" />

      <header 
        id="global-navbar"
        className={`fixed top-0 left-0 w-full z-50 flex flex-col items-center pt-4 px-4 transition-all duration-500 ease-out pointer-events-none ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0'
        }`}
      >
        <motion.div 
          onMouseEnter={() => {
            if (window.innerWidth >= 768) {
              setIsHovered(true);
              setIsVisible(true);
            }
          }}
          onMouseLeave={() => {
            if (window.innerWidth >= 768) {
              setIsHovered(false);
            }
          }}
          className={`w-full max-w-[540px] rounded-3xl px-6 py-3 flex flex-col md:flex-row items-center justify-center border border-neutral-200/40 select-none bg-white/80 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.05)] gap-2 transition-all duration-300 ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Centered Navigation Menu Links */}
          <nav className="flex flex-col md:flex-row items-center gap-3 md:gap-8 justify-center">
            {menuItems.map((item) => {
              const isActive = currentSection === item.id;
              
              if ('link' in item && item.link) {
                return (
                  <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative text-[15px] font-cormorant font-bold tracking-widest lowercase transition-colors duration-300 cursor-pointer py-1 text-black hover:text-neutral-400"
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative text-[15px] font-cormorant font-bold tracking-widest lowercase transition-colors duration-300 cursor-pointer py-1 ${
                    isActive 
                      ? 'text-orange-500 hover:text-neutral-400' 
                      : 'text-black hover:text-neutral-400'
                  }`}
                >
                  {item.label}
                  
                  {/* Active highlight dot under menu item */}
                  {isActive && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </motion.div>
      </header>
    </>
  );
}
