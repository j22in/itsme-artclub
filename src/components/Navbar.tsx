import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';

interface NavbarProps {
  forceShow?: boolean;
  onMenuToggle?: (show: boolean) => void;
}

export default function Navbar({ forceShow = false, onMenuToggle }: NavbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

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
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 100) {
        setIsVisible(true);
      } else if (!isHoveredRef.current && window.scrollY > 80 && !forceShowRef.current) {
        setIsVisible(false);
      }
    };

    const handleScroll = () => {
      if (forceShowRef.current) return;

      if (!isHoveredRef.current && window.scrollY > 50) {
        setIsVisible(false);
        setActiveDropdown(null);
      } else if (window.scrollY <= 50) {
        setIsVisible(true);
      }
    };

    setIsVisible(window.scrollY <= 50 || forceShow);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const menuItems = [
    { id: 'home', label: 'Home', path: '/' },
    { 
      id: 'our-story', 
      label: 'our story', 
      children: [
        { id: 'itsme-art-club', label: "it's me! art club", path: '/our-story/itsme-art-club' },
        { id: 'classes', label: 'our classes', path: '/our-story/classes' }
      ]
    },
    { id: 'business', label: 'Business', path: '/business' },
    { id: 'instagram', label: 'Instagram', link: 'https://www.instagram.com/itsme_artclub' }
  ];

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  const closeMenu = () => {
    if (onMenuToggle) {
      onMenuToggle(false);
    }
    setActiveDropdown(null);
  };

  return (
    <>
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
              setActiveDropdown(null);
            }
          }}
          className={`w-full max-w-[580px] rounded-3xl px-6 py-3 flex flex-col md:flex-row items-center justify-center border border-neutral-200/40 select-none bg-white/80 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <nav className="flex flex-col md:flex-row items-center gap-4 md:gap-8 justify-center w-full">
            {menuItems.map((item) => {
              if ('link' in item && item.link) {
                return (
                  <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className="relative text-[15px] font-cormorant font-bold tracking-widest lowercase transition-colors duration-300 cursor-pointer py-1 text-black hover:text-neutral-400"
                  >
                    {item.label}
                  </a>
                );
              }

              if (item.children) {
                const isChildActive = item.children.some(child => location.pathname === child.path);
                const isDropdownOpen = activeDropdown === item.id;

                return (
                  <div 
                    key={item.id} 
                    className="relative flex flex-col items-center"
                    onMouseEnter={() => window.innerWidth >= 768 && setActiveDropdown(item.id)}
                    onMouseLeave={() => window.innerWidth >= 768 && setActiveDropdown(null)}
                  >
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      className={`relative text-[15px] font-cormorant font-bold tracking-widest lowercase transition-colors duration-300 cursor-pointer py-1 flex items-center gap-1 ${
                        isChildActive || isDropdownOpen
                          ? 'text-orange-500 hover:text-neutral-400' 
                          : 'text-black hover:text-neutral-400'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      
                      {isChildActive && !isDropdownOpen && (
                        <motion.div
                          layoutId="navUnderline"
                          className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full"
                          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        />
                      )}
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -10, height: 0 }}
                          className="md:absolute top-full md:mt-2 w-full md:w-auto flex flex-col items-center justify-center bg-white/95 md:backdrop-blur-md md:border border-neutral-100 rounded-2xl md:shadow-lg overflow-hidden min-w-[160px] py-2 md:py-3 z-50 gap-2 md:gap-0"
                        >
                          {item.children.map(child => {
                            const isChildCurrent = location.pathname === child.path;
                            return (
                              <Link
                                key={child.id}
                                to={child.path}
                                onClick={closeMenu}
                                className={`w-full text-center px-4 py-2 text-[13px] md:text-[14px] font-cormorant font-bold tracking-widest lowercase transition-colors duration-200 ${
                                  isChildCurrent ? 'text-orange-500 bg-orange-50/50' : 'text-neutral-600 hover:text-orange-500 hover:bg-neutral-50'
                                }`}
                              >
                                {child.label}
                              </Link>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.id}
                  to={item.path!}
                  onClick={closeMenu}
                  className={`relative text-[15px] font-cormorant font-bold tracking-widest lowercase transition-colors duration-300 cursor-pointer py-1 ${
                    isActive 
                      ? 'text-orange-500 hover:text-neutral-400' 
                      : 'text-black hover:text-neutral-400'
                  }`}
                >
                  {item.label}
                  
                  {isActive && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </motion.div>

        {/* Mobile Close Button below the Navbar */}
        <div className={`md:hidden mt-4 pointer-events-auto flex justify-center w-full transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={closeMenu}
            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-neutral-200 flex items-center justify-center text-neutral-800 transition-transform active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>
    </>
  );
}
