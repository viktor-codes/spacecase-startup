const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type CreateStripeCheckoutSessionPayload = {
  apodDate: string; // "YYYY-MM-DD"
  deviceModel: string;
  shippingOption: "standard" | "express";
  contact: {
    email: string;
    fullName: string;
    phone: string;
  };
  shippingAddress: {
    line1: string;
    line2?: string | null;
    city: string;
    eirCode: string;
  };
};

export type CreateStripeCheckoutSessionResponse = {
  checkoutUrl: string;
  orderId: string;
};

export type OrderResponse = {
  orderId: string;
  status: string;
  apodDate: string;
  apodTitle: string;
  apodUrl: string;
  apodHdurl: string | null;
  deviceModel: string;
  shippingOption: "standard" | "express";
  amountEur: number;
  currency: string;
};

export async function createStripeCheckoutSession(
  payload: CreateStripeCheckoutSessionPayload,
): Promise<CreateStripeCheckoutSessionResponse> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const res = await fetch(`${API_URL}/v1/orders/stripe-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Failed to create checkout session (${res.status}). ${text}`,
    );
  }

  return (await res.json()) as CreateStripeCheckoutSessionResponse;
}

export async function fetchOrder(orderId: string): Promise<OrderResponse> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const res = await fetch(`${API_URL}/v1/orders/${encodeURIComponent(orderId)}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch order (${res.status}). ${text}`,
    );
  }

  return (await res.json()) as OrderResponse;
}

