// utilities for localStorage persistence
export const loadProducts = () => {
  try { return JSON.parse(localStorage.getItem('electromart_products') || '[]'); }
  catch { return []; }
};
export const saveProducts = (products) => localStorage.setItem('electromart_products', JSON.stringify(products));

export const loadCart = () => {
  try { return JSON.parse(localStorage.getItem('electromart_cart') || '[]'); }
  catch { return []; }
};
export const saveCart = (cart) => localStorage.setItem('electromart_cart', JSON.stringify(cart));

// users persistence (separate accounts saved here)
export const loadUsers = () => {
  try { return JSON.parse(localStorage.getItem('electromart_users') || '[]'); }
  catch { return []; }
};
export const saveUsers = (users) => localStorage.setItem('electromart_users', JSON.stringify(users));

// ---- Profile helpers ----
export const loadProfile = (username, role) => {
  const users = loadUsers();
  return users.find(u => u.username === username && u.role === role) || null;
};

export const saveProfile = (updatedUser) => {
  const users = loadUsers();
  const idx = users.findIndex(u => u.username === updatedUser.username && u.role === updatedUser.role);
  if (idx >= 0) {
    users[idx] = updatedUser;
    saveUsers(users);
  }
};


export function saveUserProfile(profile) {
  if (!profile?.username) return;
  localStorage.setItem(`profile_${profile.username}`, JSON.stringify(profile));
}

export function loadUserProfile(username) {
  const data = localStorage.getItem(`profile_${username}`);
  return data ? JSON.parse(data) : null;
}
