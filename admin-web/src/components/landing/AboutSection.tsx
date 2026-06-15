export const AboutSection = () => {
  return (
    <section className="about-section" id="about">
      <div className="landing-container">
        <div className="section-tag">
          <span>La plataforma</span>
        </div>
        <h2 className="section-title">¿Qué es ChapaTuCancha?</h2>
        <p className="section-subtitle">
          ChapaTuCancha es la plataforma que conecta jugadores y equipos para participar en eventos deportivos de manera rápida y sencilla. Organiza, encuentra y juega.
        </p>

        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">📍</div>
            <h3>Ubicación Cercana</h3>
            <p>Encuentra pichangas cerca de tu ubicación en tiempo real, sin tener que buscar en grupos de WhatsApp.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">📱</div>
            <h3>Reserva Rápida</h3>
            <p>Inscríbete desde tu celular en cuestión de segundos. Sin llamadas, sin filas, sin complicaciones.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⚽</div>
            <h3>Organiza tu Partido</h3>
            <p>Crea y administra partidos amistosos con tu equipo de manera sencilla e intuitiva.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">👥</div>
            <h3>Individual o en Equipo</h3>
            <p>Únete con tu equipo completo o participa individualmente y forma un grupo nuevo.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⏱️</div>
            <h3>Ahorra Tiempo</h3>
            <p>Olvídate del estrés de coordinar. Nosotros nos encargamos de la organización por ti.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🤝</div>
            <h3>Comunidad Deportiva</h3>
            <p>Conoce nuevos jugadores, amplía tu red de contactos y crece dentro de la comunidad.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
