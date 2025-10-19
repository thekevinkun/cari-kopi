import { Box, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledStack = styled(Stack)(({ theme }) => ({
  display: "flex",
  flexDirection: "column-reverse",
  [theme.breakpoints.down("md")]: {
    position: "fixed",
    left: 0,
    bottom: 0,
    zIndex: 9999,
    maxWidth: 420,
    padding: 0,
  },
  [theme.breakpoints.down("sm")]: {
    width: "100vw",
    maxWidth: "100vw",
  },
}));

export const StyledBoxImage = styled(Box)(({ theme }) => ({
  height: 230,
  width: "100%",
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    height: 255,
  },
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
};
