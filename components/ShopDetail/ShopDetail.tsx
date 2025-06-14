"use client"

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Button, Card, CardContent, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NearMeIcon from "@mui/icons-material/NearMe";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { 
  PhotoSlide, TitleRating, OpeningHours, 
  Information, ExtensionList, UserReviews 
} from "@/components";

import { StyledStack, CloseButton } from "./styles";
import { convertSerpApiHoursToWeekdayText, mergeExtensionsWithUnsupported } from "@/utils/helpers";
import { parentCardDetailVariants, cardDetailVariants } from "@/utils/motion";
import type { ShopDetailProps } from "@/types";

const MotionStyledStack = motion.create(StyledStack);
const MotionCard = motion.create(Card);

const ShopDetail = ({ shop, showShopDetail, onCloseShopDetail }: ShopDetailProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkingFavorite, setCheckingFavorite] = useState(true);
  const [loading, setLoading] = useState(false);

  const isTablet = useMediaQuery("(max-width: 900px)");
  const isMobile = useMediaQuery("(max-width: 600px)");

  const shopDetailRef = useRef<HTMLDivElement>(null);
  const [shopDetailHeight, setShopDetailHeight] = useState("100%");

  const weekdayText = convertSerpApiHoursToWeekdayText(shop.hours ?? []);
  const mergedExtensions = mergeExtensionsWithUnsupported(shop.extensions || [], shop.unsupported_extensions || []);

  const handleAddFavorite = async () => {
    setLoading(true);

    const placeId = shop?.place_id;

    try {
      const res = await fetch("/api/favorites/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
      } else {
        setIsFavorite(true);
        alert(data.message);
      }

    } catch (error) {
      alert("Failed to add shop. Try again later.");
      console.error("Failed to add shop", error);
    } finally {
      setLoading(false);
    }
  }; 

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!shop?.place_id) return;

      try {
        const res = await fetch(`/api/favorites/is?placeId=${shop.place_id}`);
        const data = await res.json();
        setIsFavorite(data.isFavorite || false);
      } catch (error) {
        console.error("Failed to check favorite status", error);
      } finally {
        setCheckingFavorite(false);
      }
    }

    checkFavoriteStatus();
  }, [shop?.place_id]);

  useEffect(() => {
    if (isTablet || isMobile || !shopDetailRef.current) return;

    const observer = new ResizeObserver(() => {
      const topOffset = shopDetailRef.current!.getBoundingClientRect().top;
      const height = window.innerHeight - topOffset;

      setShopDetailHeight(`${height}px`);
    });

    const parentElement = shopDetailRef.current?.parentNode as Element | null;

    if (parentElement)
      observer.observe(parentElement)

    // Run once on mount
    const topOffset = shopDetailRef.current!.getBoundingClientRect().top;
    const height = window.innerHeight - topOffset;

    setShopDetailHeight(`${height}px`);

    return () => observer.disconnect();
  }, [isTablet, isMobile]);
  
  return (
    <AnimatePresence>
      <MotionStyledStack
        variants={parentCardDetailVariants(0.15)}
        initial="hidden"
        animate="show"
        exit="exit"
        ref={shopDetailRef}
        sx={{
          py: 2,
          px: 1,
          height: isMobile ? "50vh" : isTablet ? "auto" : shopDetailHeight,
        }}
      >
        <MotionCard 
          variants={cardDetailVariants(isMobile ? "mobile" : isTablet ? "tablet" : null)}
          initial="hidden"
          animate="show"
          exit="exit"
          elevation={6} 
          sx={{ 
            marginTop: {
              xs: "auto",
              md: "unset"
            },
            overflow: "auto" 
          }}
        >
          {/* SHOP PHOTOS */}
          <PhotoSlide photos={shop.images ?? []}/>
          
          {/* SHOP CONTENTS */}
          <CardContent>
            {/* SHOP TITLE AND RATING */}
            <TitleRating title={shop.title} rating={shop.rating} reviews={shop.reviews}/>
            
            {/* SHOP OPENING HOURS */}
            {(shop.hours && shop.hours?.length > 0) &&
              <OpeningHours openState={shop.open_state || ""} weekdayText={weekdayText} />
            }

            {/* SHOP INFORMATION */}
            <Information 
              address={shop.address ?? ""} 
              price={shop.price ?? ""}
              phone={shop.phone ?? ""}
              webLink={shop.web_results_link}
            />

            {/* DIRECTION AND FAVORITES */}
            <Grid 
              container
              mt={5} 
              spacing={2}
              alignItems="center"
            >
              <Grid size={{ xs: 12, sm: 6 }}>
                <Button variant="contained" sx={{ fontSize: 12, width: "100%" }}>
                  <NearMeIcon fontSize="small" sx={{ mr: 0.75 }}/> Start Directions
                </Button>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <Button 
                  title={isFavorite ? "Remove from favorites?" : "Add to favorites?"}
                  variant="outlined" 
                  sx={{ fontSize: 12, width: "100%" }}
                  disabled={loading}
                  onClick={handleAddFavorite}
                >
                  {loading || checkingFavorite ? 
                    <Box
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                      width="100%"
                    >
                      <CircularProgress size={18} sx={{ color: "#1976d2"}} />  
                    </Box>
                  :
                    <>
                      {isFavorite ?
                        <FavoriteIcon fontSize="small" sx={{ mr: 0.75, color: "#ba0001" }} />
                      :
                        <FavoriteBorderIcon fontSize="small" sx={{ mr: 0.75, color: "#ba0001" }} />  
                      }
                      
                      {isFavorite ? "In Favorites" : "Add to Favorites"}
                    </>
                  }
                </Button>
              </Grid>
            </Grid>

            {/* SHOP EXTENSIONS */}
            {mergedExtensions && <ExtensionList extensions={mergedExtensions} />}

            {/* SHOP REVIEWS */}
            {shop.user_reviews && shop.user_reviews?.most_relevant.length > 0 &&
              <UserReviews 
                 reviews={shop.user_reviews.most_relevant}
              />
            }
          </CardContent>
        </MotionCard>

        {/* Close shop detail */}
        {(isTablet && showShopDetail) && 
          <CloseButton 
            variant="contained" 
            color="error"
            onClick={onCloseShopDetail}
          >
            <CloseIcon />
          </CloseButton>
        }
      </MotionStyledStack>

      {/* Blurred background */}
      {(isTablet && showShopDetail) &&
        <motion.div
          variants={parentCardDetailVariants()}
          initial="hidden"
          animate="show"
          exit="exit"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,.25)",
            backdropFilter: "blur(2px)",
            zIndex: 1000
          }}
        />
      }
    </AnimatePresence>
  )
}

export default ShopDetail;