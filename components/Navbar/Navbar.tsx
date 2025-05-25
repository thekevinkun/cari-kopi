import { Box, Typography } from "@mui/material";

import { StyledAppBar, StyledToolbar, WhiteOutlinedButton } from "./styles";

const Navbar = () => {
  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <Typography variant="h5">
          CoffeeShopFinder
        </Typography>

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