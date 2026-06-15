export const AboutSection = () => {
  const benefits = [
    {
      icon: '📍',
      number: '01',
      title: 'Cerca de ti',
      desc: 'Encuentra pichangas en tiempo real cerca de tu ubicación. Sin complicaciones, sin búsquedas largas.',
    },
    {
      icon: '📱',
      number: '02',
      title: 'Reserva en segundos',
      desc: 'Inscríbete desde tu celular con un par de toques. Sin llamadas, sin filas, sin complicaciones.',
    },
    {
      icon: '⚽',
      number: '03',
      title: 'Organiza tu partido',
      desc: 'Crea y administra pichangas amistosas con tu equipo de manera sencilla e intuitiva.',
    },
    {
      icon: '👤',
      number: '04',
      title: 'Juega sin equipo',
      desc: 'No necesitas un equipo completo. Paga tu cuota individual y únete a una pichanga. ¿Tienes equipo? Inscríbelos juntos.',
    },
    {
      icon: '⏱️',
      number: '05',
      title: 'Ahorra tiempo',
      desc: 'Olvídate del estrés de coordinar por WhatsApp. Nosotros hacemos la organización por ti.',
    },
    {
      icon: '🤝',
      number: '06',
      title: 'Comunidad deportiva',
      desc: 'Conoce nuevos jugadores, amplía tu red de contactos y crece dentro de la comunidad.',
    },
  ];

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
          {benefits.map((b, i) => (
            <div className="benefit-card" key={i}>
              <div className="benefit-icon-wrapper">
                <div className="benefit-icon">{b.icon}</div>
                <div className="benefit-number">{b.number}</div>
              </div>
              <h3>{b.title}</h3>
              <p>{b.desc}</p>
              <div className="benefit-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
