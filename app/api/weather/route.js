export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "Bhopal";

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`,
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return Response.json({ error: "Weather fetch failed" }, { status: res.status });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
