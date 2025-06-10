"use client"

import { useEffect, useState, useRef, useMemo } from "react";
import { useMediaQuery } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { createShopMarkerIcon } from "@/components/ShopMarker/ShopMarker";

import type { Coordinates, Map, Shop } from "@/types";

// Set up default marker icons
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Re-calculate the layout once the transition is done.
const MapReady = () => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, []);
  return null;
};

// Handles jumping to user's location
const MapFlyTo = ({ userLocation, onFlyEnd }: { userLocation: Coordinates | null, onFlyEnd: () => void }) => {
  const map = useMap();
  const hasFlownRef = useRef(false);

  useEffect(() => {
    if (userLocation && !hasFlownRef.current) {
      hasFlownRef.current = true; // Prevent future runs
      map.flyTo([userLocation.lat, userLocation.lng], 15);

      const handleMoveEnd = () => {
        onFlyEnd();
        map.off("moveend", handleMoveEnd);
      }

      map.on("moveend", handleMoveEnd);
    }
  }, [userLocation, map, onFlyEnd]);

  return null; // This component doesn't render anything visually
};

const Map = ({ userLocation, shops, onSelectShop }: Map) => {
  // Default map center if user location is unavailable (e.g. global view)
  const defaultCenter: [number, number] = [20, 0]; // Near the equator

  const mapCenter: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : defaultCenter;
  
  const isMobile = useMediaQuery("(max-width: 600px)");

  const mapZoom = userLocation ? 15 : 2;

  const [showMarker, setShowMarker] = useState(false);

  const markerIcon = useMemo(() => {
    return shops.map((shop: Shop, index) => 
      createShopMarkerIcon(shop, isMobile, index * 0.15)
    )
  }, [shops, isMobile])

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <MapReady />
      
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && (
        <>
          {/* Show user marker if location available */}
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>You are here</Popup>
          </Marker>
          {/* Jump to location after find it */}
          <MapFlyTo userLocation={userLocation} onFlyEnd={() => setShowMarker(true)}/>
        </>
      )}

      {/* Show coffee shop markers */}
      {showMarker &&
        shops.map((shop: Shop, index) => (
        <Marker
          key={shop.placeId}
          position={[shop.geometry.location.lat, shop.geometry.location.lng]}
          icon={markerIcon[index]}
          eventHandlers={{
            click: () => onSelectShop(shop),
          }}
        />
      ))}
    </MapContainer>
  )
}

export default Map;