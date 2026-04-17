const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6001/api';

interface ReactNativeWebViewBridge {
  postMessage: (message: string) => void;
}

interface WindowWithReactNativeWebView extends Window {
  ReactNativeWebView?: ReactNativeWebViewBridge;
}

export const initiateAppleLogin = () => {
  const appWindow = window as WindowWithReactNativeWebView;
  const isInWebView = Boolean(appWindow.ReactNativeWebView);
  const sourceQuery = isInWebView ? '?source=app' : '';

  window.location.href = `${API_BASE_URL}/auth/apple${sourceQuery}`;
};
