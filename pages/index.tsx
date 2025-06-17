import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Box, Grid, useMediaQuery } from "@mui/material";

import { CenteredLoader } from "@/components";

import type { Coordinates, NearbyData, Shop, SerpShopDetail  } from "@/types";

const Map = dynamic(() => import('@/components/Map/Map'), {
  ssr: false,
  loading: () => <CenteredLoader sx={{ height: { xs: "100%", md: "calc(100vh - 64px)" }}}/>,
});

const ExplorePanel = dynamic(() => import("@/components/ExplorePanel/ExplorePanel"), {
  ssr: false,
  loading: () => <CenteredLoader height="120px"/>,
});

const FavoritesShop = dynamic(() => import("@/components/FavoritesShop/FavoritesShop"), {
  ssr: false,
  loading: () => <CenteredLoader height="50%" sx={{ display: { xs: "none", md: "flex" }}}/>,
});

const ShopDetail = dynamic(() => import("@/components/ShopDetail/ShopDetail"), {
  ssr: false,
  loading: () => <CenteredLoader height="50%" sx={{ display: { xs: "none", md: "flex" }}}/>,
});

const Home = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [shortAddress, setShortAddress] = useState<string | null>(null);
  const [nearbyData, setNearbyData] = useState<NearbyData | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [favorites, setFavorites] = useState<SerpShopDetail[] | null>(null);
  const [selectedShop, setSelectedShop] = useState<SerpShopDetail | null>(null);
  const [showShopDetail, setShowShopDetail] = useState(false);
  const [shouldAsk, setShouldAsk] = useState(false);
  const [loadingNextPage, setLoadingNextPage] = useState(false);
  const triedInitialLocation = useRef(false);

  const getAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to get address: ", data.error);
        return;
      }

      return data;
    } catch (err) {
      console.error("Failed to get address:", err);
    }
  };

  const getNearbyCoffee = async (lat: number, lng: number, shortAddress: string, page: number = 1) => {
    try {
      const res = await fetch(`
        /api/nearby?lat=${lat}&lng=${lng}&shortAddress=${shortAddress}&page=${page}`
      );
      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to fetch nearby coffee: ", data.error);
        return;
      }

      return data;
    } catch (error) {
      console.error("Failed to fetch nearby coffe: ", error);
    }
  }

  const handleNextPage = async () => {
    if (!nearbyData || !location || !shortAddress) return;

    const nextPage = nearbyData.page + 1;
    if (nextPage > nearbyData.totalPages) return;

    setLoadingNextPage(true);

    const nextData = await getNearbyCoffee(location.lat, location.lng, shortAddress, nextPage);
    if (nextData) {
      setNearbyData(nextData);
      setShops((prev) => [...prev, ...nextData.results]);
    }

    setLoadingNextPage(false);
  }

  const handleShowLessPage = async () => {
    if (!nearbyData || !location || !shortAddress) return;

    const nextPage = 1;

    setLoadingNextPage(true);

    const nextData = await getNearbyCoffee(location.lat, location.lng, shortAddress, nextPage);
    if (nextData) {
      setNearbyData(nextData);
      setShops(nextData.results);
    }

    setLoadingNextPage(false);
  }

  const getShopDetail = async (placeId: string) => {
    try {
      const res = await fetch(`/api/detailSerp?placeId=${placeId}`);
      const { data } = await res.json();
      
      if (!res.ok) {
        console.error("Failed to get shop detail: ", data.error);
        return;
      }

      setSelectedShop(data);
      setShowShopDetail(true);
    } catch (err) {
      console.error("Failed to get shop detail:", err);
    }
  }

  const getUserFavorites = async () => {
    try {
      const res = await fetch(`/api/favorites`);
      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to get user favorites list: ", data.error);
        return;
      }

      setFavorites(data.favorites);
    } catch (error) {
      console.error("Failed to get user favorites list", error);
    }
  }

  const refreshFavorites = async () => {
    try {
      const res = await fetch(`/api/favorites`);
      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to refresh user favorites list: ", data.error);
        return;
      }

      setFavorites(data.favorites);
    } catch (error) {
      console.error("Failed to refresh user favorites list", error);
    }
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
        const addressData = await getAddress(-0.4772294, 117.1306983);
        if (!addressData) return;

        setAddress(addressData.fullAddress);
        setShortAddress(addressData.shortAddress)

        // If success find user location, find coffe shop nearby
        const data = await getNearbyCoffee(-0.4772294, 117.1306983, addressData.shortAddress);
        setNearbyData(data);
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

  // Get user favorites
  useEffect(() => {
    getUserFavorites();
  }, []);

  // Calculate map height
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
      spacing={1} 
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
          onSelectShop={(shop: Shop) => getShopDetail(shop.placeId)}
        />
      </Grid>
      
      <Grid size={{ xs: 12, md: 4 }}>
        <Box display="flex" flexDirection="column" sx={{ height: "100%"}}>
          <ExplorePanel 
            address={address} 
            currentResults={shops?.length ?? null}
            totalResults={nearbyData?.totalResults ?? null}
            currentPage={nearbyData?.page ?? null}
            totalPages={nearbyData?.totalPages ?? null}
            shouldAsk={shouldAsk} 
            onRequestLocation={tryGetLocation} 
            isLoadNextPage={loadingNextPage}
            onNextPage={handleNextPage}
            onShowLessPage={handleShowLessPage}
          />

          {showShopDetail && selectedShop ? 
            <ShopDetail 
              shop={selectedShop}
              showShopDetail={showShopDetail}
              onCloseShopDetail={() => setShowShopDetail(false)}  
              onFavoriteUpdate={refreshFavorites}
            />
          : favorites &&
            <FavoritesShop 
              favorites={favorites}
              onSelectShop={(shop: SerpShopDetail) => getShopDetail(shop.place_id)}
            />
          }
        </Box>
      </Grid>
    </Grid>
  )
}

export default Home;  