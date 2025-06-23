import { useEffect, useState, useRef } from "react";
import polyline from "@mapbox/polyline";
import dynamic from "next/dynamic";
import { Box, Grid, useMediaQuery } from "@mui/material";

import { CenteredLoader } from "@/components";

import type { LatLngExpression } from "leaflet";
import type { Coordinates, NearbyData, Shop, SerpShopDetail, TargetShop  } from "@/types";
import { getLocationPermissionInstructions } from "@/utils/helpers";

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

const DirectionInfo = dynamic(() => import("@/components/DirectionInfo/DirectionInfo"), {
  ssr: false,
  loading: () => <CenteredLoader height="50%" sx={{ display: { xs: "none", md: "flex" }}}/>,
});

const Home = () => {
  const triedInitialLocation = useRef(false);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "fetching" | "success" | "failed">("idle");

  const [address, setAddress] = useState<string | null>(null);
  const [shortAddress, setShortAddress] = useState<string | null>(null);
  
  const [nearbyData, setNearbyData] = useState<NearbyData | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [tempShops, setTempShops] = useState<Shop[]>([]);
  const [targetShop, setTargetShop] = useState<TargetShop | null>(null);

  const [showShopDetail, setShowShopDetail] = useState(false);
  const [selectedShop, setSelectedShop] = useState<SerpShopDetail | null>(null);
  const [favorites, setFavorites] = useState<SerpShopDetail[] | null>(null);
  
  const [directionLine, setDirectionLine] = useState<LatLngExpression[] | null>(null);
  const [directionInfo, setDirectionInfo] = useState<{
    driving?: { duration: string; distance: string };
    walking?: { duration: string; distance: string };
    transit?: { duration: string; distance: string };
    bicycling?: { duration: string; distance: string };
  }>({});
  const [directionSteps, setDirectionSteps] = useState<
    Array<{
      instruction: string;
      duration: string | null;
      distance: string | null;
      maneuver: string | null;
    }>
  >([]);
  const [destinationShop, setDestinationShop] = useState<Shop | null>(null);

  const [loadingNextPage, setLoadingNextPage] = useState(false);

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

  const getDirections = async (shop: SerpShopDetail) => {
    if (!location) return;

    const lat = shop.gps_coordinates.latitude;
    const lng = shop.gps_coordinates.longitude;

    const originStr = `${location.lat},${location.lng}`;
    const destStr = `${lat},${lng}`;
    
    const res = await fetch(`/api/directions?origin=${originStr}&destination=${destStr}`);
    const { polyline: encodedPolyline, modes, steps  }: {
      polyline: string | null;
      modes: Array<{
        mode: "driving" | "walking" | "transit" | "bicycling";
        duration: string;
        distance: string;
      }>;
      steps: Array<{
        instruction: string;
        duration: string | null;
        distance: string | null;
        maneuver: string | null;
      }>;
    } = await res.json();

    if (!encodedPolyline) {
      console.warn("No polyline available for driving route");
      return;
    }
    
     // Decode polyline into LatLng array
    const decoded = polyline.decode(encodedPolyline);
    const latLngs = decoded.map(([lat, lng]) => [lat, lng]) as LatLngExpression[]

    setDirectionLine(latLngs);

    // Convert the array of modes into a keyed object
    const modeMap: {
      [key in "driving" | "walking" | "transit" | "bicycling"]?: {
        duration: string;
        distance: string;
      };
    } = {};

    modes.forEach(({ mode, duration, distance }) => {
      if (duration && distance) {
        modeMap[mode] = { duration, distance };
      }
    });

    setDirectionInfo(modeMap);

    setDirectionSteps(steps); 

    setDestinationShop({
      placeId: shop.place_id,
      name: shop.title,
      address: shop.address,
      rating: shop.rating,
      thumbnail: shop.images ? shop.images[0].serpapi_thumbnail : "/no-coffee-image.jpg",
      geometry: {
        location: { lat, lng },
      }
    });
  }

  const handleStopDirections = () => {
    setDirectionLine(null);
    setDirectionInfo({});
    setDirectionSteps([]);
    setDestinationShop(null);
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
      setTempShops([]);
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
      setTempShops([]);
    }

    setLoadingNextPage(false);
  }

  const handleViewOnMap = (shop: SerpShopDetail) => {
    const placeId = shop.place_id;
    const lat = shop.gps_coordinates.latitude;
    const lng = shop.gps_coordinates.longitude;

    // Convert SerpShopDetail to Shop and store in temp if not already present
    const converted: Shop = {
      placeId: placeId,
      name: shop.title,
      rating: shop.rating,
      thumbnail: shop.images ? shop.images[0].serpapi_thumbnail : "/no-coffee-image.jpg",
      geometry: {
        location: { lat, lng },
      }
    }

    // Fly to the shop
    setTargetShop({ placeId, lat, lng });
    
    setTimeout(() => {
      setTempShops(prev => {
        const exists = prev.some(s => s.placeId === shop.place_id) || shops.some(s => s.placeId === shop.place_id);
        return exists ? prev : [...prev, converted];
      });
    }, 9500);
  }

  const handleSelectSearchResult = async (placeId: string) => {
    const res = await fetch(`/api/detailSerp?placeId=${placeId}`);
    const { data } = await res.json();
    
    if (!res.ok) {
      console.error("Failed to get shop detail: ", data.error);
      return;
    }

    const lat = data.gps_coordinates.latitude;  
    const lng = data.gps_coordinates.longitude;

    const converted: Shop = {
      placeId: data.place_id,
      name: data.title,
      rating: data.rating,
      thumbnail: data.images ? data.images[0].serpapi_thumbnail : "/no-coffee-image.jpg",
      geometry: {
        location: { 
          lat: lat, 
          lng: lng },
      }
    };

    if (directionLine || directionInfo || destinationShop) {
      handleStopDirections();

      setTimeout(() => {
        setTargetShop({ placeId, lat, lng });  
      }, 5000);
    } else {
      setTargetShop({ placeId, lat, lng });
    }

    setTimeout(() => {
      setTempShops(prev => {
        const exists = prev.some(s => s.placeId === data.place_id) || shops.some(s => s.placeId === data.place_id);
        return exists ? prev : [...prev, converted];
      });
    }, 9500);
  };

  const tryGetLocation = async (): Promise<GeolocationPosition | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn("Geolocation is not supported");
        return resolve(null);
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => {
          console.error("Geolocation error:", error);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const handleLocationSuccess = async (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    const userLocation = { lat: -0.4772294, lng: 117.1306983 };
    setLocation(userLocation);

    const addressData = await getAddress(-0.4772294, 117.1306983);
    if (!addressData) return;

    setAddress(addressData.fullAddress);
    setShortAddress(addressData.shortAddress);

    const data = await getNearbyCoffee(-0.4772294, 117.1306983, addressData.shortAddress);
    if (data) {
      setNearbyData(data);
      setShops(data.results || []);
    }
  };

  const onFindLocationClick = async () => {
    setLocationStatus("fetching");
    const pos = await tryGetLocation();

    if (pos) {
      await handleLocationSuccess(pos);
      setLocationStatus("success");
    } else {
      alert(getLocationPermissionInstructions() + 
        "\n\nRefresh the page after changing permission.");
      setLocationStatus("failed");
    }
  };

  useEffect(() => {
    // Avoid re-trigerring after came from /greeting
    if (triedInitialLocation.current) return;
    triedInitialLocation.current = true;

    // Delay slightly if just came from /greeting
    const fromGreeting = localStorage.getItem("fromGreeting") === "true";
    const delay = fromGreeting ? 800 : 0;

    setTimeout(async () => {
      setLocationStatus("fetching");
      const pos = await tryGetLocation();
      if (pos) {
        await handleLocationSuccess(pos);
        setLocationStatus("success");
      } else {
        setLocationStatus("failed");
      }

      if (fromGreeting) {
        localStorage.removeItem("fromGreeting");
      }
    }, delay);
  }, []);

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

  // hide jump scrollbar only on /
  useEffect(() => {
    document.body.style.overflow = "hidden"; 
    
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  
  return (
    <Grid 
      container 
      spacing={isTablet? 0 : 1} 
      flexDirection={isTablet ? "column-reverse" : "row"}
      style={{ 
        width: "100%", 
        height: isTablet ? "100%" : mapHeight,
        overflow: "hidden"
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
          tempShops={tempShops}
          onSelectShop={(shop: Shop) => getShopDetail(shop.placeId)}
          targetShop={targetShop}
          directionLine={directionLine}
          destinationShop={destinationShop}
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
            locationStatus={locationStatus}
            onRequestLocation={onFindLocationClick}
            isLoadNextPage={loadingNextPage}
            onNextPage={handleNextPage}
            onShowLessPage={handleShowLessPage}
            onSelectSearchResult={handleSelectSearchResult}
          />

          { directionLine && directionInfo && directionSteps && destinationShop ?
            <DirectionInfo 
              originAddress={address ?? "Your location"}
              destinationAddress={destinationShop?.address ?? "Shop location"}
              directionInfo={directionInfo}
              directionSteps={directionSteps}
              onCloseDirections={handleStopDirections}
            />
          : showShopDetail && selectedShop ? 
            <ShopDetail 
              shop={selectedShop}
              showShopDetail={showShopDetail}
              onCloseShopDetail={() => setShowShopDetail(false)}  
              onFavoriteUpdate={refreshFavorites}
              onStartDirections={(shop: SerpShopDetail) => getDirections(shop)}
            />
          : locationStatus === "success" && favorites &&
            <FavoritesShop 
              favorites={favorites}
              onSelectShop={(shop: SerpShopDetail) => getShopDetail(shop.place_id)}
              onFavoriteUpdate={refreshFavorites}
              onViewOnMap={handleViewOnMap}
            />
          }
        </Box>
      </Grid>
    </Grid>
  )
}

export default Home;  