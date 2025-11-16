'use client'
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useState } from "react";
import markerImg from "../../../public/criar-ocorrencias/marker.png";

export default function MapaModal({ onSelect }) {
  const [posicao, setPosicao] = useState(null);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
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
    const res = await fetch(`/api/geocode?lat=${lat}&lon=${lng}`);
    if (!res.ok) {
      console.error("Erro ao buscar endereço");
      return;
    }

    const data = await res.json();
    const address = data.address;

    onSelect({
      latitude: String(lat),
      longitude: String(lng),
      cep: address.postcode || "",
      logradouro: address.road || "",
      numero: address.house_number || "",
      bairro: address.suburb || address.neighbourhood || "",
      cidade: address.city || address.town || address.village || "",
      estado: address.state || "",
    });
  }

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <MapContainer
        center={[-15.78, -47.93]}
        zoom={4}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
      </MapContainer>
    </div>
  );
}
