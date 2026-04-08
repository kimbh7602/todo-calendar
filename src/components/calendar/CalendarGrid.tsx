"use client";

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { useCalendarStore } from "@/stores/calendarStore";
import { getMonthDays, formatDate, isToday, getWeekdayLabel } from "@/lib/date";
import { springs } from "@/lib/springs";
import { createClient } from "@/lib/supabase";
import { CompletionRing } from "./CompletionRing";
import { MultiDayBar, OverflowIndicator } from "./MultiDayBar";
import { splitByWeek, assignSlots, getOverflowCounts } from "@/lib/multiday";
import { ThemeToggle } from "@/components/ThemeToggle";

const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

export function CalendarGrid() {
  const currentYear = useCalendarStore((s) => s.currentYear);
  const currentMonth = useCalendarStore((s) => s.currentMonth);
  const selectDate = useCalendarStore((s) => s.selectDate);
  const todos = useCalendarStore((s) => s.todos);
  const completions = useCalendarStore((s) => s.completions);
  const categories = useCalendarStore((s) => s.categories);
  const prevMonth = useCalendarStore((s) => s.prevMonth);
  const nextMonth = useCalendarStore((s) => s.nextMonth);

  const days = useMemo(() => getMonthDays(currentYear, currentMonth), [currentYear, currentMonth]);
  const monthLabel = `${currentYear}년 ${currentMonth + 1}월`;

  const [swipeDirection, setSwipeDirection] = useState(0);
  const controls = useAnimation();

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) { setSwipeDirection(-1); prevMonth(); }
    else if (info.offset.x < -threshold) { setSwipeDirection(1); nextMonth(); }
    controls.start({ x: 0, opacity: 1 });
  }, [prevMonth, nextMonth, controls]);

  useEffect(() => { setSwipeDirection(0); }, [currentYear, currentMonth]);

  const getTodosForDate = useCalendarStore((s) => s.getTodosForDate);

  const cellData = useMemo(() => {
    const completionSet = new Set(completions.map((c) => `${c.todoId}:${c.completedDate}`));
    const catColorMap = new Map(categories.map((c) => [c.id, c.color]));
    return days.map((date) => {
      const dateStr = formatDate(date);
      const dateTodos = getTodosForDate(dateStr);
      const completedCount = dateTodos.filter((t) => completionSet.has(`${t.id}:${dateStr}`)).length;
      const rate = dateTodos.length === 0 ? -1 : completedCount / dateTodos.length;
      const dotColors = [...new Set(dateTodos.map((t) => t.categoryId ? catColorMap.get(t.categoryId) : undefined).filter(Boolean))].slice(0, 3) as string[];
      return { dateStr, date, rate, dotColors };
    });
  }, [days, todos, completions, categories, getTodosForDate]);

  const multiDaySegments = useMemo(() => {
    const multiDayTodos = todos.filter((t) => t.endDate && !t.isRoutine);
    const allSegments = multiDayTodos.flatMap((todo) => {
      const cat = categories.find((c) => c.id === todo.categoryId);
      return splitByWeek(todo, currentYear, currentMonth).map((seg) => ({ ...seg, color: cat?.color }));
    });
    return assignSlots(allSegments);
  }, [todos, categories, currentYear, currentMonth]);

  const overflowCounts = useMemo(() => getOverflowCounts(multiDaySegments), [multiDaySegments]);

  const gridRef = useRef<HTMLDivElement>(null);
  const [cellWidth, setCellWidth] = useState(0);

  useEffect(() => {
    const measure = () => { if (gridRef.current) setCellWidth(gridRef.current.offsetWidth / 7); };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const numWeeks = Math.ceil(days.length / 7);

  return (
    <div className="h-full flex flex-col px-4 lg:px-6 pt-6 lg:pt-4 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[28px] lg:text-[32px] font-extrabold tracking-tight">{monthLabel}</h1>
        <div className="flex gap-1.5 items-center">
          <NavButton onClick={prevMonth}>‹</NavButton>
          <NavButton onClick={nextMonth}>›</NavButton>
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((dow) => (
          <div key={dow} className="text-center text-[12px] font-semibold text-text-tertiary py-1 uppercase">
            {getWeekdayLabel(dow)}
          </div>
        ))}
      </div>

      <motion.div
        ref={gridRef}
        className="flex-1"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        key={`${currentYear}-${currentMonth}`}
        initial={{ x: swipeDirection * 100, opacity: 0.5 }}
        transition={{ type: "spring", ...springs.navigate }}
      >
        {Array.from({ length: numWeeks }, (_, weekIdx) => {
          const weekSegments = multiDaySegments.filter((s) => s.row === weekIdx);
          const weekDays = cellData.slice(weekIdx * 7, weekIdx * 7 + 7);

          return (
            <div key={weekIdx} className="relative">
              <div className="grid grid-cols-7">
                {weekDays.map((cell, colIdx) => {
                  const isCurrentMonth = cell.date.getMonth() === currentMonth;
                  const today = isToday(cell.date);

                  return (
                    <motion.button
                      key={`${cell.dateStr}-${weekIdx * 7 + colIdx}`}
                      layoutId={`day-${cell.dateStr}`}
                      onClick={() => selectDate(cell.dateStr)}
                      className={`relative flex flex-col items-center pt-2 min-h-[60px] lg:min-h-0 lg:aspect-square border border-transparent transition-colors ${isCurrentMonth ? "" : "opacity-25"} ${today ? "" : "hover:bg-bg-secondary"}`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        {today ? (
                          <span className="w-8 h-8 rounded-full bg-accent text-black flex items-center justify-center text-[14px] font-bold" style={{ animation: "today-pulse 2s ease-in-out 3" }}>
                            {cell.date.getDate()}
                          </span>
                        ) : (
                          <span className="text-[14px] font-semibold">{cell.date.getDate()}</span>
                        )}
                        {cell.rate >= 0 && <CompletionRing rate={cell.rate} color={cell.dotColors[0] || "#FF90E8"} />}
                      </div>
                      {cell.dotColors.length > 0 && (
                        <div className="flex gap-[3px] mt-1">
                          {cell.dotColors.map((color) => (
                            <span key={color} className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: color }} />
                          ))}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {cellWidth > 0 && weekSegments.filter((s) => s.slot !== -1).map((seg) => (
                <MultiDayBar key={`bar-${seg.todo.id}-${seg.row}`} segment={seg} cellWidth={cellWidth} onTap={selectDate} />
              ))}
              {cellWidth > 0 && Array.from(overflowCounts.entries())
                .filter(([key]) => key.startsWith(`${weekIdx}-`))
                .map(([key, count]) => {
                  const col = parseInt(key.split("-")[1]);
                  const cellDate = weekDays[col]?.dateStr;
                  if (!cellDate) return null;
                  return <OverflowIndicator key={key} count={count} row={weekIdx} col={col} cellWidth={cellWidth} onTap={selectDate} date={cellDate} />;
                })}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

function NavButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button onClick={onClick} className="w-9 h-9 rounded-full border-2 border-border-subtle bg-bg-primary flex items-center justify-center text-text-primary text-lg font-bold" whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.05 }}>
      {children}
    </motion.button>
  );
}

function LogoutButton() {
  const handleLogout = async () => { const supabase = createClient(); await supabase.auth.signOut(); window.location.reload(); };
  return (
    <motion.button onClick={handleLogout} className="w-9 h-9 rounded-full border-2 border-border-subtle bg-bg-primary flex items-center justify-center text-text-tertiary text-xs font-bold" whileTap={{ scale: 0.85 }} aria-label="로그아웃">
      ⏻
    </motion.button>
  );
}
