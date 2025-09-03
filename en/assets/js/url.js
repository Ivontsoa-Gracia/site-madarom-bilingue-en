// const LAST_URL = 'http://127.0.0.1:8000/api/url';

export function saveLastUrl() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) return;

    fetch("http://127.0.0.1:8000/api/url", {
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
      const response = await fetch("http://127.0.0.1:8000/api/url", {
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
  