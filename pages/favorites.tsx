import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useUser } from "@/contexts/UserContext";

import { motion } from "framer-motion";
import {
  Box, Button, Card, CardMedia, CardContent, CardActions, 
  CircularProgress, Grid, Rating, Typography, useMediaQuery
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { ImageWithSkeleton } from "@/components";
import type { MinimapProps, SerpShopDetail } from "@/types";

import { verifyToken } from "@/lib/db/auth";
import { cardVariants } from "@/utils/motion";
import { parseSerpAddress } from "@/utils/helpers";

const ShopDetail = dynamic(() => import("@/components/ShopDetail/ShopDetail"), {
  ssr: false
});

const Minimap = dynamic(() => import("@/components/Map/Minimap"), {
  ssr: false
});

const MotionGrid = motion.create(Grid);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = ctx.req.cookies.token;

  const user = token ? verifyToken(token) : null;

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
}

const FavoritesPage = () => {
  const { user } = useUser();

  const isDesktop = useMediaQuery("(min-width:900px)");

  const [favorites, setFavorites] = useState<SerpShopDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [unsavingId, setUnsavingId] = useState<string | null>(null);
  const [viewedId, setViewedId] = useState<string | null>(null);
  const [showShopDetail, setShowShopDetail] = useState(false);
  const [selectedShop, setSelectedShop] = useState<SerpShopDetail | null>(null);

  const [minimapShop, setMinimapShop] = useState<{ title: string, lat: number, lng: number } | null>(null);

  const firstName = user?.name?.split(" ")[0];

  const handleShowShopDetail = (shop: SerpShopDetail) => {
    if (shop) {
      setSelectedShop(shop);
      setShowShopDetail(true);
    }
  }

  const handleViewOnMap = (shop: SerpShopDetail) => {
    setMinimapShop({
      title: shop.title,
      lat: shop.gps_coordinates.latitude,
      lng: shop.gps_coordinates.longitude
    });
  };

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

  const handleRemoveFavorite = async (placeId: string) => {
    setUnsavingId(placeId);

    try {
      const res = await fetch("/api/favorites/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
      } else {
        setFavorites((prev) => prev.filter((s) => s.place_id !== placeId));
        alert(data.message);
      }

    } catch (error) {
      alert("Failed to remove shop. Try again later.");
      console.error("Failed to remove shop", error);
    } finally {
      setUnsavingId(null);
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      const res = await fetch("/api/favorites");
      const data = await res.json();

      if (res.ok) {
        setFavorites(data.favorites);
      } else {
        console.error("Failed to fetch favorites", data.error);
      }

      setLoading(false);
    };

    fetchFavorites();
  }, []);

  if (!user) return null;

  return (
    <>
        <Head>
            <title>{firstName} Favorites | Carikopi</title>
            <meta name="description" content="Collection of user favorite coffee shops" />
        </Head>
    
        <Box px={2} py={3}>
            { isDesktop ?
              <Typography variant="h6" mb={2} sx={{ fontStyle: "normal" }}>
                The favorites page is only available on mobile screen.
              </Typography>
            : loading ?
              <Typography variant="body1" mb={2} sx={{ fontStyle: "italic" }}>
                Collecting your favorites...
              </Typography>
            : favorites && favorites.length > 0 ? 
              <Typography variant="h6" mb={2} sx={{ fontStyle: "normal" }}>
                Your Favorites
              </Typography>
            :
              <Typography variant="h6" mb={2} sx={{ fontStyle: "normal" }}>
                You don’t have any favorite yet.
              </Typography>
            }

            {!isDesktop && (favorites && favorites.length > 0) &&
                <Grid container spacing={2}>
                    {favorites.map((shop, i) => (
                    <MotionGrid
                        key={shop.title + " favorites"}
                        variants={cardVariants(0.25 * i)}
                        initial="hidden"
                        animate="visible"
                        size={{ xs: 12, sm: 6 }}
                    >
                        <Card 
                            elevation={4} 
                            sx={{
                                border: "1px solid #ccc",
                                borderRadius: 2,
                                padding: 1,
                                flexGrow: 1
                            }}
                        >  
                            <Box display="flex" gap={2}>
                                <CardMedia sx={{ cursor: "pointer" }} onClick={() => handleShowShopDetail(shop)}>
                                    <ImageWithSkeleton
                                        src={shop.images ? shop.images[0].serpapi_thumbnail : ""}
                                        alt={shop.images ? shop.images[0].title : ` Image favorite`}
                                        width="87px"
                                        height="87px"
                                        style={{ objectPosition: "center center" }}
                                    />
                                </CardMedia>
                                
                                <CardContent sx={{ padding: 0 }}>
                                    <Typography 
                                        component="h2"
                                        fontWeight="bold" 
                                        fontSize="0.95rem"
                                        sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: "1",
                                            WebkitBoxOrient: "vertical",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            "&:hover": {
                                                color: "#804A26"
                                            }
                                        }}
                                        onClick={() => handleShowShopDetail(shop)}
                                    > 
                                        {shop.title}
                                    </Typography>
                                    
                                    <Box display="flex" alignItems="center" gap={0.5} mt={0.3}>
                                        <Rating 
                                            name="half-rating-read" 
                                            defaultValue={shop.rating} 
                                            precision={0.5}
                                            readOnly 
                                            sx={{
                                                fontSize: "0.95rem"
                                            }}
                                        />

                                        <Typography component="span" fontSize="0.75rem" color="text.secondary">
                                            ({shop.reviews})
                                        </Typography>
                                    </Box>
                
                                    <Typography 
                                        fontSize="0.8rem" 
                                        color="text.secondary"
                                        sx={{
                                            mt: 1,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: "1",
                                            WebkitBoxOrient: "vertical",
                                        }}
                                    >
                                        {parseSerpAddress(shop.address, "cityCountry")}
                                    </Typography>

                                    <Typography 
                                        fontSize="0.8rem" 
                                        color="text.secondary"
                                        sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: "1",
                                            WebkitBoxOrient: "vertical",
                                        }}
                                    >
                                        {parseSerpAddress(shop.address, "street")}
                                    </Typography>
                                </CardContent>
                            </Box>

                            <CardActions>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    startIcon={unsavingId === shop.place_id ? null :
                                        <FavoriteIcon sx={{ color: "#ba0001" }} />
                                    }
                                    onClick={() => handleRemoveFavorite(shop.place_id)}
                                    disabled={unsavingId === shop.place_id}
                                >
                                    {unsavingId === shop.place_id ?
                                        <Box
                                            display="flex" 
                                            alignItems="center" 
                                            justifyContent="center"
                                            width="100%"
                                        >
                                            <CircularProgress size={17} />  
                                        </Box>
                                    :
                                        "Remove"  
                                    }
                                </Button>
                                
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    startIcon={viewedId === shop.place_id ? null :
                                        <MapIcon sx={{ color: "rgba(0,0,0,0.75)" }} />
                                    }
                                    onClick={() => handleViewOnMap(shop)}
                                    disabled={viewedId === shop.place_id}
                                >
                                    {viewedId === shop.place_id ?
                                        <Box
                                            display="flex" 
                                            alignItems="center" 
                                            justifyContent="center"
                                            width="100%"
                                        >
                                            <CircularProgress size={17} />  
                                        </Box>
                                    :
                                        "View Map"  
                                    }
                                </Button>
                            </CardActions>
                        </Card>
                    </MotionGrid>
                    ))}
                </Grid>
            }
        </Box>

        {(showShopDetail && selectedShop) &&
            <ShopDetail 
                shop={selectedShop}
                showShopDetail={showShopDetail}
                onCloseShopDetail={() => setShowShopDetail(false)}  
                onFavoriteUpdate={refreshFavorites}
            />
        }

        {minimapShop && (
          <Minimap
            shop={minimapShop}
            onClose={() => setMinimapShop(null)}
          />
        )}
    </>
  )
}

export default FavoritesPage;