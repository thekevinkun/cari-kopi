import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/UserContext";
import {
  Box,
  CardActions,
  CardContent,
  ClickAwayListener,
  Divider,
  Link as MUILink,
  Typography,
  useMediaQuery,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

import {
  StyledAppBar,
  StyledToolbar,
  StyledTitleTypography,
  MenuButton,
  MenuBox,
  MenuCard,
  WhiteOutlinedButton,
} from "./styles";

import { getGreeting } from "@/utils/helpers";

const Navbar = () => {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user, loading } = useUser();
  const [toggleMenu, setToggleMenu] = useState(false);

  const isTablet = useMediaQuery("(max-width: 900px)");
  const isMobile = useMediaQuery("(max-width: 600px)");

  const firstName = user?.name?.split(" ")[0];
  const lastName = user?.name?.split(" ")[1];

  const greeting = getGreeting(new Date().getHours());

  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <MUILink href="/" underline="none" sx={{ color: "inherit" }}>
          <StyledTitleTypography variant="h5">Carikopi</StyledTitleTypography>
        </MUILink>

        {!loading && (
          <>
            {user && (
              <Typography
                component="h1"
                variant={isMobile ? "body2" : "body1"}
                sx={{
                  marginLeft: isMobile ? "auto" : "unset",
                  paddingRight: isMobile ? 1.5 : 0,
                }}
              >
                {greeting},{" "}
                <Typography
                  component="span"
                  variant={isMobile ? "body2" : "body1"}
                  sx={{
                    fontWeight: 700,
                    display: isMobile ? "block" : "inline",
                  }}
                >
                  {firstName}
                </Typography>
              </Typography>
            )}

            <Box display="flex">
              {user ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <MenuButton
                    ref={buttonRef}
                    variant="outlined"
                    onClick={() => setToggleMenu((prev) => !prev)}
                  >
                    <PersonIcon
                      sx={{ fontSize: isMobile ? "1.55rem" : "1.75rem" }}
                    />
                  </MenuButton>
                </Box>
              ) : (
                <MUILink href="/login">
                  <WhiteOutlinedButton variant="outlined">
                    Login
                  </WhiteOutlinedButton>
                </MUILink>
              )}
            </Box>
          </>
        )}

        {user && toggleMenu && (
          <ClickAwayListener
            onClickAway={(event) => {
              if (
                buttonRef.current &&
                buttonRef.current.contains(event.target as Node)
              ) {
                return; // don't close if the click is on the button
              }
              setToggleMenu(false);
            }}
          >
            <MenuBox>
              <MenuCard>
                <CardContent
                  sx={(theme) => ({
                    padding: theme.spacing(0, 0),
                  })}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    sx={(theme) => ({
                      padding: theme.spacing(2, 4),
                      [theme.breakpoints.down("sm")]: {
                        padding: theme.spacing(2, 3),
                      },
                    })}
                  >
                    <Typography
                      gutterBottom
                      variant="body1"
                      color="#804A26"
                      fontWeight="bold"
                    >
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
                      padding: theme.spacing(1, 0),
                    })}
                  >
                    {isTablet && (
                      <MUILink
                        href="/favorites"
                        underline="none"
                        sx={(theme) => ({
                          display: "flex",
                          padding: theme.spacing(1.25, 2),
                          alignItems: "center",
                          color: router.pathname.startsWith("/favorites")
                            ? "#804A26"
                            : "inherit",
                          pointerEvents: router.pathname.startsWith(
                            "/favorites"
                          )
                            ? "none"
                            : "auto",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "rgba(128, 74, 38, 0.75)",
                            "& .hover-text": {
                              fontWeight: "bold",
                            },
                          },
                        })}
                        onClick={() => setToggleMenu((prev) => !prev)}
                      >
                        <Typography
                          variant="body1"
                          fontWeight={`${
                            router.pathname.startsWith("/favorites")
                              ? "bold"
                              : "normal"
                          }`}
                          className="hover-text"
                        >
                          Favorites
                        </Typography>
                      </MUILink>
                    )}

                    <MUILink
                      href="/account"
                      underline="none"
                      sx={(theme) => ({
                        display: "flex",
                        padding: theme.spacing(1.25, 2),
                        alignItems: "center",
                        color: router.pathname.startsWith("/account")
                          ? "#804A26"
                          : "inherit",
                        pointerEvents: router.pathname.startsWith("/account")
                          ? "none"
                          : "auto",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "rgba(128, 74, 38, 0.75)",
                          "& .hover-text": {
                            fontWeight: "bold",
                          },
                        },
                      })}
                      onClick={() => setToggleMenu((prev) => !prev)}
                    >
                      <Typography
                        variant="body1"
                        fontWeight={`${
                          router.pathname.startsWith("/account")
                            ? "bold"
                            : "normal"
                        }`}
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
                    padding: theme.spacing(1, 0, 0, 0),
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
                        },
                      },
                    })}
                    onClick={() => setToggleMenu(false)}
                  >
                    <Typography variant="body1" className="hover-text">
                      Logout
                    </Typography>
                  </MUILink>
                </CardActions>
              </MenuCard>
            </MenuBox>
          </ClickAwayListener>
        )}
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar;
