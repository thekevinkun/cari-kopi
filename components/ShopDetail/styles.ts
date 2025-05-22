import { Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledStack = styled(Stack)(() => ({
   height: "70vh", 
   overflow: "auto"
}));

export const StyledSecondTypography = styled(Typography)(() => ({
   display: "flex", 
   alignItems: "center", 
   justifyContent: "space-between"
}));
