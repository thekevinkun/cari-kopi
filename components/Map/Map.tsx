"use client"

import { useMediaQuery } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { createShopMarkerIcon } from "@/components/ShopMarker/ShopMarker";

import type { Map, Shop } from "@/types";

// Set up default marker icons
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const Map = ({ userLocation, shops, onSelectShop }: Map) => {
  // Default map center if user location is unavailable (e.g. global view)
  const defaultCenter: [number, number] = [20, 0]; // Near the equator

  const mapCenter: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : defaultCenter;
  
  const isMobile = useMediaQuery("(max-width: 600px)");

  const mapZoom = userLocation ? (isMobile ? 16 : 15) : 5;

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Show user marker if location available */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {/* Show coffee shop markers */}
      {shops.map((shop: Shop) => (
        <Marker
          key={shop.placeId}
          position={[shop.geometry.location.lat, shop.geometry.location.lng]}
          icon={createShopMarkerIcon(shop, isMobile)}
          eventHandlers={{
            click: () => onSelectShop(shop),
          }}
        />
      ))}
    </MapContainer>
  )
}

export default Map;