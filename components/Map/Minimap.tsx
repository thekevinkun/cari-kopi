import "leaflet/dist/leaflet.css";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

const MinimapOverlay = ({ shop, onClose }: MinimapProps) => {
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
        top: 0,
        left: 0,
        width: "100vw",
        height: "100svh",
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
          center={[shop.lat, shop.lng]}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='© OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[shop.lat, shop.lng]} icon={brownIcon}>
            <Popup>{shop.title}</Popup>
          </Marker>
        </MapContainer>

        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1400,
            color: "rgba(211,47,47)",
            backgroundColor: "rgba(255,255,255,0.85)",
            "&:hover": { backgroundColor: "white" }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MinimapOverlay;