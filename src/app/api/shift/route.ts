const SHIFTS = ["Morning", "Night", "Off", "Off"] as const;
type Shift = (typeof SHIFTS)[number];
const BASE_DATE = new Date("2026-01-31"); // Base date = 31 Jan 2026

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");
  const startDateParam = searchParams.get("startDate");

  if (!dateParam) {
    return Response.json(
      { error: "date query param is required (YYYY-MM-DD)" },
      { status: 400 },
    );
  }

  const inputDate = new Date(dateParam);
  // Default base date: Jan 31, 2026
  const baseDate = startDateParam ? new Date(startDateParam) : new Date("2026-01-31");

  if (isNaN(inputDate.getTime())) {
    return Response.json({ error: "Invalid check date format" }, { status: 400 });
  }

  if (isNaN(baseDate.getTime())) {
     return Response.json({ error: "Invalid start date format" }, { status: 400 });
  }

  const diffTime = inputDate.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // modulo → array index
  const index = ((diffDays % SHIFTS.length) + SHIFTS.length) % SHIFTS.length;

  const shift: Shift = SHIFTS[index];

  return Response.json({
    date: dateParam,
    baseDate: startDateParam || "2026-01-31",
    shift,
    index,
  });
}
