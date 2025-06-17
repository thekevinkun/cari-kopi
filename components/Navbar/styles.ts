import { AppBar, Box, Button, Card, Link, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledAppBar = styled(AppBar)(() => ({
  background: "#804A26",
}));

export const StyledToolbar = styled(Toolbar)(() => ({
  display: "flex",
  justifyContent: "space-between",
}));

export const StyledTitleTypography = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    fontSize: "1.25rem"
  }
}));

export const WhiteOutlinedButton = styled(Button)(({ theme }) => ({
  color: "#fff",
  borderColor: "#fff",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "#fff",
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.35, 1.35),
    fontSize: "0.75rem",
  }
}));

export const MenuButton = styled(Button)(({ theme }) => ({
  color: "#fff",
  borderColor: "#fff",
  minWidth: 54,
  padding: theme.spacing(0.15, 0.45),
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "#fff",
  },
}));

export const MenuBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 52,
  right: 24,
  zIndex: 9999,
  [theme.breakpoints.down('sm')]: {
    right: 16,
  }
}));

export const MenuCard = styled(Card)(({ theme }) => ({
  background: "#fff",
  boxShadow:
    "0px 4px 16px rgba(0, 0, 0, 0.08), 0px 8px 32px rgba(0, 0, 0, 0.08)",
}));