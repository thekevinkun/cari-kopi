import { Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledStack = styled(Stack)(({ theme }) => ({
   height: "100%", 
   overflow: "auto",
   [theme.breakpoints.down('md')]: {
    display: "none",
   }
}));

export const StyledSecondTypography = styled(Typography)(() => ({
   display: "flex", 
   alignItems: "center", 
   justifyContent: "space-between"
}));