import { styled, Typography } from "@mui/material";

export const StyledAddress = styled(Typography)(({ theme }) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: "2",
  WebkitBoxOrient: "vertical",
  fontSize: "0.725rem",
  fontWeight: "bold",
  [theme.breakpoints.down('md')]: {
    maxWidth: 640,
    fontSize: "0.75rem",
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: "0.7rem"
  }
}));