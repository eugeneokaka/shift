const SHIFTS = ["Morning", "Night", "Off", "Off"] as const;
type Shift = (typeof SHIFTS)[number];
const BASE_DATE = new Date("2026-01-31"); // Base date = 31 Jan 2026

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");

  if (!dateParam) {
    return Response.json(
      { error: "date query param is required (YYYY-MM-DD)" },
      { status: 400 },
    );
  }

  const inputDate = new Date(dateParam);

  if (isNaN(inputDate.getTime())) {
    return Response.json({ error: "Invalid date format" }, { status: 400 });
  }

  const diffTime = inputDate.getTime() - BASE_DATE.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // modulo → array index
  const index = ((diffDays % SHIFTS.length) + SHIFTS.length) % SHIFTS.length;

  const shift: Shift = SHIFTS[index];

  return Response.json({
    date: dateParam,
    shift,
    index,
  });
}
