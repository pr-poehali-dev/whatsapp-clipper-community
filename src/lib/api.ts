const URLS = {
  auth: "https://functions.poehali.dev/b444f7c0-bfa6-4cde-8558-6e22d2d72cd0",
  profile: "https://functions.poehali.dev/bb9570d8-c4b0-40e2-8c05-c8f0e6fffdc3",
  reviews: "https://functions.poehali.dev/4dae9a2f-34ef-4c2a-8a27-fef852fa2d87",
  portfolio: "https://functions.poehali.dev/cfc3de48-4e9f-4b95-b8b8-2bf4ac973822",
};

function getSession(): string {
  return localStorage.getItem("session_id") || "";
}

function setSession(id: string) {
  localStorage.setItem("session_id", id);
}

function clearSession() {
  localStorage.removeItem("session_id");
}

async function req(url: string, options: RequestInit = {}) {
  const session = getSession();
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session ? { "X-Session-Id": session } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  return { status: res.status, data };
}

// AUTH
export async function apiRegister(body: {
  name: string; email: string; phone: string; specialty: string; password: string;
}) {
  const { status, data } = await req(`${URLS.auth}?action=register`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (status === 200) setSession(data.session_id);
  return { status, data };
}

export async function apiLogin(email: string, password: string) {
  const { status, data } = await req(`${URLS.auth}?action=login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (status === 200) setSession(data.session_id);
  return { status, data };
}

export async function apiGetMe() {
  return req(`${URLS.auth}?action=me`);
}

export function apiLogout() {
  clearSession();
}

// PROFILE
export async function apiGetCleaners() {
  return req(URLS.profile);
}

export async function apiUpdateProfile(body: Record<string, unknown>) {
  return req(URLS.profile, { method: "PUT", body: JSON.stringify(body) });
}

// REVIEWS
export async function apiGetReviews(cleanerId: string) {
  return req(`${URLS.reviews}?cleaner_id=${cleanerId}`);
}

export async function apiPostReview(body: {
  cleaner_id: string; author: string; rating: number; text: string;
}) {
  return req(URLS.reviews, { method: "POST", body: JSON.stringify(body) });
}

// PORTFOLIO
export async function apiGetPortfolio(cleanerId: string) {
  return req(`${URLS.portfolio}?cleaner_id=${cleanerId}`);
}

export async function apiAddPortfolioItem(body: {
  title: string; area: string; time: string; img?: string;
}) {
  return req(URLS.portfolio, { method: "POST", body: JSON.stringify(body) });
}

export { getSession };
