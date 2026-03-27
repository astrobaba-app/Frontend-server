import api from "../index";

export type WebPushSubscriptionPayload = {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export async function getWebPushPublicKey() {
  const response = await api.get("/notifications/push/public-key");
  return response.data as {
    success: boolean;
    publicKey: string | null;
  };
}

export async function subscribeAstrologerWebPush(
  subscription: WebPushSubscriptionPayload
) {
  const response = await api.post("/notifications/push/subscribe", {
    subscription,
  });

  return response.data as {
    success: boolean;
    message: string;
  };
}

export async function unsubscribeAstrologerWebPush(endpoint: string) {
  const response = await api.delete("/notifications/push/unsubscribe", {
    data: { endpoint },
  });

  return response.data as {
    success: boolean;
    message: string;
  };
}
