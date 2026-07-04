import HeroSection from '../components/HeroSection';

interface HomeProps {
  onLogoHover?: (isHovered: boolean) => void;
}

export default function Home({ onLogoHover }: HomeProps) {
  const scrollToNext = () => {
    // Or we could navigate to /our-story/itsme-art-club, but if it's purely scrolling we can't scroll to "about" anymore.
    // The user said: Home -> then our story. But wait! Is there a "next" section below hero?
    // The user said "다중 페이지 구조에서는 Home에 들어오면 오직 Hero 섹션만 보이고 더 이상 아래로 스크롤할 수 없는 형태가 되는 것이 맞을까요?"
    // And they approved my plan which stated this. 
    // I should remove the "scroll-down" button entirely in HeroSection if it's multi-page.
  };

  return (
    <div className="w-full min-h-screen bg-transparent">
      <HeroSection onScrollToNext={scrollToNext} onLogoHover={onLogoHover} />
    </div>
  );
}
