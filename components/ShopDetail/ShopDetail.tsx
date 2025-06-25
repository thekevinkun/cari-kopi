"use client"

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Button, Card, CardContent, CircularProgress, IconButton, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NearMeIcon from "@mui/icons-material/NearMe";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { 
  PhotoSlide, TitleRating, OpeningHours, 
  Information, ExtensionList, UserReviews 
} from "@/components";

import { StyledStack, scrollStyle } from "./styles";
import { convertSerpApiHoursToWeekdayText, mergeExtensionsWithUnsupported } from "@/utils/helpers";
import { parentCardDetailVariants, cardDetailVariants } from "@/utils/motion";
import type { ShopDetailProps } from "@/types";

const MotionStyledStack = motion.create(StyledStack);
const MotionCard = motion.create(Card);

const ShopDetail = ({ shop, showShopDetail, onCloseShopDetail, 
  onFavoriteUpdate, onStartDirections }: ShopDetailProps) => {

  const [isFavorite, setIsFavorite] = useState(false);
  const [checkingFavorite, setCheckingFavorite] = useState(true);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [loadingDirections, setLoadingDirections] = useState(false);

  const isTablet = useMediaQuery("(max-width: 900px)");
  const isMobile = useMediaQuery("(max-width: 600px)");

  const shopDetailRef = useRef<HTMLDivElement>(null);
  const [shopDetailHeight, setShopDetailHeight] = useState("100%");

  const weekdayText = convertSerpApiHoursToWeekdayText(shop.hours ?? []);
  const mergedExtensions = mergeExtensionsWithUnsupported(shop.extensions || [], shop.unsupported_extensions || []);

  const handleAddFavorite = async () => {
    setLoadingFavorite(true);

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
        onFavoriteUpdate?.();
        alert(data.message);
      }

    } catch (error) {
      alert("Failed to add shop. Try again later.");
      console.error("Failed to add shop", error);
    } finally {
      setLoadingFavorite(false);
    }
  }; 

  const handleRemoveFavorite = async () => {
    setLoadingFavorite(true);

    const placeId = shop?.place_id;
    
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
        setIsFavorite(false);
        onFavoriteUpdate?.();
        alert(data.message);
      }

    } catch (error) {
      alert("Failed to remove shop. Try again later.");
      console.error("Failed to remove shop", error);
    } finally {
      setLoadingFavorite(false);
    }
  };

  const handleStartDirections = async () => {
    setLoadingDirections(true);
    await onStartDirections(shop);
    setLoadingDirections(false);
  }

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
    if (isTablet || isMobile) return;

    const timeout = setTimeout(() => {
      const el = shopDetailRef.current;
      if (!el) return;

      const parentElement = el.parentNode as Element | null;
      if (!parentElement) return;

      const observer = new ResizeObserver(() => {
        const currentEl = shopDetailRef.current;
        if (!currentEl) return;

        const topOffset = currentEl.getBoundingClientRect().top;
        const height = window.innerHeight - topOffset;

        setShopDetailHeight(`${height}px`);
      });

      observer.observe(parentElement);

      // Initial measure
      const topOffset = el.getBoundingClientRect().top;
      const height = window.innerHeight - topOffset;
      setShopDetailHeight(`${height}px`);

      // Cleanup
      return () => {
        observer.disconnect();
      };
    }, 100); // Wait 100ms

    // Always clear timeout if unmounted early
    return () => clearTimeout(timeout);
  }, [isTablet, isMobile]);

  useEffect(() => {
    if (showShopDetail && isTablet) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showShopDetail]);
  
  if (!shop || !shop.place_id) return null;

  return (
    <AnimatePresence>
      {showShopDetail &&
        <MotionStyledStack
          key={shop.place_id}
          variants={parentCardDetailVariants(0.25)}
          initial="hidden"
          animate="show"
          exit="exit"
          ref={shopDetailRef}
          sx={{
            pt: 2,
            pb: 1.5,
            px: 1,
            height: isTablet ? "80svh" : shopDetailHeight,
          }}
        >
          <MotionCard 
            variants={cardDetailVariants(isMobile ? "mobile" : isTablet ? "tablet" : null)}
            initial="hidden"
            animate="show"
            exit="exit"
            elevation={6} 
            sx={{ 
              ...scrollStyle,
              position: "relative",
              marginTop: {
                xs: "auto",
                md: "unset"
              },
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
                website={shop.website ?? ""}
                webLink={shop.web_results_link}
              />

              {/* DIRECTION AND FAVORITES */}
              <Box
                sx={{
                  mt: 5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: 2
                }}
              >
                <Box sx={{ flex: "1 1 250px", maxWidth: isTablet && !isMobile ? "180px" : "183px" }}>
                  <Button 
                    variant="contained"
                    sx={{ fontSize: 12, width: "100%" }}
                    disabled={loadingFavorite}
                    onClick={handleStartDirections}
                  >
                    {loadingDirections ? 
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
                        <NearMeIcon fontSize="small" sx={{ mr: 0.75 }}/>
                        Start Directions
                      </>
                    }
                  </Button>
                </Box>
                
                <Box sx={{ flex: "1 1 250px", maxWidth: isTablet && !isMobile ? "180px" : "183px" }}>
                  <Button 
                    title={isFavorite ? "Remove from favorites?" : "Add to favorites?"}
                    variant="outlined" 
                    sx={{ fontSize: 12, width: "100%" }}
                    disabled={loadingFavorite}
                    onClick={isFavorite ? handleRemoveFavorite : handleAddFavorite}
                  >
                    {loadingFavorite || checkingFavorite ? 
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
                </Box>
              </Box>

              {/* SHOP EXTENSIONS */}
              {mergedExtensions && <ExtensionList extensions={mergedExtensions} />}

              {/* SHOP REVIEWS */}
              {shop.user_reviews && shop.user_reviews?.most_relevant.length > 0 &&
                <UserReviews 
                  reviews={shop.user_reviews.most_relevant}
                />
              }
            </CardContent>

            {/* Close shop detail */}
            {shop && 
              <IconButton 
                title="Close Shop Detail?"
                onClick={onCloseShopDetail}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  zIndex: 1300,
                  bgcolor: "rgba(0,0,0,0.35)",
                  color: "#fff",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.65)",
                  },
                  backdropFilter: "blur(2px)", // optional: adds a slight blur behind
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                }}    
              >
                <CloseIcon sx={{  fontSize: "1.75rem" }}/>
              </IconButton>
            }
          </MotionCard>
        </MotionStyledStack>
      }

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
            height: "100svh",
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