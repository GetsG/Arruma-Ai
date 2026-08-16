'use client'
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useState, useEffect } from "react";
import markerImg from "../../../public/criar-ocorrencias/marker.png";

const GOIANIA_CENTER = [-16.6869, -49.2648];
const GOIANIA_ZOOM = 12;

// GeoJSON usa [lon, lat], Leaflet usa [lat, lon]
function geojsonParaLeaflet(coords) {
  return coords.map(([lon, lat]) => [lat, lon]);
}

// Ray casting — verifica se ponto está dentro do polígono
function pontoNoPoligono(lat, lng, poligono) {
  let dentro = false;
  const n = poligono.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const [latI, lngI] = poligono[i];
    const [latJ, lngJ] = poligono[j];
    if (
      (lngI > lng) !== (lngJ > lng) &&
      lat < ((latJ - latI) * (lng - lngI)) / (lngJ - lngI) + latI
    ) {
      dentro = !dentro;
    }
  }
  return dentro;
}

export default function MapaModal({ onSelect }) {
  const [posicao, setPosicao] = useState(null);
  const [erroFora, setErroFora] = useState(false);
  const [poligonos, setPoligonos] = useState([]);

  useEffect(() => {
    fetch(
      "https://nominatim.openstreetmap.org/search?q=Goiânia,Goiás,Brasil&format=json&polygon_geojson=1&limit=1",
      { headers: { "User-Agent": "ArrumaAi-TCC-Front" } }
    )
      .then((res) => res.json())
      .then((data) => {
        const geojson = data[0]?.geojson;
        if (!geojson) return;

        if (geojson.type === "Polygon") {
          setPoligonos([geojsonParaLeaflet(geojson.coordinates[0])]);
        } else if (geojson.type === "MultiPolygon") {
          setPoligonos(
            geojson.coordinates.map((poly) => geojsonParaLeaflet(poly[0]))
          );
        }
      })
      .catch((err) => console.error("Erro ao carregar polígono de Goiânia:", err));
  }, []);

  function dentroDeGoiania(lat, lng) {
    if (poligonos.length === 0) return true; // enquanto carrega, permite clicar
    return poligonos.some((p) => pontoNoPoligono(lat, lng, p));
  }

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;

        if (!dentroDeGoiania(lat, lng)) {
          setErroFora(true);
          return;
        }

        setErroFora(false);
        setPosicao([lat, lng]);
        buscarEndereco(lat, lng);
      },
    });

    return posicao ? (
      <Marker
        position={posicao}
        icon={L.icon({ iconUrl: markerImg.src, iconSize: [30, 30] })}
      />
    ) : null;
  }

  async function buscarEndereco(lat, lng) {
    try {
      const res = await fetch(`/api/geocode?lat=${lat}&lon=${lng}`);
      if (!res.ok) return;

      const data = await res.json();
      const address = data.address || {};

      onSelect({
        latitude: String(lat),
        longitude: String(lng),
        logradouro: address.road || "",
      });
    } catch (err) {
      console.error("Erro ao buscar endereço:", err);
    }
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {erroFora && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#ef4444",
            color: "#fff",
            padding: "8px 20px",
            borderRadius: "8px",
            zIndex: 1000,
            fontWeight: "bold",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          Marque apenas dentro de Goiânia
        </div>
      )}

      <MapContainer
        center={GOIANIA_CENTER}
        zoom={GOIANIA_ZOOM}
        minZoom={10}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {poligonos.map((poly, i) => (
          <Polygon
            key={i}
            positions={poly}
            pathOptions={{
              color: "#2563eb",
              weight: 2,
              fillOpacity: 0,
              dashArray: "8 6",
            }}
          />
        ))}

        <LocationMarker />
      </MapContainer>
    </div>
  );
}
