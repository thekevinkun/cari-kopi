import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';

import { Search, StyledAddress, SearchIconWrapper, StyledInputBase } from "./styles";

const ActionForm = ({ address }: { address: string | null }) => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  
  return (
    <Stack spacing={2} py={2} px={1}>
      {!address ?
        <Box display="flex" alignItems="center">
          <LocationOnIcon 
            style={{
              fontSize: isMobile ? "1.15rem" : "1.25rem",
              color: "#6f91d1",
              marginRight: "3px"
            }}
          />
          <Typography 
            variant="body2" 
            color="textSecondary"
            fontSize={isMobile ? "12px" : "14px"}
            fontStyle="italic"
            fontWeight="bold"
          >
           Your location is currently off. Please turn it on and refresh.
          </Typography>
        </Box>
      :
        <Box display="flex">
          <LocationOnIcon 
            style={{
              fontSize: isMobile ? "1.15rem" : "1.25rem",
              color: "#6f91d1",
              marginRight: "3px"
            }}
          />

          <StyledAddress 
            variant="body1" 
            color="textSecondary"
          >
            {address}
          </StyledAddress>
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