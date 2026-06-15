import { useEffect } from 'react';
import './LandingPage.css';
import { LandingNavbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { AboutSection } from '../components/landing/AboutSection';
import { SportsSection } from '../components/landing/SportsSection';
import { LandingFooter } from '../components/landing/Footer';

export const LandingPage = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="landing-page">
      <LandingNavbar />
      <HeroSection />
      <AboutSection />
      <SportsSection />
      <LandingFooter />
    </div>
  );
};
