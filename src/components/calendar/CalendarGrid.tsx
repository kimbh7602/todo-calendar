"use client";

import { motion } from "framer-motion";
import { useCalendarStore } from "@/stores/calendarStore";
import { getMonthDays, formatDate, isToday, getWeekdayLabel } from "@/lib/date";
import { springs } from "@/lib/springs";
import { CompletionRing } from "./CompletionRing";

const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6]; // Sun-Sat

export function CalendarGrid() {
  const {
    currentYear,
    currentMonth,
    selectDate,
    getCompletionRate,
    getTodosForDate,
    categories,
  } = useCalendarStore();

  const days = getMonthDays(currentYear, currentMonth);
  const monthLabel = `${currentYear}년 ${currentMonth + 1}월`;

  return (
    <div className="px-5 pt-16 pb-8">
      {/* Month Header */}
      <CalendarHeader
        label={monthLabel}
        onPrev={useCalendarStore.getState().prevMonth}
        onNext={useCalendarStore.getState().nextMonth}
      />

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-[1px] mb-1">
        {WEEKDAYS.map((dow) => (
          <div
            key={dow}
            className="text-center text-[11px] font-medium text-text-tertiary py-1"
          >
            {getWeekdayLabel(dow)}
          </div>
        ))}
      </div>

      {/* Date Grid */}
      <div className="grid grid-cols-7 gap-[1px]">
        {days.map((date, i) => {
          const dateStr = formatDate(date);
          const isCurrentMonth = date.getMonth() === currentMonth;
          const today = isToday(date);
          const rate = getCompletionRate(dateStr);
          const todos = getTodosForDate(dateStr);

          // Get unique category colors for dots
          const dotColors = [
            ...new Set(
              todos
                .map((t) => {
                  const cat = categories.find((c) => c.id === t.categoryId);
                  return cat?.color;
                })
                .filter(Boolean)
            ),
          ].slice(0, 3) as string[];

          return (
            <motion.button
              key={`${dateStr}-${i}`}
              layoutId={`day-${dateStr}`}
              onClick={() => selectDate(dateStr)}
              className={`
                relative flex flex-col items-center pt-1.5 min-h-[56px] sm:min-h-[80px]
                rounded-[4px] transition-colors
                ${isCurrentMonth ? "" : "opacity-30"}
                hover:bg-bg-elevated
              `}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", ...springs.hover }}
            >
              {/* Today indicator */}
              {today ? (
                <span className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">
                  {date.getDate()}
                </span>
              ) : (
                <span className="w-7 h-7 flex items-center justify-center text-sm font-medium text-text-secondary">
                  {date.getDate()}
                </span>
              )}

              {/* Completion ring */}
              {rate >= 0 && (
                <div className="absolute top-0.5">
                  <CompletionRing
                    rate={rate}
                    color={dotColors[0] || "#5CC8FF"}
                  />
                </div>
              )}

              {/* Category dots */}
              {dotColors.length > 0 && (
                <div className="flex gap-0.5 mt-1">
                  {dotColors.map((color) => (
                    <span
                      key={color}
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function CalendarHeader({
  label,
  onPrev,
  onNext,
}: {
  label: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-xl font-bold tracking-tight">{label}</h1>
      <div className="flex gap-2">
        <motion.button
          onClick={onPrev}
          className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary text-sm"
          whileTap={{ scale: 0.9 }}
        >
          ‹
        </motion.button>
        <motion.button
          onClick={onNext}
          className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary text-sm"
          whileTap={{ scale: 0.9 }}
        >
          ›
        </motion.button>
      </div>
    </div>
  );
}
