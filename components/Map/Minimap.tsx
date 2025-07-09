import "leaflet/dist/leaflet.css";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import type { MinimapProps } from "@/types";

// Set up default marker icons
const brownIcon = new L.Icon({
  iconUrl: "/icons/marker-icon-orange.png",
  iconRetinaUrl: "/icons/marker-icon-2x-orange.png",
  shadowUrl: "/icons/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: "/icons/marker-icon-red.png",
  iconRetinaUrl: "/icons/marker-icon-2x-red.png",
  shadowUrl: "/icons/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MinimapOverlay = ({ userLocation, shop, directionLine, onClose }: MinimapProps) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(4px)",
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: 500,
          height: 350,
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 0 12px rgba(255,255,255,0.25)",
        }}
      >
        <MapContainer
          center={directionLine && userLocation ? 
            [userLocation.lat, userLocation.lng] : [shop.lat, shop.lng]}
          zoom={directionLine && userLocation ? 13 : 15}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {(directionLine && userLocation) &&
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={brownIcon}
            >
              <Popup>You are here</Popup>
            </Marker>
          }

          <Marker 
            position={[shop.lat, shop.lng]} 
            icon={directionLine && userLocation ? redIcon : brownIcon}
          >
            <Popup>{shop.title}</Popup>
          </Marker>

          {directionLine && (
            <Polyline
              positions={directionLine}
              pathOptions={{ color: "#804a26", weight: 9 }}
            />
          )}
        </MapContainer>

        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1400,
            bgcolor: "rgba(0,0,0,0.35)",
            color: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.65)",
            },
            backdropFilter: "blur(2px)",
            width: 36,
            height: 36,
          }}
        >
          <CloseIcon fontSize="small"/>
        </IconButton>
      </Box>
    </Box>
  );
};

export default MinimapOverlay;
