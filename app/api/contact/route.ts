import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await db.query(
      "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Contact DB error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
