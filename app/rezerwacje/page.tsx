"use client";

import { useState } from "react";
import { SectionHead, Sect, RevealDiv, GlowBtn } from "@/components/ui";
import { useBookings } from "@/lib/store";
import { SESSION_TYPES, DURATIONS, Booking } from "@/lib/data";

const MO_NAMES = ["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"];
const DAY_N = ["Pn","Wt","Śr","Cz","Pt","Sb","Nd"];

export default function RezerwacjePage() {
  const { bookings, loading, addBooking } = useBookings();
  const [curDate, setCurDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week">("month");
  const [selDate, setSelDate] = useState<string | null>(null);
  const [selSlot, setSelSlot] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "recording", duration: 2, notes: "" });
  const [confirm, setConfirm] = useState<Booking | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const yr = curDate.getFullYear(), mo = curDate.getMonth();
  const dim = new Date(yr, mo + 1, 0).getDate();
  const fd = (new Date(yr, mo, 1).getDay() + 6) % 7;
  const slots = Array.from({ length: 12 }, (_, i) => i + 10);

  const isBooked = (d: string, h: number) => bookings.some((b) => b.date === d && h >= b.hour && h < b.hour + b.duration);

  const clickSlot = (day: number, hour: number) => {
    const ds = `${yr}-${String(mo + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (isBooked(ds, hour)) return;
    setSelDate(ds); setSelSlot(hour); setStep(1); setError("");
  };

  const book = async () => {
    if (!form.name || !form.email || !form.phone || !selDate || selSlot === null) return;
    setSubmitting(true); setError("");

    const result = await addBooking({
      date: selDate, hour: selSlot, duration: form.duration,
      type: form.type, name: form.name, email: form.email,
      phone: form.phone, notes: form.notes, status: "confirmed",
    });
    setSubmitting(false);

    if (result) {
      setConfirm(result); setStep(0); setSelDate(null); setSelSlot(null);
      setForm({ name: "", email: "", phone: "", type: "recording", duration: 2, notes: "" });
    } else {
      setError("Nie udało się zapisać rezerwacji. Spróbuj ponownie.");
    }
  };

  const inputCls = "w-full p-3 bg-cs-deep border border-cs-line rounded-sm text-cs-text font-body text-sm outline-none transition-all duration-300";

  return (
    <div className="pt-24">
      <Sect>
        <SectionHead title="Rezerwacje" sub="book a session" />

        {loading && (
          <div className="text-center py-16">
            <div className="inline-block w-6 h-6 border-2 border-cs-gold-dim border-t-cs-gold rounded-full" style={{ animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div className="font-mono text-[10px] text-cs-dim mt-3 tracking-wider">LOADING...</div>
          </div>
        )}

        {confirm && (
          <RevealDiv>
            <div className="bg-[rgba(59,107,59,0.06)] border border-[rgba(59,107,59,0.2)] rounded-sm p-7 mb-8 text-center">
              <div className="font-display text-xl text-cs-green mb-2">✓ Zarezerwowano</div>
              <div className="font-body text-sm text-cs-muted">
                {SESSION_TYPES.find((s) => s.id === confirm.type)?.name} · {confirm.date} · {confirm.hour}:00 · {confirm.duration}h
              </div>
              <div className="font-mono text-[11px] text-cs-dim mt-2">Potwierdzenie → {confirm.email}</div>
              <GlowBtn ghost onClick={() => setConfirm(null)} className="mt-3.5 !py-2 !px-5 !text-[10px]">OK</GlowBtn>
            </div>
          </RevealDiv>
        )}

        {!loading && <>
          <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurDate(new Date(yr, mo - 1))} className="bg-transparent border border-cs-line text-cs-muted px-3 py-2 cursor-pointer font-body text-sm">◂</button>
              <span className="font-display text-lg text-cs-white min-w-[180px] text-center uppercase tracking-wide">{MO_NAMES[mo]} {yr}</span>
              <button onClick={() => setCurDate(new Date(yr, mo + 1))} className="bg-transparent border border-cs-line text-cs-muted px-3 py-2 cursor-pointer font-body text-sm">▸</button>
            </div>
            <div className="flex gap-1">
              {([["month", "Miesiąc"], ["week", "Tydzień"]] as const).map(([v, l]) => (
                <button key={v} onClick={() => setView(v)} className="font-mono text-[10px] tracking-[0.1em] px-4 py-[7px] cursor-pointer transition-all"
                  style={{ background: view === v ? "#C49767" : "transparent", color: view === v ? "#050810" : "#403830", border: `1px solid ${view === v ? "#C49767" : "#1A1F2B"}` }}>{l}</button>
              ))}
            </div>
          </div>

          {/* MONTH VIEW */}
          {view === "month" && (
            <div className="bg-cs-card border border-cs-line rounded-sm overflow-hidden">
              <div className="grid grid-cols-7">
                {DAY_N.map((d) => <div key={d} className="py-2.5 px-1.5 text-center font-mono text-[10px] text-cs-dim border-b border-cs-line">{d}</div>)}
                {Array.from({ length: fd }).map((_, i) => <div key={`e${i}`} className="min-h-[80px] border-b border-cs-line border-r border-r-[rgba(26,31,43,0.024)]" />)}
                {Array.from({ length: dim }, (_, i) => {
                  const day = i + 1, ds = `${yr}-${String(mo + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const db = bookings.filter((b) => b.date === ds), di = (fd + i) % 7, isSun = di === 6;
                  const today = new Date().toISOString().slice(0, 10), isToday = today === ds;
                  const past = new Date(ds) < new Date(today);
                  return (
                    <div key={day} onClick={() => !isSun && !past && setSelDate(ds)}
                      className="min-h-[80px] p-1.5 border-b border-cs-line border-r border-r-[rgba(26,31,43,0.024)] transition-colors"
                      style={{ background: selDate === ds ? "rgba(196,151,103,0.03)" : "transparent", opacity: past ? 0.3 : 1, cursor: isSun || past ? "default" : "pointer" }}>
                      <div className="font-body text-xs font-semibold w-[22px] h-[22px] rounded-full flex items-center justify-center mb-1"
                        style={{ color: isToday ? "#C49767" : isSun ? "#403830" : "#D8D0C6", background: isToday ? "rgba(196,151,103,0.08)" : "transparent" }}>{day}</div>
                      {db.map((b, bi) => (
                        <div key={bi} className="font-mono text-[9px] text-cs-gold-dim px-[5px] py-[2px] mb-[2px] rounded-sm"
                          style={{ background: "rgba(196,151,103,0.07)", borderLeft: "2px solid rgba(196,151,103,0.3)" }}>
                          {b.hour}:00 {SESSION_TYPES.find((s) => s.id === b.type)?.icon}
                        </div>
                      ))}
                      {isSun && <span className="font-mono text-[8px] text-cs-dim">OFF</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* WEEK VIEW */}
          {view === "week" && (
            <div className="bg-cs-card border border-cs-line rounded-sm overflow-x-auto">
              <div className="grid min-w-[700px]" style={{ gridTemplateColumns: "50px repeat(7, 1fr)" }}>
                <div className="border-b border-cs-line border-r border-cs-line" />
                {DAY_N.map((d) => <div key={d} className="py-2.5 px-1 text-center font-mono text-[9px] text-cs-dim border-b border-cs-line border-r border-r-[rgba(26,31,43,0.024)]">{d}</div>)}
                {slots.map((hour) => (
                  <div key={hour} className="contents">
                    <div className="py-1.5 px-1 text-right font-mono text-[9px] text-cs-dim border-b border-cs-line border-r border-cs-line">{hour}:00</div>
                    {Array.from({ length: 7 }, (_, di) => {
                      const day = 1 + di, ds = `${yr}-${String(mo + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`, bk = isBooked(ds, hour);
                      return (
                        <div key={`${hour}-${di}`} onClick={() => !bk && di < 6 && clickSlot(day, hour)}
                          className="min-h-[32px] border-b border-cs-line border-r border-r-[rgba(26,31,43,0.024)] transition-colors"
                          style={{ background: bk ? "rgba(139,48,48,0.06)" : "transparent", cursor: bk || di === 6 ? "default" : "pointer" }}
                          onMouseEnter={(e) => { if (!bk && di < 6) e.currentTarget.style.background = "rgba(196,151,103,0.03)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = bk ? "rgba(139,48,48,0.06)" : "transparent"; }}>
                          {bk && <div className="font-mono text-[8px] text-cs-red p-1">ZAJĘTE</div>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Day slots */}
          {selDate && step === 0 && (
            <RevealDiv className="mt-5">
              <div className="bg-cs-card border border-cs-line rounded-sm p-6">
                <h3 className="font-display text-base text-cs-white uppercase mb-3.5">
                  <span className="font-mono text-[10px] text-cs-gold-dim mr-2">DOSTĘPNE →</span>{selDate}
                </h3>
                <div className="flex gap-1.5 flex-wrap">
                  {slots.map((h) => {
                    const bk = isBooked(selDate, h);
                    return <button key={h} onClick={() => !bk && clickSlot(parseInt(selDate.split("-")[2]), h)} disabled={bk}
                      className="font-mono text-[11px] transition-all px-4 py-2.5"
                      style={{ background: bk ? "rgba(139,48,48,0.03)" : "#050810", border: `1px solid ${bk ? "rgba(139,48,48,0.12)" : "#1A1F2B"}`, color: bk ? "#8B3030" : "#D8D0C6", opacity: bk ? 0.4 : 1, cursor: bk ? "not-allowed" : "pointer" }}>{h}:00</button>;
                  })}
                </div>
              </div>
            </RevealDiv>
          )}

          {/* Booking form */}
          {step === 1 && (
            <RevealDiv className="mt-5">
              <div className="bg-cs-card border border-[rgba(144,113,79,0.12)] rounded-sm p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(196,151,103,0.25), transparent)" }} />
                <div className="font-mono text-[10px] text-cs-gold-dim tracking-[0.2em] mb-1.5">// NOWA REZERWACJA</div>
                <h3 className="font-display text-[22px] text-cs-white uppercase mb-1">Rezerwacja Sesji</h3>
                <div className="font-body text-sm text-cs-muted mb-7">{selDate} · {selSlot}:00</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="font-mono text-[9px] text-cs-dim tracking-[0.15em] mb-1.5 block">TYP SESJI</label><select className={`${inputCls} cursor-pointer`} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{SESSION_TYPES.map((t) => <option key={t.id} value={t.id}>{t.icon} {t.name}</option>)}</select></div>
                  <div><label className="font-mono text-[9px] text-cs-dim tracking-[0.15em] mb-1.5 block">CZAS</label><select className={`${inputCls} cursor-pointer`} value={form.duration} onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}>{DURATIONS.map((d) => <option key={d.hours} value={d.hours}>{d.label}</option>)}</select></div>
                  <div><label className="font-mono text-[9px] text-cs-dim tracking-[0.15em] mb-1.5 block">IMIĘ *</label><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="—" /></div>
                  <div><label className="font-mono text-[9px] text-cs-dim tracking-[0.15em] mb-1.5 block">EMAIL *</label><input className={inputCls} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="—" /></div>
                  <div><label className="font-mono text-[9px] text-cs-dim tracking-[0.15em] mb-1.5 block">TELEFON *</label><input className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="—" /></div>
                  <div><label className="font-mono text-[9px] text-cs-dim tracking-[0.15em] mb-1.5 block">UWAGI</label><input className={inputCls} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="opcjonalnie" /></div>
                </div>
                {error && <div className="font-mono text-[11px] text-cs-red mt-3">{error}</div>}
                <div className="flex gap-3 mt-7">
                  <GlowBtn onClick={book} disabled={submitting}>{submitting ? "Wysyłanie..." : "Potwierdź"}</GlowBtn>
                  <GlowBtn ghost onClick={() => { setStep(0); setSelSlot(null); }}>Anuluj</GlowBtn>
                </div>
              </div>
            </RevealDiv>
          )}
        </>}
      </Sect>
    </div>
  );
}
