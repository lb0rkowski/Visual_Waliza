"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Booking } from "./data";

interface BookingContextType {
  bookings: Booking[];
  loading: boolean;
  addBooking: (b: Omit<Booking, "id">) => Promise<Booking | null>;
  removeBooking: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addBooking = async (b: Omit<Booking, "id">): Promise<Booking | null> => {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(b),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Booking error:", err);
        return null;
      }

      const newBooking: Booking = await res.json();
      setBookings((prev) => [...prev, newBooking]);
      return newBooking;
    } catch (err) {
      console.error("Failed to add booking:", err);
      return null;
    }
  };

  const removeBooking = async (id: number) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Delete failed");
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Failed to remove booking:", err);
    }
  };

  return (
    <BookingContext.Provider value={{ bookings, loading, addBooking, removeBooking, refresh }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookings must be inside BookingProvider");
  return ctx;
}
