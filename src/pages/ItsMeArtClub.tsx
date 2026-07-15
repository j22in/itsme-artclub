import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function ItsMeArtClub() {
  return (
    <div className="w-full min-h-screen bg-transparent pt-0 pb-20 flex flex-col items-center select-none">
      
      {/* Top Full-width Image Section with Text Overlay */}
      <div className="relative w-full h-screen overflow-hidden">
        <img 
          src="/images/about_brand.png" 
          alt="Kids baking" 
          className="absolute inset-0 w-full h-full object-cover" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/10" />
        
        {/* 900px constraint container for the text boxes */}
        <div className="relative w-full max-w-[900px] h-full mx-auto px-6">
          
          {/* Paragraph 1 (Top-Left) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute top-[20%] md:top-[25%] left-6 md:left-4 text-white font-sans text-[12px] md:text-[13px] leading-[1.8] font-light"
          >
            아이들은 결과보다<br/>
            경험을 기억합니다.<br/>
            좋은 경험은 감각이 되고,<br/>
            감각은 <span className="font-bold">안목과 취향</span>이 됩니다.
          </motion.div>

          {/* Paragraph 2 (Bottom-Right) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute bottom-[20%] md:bottom-[20%] right-6 md:right-4 text-white font-sans text-[12px] md:text-[13px] leading-[1.8] font-light"
          >
            아이들의 감각을 키우는<br/>
            창작 콘텐츠를 기획하고<br/>
            디자인합니다.
          </motion.div>

        </div>
      </div>

      {/* Bottom Text Content Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[900px] mx-auto px-6 mt-20 text-center flex flex-col items-center space-y-16"
      >
        
        <div className="space-y-8 mb-12">
          <h2 className="text-[15px] font-bold font-sans text-neutral-900 tracking-wide">
            it's me art club
          </h2>
          <div className="space-y-1 text-[14px] font-sans font-light text-neutral-500">
            <p>Creative Experiences for Kids</p>
            <p>아이들에게 오래 기억에 남을 경험을 선물합니다.</p>
          </div>
        </div>

        <ul className="space-y-4 text-[13px] font-sans font-medium text-neutral-800">
          <li>classes</li>
          <li>pop-ups</li>
          <li>collaborations</li>
          <li>creative kits</li>
          <li>kids goods</li>
        </ul>

        <div>
          <Link 
            to="/our-story/classes" 
            className="inline-block text-[13px] font-sans font-medium text-neutral-500 hover:text-orange-500 transition-colors border-b border-neutral-400 hover:border-orange-500 pb-0.5 mt-8"
          >
            classes →
          </Link>
        </div>

      </motion.div>

    </div>
  );
}
