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
   height: 245,
   width: "100%",
   borderTopLeftRadius: theme.shape.borderRadius,
   borderTopRightRadius: theme.shape.borderRadius,
   overflow: "hidden",
   [theme.breakpoints.down('md')]: {
      height: 265,  
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
      right: -65,
      padding: "0.5rem 0.725rem",
      marginLeft: 0,
      marginBottom: 0,
  },
  [theme.breakpoints.down('sm')]: {
      top: -55,
      right: 10, 
  }
}));