function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        {/* Identidad de Luminosa */}
        <div className="footer__brand">
          <p className="footer__identity">
            <span className="footer__logo">LUMINOSA</span>

            <span className="footer__signature">you are luminous</span>

            <span className="footer__stars" aria-hidden="true">
              <i className="bi bi-stars"></i>
            </span>
          </p>
        </div>

        {/* Horarios de apertura */}
        <section className="footer__hours" aria-labelledby="footer-hours-title">
          <h2 id="footer-hours-title">HORAIRES</h2>

          <ul className="footer__schedule">
            <li>
              <span>Lun</span>
              <span>10h00–18h00</span>
            </li>

            <li className="footer__closed">
              <span>Mar</span>
              <strong>Fermé</strong>
            </li>

            <li>
              <span>Mer</span>
              <span>10h00–18h00</span>
            </li>

            <li>
              <span>Jeu</span>
              <span>10h00–18h00</span>
            </li>

            <li>
              <span>Ven</span>
              <span>10h00–18h00</span>
            </li>

            <li>
              <span>Sam</span>
              <span>10h00–18h00</span>
            </li>

            <li>
              <span>Dim</span>
              <span>10h00–18h00</span>
            </li>
          </ul>
        </section>

        {/* Redes sociales */}
        <section
          className="footer__socials"
          aria-labelledby="footer-socials-title"
        >
          <h2 id="footer-socials-title">Nos réseaux sociaux</h2>

          <ul>
            <li>
              <a
                href="https://www.instagram.com/luminosa.cafe/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Luminosa (nouvel onglet)"
              >
                <i
                  className="bi bi-instagram footer__social-icon"
                  aria-hidden="true"
                ></i>

                <span>Instagram @luminosa.cafe</span>
              </a>
            </li>

            <li>
              <a
                href="https://www.tiktok.com/@luminosa.bordeaux"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok de Luminosa (nouvel onglet)"
              >
                <i
                  className="bi bi-tiktok footer__social-icon"
                  aria-hidden="true"
                ></i>

                <span>TikTok @luminosa.bordeaux</span>
              </a>
            </li>
          </ul>
        </section>
      </div>
    </footer>
  );
}

export default Footer;
