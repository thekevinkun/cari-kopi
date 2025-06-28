import { Paper, styled, Typography } from "@mui/material";

export const StyledPaper = styled(Paper)(() => ({
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  width: "150px",
}));

export const StyledCoffeeMapTypography = styled(Typography)(() => ({
  fontSize: "2.5rem",
  textOverflow: "ellipsis",
  WebkitLineClamp: "2",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
}));
