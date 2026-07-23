const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Helper for fetch with abort timeout safety
 */
const fetchWithTimeout = async (url, options = {}, timeout = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    if (err.name === 'AbortError') {
      throw new Error('Server request timed out. Please check if your Express backend is running on port 5000.');
    }
    throw err;
  }
};

/**
 * Submit an Appointment Request (Public)
 */
export const submitAppointment = async (formData) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/appointments/book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit appointment request.');
  }

  return data;
};

/**
 * Submit a Contact Inquiry (Public)
 */
export const submitContactInquiry = async (formData) => {
  console.log("Sending data to:", `${API_BASE_URL}/inquiries`, formData);

  const response = await fetchWithTimeout(`${API_BASE_URL}/inquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit contact inquiry.');
  }

  return data;
};

/* ==========================================================================
   AUTHENTICATION & PROTECTED API ROUTES
   ========================================================================== */

/**
 * Unified Login for Admin, Doctor, and Staff
 */
export const loginUser = async (credentials) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Invalid email or password.');
  }

  return data; // Returns { message, token, user: { id, email, fullName, role } }
};

/**
 * Fetch All Appointments (Protected Dashboard Endpoint)
 */
export const getAppointments = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const response = await fetchWithTimeout(`${API_BASE_URL}/appointments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch appointments.');
  }

  return data;
};

/**
 * Fetch All Inquiries (Protected Dashboard Endpoint)
 */
export const getInquiries = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const response = await fetchWithTimeout(`${API_BASE_URL}/inquiries`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`,
    },
  });

  const contentType = response.headers.get('content-type');
  
  // If Express returns an HTML error page (404/500), handle it gracefully
  if (!contentType || !contentType.includes('application/json')) {
    const htmlText = await response.text();
    console.error('Server returned non-JSON response:', htmlText);
    throw new Error(`Server endpoint /api/inquiries returned ${response.status} (${response.statusText}). Check backend routes.`);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch contact inquiries.');
  }

  return data;
};
/**
 * Update Appointment Status (Protected Dashboard Endpoint)
 */
export const updateAppointmentStatus = async (appointmentId, status) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const response = await fetchWithTimeout(`${API_BASE_URL}/appointments/${appointmentId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`,
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update appointment status.');
  }

  return data;
};
export const replyToInquiry = async (inquiryId, replyMessage) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const response = await fetchWithTimeout(`${API_BASE_URL}/inquiries/${inquiryId}/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`,
    },
    body: JSON.stringify({ replyMessage }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to send reply email.');
  }

  return data;
};
export const getDashboardStats = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const response = await fetchWithTimeout(`${API_BASE_URL}/dashboard/stats`, {
    headers: {
      'Authorization': `Bearer ${token || ''}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch dashboard stats.');
  }

  return data;
};
/**
 * Upload a PDF to the AI Chatbot Knowledge Base (FastAPI Backend)
 */
/**
 * Upload a PDF to the AI Chatbot Knowledge Base (FastAPI Backend)
 */
/**
 * Upload a PDF to the AI Chatbot Knowledge Base (FastAPI Backend)
 */
