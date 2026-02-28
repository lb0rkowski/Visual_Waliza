import { NextResponse } from "next/server";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM messages ORDER BY created_at DESC"
    );
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("Messages DB error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
