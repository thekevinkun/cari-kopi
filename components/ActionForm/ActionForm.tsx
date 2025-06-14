import { Box, Button, Stack, Typography, useMediaQuery } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';

import type { ActionFormProps } from "@/types";

import { Search, StyledAddress, SearchIconWrapper, StyledInputBase } from "./styles";

const ActionForm = ({ address, shouldAsk, onRequestLocation }: ActionFormProps) => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  
  return (
    <Stack spacing={2} py={2} px={1}>
      {(!address && shouldAsk) ?
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
      :
        <Box display="flex">
          <LocationOnIcon 
            style={{
              fontSize: isMobile ? "1.15rem" : "1.25rem",
              color: "#1976d2",
              marginRight: "3px"
            }}
          />

          {address ?
            <StyledAddress 
              variant="body1" 
              color="textSecondary"
            >
              {address}
            </StyledAddress>
          :
            <Typography 
              variant="body1" 
              color="textSecondary"
              fontSize="0.825rem"
            >
              Finding location...
            </Typography>
          }
        </Box>
      }

      <Search>
        <SearchIconWrapper>
          <SearchIcon 
            style={{
              width: isMobile ? "0.85em" : "1em",
              height: isMobile ? "0.85em" : "1em",
            }}
          />
        </SearchIconWrapper>
        <StyledInputBase  placeholder="Search..." />
      </Search>
    </Stack>
  )
}

export default ActionForm;