const API_URL_REG = 'http://127.0.0.1:8000/api/register';
const API_URL_LOG = 'http://127.0.0.1:8000/api/login';

async function register(name, email, password, password_confirmation) {
  try {
    const response = await fetch(API_URL_REG, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Stocke l'utilisateur connecté dans localStorage
      localStorage.setItem("user", JSON.stringify(data));
      alert("Inscription réussie ! Vous êtes maintenant connecté.");
      location.reload();
    } else {
      alert(data.message || "Erreur d'inscription");
      console.error(data);
    }

  } catch (error) {
    console.error("Erreur réseau :", error);
    alert("Une erreur est survenue lors de l'inscription.");
  }
}

async function login(email, password) {
  try {
    const response = await fetch(API_URL_LOG, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      alert("Connexion réussie !");
      location.reload();
    } else {
      alert(data.message || "Identifiants incorrects");
    }

  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    alert("Erreur réseau.");
  }
}

function logoutWithConfirmation() {
  const confirmLogout = window.confirm("Voulez-vous vraiment vous déconnecter ?");

  if (confirmLogout) {
    localStorage.removeItem("user");
    location.reload();
  }
}

// ✅ Vérifie s’il y a un utilisateur en localStorage
function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// Exemple d'appel
document.addEventListener("DOMContentLoaded", () => {
  // Exemple d’utilisation :
  const formLogin = document.getElementById("form-login");
  const formRegister = document.getElementById("form-register");
  const btnLogout = document.getElementById("btn-logout");

  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;
      login(email, password);
    });
  }

  if (formRegister) {
    formRegister.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("register-name").value;
      const email = document.getElementById("register-email").value;
      const password = document.getElementById("register-password").value;
      const password_confirmation = document.getElementById("register-password-confirm").value;
      register(name, email, password, password_confirmation);
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", logoutWithConfirmation);
  }
});
