"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalendarStore } from "@/stores/calendarStore";
import { springs } from "@/lib/springs";
import { getWeekdayLabel } from "@/lib/date";

interface TodoAddProps { date: string; }
const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

export function TodoAdd({ date }: TodoAddProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const { addTodo, categories } = useCalendarStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || null);
  const [isRoutine, setIsRoutine] = useState(false);
  const [routineDays, setRoutineDays] = useState<number[]>([]);
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => { setTitle(""); setIsRoutine(false); setRoutineDays([]); setEndDate(""); setIsAdding(false); };

  const handleSubmit = async () => {
    if (!title.trim() || (isRoutine && routineDays.length === 0)) return;
    setError(null);
    try {
      await addTodo({ categoryId: selectedCategoryId, title: title.trim(), startDate: date, endDate: !isRoutine && endDate ? endDate : null, isRoutine, routineDays: isRoutine ? routineDays : null, routineEndDate: null, sortOrder: Math.floor(Date.now() / 1000) % 1000000 });
      resetForm();
    } catch (err) { setError(err instanceof Error ? err.message : "추가 실패"); }
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div key="form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ type: "spring", ...springs.reorder }} className="overflow-hidden">
            <div className="bg-bg-elevated border border-border rounded-xl p-4">
              <input
                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") resetForm(); }}
                placeholder="할 일을 입력하세요"
                autoFocus
                className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-text-tertiary"
              />

              <div className="flex gap-1.5 mt-3 overflow-x-auto">
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => setSelectedCategoryId(cat.id)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition-all"
                    style={{
                      backgroundColor: selectedCategoryId === cat.id ? `${cat.color}20` : "transparent",
                      color: selectedCategoryId === cat.id ? cat.color : "var(--color-text-secondary)",
                      border: `1px solid ${selectedCategoryId === cat.id ? cat.color : "var(--color-border)"}`,
                    }}>
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="flex gap-1.5 mt-3">
                {[
                  { label: "단일", active: !isRoutine && !endDate, onClick: () => { setIsRoutine(false); setEndDate(""); } },
                  { label: "기간", active: !isRoutine && !!endDate, onClick: () => { setIsRoutine(false); setEndDate(date); } },
                  { label: "루틴", active: isRoutine, onClick: () => { setIsRoutine(true); setEndDate(""); } },
                ].map(({ label, active, onClick }) => (
                  <button key={label} onClick={onClick} className={`text-[11px] font-medium px-3 py-1 rounded-full border transition-all ${active ? "bg-accent text-white border-accent" : "text-text-secondary border-border"}`}>
                    {label}
                  </button>
                ))}
              </div>

              {!isRoutine && endDate && (
                <div className="mt-3">
                  <label className="text-[11px] text-text-tertiary block mb-1">종료일</label>
                  <input type="date" value={endDate} min={date} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus:border-accent transition-all" />
                </div>
              )}

              {isRoutine && (
                <div className="mt-3">
                  <label className="text-[11px] text-text-tertiary block mb-1.5">반복 요일</label>
                  <div className="flex gap-1">
                    {WEEKDAYS.map((dow) => (
                      <button key={dow} onClick={() => setRoutineDays((prev) => prev.includes(dow) ? prev.filter((d) => d !== dow) : [...prev, dow])}
                        className={`w-8 h-8 rounded-full text-[11px] font-medium transition-all ${routineDays.includes(dow) ? "bg-accent text-white" : "text-text-secondary border border-border"}`}>
                        {getWeekdayLabel(dow)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button onClick={handleSubmit} disabled={!title.trim() || (isRoutine && routineDays.length === 0)} className="flex-1 py-2 bg-accent text-white text-[13px] font-medium rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-40">추가</button>
                <button onClick={resetForm} className="px-4 py-2 text-[13px] text-text-secondary rounded-lg border border-border hover:bg-bg-secondary transition-colors">취소</button>
              </div>
              {error && <p className="text-error text-[12px] mt-2">{error}</p>}
            </div>
          </motion.div>
        ) : (
          <motion.button key="button" onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-2 py-2 text-text-tertiary text-[13px] hover:text-accent transition-colors w-full rounded-lg hover:bg-accent-light" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span>할 일 추가</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
