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
import { Doto } from "@/components/Doto";

const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

export function CalendarGrid() {
  const currentYear = useCalendarStore((s) => s.currentYear);
  const currentMonth = useCalendarStore((s) => s.currentMonth);
  const selectDate = useCalendarStore((s) => s.selectDate);
  const selectedDate = useCalendarStore((s) => s.selectedDate);
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
      const previews = dateTodos.slice(0, 3).map((t) => ({
        title: t.title,
        done: completionSet.has(`${t.id}:${dateStr}`),
        color: t.categoryId ? catColorMap.get(t.categoryId) : undefined,
      }));
      const moreCount = Math.max(0, dateTodos.length - 3);
      return { dateStr, date, rate, dotColors, previews, totalCount: dateTodos.length, completedCount, moreCount };
    });
  }, [days, todos, completions, categories, getTodosForDate]);

  // Monthly stats
  const monthStats = useMemo(() => {
    let totalTodos = 0;
    let totalCompleted = 0;
    cellData.forEach((cell) => {
      if (cell.date.getMonth() === currentMonth) {
        totalTodos += cell.totalCount;
        totalCompleted += cell.completedCount;
      }
    });
    const rate = totalTodos === 0 ? 0 : Math.round((totalCompleted / totalTodos) * 100);
    return { totalTodos, totalCompleted, rate };
  }, [cellData, currentMonth]);

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

  const handleLogout = async () => { const supabase = createClient(); await supabase.auth.signOut(); window.location.reload(); };

  return (
    <div className="h-full flex flex-col">
      {/* Header — Pink energy bar */}
      <div className="gum-header flex items-center justify-between px-4 lg:px-6 py-3">
        <div className="flex items-center gap-3">
          <Doto mood="wave" size={32} className="hidden lg:block" />
          <h1 className="text-[24px] lg:text-[28px] font-black tracking-tight">{monthLabel}</h1>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={prevMonth} className="gum-btn w-9 h-9 text-lg ">‹</button>
          <button onClick={nextMonth} className="gum-btn w-9 h-9 text-lg ">›</button>
          <ThemeToggle />
          <button onClick={handleLogout} className="gum-btn w-9 h-9 text-xs " aria-label="로그아웃">⏻</button>
        </div>
      </div>

      {/* Weekday labels — colored row */}
      <div className="grid grid-cols-7 gum-weekday-row border-b-2 border-border-subtle">
        {WEEKDAYS.map((dow) => (
          <div
            key={dow}
            className={`text-center text-[12px] font-black py-2.5 uppercase border-r-2 border-border-subtle last:border-r-0 ${
              dow === 0 ? "gum-weekday-sun" : dow === 6 ? "gum-weekday-sat" : ""
            }`}
          >
            {getWeekdayLabel(dow)}
          </div>
        ))}
      </div>

      {/* Grid — fills remaining space */}
      <div ref={gridRef} className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <motion.div
          className="flex-1 flex flex-col min-h-0"
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
              <div key={weekIdx} className="relative flex-1 min-h-0 overflow-hidden">
                <div className="grid grid-cols-7 h-full">
                {weekDays.map((cell, colIdx) => {
                  const isCurrentMonth = cell.date.getMonth() === currentMonth;
                  const today = isToday(cell.date);
                  const isSelected = cell.dateStr === selectedDate;
                  const allDone = cell.rate === 1;
                  const hasTodos = cell.totalCount > 0;

                  return (
                    <motion.button
                      key={`${cell.dateStr}-${weekIdx * 7 + colIdx}`}
                      layoutId={`day-${cell.dateStr}`}
                      onClick={() => selectDate(cell.dateStr)}
                      className={`
                        relative flex flex-col items-start pt-1.5 px-1 min-h-[56px] lg:min-h-0 h-full
                        border-r-2 border-b-2 border-border-subtle last:border-r-0 transition-colors text-left
                        ${isCurrentMonth ? "" : "opacity-20"}
                        ${isSelected ? "bg-accent/20 ring-2 ring-inset ring-accent" : ""}
                        ${!isSelected && allDone && hasTodos ? "gum-cell-all-done" : ""}
                        ${!isSelected && !allDone && hasTodos ? "gum-cell-has-todos" : ""}
                        ${!isSelected && !today ? "hover:bg-bg-elevated" : ""}
                      `}
                      whileTap={{ scale: 0.97 }}
                    >
                      {/* Date number row */}
                      <div className="flex items-center gap-1 w-full">
                        <div className="relative flex items-center justify-center">
                          {today ? (
                            <span className="w-7 h-7 rounded-full bg-accent text-black flex items-center justify-center text-[13px] font-black" style={{ animation: "today-pulse 2s ease-in-out 3" }}>
                              {cell.date.getDate()}
                            </span>
                          ) : (
                            <span className={`text-[13px] font-bold w-7 h-7 flex items-center justify-center ${isSelected ? "text-accent" : colIdx === 0 ? "text-cat-red" : colIdx === 6 ? "text-cat-blue" : ""}`}>
                              {cell.date.getDate()}
                            </span>
                          )}
                          {cell.rate >= 0 && <CompletionRing rate={cell.rate} color={cell.dotColors[0] || "#FF90E8"} size={26} />}
                        </div>
                        {/* Category dots — compact */}
                        {cell.dotColors.length > 0 && (
                          <div className="flex gap-[2px]">
                            {cell.dotColors.map((color) => (
                              <span key={color} className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: color }} />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Todo previews — desktop only */}
                      <div className="hidden lg:flex flex-col gap-[1px] mt-0.5 w-full overflow-hidden flex-1">
                        {cell.previews.map((p, i) => (
                          <div
                            key={i}
                            className={`gum-cell-preview ${p.done ? "gum-cell-preview-done" : ""}`}
                            style={p.color ? { borderLeft: `2px solid ${p.color}`, paddingLeft: 3 } : undefined}
                          >
                            {p.title}
                          </div>
                        ))}
                        {cell.moreCount > 0 && (
                          <span className="text-[8px] font-black text-accent">+{cell.moreCount}</span>
                        )}
                      </div>
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

      {/* Monthly Stats Bar */}
      <div className="gum-stats-bar">
        <span className="text-text-secondary text-[11px]">이번 달</span>
        <span className="gum-stat-pill">
          <span style={{ color: "var(--color-accent)" }}>●</span>
          할 일 {monthStats.totalTodos}
        </span>
        <span className="gum-stat-pill">
          <span style={{ color: "var(--color-success)" }}>✓</span>
          완료 {monthStats.totalCompleted}
        </span>
        {monthStats.totalTodos > 0 && (
          <span className={`gum-stat-pill ${monthStats.rate === 100 ? "!bg-accent/20 !border-accent" : ""}`}>
            {monthStats.rate}%
          </span>
        )}
        <div className="flex-1" />
        <Doto mood={monthStats.rate === 100 ? "celebrate" : monthStats.rate >= 50 ? "wave" : "think"} size={28} />
      </div>
    </div>
  );
}
