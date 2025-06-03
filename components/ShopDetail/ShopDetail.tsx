"use client"

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Card, CardContent, Link as MUILink, Typography, useMediaQuery } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import PhoneIcon from "@mui/icons-material/Phone";
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { OpeningHours, PhotoSlide, ReviewSlide } from "@/components";

import { StyledStack, CloseButton } from "./styles";
import { convertSerpApiHoursToWeekdayText } from "@/utils/helpers";
import { parentShopDetailVariants, shopDetailVariants } from "@/utils/motion";
import type { ShopDetailProps } from "@/types";

const MotionStyledStack = motion.create(StyledStack);
const MotionCard = motion.create(Card);

const ShopDetail = ({ shop, showShopDetail, onCloseShopDetail }: ShopDetailProps) => {
  const isTablet = useMediaQuery("(max-width: 900px)");
  const isMobile = useMediaQuery("(max-width: 600px)");

  const shopDetailRef = useRef<HTMLDivElement>(null);
  const [shopDetailHeight, setShopDetailHeight] = useState("100%");

  const weekdayText = convertSerpApiHoursToWeekdayText(shop.hours ?? []);

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
          <PhotoSlide photos={shop.images ?? []}/>
        
          <CardContent>
            <Box 
              display="flex" 
              alignItems="flex-start" 
              justifyContent="space-between"
              gap={7}
            >
              <Typography variant="h5">{shop.title}</Typography>

              <Box display="flex" alignItems="center">
                <StarIcon 
                  style={{
                    color: "#faaf00",
                    fontSize: "1.5rem"
                  }}
                />
                <Typography component="legend">{shop.rating}</Typography>
                <Typography variant="body2" color="info">({shop.reviews})</Typography>
              </Box>
            </Box>
            
            {(shop.hours && shop.hours?.length > 0) &&
              <OpeningHours openState={shop.open_state || ""} weekdayText={weekdayText} />
            }

            {shop.address &&
              <Typography 
                variant="body2" 
                color="textSecondary"
                fontStyle="normal"
                sx={{
                  mt: 3,
                  textAlign: "right",
                  display: "flex", 
                  justifyContent: "space-between",
                  gap: 7
                }}
              >
                <LocationOnIcon /> {shop.address}
              </Typography>
            }
            
            {shop.phone &&
              <Typography 
                variant="body2" 
                color="textSecondary" 
                fontStyle="normal"
                sx={{
                  mt: 1,
                  textAlign: "right",
                  display: "flex", 
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 7
                }}
              >
                <PhoneIcon /> 
                
                <MUILink href={`tel:${shop.phone}`}>{shop.phone}</MUILink>
              </Typography>
            }
            
            {shop.web_results_link &&
              <Typography 
                variant="body2" 
                color="textSecondary" 
                fontStyle="normal"
                sx={{
                  mt: 1,
                  textAlign: "right",
                  display: "flex", 
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 7
                }}
              >
                <LanguageIcon sx={{ position: "relative", top: "1.8px" }}/> 
              
                <MUILink href={shop.web_results_link}>Web Link</MUILink>
              </Typography>
            }

            <Box mt={5}>
              <Typography 
                variant="h6" 
                fontStyle="normal"
              >
                User Reviews
              </Typography>

              {shop.user_reviews && shop.user_reviews?.most_relevant.length > 0 &&
                <ReviewSlide 
                  reviews={shop.user_reviews.most_relevant}
                />
              }
            </Box>
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