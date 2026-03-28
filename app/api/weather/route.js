export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat  = searchParams.get("lat");
  const lon  = searchParams.get("lon");
  const city = searchParams.get("city") || "Bhopal";

  const query = lat && lon
    ? `lat=${lat}&lon=${lon}`
    : `q=${encodeURIComponent(city)}`;

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`,
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return Response.json({ error: "Weather fetch failed" }, { status: res.status });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
