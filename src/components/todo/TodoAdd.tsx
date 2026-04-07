"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalendarStore } from "@/stores/calendarStore";
import { springs } from "@/lib/springs";

interface TodoAddProps {
  date: string;
}

export function TodoAdd({ date }: TodoAddProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const { addTodo, categories } = useCalendarStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories[0]?.id || null
  );

  const handleSubmit = () => {
    if (!title.trim()) return;

    addTodo({
      id: crypto.randomUUID(),
      categoryId: selectedCategoryId,
      title: title.trim(),
      startDate: date,
      endDate: null,
      isRoutine: false,
      routineDays: null,
      routineEndDate: null,
      sortOrder: Date.now(),
    });

    setTitle("");
    setIsAdding(false);
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
                  if (e.key === "Escape") setIsAdding(false);
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

              <div className="flex gap-2">
                <motion.button
                  onClick={handleSubmit}
                  className="flex-1 py-2.5 rounded-full bg-cat-cyan text-bg-primary text-sm font-semibold"
                  whileTap={{ scale: 0.97 }}
                >
                  추가
                </motion.button>
                <motion.button
                  onClick={() => setIsAdding(false)}
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
