
import soccerImg from '../../assets/hero_soccer.png';
import volleyImg from '../../assets/volleyball.png';

export const SportsSection = () => {
  return (
    <section className="sports-section" id="sports">
      <div className="landing-container">
        <h2 className="section-title">Deportes Disponibles</h2>
        <p className="section-subtitle">
          Ya sea que busques armar una pichanga de fútbol o un partido intenso de vóley, tenemos opciones para todos.
        </p>

        <div className="sports-grid">
          <div className="sport-card">
            <img src={soccerImg} alt="Fútbol" className="sport-img" />
            <div className="sport-overlay">
              <h3 className="sport-title">Fútbol</h3>
              <div className="sport-modalities">
                <span className="modality-tag">Fútbol 6</span>
                <span className="modality-tag">Fútbol 7</span>
                <span className="modality-tag">Fútbol 9</span>
                <span className="modality-tag">Fútbol 11</span>
              </div>
            </div>
          </div>
          
          <div className="sport-card">
            <img src={volleyImg} alt="Vóley" className="sport-img" />
            <div className="sport-overlay">
              <h3 className="sport-title">Vóley</h3>
              <div className="sport-modalities">
                <span className="modality-tag">Vóley Mixto</span>
                <span className="modality-tag">Vóley Femenino</span>
                <span className="modality-tag">Vóley Masculino</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
