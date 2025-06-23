import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledStack = styled(Stack)(({ theme }) => ({
  height: 280,
  [theme.breakpoints.down('md')]: {
    position: "absolute",
    right: 0,
    bottom: 0,
    zIndex: 9999,
    height: 265,
    maxWidth: 365,
    padding: 0
  },
  [theme.breakpoints.down('sm')]: {
    top: 0,
    bottom: "unset",
    height: 195,
    width: "100%",
    maxWidth: "100%",
  }
}));

export const scrollStyle = {
  overflowY: "auto",
  scrollbarWidth: "thin",
  scrollbarColor: "#804A26 transparent",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#804A26",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
}