const config = {
  NODE_ENV: import.meta.env.VITE_APP_NODE_ENV || import.meta.env.MODE, // Use the VITE_APP_NODE_ENV or fallback to Vite mode
  BackendURL: import.meta.env.VITE_APP_BACKEND_URL,
  FrontendURL: import.meta.env.VITE_APP_FRONTEND_URL,
  RazorpayKey: import.meta.env.VITE_APP_RAZORPAY_KEY,
  SOCKET_URL: import.meta.env.VITE_APP_SOCKET_URL,
};

export default config;
