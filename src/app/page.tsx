"use client";

import { useState } from "react";

type ApiResponse = {
  date: string;
  shift: string;
  index: number;
  error?: string;
};

export default function Home() {
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const checkShift = async () => {
    if (!date) return;

    setLoading(true);
    setResult(null);

    const query = new URLSearchParams({ date });
    if (startDate) {
      query.append("startDate", startDate);
    }

    const res = await fetch(`/api/shift?${query.toString()}`);
    const data: ApiResponse = await res.json();

    setResult(data);
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
        
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Shift Checker
          </h1>
          <p className="text-slate-500 mb-8 text-sm">
            Select a date to check your shift
          </p>

          <div className="w-full space-y-4">
             <div className="text-left w-full space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Start Date (Optional)</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-center placeholder-slate-400"
              />
            </div>
            
            <div className="text-left w-full space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Check Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-center"
              />
            </div>

            <button
              onClick={checkShift}
              disabled={loading || !date}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white shadow-md shadow-blue-500/10 transition-all ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:transform active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking...
                </span>
              ) : (
                "Check Shift"
              )}
            </button>
          </div>

          {result && (
            <div className={`mt-8 w-full p-5 rounded-xl border ${
              result.error 
                ? "bg-red-50 border-red-100 text-red-700"
                : "bg-blue-50 border-blue-100 text-blue-900"
            }`}>
              {!result.error && (
                 <div className="flex flex-col gap-1 items-center">
                   <span className="text-xs text-blue-500 font-bold uppercase tracking-wide">
                     {result.date}
                   </span>
                   <span className="text-xl font-bold">
                     {result.shift}
                   </span>
                 </div>
              )}
              
              {result.error && (
                <p className="font-medium text-sm flex items-center justify-center gap-2">
                  <span>⚠️</span> {result.error}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
