
import { Link } from 'react-router-dom';

export const LandingNavbar = () => {
  return (
    <nav className="landing-navbar">
      <div className="landing-logo">
        <span>Chapa</span>TuCancha
      </div>
      <div className="nav-links">
        <a href="#about">¿Qué es?</a>
        <a href="#sports">Deportes</a>
        <Link to="/login" className="btn-login">
          Iniciar Sesión
        </Link>
      </div>
    </nav>
  );
};
