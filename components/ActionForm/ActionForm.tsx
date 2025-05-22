import { Box, Stack, Typography } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';

import type { ActionForm } from "@/types";

import { Search, SearchIconWrapper, StyledInputBase } from "./styles";

const ActionForm = ({ userLocation }: ActionForm) => {
  console.log("UserLocation: ", userLocation);
  
  return (
    <Stack spacing={2} py={2} px={1}>
      {!userLocation &&
        <Box display="flex" gap={1}>
          <Typography display="flex" alignItems="center" variant="body2" color="textSecondary">
            <LocationOnIcon /> Your location off
          </Typography>
        </Box>
      }

      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase  placeholder="Search..." />
      </Search>
    </Stack>
  )
}

export default ActionForm;