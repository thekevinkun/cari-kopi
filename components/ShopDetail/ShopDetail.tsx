"use client"

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Button, Card, CardContent, Typography, useMediaQuery } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import NearMeIcon from '@mui/icons-material/NearMe';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { 
  PhotoSlide, TitleRating, OpeningHours, 
  Information, ExtensionList, UserReviews 
} from "@/components";

import { StyledStack, CloseButton } from "./styles";
import { convertSerpApiHoursToWeekdayText, mergeExtensionsWithUnsupported } from "@/utils/helpers";
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
  const mergedExtensions = mergeExtensionsWithUnsupported(shop.extensions || [], shop.unsupported_extensions || []);

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
            <Box 
              mt={5} 
              display="flex" 
              flexWrap="wrap" 
              alignItems="center" 
              justifyContent="space-between"
              gap={2}
            >
              <Button variant="contained" sx={{ fontSize: 12 }}>
                <NearMeIcon fontSize="small" sx={{ mr: 0.75 }}/> Start Directions
              </Button>

              <Button variant="outlined" sx={{ fontSize: 12 }}>
                <FavoriteIcon fontSize="small" sx={{ mr: 0.75 }}/> Add to Favorites
              </Button>
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