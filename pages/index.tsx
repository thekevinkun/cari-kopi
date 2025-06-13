import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Box, Grid, useMediaQuery } from "@mui/material";

import { CenteredLoader } from "@/components";

import type { Coordinates, Shop, SerpShopDetail } from "@/types";

const Map = dynamic(() => import('@/components/Map/Map'), {
  ssr: false,
  loading: () => <CenteredLoader height="calc(100vh - 64px)"/>,
});

const ActionForm = dynamic(() => import("@/components/ActionForm/ActionForm"), {
  ssr: false,
  loading: () => <CenteredLoader height="120px"/>,
});

const ShopDetail = dynamic(() => import("@/components/ShopDetail/ShopDetail"), {
  ssr: false,
  loading: () => <CenteredLoader height="70%" sx={{ display: { xs: "none", md: "flex" }}}/>,
});

const Home = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);

  const [selectedShop, setSelectedShop] = useState<SerpShopDetail | null>(null);
  const [showShopDetail, setShowShopDetail] = useState(false);

  const [shouldAsk, setShouldAsk] = useState(false);
  const triedInitialLocation = useRef(false);

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
      const res = await fetch(`/api/detailSerp?placeId=${shop.placeId}`);
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

  const tryGetLocation = async () => {
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
        setShouldAsk(true); // Show "Find Location" button on ActionForm if error find loc
      }
    )
  }

  useEffect(() => {
    // Avoid re-trigerring
    if (triedInitialLocation.current) return;
    triedInitialLocation.current = true;

    const fromGreeting = localStorage.getItem("fromGreeting");

    if (fromGreeting === "true") {
      // Delay slightly if just came from /greeting
      setTimeout(() => {
        tryGetLocation();
        localStorage.removeItem("fromGreeting"); // clean up
      }, 800); // adjust this number to match Map fly delay
    } else {
      tryGetLocation(); // regular load
    }
  }, [])

  const mapRef = useRef<HTMLDivElement>(null);
  const [mapHeight, setMapHeight] = useState("100%");

  const isTablet = useMediaQuery("(max-width: 900px)");

  useEffect(() => {
    if (!mapRef.current) return;

    const observer = new ResizeObserver(() => {
      const topOffset = mapRef.current!.getBoundingClientRect().top;
      const height = window.innerHeight - topOffset;

      setMapHeight(`${height}px`);
    });

    const parentElement = mapRef.current?.parentNode as Element | null;

    if (parentElement)
      observer.observe(parentElement)

    // Run once on mount
    const topOffset = mapRef.current!.getBoundingClientRect().top;
    const height = window.innerHeight - topOffset;

    setMapHeight(`${height}px`);

    return () => observer.disconnect();
  }, [isTablet]);

  return (
    <Grid 
      container 
      spacing={isTablet ? 2 : 1} 
      flexDirection={isTablet ? "column-reverse" : "row"}
      style={{ 
        width: "100%", 
        height: isTablet ? "100%" : mapHeight 
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
        <Box display="flex" flexDirection="column" sx={{ height: "100%"}}>
          <ActionForm address={address} shouldAsk={shouldAsk} onRequestLocation={tryGetLocation} />

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