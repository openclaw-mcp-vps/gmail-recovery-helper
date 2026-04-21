import { NextResponse } from "next/server";

import { ACCESS_COOKIE_NAME, createAccessToken } from "@/lib/access";
import { findPurchaseBySessionId } from "@/lib/lemonsqueezy";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { sessionId?: string };
    const sessionId = body.sessionId?.trim();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID." }, { status: 400 });
    }

    const purchase = await findPurchaseBySessionId(sessionId);

    if (!purchase) {
      return NextResponse.json(
        {
          error:
            "Purchase not found yet. If you just completed checkout, wait up to 60 seconds for webhook processing and try again."
        },
        { status: 404 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: ACCESS_COOKIE_NAME,
      value: createAccessToken(sessionId),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Unable to activate access." }, { status: 500 });
  }
}
