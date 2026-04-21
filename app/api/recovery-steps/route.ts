import { NextResponse } from "next/server";

import { evaluateRecoveryPath, recoveryInputSchema, recoveryMethods } from "@/lib/recovery-logic";

export async function GET() {
  return NextResponse.json({ methods: recoveryMethods });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = recoveryInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid recovery input",
          details: parsed.error.flatten()
        },
        { status: 400 }
      );
    }

    const plan = evaluateRecoveryPath(parsed.data);
    return NextResponse.json({ plan });
  } catch {
    return NextResponse.json({ error: "Unable to generate recovery steps." }, { status: 500 });
  }
}
