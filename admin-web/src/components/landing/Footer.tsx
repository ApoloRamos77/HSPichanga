

export const LandingFooter = () => {
  return (
    <footer className="landing-footer">
      <div className="landing-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="landing-logo">
              <span>Chapa</span>TuCancha
            </div>
            <p>
              Conectando deportistas y facilitando la organización de partidos en toda la ciudad. Tu próxima pichanga está a un clic de distancia.
            </p>
          </div>
          <div>
            <h4 className="footer-title">Enlaces Rápidos</h4>
            <div className="footer-links">
              <a href="#about">¿Qué es?</a>
              <a href="#sports">Deportes</a>
              <a href="/login">Panel Administrativo</a>
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
          &copy; {new Date().getFullYear()} ChapaTuCancha. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};
