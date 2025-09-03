// assets/js/url.js
export function saveLastUrl() {
  const currentUrl = window.location.href;
  if (!currentUrl.includes("/signin")) {
    localStorage.setItem("last_url", currentUrl);
  }
}

export function getLastUrl() {
  return localStorage.getItem("last_url");
}

export function clearLastUrl() {
  localStorage.removeItem("last_url");
}
