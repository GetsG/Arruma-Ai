export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return new Response(
      JSON.stringify({ error: "lat e lon são obrigatórios" }),
      { status: 400 }
    );
  }

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;

  const resposta = await fetch(url, {
    headers: {
      // Nominatim exige User-Agent identificado
      "User-Agent": "ArrumaAiFaculdade/1.0 (seuemail@exemplo.com)",
      "Accept-Language": "pt-BR",
    },
  });

  if (!resposta.ok) {
    return new Response(
      JSON.stringify({ error: "Erro ao consultar Nominatim" }),
      { status: 500 }
    );
  }

  const data = await resposta.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
