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
    if (!title.trim()) return;
    if (isRoutine && routineDays.length === 0) return;
    setError(null);
    try {
      await addTodo({
        categoryId: selectedCategoryId, title: title.trim(), startDate: date,
        endDate: !isRoutine && endDate ? endDate : null, isRoutine,
        routineDays: isRoutine ? routineDays : null, routineEndDate: null,
        sortOrder: Math.floor(Date.now() / 1000) % 1000000,
      });
      resetForm();
    } catch (err) { setError(err instanceof Error ? err.message : "추가 실패"); }
  };

  const toggleDay = (dow: number) => {
    setRoutineDays((prev) => prev.includes(dow) ? prev.filter((d) => d !== dow) : [...prev, dow]);
  };

  return (
    <div className="mt-4">
      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div key="form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ type: "spring", ...springs.reorder }} className="overflow-hidden">
            <div className="bg-bg-secondary rounded-[var(--radius-md)] p-4 border-2 border-border-subtle">
              <input
                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") resetForm(); }}
                placeholder="할 일을 입력하세요" autoFocus
                className="w-full bg-bg-primary text-[15px] text-text-primary placeholder:text-text-tertiary outline-none mb-3 px-3 py-2.5 rounded-[var(--radius-md)] border-2 border-border-subtle focus:border-accent transition-colors"
              />

              <div className="flex gap-2 mb-3 overflow-x-auto">
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => setSelectedCategoryId(cat.id)}
                    className="text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap transition-all"
                    style={{
                      backgroundColor: selectedCategoryId === cat.id ? `${cat.color}30` : "transparent",
                      color: cat.color,
                      border: selectedCategoryId === cat.id ? `2px solid ${cat.color}` : "2px solid transparent",
                    }}
                  >{cat.name}</button>
                ))}
              </div>

              <div className="flex gap-2 mb-3">
                {[
                  { label: "단일", active: !isRoutine && !endDate, onClick: () => { setIsRoutine(false); setEndDate(""); } },
                  { label: "기간", active: !isRoutine && !!endDate, onClick: () => { setIsRoutine(false); setEndDate(date); } },
                  { label: "루틴", active: isRoutine, onClick: () => { setIsRoutine(true); setEndDate(""); } },
                ].map(({ label, active, onClick }) => (
                  <button key={label} onClick={onClick}
                    className={`text-[11px] font-bold px-3 py-1 rounded-full transition-all border-2 ${active ? "bg-accent/15 text-accent border-accent" : "text-text-secondary border-border-subtle"}`}
                  >{label}</button>
                ))}
              </div>

              {!isRoutine && endDate && (
                <div className="mb-3">
                  <label className="text-[11px] text-text-secondary font-semibold block mb-1">종료일</label>
                  <input type="date" value={endDate} min={date} onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-bg-primary text-sm text-text-primary rounded-[var(--radius-md)] px-3 py-2 border-2 border-border-subtle outline-none focus:border-accent transition-colors" />
                </div>
              )}

              {isRoutine && (
                <div className="mb-3">
                  <label className="text-[11px] text-text-secondary font-semibold block mb-1.5">반복 요일</label>
                  <div className="flex gap-1.5">
                    {WEEKDAYS.map((dow) => (
                      <button key={dow} onClick={() => toggleDay(dow)}
                        className={`w-8 h-8 rounded-full text-[11px] font-bold transition-all border-2 ${routineDays.includes(dow) ? "bg-accent text-black border-accent" : "text-text-secondary border-border-subtle"}`}
                      >{getWeekdayLabel(dow)}</button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <motion.button onClick={handleSubmit}
                  className="flex-1 py-2.5 rounded-full bg-accent text-black text-sm font-bold disabled:opacity-40 hover:bg-accent-hover transition-colors"
                  whileTap={{ scale: 0.97 }} disabled={!title.trim() || (isRoutine && routineDays.length === 0)}
                >추가</motion.button>
                <motion.button onClick={resetForm}
                  className="px-4 py-2.5 rounded-full bg-bg-primary text-text-secondary text-sm font-bold border-2 border-border-subtle"
                  whileTap={{ scale: 0.97 }}
                >취소</motion.button>
              </div>
              {error && <p className="text-error text-xs mt-2 font-medium">{error}</p>}
            </div>
          </motion.div>
        ) : (
          <motion.button key="button" onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 py-3 text-text-tertiary text-[15px] font-medium hover:text-accent transition-colors w-full"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <span className="w-6 h-6 rounded-[var(--radius-sm)] border-[2.5px] border-dashed border-text-tertiary flex items-center justify-center text-sm font-bold">+</span>
            <span>할 일 추가</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
