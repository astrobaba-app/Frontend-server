import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";

const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const firebaseAuthDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const firebaseStorageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const firebaseMessagingSenderId =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const firebaseAppId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
};

const ensureFirebaseConfig = () => {
  const missingKeys: string[] = [];
  if (!firebaseApiKey) missingKeys.push("NEXT_PUBLIC_FIREBASE_API_KEY");
  if (!firebaseAuthDomain)
    missingKeys.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  if (!firebaseProjectId) missingKeys.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  if (!firebaseAppId) missingKeys.push("NEXT_PUBLIC_FIREBASE_APP_ID");

  if (missingKeys.length > 0) {
    throw new Error(`Missing Firebase config: ${missingKeys.join(", ")}`);
  }
};

const getFirebaseApp = () => {
  ensureFirebaseConfig();
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
};

const getFirebaseAuth = () => {
  const app = getFirebaseApp();
  return getAuth(app);
};

const getFirebaseErrorCode = (error: unknown) => {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
  ) {
    return (error as { code: string }).code;
  }
  return "";
};

const getFirebaseErrorMessage = (error: unknown) => {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "Failed to send OTP. Please try again.";
};

const mapPhoneAuthErrorToUserMessage = (error: unknown) => {
  const code = getFirebaseErrorCode(error);
  const host =
    typeof window !== "undefined" ? window.location.hostname : "current domain";
  const isLocalHost =
    host === "localhost" || host === "127.0.0.1" || host === "::1";

  switch (code) {
    case "auth/billing-not-enabled":
      return "Firebase billing is not enabled for Phone Auth. Enable billing (Blaze) or use Firebase test phone numbers for development.";
    case "auth/operation-not-allowed":
      return "Phone authentication is not enabled in Firebase Console.";
    case "auth/unauthorized-domain":
      return `This domain (${host}) is not authorized in Firebase Authentication settings.`;
    case "auth/invalid-app-credential": {
      const project = firebaseProjectId || "configured Firebase project";
      if (isLocalHost) {
        return "Firebase Phone Auth with real SMS can fail on localhost. Use a real HTTPS domain (or ngrok tunnel) for real numbers, or use Firebase test phone numbers while on localhost.";
      }
      return `Invalid Firebase app verification for ${host}. Verify domain authorization, API key/App ID config, and reCAPTCHA setup in ${project}.`;
    }
    case "auth/captcha-check-failed":
      return "reCAPTCHA verification failed. Disable ad blockers/privacy shields, reload the page, and try again.";
    case "auth/too-many-requests":
      return "Too many OTP requests. Please wait and try again.";
    case "auth/network-request-failed":
      return "Network error while sending OTP. Please check your internet connection.";
    default:
      return getFirebaseErrorMessage(error);
  }
};

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  try {
    return await Promise.race<T>([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error("OTP request timed out. Please try again."));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
};

declare global {
  interface Window {
    grahoRecaptchaVerifier?: RecaptchaVerifier | null;
    grahoRecaptchaContainerId?: string;
    grahoRecaptchaRenderPromise?: Promise<void> | null;
  }
}

const getRecaptchaVerifier = async (containerId: string) => {
  if (typeof window === "undefined") {
    throw new Error("Firebase phone auth is only available in browser");
  }

  const auth = getFirebaseAuth();
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error("reCAPTCHA container not found");
  }

  const hasContainerChanged =
    window.grahoRecaptchaContainerId &&
    window.grahoRecaptchaContainerId !== containerId;

  const previousContainerGone =
    !!window.grahoRecaptchaContainerId &&
    !document.getElementById(window.grahoRecaptchaContainerId);

  if (hasContainerChanged || previousContainerGone) {
    clearRecaptchaVerifier();
  }

  if (!window.grahoRecaptchaVerifier) {
    // Mount reCAPTCHA into a fresh child node to avoid stale widget reuse.
    container.innerHTML = "";
    const widgetContainer = document.createElement("div");
    widgetContainer.setAttribute("data-graho-recaptcha-widget", "true");
    container.appendChild(widgetContainer);

    const verifier = new RecaptchaVerifier(auth, widgetContainer, {
      size: "invisible",
    });
    window.grahoRecaptchaVerifier = verifier;
    window.grahoRecaptchaContainerId = containerId;
    window.grahoRecaptchaRenderPromise = verifier
      .render()
      .then(() => {
        if (window.grahoRecaptchaVerifier === verifier) {
          window.grahoRecaptchaRenderPromise = null;
        }
      })
      .catch((error) => {
        verifier.clear();
        if (window.grahoRecaptchaVerifier === verifier) {
          window.grahoRecaptchaVerifier = null;
          window.grahoRecaptchaContainerId = undefined;
          window.grahoRecaptchaRenderPromise = null;
        }
        throw error;
      });
  }

  if (window.grahoRecaptchaRenderPromise) {
    await window.grahoRecaptchaRenderPromise;
  }

  if (!window.grahoRecaptchaVerifier) {
    throw new Error("Failed to initialize reCAPTCHA verifier");
  }

  return window.grahoRecaptchaVerifier;
};

export const clearRecaptchaVerifier = () => {
  if (typeof window !== "undefined") {
    const previousContainerId = window.grahoRecaptchaContainerId;

    if (window.grahoRecaptchaVerifier) {
      window.grahoRecaptchaVerifier.clear();
    }

    window.grahoRecaptchaVerifier = null;
    window.grahoRecaptchaContainerId = undefined;
    window.grahoRecaptchaRenderPromise = null;

    if (previousContainerId) {
      const container = document.getElementById(previousContainerId);
      if (container) {
        container.innerHTML = "";
      }
    }
  }
};

export const preloadRecaptchaVerifier = async (containerId: string) => {
  await getRecaptchaVerifier(containerId);
};

const normalizeIndianNumber = (mobile: string) => {
  const digits = String(mobile || "").replace(/\D/g, "");
  if (!/^[6-9]\d{9}$/.test(digits)) {
    throw new Error("Please enter a valid 10-digit mobile number");
  }
  return `+91${digits}`;
};

export const sendFirebaseOtp = async (
  mobile: string,
  recaptchaContainerId: string
): Promise<ConfirmationResult> => {
  const phoneNumber = normalizeIndianNumber(mobile);
  const auth = getFirebaseAuth();

  const runOtpRequest = async () => {
    const verifier = await getRecaptchaVerifier(recaptchaContainerId);
    return withTimeout(signInWithPhoneNumber(auth, phoneNumber, verifier), 30000);
  };

  try {
    return await runOtpRequest();
  } catch (error) {
    const errorCode = getFirebaseErrorCode(error);
    const errorMessage = String(
      (error as { message?: unknown })?.message || ""
    ).toLowerCase();
    const shouldRetryWithFreshVerifier =
      errorCode === "auth/invalid-app-credential" ||
      errorCode === "auth/captcha-check-failed" ||
      errorCode === "auth/missing-app-credential" ||
      errorMessage.includes("already been rendered in this element");

    if (shouldRetryWithFreshVerifier) {
      clearRecaptchaVerifier();

      try {
        return await runOtpRequest();
      } catch (retryError) {
        throw new Error(mapPhoneAuthErrorToUserMessage(retryError));
      }
    }

    throw new Error(mapPhoneAuthErrorToUserMessage(error));
  }
};

export const confirmFirebaseOtp = async (
  confirmationResult: ConfirmationResult,
  otp: string
) => {
  const userCredential = await confirmationResult.confirm(otp);
  const firebaseIdToken = await userCredential.user.getIdToken();

  return {
    firebaseIdToken,
    phoneNumber: userCredential.user.phoneNumber,
  };
};
