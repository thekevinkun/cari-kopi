import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RefreshIcon from "@mui/icons-material/Refresh";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CachedIcon from "@mui/icons-material/Cached";

import type { ExplorePanelProps } from "@/types";

const SearchBar = dynamic(() => import("@/components/SearchBar/SearchBar"), {
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
  onBackToLocation,
  isLoadNextPage,
  onNextPage,
  onShowLessPage,
  onSelectSearchResult,
  searchInProgress,
}: ExplorePanelProps) => {
  const isTablet = useMediaQuery("(max-width: 900px)");
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [isShowMoreHovered, setIsShowMoreHovered] = useState(false);
  const [isShowLessHovered, setIsShowLessHovered] = useState(false);

  return (
    <Stack
      spacing={2}
      py={2}
      px={1}
      sx={{
        alignItems: {
          xs: "unset",
          sm: "center",
          md: "unset",
        },
      }}
    >
      {locationStatus === "fetching" ? (
        <Box
          display="flex"
          alignItems="center"
          sx={{
            px: 1.25,
            py: 0.6,
            backgroundColor: "#f5f5f5",
            borderRadius: "24px",
            maxWidth: "100%",
            boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
          }}
        >
          <LocationOnIcon
            sx={{
              fontSize: "1.2rem",
              color: "rgba(0,0,0,0.54)",
              mr: 1,
            }}
          />
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              fontSize: "0.83rem",
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Finding location...
          </Typography>
        </Box>
      ) : locationStatus === "failed" ? (
        <Box>
          <Button
            variant="outlined"
            size="small"
            onClick={onRequestLocation}
            sx={{
              px: 1.5,
              fontSize: "0.72rem",
              fontWeight: 600,
              textTransform: "none",
              border: "2px solid rgba(0, 0, 0, 0.55)",
              color: "#121212",
              borderRadius: "16px",
              "&:hover": {
                background: "rgba(128, 74, 38, 0.85)",
                borderColor: "rgba(0, 0, 0, 0.55)",
                color: "#fff",
              },
            }}
          >
            Find your location
          </Button>
        </Box>
      ) : address ? (
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{
            px: 1.25,
            py: 0.6,
            backgroundColor: "#f5f5f5",
            borderRadius: "24px",
            maxWidth: "100%",
            boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
          }}
        >
          <LocationOnIcon
            sx={{
              fontSize: "1.2rem",
              color: "#804A26",
            }}
          />

          <Button
            variant="contained"
            size="small"
            onClick={onBackToLocation}
            sx={{
              minWidth: 46,
              fontSize: "0.675rem",
              textTransform: "uppercase",
              fontWeight: 600,
              px: 1.25,
              py: 0.3,
              borderRadius: "12px",
              backgroundColor: "#804A26",
              "&:hover": {
                backgroundColor: "#6a3b20",
              },
            }}
          >
            Go
          </Button>

          <Typography
            title={address}
            variant="body2"
            sx={{
              flexGrow: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "0.83rem",
              fontWeight: 500,
              mr: 1,
              cursor: "default",
            }}
          >
            {address}
          </Typography>
        </Box>
      ) : null}

      {locationStatus === "fetching" ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          sx={(theme) => ({
            marginTop: "10px !important",
            marginRight: "8px !important",
            [theme.breakpoints.down("md")]: {
              maxWidth: 640,
              marginRight: 0,
            },
          })}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            sx={(theme) => ({
              fontSize: "0.75rem",
              fontStyle: "italic",
              [theme.breakpoints.down("sm")]: {
                fontSize: "0.725rem",
              },
            })}
          >
            Showing results...
          </Typography>
        </Box>
      ) : (
        locationStatus === "success" &&
        totalPages &&
        totalPages > 1 && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            gap={0.75}
            sx={(theme) => ({
              marginTop: "10px !important",
              marginRight: "8px !important",
              [theme.breakpoints.down("md")]: {
                maxWidth: 640,
                marginRight: 0,
              },
            })}
          >
            <Typography
              variant="body2"
              color="textSecondary"
              sx={(theme) => ({
                fontSize: "0.75rem",
                fontStyle: "italic",
                [theme.breakpoints.down("sm")]: {
                  fontSize: "0.725rem",
                },
              })}
            >
              Showing {currentResults} of {totalResults} results
            </Typography>

            {currentPage && totalPages && (
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
                    backgroundColor: "transparent",
                  },
                }}
                onClick={currentPage < totalPages ? onNextPage : onShowLessPage}
                onMouseEnter={() => {
                  if (isTablet) return;

                  if (currentPage < totalPages) setIsShowMoreHovered(true);
                  else setIsShowLessHovered(true);
                }}
                onMouseLeave={() => {
                  if (isTablet) return;

                  if (currentPage < totalPages) setIsShowMoreHovered(false);
                  else setIsShowLessHovered(false);
                }}
              >
                {isLoadNextPage ? (
                  <CircularProgress
                    size={isMobile ? 18 : 20}
                    sx={{ color: "rgba(128, 74, 38, 0.85)" }}
                  />
                ) : currentPage < totalPages ? (
                  isShowMoreHovered ? (
                    <RefreshIcon
                      titleAccess="Show more"
                      sx={{
                        fontSize: { xs: 18, sm: 20 },
                        position: "relative",
                        bottom: { xs: "0px", sm: "1px" },
                      }}
                    />
                  ) : (
                    <AutorenewIcon
                      titleAccess="Show more"
                      sx={{
                        fontSize: { xs: 18, sm: 20 },
                        position: "relative",
                        bottom: { xs: "0px", sm: "0.775px" },
                      }}
                    />
                  )
                ) : isShowLessHovered ? (
                  <CachedIcon
                    titleAccess="Show less"
                    sx={{
                      fontSize: { xs: 18, sm: 20 },
                      position: "relative",
                      bottom: { xs: "0px", sm: "1px" },
                    }}
                  />
                ) : (
                  <RestartAltIcon
                    titleAccess="Show less"
                    sx={{
                      fontSize: { xs: 18, sm: 20 },
                      position: "relative",
                      bottom: { xs: "0px", sm: "1px" },
                    }}
                  />
                )}
              </Button>
            )}
          </Box>
        )
      )}

      <SearchBar
        onSelectSearchResult={onSelectSearchResult}
        searchInProgress={searchInProgress}
      />
    </Stack>
  );
};

export default ExplorePanel;
