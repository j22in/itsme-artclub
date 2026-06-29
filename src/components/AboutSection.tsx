import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutSection() {
  const programs = [
    {
      title: 'Book & Art',
      image: '/images/program_book.png',
      tape: '/images/tape1.png',
      desc: '영어 동화를 함께 읽고 이야기를 확장하며, 그림과 만들기 등 다양한 예술 활동으로 연결되는 통합 클래스입니다.',
    },
    {
      title: 'Kids Baking',
      image: '/images/program_baking.png',
      tape: '/images/tape2.png',
      desc: '재료를 보고, 만지고, 직접 만들어보며 오감을 깨우는 시간. 즐거운 베이킹 경험 속에서 자연스럽게 영어와 친숙해집니다.',
    },
    {
      title: 'Roleplay & Craft',
      image: '/images/program_roleplay.png',
      tape: '/images/tape3.png',
      desc: '다양한 상황 속 역할놀이를 통해 영어 표현을 자연스럽게 사용해 보고, 상상력과 손끝의 창의성을 함께 키워가는 클래스입니다.',
    }
  ];

  return (
    <div id="about" className="scroll-section w-full bg-transparent py-20 md:py-28 select-none min-h-screen flex flex-col justify-center">
      <div className="max-w-[900px] mx-auto px-4 space-y-20">
        
        {/* About us Title Block */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-2"
        >
          <h2 className="text-[33px] font-handy font-normal text-[#FF5F1F] tracking-wide">
            Our story
          </h2>
          <p className="text-[13px] font-sans font-light text-[#4F4A45] tracking-wide">
            이츠미아트클럽의 이야기
          </p>
        </motion.div>

        {/* Circular Child Photo */}
        <div className="text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative w-[250px] h-[250px] rounded-full overflow-hidden mx-auto mb-[50px]"
          >
            <img 
              src="/images/about_kid.png" 
              alt="Art kid with camera" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Description block: Noto Sans KR Light/Medium, 500px width limit, left-aligned, 80px bottom margin */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-[500px] mx-auto text-left px-4 mb-[80px]"
          >
            <h3 className="font-sans font-medium text-[16px] text-neutral-900 leading-[2.0] mb-4 text-center">
              5-7세, 넘치는 호기심과 반짝이는 가능성의 시기.
            </h3>
            <p className="font-sans font-light text-[13px] text-[#4F4A45] leading-[2.0]">
              이츠미아트클럽은 한창 다양한 경험을 추구하고 온몸으로 세상을 흡수하는 5세부터 7세까지의 유아기를 위한 경험 중심 <span className="font-medium text-neutral-900">영어 키즈 아트 클래스</span>를 제공합니다.
            </p>
            <p className="font-sans font-light text-[13px] text-[#4F4A45] leading-[2.0] mt-4">
              아이들의 세계라서 타협하지 않고 끝까지 감각적인 경험을 담아냅니다.
            </p>
          </motion.div>
          
          {/* Smiley emoji icon and text */}
          <div className="space-y-3">
            <div className="text-3xl text-orange-500 font-handy font-bold rotate-90 inline-block">
              (:
            </div>
            <p className="text-base md:text-lg font-handy font-normal text-neutral-600 tracking-wide">
              Every child is an artist, every moment is a gift.
            </p>
          </div>
        </div>

        {/* Banner Card without heavy shadow / container borders */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-[750px] md:aspect-square mx-auto overflow-hidden bg-white mt-[50px] mb-[100px] flex flex-col md:block"
        >
          <img 
            src="/images/about_banner.png" 
            alt="Smiling children playing" 
            className="w-full aspect-square md:aspect-auto md:h-full md:w-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          
          {/* Card Overlay Text Content - Centered Box with Left-aligned Text, positioned 120px from the top */}
          <div className="relative md:absolute md:inset-0 flex flex-col items-center justify-start p-6 bg-transparent">
            <div className="w-full max-w-[450px] text-left space-y-4 mt-2 md:mt-[120px]">
              <h3 className="text-[13px] font-sans font-medium text-[#4F4A45] leading-relaxed mb-6">
                아이들의 평생 기억에 저장되는 시간
              </h3>
              <p className="text-[13px] font-sans font-light leading-[2.0] text-[#4F4A45]">
                무엇이 아이들을 위한 교육인지 혼란스러운 요즘, 이츠미아트클럽은 변하지 않는 가치인 즐거움과 경험에 집중합니다. 온몸으로 부딪히며 함께 웃고, 상상하고, 표현하는 이 시간들은 단순한 배움 이상의 기억으로 남아 아이들만의 세계관과 사고의 지평을 확장하는 밑거름이 됩니다.
              </p>
              <p className="text-[13px] font-sans font-light leading-[2.0] text-[#4F4A45]">
                이츠미 클래스는 다채로운 테마 활동과 감각적인 게임, 그리고 깊이 있는 교감에 온전히 몰입하는 '진짜 내가 되는 순간'을 만들어갑니다.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 400px height full screen-width orange band as requested, shifted down by 120px */}
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#FF5F1F] md:h-[400px] flex items-center justify-center mt-[120px]">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-[900px] w-full h-full px-6 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 relative py-12 md:py-0"
          >
            
            {/* Left: Beautiful image of pirate kid playing with map, overlapping the orange band */}
            <div className="w-full md:w-[45%] h-[300px] md:h-[440px] relative md:translate-y-10 rotate-0 rounded-none overflow-hidden shrink-0 z-20 border-0 bg-transparent">
              <img 
                src="/images/about_pirate.png" 
                alt="Pirate kids playing with map" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Right: Text explanation on top of the orange bar */}
            <div className="w-full md:flex-1 text-white text-left space-y-4 z-10">
              <h3 className="text-[12px] md:text-[13px] font-sans font-medium text-orange-50/95 leading-relaxed">
                아이가 마주할 더 넓은 세상과 소통하는 매개로서의 영어와 미술
              </h3>
              <div className="space-y-3 text-[12px] md:text-[13px] leading-relaxed text-orange-50/95 font-sans font-light max-w-md">
                <p>
                  영어와 미술은 아이가 세상과 관계를 맺고 자신을 표현하는 언어입니다. 이츠미아트클럽은 미술 기법을 배우거나 영어를 배우는 곳이 아닙니다. 스킬을 개발하는 것 이전, 아이들이 이 모든 과정을 '나를 표현하는 행복한 경험'으로 기억하는 것을 중심으로 합니다.
                </p>
                <p>
                  우리는 스킬보다 먼저, 자연스러운 소통과 즐거운 몰입 속에서 아이들이 자신만의 색깔을 발견해 나가는 시간을 만들어갑니다.
                </p>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Main Programs Block - Borderless, Transparent, pt-140px spacing to ensure 100px clear gap */}
        <div className="space-y-12 pt-[140px]">
          <div className="text-center space-y-2">
            <h2 className="text-[18px] font-handy font-normal text-[#FF5F1F] tracking-wide">
              Main Programs
            </h2>
            <p className="text-[13px] font-sans font-light text-[#4F4A45] max-w-xl mx-auto">
              다양한 테마를 바탕으로 책과 요리, 놀이와 만들기 등 여러 경험을 넘나들며 아이들의 호기심과 표현력을 자연스럽게 확장해 나갑니다.
            </p>
          </div>

          {/* 3 Columns Programs grid - COMPLETELY BORDERLESS & SHADOWLESS FLOATING ITEMS with 50px top margin */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-[50px]">
            {programs.map((prog, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-transparent flex flex-col space-y-4 w-[180px] mx-auto relative mt-4"
              >
                {/* Tape Overlay */}
                <img
                  src={prog.tape}
                  alt=""
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] z-20 pointer-events-none drop-shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div className="w-[180px] h-[144px] relative overflow-hidden rounded-none bg-neutral-100 mx-auto">
                  <img 
                    src={prog.image} 
                    alt={prog.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 rounded-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-2 text-left px-1">
                  <h4 className="font-cormorant font-bold text-[15px] text-neutral-900 tracking-tight">
                    {prog.title}
                  </h4>
                  <p className="text-[11.5px] leading-relaxed text-neutral-500 font-normal">
                    {prog.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom curriculum description - Noto Sans KR Light, 14px, centered, line-height 2.0, max-width 600px */}
          <div className="max-w-[600px] mx-auto text-center mt-16 px-4">
            <p className="font-sans font-light text-[13px] text-[#4F4A45] leading-[2.0]">
              또한 계절과 특별한 날을 주제로 한 프로젝트 수업과 감각 놀이, 자유로운 창작 활동 등 다양한 프로그램을 통해 아이들이 더욱 풍부한 경험을 쌓을 수 있도록 더욱 재밌는 커리큘럼을 준비합니다.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
