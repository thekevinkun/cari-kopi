import { Box, Typography } from "@mui/material";

import { StyledAppBar, StyledToolbar, StyledTitleTypography, WhiteOutlinedButton } from "./styles";

const Navbar = () => {
  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <StyledTitleTypography variant="h5">
          Carikopi
        </StyledTitleTypography>

        <Box display="flex">
          <WhiteOutlinedButton href="#login" variant="outlined">
            Login
          </WhiteOutlinedButton>
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  )
}

export default Navbar;