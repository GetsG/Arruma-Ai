export async function buscarEnderecoPorCEP(cep) {
  const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const dados = await res.json();

  if (dados.erro) return null;

  return {
    cep,
    logradouro: dados.logradouro,
    bairro: dados.bairro,
    cidade: dados.localidade,
    estado: dados.uf,
  };
}

export async function buscarCoordenadasPorEndereco({ logradouro, bairro, cidade, estado }) {
  const query = encodeURIComponent(
    `${logradouro}, ${bairro || ""}, ${cidade} - ${estado}, Brasil`
  );

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`,
    { headers: { "User-Agent": "ArrumaAi-TCC-Front" } }
  );

  const data = await res.json();

  if (Array.isArray(data) && data.length > 0) {
    return { lat: String(data[0].lat), lon: String(data[0].lon) };
  }

  return null;
}
