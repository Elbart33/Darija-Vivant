import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const subscription = await req.json();
    const kv = (process.env as any).PUSH_SUBSCRIPTIONS;
    if (!kv) {
      return NextResponse.json({ ok: false, reason: "kv_not_bound" }, { status: 500 });
    }
    const key = `sub:${subscription.endpoint}`;
    await kv.put(key, JSON.stringify(subscription));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, reason: "error" }, { status: 500 });
  }
}
