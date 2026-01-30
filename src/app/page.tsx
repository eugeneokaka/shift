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
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const checkShift = async () => {
    if (!date) return;

    setLoading(true);
    setResult(null);

    const res = await fetch(`/api/shift?date=${date}`);
    const data: ApiResponse = await res.json();

    setResult(data);
    setLoading(false);
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Shift Checker</h1>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button onClick={checkShift} style={{ marginLeft: "1rem" }}>
        Check
      </button>

      {loading && <p>Checking…</p>}

      {result && !result.error && (
        <p>
          <strong>{result.date}</strong> → {result.shift}
        </p>
      )}

      {result?.error && <p style={{ color: "red" }}>{result.error}</p>}
    </main>
  );
}
