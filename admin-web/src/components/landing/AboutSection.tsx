

export const AboutSection = () => {
  return (
    <section className="about-section" id="about">
      <div className="landing-container">
        <h2 className="section-title">¿Qué es ChapaTuCancha?</h2>
        <p className="section-subtitle">
          ChapaTuCancha es la plataforma que conecta jugadores y equipos para participar en eventos deportivos de manera rápida y sencilla.
        </p>

        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">📍</div>
            <h3>Ubicación Cercana</h3>
            <p>Encuentra pichangas cerca de tu ubicación en tiempo real.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">📱</div>
            <h3>Reserva Rápida</h3>
            <p>Inscríbete desde tu celular en cuestión de segundos.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⚽</div>
            <h3>Organiza y Juega</h3>
            <p>Organiza partidos amistosos o participa individualmente.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">👥</div>
            <h3>Para Todos</h3>
            <p>Únete con tu equipo completo o conoce nuevos jugadores.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⏱️</div>
            <h3>Ahorra Tiempo</h3>
            <p>Olvídate del estrés y ahorra tiempo en coordinaciones.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🤝</div>
            <h3>Comunidad</h3>
            <p>Forma parte de la comunidad deportiva más grande de tu ciudad.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
