import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";

import type { ExplorePanelProps } from "@/types";

import { Search, StyledAddress, SearchIconWrapper, StyledInputBase } from "./styles";

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
 
  return (
    <Stack spacing={2} py={2} px={1}>
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

      {totalPages && totalPages > 1 &&
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="flex-end" 
          gap={1}
          sx={(theme) => ({
              marginTop: "10px !important",
              [theme.breakpoints.down('md')]: {
                maxWidth: 640,
              },
            })
          }
        >
          <Typography 
            variant="body2" 
            color="textSecondary"
            sx={(theme) => ({
                fontSize: "0.775rem",
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
              variant="outlined"
              size="small"
              sx={(theme) => ({
                  minWidth: 40,
                  padding: "4px",
                  fontSize: "0.55rem",
                  fontWeight: "bold",
                  border: `2px solid ${isLoadNextPage ? "rgba(128, 74, 38, 0.55)" : "rgba(0, 0, 0, 0.55)"}`,
                  borderRadius: "unset",
                  color: "#121212",
                  pointerEvents: isLoadNextPage ? "none" : "auto",
                  "&:hover": {
                    background: "rgba(128, 74, 38, 0.85)",
                    borderColor: "rgba(0, 0, 0, 0.55)"
                  },  
                  [theme.breakpoints.down('sm')]: {
                    minWidth: 36,
                    padding: "2px"
                  },
                })
              }
              onClick={currentPage < totalPages ? onNextPage : onShowLessPage}
            >
              {isLoadNextPage ? 
                <CircularProgress size={16} sx={{ color: "rgba(128, 74, 38, 0.85)" }}/> 
                : currentPage < totalPages ? <AutorenewIcon sx={{ fontSize: 16 }} /> : "Show less"
              }
            </Button>
          }
        </Box>
      }

      <Search>
        <SearchIconWrapper>
          <SearchIcon 
            style={{
              width: "1em",
              height: "1em",
            }}
          />
        </SearchIconWrapper>
        <StyledInputBase  placeholder="Search..." />
      </Search>
    </Stack>
  );
};

export default ExplorePanel;
