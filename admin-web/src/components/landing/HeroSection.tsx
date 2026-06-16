import heroImgDefault from '../../assets/hero_soccer.png';
import mockupImgDefault from '../../assets/app_mockup.png';

interface HeroSectionProps {
  settings?: Record<string, string>;
  onCrearCuenta?: () => void;
}

export const HeroSection = ({ settings, onCrearCuenta }: HeroSectionProps) => {
  const heroBgUrl = settings?.hero_bg || heroImgDefault;
  const mockupUrl = settings?.mockup_img || mockupImgDefault;

  return (
    <section className="hero-section">
      <div className="hero-bg">
        <img src={heroBgUrl} alt="Fondo hero" />
      </div>

      {/* Partículas decorativas */}
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
              {settings?.apk_file ? (
                <a href={settings.apk_file} className="btn-primary" style={{ textDecoration: 'none' }} download>
                  📱 Descargar App
                </a>
              ) : (
                <button className="btn-primary" onClick={() => alert('La aplicación estará disponible muy pronto.')}>
                  📱 Descargar App
                </button>
              )}
              <button
                id="btn-crear-cuenta-hero"
                className="btn-secondary"
                onClick={onCrearCuenta}
              >
                Crear Cuenta
              </button>
            </div>

            {/* Estadísticas */}
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

            {/* Franja de micro-beneficios — visible sin scroll */}
            <div className="hero-features-strip">
              <div className="hero-feature-item">
                <div className="hero-feature-icon">📍</div>
                <div className="hero-feature-text">
                  <strong>Cerca de ti</strong>
                  <span>Partidos en tu zona</span>
                </div>
              </div>
              <div className="hero-feature-item">
                <div className="hero-feature-icon">⚡</div>
                <div className="hero-feature-text">
                  <strong>Inscripción rápida</strong>
                  <span>En segundos desde la app</span>
                </div>
              </div>
              <div className="hero-feature-item">
                <div className="hero-feature-icon">🎯</div>
                <div className="hero-feature-text">
                  <strong>Juega solo</strong>
                  <span>Sin necesitar equipo</span>
                </div>
              </div>
              <div className="hero-feature-item">
                <div className="hero-feature-icon">🏆</div>
                <div className="hero-feature-text">
                  <strong>Fútbol y Vóley</strong>
                  <span>Múltiples modalidades</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-mockup">
            <div className="mockup-glow" />
            <img src={mockupUrl} alt="ChapaTuCancha App" className="mockup-img" />
          </div>
        </div>
      </div>
    </section>
  );
};
