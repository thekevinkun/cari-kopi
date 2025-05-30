import { useEffect, useState, useRef } from "react";
import { Box, Card, CardContent, Link as MUILink, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import StarIcon from "@mui/icons-material/Star";

import { OpeningHours, PhotoSlide, ReviewSlide } from "@/components";

import { StyledStack, StyledSecondTypography } from "./styles";
import type { ShopDetail } from "@/types";

const ShopDetail = ({ shop }: {shop: ShopDetail}) => {
  const shopDetailRef = useRef<HTMLDivElement>(null);
  const [shopDetailHeight, setShopDetailHeight] = useState("100%");
  
  useEffect(() => {
    const updateShopDetailHeight = () => {
      if (!shopDetailRef.current) return;

      const topOffset = shopDetailRef.current.getBoundingClientRect().top;
      
      setShopDetailHeight(`calc(100vh - ${topOffset}px)`);
    };

    updateShopDetailHeight(); // Initial run

    window.addEventListener("resize", updateShopDetailHeight);
    return () => window.removeEventListener("resize", updateShopDetailHeight);
  }, []);
  
  return (
    <StyledStack 
      ref={shopDetailRef}
      sx={{
        py: 2,
        px: 1,
        height: shopDetailHeight
      }}
    >
      <Card elevation={6} sx={{ overflow: "auto" }}>
        <PhotoSlide name={shop.name} photos={shop.photos ?? []}/>
      
        <CardContent>
          <Box display="flex" justifyContent="space-between">
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

          <OpeningHours weekdayText={shop.opening_hours?.weekday_text || []} />
          
          <StyledSecondTypography variant="body2" color="textSecondary" mt={3} mb={1}>
            <LocationOnIcon /> {shop.vicinity ? shop.vicinity : "Unknown address"}
          </StyledSecondTypography>
          
          <StyledSecondTypography variant="body2" color="textSecondary" mb={3}>
            <PhoneIcon /> <MUILink href={`tel:${shop.international_phone_number}`}>{shop.international_phone_number}</MUILink>
          </StyledSecondTypography>
          
          <ReviewSlide 
            reviews={shop.reviews ?? []}
          />
        </CardContent>
      </Card>
    </StyledStack>
  )
}

export default ShopDetail;