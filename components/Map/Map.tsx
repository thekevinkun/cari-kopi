"use client"

import { useEffect, useState, useRef, useMemo } from "react";
import { useMediaQuery } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { createShopMarkerIcon } from "@/components/ShopMarker/ShopMarker";

import type { Coordinates, MapProps, Shop } from "@/types";

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

const CaptureMapInstance = ({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) => {
  const map = useMap();

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = map;
    }
  }, [map]);

  return null;
};

const Map = ({ userLocation, locationBackTo, shops, tempShops, onSelectShop, 
  targetShop, suppressMarkers, directionLine, destinationShop }: MapProps) => {
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

  // Render regular shops (no re-render on tempShop change)
  const shopMarkers = useMemo(() => {
    return !suppressMarkers && showMarker 
      ? shops.map((shop: Shop, index) => (
          <Marker
            key={shop.placeId}
            position={[shop.geometry.location.lat, shop.geometry.location.lng]}
            icon={markerIcon[index]}
            eventHandlers={{
              click: () => onSelectShop(shop),
            }}
          />
      ))
    : null;
  }, [shops, suppressMarkers, showMarker, isMobile])

  // Render temp shops (just one or few, appear instantly)
  const tempShopMarkers = useMemo(() => {
    return !suppressMarkers && showMarker
      ? tempShops.map((shop) => (
          <Marker
            key={"temp-" + shop.placeId}
            position={[shop.geometry.location.lat, shop.geometry.location.lng]}
            icon={createShopMarkerIcon(shop, isMobile, 0)}
            eventHandlers={{ click: () => onSelectShop(shop) }}
          />
        ))
      : null;
  }, [tempShops, suppressMarkers, showMarker, isMobile]);

  const destinationShopMarker = useMemo(() => {
    return destinationShop
      ? <Marker
          key={"destination-" + destinationShop.placeId}
          position={[
            destinationShop.geometry.location.lat,
            destinationShop.geometry.location.lng,
          ]}
          icon={createShopMarkerIcon(destinationShop, isMobile, 0)}
        />
      : null;
  }, [destinationShop, isMobile]);

  const mapRef = useRef<L.Map | null>(null);
  const hasFlownToTarget = useRef<string | null>(null);

  // reset hasFlownToTarget
  useEffect(() => {
    if (!targetShop) {
      hasFlownToTarget.current = null;
    }
  }, [targetShop]);

  // Handle flyTo user back to location
  useEffect(() => {
    if (locationBackTo && mapRef.current) {
      mapRef.current.flyTo([locationBackTo.lat, locationBackTo.lng], 15, {
        duration: 1,
      });
    }
  }, [locationBackTo]);

  // Handle flyTo when targetShop is set
  useEffect(() => {
    if (targetShop && mapRef.current) {
      if (hasFlownToTarget.current === targetShop.placeId) return;

      hasFlownToTarget.current = targetShop.placeId;
      
      mapRef.current.flyTo([targetShop.lat, targetShop.lng], 17, {
        duration: 9,
      });
    }
  }, [targetShop]);
  
  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <MapReady />

      <CaptureMapInstance mapRef={mapRef}/>
      
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && (
        <>
          {/* Show user marker if location available */}
          <Marker position={[userLocation.lat, userLocation.lng]} icon={brownIcon}>
            <Popup>You are here</Popup>
          </Marker>

          {/* Jump to location after find it */}
          <MapFlyTo userLocation={userLocation} onFlyEnd={() => setShowMarker(true)}/>
        </>
      )}

      {!directionLine &&
        <>
          {shopMarkers}
          {tempShopMarkers}
        </>
      }

      {directionLine && 
        <>
          {destinationShopMarker}
        </>
      }

      {directionLine && (
        <Polyline 
          positions={directionLine} 
          pathOptions={{ color: "#804a26", weight: 9 }} 
        />
      )}
    </MapContainer>
  )
}

export default Map;