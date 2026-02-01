"use client";

import { useState, useMemo } from "react";
import { getMonthWeeks, type Shift } from "@/lib/shift-utils";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Home() {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [startDate, setStartDate] = useState("2026-01-31");

  const weeks = useMemo(() => {
    const baseDate = new Date(startDate);
    return getMonthWeeks(selectedYear, selectedMonth, baseDate);
  }, [selectedYear, selectedMonth, startDate]);

  const getShiftColor = (shift: Shift) => {
    switch (shift) {
      case "Morning":
        return "bg-amber-100 border-amber-300 text-amber-900";
      case "Night":
        return "bg-indigo-100 border-indigo-300 text-indigo-900";
      case "Off":
        return "bg-slate-100 border-slate-300 text-slate-600";
      default:
        return "bg-gray-100 border-gray-300 text-gray-600";
    }
  };

  const getShiftIcon = (shift: Shift) => {
    switch (shift) {
      case "Morning":
        return "☀️";
      case "Night":
        return "🌙";
      case "Off":
        return "🏖️";
      default:
        return "";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl shadow-slate-200/50 border border-slate-100 p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                Shift Calendar
              </h1>
              <p className="text-slate-500 text-xs md:text-sm">
                View your shift schedule for any month
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {/* Base Date Input */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Base Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                />
              </div>

              {/* Month and Year Selectors */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Month
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                  >
                    {MONTHS.map((month, index) => (
                      <option key={month} value={index}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                  >
                    {Array.from({ length: 10 }, (_, i) => now.getFullYear() - 2 + i).map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl shadow-slate-200/50 border border-slate-100 p-3 md:p-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-3 md:mb-4">
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider py-1 md:py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="space-y-1 md:space-y-2">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1 md:gap-2">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`
                      aspect-square rounded-md md:rounded-lg border-2 transition-all
                      ${
                        day
                          ? `${getShiftColor(day.shift)} active:scale-95 md:hover:scale-105 cursor-pointer shadow-sm`
                          : "bg-transparent border-transparent"
                      }
                    `}
                  >
                    {day && (
                      <div className="h-full w-full flex flex-col items-center justify-center gap-0.5 md:gap-1 p-1.5 md:p-2">
                        <div className="text-sm md:text-lg font-bold leading-none">
                          {day.date.getDate()}
                        </div>
                        <div className="text-lg md:text-2xl leading-none">
                          {getShiftIcon(day.shift)}
                        </div>
                        <div className="text-[9px] md:text-xs font-semibold leading-none text-center">
                          {day.shift}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-200">
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-md md:rounded-lg bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-sm md:text-base">
                  ☀️
                </div>
                <span className="text-xs md:text-sm font-medium text-slate-700">Morning</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-md md:rounded-lg bg-indigo-100 border-2 border-indigo-300 flex items-center justify-center text-sm md:text-base">
                  🌙
                </div>
                <span className="text-xs md:text-sm font-medium text-slate-700">Night</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-md md:rounded-lg bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-sm md:text-base">
                  🏖️
                </div>
                <span className="text-xs md:text-sm font-medium text-slate-700">Off</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
