import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { upsertPurchaseRecord } from "@/lib/lemonsqueezy";

export const runtime = "nodejs";

type StripeCheckoutEvent = {
  id: string;
  type: string;
  data?: {
    object?: {
      id?: string;
      amount_total?: number;
      currency?: string;
      customer_details?: {
        email?: string;
      };
      status?: string;
      created?: number;
    };
  };
};

function verifyStripeSignature(rawBody: string, signatureHeader: string, webhookSecret: string) {
  const parts = signatureHeader.split(",").reduce<Record<string, string>>((acc, part) => {
    const [key, value] = part.split("=");
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {});

  const timestamp = parts.t;
  const signature = parts.v1;

  if (!timestamp || !signature) {
    return false;
  }

  const payload = `${timestamp}.${rawBody}`;
  const expected = createHmac("sha256", webhookSecret).update(payload).digest("hex");

  if (expected.length !== signature.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signatureHeader = request.headers.get("stripe-signature");

  if (!webhookSecret || !signatureHeader) {
    return NextResponse.json({ error: "Missing webhook secret or signature." }, { status: 400 });
  }

  const rawBody = await request.text();

  if (!verifyStripeSignature(rawBody, signatureHeader, webhookSecret)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  let event: StripeCheckoutEvent;

  try {
    event = JSON.parse(rawBody) as StripeCheckoutEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data?.object;
    if (session?.id) {
      await upsertPurchaseRecord({
        sessionId: session.id,
        email: session.customer_details?.email || "unknown@example.com",
        amountTotal: session.amount_total ?? 0,
        currency: session.currency ?? "usd",
        status: "paid",
        createdAt: session.created ? new Date(session.created * 1000).toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }

  return NextResponse.json({ received: true });
}
