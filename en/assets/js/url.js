// const LAST_URL = 'https://madarom-project-production.up.railway.app/api/url';

export function saveLastUrl() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) return;

    fetch("https://madarom-project-production.up.railway.app/api/url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        last_url: window.location.href,
      }),
    }).catch(error => {
      console.error("Erreur lors de l'enregistrement de l'URL :", error);
    });
}

export async function getLastUrl() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) return null;
  
    try {
      const response = await fetch("https://madarom-project-production.up.railway.app/api/url", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
  
      if (!response.ok) {
        console.error("Erreur lors de la récupération de l'URL :", await response.text());
        return null;
      }
  
      const data = await response.json();
      return data.last_url || null;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'URL :", error);
      return null;
    }
  }
  