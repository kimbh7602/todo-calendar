import { describe, it, expect } from "vitest";
import {
  formatDate,
  parseDate,
  getMonthDays,
  isToday,
  getDaysBetween,
  getWeekdayLabel,
} from "./date";

describe("formatDate", () => {
  it("날짜를 YYYY-MM-DD 형식으로 변환한다", () => {
    expect(formatDate(new Date(2026, 3, 7))).toBe("2026-04-07");
  });

  it("한 자리 월/일에 0을 패딩한다", () => {
    expect(formatDate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("parseDate", () => {
  it("YYYY-MM-DD 문자열을 Date로 변환한다", () => {
    const date = parseDate("2026-04-07");
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(3);
    expect(date.getDate()).toBe(7);
  });
});

describe("getMonthDays", () => {
  it("2026년 4월의 날짜 배열을 반환한다", () => {
    const days = getMonthDays(2026, 3); // April 2026
    expect(days.length).toBeGreaterThanOrEqual(35);
    expect(days.length).toBeLessThanOrEqual(42);
    // First day of April 2026 is Wednesday (dow 3)
    // So we need 3 leading days (Sun, Mon, Tue from March)
    expect(days[3].getDate()).toBe(1);
    expect(days[3].getMonth()).toBe(3);
  });

  it("첫 번째 요소가 일요일이다", () => {
    const days = getMonthDays(2026, 3);
    expect(days[0].getDay()).toBe(0); // Sunday
  });
});

describe("isToday", () => {
  it("오늘이면 true를 반환한다", () => {
    expect(isToday(new Date())).toBe(true);
  });

  it("어제면 false를 반환한다", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isToday(yesterday)).toBe(false);
  });
});

describe("getDaysBetween", () => {
  it("시작일과 종료일 사이의 날짜를 반환한다", () => {
    const days = getDaysBetween("2026-04-03", "2026-04-05");
    expect(days).toEqual(["2026-04-03", "2026-04-04", "2026-04-05"]);
  });

  it("같은 날이면 1개를 반환한다", () => {
    const days = getDaysBetween("2026-04-03", "2026-04-03");
    expect(days).toEqual(["2026-04-03"]);
  });
});

describe("getMonthDays — edge cases", () => {
  it("일요일에 시작하는 달: leading days 0개", () => {
    // 2026년 2월은 일요일 시작
    const days = getMonthDays(2026, 1); // February 2026
    expect(days[0].getDay()).toBe(0); // Sunday
    expect(days[0].getDate()).toBe(1); // Feb 1st (no leading days)
    expect(days[0].getMonth()).toBe(1); // February
  });

  it("6행이 필요한 달 (토요일 시작 + 31일)", () => {
    // 2026년 8월: 토요일 시작, 31일 → 6행 필요
    const days = getMonthDays(2026, 7); // August 2026
    expect(days.length).toBe(42); // 6 rows needed
    // Last day of August should be in the array
    const aug31 = days.find(
      (d) => d.getMonth() === 7 && d.getDate() === 31
    );
    expect(aug31).toBeDefined();
  });

  it("5행으로 충분한 달은 35개로 잘린다", () => {
    // 2026년 2월: 일요일 시작, 28일 → 정확히 4행 (28+7 = 35)
    const days = getMonthDays(2026, 1); // February 2026
    expect(days.length).toBeLessThanOrEqual(42);
    // 6번째 행이 모두 다음 달이면 trim
    if (days.length > 35) {
      const row6 = days.slice(35);
      const allNextMonth = row6.every((d) => d.getMonth() !== 1);
      if (allNextMonth) {
        // should have been trimmed
        expect(days.length).toBe(35);
      }
    }
  });
});

describe("getDaysBetween — edge cases", () => {
  it("월 경계를 넘는 범위", () => {
    const days = getDaysBetween("2026-03-30", "2026-04-02");
    expect(days).toEqual([
      "2026-03-30",
      "2026-03-31",
      "2026-04-01",
      "2026-04-02",
    ]);
  });
});

describe("getWeekdayLabel", () => {
  it("요일 인덱스를 한국어 라벨로 변환한다", () => {
    expect(getWeekdayLabel(0)).toBe("일");
    expect(getWeekdayLabel(1)).toBe("월");
    expect(getWeekdayLabel(6)).toBe("토");
  });
});
