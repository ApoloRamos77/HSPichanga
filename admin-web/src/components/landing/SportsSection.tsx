import soccerImgDefault from '../../assets/hero_soccer.png';
import volleyImgDefault from '../../assets/volleyball.png';

export const SportsSection = ({ settings }: { settings?: Record<string, string> }) => {
  const soccerUrl = settings?.sport_soccer || soccerImgDefault;
  const volleyUrl = settings?.sport_volley || volleyImgDefault;

  return (
    <section className="sports-section" id="sports">
      <div className="landing-container">
        <div className="section-tag">
          <span>Modalidades</span>
        </div>
        <h2 className="section-title">Deportes Disponibles</h2>
        <p className="section-subtitle">
          Ya sea que busques armar una pichanga de fútbol o un partido de vóley, tenemos opciones para todos los niveles y gustos.
        </p>

        <div className="sports-grid">
          <div className="sport-card">
            <img src={soccerUrl} alt="Fútbol" className="sport-img" />
            <div className="sport-overlay">
              <div className="sport-badge">⚽ Fútbol</div>
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
            <img src={volleyUrl} alt="Vóley" className="sport-img" />
            <div className="sport-overlay">
              <div className="sport-badge">🏐 Vóley</div>
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
