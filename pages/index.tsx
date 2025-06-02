import { useEffect, useState, useRef } from "react";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import dynamic from "next/dynamic";

import type { Coordinates, Shop, ShopDetail } from "@/types";

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
    <Box sx={{display: {xs: "none", md: "flex"}}} justifyContent="center" alignItems="center">
      <CircularProgress />
    </Box>
  ),
});

const Home = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);

  const [selectedShop, setSelectedShop] = useState<ShopDetail | null>(null);
  const [showShopDetail, setShowShopDetail] = useState(false);

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

  const getShopDetail = async (shop: Shop) => {
    try {
      const res = await fetch(`/api/detail?placeId=${shop.placeId}`);
      const { data } = await res.json();
      console.log("shop detail: ", data);
      
      if (data) {
        setSelectedShop(data);
        setShowShopDetail(true);
      }
    } catch (err) {
      console.error("Failed to get shop detail:", err);
    }
    return null;
  }

  // Get user location by device  
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = {lat: -0.4772294, lng: 117.1306983 }; // For development
        setLocation(userLocation);
        
        // Get address as in city/street/etc
        const addressString = await getAddress(-0.4772294, 117.1306983);
        setAddress(addressString.fullAddress);

        // If success find user location, find coffe shop nearby
        const res = await fetch(`/api/nearby?lat=${-0.4772294}&lng=${117.1306983}&shortAddress=${addressString.shortAddress}`);
        const data = await res.json();
      
        setShops(data.results || []);
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    )
  }, [])

  const mapRef = useRef<HTMLDivElement>(null);
  const [mapHeight, setMapHeight] = useState("100%");

  const isTablet = useMediaQuery("(max-width: 900px)");

  useEffect(() => {
    const updateMapHeight = () => {
      if (!isTablet || !mapRef.current) return;

      const topOffset = mapRef.current.getBoundingClientRect().top;
      
      setMapHeight(`calc(100vh - ${topOffset}px)`);
    };

    updateMapHeight(); // Initial run

    window.addEventListener("resize", updateMapHeight);
    return () => window.removeEventListener("resize", updateMapHeight);
  }, [isTablet]);

  return (
    <Grid 
      container 
      spacing={isTablet ? 2 : 1} 
      flexDirection={isTablet ? "column-reverse" : "row"}
      style={{ 
        width: "100%", 
        height: isTablet ? "100%" : "calc(100vh - 64px)" 
      }}
    >
      <Grid 
        ref={mapRef}
        size={{ xs: 12, md: 8 }}
        style={{ 
          height: isTablet ? mapHeight : "100%" 
        }}
      >
        <Map 
          userLocation={location} 
          shops={shops} 
          onSelectShop={(shop: Shop) => getShopDetail(shop)}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Box display="flex" flexDirection="column">
          <ActionForm address={address} />

          {(showShopDetail && selectedShop) && 
            <ShopDetail 
              shop={selectedShop}
              showShopDetail={showShopDetail}
              onCloseShopDetail={() => setShowShopDetail(false)}  
            />
          }
        </Box>
      </Grid>
    </Grid>
  )
}

export default Home;  