import { useNavigate, useLocation } from 'react-router-dom';
import './LandingPage.css';
import { RegisterModal } from '../components/landing/RegisterModal';
import { LandingNavbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { AboutSection } from '../components/landing/AboutSection';
import { SportsSection } from '../components/landing/SportsSection';
import { LandingFooter } from '../components/landing/Footer';
import { landingSettingsService } from '../services/api';
import { useEffect, useState } from 'react';

export const LandingPage = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const location = useLocation();
  const navigate = useNavigate();
  // Abrir modal automáticamente si la ruta es /register
  const [showRegister, setShowRegister] = useState(location.pathname === '/register');

  useEffect(() => {
    window.scrollTo(0, 0);
    landingSettingsService.getAll().then(res => {
      setSettings(res.data);
    }).catch(err => console.error('Error fetching landing settings:', err));
  }, []);

  return (
    <div className="landing-page">
      <LandingNavbar />
      <HeroSection
        settings={settings}
        onCrearCuenta={() => setShowRegister(true)}
      />
      <AboutSection />
      <SportsSection settings={settings} />
      <LandingFooter />

      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            navigate('/login');
          }}
        />
      )}
    </div>
  );
};
