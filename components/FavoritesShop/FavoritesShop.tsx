"use client"

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Button, Card, CardActions, CardContent, CardMedia, 
  CircularProgress, Grid, Rating, Stack, Typography, useMediaQuery 
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MapIcon from '@mui/icons-material/Map';

import { ImageWithSkeleton } from "@/components";
import { FavoritesShopProps } from "@/types";

import { scrollStyle } from "./styles";
import { parentCardDetailVariants, cardVariants } from "@/utils/motion";
import { parseSerpAddress } from "@/utils/helpers";

const MotionStack = motion.create(Stack);
const MotionGrid = motion.create(Grid);

const FavoritesShop = ({ favorites, onSelectShop, onFavoriteUpdate, onViewOnMap }: FavoritesShopProps) => {
  const isTablet = useMediaQuery("(max-width: 900px)");
  const [unsavingId, setUnsavingId] = useState<string | null>(null);
  const favoriteShopRef = useRef<HTMLDivElement>(null);
  const [favoriteShopHeight, setFavoriteShopHeight] = useState("100%");

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
        onFavoriteUpdate?.();
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
    if (isTablet || !favoriteShopRef.current) return;

    const observer = new ResizeObserver(() => {
      const topOffset = favoriteShopRef.current!.getBoundingClientRect().top;
      const height = window.innerHeight - topOffset;

      setFavoriteShopHeight(`${height}px`);
    });

    const parentElement = favoriteShopRef.current?.parentNode as Element | null;

    if (parentElement)
      observer.observe(parentElement)

    // Run once on mount
    const topOffset = favoriteShopRef.current!.getBoundingClientRect().top;
    const height = window.innerHeight - topOffset;

    setFavoriteShopHeight(`${height}px`);

    return () => observer.disconnect();
  }, [isTablet]);

  return (
    <AnimatePresence>
      <MotionStack
        variants={parentCardDetailVariants(0.15)}
        initial="hidden"
        animate="show"
        exit="exit"
        ref={favoriteShopRef}
        sx={(theme) => ({
            py: 1,
            px: 1,
            height: favoriteShopHeight,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            [theme.breakpoints.down('md')]: {
              display: "none"
            },
          })
        }
      >
        <Box display="flex" alignItems="center" gap={0.5} mb={1}>
          <FavoriteIcon fontSize="small" sx={{ color: "#ba0001" }} />

          <Typography variant="body1" fontWeight="bold">
            {favorites && favorites.length > 0 ? "Your Favorites" : "You don’t have any favorite yet"}
          </Typography>
        </Box>     

        {(favorites && favorites.length > 0) &&
          <Box sx={{
              ...scrollStyle,
              flex: 1,
              overflowY: "auto",
              mt: 1,
            }}
          >
            <Grid container rowSpacing={2} columnSpacing={1.5} sx={{ pb: 2, overflow: "hidden" }}>
              {favorites.map((shop, i) => (
                <MotionGrid 
                  key={`favorite-${i + 1}`}
                  variants={cardVariants(0.25 * i)}
                  initial="hidden"
                  animate="visible"
                  size={{ xs: 12, sm: 6, lg: 4 }}
                  sx={{ display: "flex" }}
                >
                  <Card title={shop.title} elevation={4} sx={{ flexGrow: 1 }}>
                    <CardMedia sx={{ cursor: "pointer" }} onClick={() => onSelectShop(shop)}>
                      <ImageWithSkeleton
                        src={shop.images ? shop.images[0].serpapi_thumbnail : ""}
                        alt={shop.images ? shop.images[0].title : `Image favorite ${i}`}
                        height="108px"
                        style={{ objectPosition: "center center" }}
                      />
                    </CardMedia>
                    <CardContent sx={{ padding: 1, "&:last-child": { paddingBottom: 2 } }}>
                      <Typography
                        gutterBottom
                        component="h3"
                        variant="body2"
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
                        onClick={() => onSelectShop(shop)}
                      >
                        {shop.title}
                      </Typography>

                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Rating 
                          name="half-rating-read" 
                          defaultValue={shop.rating} 
                          precision={0.5}
                          readOnly 
                          sx={{
                            fontSize: "0.875rem"
                          }}
                        />

                        <Typography component="span" sx={{ fontWeight: "bold", fontSize: "0.7rem"  }}>
                          ({shop.reviews})
                        </Typography>
                      </Box>

                      <Typography 
                        title={parseSerpAddress(shop.address, "street")}
                        component="span" 
                        sx={{ 
                          fontSize: "0.675rem",
                          mt: 1,
                          display: "-webkit-box",
                          textOverflow: "ellipsis",
                          WebkitLineClamp: "1",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden", 
                        }}
                      >
                        {parseSerpAddress(shop.address, "street")}
                      </Typography>
                    </CardContent>

                    <CardActions
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1
                      }}
                    >
                      <Button
                        title="Remove from favorites?"
                        fullWidth
                        variant="outlined"
                        startIcon={unsavingId === shop.place_id ? null :
                          <FavoriteIcon sx={{ color: "#ba0001", fontSize: "0.95rem !important" }} />
                        }
                        onClick={() => handleRemoveFavorite(shop.place_id)}
                        sx={{
                          padding: "3px 9px",
                          fontSize: "0.625rem",
                          color: "#000",
                          borderColor: "#ba7f57",
                          "&:hover": {
                            borderColor: "#804A26",
                          }
                        }}
                        disabled={unsavingId === shop.place_id}
                      >
                        {unsavingId === shop.place_id ?
                          <Box
                            display="flex" 
                            alignItems="center" 
                            justifyContent="center"
                            width="100%"
                          >
                            <CircularProgress size={17} sx={{ color: "#1976d2"}} />  
                          </Box>
                        :
                          "Remove"  
                        }
                      </Button>

                      <Button
                        title="View on map"
                        fullWidth
                        variant="outlined"
                        startIcon={<MapIcon sx={{ color: "rgba(0,0,0,0.75)", fontSize: "0.95rem !important" }} />}
                        sx={{
                          padding: "3px 9px",
                          fontSize: "0.625rem",
                          marginLeft: "0 !important",
                          color: "#000",
                          borderColor: "#ba7f57",
                          "&:hover": {
                            borderColor: "#804A26",
                          }
                        }}
                        onClick={() => onViewOnMap(shop)}
                      >
                        View
                      </Button>
                    </CardActions>
                  </Card>
                </MotionGrid>
              ))}
            </Grid>
          </Box>
        }
      </MotionStack>
    </AnimatePresence>
  )
}

export default FavoritesShop;