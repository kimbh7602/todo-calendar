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
    <div className="mt-3">
      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div key="form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ type: "spring", ...springs.reorder }} className="overflow-hidden">
            <div className="gum-card p-4 mt-2">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") resetForm(); }} placeholder="할 일을 입력하세요" autoFocus className="gum-input mb-3" />

              <div className="flex gap-2 mb-3 overflow-x-auto">
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => setSelectedCategoryId(cat.id)}
                    className="text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap border-2 transition-all"
                    style={{ backgroundColor: selectedCategoryId === cat.id ? `${cat.color}25` : "transparent", color: cat.color, borderColor: selectedCategoryId === cat.id ? cat.color : "transparent" }}>
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mb-3">
                {[
                  { label: "단일", active: !isRoutine && !endDate, onClick: () => { setIsRoutine(false); setEndDate(""); } },
                  { label: "기간", active: !isRoutine && !!endDate, onClick: () => { setIsRoutine(false); setEndDate(date); } },
                  { label: "루틴", active: isRoutine, onClick: () => { setIsRoutine(true); setEndDate(""); } },
                ].map(({ label, active, onClick }) => (
                  <button key={label} onClick={onClick} className={`text-[11px] font-bold px-3 py-1 rounded-full border-2 transition-all ${active ? "bg-accent/20 text-accent border-accent" : "text-text-secondary border-border-subtle"}`}>
                    {label}
                  </button>
                ))}
              </div>

              {!isRoutine && endDate && (
                <div className="mb-3">
                  <label className="text-[11px] text-text-secondary font-bold block mb-1">종료일</label>
                  <input type="date" value={endDate} min={date} onChange={(e) => setEndDate(e.target.value)} className="gum-input text-sm" />
                </div>
              )}

              {isRoutine && (
                <div className="mb-3">
                  <label className="text-[11px] text-text-secondary font-bold block mb-1.5">반복 요일</label>
                  <div className="flex gap-1.5">
                    {WEEKDAYS.map((dow) => (
                      <button key={dow} onClick={() => setRoutineDays((prev) => prev.includes(dow) ? prev.filter((d) => d !== dow) : [...prev, dow])}
                        className={`w-8 h-8 rounded-full text-[11px] font-bold border-2 transition-all ${routineDays.includes(dow) ? "bg-accent text-black border-accent" : "text-text-secondary border-border-subtle"}`}>
                        {getWeekdayLabel(dow)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button onClick={handleSubmit} disabled={!title.trim() || (isRoutine && routineDays.length === 0)} className="gum-btn-pink flex-1 py-2.5 text-sm disabled:opacity-40">추가</button>
                <button onClick={resetForm} className="gum-btn px-4 py-2.5 text-sm">취소</button>
              </div>
              {error && <p className="text-error text-xs mt-2 font-bold">{error}</p>}
            </div>
          </motion.div>
        ) : (
          <motion.button key="button" onClick={() => setIsAdding(true)} className="flex items-center gap-2 py-3 text-text-tertiary text-[14px] font-bold hover:text-accent transition-colors w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="w-6 h-6 rounded-[var(--radius-sm)] border-[2.5px] border-dashed border-text-tertiary flex items-center justify-center text-sm font-black">+</span>
            <span>할 일 추가</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
