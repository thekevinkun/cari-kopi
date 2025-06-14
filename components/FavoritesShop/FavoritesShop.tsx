"use client"

import { useEffect, useState, useRef } from "react";
import { useUser } from "@/contexts/UserContext";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Button, Card, CardContent, CardMedia, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { ImageWithSkeleton } from "@/components";
import { SerpShopDetail } from "@/types";

import { parentCardDetailVariants, cardDetailVariants } from "@/utils/motion";

const MotionStack = motion.create(Stack);

const FavoritesShop = ({ favorites }: { favorites: SerpShopDetail[] }) => {
  const isTablet = useMediaQuery("(max-width: 900px)");

  const favoriteShopRef = useRef<HTMLDivElement>(null);
  const [favoriteShopHeight, setFavoriteShopHeight] = useState("100%");

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
        sx={{
          py: 2,
          px: 1,
          height: favoriteShopHeight,
        }}
      >
        <Box display="flex" alignItems="center" gap={0.5}>
          <FavoriteIcon fontSize="small" sx={{ color: "#ba0001" }} />

          <Typography variant="body1" fontWeight="bold">
            {favorites && favorites.length > 0 ? "Your Favorites" : "You have no favorites yet"}
          </Typography>
        </Box>     

        {(favorites && favorites.length > 0) &&
          <Grid container spacing={2} sx={{ mt: 1, py: 2, overflow: "auto" }}>
            {favorites.map((shop, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: "flex" }} key={`favorite-${i + 1}`}>
                <Card 
                  elevation={4} 
                  sx={{ flexGrow: 1 }}
                >
                  <CardMedia>
                    <ImageWithSkeleton
                      src={shop.images ? shop.images[0].serpapi_thumbnail : ""}
                      alt={shop.images ? shop.images[0].title : `Image favorite ${i}`}
                      height="125px"
                      style={{ objectPosition: "center center" }}
                    />
                  </CardMedia>

                  <CardContent>
                    <Typography component="h3" variant="body2" fontWeight="bold">
                      {shop.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        }
      </MotionStack>
    </AnimatePresence>
  )
}

export default FavoritesShop;