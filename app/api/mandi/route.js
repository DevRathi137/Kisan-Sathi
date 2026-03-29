export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const state     = searchParams.get("state")     || "Madhya Pradesh";
  const commodity = searchParams.get("commodity") || "";
  const limit     = searchParams.get("limit")     || "50";

  const key = process.env.DATAGOV_API_KEY;
  if (!key) return Response.json({ error: "API key not configured" }, { status: 500 });

  try {
    const params = new URLSearchParams({
      "api-key": key,
      format: "json",
      limit,
      "filters[state.keyword]": state,
    });
    if (commodity) params.set("filters[commodity]", commodity);

    const res = await fetch(
      `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?${params}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return Response.json({ error: "Mandi data unavailable" }, { status: res.status });

    const data = await res.json();
    return Response.json({ records: data.records || [], total: data.total || 0 });
  } catch {
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
