import { useState } from "react";
import dynamic from "next/dynamic";
import { Box, Button, CircularProgress, Stack, Typography, useMediaQuery } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RefreshIcon from "@mui/icons-material/Refresh";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CachedIcon from "@mui/icons-material/Cached";

import type { ExplorePanelProps } from "@/types";

import { StyledAddress } from "./styles";

const SearchBar = dynamic(() => import('@/components/SearchBar/SearchBar'), {
  ssr: false,
});

const ExplorePanel = ({ 
  address, 
  currentResults,
  totalResults,
  currentPage,
  totalPages,
  locationStatus, 
  onRequestLocation, 
  isLoadNextPage, 
  onNextPage,
  onShowLessPage 
}: ExplorePanelProps) => {
  const isTablet = useMediaQuery("(max-width: 900px)");
  const isMobile = useMediaQuery("(max-width: 600px)");
  
  const [isShowMoreHovered, setIsShowMoreHovered] = useState(false);
  const [isShowLessHovered, setIsShowLessHovered] = useState(false);

  const handlePlaceSelect = async (placeId: string, description: string) => {
    // Here, fetch Google `/details` using sessionToken if needed, and center map
    console.log("Selected place:", description, placeId);
  };

  return (
    <Stack 
      spacing={2} 
      py={2} 
      px={1}
      sx={{
        alignItems: {
          xs: "unset",
          sm: "center",
          md: "unset"
        }
      }}
    >
      {locationStatus === "fetching" ? (
        <Box display="flex">
          <LocationOnIcon 
            sx={{
              fontSize: {
                xs: "1.15rem",
                sm: "1.25rem"
              },
              color: "rgba(0,0,0,0.54)",
              marginRight: "3px"
            }}
          />
          <Typography variant="body1" color="textSecondary" fontSize="0.825rem">
            Finding location...
          </Typography>
        </Box>
      ) : locationStatus === "failed" ? (
        <Box display="flex" alignItems="center">
          <Button 
            variant="outlined"
            size="small"
            sx={{
              padding: "4px 9px",
              fontSize: "0.715rem",
              fontWeight: "bold",
              border: "2px solid rgba(0, 0, 0, 0.55)",
              borderRadius: "unset",
              color: "#121212",
              "&:hover": {
                background: "rgba(128, 74, 38, 0.85)",
                borderColor: "rgba(0, 0, 0, 0.55)"
              }
            }}
            onClick={onRequestLocation}
          >
            Find your location
          </Button>
        </Box>
      ) : address ? (
        <Box display="flex">
          <LocationOnIcon 
            sx={{
              fontSize: {
                xs: "1.15rem",
                sm: "1.25rem"
              },
              color: "#1976d2",
              marginRight: "3px"
            }}
          />
          <StyledAddress variant="body1" color="textSecondary">
            {address}
          </StyledAddress>
        </Box>
      ) : null}

      {locationStatus === "fetching" ?
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="flex-end" 
          sx={(theme) => ({
              marginTop: "10px !important",
              marginRight: "8px !important",
              [theme.breakpoints.down('md')]: {
                maxWidth: 640,
                marginRight: 0,
              },
            })
          }
        >
          <Typography 
            variant="body2" 
            color="textSecondary"
            sx={(theme) => ({
                fontSize: "0.75rem",
                fontStyle: "italic",   
                [theme.breakpoints.down('sm')]: {
                  fontSize: "0.715rem",  
                },
              })
            }
          >
            Showing results...
          </Typography>
        </Box>
      : locationStatus === "success" && (totalPages && totalPages > 1) &&
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="flex-end" 
          gap={0.75}
          sx={(theme) => ({
              marginTop: "10px !important",
              marginRight: "8px !important",
              [theme.breakpoints.down('md')]: {
                maxWidth: 640,
                marginRight: 0,
              },
            })
          }
        >
          <Typography 
            variant="body2" 
            color="textSecondary"
            sx={(theme) => ({
                fontSize: "0.75rem",
                fontStyle: "italic",   
                [theme.breakpoints.down('sm')]: {
                  fontSize: "0.715rem",  
                },
              })
            }
          >
            Showing {currentResults} of {totalResults} results
          </Typography>

          {(currentPage && totalPages)  && 
            <Button 
              variant="text"
              sx={{
                  minWidth: "fit-content",
                  padding: "2px",
                  fontWeight: "bold",
                  borderRadius: "unset",
                  color: "#121212",
                  pointerEvents: isLoadNextPage ? "none" : "auto",
                  "&:hover": {
                    backgroundColor: "transparent"
                  }
              }}
              onClick={currentPage < totalPages ? onNextPage : onShowLessPage}
              onMouseEnter={() => {
                if (isTablet) return;

                if (currentPage < totalPages)
                  setIsShowMoreHovered(true);
                else
                  setIsShowLessHovered(true);
              }}
              onMouseLeave={() => {
                if (isTablet) return;

                if (currentPage < totalPages)
                  setIsShowMoreHovered(false);
                else
                  setIsShowLessHovered(false);
              }}
            >
              {isLoadNextPage ? (
                <CircularProgress size={isMobile ? 18 : 20} sx={{ color: "rgba(128, 74, 38, 0.85)" }} />
              ) : currentPage < totalPages ? (
                isShowMoreHovered ? (
                  <RefreshIcon
                    titleAccess="Show more"
                    sx={{ fontSize: {xs: 18, sm: 20}, position: "relative", bottom: {xs: "0px", sm: "1px"} }}
                  />
                ) : (
                  <AutorenewIcon
                    titleAccess="Show more"
                    sx={{ fontSize: {xs: 18, sm: 20}, position: "relative", bottom: {xs: "0px", sm: "1px"} }}
                  />
                )
              ) : isShowLessHovered ? (
                <CachedIcon
                  titleAccess="Show less"
                  sx={{ fontSize: {xs: 18, sm: 20}, position: "relative", bottom: {xs: "0px", sm: "1px"} }}
                />
              ) : (
                <RestartAltIcon
                  titleAccess="Show less"
                  sx={{ fontSize: {xs: 18, sm: 20}, position: "relative", bottom: {xs: "0px", sm: "1px"} }}
                />
              )}
            </Button>
          }
        </Box>
      }

      <SearchBar onPlaceSelect={handlePlaceSelect}/>
    </Stack>
  );
};

export default ExplorePanel;
