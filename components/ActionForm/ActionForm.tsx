import { Box, Stack, Typography } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';

import { Search, SearchIconWrapper, StyledInputBase } from "./styles";

const ActionForm = ({ address }: { address: string | null }) => {
  return (
    <Stack spacing={2} py={2} px={1}>
      {!address ?
        <Box display="flex">
          <Typography 
            display="flex" 
            alignItems="center" 
            variant="body2" 
            color="textSecondary"
            fontStyle="italic"
            fontWeight="bold"
          >
            <LocationOnIcon 
              style={{
                fontSize: "1.25rem",
                color: "#4d76c4",
                marginRight: "3px"
              }}
            /> Your location off
          </Typography>
        </Box>
      :
        <Box display="flex">
          <Typography 
            display="flex" 
            variant="body1" 
            color="textSecondary"
            fontSize="0.695rem"
            fontWeight="bold"
          >
            <LocationOnIcon 
              style={{
                fontSize: "1.25rem",
                color: "#4d76c4",
                marginRight: "3px"
              }}
            /> {address}
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