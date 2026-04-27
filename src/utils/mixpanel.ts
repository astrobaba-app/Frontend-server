"use client";

import mixpanel from "mixpanel-browser";

let isMixpanelInitialized = false;

function getMixpanelToken() {
  return process.env.NEXT_PUBLIC_MIXPANEL_TOKEN?.trim();
}

function shouldIgnoreDnt() {
  const override = process.env.NEXT_PUBLIC_MIXPANEL_IGNORE_DNT;

  if (override === "true") {
    return true;
  }

  if (override === "false") {
    return false;
  }

  // Keep production privacy-respecting by default, but unblock local testing.
  return process.env.NODE_ENV !== "production";
}

export function initializeMixpanel() {
  if (typeof window === "undefined") {
    return false;
  }

  const token = getMixpanelToken();
  if (!token) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Mixpanel] Missing NEXT_PUBLIC_MIXPANEL_TOKEN");
    }
    return false;
  }

  if (isMixpanelInitialized) {
    return true;
  }

  mixpanel.init(token, {
    debug: process.env.NODE_ENV !== "production",
    track_pageview: false,
    persistence: "localStorage",
    api_host: process.env.NEXT_PUBLIC_MIXPANEL_API_HOST,
    ignore_dnt: shouldIgnoreDnt(),
  });

  if (process.env.NODE_ENV !== "production") {
    console.info("[Mixpanel] Initialized");
  }

  isMixpanelInitialized = true;
  return true;
}

export function trackMixpanelEvent(
  eventName: string,
  properties: Record<string, unknown> = {}
) {
  if (!initializeMixpanel()) {
    return;
  }

  mixpanel.track(eventName, properties);

  if (process.env.NODE_ENV !== "production") {
    console.info(`[Mixpanel] Tracked event: ${eventName}`, properties);
  }
}

export function identifyMixpanelUser(
  distinctId: string,
  profile: Record<string, unknown> = {}
) {
  if (!initializeMixpanel()) {
    return;
  }

  mixpanel.identify(distinctId);

  if (Object.keys(profile).length > 0) {
    mixpanel.people.set(profile);
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[Mixpanel] Identified user", { distinctId, profile });
  }
}

export function resetMixpanelUser() {
  if (!initializeMixpanel()) {
    return;
  }

  mixpanel.reset();

  if (process.env.NODE_ENV !== "production") {
    console.info("[Mixpanel] Reset user");
  }
}

export function identifyAnonymousMixpanelUser() {
  if (!initializeMixpanel()) {
    return;
  }

  const distinctId = mixpanel.get_distinct_id();
  if (!distinctId) {
    return;
  }

  mixpanel.identify(distinctId);
  mixpanel.people.set({
    is_anonymous: true,
    first_seen_at: new Date().toISOString(),
  });

  if (process.env.NODE_ENV !== "production") {
    console.info("[Mixpanel] Identified anonymous user", { distinctId });
  }
}