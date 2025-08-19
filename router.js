// // router.js

// const routes = {
//   "/": "/pages/home.html",
//   "/signin": "/pages/authentification/login.html",
//   "/signup": "/pages/authentification/signup.html",
//   "/invoices": "/pages/invoices.html"
// };

// export async function loadRoute(pathname) {
//   const url = routes[pathname] || "/pages/404.html";

//   try {
//     const res = await fetch(url);
//     if (!res.ok) throw new Error("Erreur de chargement");
//     const html = await res.text();
//     document.getElementById("content").innerHTML = html;
//   } catch (error) {
//     document.getElementById("content").innerHTML = "<p>Une erreur est survenue.</p>";
//   }
// }

// export function handleNavigation(event) {
//   const link = event.target.closest("[data-link]");
//   if (link) {
//     event.preventDefault();
//     const path = link.getAttribute("href");
//     history.pushState({}, "", path);
//     loadRoute(path);
//   }
// }

// export function initRouter() {
//   // Initialisation du routage
//   window.addEventListener("popstate", () => {
//     loadRoute(location.pathname);
//   });

//   document.body.addEventListener("click", handleNavigation);

//   // Chargement initial
//   loadRoute(location.pathname);
// }
