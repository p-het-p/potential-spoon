// Vite substitutes this at build time. The fallback keeps local development simple.
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

function authHeaders(token, guestToken = null) {
  const gToken = guestToken || (typeof localStorage !== 'undefined' ? localStorage.getItem('guest_token') : null);
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (gToken) {
    headers['X-Guest-Session'] = gToken;
  }
  return headers;
}

async function request(url, opts = {}) {
  const gToken = typeof localStorage !== 'undefined' ? localStorage.getItem('guest_token') : null;
  const defaultHeaders = {};
  if (gToken) {
    defaultHeaders['X-Guest-Session'] = gToken;
  }
  const mergedHeaders = { ...defaultHeaders, ...(opts.headers || {}) };
  const res = await fetch(url, { credentials: 'include', ...opts, headers: mergedHeaders });
  if (res.status === 204) return null;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error?.message || body.message || `Request failed (${res.status})`);
  return body.data !== undefined ? body.data : body;
}

// ── Auth ──
export const login = (email, password) =>
  request(`${API_BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });

export const register = (data) =>
  request(`${API_BASE}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });

export const logout = (token) =>
  request(`${API_BASE}/auth/logout`, { method: 'POST', headers: authHeaders(token) });

// ── Profile ──
export const getProfile = (token) =>
  request(`${API_BASE}/me`, { headers: authHeaders(token) });

export const updateProfile = (token, data) =>
  request(`${API_BASE}/me`, { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify(data) });

// ── Events ──
export const getEvents = (params = {}, token = null) => {
  const q = new URLSearchParams(params).toString();
  return request(`${API_BASE}/events${q ? '?' + q : ''}`, token ? { headers: authHeaders(token) } : {});
};

export const getEventById = (id) =>
  request(`${API_BASE}/events/${id}`);

export const createEvent = (token, data) =>
  request(`${API_BASE}/events`, { method: 'POST', headers: authHeaders(token), body: JSON.stringify(data) });

export const updateEvent = (token, id, data) =>
  request(`${API_BASE}/events/${id}`, { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify(data) });

export const deleteEvent = (token, id) =>
  request(`${API_BASE}/events/${id}`, { method: 'DELETE', headers: authHeaders(token) });

// ── Products ──
export const getProducts = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request(`${API_BASE}/products${q ? '?' + q : ''}`);
};

export const getProductById = (id) =>
  request(`${API_BASE}/products/${id}`);

export const getHealth = () => request(`${API_BASE}/health`);

// ── Cart ──
export const getCart = (token) =>
  request(`${API_BASE}/cart`, { headers: authHeaders(token) });

export const addToCart = (token, product_id, quantity = 1) =>
  request(`${API_BASE}/cart`, { method: 'POST', headers: authHeaders(token), body: JSON.stringify({ product_id, quantity }) });

export const updateCartItem = (token, cartItemId, quantity) =>
  request(`${API_BASE}/cart/${cartItemId}`, { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify({ quantity }) });

export const removeCartItem = (token, cartItemId) =>
  request(`${API_BASE}/cart/${cartItemId}`, { method: 'DELETE', headers: authHeaders(token) });

// ── Checkout ──
export const checkoutPreview = (token) =>
  request(`${API_BASE}/checkout/preview`, { method: 'POST', headers: authHeaders(token) });

export const checkout = (token, payment_method = 'cash') =>
  request(`${API_BASE}/checkout`, { method: 'POST', headers: authHeaders(token), body: JSON.stringify({ payment_method }) });

// ── Orders ──
export const getOrders = (token, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request(`${API_BASE}/orders${q ? '?' + q : ''}`, { headers: authHeaders(token) });
};

export const getOrderById = (token, orderId) =>
  request(`${API_BASE}/orders/${orderId}`, { headers: authHeaders(token) });

export const getOrderTickets = (token, orderId) =>
  request(`${API_BASE}/orders/${orderId}/tickets`, { headers: authHeaders(token) });

// ── Tickets ──
export const checkInTicket = (token, qr_token) =>
  request(`${API_BASE}/tickets/check-in`, { method: 'POST', headers: authHeaders(token), body: JSON.stringify({ qr_token }) });

// ── Memberships ──
export const getMembershipPlans = () =>
  request(`${API_BASE}/memberships/plans`);

export const getUserMembership = (token) =>
  request(`${API_BASE}/memberships`, { headers: authHeaders(token) });

export const createMembership = (token, data) =>
  request(`${API_BASE}/memberships`, { method: 'POST', headers: authHeaders(token), body: JSON.stringify(data) });

// ── Guest ──
export const registerGuest = (data) =>
  request(`${API_BASE}/guest/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });

export const sendGuestOtp = (attendee_id) =>
  request(`${API_BASE}/guest/send-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ attendee_id }) });

export const verifyGuestOtp = (attendee_id, otp) =>
  request(`${API_BASE}/guest/verify-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ attendee_id, otp }) });

// ── Finance (treasurer only) ──
export const getFinanceSummary = (token, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request(`${API_BASE}/finance/summary${q ? '?' + q : ''}`, { headers: authHeaders(token) });
};

export const getFinanceTransactions = (token, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request(`${API_BASE}/finance/transactions${q ? '?' + q : ''}`, { headers: authHeaders(token) });
};
