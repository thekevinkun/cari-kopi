import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { Box, CardActions, CardContent, ClickAwayListener, Divider, Link as MUILink, Typography } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';

import { StyledAppBar, StyledToolbar, StyledTitleTypography,
  MenuButton, MenuBox, MenuCard, WhiteOutlinedButton } from "./styles";

const Navbar = () => {
  const router = useRouter();
  const { user, loading, refreshUser } = useUser();
  const [toggleMenu, setToggleMenu] = useState(false);
  
  const firstName = user?.name?.split(" ")[0];
  const lastName = user?.name?.split(" ")[1]

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
                <MenuButton 
                  variant="outlined"
                  onClick={() => setToggleMenu(!toggleMenu)}
                >
                  <PersonIcon sx={{ fontSize: "1.75rem" }}/>
                </MenuButton> 
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

        {(user && toggleMenu) &&
          <ClickAwayListener onClickAway={() => setToggleMenu(false)}>
            <MenuBox>
              <MenuCard>
                <CardContent
                  sx={(theme) => ({
                    padding: theme.spacing(0, 0)
                  })}
                > 
                  <Box 
                    display="flex" 
                    flexDirection="column"
                    sx={(theme) => ({
                      padding: theme.spacing(2, 4)
                    })}
                  >
                    <Typography gutterBottom variant="body1" color="#804A26" fontWeight="bold">
                      {firstName} {lastName}
                    </Typography>

                    <Typography variant="body2" pt={1}>
                      {user.email}
                    </Typography>
                  </Box>

                  <Divider 
                    sx={{ 
                      borderColor: "#804A26",
                    }}
                  />
                  
                  <Box 
                    sx={(theme) => ({
                      padding: theme.spacing(1, 0)
                    })}
                  >
                    <MUILink
                      href="/favorites"
                      underline="none"
                      sx={(theme) => ({
                        display: "flex",
                        padding: theme.spacing(1.25, 2),
                        alignItems: "center",
                        color: router.pathname.startsWith("/favorites") ? "#804A26" : "inherit",
                        pointerEvents: router.pathname.startsWith("/favorites") ? "none" : "auto",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "rgba(128, 74, 38, 0.75)",
                          "& .hover-text": {
                            fontWeight: "bold",
                          }
                        },
                      })}
                      onClick={() => setToggleMenu(!toggleMenu)}
                    >
                      <Typography 
                        variant="body1" 
                        fontWeight={`${router.pathname.startsWith("/favorites") ? "bold" : "normal"}`}
                        className="hover-text"
                      >
                        Favorites
                      </Typography>
                    </MUILink>
                    
                    <MUILink
                      href="/account"
                      underline="none"
                      sx={(theme) => ({
                        display: "flex",
                        padding: theme.spacing(1.25, 2),
                        alignItems: "center",
                        color: router.pathname.startsWith("/account") ? "#804A26" : "inherit",
                        pointerEvents: router.pathname.startsWith("/account") ? "none" : "auto",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "rgba(128, 74, 38, 0.75)",
                          "& .hover-text": {
                            fontWeight: "bold",
                          }
                        },
                      })}
                      onClick={() => setToggleMenu(!toggleMenu)}
                    >
                      <Typography 
                        variant="body1"
                        fontWeight={`${router.pathname.startsWith("/account") ? "bold" : "normal"}`} 
                        className="hover-text"
                      >
                        Account
                      </Typography>
                    </MUILink>
                  </Box>
                </CardContent>
                  
                <Divider />
                
                <CardActions
                  sx={(theme) => ({
                    display: "block",
                    padding: theme.spacing(1, 0, 0, 0)
                  })}
                >
                  <MUILink
                    href="/logout"
                    underline="none"
                    sx={(theme) => ({
                      display: "flex",
                      padding: theme.spacing(1.75, 2),
                      alignItems: "center",
                      color: "inherit",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "rgba(230, 230, 230, 0.5)",
                        "& .hover-text": {
                          fontWeight: "bold",
                        }
                      },
                    })}
                    onClick={() => setToggleMenu(false)}
                  >
                    <Typography variant="body1" className="hover-text">Logout</Typography>
                  </MUILink>
                </CardActions> 
              </MenuCard>
            </MenuBox>
          </ClickAwayListener>
        }
      </StyledToolbar>
    </StyledAppBar>
  )
}

export default Navbar;