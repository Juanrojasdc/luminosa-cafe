function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <p className="footer__identity">
            <span className="footer__logo">LUMINOSA</span>

            <span className="footer__signature">you are luminous</span>

            <span className="footer__stars" aria-hidden="true">
              ✦✧
            </span>
          </p>
        </div>

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

        <section
          className="footer__socials"
          aria-labelledby="footer-socials-title"
        >
          <h2 id="footer-socials-title">Nos réseaux sociaux</h2>

          <ul>
            <li>
              <a href="#" aria-label="Instagram de Luminosa">
                <span className="footer__social-icon" aria-hidden="true">
                  ◎
                </span>
                <span>Instagram</span>
              </a>
            </li>

            <li>
              <a href="#" aria-label="TikTok de Luminosa">
                <span className="footer__social-icon" aria-hidden="true">
                  ♪
                </span>
                <span>TikTok</span>
              </a>
            </li>
          </ul>
        </section>
      </div>
    </footer>
  );
}

export default Footer;
