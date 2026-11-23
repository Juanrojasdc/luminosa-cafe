import { useState } from "react";
import { sendContactMessage } from "../services/api";

function ContactPage() {
  // Estados del formulario.
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  // Prepara los datos para enviarlos posteriormente a Symfony.

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const contactData = {
      name: formData.get("name").trim(),
      email: formData.get("email").trim(),
      subject: formData.get("subject").trim(),
      message: formData.get("message").trim(),
    };

    if (Object.values(contactData).some((value) => !value)) {
      setStatus("error");
      setFeedback("Veuillez remplir tous les champs du formulaire.");
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      const response = await sendContactMessage(contactData);

      setStatus("success");
      setFeedback(response.message);
      form.reset();
    } catch (error) {
      setStatus("error");
      setFeedback(
        error.message ||
          "Le service de contact est temporairement indisponible.",
      );
    }
  }

  return (
    <main className="contact-page">
      <div className="contact-page__container">
        <section className="contact-page__information">
          <p className="contact-page__eyebrow">CONTACT</p>

          <h1>Nous contacter</h1>

          <p className="contact-page__intro">
            Une question ou un message ?
            <br />
            Écrivez-nous simplement.
          </p>

          <div className="contact-page__details">
            <p className="contact-page__location">Bordeaux</p>

            <p className="contact-page__response">
              Nous vous répondrons dans les meilleurs délais.
            </p>
          </div>
        </section>

        <section
          className="contact-page__form-section"
          aria-label="Formulaire de contact"
        >
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form__field">
              <label htmlFor="contact-name">Nom *</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={100}
                required
              />
            </div>

            <div className="contact-form__field">
              <label htmlFor="contact-email">Email *</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
              />
            </div>

            <div className="contact-form__field">
              <label htmlFor="contact-subject">Sujet *</label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                maxLength={150}
                required
              />
            </div>

            <div className="contact-form__field">
              <label htmlFor="contact-message">Message *</label>
              <textarea
                id="contact-message"
                name="message"
                rows={6}
                maxLength={5000}
                required
              />
            </div>

            <button
              className="contact-form__submit"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Envoi en cours..." : "Envoyer"}
            </button>

            {feedback && (
              <p
                className={`contact-form__feedback contact-form__feedback--${status}`}
                role="alert"
              >
                {feedback}
              </p>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}

export default ContactPage;
