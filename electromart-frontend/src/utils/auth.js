// src/utils/auth.js
export function getCurrentUser() {
  try {
    return JSON.parse(sessionStorage.getItem("electromart_user"));
  } catch {
    return null;
  }
}

export function logout() {
  sessionStorage.removeItem("electromart_token");
  sessionStorage.removeItem("electromart_user");
}
