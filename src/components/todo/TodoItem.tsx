"use client";

import { useRef } from "react";
import { motion, useAnimate } from "framer-motion";
import type { Todo, Category } from "@/types";
import { useCalendarStore } from "@/stores/calendarStore";
import { spawnParticles, spawnConfetti } from "@/lib/particles";
import { playCompletionSound } from "@/lib/sound";
import { springs } from "@/lib/springs";

interface TodoItemProps {
  todo: Todo;
  date: string;
  category?: Category;
  completed?: boolean;
}

export function TodoItem({
  todo,
  date,
  category,
  completed = false,
}: TodoItemProps) {
  const { toggleCompletion, getTodosForDate, isCompleted } =
    useCalendarStore();
  const checkboxRef = useRef<HTMLButtonElement>(null);
  const [scope, animate] = useAnimate();

  const color = category?.color || "#5CC8FF";

  const handleToggle = async () => {
    const wasCompleted = isCompleted(todo.id, date);
    await toggleCompletion(todo.id, date);

    if (!wasCompleted && checkboxRef.current) {
      // Play sound
      playCompletionSound();

      // Animate checkbox bounce
      await animate(
        checkboxRef.current,
        { scale: [1, 1.3, 1] },
        { duration: 0.25, type: "spring", ...springs.check }
      );

      // Spawn particles from checkbox position
      const rect = checkboxRef.current.getBoundingClientRect();
      spawnParticles(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        color
      );

      // Check if all todos for this day are now complete
      const allTodos = getTodosForDate(date);
      const allDone = allTodos.every((t) =>
        t.id === todo.id ? true : isCompleted(t.id, date)
      );
      if (allDone && allTodos.length > 1) {
        setTimeout(spawnConfetti, 300);
      }
    }
  };

  return (
    <div
      ref={scope}
      className={`flex items-center gap-3 py-3.5 border-b border-border-subtle ${
        completed ? "opacity-50" : ""
      }`}
    >
      {/* Checkbox */}
      <motion.button
        ref={checkboxRef}
        onClick={handleToggle}
        className="w-[22px] h-[22px] rounded-[4px] border-2 flex items-center justify-center flex-shrink-0 transition-colors"
        style={{
          borderColor: color,
          backgroundColor: completed ? color : "transparent",
        }}
        whileTap={{ scale: 0.9 }}
      >
        {completed && (
          <span className="text-bg-primary text-[13px] font-bold">✓</span>
        )}
      </motion.button>

      {/* Title */}
      <span
        className={`flex-1 text-base ${
          completed
            ? "text-text-tertiary line-through"
            : "text-text-primary"
        }`}
      >
        {todo.title}
      </span>

      {/* Category Badge */}
      {category && (
        <span
          className="text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${color}26`,
            color,
          }}
        >
          {category.name}
        </span>
      )}
    </div>
  );
}
