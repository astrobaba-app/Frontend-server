const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6001/api';

interface ReactNativeWebViewBridge {
  postMessage: (message: string) => void;
}

interface WindowWithReactNativeWebView extends Window {
  ReactNativeWebView?: ReactNativeWebViewBridge;
}

export const initiateGoogleLogin = () => {
  const appWindow = window as WindowWithReactNativeWebView;
  const isInWebView = Boolean(appWindow.ReactNativeWebView);
  const sourceQuery = isInWebView ? '?source=app' : '';

  window.location.href = `${API_BASE_URL}/auth/google${sourceQuery}`;
};

export const handleGoogleCallback = async () => {
  // This will be handled by the backend redirect
  // No need for explicit API call
};
