import { Box, Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledStack = styled(Stack)(({ theme }) => ({
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
   height: 250,
   width: "100%",
   borderTopLeftRadius: theme.shape.borderRadius,
   borderTopRightRadius: theme.shape.borderRadius,
   overflow: "hidden",
   [theme.breakpoints.down('md')]: {
      height: 285,  
   },
   [theme.breakpoints.down('sm')]: {
      height: 300,  
   }
}));

export const StyledAddressTypography = styled(Typography)(() => ({
   textAlign: "right",
   display: "flex", 
   alignItems: "flex-start", 
   justifyContent: "space-between",
   gap: "18px"
}));

export const CloseButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  top: 0,
  right: -65,
  minWidth: 0,
  padding: "0.5rem 0.725rem",
  [theme.breakpoints.down('sm')]: {
      top: -60,
      right: 10, 
  }
}));