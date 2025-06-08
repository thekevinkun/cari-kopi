import Link from "next/link";
import { Box, Typography } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useUser } from "@/contexts/UserContext";

import { StyledAppBar, StyledToolbar, StyledTitleTypography, WhiteOutlinedButton } from "./styles";

const Navbar = () => {
  const { user, loading } = useUser();
  
  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <StyledTitleTypography variant="h5">
          Carikopi
        </StyledTitleTypography>

        {!loading &&
          <Box display="flex">
            {user ? 
              <Box display="flex" alignItems="center" gap={1}>
                <Typography component="span" variant="body1">
                  Hi, {user.username}
                </Typography>

                <AccountBoxIcon />
              </Box>
            :
              <Link href="/login">
                <WhiteOutlinedButton variant="outlined">
                  Login
                </WhiteOutlinedButton>
              </Link>
            }
          </Box>
        }
      </StyledToolbar>
    </StyledAppBar>
  )
}

export default Navbar;