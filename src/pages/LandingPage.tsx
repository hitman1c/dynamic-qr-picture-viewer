import { useRef } from 'react';
import CtaBand from '../components/CtaBand';
import { useJourneyScroll, useRevealScope } from '../hooks/journey';
import AboutSection from '../sections/AboutSection';
import FaqSection from '../sections/FaqSection';
import FeaturesSection from '../sections/FeaturesSection';
import HeroSection from '../sections/HeroSection';
import HowItWorksSection from '../sections/HowItWorksSection';
import StorySection from '../sections/StorySection';
import TeamSection from '../sections/TeamSection';

export default function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useJourneyScroll(rootRef);
  useRevealScope(rootRef);

  return (
    <div className="journey" ref={rootRef}>
      <HeroSection />
      <StorySection />
      <FeaturesSection />
      <HowItWorksSection />
      <AboutSection />
      <TeamSection />
      <FaqSection />
      <CtaBand />
    </div>
  );
}
