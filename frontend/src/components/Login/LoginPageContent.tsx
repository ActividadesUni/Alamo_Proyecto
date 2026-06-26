import React, { useMemo, useState } from "react";

type LoginErrorKind = "credenciales_invalidas" | "cuenta_inactiva" | "otro";

function detectErrorKind(errorParam: unknown): LoginErrorKind | null {
  // En la plantilla Thymeleaf usaba param.error[0]
  if (!errorParam) return null;
  const raw = String(
    Array.isArray(errorParam) ? errorParam[0] : errorParam,
  ).trim();
  const v = raw.toLowerCase();
  if (v === "credenciales_invalidas") return "credenciales_invalidas";
  if (v === "cuenta_inactiva") return "cuenta_inactiva";
  return "otro";
}

export function LoginPageContent() {
  const [dni, setDni] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [errorKind, setErrorKind] = useState<LoginErrorKind | null>(null);

  // Si tu backend (temas auth) hace redirect con ?error=..., esto lo puede leer.
  // Como placeholder, intentamos soportar ?error=credenciales_invalidas|cuenta_inactiva.
  const urlError = useMemo(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const err = sp.get("error");
      return err;
    } catch {
      return null;
    }
  }, []);

  React.useEffect(() => {
    setErrorKind(detectErrorKind(urlError));
  }, [urlError]);

  return (
    <div className="wrapper">
      <div className="card-login">
        <div className="accent-bar"></div>

        <div className="content">
          <div className="header">
            <div className="brand-block">
              <div className="brand-logo">
                <i className="fa-solid fa-user-check" />
              </div>
              <div>
                <div className="brand-name">Control de Asistencia</div>
                <div className="brand-sub">Acceso para colaboradores</div>
              </div>
            </div>

            <span className="env-label">
              <i className="fa-solid fa-building-user" />
              Uso interno
            </span>
          </div>

          <div className="title">Iniciar sesión</div>
          <div className="tagline">
            Ingresa tu DNI y contraseña para acceder al sistema.
          </div>

          {errorKind && (
            <div className="alert-custom">
              <i className="fas fa-exclamation-circle" />
              <span>
                {errorKind === "credenciales_invalidas" && (
                  <>
                    DNI o contraseña incorrectos. Verifica tus datos e intenta
                    nuevamente.
                  </>
                )}
                {errorKind === "cuenta_inactiva" && (
                  <>
                    Su cuenta se encuentra <strong>desactivada</strong>.
                    Contacte al administrador o al área de Sistemas.
                  </>
                )}
                {errorKind === "otro" && (
                  <>
                    Ocurrió un error al intentar acceder. Inténtelo nuevamente o
                    comuníquese con soporte.
                  </>
                )}
              </span>
            </div>
          )}

          <form
            action="/usuarios/validarLogin"
            method="post"
            onSubmit={(e) => {
              // Placeholder: si tu auth aún no existe, evita submit.
              // Cuando implementes auth en backend, puedes quitar este preventDefault.
              // e.preventDefault();
              if (!dni.trim() || !contrasenia.trim()) {
                e.preventDefault();
              }
            }}
          >
            <div className="mb-3 text-start">
              <label htmlFor="dni" className="form-label">
                DNI
              </label>
              <input
                type="text"
                className="form-control"
                id="dni"
                name="dni"
                placeholder="Ingresa tu DNI"
                required
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />
            </div>

            <div className="mb-3 text-start">
              <label htmlFor="contrasenia" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="contrasenia"
                name="contrasenia"
                placeholder="Ingresa tu contraseña"
                required
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-main">
              <span>Iniciar sesión</span>
              <i className="fa-solid fa-arrow-right-to-bracket" />
            </button>
          </form>

          <div className="small-note">
            Si olvidaste tu contraseña o no puedes acceder, comunícate con el
            área de Sistemas o Recursos Humanos.
          </div>
        </div>
      </div>

      <style>{loginCss}</style>
    </div>
  );
}

const loginCss = `
:root {
  --primary: rgb(13, 82, 242);
  --primary-dark: rgb(0, 0, 128);
  --gray-bg: #f3f4f6;
  --gray-soft: #e5e7eb;
  --gray-text: #4b5563;
  --text-main: #111827;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  font-family: "Poppins", sans-serif;
  background: var(--gray-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}
.wrapper { width: 100%; max-width: 520px; }
.card-login {
  background: #ffffff;
  border-radius: 1rem;
  border: 1px solid var(--gray-soft);
  box-shadow: 0 12px 25px rgba(15, 23, 42, 0.06);
  padding: 1.8rem 1.8rem 1.6rem;
  display: flex;
  gap: 1.3rem;
}
@media (min-width: 768px) { .card-login { padding: 2rem 2.1rem 1.8rem; } }
@media (max-width: 575.98px) { .card-login { flex-direction: column; } }
.accent-bar {
  width: 6px;
  border-radius: 999px;
  background: var(--primary);
}
@media (max-width: 575.98px) {
  .accent-bar { width: 100%; height: 5px; }
}
.content { flex: 1; }
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.2rem;
}
.brand-block { display: flex; align-items: center; gap: 0.75rem; }
.brand-logo {
  width: 40px; height: 40px; border-radius: 0.9rem;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  display: flex; align-items: center; justify-content: center;
  color: #ffffff;
}
.brand-name { font-weight: 600; font-size: 1rem; color: var(--text-main); }
.brand-sub { font-size: 0.78rem; color: var(--gray-text); }
.env-label {
  font-size: 0.75rem; padding: 0.25rem 0.7rem; border-radius: 999px;
  border: 1px solid var(--gray-soft); color: var(--gray-text);
  display: inline-flex; align-items: center; gap: 0.35rem;
  background: #f9fafb;
}
.env-label i { color: var(--primary); }
.title { font-size: 1.3rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.3rem; }
.tagline { font-size: 0.9rem; color: var(--gray-text); margin-bottom: 1.2rem; }
.alert-custom {
  font-size: 0.85rem;
  text-align: left;
  padding: 0.65rem 0.75rem;
  border-radius: 0.65rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}
.alert-custom i { margin-top: 0.1rem; }
.form-label { font-weight: 500; font-size: 0.9rem; color: var(--text-main); }
.form-control {
  border-radius: 0.65rem;
  padding: 0.7rem 0.85rem;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
}
.form-control:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 0.12rem rgba(198, 40, 40, 0.25);
}
.btn-main {
  background: var(--primary);
  border: none;
  width: 100%;
  padding: 0.78rem;
  font-size: 0.98rem;
  font-weight: 500;
  border-radius: 999px;
  margin-top: 0.8rem;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: background-color 0.15s ease, transform 0.12s ease, box-shadow 0.12s ease;
  box-shadow: 0 8px 20px rgba(198, 40, 40, 0.35);
}
.btn-main:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 7px 18px rgba(142, 0, 0, 0.4);
}
.btn-main i { font-size: 0.95rem; }
.small-note { font-size: 0.78rem; color: var(--gray-text); margin-top: 0.6rem; }
@media (max-width: 768px) {
  .wrapper { display: none !important; }
  body {
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100vh;
    padding: 30px;
  }
  body::before {
    content: "\f3cd";
    font-family: "Font Awesome 6 Free";
    font-weight: 900;
    font-size: 5rem;
    color: var(--primary);
    margin-bottom: 1.5rem;
  }
  body::after {
    content: "ACCESO RESTRINGIDO. El sistema de asistencia solo es accesible desde computadoras de escritorio.";
    font-weight: 600;
    color: var(--text-main);
    font-size: 1.2rem;
  }
}
`;
