import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// GET — wszystkie rezerwacje
export async function GET() {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM bookings ORDER BY date ASC, hour ASC"
    );
    // MySQL DATE zwraca Date object — konwertuj na string YYYY-MM-DD
    const bookings = rows.map((r) => ({
      ...r,
      date: new Date(r.date).toISOString().slice(0, 10),
      notes: r.notes || "",
    }));
    return NextResponse.json(bookings);
  } catch (err: any) {
    console.error("DB GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST — nowa rezerwacja
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, hour, duration, type, name, email, phone, notes, status } = body;

    if (!date || hour == null || !name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Sprawdź kolizję
    const [existing] = await db.query<RowDataPacket[]>(
      `SELECT id FROM bookings 
       WHERE date = ? AND status = 'confirmed'
       AND ((hour <= ? AND hour + duration > ?) OR (? <= hour AND ? + ? > hour))`,
      [date, hour, hour, hour, hour, duration || 2]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: "Slot already booked" }, { status: 409 });
    }

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO bookings (date, hour, duration, type, name, email, phone, notes, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [date, hour, duration || 2, type || "recording", name, email, phone, notes || "", status || "confirmed"]
    );

    // Pobierz wstawiony wiersz
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM bookings WHERE id = ?",
      [result.insertId]
    );

    const booking = rows[0];
    booking.date = new Date(booking.date).toISOString().slice(0, 10);
    booking.notes = booking.notes || "";

    return NextResponse.json(booking, { status: 201 });
  } catch (err: any) {
    console.error("DB POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — usuń rezerwację
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await db.query("DELETE FROM bookings WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DB DELETE error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
