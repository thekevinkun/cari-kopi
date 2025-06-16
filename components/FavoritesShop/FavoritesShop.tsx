"use client"

import { useEffect, useState, useRef } from "react";
import { useUser } from "@/contexts/UserContext";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Card, CardContent, CardMedia, Grid, Rating, Stack, Typography, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { ImageWithSkeleton } from "@/components";
import { FavoritesShopProps } from "@/types";

import { parentCardDetailVariants, cardVariants } from "@/utils/motion";

const MotionStack = motion.create(Stack);
const MotionGrid = motion.create(Grid);

const FavoritesShop = ({ favorites, onSelectShop }: FavoritesShopProps) => {
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
        sx={(theme) => ({
            [theme.breakpoints.down('md')]: {
              display: "none"
            },
            py: 2,
            px: 1,
            height: favoriteShopHeight,
          })
        }
      >
        <Box display="flex" alignItems="center" gap={0.5}>
          <FavoriteIcon fontSize="small" sx={{ color: "#ba0001" }} />

          <Typography variant="body1" fontWeight="bold">
            {favorites && favorites.length > 0 ? "Your Favorites" : "You have no favorites yet"}
          </Typography>
        </Box>     

        {(favorites && favorites.length > 0) &&
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2, // spacing in px
              mt: 1,
              py: 2,
              overflow: "auto",
            }}
          >
            {favorites.map((shop, i) => (
              <motion.div
                key={`favorite-${i + 1}`}
                variants={cardVariants(0.25 * i)}
                initial="hidden"
                animate="visible"
                style={{ flex: "1 1 250px", maxWidth: "130px" }}
                
              >
                <Card title={shop.title} elevation={4} sx={{ height: "100%" }}>
                  <CardMedia sx={{ cursor: "pointer" }} onClick={() => onSelectShop(shop)}>
                    <ImageWithSkeleton
                      src={shop.images ? shop.images[0].serpapi_thumbnail : ""}
                      alt={shop.images ? shop.images[0].title : `Image favorite ${i}`}
                      height="125px"
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

                    <Rating 
                      name="half-rating-read" 
                      defaultValue={shop.rating} 
                      precision={0.5}
                      readOnly 
                      sx={{
                        fontSize: "0.925rem"
                      }}
                    />
                    
                    <Typography 
                      component="span" 
                      sx={{ 
                        display: "block",
                        fontSize: "0.675rem" 
                      }}
                    >
                      <Typography component="span" sx={{ fontWeight: "bold", fontSize: "0.725rem"  }}>
                        {shop.reviews}
                      </Typography> Reviews
                    </Typography>

                    <Typography 
                      component="span" 
                      sx={{ 
                        display: "block",
                        fontSize: "0.675rem", 
                        marginTop: "0.5rem",
                      }}
                    >
                      {shop.price}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        }
      </MotionStack>
    </AnimatePresence>
  )
}

export default FavoritesShop;