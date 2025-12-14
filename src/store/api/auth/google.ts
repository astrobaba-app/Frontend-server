import api from '../index';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6001/api';

export const initiateGoogleLogin = () => {
  window.location.href = `${API_BASE_URL}/auth/google`;
};

export const handleGoogleCallback = async () => {
  // This will be handled by the backend redirect
  // No need for explicit API call
};
