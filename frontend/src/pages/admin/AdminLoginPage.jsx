import { useState } from "react";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    // La autenticación se conectará al backend Symfony.
  }

  return (
    <div className="admin-login">
      <header className="admin-login__header">
        <p className="admin-login__brand">LUMINOSA — ADMINISTRATION</p>
      </header>

      <main className="admin-login__main">
        <section
          className="admin-login__card"
          aria-labelledby="admin-login-title"
        >
          <h1 id="admin-login-title">Connexion</h1>

          <p className="admin-login__intro">Accès réservé à Rachel.</p>

          <form className="admin-login__form" onSubmit={handleSubmit}>
            <div className="admin-login__field">
              <label htmlFor="admin-email">Email *</label>

              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="admin-login__field">
              <label htmlFor="admin-password">Mot de passe *</label>

              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <button
              className="admin-login__submit"
              type="submit"
              disabled
              title="Disponible après l'intégration de l'authentification"
            >
              Se connecter
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default AdminLoginPage;
