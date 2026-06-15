import { Link } from 'react-router-dom';

export const LandingNavbar = () => {
  return (
    <nav className="landing-navbar">
      <div className="landing-logo">
        <img src="/logo.png" alt="ChapaTuCancha" className="landing-logo-img" />
        <div className="landing-logo-text">
          <strong>ChapaTuCancha</strong>
          <span>Pichangas Deportivas</span>
        </div>
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
