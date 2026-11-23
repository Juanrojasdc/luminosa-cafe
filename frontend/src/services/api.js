const API_BASE = "/api";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "same-origin",
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      data?.message || "Erreur de communication avec le serveur.",
    );
    error.status = response.status;
    throw error;
  }

  return data;
}

export function login(email, password) {
  return apiRequest("/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export function getCurrentAdmin() {
  return apiRequest("/admin/me");
}

export async function adminRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();

  if (["GET", "HEAD"].includes(method)) {
    return apiRequest(`/admin${path}`, options);
  }

  const { csrfToken } = await apiRequest("/admin/csrf-token");

  return apiRequest(`/admin${path}`, {
    ...options,
    headers: {
      ...options.headers,
      "X-CSRF-Token": csrfToken,
    },
  });
}

export async function logout() {
  const { csrfToken } = await apiRequest("/admin/csrf-token");

  return adminRequest("/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      _csrf_token: csrfToken,
    }).toString(),
  });
}
export function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  return adminRequest("/images", {
    method: "POST",
    body: formData,
  });
}

export function sendContactMessage(contactData) {
  return apiRequest("/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactData),
  });
}
