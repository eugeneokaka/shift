import { getShiftForDate, formatDate } from "@/lib/shift-utils";

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
  const baseDate = startDateParam
    ? new Date(startDateParam)
    : new Date("2026-01-31");

  if (isNaN(inputDate.getTime())) {
    return Response.json({ error: "Invalid check date format" }, { status: 400 });
  }

  if (isNaN(baseDate.getTime())) {
    return Response.json({ error: "Invalid start date format" }, { status: 400 });
  }

  const shift = getShiftForDate(inputDate, baseDate);

  return Response.json({
    date: dateParam,
    baseDate: startDateParam || "2026-01-31",
    shift,
  });
}
