const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6001/api';

export const initiateAppleLogin = () => {
  window.location.href = `${API_BASE_URL}/auth/apple`;
};
