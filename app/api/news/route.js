const REGION_QUERIES = {
  india:   "indian farmers agriculture",
  usa:     "US farmers agriculture crop",
  europe:  "European farmers agriculture",
  brazil:  "Brazil agriculture farming",
  canada:  "Canada farmers agriculture crop",
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") || "india";
  const query = REGION_QUERIES[region] || REGION_QUERIES.india;

  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${process.env.NEWS_API_KEY}&pageSize=4&sortBy=publishedAt&language=en`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return Response.json({ articles: [] }, { status: res.status });
    const data = await res.json();
    return Response.json({ articles: data.articles || [] });
  } catch {
    return Response.json({ articles: [] }, { status: 500 });
  }
}
