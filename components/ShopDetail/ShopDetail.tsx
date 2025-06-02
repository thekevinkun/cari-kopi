"use client"

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Card, CardContent, Link as MUILink, Typography, useMediaQuery } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from "@mui/icons-material/Star";

import { OpeningHours, PhotoSlide, ReviewSlide } from "@/components";

import { StyledStack, StyledAddressTypography, CloseButton } from "./styles";
import { parentShopDetailVariants, shopDetailVariants } from "@/utils/motion";
import type { ShopDetailProps } from "@/types";

const MotionStyledStack = motion.create(StyledStack);
const MotionCard = motion.create(Card);

const ShopDetail = ({ shop, showShopDetail, onCloseShopDetail }: ShopDetailProps) => {
  const isTablet = useMediaQuery("(max-width: 900px)");
  const isMobile = useMediaQuery("(max-width: 600px)");

  const shopDetailRef = useRef<HTMLDivElement>(null);
  const [shopDetailHeight, setShopDetailHeight] = useState("100%");

  useEffect(() => {
    const updateShopDetailHeight = () => {
      if (isTablet || isMobile || !shopDetailRef.current) return;

      const topOffset = shopDetailRef.current.getBoundingClientRect().top;
      
      setShopDetailHeight(`calc(100vh - ${topOffset}px)`);
    };

    updateShopDetailHeight(); // Initial run

    window.addEventListener("resize", updateShopDetailHeight);
    return () => window.removeEventListener("resize", updateShopDetailHeight);
  }, [isMobile]);
  
  return (
    <AnimatePresence>
      <MotionStyledStack
        variants={parentShopDetailVariants(0.15)}
        initial="hidden"
        animate="show"
        exit="exit"
        ref={shopDetailRef}
        sx={{
          py: 2,
          px: 1,
          height: isMobile ? "540px" : isTablet ? "auto" : shopDetailHeight,
        }}
      >
        <MotionCard 
          variants={shopDetailVariants(isMobile ? "mobile" : isTablet ? "tablet" : null)}
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
          <PhotoSlide name={shop.name} photos={shop.photos ?? []}/>
        
          <CardContent>
            <Box 
              display="flex" 
              alignItems="flex-start" 
              justifyContent="space-between"
              gap={7}
            >
              <Typography variant="h5">{shop.name}</Typography>

              <Box display="flex" alignItems="center">
                <StarIcon 
                  style={{
                    color: "#faaf00",
                    fontSize: "1.5rem"
                  }}
                />
                <Typography component="legend">{shop.rating}</Typography>
                <Typography variant="body2" color="info">({shop.user_ratings_total})</Typography>
              </Box>
            </Box>
            
            {(shop.opening_hours && shop.opening_hours.weekday_text) &&
              <OpeningHours weekdayText={shop.opening_hours?.weekday_text} />
            }

            <StyledAddressTypography 
              variant="body2" 
              color="textSecondary"
              fontStyle={shop.formatted_address ? "normal" : "italic"}
              sx={{
                mt: 3,
                mb: 1.5
              }}
            >
              <LocationOnIcon /> {shop.formatted_address ? shop.formatted_address : "Unknown address"}
            </StyledAddressTypography>
            
            <Typography 
              variant="body2" 
              color="textSecondary" 
              fontStyle={shop.international_phone_number ? "normal" : "italic"}
              sx={{
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
              }}
            >
              <PhoneIcon /> 
              
              {shop.international_phone_number ?
                <MUILink href={`tel:${shop.international_phone_number}`}>{shop.international_phone_number}</MUILink>
              :
                "Unknown Phone Number"
              }
            </Typography>
            
            {shop.reviews && shop.reviews?.length > 0 &&
              <ReviewSlide 
                reviews={shop.reviews}
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
          variants={parentShopDetailVariants()}
          initial="hidden"
          animate="show"
          exit="exit"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,.15)",
            backdropFilter: "blur(2px)",
            zIndex: 1000
          }}
        />
      }
    </AnimatePresence>
  )
}

export default ShopDetail;