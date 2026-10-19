import { useRef } from 'react';
import CtaBand from '../components/CtaBand';
import SnakeJourney from '../components/SnakeJourney';
import { useJourneyScroll, useRevealScope } from '../hooks/journey';
import AboutSection from '../sections/AboutSection';
import FaqSection from '../sections/FaqSection';
import FeaturesSection from '../sections/FeaturesSection';
import HeroSection from '../sections/HeroSection';
import HowItWorksSection from '../sections/HowItWorksSection';
import TeamSection from '../sections/TeamSection';

export default function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useJourneyScroll(rootRef);
  useRevealScope(rootRef);

  return (
    <div className="journey" ref={rootRef}>
      <SnakeJourney rootRef={rootRef} />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AboutSection />
      <TeamSection />
      <FaqSection />
      <CtaBand
        title="Ready to put one code on everything?"
        text="Open the dashboard, publish a picture and download its QR code. Replace the picture later and every printed copy keeps working."
      />
    </div>
  );
}
