
import heroImg from '../../assets/hero_soccer.png';
import mockupImg from '../../assets/app_mockup.png';

export const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-bg">
        <img src={heroImg} alt="Jugadores de fútbol" />
      </div>
      <div className="landing-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Encuentra tu próxima pichanga en segundos</h1>
            <p>
              Descubre partidos cerca de tu ubicación, inscríbete desde la app y disfruta del deporte sin preocuparte por la organización.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">
                Descargar App
              </button>
              <button className="btn-secondary">
                Crear Cuenta
              </button>
            </div>
          </div>
          <div className="hero-mockup">
            <img src={mockupImg} alt="ChapaTuCancha App" className="mockup-img" />
          </div>
        </div>
      </div>
    </section>
  );
};
