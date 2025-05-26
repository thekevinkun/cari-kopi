"use client"

import ReactDOMServer from "react-dom/server";
import { useMediaQuery } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { getStarsSVG } from "@/utils/helpers";
import type { Map, Shop } from "@/types";

function createCustomIcon(shop: Shop, isMobile: boolean) {
  const html = ReactDOMServer.renderToString(
    <div 
      title={shop.name}
      style={{
        background: "white",
        padding: isMobile ? "8px" : "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: isMobile ? 82 : 100,
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        borderRadius: "8px",
        lineHeight: "1.2",
      }}
    >
      <strong 
        style={{ 
          marginTop: isMobile ? 4 : 10,
          marginBottom: isMobile ? 10 : 15,
          fontSize: isMobile ? "0.55rem" : "0.685rem",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: "2",
          WebkitBoxOrient: "vertical"
        }}
      >
        {shop.name}
      </strong>

      <img
        src={shop.thumbnail || "/no-coffee-image.jpg"}
        alt={shop.name}
        style={{
          width: "100%",
          height: isMobile ? 54 : 72,
          objectFit: "cover",
          marginBottom: isMobile ? 7 : 10,
        }}
      />

      <span dangerouslySetInnerHTML={{ __html: getStarsSVG(shop.rating, isMobile) }}></span>
    </div>
  );

  return L.divIcon({
    html,
    className: "", // remove default leaflet styles
    iconAnchor: [60, 90], // position anchor (optional, tweak as needed)
  });
}

// Set up default marker icons
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const Map = ({ userLocation, shops }: Map) => {
  // Default map center if user location is unavailable (e.g. global view)
  const defaultCenter: [number, number] = [20, 0]; // Near the equator

  const mapCenter: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : defaultCenter;
  
  const isMobile = useMediaQuery("(max-width: 600px)");

  const mapZoom = userLocation ? (isMobile ? 16 : 15) : 5;

  const handleClickShop = (shop: Shop) => {
    console.log("Clicked shop:", shop.placeId);
    // Do something like opening a modal or focusing the map, etc.
  };

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
          position={[
            shop.geometry.location.lat,
            shop.geometry.location.lng,
          ]}
          icon={createCustomIcon(shop, isMobile)}
          eventHandlers={{
            click: () => handleClickShop(shop),
          }}
        />
      ))}
    </MapContainer>
  )
}

export default Map;