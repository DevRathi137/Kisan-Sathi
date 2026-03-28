export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const lat  = searchParams.get("lat");
  const lon  = searchParams.get("lon");

  const key = process.env.OPENWEATHER_API_KEY;

  try {
    // Build query — prefer coordinates (more accurate) over city name
    const query = lat && lon
      ? `lat=${lat}&lon=${lon}`
      : `q=${encodeURIComponent(city || "Bhopal")}`;

    const [currentRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${key}&units=metric`, { next: { revalidate: 1800 } }),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${key}&units=metric&cnt=40`, { next: { revalidate: 1800 } }),
    ]);

    if (!currentRes.ok) return Response.json({ error: "Location not found" }, { status: 404 });

    const current  = await currentRes.json();
    const forecast = await forecastRes.json();

    return Response.json({ current, forecast });
  } catch {
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
