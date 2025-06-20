import { Box, Button, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledStack = styled(Stack)(({ theme }) => ({
   display: "flex",
   flexDirection: "column-reverse",
   [theme.breakpoints.down('md')]: {
    position: "absolute",
    left: 0,
    bottom: 0,
    zIndex: 9999,
    maxWidth: 420,
    padding: 0
   },
   [theme.breakpoints.down('sm')]: {
      width: "100%",
      maxWidth: "100%",
   }
}));

export const StyledBoxImage = styled(Box)(({ theme }) => ({
   height: 225,
   width: "100%",
   borderTopLeftRadius: theme.shape.borderRadius,
   borderTopRightRadius: theme.shape.borderRadius,
   overflow: "hidden",
   [theme.breakpoints.down('md')]: {
      height: 255,  
   }
}));

export const CloseButton = styled(Button)(({ theme }) => ({
  width: "fit-content",
  minWidth: 0,
  marginLeft: "auto",
  marginBottom: "0.5rem",
  padding: "0.325rem 0.45rem",
  [theme.breakpoints.down('md')]: {
      position: "absolute",
      top: 0,
      right: -50,
      marginLeft: 0,
      marginBottom: 0,
  },
  [theme.breakpoints.down('sm')]: {
      top: -45,
      right: 10, 
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