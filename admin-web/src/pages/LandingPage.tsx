import { useEffect, useState } from 'react';
import './LandingPage.css';
import { LandingNavbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { AboutSection } from '../components/landing/AboutSection';
import { SportsSection } from '../components/landing/SportsSection';
import { LandingFooter } from '../components/landing/Footer';
import { landingSettingsService } from '../services/api';

export const LandingPage = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    landingSettingsService.getAll().then(res => {
      setSettings(res.data);
    }).catch(err => console.error('Error fetching landing settings:', err));
  }, []);

  return (
    <div className="landing-page">
      <LandingNavbar />
      <HeroSection settings={settings} />
      <AboutSection />
      <SportsSection settings={settings} />
      <LandingFooter />
    </div>
  );
};
