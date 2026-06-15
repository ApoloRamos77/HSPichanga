import heroImg from '../../assets/hero_soccer.png';
import mockupImg from '../../assets/app_mockup.png';

export const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-bg">
        <img src={heroImg} alt="Jugadores de fútbol" />
      </div>

      {/* Partículas decorativas con colores corporativos */}
      <div className="hero-particles">
        <div className="hero-particle" />
        <div className="hero-particle" />
        <div className="hero-particle" />
      </div>

      <div className="landing-container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <div className="hero-badge-dot" />
              Disponible ahora
            </div>
            <h1>Encuentra tu próxima pichanga en segundos</h1>
            <p>
              Descubre partidos cerca de tu ubicación, inscríbete desde la app y disfruta del deporte sin preocuparte por la organización.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">
                📱 Descargar App
              </button>
              <button className="btn-secondary">
                Crear Cuenta
              </button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>500+</strong>
                <span>Pichangas al mes</span>
              </div>
              <div className="hero-stat">
                <strong>2K+</strong>
                <span>Jugadores activos</span>
              </div>
              <div className="hero-stat">
                <strong>15+</strong>
                <span>Canchas aliadas</span>
              </div>
            </div>
          </div>

          <div className="hero-mockup">
            <div className="mockup-glow" />
            <img src={mockupImg} alt="ChapaTuCancha App" className="mockup-img" />
          </div>
        </div>
      </div>
    </section>
  );
};
