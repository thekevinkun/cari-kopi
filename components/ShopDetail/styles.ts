import { Box, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledStack = styled(Stack)(({ theme }) => ({
   [theme.breakpoints.down('md')]: {
    display: "none",
   }
}));

export const StyledBoxImage = styled(Box)(({ theme }) => ({
   height: 250,
   width: "100%",
   borderTopLeftRadius: theme.shape.borderRadius,
   borderTopRightRadius: theme.shape.borderRadius,
   overflow: "hidden",
}));

export const StyledSecondTypography = styled(Typography)(() => ({
   display: "flex", 
   alignItems: "center", 
   justifyContent: "space-between"
}));