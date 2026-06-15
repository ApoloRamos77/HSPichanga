import { Link } from 'react-router-dom';

export const LandingFooter = () => {
  return (
    <footer className="landing-footer">
      <div className="landing-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-brand-logo">
              <img src="/logo.png" alt="ChapaTuCancha" className="footer-logo-img" />
              <span className="footer-logo-name">ChapaTuCancha</span>
            </div>
            <p>
              Conectando deportistas y facilitando la organización de partidos en toda la ciudad. Tu próxima pichanga está a un clic de distancia.
            </p>
          </div>
          <div>
            <h4 className="footer-title">Navegación</h4>
            <div className="footer-links">
              <a href="#about">¿Qué es?</a>
              <a href="#sports">Deportes</a>
              <Link to="/login">Panel Admin</Link>
            </div>
          </div>
          <div>
            <h4 className="footer-title">Legal</h4>
            <div className="footer-links">
              <a href="#">Términos y Condiciones</a>
              <a href="#">Política de Privacidad</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} <span>ChapaTuCancha</span> · Desarrollado por ADHSOFT SPORT
        </div>
      </div>
    </footer>
  );
};
