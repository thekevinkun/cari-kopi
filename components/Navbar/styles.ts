import { AppBar, Button, Toolbar, Typography } from "@mui/material";
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