"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalendarStore } from "@/stores/calendarStore";
import { springs } from "@/lib/springs";
import { getWeekdayLabel } from "@/lib/date";

interface TodoAddProps {
  date: string;
}

const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6]; // Sun..Sat

export function TodoAdd({ date }: TodoAddProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const { addTodo, categories } = useCalendarStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories[0]?.id || null
  );
  const [isRoutine, setIsRoutine] = useState(false);
  const [routineDays, setRoutineDays] = useState<number[]>([]);
  const [endDate, setEndDate] = useState("");

  const resetForm = () => {
    setTitle("");
    setIsRoutine(false);
    setRoutineDays([]);
    setEndDate("");
    setIsAdding(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    if (isRoutine && routineDays.length === 0) return;

    await addTodo({
      categoryId: selectedCategoryId,
      title: title.trim(),
      startDate: date,
      endDate: !isRoutine && endDate ? endDate : null,
      isRoutine,
      routineDays: isRoutine ? routineDays : null,
      routineEndDate: null,
      sortOrder: Date.now(),
    });

    resetForm();
  };

  const toggleDay = (dow: number) => {
    setRoutineDays((prev) =>
      prev.includes(dow) ? prev.filter((d) => d !== dow) : [...prev, dow]
    );
  };

  return (
    <div className="mt-4">
      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", ...springs.reorder }}
            className="overflow-hidden"
          >
            <div className="bg-bg-secondary rounded-lg p-4 border border-border-subtle">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                  if (e.key === "Escape") resetForm();
                }}
                placeholder="할 일을 입력하세요"
                autoFocus
                className="w-full bg-transparent text-base text-text-primary placeholder:text-text-tertiary outline-none mb-3"
              />

              {/* Category selector */}
              <div className="flex gap-2 mb-3 overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className="text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full whitespace-nowrap transition-all"
                    style={{
                      backgroundColor:
                        selectedCategoryId === cat.id
                          ? `${cat.color}40`
                          : `${cat.color}15`,
                      color: cat.color,
                      border:
                        selectedCategoryId === cat.id
                          ? `1px solid ${cat.color}60`
                          : "1px solid transparent",
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Type toggle: 단일/멀티데이/루틴 */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => { setIsRoutine(false); setEndDate(""); }}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-full transition-all ${
                    !isRoutine && !endDate
                      ? "bg-cat-cyan/25 text-cat-cyan border border-cat-cyan/40"
                      : "bg-bg-elevated text-text-secondary border border-transparent"
                  }`}
                >
                  단일
                </button>
                <button
                  onClick={() => { setIsRoutine(false); setEndDate(date); }}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-full transition-all ${
                    !isRoutine && endDate
                      ? "bg-cat-cyan/25 text-cat-cyan border border-cat-cyan/40"
                      : "bg-bg-elevated text-text-secondary border border-transparent"
                  }`}
                >
                  기간
                </button>
                <button
                  onClick={() => { setIsRoutine(true); setEndDate(""); }}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-full transition-all ${
                    isRoutine
                      ? "bg-cat-cyan/25 text-cat-cyan border border-cat-cyan/40"
                      : "bg-bg-elevated text-text-secondary border border-transparent"
                  }`}
                >
                  루틴
                </button>
              </div>

              {/* End date picker (for multi-day) */}
              {!isRoutine && endDate && (
                <div className="mb-3">
                  <label className="text-[11px] text-text-secondary block mb-1">
                    종료일
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={date}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-bg-elevated text-sm text-text-primary rounded-md px-3 py-2 border border-border-subtle outline-none"
                  />
                </div>
              )}

              {/* Routine day selector */}
              {isRoutine && (
                <div className="mb-3">
                  <label className="text-[11px] text-text-secondary block mb-1.5">
                    반복 요일
                  </label>
                  <div className="flex gap-1.5">
                    {WEEKDAYS.map((dow) => (
                      <button
                        key={dow}
                        onClick={() => toggleDay(dow)}
                        className={`w-8 h-8 rounded-full text-[11px] font-semibold transition-all ${
                          routineDays.includes(dow)
                            ? "bg-cat-cyan text-bg-primary"
                            : "bg-bg-elevated text-text-secondary"
                        }`}
                      >
                        {getWeekdayLabel(dow)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <motion.button
                  onClick={handleSubmit}
                  className="flex-1 py-2.5 rounded-full bg-cat-cyan text-bg-primary text-sm font-semibold disabled:opacity-40"
                  whileTap={{ scale: 0.97 }}
                  disabled={!title.trim() || (isRoutine && routineDays.length === 0)}
                >
                  추가
                </motion.button>
                <motion.button
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-full bg-bg-elevated text-text-secondary text-sm font-semibold"
                  whileTap={{ scale: 0.97 }}
                >
                  취소
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 py-3.5 text-text-tertiary text-[15px] hover:text-text-secondary transition-colors w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="w-[22px] h-[22px] rounded-[4px] border-2 border-dashed border-text-tertiary flex items-center justify-center text-sm">
              +
            </span>
            <span>할 일 추가</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
