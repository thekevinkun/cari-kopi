import { useEffect, useState } from "react";
import { Box, CircularProgress, Grid } from "@mui/material";
import dynamic from "next/dynamic";

import type { Coordinates, Shop } from "@/types";

const Map = dynamic(() => import('@/components/Map/Map'), {
  ssr: false,
  loading: () => (
    <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 64px)">
      <CircularProgress />
    </Box>
  ),
});

const ActionForm = dynamic(() => import("@/components/ActionForm/ActionForm"), {
  ssr: false,
  loading: () => (
    <Box display="flex" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Box>
  ),
});

const ShopDetail = dynamic(() => import("@/components/ShopDetail/ShopDetail"), {
  ssr: false,
  loading: () => (
    <Box display="flex" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Box>
  ),
});

const Home = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);

  const getAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
      const data = await res.json();

      if (data.fullAddress) {
        return data;
      }
    } catch (err) {
      console.error("Failed to get address:", err);
    }
    return null;
  };

  // Get user location by device  
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = {lat: latitude, lng: longitude };
        setLocation(userLocation);

        // Get address as in city/street/etc
        const addressString = await getAddress(latitude, longitude);
        setAddress(addressString.fullAddress);

        // If success find user location, find coffe shop nearby
        const res = await fetch(`/api/nearby?lat=${latitude}&lng=${longitude}&shortAddress=${addressString.shortAddress}`);
        const data = await res.json();
      
        setShops(data.results || []);
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    )
  }, [])

  return (
    <Grid container spacing={1} style={{ width: "100%", height: "calc(100vh - 64px)" }}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Map userLocation={location} shops={shops} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Box display="flex" flexDirection="column">
          <ActionForm address={address} />
          <ShopDetail />
        </Box>
      </Grid>
    </Grid>
  )
}

export default Home;  